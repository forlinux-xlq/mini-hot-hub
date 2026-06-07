const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'src', 'index.js');
console.log('[Root] Starting server:', serverPath);

const child = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
});

child.on('error', (err) => {
  console.error('[Root] Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log('[Root] Server exited with code:', code);
  process.exit(code);
});
