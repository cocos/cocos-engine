import sort from './timsort';

export default class FixedArray<T = {}> {
    private _count: number;
    private _data: Array<T | undefined>;

    constructor (size: number) {
        this._count = 0;
        this._data = new Array(size);
    }

    public _resize (size: number) {
        if (size > this._data.length) {
            for (let i = this._data.length; i < size; ++i) {
                this._data[i] = undefined;
            }
        }
    }

    get length () {
        return this._count;
    }

    get data () {
        return this._data;
    }

    public reset () {
        for (let i = 0; i < this._count; ++i) {
            this._data[i] = undefined;
        }

        this._count = 0;
    }

    public push (val) {
        if (this._count >= this._data.length) {
            this._resize(this._data.length * 2);
        }

        this._data[this._count] = val;
        ++this._count;
    }

    public pop () {
        --this._count;

        if (this._count < 0) {
            this._count = 0;
        }

        const ret = this._data[this._count];
        this._data[this._count] = undefined;

        return ret;
    }

    public fastRemove (idx) {
        if (idx >= this._count || idx < 0) {
            return;
        }

        const last = this._count - 1;
        this._data[idx] = this._data[last];
        this._data[last] = undefined;
        this._count -= 1;
    }

    public indexOf (val) {
        return this._data.indexOf(val);
    }

    public sort (cmp) {
        return sort(this._data, 0, this._count, cmp);
    }
}
