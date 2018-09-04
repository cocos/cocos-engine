// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../../gfx';

let _shdID = 0;

function _generateDefines(device, defs, deps) {
  let defines = [];
  for (let def in defs) {
    if (deps[def] === undefined) { // if define has no dependency
      if (defs[def] === true) {
        defines.push(`#define ${def} 1`);
      } else if (defs[def] === false) {
        defines.push(`#define ${def} 0`);
      }
    } else { // define has dependency, need to check if dependency is supported by current device
      if (device.ext(deps[def]) && defs[def] === true) {
        defines.push(`#define ${def} 1`);
      } else {
        defines.push(`#define ${def} 0`);
      }
    }
  }
  return defines.join('\n');
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
    this._precision = `precision highp float;\n`;

    // register templates
    this._templates = {};
    for (let i = 0; i < templates.length; ++i) {
      let tmpl = templates[i];
      this.define(tmpl.name, tmpl.vert, tmpl.frag, tmpl.defines);
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
   *   programLib.define('foobar', vertTmpl, fragTmpl, [
   *     { name: 'shadow' },
   *     { name: 'lightCount', min: 1, max: 4 }
   *   ]);
   */
  define(name, vert, frag, defines) {
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

      if (def.min !== undefined && def.max !== undefined) {
        cnt = Math.ceil((def.max - def.min) * 0.5);

        def._map = function (value) {
          return (value - this.min) << this._offset;
        }.bind(def);
      } else {
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

    vert = this._precision + vert;
    frag = this._precision + frag;

    // store it
    this._templates[name] = {
      id,
      name,
      vert,
      frag,
      defines
    };
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
   * @param {Object} defines
   */
  getKey(name, defines) {
    let tmpl = this._templates[name];
    let key = 0;
    for (let i = 0; i < tmpl.defines.length; ++i) {
      let tmplDefs = tmpl.defines[i];
      let value = defines[tmplDefs.name];
      if (value === undefined) {
        continue;
      }

      key |= tmplDefs._map(value);
    }

    return key << 8 | tmpl.id;
  }

  /**
   * @param {string} name
   * @param {Object} defines
   * @param {Object} dependencies
   */
  getProgram(name, defines, dependencies) {
    let key = this.getKey(name, defines);
    let program = this._cache[key];
    if (program) {
      return program;
    }

    // get template
    let tmpl = this._templates[name];
    let customDef = _generateDefines(this._device, defines, dependencies) + '\n';
    let vert = _replaceMacroNums(tmpl.vert, defines);
    vert = customDef + _unrollLoops(vert);
    let frag = _replaceMacroNums(tmpl.frag, defines);
    frag = customDef + _unrollLoops(frag);

    program = new gfx.Program(this._device, {
      vert,
      frag
    });
    program.link();
    this._cache[key] = program;

    return program;
  }
}