const { spawn } = require('child_process');
const http = require('http');

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
    this.ready = new Promise(r => this.ws.onopen = r);
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
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
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }
  close() { this.ws.close(); }
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9224', '--no-sandbox', 'about:blank']);
  await new Promise(r => setTimeout(r, 1000));
  const targets = await getJson('http://localhost:9224/json');
  const pageTarget = targets.find(t => t.type === 'page');
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);

  await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 1000));

  // Measure offsets before enter
  const beforeEnter = await cdp.eval(`(() => {
    const getTop = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return Math.max(0, el.getBoundingClientRect().top + window.scrollY);
    };
    return {
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      hero: getTop('hero'),
      about: getTop('about'),
      exploring: getTop('exploring'),
      work: getTop('work')
    };
  })()`);
  console.log('BEFORE ENTER:', beforeEnter);

  proc.kill();
  process.exit(0);
}

run();
