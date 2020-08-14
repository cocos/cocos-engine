
/**
 * 可以自动分配内存的数据结构
 * @category memop
 */

/**
 * @zh 对象池。
 */
export class Pool<T> {

    private _ctor: () => T;
    private _elementsPerBatch: number;
    private _nextAvail: number;
    private _freepool: T[] = [];

    /**
     * 构造函数。
     * @param ctor 元素构造函数。
     * @param size 初始大小。
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
     * @zh 从对象池中取出一个对象。
     */
    public alloc (): T {
        if (this._nextAvail < 0) {
            const elementsPerBatch = this._elementsPerBatch;
            for (let i = 0; i < elementsPerBatch; i++) {
                this._freepool.push(this._ctor());
            }
            this._nextAvail = elementsPerBatch - 1;
        }

        const ret = this._freepool[this._nextAvail--];
        this._freepool.length--;
        return ret;
    }

    /**
     * @zh 将一个对象放回对象池中。
     * @param obj 释放的对象。
     */
    public free (obj: T) {
        this._freepool.push(obj);
        this._nextAvail++;
    }

    /**
     * @zh 将一组对象放回对象池中。
     * @param objs 一组要释放的对象。
     */
    public freeArray (objs: T[]) {
        Array.prototype.push.apply(this._freepool, objs);
        this._nextAvail += objs.length;
    }

    /**
     * 释放对象池中所有资源。
     * @param dtor 销毁回调，对每个释放的对象调用一次。
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
