// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd. 

import { RecyclePool } from '../memop';
import enums from '../enums';
import { vec2, vec3, vec4, mat2, mat3, mat4, color3, color4 } from '../../core/vmath';
import ProgramLib from './program-lib';
import View from './view';
import Texture2D from '../gfx/texture-2d';

let _m3_tmp = mat3.create();
let _m4_tmp = mat4.create();

let _stageInfos = new RecyclePool(() => {
  return {
    stage: null,
    items: null,
  };
}, 8);

let _float2_pool = new RecyclePool(() => {
  return new Float32Array(2);
}, 8);

let _float3_pool = new RecyclePool(() => {
  return new Float32Array(3);
}, 8);

let _float4_pool = new RecyclePool(() => {
  return new Float32Array(4);
}, 8);

let _float9_pool = new RecyclePool(() => {
  return new Float32Array(9);
}, 8);

let _float16_pool = new RecyclePool(() => {
  return new Float32Array(16);
}, 8);

let _float64_pool = new RecyclePool(() => {
  return new Float32Array(64);
}, 8);

let _int2_pool = new RecyclePool(() => {
  return new Int32Array(2);
}, 8);

let _int3_pool = new RecyclePool(() => {
  return new Int32Array(3);
}, 8);

let _int4_pool = new RecyclePool(() => {
  return new Int32Array(4);
}, 8);

let _int64_pool = new RecyclePool(() => {
  return new Int32Array(64);
}, 8);

let _type2uniformValue = {
  [enums.PARAM_INT]: function (value) {
    return value;
  },

  [enums.PARAM_INT2]: function (value) {
    return vec2.array(_int2_pool.add(), value);
  },

  [enums.PARAM_INT3]: function (value) {
    return vec3.array(_int3_pool.add(), value);
  },

  [enums.PARAM_INT4]: function (value) {
    return vec4.array(_int4_pool.add(), value);
  },

  [enums.PARAM_FLOAT]: function (value) {
    return value;
  },

  [enums.PARAM_FLOAT2]: function (value) {
    return vec2.array(_float2_pool.add(), value);
  },

  [enums.PARAM_FLOAT3]: function (value) {
    return vec3.array(_float3_pool.add(), value);
  },

  [enums.PARAM_FLOAT4]: function (value) {
    return vec4.array(_float4_pool.add(), value);
  },

  [enums.PARAM_COLOR3]: function (value) {
    return color3.array(_float3_pool.add(), value);
  },

  [enums.PARAM_COLOR4]: function (value) {
    return color4.array(_float4_pool.add(), value);
  },

  [enums.PARAM_MAT2]: function (value) {
    return mat2.array(_float4_pool.add(), value);
  },

  [enums.PARAM_MAT3]: function (value) {
    return mat3.array(_float9_pool.add(), value);
  },

  [enums.PARAM_MAT4]: function (value) {
    return mat4.array(_float16_pool.add(), value);
  },

  // [enums.PARAM_TEXTURE_2D]: function (value) {
  // },

  // [enums.PARAM_TEXTURE_CUBE]: function (value) {
  // },
};

