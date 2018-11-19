// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { RecyclePool } from '../../3d/memop';
import { vec2, vec3, vec4, mat2, mat3, mat4, color3, color4 } from '../../core/vmath';
import { intersect } from '../../3d/geom-utils';
import { RenderQueue } from './constants';

import enums from '../enums';
import View from './view';

let RenderQueue = cc.Enum({
    OPAQUE: 0,
    TRANSPARENT: 3000,
    OVERLAY: 5000
});

cc.parseQueue = function (expr) {
    let m = expr.match(/(\w+)(?:([+-])(\d+))?/);
    if (m == null)
        return 0;
    let q;
    switch (m[1]) {
        case 'opaque':
            q = RenderQueue.OPAQUE;
            break;
        case 'transparent':
            q = RenderQueue.TRANSPARENT;
            break;
        case 'overlay':
            q = RenderQueue.OVERLAY;
            break;
    }
    if (m.length == 4) {
        if (m[2] === '+') {
            q += parseInt(m[3]);
        }
        if (m[2] === '-') {
            q -= parseInt(m[3]);
        }
    }
    return q;
};

cc.RenderQueue = RenderQueue;

let _m3_tmp = mat3.create();
let _m4_tmp = mat4.create();

let _camPos = vec3.create(0, 0, 0);
let _camFwd = vec3.create(0, 0, 0);
let _v3_tmp1 = vec3.create(0, 0, 0);

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);
let _a3_camPos = new Float32Array(3);

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
        let scale = v instanceof cc.Color ? 1 / 255 : 1;
        result[4 * i] = v.r * scale;
        result[4 * i + 1] = v.g * scale;
        result[4 * i + 2] = v.b * scale;
        result[4 * i + 3] = v.a * scale;
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

export default class BaseRenderer {
  /**
   * @param {gfx.Device} device
   */
  constructor(device) {
    this._device = device;
    this._programLib = null;
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
      [enums.PARAM_TEXTURE_2D]: null,
      [enums.PARAM_TEXTURE_CUBE]: null,
    };
    this._renderQueueFn = {};
    this._stage2fn = {};
    this._modelType2fn = {};
    this._usedTextureUnits = 0;
    this.frustum_test_func = intersect.aabb_frustum;
    this._accurateFrustumCulling = false;

    this._viewPools = new RecyclePool(() => {
      return new View();
    }, 8);

    // store renderable based on material
    this._drawItemsPools = new RecyclePool(() => {
      return {
        model: null,
        node: null,
        ia: null,
        effect: null,
        defines: null,
        dependencies: null,
      };
    }, 100);

    // store renderable based on pass
    this._stageItemsPools = new RecyclePool(() => {
      return new RecyclePool(() => {
        return {
          model: null,
          node: null,
          ia: null,
          effect: null,
          defines: null,
          dependencies: null,
          technique: null,
          sortKey: -1,
        };
      }, 100);
    }, 16);

