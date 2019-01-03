// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { GFXShaderType } from '../../gfx/define';

let _shdID = 0;

function _generateDefines(device, defs, tDefs, deps) {
  let defines = [];
  for (const { name, type } of tDefs) {
    let d = defs[name];
    let result = (type === 'number') ? (d || 0) : (d ? 1 : 0);
    // fallback if extension dependency not supported
    if (result && deps[name] && !device[deps[name]]) {
      console.warn(`${deps[name]} not supported on this platform, disabled ${name}`);
      result = 0;
    }
    defines.push(`#define ${name} ${result}`);
  }
  return defines.join('\n');
}

export default class ProgramLib {
  /**
   * @param {gfx.Device} device
   * @param {Array} templates
   */
  constructor(device) {
    this._device = device;
    this._precision = `precision highp float;\n`;
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
   *     blocks: [{ name: 'Constants', binding: 0, size: 16, members: [{ name: 'color', type: 'vec4' }], defines: [] }],
   *     dependencies: { 'USE_NORMAL_TEXTURE': 'OES_standard_derivatives' },
   *   };
   *   programLib.define(program);
   */
  define(prog) {
    const { name, defines } = prog;
    if (this._templates[name]) return;

    prog.id = ++_shdID;
    prog.vert = this._precision + prog.vert;
    prog.frag = this._precision + prog.frag;

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
    this._templates[name] = prog;
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

    return key << 8 | (tmpl.id & 0xff);
  }

  getGFXShader(name, defines = {}) {
    let key = this.getKey(name, defines);
    let program = this._cache[key];
    if (program) {
      return program;
    }

    // get template
    let tmpl = this._templates[name];
    let customDef = _generateDefines(this._device, defines, tmpl.defines, tmpl.dependencies) + '\n';
    let vert = customDef + tmpl.vert;
    let frag = customDef + tmpl.frag;

    program = this._device.createShader({
      name,
      blocks: tmpl.blocks,
      samplers: tmpl.samplers,
      stages: [
        { type: GFXShaderType.VERTEX, source: vert },
        { type: GFXShaderType.FRAGMENT, source: frag },
      ],
    });
    this._cache[key] = program;
    return program;
  }
}
