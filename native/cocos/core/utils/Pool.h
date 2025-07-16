/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once

/**
 * @en
 * A fixed-length object pool designed for general type.<br>
 * The implementation of this object pool is very simple,
 * it can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 * @zh
 * 长度固定的对象缓存池，可以用来缓存各种对象类型。<br/>
 * 这个对象池的实现非常精简，它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁。
 * @class js.Pool
 * @example
 * ```
 *
 * Example 1:
 *
 * function Details () {
 *     uuidList = [];
 * };
 * Details.prototype.reset = function () {
 *     uuidList.length = 0;
 * };
 * Details.pool = new js.Pool(function (obj) {
 *     obj.reset();
 * }, 5);
 * Details.pool.get = function () {
 *     return _get() || new Details();
 * };
 *
 * var detail = Details.pool.get();
 * ...
 * Details.pool.put(detail);
 *
 * Example 2:
 *
 * function Details (buffer) {
 *    uuidList = buffer;
 * };
 * ...
 * Details.pool.get = function (buffer) {
 *     var cached = _get();
 *     if (cached) {
 *         cached.uuidList = buffer;
 *         return cached;
 *     }
 *     else {
 *         return new Details(buffer);
 *     }
 * };
 *
 * var detail = Details.pool.get( [] );
 * ...
 * ```
 */

#include <functional>
#include <memory>

#include "base/Macros.h"

template <typename T>
class Pool {
public:
    using CleanUpFunction = std::function<bool(T &)>;

    /**
     * @en
     * Get and initialize an object from pool. This method defaults to null and requires the user to implement it.
     * @zh
     * 获取并初始化对象池中的对象。这个方法默认为空，需要用户自己实现。
     * @param args - parameters to used to initialize the object
     */
    std::function<T()> get{};

    /**
     * 使用构造函数来创建一个指定对象类型的对象池，您可以传递一个回调函数，用于处理对象回收时的清理逻辑。
     * @method constructor
     * @param {Function} [cleanupFunc] - the callback method used to process the cleanup logic when the object is recycled.
     * @param {Object} cleanupFunc.obj
     * @param {Number} size - initializes the length of the array
     */
    Pool(const CleanUpFunction &cleanup, int32_t size) {
        _count = 0;
        _pool.resize(size);
        _cleanup = cleanup;
    }

    /**
     * 使用构造函数来创建一个指定对象类型的对象池，您可以传递一个回调函数，用于处理对象回收时的清理逻辑。
     * @method constructor
     * @param {Function} [cleanupFunc] - the callback method used to process the cleanup logic when the object is recycled.
     * @param {Object} cleanupFunc.obj
     * @param {Number} size - initializes the length of the array
     */
    explicit Pool(int32_t size)
    : Pool{nullptr, size} {}

    ~Pool() = default;

    /**
     * @en
     * Get an object from pool, if no available object in the pool, null will be returned.
     * @zh
     * 获取对象池中的对象，如果对象池没有可用对象，则返回空。
     */
    T _get() { //NOLINT(readability-identifier-naming)
        if (_count > 0) {
            --_count;
            T cache = _pool[_count];
            _pool[_count] = nullptr;
            return cache;
        }
        return nullptr;
    }

    /**
     * @en Put an object into the pool.
     * @zh 向对象池返还一个不再需要的对象。
     */
    void put(T &obj) {
        if (_count < static_cast<int32_t>(_pool.size())) {
            if (_cleanup != nullptr && !_cleanup(obj)) {
                return;
            }
            _pool[_count] = obj;
            ++_count;
        }
    }

    /**
     * @en Resize the pool.
     * @zh 设置对象池容量。
     */
    void resize(int32_t length) {
        if (length >= 0) {
            _pool.resize(length);
            if (_count > length) {
                _count = length;
            }
        }
    }

    int32_t getCount() const { return _count; }

private:
    ccstd::vector<T> _pool;
    CleanUpFunction _cleanup{nullptr};

    /**
     * @en
     * The current number of available objects, the default is 0, it will gradually increase with the recycle of the object,
     * the maximum will not exceed the size specified when the constructor is called.
     * @zh
     * 当前可用对象数量，一开始默认是 0，随着对象的回收会逐渐增大，最大不会超过调用构造函数时指定的 size。
     * @default 0
     */
    int32_t _count{0};

    CC_DISALLOW_COPY_MOVE_ASSIGN(Pool);
};
