// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { aabb } from '../../core/3d/geom-utils';

/**
 * A representation of a model
 */
export default class Model {
  /**
   * Setup a default empty model
   */
  constructor() {
    this._type = 'default';
    this._poolID = -1;
    this._node = null;
    this._inputAssembler = null;
    this._effect = null;
    this._defines = {};
    this._dependencies = {};
    this._viewID = -1;
    this._cameraID = -1;
    this._userKey = -1;
    this._castShadow = false;
    this._boundingShape = null;
    this._uniforms = null;
  }

  /**
   * Set the hosting node of this model
   * @param {Node} node the hosting node
   */
  setNode(node) {
    this._node = node;
  }

  /**
   * Set the input assembler
   * @param {InputAssembler} ia
   */
  setInputAssembler(ia) {
    this._inputAssembler = ia;
  }

  /**
   * Set the model effect
   * @param {?Effect} effect the effect to use
   */
  setEffect(effect, customProperties) {
    this._defines = Object.create(null);
    this._dependencies = Object.create(null);
    this._uniforms = Object.create(null);
    this._effect = effect;

    if (effect) {
      effect.extractDefines(this._defines);
      effect.extractProperties(this._uniforms);
      effect.extractDependencies(this._dependencies);
    }

    if (customProperties) {
      customProperties.extractDefines(this._defines);
      customProperties.extractProperties(this._uniforms);
    }
  }

  /**
   * Set the user key
   * @param {number} key
   */
  setUserKey(key) {
    this._userKey = key;
  }

  /**
   * Extract a drawing item
   * @param {Object} out the receiving item
   */
  extractDrawItem(out) {
    out.model = this;
    out.node = this._node;
    out.ia = this._inputAssembler;
    out.effect = this._effect;
    out.defines = this._defines;
    out.dependencies = this._dependencies;
    out.uniforms = this._uniforms;
  }
}