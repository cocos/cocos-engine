// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  

import { vec3, mat4 } from '../../core/vmath';
import BaseRenderer from '../core/base-renderer';
import enums from '../enums';

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);
let _a3_camPos = new Float32Array(3);
let _a16_lightViewProj = new Float32Array(16);

let _camPos = vec3.create(0, 0, 0);
let _camFwd = vec3.create(0, 0, 0);
let _v3_tmp1 = vec3.create(0, 0, 0);

export default class ForwardRenderer extends BaseRenderer {
  constructor(device, builtin) {
    super(device, builtin);

    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._shadowLights = [];

    this._numLights = 0;

    this._sceneAmbient = new Float32Array([0.5, 0.5, 0.5]);

    this._registerStage('shadowcast', this._shadowStage.bind(this));
    this._registerStage('opaque', this._opaqueStage.bind(this));
    this._registerStage('transparent', this._transparentStage.bind(this));
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
      if (camera._framebuffer) {
        width = camera._framebuffer._width;
        height = camera._framebuffer._height;
      }
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
    device.setUniform('_sceneAmbient', this._sceneAmbient);

    if (this._directionalLights.length > 0) {
      for (let index = 0; index < this._directionalLights.length; ++index) {
        let light = this._directionalLights[index];
        device.setUniform(`_dir_light${index}_direction`, light._directionUniform);
        device.setUniform(`_dir_light${index}_color`, light._colorUniform);
      }
    }

    if (this._pointLights.length > 0) {
      for (let index = 0; index < this._pointLights.length; ++index) {
        let light = this._pointLights[index];
        device.setUniform(`_point_light${index}_position`, light._positionUniform);
        device.setUniform(`_point_light${index}_color`, light._colorUniform);
        device.setUniform(`_point_light${index}_range`, light._range);
      }
    }

    if (this._spotLights.length > 0) {
      for (let index = 0; index < this._spotLights.length; ++index) {
        let light = this._spotLights[index];
        device.setUniform(`_spot_light${index}_position`, light._positionUniform);
        device.setUniform(`_spot_light${index}_direction`, light._directionUniform);
        device.setUniform(`_spot_light${index}_color`, light._colorUniform);
        device.setUniform(`_spot_light${index}_range`, light._range);
        device.setUniform(`_spot_light${index}_spot`, light._spotUniform);
      }
    }
  }

  _submitShadowStageUniforms(view) {
    let light = view._shadowLight;
    this._device.setUniform('_minDepth', light.shadowMinDepth);
    this._device.setUniform('_maxDepth', light.shadowMaxDepth);
    this._device.setUniform('_bias', light.shadowBias);
    this._device.setUniform('_depthScale', light.shadowDepthScale);
  }

  _submitOtherStagesUniforms() {
    for (let index = 0; index < this._shadowLights.length; ++index) {
      let light = this._shadowLights[index];
      this._device.setUniform(`_lightViewProjMatrix_${index}`, mat4.array(_a16_lightViewProj, light.viewProjMatrix));
      this._device.setUniform(`_minDepth_${index}`, light.shadowMinDepth);
      this._device.setUniform(`_maxDepth_${index}`, light.shadowMaxDepth);
      this._device.setUniform(`_bias_${index}`, light.shadowBias);
      this._device.setUniform(`_depthScale_${index}`, light.shadowDepthScale);
      this._device.setUniform(`_darkness_${index}`, light.shadowDarkness);
      this._device.setUniform(`_frustumEdgeFalloff_${index}`, light.frustumEdgeFalloff);
      this._device.setUniform(`_texelSize_${index}`, new Float32Array([1.0 / light.shadowResolution, 1.0 / light.shadowResolution]));
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
    const programLib = this._programLib;
    this._device.setUniform('_lightViewProjMatrix', mat4.array(_a16_viewProj, view._matViewProj));

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
    this._device.setUniform('_view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('_proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('_viewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('_eye', vec3.array(_a3_camPos, _camPos));

    // update rendering
    this._submitLightsUniforms();
    this._submitOtherStagesUniforms();

    this._drawItems(view, items);
  }

  _transparentStage (view, items) {
    view.getPosition(_camPos);
    view.getForward(_camFwd);

    // update uniforms
    this._device.setUniform('_view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('_proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('_viewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('_eye', vec3.array(_a3_camPos, _camPos));

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