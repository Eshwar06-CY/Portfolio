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
  console.log('PHASE 7B FINAL RESET — VISUAL AUDIT & VERIFICATION');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ==========================================================================
  // VIEWPORT 1: DESKTOP 1440 x 900
  // ==========================================================================
  console.log('>>> [1/5] DESKTOP 1440x900 INTERACTION FLOW <<<');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[desktop] ${m.text()}`); 
  });

  await page.goto(URL, { waitUntil: 'networkidle' });
  console.log('  Page loaded. Waiting for initialization sequence...');
  await page.waitForTimeout(9000);

  // Click ENTER EXPERIENCE
  await page.click('.intro-enter-btn');
  console.log('  Clicked ENTER EXPERIENCE. Waiting for Hero entrance...');
  await page.waitForTimeout(4000);

  // Check Canvas count: MUST BE EXACTLY 1
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log(`  Canvas count: ${canvasCount} (expected: 1 — GlobalCinematicScene only)`);

  // TEST 1: Initial State — Projector MUST BE OFF
  const initialCheck = await page.evaluate(() => {
    const sys = document.querySelector('.projector-portrait-system');
    const photo = document.querySelector('.portrait-photo-layer');
    const holo = document.querySelector('.portrait-hologram-layer');
    const btn = document.querySelector('.projector-toggle-btn');
    const beam = document.querySelector('.projector-beam-column');
    const pedestal = document.querySelector('.projector-chassis-unit');

    return {
      isOff: sys ? sys.classList.contains('sys--off') : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      photoOpacity: photo ? getComputedStyle(photo).opacity : '0',
      holoOpacity: holo ? getComputedStyle(holo).opacity : '1',
      beamOpacity: beam ? getComputedStyle(beam).opacity : '1',
      pedestalExists: !!pedestal,
    };
  });

  console.log('  [TEST 1] Initial State (Projector OFF):');
  console.log(`    Mode is off: ${initialCheck.isOff ? 'PASS' : 'FAIL'}`);
  console.log(`    Button label: "${initialCheck.btnLabel}" (expected PORTRAIT // ACTIVATE)`);
  console.log(`    Approved photo opacity: ${initialCheck.photoOpacity} (expected 1)`);
  console.log(`    Hologram opacity: ${initialCheck.holoOpacity} (expected 0)`);
  console.log(`    Volumetric beam opacity: ${initialCheck.beamOpacity} (expected 0)`);

  await page.screenshot({ path: `${scratchDir}/reset_01_hero_projector_off.png` });

  // TEST 2: Click PORTRAIT // ACTIVATE -> Sequence starts
  console.log('\n  [TEST 2] Clicking PORTRAIT // ACTIVATE...');
  await page.click('.projector-toggle-btn');
  
  // Mid-sequence check (~800ms)
  await page.waitForTimeout(800);
  const midCheck = await page.evaluate(() => {
    const sys = document.querySelector('.projector-portrait-system');
    const beam = document.querySelector('.projector-beam-column');
    return {
      phase: sys ? sys.getAttribute('data-phase') : '',
      beamOpacity: beam ? parseFloat(getComputedStyle(beam).opacity) : 0,
    };
  });
  console.log(`    Mid-sequence phase: ${midCheck.phase}`);
  console.log(`    Beam rising: ${midCheck.beamOpacity > 0 ? 'PASS' : 'FAIL'} (${midCheck.beamOpacity})`);

  await page.screenshot({ path: `${scratchDir}/reset_02_projector_activating.png` });

  // TEST 3: Stabilization (~2s after click)
  console.log('\n  [TEST 3] Waiting for hologram to stabilize above projector...');
  await page.waitForTimeout(1600);

  const activeCheck = await page.evaluate(() => {
    const sys = document.querySelector('.projector-portrait-system');
    const btn = document.querySelector('.projector-toggle-btn');
    const photo = document.querySelector('.portrait-photo-layer');
    const holo = document.querySelector('.portrait-hologram-layer');
    const beam = document.querySelector('.projector-beam-column');
    const stageInner = document.querySelector('.projector-portrait-stage-inner');

    return {
      isActive: sys ? sys.classList.contains('sys--active') : false,
      phase: sys ? sys.getAttribute('data-phase') : '',
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      photoOpacity: photo ? parseFloat(getComputedStyle(photo).opacity) : 1,
      holoOpacity: holo ? parseFloat(getComputedStyle(holo).opacity) : 0,
      beamOpacity: beam ? parseFloat(getComputedStyle(beam).opacity) : 0,
      transform: stageInner ? getComputedStyle(stageInner).transform : '',
    };
  });

  console.log(`    Active state: ${activeCheck.isActive ? 'PASS' : 'FAIL'} (phase: ${activeCheck.phase})`);
  console.log(`    Button label: "${activeCheck.btnLabel}" (expected PORTRAIT // DEACTIVATE)`);
  console.log(`    Hologram opacity: ${activeCheck.holoOpacity} (expected 1)`);
  console.log(`    Volumetric column opacity: ${activeCheck.beamOpacity} (expected 1)`);
  console.log(`    Physical lift transform: ${activeCheck.transform}`);

  await page.screenshot({ path: `${scratchDir}/reset_03_hologram_active_floating.png` });

  // TEST 4: Deactivate Projection
  console.log('\n  [TEST 4] Clicking PORTRAIT // DEACTIVATE...');
  await page.click('.projector-toggle-btn');
  await page.waitForTimeout(1200); // Wait for graceful deactivation

  const deactivatedCheck = await page.evaluate(() => {
    const sys = document.querySelector('.projector-portrait-system');
    const btn = document.querySelector('.projector-toggle-btn');
    const photo = document.querySelector('.portrait-photo-layer');
    const holo = document.querySelector('.portrait-hologram-layer');
    const beam = document.querySelector('.projector-beam-column');

    return {
      isOff: sys ? sys.classList.contains('sys--off') : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      photoOpacity: photo ? parseFloat(getComputedStyle(photo).opacity) : 0,
      holoOpacity: holo ? parseFloat(getComputedStyle(holo).opacity) : 1,
      beamOpacity: beam ? parseFloat(getComputedStyle(beam).opacity) : 1,
    };
  });

  console.log(`    Deactivated cleanly: ${deactivatedCheck.isOff ? 'PASS' : 'FAIL'}`);
  console.log(`    Button label: "${deactivatedCheck.btnLabel}" (expected PORTRAIT // ACTIVATE)`);
  console.log(`    Approved photo restored: ${deactivatedCheck.photoOpacity === 1 ? 'PASS' : 'FAIL'}`);
  console.log(`    Hologram hidden: ${deactivatedCheck.holoOpacity === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`    Beam hidden: ${deactivatedCheck.beamOpacity === 0 ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/reset_04_projector_deactivated.png` });

  // TEST 5: Verify Scroll Functionality
  console.log('\n  [TEST 5] Verifying page scrolling after Hero...');
  await page.mouse.move(500, 400);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1200);
  const scrollY = await page.evaluate(() => {
    return window.scrollY || (window.lenis ? Math.round(window.lenis.scroll) : 0);
  });
  console.log(`    Scroll position: ${scrollY}px (${scrollY > 0 ? 'PASS' : 'FAIL'})`);

  await ctx.close();

  // ==========================================================================
  // VIEWPORT 2: MOBILE 390 x 844
  // ==========================================================================
  console.log('\n>>> [2/5] MOBILE 390x844 AUDIT <<<');
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mCtx.newPage();
  mPage.on('console', m => { if (m.type() === 'error') errors.push(`[mobile] ${m.text()}`); });

  await mPage.goto(URL, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(9000);
  await mPage.click('.intro-enter-btn');
  await mPage.waitForTimeout(4000);

  // Check no horizontal overflow
  const mOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`    Mobile horizontal overflow: ${mOverflow ? 'FAIL - Overflow detected' : 'PASS - No overflow'}`);

  await mPage.screenshot({ path: `${scratchDir}/reset_05_mobile_hero_off.png` });

  // Tap activation
  console.log('    Tapping mobile PORTRAIT // ACTIVATE...');
  await mPage.click('.projector-toggle-btn');
  await mPage.waitForTimeout(2500);

  const mActive = await mPage.evaluate(() => {
    const sys = document.querySelector('.projector-portrait-system');
    const btn = document.querySelector('.projector-toggle-btn');
    return {
      isActive: sys ? sys.classList.contains('sys--active') : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
    };
  });
  console.log(`    Mobile active: ${mActive.isActive ? 'PASS' : 'FAIL'} ("${mActive.btnLabel}")`);

  await mPage.screenshot({ path: `${scratchDir}/reset_06_mobile_hologram_active.png` });
  await mCtx.close();

  // ==========================================================================
  // VIEWPORT 3: TABLET 820 x 1180
  // ==========================================================================
  console.log('\n>>> [3/5] TABLET 820x1180 AUDIT <<<');
  const tCtx = await browser.newContext({ viewport: { width: 820, height: 1180 } });
  const tPage = await tCtx.newPage();
  tPage.on('console', m => { if (m.type() === 'error') errors.push(`[tablet] ${m.text()}`); });

  await tPage.goto(URL, { waitUntil: 'networkidle' });
  await tPage.waitForTimeout(9000);
  await tPage.click('.intro-enter-btn');
  await tPage.waitForTimeout(4000);

  await tPage.screenshot({ path: `${scratchDir}/reset_07_tablet_hero.png` });
  await tCtx.close();

  // ==========================================================================
  // VIEWPORT 4: DESKTOP 1280 x 800
  // ==========================================================================
  console.log('\n>>> [4/5] DESKTOP 1280x800 AUDIT <<<');
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dPage = await dCtx.newPage();
  dPage.on('console', m => { if (m.type() === 'error') errors.push(`[1280x800] ${m.text()}`); });

  await dPage.goto(URL, { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(9000);
  await dPage.click('.intro-enter-btn');
  await dPage.waitForTimeout(4000);

  await dPage.screenshot({ path: `${scratchDir}/reset_08_1280x800_hero.png` });
  await dCtx.close();

  // ==========================================================================
  // VIEWPORT 5: ACCESSIBILITY & REDUCED MOTION
  // ==========================================================================
  console.log('\n>>> [5/5] ACCESSIBILITY & REDUCED MOTION <<<');
  const rCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const rPage = await rCtx.newPage();
  rPage.on('console', m => { if (m.type() === 'error') errors.push(`[reduced] ${m.text()}`); });

  await rPage.goto(URL, { waitUntil: 'networkidle' });
  await rPage.waitForTimeout(2000);
  await rPage.click('.intro-enter-btn');
  await rPage.waitForTimeout(2000);

  // Keyboard activation
  await rPage.focus('.projector-toggle-btn');
  await rPage.keyboard.press('Enter');
  await rPage.waitForTimeout(400);

  const rActive = await rPage.evaluate(() => {
    const sys = document.querySelector('.projector-portrait-system');
    return sys ? sys.classList.contains('sys--active') : false;
  });
  console.log(`    Keyboard Enter activation (reduced motion): ${rActive ? 'PASS' : 'FAIL'}`);

  await rPage.screenshot({ path: `${scratchDir}/reset_09_reduced_motion.png` });
  await rCtx.close();

  await browser.close();

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log('\n================================================================');
  console.log('AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`Canvas count: ${canvasCount} (MUST BE 1)`);
  console.log(`Console errors: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`  ⚠ ${e}`));
  } else {
    console.log('  All console error checks PASSED (0 errors)');
  }
}

runAudit().catch(console.error);
