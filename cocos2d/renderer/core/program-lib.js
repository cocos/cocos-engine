// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../gfx';

let _shdID = 0;

function _generateDefines(tmpDefines, defines) {
  let results = [];
  for (let i = 0; i < tmpDefines.length; i++) {
    let name = tmpDefines[i].name;
    let value = defines[name];
    if (typeof value !== 'number') {
      value = value ? 1 : 0;
    }
    results.push(`#define ${name} ${value}`);
  }
  return results.join('\n') + '\n';
}

function _replaceMacroNums(string, tmpDefines, defines) {
  let tmp = string;

  for (let i = 0; i < tmpDefines.length; i++) {
    let name = tmpDefines[i].name;
    let value = defines[name];
    if (Number.isInteger(value)) {
      let reg = new RegExp(name, 'g');
      tmp = tmp.replace(reg, value);
    }
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

function _replaceHighp(string) {
  return string.replace(/\bhighp\b/g, 'mediump');
}

export default class ProgramLib {
  /**
   * @param {gfx.Device} device
   */
  constructor(device) {
    this._device = device;

    // register templates
    this._templates = {};
    this._cache = {};

    this._checkPrecision();
  }

  clear () {
    this._templates = {};
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
    let { name, defines, glsl1 } = prog;
    let { vert, frag } = glsl1 || prog;
    if (this._templates[name]) {
      // console.warn(`Failed to define shader ${name}: already exists.`);
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

      def._offset = offset;
      offset += cnt;
    }

    let uniforms = prog.uniforms || [];

    if (prog.samplers) {
      for (let i = 0; i < prog.samplers.length; i++) {
        uniforms.push(prog.samplers[i])
      }
    }
    if (prog.blocks) {
      for (let i = 0; i < prog.blocks.length; i++) {
        let defines = prog.blocks[i].defines;
        let members = prog.blocks[i].members;
        for (let j = 0; j < members.length; j++) {
          uniforms.push({
            defines,
            name: members[j].name,
            type: members[j].type,
          })
        }
      }
    }

    // store it
    this._templates[name] = {
      id,
      name,
      vert,
      frag,
      defines,
      attributes: prog.attributes,
      uniforms,
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

    // return key << 8 | tmpl.id;
    // key number maybe bigger than 32 bit, need use string to store value.
    return tmpl.id + ':' + key;
  }

  getProgram(pass, defines, errPrefix) {
    let key = pass._programKey = pass._programKey || this.getKey(pass._programName, defines);
    let program = this._cache[key];
    if (program) {
      return program;
    }

    // get template
    let tmpl = this._templates[pass._programName];
    let customDef = _generateDefines(tmpl.defines, defines);
    let vert = _replaceMacroNums(tmpl.vert, tmpl.defines, defines);
    vert = customDef + _unrollLoops(vert);
    if (!this._highpSupported) {
      vert = _replaceHighp(vert);
    }

    let frag = _replaceMacroNums(tmpl.frag, tmpl.defines, defines);
    frag = customDef + _unrollLoops(frag);
    if (!this._highpSupported) {
      frag = _replaceHighp(frag);
    }

    program = new gfx.Program(this._device, {
      vert,
      frag
    });
    let errors = program.link();
    if (errors) {
      let vertLines = vert.split('\n');
      let fragLines = frag.split('\n');
      let defineLength = tmpl.defines.length;
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

  _checkPrecision () {
    let gl = this._device._gl;
    let highpSupported = false;
    if (gl.getShaderPrecisionFormat) {
        let vertHighp = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
        let fragHighp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        highpSupported = (vertHighp && vertHighp.precision > 0) &&
          (fragHighp && fragHighp.precision > 0);
    }
    if (!highpSupported) {
      cc.warnID(9102);
    }
    this._highpSupported = highpSupported;
  }
}
