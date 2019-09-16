// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { color3, color4, mat4, mat3, vec3, toRadian } from '../../core/vmath';
import gfx from '../gfx';

import enums from '../enums';

const _forward = vec3.create(0, 0, -1);

let _m4_tmp = mat4.create();
let _m3_tmp = mat3.create();
let _transformedLightDirection = vec3.create(0, 0, 0);

// compute light viewProjMat for shadow.
function _computeSpotLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);
  mat4.invert(outView, outView);

  // proj matrix
  mat4.perspective(outProj, light._spotAngle * light._spotAngleScale, 1, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computeDirectionalLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);
  mat4.invert(outView, outView);

  // TODO: should compute directional light frustum based on rendered meshes in scene.
  // proj matrix
  let halfSize = light._shadowFrustumSize / 2;
  mat4.ortho(outProj, -halfSize, halfSize, -halfSize, halfSize, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computePointLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);
  mat4.invert(outView, outView);

  // The transformation from Cartesian to polar coordinates is not a linear function,
  // so it cannot be achieved by means of a fixed matrix multiplication.
  // Here we just use a nearly 180 degree perspective matrix instead.
  mat4.perspective(outProj, toRadian(179), 1, light._shadowMinDepth, light._shadowMaxDepth);
}

/**
 * A representation of a light source.
 * Could be a point light, a spot light or a directional light.
 */