    this._registerRenderQueue('TRANSPARENT', this._renderTransparent.bind(this));
    this._registerRenderQueue('OPAQUE', this._renderOpaque.bind(this));
    this._registerRenderQueue('OVERLAY', this._renderOverlay.bind(this));
  }

  /**
   * @param {Object} opts
   * @param {gfx.Texture2D} opts.defaultTexture
   * @param {gfx.TextureCube} opts.defaultTextureCube
   */
  setBuiltins(opts) {
    this._opts = opts;
    this._type2defaultValue[enums.PARAM_TEXTURE_2D] = opts.defaultTexture;
    this._type2defaultValue[enums.PARAM_TEXTURE_CUBE] = opts.defaultTextureCube;
    this._programLib = opts.programLib;
  }

  _resetTextureUnit() {
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

    _registerRenderQueue(name, fn) {
        this._renderQueueFn[name] = fn;
    }

  _registerStage(name, fn) {
    this._stage2fn[name] = fn;
  }

  _registerModel(name, fn) {
    this._modelType2fn[name] = fn;
  }

  _reset() {
    this._viewPools.reset();
    this._stageItemsPools.reset();
  }

  _requestView() {
    let view = this._viewPools.add();
    view._frustum.accurate = this._accurateFrustumCulling;
    return view;
  }

  set accurateFrustumCulling(accurate) {
    this._accurateFrustumCulling = accurate;
    if (!accurate) this.frustum_test_func = intersect.aabb_frustum;
    else this.frustum_test_func = intersect.aabb_frustum_accurate;
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

    if ((view._clearFlags & enums.CLEAR_SKYBOX) && view._clearModel != null) {
      let drawItem = this._drawItemsPools.add();
      view._clearModel.extractDrawItem(drawItem);
    }

    for (let i = 0; i < scene._models.length; ++i) {
      let model = scene._models.data[i];

      // TODO: HACK: filter model by view
      if (view._cullingByID) {
        if (model._viewID !== view._id) {
          continue;
        }
      } else {
        if (model._viewID !== -1) {
          continue;
        }
      }

      // frustum culling
      if (model._boundingShape !== null) { // if model does not have boundingBox, skip culling.
        if (!this.frustum_test_func(model._boundingShape, view._frustum)) {
          // console.log('model is not in view frustum.');
          continue;
        }
      }

      let drawItem = this._drawItemsPools.add();
      model.extractDrawItem(drawItem);
    }

    // dispatch draw items to different stage
    _stageInfos.reset();

    // for (let i = 0; i < view._stages.length; ++i) {
    //   let stage = view._stages[i];
      let renderQueues = Object.keys(RenderQueue);
      for (let qi = 0; qi < renderQueues.length; qi++) {
          this._stageItemsPools.add().reset();
      }

      for (let j = 0; j < this._drawItemsPools.length; ++j) {
          let drawItem = this._drawItemsPools.data[j];
          let techIndex = drawItem.effect.getDefaultTechnique();
          let tech = drawItem.effect.getTechnique(techIndex);

          if (tech) {
              for (let k = 0; k < tech.passes.length; k++) {
                  if (!this._isPassSuitable(view, tech._passes[k]._stage))
                      continue;

                  let stageItem = null;
                  for (let qi = renderQueues.length - 1; qi >= 0; qi--) {
                      if (tech.renderQueue >= RenderQueue[renderQueues[qi]]) {
                          stageItem = this._stageItemsPools.data[qi].add();
                          break;
                      }
                  }
                  stageItem.model = drawItem.model;
                  stageItem.node = drawItem.node;
                  stageItem.ia = drawItem.ia;
                  stageItem.effect = drawItem.effect;
                  stageItem.defines = drawItem.defines;
                  stageItem.dependencies = drawItem.dependencies;
                  stageItem.tech = tech;
                  stageItem.pass = tech._passes[k];
                  stageItem.passIndex = k;
                  stageItem.sortKey = -1;
              }
          }
      }

    //   let stageInfo = _stageInfos.add();
    //   stageInfo.stage = stage;
    //   stageInfo.items = stageItems;
    // }

    // render stages
    // for (let i = 0; i < _stageInfos.length; ++i) {
    //   let info = _stageInfos.data[i];
    //   let stageFn = this._stage2fn[info.stage];

    //   stageFn(view, info.items);
    // }

      for (let qi = 0; qi < renderQueues.length; qi++) {
          this._renderQueueFn[renderQueues[qi]](view, this._stageItemsPools.data[qi]);
      }
  }

  _drawModel(item) {
    let model = item.model;
    let drawFn = this._modelType2fn[model._type];

    if (!drawFn) {
      // console.warn(`Can not find draw function for modle type ${model.type}`);
      return;
    }

    drawFn(item);
  }

  _draw(item) {


    // for each pass
    // for (let i = 0; i < technique._passes.length; ++i) {
    //   let pass = technique._passes[i];
    this._stage2fn[item.pass._stage](item);
    // }
  }

    _isPassSuitable(view, stage) {
        return view._stages.includes(stage);
    }

    _renderOpaque(view, stageItems) {

        const programLib = this._programLib;
        view.getPosition(_camPos);

        // update uniforms
        this._device.setUniform('view', mat4.array(_a16_view, view._matView));
        this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
        this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
        this._device.setUniform('eye', vec3.array(_a3_camPos, _camPos));

        // update rendering
        // this._submitLightUniforms();
        // this._submitOtherStagesUniforms();
        // this._updateShaderDefines(stageItems);

        // calculate sorting key
        for (let i = 0; i < stageItems.length; ++i) {
            let item = stageItems.data[i];
            item.sortKey = programLib.getKey(
                item.pass._programName,
                item.defines
            );
        }

        // sort items
        stageItems.sort((a, b) => {

            if (a.technique._renderQueue !== b.technique._renderQueue) {
                return a.technique._renderQueue - b.technique._renderQueue;
            }

            return a.sortKey - b.sortKey;
        });
        for (let i = 0; i < stageItems.length; ++i) {
            let item = stageItems.data[i];

            for (let index = 0; index < this._shadowLights.length; ++index) {
                let light = this._shadowLights[index];
                this._device.setTexture(`shadowMap_${index}`, light.shadowMap, this._allocTextureUnit());
            }

            this._drawModel(item);
        }
    }

    _renderTransparent(view, stageItems) {

        view.getPosition(_camPos);
        view.getForward(_camFwd);

        // update uniforms
        this._device.setUniform('view', mat4.array(_a16_view, view._matView));
        this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
        this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
        this._device.setUniform('eye', vec3.array(_a3_camPos, _camPos));

        // calculate zdist
        for (let i = 0; i < stageItems.length; ++i) {
            let item = stageItems.data[i];

            // TODO: we should use mesh center instead!
            item.node.getWorldPosition(_v3_tmp1);

            vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);
            item.sortKey = vec3.dot(_v3_tmp1, _camFwd);
        }

        // update rendering
        // this._submitLightUniforms();
        // this._submitOtherStagesUniforms();
        // this._updateShaderDefines(stageItems);

        // sort items
        stageItems.sort((a, b) => {
            if (a.tech._renderQueue !== b.tech._renderQueue) {
                return a.tech._renderQueue - b.tech._renderQueue;
            }

            return a.sortKey - b.sortKey;
        });

        // draw it
        for (let i = 0; i < stageItems.length; ++i) {
            let item = stageItems.data[i];

            for (let index = 0; index < this._shadowLights.length; ++index) {
                let light = this._shadowLights[index];
                this._device.setTexture(`shadowMap_${index}`, light.shadowMap, this._allocTextureUnit());
            }

            this._drawModel(item);
        }

    }

    _renderOverlay(view, stageItems) {
        // update uniforms
        this._device.setUniform('view', mat4.array(_a16_view, view._matView));
        this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
        this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));

        // sort items
        stageItems.sort((a, b) => {
            if (a.technique._renderQueue !== b.technique._renderQueue) {
                return a.technique._renderQueue - b.technique._renderQueue;
            }
            return a.model._userKey - b.model._userKey;
        });

        // draw it
        for (let i = 0; i < stageItems.length; ++i) {
            let item = stageItems.data[i];
            this._drawModel(item);
        }
    }

    _drawPass(item) {
        const device = this._device;
        const programLib = this._programLib;
        const { node, ia, effect, pass, defines, dependencies } = item;

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

        // set uniforms
        for (let name in effect._properties) {
            let propInfo = effect._properties[name];
            let prop = propInfo.value;

            if (prop === undefined || prop === null) {
                prop = this._type2defaultValue[propInfo.type];
            }

            // set common uniforms
            if (name === 'model') { node.getWorldMatrix(_m4_tmp); prop = _m4_tmp; }
            else if (name === 'normalMatrix') { mat3.normalFromMat4(_m3_tmp, _m4_tmp); prop = _m3_tmp; }

            if (prop === undefined || prop === null) {
                console.warn(`Failed to set technique property ${name}, value not found.`);
                continue;
            }

            if (
                propInfo.type === enums.PARAM_TEXTURE_2D ||
                propInfo.type === enums.PARAM_TEXTURE_CUBE
            ) {
                if (defines['USE_' + name.toUpperCase()] == false) continue;
                if (propInfo.size !== undefined) {
                    if (propInfo.size !== prop.length) {
                        console.error(`The length of texture array (${prop.length}) is not corrent(expect ${propInfo.size}).`);
                        continue;
                    }
                    let slots = _int64_pool.add();
                    for (let index = 0; index < prop.length; ++index) {
                        slots[index] = this._allocTextureUnit();
                    }
                    device.setTextureArray(name, prop, slots);
                } else {
                    device.setTexture(name, prop, this._allocTextureUnit());
                }
            } else {
                let convertedValue;
                if (propInfo.size !== undefined) {
                    let convertArray = _type2uniformArrayValue[propInfo.type];
                    if (convertArray.func === undefined) {
                        console.error('Uniform array of color3/int3/float3/mat3 can not be supportted!');
                        continue;
                    }
                    if (propInfo.size * convertArray.size > 64) {
                        console.error('Uniform array is too long!');
                        continue;
                    }
                    convertedValue = convertArray.func(prop);
                } else {
                    let convertFn = _type2uniformValue[propInfo.type];
                    convertedValue = convertFn(prop);
                }
                device.setUniform(name, convertedValue);
            }
        }

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
        let program = programLib.getProgram(pass._programName, defines, dependencies);
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

        this._resetTextureUnit();
    }
}
