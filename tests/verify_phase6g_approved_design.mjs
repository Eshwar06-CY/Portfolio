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
  { name: 'desktop_1440x900', width: 1440, height: 900, initDuration: 7800 },
  { name: 'tablet_820x1180', width: 820, height: 1180, initDuration: 6000 },
  { name: 'mobile_390x844', width: 390, height: 844, initDuration: 4800 },
  { name: 'mobile_375x812', width: 375, height: 812, initDuration: 4800 }
];

async function runPhase6GVerification() {
  console.log('================================================================');
  console.log('STARTING PHASE 6G APPROVED COMPUTATIONAL CORE VERIFICATION');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const results = [];

  // --- STAGE-BY-STAGE PROGRESSION SCREENSHOTS (DESKTOP 1440x900) ---
  console.log('>>> CAPTURING 7-STAGE EMERGENCE ON DESKTOP (1440x900) <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Stage 1/2: First nodes & inner crystal (t = 2.0s)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_stage2_first_nodes.png') });
    console.log('✓ Stage 2 screenshot captured: first nodes & inner crystal');

    // Stage 3: Connection formation (t = 3.8s)
    await page.waitForTimeout(1800);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_stage3_connection_formation.png') });
    console.log('✓ Stage 3 screenshot captured: synaptic connections & inner octahedron');

    // Stage 4: Network expansion (t = 5.4s)
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_stage4_network_expansion.png') });
    console.log('✓ Stage 4 screenshot captured: subdivided icosahedron & orbital rings');

    // Stage 5: Data propagation (t = 6.8s)
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_stage5_data_propagation.png') });
    console.log('✓ Stage 5 screenshot captured: outer dodecahedron & traveling pulses');

    // Stage 7: SYSTEM READY (t = 8.5s)
    await page.waitForTimeout(1700);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_stage7_ready_target.png') });
    console.log('✓ Stage 7 screenshot captured: full stabilized computational intelligence core');

    // Hover button
    const enterBtn = page.locator('.intro-enter-btn');
    await enterBtn.hover();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_hover_active.png') });
    console.log('✓ Hover screenshot captured');

    // Click ENTER and capture intermediate transition frame
    await enterBtn.click();
    console.log('✓ Clicked real ENTER button. Capturing transition flight frames...');

    await page.waitForTimeout(1600); // 1.60s camera in network
    await page.screenshot({ path: path.join(scratchDir, 'p6g_trans_camera_travel.png') });

    await page.waitForTimeout(500); // 2.10s core aperture bloom
    await page.screenshot({ path: path.join(scratchDir, 'p6g_trans_core_bloom.png') });

    await page.waitForTimeout(280); // 2.38s core pass-through
    await page.screenshot({ path: path.join(scratchDir, 'p6g_trans_core_pass.png') });

    await page.waitForTimeout(1800); // Hero revealed
    await page.screenshot({ path: path.join(scratchDir, 'p6g_hero_revealed.png') });
    console.log('✓ Hero reveal captured');

    // Test wheel scroll
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(scratchDir, 'p6g_hero_scrolled.png') });
    console.log('✓ Scroll test captured');

    await ctx.close();
  }

  // --- MULTI-VIEWPORT VERIFICATION SUITE ---
  for (const vp of VIEWPORTS) {
    console.log(`\n----------------------------------------------------------------`);
    console.log(`>>> VERIFYING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) <<<`);
    console.log(`----------------------------------------------------------------`);

    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const page = await ctx.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    console.log('1. Loading http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Pre-Enter Check: No personal identity, exactly 1 canvas
    const earlyCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const canvas = document.querySelectorAll('canvas');
      return {
        hasPersonalName: text.includes('Eshwar') || text.includes('ESHWAR'),
        hasCollege: text.includes('Vidyavardhaka') || text.includes('VVCE'),
        canvasCount: canvas.length,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('2. Early privacy check:', JSON.stringify(earlyCheck));

    // Wait until ready state appears
    console.log(`3. Waiting for neural initialization (${vp.initDuration + 600}ms)...`);
    await page.waitForTimeout(vp.initDuration + 700);

    const readyCheck = await page.evaluate(() => {
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      const canvas = document.querySelectorAll('canvas');
      return {
        headingText: heading?.textContent.trim(),
        enterBtnPresent: !!enterBtn,
        canvasCount: canvas.length,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('4. Ready State audit:', JSON.stringify(readyCheck));
    await page.screenshot({ path: path.join(scratchDir, `p6g_${vp.name}_ready.png`) });

    // Click ENTER
    console.log('5. Clicking real [ ENTER EXPERIENCE ] button...');
    const btn = page.locator('.intro-enter-btn');
    await btn.click();

    // Wait for full transition and hero reveal stabilization (3.8s)
    await page.waitForTimeout(4000);

    const postEnterCheck = await page.evaluate(() => {
      const intro = document.querySelector('.cinematic-intro-root');
      const hero = document.querySelector('#hero');
      const title = hero?.querySelector('.hero-title');
      const portrait = hero?.querySelector('.hero-portrait-img');
      const canvas = document.querySelectorAll('canvas');

      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      return {
        introUnmounted: !intro,
        heroVisible: !!hero && heroStyle?.visibility === 'visible' && parseFloat(heroStyle?.opacity || '0') > 0.8,
        titleText: title?.textContent.replace(/\s+/g, ' ').trim(),
        portraitPresent: !!portrait,
        canvasCount: canvas.length,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log('6. Hero Reveal audit:', JSON.stringify(postEnterCheck));
    await page.screenshot({ path: path.join(scratchDir, `p6g_${vp.name}_hero.png`) });

    // Test wheel scroll
    console.log('7. Testing wheel scroll interaction...');
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(800);

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`   Scroll position after wheel down: ${Math.round(scrollY)}px (Expected > 0)`);

    const passed = (
      !earlyCheck.hasPersonalName &&
      !earlyCheck.hasCollege &&
      earlyCheck.canvasCount === 1 &&
      !earlyCheck.hasOverflow &&
      readyCheck.headingText === 'SYSTEM READY' &&
      readyCheck.enterBtnPresent &&
      readyCheck.canvasCount === 1 &&
      !readyCheck.hasOverflow &&
      postEnterCheck.introUnmounted &&
      postEnterCheck.heroVisible &&
      postEnterCheck.titleText.includes('ESHWAR M') &&
      postEnterCheck.portraitPresent &&
      postEnterCheck.canvasCount === 1 &&
      !postEnterCheck.hasOverflow &&
      scrollY > 500 &&
      consoleErrors.length === 0
    );

    console.log(`>>> VIEWPORT ${vp.name} RESULT: ${passed ? 'PASS ✓' : 'FAIL ✗'} <<<`);
    results.push({ name: vp.name, passed, scrollY, consoleErrors });
    await ctx.close();
  }

  // --- REDUCED MOTION VERIFICATION ---
  console.log(`\n----------------------------------------------------------------`);
  console.log(`>>> VERIFYING PREFERS-REDUCED-MOTION (1440x900) <<<`);
  console.log(`----------------------------------------------------------------`);
  {
    const rmCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const rmPage = await rmCtx.newPage();
    const rmConsoleErrors = [];
    rmPage.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        rmConsoleErrors.push(msg.text());
      }
    });

    await rmPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await rmPage.waitForTimeout(2000); // 1.6s duration + margin

    const rmReadyCheck = await rmPage.evaluate(() => {
      const heading = document.querySelector('.intro-monumental-heading');
      const enterBtn = document.querySelector('.intro-enter-btn');
      return {
        headingText: heading?.textContent.trim(),
        enterBtnPresent: !!enterBtn
      };
    });

    console.log('1. Reduced Motion Ready:', JSON.stringify(rmReadyCheck));
    await rmPage.click('.intro-enter-btn');
    await rmPage.waitForTimeout(800);

    const rmPostCheck = await rmPage.evaluate(() => {
      const hero = document.querySelector('#hero');
      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      return {
        heroVisible: !!hero && heroStyle?.visibility === 'visible' && parseFloat(heroStyle?.opacity || '0') > 0.8
      };
    });

    console.log('2. Reduced Motion Post-Enter:', JSON.stringify(rmPostCheck));
    const rmPassed = rmReadyCheck.headingText === 'SYSTEM READY' && rmReadyCheck.enterBtnPresent && rmPostCheck.heroVisible && rmConsoleErrors.length === 0;
    console.log(`>>> REDUCED MOTION RESULT: ${rmPassed ? 'PASS ✓' : 'FAIL ✗'} <<<`);
    results.push({ name: 'reduced_motion', passed: rmPassed });
    await rmCtx.close();
  }

  await browser.close();

  console.log('\n================================================================');
  console.log('FINAL PHASE 6G VERIFICATION SUMMARY');
  console.log('================================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`Total Scenarios: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.passed).length}`);
  console.log(`Failed: ${results.filter(r => !r.passed).length}`);
  console.log(`Overall: ${allPassed ? 'ALL VERIFICATIONS PASSED ✓' : 'SOME VERIFICATIONS FAILED ✗'}\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

runPhase6GVerification().catch(err => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
