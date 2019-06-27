
/**
 * 可以自动分配内存的数据结构
 * @category memop
 */

/**
 * @zh 对象池。
 */
export default class Pool<T> {

    private _fn: () => T;
    private _idx: number;
    private _frees: T[];

    /**
     * @zh 构造函数。
     * @param fn 元素构造函数。
     * @param size 初始大小。
     */
    constructor (fn: () => T, size: number) {
        this._fn = fn;
        this._idx = size - 1;
        this._frees = new Array<T>(size);

        for (let i = 0; i < size; ++i) {
            this._frees[i] = fn();
        }
    }

    /**
     * @zh 从对象池中取出一个对象。
     */
    public alloc (): T {
        // create some more space (expand by 20%, minimum 1)
        if (this._idx < 0) {
            this._expand(Math.round(this._frees.length * 1.2) + 1);
        }

        const ret = this._frees[this._idx];
        this._frees.splice(this._idx);
        --this._idx;

        return ret;
    }

    /**
     * @zh 将一个对象放回对象池中。
     * @param obj 释放的对象。
     */
    public free (obj: T) {
        ++this._idx;
        this._frees[this._idx] = obj;
    }

    /**
     * 清除对象池。
     * @param fn 清除回调，对每个释放的对象调用一次。
     */
    public clear (fn: (obj: T) => void) {
        for (let i = 0; i <= this._idx; i++) {
            if (fn) {
                fn(this._frees[i]);
            }
        }
        this._frees.splice(0);
        this._idx = -1;
    }

    private _expand (size: number) {
        const old = this._frees;
        this._frees = new Array(size);

        const len = size - old.length;
        for (let i = 0; i < len; ++i) {
            this._frees[i] = this._fn();
        }

        for (let i = len, j = 0; i < size; ++i, ++j) {
            this._frees[i] = old[j];
        }

        this._idx += len;
    }
}
