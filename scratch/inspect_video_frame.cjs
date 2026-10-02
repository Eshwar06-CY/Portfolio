const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  await page.goto('http://localhost:5173/');
  const btn = await page.waitForSelector('.intro-enter-btn', { timeout: 15000 });
  await btn.click();

  // Wait 7 seconds for full transition and video playback
  await page.waitForTimeout(7000);

  // Take screenshot of video alone
  const video = await page.$('.scroll-scrubbed-video-layer video');
  if (video) {
    await video.screenshot({ path: 'scratch/video_only_frame.png' });
    console.log('Saved video_only_frame.png');
  }

  // Take full page screenshot
  await page.screenshot({ path: 'scratch/full_page_at_7s.png' });
  console.log('Saved full_page_at_7s.png');

  await browser.close();
})();
