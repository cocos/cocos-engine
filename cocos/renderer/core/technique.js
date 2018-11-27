// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

let _genID = 0;

export default class Technique {
  /**
   * @param {Array} stages
   * @param {Array} passes
   * @param {Number} renderQueue
   */
  constructor(renderQueue, lod, passes) {
    this._id = _genID++;
    this._lod = lod;
    this._renderQueue = renderQueue;
    this._passes = passes;
    // TODO: this._version = 'webgl' or 'webgl2' // ????
  }

  setRenderQueue(renderQueue) {
    this._renderQueue = renderQueue;
  }

  get passes() {
    return this._passes;
  }

  get renderQueue() {
    return this._renderQueue;
  }
}
