/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#pragma once

#include "PoolType.h"
#include "cocos/base/Macros.h"
#include "cocos/base/Object.h"
#include "cocos/base/TypeDef.h"
#include "cocos/base/memory/StlAlloc.h"
#include "cocos/bindings/jswrapper/Object.h"

namespace se {

class CC_DLL BufferAllocator final : public cc::Object {
public:
    template <class T>
    CC_INLINE static T *getBuffer(PoolType type, uint index) {
        uint size = 0;
        return BufferAllocator::getBuffer<T>(type, index, &size);
    }

    template <class T>
    static T *getBuffer(PoolType type, uint index, uint *size) {
        index &= _bufferMask;
        if (BufferAllocator::_pools.count(type) != 0) {
            const auto pool = BufferAllocator::_pools[type];
            if (pool->_buffers.count(index) != 0) {
                T *ret = nullptr;
                size_t len;
                pool->_buffers[index]->getArrayBufferData((uint8_t **)&ret, &len);
                *size = (uint)len;
                return ret;
            } else {
                return nullptr;
            }
        } else {
            return nullptr;
        }
    }

    BufferAllocator(PoolType type);
    ~BufferAllocator();

    Object *alloc(uint index, uint bytes);
    void free(uint index);

private:
    static cc::map<PoolType, BufferAllocator *> _pools;
    static constexpr uint _bufferMask = ~(1 << 30);

    cc::map<uint, Object *> _buffers;
    PoolType _type = PoolType::UNKNOWN;
};

} // namespace se
