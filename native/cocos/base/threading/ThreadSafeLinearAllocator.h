/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
#include <atomic>
#include <cstdlib>

namespace cc {

class alignas(16) ThreadSafeLinearAllocator final
{
public:

    explicit                ThreadSafeLinearAllocator(uint32_t const size) noexcept;
                            ~ThreadSafeLinearAllocator();
                            ThreadSafeLinearAllocator(ThreadSafeLinearAllocator const&)             = delete;
                            ThreadSafeLinearAllocator(ThreadSafeLinearAllocator&&)                  = delete;
                            ThreadSafeLinearAllocator& operator=(ThreadSafeLinearAllocator const&)  = delete;
                            ThreadSafeLinearAllocator& operator=(ThreadSafeLinearAllocator&&)       = delete;

    void*                   Allocate(size_t const size, size_t const alignment) noexcept;

    inline void*            GetBuffer() const noexcept      { return mBuffer;                                       }
    inline uint32_t         GetCapacity() const noexcept    { return mCapacity;                                     }
    inline uint32_t         GetUsedSize() const noexcept    { return mUsedSize.load(std::memory_order_relaxed);     }
    inline uint32_t         GetBalance() const noexcept     { return GetCapacity() - GetUsedSize();                 }

    inline void             Recycle() noexcept              { mUsedSize.store(0, std::memory_order_relaxed);        }

private:

    void*                   mBuffer     { nullptr };
    uint32_t                mCapacity   { 0 };
    std::atomic<uint32_t>   mUsedSize   { 0 };
    // 16 bytes
};

} // namespace cc
