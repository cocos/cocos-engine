#include "BufferAllocator.h"
#include "base/Log.h"
#include "base/memory/Memory.h"

namespace se {

cc::map<PoolType, BufferAllocator *> BufferAllocator::_pools;

BufferAllocator::BufferAllocator(PoolType type)
: _type(type) {
    BufferAllocator::_pools[_type] = this;
}

BufferAllocator::~BufferAllocator() {
    for (auto buffer : _buffers) {
        buffer.second->decRef();
    }
    _buffers.clear();
    BufferAllocator::_pools.erase(_type);
}

Object *BufferAllocator::alloc(uint index, uint bytes) {
    if (_buffers.count(index)) {
        Object *oldObj = _buffers[index];
        oldObj->decRef();
    }
    Object *obj = Object::createArrayBufferObject(nullptr, bytes);
    obj->incRef();
    _buffers[index] = obj;

    return obj;
}

void BufferAllocator::free(uint index) {
    if (_buffers.count(index)) {
        Object *oldObj = _buffers[index];
        oldObj->decRef();
        _buffers.erase(index);
    }
}

} // namespace se
