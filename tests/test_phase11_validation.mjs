import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testPhase11() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type === 'error' || msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('1. Loading portfolio...');
  await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Fast skip loading to reach hero if intro is present
  console.log('Waiting for enter button or hero...');
  try {
    const enterBtn = await page.waitForSelector('.intro-enter-btn', { timeout: 12000 });
    if (enterBtn) {
      await page.waitForTimeout(600);
      await enterBtn.click();
      await page.waitForTimeout(3800);
      await page.waitForSelector('#hero', { state: 'visible', timeout: 10000 });
    }
  } catch (e) {
    console.log('Intro skip bypassed or already in hero');
  }

  await page.waitForTimeout(1000);

  // 1. Verify Header Logo & Brand
  console.log('2. Verifying Header Logo & Identity...');
  const headerState = await page.evaluate(() => {
    const brand = document.querySelector('.brand-wrapper');
    const img = document.querySelector('.brand-logo-mark');
    const brandName = document.querySelector('.brand-name');
    const statusInd = document.querySelector('.status-indicator');
    const navLinks = Array.from(document.querySelectorAll('.nav-link-text')).map(el => el.innerText.trim());

    return {
      hasBrand: !!brand,
      imgSrc: img ? img.getAttribute('src') : null,
      imgWidth: img ? img.getBoundingClientRect().width : null,
      imgHeight: img ? img.getBoundingClientRect().height : null,
      hasOldNameText: !!brandName,
      hasStatusIndicator: !!statusInd,
      navLinks
    };
  });
  console.log('Header State:', headerState);
  await page.screenshot({ path: 'tests/screenshots/phase11_01_header_logo.png' });

  // 2. Verify VIEW PORTAL Control Default & Hover States
  console.log('3. Verifying VIEW PORTAL Control...');
  const portalDefault = await page.evaluate(() => {
    const btn = document.querySelector('.projector-action-btn');
    const label = document.querySelector('.btn-action-label');
    const arrow = document.querySelector('.btn-action-arrow');
    const style = btn ? window.getComputedStyle(btn) : null;
    return {
      hasBtn: !!btn,
      label: label ? label.innerText.trim() : null,
      hasArrow: !!arrow,
      bg: style ? style.backgroundColor : null,
      color: style ? style.color : null,
      border: style ? style.border : null,
      fontFamily: style ? style.fontFamily : null
    };
  });
  console.log('VIEW PORTAL Default State:', portalDefault);

  // Hover over VIEW PORTAL button
  await page.hover('.projector-action-btn');
  await page.waitForTimeout(400);

  const portalHover = await page.evaluate(() => {
    const btn = document.querySelector('.projector-action-btn');
    const style = btn ? window.getComputedStyle(btn) : null;
    return {
      bg: style ? style.backgroundColor : null,
      color: style ? style.color : null
    };
  });
  console.log('VIEW PORTAL Hover State:', portalHover);
  await page.screenshot({ path: 'tests/screenshots/phase11_02_view_portal_hover.png' });

  // Test Click functionality
  console.log('Testing VIEW PORTAL click toggle...');
  await page.click('.projector-action-btn');
  await page.waitForTimeout(800);
  const portalClicked = await page.evaluate(() => {
    const label = document.querySelector('.btn-action-label');
    const portrait = document.querySelector('.projected-portrait-wrapper');
    return {
      label: label ? label.innerText.trim() : null,
      portraitActive: !!portrait
    };
  });
  console.log('VIEW PORTAL Clicked State:', portalClicked);

  // 3. Scroll to About Section
  console.log('4. Scrolling to About Section...');
  await page.evaluate(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  const aboutState = await page.evaluate(() => {
    const row1 = document.querySelector('.statement-row.row-1');
    const row2 = document.querySelector('.statement-row.row-2');
    const row3 = document.querySelector('.statement-row.row-3');
    return {
      row1: row1 ? row1.innerText.trim() : null,
      row2: row2 ? row2.innerText.trim() : null,
      row3: row3 ? row3.innerText.trim() : null
    };
  });
  console.log('About Statement Rows:', aboutState);
  await page.screenshot({ path: 'tests/screenshots/phase11_03_about_statement.png' });

  // 4. Scroll to Exploring
  console.log('5. Scrolling to What I am Exploring...');
  await page.evaluate(() => {
    document.getElementById('exploring')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  const exploringItems = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.exploring-item'));
    return items.map(item => {
      const num = item.querySelector('.exploring-num')?.innerText.trim();
      const title = item.querySelector('.exploring-title')?.innerText.trim();
      return { num, title };
    });
  });
  console.log('Exploring Items:', exploringItems);

  // Test Exploring Hover interaction
  await page.hover('.exploring-item:first-child');
  await page.waitForTimeout(400);
  const exploringHover = await page.evaluate(() => {
    const first = document.querySelector('.exploring-item:first-child');
    const second = document.querySelector('.exploring-item:nth-child(2)');
    return {
      firstOpacity: first ? window.getComputedStyle(first).opacity : null,
      secondOpacity: second ? window.getComputedStyle(second).opacity : null
    };
  });
  console.log('Exploring Hover Sibling Dimming:', exploringHover);
  await page.screenshot({ path: 'tests/screenshots/phase11_04_exploring_hover.png' });

  // 5. Scroll to Work (ProjectShowcase)
  console.log('6. Scrolling to Selected Work...');
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  const workState = await page.evaluate(() => {
    const title = document.querySelector('.slide-project-title');
    const num = document.querySelector('.slide-num-tag');
    return {
      title: title ? title.innerText.trim() : null,
      num: num ? num.innerText.trim() : null
    };
  });
  console.log('Selected Work Title Card:', workState);
  await page.screenshot({ path: 'tests/screenshots/phase11_05_selected_work.png' });

  // 6. Scroll to Experience
  console.log('7. Scrolling to Experience...');
  await page.evaluate(() => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/screenshots/phase11_06_experience.png' });

  // 7. Scroll to Expertise
  console.log('8. Scrolling to Capability Matrix (Expertise)...');
  await page.evaluate(() => {
    document.getElementById('expertise')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  const expertiseDomains = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.item-title-text')).map(el => el.innerText.trim());
  });
  console.log('Capability Domains:', expertiseDomains);
  await page.screenshot({ path: 'tests/screenshots/phase11_07_expertise.png' });

  // 8. Scroll to Contact
  console.log('9. Scrolling to Contact...');
  await page.evaluate(() => {
    if (window.lenis) {
      window.lenis.scrollTo('#contact', { immediate: true });
    } else {
      document.getElementById('contact')?.scrollIntoView();
    }
  });
  await page.waitForTimeout(1500);

  const contactState = await page.evaluate(() => {
    const headline = document.querySelector('.contact-monumental-headline');
    const sub = document.querySelector('.contact-subline-text');
    return {
      headline: headline ? headline.innerText.trim() : null,
      sub: sub ? sub.innerText.trim() : null
    };
  });
  console.log('Contact Headline:', contactState);
  await page.screenshot({ path: 'tests/screenshots/phase11_08_contact.png' });

  // 9. Responsive Viewports & Horizontal Overflow Check
  console.log('10. Testing Responsive Viewports & Overflow...');
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(400);

    const overflowInfo = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const logo = document.querySelector('.brand-logo-mark');
      return {
        docW,
        scrollW,
        hasHorizontalOverflow: scrollW > docW,
        logoW: logo ? logo.getBoundingClientRect().width : null,
        logoH: logo ? logo.getBoundingClientRect().height : null
      };
    });
    console.log(`Viewport ${vp.width}x${vp.height}:`, overflowInfo);
  }

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/screenshots/phase11_09_mobile_header.png' });

  console.log('Console Errors:', consoleErrors);
  await browser.close();
  console.log('Phase 11 Validation Complete!');
}

testPhase11().catch(err => {
  console.error(err);
  process.exit(1);
});
