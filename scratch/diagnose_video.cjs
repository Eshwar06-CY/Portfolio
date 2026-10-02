const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  console.log('Opening page...');
  await page.goto('http://localhost:5173/');

  // Wait for intro button
  const btn = await page.waitForSelector('.intro-enter-btn', { timeout: 15000 });
  await btn.click();
  console.log('Clicked enter button, waiting 5 seconds...');
  await page.waitForTimeout(5000);

  const videoInfo = await page.evaluate(() => {
    const layer = document.querySelector('.scroll-scrubbed-video-layer');
    const vA = document.querySelector('.scroll-scrubbed-video-layer video:nth-child(1)');
    const vB = document.querySelector('.scroll-scrubbed-video-layer video:nth-child(2)');
    const canvas = document.querySelector('.global-cinematic-webgl-canvas');
    const allVideos = Array.from(document.querySelectorAll('video')).map(v => ({
      src: v.src,
      readyState: v.readyState,
      paused: v.paused,
      currentTime: v.currentTime,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      opacity: window.getComputedStyle(v).opacity,
      display: window.getComputedStyle(v).display,
      visibility: window.getComputedStyle(v).visibility
    }));

    return {
      layer: layer ? {
        opacity: window.getComputedStyle(layer).opacity,
        visibility: window.getComputedStyle(layer).visibility,
        zIndex: window.getComputedStyle(layer).zIndex,
        display: window.getComputedStyle(layer).display
      } : 'LAYER_NOT_FOUND',
      canvas: canvas ? {
        opacity: window.getComputedStyle(canvas).opacity,
        visibility: window.getComputedStyle(canvas).visibility,
        zIndex: window.getComputedStyle(canvas).zIndex,
        display: window.getComputedStyle(canvas).display
      } : 'CANVAS_NOT_FOUND',
      videos: allVideos
    };
  });

  console.log('Diagnostic result:', JSON.stringify(videoInfo, null, 2));
  console.log('Console logs count:', consoleLogs.length);
  const errors = consoleLogs.filter(l => l.startsWith('[error]'));
  if (errors.length) console.log('Errors:', errors);

  await browser.close();
})();
