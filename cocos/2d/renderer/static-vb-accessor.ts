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

import { InputAssembler, Device, Attribute } from '../../core/gfx';
import { MeshBuffer } from './mesh-buffer';
import { BufferAccessor } from './buffer-accessor';
import { assertID } from '../../core/platform/debug';
import { assertIsNonNullable, assertIsTrue } from '../../core/data/utils/asserts';
import { Pool } from '../../core/memop/pool';

interface IFreeEntry {
    offset: number;
    length: number;
}

const _entryPool = new Pool<IFreeEntry>(() => {
    return {
        offset: 0,
        length: 0,
    }
}, 32);

export class StaticVBAccessor extends BufferAccessor {
    private _freeLists: IFreeEntry[][] = [];

    public constructor (device: Device, attributes: Attribute[]) {
        super(device, attributes);
        // Initialize first mesh buffer
        this._allocateBuffer();
    }

    public destroy () {
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

    public reset () {
        for (let i = 0; i < this._buffers.length; ++i) {
            const buffer = this._buffers[i];
            const freeList = this._freeLists[i];
            let entry = freeList[0];
            buffer.reset();
            // Reset free entry for the entire buffer
            for (let j = 1; j < freeList.length; ++j) {
                _entryPool.free(freeList[j]);
            }
            if (!entry) {
                entry = freeList[0] = _entryPool.alloc();
            }
            entry.offset = 0;
            entry.length = buffer.vData.byteLength;
        }
    }

    public uploadBuffers () {
        // TODO recognize active buffers
        for (let i = 0; i <= this._buffers.length; ++i) {
            this._buffers[i].uploadBuffers();
        }
    }

    public allocateChunk (vertexCount: number) {
        const byteLength = vertexCount * this.vertexFormatBytes;
        let buf;
        // Ensure capacity
        // TODO 

        // Loop buffers
        for (let i = 0; i < this._freeLists.length; ++i) {
            const freeList = this._freeLists[i];
            // Loop entries
            for (let e = 0; e < freeList.length; ++e) {
                const entry = freeList[e];
                // Found suitable free entry
                if (entry.length >= byteLength) {
                    this._allocateChunkFromEntry(i, e, entry, byteLength);
                }
            }
        }
        // Allocation fail
        if (!buf) {
            this._allocateBuffer();
            // TODO Allocate
        }
        
        buf.setDirty();
    }

    public recycleBuffer (bid: number, offset: number, bytes: number) {
        const freeList = this._freeLists[bid];
        let recycled = false;
        let i = 0;
        let prevEntry = null;
        let nextEntry = freeList[i];
        // Loop entries
        while (nextEntry && nextEntry.offset < offset) {
            prevEntry = nextEntry;
            nextEntry = freeList[++i];
        }
        // Found previous entry
        if (prevEntry) {
            let distance = offset - (prevEntry.offset + prevEntry.length);
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
            let distance = nextEntry.offset - (offset + bytes);
            // Ensure no overlap with next chunk
            assertIsTrue(distance >= 0);
            // Can be merged
            if (distance === 0) {
                nextEntry.offset = offset;
                nextEntry.length += bytes;
                recycled = true;
            }
            // Can not be merged
            else {
                const newEntry = _entryPool.alloc();
                newEntry.offset = offset;
                newEntry.length = bytes;
                freeList.splice(i, 0, newEntry);
            }
        }
        // Haven't found any entry or any entry after the buffer chunk
        if (!recycled) {
            const newEntry = _entryPool.alloc();
            newEntry.offset = offset;
            newEntry.length = bytes;
            freeList.push(newEntry);
        }
    }

    private _allocateChunkFromEntry (bid: number, eid: number, entry: IFreeEntry, bytes: number) {
        const remaining = entry.length - bytes;
        assertID(remaining >= 0, 9004, bid, entry.offset, entry.length);
        if (remaining === 0) {
            this._freeLists[bid].splice(eid, 1);
            _entryPool.free(entry);
        }
        else {
            entry.offset += bytes;
            entry.length = remaining;
        }
    }

    private _allocateBuffer () {
        // Validate length of buffer array
        assertID(this._buffers.length === this._freeLists.length, 9003);

        const buffer = new MeshBuffer();
        buffer.initialize(this._device, this._attributes);
        this._buffers.push(buffer);
        const entry = _entryPool.alloc();
        entry.offset = 0;
        entry.length = buffer.vData.byteLength;
        const freeList = [entry];
        this._freeLists.push(freeList);
    }
}