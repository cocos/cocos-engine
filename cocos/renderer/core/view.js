// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { vec3, color4, mat4 } from '../../vmath';
import enums from '../enums';
import { plane } from '../../geom-utils';

let _m4_tmp = mat4.create();
let _v3 = vec3.create(0, 0, 0);
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

    this._frustum = {};
    this._frustum.fullUpdate = false;
    this._frustum.planes = new Array(6); // 0: left, 1: right, 2: bottom, 3: top, 4: near, 5: far
    for (let i = 0; i < 6; ++i) {
      this._frustum.planes[i] = plane.create();
    }
    this._frustum.vertices = new Array(8);
    for (let i = 0; i < 8; ++i) {
      this._frustum.vertices[i] = vec3.create(0, 0, 0);
    }
  }

  /**
   * Set whether to update extra information in this view,
   * including only frustum vertex positions for now
   * @param {boolean} b need update or not
   */
  set fullUpdate(b) {
    this._frustum.fullUpdate = b;
  }

  /**
   * Get the view's forward direction
   * @param {vec3} out the receiving vector
   * @returns {vec3} the receiving vector
   */
  getForward(out) {
    return vec3.set(
      out,
      -this._matView.m02,
      -this._matView.m06,
      -this._matView.m10
    );
  }

  /**
   * Get the view's observing location
   * @param {vec3} out the receiving vector
   * @returns {vec3} the receiving vector
   */
  getPosition(out) {
    mat4.invert(_m4_tmp, this._matView);
    return mat4.getTranslation(out, _m4_tmp);
  }

  /**
   * Update the view's frustum information according to the stored transform matrix.
   * Note that the resulting planes are not normalized.
   */
  updateFrustum() {
    // RTR3, ch. 16.14.1, p. 774
    // extract frustum planes from view-proj matrix.
    let m = this._matViewProj;

    // left plane
    vec3.set(this._frustum.planes[0].n, m.m03 + m.m00, m.m07 + m.m04, m.m11 + m.m08);
    this._frustum.planes[0].d = -(m.m15 + m.m12);
    // right plane
    vec3.set(this._frustum.planes[1].n, m.m03 - m.m00, m.m07 - m.m04, m.m11 - m.m08);
    this._frustum.planes[1].d = -(m.m15 - m.m12);
    // bottom plane
    vec3.set(this._frustum.planes[2].n, m.m03 + m.m01, m.m07 + m.m05, m.m11 + m.m09);
    this._frustum.planes[2].d = -(m.m15 + m.m13);
    // top plane
    vec3.set(this._frustum.planes[3].n, m.m03 - m.m01, m.m07 - m.m05, m.m11 - m.m09);
    this._frustum.planes[3].d = -(m.m15 - m.m13);
    // near plane
    vec3.set(this._frustum.planes[4].n, m.m03 + m.m02, m.m07 + m.m06, m.m11 + m.m10);
    this._frustum.planes[4].d = -(m.m15 + m.m14);
    // far plane
    vec3.set(this._frustum.planes[5].n, m.m03 - m.m02, m.m07 - m.m06, m.m11 - m.m10);
    this._frustum.planes[5].d = -(m.m15 - m.m14);

    // the actual distance of the plane can be retrieved by:
    // plane.d / vec3.magnitude(plane.n)

    if (!this._frustum.fullUpdate) return;
    // update frustum vertices
    vec3.set(_v3, 1,  1,  1); vec3.transformMat4(this._frustum.vertices[0], _v3, this._matInvViewProj);
    vec3.set(_v3, -1,  1,  1); vec3.transformMat4(this._frustum.vertices[1], _v3, this._matInvViewProj);
    vec3.set(_v3, -1, -1,  1); vec3.transformMat4(this._frustum.vertices[2], _v3, this._matInvViewProj);
    vec3.set(_v3, 1, -1,  1); vec3.transformMat4(this._frustum.vertices[3], _v3, this._matInvViewProj);
    vec3.set(_v3, 1,  1, -1); vec3.transformMat4(this._frustum.vertices[4], _v3, this._matInvViewProj);
    vec3.set(_v3, -1,  1, -1); vec3.transformMat4(this._frustum.vertices[5], _v3, this._matInvViewProj);
    vec3.set(_v3, -1, -1, -1); vec3.transformMat4(this._frustum.vertices[6], _v3, this._matInvViewProj);
    vec3.set(_v3, 1, -1, -1); vec3.transformMat4(this._frustum.vertices[7], _v3, this._matInvViewProj);
  }
}