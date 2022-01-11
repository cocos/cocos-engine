/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

/**
 * @packageDocumentation
 * @hidden
 */

import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { DRAW_INFO_SIZE, Buffer, IndirectBuffer, Attribute, BufferInfo, DrawInfo,
    AttributeName, BufferUsageBit, Format, FormatInfos, MemoryUsageBit, PrimitiveMode } from '../../core/gfx';
import { Vec3 } from '../../core/math';
import { scene } from '../../core/renderer';
import CurveRange from '../animator/curve-range';
import GradientRange from '../animator/gradient-range';
import { Material } from '../../core/assets';
import { JSB } from '../../core/default-constants';

const _vertex_attrs = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F), // xyz:position
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGBA32F), // x:index y:size zw:texcoord
    new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F), // xyz:velocity
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),
];

const _temp_v1 = new Vec3();
const _temp_v2 = new Vec3();

export class LineModel extends scene.Model {
    private _capacity: number;
    private _vertSize = 0;
    private _vBuffer: ArrayBuffer | null = null;
    private _vertAttrsFloatCount = 0;
    private _vdataF32: Float32Array | null = null;
    private _vdataUint32: Uint32Array | null = null;
    private _iaInfo: IndirectBuffer;
    private _iaInfoBuffer: Buffer;
    private _subMeshData: RenderingSubMesh | null = null;
    private _vertCount = 0;
    private _indexCount = 0;
    private _material: Material | null = null;

