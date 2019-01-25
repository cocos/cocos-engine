export class CachedArray<T> {

    public array: T[];
    public length: number = 0;
    private cache: Array<T|null>;
    private _compareFn;

    constructor (length: number, compareFn?: (a: T, b: T) => number) {
        this.array = new Array(length);
        this.cache = this.array;
        this.length = 0;

        if (compareFn !== undefined) {
            this._compareFn = compareFn;
        } else {
            this._compareFn = (a: number, b: number) => a - b;
        }
    }

    public push (item: T) {
        this.array[this.length++] = item;
    }

    public pop (): T | undefined {
        return this.array[this.length--];
    }

    public get (idx: number): T {
        return this.array[idx];
    }

    public clear () {
        this.cache.fill(null);
        this.length = 0;
    }

    public sort () {
        this.array.length = this.length;
        this.array.sort(this._compareFn);
    }

    public concat (array: CachedArray<T>) {
        for (let i = 0; i < array.length; ++i) {
            this.array[this.length++] = array.array[i];
        }
    }

    public append (array: T[]) {
        for (const item of array) {
            this.array[this.length++] = item;
        }
    }
}
