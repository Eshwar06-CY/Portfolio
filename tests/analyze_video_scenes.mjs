import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';
import path from 'path';

async function analyzeVideo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });

  // Load a simple page containing the video
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <video id="vid" src="/gemini_generated_video_9efe4bc0.mp4" muted playsinline style="width:640px;height:360px;"></video>
        <canvas id="c" width="160" height="90" style="display:none;"></canvas>
      </body>
    </html>
  `;

  await page.route('http://local-test/', route => {
    route.fulfill({ status: 200, contentType: 'text/html', body: htmlContent });
  });

  // Also route the mp4 from localhost:5173
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // Use the running dev server
  const framesDir = 'tests/video_analysis_frames';
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  const analysis = await page.evaluate(async () => {
    const video = document.createElement('video');
    video.src = '/gemini_generated_video_9efe4bc0.mp4';
    video.muted = true;
    video.playsInline = true;
    document.body.appendChild(video);

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');

    const duration = video.duration;
    const sampleRate = 0.5; // every 0.5 seconds
    const frameData = [];

    const seekTo = (time) => new Promise(resolve => {
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // Calculate average brightness & simple color hash
        let totalBrightness = 0;
        let rSum = 0, gSum = 0, bSum = 0;
        const totalPixels = canvas.width * canvas.height;
        
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          rSum += r;
          gSum += g;
          bSum += b;
          totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
        }

        const avgBrightness = totalBrightness / totalPixels;
        const avgR = rSum / totalPixels;
        const avgG = gSum / totalPixels;
        const avgB = bSum / totalPixels;

        resolve({
          time,
          avgBrightness,
          avgR,
          avgG,
          avgB,
          pixels: Array.from(imgData) // for diffing
        });
      };
      video.currentTime = time;
    });

    for (let t = 0; t <= Math.min(39.8, duration); t += sampleRate) {
      const data = await seekTo(t);
      frameData.push(data);
    }

    // Now find best loop candidates in each section range
    const sections = {
      hero: { start: 0.5, end: 8.0 },
      about: { start: 8.0, end: 13.0 },
      exploring: { start: 13.0, end: 18.0 },
      work: { start: 18.0, end: 28.0 },
      experience: { start: 28.0, end: 33.0 },
      expertise: { start: 33.0, end: 36.0 },
      contact: { start: 36.0, end: 39.8 }
    };

    const bestLoops = {};

    function calcDiff(pA, pB) {
      let diff = 0;
      for (let i = 0; i < pA.length; i += 4) {
        diff += Math.abs(pA[i] - pB[i]) + Math.abs(pA[i+1] - pB[i+1]) + Math.abs(pA[i+2] - pB[i+2]);
      }
      return diff / (pA.length / 4);
    }

    for (const [secName, range] of Object.entries(sections)) {
      const secFrames = frameData.filter(f => f.time >= range.start && f.time <= range.end);
      let minDiff = Infinity;
      let bestPair = null;

      // Minimum loop duration 2.0s
      for (let i = 0; i < secFrames.length; i++) {
        for (let j = i + 1; j < secFrames.length; j++) {
          const duration = secFrames[j].time - secFrames[i].time;
          if (duration >= 2.0) {
            const diff = calcDiff(secFrames[i].pixels, secFrames[j].pixels);
            if (diff < minDiff) {
              minDiff = diff;
              bestPair = {
                loopStart: secFrames[i].time,
                loopEnd: secFrames[j].time,
                duration,
                diff: diff.toFixed(2),
                startBrightness: secFrames[i].avgBrightness.toFixed(1),
                endBrightness: secFrames[j].avgBrightness.toFixed(1)
              };
            }
          }
        }
      }
      bestLoops[secName] = bestPair;
    }

    // Remove heavy pixel arrays before returning
    const summaryFrames = frameData.map(f => ({
      time: f.time,
      brightness: f.avgBrightness.toFixed(1),
      r: f.avgR.toFixed(1),
      g: f.avgG.toFixed(1),
      b: f.avgB.toFixed(1)
    }));

    return { duration, bestLoops, summaryFrames };
  });

  console.log('Video Duration:', analysis.duration);
  console.log('Best Loop Ranges per section (by pixel diff):');
  console.log(JSON.stringify(analysis.bestLoops, null, 2));

  await browser.close();
}

analyzeVideo().catch(console.error);
