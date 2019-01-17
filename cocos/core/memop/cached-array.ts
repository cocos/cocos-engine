export class CachedArray<T> {

    public array: T[];
    public length: number = 0;
    private _compareFn;
    private _cache: Array<T|undefined>;

    constructor (length: number, compareFn?: (a: T, b: T) => number) {
        this.array = new Array(length);
        this._cache = this.array;
        this.length = 0;

        if (compareFn !== undefined) {
            this._compareFn = compareFn;
        } else {
            this._compareFn = (a: number, b: number) => a - b;
        }
    }

    public reserve (length: number) {
        if (length > this.array.length) {
            this.array = new Array(length);
            for (let i = 0; i < this._cache.length; ++i) {
                this.array[i] = this._cache[i] as T;
            }
            this._cache = this.array;
        }
    }

    public push (item: T) {
        if (this.length > this.array.length) {
            this.array = new Array(this.length);
            for (let i = 0; i < this._cache.length; ++i) {
                this.array[i] = this._cache[i] as T;
            }
            this._cache = this.array;
        }

        this.array[this.length++] = item;
    }

    public pop (): T | undefined {
        return this.array[this.length--];
    }

    public get (idx: number): T {
        return this.array[idx];
    }

    public clear () {
        this.length = 0;
    }

    public sort () {
        this._cache.fill(undefined, this.length, this.array.length);
        this._cache.sort(this._compareFn);
    }

    public concat (array: CachedArray<T>) {
        if (array.length + this.length > this._cache.length) {
            this.array = new Array(array.length + this.length);
            for (let i = 0; i < this._cache.length; ++i) {
                this.array[i] = this._cache[i] as T;
            }
            this._cache = this.array;
        }

        for (let i = 0; i < array.length; ++i) {
            this._cache[this.length++] = array.array[i];
        }
    }

    public append (array: T[]) {
        if (array.length + this.length > this._cache.length) {
            this.array = new Array(array.length + this.length);
            for (let i = 0; i < this._cache.length; ++i) {
                this.array[i] = this._cache[i] as T;
            }
            this._cache = this.array;
        }

        for (const item of array) {
            this._cache[this.length++] = item;
        }
    }
}
