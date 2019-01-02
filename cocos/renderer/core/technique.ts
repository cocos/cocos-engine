// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { RenderQueue } from './constants';
import { Pass } from './pass';

let _genID = 0;

export default class Technique {
  protected _id: number = -1;
  protected _renderQueue: number = RenderQueue.OPAQUE;
  protected _priority: number = 0;
  protected _lod: number = -1;
  protected _passes: Pass[] = [];

  constructor(renderQueue = RenderQueue.OPAQUE, priority = 0, lod = -1, passes = []) {
    this._id = _genID++;
    this._renderQueue = renderQueue;
    this._priority = priority;
    this._lod = lod;
    this._passes = passes;
  }

  public setRenderQueue(renderQueue: number) {
    this._renderQueue = renderQueue;
  }

  get renderQueue() {
    return this._renderQueue;
  }

  get passes() {
    return this._passes;
  }
}
