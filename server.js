import { spawn } from 'child_process';
import path from 'path';

const serverDir = path.join(process.cwd(), 'server');
process.chdir(serverDir);

console.log('[Server] Starting server from:', serverDir);
const child = spawn('node', ['src/index.js'], {
  stdio: 'inherit',
  cwd: serverDir,
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
