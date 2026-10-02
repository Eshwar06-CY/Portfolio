const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 }
  });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  console.log('--- TEST 1: LOADING SCREEN ISOLATION ---');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const videoLayerPreEnter = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    if (!layer) return null;
    const style = window.getComputedStyle(layer);
    return {
      opacity: style.opacity,
      visibility: style.visibility,
      zIndex: style.zIndex
    };
  });
  console.log('Video layer pre-enter state:', videoLayerPreEnter);

  console.log('\n--- CLICK ENTER EXPERIENCE ---');
  const enterBtn = page.locator('.intro-enter-btn');
  await enterBtn.click();

  // Wait for entrance transition (approx 3.5s)
  await page.waitForTimeout(3800);

  console.log('\n--- HERO & VIDEO PLAYBACK VERIFICATION ---');
  const videoState = await page.evaluate(async () => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = layer ? layer.querySelectorAll('video')[0] : null;
    const vB = layer ? layer.querySelectorAll('video')[1] : null;

    const t1 = vA ? vA.currentTime : -1;
    await new Promise(r => setTimeout(r, 600));
    const t2 = vA ? vA.currentTime : -1;

    return {
      layerStyle: layer ? {
        opacity: window.getComputedStyle(layer).opacity,
        visibility: window.getComputedStyle(layer).visibility,
        zIndex: window.getComputedStyle(layer).zIndex
      } : null,
      vA_paused: vA ? vA.paused : null,
      vA_currentTime_start: t1,
      vA_currentTime_after600ms: t2,
      vA_advancing: t2 > t1,
      vA_src: vA ? vA.currentSrc : null
    };
  });
  console.log('Hero video state after enter:', videoState);

  await page.screenshot({ path: 'scratch/phase14_hero_video.png' });
  console.log('Saved scratch/phase14_hero_video.png');

  console.log('\n--- TEST 2 & 3: SCROLL DOWN / UP REPLAY TESTS ---');
  // Sections to test: about, exploring, work, experience, expertise, contact
  const sections = ['about', 'exploring', 'work', 'experience', 'expertise', 'contact'];

  for (let cycle = 1; cycle <= 2; cycle++) {
    console.log(`\n=== CYCLE ${cycle}: SCROLLING DOWN ===`);
    for (const secId of sections) {
      console.log(`Scrolling to #${secId}...`);
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, secId);

      await page.waitForTimeout(1000);

      const secStatus = await page.evaluate((id) => {
        const el = document.getElementById(id);
        const layer = document.querySelector('.scroll-scrubbed-video-layer');
        const vA = layer ? layer.querySelectorAll('video')[0] : null;
        const vB = layer ? layer.querySelectorAll('video')[1] : null;
        const activeVid = (vA && !vA.paused) ? vA : vB;

        return {
          id,
          videoTime: activeVid ? activeVid.currentTime : null,
          videoPaused: activeVid ? activeVid.paused : null,
          layerVisible: layer ? window.getComputedStyle(layer).visibility : null,
          layerOpacity: layer ? window.getComputedStyle(layer).opacity : null
        };
      }, secId);

      console.log(`Section #${secId} video status:`, secStatus);
    }

    console.log(`\n=== CYCLE ${cycle}: SCROLLING UP ===`);
    for (let i = sections.length - 2; i >= 0; i--) {
      const secId = sections[i];
      console.log(`Scrolling back UP to #${secId}...`);
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, secId);

      await page.waitForTimeout(900);

      const replayCheck = await page.evaluate((id) => {
        const el = document.getElementById(id);
        // Check if headings or text elements have opacity > 0 (revealed)
        const texts = el ? el.querySelectorAll('h2, h3, p, .kicker') : [];
        let visibleCount = 0;
        texts.forEach(t => {
          const s = window.getComputedStyle(t);
          if (parseFloat(s.opacity) > 0.5) visibleCount++;
        });
        return {
          id,
          textElementsSampled: texts.length,
          revealedElements: visibleCount
        };
      }, secId);
      console.log(`Section #${secId} replay status:`, replayCheck);
    }

    console.log(`Returning to Hero...`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
  }

  console.log('\n--- TEST 4: FAST SCROLL TEST ---');
  await page.evaluate(() => {
    window.scrollTo({ top: 6000, behavior: 'auto' });
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    window.scrollTo({ top: 200, behavior: 'auto' });
  });
  await page.waitForTimeout(1000);

  const postFastScrollVideo = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = layer ? layer.querySelectorAll('video')[0] : null;
    const vB = layer ? layer.querySelectorAll('video')[1] : null;
    const activeVid = (vA && !vA.paused) ? vA : vB;
    return {
      layerVisible: layer ? window.getComputedStyle(layer).visibility : null,
      layerOpacity: layer ? window.getComputedStyle(layer).opacity : null,
      videoPlaying: activeVid ? !activeVid.paused : false,
      currentTime: activeVid ? activeVid.currentTime : -1
    };
  });
  console.log('Post fast scroll video status:', postFastScrollVideo);

  console.log('\n--- CONSOLE ERRORS AUDIT ---');
  console.log('Errors count:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
  console.log('\n=== PHASE 14 TESTS FINISHED ===');
})();
