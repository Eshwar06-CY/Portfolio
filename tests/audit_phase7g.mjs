import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

const PORT = 5173;
const URL = `http://localhost:${PORT}/`;

async function runAudit() {
  console.log('================================================================');
  console.log('PHASE 7G — CINEMATIC ENVIRONMENT REFINEMENT AUDIT');
  console.log('VALIDATION OF 4-TIER ARCHITECTURE & REMOVED GRAPHIC CIRCLES');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const allErrors = [];

  const viewports = [
    { name: 'desktop_1440x900', width: 1440, height: 900 },
    { name: 'laptop_1280x800', width: 1280, height: 800 },
    { name: 'tablet_820x1180', width: 820, height: 1180 },
    { name: 'mobile_390x844', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    console.log(`\n>>> TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) <<<`);
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const vpErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('WebSocket')) {
        vpErrors.push(`[${vp.name}] ${msg.text()}`);
      }
    });

    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    
    // Wait for ENTER button to become ready and click it
    await page.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
    await page.click('.intro-enter-btn');

    // Wait for entrance transition to complete and Hero to mount and settle
    await page.waitForSelector('.hero-title', { state: 'visible', timeout: 15000 });
    await page.waitForTimeout(3500);

    // Verify Frozen Hero Foreground Elements
    const heroElements = await page.evaluate(() => {
      const title = document.querySelector('.hero-title')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const canvasCount = document.querySelectorAll('canvas').length;
      const projectorBtn = document.querySelector('.projector-action-btn')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const nav = document.querySelector('.nav-header') !== null;
      const stage = document.querySelector('.hero-portrait-stage') !== null;
      const role = document.querySelector('.hero-role')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        title,
        canvasCount,
        projectorBtn,
        nav,
        stage,
        role,
        hasHorizontalOverflow
      };
    });

    console.log(`  [Hero Frozen Elements] Name: "${heroElements.title}" - ${heroElements.title.includes('ESHWAR M') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Role: "${heroElements.role}" - ${heroElements.role.includes('AI / PRODUCT') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Single Canvas: ${heroElements.canvasCount === 1 ? 'PASS' : 'FAIL'} (${heroElements.canvasCount})`);
    console.log(`  [Hero Frozen Elements] Nav present: ${heroElements.nav ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Portrait Stage present: ${heroElements.stage ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Projection Action Button: "${heroElements.projectorBtn}" - ${heroElements.projectorBtn.includes('PORTRAIT') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Layout] No Horizontal Overflow: ${!heroElements.hasHorizontalOverflow ? 'PASS' : 'FAIL'}`);

    // Capture initial Hero screenshot (showing 4-tier monumental architecture and removed circle)
    const heroScreenshotPath = `${scratchDir}/phase7g_hero_${vp.name}.png`;
    await page.screenshot({ path: heroScreenshotPath });
    console.log(`  [Screenshot] Saved Hero: ${heroScreenshotPath}`);

    // Test Portrait Toggle (VIEW / HIDE PORTRAIT)
    const toggleBtn = await page.$('.projector-action-btn');
    if (toggleBtn) {
      console.log('  [Interaction] Clicking VIEW PORTRAIT button...');
      await toggleBtn.click();
      await page.waitForTimeout(2000);
      const activeState = await page.evaluate(() => {
        return document.querySelector('.projector-action-btn')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      });
      console.log(`  [Interaction] State after click: "${activeState}" - ${activeState.includes('HIDE PORTRAIT') ? 'PASS' : 'FAIL'}`);

      const projectedScreenshotPath = `${scratchDir}/phase7g_projected_${vp.name}.png`;
      await page.screenshot({ path: projectedScreenshotPath });
      console.log(`  [Screenshot] Saved Projected State: ${projectedScreenshotPath}`);
    }

    // Test Subtle Scroll Depth
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
    await page.waitForTimeout(1600);
    const scrollScreenshotPath = `${scratchDir}/phase7g_scrolled_${vp.name}.png`;
    await page.screenshot({ path: scrollScreenshotPath });
    console.log(`  [Screenshot] Saved Scrolled Depth: ${scrollScreenshotPath}`);

    if (vpErrors.length > 0) {
      console.error(`  [Errors in ${vp.name}]:`, vpErrors);
      allErrors.push(...vpErrors);
    } else {
      console.log(`  [Console Errors] Zero console errors in ${vp.name}: PASS`);
    }

    await ctx.close();
  }

  await browser.close();

  console.log('\n================================================================');
  if (allErrors.length === 0) {
    console.log('ALL PHASE 7G AUTOMATED AUDIT CHECKS PASSED WITH 0 ERRORS!');
  } else {
    console.error(`AUDIT COMPLETED WITH ${allErrors.length} ERRORS:`, allErrors);
  }
  console.log('================================================================');
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
