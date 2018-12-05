const path_ = require('path');
const fs = require('fs');
const shdcLib = require('./shdc-lib');

let defaultChunkPath = path_.join(__dirname, './chunks'), chunksCache = {};
let updateBuiltinChunks = function(path = defaultChunkPath) {
  const fsJetpack = require('fs-jetpack');

  let files = fsJetpack.find(path, { matching: ['**/*.inc'] });
  for (let i = 0; i < files.length; ++i) {
      let name = path_.basename(files[i], '.inc');
      let content = fs.readFileSync(files[i], { encoding: 'utf8' });
      chunksCache[name] = shdcLib.glslStripComment(content);
  }

  let content = 'module.exports = ' + JSON.stringify(chunksCache, null, 2);
  fs.writeFileSync(path_.join(__dirname, './chunks/index.js'), content);
};

updateBuiltinChunks();
