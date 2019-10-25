/* eslint-disable @typescript-eslint/no-require-imports */ 
/* eslint-disable @typescript-eslint/no-var-requires */ 
 
const { generate } = require('./generate-declarations'); 
const fs = require('fs-extra'); 
 
const outDir = './bin/.declarations'; 
(async () => { 
    await fs.emptyDir(outDir); 
    await generate({ outDir }); 
})();