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
    static T *getBuffer(PoolType type, uint index) {
        index &= ~(1 << 30);
        if (BufferAllocator::_pools.count(type) != 0) {
            const auto pool = BufferAllocator::_pools[type];
            if (pool->_buffers.count(index) != 0) {
                T *ret = nullptr;
                size_t len = 0;
                pool->_buffers[index]->getArrayBufferData((uint8_t **)&ret, &len);
                return ret;
            } else {
                return nullptr;
            }
        } else {
            return nullptr;
        }
    }

    template <class T>
    static T *getBuffer(PoolType type, uint index, uint *size) {
        index &= ~(1 << 30);
        if (BufferAllocator::_pools.count(type) != 0) {
            const auto pool = BufferAllocator::_pools[type];
            if (pool->_buffers.count(index) != 0) {
                T *ret = nullptr;
                size_t len = 0;
                pool->_buffers[index]->getArrayBufferData((uint8_t **)&ret, &len);
                if (size) *size = len;
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

    cc::map<uint, Object *> _buffers;
    PoolType _type = PoolType::UNKNOWN;
};

} // namespace se
