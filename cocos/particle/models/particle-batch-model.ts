/* eslint-disable max-len */
/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { JSB } from 'internal:constants';
import { Mesh } from '../../3d/assets/mesh';
import { AttributeName, BufferUsageBit, FormatInfos, MemoryUsageBit, PrimitiveMode,
    Attribute, DRAW_INFO_SIZE, Buffer, IndirectBuffer, BufferInfo, DrawInfo, Feature, deviceManager } from '../../gfx';
import { Color } from '../../core';
import { scene } from '../../render-scene';
import { Particle } from '../particle';
import { Material, RenderingSubMesh } from '../../asset/assets';

const _uvs = [
    0, 0, // bottom-left
    1, 0, // bottom-right
    0, 1, // top-left
    1, 1, // top-right
];

const _uvs_ins = [
    0, 0, 0, // bottom-left
    1, 0, 0, // bottom-right
    0, 1, 0, // top-left
    1, 1, 0, // top-right
];

export default class ParticleBatchModel extends scene.Model {
    private _capacity: number;
    private _vertAttrs: Attribute[] | null;
    private _vertAttribSize: number;
    private _vBuffer: ArrayBuffer | null;
    private _vertAttrsFloatCount: number;
    private _vdataF32: Float32Array | null;
    private _vdataUint32: Uint32Array | null;
    private _iaInfo: IndirectBuffer;
    private _iaInfoBuffer: Buffer | null;
    private _subMeshData: RenderingSubMesh | null;
    private _mesh: Mesh | null;
    private _vertCount = 0;
    private _indexCount = 0;
    private _startTimeOffset = 0;
    private _lifeTimeOffset = 0;
    private _material: Material | null = null;

    private _vertAttribSizeStatic: number;
    private _vertStaticAttrsFloatCount: number;
    private _insBuffers: Buffer[];
    private _insIndices: Buffer | null;
    private _useInstance: boolean;

