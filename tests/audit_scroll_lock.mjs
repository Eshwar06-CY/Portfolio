import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const PORT = 5174;
const URL = `http://localhost:${PORT}/`;

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';

async function getScrollY(page) {
  return page.evaluate(() => window.scrollY);
}

async function aggressiveWheelScroll(page, times = 10) {
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(200);
}

async function auditScrollLock() {
  console.log('================================================================');
  console.log('PHASE 7A — SCROLL LOCK AUDIT');
  console.log('================================================================\\n');

  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const results = {};

  // ===================================================================
  // TEST 1: DESKTOP 1440x900 — AGGRESSIVE WHEEL DURING INIT
  // ===================================================================
  console.log('>>> TEST 1: DESKTOP — WHEEL DURING INITIALIZATION <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[desktop] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });

    // Stage 1: BOOT (0-600ms) — immediate aggressive scroll
    await page.waitForTimeout(200);
    await aggressiveWheelScroll(page, 15);
    const scrollAtBoot = await getScrollY(page);
    console.log(`  Stage 1 BOOT scrollY: ${scrollAtBoot} (Expected: 0)`);

    // Stage 2-3: NODES FORMING (600ms-3s)
    await page.waitForTimeout(800);
    await aggressiveWheelScroll(page, 15);
    const scrollAtNodes = await getScrollY(page);
    console.log(`  Stage 2-3 NODES scrollY: ${scrollAtNodes} (Expected: 0)`);

    // Stage 4-5: NETWORK EXPANSION (3s-5s)
    await page.waitForTimeout(1500);
    await aggressiveWheelScroll(page, 15);
    const scrollAtNetwork = await getScrollY(page);
    console.log(`  Stage 4-5 NETWORK scrollY: ${scrollAtNetwork} (Expected: 0)`);

    // Stage 6-7: CORE FORMATION / SYSTEM READY (~6-8.4s)
    await page.waitForTimeout(3000);
    await aggressiveWheelScroll(page, 20);
    const scrollAtReady = await getScrollY(page);
    console.log(`  Stage 6-7 READY scrollY: ${scrollAtReady} (Expected: 0)`);

    // Take screenshot at READY state after aggressive scrolling
    await page.screenshot({ path: `${scratchDir}/p7a_ready_after_scroll_attempt.png` });

    // Check if About section has moved
    const aboutVisible = await page.evaluate(() => {
      const aboutEl = document.querySelector('#about');
      if (!aboutEl) return { exists: false };
      const rect = aboutEl.getBoundingClientRect();
      return {
        exists: true,
        top: Math.round(rect.top),
        isInViewport: rect.top < window.innerHeight && rect.bottom > 0
      };
    });
    console.log(`  About section visibility: ${JSON.stringify(aboutVisible)}`);

    results.desktop = {
      scrollAtBoot,
      scrollAtNodes,
      scrollAtNetwork,
      scrollAtReady,
      aboutVisibleDuringIntro: aboutVisible.isInViewport || false,
      allZero: scrollAtBoot === 0 && scrollAtNodes === 0 && scrollAtNetwork === 0 && scrollAtReady === 0
    };

    // Now click ENTER and test scroll during transition
    console.log('\\n  >>> ENTER TRANSITION SCROLL TEST <<<');
    await page.click('.intro-enter-btn');

    await page.waitForTimeout(500);
    await aggressiveWheelScroll(page, 10);
    const scrollDuringTransition = await getScrollY(page);
    console.log(`  During transition scrollY: ${scrollDuringTransition} (Expected: 0)`);
    results.desktop.scrollDuringTransition = scrollDuringTransition;

    // Wait for hero to stabilize
    await page.waitForTimeout(4000);
    const scrollAfterHero = await getScrollY(page);
    console.log(`  After hero scrollY: ${scrollAfterHero} (Expected: 0)`);

    // Test normal scroll works
    await aggressiveWheelScroll(page, 5);
    const scrollAfterWheel = await getScrollY(page);
    console.log(`  After post-hero wheel scrollY: ${scrollAfterWheel} (Expected: > 0)`);
    results.desktop.scrollAfterHero = scrollAfterHero;
    results.desktop.scrollWorksAfter = scrollAfterWheel > 0;

    await page.screenshot({ path: `${scratchDir}/p7a_after_hero_scroll.png` });
    await ctx.close();
  }

  // ===================================================================
  // TEST 2: KEYBOARD SCROLL PREVENTION
  // ===================================================================
  console.log('\\n>>> TEST 2: KEYBOARD SCROLL PREVENTION <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[keyboard] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const scrollKeys = ['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];
    for (const key of scrollKeys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(100);
    }
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(200);

    const scrollAfterKeys = await getScrollY(page);
    console.log(`  After all scroll keys: scrollY = ${scrollAfterKeys} (Expected: 0)`);
    results.keyboard = { scrollAfterKeys, locked: scrollAfterKeys === 0 };
    await ctx.close();
  }

  // ===================================================================
  // TEST 3: TABLET 820x1180
  // ===================================================================
  console.log('\\n>>> TEST 3: TABLET 820x1180 <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[tablet] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await aggressiveWheelScroll(page, 15);
    const scrollDuringInit = await getScrollY(page);

    await page.waitForTimeout(5500);
    await aggressiveWheelScroll(page, 10);
    const scrollAtReady = await getScrollY(page);

    console.log(`  During init scrollY: ${scrollDuringInit} (Expected: 0)`);
    console.log(`  At READY scrollY: ${scrollAtReady} (Expected: 0)`);

    await page.click('.intro-enter-btn');
    await page.waitForTimeout(4200);
    await aggressiveWheelScroll(page, 5);
    const scrollAfter = await getScrollY(page);
    console.log(`  After hero scroll: ${scrollAfter} (Expected: > 0)`);

    results.tablet = {
      scrollDuringInit,
      scrollAtReady,
      scrollWorksAfter: scrollAfter > 0,
      allLocked: scrollDuringInit === 0 && scrollAtReady === 0
    };
    await ctx.close();
  }

  // ===================================================================
  // TEST 4: MOBILE 390x844
  // ===================================================================
  console.log('\\n>>> TEST 4: MOBILE 390x844 <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[mobile390] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    await aggressiveWheelScroll(page, 15);
    const scrollDuringInit = await getScrollY(page);

    await page.waitForTimeout(4500);
    await aggressiveWheelScroll(page, 15);
    const scrollAtReady = await getScrollY(page);

    console.log(`  During init scrollY: ${scrollDuringInit} (Expected: 0)`);
    console.log(`  At READY scrollY: ${scrollAtReady} (Expected: 0)`);

    await page.click('.intro-enter-btn');
    await page.waitForTimeout(3800);
    await aggressiveWheelScroll(page, 5);
    const scrollAfter = await getScrollY(page);
    console.log(`  After hero scroll: ${scrollAfter} (Expected: > 0)`);

    results.mobile390 = {
      scrollDuringInit,
      scrollAtReady,
      scrollWorksAfter: scrollAfter > 0,
      allLocked: scrollDuringInit === 0 && scrollAtReady === 0
    };
    await ctx.close();
  }

  // ===================================================================
  // TEST 5: MOBILE 375x812
  // ===================================================================
  console.log('\\n>>> TEST 5: MOBILE 375x812 <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[mobile375] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    await aggressiveWheelScroll(page, 15);
    const scrollDuringInit = await getScrollY(page);

    await page.waitForTimeout(4500);
    await aggressiveWheelScroll(page, 15);
    const scrollAtReady = await getScrollY(page);

    console.log(`  During init scrollY: ${scrollDuringInit} (Expected: 0)`);
    console.log(`  At READY scrollY: ${scrollAtReady} (Expected: 0)`);

    await page.click('.intro-enter-btn');
    await page.waitForTimeout(3800);
    await aggressiveWheelScroll(page, 5);
    const scrollAfter = await getScrollY(page);
    console.log(`  After hero scroll: ${scrollAfter} (Expected: > 0)`);

    results.mobile375 = {
      scrollDuringInit,
      scrollAtReady,
      scrollWorksAfter: scrollAfter > 0,
      allLocked: scrollDuringInit === 0 && scrollAtReady === 0
    };
    await ctx.close();
  }

  // ===================================================================
  // TEST 6: REDUCED MOTION
  // ===================================================================
  console.log('\\n>>> TEST 6: REDUCED MOTION <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[reduced] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await aggressiveWheelScroll(page, 10);
    const scrollBeforeEnter = await getScrollY(page);

    await page.waitForTimeout(1500);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(1000);

    await aggressiveWheelScroll(page, 5);
    const scrollAfter = await getScrollY(page);

    console.log(`  Before ENTER scrollY: ${scrollBeforeEnter} (Expected: 0)`);
    console.log(`  After hero scroll: ${scrollAfter} (Expected: > 0)`);

    results.reducedMotion = {
      scrollBeforeEnter,
      scrollWorksAfter: scrollAfter > 0,
      locked: scrollBeforeEnter === 0
    };
    await ctx.close();
  }

  // ===================================================================
  // TEST 7: POST-ENTER DEEP SCROLL (regression test)
  // ===================================================================
  console.log('\\n>>> TEST 7: POST-ENTER FULL PORTFOLIO SCROLL <<<');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`[scroll-regression] ${m.text()}`); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(8500);
    await page.click('.intro-enter-btn');
    await page.waitForTimeout(4800);

    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(500);

    const finalScrollY = await getScrollY(page);
    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    console.log(`  Final scrollY: ${finalScrollY} / ${maxScroll}`);
    console.log(`  Scrolled past 30%: ${finalScrollY > maxScroll * 0.3 ? 'YES' : 'NO'}`);

    results.scrollRegression = {
      finalScrollY,
      maxScroll,
      canScrollDeep: finalScrollY > maxScroll * 0.3
    };
    await ctx.close();
  }

  await browser.close();

  // ===================================================================
  // FINAL REPORT
  // ===================================================================
  console.log('\\n================================================================');
  console.log('SCROLL LOCK AUDIT RESULTS');
  console.log('================================================================');

  const allPassed = [
    results.desktop?.allZero,
    results.desktop?.scrollDuringTransition === 0,
    results.desktop?.scrollWorksAfter,
    results.keyboard?.locked,
    results.tablet?.allLocked,
    results.tablet?.scrollWorksAfter,
    results.mobile390?.allLocked,
    results.mobile390?.scrollWorksAfter,
    results.mobile375?.allLocked,
    results.mobile375?.scrollWorksAfter,
    results.reducedMotion?.locked,
    results.reducedMotion?.scrollWorksAfter,
    results.scrollRegression?.canScrollDeep
  ].every(Boolean);

  console.log(`\\nDesktop init locked: ${results.desktop?.allZero ? 'PASS' : 'FAIL'}`);
  console.log(`Desktop transition locked: ${results.desktop?.scrollDuringTransition === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`Desktop post-hero scrollable: ${results.desktop?.scrollWorksAfter ? 'PASS' : 'FAIL'}`);
  console.log(`Keyboard locked: ${results.keyboard?.locked ? 'PASS' : 'FAIL'}`);
  console.log(`Tablet locked: ${results.tablet?.allLocked ? 'PASS' : 'FAIL'}`);
  console.log(`Tablet post-hero scrollable: ${results.tablet?.scrollWorksAfter ? 'PASS' : 'FAIL'}`);
  console.log(`Mobile 390 locked: ${results.mobile390?.allLocked ? 'PASS' : 'FAIL'}`);
  console.log(`Mobile 390 post-hero scrollable: ${results.mobile390?.scrollWorksAfter ? 'PASS' : 'FAIL'}`);
  console.log(`Mobile 375 locked: ${results.mobile375?.allLocked ? 'PASS' : 'FAIL'}`);
  console.log(`Mobile 375 post-hero scrollable: ${results.mobile375?.scrollWorksAfter ? 'PASS' : 'FAIL'}`);
  console.log(`Reduced motion locked: ${results.reducedMotion?.locked ? 'PASS' : 'FAIL'}`);
  console.log(`Reduced motion post-hero scrollable: ${results.reducedMotion?.scrollWorksAfter ? 'PASS' : 'FAIL'}`);
  console.log(`Post-enter deep scroll: ${results.scrollRegression?.canScrollDeep ? 'PASS' : 'FAIL'}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.log(`  WARNING: ${e}`));
  }
  console.log(`\\nOVERALL: ${allPassed ? 'ALL PASSED' : 'FAILURES DETECTED'}`);
}

auditScrollLock().catch(console.error);
