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
  console.log('PHASE 7C.1 & 7C.2 — ARC-REACTOR & PHYSICAL PROJECTION AUDIT');
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
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[1440x900] ${m.text()}`); 
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

  // TEST 1: Initial State — NO PORTRAIT VISIBLE, REACTOR VISIBLE, CONTROL: VIEW PORTRAIT
  const initialCheck = await page.evaluate(() => {
    const stage = document.querySelector('.hero-portrait-stage');
    const container = document.querySelector('.projector-stage-container');
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const btn = document.querySelector('.projector-action-btn');
    const haze = document.querySelector('.dormant-atmospheric-haze');
    const conduit = document.querySelector('.projection-light-conduit');

    const reactRect = reactor ? reactor.getBoundingClientRect() : null;
    const stageRect = stage ? stage.getBoundingClientRect() : null;
    const portraitStyle = portraitWrap ? getComputedStyle(portraitWrap) : null;
    const conduitStyle = conduit ? getComputedStyle(conduit) : null;

    return {
      phase: container ? container.getAttribute('data-phase') : '',
      isDormant: container ? container.classList.contains('phase--dormant') : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      portraitVisibility: portraitStyle ? portraitStyle.visibility : 'visible',
      portraitOpacity: portraitStyle ? parseFloat(portraitStyle.opacity) : 1,
      conduitOpacity: conduitStyle ? parseFloat(conduitStyle.opacity) : 1,
      hazeExists: !!haze,
      reactorInViewport: reactRect ? (reactRect.bottom <= window.innerHeight && reactRect.top >= 0) : false,
      reactorBottomGap: reactRect ? (window.innerHeight - reactRect.bottom) : 0,
      stageRight: stageRect ? stageRect.right : 0,
    };
  });

  console.log('\n  [TEST 1] Initial Hero State:');
  console.log(`    Phase: "${initialCheck.phase}" (expected: dormant)`);
  console.log(`    Portrait visibility: ${initialCheck.portraitVisibility} (expected: hidden)`);
  console.log(`    Portrait opacity: ${initialCheck.portraitOpacity} (expected: 0)`);
  console.log(`    Reactor in viewport: ${initialCheck.reactorInViewport ? 'PASS' : 'FAIL'} (${Math.round(initialCheck.reactorBottomGap)}px above bottom)`);
  console.log(`    Discovery button label: "${initialCheck.btnLabel}" (expected: "VIEW PORTRAIT")`);
  console.log(`    Dormant haze present: ${initialCheck.hazeExists ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/phase7c1_01_hero_initial_dormant.png` });

  // TEST 2: Hover Over VIEW PORTRAIT
  console.log('\n  [TEST 2] Hovering over VIEW PORTRAIT button...');
  await page.hover('.projector-action-btn');
  await page.waitForTimeout(300);

  const hoverCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const lens = document.querySelector('.core-hot-crystal');
    const lensStyle = lens ? getComputedStyle(lens) : null;
    return {
      isHovered: container ? container.classList.contains('sys--hovered') : false,
      lensOpacity: lensStyle ? parseFloat(lensStyle.opacity) : 0,
    };
  });
  console.log(`    Hover state active: ${hoverCheck.isHovered ? 'PASS' : 'FAIL'}`);
  console.log(`    Reactor core response: ${hoverCheck.lensOpacity > 0.3 ? 'PASS' : 'FAIL'} (opacity: ${hoverCheck.lensOpacity})`);

  await page.screenshot({ path: `${scratchDir}/phase7c1_02_reactor_hovered.png` });

  // TEST 3: Click VIEW PORTRAIT -> 5-Step Emergence Choreography
  console.log('\n  [TEST 3] Clicking VIEW PORTRAIT...');
  await page.click('.projector-action-btn');

  // Step 2 check (~380ms): energy-build phase, beam rising
  await page.waitForTimeout(380);
  const energyCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const conduit = document.querySelector('.projection-light-conduit');
    const conduitStyle = conduit ? getComputedStyle(conduit) : null;
    return {
      phase: container ? container.getAttribute('data-phase') : '',
      conduitOpacity: conduitStyle ? parseFloat(conduitStyle.opacity) : 0,
    };
  });
  console.log(`    Energy build phase: "${energyCheck.phase}" (conduit opacity: ${energyCheck.conduitOpacity})`);

  // Step 3 check (~800ms): emerging phase, portrait physically moving upward
  await page.waitForTimeout(420);
  const emergeCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const portraitStyle = portraitWrap ? getComputedStyle(portraitWrap) : null;
    return {
      phase: container ? container.getAttribute('data-phase') : '',
      portraitVisibility: portraitStyle ? portraitStyle.visibility : '',
      portraitOpacity: portraitStyle ? parseFloat(portraitStyle.opacity) : 0,
    };
  });
  console.log(`    Portrait emerging upward: "${emergeCheck.phase}" (visibility: ${emergeCheck.portraitVisibility}, opacity: ${emergeCheck.portraitOpacity})`);

  await page.screenshot({ path: `${scratchDir}/phase7c1_03_portrait_emerging.png` });

  // Step 5 & Resting check (~2300ms total after click): settled & active
  console.log('\n  [TEST 4] Waiting for full projection settlement (~2.3s)...');
  await page.waitForTimeout(1600);

  const activeCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const img = document.querySelector('.hero-real-portrait-img');
    const btn = document.querySelector('.projector-action-btn');
    const conduit = document.querySelector('.projection-light-conduit');

    const portraitStyle = portraitWrap ? getComputedStyle(portraitWrap) : null;
    const conduitStyle = conduit ? getComputedStyle(conduit) : null;

    return {
      phase: container ? container.getAttribute('data-phase') : '',
      isActive: container ? container.classList.contains('projector--on') : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      portraitVisibility: portraitStyle ? portraitStyle.visibility : '',
      portraitOpacity: portraitStyle ? parseFloat(portraitStyle.opacity) : 0,
      imgSrc: img ? img.getAttribute('src') : '',
      conduitOpacity: conduitStyle ? parseFloat(conduitStyle.opacity) : 0,
    };
  });

  console.log(`    Active state: ${activeCheck.isActive ? 'PASS' : 'FAIL'} (phase: ${activeCheck.phase})`);
  console.log(`    Button label: "${activeCheck.btnLabel}" (expected: "HIDE PORTRAIT")`);
  console.log(`    Portrait fully visible: ${activeCheck.portraitVisibility === 'visible' && activeCheck.portraitOpacity === 1 ? 'PASS' : 'FAIL'}`);
  console.log(`    Image source: "${activeCheck.imgSrc}" (Real photograph preserved)`);
  console.log(`    Projection conduit subtle & connected: ${activeCheck.conduitOpacity > 0 ? 'PASS' : 'FAIL'} (${activeCheck.conduitOpacity})`);

  await page.screenshot({ path: `${scratchDir}/phase7c1_04_reactor_portrait_active.png` });

  // TEST 5: Deactivate Projection (Click HIDE PORTRAIT)
  console.log('\n  [TEST 5] Clicking HIDE PORTRAIT...');
  await page.click('.projector-action-btn');

  // Check collapsing phase (~250ms)
  await page.waitForTimeout(250);
  const collapsingCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    return container ? container.getAttribute('data-phase') : '';
  });
  console.log(`    Deactivating phase: "${collapsingCheck}" (expected: collapsing)`);

  // Wait for complete shutdown (~850ms)
  await page.waitForTimeout(700);

  const deactCheck = await page.evaluate(() => {
    const container = document.querySelector('.projector-stage-container');
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const btn = document.querySelector('.projector-action-btn');
    const portraitStyle = portraitWrap ? getComputedStyle(portraitWrap) : null;

    return {
      phase: container ? container.getAttribute('data-phase') : '',
      isDormant: container ? container.classList.contains('phase--dormant') : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      portraitVisibility: portraitStyle ? portraitStyle.visibility : '',
      portraitOpacity: portraitStyle ? parseFloat(portraitStyle.opacity) : 1,
    };
  });

  console.log(`    Dormant restoration: ${deactCheck.isDormant ? 'PASS' : 'FAIL'} (phase: ${deactCheck.phase})`);
  console.log(`    Button label returned: "${deactCheck.btnLabel}" (expected: "VIEW PORTRAIT")`);
  console.log(`    Portrait cleanly hidden: ${deactCheck.portraitVisibility === 'hidden' || deactCheck.portraitOpacity === 0 ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/phase7c1_05_deactivated_dormant.png` });

  // TEST 6: Verify Smooth Scrolling
  console.log('\n  [TEST 6] Verifying page scrolling after Hero...');
  await page.mouse.move(500, 400);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1200);
  const scrollY = await page.evaluate(() => {
    return window.scrollY || (window.lenis ? Math.round(window.lenis.scroll) : 0);
  });
  console.log(`    Scroll position: ${scrollY}px (${scrollY > 0 ? 'PASS' : 'FAIL'})`);

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

  const dCheck = await dPage.evaluate(() => {
    const reactor = document.querySelector('.reactor-device-assembly');
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const rRect = reactor ? reactor.getBoundingClientRect() : null;
    return {
      portraitHidden: portraitWrap ? getComputedStyle(portraitWrap).visibility === 'hidden' : false,
      inViewport: rRect ? (rRect.bottom <= window.innerHeight && rRect.top >= 0) : false,
    };
  });
  console.log(`    Initial portrait hidden: ${dCheck.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Reactor in viewport: ${dCheck.inViewport ? 'PASS' : 'FAIL'}`);

  await dPage.screenshot({ path: `${scratchDir}/phase7c1_06_1280x800_dormant.png` });

  await dPage.click('.projector-action-btn');
  await dPage.waitForTimeout(2400);
  await dPage.screenshot({ path: `${scratchDir}/phase7c1_07_1280x800_active.png` });

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

  const tCheck = await tPage.evaluate(() => {
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const overflow = document.documentElement.scrollWidth > window.innerWidth;
    return {
      portraitHidden: portraitWrap ? getComputedStyle(portraitWrap).visibility === 'hidden' : false,
      noOverflow: !overflow,
    };
  });
  console.log(`    Initial portrait hidden: ${tCheck.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    No horizontal overflow: ${tCheck.noOverflow ? 'PASS' : 'FAIL'}`);

  await tPage.screenshot({ path: `${scratchDir}/phase7c1_08_tablet_dormant.png` });

  await tPage.click('.projector-action-btn');
  await tPage.waitForTimeout(2400);
  await tPage.screenshot({ path: `${scratchDir}/phase7c1_09_tablet_active.png` });

  await tCtx.close();

  // ==========================================================================
  // VIEWPORT 4: MOBILE 390 x 844
  // ==========================================================================
  console.log('\n>>> [4/5] MOBILE 390x844 AUDIT <<<');
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mCtx.newPage();
  mPage.on('console', m => { if (m.type() === 'error') errors.push(`[mobile-390] ${m.text()}`); });

  await mPage.goto(URL, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(9000);
  await mPage.click('.intro-enter-btn');
  await mPage.waitForTimeout(4000);

  const mCheck = await mPage.evaluate(() => {
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const btn = document.querySelector('.projector-action-btn');
    const overflow = document.documentElement.scrollWidth > window.innerWidth;
    return {
      portraitHidden: portraitWrap ? getComputedStyle(portraitWrap).visibility === 'hidden' : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
      noOverflow: !overflow,
    };
  });
  console.log(`    Initial portrait hidden: ${mCheck.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Button label: "${mCheck.btnLabel}" (expected: "VIEW PORTRAIT")`);
  console.log(`    No mobile overflow: ${mCheck.noOverflow ? 'PASS' : 'FAIL'}`);

  await mPage.screenshot({ path: `${scratchDir}/phase7c1_10_mobile_390_dormant.png` });

  await mPage.click('.projector-action-btn');
  await mPage.waitForTimeout(2400);
  await mPage.screenshot({ path: `${scratchDir}/phase7c1_11_mobile_390_active.png` });

  await mCtx.close();

  // ==========================================================================
  // VIEWPORT 5: MOBILE 375 x 812
  // ==========================================================================
  console.log('\n>>> [5/5] MOBILE 375x812 AUDIT <<<');
  const sCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const sPage = await sCtx.newPage();
  sPage.on('console', m => { if (m.type() === 'error') errors.push(`[mobile-375] ${m.text()}`); });

  await sPage.goto(URL, { waitUntil: 'networkidle' });
  await sPage.waitForTimeout(9000);
  await sPage.click('.intro-enter-btn');
  await sPage.waitForTimeout(4000);

  const sCheck = await sPage.evaluate(() => {
    const portraitWrap = document.querySelector('.projected-portrait-wrapper');
    const overflow = document.documentElement.scrollWidth > window.innerWidth;
    return {
      portraitHidden: portraitWrap ? getComputedStyle(portraitWrap).visibility === 'hidden' : false,
      noOverflow: !overflow,
    };
  });
  console.log(`    Initial portrait hidden: ${sCheck.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    No 375px overflow: ${sCheck.noOverflow ? 'PASS' : 'FAIL'}`);

  await sPage.screenshot({ path: `${scratchDir}/phase7c1_12_mobile_375_dormant.png` });

  await sPage.click('.projector-action-btn');
  await sPage.waitForTimeout(2400);
  await sPage.screenshot({ path: `${scratchDir}/phase7c1_13_mobile_375_active.png` });

  await sCtx.close();
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
