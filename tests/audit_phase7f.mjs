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
  console.log('PHASE 7F — TRUE CINEMATIC GRAVITATIONAL ARCHIVE AUDIT');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ==========================================================================
  // VIEWPORT 1: DESKTOP 1440 x 900
  // ==========================================================================
  console.log('>>> [1/5] DESKTOP 1440x900 FULL ENVIRONMENT AUDIT <<<');
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
    const stage = document.querySelector('.hero-portrait-stage');
    const buttons = document.querySelectorAll('.projector-action-btn');
    const canvas = document.querySelectorAll('canvas');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    const rRect = reactor ? reactor.getBoundingClientRect() : null;
    const tRect = title ? title.getBoundingClientRect() : null;
    const sRect = stage ? stage.getBoundingClientRect() : null;

    return {
      portraitHidden: pStyle ? (pStyle.visibility === 'hidden' && parseFloat(pStyle.opacity) === 0) : false,
      btnCount: buttons.length,
      btnLabel: buttons.length > 0 ? (buttons[0].innerText || buttons[0].textContent).trim().replace(/\s+/g, ' ') : '',
      reactorInViewport: rRect ? (rRect.bottom <= window.innerHeight && rRect.top >= 0) : false,
      reactorWidth: rRect ? rRect.width : 0,
      clearanceToTitle: sRect && tRect ? (sRect.left - tRect.right) : 0,
      canvasCount: canvas.length,
    };
  });

  console.log('  [TEST 1] Initial Dormant State & Single Canvas:');
  console.log(`    Portrait hidden: ${initMetrics.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Action Button count: ${initMetrics.btnCount} (expected 1: ${initMetrics.btnCount === 1 ? 'PASS' : 'FAIL'})`);
  console.log(`    Button label: "${initMetrics.btnLabel}" (expected: "VIEW PORTRAIT")`);
  console.log(`    Canvas Count: ${initMetrics.canvasCount} (expected exactly 1: ${initMetrics.canvasCount === 1 ? 'PASS' : 'FAIL'})`);
  console.log(`    Reactor grounded in viewport: ${initMetrics.reactorInViewport ? 'PASS' : 'FAIL'} (${initMetrics.reactorWidth.toFixed(1)}px width)`);
  console.log(`    Clearance to Hero title: ${initMetrics.clearanceToTitle > 0 ? 'PASS' : 'FAIL'} (${initMetrics.clearanceToTitle.toFixed(1)}px clear)`);

  await page.screenshot({ path: `${scratchDir}/phase7f_01_dormant_1440.png` });

  // 2. Click VIEW PORTRAIT -> Test Environmental Reaction & Active State
  console.log('\n  [TEST 2] Clicking VIEW PORTRAIT below tagline...');
  await page.click('.hero-tagline-control-dock .projector-action-btn');
  await page.waitForTimeout(2500); // Wait for full settle and active state

  const activeMetrics = await page.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const conduit = document.querySelector('.projection-field-conduit');
    const reactor = document.querySelector('.reactor-device-assembly');
    const btn = document.querySelector('.projector-action-btn');
    const title = document.querySelector('.hero-title');
    const bottomBar = document.querySelector('.hero-bottom-bar');
    const rays = document.querySelectorAll('.conduit-ray');
    const realImg = document.querySelector('.hero-real-portrait-img');
    const pRect = portrait.getBoundingClientRect();
    const cRect = conduit.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    const tRect = title.getBoundingClientRect();
    const bbRect = bottomBar ? bottomBar.getBoundingClientRect() : null;

    return {
      portraitW: pRect.width,
      portraitH: pRect.height,
      portraitAspect: (pRect.width / pRect.height),
      conduitW: cRect.width,
      conduitToPortraitWidthRatio: (cRect.width / pRect.width),
      reactorW: rRect.width,
      verticalGapPortraitToReactor: rRect.top - pRect.bottom,
      rayCount: rays.length,
      btnLabel: btn.innerText.trim().replace(/\s+/g, ' '),
      clearanceAboveBottom: bbRect ? (bbRect.top - rRect.bottom) : 50,
      clearanceToTitle: pRect.left - tRect.right,
      imgSrc: realImg ? realImg.getAttribute('src') : '',
    };
  });

  console.log('  [TEST 3] Active Projection State:');
  console.log(`    Button label toggled: "${activeMetrics.btnLabel}" (expected: "HIDE PORTRAIT": ${activeMetrics.btnLabel.includes('HIDE') ? 'PASS' : 'FAIL'})`);
  console.log(`    Portrait Width: ${activeMetrics.portraitW.toFixed(1)}px (Human scale: ${activeMetrics.portraitW >= 480 ? 'PASS' : 'FAIL'})`);
  console.log(`    Conduit Width: ${activeMetrics.conduitW.toFixed(1)}px (Ratio: ${(activeMetrics.conduitToPortraitWidthRatio * 100).toFixed(1)}% - spans shoulders: ${activeMetrics.conduitToPortraitWidthRatio >= 0.80 ? 'PASS' : 'FAIL'})`);
  console.log(`    Secondary Rays count: ${activeMetrics.rayCount} (expected 6: ${activeMetrics.rayCount === 6 ? 'PASS' : 'FAIL'})`);
  console.log(`    Vertical separation: ${activeMetrics.verticalGapPortraitToReactor.toFixed(1)}px`);
  console.log(`    Clearance to Hero Title: ${activeMetrics.clearanceToTitle.toFixed(1)}px`);
  console.log(`    Portrait Image Source: "${activeMetrics.imgSrc}" (transparent background portrait)`);

  // Move mouse to test subtle parallax (NO grey spotlight)
  await page.mouse.move(400, 300);
  await page.waitForTimeout(400);
  await page.mouse.move(950, 480);
  await page.waitForTimeout(600);

  await page.screenshot({ path: `${scratchDir}/phase7f_02_active_1440.png` });

  // 3. Test Scroll Depth Progression into Archive
  console.log('\n  [TEST 4] Testing Scroll Depth Progression into Archive (About -> Work)...');
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${scratchDir}/phase7f_03_scroll_about_1440.png` });

  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${scratchDir}/phase7f_04_scroll_work_1440.png` });

  // Return to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);

  // 4. Test Deactivation
  console.log('\n  [TEST 5] Testing Deactivation (HIDE PORTRAIT)...');
  await page.click('.hero-tagline-control-dock .projector-action-btn');
  await page.waitForTimeout(1500);

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

  await ctx.close();

  // ==========================================================================
  // VIEWPORTS 2-5: RESPONSIVE AUDITS
  // ==========================================================================
  const viewports = [
    { name: 'LAPTOP 1280x800', width: 1280, height: 800, file: 'phase7f_05_active_1280.png' },
    { name: 'TABLET 820x1180', width: 820, height: 1180, file: 'phase7f_06_active_820.png' },
    { name: 'MOBILE 390x844', width: 390, height: 844, file: 'phase7f_07_active_390.png' },
    { name: 'MOBILE SMALL 375x812', width: 375, height: 812, file: 'phase7f_08_active_375.png' }
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
      const canvas = document.querySelectorAll('canvas');

      const pRect = portrait ? portrait.getBoundingClientRect() : null;
      const cRect = conduit ? conduit.getBoundingClientRect() : null;
      const rRect = reactor ? reactor.getBoundingClientRect() : null;

      return {
        hasOverflow: docW > winW + 2,
        docW,
        winW,
        portraitW: pRect ? pRect.width : 0,
        conduitW: cRect ? cRect.width : 0,
        reactorW: rRect ? rRect.width : 0,
        btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
        canvasCount: canvas.length
      };
    });

    console.log(`    No horizontal overflow: ${!vpMetrics.hasOverflow ? 'PASS' : 'FAIL'} (doc: ${vpMetrics.docW}px, win: ${vpMetrics.winW}px)`);
    console.log(`    Portrait Width: ${vpMetrics.portraitW.toFixed(1)}px | Conduit Width: ${vpMetrics.conduitW.toFixed(1)}px | Reactor Width: ${vpMetrics.reactorW.toFixed(1)}px`);
    console.log(`    Canvas Count: ${vpMetrics.canvasCount} (expected 1: ${vpMetrics.canvasCount === 1 ? 'PASS' : 'FAIL'})`);
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
