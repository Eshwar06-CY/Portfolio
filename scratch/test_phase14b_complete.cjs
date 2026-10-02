const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[BROWSER ERROR]:', msg.text());
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]:', err);
    errors.push(err.toString());
  });

  console.log('=== TEST A: HARD REFRESH, ENTER, HERO PLAYBACK ===');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(600);
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(4000);

  const heroCheck = await page.evaluate(async () => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = layer.querySelectorAll('video')[0];
    const t1 = vA.currentTime;
    await new Promise(r => setTimeout(r, 800));
    const t2 = vA.currentTime;
    return {
      layerVisible: getComputedStyle(layer).visibility,
      layerOpacity: getComputedStyle(layer).opacity,
      vA_paused: vA.paused,
      t1,
      t2,
      advancing: t2 > t1
    };
  });
  console.log('TEST A Result (Hero):', heroCheck);

  console.log('\n=== TEST B: SCROLL TO ABOUT, WAIT, CONTINUOUS PLAYBACK ===');
  await page.evaluate(() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const aboutCheck = await page.evaluate(async () => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const videos = Array.from(layer.querySelectorAll('video'));
    const active = videos.find(v => !v.paused) || videos[0];
    const t1 = active.currentTime;
    await new Promise(r => setTimeout(r, 1200));
    const t2 = active.currentTime;
    return {
      layerVisible: getComputedStyle(layer).visibility,
      layerOpacity: getComputedStyle(layer).opacity,
      activePaused: active.paused,
      t1,
      t2,
      advancing: t2 > t1
    };
  });
  console.log('TEST B Result (About):', aboutCheck);
  await page.screenshot({ path: 'scratch/test_b_about.png' });

  console.log('\n=== TEST C: SCROLL DOWN TO EXPLORING, SCROLL BACK UP TO ABOUT ===');
  await page.evaluate(() => {
    const el = document.getElementById('exploring') || document.querySelector('.about-story-moment:nth-of-type(2)');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 3200, behavior: 'smooth' });
  });
  await page.waitForTimeout(1200);

  console.log('Scrolling back UP to About...');
  await page.evaluate(() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const aboutReturnCheck = await page.evaluate(async () => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const videos = Array.from(layer.querySelectorAll('video'));
    const active = videos.find(v => !v.paused) || videos[0];
    const t1 = active.currentTime;
    await new Promise(r => setTimeout(r, 600));
    const t2 = active.currentTime;
    return {
      layerVisible: getComputedStyle(layer).visibility,
      layerOpacity: getComputedStyle(layer).opacity,
      activePaused: active.paused,
      t1,
      t2,
      advancing: t2 > t1
    };
  });
  console.log('TEST C Result (Returned to About):', aboutReturnCheck);
  await page.screenshot({ path: 'scratch/test_c_about_return.png' });

  console.log('\n=== TEST D: SCROLL BACK UP TO HERO ===');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const heroReturnCheck = await page.evaluate(async () => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const videos = Array.from(layer.querySelectorAll('video'));
    const active = videos.find(v => !v.paused) || videos[0];
    const t1 = active.currentTime;
    await new Promise(r => setTimeout(r, 600));
    const t2 = active.currentTime;
    return {
      layerVisible: getComputedStyle(layer).visibility,
      layerOpacity: getComputedStyle(layer).opacity,
      activePaused: active.paused,
      t1,
      t2,
      advancing: t2 > t1
    };
  });
  console.log('TEST D Result (Returned to Hero):', heroReturnCheck);
  await page.screenshot({ path: 'scratch/test_d_hero_return.png' });

  console.log('\n=== TEST E: RAPID FORWARD AND BACKWARD SCROLL ===');
  const sections = ['about', 'work', 'experience', 'expertise', 'contact'];
  for (const s of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'auto' });
    }, s);
    await page.waitForTimeout(250);
  }

  // Fast scroll back up
  for (let i = sections.length - 1; i >= 0; i--) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'auto' });
    }, sections[i]);
    await page.waitForTimeout(250);
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  await page.waitForTimeout(1000);

  const rapidCheck = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const videos = Array.from(layer.querySelectorAll('video'));
    const active = videos.find(v => !v.paused) || videos[0];
    return {
      layerVisible: getComputedStyle(layer).visibility,
      layerOpacity: getComputedStyle(layer).opacity,
      videoPlaying: !active.paused,
      currentTime: active.currentTime
    };
  });
  console.log('TEST E Result (After Rapid Scroll):', rapidCheck);

  console.log('\n=== TOTAL CONSOLE ERRORS ===', errors.length);
  await browser.close();
})();
