/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include <atomic>
#include <cstdint>
#include <cstdlib>
#include "../memory/Memory.h"

namespace cc {

// class may be padded
#if (CC_COMPILER == CC_COMPILER_MSVC)
    #pragma warning(disable : 4324)
#endif

class ALIGNAS(16) ThreadSafeLinearAllocator final {
public:
    explicit ThreadSafeLinearAllocator(size_t size, size_t alignment = 1) noexcept;
    ~ThreadSafeLinearAllocator();
    ThreadSafeLinearAllocator(ThreadSafeLinearAllocator const &) = delete;
    ThreadSafeLinearAllocator(ThreadSafeLinearAllocator &&) = delete;
    ThreadSafeLinearAllocator &operator=(ThreadSafeLinearAllocator const &) = delete;
    ThreadSafeLinearAllocator &operator=(ThreadSafeLinearAllocator &&) = delete;

    template <typename T>
    inline T *allocate(size_t count, size_t alignment = 1) noexcept {
        return reinterpret_cast<T *>(doAllocate(count * sizeof(T), alignment));
    }

    inline std::ptrdiff_t allocateToOffset(size_t size, size_t alignment = 1) noexcept {
        return reinterpret_cast<intptr_t>(doAllocate(size, alignment)) - reinterpret_cast<intptr_t>(_buffer);
    }

    inline void *getBuffer() const noexcept { return _buffer; }
    inline size_t getCapacity() const noexcept { return _capacity; }
    inline size_t getUsedSize() const noexcept { return _usedSize.load(std::memory_order_relaxed); }
    inline size_t getBalance() const noexcept { return getCapacity() - getUsedSize(); }

    inline void recycle() noexcept { _usedSize.store(0, std::memory_order_relaxed); }

private:
    void *doAllocate(size_t size, size_t alignment) noexcept;

    void *_buffer{nullptr};
    size_t _capacity{0};
    size_t _alignment{1};
    std::atomic<size_t> _usedSize{0};
};

// class may be padded
#if (CC_COMPILER == CC_COMPILER_MSVC)
    #pragma warning(default : 4324)
#endif

} // namespace cc
