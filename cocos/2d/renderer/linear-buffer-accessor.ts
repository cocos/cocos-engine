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

import { InputAssemblerInfo, InputAssembler, Device, Attribute } from '../../core/gfx';
import { MeshBuffer } from './mesh-buffer';
import { BufferAccessor } from './buffer-accessor';
import { assertID } from '../../core/platform/debug';
import { assertIsNonNullable } from '../../core/data/utils/asserts';

export class LinearBufferAccessor extends BufferAccessor {
    // Buffer cursors for the current mesh buffer
    public byteStart = 0;
    public indexStart = 0;
    public vertexStart = 0;

    private _currentId = -1;
    // InputAssembler pools for each mesh buffer, array offset correspondent
    private _iaPools: InputAssembler[][] = [];
    private _iaInfos: InputAssemblerInfo[] = [];
    private _nextFreeIAHandle = 0;

    public constructor (device: Device, attributes: Attribute[]) {
        super(device, attributes);
        // Initialize first mesh buffer
        this._allocateBuffer();
    }

    public destroy () {
        // Destroy InputAssemblers
        for (let i = 0; i < this._iaPools.length; ++i) {
            const iaPool = this._iaPools[i];
            for (let j = 0; j < iaPool.length; ++j) {
                iaPool[j].destroy();
            }
        }
        this._iaPools.length = 0;
        // Destroy mesh buffers
        for (let i = 0; i < this._buffers.length; ++i) {
            this._buffers[i].destroy();
        }
        this._buffers.length = 0;
        super.destroy();
    }

    public reset () {
        this.byteStart = 0;
        this.indexStart = 0;
        this.vertexStart = 0;
        this._nextFreeIAHandle = 0;

        for (let i = 0; i <= this._currentId; ++i) {
            this._buffers[i].reset();
        }
        this._currentId = 0;
    }

    public request (vertexCount = 4, indexCount = 6) {
        let switchedBuffer = false;
        let buf = this._buffers[this._currentId];
        const byteIncrement = vertexCount * buf.vertexFormatBytes;
        const byteOffset = buf.byteOffset + byteIncrement;
        const indexOffset = buf.indexOffset + indexCount;

        const byteLength = buf.vData!.byteLength;
        const indicesLength = buf.iData!.length;
        if (byteOffset > byteLength || indexOffset > indicesLength) {
            const success = buf.ensureCapacity(vertexCount, indexCount);
            // No enough space in the current mesh buffer
            if (!success) {
                this._allocateBuffer();
                buf = this._buffers[this._currentId];
                switchedBuffer = true;
            }
        }

        // Mesh buffer might be switched, can't use initial offsets
        buf.vertexOffset += vertexCount;
        buf.indexOffset += indexCount;
        buf.byteOffset += byteIncrement;
        buf.setDirty();
        return switchedBuffer;
    }

    public recordBatch (): InputAssembler | null {
        const buf = this._buffers[this._currentId];
        const vCount = buf.indexOffset - this.indexStart;
        if (!vCount) {
            return null;
        }

        const iaPool = this._iaPools[this._currentId];
        if (iaPool.length <= this._nextFreeIAHandle) {
            iaPool.push(this._device.createInputAssembler(this._iaInfos[this._currentId]));
        }

        const ia = iaPool[this._nextFreeIAHandle++];
        ia.firstIndex = this.indexStart;
        ia.indexCount = vCount;

        // Reset mesh buffer data cursor
        this.vertexStart = buf.vertexOffset;
        this.indexStart = buf.indexOffset;
        this.byteStart = buf.byteOffset;
        return ia;
    }

    public uploadBuffers () {
        assertIsNonNullable(this._buffers[this._currentId]);
        for (let i = 0; i <= this._currentId; ++i) {
            this._buffers[i].uploadBuffers();
        }
    }

    private _allocateBuffer () {
        const id = this._currentId + 1;
        const l = this._buffers.length;
        // Validate length of related arrays
        assertID(this._iaPools[id].length === l && this._iaInfos.length === l && id <= l, 9004);
        // Out of bound, new mesh buffer required
        if (id === l) {
            const buffer = new MeshBuffer();
            buffer.initialize(this._device, this._attributes);
            this._buffers.push(buffer);
            const iaInfo = new InputAssemblerInfo(this._attributes, buffer.vertexBuffers, buffer.indexBuffer);
            this._iaInfos.push(iaInfo);
            this._iaPools.push([]);
        }
        this._currentId = id;
        this._nextFreeIAHandle = 0;
    }
}
