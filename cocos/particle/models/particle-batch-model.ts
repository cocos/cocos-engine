/* eslint-disable max-len */
/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
    Attribute, DRAW_INFO_SIZE, Buffer, IndirectBuffer, BufferInfo, DrawInfo, Feature, deviceManager } from '../../core/gfx';
import { Color } from '../../core/math/color';
import { scene } from '../../core/renderer';
import { Material, RenderingSubMesh } from '../../core/assets';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';

const _uvs = [
    0, 0, // bottom-left
    1, 0, // bottom-right
    0, 1, // top-left
    1, 1, // top-right
];

const fixedVertexBuffer = new Float32Array([
    0, 0, 0, 0, 0, 0, // bottom-left
    1, 0, 0, 1, 0, 0, // bottom-right
    0, 1, 0, 0, 1, 0, // top-left
    1, 1, 0, 1, 1, 0, // top-right
]);

export default class ParticleBatchModel extends scene.Model {
    private _capacity = 0;
    private _vertAttrs: Attribute[] = [];
    private _iaInfo: IndirectBuffer;
    private _iaInfoBuffer: Buffer | null = null;
    private _subMeshData: RenderingSubMesh | null = null;
    private _mesh: Mesh | null = null;
    private _vertCount = 0;
    private _indexCount = 0;
    private _material: Material | null = null;

    private _vertAttribSizeStatic = 0;
    private _vertAttribSizeDynamic = 0;
    private _vertStaticAttrsFloatCount = 0;
    private _vertDynamicAttrsFloatCount = 0;
    private _insBuffers: Buffer[] = [];
    private _dynamicBuffer: Float32Array | null = null;
    private _dynamicBufferUintView: Uint32Array | null = null;
    private _insIndices: Buffer | null = null;
    private _hasVelocityChanel = false;

