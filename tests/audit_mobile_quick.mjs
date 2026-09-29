import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Press Enter key to enter directly
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);

  // Capture Mobile Hero
  await page.screenshot({ path: 'tests/audit_video_screens/6_mobile_hero.png' });

  // Scroll to Work
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/audit_video_screens/7_mobile_work.png' });

  await browser.close();
  console.log('Mobile screenshots captured successfully!');
}

testMobile().catch(e => {
  console.error(e);
  process.exit(1);
});
