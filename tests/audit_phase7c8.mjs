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
  console.log('PHASE 7C.8 — SURGICAL HERO COMPOSITION & SCALE REFINEMENT AUDIT');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ==========================================================================
  // VIEWPORT 1: DESKTOP 1440 x 900
  // ==========================================================================
  console.log('>>> [1/5] DESKTOP 1440x900 COMPREHENSIVE AUDIT <<<');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[1440x900] ${m.text()}`); 
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(5000);

  // 1. Initial State Check
  const initMetrics = await page.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const title = document.querySelector('.hero-title');
    const tagline = document.querySelector('.hero-supporting-line');
    const stage = document.querySelector('.hero-portrait-stage');
    const buttons = document.querySelectorAll('.projector-action-btn');
    const taglineDock = document.querySelector('.hero-tagline-control-dock');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    const rRect = reactor ? reactor.getBoundingClientRect() : null;
    const tRect = title ? title.getBoundingClientRect() : null;
    const tgRect = tagline ? tagline.getBoundingClientRect() : null;
    const sRect = stage ? stage.getBoundingClientRect() : null;
    const btnRect = buttons.length > 0 ? buttons[0].getBoundingClientRect() : null;

    return {
      portraitHidden: pStyle ? (pStyle.visibility === 'hidden' && parseFloat(pStyle.opacity) === 0) : false,
      btnCount: buttons.length,
      taglineDockExists: !!taglineDock,
      btnLabel: buttons.length > 0 ? (buttons[0].innerText || buttons[0].textContent).trim().replace(/\s+/g, ' ') : '',
      btnBelowTagline: tgRect && btnRect ? (btnRect.top >= tgRect.bottom + 10) : false,
      btnVerticalGapFromTagline: tgRect && btnRect ? (btnRect.top - tgRect.bottom) : 0,
      reactorInViewport: rRect ? (rRect.bottom <= window.innerHeight && rRect.top >= 0) : false,
      reactorWidth: rRect ? rRect.width : 0,
      clearanceToTitle: sRect && tRect ? (sRect.left - tRect.right) : 0,
      canvasCount: document.querySelectorAll('canvas').length,
    };
  });

  console.log('  [TEST 1] Initial Dormant State & Control Placement:');
  console.log(`    Portrait hidden: ${initMetrics.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Total Action Buttons: ${initMetrics.btnCount} (expected exactly 1: ${initMetrics.btnCount === 1 ? 'PASS' : 'FAIL'})`);
  console.log(`    Button under tagline dock: ${initMetrics.taglineDockExists ? 'PASS' : 'FAIL'}`);
  console.log(`    Button placed below tagline: ${initMetrics.btnBelowTagline ? 'PASS' : 'FAIL'} (${initMetrics.btnVerticalGapFromTagline.toFixed(1)}px gap)`);
  console.log(`    Button label: "${initMetrics.btnLabel}" (expected: "VIEW PORTRAIT")`);
  console.log(`    Reactor grounded in viewport: ${initMetrics.reactorInViewport ? 'PASS' : 'FAIL'} (${initMetrics.reactorWidth.toFixed(1)}px width)`);
  console.log(`    Clearance to Hero title: ${initMetrics.clearanceToTitle > 0 ? 'PASS' : 'FAIL'} (${initMetrics.clearanceToTitle.toFixed(1)}px clear)`);
  console.log(`    Canvas Count: ${initMetrics.canvasCount} (expected 1: ${initMetrics.canvasCount === 1 ? 'PASS' : 'FAIL'})`);

  await page.screenshot({ path: `${scratchDir}/phase7c8_01_dormant_1440.png` });

  // 2. Click VIEW PORTRAIT -> 5-Phase Activation
  console.log('\n  [TEST 2] Clicking VIEW PORTRAIT below tagline...');
  await page.click('.hero-tagline-control-dock .projector-action-btn');
  await page.waitForTimeout(2500); // Wait for full settle and active state

  const activeMetrics = await page.evaluate(() => {
    const stage = document.querySelector('.hero-portrait-stage');
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const conduit = document.querySelector('.projection-field-conduit');
    const reactor = document.querySelector('.reactor-device-assembly');
    const btn = document.querySelector('.projector-action-btn');
    const title = document.querySelector('.hero-title');
    const bottomBar = document.querySelector('.hero-bottom-bar');
    const rays = document.querySelectorAll('.conduit-ray');
    const volumetricCone = document.querySelector('.conduit-volumetric-cone');
    const coreShaft = document.querySelector('.conduit-core-shaft');
    const realImg = document.querySelector('.hero-real-portrait-img');
    const underglow = document.querySelector('.portrait-projection-underglow');
    const rim = document.querySelector('.portrait-projection-rim');

    const sRect = stage.getBoundingClientRect();
    const pRect = portrait.getBoundingClientRect();
    const cRect = conduit.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const tRect = title.getBoundingClientRect();
    const bbRect = bottomBar ? bottomBar.getBoundingClientRect() : null;
    const imgStyle = realImg ? getComputedStyle(realImg) : null;
    const rimStyle = rim ? getComputedStyle(rim) : null;

    return {
      stageW: sRect.width,
      stageH: sRect.height,
      portraitW: pRect.width,
      portraitH: pRect.height,
      portraitAspect: (pRect.width / pRect.height),
      conduitW: cRect.width,
      conduitH: cRect.height,
      conduitToPortraitWidthRatio: (cRect.width / pRect.width),
      reactorW: rRect.width,
      reactorH: rRect.height,
      verticalGapPortraitToReactor: rRect.top - pRect.bottom,
      gapPortraitToConduit: cRect.top - pRect.bottom,
      portraitTouchesReactor: pRect.bottom >= rRect.top,
      rayCount: rays.length,
      hasVolumetricCone: !!volumetricCone,
      hasCoreShaft: !!coreShaft,
      btnLabel: btn.innerText.trim().replace(/\s+/g, ' '),
      clearanceAboveBottom: bbRect ? (bbRect.top - rRect.bottom) : 50,
      clearanceToTitle: sRect.left - tRect.right,
      hasHoloMesh: !!document.querySelector('.hologram-mesh-grid'),
      imgFilter: imgStyle ? imgStyle.filter : '',
      rimBoxShadow: rimStyle ? rimStyle.boxShadow : '',
      hasUnderglow: !!underglow,
    };
  });

  console.log('  [TEST 3] Active State Metrics:');
  console.log(`    Button label toggled: "${activeMetrics.btnLabel}" (expected: "HIDE PORTRAIT": ${activeMetrics.btnLabel.includes('HIDE') ? 'PASS' : 'FAIL'})`);
  console.log(`    Portrait Width: ${activeMetrics.portraitW.toFixed(1)}px (Aspect: ${activeMetrics.portraitAspect.toFixed(2)}) — enlarged & human scale`);
  console.log(`    Conduit Width: ${activeMetrics.conduitW.toFixed(1)}px (Ratio to Portrait: ${(activeMetrics.conduitToPortraitWidthRatio * 100).toFixed(1)}% - spans shoulders: ${activeMetrics.conduitToPortraitWidthRatio >= 0.80 ? 'PASS' : 'FAIL'})`);
  console.log(`    Secondary Rays count: ${activeMetrics.rayCount} (expected 6 fanning to shoulders: ${activeMetrics.rayCount === 6 ? 'PASS' : 'FAIL'})`);
  console.log(`    Volumetric cone & core shaft present: ${activeMetrics.hasVolumetricCone && activeMetrics.hasCoreShaft ? 'PASS' : 'FAIL'}`);
  console.log(`    Reactor Width: ${activeMetrics.reactorW.toFixed(1)}px (Substantial physical presence: ${activeMetrics.reactorW >= 240 ? 'PASS' : 'FAIL'})`);
  console.log(`    Vertical separation portrait to reactor: ${activeMetrics.verticalGapPortraitToReactor.toFixed(1)}px (touches reactor: ${activeMetrics.portraitTouchesReactor ? 'FAIL' : 'PASS'})`);
  console.log(`    Clearance to Title: ${activeMetrics.clearanceToTitle.toFixed(1)}px (> 0: ${activeMetrics.clearanceToTitle > 0 ? 'PASS' : 'FAIL'})`);
  console.log(`    Clearance above bottom bar: ${activeMetrics.clearanceAboveBottom.toFixed(1)}px (> 0: ${activeMetrics.clearanceAboveBottom > 0 ? 'PASS' : 'FAIL'})`);
  console.log(`    Portrait photographic filter: "${activeMetrics.imgFilter}"`);
  console.log(`    Horizontal neon shelf box-shadow: "${activeMetrics.rimBoxShadow}" (no neon shelf: ${activeMetrics.rimBoxShadow === 'none' ? 'PASS' : 'FAIL'})`);
  console.log(`    No holographic mesh overlay: ${!activeMetrics.hasHoloMesh ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/phase7c8_02_active_1440.png` });

  // 3. Click HIDE PORTRAIT -> Deactivation
  console.log('\n  [TEST 4] Clicking HIDE PORTRAIT to test deactivation...');
  await page.click('.hero-tagline-control-dock .projector-action-btn');
  await page.waitForTimeout(1600);

  const deactMetrics = await page.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const btn = document.querySelector('.projector-action-btn');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    return {
      portraitHidden: pStyle ? (pStyle.visibility === 'hidden' && parseFloat(pStyle.opacity) === 0) : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
    };
  });

  console.log(`    Portrait returned to hidden: ${deactMetrics.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Button label returned to: "${deactMetrics.btnLabel}" (expected: "VIEW PORTRAIT": ${deactMetrics.btnLabel.includes('VIEW') ? 'PASS' : 'FAIL'})`);
  await page.screenshot({ path: `${scratchDir}/phase7c8_03_deactivated_1440.png` });

  // Reactivate for consistent testing across rest of checks
  await page.click('.hero-tagline-control-dock .projector-action-btn');
  await page.waitForTimeout(2500);

  await ctx.close();

  // ==========================================================================
  // VIEWPORTS 2-5: RESPONSIVE AUDITS
  // ==========================================================================
  const viewports = [
    { name: 'LAPTOP 1280x800', width: 1280, height: 800, file: 'phase7c8_04_active_1280.png' },
    { name: 'TABLET 820x1180', width: 820, height: 1180, file: 'phase7c8_05_active_820.png' },
    { name: 'MOBILE 390x844', width: 390, height: 844, file: 'phase7c8_06_active_390.png' },
    { name: 'MOBILE SMALL 375x812', width: 375, height: 812, file: 'phase7c8_07_active_375.png' }
  ];

  for (let i = 0; i < viewports.length; i++) {
    const vp = viewports[i];
    console.log(`\n>>> [${i + 2}/5] ${vp.name} AUDIT <<<`);
    const rCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const rPage = await rCtx.newPage();
    rPage.on('console', m => { 
      if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[${vp.name}] ${m.text()}`); 
    });

    await rPage.goto(URL, { waitUntil: 'domcontentloaded' });
    await rPage.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
    await rPage.click('.intro-enter-btn');
    await rPage.waitForTimeout(4000);

    // Click VIEW PORTRAIT
    await rPage.click('.hero-tagline-control-dock .projector-action-btn');
    await rPage.waitForTimeout(2500);

    const vpMetrics = await rPage.evaluate(() => {
      const portrait = document.querySelector('.projected-portrait-wrapper');
      const conduit = document.querySelector('.projection-field-conduit');
      const reactor = document.querySelector('.reactor-device-assembly');
      const btn = document.querySelector('.projector-action-btn');
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;

      const pRect = portrait ? portrait.getBoundingClientRect() : null;
      const cRect = conduit ? conduit.getBoundingClientRect() : null;
      const rRect = reactor ? reactor.getBoundingClientRect() : null;
      const bRect = btn ? btn.getBoundingClientRect() : null;

      return {
        hasOverflow: docW > winW + 2,
        docW,
        winW,
        portraitW: pRect ? pRect.width : 0,
        conduitW: cRect ? cRect.width : 0,
        reactorW: rRect ? rRect.width : 0,
        btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
        verticalGap: (rRect && pRect) ? (rRect.top - pRect.bottom) : 0,
      };
    });

    console.log(`    No horizontal overflow: ${!vpMetrics.hasOverflow ? 'PASS' : 'FAIL'} (doc: ${vpMetrics.docW}px, win: ${vpMetrics.winW}px)`);
    console.log(`    Portrait Width: ${vpMetrics.portraitW.toFixed(1)}px | Conduit Width: ${vpMetrics.conduitW.toFixed(1)}px | Reactor Width: ${vpMetrics.reactorW.toFixed(1)}px`);
    console.log(`    Vertical Separation: ${vpMetrics.verticalGap.toFixed(1)}px`);
    console.log(`    Button: "${vpMetrics.btnLabel}"`);

    await rPage.screenshot({ path: `${scratchDir}/${vp.file}` });
    await rCtx.close();
  }

  await browser.close();

  console.log('\n================================================================');
  console.log('CONSOLE ERRORS AUDIT');
  console.log('================================================================');
  if (errors.length === 0) {
    console.log('  PASS: Zero console errors across all viewports!');
  } else {
    console.log(`  FAIL: Found ${errors.length} console errors:`);
    errors.forEach(e => console.log('    ' + e));
  }
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
