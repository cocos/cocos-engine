import sort from './timsort';

export default class RecyclePool<T = any> {
    private _fn: () => T;
    private _count = 0;
    private _data: T[];
    private _objIdx: Map<T, number>;

    constructor (fn: () => T, size: number) {
        this._fn = fn;
        this._data = new Array(size);
        this._objIdx = new Map<T, number>();

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
            this._objIdx.set(this._data[i], i);
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
        this._objIdx.set(this._data[idx], idx);
        this._objIdx.set(this._data[last], last);
        this._count -= 1;
    }

    public remove (obj: T) {
        if (this._objIdx.has(obj)) {
            this.removeAt(this._objIdx.get(obj));
        }
    }

    public sort (compare: (a: T, b: T) => number) {
        return sort(this._data, 0, this._count, compare);
    }
}
