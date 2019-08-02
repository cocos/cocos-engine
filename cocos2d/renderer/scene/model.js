// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
    this._viewID = -1;
    this._cameraID = -1;
    this._userKey = -1;
    this._castShadow = false;
    this._boundingShape = null;

    // Originally model do Object.create(null) and 
    // copy values from effect and customProperties every time when call setEffect,
    // this will cause gc performance, so change to Array type to store values.
    this._defines = [];
    this._uniforms = [];
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
    this._effect = effect;

    let defines = this._defines;
    let uniforms = this._uniforms;
    
    defines.length = 0;
    uniforms.length = 0;
    
    if (effect) {
      defines.push(effect._defines);
      uniforms.push(effect._properties);
    }

    if (customProperties) {
      defines.push(customProperties._defines);
      uniforms.push(customProperties._properties);
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
