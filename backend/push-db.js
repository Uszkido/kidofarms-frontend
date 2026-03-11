const { spawn } = require('child_process');
const child = spawn('cmd.exe', ['/c', 'npx', 'drizzle-kit', 'push'], { stdio: 'pipe' });
child.stdout.on('data', d => {
    console.log(d.toString());
    child.stdin.write('\n'); // Reply immediately on every log
});
child.stderr.on('data', d => console.error(d.toString()));
child.on('close', code => console.log('Process exited ' + code));
