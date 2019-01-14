// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
import { Pool } from '../memop';
import BaseRenderData from './base-render-data';

var _pool;
var _vertsPool = new Pool(() => {
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
    this.vertices = [];
    this.indices = [];
    this.material = null;
  }

  get type () {
    return RenderData.type;
  }

  get dataLength () {
    return this.vertices.length;
  }

  set dataLength (length) {
    let verts = this.vertices;
    if (verts.length !== length) {
      // Free extra vertices
      for (let i = length; i < verts.length; i++) {
        _vertsPool.free(verts[i]);
      }
      // Alloc needed vertices
      for (let i = verts.length; i < length; i++) {
        verts[i] = _vertsPool.alloc();
      }
      verts.length = length;
    }
  }
  
  static alloc () {
    return _pool.alloc();
  }

  static free (data) {
    if (data instanceof RenderData) {
      let verts = data.vertices;
      for (let i = verts.length-1; i > 0; i--) {
        _vertsPool.free(verts[i]);
      }
      data.vertices.length = 0;
      data.indices.length = 0;
      data.material = null;
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