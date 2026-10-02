import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';
import path from 'path';

const scratchDir = 'd:/Antigravity_Projects/Portfolio/scratch';

const VIEWPORTS = [
  { name: 'desktop_1440x1200', width: 1440, height: 1200 },
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'desktop_1280x800', width: 1280, height: 800 },
  { name: 'tablet_1024x768', width: 1024, height: 768 },
  { name: 'tablet_820x1180', width: 820, height: 1180 },
  { name: 'mobile_390x844', width: 390, height: 844 }
];

async function runAudit() {
  console.log('--- STARTING PLAYWRIGHT HEADLINE AUDIT ---');
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Wait for Enter Experience button if present
    try {
      const enterBtn = page.locator('.intro-enter-btn');
      if (await enterBtn.isVisible({ timeout: 4000 })) {
        await enterBtn.click();
        await page.waitForTimeout(2500);
      }
    } catch (e) {
      // Intro may have already been dismissed or bypassed
    }

    // Scroll to #about
    await page.evaluate(() => {
      const about = document.querySelector('#about');
      if (about) {
        about.scrollIntoView({ behavior: 'instant' });
      }
    });
    await page.waitForTimeout(400);

    // Ensure animation is at end state so text is visible
    await page.evaluate(() => {
      document.querySelectorAll('.statement-row').forEach(r => {
        r.style.opacity = '1';
        r.style.visibility = 'visible';
        r.style.transform = 'none';
      });
      document.querySelectorAll('.statement-line-mask').forEach(m => {
        m.style.opacity = '1';
        m.style.visibility = 'visible';
      });
    });
    await page.waitForTimeout(400);

    const data = await page.evaluate(() => {
      const statement = document.querySelector('.asymmetric-statement');
      const row1 = document.querySelector('.statement-row.row-1');
      const row2 = document.querySelector('.statement-row.row-2');
      const row3 = document.querySelector('.statement-row.row-3');
      const mask1 = document.querySelector('.statement-line-mask.mask-row-1');
      const mask2 = document.querySelector('.statement-line-mask.mask-row-2');
      const mask3 = document.querySelector('.statement-line-mask.mask-row-3');

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

      function getTextWidth(el) {
        if (!el || !el.firstChild) return 0;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rect = range.getBoundingClientRect();
        return Math.round(rect.width);
      }

      function getTextRight(el) {
        if (!el || !el.firstChild) return 0;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rect = range.getBoundingClientRect();
        return Math.round(rect.right);
      }

      const stStyle = statement ? window.getComputedStyle(statement) : null;
      const mask3Style = mask3 ? window.getComputedStyle(mask3) : null;

      const hasHOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const row3Rect = r(row3);
      const mask3Rect = r(mask3);
      const row3TextWidth = getTextWidth(row3);
      const row3TextRight = getTextRight(row3);
      const textClippedByMask = mask3Rect ? (row3TextRight > mask3Rect.right) : false;
      const textClippedByViewport = row3TextRight > window.innerWidth;

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        hasHOverflow,
        fontSize: stStyle ? stStyle.fontSize : 'N/A',
        lineHeight: stStyle ? stStyle.lineHeight : 'N/A',
        mask3MarginLeft: mask3Style ? mask3Style.marginLeft : 'N/A',
        row3ClientWidth: row3 ? row3.clientWidth : 0,
        row3ScrollWidth: row3 ? row3.scrollWidth : 0,
        row3TextWidth,
        row3TextRight,
        mask3Right: mask3Rect ? mask3Rect.right : 0,
        textClippedByMask,
        textClippedByViewport,
        clippedPixels: mask3Rect ? Math.max(0, row3TextRight - mask3Rect.right) : 0,
        row3Text: row3?.textContent.trim()
      };
    });

    console.log(JSON.stringify(data, null, 2));

    const shotPath = path.join(scratchDir, `audit_${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${shotPath}`);

    await context.close();
  }

  await browser.close();
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
