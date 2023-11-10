'use strict';

const { join } = require('path');
const { ensureDir, emptyDir } = require('fs-extra');
const { spawn } = require('child_process');

const cli = require.resolve('@cocos/build-engine/dist/cli');

(async function () {
    const outDir = join(__dirname, '..', 'bin', 'dev', 'cc-min');
    await ensureDir(outDir);
    await emptyDir(outDir);
    const exitCode = await new Promise((resolve, reject) => {
        spawn('node', [
            cli,
            `--engine=${join(__dirname, '..')}`,
            '--module=system',
            '--build-mode=BUILD',
            '--platform=HTML5',
            '--physics=cannon',
            `--out=${outDir}`,
            '--compress',
            '--sourcemap',
        ], {
            shell: true,
            stdio: 'inherit',
            cwd: __dirname,
        }).on('exit', (code) => {
            resolve(code);
        }).on('error', (err) => {
            reject(err);
        });
    });
    if (exitCode) {
        throw new Error(`Build process exit with ${exitCode}`);
    }
})();
