const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(600);
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(3800);

  // Scroll to about
  await page.evaluate(() => document.getElementById('about').scrollIntoView());
  await page.waitForTimeout(1000);

  const mainChildren = await page.evaluate(() => {
    const main = document.querySelector('.homepage-main');
    return Array.from(main.children).map(c => ({
      tag: c.tagName,
      id: c.id,
      className: c.className,
      bg: getComputedStyle(c).backgroundColor,
      bgImg: getComputedStyle(c).backgroundImage
    }));
  });
  console.log('Main children:', mainChildren);

  // Check what happens if we hide each child one by one
  for (let i = 0; i < mainChildren.length; i++) {
    await page.evaluate((idx) => {
      const main = document.querySelector('.homepage-main');
      main.children[idx].style.display = 'none';
    }, i);

    await page.screenshot({ path: `scratch/after_hiding_child_${i}.png` });
    console.log(`Saved screenshot after hiding child ${i} (${mainChildren[i].className || mainChildren[i].id})`);
  }

  await browser.close();
})();
