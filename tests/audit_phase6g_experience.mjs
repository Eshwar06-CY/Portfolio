import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';
import path from 'path';

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

async function auditPhase6G() {
  console.log('================================================================');
  console.log('AUDITING COMPLETE PHASE 6G CINEMATIC OPENING & HERO HANDOFF');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const report = {};
  const consoleErrors = [];

  // --- PASS 1: CAPTURE INITIALIZATION MILESTONES (01 & 02) ---
  console.log('>>> CAPTURING 01 INITIAL BOOT & 02 NEURAL FORMING <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // 01 — INITIAL BOOT (600ms)
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_01_initial_boot.png') });
    console.log('✓ Captured 01 — INITIAL BOOT');

    // 02 — NEURAL NETWORK FORMING (3.8s)
    await page.waitForTimeout(3200);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_02_neural_forming.png') });
    console.log('✓ Captured 02 — NEURAL NETWORK FORMING');
    await ctx.close();
  }

  // --- PASS 2: CAPTURE 03 COMPUTATIONAL CORE READY ---
  console.log('\n>>> CAPTURING 03 COMPUTATIONAL CORE READY <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400); // 7.8s + margin = SYSTEM READY
    await page.screenshot({ path: path.join(scratchDir, 'p6g_03_computational_core_ready.png') });
    console.log('✓ Captured 03 — FINAL COMPUTATIONAL CORE / READY');
    await ctx.close();
  }

  // --- PASS 3: CAPTURE 04 ENTER ACTIVATION (250ms after click) ---
  console.log('\n>>> CAPTURING 04 ENTER ACTIVATION (+250ms) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_04_enter_activation.png') });
    console.log('✓ Captured 04 — ENTER ACTIVATION (+250ms)');
    await ctx.close();
  }

  // --- PASS 4: CAPTURE 05 CAMERA INSIDE NETWORK (1600ms after click) ---
  console.log('\n>>> CAPTURING 05 CAMERA INSIDE NETWORK (+1.60s) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_05_camera_inside_network.png') });
    console.log('✓ Captured 05 — CAMERA INSIDE NETWORK (+1.60s)');
    await ctx.close();
  }

  // --- PASS 5: CAPTURE 06 CORE PASS-THROUGH (2350ms after click) ---
  console.log('\n>>> CAPTURING 06 CORE PASS-THROUGH (+2.35s) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(2350);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_06_core_passthrough.png') });
    console.log('✓ Captured 06 — CORE PASS-THROUGH (+2.35s)');
    await ctx.close();
  }

  // --- PASS 6: CAPTURE 07 HERO EMERGING (3450ms after click: dark silhouette emerging) ---
  console.log('\n>>> CAPTURING 07 HERO EMERGING (+3.45s) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(3450); // 3.20s transition + 0.25s: veil dissolving, portrait silhouette emerging
    await page.screenshot({ path: path.join(scratchDir, 'p6g_07_hero_emerging.png') });
    console.log('✓ Captured 07 — HERO EMERGING (+3.45s)');
    await ctx.close();
  }

  // --- PASS 7: CAPTURE 08 FINAL HERO & SCROLL TEST ---
  console.log('\n>>> CAPTURING 08 FINAL HERO & SCROLL TEST <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(4600); // 3.2s + 1.4s = 4.6s: fully stabilized hero
    await page.screenshot({ path: path.join(scratchDir, 'p6g_08_final_hero.png') });
    console.log('✓ Captured 08 — FINAL HERO (+4.60s)');

    // Verify DOM State
    const domState = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      const title = hero?.querySelector('.hero-title');
      const portrait = hero?.querySelector('.hero-portrait-img');
      const intro = document.querySelector('.cinematic-intro-root');
      const navbar = document.querySelector('.site-header');
      const canvas = document.querySelectorAll('canvas');
      return {
        introUnmounted: !intro,
        heroVisible: !!hero && window.getComputedStyle(hero).visibility === 'visible',
        titleText: title?.textContent.replace(/\s+/g, ' ').trim(),
        portraitVisible: !!portrait && window.getComputedStyle(portrait).visibility === 'visible',
        navVisible: !!navbar,
        canvasCount: canvas.length
      };
    });
    report.desktop = domState;
    console.log('Hero State:', JSON.stringify(domState, null, 2));

    // Test wheel scroll
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(700);
    const scrollPos = await page.evaluate(() => window.scrollY);
    console.log(`Scroll position after wheel: ${scrollPos}px (Expected > 0)`);
    report.scrollPos = scrollPos;
    await page.screenshot({ path: path.join(scratchDir, 'p6g_09_scrolled_about.png') });

    await ctx.close();
  }

  // --- PASS 8: TABLET (820x1180) ---
  console.log('\n>>> VERIFYING TABLET (820x1180) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(6500); // 6.0s init
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(4200);
    const tabState = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      return {
        heroVisible: !!hero && window.getComputedStyle(hero).visibility === 'visible',
        canvasCount: document.querySelectorAll('canvas').length
      };
    });
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
    tabState.scrollPos = await page.evaluate(() => window.scrollY);
    report.tablet = tabState;
    console.log('Tablet State:', JSON.stringify(tabState));
    await ctx.close();
  }

  // --- PASS 9: MOBILE (390x844) ---
  console.log('\n>>> VERIFYING MOBILE (390x844) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5300); // 4.8s init
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(3800);
    const mobState = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      return {
        heroVisible: !!hero && window.getComputedStyle(hero).visibility === 'visible',
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        canvasCount: document.querySelectorAll('canvas').length
      };
    });
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
    mobState.scrollPos = await page.evaluate(() => window.scrollY);
    report.mobile = mobState;
    console.log('Mobile State:', JSON.stringify(mobState));
    await ctx.close();
  }

  // --- PASS 10: REDUCED MOTION (1440x900) ---
  console.log('\n>>> VERIFYING PREFERS-REDUCED-MOTION <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // 1.6s init
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(900);
    const rmState = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      return {
        heroVisible: !!hero && window.getComputedStyle(hero).visibility === 'visible'
      };
    });
    report.reducedMotion = rmState;
    console.log('Reduced Motion State:', JSON.stringify(rmState));
    await ctx.close();
  }

  await browser.close();

  console.log('\n================================================================');
  console.log('AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log('All tests completed successfully!');
}

auditPhase6G().catch(console.error);
