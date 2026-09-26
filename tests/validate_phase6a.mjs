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
  console.log('--- STARTING PHASE 6A PLAYWRIGHT VALIDATION ---');
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

    // Wait 2.2s for entrance choreography (8 beats) to complete
    await page.waitForTimeout(2200);

    // Capture Hero screenshot
    const heroShotPath = path.join(scratchDir, `phase6a_${vp.name}_hero.png`);
    await page.screenshot({ path: heroShotPath });

    // Audit Hero state
    const heroAudit = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      const title = hero?.querySelector('.hero-title');
      const words = Array.from(hero?.querySelectorAll('.hero-title-word') || []).map(w => w.textContent.trim());
      const portrait = hero?.querySelector('.hero-portrait-img');
      const telemetry = hero?.querySelector('.hero-system-telemetry');
      const role = hero?.querySelector('.hero-role');
      const statement = hero?.querySelector('.hero-supporting-line');
      const exploreBtn = hero?.querySelector('.scroll-indicator-button');
      const canvases = document.querySelectorAll('canvas');

      const titleStyle = title ? window.getComputedStyle(title) : null;
      const portraitStyle = portrait ? window.getComputedStyle(portrait) : null;
      const hasOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

      return {
        exists: !!hero,
        titleText: title?.textContent.replace(/\s+/g, ' ').trim(),
        words,
        titleVisible: titleStyle?.visibility === 'visible' && parseFloat(titleStyle?.opacity || '0') > 0.8,
        portraitVisible: !!portrait && portraitStyle?.visibility === 'visible',
        telemetryPresent: !!telemetry,
        rolePresent: !!role,
        statementPresent: !!statement,
        exploreBtnPresent: !!exploreBtn,
        canvasCount: canvases.length,
        hasOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    console.log(`  Hero Audit:`, JSON.stringify(heroAudit));

    // Test Explore interaction and smooth scroll into About
    const exploreBtn = page.locator('.scroll-indicator-button');
    if (await exploreBtn.isVisible()) {
      await exploreBtn.hover();
      await page.waitForTimeout(300);
      await exploreBtn.click();
    } else {
      await page.evaluate(() => {
        document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Wait for smooth Lenis scroll and About entry timeline to settle
    await page.waitForTimeout(1600);

    // Capture About screenshot
    const aboutShotPath = path.join(scratchDir, `phase6a_${vp.name}_about.png`);
    await page.screenshot({ path: aboutShotPath });

    // Audit About state
    const aboutAudit = await page.evaluate(() => {
      const about = document.querySelector('#about');
      const statement = about?.querySelector('.asymmetric-statement');
      const row1 = about?.querySelector('.statement-row.row-1');
      const row2 = about?.querySelector('.statement-row.row-2');
      const row3 = about?.querySelector('.statement-row.row-3');
      const chips = Array.from(about?.querySelectorAll('.pillar-chip') || []).map(c => c.textContent.replace(/\s+/g, ' ').trim());
      const hairline = about?.querySelector('.about-opening-hairline-fill');

      const r1Style = row1 ? window.getComputedStyle(row1) : null;
      const r2Style = row2 ? window.getComputedStyle(row2) : null;
      const r3Style = row3 ? window.getComputedStyle(row3) : null;
      const hasOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

      const fullStatementText = [row1?.textContent.trim(), row2?.textContent.trim(), row3?.textContent.trim()].filter(Boolean).join(' ');

      return {
        exists: !!about,
        statementText: fullStatementText,
        ariaLabel: statement?.getAttribute('aria-label'),
        row1Text: row1?.textContent.trim(),
        row2Text: row2?.textContent.trim(),
        row3Text: row3?.textContent.trim(),
        row1Visible: r1Style?.visibility === 'visible' && parseFloat(r1Style?.opacity || '0') > 0.8,
        row2Visible: r2Style?.visibility === 'visible' && parseFloat(r2Style?.opacity || '0') > 0.8,
        row3Visible: r3Style?.visibility === 'visible' && parseFloat(r3Style?.opacity || '0') > 0.8,
        chipsCount: chips.length,
        chips,
        hairlinePresent: !!hairline,
        hasOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    console.log(`  About Audit:`, JSON.stringify(aboutAudit));

    const passed = (
      heroAudit.exists &&
      heroAudit.titleText.includes('ESHWAR M') &&
      heroAudit.titleVisible &&
      heroAudit.canvasCount === 1 &&
      !heroAudit.hasOverflow &&
      aboutAudit.exists &&
      aboutAudit.statementText === 'I BUILD THINGS THAT SOLVE PROBLEMS.' &&
      aboutAudit.chipsCount === 4 &&
      !aboutAudit.hasOverflow &&
      consoleErrors.length === 0
    );

    console.log(`  Result for ${vp.name}: ${passed ? 'PASS ✓' : 'FAIL ✗'}`);
    results.push({ viewport: vp.name, passed, heroAudit, aboutAudit, consoleErrors });

    await context.close();
  }

  // Test reduced motion mode
  console.log('\nTesting prefers-reduced-motion: reduce...');
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await rmPage.waitForTimeout(600);

  const rmAudit = await rmPage.evaluate(() => {
    const title = document.querySelector('.hero-title');
    const statement = document.querySelector('.asymmetric-statement');
    const canvases = document.querySelectorAll('canvas');
    const tStyle = window.getComputedStyle(title);
    const sStyle = window.getComputedStyle(statement);
    return {
      titleVisible: tStyle.visibility === 'visible' && parseFloat(tStyle.opacity) > 0.8,
      statementVisible: sStyle.visibility === 'visible',
      canvasCount: canvases.length
    };
  });
  console.log('  Reduced Motion Audit:', JSON.stringify(rmAudit));
  const rmPassed = rmAudit.titleVisible && rmAudit.statementVisible && rmAudit.canvasCount === 1;
  console.log(`  Reduced Motion Result: ${rmPassed ? 'PASS ✓' : 'FAIL ✗'}`);

  await rmContext.close();
  await browser.close();

  const allPassed = results.every(r => r.passed) && rmPassed;
  console.log(`\n==================================================`);
  console.log(`OVERALL PHASE 6A PLAYWRIGHT VALIDATION: ${allPassed ? 'ALL PASSED (100% GREEN)' : 'FAILED'}`);
  console.log(`==================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

runValidation().catch(err => {
  console.error('Validation Script Error:', err);
  process.exit(1);
});