let _type2uniformArrayValue = {
  [enums.PARAM_INT]: {
    func (values) {
      let result = _int64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        result[i] = values[i];
      }
      return result;
    },
    size: 1,
  },

  [enums.PARAM_INT2]: {
    func (values) {
      let result = _int64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        result[2 * i] = values[i].x;
        result[2 * i + 1] = values[i].y;
      }
      return result;
    },
    size: 2,
  },

  [enums.PARAM_INT3]: {
    func: undefined,
    size: 3,
  },

  [enums.PARAM_INT4]: {
    func (values) {
      let result = _int64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        let v = values[i];
        result[4 * i] = v.x;
        result[4 * i + 1] = v.y;
        result[4 * i + 2] = v.z;
        result[4 * i + 3] = v.w;
      }
      return result;
    },
    size: 4,
  },

  [enums.PARAM_FLOAT]: {
    func (values) {
      let result = _float64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        result[i] = values[i];
      }
      return result;
    },
    size: 1
  },

  [enums.PARAM_FLOAT2]: {
    func (values) {
      let result = _float64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        result[2 * i] = values[i].x;
        result[2 * i + 1] = values[i].y;
      }
      return result;
    },
    size: 2,
  },

  [enums.PARAM_FLOAT3]: {
    func: undefined,
    size: 3,
  },

  [enums.PARAM_FLOAT4]: {
    func (values) {
      let result = _float64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        let v = values[i];
        result[4 * i] = v.x;
        result[4 * i + 1] = v.y;
        result[4 * i + 2] = v.z;
        result[4 * i + 3] = v.w;
      }
      return result;
    },
    size: 4,
  },

  [enums.PARAM_COLOR3]: {
    func: undefined,
    size: 3,
  },

  [enums.PARAM_COLOR4]: {
    func (values) {
      let result = _float64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        let v = values[i];
        result[4 * i] = v.r;
        result[4 * i + 1] = v.g;
        result[4 * i + 2] = v.b;
        result[4 * i + 3] = v.a;
      }
      return result;
    },
    size: 4,
  },

  [enums.PARAM_MAT2]: {
    func (values) {
      let result = _float64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        let v = values[i];
        result[4 * i] = v.m00;
        result[4 * i + 1] = v.m01;
        result[4 * i + 2] = v.m02;
        result[4 * i + 3] = v.m03;
      }
      return result;
    },
    size: 4
  },

  [enums.PARAM_MAT3]: {
    func: undefined,
    size: 9
  },


  [enums.PARAM_MAT4]: {
    func (values) {
      let result = _float64_pool.add();
      for (let i = 0; i < values.length; ++i) {
        let v = values[i];
        result[16 * i] = v.m00;
        result[16 * i + 1] = v.m01;
        result[16 * i + 2] = v.m02;
        result[16 * i + 3] = v.m03;
        result[16 * i + 4] = v.m04;
        result[16 * i + 5] = v.m05;
        result[16 * i + 6] = v.m06;
        result[16 * i + 7] = v.m07;
        result[16 * i + 8] = v.m08;
        result[16 * i + 9] = v.m09;
        result[16 * i + 10] = v.m10;
        result[16 * i + 11] = v.m11;
        result[16 * i + 12] = v.m12;
        result[16 * i + 13] = v.m13;
        result[16 * i + 14] = v.m14;
        result[16 * i + 15] = v.m15;
      }
      return result;
    },
    size: 16
  },

  // [enums.PARAM_TEXTURE_2D]: function (value) {
  // },

  // [enums.PARAM_TEXTURE_CUBE]: function (value) {
  // },
};

export default class Base {
  /**
   * @param {gfx.Device} device
   * @param {Object} opts
   * @param {gfx.Texture2D} opts.defaultTexture
   * @param {gfx.TextureCube} opts.defaultTextureCube
   * @param {Array} opts.programTemplates
   * @param {Object} opts.programChunks
   */
  constructor(device, opts) {
    this._device = device;
    this._programLib = new ProgramLib(device, opts.programTemplates, opts.programChunks);
    this._opts = opts;
    this._type2defaultValue = {
      [enums.PARAM_INT]: 0,
      [enums.PARAM_INT2]: vec2.create(0, 0),
      [enums.PARAM_INT3]: vec3.create(0, 0, 0),
      [enums.PARAM_INT4]: vec4.create(0, 0, 0, 0),
      [enums.PARAM_FLOAT]: 0.0,
      [enums.PARAM_FLOAT2]: vec2.create(0, 0),
      [enums.PARAM_FLOAT3]: vec3.create(0, 0, 0),
      [enums.PARAM_FLOAT4]: vec4.create(0, 0, 0, 0),
      [enums.PARAM_COLOR3]: color3.create(0, 0, 0),
      [enums.PARAM_COLOR4]: color4.create(0, 0, 0, 1),
      [enums.PARAM_MAT2]: mat2.create(),
      [enums.PARAM_MAT3]: mat3.create(),
      [enums.PARAM_MAT4]: mat4.create(),
      [enums.PARAM_TEXTURE_2D]: opts.defaultTexture,
      [enums.PARAM_TEXTURE_CUBE]: opts.defaultTextureCube,
    };
    this._stage2fn = {};
    this._usedTextureUnits = 0;

    this._viewPools = new RecyclePool(() => {
      return new View();
    }, 8);

    this._drawItemsPools = new RecyclePool(() => {
      return {
        model: null,
        node: null,
        ia: null,
        effect: null,
        defines: null,
        uniforms: null
      };
    }, 100);

    this._stageItemsPools = new RecyclePool(() => {
      return new RecyclePool(() => {
        return {
          model: null,
          node: null,
          ia: null,
          effect: null,
          defines: null,
          technique: null,
          sortKey: -1,
          uniforms: null
        };
      }, 100);
    }, 16);
  }

