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
 * @en Array with optimized memory management.
 * It accepts an initial size and pre-allocate, it also grow by size times two each time reaches the maximum size.
 * @zh 可变长数组。接受一个初始长度并用来初始化数组，每当数组长度超界都会自动扩充到两倍长度。
 */
export class OptimizedArray<T = {}> {
    private _size: number;
    private _data: Array<T | undefined>;

    /**
     * @zh 构造函数，指定数组起始大小。
     * @en Initialize this array with specified capacity.
     * @param size The size.
     */
    constructor (size = 0) {
        this._size = size;
        this._data = new Array(size);
    }

    /**
     * @zh 数组大小。
     * @en Size of this array.
     */
    get size () {
        return this._size;
    }

    /**
     * @zh 返回对应的数组实例。
     * @en The underlying Array of this OptimizedArray.
     */
    get data () {
        return this._data;
    }

    /**
     * @zh 返回已经分配的数组容量。
     * @en Current capacity of this array.
     */
    get capacity () {
        return this._data.length;
    }

    /**
     * @zh 在末尾添加一个元素。
     * @en Push a value to back of this array.
     * @param value The element to be added
     */
    public push (value) {
        if (this._size > this._data.length) {
            this._extends(this._data.length);
        }
        this._data[this._size] = value;
        ++this._size;
    }

    /**
     * @zh 移除并返回最末尾的元素。
     * @en Remove the last element and return it, if exists.
     */
    public pop () {
        if (this._size === 0) {
            return;
        }
        --this._size;
        const ret = this._data[this._size];
        this._data[this._size] = undefined;
        return ret;
    }

    /**
     * @zh 清除所有元素。
     * @en Remove all elements.
     */
    public clear () {
        for (let i = 0; i < this._data.length; ++i) {
            this._data[i] = undefined;
        }
        this._size = 0;
    }

    /**
     * @ignore
     * @private
     */
    public _extends (size) {
        const finalSize = this._data.length + size;
        for (let i = this._data.length; i < finalSize; ++i) {
            this._data[i] = undefined;
        }
    }
}

type Allocator<T> = () => T;

type Deallocator<T> = (value: T) => void;

/**
 * @en Optimized Array for typed value
 * @zh 自动分配内存的数组。
 */
export class OptimizedValueArray<T = {}> {
    private _size: number;
    private _data: T[];
    private _ctor;
    private _dtor;

    /**
     * @param {any} ctor The constructor to create the value.
     * @param {Number} [size] The size.
     */
    constructor (ctor: Allocator<T>, dtor: Deallocator<T>, size = 0) {
        this._size = size;
        this._data = new Array();
        this._ctor = ctor;
        this._dtor = dtor;
        this._extends(size);
    }

    /**
     * @zh 获取数组长度。
     * @en Size of this array.
     * @return {Number}
     */
    get size () {
        return this._size;
    }

    /**
     * @zh 获取数组对象。
     * @en The underlying Array of this array.
     * @return {Array}
     */
    get data () {
        return this._data as T[];
    }

    /**
     * @zh 获取已分配数组长度。
     * @en Capacity of this array.
     */
    get capacity () {
        return this._data.length;
    }

    /**
     * @zh 添加一个元素到数组末尾。
     * @en Push a value to back of this array.
     */
    public push () {
        if (this._size >= this._data.length) {
            this._extends(this._data.length + 1);
        }
        const retval = this._data[this._size];
        ++this._size;
        return retval;
    }

    /**
     * @zh 删除数组中最后一个元素并调用析构函数。
     * @en Remove the last element, if exists.<br>
     * Since that element is not erased, so we cannot return it.
     */
    public pop () {
        if (this._size === 0) {
            return;
        }
        --this._size;
        this._dtor(this._data[this._size]);
    }

    /**
     * @zh 删除所有元素。
     * @en Remove all elements.
     */
    public clear () {
        this._size = 0;
        for (const value of this._data) {
            this._dtor(value);
        }
    }

    /**
     * @en Delete an element within an interval.
     * @zh 删除一段区间内的元素。
     * @param from 起始索引。
     * @param number 删除元素的个数。
     */
    public splice (from, number) {
        if (number === 0) {
            return;
        }

        if (from >= this.size) {
            return;
        } // throw

        number = Math.min(this.size - from, number);

        const originalSize = this._size;
        this._size -= number;

        for (let i = 0, moveStart = from + number, moveNumber = originalSize - moveStart; i < moveNumber; ++i) {
            const temp = this._data[from + i];
            this._data[from + i] = this._data[moveStart + i];
            this._data[moveStart + i] = temp;
        }
        for (let i = this._size; i !== originalSize; ++i) {
            this._dtor(this._data[i]);
        }
    }

    /**
     * @en Traverse the entire array
     * @zh 遍历数组。
     * @param fx 遍历函数。
     */
    public forEach (fx) {
        for (let i = 0; i < this.size; ++i) {
            fx(this.data[i], i, this);
        }
    }

    /**
     * @en Map the array to another array and return the new array.
     * @zh 将数组映射为另一个数组，返回新数组。
     * @param fx 映射函数。
     */
    public map (fx) {
        const result = new Array();
        for (let i = 0; i < this.size; ++i) {
            result.push(fx(this.data[i], i, this));
        }
        return result;
    }

    /**
     * @ignore
     * @param {Number} size
     */
    public _extends (size) {
        const finalSize = this._data.length + size;
        for (let i = this._data.length; i < finalSize; ++i) {
            this._data[i] = this._ctor();
        }
    }
}
