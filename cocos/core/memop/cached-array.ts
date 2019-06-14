
/**
 * @zh
 * 缓存数组
 * 该数据结构内存只增不减，适用于处理内存常驻递增的分配策略
 */
export class CachedArray<T> {

    /**
     * @zh
     * 实际存储的数据内容
     */
    public array: T[];

    /**
     * @zh
     * 数组长度
     */
    public length: number = 0;

    /**
     * @zh
     * 指向缓存数组的引用
     */
    private cache: Array<T|null>;

    /**
     * @zh
     * 比较函数
     */
    private _compareFn;

    /**
     * @zh
     * 构造函数
     * @param length 数组初始化长度
     * @param compareFn 比较函数
     */
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

    /**
     * @zh
     * 向数组中添加一个元素
     * @param item 数组元素
     */
    public push (item: T) {
        this.array[this.length++] = item;
    }

    /**
     * @zh
     * 弹出数组最后一个元素
     * @param item 数组元素
     */
    public pop (): T | undefined {
        return this.array[this.length--];
    }

    /**
     * @zh
     * 得到数组中指定索引的元素
     * @param item 数组元素
     */
    public get (idx: number): T {
        return this.array[idx];
    }

    /**
     * @zh
     * 清空数组所有元素
     */
    public clear () {
        this.cache.fill(null);
        this.length = 0;
    }

    /**
     * @zh
     * 排序数组
     */
    public sort () {
        this.array.length = this.length;
        this.array.sort(this._compareFn);
    }

    /**
     * @zh
     * 连接一个指定数组中的所有元素到当前数组末尾
     */
    public concat (array: CachedArray<T>) {
        for (let i = 0; i < array.length; ++i) {
            this.array[this.length++] = array.array[i];
        }
    }

    /**
     * @zh
     * 向数组中追加一组数据
     */
    public append (array: T[]) {
        for (const item of array) {
            this.array[this.length++] = item;
        }
    }
}
