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
  console.log('PHASE 7C.6 — FINAL REALISM & PHYSICAL PROJECTION REFINEMENT AUDIT');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ==========================================================================
  // VIEWPORT 1: DESKTOP 1440 x 900
  // ==========================================================================
  console.log('>>> [1/5] DESKTOP 1440x900 FULL REALISM & PROPORTIONS AUDIT <<<');
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

  await page.screenshot({ path: `${scratchDir}/phase7c6_01_dormant.png` });

  // 2. Click VIEW PORTRAIT -> 5-Phase Activation
  console.log('\n  [TEST 2] Clicking VIEW PORTRAIT to activate projection...');
  await page.click('.projector-action-btn');
  await page.waitForTimeout(2500); // Wait for full settle and active state

  const activeMetrics = await page.evaluate(() => {
    const stage = document.querySelector('.hero-portrait-stage');
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const conduit = document.querySelector('.projection-field-conduit');
    const reactor = document.querySelector('.reactor-device-assembly');
    const btn = document.querySelector('.projector-action-btn');
    const title = document.querySelector('.hero-title');
    const bottomBar = document.querySelector('.hero-bottom-bar');
    const underglow = document.querySelector('.portrait-projection-underglow');
    const baseGlow = document.querySelector('.portrait-base-glow');

    const sRect = stage.getBoundingClientRect();
    const pRect = portrait.getBoundingClientRect();
    const cRect = conduit.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const tRect = title.getBoundingClientRect();
    const bbRect = bottomBar ? bottomBar.getBoundingClientRect() : null;

    return {
      stageW: sRect.width,
      stageH: sRect.height,
      stageVwPct: (sRect.width / window.innerWidth) * 100,
      portraitW: pRect.width,
      portraitH: pRect.height,
      conduitW: cRect.width,
      conduitH: cRect.height,
      reactorW: rRect.width,
      reactorH: rRect.height,
      portraitToReactorRatio: (pRect.width / rRect.width),
      verticalGapPortraitToReactor: rRect.top - pRect.bottom,
      btnLabel: btn.innerText.trim().replace(/\s+/g, ' '),
      btnInViewport: bRect.bottom <= window.innerHeight,
      btnDistanceToBottomBar: bbRect ? (bbRect.top - bRect.bottom) : 999,
      clearanceToTitle: sRect.left - tRect.right,
      hasBaseGlowElement: !!baseGlow,
      hasUnderglowElement: !!underglow,
    };
  });

  console.log('\n  [TEST 3] Active Projection Composition:');
  console.log(`    Installation Stage: ${activeMetrics.stageW.toFixed(1)} x ${activeMetrics.stageH.toFixed(1)}px (${activeMetrics.stageVwPct.toFixed(1)}% of VW)`);
  console.log(`    Portrait Dimensions: ${activeMetrics.portraitW.toFixed(1)} x ${activeMetrics.portraitH.toFixed(1)}px`);
  console.log(`    Reactor Dimensions: ${activeMetrics.reactorW.toFixed(1)} x ${activeMetrics.reactorH.toFixed(1)}px`);
  console.log(`    Portrait / Reactor Width Ratio: ${activeMetrics.portraitToReactorRatio.toFixed(2)}x (Target: ~2.0x)`);
  console.log(`    Vertical Gap Portrait -> Reactor: ${activeMetrics.verticalGapPortraitToReactor.toFixed(1)}px`);
  console.log(`    Horizontal Base Glow Platform Removed: ${!activeMetrics.hasBaseGlowElement ? 'PASS' : 'FAIL'}`);
  console.log(`    Button label: "${activeMetrics.btnLabel}" (expected: "HIDE PORTRAIT")`);
  console.log(`    Clearance to Hero title: ${activeMetrics.clearanceToTitle > 0 ? 'PASS' : 'FAIL'} (${activeMetrics.clearanceToTitle.toFixed(1)}px clear)`);
  console.log(`    Clearance to bottom metadata: ${activeMetrics.btnDistanceToBottomBar > 0 ? 'PASS' : 'FAIL'} (${activeMetrics.btnDistanceToBottomBar.toFixed(1)}px clear)`);

  await page.screenshot({ path: `${scratchDir}/phase7c6_02_active_desktop.png` });

  // 3. Test Deactivation Collapse
  console.log('\n  [TEST 4] Clicking HIDE PORTRAIT to reverse projection...');
  await page.click('.projector-action-btn');
  await page.waitForTimeout(900);

  const deactCheck = await page.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const pStyle = portrait ? getComputedStyle(portrait) : null;
    const btn = document.querySelector('.projector-action-btn');
    return {
      portraitHidden: pStyle ? (pStyle.visibility === 'hidden' && parseFloat(pStyle.opacity) === 0) : false,
      btnLabel: btn ? btn.innerText.trim().replace(/\s+/g, ' ') : '',
    };
  });
  console.log(`    Portrait smoothly collapsed back to hidden: ${deactCheck.portraitHidden ? 'PASS' : 'FAIL'}`);
  console.log(`    Button returned to VIEW PORTRAIT: ${deactCheck.btnLabel === 'VIEW PORTRAIT' ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/phase7c6_03_dormant_restored.png` });
  await ctx.close();

  // ==========================================================================
  // VIEWPORT 2: DESKTOP 1280 x 800
  // ==========================================================================
  console.log('\n>>> [2/5] DESKTOP 1280x800 RESPONSIVE TEST <<<');
  const ctx1280 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p1280 = await ctx1280.newPage();
  await p1280.goto(URL, { waitUntil: 'networkidle' });
  await p1280.waitForTimeout(9000);
  await p1280.click('.intro-enter-btn');
  await p1280.waitForTimeout(4000);
  await p1280.click('.projector-action-btn');
  await p1280.waitForTimeout(2500);

  const m1280 = await p1280.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const title = document.querySelector('.hero-title');
    const stage = document.querySelector('.hero-portrait-stage');
    const pRect = portrait.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    const tRect = title.getBoundingClientRect();
    const sRect = stage.getBoundingClientRect();
    return {
      portraitW: pRect.width,
      reactorW: rRect.width,
      ratio: pRect.width / rRect.width,
      clearanceToTitle: sRect.left - tRect.right,
    };
  });
  console.log(`    1280x800 Portrait: ${m1280.portraitW.toFixed(1)}px, Reactor: ${m1280.reactorW.toFixed(1)}px (Ratio: ${m1280.ratio.toFixed(2)}x)`);
  console.log(`    Clearance to Title: ${m1280.clearanceToTitle.toFixed(1)}px clear`);
  await p1280.screenshot({ path: `${scratchDir}/phase7c6_04_1280_active.png` });
  await ctx1280.close();

  // ==========================================================================
  // VIEWPORT 3: TABLET 820 x 1180
  // ==========================================================================
  console.log('\n>>> [3/5] TABLET 820x1180 RESPONSIVE TEST <<<');
  const ctxTablet = await browser.newContext({ viewport: { width: 820, height: 1180 } });
  const pTablet = await ctxTablet.newPage();
  await pTablet.goto(URL, { waitUntil: 'networkidle' });
  await pTablet.waitForTimeout(9000);
  await pTablet.click('.intro-enter-btn');
  await pTablet.waitForTimeout(4000);
  await pTablet.click('.projector-action-btn');
  await pTablet.waitForTimeout(2500);

  const mTablet = await pTablet.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const pRect = portrait.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    return {
      portraitW: pRect.width,
      reactorW: rRect.width,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(`    Tablet Portrait: ${mTablet.portraitW.toFixed(1)}px, Reactor: ${mTablet.reactorW.toFixed(1)}px`);
  console.log(`    No horizontal overflow: ${!mTablet.hasOverflow ? 'PASS' : 'FAIL'}`);
  await pTablet.screenshot({ path: `${scratchDir}/phase7c6_05_tablet_active.png` });
  await ctxTablet.close();

  // ==========================================================================
  // VIEWPORT 4: MOBILE 390 x 844
  // ==========================================================================
  console.log('\n>>> [4/5] MOBILE 390x844 RESPONSIVE TEST <<<');
  const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pMobile = await ctxMobile.newPage();
  await pMobile.goto(URL, { waitUntil: 'networkidle' });
  await pMobile.waitForTimeout(9000);
  await pMobile.click('.intro-enter-btn');
  await pMobile.waitForTimeout(4000);
  await pMobile.click('.projector-action-btn');
  await pMobile.waitForTimeout(2500);

  const mMobile = await pMobile.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const btn = document.querySelector('.projector-action-btn');
    const exploreBtn = document.querySelector('.scroll-indicator-button');
    const pRect = portrait.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const eRect = exploreBtn ? exploreBtn.getBoundingClientRect() : null;
    return {
      portraitW: pRect.width,
      reactorW: rRect.width,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      buttonClearance: eRect ? (eRect.top - bRect.bottom) : 999,
    };
  });
  console.log(`    Mobile 390 Portrait: ${mMobile.portraitW.toFixed(1)}px, Reactor: ${mMobile.reactorW.toFixed(1)}px`);
  console.log(`    No horizontal overflow: ${!mMobile.hasOverflow ? 'PASS' : 'FAIL'}`);
  console.log(`    Clearance to bottom explore button: ${mMobile.buttonClearance.toFixed(1)}px`);
  await pMobile.screenshot({ path: `${scratchDir}/phase7c6_06_mobile390_active.png` });
  await ctxMobile.close();

  // ==========================================================================
  // VIEWPORT 5: MOBILE 375 x 812
  // ==========================================================================
  console.log('\n>>> [5/5] MOBILE 375x812 RESPONSIVE TEST <<<');
  const ctx375 = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const p375 = await ctx375.newPage();
  await p375.goto(URL, { waitUntil: 'networkidle' });
  await p375.waitForTimeout(9000);
  await p375.click('.intro-enter-btn');
  await p375.waitForTimeout(4000);
  await p375.click('.projector-action-btn');
  await p375.waitForTimeout(2500);

  const m375 = await p375.evaluate(() => {
    const portrait = document.querySelector('.projected-portrait-wrapper');
    const reactor = document.querySelector('.reactor-device-assembly');
    const pRect = portrait.getBoundingClientRect();
    const rRect = reactor.getBoundingClientRect();
    return {
      portraitW: pRect.width,
      reactorW: rRect.width,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(`    Mobile 375 Portrait: ${m375.portraitW.toFixed(1)}px, Reactor: ${m375.reactorW.toFixed(1)}px`);
  console.log(`    No horizontal overflow: ${!m375.hasOverflow ? 'PASS' : 'FAIL'}`);
  await p375.screenshot({ path: `${scratchDir}/phase7c6_07_mobile375_active.png` });
  await ctx375.close();

  // Global verification
  console.log('\n================================================================');
  console.log(`AUDIT FINISHED. Console errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:');
    errors.forEach(e => console.error('  ', e));
  }
  console.log('================================================================');

  await browser.close();
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
