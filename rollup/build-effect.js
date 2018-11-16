'use strict';

const path_ = require('path');
const fs = require('fs');
const fsJetpack = require('fs-jetpack');
const mappings = require('../bin/mappings');

function mapPassParam(p) {
  let num;
  switch (typeof p) {
  case 'string':
    num = parseInt(p);
    return isNaN(num) ? mappings.passParams[p] : num;
  case 'object':
    return ((p[0] * 255) << 24 | (p[1] * 255) << 16 | (p[2] * 255) << 8 | (p[3] || 0) * 255) >>> 0;
  }
  return p;
}

function buildEffects(dest, path) {
  let files = fsJetpack.find(path, { matching: ['**/*.effect'] });
  let code = '';
  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    let dir = path_.dirname(file);
    let name = path_.basename(file, '.effect');
    if (name === 'index') continue;

    let json = fs.readFileSync(path_.join(dir, name + '.effect'), { encoding: 'utf8' });
    json = JSON.parse(json);
    // map param's type offline.
    for (let j = 0; j < json.techniques.length; ++j) {
      let jsonTech = json.techniques[j];
      for (let k = 0; k < jsonTech.passes.length; ++k) {
        let pass = jsonTech.passes[k];
        for (let key in pass) {
          if (key === "program" || key === 'stage') continue;
          pass[key] = mapPassParam(pass[key]);
        }
      }
    }
    for (let prop in json.properties) {
      let info = json.properties[prop];
      info.type = mappings.typeParams[info.type];
    }

    code += '  {\n';
    code += `    "name": "${name}",\n`;
    code += `    "techniques": ${JSON.stringify(json.techniques)},\n`;
    code += `    "properties": ${JSON.stringify(json.properties)}\n`;
    code += '  },\n';
  }

  fs.writeFileSync(dest, `[\n${code.slice(0, -2)}\n]`, { encoding: 'utf8' });
}

// ============================================================
// build
// ============================================================

let effectsPath = './cocos/3d/builtin/effects';
let effectsFile = path_.join(effectsPath, 'index.json');
console.log(`generate ${effectsFile}`);
buildEffects(effectsFile, effectsPath);
