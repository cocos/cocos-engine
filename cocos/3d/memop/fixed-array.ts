import sort from './timsort';

/**
 * @zh 定长数组
 */
export default class FixedArray<T = {}> {
    private _count: number;
    private _data: Array<T | undefined>;

    /**
     * @zh 构造函数
     * @param size 数组长度
     */
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

    /**
     * @zh 当前有效数据长度
     */
    get length () {
        return this._count;
    }

    /**
     * @zh 获取数组元素
     */
    get data () {
        return this._data;
    }

    /**
     * @zh 将数组清空
     */
    public reset () {
        for (let i = 0; i < this._count; ++i) {
            this._data[i] = undefined;
        }

        this._count = 0;
    }

    /**
     * @zh 把一个对象插入到数组末尾
     * @param val 一个数组元素
     */
    public push (val) {
        if (this._count >= this._data.length) {
            this._resize(this._data.length * 2);
        }

        this._data[this._count] = val;
        ++this._count;
    }

    /**
     * @zh 删除数组最后一个元素并返回
     */
    public pop () {
        --this._count;

        if (this._count < 0) {
            this._count = 0;
        }

        const ret = this._data[this._count];
        this._data[this._count] = undefined;

        return ret;
    }

    /**
     * @zh 删除指定位置的元素并将最后一个元素移动至该位置
     * @param idx 数组索引
     */
    public fastRemove (idx) {
        if (idx >= this._count || idx < 0) {
            return;
        }

        const last = this._count - 1;
        this._data[idx] = this._data[last];
        this._data[last] = undefined;
        this._count -= 1;
    }

    /**
     * @zh 返回某个数组元素对应的下标
     * @param val 数组元素
     */
    public indexOf (val) {
        return this._data.indexOf(val);
    }

    /**
     * @zh 对数组进行排序
     * @param cmp 比较函数
     */
    public sort (cmp) {
        return sort(this._data, 0, this._count, cmp);
    }
}
