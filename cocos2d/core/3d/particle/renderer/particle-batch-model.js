// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../../../../renderer/gfx'
import InputAssembler from '../../../../renderer/core/input-assembler'
import { MeshData } from '../../../mesh/mesh-data'

const renderer = require('../../../renderer');

export default class ParticleBatchModel{
    _capacity = 0;
    _vertFormat = null;
    _vertAttrsFloatCount = 0;
    _mesh = null;
    _vertCount = 0;
    _indexCount = 0;
    _material = null;

    constructor () {
        this._capacity = 0;
        this._vertFormat = null;
        this._vertAttrsFloatCount = 0;
        this._mesh = null;

        this._subDatas = [];
        this._subMeshes = [];
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
        this._vertAttrsFloatCount = this._vertFormat._bytes / 4; // number of float
        // rebuid
        this._createParticleData();
        this._inited = true;
    }

    _recreateBuffer () {
        this._createParticleData();
    }

    _createParticleData () {
        this.destroyIAData()
        this._vertCount = 4;
        this._indexCount = 6;

        if (this._mesh) {
            // this._ia = this._mesh._subMeshes[0];
            // this._vData = this._mesh._subDatas[0].vData.getVData(Float32Array);
        } else {
            let vertSize = this._vertFormat._bytes
            let vbData = new Float32Array(vertSize * this._capacity * this._vertCount / 4);
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

            let meshData = new MeshData();
            meshData.vData = vbData;
            meshData.iData = ibData;
            meshData.vfm = this._vertFormat;
            meshData.vDirty = true;
            meshData.iDirty = true;
            meshData.enable = true;
            this._subDatas[0] = meshData;
 
            if (CC_JSB && CC_NATIVERENDERER) {
                meshData.vDirty = true;
            } else {
                let vb = new gfx.VertexBuffer(
                    renderer.device,
                    this._vertFormat,
                    gfx.USAGE_DYNAMIC,
                    vbData
                );
    
                let ib = new gfx.IndexBuffer(
                    renderer.device,
                    gfx.INDEX_FMT_UINT16,
                    gfx.USAGE_STATIC,
                    ibData,
                    ibData.length
                );
                
                meshData.vb = vb;
                meshData.ib = ib;
                this._subMeshes[0] = new InputAssembler(vb, ib);
            }
        }
    }

    createTrailData (vfmt, num) {
        if (this._subDatas[1]) {
            return
        }

        let vertSize = vfmt._bytes;
        let vBuffer = new ArrayBuffer(vertSize * (num + 1) * 2);
        let ibData = new Uint16Array(num * 6);

        let meshData = new MeshData();
        meshData.vData = new Float32Array(vBuffer);
        meshData.iData = ibData;
        meshData.vfm = vfmt;
        meshData.vDirty = true;
        meshData.iDirty = true;
        meshData.enable = true;
        this._subDatas[1] = meshData;
        
        if (CC_JSB && CC_NATIVERENDERER) {
            meshData.vDirty = true;
        } else {
            let vb = new gfx.VertexBuffer(
                renderer.device,
                vfmt,
                gfx.USAGE_DYNAMIC,
                vBuffer
            );
            let ib = new gfx.IndexBuffer(
                renderer.device,
                gfx.INDEX_FMT_UINT16,
                gfx.USAGE_DYNAMIC,
                ibData,
                num * 6
            );
            
            meshData.vb = vb;
            meshData.ib = ib;
            this._subMeshes[1] = new InputAssembler(vb, ib);
        }
    }

    setModelMaterial (mat) {
        this._material = mat;
    }

    addParticleVertexData (index, pvdata) {
        let subData = this._subDatas[0];
        let vData = subData.getVData();
        let uintVData = subData.getVData(Uint32Array);

        if (!this._mesh) {
            let offset = index * this._vertAttrsFloatCount;
            vData[offset++] = pvdata[0].x; // position
            vData[offset++] = pvdata[0].y;
            vData[offset++] = pvdata[0].z;
            vData[offset++] = pvdata[1].x; // uv
            vData[offset++] = pvdata[1].y;
            vData[offset++] = pvdata[1].z; // frame idx
            vData[offset++] = pvdata[2].x; // size
            vData[offset++] = pvdata[2].y;
            vData[offset++] = pvdata[2].z;
            vData[offset++] = pvdata[3].x; // rotation
            vData[offset++] = pvdata[3].y;
            vData[offset++] = pvdata[3].z;
            uintVData[offset++] = pvdata[4]; // color
            if (pvdata[5]) {
                vData[offset++] = pvdata[5].x; // velocity
                vData[offset++] = pvdata[5].y;
                vData[offset++] = pvdata[5].z;
            }
        } else {
            for (let i = 0; i < this._vertCount; i++) {
                let offset = (index * this._vertCount + i) * this._vertAttrsFloatCount;
                vData[offset++] = pvdata[0].x; // position
                vData[offset++] = pvdata[0].y;
                vData[offset++] = pvdata[0].z;
                offset += 2;
                vData[offset++] = pvdata[1].z; // frame idx
                vData[offset++] = pvdata[2].x; // size
                vData[offset++] = pvdata[2].y;
                vData[offset++] = pvdata[2].z;
                vData[offset++] = pvdata[3].x; // rotation
                vData[offset++] = pvdata[3].y;
                vData[offset++] = pvdata[3].z;
                uintVData[offset++] = pvdata[4]; // color
            }
        }
    }

    _uploadData () {
        let subDatas = this._subDatas;
        for (let i = 0, len = subDatas.length; i < len; i++) {
            let subData = subDatas[i];

            if (subData.vDirty) {
                let buffer = subData.vb, data = subData.vData;
                buffer.update(0, data);
                subData.vDirty = false;
            }

            if (subData.iDirty) {
                let buffer = subData.ib, data = subData.iData;
                buffer.update(0, data);
                subData.iDirty = false;
            }
        }
    }

    updateIA (index, count, vDirty, iDirty) {
        if (CC_JSB && CC_NATIVERENDERER) return

        this._subMeshes[index]._count = count;

        let subData = this._subDatas[index];
        subData.vDirty = vDirty;
        subData.iDirty = iDirty;
    }

    clear () {
        let subMesh = this._subMeshes[0];
        if (subMesh) {
            subMesh.indexCount = 0;
        }
    }

    destroy () {
        this._subMeshes.length = 0;

        let subDatas = this._subDatas;
        for (let i = 0, len = subDatas.length; i < len; i++) {
            let vb = subDatas[i].vb;
            if (vb) {
                vb.destroy();
            }
            
            let ib = subDatas[i].ib;
            if (ib) {
                ib.destroy();
            }
        }
        subDatas.length = 0;
    }

    destroyIAData () {
        if (this._subDatas[0]) {
            this._subDatas[0].vb.destroy();
            this._subDatas[0].ib.destroy();
            this._subDatas[0] = null;
        }

        this._subMeshes[0] = null;
    }
}
