import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

async function testTypography() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const fontSizes = [92, 84, 78, 72, 68, 64, 60, 56, 52, 48];

  const results = await page.evaluate((sizes) => {
    const statement = document.querySelector('.asymmetric-statement');
    const row1 = document.querySelector('.statement-row.row-1');
    const row2 = document.querySelector('.statement-row.row-2');
    const row3 = document.querySelector('.statement-row.row-3');

    function getTextWidth(text, fontSize) {
      const span = document.createElement('span');
      span.style.fontFamily = 'Syne, sans-serif';
      span.style.fontWeight = '800';
      span.style.letterSpacing = '-0.05em';
      span.style.fontSize = fontSize + 'px';
      span.style.whiteSpace = 'nowrap';
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.textContent = text;
      document.body.appendChild(span);
      const w = span.getBoundingClientRect().width;
      document.body.removeChild(span);
      return Math.round(w);
    }

    return sizes.map(fs => ({
      fontSize: fs,
      row1Width: getTextWidth('I BUILD', fs),
      row2Width: getTextWidth('THINGS THAT', fs),
      row3Width: getTextWidth('SOLVE PROBLEMS.', fs),
      solveWidth: getTextWidth('SOLVE', fs),
      problemsWidth: getTextWidth('PROBLEMS.', fs)
    }));
  }, fontSizes);

  console.table(results);
  await browser.close();
}

testTypography().catch(console.error);
