const { join } = require('path');
const { ensureDir, emptyDir } = require('fs-extra');
const { magenta } = require('chalk');
const { buildEngine } = require('@cocos/ccbuild');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Build H5 minified ${prefix}`));

(async function exec () {
    const outDir = join(__dirname, '..', 'bin', 'dev', 'cc-min');
    await ensureDir(outDir);
    await emptyDir(outDir);

    await buildEngine({
        engine: join(__dirname, '..'),
        moduleFormat: 'system',
        mode: 'BUILD',
        platform: 'HTML5',
        out: outDir,
        compress: true,
        sourceMap: true,
        visualize: true,
    });
}());
