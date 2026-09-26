import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_375', width: 375, height: 812 }
];

for (const vp of VIEWPORTS) {
  test(`Phase 6A validation on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    const consoleErrors = [];
    const webglErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Wait for entrance choreography to settle (1.8s)
    await page.waitForTimeout(2000);

    // 1. Take Hero screenshot
    await page.screenshot({ path: path.join(scratchDir, `phase6a_${vp.name}_hero.png`) });

    // 2. Validate Hero Elements
    const heroInfo = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      if (!hero) return { exists: false };

      const titleWords = Array.from(hero.querySelectorAll('.hero-title-word')).map(w => w.textContent.trim());
      const title = hero.querySelector('.hero-title');
      const portrait = hero.querySelector('.hero-portrait-img');
      const telemetry = hero.querySelector('.hero-system-telemetry');
      const role = hero.querySelector('.hero-role');
      const exploreBtn = hero.querySelector('.scroll-indicator-button');
      const canvases = document.querySelectorAll('canvas');

      const titleStyle = title ? window.getComputedStyle(title) : null;
      const portraitStyle = portrait ? window.getComputedStyle(portrait) : null;

      // Check horizontal overflow
      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

      return {
        exists: true,
        titleWords,
        titleText: title?.textContent.replace(/\s+/g, ' ').trim(),
        titleOpacity: titleStyle?.opacity,
        titleVisibility: titleStyle?.visibility,
        portraitVisible: portraitStyle?.visibility === 'visible' && parseFloat(portraitStyle?.opacity || '0') > 0.5,
        telemetryPresent: !!telemetry,
        rolePresent: !!role,
        exploreBtnPresent: !!exploreBtn,
        canvasCount: canvases.length,
        hasHorizontalOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    expect(heroInfo.exists).toBe(true);
    expect(heroInfo.titleText).toContain('ESHWAR M');
    expect(heroInfo.titleVisibility).toBe('visible');
    expect(heroInfo.canvasCount).toBe(1);
    expect(heroInfo.hasHorizontalOverflow).toBe(false);

    // 3. Test Explore Interaction & Scroll into About
    const exploreBtn = page.locator('.scroll-indicator-button');
    if (await exploreBtn.isVisible()) {
      await exploreBtn.hover();
      await page.waitForTimeout(300);
      await exploreBtn.click();
      await page.waitForTimeout(1400);
    } else {
      // Fallback scroll to about
      await page.evaluate(() => {
        const about = document.querySelector('#about');
        about?.scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1400);
    }

    // 4. Capture About Opening
    await page.screenshot({ path: path.join(scratchDir, `phase6a_${vp.name}_about.png`) });

    // 5. Validate About Elements
    const aboutInfo = await page.evaluate(() => {
      const about = document.querySelector('#about');
      if (!about) return { exists: false };

      const statement = about.querySelector('.asymmetric-statement');
      const row1 = about.querySelector('.statement-row.row-1');
      const row2 = about.querySelector('.statement-row.row-2');
      const row3 = about.querySelector('.statement-row.row-3');
      const chips = about.querySelectorAll('.pillar-chip');
      const hairline = about.querySelector('.about-opening-hairline-fill');

      const sStyle = statement ? window.getComputedStyle(statement) : null;
      const r1Style = row1 ? window.getComputedStyle(row1) : null;
      const r2Style = row2 ? window.getComputedStyle(row2) : null;
      const r3Style = row3 ? window.getComputedStyle(row3) : null;

      const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

      return {
        exists: true,
        statementText: statement?.textContent.replace(/\s+/g, ' ').trim(),
        statementOpacity: sStyle?.opacity,
        row1Text: row1?.textContent.trim(),
        row2Text: row2?.textContent.trim(),
        row3Text: row3?.textContent.trim(),
        row1Opacity: r1Style?.opacity,
        row2Opacity: r2Style?.opacity,
        row3Opacity: r3Style?.opacity,
        chipsCount: chips.length,
        hairlinePresent: !!hairline,
        hasHorizontalOverflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    expect(aboutInfo.exists).toBe(true);
    expect(aboutInfo.statementText).toContain('I BUILD THINGS THAT SOLVE PROBLEMS.');
    expect(aboutInfo.chipsCount).toBe(4);
    expect(aboutInfo.hasHorizontalOverflow).toBe(false);

    // 6. Assert zero console errors
    const fatalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(fatalErrors).toEqual([]);
  });
}

test('Phase 6A validation with prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const reducedInfo = await page.evaluate(() => {
    const title = document.querySelector('.hero-title');
    const statement = document.querySelector('.asymmetric-statement');
    const veil = document.querySelector('.cinematic-blackout-veil');
    const canvas = document.querySelectorAll('canvas');

    const titleStyle = window.getComputedStyle(title);
    const statementStyle = window.getComputedStyle(statement);
    const veilStyle = veil ? window.getComputedStyle(veil) : null;

    return {
      titleVisible: titleStyle.visibility === 'visible' && parseFloat(titleStyle.opacity) > 0.5,
      statementVisible: statementStyle.visibility === 'visible',
      veilHidden: !veil || veilStyle?.opacity === '0' || veilStyle?.display === 'none',
      canvasCount: canvas.length
    };
  });

  expect(reducedInfo.titleVisible).toBe(true);
  expect(reducedInfo.statementVisible).toBe(true);
  expect(reducedInfo.canvasCount).toBe(1);
});
