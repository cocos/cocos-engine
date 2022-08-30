import { ICache } from './cache';
import { js } from '../utils/js';

export default class LRUCache<T = any> implements ICache<T> {
    protected _map: Record<string, T> | null = null;
    protected _lastUseMap: Record<string, number> | null = null;
    protected _count = 0;
    protected _lastTick = 0;

    update () {
        this._lastTick = Date.now();
        for (let key in this._lastUseMap) {
            const time = this._lastUseMap[key];
            if ((this._lastTick - time) > 2000) {
                this.remove(key);
            }
        }
    }

    /**
     * @en
     * Create a cache
     *
     * @zh
     * 创建一个 cache
     *
     * @param map - An object used to initialize
     *
     */
    constructor (map?: Record<string, T>) {
        if (map) {
            this._map = map;
            this._count = Object.keys(map).length;
        } else {
            this._map = js.createMap(true);
            this._count = 0;
        }
        this._lastTick = Date.now();
    }

    /**
     * @en
     * Add Key-Value to cache
     *
     * @zh
     * 增加键值对到缓存中
     *
     * @param key - The key
     * @param val - The value
     * @returns The value
     *
     * @example
     * var cache = new Cache();
     * cache.add('test', null);
     *
     */
    public add (key: string, val: T): T {
        if (!(key in this._map!)) {
            this._count++;
            this._lastUseMap[key] = this._lastTick;
        }
        return this._map![key] = val;
    }

    /**
     * @en
     * Get the cached content by key
     *
     * @zh
     * 通过 key 获取对应的 value
     *
     * @param key - The key
     * @returns The corresponding content
     *
     * @example
     * let cache = new Cache();
     * let test = cache.get('test');
     *
     */
    public get (key: string): T | undefined | null {
        this._lastUseMap[key] = this._lastTick;
        return this._map![key];
    }

    /**
     * @en
     * Check whether or not content exists by key
     *
     * @zh
     * 通过 Key 判断是否存在对应的内容
     *
     * @param key - The key
     * @returns True indicates that content of the key exists
     *
     * @example
     * var cache = new Cache();
     * var exist = cache.has('test');
     *
     */
    public has (key: string): boolean {
        return key in this._map!;
    }

    /**
     * @en
     * Remove the cached content by key
     *
     * @zh
     * 通过 Key 移除对应的内容
     *
     * @param key - The key
     * @returns The removed content
     *
     * @example
     * var cache = new Cache();
     * var content = cache.remove('test');
     *
     */
    public remove (key: string): T | undefined | null {
        const out = this._map![key];
        if (key in this._map!) {
            delete this._map![key];
            delete this._lastUseMap[key];
            this._count--;
        }
        return out;
    }

    /**
     * @en
     * Clear all content
     *
     * @zh
     * 清除所有内容
     *
     * @example
     * var cache = new Cache();
     * cache.clear();
     *
     */
    public clear (): void {
        if (this._count !== 0) {
            this._map = js.createMap(true);
            this._count = 0;
        }
    }

    /**
     * @en
     * Enumerate all content and invoke function
     *
     * @zh
     * 枚举所有内容并执行方法
     *
     * @param func - Function to be invoked
     * @param func.val - The value
     * @param func.key - The corresponding key
     *
     * @example
     * var cache = new Cache();
     * cache.forEach((val, key) => console.log(key));
     *
     */
    public forEach (func: (val: T, key: string) => void): void {
        for (const key in this._map) {
            func(this._map[key], key);
        }
    }

    /**
     * @en
     * Enumerate all content to find one element which can fulfill condition
     *
     * @zh
     * 枚举所有内容，找到一个可以满足条件的元素
     *
     * @param predicate - The condition
     * @returns content
     *
     * @example
     * var cache = new Cache();
     * var val = cache.find((val, key) => key === 'test');
     *
     */
    public find (predicate: (val: T, key: string) => boolean): T | null {
        for (const key in this._map) {
            if (predicate(this._map[key], key)) {
                return this._map[key];
            }
        }
        return null;
    }

    /**
     * @en
     * The count of cached content
     *
     * @zh
     * 缓存数量
     *
     */
    get count (): number {
        return this._count;
    }

    /**
     * @en
     * Destroy this cache
     *
     * @zh
     * 销毁这个 cache
     *
     */
    public destroy (): void {
        this._map = null;
    }
}