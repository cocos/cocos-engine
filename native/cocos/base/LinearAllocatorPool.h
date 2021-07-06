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

#include <algorithm>
#include <vector>

#include "Utils.h"
#include "memory/Memory.h"
#include "threading/ThreadSafeLinearAllocator.h"

namespace cc {

constexpr size_t DEFAULT_BLOCK_SIZE = 4096 * 16;

class LinearAllocatorPool final {
public:
    explicit LinearAllocatorPool(size_t defaultBlockSize = DEFAULT_BLOCK_SIZE) : _defaultBlockSize(defaultBlockSize) {
        _allocators.emplace_back(CC_NEW(ThreadSafeLinearAllocator(static_cast<uint32_t>(_defaultBlockSize))));
    }

    ~LinearAllocatorPool() {
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            CC_SAFE_DELETE(allocator);
        }
        _allocators.clear();
    }

    template <typename T>
    T *allocate(const uint count, uint alignment = 64U) noexcept {
        if (!count) return nullptr;

        T *res = nullptr;
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            res = allocator->allocate<T>(count, alignment);
            if (res) return res;
        }
        uint capacity = utils::nextPOT(static_cast<uint>(std::max(DEFAULT_BLOCK_SIZE, count * sizeof(T) + static_cast<size_t>(alignment)))); // reserve enough padding space for alignment
        _allocators.emplace_back(CC_NEW(ThreadSafeLinearAllocator(static_cast<uint32_t>(capacity))));
        return _allocators.back()->allocate<T>(count, alignment);
    }

    inline void reset() {
        for (ThreadSafeLinearAllocator *allocator : _allocators) {
            allocator->recycle();
        }
    }

protected:
    vector<ThreadSafeLinearAllocator *> _allocators;
    size_t                              _defaultBlockSize = DEFAULT_BLOCK_SIZE;
};

} // namespace cc
