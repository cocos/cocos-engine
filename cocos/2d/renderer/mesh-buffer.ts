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
import { Device, BufferUsageBit, MemoryUsageBit, Attribute, Buffer, BufferInfo, InputAssembler, InputAssemblerInfo } from '../../core/gfx';
import { ScalableContainer } from '../../core/memop/scalable-container';
import { getComponentPerVertex } from './vertex-format';
import { warnID } from '../../core/platform/debug';

export class MeshBuffer extends ScalableContainer {
    public static OPACITY_OFFSET = 8;

    get attributes () { return this._attributes; }
    get vertexFormatBytes () { return this._vertexFormatBytes; }
    get vertexBuffers (): Readonly<Buffer[]> { return this._vertexBuffers; }
    get indexBuffer () { return this._indexBuffer; }

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
    private _vertexBuffers: Buffer[] = [];
    private _indexBuffer: Buffer = null!;

    // InputAssembler pools for each mesh buffer, array offset correspondent
    private _iaPool: InputAssembler[] = [];
    private _iaInfo: InputAssemblerInfo = null!;
    private _nextFreeIAHandle = 0;

    public initialize (device: Device, attrs: Attribute[]) {
        const floatCount = getComponentPerVertex(attrs);
        const vbStride = this._vertexFormatBytes = floatCount * Float32Array.BYTES_PER_ELEMENT;
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        this._initVDataCount = 256 * floatCount;
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

        this._iaInfo = new InputAssemblerInfo(this._attributes, this._vertexBuffers, this.indexBuffer);
    }

    public reset () {
        this.byteOffset = 0;
        this.indexOffset = 0;
        this.vertexOffset = 0;
        this._nextFreeIAHandle = 0;
        this._dirty = false;
    }

    public destroy () {
        this.reset();
        this._attributes = null!;

        if (this._vertexBuffers[0]) {
            this._vertexBuffers[0].destroy();
        }
        this._vertexBuffers.length = 0;

        if (this._indexBuffer) {
            this._indexBuffer.destroy();
        }
        this._indexBuffer = null!;

        // Destroy InputAssemblers
        for (let i = 0; i < this._iaPool.length; ++i) {
            this._iaPool[i].destroy();
        }
        this._iaPool.length = 0;

        super.destroy();
    }

    public setDirty () {
        this._dirty = true;
    }

    /**
     * @deprecated since v3.4.0, please use BufferAccessor's request
     * @see [[BufferAccessor.request]]
     */
    public request (vertexCount: number, indexCount: number) {
        warnID(9002);
        return false;
    }

    public requireFreeIA (device: Device) {
        if (this._iaPool.length <= this._nextFreeIAHandle) {
            this._iaPool.push(device.createInputAssembler(this._iaInfo));
        }
        const ia = this._iaPool[this._nextFreeIAHandle++];
        return ia;
    }

    public recycleIA (ia: InputAssembler) {
        const pool = this._iaPool;
        const id = pool.indexOf(ia);
        if (id >= 0 && id < this._nextFreeIAHandle) {
            // Swap to recycle the ia
            pool[id] = pool[--this._nextFreeIAHandle];
            pool[this._nextFreeIAHandle] = ia;
        }
    }

    public ensureCapacity (vertexCount: number, indexCount: number) {
        const maxVertex = this.vertexOffset + vertexCount;
        const maxIndex = this.indexOffset + indexCount;
        if (maxVertex > 65535) {
            return false;
        }
        const maxByte = maxVertex * this.vertexFormatBytes;
        let byteLength = this.vData!.byteLength;
        let indexLength = this.iData!.length;
        let realloc = false;
        while (byteLength < maxByte) {
            this._initVDataCount *= 2;
            byteLength = this._initVDataCount * 4;
            realloc = true;
        }
        while (indexLength < maxIndex) {
            this._initIDataCount *= 2;
            indexLength = this._initIDataCount;
            realloc = true;
        }
        if (realloc) {
            this._reallocBuffer();
        }
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
            newData.set(oldVData);
        }
    }

    private _reallocIData (copyOldData: boolean) {
        const oldIData = this.iData;

        this.iData = new Uint16Array(this._initIDataCount);

        if (oldIData && copyOldData) {
            const iData = this.iData;
            iData.set(oldIData);
        }
    }
}
