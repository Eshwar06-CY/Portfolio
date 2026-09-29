import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import path from 'path';

const VIEWPORTS = [
  { name: '1440x900_desktop', width: 1440, height: 900 },
  { name: '1280x800_laptop', width: 1280, height: 800 },
  { name: '1024x768_tablet_landscape', width: 1024, height: 768 },
  { name: '820x1180_tablet_portrait', width: 820, height: 1180 },
  { name: '390x844_mobile', width: 390, height: 844 }
];

async function runAudit() {
  console.log('--- STARTING PHASE 8 COMPREHENSIVE CINEMATIC MOTION & HUD AUDIT ---');
  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
    });

    try {
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      // Handle Intro Screen: wait for ready and click ENTER EXPERIENCE
      try {
        const enterBtn = page.locator('.intro-enter-btn');
        await enterBtn.waitFor({ state: 'visible', timeout: 9000 });
        await enterBtn.click();
        console.log(`  [Intro]: Clicked ENTER EXPERIENCE`);
      } catch (e) {
        // Fallback: trigger Enter key
        await page.keyboard.press('Enter');
        console.log(`  [Intro]: Triggered Enter key`);
      }
      // Wait for neural transition through core into Hero
      await page.waitForTimeout(2500);

      // 1. Check for blank screen
      const rootText = await page.textContent('#root');
      if (!rootText || rootText.trim().length === 0) {
        throw new Error('Blank screen detected at #root!');
      }

      // 2. Check Hero Entrance Elements
      const heroTitle = await page.locator('.hero-title');
      const isHeroVisible = await heroTitle.isVisible();
      console.log(`  [Hero Title Visible]: ${isHeroVisible}`);

      if (vp.name === '1440x900_desktop') {
        await page.screenshot({ path: 'tests/audit_p8_desktop_hero.png', fullPage: false });
        console.log(`  [Screenshot saved]: tests/audit_p8_desktop_hero.png`);
      }

      // 3. Inspect Selected Work section
      // Scroll down to Selected Work
      const workSection = page.locator('#work, .project-showcase-section, .project-reel-container').first();
      await workSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // Verify Redundant HUD is completely eliminated
      const hudTop = await page.locator('.reel-hud-top').count();
      const hudBottom = await page.locator('.reel-hud-bottom').count();
      const duplicateProjectReel = await page.locator('text="PROJECT_REEL"').count();
      const duplicateScrollToAdvance = await page.locator('text="SCROLL TO ADVANCE"').count();
      const slideNumEyebrow = await page.locator('.slide-num-eyebrow').count();
      const telemetryStrip = await page.locator('.slide-micro-telemetry-strip').count();

      console.log(`  [Redundant HUD Top Count]: ${hudTop} (expected 0)`);
      console.log(`  [Redundant HUD Bottom Count]: ${hudBottom} (expected 0)`);
      console.log(`  [PROJECT_REEL Count]: ${duplicateProjectReel} (expected 0)`);
      console.log(`  [SCROLL TO ADVANCE Count]: ${duplicateScrollToAdvance} (expected 0)`);
      console.log(`  [Slide Number Eyebrow Count]: ${slideNumEyebrow} (expected 0)`);
      console.log(`  [Micro Telemetry Strip Count]: ${telemetryStrip} (expected 0)`);

      if (hudTop > 0 || hudBottom > 0 || duplicateProjectReel > 0 || duplicateScrollToAdvance > 0 || slideNumEyebrow > 0 || telemetryStrip > 0) {
        console.error(`  FAIL: Found leftover HUD elements in ${vp.name}!`);
        hasErrors = true;
      } else {
        console.log(`  PASS: Selected Work HUD & telemetry noise 100% eliminated!`);
      }

      // 4. Verify Project Content is intact
      const specraTitle = await page.locator('h3:has-text("SPECra")').first();
      const isSpecraVisible = await specraTitle.isVisible();
      console.log(`  [SPECra Project Title Intact]: ${isSpecraVisible}`);

      // Check statement
      const specraTagline = await page.locator('text=/Turn Messy Industrial Catalogs/i').first();
      const isTaglinePresent = (await specraTagline.count()) > 0;
      console.log(`  [SPECra Statement Intact]: ${isTaglinePresent}`);

      // Check CTA
      const viewProjectBtn = await page.locator('a:has-text("VIEW PROJECT")').first();
      const isCtaPresent = (await viewProjectBtn.count()) > 0;
      console.log(`  [VIEW PROJECT CTA Intact]: ${isCtaPresent}`);

      // 5. Check Horizontal Overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      console.log(`  [Horizontal Overflow Detected]: ${overflow}`);
      if (overflow) {
        console.error(`  FAIL: Horizontal overflow detected in ${vp.name}!`);
        hasErrors = true;
      }

      // 6. Capture Screenshots
      if (vp.name === '1440x900_desktop') {
        await page.screenshot({ path: 'tests/audit_p8_desktop_work.png', fullPage: false });
        console.log(`  [Screenshot saved]: tests/audit_p8_desktop_work.png`);
      } else if (vp.name === '390x844_mobile') {
        await page.screenshot({ path: 'tests/audit_p8_mobile_work.png', fullPage: false });
        console.log(`  [Screenshot saved]: tests/audit_p8_mobile_work.png`);
      }

      // 7. Check for Console Errors
      if (consoleErrors.length > 0) {
        console.error(`  [Console Errors]:`, consoleErrors);
        hasErrors = true;
      } else {
        console.log(`  [Console Errors]: 0`);
      }

    } catch (err) {
      console.error(`  ERROR testing ${vp.name}:`, err);
      hasErrors = true;
    } finally {
      await context.close();
    }
  }

  await browser.close();

  if (hasErrors) {
    console.error('\n--- AUDIT FAILED WITH ISSUES ---');
    process.exit(1);
  } else {
    console.log('\n--- ALL AUDIT CHECKS PASSED PERFECTLY (100% CLEAN) ---');
    process.exit(0);
  }
}

runAudit();
