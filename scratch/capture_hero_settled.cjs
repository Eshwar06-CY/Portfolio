const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/ at 1440x1200...');
  await page.goto('http://localhost:5173/');

  // Wait for SYSTEM READY / ENTER EXPERIENCE
  console.log('Waiting for .intro-enter-btn...');
  const enterBtn = await page.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(600);

  console.log('Clicking .intro-enter-btn...');
  await enterBtn.click();

  // Wait for enter transition to finish and Hero to be fully revealed and settled
  console.log('Waiting 4500ms for Hero transition...');
  await page.waitForTimeout(4500);

  // Check metrics
  const metrics = await page.evaluate(() => {
    const title = document.querySelector('.hero-title');
    const content = document.querySelector('.hero-content');
    const logo = document.querySelector('.brand-logo-mark');
    const portalBtn = document.querySelector('.btn-optic-reveal');
    const nav = document.querySelector('.nav-links');

    return {
      titleText: title ? title.textContent : null,
      titleSize: title ? window.getComputedStyle(title).fontSize : null,
      titleHeight: title ? title.getBoundingClientRect().height : null,
      contentTop: content ? content.getBoundingClientRect().top : null,
      logoSize: logo ? { width: logo.getBoundingClientRect().width, height: logo.getBoundingClientRect().height } : null,
      portalBtnLabel: portalBtn ? portalBtn.textContent.trim() : null,
      htmlTransform: window.getComputedStyle(document.documentElement).transform,
      rootTransform: window.getComputedStyle(document.getElementById('root')).transform
    };
  });

  console.log('Hero Settled Metrics:', JSON.stringify(metrics, null, 2));

  await page.screenshot({ path: 'scratch/restored_hero_1440x1200_settled.png' });
  console.log('Saved screenshot to: scratch/restored_hero_1440x1200_settled.png');

  await browser.close();
})();
