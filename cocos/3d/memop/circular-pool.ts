export default class CircularPool<T = {}> {
    private _cursor: number;
    private _data: T[];

    constructor (fn: () => T, size: number) {
        this._cursor = 0;
        this._data = new Array(size);

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
        }
    }

    public request () {
        const item = this._data[this._cursor];
        this._cursor = (this._cursor + 1) % this._data.length;

        return item;
    }
}
