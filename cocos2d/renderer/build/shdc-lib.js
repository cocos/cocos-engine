'use strict';

const tokenizer = require('glsl-tokenizer/string');
const parser = require('glsl-parser/direct');
const mappings = require('./mappings');
const { sha3_224 } = require('js-sha3');
const HJSON = require('hjson');

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
let builtins = /^(_|cc_)\w+$/;

const vertHeader = '#define _IS_VERT_SHADER 1\n';
const fragHeader = '#define _IS_FRAG_SHADER 1\n';

// if #define a value, then program should not redefine this value
let definesInShader = {};

function convertType(t) { let tp = mappings.typeParams[t.toUpperCase()]; return tp === undefined ? t : tp; }

function unwindIncludes(str, chunks) {
  function replace(match, include) {
    let replace = chunks[include];
    if (replace === undefined) {
      Editor.error(`can not resolve #include <${include}>`);
    }
    return unwindIncludes(replace, chunks);
  }
  return str.replace(includeRE, replace);
}

function glslStrip(code, cache) {
  // strip tag and extension lines
  let result = '';
  let codes = code.split('\n');
  for (let i = 0; i < codes.length; i++) {
    if (cache.tagLines.indexOf(i+1) === -1) {
      result += codes[i] + '\n';
    }
  }
  

  // strip comment
  let tokens = tokenizer(result);
  result = '';
  for (let i = 0; i < tokens.length; ++i) {
    let t = tokens[i];
    if (t.type != 'block-comment' && t.type != 'line-comment' && t.type != 'eof') {
      result += t.data;
    }
  }

  // strip multiple line break
  result = result.replace(/\n\n+/g, '\n\n');

  return result;
}

function glslExtractExtensions (code) {
  let extensions = [];
  let result = '';
  let codes = code.split('\n');
  for (let i = 0; i < codes.length; i++) {
    if (codes[i].indexOf('#extension') === -1) {
      result += codes[i] + '\n';
    }
    else {
      extensions.push(codes[i]);
    }
  }

  result = extensions.join('\n') + '\n' + result;

  return result;
}

/**
 * say we are parsing this program:
 * ```
 *    // ..
 * 12 #if USE_LIGHTING
 *      // ..
 * 34   #if NUM_LIGHTS > 0
 *        // ..
 * 56   #endif
 *      // ..
 * 78 #endif
 *    // ..
 * ```
 *
 * the output would be:
 * ```
 * // the complete define list
 * defines = [ { name: 'USE_LIGHTING', type: 'boolean' }, { name: 'NUM_LIGHTS', type: 'number' } ]
 * // bookkeeping: define dependency throughout the code
 * cache = {
 *   lines: [12, 34, 56, 78],
 *   12: [ 'USE_LIGHTING' ],
 *   34: [ 'USE_LIGHTING', 'NUM_LIGHTS' ],
 *   56: [ 'USE_LIGHTING' ],
 *   78: []
 * }
 * ````
 */
