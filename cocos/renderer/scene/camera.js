// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { color4, vec3, mat4 } from '../../vmath';
import { ray } from '../../geom-utils';
import enums from '../enums';

let _matView = mat4.create();
let _matProj = mat4.create();
let _matViewProj = mat4.create();
let _matInvViewProj = mat4.create();
let _tmp_v3 = vec3.create(0, 0, 0);
let _tmp2_v3 = vec3.create(0, 0, 0);
let _tmp3_v3 = vec3.create(0, 0, 0);

/**
 * A representation of a camera instance
 */
export default class Camera {
  /**
   * Setup a default perspective camera
   */
  constructor() {
    this._poolID = -1;
    this._node = null;

    //
    this._projection = enums.PROJ_PERSPECTIVE;

    // priority. the smaller one will be rendered first
    this._priority = 0;

    // clear options
    this._color = color4.create(0.2, 0.3, 0.47, 1);
    this._depth = 1;
    this._stencil = 0;
    this._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
    this._clearModel = null;

    // stages & framebuffer
    this._stages = [];
    this._framebuffer = null;

    // projection properties
    this._near = 0.01;
    this._far = 1000.0;
    this._fov = Math.PI/4.0; // vertical fov
    this._rect = {
      x: 0, y: 0, w: 1, h: 1
    };

    // ortho properties
    this._orthoHeight = 10;
  }

  /**
   * Get the hosting node of this camera
   * @returns {Node} the hosting node
   */
  getNode() {
    return this._node;
  }

  /**
   * Set the hosting node of this camera
   * @param {Node} node the hosting node
   */
  setNode(node) {
    this._node = node;
  }

  /**
   * Get the projection type of the camera
   * @returns {number} camera projection type
   */
  getType() {
    return this._projection;
  }

  /**
   * Set the projection type of the camera
   * @param {number} type camera projection type
   */
  setType(type) {
    this._projection = type;
  }

  /**
   * Get the priority of the camera
   * @returns {number} camera priority
   */
  getPriority() {
    return this._priority;
  }

  /**
   * Set the priority of the camera
   * @param {number} priority camera priority
   */
  setPriority(priority) {
    this._priority = priority;
  }

  /**
   * Get the orthogonal height of the camera
   * @returns {number} camera height
   */
  getOrthoHeight() {
    return this._orthoHeight;
  }

  /**
   * Set the orthogonal height of the camera
   * @param {number} val camera height
   */
  setOrthoHeight(val) {
    this._orthoHeight = val;
  }

  /**
   * Get the field of view of the camera
   * @returns {number} camera field of view
   */
  getFov() {
    return this._fov;
  }

  /**
   * Set the field of view of the camera
   * @param {number} fov camera field of view
   */
  setFov(fov) {
    this._fov = fov;
  }

  /**
   * Get the near clipping distance of the camera
   * @returns {number} camera near clipping distance
   */
  getNear() {
    return this._near;
  }

  /**
   * Set the near clipping distance of the camera
   * @param {number} near camera near clipping distance
   */
  setNear(near) {
    this._near = near;
  }

  /**
   * Get the far clipping distance of the camera
   * @returns {number} camera far clipping distance
   */
  getFar() {
    return this._far;
  }

  /**
   * Set the far clipping distance of the camera
   * @param {number} far camera far clipping distance
   */
  setFar(far) {
    this._far = far;
  }

  /**
   * Get the clear color of the camera
   * @returns {color4} out the receiving color vector
   */
  getColor(out) {
    return color4.copy(out, this._color);
  }

  /**
   * Set the clear color of the camera
   * @param {number} r red channel of camera clear color
   * @param {number} g green channel of camera clear color
   * @param {number} b blue channel of camera clear color
   * @param {number} a alpha channel of camera clear color
   */
  setColor(r, g, b, a) {
    color4.set(this._color, r, g, b, a);
  }

