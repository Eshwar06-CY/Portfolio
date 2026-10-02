const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(600);
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(3800);

  // Scroll to work
  await page.evaluate(() => document.getElementById('work').scrollIntoView());
  await page.waitForTimeout(1000);

  // Scroll to about
  await page.evaluate(() => document.getElementById('about').scrollIntoView());
  await page.waitForTimeout(1000);

  // Screenshot ONLY video layer
  const layer = await page.locator('.scroll-scrubbed-video-layer');
  await layer.screenshot({ path: 'scratch/only_video_layer_about.png' });
  console.log('Saved scratch/only_video_layer_about.png');

  // Get vA and vB bounding box and styles
  const info = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const videos = layer.querySelectorAll('video');
    return Array.from(videos).map((v, i) => ({
      i,
      rect: v.getBoundingClientRect(),
      opacity: getComputedStyle(v).opacity,
      zIndex: getComputedStyle(v).zIndex,
      paused: v.paused,
      currentTime: v.currentTime,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      readyState: v.readyState
    }));
  });
  console.log('Videos info:', info);
  await browser.close();
})();
