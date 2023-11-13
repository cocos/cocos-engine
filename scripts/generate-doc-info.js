const { join } = require('path');
const { spawn } = require('child_process');
const { magenta } = require('chalk');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Generate DOC infos ${prefix}`));

const PATHS = {
    plugin: join(__dirname, './typedoc-plugin'),
    engine: join(__dirname, '..'),
};

function bash (cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, options);
        if (child.stdout) {
            child.stdout.on('data', (data) => {
                console.log(`${data}`);
            });
        }
        if (child.stderr) {
            child.stderr.on('data', (data) => {
                console.error(`${data}`);
            });
        }
        child.on('close', (code) => {
            resolve(code);
        });
        child.on('error', (error) => {
            reject(error);
        });
    });
}

async function exec () {
    await bash('npm', ['install', 'typedoc@0.22.18', '--no-save'], {
        cwd: PATHS.engine,
    });

    await bash('npm', ['install', '--only=production'], {
        cwd: PATHS.plugin,
    });

    await bash('npm', ['install', './scripts/typedoc-plugin', '--no-save'], {
        cwd: PATHS.engine,
    });

    await bash('npx', ['typedoc'], {
        cwd: PATHS.engine,
    });
}

exec();
