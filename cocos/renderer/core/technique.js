// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { RenderQueue } from "./constants";

let _genID = 0;

export default class Technique {
  /**
   * @param {Array} stages
   * @param {Array} passes
   * @param {Number} renderQueue
   */
  constructor(renderQueue = RenderQueue.OPAQUE, priority = 0, lod = -1, passes = []) {
    this._id = _genID++;
    this._renderQueue = renderQueue;
    this._priority = priority;
    this._lod = lod;
    this._passes = passes;
    // TODO: this._version = 'webgl' or 'webgl2' // ????
  }

  setRenderQueue(renderQueue) {
    this._renderQueue = renderQueue;
  }

  get renderQueue() {
    return this._renderQueue;
  }

  get passes() {
    return this._passes;
  }
}
