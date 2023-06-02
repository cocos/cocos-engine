/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { BufferInfo, Buffer, Device, MemoryUsageBit, BufferUsageBit } from '../gfx';

export class VFXDynamicBuffer {
    get buffer () {
        return this._buffer;
    }

    get floatDataView () {
        return this._floatDataView;
    }

    get uintDataView () {
        return this._uint32DataView;
    }

    get uint16DataView () {
        return this._uint16DataView;
    }

    get usedCount () {
        return this._usedCount;
    }

    set usedCount (val) {
        this.reserve(val);
        this._usedCount = val;
    }

    get capacity () {
        return this._capacity;
    }

    public markDirty () {
        this._dirty = true;
    }

    private _dirty = false;
    private declare _buffer: Buffer;
    private declare _data: ArrayBuffer;
    private declare _floatDataView: Float32Array;
    private declare _uint32DataView: Uint32Array;
    private declare _uint16DataView: Uint16Array;
    private _usedCount = 0;
    private _size = 0;
    private _capacity = 0;

    constructor (device: Device, size: number, bufferUsage: BufferUsageBit) {
        const capacity = 1024;
        const buffer = device.createBuffer(new BufferInfo(
            bufferUsage,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            size * capacity,
            size,
        ));

        const data = new ArrayBuffer(size * capacity);
        this._size = size;
        this._capacity = capacity;
        this._buffer = buffer;
        this._data = data;
        this._floatDataView = new Float32Array(data);
        this._uint32DataView = new Uint32Array(data);
        this._uint16DataView = new Uint16Array(data);
    }

    private reserve (count: number) {
        if (count <= this._capacity) { return; }
        let newCapacity = this._capacity;
        while (count > newCapacity) {
            newCapacity *= 2;
        }

        this._capacity = newCapacity;
        this._buffer.resize(newCapacity * this._size);
        this._data = new ArrayBuffer(this._size * newCapacity);
        const oldFloatDataView = this._floatDataView;
        this._floatDataView = new Float32Array(this._data);
        this._uint32DataView = new Uint32Array(this._data);
        this._uint16DataView = new Uint16Array(this._data);
        this._floatDataView.set(oldFloatDataView);
    }

    update () {
        if (this._dirty) {
            this._buffer.update(this._data);
            this._dirty = false;
        }
    }

    reset () {
        this._usedCount = 0;
    }

    destroy () {
        this._buffer.destroy();
    }
}
