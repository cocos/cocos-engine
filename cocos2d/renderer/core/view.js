// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { vec3, color4, mat4 } from '../../core/vmath';
import enums from '../enums';

let _m4_tmp = mat4.create();
let _genID = 0;

/**
 * A representation of a single camera view
 */
export default class View {
  /**
   * Setup a default view
   */
  constructor() {
    this._id = _genID++;

    // priority. the smaller one will be rendered first
    this._priority = 0;

    // viewport
    this._rect = {
      x: 0, y: 0, w: 1, h: 1
    };

    // TODO:
    // this._scissor = {
    //   x: 0, y: 0, w: 1, h: 1
    // };

    // clear options
    this._color = color4.create(0.3, 0.3, 0.3, 1);
    this._depth = 1;
    this._stencil = 0;
    this._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
    this._clearModel = null;

    // matrix
    this._matView = mat4.create();
    this._matProj = mat4.create();
    this._matViewProj = mat4.create();
    this._matInvViewProj = mat4.create();

    // stages & framebuffer
    this._stages = [];
    this._cullingByID = false;
    this._framebuffer = null;

    this._shadowLight = null; // TODO: should not refer light in view.

    this._cullingMask = 0xffffffff;
  }

  /**
   * Get the view's forward direction
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} the receiving vector
   */
  getForward(out) {
    let m = this._matView.m;
    return vec3.set(
      out,
      -m[2],
      -m[6],
      -m[10]
    );
  }

  /**
   * Get the view's observing location
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} the receiving vector
   */
  getPosition(out) {
    mat4.invert(_m4_tmp, this._matView);
    return mat4.getTranslation(out, _m4_tmp);
  }
}
