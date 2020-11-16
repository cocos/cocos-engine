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

/**
 * @packageDocumentation
 * @module memop
 */

/**
 * @en Circular object pool, it creates a pre-allocated object list, and should be requested in loop.
 * One common usage of CircularPool is the ring buffer.
 * @zh 循环对象池，可以初始化一个预设的对象列表，并被依次循环使用。一个常见你的用例就是 Ring Buffer。
 */
export default class CircularPool<T = {}> {
    private _cursor: number;
    private _data: T[];

    /**
     * @param fn The allocator function for the initial data in pool.
     * @param size The size of the circular pool
     */
    constructor (fn: () => T, size: number) {
        this._cursor = 0;
        this._data = new Array(size);

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
        }
    }

    /**
     * @en Request an data object at the current cursor, if the cursor reaches the end, it will start over.
     * @zh 从尾部请求一个对象，超过长度则从头开始。
     */
    public request () {
        const item = this._data[this._cursor];
        this._cursor = (this._cursor + 1) % this._data.length;

        return item;
    }
}
