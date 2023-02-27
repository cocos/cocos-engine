/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#if (CC_PLATFORM == CC_PLATFORM_IOS)
    #include <Availability.h>
#endif

#ifdef _MSC_VER
    #include <malloc.h>
#else
    #include <cstdlib>
#endif

#include <new> // std::nothrow

#include "base/Macros.h"

namespace cc {
class MemoryAllocDealloc final {
public:
    inline static void *allocateBytesAligned(size_t alignment, size_t count) {
#ifdef _MSC_VER
        void *ptr = _aligned_malloc(count, alignment);
#else
        // alignment is not multiple of sizeof(void*)
        CC_ASSERT_ZERO(alignment % sizeof(void *));
        void *ptr = nullptr;
        posix_memalign(&ptr, alignment, count);
#endif
        return ptr;
    }

    inline static void deallocateBytesAligned(void *ptr) {
#ifdef _MSC_VER
        _aligned_free(ptr);
#else
        free(ptr);
#endif
    }
};
} // namespace cc

#define ccnew                new (std::nothrow) //NOLINT(readability-identifier-naming)
#define ccnew_placement(...) new (__VA_ARGS__)  //NOLINT(readability-identifier-naming)

#define CC_SAFE_DELETE(ptr) \
    if (ptr) {              \
        delete ptr;         \
        (ptr) = nullptr;    \
    }

#define CC_SAFE_DELETE_ARRAY(ptr) \
    if (ptr) {                    \
        delete[] ptr;             \
        (ptr) = nullptr;          \
    }

#define CC_MALLOC(bytes)              malloc(bytes)
#define CC_MALLOC_ALIGN(bytes, align) ::cc::MemoryAllocDealloc::allocateBytesAligned(align, bytes)
#define CC_REALLOC(ptr, bytes)        realloc(ptr, bytes)
#define CC_FREE(ptr)                  free((void *)ptr)
#define CC_FREE_ALIGN(ptr)            ::cc::MemoryAllocDealloc::deallocateBytesAligned(ptr)

#define CC_SAFE_FREE(ptr) \
    if (ptr) {            \
        CC_FREE(ptr);     \
        (ptr) = nullptr;  \
    }

#define CC_SAFE_DESTROY(ptr) \
    if (ptr) {               \
        (ptr)->destroy();    \
    }

#define CC_SAFE_DESTROY_AND_DELETE(ptr) \
    if (ptr) {                          \
        (ptr)->destroy();               \
        delete ptr;                     \
        (ptr) = nullptr;                \
    }

#define CC_SAFE_DESTROY_NULL(ptr) \
    if (ptr) {                    \
        (ptr)->destroy();         \
        (ptr) = nullptr;          \
    }

#define CC_SAFE_RELEASE(p) \
    if (p) {               \
        (p)->release();    \
    }

#define CC_SAFE_RELEASE_NULL(p) \
    if (p) {                    \
        (p)->release();         \
        (p) = nullptr;          \
    }

#define CC_SAFE_ADD_REF(p) \
    if (p) {               \
        (p)->addRef();     \
    }

#if ((CC_PLATFORM == CC_PLATFORM_IOS) && (__IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_11_0)) || SWIGCOCOS
    #define ALIGNAS(x)
#else
    #define ALIGNAS(x) alignas(x)
#endif
