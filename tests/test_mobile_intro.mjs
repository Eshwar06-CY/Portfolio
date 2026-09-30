import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('1. Loading mobile viewport (390x844)...');
  await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.waitForTimeout(600);
  console.log('2. Inspecting mobile typing state...');
  const typingState = await page.evaluate(() => {
    const textEl = document.querySelector('.diagnostic-text');
    const caret = document.querySelector('.intro-typing-caret');
    const centerBlock = document.querySelector('.intro-lower-center');
    const style = centerBlock ? window.getComputedStyle(centerBlock) : null;
    return {
      text: textEl ? textEl.innerText : '',
      hasCaret: !!caret,
      top: style ? style.top : '',
      left: style ? style.left : '',
      transform: style ? style.transform : ''
    };
  });
  console.log('Mobile typing:', typingState);
  await page.screenshot({ path: 'tests/screenshots/phase10_05_mobile_typing.png' });

  console.log('3. Waiting for mobile SYSTEM READY...');
  await page.waitForSelector('.intro-monumental-heading', { timeout: 15000 });
  await page.waitForTimeout(700);

  const readyState = await page.evaluate(() => {
    const heading = document.querySelector('.intro-monumental-heading');
    const btn = document.querySelector('.intro-enter-btn');
    const centerBlock = document.querySelector('.intro-lower-center');
    const headingRect = heading ? heading.getBoundingClientRect() : null;
    const btnRect = btn ? btn.getBoundingClientRect() : null;
    const centerStyle = centerBlock ? window.getComputedStyle(centerBlock) : null;
    return {
      headingText: heading ? heading.innerText.trim() : '',
      headingBounds: headingRect,
      btnBounds: btnRect,
      centerTop: centerStyle ? centerStyle.top : '',
      centerLeft: centerStyle ? centerStyle.left : '',
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });
  console.log('Mobile Ready state:', readyState);
  await page.screenshot({ path: 'tests/screenshots/phase10_06_mobile_ready.png' });

  console.log('Mobile console errors:', consoleErrors);
  await browser.close();
  console.log('Mobile intro test complete!');
}

testMobile().catch(err => {
  console.error(err);
  process.exit(1);
});
