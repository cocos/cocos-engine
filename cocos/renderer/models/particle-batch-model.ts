// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../gfx';

import { Model } from '../scene/model';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXFormat, GFXAttributeName, GFXPrimitiveMode, GFXFormatInfos } from '../../gfx/define';
import { IGFXInputAttribute } from '../../gfx/input-assembler';
import { GFXBuffer, GFX_DRAW_INFO_SIZE, IGFXIndirectBuffer } from '../../gfx/buffer';

export default class ParticleBatchModel extends Model {

    private _capacity: number;
    private _vertAttrs: IGFXInputAttribute[] | null;
    private _vertSize: number;
    private _vBuffer: ArrayBuffer | null;
    private _vertAttrsFloatCount: number;
    private _vdataF32: Float32Array | null;
    private _vdataUint32: Uint32Array | null;
    private _iaInfo: IGFXIndirectBuffer;
    private _iaInfoBuffer: GFXBuffer;

    constructor () {
        super();

        this._type = 'particle-batch';
        this._capacity = 0;
        this._vertAttrs = null;
        this._vertSize = 0;
        this._vBuffer = null;
        this._vertAttrsFloatCount = 0;
        this._vdataF32 = null;
        this._vdataUint32 = null;
        this._iaInfo = {
            drawInfos: [{
                vertexCount: 0,
                firstVertex: 0,
                indexCount: 0,
                firstIndex: 0,
                vertexOffset: 0,
                instanceCount: 0,
                firstInstance: 0
            }]
        };
        this._iaInfoBuffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDIRECT,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: GFX_DRAW_INFO_SIZE,
            stride: 1,
        });
    }

    public setCapacity (capacity: number) {
        this._capacity = capacity;
    }

    public setVertexAttributes (attrs: IGFXInputAttribute[]) {
        this._vertAttrs = attrs;
        this._vertSize = 0;
        for (const a of this._vertAttrs) {
            this._vertSize += GFXFormatInfos[a.format].size;
        }
        // rebuid
        this._vBuffer = this._createInputAssembler();
        this._vertAttrsFloatCount = this._vertSize / 4; // number of float
        this._vBuffer = new ArrayBuffer(this._capacity * this._vertSize * 4);
        this._vdataF32 = new Float32Array(this._vBuffer);
        this._vdataUint32 = new Uint32Array(this._vBuffer);
    }

    public _createInputAssembler (): ArrayBuffer {
        const vertexBuffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: this._vertSize * this._capacity * 4,
            stride: this._vertSize,
        });
        const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertSize * this._capacity * 4);
        vertexBuffer.update(vBuffer);

        const indices: Uint16Array = new Uint16Array(this._capacity * 6);
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

        const indexBuffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: this._capacity * 6 * Uint16Array.BYTES_PER_ELEMENT,
            stride: Uint16Array.BYTES_PER_ELEMENT,
        });

        indexBuffer.update(indices);

        this._iaInfo.drawInfos[0].vertexCount = this._capacity * 4;
        this._iaInfo.drawInfos[0].indexCount = this._capacity * 6;
        this._iaInfoBuffer.update(this._iaInfo);

        this.subMeshData = {
            inputAssembler: this._device.createInputAssembler({
                attributes: this._vertAttrs!,
                vertexBuffers: [vertexBuffer],
                indexBuffer,
                indirectBuffer: this._iaInfoBuffer,
            }),
            primitiveMode: GFXPrimitiveMode.TRIANGLE_LIST,
        };
        return vBuffer;
    }

    public enableStretchedBillboard () {
        if (this._vertAttrs!.find((attr) => attr.name === GFXAttributeName.ATTR_COLOR1) === undefined) {
            this._vertAttrs!.push({ name: GFXAttributeName.ATTR_COLOR1, format: GFXFormat.RGB32F });
            this.setVertexAttributes(this._vertAttrs!);
        }
    }

    public disableStretchedBillboard () {
        if (this._vertAttrs!.find((attr) => attr.name === gfx.ATTR_COLOR0) !== undefined) {
            this._vertAttrs!.pop();
            this.setVertexAttributes(this._vertAttrs!);
        }
    }

    public addParticleVertexData (index: number, pvdata: [any]) {
        // if (pvdata.length !== this._vertAttrs.length) {
        //   console.error('particle vertex stream data not match.');
        // }
        let offset: number = index * this._vertAttrsFloatCount;
        for (let i = 0; i < this._vertAttrs!.length; ++i) {
            const curAttr: IGFXInputAttribute = this._vertAttrs![i];
            if (curAttr.format === GFXFormat.R32F) {
                this._vdataF32![offset] = pvdata[i]; // if not a single float?
                offset++;
            } else if (curAttr.format === GFXFormat.RG32F) {
                this._vdataF32![offset] = pvdata[i].x;
                this._vdataF32![offset + 1] = pvdata[i].y;
                offset += 2;
            } else if (curAttr.format === GFXFormat.RGB32F) {
                this._vdataF32![offset] = pvdata[i].x;
                this._vdataF32![offset + 1] = pvdata[i].y;
                this._vdataF32![offset + 2] = pvdata[i].z;
                offset += 3;
            } else if (curAttr.format === GFXFormat.RGBA8) {
                this._vdataUint32![offset] = pvdata[i];
                offset += 1;
            } else {
                console.error('particle vertex attribute format not support');
            }
        }
    }

    public updateIA (count: number) {
        this._subMeshObject!.inputAssembler.vertexBuffers[0].update(this._vdataF32!);
        this._subMeshObject!.inputAssembler.indexCount = count;
        this._subMeshObject!.inputAssembler.extractDrawInfo(this._iaInfo.drawInfos[0]);
        this._iaInfoBuffer.update(this._iaInfo);
    }

    public clear () {
        this._subMeshObject!.inputAssembler.indexCount = 0;
    }

    public destroy () {
        this._vdataF32 = null;
        this._subMeshObject!.inputAssembler.destroy();
        this._iaInfoBuffer.destroy();
    }
}
