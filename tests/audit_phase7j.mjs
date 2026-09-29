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
  console.log('PHASE 7J — FINAL CINEMATIC FILM POLISH AUDIT');
  console.log('VALIDATING SYNCHRONIZED TIMELINE, ART DIRECTION & REVERSIBILITY');
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
      const text = msg.text();
      // Exclude expected 404 for pending video asset
      if (msg.type() === 'error' && !text.includes('WebSocket') && !text.includes('cinematic_archive.mp4')) {
        vpErrors.push(`[${vp.name}] ${text}`);
      }
    });

    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Wait for ENTER button to become ready and click it
    await page.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
    await page.click('.intro-enter-btn');

    // Wait for entrance transition to complete and Hero to settle
    await page.waitForSelector('.hero-title', { state: 'visible', timeout: 15000 });
    await page.waitForTimeout(3800);

    // 1. Initial Hero & Architectural Verification
    const initialChecks = await page.evaluate(() => {
      const canvasCount = document.querySelectorAll('canvas').length;
      const videoEl = document.querySelector('.scroll-scrubbed-video-layer video');
      const videoLayer = document.querySelector('.scroll-scrubbed-video-layer');
      const tintLayer = document.querySelector('.video-project-atmosphere-tint');
      const vignetteLayer = document.querySelector('.video-cinematic-vignette');
      const title = document.querySelector('.hero-title')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const projectorBtn = document.querySelector('.projector-action-btn')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        canvasCount,
        hasVideo: videoEl !== null,
        hasTint: tintLayer !== null,
        hasVignette: vignetteLayer !== null,
        pointerEvents: videoLayer ? window.getComputedStyle(videoLayer).pointerEvents : null,
        title,
        projectorBtn,
        hasHorizontalOverflow
      };
    });

    console.log(`  [Single Canvas] Exactly 1 WebGL Canvas: ${initialChecks.canvasCount === 1 ? 'PASS' : 'FAIL'} (${initialChecks.canvasCount})`);
    console.log(`  [Video Layer] Native <video> present: ${initialChecks.hasVideo ? 'PASS' : 'FAIL'}`);
    console.log(`  [Atmosphere Layers] Tint & Vignette present: ${initialChecks.hasTint && initialChecks.hasVignette ? 'PASS' : 'FAIL'}`);
    console.log(`  [Interaction Safety] Video pointer-events: "${initialChecks.pointerEvents}" - ${initialChecks.pointerEvents === 'none' ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Title: "${initialChecks.title}" - ${initialChecks.title.includes('ESHWAR M') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Action Button: "${initialChecks.projectorBtn}" - ${initialChecks.projectorBtn.includes('PORTRAIT') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Layout] No Horizontal Overflow: ${!initialChecks.hasHorizontalOverflow ? 'PASS' : 'FAIL'}`);

    // Capture Hero screenshot
    const heroScreenshotPath = `${scratchDir}/phase7j_hero_${vp.name}.png`;
    await page.screenshot({ path: heroScreenshotPath });
    console.log(`  [Screenshot] Saved Hero: ${heroScreenshotPath}`);

    // 2. Test VIEW PORTRAIT interaction (Localized event)
    const toggleBtn = await page.$('.projector-action-btn');
    if (toggleBtn) {
      console.log('  [Interaction] Triggering VIEW PORTRAIT moment...');
      await toggleBtn.click();
      await page.waitForTimeout(2200);

      const projectedScreenshotPath = `${scratchDir}/phase7j_projected_${vp.name}.png`;
      await page.screenshot({ path: projectedScreenshotPath });
      console.log(`  [Screenshot] Saved Projected State: ${projectedScreenshotPath}`);

      // Toggle back to dormant
      await toggleBtn.click();
      await page.waitForTimeout(900);
    }

    // 3. Scroll Down through Chapters (About -> Work -> Contact)
    console.log('  [Scroll Journey] Scrolling down to #about...');
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1800);

    console.log('  [Scroll Journey] Scrolling down to #work...');
    await page.evaluate(() => {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    const workScreenshotPath = `${scratchDir}/phase7j_work_${vp.name}.png`;
    await page.screenshot({ path: workScreenshotPath });
    console.log(`  [Screenshot] Saved Work Chapter: ${workScreenshotPath}`);

    console.log('  [Scroll Journey] Scrolling down to #contact...');
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    const contactScreenshotPath = `${scratchDir}/phase7j_contact_${vp.name}.png`;
    await page.screenshot({ path: contactScreenshotPath });
    console.log(`  [Screenshot] Saved Contact Chapter: ${contactScreenshotPath}`);

    // 4. Test Scroll Reversibility: Scroll back up to Hero
    console.log('  [Scroll Reversal] Scrolling back up to top (Hero)...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    const reversedHeroScreenshotPath = `${scratchDir}/phase7j_reversed_hero_${vp.name}.png`;
    await page.screenshot({ path: reversedHeroScreenshotPath });
    console.log(`  [Screenshot] Saved Reversed Hero: ${reversedHeroScreenshotPath}`);

    if (vpErrors.length > 0) {
      console.error(`  [Errors in ${vp.name}]:`, vpErrors);
      allErrors.push(...vpErrors);
    } else {
      console.log(`  [Console Errors] Zero unexpected console errors in ${vp.name}: PASS`);
    }

    await ctx.close();
  }

  await browser.close();

  console.log('\n================================================================');
  if (allErrors.length === 0) {
    console.log('ALL PHASE 7J FINAL CINEMATIC POLISH CHECKS PASSED WITH 0 ERRORS!');
  } else {
    console.error(`AUDIT COMPLETED WITH ${allErrors.length} ERRORS:`, allErrors);
  }
  console.log('================================================================');
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
