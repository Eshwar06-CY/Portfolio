import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  console.log('1. Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // Clear sessionStorage if any to test fresh load
  await page.evaluate(() => {
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  console.log('2. Verifying loading screen state...');
  await page.waitForTimeout(1000);

  const introVisible = await page.evaluate(() => {
    const intro = document.querySelector('.cinematic-intro-root');
    const video = document.querySelector('.scroll-scrubbed-video-layer');
    const hero = document.querySelector('.hero-section-root');
    const canvas = document.querySelector('.global-cinematic-webgl-canvas');

    return {
      hasIntro: !!intro,
      introOpacity: intro ? window.getComputedStyle(intro).opacity : null,
      videoOpacity: video ? window.getComputedStyle(video).opacity : null,
      videoVisibility: video ? window.getComputedStyle(video).visibility : null,
      heroVisible: hero ? window.getComputedStyle(hero).visibility : null,
      canvasOpacity: canvas ? window.getComputedStyle(canvas).opacity : null,
      canvasVisibility: canvas ? window.getComputedStyle(canvas).visibility : null,
      bodyOverflow: window.getComputedStyle(document.body).overflow
    };
  });
  console.log('Initial Loading State:', introVisible);

  await page.screenshot({ path: 'tests/screenshots/phase9_01_loading.png' });

  // 3. Test Scroll Lock during loading
  console.log('3. Testing scroll lock during loading...');
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(300);
  const scrollYDuringLoading = await page.evaluate(() => window.scrollY);
  console.log('ScrollY during loading after wheel attempt:', scrollYDuringLoading);

  // 4. Wait for SYSTEM READY
  console.log('4. Waiting for SYSTEM READY...');
  await page.waitForSelector('.intro-enter-btn', { timeout: 12000 });
  await page.waitForTimeout(500);

  const readyState = await page.evaluate(() => {
    const btn = document.querySelector('.intro-enter-btn');
    const heading = document.querySelector('.intro-monumental-heading');
    return {
      hasBtn: !!btn,
      btnText: btn ? btn.innerText.trim() : null,
      headingText: heading ? heading.innerText.trim() : null
    };
  });
  console.log('Ready State:', readyState);
  await page.screenshot({ path: 'tests/screenshots/phase9_02_system_ready.png' });

  // 5. Click ENTER EXPERIENCE
  console.log('5. Clicking ENTER EXPERIENCE...');
  await page.click('.intro-enter-btn');

  // Capture midpoint of entering transition
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/screenshots/phase9_03_entering_transition.png' });

  // 6. Wait for transition to complete (3.2s) and Hero to reveal
  console.log('6. Waiting for Hero to reveal...');
  await page.waitForTimeout(3500);
  await page.waitForSelector('#hero', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1500);

  const heroState = await page.evaluate(() => {
    const intro = document.querySelector('.cinematic-intro-root');
    const videoLayer = document.querySelector('.scroll-scrubbed-video-layer');
    const video = videoLayer ? videoLayer.querySelector('video') : null;
    const hero = document.querySelector('#hero');
    const canvas = document.querySelector('.global-cinematic-webgl-canvas');

    return {
      hasIntroInDOM: !!intro,
      videoOpacity: videoLayer ? window.getComputedStyle(videoLayer).opacity : null,
      videoVisibility: videoLayer ? window.getComputedStyle(videoLayer).visibility : null,
      videoPaused: video ? video.paused : null,
      videoCurrentTime: video ? video.currentTime : null,
      heroOpacity: hero ? window.getComputedStyle(hero).opacity : null,
      heroVisibility: hero ? window.getComputedStyle(hero).visibility : null,
      canvasOpacity: canvas ? window.getComputedStyle(canvas).opacity : null
    };
  });
  console.log('Hero Revealed State:', heroState);
  await page.screenshot({ path: 'tests/screenshots/phase9_04_hero_revealed.png' });

  // 7. Verify video continuous playback (does not stick)
  console.log('7. Verifying video continuous playback in Hero...');
  const t1 = await page.evaluate(() => {
    const video = document.querySelector('.scroll-scrubbed-video-layer video');
    return video ? video.currentTime : 0;
  });
  await page.waitForTimeout(1000);
  const t2 = await page.evaluate(() => {
    const video = document.querySelector('.scroll-scrubbed-video-layer video');
    return video ? video.currentTime : 0;
  });
  console.log(`Video playback progress: t1=${t1.toFixed(2)}s, t2=${t2.toFixed(2)}s, playing=${t2 > t1}`);

  // 8. Test scrolling toward About
  console.log('8. Scrolling toward About section...');
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'smooth' });
  });
  await page.waitForTimeout(1200);

  const aboutState = await page.evaluate(() => {
    const video = document.querySelector('.scroll-scrubbed-video-layer video');
    return {
      scrollY: window.scrollY,
      videoPaused: video ? video.paused : null,
      videoCurrentTime: video ? video.currentTime : null
    };
  });
  console.log('About Section State:', aboutState);
  await page.screenshot({ path: 'tests/screenshots/phase9_05_about_section.png' });

  // Verify video CONTINUES PLAYING when scrolling stops
  await page.waitForTimeout(1000);
  const t3 = await page.evaluate(() => {
    const video = document.querySelector('.scroll-scrubbed-video-layer video');
    return video ? video.currentTime : 0;
  });
  console.log(`Video playing after scrolling stopped in About: t2=${aboutState.videoCurrentTime?.toFixed(2)}s, t3=${t3.toFixed(2)}s, playing=${t3 > (aboutState.videoCurrentTime || 0)}`);

  console.log('Console Errors:', consoleErrors);

  await browser.close();
  console.log('Test completed successfully!');
}

runTest().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
