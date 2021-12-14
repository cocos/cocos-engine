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

#include "ThreadSafeLinearAllocator.h"
#include "acl/core/memory_utils.h"
#include "base/Macros.h"

namespace cc {

ThreadSafeLinearAllocator::ThreadSafeLinearAllocator(size_t size, size_t alignment) noexcept
: _capacity(size) {
    _buffer = _CC_MALLOC_ALIGN(size, alignment);
    CCASSERT(_buffer, "Out of memory");
}

ThreadSafeLinearAllocator::~ThreadSafeLinearAllocator() {
    _CC_FREE_ALIGN(_buffer);
}

void *ThreadSafeLinearAllocator::doAllocate(size_t size, size_t alignment) noexcept {
    if (size == 0) {
        return nullptr;
    }

    void *   allocatedMemory = nullptr;
    size_t   oldUsedSize     = 0;
    uint64_t newUsedSize     = 0; // force 64-bit here to correctly detect overflows

    do {
        oldUsedSize     = getUsedSize();
        allocatedMemory = acl::align_to(acl::add_offset_to_ptr<void>(_buffer, oldUsedSize), alignment);
        newUsedSize     = reinterpret_cast<uintptr_t>(allocatedMemory) - reinterpret_cast<uintptr_t>(_buffer) + size;

        if (newUsedSize > _capacity) {
            return nullptr; // overflows
        }
    } while (!_usedSize.compare_exchange_weak(oldUsedSize, static_cast<size_t>(newUsedSize), std::memory_order_relaxed, std::memory_order_relaxed)); // no ABA possible

    return allocatedMemory;
}

} // namespace cc
