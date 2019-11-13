// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../../../../renderer/gfx'
import InputAssembler from '../../../../renderer/core/input-assembler'

const renderer = require('../../../renderer');

export default class ParticleBatchModel{
    _capacity = 0;
    _vertFormat = null;
    _vertSize = 0;
    _vertAttrsFloatCount = 0;
    _vData = null;
    _uintVData = null;
    _mesh = null;
    _vertCount = 0;
    _indexCount = 0;
    _material = null;

    constructor () {
        this._capacity = 0;
        this._vertFormat = null;
        this._vertSize = 0;
        this._vBuffer = null;
        this._vertAttrsFloatCount = 0;
        this._vData = null;
        this._uintVData = null;
        this._ibData = null;
        this._mesh = null;
        this._ia = null;
    }

    setCapacity (capacity) {
        const capChanged = this._capacity !== capacity;
        this._capacity = capacity;
        if (this._inited && capChanged) {
            this._recreateBuffer();
        }
    }

    setVertexAttributes (mesh, vfmt) {
        if (this._mesh === mesh && this._vertFormat === vfmt) {
            return;
        }
        this._mesh = mesh;
        this._vertFormat = vfmt;
        this._vertSize = this._vertFormat._bytes;
        this._vertAttrsFloatCount = this._vertSize / 4; // number of float
        // rebuid
        this._createSubMeshData();
        this._uintVData = new Uint32Array(this._vData.buffer);
        this._inited = true;
    }

    _recreateBuffer () {
        this._createSubMeshData();
        this._uintVData = new Uint32Array(this._vData.buffer);
    }

    _createSubMeshData () {
        this.destroyIAData()
        this._vertCount = 4;
        this._indexCount = 6;
        if (this._mesh) {
            this._ia = this._mesh._subMeshes[0];
            this._vData = this._mesh._subDatas[0].vData.getVData(Float32Array);
        } else {
            let vbData = new Float32Array(this._vertSize * this._capacity * this._vertCount / 4);

            let vb = new gfx.VertexBuffer(
                renderer.device,
                this._vertFormat,
                gfx.USAGE_DYNAMIC,
                vbData
            );

            let ibData = new Uint16Array(this._capacity * this._indexCount);
            
            let dst = 0;
            for (let i = 0; i < this._capacity; ++i) {
                const baseIdx = 4 * i;
                ibData[dst++] = baseIdx;
                ibData[dst++] = baseIdx + 1;
                ibData[dst++] = baseIdx + 2;
                ibData[dst++] = baseIdx + 3;
                ibData[dst++] = baseIdx + 2;
                ibData[dst++] = baseIdx + 1;
            }

            let ib = new gfx.IndexBuffer(
                renderer.device,
                gfx.INDEX_FMT_UINT16,
                gfx.USAGE_STATIC,
                ibData,
                ibData.length
            );
            
            this._vData = vbData;
            this._ibData = ibData;
            this._ia = new InputAssembler(vb, ib);
            this._ia._start = 0;
            this._ia._count = 0;
        }
    }

    setModelMaterial (mat) {
        this._material = mat;
    }

    addParticleVertexData (index, pvdata) {
        if (!this._mesh) {
            let offset = index * this._vertAttrsFloatCount;
            this._vData[offset++] = pvdata[0].x; // position
            this._vData[offset++] = pvdata[0].y;
            this._vData[offset++] = pvdata[0].z;
            this._vData[offset++] = pvdata[1].x; // uv
            this._vData[offset++] = pvdata[1].y;
            this._vData[offset++] = pvdata[1].z; // frame idx
            this._vData[offset++] = pvdata[2].x; // size
            this._vData[offset++] = pvdata[2].y;
            this._vData[offset++] = pvdata[2].z;
            this._vData[offset++] = pvdata[3].x; // rotation
            this._vData[offset++] = pvdata[3].y;
            this._vData[offset++] = pvdata[3].z;
            this._uintVData[offset++] = pvdata[4]; // color
            if (pvdata[5]) {
                this._vData[offset++] = pvdata[5].x; // velocity
                this._vData[offset++] = pvdata[5].y;
                this._vData[offset++] = pvdata[5].z;
            }
        } else {
            for (let i = 0; i < this._vertCount; i++) {
                let offset = (index * this._vertCount + i) * this._vertAttrsFloatCount;
                this._vData[offset++] = pvdata[0].x; // position
                this._vData[offset++] = pvdata[0].y;
                this._vData[offset++] = pvdata[0].z;
                offset += 2;
                // this._vData[offset++] = index;
                // this._vData[offset++] = pvdata[1].y;
                this._vData[offset++] = pvdata[1].z; // frame idx
                this._vData[offset++] = pvdata[2].x; // size
                this._vData[offset++] = pvdata[2].y;
                this._vData[offset++] = pvdata[2].z;
                this._vData[offset++] = pvdata[3].x; // rotation
                this._vData[offset++] = pvdata[3].y;
                this._vData[offset++] = pvdata[3].z;
                this._vdataUint32[offset++] = pvdata[4]; // color
            }
        }
    }

    updateIA (count) {
        this._ia._count = count * 6;
        this._ia._vertexBuffer.update(0, this._vData);
    }

    clear () {
        this._ia.indexCount = 0;
    }

    destroy () {
        this._vBuffer = null;
        this._vData = null;
    }

    destroyIAData () {
        if (this._ia) {
            this._ia._vertexBuffer.destroy();
            this._ia._indexBuffer.destroy();
            this._ia = null;
        }
    }
}
