import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';
import path from 'path';

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop_1440x900', width: 1440, height: 900, initDuration: 7800 },
  { name: 'tablet_820x1180', width: 820, height: 1180, initDuration: 6000 },
  { name: 'mobile_390x844', width: 390, height: 844, initDuration: 4800 },
  { name: 'mobile_375x812', width: 375, height: 812, initDuration: 4800 }
];

async function runPhase6FVerification() {
  console.log('================================================================');
  console.log('STARTING MANDATORY PHASE 6F BROWSER INTERACTION VERIFICATION');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const reportSummary = [];

  // --- DEDICATED CAMERA TRAVEL & CORE THRESHOLD CAPTURE (DESKTOP) ---
  console.log('\n>>> CAPTURING HIGH-PRECISION TRANSITION MILESTONES (1440x900) <<<');
  {
    // Pass A: Capture at t = 1.60s (Camera entering outer network, lines gaining depth)
    const ctxA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pA = await ctxA.newPage();
    await pA.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await pA.waitForTimeout(8400); // Wait for ready
    const btnA = pA.locator('.intro-enter-btn');
    await btnA.click();
    await pA.waitForTimeout(1600); // Exact 1.60s mark: camera traveling through outer network
    await pA.screenshot({ path: path.join(scratchDir, 'p6f_desktop_1440x900_at_1_60s_camera_entry.png') });
    console.log('✓ Captured milestone frame at t = 1.60s (camera entering network)');
    await ctxA.close();

    // Pass B: Capture at t = 2.10s (Camera approaching computational core aperture bloom)
    const ctxB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pB = await ctxB.newPage();
    await pB.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await pB.waitForTimeout(8400); // Wait for ready
    const btnB = pB.locator('.intro-enter-btn');
    await btnB.click();
    await pB.waitForTimeout(2100); // Exact 2.10s mark: camera approaching core threshold
    await pB.screenshot({ path: path.join(scratchDir, 'p6f_desktop_1440x900_at_2_10s_core_aperture.png') });
    console.log('✓ Captured milestone frame at t = 2.10s (camera approaching core aperture)');
    await ctxB.close();

    // Pass C: Capture at t = 2.38s (Camera passing through core crystal)
    const ctxC = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pC = await ctxC.newPage();
    await pC.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await pC.waitForTimeout(8400); // Wait for ready
    const btnC = pC.locator('.intro-enter-btn');
    await btnC.click();
    await pC.waitForTimeout(2380); // Exact 2.38s mark: passing through core threshold
    await pC.screenshot({ path: path.join(scratchDir, 'p6f_desktop_1440x900_at_2_38s_core_pass.png') });
    console.log('✓ Captured milestone frame at t = 2.38s (camera passing through core)');
    await ctxC.close();

    // Pass D: Capture at t = 2.65s (Controlled darkness before Hero emerges)
    const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pD = await ctxD.newPage();
    await pD.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await pD.waitForTimeout(8400); // Wait for ready
    const btnD = pD.locator('.intro-enter-btn');
    await btnD.click();
    await pD.waitForTimeout(2650); // Exact 2.65s mark: controlled darkness
    await pD.screenshot({ path: path.join(scratchDir, 'p6f_desktop_1440x900_at_2_65s_darkness.png') });
    console.log('✓ Captured milestone frame at t = 2.65s (controlled darkness)');
    await ctxD.close();
  }

  // --- FULL END-TO-END MULTI-VIEWPORT VERIFICATION ---
  for (const vp of VIEWPORTS) {
    console.log(`\n----------------------------------------------------------------`);
    console.log(`>>> VERIFYING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) <<<`);
    console.log(`----------------------------------------------------------------`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      recordVideo: { dir: scratchDir, size: { width: vp.width, height: vp.height } }
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    // 1. Reload page
    console.log('1. Loading http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // 2. Wait until SYSTEM READY appears
    console.log(`2. Waiting for neural initialization (${vp.initDuration + 500}ms)...`);
    await page.waitForTimeout(vp.initDuration + 600);

    const readyCheck = await page.evaluate(() => {
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      const canvas = document.querySelectorAll('canvas');
      return {
        headingText: heading?.textContent.trim(),
        enterBtnPresent: !!enterBtn,
        canvasCount: canvas.length
      };
    });

    console.log('3. Ready State confirmed:', JSON.stringify(readyCheck));
    const readyShotPath = path.join(scratchDir, `p6f_${vp.name}_ready.png`);
    await page.screenshot({ path: readyShotPath });

    // 4. Actually hover & click ENTER EXPERIENCE
    console.log('4. Hovering and clicking real [ ENTER EXPERIENCE ] button...');
    const enterBtn = page.locator('.intro-enter-btn');
    await enterBtn.hover();
    await page.waitForTimeout(200);

    const hoverShotPath = path.join(scratchDir, `p6f_${vp.name}_hover.png`);
    await page.screenshot({ path: hoverShotPath });

    await enterBtn.click();
    console.log('   Click executed! Observing full transition journey...');

    // Wait until transition completes (2.80s) + Hero emergence and stabilization (~1.2s)
    await page.waitForTimeout(4000);
    const heroShotPath = path.join(scratchDir, `p6f_${vp.name}_hero_revealed.png`);
    await page.screenshot({ path: heroShotPath });

    // 6. Confirm Hero appears and overlay is completely removed
    const postEnterCheck = await page.evaluate(() => {
      const intro = document.querySelector('.cinematic-intro-root');
      const navbar = document.querySelector('.site-header');
      const hero = document.querySelector('#hero');
      const title = hero?.querySelector('.hero-title');
      const portrait = hero?.querySelector('.hero-portrait-img');
      const exploreBtn = hero?.querySelector('.scroll-indicator-button');
      const canvas = document.querySelectorAll('canvas');

      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      const titleStyle = title ? window.getComputedStyle(title) : null;
      const portraitStyle = portrait ? window.getComputedStyle(portrait) : null;

      return {
        introUnmounted: !intro,
        navVisible: !!navbar,
        heroVisible: !!hero && heroStyle?.visibility === 'visible' && parseFloat(heroStyle?.opacity || '0') > 0.8,
        titleText: title?.textContent.replace(/\s+/g, ' ').trim(),
        titleVisible: titleStyle?.visibility === 'visible' && parseFloat(titleStyle?.opacity || '0') > 0.8,
        portraitVisible: !!portrait && portraitStyle?.visibility === 'visible',
        exploreBtnPresent: !!exploreBtn,
        canvasCount: canvas.length,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('6. Hero Reveal confirmed:', JSON.stringify(postEnterCheck));

    // 7. Test scrolling to verify NO permanent scroll lock
    console.log('7. Testing scroll interaction...');
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
    const scrollPos = await page.evaluate(() => window.scrollY);
    console.log(`   Scroll position after wheel down: ${scrollPos}px (Expected > 0)`);
    const scrollWorks = scrollPos > 50;

    const scrolledShotPath = path.join(scratchDir, `p6f_${vp.name}_scrolled.png`);
    await page.screenshot({ path: scrolledShotPath });

    const passed = (
      readyCheck.headingText === 'SYSTEM READY' &&
      readyCheck.enterBtnPresent &&
      readyCheck.canvasCount === 1 &&
      postEnterCheck.introUnmounted &&
      postEnterCheck.navVisible &&
      postEnterCheck.heroVisible &&
      postEnterCheck.titleText.includes('ESHWAR M') &&
      postEnterCheck.portraitVisible &&
      postEnterCheck.canvasCount === 1 &&
      !postEnterCheck.hasOverflow &&
      scrollWorks &&
      consoleErrors.length === 0
    );

    console.log(`\n>>> VIEWPORT ${vp.name} RESULT: ${passed ? 'PASS ✓' : 'FAIL ✗'} <<<`);
    reportSummary.push({
      viewport: vp.name,
      passed,
      readyCheck,
      postEnterCheck,
      scrollPos,
      scrollWorks,
      consoleErrors
    });

    await context.close();
  }

  // --- REDUCED MOTION TEST ---
  console.log(`\n----------------------------------------------------------------`);
  console.log(`>>> VERIFYING PREFERS-REDUCED-MOTION (1440x900) <<<`);
  console.log(`----------------------------------------------------------------`);
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const rmPage = await rmContext.newPage();
  const rmConsoleErrors = [];
  rmPage.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) {
      rmConsoleErrors.push(msg.text());
    }
  });

  await rmPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await rmPage.waitForTimeout(2000); // 1.6s init + margin

  const rmReady = await rmPage.evaluate(() => {
    const heading = document.querySelector('.intro-monumental-heading');
    const enterBtn = document.querySelector('.intro-enter-btn');
    return {
      headingText: heading?.textContent.trim(),
      enterBtnPresent: !!enterBtn
    };
  });

  await rmPage.click('.intro-enter-btn');
  await rmPage.waitForTimeout(900); // Fast fade in reduced motion

  const rmHero = await rmPage.evaluate(() => {
    const hero = document.querySelector('#hero');
    const heroStyle = hero ? window.getComputedStyle(hero) : null;
    return {
      heroVisible: !!hero && heroStyle?.visibility === 'visible' && parseFloat(heroStyle?.opacity || '0') > 0.8
    };
  });

  await rmPage.mouse.wheel(0, 800);
  await rmPage.waitForTimeout(600);
  const rmScrollPos = await rmPage.evaluate(() => window.scrollY);
  const rmScrollWorks = rmScrollPos > 50;

  const rmPassed = rmReady.headingText === 'SYSTEM READY' && rmReady.enterBtnPresent && rmHero.heroVisible && rmScrollWorks && rmConsoleErrors.length === 0;
  console.log(`>>> REDUCED MOTION RESULT: ${rmPassed ? 'PASS ✓' : 'FAIL ✗'} <<<`);

  reportSummary.push({
    viewport: 'reduced_motion',
    passed: rmPassed,
    rmReady,
    rmHero,
    rmScrollPos,
    rmScrollWorks,
    consoleErrors: rmConsoleErrors
  });

  await rmContext.close();
  await browser.close();

  console.log('\n================================================================');
  console.log('FINAL VERIFICATION SUMMARY');
  console.log('================================================================');
  const allPassed = reportSummary.every(r => r.passed);
  console.log(`Total Scenarios: ${reportSummary.length}`);
  console.log(`Passed: ${reportSummary.filter(r => r.passed).length}`);
  console.log(`Failed: ${reportSummary.filter(r => !r.passed).length}`);
  console.log(`Overall: ${allPassed ? 'ALL VERIFICATIONS PASSED ✓' : 'SOME VERIFICATIONS FAILED ✗'}`);
}

runPhase6FVerification().catch(console.error);
