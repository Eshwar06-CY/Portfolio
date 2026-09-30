import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testPhase10() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  const targetUrl = 'http://localhost:5174/';
  console.log(`1. Loading portfolio at ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  // 2. Check typing status text during initializing
  console.log('2. Inspecting typing status text...');
  await page.waitForTimeout(400);

  const t1 = await page.evaluate(() => {
    const ticker = document.querySelector('.intro-diagnostic-ticker');
    const textEl = document.querySelector('.diagnostic-text');
    const caret = document.querySelector('.intro-typing-caret');
    const centerBlock = document.querySelector('.intro-lower-center');
    const style = textEl ? window.getComputedStyle(textEl) : null;
    const centerStyle = centerBlock ? window.getComputedStyle(centerBlock) : null;

    return {
      hasTicker: !!ticker,
      text: textEl ? textEl.innerText : '',
      hasCaret: !!caret,
      caretText: caret ? caret.innerText : '',
      fontFamily: style ? style.fontFamily : '',
      fontSize: style ? style.fontSize : '',
      topPosition: centerStyle ? centerStyle.top : '',
      leftPosition: centerStyle ? centerStyle.left : ''
    };
  });
  console.log('Typing at 400ms:', t1);

  await page.waitForTimeout(700);
  const t2 = await page.evaluate(() => {
    const textEl = document.querySelector('.diagnostic-text');
    return textEl ? textEl.innerText : '';
  });
  console.log('Typing at 1100ms:', t2);

  await page.screenshot({ path: 'tests/screenshots/phase10_01_typing_status.png' });

  // 3. Wait for SYSTEM READY
  console.log('3. Waiting for SYSTEM READY...');
  await page.waitForSelector('.intro-monumental-heading', { timeout: 12000 });
  await page.waitForTimeout(400); // let sweep-in complete

  const readyState = await page.evaluate(() => {
    const heading = document.querySelector('.intro-monumental-heading');
    const btn = document.querySelector('.intro-enter-btn');
    const label = document.querySelector('.btn-label-text');
    const centerBlock = document.querySelector('.intro-lower-center');

    const headingStyle = heading ? window.getComputedStyle(heading) : null;
    const btnStyle = btn ? window.getComputedStyle(btn) : null;
    const centerStyle = centerBlock ? window.getComputedStyle(centerBlock) : null;

    return {
      headingText: heading ? heading.innerText.trim() : '',
      headingFont: headingStyle ? headingStyle.fontFamily : '',
      headingWeight: headingStyle ? headingStyle.fontWeight : '',
      headingSize: headingStyle ? headingStyle.fontSize : '',
      btnText: label ? label.innerText.trim() : '',
      btnFont: btnStyle ? btnStyle.fontFamily : '',
      btnWeight: btnStyle ? btnStyle.fontWeight : '',
      centerTop: centerStyle ? centerStyle.top : '',
      centerLeft: centerStyle ? centerStyle.left : '',
      centerTransform: centerStyle ? centerStyle.transform : ''
    };
  });
  console.log('SYSTEM READY Settle State:', readyState);
  await page.screenshot({ path: 'tests/screenshots/phase10_02_system_ready_settled.png' });

  // 4. Verify stability of ENTER EXPERIENCE after glitch arrival
  console.log('4. Verifying stability of ENTER EXPERIENCE...');
  await page.waitForTimeout(1000);
  const stableBtnState = await page.evaluate(() => {
    const btn = document.querySelector('.intro-enter-btn');
    const btnStyle = btn ? window.getComputedStyle(btn) : null;
    return {
      opacity: btnStyle ? btnStyle.opacity : null,
      transform: btnStyle ? btnStyle.transform : null,
      visibility: btnStyle ? btnStyle.visibility : null
    };
  });
  console.log('ENTER EXPERIENCE Stable State:', stableBtnState);
  await page.screenshot({ path: 'tests/screenshots/phase10_03_ready_composition.png' });

  // 5. Test Click ENTER EXPERIENCE
  console.log('5. Clicking ENTER EXPERIENCE...');
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(3800);
  await page.waitForSelector('#hero', { state: 'visible', timeout: 10000 });

  const heroState = await page.evaluate(() => {
    const heroTitle = document.querySelector('.hero-title');
    const introRoot = document.querySelector('.cinematic-intro-root');
    return {
      heroTitleText: heroTitle ? heroTitle.innerText.trim() : '',
      introUnmounted: !introRoot
    };
  });
  console.log('Hero State after Enter:', heroState);
  await page.screenshot({ path: 'tests/screenshots/phase10_04_hero_entered.png' });

  // 6. Test Mobile Viewport (390x844)
  console.log('6. Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await mobilePage.evaluate(() => sessionStorage.clear());
  await mobilePage.reload({ waitUntil: 'domcontentloaded' });
  await mobilePage.evaluate(() => document.fonts.ready);

  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'tests/screenshots/phase10_05_mobile_typing.png' });

  await mobilePage.waitForSelector('.intro-monumental-heading', { timeout: 15000 });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: 'tests/screenshots/phase10_06_mobile_ready.png' });
  await mobileContext.close();

  console.log('Console Errors:', consoleErrors);

  await browser.close();
  console.log('Phase 10 Tests completed successfully!');
}

testPhase10().catch(err => {
  console.error(err);
  process.exit(1);
});