  _resetTextuerUnit() {
    this._usedTextureUnits = 0;
  }

  _allocTextureUnit() {
    const device = this._device;

    let unit = this._usedTextureUnits;
    if (unit >= device._caps.maxTextureUnits) {
      console.warn(`Trying to use ${unit} texture units while this GPU supports only ${device._caps.maxTextureUnits}`);
    }

    this._usedTextureUnits += 1;
    return unit;
  }

  _registerStage(name, fn) {
    this._stage2fn[name] = fn;
  }

  _reset() {
    this._viewPools.reset();
    this._stageItemsPools.reset();
  }

  _requestView() {
    return this._viewPools.add();
  }

  _render(view, scene) {
    const device = this._device;

    // setup framebuffer
    device.setFrameBuffer(view._framebuffer);

    // setup viewport
    device.setViewport(
      view._rect.x,
      view._rect.y,
      view._rect.w,
      view._rect.h
    );

    // setup clear
    let clearOpts = {};
    if (view._clearFlags & enums.CLEAR_COLOR) {
      clearOpts.color = [
        view._color.r,
        view._color.g,
        view._color.b,
        view._color.a
      ];
    }
    if (view._clearFlags & enums.CLEAR_DEPTH) {
      clearOpts.depth = view._depth;
    }
    if (view._clearFlags & enums.CLEAR_STENCIL) {
      clearOpts.stencil = view._stencil;
    }
    device.clear(clearOpts);

    // get all draw items
    this._drawItemsPools.reset();

    for (let i = 0; i < scene._models.length; ++i) {
      let model = scene._models.data[i];

      // filter model by view
      if ((model._cullingMask & view._cullingMask) === 0) {
        continue;
      }

      let drawItem = this._drawItemsPools.add();
      model.extractDrawItem(drawItem);
    }

    // TODO: update frustum
    // TODO: visbility test
    // frustum.update(view._viewProj);

    // dispatch draw items to different stage
    _stageInfos.reset();

    for (let i = 0; i < view._stages.length; ++i) {
      let stage = view._stages[i];
      let stageItems = this._stageItemsPools.add();
      stageItems.reset();

      for (let j = 0; j < this._drawItemsPools.length; ++j) {
        let drawItem = this._drawItemsPools.data[j];
        let tech = drawItem.effect.getTechnique(stage);

        if (tech) {
          let stageItem = stageItems.add();
          stageItem.model = drawItem.model;
          stageItem.node = drawItem.node;
          stageItem.ia = drawItem.ia;
          stageItem.effect = drawItem.effect;
          stageItem.defines = drawItem.defines;
          stageItem.technique = tech;
          stageItem.sortKey = -1;
          stageItem.uniforms = drawItem.uniforms;
        }
      }

      let stageInfo = _stageInfos.add();
      stageInfo.stage = stage;
      stageInfo.items = stageItems;
    }

    // render stages
    for (let i = 0; i < _stageInfos.length; ++i) {
      let info = _stageInfos.data[i];
      let fn = this._stage2fn[info.stage];

      fn(view, info.items);
    }
  }

