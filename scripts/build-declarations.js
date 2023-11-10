'use strict';

const { join } = require('path');
const { emptyDir } = require('fs-extra');
const { build } = require('@cocos/build-engine/dist/build-declarations');

(async function() {
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
})();
