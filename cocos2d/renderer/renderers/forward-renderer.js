// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
import { mat4 } from '../../core/vmath';
import BaseRenderer from '../core/base-renderer';
import enums from '../enums';

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);

export default class ForwardRenderer extends BaseRenderer {
  constructor (device, builtin) {
    super(device, builtin);

    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._shadowLights = [];
    this._sceneAmbient = new Float32Array([0.5, 0.5, 0.5]);

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

  _updateLights(scene) {
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
        light.extractView(view, PassStage.SHADOWCAST);
      }
      if (light._type === enums.LIGHT_DIRECTIONAL) {
        this._directionalLights.push(light);
      } else if (light._type === enums.LIGHT_POINT) {
        this._pointLights.push(light);
      } else {
        this._spotLights.push(light);
      }
    }
  }

  _submitLightsUniforms() {
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

  _updateLightDefines(item) {
    let defines = item.defines;

    defines._NUM_DIR_LIGHTS = Math.min(4, this._directionalLights.length);
    defines._NUM_POINT_LIGHTS = Math.min(4, this._pointLights.length);
    defines._NUM_SPOT_LIGHTS = Math.min(4, this._spotLights.length);

    defines._NUM_SHADOW_LIGHTS = Math.min(4, this._shadowLights.length);
  }

  _transparentStage (view, items) {
    // update uniforms
    this._device.setUniform('_view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('_proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('_viewProj', mat4.array(_a16_viewProj, view._matViewProj));

    this._submitLightsUniforms();

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      this._updateLightDefines(item);
      this._draw(item);
    }
  }
}