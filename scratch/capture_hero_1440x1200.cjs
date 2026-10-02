const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 }
  });
  const page = await context.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to http://localhost:5173/ at 1440x1200...');
  await page.goto('http://localhost:5173/');

  // Check if intro is present
  try {
    const enterBtn = await page.waitForSelector('.btn-enter-experience', { timeout: 9500 });
    if (enterBtn) {
      console.log('Clicking ENTER EXPERIENCE button...');
      await enterBtn.click();
      await page.waitForTimeout(3800);
    }
  } catch (e) {
    console.log('No enter button or intro already bypassed, proceeding to Hero...');
  }

  // Wait for Hero title
  await page.waitForSelector('.hero-title', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(() => {
    const title = document.querySelector('.hero-title');
    const content = document.querySelector('.hero-content');
    const logo = document.querySelector('.brand-logo-mark');
    const reactor = document.querySelector('.reactor-core, .hero-reactor, .reactor-node, .reactor-assembly');
    const portalBtn = document.querySelector('.btn-action-label');
    const navLinks = document.querySelector('.nav-links');
    const metaEyebrow = document.querySelector('.hero-meta-eyebrow, .meta-ticker');
    const tagline = document.querySelector('.hero-tagline, .hero-role');

    const getBox = el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        width: r.width,
        height: r.height,
        top: r.top,
        left: r.left,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight
      };
    };

    return {
      title: getBox(title),
      content: getBox(content),
      logo: getBox(logo),
      reactor: getBox(reactor),
      portalBtn: portalBtn ? portalBtn.textContent.trim() : null,
      nav: getBox(navLinks),
      metaEyebrow: getBox(metaEyebrow),
      tagline: getBox(tagline),
      htmlTransform: window.getComputedStyle(document.documentElement).transform,
      bodyTransform: window.getComputedStyle(document.body).transform,
      rootTransform: window.getComputedStyle(document.getElementById('root')).transform
    };
  });

  console.log('Restored Master Metrics at 1440x1200:', JSON.stringify(metrics, null, 2));
  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await page.screenshot({ path: 'scratch/restored_master_1440x1200_hero.png' });
  console.log('Saved screenshot to: scratch/restored_master_1440x1200_hero.png');

  await browser.close();
})();
