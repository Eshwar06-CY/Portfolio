import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testPhase10B() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type === 'error' || msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('1. Loading portfolio and checking initialization centering...');
  await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Wait 1.2s into initialization
  await page.waitForTimeout(1200);

  const initInfo = await page.evaluate(() => {
    const ticker = document.querySelector('.intro-diagnostic-ticker');
    const container = document.querySelector('.intro-lower-center');
    if (!ticker) return null;
    const tRect = ticker.getBoundingClientRect();
    const cRect = container?.getBoundingClientRect();
    return {
      text: ticker.innerText.trim(),
      tickerCenterX: tRect.left + tRect.width / 2,
      windowCenterX: window.innerWidth / 2,
      tickerCenterY: tRect.top + tRect.height / 2,
      containerTopPercent: cRect ? (cRect.top + cRect.height / 2) / window.innerHeight * 100 : null,
      diffX: Math.abs((tRect.left + tRect.width / 2) - (window.innerWidth / 2))
    };
  });
  console.log('Initialization Status Centering Info:', initInfo);
  await page.screenshot({ path: 'tests/screenshots/phase10b_01_init_centered.png' });

  // Wait for subsequent status message (~3.5s)
  await page.waitForTimeout(2500);
  const msg2Info = await page.evaluate(() => {
    const ticker = document.querySelector('.intro-diagnostic-ticker');
    if (!ticker) return null;
    const tRect = ticker.getBoundingClientRect();
    return {
      text: ticker.innerText.trim(),
      tickerCenterX: tRect.left + tRect.width / 2,
      windowCenterX: window.innerWidth / 2,
      diffX: Math.abs((tRect.left + tRect.width / 2) - (window.innerWidth / 2))
    };
  });
  console.log('Second Status Message Centering Info:', msg2Info);

  // 2. Wait for SYSTEM READY state (around 7.8s on desktop, wait up to 8.5s)
  console.log('2. Waiting for SYSTEM READY state...');
  await page.waitForSelector('.intro-monumental-heading', { timeout: 12000 });
  await page.waitForTimeout(1500); // Allow entrance timeline to settle completely

  const readyInfo = await page.evaluate(() => {
    const heading = document.querySelector('.intro-monumental-heading');
    const sub = document.querySelector('.intro-access-sub');
    const btn = document.querySelector('.intro-enter-btn');
    const hRect = heading?.getBoundingClientRect();
    const sRect = sub?.getBoundingClientRect();
    const bRect = btn?.getBoundingClientRect();
    const computedH = heading ? window.getComputedStyle(heading) : null;
    const computedBtn = btn ? window.getComputedStyle(btn) : null;

    return {
      headingText: heading?.innerText.trim(),
      fontSize: computedH?.fontSize,
      fontWeight: computedH?.fontWeight,
      whiteSpace: computedH?.whiteSpace,
      headingHeight: hRect?.height,
      isSingleLine: hRect ? hRect.height < parseFloat(computedH.fontSize) * 1.6 : false,
      headingCenterX: hRect ? hRect.left + hRect.width / 2 : null,
      subCenterX: sRect ? sRect.left + sRect.width / 2 : null,
      btnCenterX: bRect ? bRect.left + bRect.width / 2 : null,
      windowCenterX: window.innerWidth / 2,
      btnBg: computedBtn?.backgroundColor,
      btnColor: computedBtn?.color,
      btnBorder: computedBtn?.border
    };
  });
  console.log('SYSTEM READY Composition Info:', readyInfo);
  await page.screenshot({ path: 'tests/screenshots/phase10b_02_system_ready_composition.png' });

  // 3. Test ENTER EXPERIENCE Hover Directional Sweep
  console.log('3. Testing ENTER EXPERIENCE Hover Sweep...');
  const enterBtn = page.locator('.intro-enter-btn');
  await enterBtn.hover();
  await page.waitForTimeout(450); // Wait for sweep animation (380ms)

  const hoveredInfo = await page.evaluate(() => {
    const btn = document.querySelector('.intro-enter-btn');
    const label = btn?.querySelector('.btn-label-text');
    const arrow = btn?.querySelector('.btn-enter-arrow');
    return {
      labelColor: label ? window.getComputedStyle(label).color : null,
      arrowColor: arrow ? window.getComputedStyle(arrow).color : null
    };
  });
  console.log('ENTER EXPERIENCE Hovered Colors:', hoveredInfo);
  await page.screenshot({ path: 'tests/screenshots/phase10b_03_enter_hover_sweep.png' });

  // Move mouse away
  console.log('4. Testing Mouse Leave Retraction...');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(450);

  const unhoveredInfo = await page.evaluate(() => {
    const btn = document.querySelector('.intro-enter-btn');
    const label = btn?.querySelector('.btn-label-text');
    const arrow = btn?.querySelector('.btn-enter-arrow');
    return {
      labelColor: label ? window.getComputedStyle(label).color : null,
      arrowColor: arrow ? window.getComputedStyle(arrow).color : null
    };
  });
  console.log('ENTER EXPERIENCE Unhovered Colors:', unhoveredInfo);
  await page.screenshot({ path: 'tests/screenshots/phase10b_04_enter_unhover_retracted.png' });

  // 4. Test Viewports for Single Line & Centering
  console.log('5. Testing Responsive Viewports for SYSTEM READY single line & centering...');
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(400);

    const vpCheck = await page.evaluate((vp) => {
      const heading = document.querySelector('.intro-monumental-heading');
      const hRect = heading?.getBoundingClientRect();
      const style = heading ? window.getComputedStyle(heading) : null;
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      return {
        viewport: `${vp.width}x${vp.height}`,
        fontSize: style?.fontSize,
        whiteSpace: style?.whiteSpace,
        headingHeight: hRect?.height,
        isSingleLine: hRect ? hRect.height < parseFloat(style.fontSize) * 1.6 : false,
        hasHorizontalOverflow: scrollW > docW,
        diffCenterX: hRect ? Math.abs((hRect.left + hRect.width / 2) - (window.innerWidth / 2)) : null
      };
    }, vp);
    console.log(`Viewport check (${vp.width}x${vp.height}):`, vpCheck);
    if (vp.width === 390) {
      await page.screenshot({ path: 'tests/screenshots/phase10b_05_mobile_ready.png' });
    }
  }

  // 5. Click ENTER EXPERIENCE and verify Transition to Hero
  console.log('6. Clicking ENTER EXPERIENCE...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  await enterBtn.click();

  // Wait for the exit and hero arrival (~3.8s)
  await page.waitForTimeout(4000);

  const heroArrival = await page.evaluate(() => {
    const heroTitle = document.querySelector('.hero-title');
    const viewPortal = document.querySelector('.projector-action-btn');
    return {
      heroArrived: !!heroTitle,
      heroText: heroTitle?.innerText.trim(),
      hasViewPortal: !!viewPortal
    };
  });
  console.log('Hero Arrival after Enter:', heroArrival);
  await page.screenshot({ path: 'tests/screenshots/phase10b_06_hero_transition.png' });

  console.log('Console Errors:', consoleErrors.filter(e => !e.includes('THREE.WebGLAttributes')));
  console.log('Phase 10B Validation Complete!');
  await browser.close();
}

testPhase10B().catch(err => {
  console.error('Validation test failed:', err);
  process.exit(1);
});
