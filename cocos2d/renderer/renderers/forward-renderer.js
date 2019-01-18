// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  

import { vec3, mat4 } from '../../core/vmath';
import BaseRenderer from '../core/base-renderer';
import enums from '../enums';
import { RecyclePool } from '../memop';

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);
let _a3_camPos = new Float32Array(3);
let _a16_lightViewProj = new Float32Array(16);

let _camPos = vec3.create(0, 0, 0);
let _camFwd = vec3.create(0, 0, 0);
let _v3_tmp1 = vec3.create(0, 0, 0);

let _float16_pool = new RecyclePool(() => {
  return new Float32Array(16);
}, 8);

export default class ForwardRenderer extends BaseRenderer {
  constructor(device, builtin) {
    super(device, builtin);

    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._shadowLights = [];
    this._sceneAmbient = new Float32Array([0, 0, 0]);

    this._numLights = 0;

    this._registerStage('shadowcast', this._shadowStage.bind(this));
    this._registerStage('opaque', this._opaqueStage.bind(this));
    this._registerStage('transparent', this._transparentStage.bind(this));
  }

  get sceneAmbient () {
    let ambient = this._sceneAmbient;
    return cc.color(ambient.r * 255, ambient.g * 255, ambient.b * 255, 255);
  }
  set sceneAmbient (val) {
    this._sceneAmbient[0] = val.r /255;
    this._sceneAmbient[1] = val.g /255;
    this._sceneAmbient[2] = val.b /255;
  }

  reset () {
    this._reset();
  }

  render (scene) {
    this._reset();

    this._updateLights(scene);

    const canvas = this._device._gl.canvas;
    for (let i = 0; i < scene._cameras.length; ++i) {
      let view = this._requestView();
      let width = canvas.width;
      let height = canvas.height;
      let camera = scene._cameras.data[i];
      camera.extractView(view, width, height);
    }

    // render by cameras
    this._viewPools.sort((a, b) => {
      return (a._priority - b._priority);
    });

    for (let i = 0; i < this._viewPools.length; ++i) {
      let view = this._viewPools.data[i];
      this._render(view, scene);
    }
  }

  _updateLights (scene) {
    this._directionalLights.length = 0;
    this._pointLights.length = 0;
    this._spotLights.length = 0;
    this._shadowLights.length = 0;

    let lights = scene._lights;
    for (let i = 0; i < lights.length; ++i) {
      let light = lights.data[i];
      light.update(this._device);
      if (light.shadowType !== enums.SHADOW_NONE) {
        this._shadowLights.push(light);
        let view = this._requestView();
        light.extractView(view, ['shadowcast']);
      }
      if (light._type === enums.LIGHT_DIRECTIONAL) {
        this._directionalLights.push(light);
      } else if (light._type === enums.LIGHT_POINT) {
        this._pointLights.push(light);
      } else {
        this._spotLights.push(light);
      }
    }

    this._numLights = lights._count;
  }

  _submitLightsUniforms () {
    let device = this._device;
    device.setUniform('cc_sceneAmbient', this._sceneAmbient);

    _float16_pool.reset();

    if (this._directionalLights.length > 0) {
      let directions = _float16_pool.add();
      let colors = _float16_pool.add();

      for (let i = 0; i < this._directionalLights.length; ++i) {
        let light = this._directionalLights[i];
        let index = i * 4;
        directions.set(light._directionUniform, index);
        colors.set(light._colorUniform, index);
      }

      device.setUniform('cc_dirLightDirection', directions);
      device.setUniform('cc_dirLightColor', colors);
    }

    if (this._pointLights.length > 0) {
      let positionAndRanges = _float16_pool.add();
      let colors = _float16_pool.add();
      for (let i = 0; i < this._pointLights.length; ++i) {
        let light = this._pointLights[i];
        let index = i * 4;
        positionAndRanges.set(light._positionUniform, index);
        positionAndRanges[index+3] = light._range;
        colors.set(light._colorUniform, index);
      }

      device.setUniform('cc_pointLightPositionAndRange', positionAndRanges);
      device.setUniform('cc_pointLightColor', colors);
    }

    if (this._spotLights.length > 0) {
      let positionAndRanges = _float16_pool.add();
      let directions = _float16_pool.add();
      let colors = _float16_pool.add();
      for (let i = 0; i < this._spotLights.length; ++i) {
        let light = this._spotLights[i];
        let index = i * 4;
        
        positionAndRanges.set(light._positionUniform, index);
        positionAndRanges[index+3] = light._range;

        directions.set(light._directionUniform, index);
        directions[index+3] = light._spotUniform[0];

        colors.set(light._colorUniform, index);
        colors[index+3] = light._spotUniform[1];
      }

      device.setUniform('cc_spotLightPositionAndRange', positionAndRanges);
      device.setUniform('cc_spotLightDirection', directions);
      device.setUniform('cc_spotLightColor', colors);
    }
  }

