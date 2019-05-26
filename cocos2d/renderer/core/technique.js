// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import config from '../config';

let _genID = 0;

export default class Technique {
  /**
   * @param {Array} stages
   * @param {Array} passes
   * @param {Number} layer
   */
  constructor(stages, passes, layer = 0) {
    this._id = _genID++;
    this._stageIDs = config.stageIDs(stages);
    this._passes = passes;
    this._layer = layer;
    // TODO: this._version = 'webgl' or 'webgl2' // ????

    if (CC_JSB && CC_NATIVERENDERER) {
        var passesNative = [];
        for (var i = 0, len = passes.length; i < len; ++i) {
        passesNative.push(passes[i]._native);
        }
        this._nativeObj = new renderer.TechniqueNative(stages, passesNative, layer);
    }
  }

  setStages(stages) {
    this._stageIDs = config.stageIDs(stages);
    
    if (CC_JSB && CC_NATIVERENDERER) {
        this._nativeObj.setStages(stages);
    }
  }

  get passes() {
    return this._passes;
  }

  get stageIDs() {
    return this._stageIDs;
  }
}