export default class Pool<T> {

    private _fn: () => T;
    private _idx: number;
    private _frees: T[];

    constructor (fn: () => T, size: number) {
        this._fn = fn;
        this._idx = size - 1;
        this._frees = new Array<T>(size);

        for (let i = 0; i < size; ++i) {
            this._frees[i] = fn();
        }
    }

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

    public free (obj: T) {
        ++this._idx;
        this._frees[this._idx] = obj;
    }

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
