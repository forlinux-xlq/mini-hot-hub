import { spawnSync, spawn } from 'child_process';
import path from 'path';

const serverDir = path.join(process.cwd(), 'server');

console.log(`[Server] Changing to server directory: ${serverDir}`);
process.chdir(serverDir);

console.log('[Server] Installing server dependencies...');
const installResult = spawnSync('npm', ['install'], { stdio: 'inherit' });
if (installResult.status !== 0) {
  console.error('[Server] Failed to install dependencies');
  process.exit(installResult.status);
}

console.log('[Server] Starting server...');
const child = spawn('node', ['src/index.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
});

child.on('error', (err) => {
  console.error('[Server] Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`[Server] Server exited with code: ${code}`);
  process.exit(code);
});
