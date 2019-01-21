import sort from './timsort';

export default class RecyclePool<T = any> {
    private _fn: () => T;
    private _count = 0;
    private _data: T[];

    constructor (fn: () => T, size: number) {
        this._fn = fn;
        this._data = new Array(size);

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
        }
    }

    get length () {
        return this._count;
    }

    get data () {
        return this._data;
    }

    public reset () {
        this._count = 0;
    }

    public resize (size: number) {
        if (size > this._data.length) {
            for (let i = this._data.length; i < size; ++i) {
                this._data[i] = this._fn();
            }
        }
    }

    public add () {
        if (this._count >= this._data.length) {
            this.resize(this._data.length * 2);
        }

        return this._data[this._count++];
    }

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

    public remove (element: T) {
        const idx = this.data.indexOf(element);
        if (idx >= 0) {
            this.removeAt(idx);
        }
    }

    public sort (compare: (a: T, b: T) => number) {
        return sort(this._data, 0, this._count, compare);
    }
}
