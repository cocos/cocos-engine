/**
 * @hidden
 */

/**
 * @zh 循环列表。
 */
export default class CircularPool<T = {}> {
    private _cursor: number;
    private _data: T[];

    /**
     * 构造函数。
     * @param fn 创建对象函数。
     * @param size 列表长度。
     */
    constructor (fn: () => T, size: number) {
        this._cursor = 0;
        this._data = new Array(size);

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
        }
    }

    /**
     * @zh 从尾部请求一个对象，超过长度则从头开始。
     */
    public request () {
        const item = this._data[this._cursor];
        this._cursor = (this._cursor + 1) % this._data.length;

        return item;
    }
}
