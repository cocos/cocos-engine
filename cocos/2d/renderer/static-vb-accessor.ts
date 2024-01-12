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

import { JSB } from 'internal:constants';
import { Device, Attribute } from '../../gfx';
import { MeshBuffer } from './mesh-buffer';
import { BufferAccessor } from './buffer-accessor';
import { assertID, errorID, Pool, macro, assertIsTrue } from '../../core';
import { director } from '../../game';

interface IFreeEntry {
    offset: number;
    length: number;
}

const _entryPool = new Pool<IFreeEntry>(() => ({
    offset: 0,
    length: 0,
}), 32);

/**
 * @internal
 */
export class StaticVBChunk {
    // JSB
    public get ib (): Readonly<Uint16Array> {
        return this._ib;
    }
    private _ib: Uint16Array;

    constructor (
        public vertexAccessor: StaticVBAccessor,
        public bufferId: number,
        public meshBuffer: MeshBuffer,
        public vertexOffset: number,
        public vb: Float32Array,
        public indexCount: number,
    ) {
        this._ib = new Uint16Array(indexCount); // JSB
        assertIsTrue(meshBuffer === vertexAccessor.getMeshBuffer(bufferId));
    }

    setIndexBuffer (indices: ArrayLike<number>): void {
        if (JSB) {
            // 放到原生
            assertIsTrue(indices.length === this.ib.length);
            for (let i = 0; i < indices.length; ++i) {
                const vid = indices[i];
                this._ib[i] = this.vertexOffset + vid;
            }
        }
    }
}

export class StaticVBAccessor extends BufferAccessor {
    public static IB_SCALE = 4; // ib size scale based on vertex count
    public static ID_COUNT = 0;

    private _freeLists: IFreeEntry[][] = [];
    private _vCount = 0;
    private _iCount = 0;
    private _id = 0;
    get id (): number { return this._id; }

    public constructor (device: Device, attributes: Attribute[], vCount?: number, iCount?: number) {
        super(device, attributes);
        this._vCount = vCount || Math.floor(macro.BATCHER2D_MEM_INCREMENT * 1024 / this._vertexFormatBytes);
        this._iCount = iCount || (this._vCount * StaticVBAccessor.IB_SCALE);
        this._id = StaticVBAccessor.generateID();
        // Initialize first mesh buffer
        this._allocateBuffer();
    }

    public destroy (): void {
        // Destroy mesh buffers and reuse free entries
        for (let i = 0; i < this._buffers.length; ++i) {
            this._buffers[i].destroy();
            const freeList = this._freeLists[i];
            for (let j = 0; j < freeList.length; ++j) {
                _entryPool.free(freeList[j]);
            }
        }
        this._buffers.length = 0;
        this._freeLists.length = 0;
        super.destroy();
    }

    public reset (): void {
        for (let i = 0; i < this._buffers.length; ++i) {
            const buffer = this._buffers[i];
            // Reset index buffer
            buffer.indexOffset = 0;
            buffer.reset();
        }
    }

    public getVertexBuffer (bid: number): Float32Array {
        return this._buffers[bid].vData;
    }

    public getIndexBuffer (bid: number): Uint16Array {
        return this._buffers[bid].iData;
    }

    public getMeshBuffer (bid: number): MeshBuffer {
        return this._buffers[bid];
    }

    public uploadBuffers (): void {
        for (let i = 0; i < this._buffers.length; ++i) {
            const firstEntry = this._freeLists[i][0];
            const buffer = this._buffers[i];
            // Recognize active buffers
            if (!firstEntry || firstEntry.length < buffer.vData.byteLength) {
                buffer.uploadBuffers();
            }
            // Need destroy empty buffer
        }
    }

    public appendIndices (bufferId: number, indices: Uint16Array): void {
        const buf = this._buffers[bufferId];
        const iCount = indices.length;
        if (iCount) {
            //make sure iData length enough
            const needLength = buf.indexOffset + indices.length;
            if (buf.iData.length < needLength) {
                const expansionLength = Math.floor(1.25 * needLength);
                const newIData = new Uint16Array(expansionLength);
                newIData.set(buf.iData);
                buf.iData = newIData;
            }
            // Append index buffer
            buf.iData.set(indices, buf.indexOffset);
            buf.indexOffset += indices.length;
        }
    }

