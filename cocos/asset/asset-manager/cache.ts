/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { js } from '../../core';

/**
 * @zh 缓存结构的接口定义，可以用于保存数据。
 * @en Interface definition of a cache structure that can be used to save data.
 */
export interface ICache<T> {
    /**
     * @en
     * Adds a Key-Value pair to cache.
     *
     * @zh
     * 增加键值对到缓存中。
     *
     * @param key @en The key. @zh 要增加的键值对中的键。
     * @param val @en The value. @zh 要增加的键值对中的值。
     * @returns @en The value. @zh 新增的键值对中的值。
     */
    add (key: string, val: T): T;
    /**
     * @en
     * Gets the cached content by key.
     *
     * @zh
     * 通过 key 获取对应的 value。
     *
     * @param key @en The key. @zh 要查询的键。
     * @returns @en The corresponding content. @zh 对应键值对中的值。
     */
    get (key: string): T | undefined | null;
    /**
     * @en
     * Checks whether or not content exists by key.
     *
     * @zh
     * 通过 Key 判断是否存在对应的内容。
     *
     * @param key @en The key. @zh 要查询的键。
     * @returns @en True indicates that content of the key exists. @zh 返回 True 则表明该值存在。
     */
    has (key: string): boolean;
    /**
     * @en
     * Removes the cached content by key.
     *
     * @zh
     * 通过 Key 移除对应的内容。
     *
     * @param key @en The key. @zh 要移除的键值对中的键。
     * @returns @en The removed content. @zh 移出的键值对中的值。
     */
    remove (key: string): T | undefined | null;

    /**
     * @en
     * Clear all contents.
     *
     * @zh
     * 清除所有内容。
     */
    clear (): void;

    /**
     *
     * @en
     * Enumerates all contents and invokes function.
     *
     * @zh
     * 枚举所有内容并执行方法。
     *
     * @param func @en Function to be invoked. @zh 待执行的方法。
     * @param func.val @en The value. @zh 传入的键值对中的值。
     * @param func.key @en The corresponding key. @zh 传入的键值对中的键。
     */
    forEach (func: (val: T, key: string) => void): void;
    /**
     * @en
     * Enumerates all content to find one element which can fulfill condition.
     *
     * @zh
     * 枚举所有内容，找到一个可以满足条件的元素。
     *
     * @param predicate @en The condition function. @zh 条件方法。
     * @returns @en The first content that meets this condition. @zh 第一个符合该条件的内容。
     */
    find (predicate: (val: T, key: string) => boolean): T | null;
    /**
     * @en
     * The count of cached content.
     *
     * @zh
     * 缓存数量。
     */
    readonly count: number;

    /**
     * @en
     * Destroy this cache。
     *
     * @zh
     * 销毁这个 cache.
     */
    destroy (): void;
}

/**
 * @en
 * A data structure used to cache certain content.
 *
 * @zh
 * 用于缓存某些内容的数据结构。
 *
 */
export default class Cache<T = any> implements ICache<T> {
    /**
     * @engineInternal
     */
    public get map (): Record<string, T> | null {
        return this._map;
    }
    protected _map: Record<string, T> | null = null;
    protected _count = 0;

    /**
     * @en
     * Creates a Cache.
     *
     * @zh
     * 创建一个 Cache。
     *
     * @param map @en An object used to initialize. @zh 用于初始化此缓存的对象。
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
    }

    /**
     * @en
     * Adds a Key-Value pair to cache.
     *
     * @zh
     * 增加键值对到缓存中。
     *
     * @param key @en The key. @zh 要增加的键值对中的键。
     * @param val @en The value. @zh 要增加的键值对中的值。
     * @returns @en The value. @zh 新增的键值对中的值。
     *
     * @example
     * var cache = new Cache();
     * cache.add('test', null);
     *
     */
    public add (key: string, val: T): T {
        if (!(key in this._map!)) {
            this._count++;
        }
        return this._map![key] = val;
    }

    /**
     * @en
     * Gets the cached content by key.
     *
     * @zh
     * 通过 key 获取对应的 value。
     *
     * @param key @en The key. @zh 要查询的键。
     * @returns @en The corresponding content. @zh 对应键值对中的值。
     *
     * @example
     * let cache = new Cache();
     * let test = cache.get('test');
     *
     */
    public get (key: string): T | undefined | null {
        return this._map![key];
    }

    /**
     * @en
     * Checks whether or not content exists by key.
     *
     * @zh
     * 通过 Key 判断是否存在对应的内容。
     *
     * @param key @en The key. @zh 要查询的键。
     * @returns @en True indicates that content of the key exists. @zh 返回 True 则表明该值存在。
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
     * Removes the cached content by key.
     *
     * @zh
     * 通过 Key 移除对应的内容。
     *
     * @param key @en The key. @zh 要移除的键值对中的键。
     * @returns @en The removed content. @zh 移出的键值对中的值。
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
            this._count--;
        }
        return out;
    }

    /**
     * @en
     * Clear all content.
     *
     * @zh
     * 清除所有内容。
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
     * Enumerates all content and invokes function.
     *
     * @zh
     * 枚举所有内容并执行方法。
     *
     * @param func @en Function to be invoked. @zh 待执行的方法。
     * @param func.val @en The value. @zh 传入的键值对中的值。
     * @param func.key @en The corresponding key. @zh 传入的键值对中的键。
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
     * Enumerate all content to find one element which can fulfill condition.
     *
     * @zh
     * 枚举所有内容，找到一个可以满足条件的元素。
     *
     * @param predicate @en The condition function. @zh 条件方法。
     * @returns @en The first content that meets this condition. @zh 第一个符合该条件的内容。
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
     * The count of cached content.
     *
     * @zh
     * 缓存数量。
     *
     */
    get count (): number {
        return this._count;
    }

    /**
     * @en
     * Destroy this cache.
     *
     * @zh
     * 销毁这个 cache。
     *
     */
    public destroy (): void {
        this._map = null;
    }
}
