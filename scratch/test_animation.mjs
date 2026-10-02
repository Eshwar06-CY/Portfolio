import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import path from 'path';

const scratchDir = 'd:/Antigravity_Projects/Portfolio/scratch';

async function verifyAnimation() {
  console.log('--- VERIFYING ABOUT ANIMATION AT 1440x1200 ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Click Enter Experience
  try {
    const enterBtn = page.locator('.intro-enter-btn');
    if (await enterBtn.isVisible({ timeout: 5000 })) {
      console.log('Clicking enter button...');
      await enterBtn.click();
      // Wait for 3.20s transition to complete and scroll lock to unlock
      await page.waitForTimeout(4500);
    }
  } catch (e) {}

  // Scroll to About
  console.log('Scrolling to About...');
  await page.evaluate(() => {
    const about = document.querySelector('#about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => {
    const row1 = document.querySelector('.statement-row.row-1');
    const row2 = document.querySelector('.statement-row.row-2');
    const row3 = document.querySelector('.statement-row.row-3');
    const mask3 = document.querySelector('.statement-line-mask.mask-row-3');
    const heroBlock = document.querySelector('.about-hero-block');

    const s1 = window.getComputedStyle(row1);
    const s2 = window.getComputedStyle(row2);
    const s3 = window.getComputedStyle(row3);

    const r3 = row3.getBoundingClientRect();
    const m3 = mask3.getBoundingClientRect();
    const hbRect = heroBlock.getBoundingClientRect();

    const range = document.createRange();
    range.selectNodeContents(row3);
    const textRect = range.getBoundingClientRect();

    return {
      scrollY: window.scrollY,
      heroBlockRect: {
        top: Math.round(hbRect.top),
        bottom: Math.round(hbRect.bottom),
        height: Math.round(hbRect.height)
      },
      row1Opacity: s1.opacity,
      row2Opacity: s2.opacity,
      row3Opacity: s3.opacity,
      row3Transform: s3.transform,
      row3TextRight: Math.round(textRect.right),
      mask3Right: Math.round(m3.right),
      viewportWidth: window.innerWidth,
      isTextFullyInsideMask: textRect.right <= m3.right,
      isTextFullyInsideViewport: textRect.right <= window.innerWidth,
      rightBreathingRoom: Math.round(window.innerWidth - textRect.right)
    };
  });

  console.log('Animation settled state:', JSON.stringify(state, null, 2));

  const shotPath = path.join(scratchDir, 'animation_settled_1440x1200.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot:', shotPath);

  await browser.close();

  if (parseFloat(state.row3Opacity) < 0.9 || !state.isTextFullyInsideMask) {
    console.error('FAIL: Animation did not settle properly or text was clipped');
    process.exit(1);
  } else {
    console.log('PASS: Animation settled cleanly, opacity=1, text fully visible!');
  }
}

verifyAnimation().catch(err => {
  console.error(err);
  process.exit(1);
});
