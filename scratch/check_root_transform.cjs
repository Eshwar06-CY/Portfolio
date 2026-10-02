const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3500);

  const enterBtn = await page.$('.btn-enter-experience');
  if (enterBtn) {
    await enterBtn.click();
    await page.waitForTimeout(3500);
  }

  const rootData = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const wrapper = document.querySelector('.site-wrapper');

    return {
      html: { transform: getComputedStyle(html).transform, zoom: getComputedStyle(html).zoom },
      body: { transform: getComputedStyle(body).transform, zoom: getComputedStyle(body).zoom },
      root: { transform: getComputedStyle(root).transform, zoom: getComputedStyle(root).zoom },
      wrapper: wrapper ? { transform: getComputedStyle(wrapper).transform, zoom: getComputedStyle(wrapper).zoom } : null,
      heroTitle: {
        fontSize: getComputedStyle(document.querySelector('.hero-title')).fontSize,
        lineHeight: getComputedStyle(document.querySelector('.hero-title')).lineHeight
      }
    };
  });

  console.log('Root & Hero Status:', JSON.stringify(rootData, null, 2));

  // Also take screenshot
  await page.screenshot({ path: 'scratch/restored_master_1440x1200.png' });
  console.log('Saved scratch/restored_master_1440x1200.png');

  await browser.close();
})();
