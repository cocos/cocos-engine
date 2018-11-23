'use strict';

const path_ = require('path');
const shdcLib = require('../cocos/renderer/bin/shdc-lib');
const fs = require('fs');
const fsJetpack = require('fs-jetpack');

let newlines = /\n+/g;

function buildChunks(path, cache, dest = null) {
    let files = fsJetpack.find(path, { matching: ['**/*.inc'] });
    let code = '';
    for (let i = 0; i < files.length; ++i) {
        let name = path_.basename(files[i], '.inc');
        let content = fs.readFileSync(files[i], { encoding: 'utf8' });
        cache[name] = content;
        code += `  "${name}": "${content.replace(newlines, '\\n')}",\n`;
    }
    if (dest) fs.writeFileSync(dest, `{\n${code.slice(0, -2)}\n}`, { encoding: 'utf8' });
}

let buildTemplates = (function() {
  let toOneLiner = o => '\n      ' + JSON.stringify(o).replace(/([,:])/g, '$1 ');
  return function (dest, path, cache) {
    let files = fsJetpack.find(path, { matching: ['**/*.glsl'] });
    let code = '';
    for (let i = 0; i < files.length; ++i) {
      let temp = shdcLib.buildTemplate(files[i], cache);
      temp.vert = temp.vert.replace(newlines, '\\n');
      temp.frag = temp.frag.replace(newlines, '\\n');
      code += '  {\n';
      code += `    "name": "${temp.name}",\n`;
      code += `    "vert": "${temp.vert}",\n`;
      code += `    "frag": "${temp.frag}",\n`;
      code += '    "defines": [';
      code += temp.defines.map(toOneLiner);
      code += (temp.defines.length ? '\n    ' : '') + '],\n';
      code += '    "uniforms": [';
      code += temp.uniforms.map(toOneLiner);
      code += (temp.uniforms.length ? '\n    ' : '') + '],\n';
      code += '    "attributes": [';
      code += temp.attributes.map(toOneLiner);
      code += (temp.attributes.length ? '\n    ' : '') + '],\n';
      code += '    "extensions": [';
      code += temp.extensions.map(toOneLiner);
      code += (temp.extensions.length ? '\n    ' : '') + ']\n';
      code += '  },\n';
    }
    fs.writeFileSync(dest, `[\n${code.slice(0, -2)}\n]`, { encoding: 'utf8' });
  };
})();

// ====================
// build
// ====================

let chunksCache = {};
let chunkPath = './cocos/renderer/shaders/chunks';
let chunksFile = path_.join(chunkPath, 'index.json');
console.log(`generate ${chunksFile}`);
buildChunks(chunksFile, chunkPath, chunksCache);

let tmplPath = './cocos/renderer/shaders/templates';
let tmplFile = path_.join(tmplPath, 'index.json');
console.log(`generate ${tmplFile}`);
buildTemplates(tmplFile, tmplPath, chunksCache);
