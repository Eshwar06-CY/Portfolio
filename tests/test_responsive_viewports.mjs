import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const VIEWPORTS = [
  { name: '1440x900_desktop', width: 1440, height: 900 },
  { name: '1280x800_laptop', width: 1280, height: 800 },
  { name: '1024x768_tablet_land', width: 1024, height: 768 },
  { name: '820x1180_tablet_port', width: 820, height: 1180 },
  { name: '390x844_mobile', width: 390, height: 844 }
];

async function runResponsiveTests() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });

    // 1. Loading screen screenshot
    await page.waitForTimeout(800);
    await page.screenshot({ path: `tests/screenshots/vp_${vp.name}_loading.png` });

    // 2. Wait for ready & click Enter
    await page.waitForSelector('.intro-enter-btn', { timeout: 12000 });
    await page.click('.intro-enter-btn');

    // 3. Wait for hero
    await page.waitForTimeout(3500);
    await page.waitForSelector('#hero', { state: 'visible', timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/screenshots/vp_${vp.name}_hero.png` });

    await context.close();
  }

  await browser.close();
  console.log('All responsive viewports tested successfully!');
}

runResponsiveTests().catch(err => {
  console.error(err);
  process.exit(1);
});
