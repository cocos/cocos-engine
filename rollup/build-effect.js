'use strict';

const shdcLib = require('../cocos/renderer/bin/shdc-lib');

const path_ = require('path');
const fs = require('fs');
const fsJetpack = require('fs-jetpack');

let stringifyShaders = (function() {
  let newlines = /\n+/g;
  let toOneLiner = o => '\n      ' + JSON.stringify(o).replace(/([,:])/g, '$1 ');
  return function (shaders) {
    let code = '';
    for (let i = 0; i < shaders.length; ++i) {
      let { name, vert, frag, defines, uniforms, attributes, extensions } = shaders[i];
      vert = vert.replace(newlines, '\\n');
      frag = frag.replace(newlines, '\\n');
      code += '  {\n';
      code += `    "name": "${name}",\n`;
      code += `    "vert": "${vert}",\n`;
      code += `    "frag": "${frag}",\n`;
      code += '    "defines": [';
      code += defines.map(toOneLiner);
      code += (defines.length ? '\n    ' : '') + '],\n';
      code += '    "uniforms": [';
      code += uniforms.map(toOneLiner);
      code += (uniforms.length ? '\n    ' : '') + '],\n';
      code += '    "attributes": [';
      code += attributes.map(toOneLiner);
      code += (attributes.length ? '\n    ' : '') + '],\n';
      code += '    "extensions": [';
      code += extensions.map(toOneLiner);
      code += (extensions.length ? '\n    ' : '') + ']\n';
      code += '  },\n';
    }
    return `[\n${code.slice(0, -2)}\n]`;
  };
})();

let indent = (str, num) => str.replace(/\n/g, '\n'+' '.repeat(num));
let path = './cocos/3d/builtin/effects';
let dest = path_.join(path, 'index.json');
let files = fsJetpack.find(path, { matching: ['**/*.effect'] }), code = ``;
for (let i = 0; i < files.length; ++i) {
  let name = path_.basename(files[i], '.effect');
  let content = fs.readFileSync(files[i], { encoding: 'utf8' });
  let effect = shdcLib.buildEffect(name, content);
  code += '  {\n';
  code += `    "name": "${effect.name}",\n`;
  code += `    "techniques": ${JSON.stringify(effect.techniques)},\n`;
  code += `    "properties": ${JSON.stringify(effect.properties)},\n`;
  code += `    "shaders": ${indent(stringifyShaders(effect.shaders), 4)}\n`;
  code += '  },\n';
}
fs.writeFileSync(dest, `[\n${code.slice(0, -2)}\n]\n`, { encoding: 'utf8' });
