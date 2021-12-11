/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
 * @module ui
 */
import { Device, BufferUsageBit, MemoryUsageBit, Attribute, Buffer, BufferInfo } from '../../core/gfx';
import { ScalableContainer } from '../../core/memop/scalable-container';
import { BufferAccessor } from './buffer-accessor';
import type { LinearBufferAccessor } from './linear-buffer-accessor';
import { getComponentPerVertex } from './vertex-format';
import { warnID } from '../../core/platform/debug';

export class MeshBuffer extends ScalableContainer {
    public static OPACITY_OFFSET = 8;

    get accessor () { return this._accessor; }
    get attributes () { return this._attributes; }
    get vertexFormatBytes () { return this._vertexFormatBytes; }
    get vertexBuffers (): Readonly<Buffer[]> { return this._vertexBuffers; }
    get indexBuffer () { return this._indexBuffer; }

    /**
     * @deprecated since v3.4.0 please use LinearBufferAccessor.byteStart instead
     * @see [[LinearBufferAccessor.byteStart]]
     */
    get byteStart () { return this._accessor ? (this._accessor as LinearBufferAccessor).byteStart : 0; }
    set byteStart (start: number) { if (this._accessor) { (this._accessor as LinearBufferAccessor).byteStart = start; } }

    /**
     * @deprecated since v3.4.0 please use LinearBufferAccessor.indexStart instead
     * @see [[LinearBufferAccessor.indexStart]]
     */
    get indicesStart () { return this._accessor ? (this._accessor as LinearBufferAccessor).indexStart : 0; }
    set indicesStart (start: number) { if (this._accessor) { (this._accessor as LinearBufferAccessor).indexStart = start; } }

    /**
     * @deprecated since v3.4.0 please use LinearBufferAccessor.vertexStart instead
     * @see [[LinearBufferAccessor.vertexStart]]
     */
    get vertexStart () { return this._accessor ? (this._accessor as LinearBufferAccessor).vertexStart : 0; }
    set vertexStart (start: number) { if (this._accessor) { (this._accessor as LinearBufferAccessor).vertexStart = start; } }

    public byteOffset = 0;
    public vertexOffset = 0;
    public indexOffset = 0;
    public vData: Float32Array | null = null;
    public iData: Uint16Array | null = null;

    private _dirty = false;
    private _vertexFormatBytes = 0;
    private _initVDataCount = 0;
    private _initIDataCount = 256 * 6;
    private _lastUsedVDataSize = 0;
    private _lastUsedIDataSize = 0;
    private _attributes: Attribute[] = null!;
    private _accessor: BufferAccessor | null = null;
    private _vertexBuffers: Buffer[] = [];
    private _indexBuffer: Buffer = null!;

    public initialize (device: Device, attrs: Attribute[]) {
        const floatCount = getComponentPerVertex(attrs);
        const vbStride = this._vertexFormatBytes = floatCount * Float32Array.BYTES_PER_ELEMENT;
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        this._initVDataCount = 256 * this._vertexFormatBytes;
        this._attributes = attrs;

        this._vertexBuffers[0] = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            vbStride,
            vbStride,
        ));
        this._indexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            ibStride,
            ibStride,
        ));

        // for recycle pool using purpose --
        if (!this.vData || !this.iData) {
            this._reallocBuffer();
        }
        // ----------
    }

    public reset () {
        this.byteOffset = 0;
        this.indexOffset = 0;
        this.vertexOffset = 0;
        this._dirty = false;
    }

    public destroy () {
        this._attributes = null!;

        if (this._vertexBuffers[0]) {
            this._vertexBuffers[0].destroy();
        }
        this._vertexBuffers.length = 0;

        if (this._indexBuffer) {
            this._indexBuffer.destroy();
        }
        this._indexBuffer = null!;

        super.destroy();
    }

    public setDirty () {
        this._dirty = true;
    }

    /**
     * @deprecated since v3.4.0, please use meshBuffer.accessor.request
     * @see [[BufferAccessor.request]]
     */
    public request (vertexCount: number, indexCount: number) {
        if (!this._accessor) {
            warnID(9003);
            return false;
        }
        return this._accessor.request(vertexCount, indexCount);
    }

    public ensureCapacity (vertexCount: number, indexCount: number) {
        const maxVertex = this.vertexOffset + vertexCount;
        const maxIndex = this.indexOffset + indexCount;
        if (maxVertex > 65535) {
            return false;
        }
        const maxByte = maxVertex * this.vertexFormatBytes;
        let byteLength = this.vData!.byteLength;
        let indicesLength = this.iData!.length;
        while (byteLength < maxByte || indicesLength < maxIndex) {
            this._initVDataCount *= 2;
            this._initIDataCount *= 2;

            byteLength = this._initVDataCount * 4;
            indicesLength = this._initIDataCount;
        }

        this._reallocBuffer();
        return true;
    }

    public tryShrink () {
        if (this._dirty || !this.vData || !this.iData) return;
        if (this.vData.byteLength >> 2 > this._lastUsedVDataSize && this.iData.length >> 2 > this._lastUsedIDataSize) {
            const vDataCount = Math.max(256 * this._vertexFormatBytes, this._initVDataCount >> 1);
            const iDataCount = Math.max(256 * 6, this._initIDataCount >> 1);
            if (vDataCount !== this._initVDataCount || iDataCount !== this._initIDataCount) {
                this._initIDataCount = iDataCount;
                this._initVDataCount = vDataCount;
                this._reallocBuffer();
            }
        }
    }

    public uploadBuffers () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        const verticesData = new Float32Array(this.vData!.buffer, 0, this.byteOffset >> 2);
        const indicesData = new Uint16Array(this.iData!.buffer, 0, this.indexOffset);

        const vertexBuffer = this._vertexBuffers[0];
        if (this.byteOffset > vertexBuffer.size) {
            vertexBuffer.resize(this.byteOffset);
        }
        vertexBuffer.update(verticesData);

        if (this.indexOffset * 2 > this.indexBuffer.size) {
            this.indexBuffer.resize(this.indexOffset * 2);
        }
        this.indexBuffer.update(indicesData);
        this._lastUsedVDataSize = this.byteOffset;
        this._lastUsedIDataSize = this.indexOffset;
        this._dirty = false;
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
