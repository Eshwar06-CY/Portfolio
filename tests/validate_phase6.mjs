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
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'tablet_820x1180', width: 820, height: 1180 },
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'mobile_375x812', width: 375, height: 812 }
];

async function runValidation() {
  console.log('=== STARTING PHASE 6 CINEMATIC INTRO VALIDATION ===\n');
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
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

    // 1. Initial State Audit: Check for complete anonymity before entering
    const preEnterAudit = await page.evaluate(() => {
      const intro = document.querySelector('.cinematic-intro-root');
      const navbar = document.querySelector('.site-header');
      const hero = document.querySelector('#hero');
      const portrait = document.querySelector('.hero-portrait-img');
      const canvas = document.querySelectorAll('canvas');

      // Check for personal leaks in visible DOM
      const bodyText = document.body.innerText || '';
      const containsPersonalName = /eshwar/i.test(bodyText);
      const containsCollege = /vidyavardhaka|vvce|mysuru/i.test(bodyText);
      const containsProjects = /specra|expenseflowai|capacityx/i.test(bodyText);

      const navVisible = !!navbar && window.getComputedStyle(navbar).display !== 'none';
      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      const heroVisible = !!hero && heroStyle?.visibility === 'visible' && parseFloat(heroStyle?.opacity || '0') > 0.5;

      return {
        introExists: !!intro,
        containsPersonalName,
        containsCollege,
        containsProjects,
        navVisible,
        heroVisible,
        canvasCount: canvas.length,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('  Pre-Enter Anonymity Audit:', JSON.stringify(preEnterAudit));

    // Wait for the intro to settle into 'ready' state (1.9s)
    await page.waitForTimeout(2000);

    // Capture Intro screenshot
    const introShotPath = path.join(scratchDir, `phase6_${vp.name}_intro_ready.png`);
    await page.screenshot({ path: introShotPath });

    // Audit Ready State elements
    const readyAudit = await page.evaluate(() => {
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      const telemetry = document.querySelector('.intro-telemetry-layer');

      return {
        headingText: heading?.textContent.trim(),
        enterBtnPresent: !!enterBtn,
        enterBtnText: enterBtn?.textContent.replace(/\s+/g, ' ').trim(),
        telemetryPresent: !!telemetry,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('  Ready State Audit:', JSON.stringify(readyAudit));

    // 2. Test Hover & Click on [ ENTER EXPERIENCE ]
    const enterBtn = page.locator('.intro-enter-btn');
    const isEnterVisible = await enterBtn.isVisible();
    if (isEnterVisible) {
      await enterBtn.hover();
      await page.waitForTimeout(250);
      await enterBtn.click();
    } else {
      console.warn('Enter button not found via locator, clicking via evaluate');
      await page.evaluate(() => {
        const btn = document.querySelector('.intro-enter-btn');
        btn?.click();
      });
    }

    // Wait for the full 3.0s cinematic sequence (1.8s core hyperjump + 1.2s hero reveal stabilization)
    await page.waitForTimeout(3200);

    // Capture Post-Enter Hero screenshot
    const heroShotPath = path.join(scratchDir, `phase6_${vp.name}_hero_entered.png`);
    await page.screenshot({ path: heroShotPath });

    // 3. Audit Post-Enter Hero State
    const postEnterAudit = await page.evaluate(() => {
      const intro = document.querySelector('.cinematic-intro-root');
      const navbar = document.querySelector('.site-header');
      const hero = document.querySelector('#hero');
      const title = hero?.querySelector('.hero-title');
      const portrait = hero?.querySelector('.hero-portrait-img');
      const exploreBtn = hero?.querySelector('.scroll-indicator-button');

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
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('  Post-Enter Hero Audit:', JSON.stringify(postEnterAudit));

    const passed = (
      preEnterAudit.introExists &&
      !preEnterAudit.containsPersonalName &&
      !preEnterAudit.containsCollege &&
      !preEnterAudit.containsProjects &&
      !preEnterAudit.navVisible &&
      preEnterAudit.canvasCount === 1 &&
      !preEnterAudit.hasOverflow &&
      readyAudit.headingText === 'SYSTEM READY' &&
      readyAudit.enterBtnPresent &&
      !readyAudit.hasOverflow &&
      postEnterAudit.introDissolved &&
      postEnterAudit.navVisible &&
      postEnterAudit.heroVisible &&
      postEnterAudit.titleText.includes('ESHWAR M') &&
      postEnterAudit.portraitVisible &&
      !postEnterAudit.hasOverflow &&
      consoleErrors.length === 0
    );

    console.log(`  Result for ${vp.name}: ${passed ? 'PASS ✓' : 'FAIL ✗'}`);
    if (!passed) {
      console.log('  Failure reasons:', {
        preEnterAudit,
        readyAudit,
        postEnterAudit,
        consoleErrors
      });
    }
    results.push({ viewport: vp.name, passed, preEnterAudit, readyAudit, postEnterAudit, consoleErrors });

    await context.close();
  }

  // 4. Test prefers-reduced-motion: reduce
  console.log('\nTesting prefers-reduced-motion: reduce...');
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await rmPage.waitForTimeout(400);

  const rmAudit = await rmPage.evaluate(() => {
    const heading = document.querySelector('.intro-monumental-heading');
    const enterBtn = document.querySelector('.intro-enter-btn');
    const canvas = document.querySelectorAll('canvas');

    return {
      headingText: heading?.textContent.trim(),
      enterBtnPresent: !!enterBtn,
      canvasCount: canvas.length
    };
  });

  console.log('  Reduced Motion Audit:', JSON.stringify(rmAudit));

  // Trigger enter in reduced motion
  const rmBtn = rmPage.locator('.intro-enter-btn');
  if (await rmBtn.isVisible()) {
    await rmBtn.click();
  }
  await rmPage.waitForTimeout(600);

  const rmPostAudit = await rmPage.evaluate(() => {
    const hero = document.querySelector('#hero');
    const title = hero?.querySelector('.hero-title');
    return {
      heroVisible: !!hero && window.getComputedStyle(hero).visibility === 'visible',
      titleText: title?.textContent.replace(/\s+/g, ' ').trim()
    };
  });

  console.log('  Reduced Motion Post-Enter Audit:', JSON.stringify(rmPostAudit));
  const rmPassed = rmAudit.headingText === 'SYSTEM READY' && rmAudit.enterBtnPresent && rmPostAudit.heroVisible;
  console.log(`  Reduced Motion Result: ${rmPassed ? 'PASS ✓' : 'FAIL ✗'}`);

  await rmContext.close();
  await browser.close();

  const allPassed = results.every(r => r.passed) && rmPassed;
  console.log(`\n==================================================`);
  console.log(`OVERALL PHASE 6 PLAYWRIGHT VALIDATION: ${allPassed ? 'ALL PASSED (100% GREEN)' : 'FAILED'}`);
  console.log(`==================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

runValidation().catch(err => {
  console.error('Validation Script Error:', err);
  process.exit(1);
});
