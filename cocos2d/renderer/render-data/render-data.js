// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
import { Pool } from '../memop';
import BaseRenderData from './base-render-data';

var _pool;
var _dataPool = new Pool(() => {
  return {
    x: 0.0,
    y: 0.0,
    z: 0.0,
    u: 0.0,
    v: 0.0,
    color: 0
  };
}, 128);

/**
 * RenderData is most widely used render data type.
 * It describes raw vertex data with a fixed data layout.
 * Each vertex is described by five property: x, y, u, v, color. The data layout might be extended in the future.
 * Vertex data objects are managed automatically by RenderData, user only need to set the dataLength property.
 * User can also define rendering index orders for the vertex list.
 */
export default class RenderData extends BaseRenderData {
  constructor () {
    super();
    this._data = [];
    this._indices = [];

    this._pivotX = 0;
    this._pivotY = 0;
    this._width = 0;
    this._height = 0;

    this.uvDirty = true;
    this.vertDirty = true;
  }

  get type () {
    return RenderData.type;
  }

  get dataLength () {
    return this._data.length;
  }

  set dataLength (length) {
    let data = this._data;
    if (data.length !== length) {
      // Free extra data
      for (let i = length; i < data.length; i++) {
        _dataPool.free(data[i]);
      }
      // Alloc needed data
      for (let i = data.length; i < length; i++) {
        data[i] = _dataPool.alloc();
      }
      data.length = length;
    }
  }

  updateSizeNPivot (width, height, pivotX, pivotY) {
    if (width !== this._width || 
        height !== this._height ||
        pivotX !== this._pivotX ||
        pivotY !== this._pivotY) 
    {
      this._width = width;
      this._height = height;
      this._pivotX = pivotX;
      this._pivotY = pivotY;
      this.vertDirty = true;
    }
  }
  
  static alloc () {
    return _pool.alloc();
  }

  static free (data) {
    if (data instanceof RenderData) {
      for (let i = data.length-1; i > 0; i--) {
        _dataPool.free(data._data[i]);
      }
      data._data.length = 0;
      data._indices.length = 0;
      data.material = null;
      data.uvDirty = true;
      data.vertDirty = true;
      data.vertexCount = 0;
      data.indiceCount = 0;
      _pool.free(data);
    }
  }
}

RenderData.type = 'RenderData';

_pool = new Pool(() => {
  return new RenderData();
}, 32);