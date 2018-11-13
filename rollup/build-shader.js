'use strict';

const path_ = require('path');
const shdcLib = require('../cocos/renderer/bin/shdc-lib');

// ====================
// build
// ====================
let chunksCache = {};
let chunkPath = './cocos/renderer/shaders/chunks';
let chunksFile = path_.join(chunkPath, 'index.json');
console.log(`generate ${chunksFile}`);
shdcLib.buildChunks(chunksFile, chunkPath, chunksCache);

let tmplPath = './cocos/renderer/shaders/templates';
let tmplFile = path_.join(tmplPath, 'index.json');
console.log(`generate ${tmplFile}`);
shdcLib.buildTemplates(tmplFile, tmplPath, chunksCache);
