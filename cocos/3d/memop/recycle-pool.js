import sort from './timsort';

export default class RecyclePool {
    constructor(fn, size) {
        this._fn = fn;
        this._count = 0;
        this._data = new Array(size);
        this._objIdx = {};

        for (let i = 0; i < size; ++i) {
            this._data[i] = fn();
            this._objIdx[this._data[i]] = i;
        }
    }

    get length() {
        return this._count;
    }

    get data() {
        return this._data;
    }

    reset() {
        this._count = 0;
    }

    resize(size) {
        if (size > this._data.length) {
            for (let i = this._data.length; i < size; ++i) {
                this._data[i] = this._fn();
            }
        }
    }

    add() {
        if (this._count >= this._data.length) {
            this.resize(this._data.length * 2);
        }

        return this._data[this._count++];
    }

    removeAt(idx) {
        if (idx >= this._count) {
            return;
        }

        let last = this._count - 1;
        let tmp = this._data[idx];
        this._data[idx] = this._data[last];
        this._data[last] = tmp;
        this._objIdx[this._data[idx]] = idx;
        this._objIdx[this._data[last]] = last;
        this._count -= 1;
    }

    remove(obj) {
        this.removeAt(this._objIdx[obj]);
    }

    sort(cmp) {
        return sort(this._data, 0, this._count, cmp);
    }
}
