const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173/ at 1440x1200...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait for loading screen and click ENTER EXPERIENCE or wait for transition
  await page.waitForTimeout(3000);
  const enterBtn = await page.$('.btn-enter-experience');
  if (enterBtn) {
    console.log('Found ENTER EXPERIENCE button, clicking...');
    await enterBtn.click();
    await page.waitForTimeout(3500);
  } else {
    console.log('Waiting for intro to complete or enter automatically...');
    await page.waitForTimeout(6000);
  }

  // Check Hero presence
  await page.waitForSelector('.hero-container', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Inspect computed styles
  const heroMetrics = await page.evaluate(() => {
    const titleEl = document.querySelector('.hero-title');
    const contentEl = document.querySelector('.hero-content');
    const logoEl = document.querySelector('.brand-logo-mark');
    const reactorEl = document.querySelector('.reactor-node, .reactor-container, .hero-reactor');
    const portalBtn = document.querySelector('.btn-action-label');
    const navEl = document.querySelector('.nav-links');

    const getMetrics = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        transform: style.transform
      };
    };

    return {
      title: getMetrics(titleEl),
      content: getMetrics(contentEl),
      logo: getMetrics(logoEl),
      reactor: getMetrics(reactorEl),
      portalBtn: portalBtn ? portalBtn.innerText : null,
      globalScaleApplied: !!document.querySelector('[style*="scale("], [style*="zoom:"]')
    };
  });

  console.log('Hero Metrics at 1440x1200:', JSON.stringify(heroMetrics, null, 2));
  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  const screenshotPath = path.join(__dirname, 'restored_master_1440x1200_hero.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
})();