    constructor () {
        super();
        if (JSB) {
            (this as any)._registerListeners();
        }

        this.type = scene.ModelType.PARTICLE_BATCH;

        this._iaInfo = new IndirectBuffer([new DrawInfo()]);
        this._iaInfoBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDIRECT,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            DRAW_INFO_SIZE,
            DRAW_INFO_SIZE,
        ));
    }

    public setCapacity (capacity: number) {
        const capChanged = this._capacity !== capacity;
        if (capChanged) {
            const vertexBuffer = this._insBuffers[1];
            vertexBuffer.resize(capacity * vertexBuffer.stride);
            this._dynamicBuffer = new Float32Array(new ArrayBuffer(capacity * vertexBuffer.stride));
            this._dynamicBufferUintView = new Uint32Array(this._dynamicBuffer.buffer);
            this._capacity = capacity;
        }
    }

    public setVertexAttributes (mesh: Mesh | null, attrs: Attribute[]) {
        if (this._mesh === mesh && this._vertAttrs === attrs) {
            return;
        }
        this._mesh = mesh;
        this._vertAttrs = attrs;
        this._vertAttribSizeStatic = 0;
        for (const a of this._vertAttrs) {
            if (!a.isInstanced) {
                (a as any).offset = this._vertAttribSizeStatic;
                this._vertAttribSizeStatic += FormatInfos[a.format].size;
            } else {
                this._vertAttribSizeDynamic += FormatInfos[a.format].size;
            }
        }
        this._vertStaticAttrsFloatCount = this._vertAttribSizeStatic / 4;
        this._vertDynamicAttrsFloatCount = this._vertAttribSizeDynamic / 4;
        this._hasVelocityChanel = !!this._vertAttrs.find((val) => val.name === 'a_particle_velocity');
        // rebuid
        this.rebuild();
    }

    private createSubMeshDataInsDynamic () {
        const vertexBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._vertAttribSizeDynamic * this._capacity,
            this._vertAttribSizeDynamic,
        ));
        this._dynamicBuffer = new Float32Array(new ArrayBuffer(this._capacity * this._vertAttribSizeDynamic));
        this._dynamicBufferUintView = new Uint32Array(this._dynamicBuffer.buffer);
        this._insBuffers.push(vertexBuffer);
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
            MemoryUsageBit.DEVICE,
            this._vertAttribSizeStatic * this._vertCount,
            this._vertAttribSizeStatic,
        ));

        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertAttribSizeStatic * this._vertCount);
        if (this._mesh) {
            let vIdx = this._vertAttrs.findIndex((val) => val.name === AttributeName.ATTR_TEX_COORD); // find ATTR_TEX_COORD index
            let vOffset = (this._vertAttrs[vIdx] as any).offset; // find ATTR_TEX_COORD offset
            this._mesh.copyAttribute(0, AttributeName.ATTR_TEX_COORD, vBuffer, this._vertAttribSizeStatic, vOffset);  // copy mesh uv to ATTR_TEX_COORD
            vIdx = this._vertAttrs.findIndex((val) => val.name === AttributeName.ATTR_POSITION); // find ATTR_TEX_COORD3 index
            vOffset = (this._vertAttrs[vIdx++] as any).offset; // find ATTR_TEX_COORD3 offset
            this._mesh.copyAttribute(0, AttributeName.ATTR_POSITION, vBuffer, this._vertAttribSizeStatic, vOffset);  // copy mesh position to ATTR_TEX_COORD3
            vOffset = (this._vertAttrs[vIdx++] as any).offset;
            this._mesh.copyAttribute(0, AttributeName.ATTR_NORMAL, vBuffer, this._vertAttribSizeStatic, vOffset);  // copy mesh normal to ATTR_NORMAL
            vOffset = (this._vertAttrs[vIdx++] as any).offset;
            if (!this._mesh.copyAttribute(0, AttributeName.ATTR_COLOR, vBuffer, this._vertAttribSizeStatic, vOffset)) {  // copy mesh color to ATTR_COLOR1
                const vb = new Uint32Array(vBuffer);
                for (let iVertex = 0; iVertex < this._vertCount; ++iVertex) {
                    vb[iVertex * this._vertStaticAttrsFloatCount + vOffset / 4] = Color.WHITE._val;
                }
            }
        } else {
            const vbFloatArray = new Float32Array(vBuffer);
            vbFloatArray.set(fixedVertexBuffer);
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
        this._subMeshData = new RenderingSubMesh(this._insBuffers, this._vertAttrs, PrimitiveMode.TRIANGLE_LIST, this._insIndices, this._iaInfoBuffer);
        this.initSubModel(0, this._subMeshData, this._material!);
    }

    public updateMaterial (mat: Material) {
        this._material = mat;
        this.setSubModelMaterial(0, mat);
    }

    public updateIA (particles: ParticleDataSet) {
        if (particles.count > 0) {
            const dynamicBuffer = this._dynamicBuffer!;
            const dynamicBufferUintView = this._dynamicBufferUintView!;
            const { count } = particles;

            if (particles.hasParameter(BuiltinParticleParameter.POSITION)) {
                const position = particles.position.data;
                for (let i = 0; i < count; i++) {
                    const offset = i * this._vertDynamicAttrsFloatCount;
                    const xOffset = i * 3;
                    const yOffset = xOffset + 1;
                    const zOffset = yOffset + 1;
                    dynamicBuffer[offset] = position[xOffset];
                    dynamicBuffer[offset + 1] = position[yOffset];
                    dynamicBuffer[offset + 2] = position[zOffset];
                }
            }
            if (particles.hasParameter(BuiltinParticleParameter.ROTATION)) {
                const rotation = particles.rotation.data;
                for (let i = 0; i < count; i++) {
                    const offset = i * this._vertDynamicAttrsFloatCount;
                    const xOffset = i * 3;
                    const yOffset = xOffset + 1;
                    const zOffset = yOffset + 1;
                    dynamicBuffer[offset + 3] = rotation[xOffset];
                    dynamicBuffer[offset + 4] = rotation[yOffset];
                    dynamicBuffer[offset + 5] = rotation[zOffset];
                }
            }
            if (particles.hasParameter(BuiltinParticleParameter.SIZE)) {
                const size = particles.size.data;
                for (let i = 0; i < count; i++) {
                    const offset = i * this._vertDynamicAttrsFloatCount;
                    const xOffset = i * 3;
                    const yOffset = xOffset + 1;
                    const zOffset = yOffset + 1;
                    dynamicBuffer[offset + 6] = size[xOffset];
                    dynamicBuffer[offset + 7] = size[yOffset];
                    dynamicBuffer[offset + 8] = size[zOffset];
                }
            }
            if (particles.hasParameter(BuiltinParticleParameter.FRAME_INDEX)) {
                const frameIndex = particles.frameIndex.data;
                for (let i = 0; i < count; i++) {
                    const offset = i * this._vertDynamicAttrsFloatCount;
                    dynamicBuffer[offset + 9] = frameIndex[i];
                }
            }
            if (particles.hasParameter(BuiltinParticleParameter.COLOR)) {
                const color = particles.color.data;
                for (let i = 0; i < count; i++) {
                    const offset = i * this._vertDynamicAttrsFloatCount;
                    dynamicBufferUintView[offset + 10] = color[i];
                }
            }
            if (particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
                const { velocity } = particles;
                const velocityData = velocity.data;
                for (let i = 0; i < count; i++) {
                    const offset = i * this._vertDynamicAttrsFloatCount;
                    const xOffset = i * 3;
                    const yOffset = xOffset + 1;
                    const zOffset = yOffset + 1;
                    dynamicBuffer[offset + 11] += velocityData[xOffset];
                    dynamicBuffer[offset + 12] += velocityData[yOffset];
                    dynamicBuffer[offset + 13] += velocityData[zOffset];
                }
            }
            this._insBuffers[1].update(dynamicBuffer); // update dynamic buffer
        }
        this._subModels[0].inputAssembler.instanceCount = particles.count;
        this._iaInfo.drawInfos[0].firstIndex = 0;
        this._iaInfo.drawInfos[0].indexCount = this._indexCount;
        this._iaInfo.drawInfos[0].instanceCount = particles.count;
        this._iaInfoBuffer!.update(this._iaInfo);
    }

    public clear () {
        this._subModels[0].inputAssembler.instanceCount = 0;
    }

    public destroy () {
        super.destroy();
        this.doDestroy();
    }

    public doDestroy () {
        this._insBuffers.length = 0;
        this._insIndices = null;

        this._vertAttrs.length = 0;
        this._material = null;
        this._mesh = null;
        this.destroySubMeshData();
    }

    private rebuild () {
        this.destroySubMeshData();
        this.createSubMeshDataInsStatic();
        this.createSubMeshDataInsDynamic();

        this.createInsSubmesh();
    }

    private destroySubMeshData () {
        if (this._subMeshData) {
            this._subMeshData.destroy();
            this._subMeshData = null;
        }
        if (this._iaInfoBuffer) {
            // this._iaInfoBuffer.destroy(); // Already destroyed in _subMeshData
            this._iaInfoBuffer = null;
        }
    }
}
