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

#ifndef CC_CORE_NED_POOLING_H_
#define CC_CORE_NED_POOLING_H_

#include "base/Macros.h"

#if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_NEDPOOLING)

namespace cc {

//Non-templated utility class just to hide nedmalloc.
class CC_DLL NedPoolingImpl {
public:
    static CC_DECL_MALLOC void *AllocBytes(size_t count, const char *file, int line, const char *func);
    static CC_DECL_MALLOC void *ReallocBytes(void *ptr, size_t count, const char *file, int line, const char *func);
    static CC_DECL_MALLOC void *AllocBytesAligned(size_t align, size_t count, const char *file, int line, const char *func);
    static void DeallocBytes(void *ptr);
};

/**	An allocation policy for use with AllocatedObject and
 STLAllocator. This is the class that actually does the allocation
 and deallocation of physical memory, and is what you will want to
 provide a custom version of if you wish to change how memory is allocated.
 @par
 This allocation policy uses nedmalloc (http://nedprod.com/programs/portable/nedmalloc/index.html).
 */
class CC_DLL NedPoolingAllocPolicy {
public:
    static inline CC_DECL_MALLOC void *AllocateBytes(size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return NedPoolingImpl::AllocBytes(count, file, line, func);
    }
    static inline CC_DECL_MALLOC void *ReallocateBytes(void *ptr, size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return NedPoolingImpl::ReallocBytes(ptr, count, file, line, func);
    }
    static inline void DeallocateBytes(void *ptr) {
        NedPoolingImpl::DeallocBytes(ptr);
    }
    static inline CC_DECL_MALLOC void *AllocateBytesAligned(size_t alignment, size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return NedPoolingImpl::AllocBytesAligned(alignment, count, file, line, func);
    }
    static inline void DeallocateBytesAligned(void *ptr) {
        NedPoolingImpl::DeallocBytes(ptr);
    }

    // Get the maximum size of a single allocation
    static inline size_t getMaxAllocationSize() {
        return (std::numeric_limits<size_t>::max)();
    }

private:
    // No instantiation
    NedPoolingAllocPolicy() {}
};

} // namespace cc

#endif // end - #ifdef CC_MEMORY_ALLOCATOR_NEDPOOLING

#endif // CC_CORE_NED_POOLING_H_