export default class Light {
  /**
   * Setup a default directional light with no shadows
   */
  constructor() {
    this._poolID = -1;
    this._node = null;

    this._type = enums.LIGHT_DIRECTIONAL;

    this._color = color3.create(1, 1, 1);
    this._intensity = 1;

    // used for spot and point light
    this._range = 1;
    // used for spot light, default to 60 degrees
    this._spotAngle = toRadian(60);
    this._spotExp = 1;
    // cached for uniform
    this._directionUniform = new Float32Array(3);
    this._positionUniform = new Float32Array(3);
    this._colorUniform = new Float32Array([this._color.r * this._intensity, this._color.g * this._intensity, this._color.b * this._intensity]);
    this._spotUniform = new Float32Array([Math.cos(this._spotAngle * 0.5), this._spotExp]);

    // shadow params
    this._shadowType = enums.SHADOW_NONE;
    this._shadowFrameBuffer = null;
    this._shadowMap = null;
    this._shadowMapDirty = false;
    this._shadowDepthBuffer = null;
    this._shadowResolution = 1024;
    this._shadowBias = 0.0005;
    this._shadowDarkness = 1;
    this._shadowMinDepth = 1;
    this._shadowMaxDepth = 1000;
    this._shadowDepthScale = 50; // maybe need to change it if the distance between shadowMaxDepth and shadowMinDepth is small.
    this._frustumEdgeFalloff = 0; // used by directional and spot light.
    this._viewProjMatrix = mat4.create();
    this._spotAngleScale = 1; // used for spot light.
    this._shadowFrustumSize = 50; // used for directional light.
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
   * set the color of the light source
   * @param {number} r red channel of the light color
   * @param {number} g green channel of the light color
   * @param {number} b blue channel of the light color
   */
  setColor(r, g, b) {
    color3.set(this._color, r, g, b);
    this._colorUniform[0] = r * this._intensity;
    this._colorUniform[1] = g * this._intensity;
    this._colorUniform[2] = b * this._intensity;
  }

  /**
   * get the color of the light source
   * @returns {color3} the light color
   */
  get color() {
    return this._color;
  }

  /**
   * set the intensity of the light source
   * @param {number} val the light intensity
   */
  setIntensity(val) {
    this._intensity = val;
    this._colorUniform[0] = val * this._color.r;
    this._colorUniform[1] = val * this._color.g;
    this._colorUniform[2] = val * this._color.b;
  }

  /**
   * get the intensity of the light source
   * @returns {number} the light intensity
   */
  get intensity() {
    return this._intensity;
  }

  /**
   * set the type of the light source
   * @param {number} type light source type
   */
  setType(type) {
    this._type = type;
  }

  /**
   * get the type of the light source
   * @returns {number} light source type
   */
  get type() {
    return this._type;
  }

  /**
   * set the spot light angle
   * @param {number} val spot light angle
   */
  setSpotAngle(val) {
    this._spotAngle = val;
    this._spotUniform[0] = Math.cos(this._spotAngle * 0.5);
  }

  /**
   * get the spot light angle
   * @returns {number} spot light angle
   */
  get spotAngle() {
    return this._spotAngle;
  }

  /**
   * set the spot light exponential
   * @param {number} val spot light exponential
   */
  setSpotExp(val) {
    this._spotExp = val;
    this._spotUniform[1] = val;
  }

  /**
   * get the spot light exponential
   * @returns {number} spot light exponential
   */
  get spotExp() {
    return this._spotExp;
  }

  /**
   * set the range of the light source
   * @param {number} val light source range
   */
  setRange(val) {
    this._range = val;
  }

  /**
   * get the range of the light source
   * @returns {number} range of the light source
   */
  get range() {
    return this._range;
  }

  /**
   * set the shadow type of the light source
   * @param {number} type light source shadow type
   */
  setShadowType(type) {
    if (this._shadowType === enums.SHADOW_NONE && type !== enums.SHADOW_NONE) {
      this._shadowMapDirty = true;
    }
    this._shadowType = type;
  }

  /**
   * get the shadow type of the light source
   * @returns {number} light source shadow type
   */
  get shadowType() {
    return this._shadowType;
  }

  /**
   * get the shadowmap of the light source
   * @returns {Texture2D} light source shadowmap
   */
  get shadowMap() {
    return this._shadowMap;
  }

  /**
   * get the view-projection matrix of the light source
   * @returns {Mat4} light source view-projection matrix
   */
  get viewProjMatrix() {
    return this._viewProjMatrix;
  }

  /**
   * set the shadow resolution of the light source
   * @param {number} val light source shadow resolution
   */
  setShadowResolution(val) {
    if (this._shadowResolution !== val) {
      this._shadowMapDirty = true;
    }
    this._shadowResolution = val;
  }

  /**
   * get the shadow resolution of the light source
   * @returns {number} light source shadow resolution
   */
  get shadowResolution() {
    return this._shadowResolution;
  }

  /**
   * set the shadow bias of the light source
   * @param {number} val light source shadow bias
   */
  setShadowBias(val) {
    this._shadowBias = val;
  }

  /**
   * get the shadow bias of the light source
   * @returns {number} light source shadow bias
   */
  get shadowBias() {
    return this._shadowBias;
  }

  /**
   * set the shadow darkness of the light source
   * @param {number} val light source shadow darkness
   */
  setShadowDarkness(val) {
    this._shadowDarkness = val;
  }

  /**
   * get the shadow darkness of the light source
   * @returns {number} light source shadow darkness
   */
  get shadowDarkness() {
    return this._shadowDarkness;
  }

  /**
   * set the shadow min depth of the light source
   * @param {number} val light source shadow min depth
   */
  setShadowMinDepth(val) {
    this._shadowMinDepth = val;
  }

  /**
   * get the shadow min depth of the light source
   * @returns {number} light source shadow min depth
   */
  get shadowMinDepth() {
    if (this._type === enums.LIGHT_DIRECTIONAL) {
      return 1.0;
    }
    return this._shadowMinDepth;
  }

  /**
   * set the shadow max depth of the light source
   * @param {number} val light source shadow max depth
   */
  setShadowMaxDepth(val) {
    this._shadowMaxDepth = val;
  }

  /**
   * get the shadow max depth of the light source
   * @returns {number} light source shadow max depth
   */
  get shadowMaxDepth() {
    if (this._type === enums.LIGHT_DIRECTIONAL) {
      return 1.0;
    }
    return this._shadowMaxDepth;
  }

  /**
   * set the shadow depth scale of the light source
   * @param {number} val light source shadow depth scale
   */
  setShadowDepthScale(val) {
    this._shadowDepthScale = val;
  }

  /**
   * get the shadow depth scale of the light source
   * @returns {number} light source shadow depth scale
   */
  get shadowDepthScale() {
    return this._shadowDepthScale;
  }

  /**
   * set the frustum edge falloff of the light source
   * @param {number} val light source frustum edge falloff
   */
  setFrustumEdgeFalloff(val) {
    this._frustumEdgeFalloff = val;
  }

  /**
   * get the frustum edge falloff of the light source
   * @returns {number} light source frustum edge falloff
   */
  get frustumEdgeFalloff() {
    return this._frustumEdgeFalloff;
  }

  /**
   * set the shadow frustum size of the light source
   * @param {number} val light source shadow frustum size
   */
  setShadowFrustumSize(val) {
    this._shadowFrustumSize = val;
  }

  /**
   * get the shadow frustum size of the light source
   * @returns {number} light source shadow frustum size
   */
  get shadowFrustumSize() {
    return this._shadowFrustumSize;
  }

  /**
   * extract a view of this light source
   * @param {View} out the receiving view
   * @param {string[]} stages the stages using the view
   */
  extractView(out, stages) {
    // TODO: view should not handle light.
    out._shadowLight = this;

    // priority. TODO: use varying value for shadow view?
    out._priority = -1;

    // rect
    out._rect.x = 0;
    out._rect.y = 0;
    out._rect.w = this._shadowResolution;
    out._rect.h = this._shadowResolution;

    // clear opts
    color4.set(out._color, 1, 1, 1, 1);
    out._depth = 1;
    out._stencil = 1;
    out._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;

    // stages & framebuffer
    out._stages = stages;
    out._framebuffer = this._shadowFrameBuffer;

    // view projection matrix
    switch(this._type) {
      case enums.LIGHT_SPOT:
        _computeSpotLightViewProjMatrix(this, out._matView, out._matProj);
        break;

      case enums.LIGHT_DIRECTIONAL:
        _computeDirectionalLightViewProjMatrix(this, out._matView, out._matProj);
        break;

      case enums.LIGHT_POINT:
        _computePointLightViewProjMatrix(this, out._matView, out._matProj);
        break;
      case enums.LIGHT_AMBIENT:
        break;
      default:
        console.warn('shadow of this light type is not supported');
    }

    // view-projection
    mat4.mul(out._matViewProj, out._matProj, out._matView);
    this._viewProjMatrix = out._matViewProj;
    mat4.invert(out._matInvViewProj, out._matViewProj);

    // update view's frustum
    // out._frustum.update(out._matViewProj, out._matInvViewProj);

    out._cullingMask = 0xffffffff;
  }

  _updateLightPositionAndDirection() {
    this._node.getWorldMatrix(_m4_tmp);
    mat3.fromMat4(_m3_tmp, _m4_tmp);
    vec3.transformMat3(_transformedLightDirection, _forward, _m3_tmp);
    vec3.array(this._directionUniform, _transformedLightDirection);
    let pos = this._positionUniform;
    let m = _m4_tmp.m;
    pos[0] = m[12];
    pos[1] = m[13];
    pos[2] = m[14];
  }

  _generateShadowMap(device) {
    this._shadowMap = new gfx.Texture2D(device, {
      width: this._shadowResolution,
      height: this._shadowResolution,
      format: gfx.TEXTURE_FMT_RGBA8,
      wrapS: gfx.WRAP_CLAMP,
      wrapT: gfx.WRAP_CLAMP,
    });
    this._shadowDepthBuffer = new gfx.RenderBuffer(device,
      gfx.RB_FMT_D16,
      this._shadowResolution,
      this._shadowResolution
    );
    this._shadowFrameBuffer = new gfx.FrameBuffer(device, this._shadowResolution, this._shadowResolution, {
      colors: [this._shadowMap],
      depth: this._shadowDepthBuffer,
    });
  }

  _destroyShadowMap() {
    if (this._shadowMap) {
      this._shadowMap.destroy();
      this._shadowDepthBuffer.destroy();
      this._shadowFrameBuffer.destroy();
      this._shadowMap = null;
      this._shadowDepthBuffer = null;
      this._shadowFrameBuffer = null;
    }
  }

  /**
   * update the light source
   * @param {Device} device the rendering device
   */
  update(device) {
    this._updateLightPositionAndDirection();

    if (this._shadowType === enums.SHADOW_NONE) {
      this._destroyShadowMap();
    } else if (this._shadowMapDirty) {
      this._destroyShadowMap();
      this._generateShadowMap(device);
      this._shadowMapDirty = false;
    }

  }
}
