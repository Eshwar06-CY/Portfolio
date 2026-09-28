import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/meshw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
import fs from 'fs';

const scratchDir = 'C:/Users/meshw/.gemini/antigravity-ide/brain/6fc55fd8-ab4e-4e71-985a-d07e34245230/scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

const PORT = 5173;
const URL = `http://localhost:${PORT}/`;

async function runAudit() {
  console.log('================================================================');
  console.log('PHASE 7E — CINEMATIC PROJECT WORLDS AUDIT');
  console.log('INTEGRATE SELECTED WORK INTO THE GRAVITATIONAL ARCHIVE');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const errors = [];

  // ==========================================================================
  // VIEWPORT 1: DESKTOP 1440 x 900
  // ==========================================================================
  console.log('>>> [1/5] DESKTOP 1440x900 FULL WORKFLOW AUDIT <<<');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[1440x900] ${m.text()}`); 
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
  await page.click('.intro-enter-btn');
  await page.waitForTimeout(4000);

  // 1. Initial Hero and Single Canvas Verification
  const initialChecks = await page.evaluate(() => {
    const canvas = document.querySelectorAll('canvas');
    return {
      canvasCount: canvas.length,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log(`  [TEST 1] Single Canvas: ${initialChecks.canvasCount === 1 ? 'PASS' : 'FAIL'} (${initialChecks.canvasCount})`);
  console.log(`  [TEST 1] No Horizontal Overflow: ${!initialChecks.hasHorizontalOverflow ? 'PASS' : 'FAIL'}`);

  // 2. Scroll to Selected Work Intro
  console.log('\n  [TEST 2] Scrolling to #work Selected Work Intro...');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);

  const introMetrics = await page.evaluate(() => {
    const intro = document.querySelector('.work-editorial-intro');
    const heading = document.querySelector('.work-monumental-heading');
    const kicker = document.querySelector('.work-intro-kicker-wrap');
    const canvas = document.querySelectorAll('canvas');

    return {
      introVisible: !!intro,
      headingText: heading ? heading.innerText.trim() : '',
      kickerText: kicker ? kicker.innerText.trim() : '',
      canvasCount: canvas.length
    };
  });

  console.log(`    Selected Work Intro Present: ${introMetrics.introVisible ? 'PASS' : 'FAIL'}`);
  console.log(`    Heading: "${introMetrics.headingText}" (expected: "SELECTED WORK")`);
  console.log(`    Kicker: "${introMetrics.kickerText}" (expected: "02 — SELECTED WORK")`);
  console.log(`    Canvas Count after scrolling: ${introMetrics.canvasCount} (expected 1: ${introMetrics.canvasCount === 1 ? 'PASS' : 'FAIL'})`);

  await page.screenshot({ path: `${scratchDir}/phase7e_01_work_intro_1440.png` });

  // 3. Scroll Into Pinned Project Reel & Test Project 1 (SPECra)
  console.log('\n  [TEST 3] Pinned Reel - Project 01 SPECra...');
  await page.evaluate(() => {
    const reel = document.querySelector('.project-reel-container');
    if (reel) {
      const top = reel.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 150);
    }
  });
  await page.waitForTimeout(2000);

  const p1Metrics = await page.evaluate(() => {
    const slide1 = document.querySelector('.reel-slide-1');
    const activeTitle = slide1 ? slide1.querySelector('.slide-project-title') : null;
    const visualFrame = slide1 ? slide1.querySelector('.slide-visual-frame') : null;
    const githubLink = slide1 ? slide1.querySelector('.editorial-action-link') : null;

    return {
      title: activeTitle ? activeTitle.innerText.trim() : '',
      hasArtifactSpecra: visualFrame ? visualFrame.classList.contains('artifact-specra') : false,
      githubHref: githubLink ? githubLink.getAttribute('href') : '',
      githubTarget: githubLink ? githubLink.getAttribute('target') : '',
      githubRel: githubLink ? githubLink.getAttribute('rel') : ''
    };
  });

  console.log(`    Project 01 Title: "${p1Metrics.title}" (expected: "SPECra")`);
  console.log(`    Has artifact-specra class: ${p1Metrics.hasArtifactSpecra ? 'PASS' : 'FAIL'}`);
  console.log(`    GitHub URL: "${p1Metrics.githubHref}" (expected: "https://github.com/Eshwar06-CY/SPECra")`);
  console.log(`    Native Target _blank: ${p1Metrics.githubTarget === '_blank' ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/phase7e_02_project1_specra_1440.png` });

  // 4. Scrub deeper into Pinned Reel - Project 02 (ExpenseFlowAI)
  console.log('\n  [TEST 4] Pinned Reel - Project 02 ExpenseFlowAI...');
  await page.evaluate(() => {
    const reel = document.querySelector('.project-reel-container');
    if (reel) {
      const top = reel.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + window.innerHeight * 0.9);
    }
  });
  await page.waitForTimeout(2000);

  const p2Metrics = await page.evaluate(() => {
    const slide2 = document.querySelector('.reel-slide-2');
    const visualFrame = slide2 ? slide2.querySelector('.slide-visual-frame') : null;
    const githubLink = slide2 ? slide2.querySelector('.editorial-action-link') : null;

    return {
      hasArtifactExpenseflow: visualFrame ? visualFrame.classList.contains('artifact-expenseflow') : false,
      githubHref: githubLink ? githubLink.getAttribute('href') : ''
    };
  });
  console.log(`    Has artifact-expenseflow class: ${p2Metrics.hasArtifactExpenseflow ? 'PASS' : 'FAIL'}`);
  console.log(`    GitHub URL: "${p2Metrics.githubHref}" (expected: "https://github.com/Eshwar06-CY/ExpenseFlowAI")`);

  await page.screenshot({ path: `${scratchDir}/phase7e_03_project2_expenseflow_1440.png` });

  // 5. Scrub deeper - Project 03 (AI UG Academic Planner)
  console.log('\n  [TEST 5] Pinned Reel - Project 03 AI UG Academic Planner...');
  await page.evaluate(() => {
    const reel = document.querySelector('.project-reel-container');
    if (reel) {
      const top = reel.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + window.innerHeight * 1.6);
    }
  });
  await page.waitForTimeout(2000);

  const p3Metrics = await page.evaluate(() => {
    const slide3 = document.querySelector('.reel-slide-3');
    const visualFrame = slide3 ? slide3.querySelector('.slide-visual-frame') : null;
    const githubLink = slide3 ? slide3.querySelector('.editorial-action-link') : null;

    return {
      hasArtifactPlanner: visualFrame ? visualFrame.classList.contains('artifact-planner') : false,
      githubHref: githubLink ? githubLink.getAttribute('href') : ''
    };
  });
  console.log(`    Has artifact-planner class: ${p3Metrics.hasArtifactPlanner ? 'PASS' : 'FAIL'}`);
  console.log(`    GitHub URL: "${p3Metrics.githubHref}" (expected: "https://github.com/Eshwar06-CY/ai_ug_academic_planner")`);

  await page.screenshot({ path: `${scratchDir}/phase7e_04_project3_academic_1440.png` });

  // 6. Scrub deeper - Project 04 (CAPACITYX)
  console.log('\n  [TEST 6] Pinned Reel - Project 04 CAPACITYX...');
  await page.evaluate(() => {
    const reel = document.querySelector('.project-reel-container');
    if (reel) {
      const top = reel.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + window.innerHeight * 2.3);
    }
  });
  await page.waitForTimeout(2000);

  const p4Metrics = await page.evaluate(() => {
    const slide4 = document.querySelector('.reel-slide-4');
    const visualFrame = slide4 ? slide4.querySelector('.slide-visual-frame') : null;
    const badge = slide4 ? slide4.querySelector('.editorial-concept-badge') : null;
    const githubLink = slide4 ? slide4.querySelector('.editorial-action-link') : null;

    return {
      hasArtifactCapacityx: visualFrame ? visualFrame.classList.contains('artifact-capacityx') : false,
      badgeText: badge ? badge.innerText.trim() : '',
      noGithubLink: githubLink === null
    };
  });
  console.log(`    Has artifact-capacityx class: ${p4Metrics.hasArtifactCapacityx ? 'PASS' : 'FAIL'}`);
  console.log(`    Concept badge present: "${p4Metrics.badgeText}" (expected: "RESEARCH / CONCEPT STAGE")`);
  console.log(`    No fake GitHub link: ${p4Metrics.noGithubLink ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: `${scratchDir}/phase7e_05_project4_capacityx_1440.png` });

  // ==========================================================================
  // VIEWPORT 2: 1280 x 800 (Compact Desktop)
  // ==========================================================================
  console.log('\n>>> [2/5] VIEWPORT 1280x800 COMPACT DESKTOP <<<');
  const ctx1280 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page1280 = await ctx1280.newPage();
  page1280.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[1280x800] ${m.text()}`); 
  });
  await page1280.goto(URL, { waitUntil: 'domcontentloaded' });
  await page1280.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
  await page1280.click('.intro-enter-btn');
  await page1280.waitForTimeout(3000);

  await page1280.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await page1280.waitForTimeout(1500);

  const overflow1280 = await page1280.evaluate(() => {
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      canvasCount: document.querySelectorAll('canvas').length
    };
  });
  console.log(`  1280x800 No Horizontal Overflow: ${!overflow1280.overflow ? 'PASS' : 'FAIL'}`);
  console.log(`  1280x800 Single Canvas: ${overflow1280.canvasCount === 1 ? 'PASS' : 'FAIL'}`);
  await page1280.screenshot({ path: `${scratchDir}/phase7e_06_1280x800.png` });

  // ==========================================================================
  // VIEWPORT 3: 820 x 1180 (Tablet Portrait)
  // ==========================================================================
  console.log('\n>>> [3/5] VIEWPORT 820x1180 TABLET PORTRAIT <<<');
  const ctxTablet = await browser.newContext({ viewport: { width: 820, height: 1180 } });
  const pageTablet = await ctxTablet.newPage();
  pageTablet.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[820x1180] ${m.text()}`); 
  });
  await pageTablet.goto(URL, { waitUntil: 'domcontentloaded' });
  await pageTablet.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
  await pageTablet.click('.intro-enter-btn');
  await pageTablet.waitForTimeout(3000);

  await pageTablet.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await pageTablet.waitForTimeout(1500);

  const overflowTablet = await pageTablet.evaluate(() => {
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      canvasCount: document.querySelectorAll('canvas').length
    };
  });
  console.log(`  820x1180 No Horizontal Overflow: ${!overflowTablet.overflow ? 'PASS' : 'FAIL'}`);
  console.log(`  820x1180 Single Canvas: ${overflowTablet.canvasCount === 1 ? 'PASS' : 'FAIL'}`);
  await pageTablet.screenshot({ path: `${scratchDir}/phase7e_07_820x1180.png` });

  // ==========================================================================
  // VIEWPORT 4: 390 x 844 (Mobile iPhone 12/13/14)
  // ==========================================================================
  console.log('\n>>> [4/5] VIEWPORT 390x844 MOBILE TOUCH STREAM <<<');
  const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageMobile = await ctxMobile.newPage();
  pageMobile.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[390x844] ${m.text()}`); 
  });
  await pageMobile.goto(URL, { waitUntil: 'domcontentloaded' });
  await pageMobile.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
  await pageMobile.click('.intro-enter-btn');
  await pageMobile.waitForTimeout(3000);

  // Scroll to work section on mobile
  await pageMobile.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await pageMobile.waitForTimeout(1500);

  const mobileMetrics = await pageMobile.evaluate(() => {
    const mobileScenes = document.querySelectorAll('.mobile-project-scene');
    const canvas = document.querySelectorAll('canvas');
    return {
      mobileScenesCount: mobileScenes.length,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      canvasCount: canvas.length
    };
  });

  console.log(`  390x844 Mobile Scenes Count: ${mobileMetrics.mobileScenesCount} (expected 4: ${mobileMetrics.mobileScenesCount === 4 ? 'PASS' : 'FAIL'})`);
  console.log(`  390x844 No Horizontal Overflow: ${!mobileMetrics.overflow ? 'PASS' : 'FAIL'}`);
  console.log(`  390x844 Single Canvas: ${mobileMetrics.canvasCount === 1 ? 'PASS' : 'FAIL'}`);
  await pageMobile.screenshot({ path: `${scratchDir}/phase7e_08_390x844.png` });

  // ==========================================================================
  // VIEWPORT 5: 375 x 812 (Compact Mobile iPhone X/Mini)
  // ==========================================================================
  console.log('\n>>> [5/5] VIEWPORT 375x812 COMPACT MOBILE <<<');
  const ctxMini = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const pageMini = await ctxMini.newPage();
  pageMini.on('console', m => { 
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(`[375x812] ${m.text()}`); 
  });
  await pageMini.goto(URL, { waitUntil: 'domcontentloaded' });
  await pageMini.waitForSelector('.intro-enter-btn', { state: 'visible', timeout: 25000 });
  await pageMini.click('.intro-enter-btn');
  await pageMini.waitForTimeout(3000);

  await pageMini.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView();
  });
  await pageMini.waitForTimeout(1500);

  const miniMetrics = await pageMini.evaluate(() => {
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      canvasCount: document.querySelectorAll('canvas').length
    };
  });

  console.log(`  375x812 No Horizontal Overflow: ${!miniMetrics.overflow ? 'PASS' : 'FAIL'}`);
  console.log(`  375x812 Single Canvas: ${miniMetrics.canvasCount === 1 ? 'PASS' : 'FAIL'}`);
  await pageMini.screenshot({ path: `${scratchDir}/phase7e_09_375x812.png` });

  await browser.close();

  console.log('\n================================================================');
  console.log('PHASE 7E AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`Console Errors Recorded: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.error(`  - ${e}`));
  } else {
    console.log('✓ ZERO CONSOLE ERRORS RECORDED ACROSS ALL 5 VIEWPORTS!');
  }
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
