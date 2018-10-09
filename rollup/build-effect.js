'use strict';

const path_ = require('path');
const fs = require('fs');
const fsJetpack = require('fs-jetpack');
const mappings = require('../bin/mappings');

function buildEffects(dest, path) {
  let files = fsJetpack.find(path, { matching: ['**/*.json'] });
  let code = '';
  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    let dir = path_.dirname(file);
    let name = path_.basename(file, '.json');

    let json = fs.readFileSync(path_.join(dir, name + '.json'), { encoding: 'utf8' });
    json = JSON.parse(json);
    // map param's type offline.
    for (let j = 0; j < json.techniques.length; ++j) {
      let jsonTech = json.techniques[j];
      for (let k = 0; k < jsonTech.params.length; ++k) {
        let param = jsonTech.params[k];
        param.type = mappings.typeParams[param.type];
      }
      for (let k = 0; k < jsonTech.passes.length; ++k) {
        let pass = jsonTech.passes[k];
        for (let key in pass) {
          if (key === "program") {
            continue;
          }
          pass[key] = mappings.passParams[pass[key]];
        }
      }
    }

    code += '  {\n';
    code += `    name: '${name}',\n`;
    code += `    techniques: ${JSON.stringify(json.techniques)},\n`;
    code += `    properties: ${JSON.stringify(json.properties)},\n`;
    code += `    defines: ${JSON.stringify(json.defines)},\n`;
    code += `    dependencies: ${JSON.stringify(json.dependencies)}\n`;
    code += '  },\n';
  }
  code = `export default [\n${code}];`;

  //console.log(`code =  ${code}`);
  fs.writeFileSync(dest, code, { encoding: 'utf8' });
}

// ============================================================
// build
// ============================================================

let effectsPath = './cocos/3d/builtin/effects';
let effectsFile = path_.join(effectsPath, 'index.js');
console.log(`generate ${effectsFile}`);
buildEffects(effectsFile, effectsPath);
