/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const js = require('../platform/js');
/**
 * !#en
 * use to cache something
 * 
 * !#zh
 * 用于缓存某些内容
 * 
 * @class Cache
 */
function Cache (map) {
    if (map) {
        this._map = map;
        this._count = Object.keys(map).length;
    }
    else {
        this._map = js.createMap(true);
        this._count = 0;
    }
}

Cache.prototype = {
    
    constructor: Cache,

    /**
     * !#en
     * Add Key-Value to cache
     * 
     * !#zh
     * 增加键值对到缓存中
     * 
     * @method add
     * @param {String} key - The key
     * @param {Object} val - The value
     * @returns {Object} The value
     * 
     * @example
     * var cache = new Cache();
     * cache.add('test', null);
     * 
     * @typescript
     * add(key: string, val: any): any
     */
    add (key, val) {       
        if (!this.has(key)) this._count++;
        return this._map[key] = val;
    },

    /**
     * !#en
     * Get the cached content by key
     * 
     * !#zh
     * 通过 key 获取对应的 value
     * 
     * @method get
     * @param {string} key - The key
     * @returns {Object} The corresponding content
     * 
     * @example
     * var cache = new Cache();
     * var test = cache.get('test');
     * 
     * @typescript
     * get(key: string): any
     */
    get (key) {
        var entry = this._map[key];
        return entry;
    },

    /**
     * !#en
     * Check whether or not content exists by key
     * 
     * !#zh
     * 通过 Key 判断是否存在对应的内容
     * 
     * @method has
     * @param {string} key - The key
     * @returns {boolean} True indecates that content of the key exists
     * 
     * @example
     * var cache = new Cache();
     * var exist = cache.has('test');
     * 
     * @typescript
     * has(key: string): boolean
     */
    has (key) {
        return key in this._map;
    },

    /**
     * !#en
     * Remove the cached content by key
     * 
     * !#zh
     * 通过 Key 移除对应的内容
     * 
     * @method remove
     * @param {string} key - The key
     * @returns {Object} The removed content
     * 
     * @example
     * var cache = new Cache();
     * var content = cache.remove('test');
     * 
     * @typescript
     * remove(key: string): any
     */
    remove (key) {
        var out = this._map[key];
        if (key in this._map) {
            delete this._map[key];
            this._count--;
        }
        return out;
    },

    /**
     * !#en
     * Clear all content
     * 
     * !#zh
     * 清除所有内容
     * 
     * @method clear
     * 
     * @example
     * var cache = new Cache();
     * cache.clear();
     * 
     * @typescript
     * clear():void
     */
    clear () {
        if (this._count !== 0) {
            this._map = js.createMap(true);
            this._count = 0;
        }
    },

    /**
     * !#en
     * Enumerate all content and invoke function
     * 
     * !#zh
     * 枚举所有内容并执行方法
     * 
     * @method forEach
     * @param {Function} func - Function to be invoked
     * @param {Object} func.val - The value 
     * @param {String} func.key - The corresponding key
     * 
     * @example
     * var cache = new Cache();
     * cache.forEach((val, key) => console.log(key));
     * 
     * @typescript
     * forEach(func: (val: any, key: string) => void): void
     */
    forEach (func) {
        for (var key in this._map) {
            func(this._map[key], key);
        }
    },

    /**
     * !#en
     * Enumerate all content to find one element which can fulfill condition
     * 
     * !#zh
     * 枚举所有内容，找到一个可以满足条件的元素
     * 
     * @method find
     * @param {Function} predicate - The condition
     * @returns {*} content
     * 
     * @example
     * var cache = new Cache();
     * var val = cache.find((val, key) => key === 'test');
     * 
     * @typescript
     * find(predicate: (val: any, key: string) => boolean): any
     */
    find (predicate) {
        for (var key in this._map) {
            if (predicate(this._map[key], key)) return this._map[key];
        }
        return null;
    },

    /**
     * !#en
     * The count of cached content
     * 
     * !#zh
     * 缓存数量
     * 
     * @property count
     * @returns {Number} The count of cached content
     */
    get count () {
        return this._count;
    },

    /**
     * !#en
     * Destroy this cache
     * 
     * !#zh
     * 销毁这个 cache
     * 
     * @method destroy
     * 
     * @typescript
     * destroy(): void
     */
    destroy () {
        this._map = null;
    }
};

module.exports = Cache;