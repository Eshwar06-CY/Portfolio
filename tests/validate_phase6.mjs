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

async function runValidation() {
  console.log('=== STARTING PHASE 6D EXTENDED NEURAL INITIALIZATION VALIDATION ===\n');
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})... Target Init: ${vp.initDuration}ms`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
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

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // --- STAGE AUDIT 1: Early Boot & First Nodes (t = 800ms) ---
    await page.waitForTimeout(800);
    const earlyAudit = await page.evaluate(() => {
      const intro = document.querySelector('.cinematic-intro-root');
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      const ticker = document.querySelector('.intro-diagnostic-ticker');
      const canvas = document.querySelectorAll('canvas');

      const bodyText = document.body.innerText || '';
      const containsPersonalName = /eshwar/i.test(bodyText);
      const containsCollege = /vidyavardhaka|vvce|mysuru/i.test(bodyText);
      const containsProjects = /specra|expenseflowai|capacityx/i.test(bodyText);

      return {
        introExists: !!intro,
        headingExists: !!heading,
        enterBtnExists: !!enterBtn,
        tickerText: ticker?.textContent.trim(),
        containsPersonalName,
        containsCollege,
        containsProjects,
        canvasCount: canvas.length
      };
    });
    console.log('  [Stage 1 & 2 Audit @ 800ms]:', JSON.stringify(earlyAudit));
    const earlyShotPath = path.join(scratchDir, `phase6d_${vp.name}_stage1_nodes.png`);
    await page.screenshot({ path: earlyShotPath });

    // --- STAGE AUDIT 2: Mid-Initialization Neural Formation & Data Propagation ---
    const midTime = Math.round(vp.initDuration * 0.45);
    await page.waitForTimeout(midTime - 800);
    const midAudit = await page.evaluate(() => {
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      const ticker = document.querySelector('.intro-diagnostic-ticker');
      return {
        headingExists: !!heading,
        enterBtnExists: !!enterBtn,
        tickerText: ticker?.textContent.trim()
      };
    });
    console.log(`  [Stage 3 & 4 Audit @ ${midTime}ms]:`, JSON.stringify(midAudit));
    const midShotPath = path.join(scratchDir, `phase6d_${vp.name}_stage4_expansion.png`);
    await page.screenshot({ path: midShotPath });

    // --- STAGE AUDIT 3: System Ready & Convergence ---
    // Wait until full initDuration + 500ms margin has elapsed
    const remainingTime = (vp.initDuration + 500) - midTime;
    await page.waitForTimeout(remainingTime);

    const readyShotPath = path.join(scratchDir, `phase6d_${vp.name}_stage7_ready.png`);
    await page.screenshot({ path: readyShotPath });

    const readyAudit = await page.evaluate(() => {
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      const telemetry = document.querySelector('.intro-telemetry-layer');
      const canvas = document.querySelectorAll('canvas');

      return {
        headingText: heading?.textContent.trim(),
        enterBtnPresent: !!enterBtn,
        enterBtnText: enterBtn?.textContent.replace(/\s+/g, ' ').trim(),
        telemetryPresent: !!telemetry,
        canvasCount: canvas.length,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });
    console.log('  [Stage 7 System Ready Audit]:', JSON.stringify(readyAudit));

    // --- INTERACTION: Click [ ENTER EXPERIENCE ] ---
    const enterBtn = page.locator('.intro-enter-btn');
    const isEnterVisible = await enterBtn.isVisible();
    if (isEnterVisible) {
      await enterBtn.hover();
      await page.waitForTimeout(200);
      await enterBtn.click();
    } else {
      console.warn('Enter button clicked via evaluate fallback');
      await page.evaluate(() => {
        const btn = document.querySelector('.intro-enter-btn');
        btn?.click();
      });
    }

    // Wait for camera to enter the network and capture intermediate pass-through frame
    await page.waitForTimeout(1800);
    const passThroughShotPath = path.join(scratchDir, `phase6f_${vp.name}_camera_passthrough.png`);
    await page.screenshot({ path: passThroughShotPath });

    // Wait for remaining transition + core pass-through + controlled darkness + hero reveal stabilization
    await page.waitForTimeout(2400);

    const heroShotPath = path.join(scratchDir, `phase6f_${vp.name}_hero_entered.png`);
    await page.screenshot({ path: heroShotPath });

    // --- STAGE AUDIT 4: Hero State & Smooth Transition Continuity ---
    const postEnterAudit = await page.evaluate(() => {
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
        introDissolved: !intro || window.getComputedStyle(intro).display === 'none' || parseFloat(window.getComputedStyle(intro).opacity) < 0.1,
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
    console.log('  [Post-Enter Hero Audit]:', JSON.stringify(postEnterAudit));

    const passed = (
      earlyAudit.introExists &&
      !earlyAudit.headingExists &&
      !earlyAudit.enterBtnExists &&
      !earlyAudit.containsPersonalName &&
      !earlyAudit.containsCollege &&
      !earlyAudit.containsProjects &&
      earlyAudit.canvasCount === 1 &&
      !midAudit.headingExists &&
      !midAudit.enterBtnExists &&
      readyAudit.headingText === 'SYSTEM READY' &&
      readyAudit.enterBtnPresent &&
      readyAudit.canvasCount === 1 &&
      !readyAudit.hasOverflow &&
      postEnterAudit.introDissolved &&
      postEnterAudit.navVisible &&
      postEnterAudit.heroVisible &&
      postEnterAudit.titleText.includes('ESHWAR M') &&
      postEnterAudit.portraitVisible &&
      postEnterAudit.canvasCount === 1 &&
      !postEnterAudit.hasOverflow &&
      consoleErrors.length === 0
    );

    console.log(`  >>> Viewport ${vp.name} Result: ${passed ? 'PASS ✓' : 'FAIL ✗'} <<<`);
    if (!passed) {
      console.log('  Failure details:', {
        earlyAudit,
        midAudit,
        readyAudit,
        postEnterAudit,
        consoleErrors
      });
    }

    results.push({ viewport: vp.name, passed, earlyAudit, midAudit, readyAudit, postEnterAudit, consoleErrors });
    await context.close();
  }

  // --- REDUCED MOTION TEST ---
  console.log(`\n======================================================`);
  console.log(`Testing Reduced Motion mode (1440x900)... Target Init: 1600ms`);
  console.log(`======================================================`);
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
  await rmPage.waitForTimeout(2000); // 1.6s init + 400ms margin

  const rmReadyAudit = await rmPage.evaluate(() => {
    const heading = document.querySelector('.intro-monumental-heading');
    const enterBtn = document.querySelector('.intro-enter-btn');
    return {
      headingText: heading?.textContent.trim(),
      enterBtnPresent: !!enterBtn
    };
  });
  console.log('  [Reduced Motion Ready Audit]:', JSON.stringify(rmReadyAudit));

  await rmPage.click('.intro-enter-btn');
  await rmPage.waitForTimeout(800); // Fast dissolve in reduced motion

  const rmPostAudit = await rmPage.evaluate(() => {
    const hero = document.querySelector('#hero');
    const heroStyle = hero ? window.getComputedStyle(hero) : null;
    return {
      heroVisible: !!hero && heroStyle?.visibility === 'visible' && parseFloat(heroStyle?.opacity || '0') > 0.8
    };
  });
  console.log('  [Reduced Motion Post-Enter Audit]:', JSON.stringify(rmPostAudit));

  const rmPassed = rmReadyAudit.headingText === 'SYSTEM READY' && rmReadyAudit.enterBtnPresent && rmPostAudit.heroVisible && rmConsoleErrors.length === 0;
  console.log(`  >>> Reduced Motion Result: ${rmPassed ? 'PASS ✓' : 'FAIL ✗'} <<<`);
  results.push({ viewport: 'reduced_motion', passed: rmPassed });
  await rmContext.close();

  await browser.close();

  console.log('\n=== FINAL SUMMARY ===');
  const allPassed = results.every(r => r.passed);
  console.log(`Total Scenarios: ${results.length}, Passed: ${results.filter(r => r.passed).length}`);
  console.log(`All Tests: ${allPassed ? 'ALL PASSED ✓' : 'SOME FAILED ✗'}`);
}

runValidation().catch(console.error);
