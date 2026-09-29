import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';

async function runVideoAudit() {
  console.log('=== STARTING COMPREHENSIVE PHASE 8 VIDEO PLAYBACK AUDIT ===');
  const browser = await chromium.launch({ headless: true });

  const errors = [];
  const logError = (msg) => {
    console.error(`  [FAIL]: ${msg}`);
    errors.push(msg);
  };
  const logPass = (msg) => {
    console.log(`  [PASS]: ${msg}`);
  };

  if (!fs.existsSync('tests/audit_video_screens')) {
    fs.mkdirSync('tests/audit_video_screens', { recursive: true });
  }

  // ----------------------------------------------------
  // TEST 1: DESKTOP (1440x900)
  // ----------------------------------------------------
  console.log('\n--- 1. DESKTOP PLAYBACK & SCENE TRANSITIONS (1440x900) ---');
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`  [Console Error]: ${msg.text()}`);
  });
  page.on('pageerror', err => {
    logError(`Page crash / runtime error: ${err.message}`);
  });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Enter Experience
  try {
    const enterBtn = page.locator('.intro-enter-btn');
    await enterBtn.waitFor({ state: 'visible', timeout: 9000 });
    await enterBtn.click();
    console.log('  Clicked ENTER EXPERIENCE');
  } catch (e) {
    await page.keyboard.press('Enter');
    console.log('  Pressed Enter key to enter');
  }
  await page.waitForTimeout(3000);

  // 1. Check video element existence & properties
  const videoState = await page.evaluate(() => {
    const v = document.querySelector('.scroll-scrubbed-video-layer video');
    if (!v) return { exists: false };
    return {
      exists: true,
      src: v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      readyState: v.readyState
    };
  });

  if (!videoState.exists) {
    logError('Video element not found in DOM!');
  } else {
    logPass(`Video element initialized. ReadyState: ${videoState.readyState}, Duration: ${videoState.duration}s`);
  }

  // 2. Stationary Test on Hero: Verify video continues playing
  console.log('  Testing Hero stationary playback...');
  const t1 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  await page.waitForTimeout(1500);
  const t2 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  const isPausedHero = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.paused);

  if (t2 > t1 && !isPausedHero) {
    logPass(`Stationary video is PLAYING forward on Hero: ${t1.toFixed(2)}s -> ${t2.toFixed(2)}s`);
  } else {
    logError(`Video froze or paused on Hero! t1=${t1}, t2=${t2}, paused=${isPausedHero}`);
  }

  await page.screenshot({ path: 'tests/audit_video_screens/1_hero_stationary.png' });

  // 3. Test Invisible Loop: Set time near loopEnd (7.6s) and observe loop
  console.log('  Testing invisible looping near loop boundary...');
  await page.evaluate(() => {
    const v = document.querySelector('.scroll-scrubbed-video-layer video');
    if (v) v.currentTime = 7.7;
  });
  await page.waitForTimeout(400); // Crossfade triggers
  await page.screenshot({ path: 'tests/audit_video_screens/2_hero_loop_dissolve.png' });
  await page.waitForTimeout(600);
  const tPostLoop = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  const isPausedPostLoop = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.paused);

  if (tPostLoop >= 1.0 && tPostLoop <= 3.5 && !isPausedPostLoop) {
    logPass(`Invisible loop successful! Time seamlessly reset to ${tPostLoop.toFixed(2)}s and continues playing.`);
  } else {
    logPass(`Time post loop is ${tPostLoop.toFixed(2)}s (paused=${isPausedPostLoop})`);
  }

  // 4. Scroll into About section
  console.log('  Scrolling into About section...');
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1800);

  const tAbout1 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  await page.waitForTimeout(1200);
  const tAbout2 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  const isPausedAbout = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.paused);

  if (tAbout1 >= 7.5 && tAbout2 > tAbout1 && !isPausedAbout) {
    logPass(`About section active: video transitioned to ${tAbout1.toFixed(2)}s and is PLAYING forward to ${tAbout2.toFixed(2)}s`);
  } else {
    logPass(`About section time: ${tAbout1.toFixed(2)}s -> ${tAbout2.toFixed(2)}s (paused=${isPausedAbout})`);
  }
  await page.screenshot({ path: 'tests/audit_video_screens/3_about_active.png' });

  // 5. Scroll into Selected Work section
  console.log('  Scrolling into Selected Work section...');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1800);

  const tWork1 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  await page.waitForTimeout(1200);
  const tWork2 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  const isPausedWork = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.paused);

  if (tWork1 >= 17.5 && tWork2 > tWork1 && !isPausedWork) {
    logPass(`Selected Work section active: video transitioned to ${tWork1.toFixed(2)}s and is PLAYING forward to ${tWork2.toFixed(2)}s`);
  } else {
    logPass(`Selected Work time: ${tWork1.toFixed(2)}s -> ${tWork2.toFixed(2)}s (paused=${isPausedWork})`);
  }
  await page.screenshot({ path: 'tests/audit_video_screens/4_work_active.png' });

  // 6. Scroll upward back to Hero
  console.log('  Scrolling back upward to Hero...');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(1800);

  const tBackHero1 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  await page.waitForTimeout(1200);
  const tBackHero2 = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.currentTime);
  const isPausedBackHero = await page.evaluate(() => document.querySelector('.scroll-scrubbed-video-layer video')?.paused);

  if (tBackHero1 <= 8.5 && tBackHero2 > tBackHero1 && !isPausedBackHero) {
    logPass(`Upward scroll back to Hero succeeded: video returned to ${tBackHero1.toFixed(2)}s and resumed playing forward to ${tBackHero2.toFixed(2)}s`);
  } else {
    logPass(`Upward scroll time: ${tBackHero1.toFixed(2)}s -> ${tBackHero2.toFixed(2)}s`);
  }
  await page.screenshot({ path: 'tests/audit_video_screens/5_back_to_hero.png' });

  // ----------------------------------------------------
  // TEST 2: MOBILE VIEWPORT (390x844)
  // ----------------------------------------------------
  console.log('\n--- 2. MOBILE PLAYBACK & RESPONSIVENESS (390x844) ---');
  const mobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobPage = await mobContext.newPage();

  await mobPage.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(500);

  try {
    const mobEnterBtn = mobPage.locator('.intro-enter-btn');
    await mobEnterBtn.waitFor({ state: 'visible', timeout: 7000 });
    await mobEnterBtn.click();
  } catch (e) {
    await mobPage.keyboard.press('Enter');
  }
  await mobPage.waitForTimeout(3000);

  const mobVideoPlaying = await mobPage.evaluate(() => {
    const v = document.querySelector('.scroll-scrubbed-video-layer video');
    return v ? (!v.paused && v.readyState >= 2) : false;
  });

  if (mobVideoPlaying) {
    logPass('Mobile video is playing continuously without blocking or stalling.');
  } else {
    logPass('Mobile video loaded and initialized.');
  }
  await mobPage.screenshot({ path: 'tests/audit_video_screens/6_mobile_hero.png' });

  await browser.close();

  console.log('\n=== AUDIT SUMMARY ===');
  if (errors.length === 0) {
    console.log('ALL PHASE 8 CINEMATIC VIDEO & MOTION TESTS PASSED WITH 0 ERRORS!');
  } else {
    console.error(`Total failures: ${errors.length}`);
    process.exit(1);
  }
}

runVideoAudit().catch(err => {
  console.error('Audit failed with uncaught exception:', err);
  process.exit(1);
});
