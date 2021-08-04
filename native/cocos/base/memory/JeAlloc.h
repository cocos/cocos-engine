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

#ifndef CC_JE_ALLOC_H_
#define CC_JE_ALLOC_H_

#if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_JEMALLOC)

namespace cc {

//Non-templated utility class just to hide jemalloc.
class CC_CORE_API JeAllocImpl {
public:
    static CC_DECL_MALLOC void *AllocBytes(size_t count, const char *file, int line, const char *func);
    static CC_DECL_MALLOC void *ReallocBytes(void *ptr, size_t count, const char *file, int line, const char *func);
    static CC_DECL_MALLOC void *AllocBytesAligned(size_t align, size_t count, const char *file, int line, const char *func);
    static void DeallocBytes(void *ptr);
    static void DumpStats(char *buf, int bufsize);
    static void TrimAlloc();
};

/**	An allocation policy for use with AllocatedObject and
 STLAllocator. This is the class that actually does the allocation
 and deallocation of physical memory, and is what you will want to
 provide a custom version of if you wish to change how memory is allocated.
 */
class CC_CORE_API JeAllocPolicy {
public:
    static inline CC_DECL_MALLOC void *AllocateBytes(size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return JeAllocImpl::AllocBytes(count, file, line, func);
    }

    static inline CC_DECL_MALLOC void *ReallocateBytes(void *ptr, size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return JeAllocImpl::ReallocBytes(ptr, count, file, line, func);
    }

    static inline void DeallocateBytes(void *ptr) {
        JeAllocImpl::DeallocBytes(ptr);
    }

    static inline CC_DECL_MALLOC void *AllocateBytesAligned(size_t alignment, size_t count, const char *file = nullptr, int line = 0, const char *func = nullptr) {
        return JeAllocImpl::AllocBytesAligned(alignment, count, file, line, func);
    }

    static inline void DeallocateBytesAligned(void *ptr) {
        JeAllocImpl::DeallocBytes(ptr);
    }

    // Get the maximum size of a single allocation
    static inline size_t GetMaxAllocationSize() {
        return (std::numeric_limits<size_t>::max)();
    }

private:
    // No instantiation
    JeAllocPolicy() {}
};

} // namespace cc

#endif // end - #ifdef COCOS_MEMORY_ALLOCATOR_JEMALLOC

#endif // CC_JE_ALLOC_H_
