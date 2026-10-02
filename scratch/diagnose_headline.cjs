const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();

    this.ready = new Promise((resolve) => {
      this.ws.onopen = resolve;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        const listeners = this.eventListeners.get(msg.method) || [];
        listeners.forEach(fn => fn(msg.params));
      }
    };
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'Eval error');
    }
    return res.result?.value;
  }

  async screenshot(filepath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filepath);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\meshw\\.gemini\\antigravity-ide\\brain\\6fc55fd8-ab4e-4e71-985a-d07e34245230\\scratch\\edge-profile';

  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + userDataDir,
    '--window-size=1440,1200',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      targets = await getJson('http://localhost:9225/json');
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  const wsUrl = targets[0].webSocketDebuggerUrl;
  const cdp = new CDPClient(wsUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  console.log('Navigating to http://localhost:5173/ ...');
  await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });

  // Wait for intro enter button
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 500));
    const btn = await cdp.eval(`(() => {
      const b = document.querySelector('.intro-enter-btn') || 
                Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ENTER') || x.textContent.includes('EXPERIENCE'));
      return b ? true : false;
    })()`);
    if (btn) {
      console.log('Found enter button after ' + (i * 500) + 'ms');
      break;
    }
  }

  // Click Enter
  await cdp.eval(`(() => {
    const b = document.querySelector('.intro-enter-btn') || 
              Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ENTER') || x.textContent.includes('EXPERIENCE'));
    if (b) b.click();
  })()`);
  await new Promise(r => setTimeout(r, 3500));

  // Scroll to About
  await cdp.eval(`(() => {
    const about = document.querySelector('#about');
    if (about) {
      about.scrollIntoView({ behavior: 'instant' });
    }
  })()`);
  await new Promise(r => setTimeout(r, 1000));

  const viewports = [
    { width: 1440, height: 1200 },
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 600
    });
    await new Promise(r => setTimeout(r, 500));

    // Measure headline and rows
    const data = await cdp.eval(`(() => {
      const statement = document.querySelector('.asymmetric-statement');
      const row1 = document.querySelector('.statement-row.row-1');
      const row2 = document.querySelector('.statement-row.row-2');
      const row3 = document.querySelector('.statement-row.row-3');
      const mask1 = document.querySelector('.statement-line-mask.mask-row-1');
      const mask2 = document.querySelector('.statement-line-mask.mask-row-2');
      const mask3 = document.querySelector('.statement-line-mask.mask-row-3');
      const aboutCol = document.querySelector('.about-hero-statement-col');
      const page = document.querySelector('.about-cinematic-page');

      function rect(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          width: Math.round(r.width),
          height: Math.round(r.height)
        };
      }

      if (!statement) return { error: 'statement not found' };
      if (!row3) return { error: 'row3 not found' };
      if (!mask3) return { error: 'mask3 not found' };

      const style = window.getComputedStyle(statement);
      const style3 = window.getComputedStyle(row3);
      const styleMask3 = window.getComputedStyle(mask3);

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentScrollWidth: document.documentElement.scrollWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        fontSize: style.fontSize,
        row3Rect: rect(row3),
        mask3Rect: rect(mask3),
        statementRect: rect(statement),
        aboutColRect: rect(aboutCol),
        mask3MarginLeft: styleMask3.marginLeft,
        isRow3ClippedByMask: rect(row3).right > rect(mask3).right,
        isRow3ClippedByViewport: rect(row3).right > window.innerWidth,
        row3Text: row3.innerText
      };
    })()`);

    console.log(`=== Viewport ${vp.width}x${vp.height} ===`);
    console.log(JSON.stringify(data, null, 2));

    await cdp.screenshot(`scratch/headline_${vp.width}x${vp.height}.png`);
  }

  cdp.close();
  proc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