function extractDefines(tokens, defines, cache) {
  let loopBegIdx = 0, curDefs = [], save = (line) => {
    cache[line] = curDefs.reduce((acc, val) => acc.concat(val), []);
    cache.lines.push(line);
  };
  for (let i = 0; i < tokens.length; ) {
    let t = tokens[i], str = t.data, id, df;
    if (str.startsWith('#define')) {
      definesInShader[str.split(whitespaces)[1]] = true; 
      i++; continue;
    }
    if (t.type !== 'preprocessor' || str.startsWith('#extension')) { i++; continue; }
    tokens.splice(i, 1); // strip out other preprocessor tokens for parser to work
    str = str.split(whitespaces);
    if (str[0] === '#endif') { // pop one level up
      curDefs.pop(); save(t.line); continue;
    } else if (str[0] === '#else') { // just clear this level
      curDefs[curDefs.length - 1].length = 0; save(t.line); continue;
    } else if (str[0] === '#pragma') { // pragma treatments
      // pragma loops are ignored and left to runtime
      // here we jsut strip out all of them
      if (str[1] === 'for') loopBegIdx = i;
      else if (str[1] === 'endFor') {
        tokens.splice(loopBegIdx, i - loopBegIdx);
        i = loopBegIdx;
      }
      // record the tags for the next extraction stage
      else if (str[1][0] === '#') cache[t.line] = str.splice(1);
      else { // custom numeric define ranges
        let mc = rangePragma.exec(t.data);
        if (!mc) continue;
        let def = defines.find(d => d.name === mc[2]);
        if (!def) defines.push(def = { name: mc[2] });
        def.type = 'number';
        def.range = JSON.parse(`[${mc[1]}]`);
      }
      continue;
    } else if (!ifprocessor.test(str[0])) { cache[t.line] = str; cache.tagLines.push(t.line); continue; } // tags
    if (str[0] === '#elif') { curDefs.pop(); save(t.line); } // pop one level up
    let defs = [];
    str.splice(1).some(s => {
      id = s.match(ident);
      if (id) { // is identifier
        if (definesInShader[id[0]] || id[0].startsWith('GL_')) return;
        let d = curDefs.reduce((acc, val) => acc.concat(val), defs.slice());
        df = defines.find(d => d.name === id[0]);
        if (df) { if (d.length < df.defines.length) df.defines = d; }
        else defines.push(df = { name: id[0], type: 'boolean', defines: d });
        defs.push(id[0]);
      } else if (comparators.test(s)) df.type = 'number';
      else if (s === '||') return defs = []; // ignore logical OR defines all together
    });
    curDefs.push(defs); save(t.line);
  }
}

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
    if (dest === uniforms && builtins.test(tokens[i+4].data)) continue;
    if (dest === extensions) {
      let name = extensionRE.exec(str.split(whitespaces)[1])[1];
      if (dest.indexOf(name) === -1) dest.push(name);
      continue;
    } else { // uniforms and attributes
      let offset = precision.exec(tokens[i+2].data) ? 4 : 2;
      param.name = tokens[i+offset+2].data;
      param.type = convertType(tokens[i+offset].data);
      let tags = cache[t.line - 1];
      if (tags && tags[0] && tags[0][0] === '#') { // tags
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
          if (tag.startsWith('#color')) param.type = convertType(tag.substring(1));
          else if (tag === '#property') param.property = true;
          // else if (tag === '#value') param.value = ;
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

let getChunkByName = (function() {
  let entryRE = /([\w-]+)(?::(\w+))?/;
  return function(name, cache) {
    let entryCap = entryRE.exec(name), entry = entryCap[2] || 'main', content = cache[entryCap[1]];
    if (!content) { Editor.error(`shader ${entryCap[1]} not found!`); return [ '', entry ]; }
    return [ content, entry ];
  };
})();

let wrapEntry = (function() {
  let wrapperFactory = (vert, fn) => `\nvoid main() { ${vert ? 'gl_Position' : 'gl_FragColor'} = ${fn}(); }\n`;
  return function(content, name, entry, ast, isVert) {
    if (!ast.scope[entry] || ast.scope[entry].parent.type !== 'function')
      Editor.error(`entry function ${name} not found`);
    return entry === 'main' ? content : content + wrapperFactory(isVert, entry);
  };
})();

let buildShader = function(vertName, fragName, cache) {
  let [ vert, vEntry ] = getChunkByName(vertName, cache, true);
  let [ frag, fEntry ] = getChunkByName(fragName, cache);

  let defines = [], defCache = { lines: [], tagLines: [] }, tokens, ast;
  let uniforms = [], attributes = [], extensions = [];

  vert = vertHeader + vert;
  vert = unwindIncludes(vert, cache);
  vert = expandStructMacro(vert);
  tokens = tokenizer(vert);
  extractDefines(tokens, defines, defCache);
  extractParams(tokens, defCache, uniforms, attributes, extensions);
  try {
    ast = parser(tokens);
    vert = wrapEntry(vert, vertName, vEntry, ast, true);
  } catch (e) { Editor.error(`parse ${vertName} failed: ${e}`); }
  vert = glslStrip(vert, defCache);
  vert = glslExtractExtensions(vert);

  defCache = { lines: [], tagLines: [] };
  frag = fragHeader + frag;
  frag = unwindIncludes(frag, cache);
  frag = expandStructMacro(frag);
  tokens = tokenizer(frag);
  extractDefines(tokens, defines, defCache);
  extractParams(tokens, defCache, uniforms, attributes, extensions);
  try {
    ast = parser(tokens);
    frag = wrapEntry(frag, fragName, fEntry, ast);
  } catch (e) { Editor.error(`parse ${fragName} failed: ${e}`); }
  frag = glslStrip(frag, defCache);
  frag = glslExtractExtensions(frag);

  return { vert, frag, defines, uniforms, attributes, extensions };
};

// ==================
// effects
// ==================

let queueRE = /(\w+)\s*(?:([+-])\s*(\d+))?/;
let parseQueue = function (queue) {
  let res = { queue: 0, priority: 0 };
  let m = queueRE.exec(queue);
  if (m === null) return res;
  res.queue = mappings.RenderQueue[m[1].toUpperCase()];
  if (m.length === 4) {
    if (m[2] === '+') res.priority = parseInt(m[3]);
    if (m[2] === '-') res.priority = -parseInt(m[3]);
  }
  return res;
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
    if (!jsonTech.stages) jsonTech.stages = ['opaque']; // Note: for creator
    let { queue, priority } = parseQueue(jsonTech.queue ? jsonTech.queue : 'opaque');
    jsonTech.queue = queue; jsonTech.priority = priority;
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
    let effect = HJSON.parse(`{${effectCap[1]}}`), templates = {};
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

let chunksCache = {};
let addChunksCache = function(chunksDir) {
  const path_ = require('path');
  const fsJetpack = require('fs-jetpack');
  const fs = require('fs');
  let files = fsJetpack.find(chunksDir, { matching: ['**/*.inc'] });
  for (let i = 0; i < files.length; ++i) {
    let name = path_.basename(files[i], '.inc');
    let content = fs.readFileSync(files[i], { encoding: 'utf8' });
    chunksCache[name] = content; //glslStrip(content);
  }
  return chunksCache;
};

let buildEffect = function (name, content) {
  definesInShader = {};
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
  addChunksCache,
  buildEffect
};
