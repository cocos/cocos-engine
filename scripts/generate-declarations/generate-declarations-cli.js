/* eslint-disable @typescript-eslint/no-require-imports */ 
/* eslint-disable @typescript-eslint/no-var-requires */ 
 
const { generate } = require('./generate-declarations'); 
const fs = require('fs-extra'); 
 
const outDir = './bin/.declarations';
(async () => {
    const options = {
        outDir,
    };
    if (!process.argv.some((arg) => arg.startsWith('--with'))) {
        options.withIndex = true;
        options.withExports = false;
        options.withEditorExports = false;
    } else {
        options.withIndex = !!process.argv.includes('--with-index');
        options.withExports = !!process.argv.includes('--with-exports');
        options.withEditorExports = !!process.argv.includes('--with-editor-exports');
    }
    await fs.emptyDir(outDir); 
    await generate(options); 
})();