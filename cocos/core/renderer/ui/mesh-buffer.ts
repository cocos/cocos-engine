/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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

/**
 * @category ui
 */

import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { IGFXAttribute } from '../../gfx/input-assembler';
import { UI } from './ui';

export class MeshBuffer {
    public static OPACITY_OFFSET = 8;
    public batcher: UI;

    public vData: Float32Array | null = null;
    public iData: Uint16Array | null = null;
    public vb: GFXBuffer | null = null;
    public ib: GFXBuffer | null = null;
    public attributes: IGFXAttribute[] | null = null;

    public byteStart = 0;
    public byteOffset = 0;
    public indicesStart = 0;
    public indicesOffset = 0;
    public vertexStart = 0;
    public vertexOffset = 0;
    public lastByteOffset = 1;

    public dirty = false;

    // NOTE:
    // actually 256 * 4 * (vertexFormat._bytes / 4)
    // include pos, uv, color in ui attributes
    private _vertexFormatBytes = 9 * Float32Array.BYTES_PER_ELEMENT;
    private _initVDataCount = 256 * this._vertexFormatBytes;
    private _initIDataCount = 256 * 6;
    private _outOfCallback: ((...args: number[]) => void) | null = null;

    constructor (batcher: UI) {
        this.batcher = batcher;
    }

    public initialize (attrs: IGFXAttribute[], outOfCallback: ((...args: number[]) => void) | null) {
        this._outOfCallback = outOfCallback;
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 9;

        this.vb = this.vb || this.batcher.device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbStride,
            stride: vbStride,
        });

        const ibStride = Uint16Array.BYTES_PER_ELEMENT;

        this.ib = this.ib || this.batcher.device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibStride,
            stride: ibStride,
        });

        this.attributes = attrs;

        this._reallocBuffer();
    }

    public request (vertexCount = 4, indicesCount = 6) {
        this.lastByteOffset = this.byteOffset;
        const byteOffset = this.byteOffset + vertexCount * this._vertexFormatBytes;
        const indicesOffset = this.indicesOffset + indicesCount;

        if (vertexCount + this.vertexOffset > 65535) {
            // merge last state
            this.batcher.autoMergeBatches();
            if (this._outOfCallback) {
                this._outOfCallback.call(this.batcher, vertexCount, indicesCount);
            }
            return false;
        }

        let byteLength = this.vData!.byteLength;
        let indicesLength = this.iData!.length;
        if (byteOffset > byteLength || indicesOffset > indicesLength) {
            while (byteLength < byteOffset || indicesLength < indicesOffset) {
                this._initVDataCount *= 2;
                this._initIDataCount *= 2;

                byteLength = this._initVDataCount * 4;
                indicesLength = this._initIDataCount;
            }

            this._reallocBuffer();
        }

        this.vertexOffset += vertexCount;
        this.indicesOffset += indicesCount;
        this.byteOffset = byteOffset;

        this.dirty = true;
        return true;
    }

    public reset () {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indicesStart = 0;
        this.indicesOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;
        this.lastByteOffset = 0;

        this.dirty = false;
    }

    public destroy () {
        this.ib!.destroy();
        this.vb!.destroy();
        this.ib = null;
        this.vb = null;
        this.attributes = null;
    }

    public uploadData () {
        if (this.byteOffset === 0 || !this.dirty) {
            return;
        }

        const verticesData = new Float32Array(this.vData!.buffer, 0, this.byteOffset >> 2);
        const indicesData = new Uint16Array(this.iData!.buffer, 0, this.indicesOffset);

        if (this.byteOffset > this.vb!.size) {
            this.vb!.resize(this.byteOffset);
        }
        this.vb!.update(verticesData);

        if (this.indicesOffset * 2 > this.ib!.size) {
            this.ib!.resize(this.indicesOffset * 2);
        }
        this.ib!.update(indicesData);
    }

    private _reallocBuffer () {
        this._reallocVData(true);
        this._reallocIData(true);
    }

    private _reallocVData (copyOldData: boolean) {
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

    private _reallocIData (copyOldData: boolean) {
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
