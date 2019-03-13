const { spawn } = require('child_process');
const { join } = require('path');

const tscExecutableName = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tscExecutablePath = join(__dirname, '..', 'node_modules', '.bin', tscExecutableName);
const tscConfigPath = join(__dirname, '..', 'tsconfig-gendecls.json');

const tsc = spawn(tscExecutablePath, [
    '-p',
    tscConfigPath,
]);

tsc.stdout.on('data', (data) => {
    console.log(data.toString());
});

tsc.stderr.on('data', (data) => {
    console.error(data.toString());
});

tsc.on('exit', (code) => {
    console.log(`Exited with code ${code}`);
});
