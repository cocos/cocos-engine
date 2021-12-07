/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

import { InputAssemblerInfo, Buffer, InputAssembler, Device } from '../../core/gfx';
import { BufferAccessor } from './buffer-accessor';

export class LinearBufferAccessor extends BufferAccessor {
    public byteStart = 0;
    public indexStart = 0;
    public vertexStart = 0;

    private _vertexBuffers: Buffer[] = [];
    private _iaInfo: InputAssemblerInfo = null!;
    private _hInputAssemblers: InputAssembler[] = [];
    private _nextFreeIAHandle = 0;

    // Invoked by setBuffer
    initialize () {
        this._vertexBuffers[0] = this.buffer.vertexBuffer;
        this._iaInfo = new InputAssemblerInfo(this.buffer.attributes, this._vertexBuffers, this.buffer.indexBuffer);
    }

    public destroy () {
        for (let i = 0; i < this._hInputAssemblers.length; i++) {
            this._hInputAssemblers[i].destroy();
        }
        this._hInputAssemblers.length = 0;
    }

    public reset () {
        this.byteStart = 0;
        this.indexStart = 0;
        this.vertexStart = 0;
        this._nextFreeIAHandle = 0;
    }

    public request (vertexCount = 4, indexCount = 6) {
        const buf = this.buffer;
        const vertexOffset = buf.vertexOffset + vertexCount;
        const byteOffset = buf.byteOffset + vertexCount * buf.vertexFormatBytes;
        const indexOffset = buf.indexOffset + indexCount;

        let byteLength = buf.vData!.byteLength;
        let indicesLength = buf.iData!.length;
        if (byteOffset > byteLength || indexOffset > indicesLength) {
            let success = buf.ensureCapacity(vertexCount, indexCount);
            if (!success) {
                return false;
            }
        }

        buf.vertexOffset = vertexOffset;
        buf.indexOffset = indexOffset;
        buf.byteOffset = byteOffset;
        buf.setDirty();
        return true;
    }

    public recordBatch (device: Device): InputAssembler | null {
        const vCount = this.buffer.indexOffset - this.indexStart;
        if (!vCount) {
            return null;
        }

        if (this._hInputAssemblers.length <= this._nextFreeIAHandle) {
            this._hInputAssemblers.push(device.createInputAssembler(this._iaInfo));
        }

        const ia = this._hInputAssemblers[this._nextFreeIAHandle++];

        ia.firstIndex = this.indexStart;
        ia.indexCount = vCount;

        this.vertexStart = this.buffer.vertexOffset;
        this.indexStart = this.buffer.indexOffset;
        this.byteStart = this.buffer.byteOffset;

        return ia;
    }
}