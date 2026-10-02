const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  const timestamps = [1.0, 4.0, 7.5, 8.2, 9.5, 12.0, 14.0, 18.5, 22.0, 28.5, 34.0, 37.0];
  for (const t of timestamps) {
    const res = await page.evaluate(async (time) => {
      const v = document.createElement('video');
      v.src = '/gemini_generated_video_9efe4bc0.mp4';
      v.muted = true;
      document.body.appendChild(v);
      await new Promise(r => v.onloadedmetadata = r);
      v.currentTime = time;
      await new Promise(r => v.onseeked = r);

      const c = document.createElement('canvas');
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(v, 0, 0);

      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      let sum = 0;
      for (let i = 0; i < imgData.data.length; i += 4) {
        sum += imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
      }
      const avgBrightness = sum / (imgData.data.length / 4 * 3);
      const dataUrl = c.toDataURL('image/jpeg', 0.7);
      v.remove();
      return { time, avgBrightness, dataUrl, w: c.width, h: c.height };
    }, t);

    console.log(`Time: ${t}s | Brightness: ${res.avgBrightness.toFixed(2)} | Dimensions: ${res.w}x${res.h}`);
    const base64 = res.dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(`scratch/frame_${t}.jpg`, Buffer.from(base64, 'base64'));
  }

  await browser.close();
})();
