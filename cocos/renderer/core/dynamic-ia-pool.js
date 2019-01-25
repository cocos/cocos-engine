// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../gfx';
import { CircularPool } from '../../3d/memop';
import InputAssembler from './input-assembler';
import BufferPool from './buffer-pool';
import * as enums from '../enums';

let _attr2bufviewType = {};
_attr2bufviewType[gfx.ATTR_TYPE_INT8] = enums.BUFFER_VIEW_INT8;
_attr2bufviewType[gfx.ATTR_TYPE_UINT8] = enums.BUFFER_VIEW_UINT8;
_attr2bufviewType[gfx.ATTR_TYPE_INT16] = enums.BUFFER_VIEW_INT16;
_attr2bufviewType[gfx.ATTR_TYPE_UINT16] = enums.BUFFER_VIEW_UINT16;
_attr2bufviewType[gfx.ATTR_TYPE_INT32] = enums.BUFFER_VIEW_INT32;
_attr2bufviewType[gfx.ATTR_TYPE_UINT32] = enums.BUFFER_VIEW_UINT32;
_attr2bufviewType[gfx.ATTR_TYPE_FLOAT32] = enums.BUFFER_VIEW_FLOAT32;

export default class DynamicIAPool {
  constructor(device, maxBuffers, pt, vfmt, maxVerts, ifmt = gfx.INDEX_FMT_UINT16, maxIndices = -1) {
    // create vdata pool
    let vbufviewTypes = [];
    for (let i = 0; i < vfmt._elements.length; ++i) {
      let attrType = vfmt._elements[i].type;
      let bufviewType = _attr2bufviewType[attrType];
      if (vbufviewTypes.indexOf(bufviewType) === -1) {
        vbufviewTypes.push(bufviewType);
      }
    }
    this._bytesPerVeretx = vfmt._bytes;
    this._vdataPool = new BufferPool(this._bytesPerVeretx * maxVerts, vbufviewTypes);

    // create idata pool
    if (maxIndices !== -1) {
      let ibufviewType = -1;

      if (ifmt === gfx.INDEX_FMT_UINT8) {
        ibufviewType = enums.BUFFER_VIEW_UINT8;
        this._bytesPerIndex = 1;
      } else if (ifmt === gfx.INDEX_FMT_UINT16) {
        ibufviewType = enums.BUFFER_VIEW_UINT16;
        this._bytesPerIndex = 2;
      } else if (ifmt === gfx.INDEX_FMT_UINT32) {
        ibufviewType = enums.BUFFER_VIEW_UINT32;
        this._bytesPerIndex = 4;
      }

      this._idataPool = new BufferPool(
        this._bytesPerIndex * maxIndices,
        [ibufviewType]
      );
    }

    this._maxVerts = maxVerts;
    this._maxIndices = maxIndices;

    this._IAs = new CircularPool(() => {
      return new InputAssembler(
        new gfx.VertexBuffer(
          device,
          vfmt,
          gfx.USAGE_DYNAMIC,
          null,
          Math.ceil(this._vdataPool.maxBytes / this._bytesPerVeretx)
        ),
        maxIndices === -1 ? null : new gfx.IndexBuffer(
          device,
          ifmt,
          gfx.USAGE_DYNAMIC,
          null,
          Math.ceil(this._idataPool.maxBytes / this._bytesPerIndex)
        ),
        pt
      );
    }, maxBuffers);
  }

  get maxVerts() {
    return this._maxVerts;
  }

  get maxIndices() {
    return this._maxIndices;
  }

  requestIA() {
    return this._IAs.request();
  }

  requestVData(count) {
    return this._vdataPool.request(count * this._bytesPerVeretx);
  }

  requestIData(count) {
    return this._idataPool.request(count * this._bytesPerIndex);
  }
}