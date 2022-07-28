// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { RecyclePool } from '../memop';
import enums from '../enums';
import { Vec2, Vec4, Mat3, Mat4, Color, Vec3 } from '../../core/value-types';
import ProgramLib from './program-lib';
import View from './view';
import gfx from '../gfx';

let _m4_tmp = new Mat4();

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

export default class Base {
  /**
   * @param {gfx.Device} device
   * @param {Object} opts
   * @param {gfx.Texture2D} opts.defaultTexture
   * @param {gfx.TextureCube} opts.defaultTextureCube
   */
  constructor (device, opts) {
    this._device = device;
    this._programLib = new ProgramLib(device);
    this._opts = opts;
    this._type2defaultValue = {
      [enums.PARAM_INT]: 0,
      [enums.PARAM_INT2]: new Vec2(0, 0),
      [enums.PARAM_INT3]: new Vec3(0, 0, 0),
      [enums.PARAM_INT4]: new Vec4(0, 0, 0, 0),
      [enums.PARAM_FLOAT]: 0.0,
      [enums.PARAM_FLOAT2]: new Vec2(0, 0),
      [enums.PARAM_FLOAT3]: new Vec3(0, 0, 0),
      [enums.PARAM_FLOAT4]: new Vec4(0, 0, 0, 0),
      [enums.PARAM_COLOR4]: new Color(0, 0, 0, 1),
      [enums.PARAM_MAT3]: new Mat3(),
      [enums.PARAM_MAT4]: new Mat4(),
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
          passes: [],
          sortKey: -1,
          uniforms: null
        };
      }, 100);
    }, 16);

    this._definesChanged = false;
  }

  _resetTextuerUnit () {
    this._usedTextureUnits = 0;
  }

  _allocTextureUnit () {
    const device = this._device;

    let unit = this._usedTextureUnits;
    if (unit >= device._caps.maxTextureUnits) {
      console.warn(`Trying to use ${unit} texture units while this GPU supports only ${device._caps.maxTextureUnits}`);
    }

    this._usedTextureUnits += 1;
    return unit;
  }

  _registerStage (name, fn) {
    this._stage2fn[name] = fn;
  }

  clear () {
    this._programLib.clear();
    this.reset();
  }

  reset () {
    this._viewPools.reset();
    this._stageItemsPools.reset();

    this._definesChanged = false;
  }

  _requestView () {
    return this._viewPools.add();
  }

  _render (view, scene) {
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
      clearOpts.color = Vec4.toArray([], view._color);
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

    // dispatch draw items to different stage
    _stageInfos.reset();

    for (let i = 0; i < view._stages.length; ++i) {
      let stage = view._stages[i];
      let stageItems = this._stageItemsPools.add();
      stageItems.reset();

      for (let j = 0; j < this._drawItemsPools.length; ++j) {
        let drawItem = this._drawItemsPools.data[j];
        let passes = drawItem.effect.stagePasses[stage];
        if (!passes || passes.length === 0) continue;

        let stageItem = stageItems.add();
        stageItem.passes = passes;
        stageItem.model = drawItem.model;
        stageItem.node = drawItem.node;
        stageItem.ia = drawItem.ia;
        stageItem.effect = drawItem.effect;
        stageItem.defines = drawItem.defines;
        stageItem.sortKey = -1;
        stageItem.uniforms = drawItem.uniforms;
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
      if (Array.isArray(param)) {
        if (param.length > prop.count) {
          console.error(`Failed to set property [${prop.name}] : The length of texture array [${param.length}] is bigger than [${prop.count}].`);
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
      if (prop.directly) {
        device.setUniformDirectly(prop.name, param);
      }
      else {
        device.setUniform(prop.name, param);
      }
    }
  }

  _draw (item) {
    const device = this._device;
    const programLib = this._programLib;
    const { node, ia, passes, effect } = item;

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
    device.setUniform('cc_matWorld', Mat4.toArray(_float16_pool.add(), _m4_tmp));

    // let wq = node.getWorldRotation(cc.quat());
    Mat4.invert(_m4_tmp, _m4_tmp);
    Mat4.transpose(_m4_tmp, _m4_tmp);
    device.setUniform('cc_matWorldIT', Mat4.toArray(_float16_pool.add(), _m4_tmp));
    // }

    let defines = this._defines;

    // for each pass
    for (let i = 0; i < passes.length; ++i) {
      let pass = passes[i];

      if (this._definesChanged) {
        pass._programKey = null;
      }

      let count = ia.count;

      // set vertex buffer
      if (ia._vertexBuffer) {
        device.setVertexBuffer(0, ia._vertexBuffer);
      }

      // set index buffer
      if (ia._indexBuffer) {
        device.setIndexBuffer(ia._indexBuffer);
      }

      // set primitive type
      device.setPrimitiveType(ia._primitiveType);

      // set program
      Object.setPrototypeOf(defines, pass._defines);

      let program = programLib.getProgram(pass, defines, effect.name);
      device.setProgram(program);

      let uniforms = program._uniforms;
      let variants = pass._properties;
      for (let j = 0; j < uniforms.length; j++) {
        let prop = variants[uniforms[j].name];
        if (prop !== undefined)
        this._setProperty(prop);
      }


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
      device.setStencilTest(pass._stencilTest);
      if (pass._stencilTest === gfx.STENCIL_ENABLE) {
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
