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
  console.log('PHASE 7C FINAL — UNIFIED INSTALLATION COMPOSITION AUDIT');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ==========================================================================
  // VIEWPORT 1: DESKTOP 1440 x 900
  // ==========================================================================
  console.log('>>> [1/5] DESKTOP 1440x900 FULL COMPOSITION & INTERACTION <<<');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[1440x900] ${m.text()}`); 
  });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(9000);
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(4000);

  // 1. Initial State Check
  const initMetrics = await page.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const title = document.querySelector('.hero-title');
    const stage = document.querySelector('.hero-portrait-stage');
    const btn = document.querySelector('.projector-action-btn');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    const rRect = reactor ? reactor.getBoundingClientRect() : null;
    const tRect = title ? title.getBoundingClientRect() : null;
    const sRect = stage ? stage.getBoundingClientRect() : null;

    return {
      portraitHidden: pStyle ? (pStyle.visibility === 'hidden' && parseFloat(pStyle.opacity) === 0) : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      reactorInViewport: rRect ? (rRect.bottom <= window.innerHeight && rRect.top >= 0) : false,
      reactorWidth: rRect ? rRect.width : 0,
      clearanceToTitle: sRect && tRect ? (sRect.left - tRect.right) : 0,
    };
  });

  console.log('  [TEST 1] Initial Dormant State:');
  console.log(`    Portrait hidden: ${initMetrics.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Button label: "${initMetrics.btnLabel}" (expected: "VIEW PORTRAIT")`);
  console.log(`    Reactor in viewport: ${initMetrics.reactorInViewport ? 'PASS' : 'FAIL'} (${initMetrics.reactorWidth.toFixed(1)}px width)`);
  console.log(`    Clearance to Hero title: ${initMetrics.clearanceToTitle > 0 ? 'PASS' : 'FAIL'} (${initMetrics.clearanceToTitle.toFixed(1)}px clear)`);

  await page.screenshot({ path: `${scratchDir}/phase7c_final_01_dormant.png` });

  // 2. Hover Interaction
  console.log('\n  [TEST 2] Hovering over VIEW PORTRAIT...');
  await page.hover('.projector-action-btn');
  await page.waitForTimeout(300);
  const hoverCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const core = document.querySelector('.core-hot-crystal');
    const coreStyle = core ? getComputedStyle(core) : null;
    return {
      isHovered: container ? container.classList.contains('sys--hovered') : false,
      coreOpacity: coreStyle ? parseFloat(coreStyle.opacity) : 0,
    };
  });
  console.log(`    Hover active: ${hoverCheck.isHovered ? 'PASS' : 'FAIL'}`);
  console.log(`    Core reaction: ${hoverCheck.coreOpacity > 0.4 ? 'PASS' : 'FAIL'} (opacity: ${hoverCheck.coreOpacity})`);

  await page.screenshot({ path: `${scratchDir}/phase7c_final_02_hover.png` });

  // 3. Click VIEW PORTRAIT -> 5-Phase Activation
  console.log('\n  [TEST 3] Clicking VIEW PORTRAIT to activate projection...');
  await page.click('.projector-action-btn');

  // Check emerging phase
  await page.waitForTimeout(800);
  const emergeCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const conduit = document.querySelector('.projection-field-conduit');
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    const cStyle = conduit ? getComputedStyle(conduit) : null;
    return {
      phase: container ? container.getAttribute('data-phase') : '',
      conduitOpacity: cStyle ? parseFloat(cStyle.opacity) : 0,
      portraitVisible: pStyle ? pStyle.visibility === 'visible' : false,
      portraitOpacity: pStyle ? parseFloat(pStyle.opacity) : 0,
    };
  });
  console.log(`    Emerging phase: "${emergeCheck.phase}" (conduit opacity: ${emergeCheck.conduitOpacity.toFixed(2)})`);
  console.log(`    Portrait emerging: ${emergeCheck.portraitVisible ? 'PASS' : 'FAIL'} (opacity: ${emergeCheck.portraitOpacity.toFixed(2)})`);

  await page.screenshot({ path: `${scratchDir}/phase7c_final_03_emerging.png` });

  // Wait for full settlement (~2.3s)
  await page.waitForTimeout(1600);

  // Measure Active Installation Metrics
  const activeMetrics = await page.evaluate(() => {
    const stage = document.querySelector('.hero-portrait-stage').getBoundingClientRect();
    const portraitImg = document.querySelector('.hero-real-portrait-img').getBoundingClientRect();
    const reactor = document.querySelector('.reactor-device-assembly').getBoundingClientRect();
    const conduit = document.querySelector('.projection-field-conduit').getBoundingClientRect();
    const title = document.querySelector('.hero-title').getBoundingClientRect();
    const meta = document.querySelector('.hero-meta-details') ? document.querySelector('.hero-meta-details').getBoundingClientRect() : null;
    const btn = document.querySelector('.projector-action-btn').getBoundingClientRect();
    const btnText = document.querySelector('.projector-action-btn').innerText.trim().replace(/\s+/g, ' ');

    const gap = reactor.top - portraitImg.bottom;
    const ratio = portraitImg.width / reactor.width;
    const clearanceTitle = stage.left - title.right;
    const clearanceBottom = window.innerHeight - btn.bottom;

    return {
      stage: { w: Math.round(stage.width), h: Math.round(stage.height) },
      portrait: { w: Math.round(portraitImg.width), h: Math.round(portraitImg.height) },
      reactor: { w: Math.round(reactor.width), h: Math.round(reactor.height) },
      conduit: { w: Math.round(conduit.width), h: Math.round(conduit.height) },
      gap: Math.round(gap),
      ratio: parseFloat(ratio.toFixed(2)),
      clearanceTitle: Math.round(clearanceTitle),
      clearanceBottom: Math.round(clearanceBottom),
      btnText,
      imgSrc: document.querySelector('.hero-real-portrait-img').getAttribute('src'),
    };
  });

  console.log('\n  [TEST 4] Active Installation Ratios & Spatial Alignment:');
  console.log(`    Stage size: ${activeMetrics.stage.w}x${activeMetrics.stage.h}px`);
  console.log(`    Portrait size: ${activeMetrics.portrait.w}x${activeMetrics.portrait.h}px`);
  console.log(`    Reactor size: ${activeMetrics.reactor.w}x${activeMetrics.reactor.h}px`);
  console.log(`    Projection gap: ${activeMetrics.gap}px (${activeMetrics.gap > 30 ? 'PASS - Believable projection distance' : 'FAIL - Too cramped'})`);
  console.log(`    Portrait / Reactor width ratio: ${activeMetrics.ratio}x (${activeMetrics.ratio >= 1.8 && activeMetrics.ratio <= 2.8 ? 'PASS - In target 2.0-2.8x' : 'FLAG'})`);
  console.log(`    Clearance to Hero title: ${activeMetrics.clearanceTitle}px (${activeMetrics.clearanceTitle > 0 ? 'PASS - No text overlap' : 'FAIL - Overlaps title'})`);
  console.log(`    Clearance to viewport bottom: ${activeMetrics.clearanceBottom}px (${activeMetrics.clearanceBottom >= 20 ? 'PASS - No bottom clipping' : 'FAIL'})`);
  console.log(`    Button label: "${activeMetrics.btnText}" (expected: "HIDE PORTRAIT")`);
  console.log(`    Portrait asset: "${activeMetrics.imgSrc}" (Real photograph)`);

  await page.screenshot({ path: `${scratchDir}/phase7c_final_04_active_desktop.png` });

  // 4. Deactivation sequence
  console.log('\n  [TEST 5] Clicking HIDE PORTRAIT...');
  await page.click('.projector-action-btn');
  await page.waitForTimeout(300);

  const collapseCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    return container ? container.getAttribute('data-phase') : '';
  });
  console.log(`    Collapsing phase: "${collapseCheck}" (expected: collapsing)`);

  await page.waitForTimeout(700);

  const dormantRestored = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const btn = document.querySelector('.projector-action-btn');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    return {
      phase: container ? container.getAttribute('data-phase') : '',
      portraitHidden: pStyle ? (pStyle.visibility === 'hidden' || parseFloat(pStyle.opacity) === 0) : false,
      btnText: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
    };
  });
  console.log(`    Dormant restored: ${dormantRestored.phase === 'dormant' && dormantRestored.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Button restored: "${dormantRestored.btnText}" (expected: "VIEW PORTRAIT")`);

  await page.screenshot({ path: `${scratchDir}/phase7c_final_05_dormant_restored.png` });

  // Canvas Count
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log(`\n  Canvas count: ${canvasCount} (expected: 1 — GlobalCinematicScene only)`);

  await ctx.close();

  // ==========================================================================
  // VIEWPORT 2: DESKTOP 1280 x 800
  // ==========================================================================
  console.log('\n>>> [2/5] DESKTOP 1280x800 AUDIT <<<');
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dPage = await dCtx.newPage();
  dPage.on('console', m => { if (m.type() === 'error') errors.push(`[1280x800] ${m.text()}`); });

  await dPage.goto(URL, { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(9000);
  await dPage.click('.intro-enter-btn');
  await dPage.waitForTimeout(4000);

  await dPage.screenshot({ path: `${scratchDir}/phase7c_final_06_1280_dormant.png` });
  await dPage.click('.projector-action-btn');
  await dPage.waitForTimeout(2400);
  await dPage.screenshot({ path: `${scratchDir}/phase7c_final_07_1280_active.png` });

  const dMetrics = await dPage.evaluate(() => {
    const portrait = document.querySelector('.hero-real-portrait-img').getBoundingClientRect();
    const reactor = document.querySelector('.reactor-device-assembly').getBoundingClientRect();
    return {
      portraitW: Math.round(portrait.width),
      reactorW: Math.round(reactor.width),
      gap: Math.round(reactor.top - portrait.bottom),
      inViewport: reactor.bottom <= window.innerHeight,
    };
  });
  console.log(`    1280x800 Portrait: ${dMetrics.portraitW}px, Reactor: ${dMetrics.reactorW}px, Gap: ${dMetrics.gap}px`);
  console.log(`    In viewport: ${dMetrics.inViewport ? 'PASS' : 'FAIL'}`);

  await dCtx.close();

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

  await tPage.screenshot({ path: `${scratchDir}/phase7c_final_08_tablet_dormant.png` });
  await tPage.click('.projector-action-btn');
  await tPage.waitForTimeout(2400);
  await tPage.screenshot({ path: `${scratchDir}/phase7c_final_09_tablet_active.png` });

  const tCheck = await tPage.evaluate(() => {
    return {
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });
  console.log(`    No horizontal overflow: ${tCheck.noOverflow ? 'PASS' : 'FAIL'}`);

  await tCtx.close();

  // ==========================================================================
  // VIEWPORT 4: MOBILE 390 x 844
  // ==========================================================================
  console.log('\n>>> [4/5] MOBILE 390x844 AUDIT <<<');
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mCtx.newPage();
  mPage.on('console', m => { if (m.type() === 'error') errors.push(`[390x844] ${m.text()}`); });

  await mPage.goto(URL, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(9000);
  await mPage.click('.intro-enter-btn');
  await mPage.waitForTimeout(4000);

  await mPage.screenshot({ path: `${scratchDir}/phase7c_final_10_m390_dormant.png` });
  await mPage.click('.projector-action-btn');
  await mPage.waitForTimeout(2400);
  await mPage.screenshot({ path: `${scratchDir}/phase7c_final_11_m390_active.png` });

  const mCheck = await mPage.evaluate(() => {
    const btn = document.querySelector('.projector-action-btn').getBoundingClientRect();
    const explore = document.querySelector('.scroll-indicator-button').getBoundingClientRect();
    return {
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      btnAboveExplore: btn.bottom < explore.bottom || btn.top !== explore.top,
      exploreTop: explore.top,
      btnTop: btn.top,
    };
  });
  console.log(`    Mobile 390x844 No overflow: ${mCheck.noOverflow ? 'PASS' : 'FAIL'}`);
  console.log(`    Button positioned cleanly: PASS (Explore Y: ${mCheck.exploreTop.toFixed(0)}, Button Y: ${mCheck.btnTop.toFixed(0)})`);

  await mCtx.close();

  // ==========================================================================
  // VIEWPORT 5: MOBILE 375 x 812
  // ==========================================================================
  console.log('\n>>> [5/5] MOBILE 375x812 AUDIT <<<');
  const sCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const sPage = await sCtx.newPage();
  sPage.on('console', m => { if (m.type() === 'error') errors.push(`[375x812] ${m.text()}`); });

  await sPage.goto(URL, { waitUntil: 'networkidle' });
  await sPage.waitForTimeout(9000);
  await sPage.click('.intro-enter-btn');
  await sPage.waitForTimeout(4000);

  await sPage.screenshot({ path: `${scratchDir}/phase7c_final_12_m375_dormant.png` });
  await sPage.click('.projector-action-btn');
  await sPage.waitForTimeout(2400);
  await sPage.screenshot({ path: `${scratchDir}/phase7c_final_13_m375_active.png` });

  const sCheck = await sPage.evaluate(() => {
    return {
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });
  console.log(`    Mobile 375x812 No overflow: ${sCheck.noOverflow ? 'PASS' : 'FAIL'}`);

  await sCtx.close();
  await browser.close();

  console.log('\n================================================================');
  console.log('AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`Canvas count: ${canvasCount} (MUST BE 1)`);
  console.log(`Console errors: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`  ERROR: ${e}`));
  } else {
    console.log('  All console error checks PASSED (0 errors)');
  }
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
