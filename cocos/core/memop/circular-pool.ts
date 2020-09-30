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
