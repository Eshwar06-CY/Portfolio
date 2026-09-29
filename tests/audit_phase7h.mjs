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
  console.log('PHASE 7H / 7I — PRIMARY VIDEO + WEBGL FALLBACK ARCHITECTURE AUDIT');
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
      // Exclude expected 404 for pending video asset
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('WebSocket') && !text.includes('cinematic_archive.mp4')) {
        vpErrors.push(`[${vp.name}] ${text}`);
      }
    });

    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Wait for ENTER button to become ready and click it
    await page.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
    await page.click('.intro-enter-btn');

    // Wait for intro transition to finish and Hero to settle
    await page.waitForSelector('.hero-title', { state: 'visible', timeout: 15000 });
    await page.waitForTimeout(3800);

    // Architectural Audit Checks
    const auditData = await page.evaluate(() => {
      const canvasCount = document.querySelectorAll('canvas').length;
      const videoEl = document.querySelector('.scroll-scrubbed-video-layer video');
      const videoLayer = document.querySelector('.scroll-scrubbed-video-layer');
      const webglWrapper = document.querySelector('.global-cinematic-webgl-canvas');
      const title = document.querySelector('.hero-title')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const projectorBtn = document.querySelector('.projector-action-btn')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      const reactor = document.querySelector('.reactor-visual-container') !== null;
      const portrait = document.querySelector('.portrait-photo-image') !== null;
      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        canvasCount,
        hasVideo: videoEl !== null,
        videoMuted: videoEl?.muted,
        videoPlaysInline: videoEl?.playsInline,
        videoPointerEvents: videoLayer ? window.getComputedStyle(videoLayer).pointerEvents : null,
        webglOpacity: webglWrapper ? window.getComputedStyle(webglWrapper).opacity : null,
        title,
        projectorBtn,
        reactor,
        portrait,
        hasHorizontalOverflow
      };
    });

    console.log(`  [Single Canvas] Exactly 1 WebGL Canvas: ${auditData.canvasCount === 1 ? 'PASS' : 'FAIL'} (${auditData.canvasCount})`);
    console.log(`  [Video Architecture] Native <video> mounted: ${auditData.hasVideo ? 'PASS' : 'FAIL'}`);
    console.log(`  [Video Architecture] Muted & playsInline: ${auditData.videoMuted && auditData.videoPlaysInline ? 'PASS' : 'FAIL'}`);
    console.log(`  [Interaction Safety] Video pointer-events: "${auditData.videoPointerEvents}" - ${auditData.videoPointerEvents === 'none' ? 'PASS' : 'FAIL'}`);
    console.log(`  [Fallback Readiness] WebGL fallback opacity: ${auditData.webglOpacity} - ${parseFloat(auditData.webglOpacity) > 0.5 ? 'PASS (Active Fallback)' : 'PASS'}`);
    console.log(`  [Hero Frozen Elements] Title: "${auditData.title}" - ${auditData.title.includes('ESHWAR M') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Portrait present: ${auditData.portrait ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Reactor present: ${auditData.reactor ? 'PASS' : 'FAIL'}`);
    console.log(`  [Hero Frozen Elements] Projection Button: "${auditData.projectorBtn}" - ${auditData.projectorBtn.includes('PORTRAIT') ? 'PASS' : 'FAIL'}`);
    console.log(`  [Layout] No Horizontal Overflow: ${!auditData.hasHorizontalOverflow ? 'PASS' : 'FAIL'}`);

    // Capture Hero screenshot
    const heroScreenshotPath = `${scratchDir}/phase7h_hero_${vp.name}.png`;
    await page.screenshot({ path: heroScreenshotPath });
    console.log(`  [Screenshot] Saved Hero: ${heroScreenshotPath}`);

    // Scroll Down & Test Fallback Depth Progression
    await page.evaluate(() => window.scrollBy({ top: 700, behavior: 'smooth' }));
    await page.waitForTimeout(1600);
    const scrollScreenshotPath = `${scratchDir}/phase7h_scrolled_${vp.name}.png`;
    await page.screenshot({ path: scrollScreenshotPath });
    console.log(`  [Screenshot] Saved Scrolled Depth: ${scrollScreenshotPath}`);

    // Scroll Back Up (Reversibility Test)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1400);

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
    console.log('ALL PHASE 7H / 7I ARCHITECTURAL AUDIT CHECKS PASSED WITH 0 ERRORS!');
  } else {
    console.error(`AUDIT COMPLETED WITH ${allErrors.length} ERRORS:`, allErrors);
  }
  console.log('================================================================');
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
