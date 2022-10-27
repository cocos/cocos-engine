/****************************************************************************
Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "Allocator.h"

namespace cc::gfx {

template <typename T>
static inline T align(T size, T alignment)
{
    return ((size + alignment - 1) & (~(alignment - 1)));
}

Allocator::Allocator(const AllocatorInfo &info) : _info(info) {
}

Allocator::Handle Allocator::allocateFromBlock(uint32_t blockIndex, uint64_t size) {
    auto &block = _blocks[blockIndex];
    if (block.used + size > _info.blockSize) {
        return INVALID_HANDLE;
    }

    auto index = static_cast<uint32_t>(_allocations.size());
    _allocations.emplace_back(Allocation {
        blockIndex, block.used, size
    });
    block.used += size;
    return index;
}

Allocator::Handle Allocator::allocate(uint64_t size, uint64_t alignment) {
    uint64_t alignedSize = align(size, alignment);
    if (alignedSize > _info.blockSize) {
        return INVALID_HANDLE;
    }

    // find first fit in freelist.
    for (auto iter = _freelist.begin(); iter != _freelist.end(); ++iter) {
        if (alignedSize <= _allocations[*iter].size) {
            Handle handle = *iter;
            _freelist.erase(iter);
            return handle;
        }
    }

    // allocate from blocks
    auto blockNum = static_cast<uint32_t>(_blocks.size());
    for (uint32_t i = 0; i < blockNum; ++i) {
        Handle handle = allocateFromBlock(i, alignedSize);
        if (handle != INVALID_HANDLE) {
            return handle;
        }
    }

    // allocate new block
    if (_impl != nullptr) {
        if (!_impl->allocateBlock()) {
            return INVALID_HANDLE;
        }
    }
    _blocks.emplace_back(Block{0});
    return allocateFromBlock(static_cast<uint32_t>(_blocks.size() - 1), alignedSize);
}

void Allocator::free(Handle handle) {
    if (handle >= _allocations.size()) {
        return;
    }
    _freelist.emplace_back(handle);
}

const Allocator::Allocation *Allocator::getAllocation(Handle handle) const {
    if (handle >= _allocations.size()) {
        return nullptr;
    }
    return &_allocations[handle];
}

void Allocator::setBlockImpl(IBlock *impl) {
    _impl = impl;
}

void Allocator::reset() {
    auto blockSize = static_cast<uint32_t>(_blocks.size());
    for (uint32_t i = 0; i < blockSize; ++i) {
        if (_impl != nullptr) {
            _impl->freeBlock(i);
        }
    }
    _blocks.clear();
}

} // namespace cc::gfx
