/**
 * @category ui
 */
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXInputAssembler, IGFXAttribute } from '../../gfx/input-assembler';
import { UI } from '../../renderer/ui/ui';

export class MeshBuffer {
    public batcher: UI;

    public vData: Float32Array | null = null;
    public iData: Uint16Array | null = null;
    public vb: GFXBuffer | null = null;
    public ib: GFXBuffer | null = null;
    public ia: GFXInputAssembler | null = null;
    // public vbCount: number = 0;
    // public vbSize: number = 0;
    // public ibCount: number = 0;
    // public ibSize: number = 0;

    public byteStart: number = 0;
    public byteOffset: number = 0;
    public indiceStart: number = 0;
    public indiceOffset: number = 0;
    public vertexStart: number = 0;
    public vertexOffset: number = 0;

    public dirty = false;

    // NOTE:
    // actually 256 * 4 * (vertexFormat._bytes / 4)
    // include pos, uv, color in ui attributes
    private _vertexFormatBytes = 9 * Float32Array.BYTES_PER_ELEMENT;
    private _initVDataCount = 256 * this._vertexFormatBytes;
    private _initIDataCount = 256 * 6;
    private _outofCallback: ((...args: number[]) => void) | null = null;

    constructor (batcher: UI) {
        this.batcher = batcher;
    }

    public initialize (attrs: IGFXAttribute[], outofCallback: ((...args: number[]) => void) | null) {
        this._outofCallback = outofCallback;
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 9;

        this.vb = this.vb || this.batcher.device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: 0,
            stride: vbStride,
        });

        const ibStride = Uint16Array.BYTES_PER_ELEMENT;

        this.ib = this.ib || this.batcher.device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: 0,
            stride: ibStride,
        });

        this.ia = this.ia || this.batcher.device.createInputAssembler({
            attributes: attrs,
            vertexBuffers: [this.vb],
            indexBuffer: this.ib,
        });

        this._reallocBuffer();

        // const batch = this._bufferBatchPool.add();
        // batch.vb = vb;
        // batch.ib = ib;
        // batch.ia = ia;
        // batch.vf32 = null;
        // batch.vui16 = null;
        // batch.vbSize = vb.size;
        // batch.ibSize = ib.size;
    }

    public request (vertexCount = 4, indiceCount = 6) {
        const byteOffset = this.byteOffset + vertexCount * this._vertexFormatBytes;
        const indiceOffset = this.indiceOffset + indiceCount;

        if (vertexCount + this.vertexOffset > 65535) {
            // merge last state
            this.batcher.autoMergeBatches();
            if (this._outofCallback) {
                this._outofCallback.call(this.batcher, vertexCount, indiceCount);
            }
            return false;
        }

        let byteLength = this.vData!.byteLength;
        let indiceLength = this.iData!.length;
        if (byteOffset > byteLength || indiceOffset > indiceLength) {
            while (byteLength < byteOffset || indiceLength < indiceOffset) {
                this._initVDataCount *= 2;
                this._initIDataCount *= 2;

                byteLength = this._initVDataCount * 4;
                indiceLength = this._initIDataCount;
            }

            this._reallocBuffer();
        }

        this.vertexOffset += vertexCount;
        this.indiceOffset += indiceCount;
        this.byteOffset = byteOffset;

        this.dirty = true;
        return true;
    }

    public reset () {
        // this._arrOffset = 0;
        // this._vb = this._vbArr[0];
        // this._ib = this._ibArr[0];

        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;

        this.dirty = false;
    }

    public destroy () {
        // for (const key in this._vbArr) {
        //     const vb = this._vbArr[key];
        //     vb.destroy();
        // }
        // this._vbArr = undefined;

        // for (const key in this._ibArr) {
        //     const ib = this._ibArr[key];
        //     ib.destroy();
        // }
        // this._ibArr = undefined;
        this.ib!.destroy();
        this.vb!.destroy();
        this.ia!.destroy();
        this.ib = null;
        this.vb = null;
        this.ia = null;
    }

    public uploadData () {
        if (this.byteOffset === 0 || !this.dirty) {
            return;
        }

        const vertexsData = new Float32Array(this.vData!.buffer, 0, this.byteOffset >> 2);
        const indicesData = new Uint16Array(this.iData!.buffer, 0, this.indiceOffset);

        if (this.byteOffset > this.vb!.size) {
            this.vb!.resize(this.byteOffset);
        }
        this.vb!.update(vertexsData);

        if (this.indiceOffset * 2 > this.ib!.size) {
            this.ib!.resize(this.indiceOffset * 2);
        }
        this.ib!.update(indicesData);
    }

    private _reallocBuffer () {
        this._reallocVData(true);
        this._reallocIData(true);
    }

    private _reallocVData (copyOldData) {
        let oldVData;
        if (this.vData) {
            oldVData = new Uint8Array(this.vData.buffer);
        }

        this.vData = new Float32Array(this._initVDataCount);

        if (oldVData && copyOldData) {
            const newData = new Uint8Array(this.vData.buffer);
            for (let i = 0, l = oldVData.length; i < l; i++) {
                newData[i] = oldVData[i];
            }
        }
    }

    private _reallocIData (copyOldData) {
        const oldIData = this.iData;

        this.iData = new Uint16Array(this._initIDataCount);

        if (oldIData && copyOldData) {
            const iData = this.iData;
            for (let i = 0, l = oldIData.length; i < l; i++) {
                iData[i] = oldIData[i];
            }
        }
    }
}
