// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { aabb } from '../../geom-utils';

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
  }

  _updateTransform() {
    if (!this._node._hasChanged || !this._boundingShape) return;
    this._node.updateWorldTransformFull();
    this._bsModelSpace.transform(this._node._mat, this._node._pos,
      this._node._rot, this._node._scale, this._boundingShape);
  }
  
  /**
   * Create the bounding shape of this model
   * @param {number} minPos the min position of the model
   * @param {number} maxPos the max position of the model
   */
  createBoundingShape(minPos, maxPos) {
    if (!minPos || !maxPos) return;
    this._bsModelSpace = aabb.fromPoints(aabb.create(), minPos, maxPos);
    this._boundingShape = aabb.clone(this._bsModelSpace);
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
  setEffect(effect) {
    if (effect) {
      this._effect = effect;
      this._defines = effect.extractDefines(Object.create(null));
      this._dependencies = effect.extractDependencies(Object.create(null));
    } else {
      this._effect = null;
      this._defines = Object.create(null);
      this._dependencies = Object.create(null);
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
    out.defines = this._effect.extractDefines(this._defines);
    out.dependencies = this._effect.extractDependencies(this._dependencies);
  }
}