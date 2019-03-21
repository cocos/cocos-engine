// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../gfx';

let _shdID = 0;

function _getValueFromDefineList (name, defineList) {
  let value;
  for (let i = defineList.length - 1; i >= 0; i--) {
    value = defineList[i][name];
    if (value !== undefined) {
      return value;
    }
  }
}

function _generateDefines(defineList) {
  let defines = [];
  let map = {}
  for (let i = defineList.length - 1; i >= 0; i--) {
    let defs = defineList[i];
    for (let def in defs) {
      if (map[def] !== undefined) continue;
      let result = defs[def];
      if (typeof result !== 'number') {
        result = result ? 1 : 0;
      }
      map[def] = result;
      defines.push(`#define ${def} ${result}`);
    }
  }
  return defines.join('\n') + '\n';
}

function _replaceMacroNums(string, defs) {
  let cache = {};
  let tmp = string;
  for (let def in defs) {
    if (Number.isInteger(defs[def])) {
      cache[def] = defs[def];
    }
  }
  for (let def in cache) {
    let reg = new RegExp(def, 'g');
    tmp = tmp.replace(reg, cache[def]);
  }
  return tmp;
}

function _unrollLoops(string) {
  let pattern = /#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g;
  function replace(match, index, begin, end, snippet) {
    let unroll = '';
    let parsedBegin = parseInt(begin);
    let parsedEnd = parseInt(end);
    if (parsedBegin.isNaN || parsedEnd.isNaN) {
      console.error('Unroll For Loops Error: begin and end of range must be an int num.');
    }
    for (let i = parsedBegin; i < parsedEnd; ++i) {
      unroll += snippet.replace(new RegExp(`{${index}}`, 'g'), i);
    }
    return unroll;
  }
  return string.replace(pattern, replace);
}

export default class ProgramLib {
  /**
   * @param {gfx.Device} device
   * @param {Array} templates
   * @param {Object} chunks
   */
  constructor(device, templates = [], chunks = {}) {
    this._device = device;

    // register templates
    this._templates = {};
    for (let i = 0; i < templates.length; ++i) {
      this.define(templates[i]);
    }

    // register chunks
    this._chunks = {};
    Object.assign(this._chunks, chunks);

    this._cache = {};
  }

  /**
   * @param {string} name
   * @param {string} vert
   * @param {string} frag
   * @param {Object[]} defines
   *
   * @example:
   *   // this object is auto-generated from your actual shaders
   *   let program = {
   *     name: 'foobar',
   *     vert: vertTmpl,
   *     frag: fragTmpl,
   *     defines: [
   *       { name: 'shadow', type: 'boolean' },
   *       { name: 'lightCount', type: 'number', min: 1, max: 4 }
   *     ],
   *     attributes: [{ name: 'a_position', type: 'vec3' }],
   *     uniforms: [{ name: 'color', type: 'vec4' }],
   *     extensions: ['GL_OES_standard_derivatives'],
   *   };
   *   programLib.define(program);
   */
  define(prog) {
    let { name, vert, frag, defines, extensions } = prog;
    if (this._templates[name]) {
      console.warn(`Failed to define shader ${name}: already exists.`);
      return;
    }

    let id = ++_shdID;

    // calculate option mask offset
    let offset = 0;
    for (let i = 0; i < defines.length; ++i) {
      let def = defines[i];
      let cnt = 1;

      if (def.type === 'number') {
        let range = def.range || [];
        def.min = range[0] || 0;
        def.max = range[1] || 4;
        cnt = Math.ceil(Math.log2(def.max - def.min));

        def._map = function (value) {
          return (value - this.min) << this._offset;
        }.bind(def);
      } else { // boolean
        def._map = function (value) {
          if (value) {
            return 1 << this._offset;
          }
          return 0;
        }.bind(def);
      }

      offset += cnt;
      def._offset = offset;
    }

    // store it
    this._templates[name] = {
      id,
      name,
      vert,
      frag,
      defines,
      attributes: prog.attributes,
      uniforms: prog.uniforms,
      extensions: prog.extensions
    };
  }

  getTemplate(name) {
    return this._templates[name];
  }

  /**
   * Does this library has the specified program?
   * @param {string} name
   * @returns {boolean}
   */
  hasProgram(name) {
    return this._templates[name] !== undefined;
  }


  /**
   * @param {string} name
   * @param {Array} defineList
   */
  getKey(name, defineList) {
    let tmpl = this._templates[name];
    let key = 0;
    for (let i = 0; i < tmpl.defines.length; ++i) {
      let tmplDefs = tmpl.defines[i];
      
      let value = _getValueFromDefineList(tmplDefs.name, defineList);
      if (value === undefined) {
        continue;
      }

      key |= tmplDefs._map(value);
    }

    // return key << 8 | tmpl.id;
    // key number maybe bigger than 32 bit, need use string to store value.
    return tmpl.id + ':' + key;
  }

  /**
   * @param {string} name
   * @param {Object} defines
   * @param {String} errPrefix
   */
  getProgram(name, defines, errPrefix) {
    let key = this.getKey(name, defines);
    let program = this._cache[key];
    if (program) {
      return program;
    }

    // get template
    let tmpl = this._templates[name];
    let customDef = _generateDefines(defines);
    let vert = _replaceMacroNums(tmpl.vert, defines);
    vert = customDef + _unrollLoops(vert);
    let frag = _replaceMacroNums(tmpl.frag, defines);
    frag = customDef + _unrollLoops(frag);

    program = new gfx.Program(this._device, {
      vert,
      frag
    });
    let errors = program.link();
    if (errors) {
      let vertLines = vert.split('\n');
      let fragLines = frag.split('\n');
      let defineLength = Object.keys(defines).length;
      errors.forEach(err => {
        let line = err.line - 1;
        let originLine = err.line - defineLength;

        let lines = err.type === 'vs' ? vertLines : fragLines;
        // let source = ` ${lines[line-1]}\n>${lines[line]}\n ${lines[line+1]}`;
        let source = lines[line];

        let info = err.info || `Failed to compile ${err.type} ${err.fileID} (ln ${originLine}): \n ${err.message}: \n  ${source}`;
        cc.error(`${errPrefix} : ${info}`);
      })
    }
    this._cache[key] = program;

    return program;
  }
}
