const ps = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const del = require('del');

function join (...paths) {
    const result = ps.join(...paths);
    return result.replace(/\\/g, '/');
}
let ralPath = join(__dirname, 'runtime-web-adapter');
let latestCommitFile = join(__dirname, '../platforms/runtime/latest-commit.md');

function checkCache () {
    console.log('Checking ral cache...\n');
    const distDir = join(__dirname, '../platforms/runtime');
    // check web adapter
    const webAdapters = ['web-adapter.js', 'web-adapter.min.js'];
    for (const webAdapter of webAdapters) {
        const dst = join(distDir, 'common', webAdapter);
        if (!fs.existsSync(dst)) {
            return false;
        }
    }
    // check ral
    const platformNames = ['cocos-play', 'huawei-quick-game', 'link-sure', 'oppo-mini-game', 'qtt', 'vivo-mini-game'];
    const rals = ['ral.js', 'ral.min.js'];
    for (const platformName of platformNames) {
        for (const ral of rals) {
            const dst = join(distDir, 'platforms', platformName, ral);
            if (!fs.existsSync(dst)) {
                return false;
            }
        }
    }
    // check latest commit file
    if (!fs.existsSync(latestCommitFile)) {
        return false;
    }
    return true;
}

/**
 * @param {string} cmd 
 * @param {string} cwd
 * @returns {Promise<void>}
 */
function runCommand (cmd, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`Running command: '${cmd}' in '${ralPath}'\n`);
        const ls = exec(cmd, {
            cwd,
        });
        ls.stderr.on('data', err => {
            console.error(err)
        });
        ls.stdout.on('close', resolve);
    })
}

function copyRal () {
    const distDir = join(__dirname, '../platforms/runtime');
    console.log(`Copy files from '${ralPath}' to '${distDir}'\n`);

    // copy web-adapter
    ['web-adapter.js', 'web-adapter.min.js'].forEach(fileName => {
        const src = join(ralPath, 'dist/common', fileName);
        const dst = join(distDir, 'common', fileName);
        fs.copyFileSync(src, dst);
    });
    // copy ral
    ['cocos-play', 'huawei-quick-game', 'link-sure', 'oppo-mini-game', 'qtt', 'vivo-mini-game'].forEach(platformName => {
        ['ral.js', 'ral.min.js'].forEach(fileName => {
            const src = join(ralPath, 'dist/platforms', platformName, fileName);
            const dst = join(distDir, 'platforms', platformName, fileName);
            fs.copyFileSync(src, dst);
        });
    });
}

async function cleanOldAdapter () {
    console.log('Cleaning old runtime adapter...\n');
    const distDir = join(__dirname, '../platforms/runtime');
    const delPatterns = [];
    // del web adapter
    ['web-adapter.js', 'web-adapter.min.js'].forEach(fileName => {
        const dst = join(distDir, 'common', fileName);
        delPatterns.push(dst);
    });
    // del ral
    ['cocos-play', 'huawei-quick-game', 'link-sure', 'oppo-mini-game', 'qtt', 'vivo-mini-game'].forEach(platformName => {
        ['ral.js', 'ral.min.js'].forEach(fileName => {
            const dst = join(distDir, 'platforms', platformName, fileName);
            delPatterns.push(dst);
        });
    });
    await del(delPatterns, { force: true });
}

async function generateLatestCommitFile () {
    console.log(`Generate latest commit file to: ${latestCommitFile}\n`);
    let commitId = await new Promise(resolve => {
        let ls = exec('git rev-parse HEAD', {
            cwd: ralPath,
        });
        ls.stdout.on('data', resolve)
    });
    fs.writeFileSync(latestCommitFile, commitId, 'utf8');
}

/**
 * @param {string} dirPath 
 * @returns {Promise<void>}
 */
async function removeDir (dirPath) {
    console.log(`Remove ral directory: '${dirPath}'\n`);
    await del(dirPath, { force: true });
}

(async () => {
    try {
        const forceFetch = process.argv[2] === 'force';
        if (!forceFetch && checkCache()) {
            console.log('Skip fetching ral !\n');
            return process.exit(0);
        }
        if (forceFetch) {
            console.log('Force fetching ral...\n');
        }
        await cleanOldAdapter();
        await removeDir(ralPath);
        await runCommand('git clone https://github.com/yangws/runtime-web-adapter.git', __dirname);
        await runCommand('git checkout for-creator-3', ralPath);
        await runCommand('npm install', ralPath);
        await runCommand('gulp', ralPath);
        copyRal();
        await generateLatestCommitFile();
        await removeDir(ralPath);
        process.exit(0);
    } catch (err) {
        console.error('Fetch ral failed', err);
        process.exit(1);
    }
})();
