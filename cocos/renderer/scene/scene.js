// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { FixedArray } from '../../memop';

/**
 * A representation of the scene
 */
export default class Scene {
  /**
   * Setup a default empty scene
   */
  constructor(app) {
    this._lights = new FixedArray(16);
    this._models = new FixedArray(16);
    this._cameras = new FixedArray(16);
    this._debugCamera = null;
    this._app = app;

    // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)
    this._views = [];
  }

  _add(pool, item) {
    if (item._poolID !== -1) {
      return;
    }

    pool.push(item);
    item._poolID = pool.length - 1;
  }

  _remove(pool, item) {
    if (item._poolID === -1) {
      return;
    }

    pool.data[pool.length-1]._poolID = item._poolID;
    pool.fastRemove(item._poolID);
    item._poolID = -1;
  }

  /**
   * update built-in bounding shapes if needed,
   * used in the frustum culling process
   */
  tick() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models.data[i];
      model._updateTransform();
    }
  }

  /**
   * reset the model viewIDs
   */
  reset() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models.data[i];
      model._viewID = -1;
    }
  }

  /**
   * Set the debug camera
   * @param {Camera} cam the debug camera
   */
  setDebugCamera(cam) {
    this._debugCamera = cam;
  }

  /**
   * Get the count of registered cameras
   * @returns {number} camera count
   */
  getCameraCount() {
    return this._cameras.length;
  }

  /**
   * Get the specified camera
   * @param {number} idx camera index
   * @returns {Camera} the specified camera
   */
  getCamera(idx) {
    return this._cameras.data[idx];
  }

  /**
   * register a camera
   * @param {Camera} camera the new camera
   */
  addCamera(camera) {
    this._add(this._cameras, camera);
  }

  /**
   * remove a camera
   * @param {Camera} camera the camera to be removed
   */
  removeCamera(camera) {
    this._remove(this._cameras, camera);
  }

  /**
   * Get the count of registered model
   * @returns {number} model count
   */
  getModelCount() {
    return this._models.length;
  }

  /**
   * Get the specified model
   * @param {number} idx model index
   * @returns {Model} the specified model
   */
  getModel(idx) {
    return this._models.data[idx];
  }

  /**
   * register a model
   * @param {Model} model the new model
   */
  addModel(model) {
    this._add(this._models, model);
  }

  /**
   * remove a model
   * @param {Model} model the model to be removed
   */
  removeModel(model) {
    this._remove(this._models, model);
  }

  /**
   * Get the count of registered light
   * @returns {number} light count
   */
  getLightCount() {
    return this._lights.length;
  }

  /**
   * Get the specified light
   * @param {number} idx light index
   * @returns {Light} the specified light
   */
  getLight(idx) {
    return this._lights.data[idx];
  }

  /**
   * register a light
   * @param {Light} light the new light
   */
  addLight(light) {
    this._add(this._lights, light);
  }

  /**
   * remove a light
   * @param {Light} light the light to be removed
   */
  removeLight(light) {
    this._remove(this._lights, light);
  }

  /**
   * register a view
   * @param {View} view the new view
   */
  addView(view) {
    if (this._views.indexOf(view) === -1) {
      this._views.push(view);
    }
  }

  /**
   * remove a view
   * @param {View} view the view to be removed
   */
  removeView(view) {
    let idx = this._views.indexOf(view);
    if (idx !== -1) {
      this._views.splice(idx, 1);
    }
  }
}