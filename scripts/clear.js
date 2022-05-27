'use strict';

const { removeSync } = require('fs-extra');
const { join } = require('path');

try {
    console.log('Deleting The Build Cache');
    removeSync(join(__dirname, '../bin'));
    
    console.log('Deleting Debugging Information');
    removeSync(join(__dirname, '../DebugInfos.json'));
    
    console.log('Deleting `node_modules`');
    removeSync(join(__dirname, '../node_modules'));
    
} catch(error) {
    console.error(error);
    process.exit(-1);
}
