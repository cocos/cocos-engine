/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { InputAssembler, Device, Attribute } from '../../gfx';
import { MeshBuffer } from './mesh-buffer';
import { BufferAccessor } from './buffer-accessor';
import { assertID, macro, assertIsNonNullable } from '../../core';

export class LinearBufferAccessor extends BufferAccessor {
    public static IB_SCALE = 4; // ib size scale based on vertex count
    // Buffer cursors for the current mesh buffer
    public byteStart = 0;
    public indexStart = 0;
    public vertexStart = 0;

    public get byteOffset () { return this._buffers[this._currentId].byteOffset; }
    public get vertexOffset () { return this._buffers[this._currentId].vertexOffset; }
    public get indexOffset () { return this._buffers[this._currentId].indexOffset; }
    public get currentBuffer (): Readonly<MeshBuffer> { return this._buffers[this._currentId]; }

    private _currentId = -1;

    public constructor (device: Device, attributes: Attribute[]) {
        super(device, attributes);
        // Initialize first mesh buffer
        this._allocateBuffer();
    }

    public destroy () {
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

        for (let i = 0; i <= this._currentId; ++i) {
            const buf = this._buffers[i];
            buf.byteOffset = 0;
            buf.indexOffset = 0;
            buf.vertexOffset = 0;
            this._buffers[i].reset();
        }
        this._currentId = 0;
    }

    public request (vertexCount = 4, indexCount = 6) {
        const buf = this._buffers[this._currentId];
        this._allocateChunk(vertexCount, indexCount);

        // Mesh buffer might be switched, can't use initial offsets
        buf.vertexOffset += vertexCount;
        buf.indexOffset += indexCount;
        buf.byteOffset += vertexCount * this.vertexFormatBytes;
        buf.setDirty();
    }

    public appendBuffers (vertices: Float32Array, indices: Uint16Array) {
        const vertexCount = vertices.length / this._floatsPerVertex;
        this._allocateChunk(vertexCount, indices.length);
        const buf = this._buffers[this._currentId];
        // Float offset calculation only valid for Float32 vertex buffer
        buf.vData.set(vertices, buf.byteOffset >> 2);

        const iData = buf.iData;
        const vertexId = buf.vertexOffset;
        let indexOffset = buf.indexOffset;
        for (let i = 0; i < indices.length; ++i, ++indexOffset) {
            iData[indexOffset] = vertexId + indices[i];
        }

        buf.vertexOffset += vertexCount;
        buf.indexOffset += indices.length;
        buf.byteOffset += vertices.byteLength;
        buf.setDirty();
    }

    public recordBatch (): InputAssembler | null {
        const buf = this._buffers[this._currentId];
        const vCount = buf.indexOffset - this.indexStart;
        if (!vCount) {
            return null;
        }

        const ia = buf.requireFreeIA(this._device);
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

    private _allocateChunk (vertexCount: number, indexCount: number) {
        let switchedBuffer = false;
        const buf = this._buffers[this._currentId];
        const byteOffset = buf.byteOffset + vertexCount * this.vertexFormatBytes;
        const indexOffset = buf.indexOffset + indexCount;
        const byteLength = buf.vData.byteLength;
        const indicesLength = buf.iData.length;
        if (byteOffset > byteLength || indexOffset > indicesLength) {
            const success = buf.checkCapacity(vertexCount, indexCount);
            // No enough space in the current mesh buffer
            if (!success) {
                this._allocateBuffer();
                switchedBuffer = true;
            }
        }
        return switchedBuffer;
    }

    private _allocateBuffer () {
        const id = this._currentId + 1;
        const l = this._buffers.length;
        // Validate length of buffer array
        assertID(id <= l, 9003);
        // Out of bound, new mesh buffer required
        if (id === l) {
            const buffer = new MeshBuffer();
            const vCount = Math.floor(macro.BATCHER2D_MEM_INCREMENT * 1024 / this._vertexFormatBytes);
            const iCount = vCount * LinearBufferAccessor.IB_SCALE;
            buffer.initialize(this._device, this._attributes, vCount * this._floatsPerVertex, iCount);
            this._buffers.push(buffer);
        }
        this.byteStart = 0;
        this.indexStart = 0;
        this.vertexStart = 0;
        this._currentId = id;
    }
}
