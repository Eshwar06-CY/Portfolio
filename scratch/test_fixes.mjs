import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
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

export async function evaluateConfig(cssRules, configName) {
  console.log(`\n========================================`);
  console.log(`EVALUATING CONFIG: ${configName}`);
  console.log(`========================================`);

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Scroll to #about
    await page.evaluate(() => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(400);

    // Apply test CSS
    await page.addStyleTag({ content: cssRules });

    // Force animations to completed state
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
    await page.waitForTimeout(300);

    const report = await page.evaluate(() => {
      const statement = document.querySelector('.asymmetric-statement');
      const row1 = document.querySelector('.statement-row.row-1');
      const row2 = document.querySelector('.statement-row.row-2');
      const row3 = document.querySelector('.statement-row.row-3');
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

      function getTextRight(el) {
        if (!el || !el.firstChild) return 0;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rect = range.getBoundingClientRect();
        return Math.round(rect.right);
      }

      const stStyle = statement ? window.getComputedStyle(statement) : null;
      const mask3Style = mask3 ? window.getComputedStyle(mask3) : null;
      const mask3Rect = r(mask3);
      const textRight = getTextRight(row3);
      const rightBreathingRoom = window.innerWidth - textRight;
      const hasHOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const isClipped = textRight > window.innerWidth || (mask3Rect && textRight > mask3Rect.right + 2);

      return {
        viewport: window.innerWidth + 'x' + window.innerHeight,
        fontSize: stStyle ? stStyle.fontSize : 'N/A',
        lineHeight: stStyle ? stStyle.lineHeight : 'N/A',
        mask3MarginLeft: mask3Style ? mask3Style.marginLeft : 'N/A',
        textRight,
        windowWidth: window.innerWidth,
        rightBreathingRoom,
        hasHOverflow,
        isClipped,
        row3Height: r(row3)?.height
      };
    });

    console.log(`${vp.name}: fontSize=${report.fontSize}, rightRoom=${report.rightBreathingRoom}px, clipped=${report.isClipped}, hOverflow=${report.hasHOverflow}, row3Height=${report.row3Height}`);

    const shotPath = path.join(scratchDir, `${configName}_${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    await context.close();
  }

  await browser.close();
}
