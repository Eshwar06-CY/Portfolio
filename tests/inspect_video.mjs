import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';

async function inspectVideo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://127.0.0.1:5173/');
  await page.waitForTimeout(1000);

  const testPageHtml = `
    <!DOCTYPE html>
    <html>
      <head><style>body { margin:0; background:#000; overflow:hidden; }</style></head>
      <body>
        <video id="vid" src="/gemini_generated_video_9efe4bc0.mp4" muted playsinline style="width:1280px; height:720px; object-fit:cover;"></video>
      </body>
    </html>
  `;

  await page.setContent(testPageHtml);
  await page.waitForTimeout(1000);

  const info = await page.evaluate(async () => {
    const v = document.getElementById('vid');
    return new Promise((resolve) => {
      v.onloadedmetadata = () => {
        resolve({
          duration: v.duration,
          videoWidth: v.videoWidth,
          videoHeight: v.videoHeight
        });
      };
      v.onerror = (e) => resolve({ error: 'Video error', code: v.error ? v.error.code : null });
      if (v.readyState >= 1) {
        resolve({
          duration: v.duration,
          videoWidth: v.videoWidth,
          videoHeight: v.videoHeight
        });
      }
    });
  });

  console.log('Video Info:', JSON.stringify(info, null, 2));

  if (!fs.existsSync('tests/video_frames')) {
    fs.mkdirSync('tests/video_frames', { recursive: true });
  }

  const timestamps = [0, 4, 8, 13, 18, 24, 28, 33, 36, 39];
  for (const t of timestamps) {
    await page.evaluate(async (time) => {
      const v = document.getElementById('vid');
      v.currentTime = time;
      await new Promise(r => {
        v.onseeked = r;
      });
    }, t);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `tests/video_frames/frame_${t}s.png` });
    await page.screenshot({ 
      path: `tests/video_frames/corner_${t}s.png`,
      clip: { x: 1280 - 160, y: 720 - 100, width: 160, height: 100 }
    });
    console.log(`Captured frame and corner at ${t}s`);
  }

  await browser.close();
  console.log('Video inspection complete!');
}

inspectVideo().catch(err => {
  console.error(err);
  process.exit(1);
});
