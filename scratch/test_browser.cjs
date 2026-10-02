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

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const fs = require('fs');
  const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log('Using browser:', browserPath);

  const proc = spawn(browserPath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:5173/'
  ], { detached: false });

  proc.on('error', (err) => {
    console.error('Failed to spawn browser:', err);
    process.exit(1);
  });

  // Wait for remote debugging to be ready
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      targets = await getJson('http://localhost:9223/json');
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  if (!targets) {
    console.error('Could not connect to browser debugging port');
    proc.kill();
    process.exit(1);
  }

  console.log('Found targets:', targets.map(t => ({ title: t.title, url: t.url })));

  const pageTarget = targets.find(t => t.type === 'page');
  const wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log('Connecting to WS:', wsUrl);

  const WebSocket = require('ws'); // wait, is ws installed? Let's check or use node built-in
  proc.kill();
}

main();