  _setProperty (prop) {
    const device = this._device;
    let param = prop.value;

    if (param === undefined) {
      param = prop.val;
    }

    if (param === undefined) {
      param = this._type2defaultValue[prop.type];
    }

    if (param === undefined) {
      console.warn(`Failed to set technique property ${prop.name}, value not found.`);
      return;
    }

    if (
      prop.type === enums.PARAM_TEXTURE_2D ||
      prop.type === enums.PARAM_TEXTURE_CUBE
    ) {
      if (prop.size !== undefined) {
        if (prop.size !== param.length) {
          console.error(`The length of texture array (${param.length}) is not corrent(expect ${prop.size}).`);
          return;
        }
        let slots = _int64_pool.add();
        for (let index = 0; index < param.length; ++index) {
          slots[index] = this._allocTextureUnit();
        }
        device.setTextureArray(prop.name, param, slots);
      } else {
        device.setTexture(prop.name, param, this._allocTextureUnit());
      }
    } else {
      let convertedValue;
      if (param instanceof Float32Array || param instanceof Int32Array) {
        device.setUniformDirectly(prop.name, param);
        return;
      }
      else if (prop.size !== undefined) {
        let convertArray = _type2uniformArrayValue[prop.type];
        if (convertArray.func === undefined) {
          console.error('Uniform array of color3/int3/float3/mat3 can not be supportted!');
          return;
        }
        if (prop.size * convertArray.size > 64) {
          console.error('Uniform array is too long!');
          return;
        }
        convertedValue = convertArray.func(param);
      } else {
        let convertFn = _type2uniformValue[prop.type];
        convertedValue = convertFn(param);
      }
      device.setUniform(prop.name, convertedValue);
    }
  }

  _draw(item) {
    const device = this._device;
    const programLib = this._programLib;
    const { node, ia, uniforms, technique, defines, effect } = item;

    // reset the pool
    // NOTE: we can use drawCounter optimize this
    // TODO: should be configurable
    _float2_pool.reset();
    _float3_pool.reset();
    _float4_pool.reset();
    _float9_pool.reset();
    _float16_pool.reset();
    _float64_pool.reset();
    _int2_pool.reset();
    _int3_pool.reset();
    _int4_pool.reset();
    _int64_pool.reset();

    // set common uniforms
    // TODO: try commit this depends on effect
    // {
    node.getWorldMatrix(_m4_tmp);
    device.setUniform('cc_matWorld', mat4.array(_float16_pool.add(), _m4_tmp));

    let inverse = mat3.invert(_m3_tmp, mat3.fromMat4(_m3_tmp, _m4_tmp));
    if (inverse) {
      mat3.transpose(_m3_tmp, inverse);
      device.setUniform('cc_matWorldIT', mat3.array(_float9_pool.add(), _m3_tmp));
    }
    // }

    for (let name in uniforms) {
      let uniform = uniforms[name];
      this._setProperty(uniform);
    }

    // for each pass
    for (let i = 0; i < technique._passes.length; ++i) {
      let pass = technique._passes[i];
      let count = ia.count;

      // set vertex buffer
      device.setVertexBuffer(0, ia._vertexBuffer);

      // set index buffer
      if (ia._indexBuffer) {
        device.setIndexBuffer(ia._indexBuffer);
      }

      // set primitive type
      device.setPrimitiveType(ia._primitiveType);

      // set program
      let program = programLib.getProgram(pass._programName, defines, effect._name);
      device.setProgram(program);

      // cull mode
      device.setCullMode(pass._cullMode);

      // blend
      if (pass._blend) {
        device.enableBlend();
        device.setBlendFuncSep(
          pass._blendSrc,
          pass._blendDst,
          pass._blendSrcAlpha,
          pass._blendDstAlpha
        );
        device.setBlendEqSep(
          pass._blendEq,
          pass._blendAlphaEq
        );
        device.setBlendColor32(pass._blendColor);
      }

      // depth test & write
      if (pass._depthTest) {
        device.enableDepthTest();
        device.setDepthFunc(pass._depthFunc);
      }
      if (pass._depthWrite) {
        device.enableDepthWrite();
      }

      // stencil
      if (pass._stencilTest) {
        device.enableStencilTest();

        // front
        device.setStencilFuncFront(
          pass._stencilFuncFront,
          pass._stencilRefFront,
          pass._stencilMaskFront
        );
        device.setStencilOpFront(
          pass._stencilFailOpFront,
          pass._stencilZFailOpFront,
          pass._stencilZPassOpFront,
          pass._stencilWriteMaskFront
        );

        // back
        device.setStencilFuncBack(
          pass._stencilFuncBack,
          pass._stencilRefBack,
          pass._stencilMaskBack
        );
        device.setStencilOpBack(
          pass._stencilFailOpBack,
          pass._stencilZFailOpBack,
          pass._stencilZPassOpBack,
          pass._stencilWriteMaskBack
        );
      }

      // draw pass
      device.draw(ia._start, count);

      this._resetTextuerUnit();
    }
  }
}