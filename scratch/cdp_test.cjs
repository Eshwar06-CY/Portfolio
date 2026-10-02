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

  on(event, fn) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(fn);
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

async function getVideoState(cdp) {
  return await cdp.eval(`(() => {
    const videos = Array.from(document.querySelectorAll('video')).map((v, i) => ({
      index: i,
      currentTime: parseFloat(v.currentTime.toFixed(3)),
      paused: v.paused,
      readyState: v.readyState,
      opacity: v.style.opacity,
      zIndex: v.style.zIndex
    }));
    const activeVid = videos.find(v => v.opacity === '1') || videos[0];
    return {
      scrollY: window.scrollY,
      activeVid,
      videos
    };
  })()`);
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
    '--window-size=1440,900',
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

  const pageTarget = targets.find(t => t.type === 'page');
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);

  cdp.on('Console.messageAdded', (params) => {
    console.log('[BROWSER CONSOLE]', params.message.level, params.message.text);
  });
  cdp.on('Runtime.consoleAPICalled', (params) => {
    const args = params.args.map(a => a.value !== undefined ? a.value : JSON.stringify(a)).join(' ');
    console.log('[CONSOLE]', params.type, args);
  });
  cdp.on('Runtime.exceptionThrown', (params) => {
    console.error('[BROWSER EXCEPTION]', params.exceptionDetails.text, params.exceptionDetails.exception?.description);
  });

  await cdp.send('Console.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');

  console.log('Navigating to http://localhost:5173/ ...');
  await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });

  // 1. Wait for enter button
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 500));
    const btn = await cdp.eval(`(() => {
      const b = document.querySelector('.intro-enter-btn') || 
                Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ENTER') || x.textContent.includes('EXPERIENCE'));
      return b ? true : false;
    })()`);
    if (btn) break;
  }

  // Click Enter
  await cdp.eval(`(() => {
    const b = document.querySelector('.intro-enter-btn') || 
              Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('ENTER') || x.textContent.includes('EXPERIENCE'));
    if (b) b.click();
  })()`);
  await new Promise(r => setTimeout(r, 3500));

  console.log('\n=== TEST 1: HERO STATE ===');
  let st = await getVideoState(cdp);
  console.log('Hero:', JSON.stringify(st));

  console.log('\n=== TEST 2: SCROLL DOWN TO ABOUT ===');
  const aboutTop = await cdp.eval(`(() => {
    const el = document.getElementById('about');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 750;
  })()`);
  console.log('Scrolling to About top:', aboutTop);

  await cdp.eval(`window.scrollTo({ top: ${aboutTop}, behavior: 'smooth' }); if (window.lenis) window.lenis.scrollTo(${aboutTop}, { immediate: true });`);
  await new Promise(r => setTimeout(r, 1200));

  st = await getVideoState(cdp);
  console.log('Immediately in About:', JSON.stringify(st));

  console.log('\n=== TEST 3: STAY IN ABOUT FOR 6 SECONDS (CHECK CONTINUOUS PLAYBACK & LOOPING) ===');
  for (let s = 1; s <= 6; s++) {
    await new Promise(r => setTimeout(r, 1000));
    st = await getVideoState(cdp);
    console.log(`About +${s}s: activeVid currentTime=${st.activeVid.currentTime}, paused=${st.activeVid.paused}, slot=${st.activeVid.index}`);
  }

  console.log('\n=== TEST 4: SCROLL DOWN TO EXPLORING ===');
  const exploringTop = await cdp.eval(`(() => {
    const el = document.getElementById('exploring');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 1800;
  })()`);
  console.log('Scrolling to Exploring top:', exploringTop);
  await cdp.eval(`window.scrollTo({ top: ${exploringTop}, behavior: 'smooth' }); if (window.lenis) window.lenis.scrollTo(${exploringTop}, { immediate: true });`);
  await new Promise(r => setTimeout(r, 1200));
  st = await getVideoState(cdp);
  console.log('In Exploring:', JSON.stringify(st));

  console.log('\n=== TEST 5: SCROLL BACK UP TO ABOUT ===');
  await cdp.eval(`window.scrollTo({ top: ${aboutTop}, behavior: 'smooth' }); if (window.lenis) window.lenis.scrollTo(${aboutTop}, { immediate: true });`);
  await new Promise(r => setTimeout(r, 1200));
  st = await getVideoState(cdp);
  console.log('Back up in About:', JSON.stringify(st));

  console.log('\n=== TEST 6: STAY IN ABOUT 3s ===');
  for (let s = 1; s <= 3; s++) {
    await new Promise(r => setTimeout(r, 1000));
    st = await getVideoState(cdp);
    console.log(`Back in About +${s}s: currentTime=${st.activeVid.currentTime}, paused=${st.activeVid.paused}, slot=${st.activeVid.index}`);
  }

  console.log('\n=== TEST 7: SCROLL BACK UP TO HERO ===');
  await cdp.eval(`window.scrollTo({ top: 0, behavior: 'smooth' }); if (window.lenis) window.lenis.scrollTo(0, { immediate: true });`);
  await new Promise(r => setTimeout(r, 1200));
  st = await getVideoState(cdp);
  console.log('Back in Hero:', JSON.stringify(st));

  console.log('\n=== TEST 8: SCROLL BACK DOWN TO ABOUT (REPEATED ENTRY) ===');
  await cdp.eval(`window.scrollTo({ top: ${aboutTop}, behavior: 'smooth' }); if (window.lenis) window.lenis.scrollTo(${aboutTop}, { immediate: true });`);
  await new Promise(r => setTimeout(r, 1200));
  st = await getVideoState(cdp);
  console.log('Re-entered About:', JSON.stringify(st));

  for (let s = 1; s <= 3; s++) {
    await new Promise(r => setTimeout(r, 1000));
    st = await getVideoState(cdp);
    console.log(`Re-entered About +${s}s: currentTime=${st.activeVid.currentTime}, paused=${st.activeVid.paused}, slot=${st.activeVid.index}`);
  }

  console.log('\n=== TEST 9: FAST DOWNWARD & UPWARD SCROLL ===');
  // Fast scroll to work (e.g. 4000)
  await cdp.eval(`window.scrollTo({ top: 3500, behavior: 'instant' }); if (window.lenis) window.lenis.scrollTo(3500, { immediate: true });`);
  await new Promise(r => setTimeout(r, 800));
  // Fast scroll back to about
  await cdp.eval(`window.scrollTo({ top: ${aboutTop}, behavior: 'instant' }); if (window.lenis) window.lenis.scrollTo(${aboutTop}, { immediate: true });`);
  await new Promise(r => setTimeout(r, 1200));
  st = await getVideoState(cdp);
  console.log('Fast-scrolled back into About:', JSON.stringify(st));

  for (let s = 1; s <= 3; s++) {
    await new Promise(r => setTimeout(r, 1000));
    st = await getVideoState(cdp);
    console.log(`After fast scroll About +${s}s: currentTime=${st.activeVid.currentTime}, paused=${st.activeVid.paused}, slot=${st.activeVid.index}`);
  }

  cdp.close();
  proc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
