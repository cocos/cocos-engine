'use strict';

const path_ = require('path');
const fs = require('fs');
const fsJetpack = require('fs-jetpack');
const tokenizer = require('glsl-tokenizer/string');

function unwindIncludes(str, chunks) {
  let pattern = /#include +<([\w\d\-_.]+)>/gm;
  function replace(match, include) {
    let replace = chunks[include];
    if (replace === undefined) {
      console.error(`can not resolve #include <${include}>`);
    }
    return unwindIncludes(replace, chunks);
  }
  return str.replace(pattern, replace);
}

function glslStripComment(code) {
  let tokens = tokenizer(code);

  let result = '';
  for (let i = 0; i < tokens.length; ++i) {
    let t = tokens[i];
    if (t.type != 'block-comment' && t.type != 'line-comment' && t.type != 'eof') {
      result += t.data;
    }
  }

  return result;
}

function filterEmptyLine(str) {
  return str !== '';
}

function buildChunks(dest, path, cache) {
  let files = fsJetpack.find(path, { matching: ['**/*.vert', '**/*.frag'] });
  let code = '';

  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    let content = fs.readFileSync(file, { encoding: 'utf8' });
    content = glslStripComment(content);
    content = content.replace(new RegExp('[\\r\\n]+', 'g'), '\\n');
    content = expandStructMacro(content);
    code += `  '${path_.basename(file)}': '${content}',\n`;
    cache[path_.basename(file)] = content;
  }
  code = `export default {\n${code}};`;

  fs.writeFileSync(dest, code, { encoding: 'utf8' });
}

function buildTemplates(dest, path, cache) {
  let files = fsJetpack.find(path, { matching: ['**/*.vert'] });
  let code = '';

  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    let dir = path_.dirname(file);
    let name = path_.basename(file, '.vert');

    let vert = fs.readFileSync(path_.join(dir, name + '.vert'), { encoding: 'utf8' });
    vert = glslStripComment(vert);
    vert = unwindIncludes(vert, cache);
    vert = vert.replace(new RegExp('[\\r\\n]+', 'g'), '\\n');
    vert = [vert].filter(filterEmptyLine);

    let frag = fs.readFileSync(path_.join(dir, name + '.frag'), { encoding: 'utf8' });
    frag = glslStripComment(frag);
    frag = unwindIncludes(frag, cache);
    frag = frag.replace(new RegExp('[\\r\\n]+', 'g'), '\\n');
    frag = [frag].filter(filterEmptyLine);

    let jsonPath = path_.join(dir, name + '.json');
    let defines = '';
    if (fs.existsSync(jsonPath)) {
      let json = fs.readFileSync(path_.join(dir, name + '.json'), { encoding: 'utf8' });
      json = JSON.parse(json);

      if (json) {
        for (let def in json) {
          let defCode = '';
          defCode += `name: '${def}', `;
          if (json[def] && json[def].min !== undefined) {
            defCode += `min: ${json[def].min}, `;
          }
          if (json[def] && json[def].max !== undefined) {
            defCode += `max: ${json[def].max}, `;
          }
          defCode = `      { ${defCode}},\n`;
          defines += defCode;
        }
      }
      defines = `[\n${defines}    ],`;
    } else {
      defines = '[],';
    }

    code += '  {\n';
    code += `    name: '${name}',\n`;
    code += `    vert: '${vert}',\n`;
    code += `    frag: '${frag}',\n`;
    code += `    defines: ${defines}\n`;
    code += '  },\n';
  }
  code = `export default [\n${code}];`;

  fs.writeFileSync(dest, code, { encoding: 'utf8' });
}

