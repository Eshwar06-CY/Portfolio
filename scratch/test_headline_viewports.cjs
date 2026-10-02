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
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const proc = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1200',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      targets = await getJson('http://localhost:9223/json');
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
    await new Promise(r => setTimeout(r, 600));

    // Scroll directly to about
    const aboutTop = await cdp.eval(`(() => {
      const el = document.getElementById('about');
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 750;
    })()`);

    await cdp.eval(`window.scrollTo({ top: ${aboutTop}, behavior: 'instant' }); if (window.lenis) window.lenis.scrollTo(${aboutTop}, { immediate: true });`);
    await new Promise(r => setTimeout(r, 600));

    const metrics = await cdp.eval(`(() => {
      const statement = document.querySelector('.asymmetric-statement');
      const row1 = document.querySelector('.statement-row.row-1');
      const row2 = document.querySelector('.statement-row.row-2');
      const row3 = document.querySelector('.statement-row.row-3');
      const mask1 = document.querySelector('.statement-line-mask.mask-row-1');
      const mask2 = document.querySelector('.statement-line-mask.mask-row-2');
      const mask3 = document.querySelector('.statement-line-mask.mask-row-3');

      function r(el) {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          left: Math.round(b.left),
          right: Math.round(b.right),
          width: Math.round(b.width),
          height: Math.round(b.height)
        };
      }

      const stStyle = statement ? window.getComputedStyle(statement) : null;
      const mask3Style = mask3 ? window.getComputedStyle(mask3) : null;

      const hasHOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const row3Rect = r(row3);
      const mask3Rect = r(mask3);

      return {
        viewport: window.innerWidth + 'x' + window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        hasHOverflow,
        fontSize: stStyle ? stStyle.fontSize : 'N/A',
        mask3MarginLeft: mask3Style ? mask3Style.marginLeft : 'N/A',
        row1: r(row1),
        row2: r(row2),
        row3: row3Rect,
        mask3: mask3Rect,
        isRow3ClippedByMask: row3Rect && mask3Rect ? (row3Rect.right > mask3Rect.right) : false,
        isRow3ClippedByViewport: row3Rect ? (row3Rect.right > window.innerWidth) : false,
        overflowAmount: row3Rect ? Math.max(0, row3Rect.right - window.innerWidth) : 0,
        maskClipAmount: (row3Rect && mask3Rect) ? Math.max(0, row3Rect.right - mask3Rect.right) : 0
      };
    })()`);

    console.log(`\n=== Viewport ${vp.width}x${vp.height} ===`);
    console.log(JSON.stringify(metrics, null, 2));

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