    constructor () {
        super();
        if (JSB) {
            (this as any)._registerListeners();
        }
        this.type = scene.ModelType.LINE;
        this._capacity = 100;
        this._iaInfo = new IndirectBuffer([new DrawInfo()]);
        this._iaInfoBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDIRECT,
            MemoryUsageBit.DEVICE,
            DRAW_INFO_SIZE,
            DRAW_INFO_SIZE,
        ));
    }

    public setCapacity (capacity: number) {
        this._capacity = capacity;
        this.createBuffer();
    }

    public createBuffer () {
        this._vertSize = 0;
        for (const a of _vertex_attrs) {
            (a as any).offset = this._vertSize;
            this._vertSize += FormatInfos[a.format].size;
        }
        this._vertAttrsFloatCount = this._vertSize / 4; // number of float
        this._vBuffer = this.createSubMeshData();
        this._vdataF32 = new Float32Array(this._vBuffer);
        this._vdataUint32 = new Uint32Array(this._vBuffer);
    }

    public updateMaterial (mat: Material) {
        this._material = mat;
        super.setSubModelMaterial(0, mat);
    }

    private createSubMeshData (): ArrayBuffer {
        if (this._subMeshData) {
            this.destroySubMeshData();
        }
        this._vertCount = 2;
        this._indexCount = 6;
        const vertexBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            this._vertSize * this._capacity * this._vertCount,
            this._vertSize,
        ));
        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertSize * this._capacity * this._vertCount);
        vertexBuffer.update(vBuffer);

        const indices: Uint16Array = new Uint16Array((this._capacity - 1) * this._indexCount);
        let dst = 0;
        for (let i = 0; i < this._capacity - 1; ++i) {
            const baseIdx = 2 * i;
            indices[dst++] = baseIdx;
            indices[dst++] = baseIdx + 1;
            indices[dst++] = baseIdx + 2;
            indices[dst++] = baseIdx + 3;
            indices[dst++] = baseIdx + 2;
            indices[dst++] = baseIdx + 1;
        }

        const indexBuffer = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            (this._capacity - 1) * this._indexCount * Uint16Array.BYTES_PER_ELEMENT,
            Uint16Array.BYTES_PER_ELEMENT,
        ));

        indexBuffer.update(indices);

        this._iaInfo.drawInfos[0].vertexCount = this._capacity * this._vertCount;
        this._iaInfo.drawInfos[0].indexCount = (this._capacity - 1) * this._indexCount;
        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = new RenderingSubMesh([vertexBuffer], _vertex_attrs, PrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        this.initSubModel(0, this._subMeshData, this._material!);
        return vBuffer;
    }

    public addLineVertexData (positions: Vec3[], width: CurveRange, color: GradientRange) {
        if (positions.length > 1) {
            let offset = 0;
            Vec3.subtract(_temp_v1, positions[1], positions[0]);
            this._vdataF32![offset++] = positions[0].x;
            this._vdataF32![offset++] = positions[0].y;
            this._vdataF32![offset++] = positions[0].z;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = width.evaluate(0, 1)!;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(0, 1)._val;
            this._vdataF32![offset++] = positions[0].x;
            this._vdataF32![offset++] = positions[0].y;
            this._vdataF32![offset++] = positions[0].z;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = width.evaluate(0, 1)!;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(0, 1)._val;
            for (let i = 1; i < positions.length - 1; i++) {
                Vec3.subtract(_temp_v1, positions[i - 1], positions[i]);
                Vec3.subtract(_temp_v2, positions[i + 1], positions[i]);
                Vec3.subtract(_temp_v2, _temp_v2, _temp_v1);
                const seg = i / positions.length;
                this._vdataF32![offset++] = positions[i].x;
                this._vdataF32![offset++] = positions[i].y;
                this._vdataF32![offset++] = positions[i].z;
                this._vdataF32![offset++] = 0;
                this._vdataF32![offset++] = width.evaluate(seg, 1)!;
                this._vdataF32![offset++] = seg;
                this._vdataF32![offset++] = 0;
                this._vdataF32![offset++] = _temp_v2.x;
                this._vdataF32![offset++] = _temp_v2.y;
                this._vdataF32![offset++] = _temp_v2.z;
                this._vdataUint32![offset++] = color.evaluate(seg, 1)._val;
                this._vdataF32![offset++] = positions[i].x;
                this._vdataF32![offset++] = positions[i].y;
                this._vdataF32![offset++] = positions[i].z;
                this._vdataF32![offset++] = 1;
                this._vdataF32![offset++] = width.evaluate(seg, 1)!;
                this._vdataF32![offset++] = seg;
                this._vdataF32![offset++] = 1;
                this._vdataF32![offset++] = _temp_v2.x;
                this._vdataF32![offset++] = _temp_v2.y;
                this._vdataF32![offset++] = _temp_v2.z;
                this._vdataUint32![offset++] = color.evaluate(seg, 1)._val;
            }
            Vec3.subtract(_temp_v1, positions[positions.length - 1], positions[positions.length - 2]);
            this._vdataF32![offset++] = positions[positions.length - 1].x;
            this._vdataF32![offset++] = positions[positions.length - 1].y;
            this._vdataF32![offset++] = positions[positions.length - 1].z;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = width.evaluate(1, 1)!;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = 0;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(1, 1)._val;
            this._vdataF32![offset++] = positions[positions.length - 1].x;
            this._vdataF32![offset++] = positions[positions.length - 1].y;
            this._vdataF32![offset++] = positions[positions.length - 1].z;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = width.evaluate(1, 1)!;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = 1;
            this._vdataF32![offset++] = _temp_v1.x;
            this._vdataF32![offset++] = _temp_v1.y;
            this._vdataF32![offset++] = _temp_v1.z;
            this._vdataUint32![offset++] = color.evaluate(1, 1)._val;
        }
        this.updateIA(Math.max(0, positions.length - 1));
    }

    public updateIA (count: number) {
        const ia = this._subModels[0].inputAssembler;
        ia.vertexBuffers[0].update(this._vdataF32!);
        this._iaInfo.drawInfos[0].firstIndex = 0;
        this._iaInfo.drawInfos[0].indexCount = this._indexCount * count;
        this._iaInfoBuffer.update(this._iaInfo);
    }

    private destroySubMeshData () {
        if (this._subMeshData) {
            this._subMeshData.destroy();
            this._subMeshData = null;
        }
    }
}
