export class CachedArray<T> {

    public data: Array<T|undefined>;
    public length: number = 0;
    private _compareFn;

    constructor (count: number, compareFn?: (a: T, b: T) => number) {
        this.data = new Array(count);
        this.length = 0;

        if (compareFn !== undefined) {
            this._compareFn = compareFn;
        } else {
            this._compareFn = (a: number, b: number) => a - b;
        }
    }

    public push (item: T) {
        if (this.length >= this.data.length) {
            const size = this.length * 2;
            const temp = this.data;
            this.data = new Array(size);
            for (let i = 0; i < temp.length; ++i) {
                this.data[i] = temp[i];
            }
        }

        this.data[this.length++] = item;
    }

    public pop (): T | undefined {
        return this.data[this.length--];
    }

    public get (idx: number): T | undefined {
        return this.data[idx];
    }

    public clear () {
        this.length = 0;
    }

    public sort () {
        this.data.fill(undefined, this.length, this.data.length);
        this.data.sort(this._compareFn);
    }
}
