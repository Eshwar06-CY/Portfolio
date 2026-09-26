import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';
import path from 'path';

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

async function captureCascade() {
  const browser = await chromium.launch({ headless: true });

  const stages = [
    { name: '01_cascade_core_nodes', delay: 250 },     // 0.25s: central core nodes activated
    { name: '02_cascade_inner_structure', delay: 450 }, // 0.45s: inner neural structure illuminating
    { name: '03_cascade_lateral_clusters', delay: 750 },// 0.75s: lateral clusters activating
    { name: '04_cascade_full_field', delay: 1100 }      // 1.10s: full computational field resonant
  ];

  for (const st of stages) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(8400); // Wait for ready
    const enterBtn = page.locator('.intro-enter-btn');
    await enterBtn.click();
    await page.waitForTimeout(st.delay);
    await page.screenshot({ path: path.join(scratchDir, `p6f_cascade_${st.name}.png`) });
    console.log(`Captured ${st.name} at ${st.delay}ms`);
    await ctx.close();
  }

  await browser.close();
}

captureCascade().catch(console.error);
