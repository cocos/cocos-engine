// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  

import { vec3, vec4, mat4 } from '../../core/vmath';
import BaseRenderer from '../core/base-renderer';
import enums from '../enums';
import { RecyclePool } from '../memop';

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);
let _a4_camPos = new Float32Array(4);

let _a64_shadow_lightViewProj = new Float32Array(64);
let _a16_shadow_lightViewProjs = [];
let _a4_shadow_info = new Float32Array(4);

let _camPos = cc.v4(0, 0, 0, 0);
let _camFwd = cc.v3(0, 0, 0);
let _v3_tmp1 = cc.v3(0, 0, 0);

let _float16_pool = new RecyclePool(() => {
  return new Float32Array(16);
}, 8);

export default class ForwardRenderer extends BaseRenderer {
  constructor(device, builtin) {
    super(device, builtin);

    this._time = new Float32Array(4);

    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._shadowLights = [];
    this._ambientLights = [];

    this._shadowMaps = [];
    this._shadowMapSlots = new Int32Array(4);

    this._numLights = 0;

    this._defines = {};

    this._registerStage('shadowcast', this._shadowStage.bind(this));
    this._registerStage('opaque', this._opaqueStage.bind(this));
    this._registerStage('transparent', this._transparentStage.bind(this));
  }

  reset () {
    _float16_pool.reset();
    super.reset();
  }

  render (scene, dt) {
    this.reset();

    if (!CC_EDITOR) {
      this._time[0] += dt;
      this._device.setUniform('cc_time', this._time);
    }

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

  // direct render a single camera
  renderCamera (camera, scene) {
    this.reset();
    
    const canvas = this._device._gl.canvas;
    let width = canvas.width;
    let height = canvas.height;

    let view = this._requestView();
    camera.extractView(view, width, height);
    
    this._render(view, scene);
  }

  _updateLights (scene) {
    this._directionalLights.length = 0;
    this._pointLights.length = 0;
    this._spotLights.length = 0;
    this._shadowLights.length = 0;
    this._ambientLights.length = 0;

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
      }
      else if (light._type === enums.LIGHT_POINT) {
        this._pointLights.push(light);
      }
      else if (light._type === enums.LIGHT_SPOT) {
        this._spotLights.push(light);
      }
      else {
        this._ambientLights.push(light);
      }
    }

    this._updateDefines();

    this._numLights = lights._count;
  }

  _updateDefines () {
    let defines = this._defines;
    defines.CC_NUM_DIR_LIGHTS = Math.min(4, this._directionalLights.length);
    defines.CC_NUM_POINT_LIGHTS = Math.min(4, this._pointLights.length);
    defines.CC_NUM_SPOT_LIGHTS = Math.min(4, this._spotLights.length);
    defines.CC_NUM_AMBIENT_LIGHTS = Math.min(4, this._ambientLights.length);

    defines.CC_NUM_SHADOW_LIGHTS = Math.min(4, this._shadowLights.length);
  }

  _submitLightsUniforms () {
    let device = this._device;

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

    if (this._ambientLights.length > 0) {
      let colors = _float16_pool.add();

      for (let i = 0; i < this._ambientLights.length; ++i) {
        let light = this._ambientLights[i];
        let index = i * 4;
        colors.set(light._colorUniform, index);
      }

      device.setUniform('cc_ambientColor', colors);
    }
  }

  _submitShadowStageUniforms(view) {

    let light = view._shadowLight;

    let shadowInfo = _a4_shadow_info;
    shadowInfo[0] = light.shadowMinDepth;
    shadowInfo[1] = light.shadowMaxDepth;
    shadowInfo[2] = light.shadowDepthScale;
    shadowInfo[3] = light.shadowDarkness;

    this._device.setUniform('cc_shadow_map_lightViewProjMatrix', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('cc_shadow_map_info', shadowInfo);
    this._device.setUniform('cc_shadow_map_bias', light.shadowBias);
  }

  _submitOtherStagesUniforms() {
    let shadowInfo = _float16_pool.add();
    
    for (let i = 0; i < this._shadowLights.length; ++i) {
      let light = this._shadowLights[i];
      let view = _a16_shadow_lightViewProjs[i];
      if (!view) {
        view = _a16_shadow_lightViewProjs[i] = new Float32Array(_a64_shadow_lightViewProj.buffer, i * 16, 16);
      }
      mat4.array(view, light.viewProjMatrix);
      
      let infoIndex = i*4;
      shadowInfo[infoIndex] = light.shadowMinDepth;
      shadowInfo[infoIndex+1] = light.shadowMaxDepth;
      shadowInfo[infoIndex+2] = light.shadowDepthScale;
      shadowInfo[infoIndex+3] = light.shadowDarkness;
    }

    this._device.setUniform(`cc_shadow_lightViewProjMatrix`, _a64_shadow_lightViewProj);
    this._device.setUniform(`cc_shadow_info`, shadowInfo);
    // this._device.setUniform(`cc_frustumEdgeFalloff_${index}`, light.frustumEdgeFalloff);
  }

  _updateShaderDefines (item) {
    item.defines.push(this._defines);
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
    // update rendering
    this._submitShadowStageUniforms(view);

    // this._sortItems(items);

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      if (this._programLib._getValueFromDefineList('CC_SHADOW_CASTING', item.defines)) {
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
        this._updateShaderDefines(item);
        this._draw(item);
      }
    }
    else {
      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
  
        this._shadowMaps.length = shadowLights.length;
        for (let index = 0; index < shadowLights.length; ++index) {
          let light = shadowLights[index];
          this._shadowMaps[index] = light.shadowMap;
          this._shadowMapSlots[index] = this._allocTextureUnit();
        }
        this._device.setTextureArray('cc_shadow_map', this._shadowMaps, this._shadowMapSlots);
  
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
    this._device.setUniform('cc_cameraPos', vec4.array(_a4_camPos, _camPos));

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
    this._device.setUniform('cc_cameraPos', vec4.array(_a4_camPos, _camPos));

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