// this is just for particle gpu shader usage,the result of applying to other shaders is undefined!
function expandStructMacro(code) {
  code = code.replace(new RegExp(/\\\\n/, 'g'), '');
  let defineRE = new RegExp(/#define\s+([_\w\d]+)\(([\w\d_,\s]+)\)\s+(.*?##.*?)(?=\\n)/, 'g');
  let defineCapture = defineRE.exec(code);
  //defineCapture[1]:the macro name;
  //defineCapture[2] the macro parameters;
  //defineCapture[3]:the macro body
  while (defineCapture != null) {
    let macroRE = new RegExp('(?:\\\\n[^\\\\]*?)' + defineCapture[1] + '\\s*\\(', 'g');
    let macroCapture = macroRE.exec(code);
    while (macroCapture != null) {
      let macroIndex = macroCapture[0].lastIndexOf(defineCapture[1]);
      //the whole macro string,include name and arguments
      let macroStr = code.slice(macroCapture.index + macroIndex, matchParenthesisPair(code, macroCapture.index + macroCapture[0].length - 1) + 1);
      //the macro arguments list
      let macroArguLine = macroStr.slice(macroCapture[0].length - macroIndex, -1);
      //the string before macro's name in the matched line
      let prefix = macroCapture[0].slice(0, macroIndex);
      let containDefine = prefix.indexOf('#define') !== -1;
      let containParenthesis = prefix.indexOf('(') !== -1;
      let macroParams = defineCapture[2].split(',');
      //erase the white space in the macro's parameters
      for (let i = 0; i < macroParams.length; i++) {
        macroParams[i] = macroParams[i].replace(/\s/g, '');
      }
      let macroArgus = macroArguLine.split(',');
      for (let i = 0; i < macroArgus.length; i++) {
        macroArgus[i] = macroArgus[i].replace(/\s/g, '');
      }
      //if the matched macro is defined in another macro,then just replace the parameters with the arguments
      if (containDefine && containParenthesis) {
        code = code.replace(new RegExp(defineCapture[1] + '\\(' + macroArguLine + '\\)', 'g'), (matched, offset) => {
          //if the matched string is the marco we just found,the replace it
          if (macroCapture.index + prefix.length == offset) {
            let ret = defineCapture[3];
            for (let i = 0; i < macroParams.length; i++) {
              ret = ret.replace(new RegExp(generateParamRE(macroParams[i]), 'g'), macroArgus[i]);
            }
            return ret;
          }
          return matched;
        });
        //move the next match index to the beginning of the line,in case of the same macro on the same line.
        macroRE.lastIndex -= macroCapture[0].length;
      }
      //if the matched macro is defined in the executable code block,we should consider the hypen sign('##')
      if (!containDefine) {
        let repStr = defineCapture[3];
        for (let i = 0; i < macroParams.length; i++) {
          let hypenRE = new RegExp(generateHypenRE('##', macroParams[i]), 'g');
          if (hypenRE.test(repStr)) {
            //replace the hypen sign
            repStr = repStr.replace(hypenRE, macroArgus[i]);
          } else {
            repStr = repStr.replace(new RegExp(generateParamRE(macroParams[i]), 'g'), macroArgus[i]);
          }
        }
        code = code.replace(macroStr, repStr);
        //move the next match index to the beginning of the line,in case of the same macro on the same line.
        macroRE.lastIndex -= macroCapture[0].length;
      }
      macroCapture = macroRE.exec(code);
    }
    defineCapture = defineRE.exec(code);
  }
  return code;
}

function matchParenthesisPair(string, startIdx) {
  let parHead = startIdx;
  let parTail = parHead;
  let depth = 0;
  for (let i = startIdx; i < string.length; i++) {
    if (string[i] === '(') {
      parHead = i;
      depth = 1;
      break;
    }
  }
  if (depth === 0) {
    return parHead;
  }
  for (let i = parHead + 1; i < string.length; i++) {
    if (string[i] === '(') {
      depth++;
    }
    if (string[i] === ')') {
      depth--;
    }
    if (depth === 0) {
      parTail = i;
      break;
    }
  }
  if (depth !== 0) {
    return parHead;
  }
  return parTail;
}

function generateHypenRE(hyphen, macroParam) {
  return '(' + [hyphen + macroParam + hyphen, hyphen + macroParam, macroParam + hyphen].join('|') + ')';
}

function generateParamRE(param) {
  return '\\b' + param + '\\b';
}

// ==================
// exports
// ==================

module.exports = {
  glslStripComment,
  buildChunks,
  buildTemplates,
};