  /**
   * Get the clear depth of the camera
   * @returns {number} camera clear depth
   */
  getDepth() {
    return this._depth;
  }

  /**
   * Set the clear depth of the camera
   * @param {number} depth camera clear depth
   */
  setDepth(depth) {
    this._depth = depth;
  }

  /**
   * Get the clearing stencil value of the camera
   * @returns {number} camera clearing stencil value
   */
  getStencil() {
    return this._stencil;
  }

  /**
   * Set the clearing stencil value of the camera
   * @param {number} stencil camera clearing stencil value
   */
  setStencil(stencil) {
    this._stencil = stencil;
  }

  /**
   * Get the clearing flags of the camera
   * @returns {number} camera clearing flags
   */
  getClearFlags() {
    return this._clearFlags;
  }

  /**
   * Set the clearing flags of the camera
   * @param {number} flags camera clearing flags
   */
  setClearFlags(flags) {
    this._clearFlags = flags;
  }

  /**
   * Get the rect of the camera
   * @param {Object} out the receiving object
   * @returns {Object} camera rect
   */
  getRect(out) {
    out.x = this._rect.x;
    out.y = this._rect.y;
    out.w = this._rect.w;
    out.h = this._rect.h;

    return out;
  }

  /**
   * Set the rect of the camera
   * @param {Number} x - [0,1]
   * @param {Number} y - [0,1]
   * @param {Number} w - [0,1]
   * @param {Number} h - [0,1]
   */
  setRect(x, y, w, h) {
    this._rect.x = x;
    this._rect.y = y;
    this._rect.w = w;
    this._rect.h = h;
  }

  /**
   * Get the stages of the camera
   * @returns {string[]} camera stages
   */
  getStages() {
    return this._stages;
  }

  /**
   * Set the stages of the camera
   * @param {string[]} stages camera stages
   */
  setStages(stages) {
    this._stages = stages;
  }

  /**
   * Get the framebuffer of the camera
   * @returns {FrameBuffer} camera framebuffer
   */
  getFramebuffer() {
    return this._framebuffer;
  }

  /**
   * Set the framebuffer of the camera
   * @param {FrameBuffer} framebuffer camera framebuffer
   */
  setFramebuffer(framebuffer) {
    this._framebuffer = framebuffer;
  }

  /**
   * extract a view of this camera
   * @param {View} out the receiving view
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   */
  extractView(out, width, height) {
    // priority
    out._priority = this._priority;

    // rect
    out._rect.x = this._rect.x * width;
    out._rect.y = this._rect.y * height;
    out._rect.w = this._rect.w * width;
    out._rect.h = this._rect.h * height;

    // clear opts
    out._color = this._color;
    out._depth = this._depth;
    out._stencil = this._stencil;
    out._clearFlags = this._clearFlags;
    out._clearModel = this._clearModel;

    // stages & framebuffer
    out._stages = this._stages;
    out._framebuffer = this._framebuffer;

    // view matrix
    this._node.getWorldRT(out._matView);
    mat4.invert(out._matView, out._matView);

    // projection matrix
    // TODO: if this._projDirty
    let aspect = width / height;
    if (this._projection === enums.PROJ_PERSPECTIVE) {
      mat4.perspective(out._matProj,
        this._fov,
        aspect,
        this._near,
        this._far
      );
    } else {
      let x = this._orthoHeight * aspect;
      let y = this._orthoHeight;
      mat4.ortho(out._matProj,
        -x, x, -y, y, this._near, this._far
      );
    }

    // view-projection
    mat4.mul(out._matViewProj, out._matProj, out._matView);
    mat4.invert(out._matInvViewProj, out._matViewProj);

    // update view's frustum
    out._frustum.update(out._matViewProj, out._matInvViewProj);
  }

