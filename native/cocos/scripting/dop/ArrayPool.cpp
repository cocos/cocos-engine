#include "ArrayPool.h"
#include "base/memory/Memory.h"
#include "base/Log.h"

// Data type of array element is uint32_t
#define BYTES_PER_ELEMENT 4

namespace se {

cc::map<PoolType, ArrayPool *> ArrayPool::_pools;

ArrayPool::ArrayPool(PoolType type, uint size)
: _type(type), _size(size) {
    ArrayPool::_pools[_type] = this;
}

ArrayPool::~ArrayPool() {
    ArrayPool::_pools.erase(_type);
}

Object *ArrayPool::alloc(uint index) {
    uint bytes = _size * BYTES_PER_ELEMENT;
    auto obj = Object::createTypedArray(Object::TypedArrayType::UINT32, nullptr, bytes);
    _objects[index] = obj;
    _indexes[obj] = index;

    return obj;
}

Object *ArrayPool::resize(Object *origin, uint size) {
    uint bytes = size * BYTES_PER_ELEMENT;
    uint8_t *buffer = static_cast<uint8_t *>(CC_MALLOC(bytes));
    if (!buffer) {
        CC_LOG_ERROR("Can not resize array.");
        return origin;
    }
    memset(buffer, 0, bytes);

    uint8_t *originData = nullptr;
    size_t len = 0;
    origin->getTypedArrayData(&originData, &len);
    memcpy(buffer, originData, len);

    auto obj = Object::createTypedArray(Object::TypedArrayType::UINT32, buffer, bytes);
    CC_FREE(buffer);
    
    uint originIndex = _indexes[origin];
    _objects[originIndex] = obj;
    _indexes[obj] = originIndex;
    _indexes.erase(origin);

    return obj;
}

uint32_t *ArrayPool::getArray(PoolType type, uint index) {
    index &= ~(1 << 30);
    if (ArrayPool::_pools.count(type) != 0) {
        const auto pool = ArrayPool::_pools[type];
        if (pool->_objects.count(index) != 0) {
            uint8_t *ret = nullptr;
            size_t len = 0;
            pool->_objects[index]->getTypedArrayData(&ret, &len);
            return reinterpret_cast<uint32_t *>(ret);
        }
        else {
            return nullptr;
        }
    } else {
        return nullptr;
    }
}

} // namespace se
