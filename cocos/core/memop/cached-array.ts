export class CachedArray<T> {

    public array: T[];
    public length: number = 0;
    private _compareFn;
    private _capacity: number = 0;

    constructor (length: number, compareFn?: (a: T, b: T) => number) {
        this.array = new Array(length);
        this._capacity = length;
        this.length = 0;

        if (compareFn !== undefined) {
            this._compareFn = compareFn;
        } else {
            this._compareFn = (a: number, b: number) => a - b;
        }
    }

    public reserve (length: number) {
        if (length > this._capacity) {
            const temp = this.array;
            this.array = new Array(length);
            for (let i = 0; i < this._capacity; ++i) {
                this.array[i] = temp[i];
            }
            this._capacity = length;
        }
    }

    public push (item: T) {
        if (this.length > this._capacity) {
            const temp = this.array;
            this.array = new Array(this.length);
            for (let i = 0; i < this._capacity; ++i) {
                this.array[i] = temp[i];
            }
            this._capacity = this.length;
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
        this.array.length = this.length;
        this.array.sort(this._compareFn);
    }

    public concat (array: CachedArray<T>) {
        if (array.length + this.length > this._capacity) {
            const temp = this.array;
            this.array = new Array(array.length + this.length);
            for (let i = 0; i < this._capacity; ++i) {
                this.array[i] = temp[i];
            }
            this._capacity = this.array.length;
        }

        for (let i = 0; i < array.length; ++i) {
            this.array[this.length++] = array.array[i];
        }
    }

    public append (array: T[]) {
        if (array.length + this.length > this._capacity) {
            const temp = this.array;
            this.array = new Array(array.length + this.length);
            for (let i = 0; i < this._capacity; ++i) {
                this.array[i] = temp[i];
            }
            this._capacity = this.array.length;
        }

        for (const item of array) {
            this.array[this.length++] = item;
        }
    }
}