  _submitShadowStageUniforms(view) {
    let light = view._shadowLight;
    this._device.setUniform('cc_minDepth', light.shadowMinDepth);
    this._device.setUniform('cc_maxDepth', light.shadowMaxDepth);
    this._device.setUniform('cc_bias', light.shadowBias);
    this._device.setUniform('cc_depthScale', light.shadowDepthScale);
  }

  _submitOtherStagesUniforms() {
    for (let index = 0; index < this._shadowLights.length; ++index) {
      let light = this._shadowLights[index];
      this._device.setUniform(`cc_lightViewProjMatrix_${index}`, mat4.array(_a16_lightViewProj, light.viewProjMatrix));
      this._device.setUniform(`cc_minDepth_${index}`, light.shadowMinDepth);
      this._device.setUniform(`cc_maxDepth_${index}`, light.shadowMaxDepth);
      this._device.setUniform(`cc_bias_${index}`, light.shadowBias);
      this._device.setUniform(`cc_depthScale_${index}`, light.shadowDepthScale);
      this._device.setUniform(`cc_darkness_${index}`, light.shadowDarkness);
      this._device.setUniform(`cc_frustumEdgeFalloff_${index}`, light.frustumEdgeFalloff);
    }
  }

  _updateShaderDefines (item) {
    let defines = item.defines;

    defines._NUM_DIR_LIGHTS = Math.min(4, this._directionalLights.length);
    defines._NUM_POINT_LIGHTS = Math.min(4, this._pointLights.length);
    defines._NUM_SPOT_LIGHTS = Math.min(4, this._spotLights.length);

    defines._NUM_SHADOW_LIGHTS = Math.min(4, this._shadowLights.length);
  }

  _sortItems (items) {
    // sort items
    items.sort((a, b) => {
      let techA = a.technique;
      let techB = b.technique;

      if (techA._layer !== techB._layer) {
        return techA._layer - techB._layer;
      }

      if (techA._passes.length !== techB._passes.length) {
        return techA._passes.length - techB._passes.length;
      }

      return a.sortKey - b.sortKey;
    });
  }

  _shadowStage (view, items) {
    this._device.setUniform('cc_lightViewProjMatrix', mat4.array(_a16_viewProj, view._matViewProj));

    // update rendering
    this._submitShadowStageUniforms(view);

    // this._sortItems(items);

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      if (item.defines._SHADOW_CASTING) {
        this._updateShaderDefines(item);
        this._draw(item);
      }
    }
  }

  _drawItems (view, items) {
    let shadowLights = this._shadowLights;
    if (shadowLights.length === 0 && this._numLights === 0) {
      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
        this._draw(item);
      }
    }
    else {
      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
  
        for (let index = 0; index < shadowLights.length; ++index) {
          let light = shadowLights[index];
          this._device.setTexture(`_shadowMap_${index}`, light.shadowMap, this._allocTextureUnit());
        }
  
        this._updateShaderDefines(item);
        this._draw(item);
      }
    }
  }

  _opaqueStage (view, items) {
    view.getPosition(_camPos);

    // update uniforms
    this._device.setUniform('cc_matView', mat4.array(_a16_view, view._matView));
    this._device.setUniform('cc_matpProj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('cc_matViewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('cc_cameraPos', vec3.array(_a3_camPos, _camPos));

    // update rendering
    this._submitLightsUniforms();
    this._submitOtherStagesUniforms();

    this._drawItems(view, items);
  }

  _transparentStage (view, items) {
    view.getPosition(_camPos);
    view.getForward(_camFwd);

    // update uniforms
    this._device.setUniform('cc_matView', mat4.array(_a16_view, view._matView));
    this._device.setUniform('cc_matpProj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('cc_matViewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('cc_cameraPos', vec3.array(_a3_camPos, _camPos));

    this._submitLightsUniforms();
    this._submitOtherStagesUniforms();

    // calculate zdist
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];

      // TODO: we should use mesh center instead!
      item.node.getWorldPosition(_v3_tmp1);

      vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);
      item.sortKey = -vec3.dot(_v3_tmp1, _camFwd);
    }

    this._sortItems(items);
    this._drawItems(view, items);
  }
}