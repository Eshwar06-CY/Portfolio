import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function runPhase9CTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('1. Loading portfolio...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  // 1. Verify loading state isolation
  await page.waitForTimeout(600);
  const loadingIsolation = await page.evaluate(() => {
    const videoLayer = document.querySelector('.scroll-scrubbed-video-layer');
    return {
      layerOpacity: videoLayer ? window.getComputedStyle(videoLayer).opacity : null,
      layerVisibility: videoLayer ? window.getComputedStyle(videoLayer).visibility : null
    };
  });
  console.log('Loading Screen Video Isolation:', loadingIsolation);

  // 2. Enter experience
  await page.waitForSelector('.intro-enter-btn', { timeout: 12000 });
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(3800);
  await page.waitForSelector('#hero', { state: 'visible', timeout: 10000 });
  console.log('Hero entered successfully.');

  // Helper to get active playing video status
  const getVideoStatus = async () => {
    return await page.evaluate(() => {
      const videos = document.querySelectorAll('.scroll-scrubbed-video-layer video');
      if (!videos || videos.length === 0) return null;
      const vA = videos[0];
      const vB = videos[1];
      const opA = parseFloat(window.getComputedStyle(vA).opacity);
      const opB = parseFloat(window.getComputedStyle(vB).opacity);
      const activeVid = opA >= opB ? vA : vB;
      const standbyVid = opA >= opB ? vB : vA;
      return {
        activeSlot: opA >= opB ? 'A' : 'B',
        activeOpacity: Math.max(opA, opB),
        activePaused: activeVid.paused,
        activeTime: activeVid.currentTime,
        standbyPaused: standbyVid.paused,
        standbyTime: standbyVid.currentTime,
        scrollY: window.scrollY
      };
    });
  };

  // 3. Test Stationary Continuous Playback in Hero
  console.log('3. Testing stationary continuous playback in HERO...');
  const heroT1 = await getVideoStatus();
  await page.waitForTimeout(1200);
  const heroT2 = await getVideoStatus();
  console.log(`Hero stationary playback: t1=${heroT1.activeTime.toFixed(2)}s, t2=${heroT2.activeTime.toFixed(2)}s, playing=${heroT2.activeTime > heroT1.activeTime}`);

  // 4. Test Slow Scroll to About
  console.log('4. Testing slow scroll to About...');
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);
  const aboutStatus = await getVideoStatus();
  console.log(`About section active: scrollY=${aboutStatus.scrollY}, activeTime=${aboutStatus.activeTime.toFixed(2)}s, playing=${!aboutStatus.activePaused}`);
  await page.screenshot({ path: 'tests/screenshots/phase9c_01_about.png' });

  // Verify stationary playback in About
  await page.waitForTimeout(1000);
  const aboutT2 = await getVideoStatus();
  console.log(`About stationary playback: t1=${aboutStatus.activeTime.toFixed(2)}s, t2=${aboutT2.activeTime.toFixed(2)}s, playing=${aboutT2.activeTime > aboutStatus.activeTime}`);

  // 5. Test FAST SCROLL: About -> Selected Work (Skipping Exploring)
  console.log('5. Testing FAST SCROLL: About -> Work (skipping Exploring)...');
  await page.evaluate(() => {
    // Jump rapidly down to Work (e.g. scrollY 4200)
    window.scrollTo({ top: 4200, behavior: 'instant' });
  });
  await page.waitForTimeout(400); // allow settle
  const workStatus = await getVideoStatus();
  console.log(`Work section active after fast scroll: scrollY=${workStatus.scrollY}, activeTime=${workStatus.activeTime.toFixed(2)}s (Target Range 18–28s)`);
  await page.screenshot({ path: 'tests/screenshots/phase9c_02_work.png' });

  // Verify stationary playback in Work
  await page.waitForTimeout(1200);
  const workT2 = await getVideoStatus();
  console.log(`Work stationary playback: t1=${workStatus.activeTime.toFixed(2)}s, t2=${workT2.activeTime.toFixed(2)}s, playing=${workT2.activeTime > workStatus.activeTime}`);

  // 6. Test FAST SCROLL UPWARD: Work -> Hero (Skipping Exploring and About)
  console.log('6. Testing FAST SCROLL UPWARD: Work -> Hero...');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const returnHeroStatus = await getVideoStatus();
  console.log(`Hero active after fast scroll up: scrollY=${returnHeroStatus.scrollY}, activeTime=${returnHeroStatus.activeTime.toFixed(2)}s (Target Range 0.5–8s)`);
  await page.screenshot({ path: 'tests/screenshots/phase9c_03_hero_returned.png' });

  // 7. Verify continuous playback back in Hero
  await page.waitForTimeout(1200);
  const returnHeroT2 = await getVideoStatus();
  console.log(`Returned Hero stationary playback: t1=${returnHeroStatus.activeTime.toFixed(2)}s, t2=${returnHeroT2.activeTime.toFixed(2)}s, playing=${returnHeroT2.activeTime > returnHeroStatus.activeTime}`);

  console.log('Console Errors:', consoleErrors);

  await browser.close();
  console.log('Phase 9C Test completed successfully!');
}

runPhase9CTest().catch(err => {
  console.error(err);
  process.exit(1);
});
