// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
import { mat4 } from '../../core/vmath';
import BaseRenderer from '../core/base-renderer';

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);

export default class ForwardRenderer extends BaseRenderer {
  constructor (device, builtin) {
    super(device, builtin);
    this._registerStage('transparent', this._transparentStage.bind(this));
  }

  reset () {
    this._reset();
  }

  render (scene) {
    this._reset();

    scene._cameras.sort((a, b) => {
      if (a._sortDepth > b._sortDepth) return 1;
      else if (a._sortDepth < b._sortDepth) return -1;
      else return 0;
    });

    for (let i = 0; i < scene._cameras.length; ++i) {
      let camera = scene._cameras.data[i];

      // reset camera pollID after sort cameras
      camera._poolID = i;
      
      this.renderCamera(camera, scene);
    }
  }

  renderCamera (camera, scene) {
    const canvas = this._device._gl.canvas;

    let view = camera.view;
    let dirty = camera.dirty;
    if (!view) {
      view = this._requestView();
      dirty = true;
    }
    if (dirty) {
      let width = canvas.width;
      let height = canvas.height;
      if (camera._framebuffer) {
        width = camera._framebuffer._width;
        height = camera._framebuffer._height;
      }
      camera.extractView(view, width, height);
    }
    this._render(view, scene);
  }

  _transparentStage (view, items) {
    // update uniforms
    this._device.setUniform('_view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('_proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('_viewProj', mat4.array(_a16_viewProj, view._matViewProj));

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      this._draw(item);
    }
  }
}