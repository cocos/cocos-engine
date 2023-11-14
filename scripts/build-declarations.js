const { join } = require('path');
const { emptyDir } = require('fs-extra');
const { build } = require('@cocos/build-engine/dist/build-declarations');
const { magenta } = require('chalk');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Build declarations ${prefix}`));

(async function exec () {
    const PATHS = {
        engine: join(__dirname, '..'),
        out: join(__dirname, '..', 'bin', '.declarations'),
    };
    await emptyDir(PATHS.out);
    await build({
        engine: PATHS.engine,
        outDir: PATHS.out,
        withIndex: true,
        withExports: false,
        withEditorExports: true,
    });
}());
