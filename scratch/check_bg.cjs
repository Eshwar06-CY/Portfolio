const { spawn } = require('child_process');
const http = require('http');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9225', '--no-sandbox', 'about:blank']);
  await new Promise(r => setTimeout(r, 1000));
  const targets = await getJson('http://localhost:9225/json');
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, curId, method, params }));
  });

  await send('Page.navigate', { url: 'http://localhost:5173/' });
  
  // Wait for enter button
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const btn = await send('Runtime.evaluate', {
      expression: `!!(document.querySelector('.intro-enter-btn') || Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ENTER') || x.textContent.includes('EXPERIENCE')))`
    });
    if (btn.result?.value) break;
  }

  await send('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('.intro-enter-btn') || Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ENTER') || x.textContent.includes('EXPERIENCE'));
      if (b) b.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 3500));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const a = document.getElementById('about');
      const h = document.getElementById('hero');
      const m = document.querySelector('main');
      const body = document.body;
      const html = document.documentElement;
      return {
        aboutBg: a ? window.getComputedStyle(a).backgroundColor : null,
        heroBg: h ? window.getComputedStyle(h).backgroundColor : null,
        mainBg: m ? window.getComputedStyle(m).backgroundColor : null,
        bodyBg: window.getComputedStyle(body).backgroundColor,
        htmlBg: window.getComputedStyle(html).backgroundColor
      };
    })()`,
    returnByValue: true
  });

  console.log('COMPUTED BACKGROUNDS AFTER ENTER:', res.result?.value);
  proc.kill();
  process.exit(0);
}

run();
