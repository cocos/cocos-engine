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

#include <algorithm>
#include <cstdint>
#include <functional>
#include "base/TypeDef.h"
#include "base/std/container/vector.h"

namespace cc {

namespace memop {

template <typename T>
class Pool final {
public:
    using CtorFunc = std::function<T *()>;
    using DtorFunc = std::function<void(T *)>;
    /**
     * @en Constructor with the allocator of elements and initial pool size
     * @zh 使用元素的构造器和初始大小的构造函数
     * @param ctor The allocator of elements in pool, it's invoked directly without `new`
     * @param elementsPerBatch Initial pool size, this size will also be the incremental size when the pool is overloaded
     */
    Pool(const CtorFunc &ctor, const DtorFunc &dtor, uint32_t elementsPerBatch)
    : _ctor(ctor),
      _dtor(dtor),
      _elementsPerBatch(std::max(elementsPerBatch, static_cast<uint32_t>(1))) {
        CC_ASSERT(_ctor);
        CC_ASSERT(_dtor);
        _nextAvail = static_cast<index_t>(_elementsPerBatch - 1);

        for (uint32_t i = 0; i < _elementsPerBatch; ++i) {
            _freepool.push_back(ctor());
        }
    }

    Pool(const Pool &) = delete;
    Pool(Pool &&) = delete;
    ~Pool() = default;
    Pool &operator=(const Pool &) = delete;
    Pool &operator=(Pool &&) = delete;

    /**
     * @en Take an object out of the object pool.
     * @zh 从对象池中取出一个对象。
     * @return An object ready for use. This function always return an object.
     */
    T *alloc() {
        if (_nextAvail < 0) {
            _freepool.resize(_elementsPerBatch);
            for (uint32_t i = 0; i < _elementsPerBatch; ++i) {
                _freepool[i] = _ctor();
            }
            _nextAvail = static_cast<index_t>(_elementsPerBatch - 1);
        }

        return _freepool[_nextAvail--];
    }

    /**
     * @en Put an object back into the object pool.
     * @zh 将一个对象放回对象池中。
     * @param obj The object to be put back into the pool
     */
    void free(T *obj) {
        ++_nextAvail;
        if (_nextAvail >= _freepool.size()) {
            _freepool.resize(_freepool.size() + 1);
        }
        _freepool[_nextAvail] = obj;
    }

    /**
     * @en Put multiple objects back into the object pool.
     * @zh 将一组对象放回对象池中。
     * @param objs An array of objects to be put back into the pool
     */
    void freeArray(const ccstd::vector<T *> &objs) {
        _freepool.reserve(_nextAvail + 1 + objs.size());
        _freepool.insert(_freepool.begin() + _nextAvail + 1,
                         objs.begin(), objs.end());
        _nextAvail += static_cast<index_t>(objs.size());
    }

    /**
     * @en Destroy all elements and clear the pool.
     * @zh 释放对象池中所有资源并清空缓存池。
     * @param dtor The destructor function, it will be invoked for all elements in the pool
     */
    void destroy() {
        for (int i = 0; i <= _nextAvail; ++i) {
            _dtor(_freepool[i]);
        }
        _nextAvail = -1;
        _freepool.clear();
        _freepool.shrink_to_fit();
    }

private:
    CtorFunc _ctor{nullptr};
    DtorFunc _dtor{nullptr};
    uint32_t _elementsPerBatch{0};
    index_t _nextAvail{-1};
    ccstd::vector<T *> _freepool;
};

} // namespace memop

} // namespace cc
