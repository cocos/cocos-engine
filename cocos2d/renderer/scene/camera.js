// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { color4, vec3, mat4, lerp } from '../../core/vmath';
import geomUtils from '../../core/geom-utils';
import enums from '../enums';

let _tmp_mat4 = mat4.create();

let _matView = mat4.create();
let _matProj = mat4.create();
let _matViewProj = mat4.create();
let _matInvViewProj = mat4.create();
let _tmp_v3 = cc.v3();
let _tmp2_v3 = cc.v3();

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

    this._cullingMask = 0xffffffff;
  }

  // culling mask
  get cullingMask() {
    return this._cullingMask;
  }

  set cullingMask(mask) {
    this._cullingMask = mask;
  }

  setCullingMask (mask) {
    this._cullingMask = mask;
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
  setFrameBuffer(framebuffer) {
    this._framebuffer = framebuffer;
  }

  _calcMatrices(width, height) {
    // view matrix
    this._node.getWorldRT(_matView);
    mat4.invert(_matView, _matView);

    // projection matrix
    let aspect = width / height;
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
  }

  /**
   * extract a view of this camera
   * @param {View} out the receiving view
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   */
  extractView(out, width, height) {
    if (this._framebuffer) {
      width = this._framebuffer._width;
      height = this._framebuffer._height;
    }

    // priority
    out._priority = this._priority;

    // rect
    out._rect.x = this._rect.x * width;
    out._rect.y = this._rect.y * height;
    out._rect.w = this._rect.w * width;
    out._rect.h = this._rect.h * height;

    // clear opts
    this.getColor(out._color);
    out._depth = this._depth;
    out._stencil = this._stencil;
    out._clearFlags = this._clearFlags;
    out._clearModel = this._clearModel;

    // stages & framebuffer
    out._stages = this._stages;
    out._framebuffer = this._framebuffer;

    this._calcMatrices(width, height);
    mat4.copy(out._matView, _matView);
    mat4.copy(out._matProj, _matProj);
    mat4.copy(out._matViewProj, _matViewProj);
    mat4.copy(out._matInvViewProj, _matInvViewProj);

    out._cullingMask = this._cullingMask;
  }

  /**
   * transform a screen position to a world space ray
   * @param {number} x the screen x position to be transformed
   * @param {number} y the screen y position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @param {Ray} out the resulting ray
   * @returns {Ray} the resulting ray
   */
  screenPointToRay(x, y, width, height, out) {
    if (!geomUtils) return out;
    
    out = out || geomUtils.Ray.create();
    this._calcMatrices(width, height);

    let cx = this._rect.x * width;
    let cy = this._rect.y * height;
    let cw = this._rect.w * width;
    let ch = this._rect.h * height;

    // far plane intersection
    vec3.set(_tmp2_v3, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);
    vec3.transformMat4(_tmp2_v3, _tmp2_v3, _matInvViewProj);

    if (this._projection === enums.PROJ_PERSPECTIVE) {
      // camera origin
      this._node.getWorldPosition(_tmp_v3);
    } else {
      // near plane intersection
      vec3.set(_tmp_v3, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);
      vec3.transformMat4(_tmp_v3, _tmp_v3, _matInvViewProj);
    }

    return geomUtils.Ray.fromPoints(out, _tmp_v3, _tmp2_v3);
  }

  /**
   * transform a screen position to world space
   * @param {Vec3} out the resulting vector
   * @param {Vec3} screenPos the screen position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Vec3} the resulting vector
   */
  screenToWorld(out, screenPos, width, height) {
    this._calcMatrices(width, height);

    let cx = this._rect.x * width;
    let cy = this._rect.y * height;
    let cw = this._rect.w * width;
    let ch = this._rect.h * height;

    if (this._projection === enums.PROJ_PERSPECTIVE) {
      // calculate screen pos in far clip plane
      vec3.set(out,
        (screenPos.x - cx) / cw * 2 - 1,
        (screenPos.y - cy) / ch * 2 - 1,
        0.9999
      );

      // transform to world
      vec3.transformMat4(out, out, _matInvViewProj);

      // lerp to depth z
      this._node.getWorldPosition(_tmp_v3);

      vec3.lerp(out, _tmp_v3, out, lerp(this._near / this._far, 1, screenPos.z));
    } else {
      vec3.set(out,
        (screenPos.x - cx) / cw * 2 - 1,
        (screenPos.y - cy) / ch * 2 - 1,
        screenPos.z * 2 - 1
      );

      // transform to world
      vec3.transformMat4(out, out, _matInvViewProj);
    }

    return out;
  }

  /**
   * transform a world space position to screen space
   * @param {Vec3} out the resulting vector
   * @param {Vec3} worldPos the world space position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Vec3} the resulting vector
   */
  worldToScreen(out, worldPos, width, height) {
    this._calcMatrices(width, height);

    let cx = this._rect.x * width;
    let cy = this._rect.y * height;
    let cw = this._rect.w * width;
    let ch = this._rect.h * height;

    vec3.transformMat4(out, worldPos, _matViewProj);
    out.x = cx + (out.x + 1) * 0.5 * cw;
    out.y = cy + (out.y + 1) * 0.5 * ch;
    out.z = out.z * 0.5 + 0.5;

    return out;
  }

  /**
   * transform a world space matrix to screen space
   * @param {Mat4} out the resulting vector
   * @param {Mat4} worldMatrix the world space matrix to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Mat4} the resulting vector
   */
  worldMatrixToScreen (out, worldMatrix, width, height) {
    this._calcMatrices(width, height);

    mat4.mul(out, _matViewProj, worldMatrix);

    let halfWidth = width / 2;
    let halfHeight = height / 2;
    mat4.identity(_tmp_mat4);
    mat4.translate(_tmp_mat4, _tmp_mat4, vec3.set(_tmp_v3, halfWidth, halfHeight, 0));
    mat4.scale(_tmp_mat4, _tmp_mat4, vec3.set(_tmp_v3, halfWidth, halfHeight, 1));
    
    mat4.mul(out, _tmp_mat4, out);

    return out;
  }
}
