import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';
import path from 'path';

const scratchDir = 'd:/Antigravity_Projects/Portfolio/scratch';

const VIEWPORTS = [
  { name: '1440x1200', width: 1440, height: 1200 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '820x1180', width: 820, height: 1180 },
  { name: '390x844', width: 390, height: 844 }
];

async function main() {
  console.log('--- STARTING COMPREHENSIVE HEADLINE VERIFICATION ---');
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\nValidating Viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Wait for Enter Experience button if present and click
    try {
      const enterBtn = page.locator('.intro-enter-btn');
      if (await enterBtn.isVisible({ timeout: 5000 })) {
        await enterBtn.click();
        await page.waitForTimeout(2500);
      }
    } catch (e) {}

    // Scroll to #about with smooth animation trigger
    const aboutLoc = page.locator('#about');
    await aboutLoc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Wait for GSAP timeline to settle
    await page.waitForTimeout(800);

    const data = await page.evaluate(() => {
      const statement = document.querySelector('.asymmetric-statement');
      const row1 = document.querySelector('.statement-row.row-1');
      const row2 = document.querySelector('.statement-row.row-2');
      const row3 = document.querySelector('.statement-row.row-3');
      const mask3 = document.querySelector('.statement-line-mask.mask-row-3');
      const about = document.querySelector('#about');

      function r(el) {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          left: Math.round(b.left),
          right: Math.round(b.right),
          width: Math.round(b.width),
          height: Math.round(b.height)
        };
      }

      function getTextBoundingRect(el) {
        if (!el || !el.firstChild) return null;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rect = range.getBoundingClientRect();
        return {
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      }

      const stStyle = statement ? window.getComputedStyle(statement) : null;
      const r3Style = row3 ? window.getComputedStyle(row3) : null;
      const mask3Style = mask3 ? window.getComputedStyle(mask3) : null;

      const mask3Rect = r(mask3);
      const textRect = getTextBoundingRect(row3);
      const row3Rect = r(row3);

      const hasHOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const isClippedByViewport = textRect ? (textRect.right > window.innerWidth) : false;
      const isClippedByMask = (textRect && mask3Rect) ? (textRect.right > mask3Rect.right + 2) : false;
      const isClipped = isClippedByViewport || isClippedByMask;

      const rightBreathingRoom = textRect ? (window.innerWidth - textRect.right) : 0;

      return {
        viewport: window.innerWidth + 'x' + window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        hasHOverflow,
        fontSize: stStyle ? stStyle.fontSize : 'N/A',
        lineHeight: stStyle ? stStyle.lineHeight : 'N/A',
        mask3MarginLeft: mask3Style ? mask3Style.marginLeft : 'N/A',
        row3Text: row3?.textContent.trim(),
        row3Rect,
        mask3Rect,
        textRect,
        isClipped,
        isClippedByMask,
        isClippedByViewport,
        rightBreathingRoom,
        row3Opacity: r3Style ? r3Style.opacity : 'N/A',
        row3Visibility: r3Style ? r3Style.visibility : 'N/A'
      };
    });

    results.push(data);
    console.log(JSON.stringify(data, null, 2));

    const shotPath = path.join(scratchDir, `verified_${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${shotPath}`);

    await context.close();
  }

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY TABLE ---');
  console.table(results.map(r => ({
    Viewport: r.viewport,
    FontSize: r.fontSize,
    RightBreathingRoom: r.rightBreathingRoom + 'px',
    Clipped: r.isClipped ? 'FAIL' : 'PASS',
    HorizontalOverflow: r.hasHOverflow ? 'FAIL' : 'PASS',
    Opacity: r.row3Opacity
  })));

  const allPassed = results.every(r => !r.isClipped && !r.hasHOverflow);
  console.log(`\nALL VIEWPORTS PASSED: ${allPassed}`);
  if (!allPassed) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
