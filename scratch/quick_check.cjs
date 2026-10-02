const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function check() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\meshw\\.gemini\\antigravity-ide\\brain\\6fc55fd8-ab4e-4e71-985a-d07e34245230\\scratch\\edge-profile-test';
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + userDataDir,
    'http://localhost:5173/'
  ]);
  
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      targets = await new Promise((res, rej) => http.get('http://localhost:9226/json', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej));
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Poll for 10 seconds to see how innerText and buttons evolve
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const res = await new Promise((resolve) => {
      const id = Date.now() + Math.random();
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const btns = Array.from(document.querySelectorAll('button')).map(b => b.className + ' | ' + b.innerText);
            const about = document.querySelector('#about');
            const statement = document.querySelector('.asymmetric-statement');
            return {
              title: document.title,
              url: window.location.href,
              buttons: btns,
              hasAbout: !!about,
              hasStatement: !!statement,
              bodySnippet: document.body.innerText.slice(0, 150)
            };
          })()`,
          returnByValue: true
        }
      }));
    });
    console.log(`Step ${i} (${i*500}ms):`, JSON.stringify(res));
    if (res?.buttons?.some(b => b.includes('ENTER'))) {
      break;
    }
  }

  ws.close();
  proc.kill();
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
