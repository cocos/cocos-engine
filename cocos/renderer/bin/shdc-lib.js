'use strict';

const tokenizer = require('glsl-tokenizer/string');
const mappings = require('../../../bin/mappings');
const { sha3_224 } = require('js-sha3');

let includeRE = /#include +<([\w-.]+)>/gm;
let defineRE = /#define\s+(\w+)\(([\w,\s]+)\)\s+(.*##.*)\n/g;
let whitespaces = /\s+/g;
let ident = /^[_a-zA-Z]\w*$/;
let extensionRE = /(?:GL_)?(\w+)/;
let comparators = /^[<=>]+$/;
let ifprocessor = /#(el)?if/;
let rangePragma = /range\(([\d.,\s]+)\)\s(\w+)/;
let defaultPragma = /default\(([\d.,]+)\)/;
let namePragma = /name\(([^)]+)\)/;
let precision = /(low|medium|high)p/;

// (HACKY) extract all builtin uniforms to the ignore list
let uniformIgnoreList = (function() {
  const fs = require('fs');
  let result = new Set(), extract = function(path) {
    let renderer = fs.readFileSync(path, { encoding: 'utf8' });
    let re = /set(Uniform|Texture)\([`'"](\w+)[`'"]/g, cap = re.exec(renderer);
    while (cap) { result[cap[2]] = true; cap = re.exec(renderer); }
  };
  extract('resources/3d/engine/cocos/renderer/renderers/forward-renderer.js');
  extract('resources/3d/engine/cocos/renderer/core/base-renderer.js');
  return result;
})();

function convertType(t) { let tp = mappings.typeParams[t.toUpperCase()]; return tp === undefined ? t : tp; }

function unwindIncludes(str, chunks) {
  function replace(match, include) {
    let replace = chunks[include];
    if (replace === undefined) {
      console.error(`can not resolve #include <${include}>`);
    }
    return unwindIncludes(replace, chunks);
  }
  return str.replace(includeRE, replace);
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

function extractDefines(tokens, defines, cache) {
  let curDefs = [], save = (line) => {
    cache[line] = curDefs.reduce((acc, val) => acc.concat(val), []);
    cache.lines.push(line);
  };
  for (let i = 0; i < tokens.length; ++i) {
    let t = tokens[i], str = t.data, id, df;
    if (t.type !== 'preprocessor') continue;
    str = str.split(whitespaces);
    if (str[0] === '#endif') {
        curDefs.pop(); save(t.line); continue;
    } else if (str[0] === '#else') {
      curDefs[curDefs.length - 1].length = 0; save(t.line); continue;
    } else if (str[0] === '#pragma') {
      if (str[1] === 'for') { curDefs.push(0); save(t.line); }
      else if (str[1] === 'endFor') { curDefs.pop(); save(t.line); }
      else if (str[1][0] === '#') cache[t.line] = str.splice(1);
      else {
        let mc = rangePragma.exec(t.data);
        if (!mc) continue;
        let def = defines.find(d => d.name === mc[2]);
        if (!def) defines.push(def = { name: mc[2] });
        def.type = 'number';
        def.range = JSON.parse(`[${mc[1]}]`);
      }
      continue;
    } else if (!ifprocessor.test(str[0])) continue;
    if (str[0] === '#elif') { curDefs.pop(); save(t.line); }
    let defs = [];
    str.splice(1).some(s => {
      id = s.match(ident);
      if (id) { // is identifier
        defs.push(id[0]);
        df = defines.find(d => d.name === id[0]);
        if (df) return; // first encounter
        defines.push(df = { name: id[0], type: 'boolean' });
      } else if (comparators.test(s)) df.type = 'number';
      else if (s === '||') return true;
    });
    curDefs.push(defs); save(t.line);
  }
  return defines;
}

/* here the `define dependency` for some param is interpreted as
 * the existance of some define ids directly desides the existance of that param.
 * so basically therer is no logical expression support
 * (all will be treated as '&&' operator)
 * for wrapping unifom, attribute and extension declarations.
 * try to write them in straightforward ways like:
 *     #ifdef USE_COLOR
 *         attribute vec4 a_color;
 *     #endif
 * or nested when needed:
 *     #if USE_BILLBOARD && BILLBOARD_STRETCHED
 *         uniform vec3 stretch_color;
 *         #ifdef USE_NORMAL_TEXTURE
 *             uniform sampler2D tex_normal;
 *         #endif
 *     #endif // no else branch
 */
function extractParams(tokens, cache, uniforms, attributes, extensions) {
  let getDefs = line => {
    let idx = cache.lines.findIndex(i => i > line);
    return cache[cache.lines[idx - 1]] || [];
  };
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i], tp = t.type, str = t.data, dest;
    if (tp === 'keyword' && str === 'uniform') dest = uniforms;
    else if (tp === 'keyword' && str === 'attribute') dest = attributes;
    else if (tp === 'preprocessor' && str.startsWith('#extension')) dest = extensions;
    else continue;
    let defines = getDefs(t.line), param = {};
    if (defines.findIndex(i => !i) >= 0) continue; // inside pragmas
    if (dest === uniforms && uniformIgnoreList[tokens[i+4].data]) continue;
    if (dest === extensions) {
      if (defines.length !== 1) console.warn('extensions must be under controll of exactly 1 define');
      param.name = extensionRE.exec(str.split(whitespaces)[1])[1];
      param.define = defines[0];
      dest.push(param);
      continue;
    } else { // uniforms and attributes
      let offset = precision.exec(tokens[i+2].data) ? 4 : 2;
      param.name = tokens[i+offset+2].data;
      param.type = convertType(tokens[i+offset].data);
      let tags = cache[t.line - 1];
      if (tags && tags[0][0] === '#') { // tags
        let mc = defaultPragma.exec(tags.join(''));
        if (mc && mc[1].length > 0) {
          mc = JSON.parse(`[${mc[1]}]`);
          if (mc.length === 1) param.value = mc[0];
          else param.value = mc;
        }
        mc = namePragma.exec(tags.join(' '));
        if (mc) param.displayName = mc[1];
        for (let j = 0; j < tags.length; j++) {
          let tag = tags[j];
          if (tag === '#color') param.type = convertType(param.type);
          else if (tag === '#property') param.property = true;
        }
      }
    }
    param.defines = defines;
    dest.push(param);
  }
}

let expandStructMacro = (function() {
  function matchParenthesisPair(string, startIdx) {
    let parHead = startIdx;
    let parTail = parHead;
    let depth = 0;
    for (let i = startIdx; i < string.length; i++)
      if (string[i] === '(') { parHead = i; depth = 1; break; }
    if (depth === 0) return parHead;
    for (let i = parHead + 1; i < string.length; i++) {
      if (string[i] === '(') depth++;
      if (string[i] === ')') depth--;
      if (depth === 0) { parTail = i; break; }
    }
    if (depth !== 0) return parHead;
    return parTail;
  }
  function generateHypenRE(hyphen, macroParam) {
    return '(' + [hyphen + macroParam + hyphen, hyphen + macroParam, macroParam + hyphen].join('|') + ')';
  }
  function generateParamRE(param) {
    return '\\b' + param + '\\b';
  }
  return function (code) {
    code = code.replace(/\\\n/g, '');
    let defineCapture = defineRE.exec(code);
    //defineCapture[1] - the macro name
    //defineCapture[2] - the macro parameters
    //defineCapture[3] - the macro body
    while (defineCapture != null) {
      let macroRE = new RegExp('\\n.*' + defineCapture[1] + '\\s*\\(', 'g');
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
        //if the matched macro is defined in another macro, then just replace the parameters with the arguments
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
  };
})();

let assembleShader = (function() {
  let entryRE = /([\w-]+)(?::(\w+))?/;
  let integrity = /void\s+main\s*\([\w\s,]*\)/;
  let wrapperFactory = (vert, fn) => `\nvoid main() { ${vert ? 'gl_Position' : 'gl_FragColor'} = ${fn}(); }\n`;
  return function(name, cache, vert) {
    let entryCap = entryRE.exec(name), content = cache[entryCap[1]];
    if (!content) { console.error(`shader ${entryCap[1]} not found!`); return ''; }
    if (!entryCap[2]) {
      if (!integrity.test(content)) console.warn(`shader main entry not found in ${name}!`);
      return cache[name];
    }
    return content + wrapperFactory(vert, entryCap[2]);
  };
})();

let buildShader = function(vertName, fragName, cache) {
  let vert = assembleShader(vertName, cache, true);
  let frag = assembleShader(fragName, cache);

  let defines = [], defCache = { lines: [] }, tokens;
  let uniforms = [], attributes = [], extensions = [];

  vert = glslStripComment(vert);
  vert = unwindIncludes(vert, cache);
  vert = expandStructMacro(vert);
  tokens = tokenizer(vert);
  extractDefines(tokens, defines, defCache);
  extractParams(tokens, defCache, uniforms, attributes, extensions);

  defCache = { lines: [] };
  frag = glslStripComment(frag);
  frag = unwindIncludes(frag, cache);
  frag = expandStructMacro(frag);
  tokens = tokenizer(frag);
  extractDefines(tokens, defines, defCache);
  extractParams(tokens, defCache, uniforms, attributes, extensions);

  return { vert, frag, defines, uniforms, attributes, extensions };
};

// ==================
// effects
// ==================

let queueRE = /(\w+)(?:([+-])(\d+))?/;
let parseQueue = function (queue) {
  let m = queueRE.exec(queue);
  if (m === null) return 0;
  let q = mappings.RenderQueue[m[1].toUpperCase()];
  if (m.length === 4) {
    if (m[2] === '+') q += parseInt(m[3]);
    if (m[2] === '-') q -= parseInt(m[3]);
  }
  return q;
};

function mapPassParam(p) {
  let num;
  switch (typeof p) {
  case 'string':
    num = parseInt(p);
    return isNaN(num) ? mappings.passParams[p.toUpperCase()] : num;
  case 'object':
    return ((p[0] * 255) << 24 | (p[1] * 255) << 16 | (p[2] * 255) << 8 | (p[3] || 0) * 255) >>> 0;
  }
  return p;
}

function buildEffectJSON(json) {
  // map param's type offline.
  for (let j = 0; j < json.techniques.length; ++j) {
    let jsonTech = json.techniques[j];
    jsonTech.queue = parseQueue(jsonTech.queue ? jsonTech.queue : 'opaque');
    if (jsonTech.priority == null) {
        jsonTech.priority = 0;
    }
    for (let k = 0; k < jsonTech.passes.length; ++k) {
      let pass = jsonTech.passes[k];
      if (pass.stage == null) {
        pass.stage = 'default';
      }
      for (let key in pass) {
        if (key === "vert" || key === 'frag') continue;
        pass[key] = mapPassParam(pass[key]);
      }
    }
  }
  for (let prop in json.properties) {
    let info = json.properties[prop];
    info.type = mappings.typeParams[info.type.toUpperCase()];
  }
  return json;
}

let parseEffect = (function() {
  let effectRE = /%{([^%]+)%}/;
  let blockRE = /%%\s*([\w-]+)\s*{([^]+)}/;
  let parenRE = /[{}]/g;
  let trimToSize = content => {
    let level = 1, end = content.length;
    content.replace(parenRE, (p, i) => {
      if (p === '{') level++;
      else if (level === 1) { end = i; level = 1e9; }
      else level--;
    });
    return content.substring(0, end);
  };
  return function (content) {
    let effectCap = effectRE.exec(content);
    let effect = JSON.parse(`{${effectCap[1]}}`), templates = {};
    content = content.substring(effectCap.index + effectCap[0].length);
    let blockCap = blockRE.exec(content);
    while (blockCap) {
      let str = templates[blockCap[1]] = trimToSize(blockCap[2]);
      content = content.substring(blockCap.index + str.length);
      blockCap = blockRE.exec(content);
    }
    return { effect, templates };
  };
})();

// (HACKY) fixed builtin headers
let chunksCache = (function() {
  const path_ = require('path');
  const fsJetpack = require('fs-jetpack');
  const fs = require('fs');
  let files = fsJetpack.find('resources/3d/engine/cocos/renderer/bin/chunks', { matching: ['**/*.inc'] }), cache = {};
  for (let i = 0; i < files.length; ++i) {
    let name = path_.basename(files[i], '.inc');
    let content = fs.readFileSync(files[i], { encoding: 'utf8' });
    cache[name] = glslStripComment(content);
  }
  return cache;
})();

let buildEffect = function (name, content) {
  let { effect, templates } = parseEffect(content);
  effect = buildEffectJSON(effect); effect.name = name;
  Object.assign(templates, chunksCache);
  let shaders = effect.shaders = [];
  for (let j = 0; j < effect.techniques.length; ++j) {
    let jsonTech = effect.techniques[j];
    for (let k = 0; k < jsonTech.passes.length; ++k) {
      let pass = jsonTech.passes[k];
      let vert = pass.vert, frag = pass.frag;
      let shader = buildShader(vert, frag, templates);
      let name = sha3_224(shader.vert + shader.frag);
      shader.name = pass.program = name;
      delete pass.vert; delete pass.frag;
      shaders.push(shader);
    }
  }
  return effect;
};

// ==================
// exports
// ==================

module.exports = {
  buildEffect
};