    public allocateChunk (vertexCount: number, indexCount: number): StaticVBChunk | null {
        const byteLength = vertexCount * this.vertexFormatBytes;
        if (vertexCount > this._vCount || indexCount > this._iCount) {
            errorID(9004, byteLength);
            return null;
        }
        let buf: MeshBuffer = null!; let freeList: IFreeEntry[];
        let bid = 0; let eid = -1; let entry: IFreeEntry | null = null;
        // Loop buffers
        for (let i = 0; i < this._buffers.length; ++i) {
            buf = this._buffers[i];
            freeList = this._freeLists[i];
            // Loop entries
            for (let e = 0; e < freeList.length; ++e) {
                // Found suitable free entry
                if (freeList[e].length >= byteLength) {
                    entry = freeList[e];
                    bid = i;
                    eid = e;
                    break;
                }
            }
            if (entry) break;
        }
        // Allocation fail
        if (!entry) {
            bid = this._allocateBuffer();
            buf = this._buffers[bid];
            if (buf) {
                eid = 0;
                entry = this._freeLists[bid][eid];
            }
        }
        // Allocation succeed
        if (entry) {
            const vertexOffset = entry.offset / this.vertexFormatBytes;
            assertIsTrue(Number.isInteger(vertexOffset));
            const vb = new Float32Array(buf.vData.buffer, entry.offset, byteLength >> 2).fill(0);
            this._allocateChunkFromEntry(bid, eid, entry, byteLength);

            return new StaticVBChunk(this, bid, buf, vertexOffset, vb, indexCount);
        } else {
            return null;
        }
    }

    public recycleChunk (chunk: StaticVBChunk): void {
        const freeList = this._freeLists[chunk.bufferId];
        const buf = this._buffers[chunk.bufferId];
        let offset = chunk.vertexOffset * this.vertexFormatBytes;
        let bytes = chunk.vb.byteLength;
        if (bytes === 0) return;
        let recycled = false;
        let i = 0;
        let prevEntry: IFreeEntry | null = null;
        let nextEntry: IFreeEntry | null = freeList[i];
        // Loop entries
        while (nextEntry && nextEntry.offset < offset) {
            prevEntry = nextEntry;
            nextEntry = freeList[++i];
        }
        // Found previous entry
        if (prevEntry) {
            const distance = offset - (prevEntry.offset + prevEntry.length);
            // Ensure no overlap with previous chunk
            assertIsTrue(distance >= 0);
            // Can be merged
            if (distance === 0) {
                prevEntry.length += bytes;
                offset = prevEntry.offset;
                bytes = prevEntry.length;

                // Can also merge with next entry
                if (nextEntry && nextEntry.offset - (offset + bytes) === 0) {
                    prevEntry.length += nextEntry.length;
                    // Free next entry
                    freeList.splice(i, 1);
                    _entryPool.free(nextEntry);
                    nextEntry = null;
                }
                recycled = true;
            }
        }
        // Found next entry
        if (!recycled && nextEntry) {
            const distance = nextEntry.offset - (offset + bytes);
            // Ensure no overlap with next chunk
            assertIsTrue(distance >= 0);
            // Can be merged
            if (distance === 0) {
                nextEntry.offset = offset;
                nextEntry.length += bytes;
            } else {
                // Can not be merged
                const newEntry = _entryPool.alloc();
                newEntry.offset = offset;
                newEntry.length = bytes;
                freeList.splice(i, 0, newEntry);
            }
            recycled = true;
        }
        if (recycled) {
            // If the last chunk is recycled, ensure correct mesh buffer byte offset
            if (offset + bytes === buf.byteOffset) {
                buf.byteOffset = offset;
            }
        } else {
            // Haven't found any entry or any entry after the buffer chunk
            const newEntry = _entryPool.alloc();
            newEntry.offset = offset;
            newEntry.length = bytes;
            freeList.push(newEntry);
        }
    }

    private _allocateChunkFromEntry (bid: number, eid: number, entry: IFreeEntry, bytes: number): void {
        const remaining = entry.length - bytes;
        const offset = entry.offset + bytes;
        const buf = this._buffers[bid];
        if (buf.byteOffset < offset) {
            // Ensure buffer length covers all buffer chunks
            buf.byteOffset = offset;
        }
        assertID(remaining >= 0, 9004, bid, entry.offset, entry.length);
        if (remaining === 0) {
            this._freeLists[bid].splice(eid, 1);
            _entryPool.free(entry);
        } else {
            entry.offset += bytes;
            entry.length = remaining;
        }
    }

    private _allocateBuffer (): number {
        // Validate length of buffer array
        assertID(this._buffers.length === this._freeLists.length, 9003);

        const buffer = new MeshBuffer();
        const vFloatCount = this._vCount * this._floatsPerVertex;
        buffer.initialize(this._device, this._attributes, vFloatCount, this._iCount);
        this._buffers.push(buffer);
        const entry = _entryPool.alloc();
        entry.offset = 0;
        entry.length = buffer.vData.byteLength;
        const freeList = [entry];
        this._freeLists.push(freeList);

        //sync to native
        // temporarily batcher transports buffers
        // It is better to put accessor to native
        const batcher = director.root!.batcher2D;
        batcher.syncMeshBuffersToNative(this.id, this._buffers);

        return this._buffers.length - 1;
    }
    static generateID (): number {
        return StaticVBAccessor.ID_COUNT++;
    }
}
