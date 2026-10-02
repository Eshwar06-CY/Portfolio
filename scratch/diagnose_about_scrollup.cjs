const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  const errors = [];
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]:', err);
    errors.push(err.toString());
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(600);
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(4000);

  console.log('=== HERO SETTLED ===');
  let vHero = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = layer ? layer.querySelectorAll('video')[0] : null;
    const vB = layer ? layer.querySelectorAll('video')[1] : null;
    return {
      layerStyle: layer ? {
        opacity: getComputedStyle(layer).opacity,
        visibility: getComputedStyle(layer).visibility,
        zIndex: getComputedStyle(layer).zIndex
      } : null,
      vA: vA ? { currentTime: vA.currentTime, paused: vA.paused, opacity: getComputedStyle(vA).opacity, zIndex: getComputedStyle(vA).zIndex } : null,
      vB: vB ? { currentTime: vB.currentTime, paused: vB.paused, opacity: getComputedStyle(vB).opacity, zIndex: getComputedStyle(vB).zIndex } : null,
    };
  });
  console.log('Hero video:', vHero);

  console.log('=== SCROLL DOWN TO WORK ===');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'auto' });
  });
  await page.waitForTimeout(1500);

  let vWork = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = layer ? layer.querySelectorAll('video')[0] : null;
    const vB = layer ? layer.querySelectorAll('video')[1] : null;
    return {
      scrollY: window.scrollY,
      vA: vA ? { currentTime: vA.currentTime, paused: vA.paused, opacity: getComputedStyle(vA).opacity, zIndex: getComputedStyle(vA).zIndex } : null,
      vB: vB ? { currentTime: vB.currentTime, paused: vB.paused, opacity: getComputedStyle(vB).opacity, zIndex: getComputedStyle(vB).zIndex } : null,
    };
  });
  console.log('Work video:', vWork);

  console.log('=== SCROLL BACK UP TO ABOUT ===');
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);

  const diag = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = layer ? layer.querySelectorAll('video')[0] : null;
    const vB = layer ? layer.querySelectorAll('video')[1] : null;

    // Hit test at center of screen
    const hitElements = [];
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.body && el !== document.documentElement) {
      hitElements.push({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        bg: getComputedStyle(el).backgroundColor,
        bgImg: getComputedStyle(el).backgroundImage,
        opacity: getComputedStyle(el).opacity,
        zIndex: getComputedStyle(el).zIndex
      });
      el = el.parentElement;
    }

    const canvas = document.querySelector('.global-cinematic-webgl-canvas');

    return {
      scrollY: window.scrollY,
      layer: layer ? {
        opacity: getComputedStyle(layer).opacity,
        visibility: getComputedStyle(layer).visibility,
        zIndex: getComputedStyle(layer).zIndex,
        display: getComputedStyle(layer).display
      } : null,
      canvas: canvas ? {
        opacity: getComputedStyle(canvas).opacity,
        visibility: getComputedStyle(canvas).visibility,
        zIndex: getComputedStyle(canvas).zIndex,
      } : null,
      vA: vA ? { currentTime: vA.currentTime, paused: vA.paused, opacity: getComputedStyle(vA).opacity, zIndex: getComputedStyle(vA).zIndex } : null,
      vB: vB ? { currentTime: vB.currentTime, paused: vB.paused, opacity: getComputedStyle(vB).opacity, zIndex: getComputedStyle(vB).zIndex } : null,
      hitElements
    };
  });

  console.log('About Diagnostic Result:\n', JSON.stringify(diag, null, 2));

  await page.screenshot({ path: 'scratch/about_scrollup_result.png' });
  console.log('Saved scratch/about_scrollup_result.png');

  await browser.close();
})();
