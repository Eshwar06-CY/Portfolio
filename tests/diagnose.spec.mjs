import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Diagnose portfolio visibility and stacking', async ({ page }) => {
  const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleLogs.push({ type: 'pageerror', text: err.message }));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait 1 second for initial animations
  await page.waitForTimeout(1000);

  // Capture Hero
  await page.screenshot({ path: path.join(scratchDir, 'step1_hero.png') });

  // Evaluate all sections
  const report = await page.evaluate(() => {
    const sections = [
      { name: 'hero', selector: '#hero' },
      { name: 'about', selector: '#about' },
      { name: 'work', selector: '#work' },
      { name: 'experience', selector: '#experience' },
      { name: 'expertise', selector: '#expertise' },
      { name: 'contact', selector: '#contact' }
    ];

    const results = {};
    for (const sec of sections) {
      const el = document.querySelector(sec.selector);
      if (!el) {
        results[sec.name] = { exists: false };
        continue;
      }
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      
      // Also check key inner elements
      const innerInfo = {};
      if (sec.name === 'hero') {
        const title = el.querySelector('.hero-title');
        const portrait = el.querySelector('.hero-portrait-stage');
        const content = el.querySelector('.hero-content');
        innerInfo.title = title ? {
          text: title.textContent.trim(),
          rect: title.getBoundingClientRect(),
          opacity: window.getComputedStyle(title).opacity,
          visibility: window.getComputedStyle(title).visibility,
          transform: window.getComputedStyle(title).transform,
          clipPath: window.getComputedStyle(title).clipPath
        } : null;
        innerInfo.portrait = portrait ? {
          rect: portrait.getBoundingClientRect(),
          opacity: window.getComputedStyle(portrait).opacity,
          visibility: window.getComputedStyle(portrait).visibility
        } : null;
        innerInfo.content = content ? {
          opacity: window.getComputedStyle(content).opacity,
          transform: window.getComputedStyle(content).transform
        } : null;
      } else if (sec.name === 'about') {
        const heading = el.querySelector('.asymmetric-statement');
        const whoIAm = el.querySelector('.who-i-am-moment');
        innerInfo.heading = heading ? {
          text: heading.textContent.trim().substring(0, 40),
          rect: heading.getBoundingClientRect(),
          opacity: window.getComputedStyle(heading).opacity,
          visibility: window.getComputedStyle(heading).visibility,
          transform: window.getComputedStyle(heading).transform
        } : null;
        innerInfo.whoIAm = whoIAm ? {
          rect: whoIAm.getBoundingClientRect(),
          opacity: window.getComputedStyle(whoIAm).opacity,
          visibility: window.getComputedStyle(whoIAm).visibility
        } : null;
      } else if (sec.name === 'work') {
        const h2 = el.querySelector('.work-monumental-heading');
        innerInfo.heading = h2 ? {
          text: h2.textContent.trim(),
          rect: h2.getBoundingClientRect(),
          opacity: window.getComputedStyle(h2).opacity,
          visibility: window.getComputedStyle(h2).visibility
        } : null;
      }

      results[sec.name] = {
        exists: true,
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height, width: rect.width },
        computedStyle: {
          display: style.display,
          opacity: style.opacity,
          visibility: style.visibility,
          position: style.position,
          zIndex: style.zIndex,
          transform: style.transform,
          backgroundColor: style.backgroundColor
        },
        innerInfo
      };
    }

    // Check canvas
    const canvasEl = document.querySelector('.global-cinematic-webgl-canvas');
    const canvasStyle = canvasEl ? window.getComputedStyle(canvasEl) : null;
    const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : null;

    // Check homepage-main
    const mainEl = document.querySelector('.homepage-main');
    const mainStyle = mainEl ? window.getComputedStyle(mainEl) : null;
    const mainRect = mainEl ? mainEl.getBoundingClientRect() : null;

    // Check page transition wrapper
    const ptEl = document.querySelector('.page-transition-container');
    const ptStyle = ptEl ? window.getComputedStyle(ptEl) : null;

    return {
      bodyHeight: document.body.scrollHeight,
      windowHeight: window.innerHeight,
      canvas: canvasEl ? {
        rect: canvasRect,
        zIndex: canvasStyle.zIndex,
        position: canvasStyle.position,
        opacity: canvasStyle.opacity
      } : null,
      main: mainEl ? {
        rect: mainRect,
        zIndex: mainStyle.zIndex,
        position: mainStyle.position,
        opacity: mainStyle.opacity,
        transform: mainStyle.transform
      } : null,
      pageTransition: ptEl ? {
        zIndex: ptStyle.zIndex,
        position: ptStyle.position,
        opacity: ptStyle.opacity,
        transform: ptStyle.transform
      } : null,
      sections: results
    };
  });

  fs.writeFileSync(path.join(scratchDir, 'initial_report.json'), JSON.stringify(report, null, 2));

  // Now scroll through the page step by step and capture screenshots and elementFromPoint
  const scrollSteps = [
    { name: 'step2_about', scrollY: 1000 },
    { name: 'step3_exploring', scrollY: 1800 },
    { name: 'step4_work', scrollY: 2800 },
    { name: 'step5_reel_p1', scrollY: 3800 },
    { name: 'step6_experience', scrollY: 6000 },
    { name: 'step7_expertise', scrollY: 7500 },
    { name: 'step8_contact', scrollY: 9000 }
  ];

  const scrollResults = [];

  for (const step of scrollSteps) {
    await page.evaluate((y) => {
      window.scrollTo(0, y);
      if (window.lenis) {
        window.lenis.scrollTo(y, { immediate: true });
      }
    }, step.scrollY);

    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(scratchDir, `${step.name}.png`) });

    const stepInfo = await page.evaluate((stepName) => {
      const elCenter = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      return {
        step: stepName,
        scrollY: window.scrollY,
        elementCenterTag: elCenter ? elCenter.tagName : null,
        elementCenterClass: elCenter ? elCenter.className : null,
        elementCenterId: elCenter ? elCenter.id : null,
        visibleTextSnippet: document.body.innerText.substring(0, 300).replace(/\n+/g, ' ')
      };
    }, step.name);

    scrollResults.push(stepInfo);
  }

  fs.writeFileSync(path.join(scratchDir, 'scroll_report.json'), JSON.stringify({ scrollResults, consoleLogs }, null, 2));
});
