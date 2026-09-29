import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function verifyLogo() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Test
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Enter experience
  try {
    const enterBtn = page.locator('.intro-enter-btn');
    await enterBtn.waitFor({ state: 'visible', timeout: 8000 });
    await enterBtn.click();
  } catch (e) {
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(3000);

  // Take screenshot of desktop header with logo
  const header = await page.$('.site-header');
  if (header) {
    await header.screenshot({
      path: 'tests/verify_logo_desktop_header.png'
    });
  }

  // Scroll to footer and take screenshot
  const footer = await page.$('.site-footer');
  if (footer) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await footer.screenshot({
      path: 'tests/verify_logo_footer.png'
    });
  }

  // 2. Mobile Test
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  try {
    const enterBtn = mobilePage.locator('.intro-enter-btn');
    await enterBtn.waitFor({ state: 'visible', timeout: 6000 });
    await enterBtn.click();
  } catch (e) {
    await mobilePage.keyboard.press('Enter');
  }
  await mobilePage.waitForTimeout(3000);

  // Click mobile menu
  const menuToggle = await mobilePage.$('.mobile-menu-toggle');
  if (menuToggle) {
    await menuToggle.click();
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: 'tests/verify_logo_mobile_menu.png' });
  }

  await browser.close();
  console.log('Logo verification screenshots captured successfully!');
}

verifyLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