    constructor () {
        super();
        if (JSB) {
            (this as any)._registerListeners();
        }

        this.type = scene.ModelType.PARTICLE_BATCH;
        this._capacity = 0;
        this._vertAttrs = null;

        this._vertAttribSize = 0;
        this._vBuffer = null;
        this._vertAttrsFloatCount = 0;
        this._vdataF32 = null;
        this._vdataUint32 = null;

        this._vertAttribSizeStatic = 0;
        this._vertStaticAttrsFloatCount = 0;
        this._insBuffers = [];
        this._insIndices = null;
        if (!deviceManager.gfxDevice.hasFeature(Feature.INSTANCED_ARRAYS)) {
            this._useInstance = false;
        } else {
            this._useInstance = true;
        }

        this._iaInfo = new IndirectBuffer([new DrawInfo()]);
        this._iaInfoBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDIRECT,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            DRAW_INFO_SIZE,
            DRAW_INFO_SIZE,
        ));
        this._subMeshData = null;
        this._mesh = null;
    }

    public setCapacity (capacity: number) {
        const capChanged = this._capacity !== capacity;
        this._capacity = capacity;
        if (this._subMeshData && capChanged) {
            this.rebuild();
        }
    }

    public setVertexAttributes (mesh: Mesh | null, attrs: Attribute[]) {
        if (!this._useInstance) {
            if (this._mesh === mesh && this._vertAttrs === attrs) {
                return;
            }
            this._mesh = mesh;
            this._vertAttrs = attrs;
            this._vertAttribSize = 0;
            for (const a of this._vertAttrs) {
                (a as any).offset = this._vertAttribSize;
                this._vertAttribSize += FormatInfos[a.format].size;
            }
            this._vertAttrsFloatCount = this._vertAttribSize / 4; // number of float
            // rebuid
            this.rebuild();
        } else {
            this.setVertexAttributesIns(mesh, attrs);
        }
    }

    private setVertexAttributesIns (mesh: Mesh | null, attrs: Attribute[]) {
        if (this._mesh === mesh && this._vertAttrs === attrs) {
            return;
        }
        this._mesh = mesh;
        this._vertAttrs = attrs;
        this._vertAttribSize = 0;
        this._vertAttribSizeStatic = 0;
        for (const a of this._vertAttrs) {
            if (a.stream === 0) {
                (a as any).offset = this._vertAttribSize;
                this._vertAttribSize += FormatInfos[a.format].size;
            } else if (a.stream === 1) {
                (a as any).offset = this._vertAttribSizeStatic;
                this._vertAttribSizeStatic += FormatInfos[a.format].size;
            }
        }
        this._vertAttrsFloatCount = this._vertAttribSize / 4; // number of float
        this._vertStaticAttrsFloatCount = this._vertAttribSizeStatic / 4;
        // rebuid
        this.rebuild();
    }

    private createSubMeshData (): ArrayBuffer {
        this.destroySubMeshData();
        this._vertCount = 4;
        this._indexCount = 6;
        if (this._mesh) {
            this._vertCount = this._mesh.struct.vertexBundles[this._mesh.struct.primitives[0].vertexBundelIndices[0]].view.count;
            this._indexCount = this._mesh.struct.primitives[0].indexView!.count;
        }

        const vertexBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._vertAttribSize * this._capacity * this._vertCount,
            this._vertAttribSize,
        ));
        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertAttribSize * this._capacity * this._vertCount);
        if (this._mesh && this._capacity > 0) {
            let vOffset = (this._vertAttrs![this._vertAttrs!.findIndex((val) => val.name === AttributeName.ATTR_TEX_COORD)] as any).offset;
            this._mesh.copyAttribute(0, AttributeName.ATTR_TEX_COORD, vBuffer, this._vertAttribSize, vOffset);  // copy mesh uv to ATTR_TEX_COORD
            let vIdx = this._vertAttrs!.findIndex((val) => val.name === AttributeName.ATTR_TEX_COORD3);
            vOffset = (this._vertAttrs![vIdx++] as any).offset;
            this._mesh.copyAttribute(0, AttributeName.ATTR_POSITION, vBuffer, this._vertAttribSize, vOffset);  // copy mesh position to ATTR_TEX_COORD3
            vOffset = (this._vertAttrs![vIdx++] as any).offset;
            this._mesh.copyAttribute(0, AttributeName.ATTR_NORMAL, vBuffer, this._vertAttribSize, vOffset);  // copy mesh normal to ATTR_NORMAL
            vOffset = (this._vertAttrs![vIdx++] as any).offset;
            if (!this._mesh.copyAttribute(0, AttributeName.ATTR_COLOR, vBuffer, this._vertAttribSize, vOffset)) {  // copy mesh color to ATTR_COLOR1
                const vb = new Uint32Array(vBuffer);
                for (let iVertex = 0; iVertex < this._vertCount; ++iVertex) {
                    vb[iVertex * this._vertAttrsFloatCount + vOffset / 4] = Color.WHITE._val;
                }
            }
            const vbFloatArray = new Float32Array(vBuffer);
            for (let i = 1; i < this._capacity; i++) {
                vbFloatArray.copyWithin(i * this._vertAttribSize * this._vertCount / 4, 0, this._vertAttribSize * this._vertCount / 4);
            }
        }
        vertexBuffer.update(vBuffer);

        const indices: Uint16Array = new Uint16Array(this._capacity * this._indexCount);
        if (this._mesh && this._capacity > 0) {
            this._mesh.copyIndices(0, indices);
            for (let i = 1; i < this._capacity; i++) {
                for (let j = 0; j < this._indexCount; j++) {
                    indices[i * this._indexCount + j] = indices[j] + i * this._vertCount;
                }
            }
        } else {
            let dst = 0;
            for (let i = 0; i < this._capacity; ++i) {
                const baseIdx = 4 * i;
                indices[dst++] = baseIdx;
                indices[dst++] = baseIdx + 1;
                indices[dst++] = baseIdx + 2;
                indices[dst++] = baseIdx + 3;
                indices[dst++] = baseIdx + 2;
                indices[dst++] = baseIdx + 1;
            }
        }

        const indexBuffer: Buffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            this._capacity * this._indexCount * Uint16Array.BYTES_PER_ELEMENT,
            Uint16Array.BYTES_PER_ELEMENT,
        ));

        indexBuffer.update(indices);

        this._iaInfo.drawInfos[0].vertexCount = this._capacity * this._vertCount;
        this._iaInfo.drawInfos[0].indexCount = this._capacity * this._indexCount;
        if (!this._iaInfoBuffer) {
            this._iaInfoBuffer = this._device.createBuffer(new BufferInfo(
                BufferUsageBit.INDIRECT,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                DRAW_INFO_SIZE,
                DRAW_INFO_SIZE,
            ));
        }
        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = new RenderingSubMesh([vertexBuffer], this._vertAttrs!, PrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        this.initSubModel(0, this._subMeshData, this._material!);
        return vBuffer;
    }

    private createSubMeshDataInsDynamic (): ArrayBuffer {
        this._insBuffers.length = 0;
        this.destroySubMeshData();

        const vertexBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._vertAttribSize * this._capacity,
            this._vertAttribSize,
        ));

        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertAttribSize * this._capacity);
        vertexBuffer.update(vBuffer);

        this._insBuffers.push(vertexBuffer);

        return vBuffer;
    }

    private createSubMeshDataInsStatic () {
        this._vertCount = 4;
        this._indexCount = 6;
        if (this._mesh) {
            this._vertCount = this._mesh.struct.vertexBundles[this._mesh.struct.primitives[0].vertexBundelIndices[0]].view.count;
            this._indexCount = this._mesh.struct.primitives[0].indexView!.count;
        }

        const vertexBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._vertAttribSizeStatic * this._vertCount,
            this._vertAttribSizeStatic,
        ));

        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertAttribSizeStatic * this._vertCount);
        if (this._mesh) {
            let vIdx = this._vertAttrs!.findIndex((val) => val.name === AttributeName.ATTR_TEX_COORD); // find ATTR_TEX_COORD index
            let vOffset = (this._vertAttrs![vIdx] as any).offset; // find ATTR_TEX_COORD offset
            this._mesh.copyAttribute(0, AttributeName.ATTR_TEX_COORD, vBuffer, this._vertAttribSizeStatic, vOffset);  // copy mesh uv to ATTR_TEX_COORD
            vIdx = this._vertAttrs!.findIndex((val) => val.name === AttributeName.ATTR_TEX_COORD3); // find ATTR_TEX_COORD3 index
            vOffset = (this._vertAttrs![vIdx++] as any).offset; // find ATTR_TEX_COORD3 offset
            this._mesh.copyAttribute(0, AttributeName.ATTR_POSITION, vBuffer, this._vertAttribSizeStatic, vOffset);  // copy mesh position to ATTR_TEX_COORD3
            vOffset = (this._vertAttrs![vIdx++] as any).offset;
            this._mesh.copyAttribute(0, AttributeName.ATTR_NORMAL, vBuffer, this._vertAttribSizeStatic, vOffset);  // copy mesh normal to ATTR_NORMAL
            vOffset = (this._vertAttrs![vIdx++] as any).offset;
            if (!this._mesh.copyAttribute(0, AttributeName.ATTR_COLOR, vBuffer, this._vertAttribSizeStatic, vOffset)) {  // copy mesh color to ATTR_COLOR1
                const vb = new Uint32Array(vBuffer);
                for (let iVertex = 0; iVertex < this._vertCount; ++iVertex) {
                    vb[iVertex * this._vertStaticAttrsFloatCount + vOffset / 4] = Color.WHITE._val;
                }
            }
        } else {
            const vbFloatArray = new Float32Array(vBuffer);
            for (let i = 0; i < _uvs_ins.length; ++i) {
                vbFloatArray[i] = _uvs_ins[i];
            }
        }
        vertexBuffer.update(vBuffer);

        const indices: Uint16Array = new Uint16Array(this._indexCount);
        if (this._mesh) {
            this._mesh.copyIndices(0, indices);
        } else {
            indices[0] = 0;
            indices[1] = 1;
            indices[2] = 2;
            indices[3] = 3;
            indices[4] = 2;
            indices[5] = 1;
        }

        const indexBuffer: Buffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            this._indexCount * Uint16Array.BYTES_PER_ELEMENT,
            Uint16Array.BYTES_PER_ELEMENT,
        ));

        indexBuffer.update(indices);
        this._insIndices = indexBuffer;

        this._iaInfo.drawInfos[0].vertexCount = this._vertCount;
        this._iaInfo.drawInfos[0].indexCount = this._indexCount;
        if (!this._iaInfoBuffer) {
            this._iaInfoBuffer = this._device.createBuffer(new BufferInfo(
                BufferUsageBit.INDIRECT,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                DRAW_INFO_SIZE,
                DRAW_INFO_SIZE,
            ));
        }
        this._iaInfoBuffer.update(this._iaInfo);

        this._insBuffers.push(vertexBuffer);
    }

    private createInsSubmesh () {
        this._subMeshData = new RenderingSubMesh(this._insBuffers, this._vertAttrs!, PrimitiveMode.TRIANGLE_LIST, this._insIndices, this._iaInfoBuffer);
        this.initSubModel(0, this._subMeshData, this._material!);
    }

    public updateMaterial (mat: Material) {
        this._material = mat;
        this.setSubModelMaterial(0, mat);
    }

    public addParticleVertexData (index: number, pvdata: any[]) {
        if (!this._useInstance) {
            if (!this._mesh) {
                let offset: number = index * this._vertAttrsFloatCount;
                this._vdataF32![offset++] = pvdata[0].x; // position
                this._vdataF32![offset++] = pvdata[0].y;
                this._vdataF32![offset++] = pvdata[0].z;
                this._vdataF32![offset++] = pvdata[1].x; // uv
                this._vdataF32![offset++] = pvdata[1].y;
                this._vdataF32![offset++] = pvdata[1].z; // frame idx
                this._vdataF32![offset++] = pvdata[2].x; // size
                this._vdataF32![offset++] = pvdata[2].y;
                this._vdataF32![offset++] = pvdata[2].z;
                this._vdataF32![offset++] = pvdata[3].x; // rotation
                this._vdataF32![offset++] = pvdata[3].y;
                this._vdataF32![offset++] = pvdata[3].z;
                this._vdataUint32![offset++] = pvdata[4]; // color
                if (pvdata[5]) {
                    this._vdataF32![offset++] = pvdata[5].x; // velocity
                    this._vdataF32![offset++] = pvdata[5].y;
                    this._vdataF32![offset++] = pvdata[5].z;
                }
            } else {
                for (let i = 0; i < this._vertCount; i++) {
                    let offset: number = (index * this._vertCount + i) * this._vertAttrsFloatCount;
                    this._vdataF32![offset++] = pvdata[0].x; // position
                    this._vdataF32![offset++] = pvdata[0].y;
                    this._vdataF32![offset++] = pvdata[0].z;
                    offset += 2;
                    // this._vdataF32![offset++] = index;
                    // this._vdataF32![offset++] = pvdata[1].y;
                    this._vdataF32![offset++] = pvdata[1].z; // frame idx
                    this._vdataF32![offset++] = pvdata[2].x; // size
                    this._vdataF32![offset++] = pvdata[2].y;
                    this._vdataF32![offset++] = pvdata[2].z;
                    this._vdataF32![offset++] = pvdata[3].x; // rotation
                    this._vdataF32![offset++] = pvdata[3].y;
                    this._vdataF32![offset++] = pvdata[3].z;
                    this._vdataUint32![offset++] = pvdata[4]; // color
                }
            }
        } else {
            this.addParticleVertexDataIns(index, pvdata);
        }
    }

    private addParticleVertexDataIns (index: number, pvdata: any[]) {
        let offset: number = index * this._vertAttrsFloatCount;
        if (!this._mesh) {
            this._vdataF32![offset++] = pvdata[0].x; // position
            this._vdataF32![offset++] = pvdata[0].y;
            this._vdataF32![offset++] = pvdata[0].z;
            this._vdataF32![offset++] = pvdata[1].z; // frame idx

            this._vdataF32![offset++] = pvdata[2].x; // size
            this._vdataF32![offset++] = pvdata[2].y;
            this._vdataF32![offset++] = pvdata[2].z;

            this._vdataF32![offset++] = pvdata[3].x; // rotation
            this._vdataF32![offset++] = pvdata[3].y;
            this._vdataF32![offset++] = pvdata[3].z;

            this._vdataUint32![offset++] = pvdata[4]; // color
            if (pvdata[5]) {
                this._vdataF32![offset++] = pvdata[5].x; // velocity
                this._vdataF32![offset++] = pvdata[5].y;
                this._vdataF32![offset++] = pvdata[5].z;
            }
        } else {
            this._vdataF32![offset++] = pvdata[0].x; // position
            this._vdataF32![offset++] = pvdata[0].y;
            this._vdataF32![offset++] = pvdata[0].z;
            this._vdataF32![offset++] = pvdata[1].z; // frame idx

            this._vdataF32![offset++] = pvdata[2].x; // size
            this._vdataF32![offset++] = pvdata[2].y;
            this._vdataF32![offset++] = pvdata[2].z;

            this._vdataF32![offset++] = pvdata[3].x; // rotation
            this._vdataF32![offset++] = pvdata[3].y;
            this._vdataF32![offset++] = pvdata[3].z;

            this._vdataUint32![offset++] = pvdata[4]; // color
        }
    }

    public addGPUParticleVertexData (p: Particle, num: number, time:number) {
        if (!this._useInstance) {
            let offset = num * this._vertAttrsFloatCount * this._vertCount;
            for (let i = 0; i < this._vertCount; i++) {
                let idx = offset;
                this._vdataF32![idx++] = p.position.x;
                this._vdataF32![idx++] = p.position.y;
                this._vdataF32![idx++] = p.position.z;
                this._vdataF32![idx++] = time;

                this._vdataF32![idx++] = p.startSize.x;
                this._vdataF32![idx++] = p.startSize.y;
                this._vdataF32![idx++] = p.startSize.z;
                this._vdataF32![idx++] = _uvs[2 * i];

                this._vdataF32![idx++] = p.rotation.x;
                this._vdataF32![idx++] = p.rotation.y;
                this._vdataF32![idx++] = p.rotation.z;
                this._vdataF32![idx++] = _uvs[2 * i + 1];

                this._vdataF32![idx++] = p.startColor.r / 255.0;
                this._vdataF32![idx++] = p.startColor.g / 255.0;
                this._vdataF32![idx++] = p.startColor.b / 255.0;
                this._vdataF32![idx++] = p.startColor.a / 255.0;

                this._vdataF32![idx++] = p.velocity.x;
                this._vdataF32![idx++] = p.velocity.y;
                this._vdataF32![idx++] = p.velocity.z;
                this._vdataF32![idx++] = p.startLifetime;

                this._vdataF32![idx++] = p.randomSeed;

                offset += this._vertAttrsFloatCount;
            }
        } else {
            this.addGPUParticleVertexDataIns(p, num, time);
        }
    }

    private addGPUParticleVertexDataIns (p: Particle, num: number, time:number) {
        let offset = num * this._vertAttrsFloatCount;
        let idx = offset;
        this._vdataF32![idx++] = p.position.x;
        this._vdataF32![idx++] = p.position.y;
        this._vdataF32![idx++] = p.position.z;
        this._vdataF32![idx++] = time;

        this._vdataF32![idx++] = p.startSize.x;
        this._vdataF32![idx++] = p.startSize.y;
        this._vdataF32![idx++] = p.startSize.z;
        this._vdataF32![idx++] = p.frameIndex;

        this._vdataF32![idx++] = p.rotation.x;
        this._vdataF32![idx++] = p.rotation.y;
        this._vdataF32![idx++] = p.rotation.z;

        this._vdataF32![idx++] = p.startColor.r / 255.0;
        this._vdataF32![idx++] = p.startColor.g / 255.0;
        this._vdataF32![idx++] = p.startColor.b / 255.0;
        this._vdataF32![idx++] = p.startColor.a / 255.0;

        this._vdataF32![idx++] = p.velocity.x;
        this._vdataF32![idx++] = p.velocity.y;
        this._vdataF32![idx++] = p.velocity.z;
        this._vdataF32![idx++] = p.startLifetime;

        this._vdataF32![idx++] = p.randomSeed;

        offset += this._vertAttrsFloatCount;
    }

    public updateGPUParticles (num: number, time: number, dt: number) {
        if (!this._useInstance) {
            const pSize = this._vertAttrsFloatCount * this._vertCount;
            let pBaseIndex = 0;
            let startTime = 0;
            let lifeTime = 0;
            let lastBaseIndex = 0;
            let interval = 0;
            for (let i = 0; i < num; ++i) {
                pBaseIndex = i * pSize;
                startTime = this._vdataF32![pBaseIndex + this._startTimeOffset];
                lifeTime = this._vdataF32![pBaseIndex + this._lifeTimeOffset];
                interval = time - startTime;
                if (lifeTime - interval < dt) {
                    lastBaseIndex = --num * pSize;
                    this._vdataF32!.copyWithin(pBaseIndex, lastBaseIndex, lastBaseIndex + pSize);
                    i--;
                }
            }

            return num;
        } else {
            return this.updateGPUParticlesIns(num, time, dt);
        }
    }

    private updateGPUParticlesIns (num: number, time: number, dt: number) {
        const pSize = this._vertAttrsFloatCount;
        let pBaseIndex = 0;
        let startTime = 0;
        let lifeTime = 0;
        let lastBaseIndex = 0;
        let interval = 0;
        for (let i = 0; i < num; ++i) {
            pBaseIndex = i * pSize;
            startTime = this._vdataF32![pBaseIndex + this._startTimeOffset];
            lifeTime = this._vdataF32![pBaseIndex + this._lifeTimeOffset];
            interval = time - startTime;
            if (lifeTime - interval < dt) {
                lastBaseIndex = --num * pSize;
                this._vdataF32!.copyWithin(pBaseIndex, lastBaseIndex, lastBaseIndex + pSize);
                i--;
            }
        }

        return num;
    }

    public constructAttributeIndex () {
        if (!this._vertAttrs) {
            return;
        }
        let vIdx = this._vertAttrs.findIndex((val) => val.name === 'a_position_starttime');
        let vOffset = (this._vertAttrs[vIdx] as any).offset;
        this._startTimeOffset = vOffset / 4 + 3;
        vIdx = this._vertAttrs.findIndex((val) => val.name === 'a_dir_life');
        vOffset = (this._vertAttrs[vIdx] as any).offset;
        this._lifeTimeOffset = vOffset / 4 + 3;
    }

    public updateIA (count: number) {
        if (!this._useInstance) {
            if (count <= 0) {
                return;
            }
            const ia = this._subModels[0].inputAssembler;
            ia.vertexBuffers[0].update(this._vdataF32!);
            this._iaInfo.drawInfos[0].firstIndex = 0;
            this._iaInfo.drawInfos[0].indexCount = this._indexCount * count;
            this._iaInfoBuffer!.update(this._iaInfo);
        } else {
            this.updateIAIns(count);
        }
    }

    private updateIAIns (count: number) {
        if (count <= 0) {
            return;
        }
        const ia = this._subModels[0].inputAssembler;
        ia.vertexBuffers[0].update(this._vdataF32!); // update dynamic buffer
        ia.instanceCount = count;
        this._iaInfo.drawInfos[0].firstIndex = 0;
        this._iaInfo.drawInfos[0].indexCount = this._indexCount;
        this._iaInfo.drawInfos[0].instanceCount = count;
        this._iaInfoBuffer!.update(this._iaInfo);
    }

    public clear () {
        if (!this._useInstance) {
            this._subModels[0].inputAssembler.indexCount = 0;
        } else {
            this.clearIns();
        }
    }

    private clearIns () {
        this._subModels[0].inputAssembler.instanceCount = 0;
    }

    public destroy () {
        super.destroy();
        this.doDestroy();
    }

    public doDestroy () {
        this._vBuffer = null;
        this._vdataF32 = null;
        this._vdataUint32 = null;

        this._insBuffers = [];
        this._insIndices = null;

        this._vertAttrs = null;
        this._material = null;
        this._mesh = null;
        this.destroySubMeshData();
    }

    private rebuild () {
        if (!this._useInstance) {
            this._vBuffer = this.createSubMeshData();
            this._vdataF32 = new Float32Array(this._vBuffer);
            this._vdataUint32 = new Uint32Array(this._vBuffer);
        } else {
            this.rebuildIns();
        }
    }

    private rebuildIns () {
        this._vBuffer = this.createSubMeshDataInsDynamic();
        this._vdataF32 = new Float32Array(this._vBuffer);
        this._vdataUint32 = new Uint32Array(this._vBuffer);

        this.createSubMeshDataInsStatic();

        this.createInsSubmesh();
    }

    private destroySubMeshData () {
        if (this._subMeshData) {
            this._subMeshData.destroy();
            this._subMeshData = null;
        }
        if (this._iaInfoBuffer) {
            // this._iaInfoBuffer.destroy(); // Already destroied in _subMeshData
            this._iaInfoBuffer = null;
        }
    }

    public set useInstance (value: boolean) {
        if (this._useInstance !== value) {
            this._useInstance = value;
        }
    }

    public get useInstance (): boolean {
        return this._useInstance;
    }
}