  /**
   * transform a screen position to world space
   * @param {vec3} out the resulting vector
   * @param {vec3} screenPos the screen position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {vec3} the resulting vector
   */
  screenToWorld(out, screenPos, width, height) {
    let aspect = width / height;
    let cx = this._rect.x * width;
    let cy = this._rect.y * height;
    let cw = this._rect.w * width;
    let ch = this._rect.h * height;

    // view matrix
    this._node.getWorldRT(_matView);
    mat4.invert(_matView, _matView);

    // projection matrix
    if (this._projection === enums.PROJ_PERSPECTIVE) {
      mat4.perspective(_matProj,
        this._fov,
        aspect,
        this._near,
        this._far
      );
    } else {
      let x = this._orthoHeight * aspect;
      let y = this._orthoHeight;
      mat4.ortho(_matProj,
        -x, x, -y, y, this._near, this._far
      );
    }

    // view-projection
    mat4.mul(_matViewProj, _matProj, _matView);

    // inv view-projection
    mat4.invert(_matInvViewProj, _matViewProj);

    //
    if (this._projection === enums.PROJ_PERSPECTIVE) {
      // calculate screen pos in far clip plane
      vec3.set(out,
        (screenPos.x - cx) * 2.0 / cw - 1.0,
        (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
        1.0
      );

      // transform to world
      vec3.transformMat4(out, out, _matInvViewProj);

      //
      this._node.getWorldPos(_tmp_v3);
      vec3.lerp(out, _tmp_v3, out, screenPos.z / this._far);
    } else {
      let range = this._farClip - this._nearClip;
      vec3.set(out,
        (screenPos.x - cx) * 2.0 / cw - 1.0,
        (screenPos.y - cy) * 2.0 / ch - 1.0, // DISABLE: (ch - (screenPos.y - cy)) * 2.0 / ch - 1.0,
        (this._far - screenPos.z) / range * 2.0 - 1.0
      );

      // transform to world
      vec3.transformMat4(out, out, _matInvViewProj);
    }

    return out;
  }

  /**
   * transform a screen position to a world space ray
   * @param {vec3} screenPos the screen position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Ray} the resulting ray
   */
  screenPointToRay(screenPos, width, height) {
    this._node.getWorldPos(_tmp3_v3);
    this.screenToWorld(_tmp2_v3, screenPos, width, height);
    vec3.normalize(_tmp2_v3, vec3.sub(_tmp2_v3, _tmp2_v3, _tmp3_v3));
    return ray.create(_tmp3_v3.x, _tmp3_v3.y, _tmp3_v3.z, _tmp2_v3.x, _tmp2_v3.y, _tmp2_v3.z);
  }

  /**
   * transform a world space position to screen space
   * @param {vec3} out the resulting vector
   * @param {vec3} worldPos the world space position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {vec3} the resulting vector
   */
  worldToScreen(out, worldPos, width, height) {
    let aspect = width / height;
    let cx = this._rect.x * width;
    let cy = this._rect.y * height;
    let cw = this._rect.w * width;
    let ch = this._rect.h * height;

    // view matrix
    this._node.getWorldRT(_matView);
    mat4.invert(_matView, _matView);

    // projection matrix
    if (this._projection === enums.PROJ_PERSPECTIVE) {
      mat4.perspective(_matProj,
        this._fov,
        aspect,
        this._near,
        this._far
      );
    } else {
      let x = this._orthoHeight * aspect;
      let y = this._orthoHeight;
      mat4.ortho(_matProj,
        -x, x, -y, y, this._near, this._far
      );
    }

    // view-projection
    mat4.mul(_matViewProj, _matProj, _matView);

    // calculate w
    let w =
      worldPos.x * _matViewProj.m03 +
      worldPos.y * _matViewProj.m07 +
      worldPos.z * _matViewProj.m11 +
      _matViewProj.m15
      ;

    vec3.transformMat4(out, worldPos, _matViewProj);
    out.x = cx + (out.x / w + 1) * 0.5 * cw;
    out.y = cy + (out.y / w + 1) * 0.5 * ch;

    return out;
  }
}