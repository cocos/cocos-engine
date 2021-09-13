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
 * @en
 * Cached array is a data structure for objects cache, it's designed for persistent data.
 * Its content array length will keep grow.
 * @zh
 * 适用于对象缓存的数组类型封装，一般用于不易被移除的常驻数据。
 * 它的内部数组长度会持续增长，不会减少。
 */
export class CachedArray<T> {
    /**
     * @en
     * The array which stores actual content
     * @zh
     * 实际存储数据内容的数组
     */
    public array: T[];

    /**
     * @en
     * The actual count of data object
     * @zh
     * 实际数据内容数量
     */
    public length = 0;

    private _compareFn;

    /**
     * @param length Initial length
     * @param compareFn Comparison function for sorting
     */
    constructor (length: number, compareFn?: (a: T, b: T) => number) {
        this.array = new Array(length);
        this.length = 0;

        if (compareFn !== undefined) {
            this._compareFn = compareFn;
        } else {
            this._compareFn = (a: number, b: number) => a - b;
        }
    }

    /**
     * @en
     * Push an element to the end of the array
     * @zh
     * 向数组末尾添加一个元素
     * @param item The item to be added
     */
    public push (item: T) {
        this.array[this.length++] = item;
    }

    /**
     * @en
     * Pop the last element in the array. The [[length]] will reduce, but the internal array will keep its size.
     * @zh
     * 弹出数组最后一个元素，CachedArray 的 [[length]] 会减少，但是内部数组的实际长度不变
     * @return The last element.
     */
    public pop (): T | undefined {
        return this.array[--this.length];
    }

    /**
     * @en
     * Get the element at the specified index of the array
     * @zh
     * 得到数组中指定位置的元素
     * @param idx The index of the requested element
     * @return The element at given index
     */
    public get (idx: number): T | undefined {
        return this.array[idx];
    }

    /**
     * @en
     * Clear the cache. The [[length]] will be set to 0, but the internal array will keep its size.
     * @zh
     * 清空数组所有元素。[[length]] 会被设为 0，但内部数组的实际长度不变
     */
    public clear () {
        this.length = 0;
    }

    /**
     * @en
     * Clear the cache. The [[length]] will be set to 0, and clear the internal array.
     * @zh
     * 清空数组所有元素。[[length]] 会被设为 0，并且清空内部数组
     */
    public destroy () {
        this.length = 0;
        this.array.length = 0;
    }

    /**
     * @en
     * Sort the existing elements in cache
     * @zh
     * 排序所有现有元素
     */
    public sort () {
        this.array.length = this.length;
        this.array.sort(this._compareFn);
    }

    /**
     * @en
     * Add all elements of a given array to the end of the current array
     * @zh
     * 添加一个指定数组中的所有元素到当前数组末尾
     * @param array The given array to be appended
     */
    public concat (array: T[]) {
        for (let i = 0; i < array.length; ++i) {
            this.array[this.length++] = array[i];
        }
    }

    /**
     * @en Delete the element at the specified location and move the last element to that location.
     * @zh 删除指定位置的元素并将最后一个元素移动至该位置。
     * @param idx The index of the element to be deleted
     */
    public fastRemove (idx: number) {
        if (idx >= this.length || idx < 0) {
            return;
        }
        const last = --this.length;
        this.array[idx] = this.array[last];
    }

    /**
     * @en Returns the first index at which a given element can be found in the array.
     * @zh 返回在数组中可以找到一个给定元素的第一个索引。
     * @param val The element
     */
    public indexOf (val: T) {
        for (let i = 0, len = this.length; i < len; ++i) {
            if (this.array[i] === val) {
                return i;
            }
        }
        return -1;
    }
}
