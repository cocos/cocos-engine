// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import RenderQueue from './queue';

let _genID = 0;

let parseQueue = function (expr) {
  let m = expr.match(/(\w+)(?:([+-])(\d+))?/);
  if (m == null)
      return 0;
  let q;
  switch (m[1]) {
      case 'opaque':
          q = RenderQueue.OPAQUE;
          break;
      case 'transparent':
          q = RenderQueue.TRANSPARENT;
          break;
      case 'overlay':
          q = RenderQueue.OVERLAY;
          break;
  }
  if (m.length == 4) {
      if (m[2] === '+') {
          q += parseInt(m[3]);
      }
      if (m[2] === '-') {
          q -= parseInt(m[3]);
      }
  }
  return q;
};

export default class Technique {
  /**
   * @param {Array} stages
   * @param {Array} passes
   * @param {Number} renderQueue
   */
  constructor(renderQueue, passes) {
    this._id = _genID++;
    this._renderQueue = parseQueue(renderQueue);
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
