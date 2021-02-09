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

#include <vector>
#include <algorithm>
#include "base/threading/ThreadSafeLinearAllocator.h"

namespace cc {
namespace gfx {

namespace {
constexpr size_t DEFAULT_BLOCK_SIZE = 4096 * 16;

uint nextPowerOf2(uint v) {
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    return ++v;
}
}

class CC_DLL LinearAllocatorPool final {
public:
    LinearAllocatorPool(size_t defaultBlockSize = DEFAULT_BLOCK_SIZE): _defaultBlockSize(defaultBlockSize) {
        _allocators.emplace_back(CC_NEW(ThreadSafeLinearAllocator(_defaultBlockSize)));
    }

    ~LinearAllocatorPool() {
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            CC_SAFE_DELETE(allocator);
        }
        _allocators.clear();
    }

    template<typename T>
    T* allocate(const uint count, uint alignment = 64u) noexcept {
        if (!count) return nullptr;

        T* res = nullptr;
        size_t size = count * sizeof(T);
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            res = reinterpret_cast<T*>(allocator->allocate(size, alignment));
            if (res) return res;
        }
        size_t capacity = nextPowerOf2(std::max(DEFAULT_BLOCK_SIZE, size + alignment)); // reserve enough padding space for alignment
        _allocators.emplace_back(CC_NEW(ThreadSafeLinearAllocator(capacity)));
        return reinterpret_cast<T*>(_allocators.back()->allocate(size, alignment));
    }

    inline void reset() {
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            allocator->recycle();
        }
    }

protected:
    vector<ThreadSafeLinearAllocator *> _allocators;
    size_t _defaultBlockSize = DEFAULT_BLOCK_SIZE;
};

} // namespace gfx
} // namespace cc
