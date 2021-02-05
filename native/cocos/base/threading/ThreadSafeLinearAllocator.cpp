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

#include "ThreadSafeLinearAllocator.h"
#include "acl/core/memory_utils.h"

namespace cc {

ThreadSafeLinearAllocator::ThreadSafeLinearAllocator(uint32_t const size) noexcept
: mCapacity(size)
{
    mBuffer = malloc(size);
}

ThreadSafeLinearAllocator::~ThreadSafeLinearAllocator()
{
    free(mBuffer);
}

void* ThreadSafeLinearAllocator::Allocate(size_t const size, size_t const alignment) noexcept
{
    if (size == 0)
    {
        return nullptr;
    }

    void* allocatedMemory   = nullptr;
    uint32_t oldUsedSize    = 0;
    uint64_t newUsedSize    = 0;    // 为了判断溢出用64位
    
    do
    {
        oldUsedSize = GetUsedSize();
        allocatedMemory = acl::align_to(acl::add_offset_to_ptr<void>(mBuffer, oldUsedSize), alignment);
        newUsedSize = reinterpret_cast<uintptr_t>(allocatedMemory) - reinterpret_cast<uintptr_t>(mBuffer) + size;
        
        if (newUsedSize > mCapacity)   // 溢出
        {
            return nullptr;
        }
    } while (! mUsedSize.compare_exchange_weak(oldUsedSize, static_cast<uint32_t>(newUsedSize), std::memory_order_relaxed, std::memory_order_relaxed)); // 不可能存在ABA 不处理
    
    return allocatedMemory;
}

} // namespace cc
