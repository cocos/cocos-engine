
/**
 * @category memop
 */

/**
 * @zh 循环对象池。
 */
export class RecyclePool<T = any> {
    private _fn: () => T;
    private _count = 0;
    private _data: T[];

    /**
     * 构造函数。
     * @param fn 对象构造函数。
     * @param size 初始大小。
     */
    constructor (fn: () => T, size: number) {
        this._fn = fn;
        this._data = new Array(size);

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
        }
    }

    /**
     * @zh 对象池大小。
     */
    get length () {
        return this._count;
    }

    /**
     * @zh 对象池数组。
     */
    get data () {
        return this._data;
    }

    /**
     * @zh 清空对象池。
     */
    public reset () {
        this._count = 0;
    }

    /**
     * @zh 设置对象池大小。
     * @param size 对象池大小。
     */
    public resize (size: number) {
        if (size > this._data.length) {
            for (let i = this._data.length; i < size; ++i) {
                this._data[i] = this._fn();
            }
        }
    }

    /**
     * @zh 从对象池中取出一个对象。
     */
    public add () {
        if (this._count >= this._data.length) {
            this.resize(this._data.length * 2);
        }

        return this._data[this._count++];
    }

    /**
     * @zh 释放对象池中的一个元素。
     * @param idx 释放对象的索引。
     */
    public removeAt (idx: number) {
        if (idx >= this._count) {
            return;
        }

        const last = this._count - 1;
        const tmp = this._data[idx];
        this._data[idx] = this._data[last];
        this._data[last] = tmp;
        this._count -= 1;
    }
}
