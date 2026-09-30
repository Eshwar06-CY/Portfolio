import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testLoopTransition() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Evaluate the dual-video crossfade concept
  const result = await page.evaluate(async () => {
    // Create two video elements
    const vA = document.createElement('video');
    const vB = document.createElement('video');
    vA.src = '/gemini_generated_video_9efe4bc0.mp4';
    vB.src = '/gemini_generated_video_9efe4bc0.mp4';
    vA.muted = vB.muted = true;
    vA.playsInline = vB.playsInline = true;

    document.body.appendChild(vA);
    document.body.appendChild(vB);

    await Promise.all([
      new Promise(r => vA.onloadedmetadata = r),
      new Promise(r => vB.onloadedmetadata = r)
    ]);

    // Test seek and playback latency
    vA.currentTime = 1.5;
    await new Promise(r => vA.onseeked = r);
    await vA.play();

    // Measure seek time for vB
    const t0 = performance.now();
    vB.currentTime = 7.6;
    await new Promise(r => vB.onseeked = r);
    const seekTime = performance.now() - t0;

    vA.remove();
    vB.remove();

    return { duration: vA.duration, seekTimeMs: seekTime };
  });

  console.log('Video seek benchmark:', result);
  await browser.close();
}

testLoopTransition().catch(console.error);
