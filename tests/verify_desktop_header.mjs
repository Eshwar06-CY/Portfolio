import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function verifyDesktopHeader() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait for intro ready state and click enter button
  const enterBtn = page.locator('.intro-enter-btn');
  await enterBtn.waitFor({ state: 'visible', timeout: 12000 });
  await enterBtn.click();

  // Wait for transition to complete and navbar to mount
  const navBrand = page.locator('.brand-logo-mark');
  await navBrand.waitFor({ state: 'visible', timeout: 6000 });
  await page.waitForTimeout(1000);

  // Take screenshot of desktop header with logo
  await page.screenshot({
    path: 'tests/verify_logo_desktop_header.png',
    clip: { x: 0, y: 0, width: 1440, height: 80 }
  });

  await browser.close();
  console.log('Desktop header verified successfully!');
}

verifyDesktopHeader().catch(err => {
  console.error(err);
  process.exit(1);
});
