// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../../gfx';
import InputAssembler from '../core/input-assembler';

import Model from '../scene/model';

function _createInputAssembler(out) {
  let vb = new gfx.VertexBuffer(
    out._device,
    new gfx.VertexFormat(out._vertAttrs),
    gfx.USAGE_DYNAMIC,
    null,
    out._capacity * 4
  );

  let indices = new Array(out._capacity);
  let dst = 0;
  for (let i = 0; i < out._capacity; ++i) {
    let baseIdx = 4 * i;
    indices[dst++] = baseIdx;
    indices[dst++] = baseIdx + 1;
    indices[dst++] = baseIdx + 2;
    indices[dst++] = baseIdx + 3;
    indices[dst++] = baseIdx + 2;
    indices[dst++] = baseIdx + 1;
  }
  let ib = new gfx.IndexBuffer(
    out._device,
    gfx.INDEX_FMT_UINT16,
    gfx.USAGE_STATIC,
    new Uint16Array(indices),
    indices.length
  );

  out._ia = new InputAssembler(vb, ib);
}

export default class ParticleBatchModel extends Model {
  constructor(device, capacity, vertAttrs) {
    super();

    this._type = 'particle-batch';
    this._device = device;
    this._capacity = capacity;
    this.setVertexAttributes(vertAttrs);
  }

  setVertexAttributes(attrs) {
    this._vertAttrs = attrs;
    // rebuid
    _createInputAssembler(this);
    this._vertAttrsSize = this._ia._vertexBuffer._format._bytes / 4; // number of float
    this._vdataF32 = new Float32Array(this._capacity * 4 * this._vertAttrsSize);
  }

  enableStretchedBillboard() {
    if (this._vertAttrs.find(attr => attr.name === gfx.ATTR_COLOR0) === undefined) {
      this._vertAttrs.push({ name: gfx.ATTR_COLOR0, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
      this.setVertexAttributes(this._vertAttrs);
    }
  }

  disableStretchedBillboard() {
    if (this._vertAttrs.find(attr => attr.name === gfx.ATTR_COLOR0) !== undefined) {
      this._vertAttrs.pop();
      this.setVertexAttributes(this._vertAttrs);
    }
  }

  setParticleRenderer(r) {
    this._renderer = r;
  }

  addParticleVertexData(index, pvdata) {
    // if (pvdata.length !== this._vertAttrs.length) {
    //   console.error('particle vertex stream data not match.');
    // }
    let offset = index * this._vertAttrsSize;
    for (let i = 0; i < this._vertAttrs.length; ++i) {
      let curAttr = this._vertAttrs[i];
      if (curAttr.num === 1) {
        this._vdataF32[offset] = pvdata[i]; // if not a single float?
        offset++;
      } else if (curAttr.num === 2) {
        this._vdataF32[offset] = pvdata[i].x;
        this._vdataF32[offset + 1] = pvdata[i].y;
        offset += 2;
      } else if (curAttr.num === 3) {
        this._vdataF32[offset] = pvdata[i].x;
        this._vdataF32[offset + 1] = pvdata[i].y;
        this._vdataF32[offset + 2] = pvdata[i].z;
        offset += 3;
      } else if (curAttr.num === 4) {
        this._vdataF32[offset] = pvdata[i].x;
        this._vdataF32[offset + 1] = pvdata[i].y;
        this._vdataF32[offset + 2] = pvdata[i].z;
        this._vdataF32[offset + 3] = pvdata[i].w;
        offset += 4;
      } else {
        console.error('particle vertex attribute format not support');
      }
    }
  }

  updateIA(count) {
    this._ia._count = count;
    this._ia._vertexBuffer.update(0, this._vdataF32);
  }

  clear() {
    this._ia._count = 0;
  }

  destroy() {
    this._vdataF32 = null;
    this._ia._vertexBuffer.destroy();
    this._ia._indexBuffer.destroy();
  }
}
