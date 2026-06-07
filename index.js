const { spawn } = require('child_process');

console.log('[Server] Installing dependencies...');
spawn('npm', ['install'], { 
  cwd: './server', 
  stdio: 'inherit',
  shell: true 
}).on('exit', (code) => {
  if (code !== 0) {
    console.error('[Server] Failed to install dependencies');
    process.exit(code);
  }
  
  console.log('[Server] Starting server...');
  const server = spawn('node', ['src/index.js'], { 
    cwd: './server', 
    stdio: 'inherit',
    shell: true 
  });
  
  server.on('error', (err) => {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  });
  
  server.on('exit', (code) => {
    console.log('[Server] Exited with code:', code);
    process.exit(code);
  });
});
