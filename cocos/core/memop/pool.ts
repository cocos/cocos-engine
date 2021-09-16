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
 * @en Typed object pool.
 * It's a traditional design, you can get elements out of the pool or recycle elements by putting back into the pool.
 * @zh 支持类型的对象池。这是一个传统设计的对象池，你可以从对象池中取出对象或是放回不再需要对象来复用。
 * @see [[RecyclePool]]
 */
export class Pool<T> {
    private _ctor: () => T;
    private _elementsPerBatch: number;
    private _nextAvail: number;
    private _freepool: T[] = [];

    /**
     * @en Constructor with the allocator of elements and initial pool size
     * @zh 使用元素的构造器和初始大小的构造函数
     * @param ctor The allocator of elements in pool, it's invoked directly without `new`
     * @param elementsPerBatch Initial pool size, this size will also be the incremental size when the pool is overloaded
     */
    constructor (ctor: () => T, elementsPerBatch: number) {
        this._ctor = ctor;
        this._elementsPerBatch = Math.max(elementsPerBatch, 1);
        this._nextAvail = this._elementsPerBatch - 1;

        for (let i = 0; i < this._elementsPerBatch; ++i) {
            this._freepool.push(ctor());
        }
    }

    /**
     * @en Take an object out of the object pool.
     * @zh 从对象池中取出一个对象。
     * @return An object ready for use. This function always return an object.
     */
    public alloc (): T {
        if (this._nextAvail < 0) {
            this._freepool.length = this._elementsPerBatch;
            for (let i = 0; i < this._elementsPerBatch; i++) {
                this._freepool[i] = this._ctor();
            }
            this._nextAvail = this._elementsPerBatch - 1;
        }

        return this._freepool[this._nextAvail--];
    }

    /**
     * @en Put an object back into the object pool.
     * @zh 将一个对象放回对象池中。
     * @param obj The object to be put back into the pool
     */
    public free (obj: T) {
        this._freepool[++this._nextAvail] = obj;
    }

    /**
     * @en Put multiple objects back into the object pool.
     * @zh 将一组对象放回对象池中。
     * @param objs An array of objects to be put back into the pool
     */
    public freeArray (objs: T[]) {
        this._freepool.length = this._nextAvail + 1;
        Array.prototype.push.apply(this._freepool, objs);
        this._nextAvail += objs.length;
    }

    /**
     * @en Destroy all elements and clear the pool.
     * @zh 释放对象池中所有资源并清空缓存池。
     * @param dtor The destructor function, it will be invoked for all elements in the pool
     */
    public destroy (dtor?: (obj: T) => void) {
        if (dtor) {
            for (let i = 0; i <= this._nextAvail; i++) {
                dtor(this._freepool[i]);
            }
        }
        this._freepool.length = 0;
        this._nextAvail = -1;
    }
}
