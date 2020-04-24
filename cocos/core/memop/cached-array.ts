
/**
 * @category memop
 */

/**
 * @en
 * Cache array
 * This data structure has a memory increase and no decrease and is suitable for allocation strategies that deal with resident memory increases.
 * @zh
 * 缓存数组
 * 该数据结构内存只增不减，适用于处理内存常驻递增的分配策略
 */
export class CachedArray<T> {

    /**
     * @en
     * The actual content of the data
     * @zh
     * 实际存储的数据内容
     */
    public array: T[];

    /**
     * @en
     * The length of the array
     * @zh
     * 数组长度
     */
    public length: number = 0;

    /**
     * @en
     * Comparison function
     * @zh
     * 比较函数
     */
    private _compareFn;

    /**
     * @en
     * Constructor
     * @zh
     * 构造函数
     * @param length 数组初始化长度
     * @param compareFn 比较函数
     */
    constructor (length: number, compareFn?: (a: T, b: T) => number) {
        this.array = new Array(length);
        this.length = 0;

        if (compareFn !== undefined) {
            this._compareFn = compareFn;
        } else {
            this._compareFn = (a: number, b: number) => a - b;
        }
    }

    /**
     * @en
     * Push an element to the array
     * @zh
     * 向数组中添加一个元素
     * @param item 数组元素
     */
    public push (item: T) {
        this.array[this.length++] = item;
    }

    /**
     * @en
     * Pop the last element in the array
     * @zh
     * 弹出数组最后一个元素
     * @param item 数组元素
     */
    public pop (): T | undefined {
        return this.array[--this.length];
    }

    /**
     * @en
     * Get the specified index element in the array
     * @zh
     * 得到数组中指定索引的元素
     * @param item 数组元素
     */
    public get (idx: number): T {
        return this.array[idx];
    }

    /**
     * @en
     * Clear the array
     * @zh
     * 清空数组所有元素
     */
    public clear () {
        this.length = 0;
    }

    /**
     * @en
     * Sort the Array
     * @zh
     * 排序数组
     */
    public sort () {
        this.array.length = this.length;
        this.array.sort(this._compareFn);
    }

    /**
     * @en
     * Connect all elements of a given array to the end of the current array
     * @zh
     * 连接一个指定数组中的所有元素到当前数组末尾
     */
    public concat (array: T[]) {
        for (let i = 0; i < array.length; ++i) {
            this.array[this.length++] = array[i];
        }
    }

    /**
     * @en Delete the element at the specified location and move the last element to that location.
     * @zh 删除指定位置的元素并将最后一个元素移动至该位置。
     * @param idx 数组索引。
     */
    public fastRemove (idx: number) {
        if (idx >= this.length || idx < 0) {
            return;
        }
        const last = --this.length;
        this.array[idx] = this.array[last];
    }

    /**
     * @en Returns the first index at which a given element can be found in the array.
     * @zh 返回在数组中可以找到一个给定元素的第一个索引。
     * @param val 数组元素。
     */
    public indexOf (val: T) {
        return this.array.indexOf(val);
    }
}
