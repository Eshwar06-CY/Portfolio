import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://localhost:5174/'
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2000));

    const versionRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await versionRes.json();
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) {
      console.error('No page target found');
      return;
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    console.log('Connected to CDP');
    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Polling for enter button...');
    let clicked = false;
    for (let i = 0; i < 20; i++) {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('.intro-enter-btn');
          if (btn) {
            btn.click();
            return 'clicked';
          }
          const initText = document.querySelector('.intro-init-block')?.textContent;
          return 'waiting: ' + (initText || 'none');
        })()`,
        returnByValue: true
      });
      console.log(`Poll ${i}:`, res.result?.value);
      if (res.result?.value === 'clicked') {
        clicked = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!clicked) {
      console.log('Button not found via poll, attempting keyboard Enter');
      await send('Runtime.evaluate', {
        expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }))`
      });
    }

    // Wait 3.5s for dissolution transition into Hero
    await new Promise((r) => setTimeout(r, 4000));

    // Scroll directly to #work
    const scrollRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const work = document.querySelector('#work');
        if (!work) return 'No #work';
        work.scrollIntoView();
        return 'Scrolled to #work';
      })()`,
      returnByValue: true
    });
    console.log('Scroll to work result:', scrollRes.result?.value);
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Viewport 1440x900 - Slide 02 (ExpenseFlowAI)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const reel = document.querySelector('.project-reel-container');
        const stList = window.ScrollTrigger ? window.ScrollTrigger.getAll() : [];
        const reelSt = stList.find(s => s.trigger === reel);
        if (reelSt) {
          reelSt.scroll(reelSt.start + (reelSt.end - reelSt.start) * 0.38);
        }
      })()`
    });
    await new Promise((r) => setTimeout(r, 2000));

    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:/Antigravity_Projects/Portfolio/expenseflow_composition.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved expenseflow_composition.png (1440x900)');

    // 2. Viewport 1440x900 - Slide 03 (AI UG Academic Planner)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const reel = document.querySelector('.project-reel-container');
        const stList = window.ScrollTrigger ? window.ScrollTrigger.getAll() : [];
        const reelSt = stList.find(s => s.trigger === reel);
        if (reelSt) {
          reelSt.scroll(reelSt.start + (reelSt.end - reelSt.start) * 0.68);
        }
      })()`
    });
    await new Promise((r) => setTimeout(r, 2000));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:/Antigravity_Projects/Portfolio/academic_planner_composition.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved academic_planner_composition.png (1440x900)');

    // Inspect layout of Slide 03
    const layoutDetails = await send('Runtime.evaluate', {
      expression: `(() => {
        const slide3 = document.querySelector('.reel-slide-3');
        if (!slide3) return 'No slide 3 found';
        const contentFrame = slide3.querySelector('.slide-content-frame');
        const editorialCol = slide3.querySelector('.slide-editorial-col');
        const visualFrame = slide3.querySelector('.slide-visual-frame');
        const title = slide3.querySelector('.slide-project-title');
        const tagline = slide3.querySelector('.slide-tagline-text');
        const desc = slide3.querySelector('.slide-description-text');
        const pills = Array.from(slide3.querySelectorAll('.slide-tech-pill')).map(p => p.textContent.trim());
        const actionLink = slide3.querySelector('.editorial-action-link');

        const frameRect = contentFrame?.getBoundingClientRect();
        const editRect = editorialCol?.getBoundingClientRect();
        const visRect = visualFrame?.getBoundingClientRect();

        return {
          compClass: slide3.className,
          frameWidth: Math.round(frameRect?.width || 0),
          editCol: {
            left: Math.round(editRect?.left || 0),
            width: Math.round(editRect?.width || 0),
            percent: Math.round(((editRect?.width || 0) / (frameRect?.width || 1)) * 100) + '%'
          },
          visCol: {
            left: Math.round(visRect?.left || 0),
            width: Math.round(visRect?.width || 0),
            percent: Math.round(((visRect?.width || 0) / (frameRect?.width || 1)) * 100) + '%'
          },
          titleText: title?.textContent?.trim(),
          titleAlign: window.getComputedStyle(title).textAlign,
          taglineText: tagline?.textContent?.trim(),
          descText: desc?.textContent?.trim(),
          techPills: pills,
          actionText: actionLink?.textContent?.trim(),
          actionHref: actionLink?.href
        };
      })()`,
      returnByValue: true
    });
    console.log('Academic Planner 1440x900 Layout:', JSON.stringify(layoutDetails.result?.value, null, 2));

    // Test 1280x800
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise((r) => setTimeout(r, 1000));
    const shot1280 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:/Antigravity_Projects/Portfolio/academic_planner_1280.png', Buffer.from(shot1280.data, 'base64'));
    console.log('Saved academic_planner_1280.png');

    // Test 1024x768
    await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false });
    await new Promise((r) => setTimeout(r, 1000));
    const shot1024 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:/Antigravity_Projects/Portfolio/academic_planner_1024.png', Buffer.from(shot1024.data, 'base64'));
    console.log('Saved academic_planner_1024.png');

    // Test 820x1180 (Tablet)
    await send('Emulation.setDeviceMetricsOverride', { width: 820, height: 1180, deviceScaleFactor: 1, mobile: false });
    await new Promise((r) => setTimeout(r, 1000));
    const shot820 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('d:/Antigravity_Projects/Portfolio/academic_planner_820.png', Buffer.from(shot820.data, 'base64'));
    console.log('Saved academic_planner_820.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
