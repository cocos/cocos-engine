// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Model from '../scene/model';

export default class SkinningModel extends Model {
  constructor() {
    super();

    this._type = 'skinning';
    this._jointsTexture = null;
    this._jointsMatrixArray = null;
  }

  setJointsTexture(texture) {
    this._jointsTexture = texture;
  }

  setJointsMatrixArray(a) {
    this._jointsMatrixArray = a;
  }
}