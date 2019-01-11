// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { RecyclePool } from '../../3d/memop';

import { Model } from '../scene/model';

export default class SpriteBatchModel extends Model {
  constructor() {
    super();

    this._type = 'sprite-batch';
    this._sprites = new RecyclePool(() => {
      return {
        refPositions: null,
        refUVs: null,
        refColor: null,
        refIndices: null,
      };
    }, 2000);

    this._vertCount = 0;
    this._indexCount = 0;
  }

  get vertCount() {
    return this._vertCount;
  }

  get indexCount() {
    return this._indexCount;
  }

  get spriteCount() {
    return this._sprites.length;
  }

  getSprite(idx) {
    return this._sprites.data[idx];
  }

  addSprite(positions, uvs, color, indices) {
    let sprite = this._sprites.add();

    sprite.refPositions = positions;
    sprite.refUVs = uvs;
    sprite.refColor = color;
    sprite.refIndices = indices;

    this._vertCount += positions.length;
    this._indexCount += indices.length;

    return sprite;
  }

  clear() {
    this._sprites.reset();

    this._vertCount = 0;
    this._indexCount = 0;
  }
}
