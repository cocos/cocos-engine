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
    this._stages = stages;
    this._stageIDs = config.stageIDs(stages);
    this._passes = passes;
    this._layer = layer;
    // TODO: this._version = 'webgl' or 'webgl2' // ????
  }

  setStages(stages) {
    this._stageIDs = config.stageIDs(stages);
  }

  get passes() {
    return this._passes;
  }

  get stageIDs() {
    return this._stageIDs;
  }

  clone () {
    let passes = [];
    for (let i = 0; i < this._passes.length; i++) {
      passes.push(this._passes[i].clone());
    }
    return new Technique(this._stages, passes, this._layer);
  }
}