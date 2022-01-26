/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "AllocatedObj.h"
#include "MemDef.h"
#include "MemTracker.h"
#include "StlAlloc.h"
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #include <Availability.h>
#endif

// Global Interface Definitions

// Undefine these macros that are defined in cocos2d-x lite.
// Should unify them in future.
#undef CC_SAFE_DELETE
#undef CC_SAFE_DELETE_ARRAY
#undef CC_SAFE_FREE

#define CC_THROW_IF_OOM(ptr)                       \
    if (!ptr) {                                    \
        throw std::runtime_error("out of memory"); \
    }

#define CC_RETURN_IF_OOM(ptr, ret) \
    if (!ptr) {                    \
        return ret;                \
    }

#define CC_NEW(T)              _CC_NEW T
#define CC_NEW_ARRAY(T, count) _CC_NEW T[count]
#define CC_DELETE(ptr)         _CC_DELETE(ptr)
#define CC_DELETE_ARRAY(ptr)   _CC_DELETE[](ptr)
#define CC_SAFE_DELETE(ptr) \
    if (ptr) {              \
        CC_DELETE(ptr);     \
        (ptr) = nullptr;    \
    }
#define CC_SAFE_DELETE_ARRAY(ptr) \
    if (ptr) {                    \
        CC_DELETE_ARRAY(ptr);     \
        (ptr) = nullptr;          \
    }
#define CC_UNSAFE_DELETE(ptr) \
    if (ptr) {                \
        CC_DELETE(ptr);       \
    }
#define CC_UNSAFE_DELETE_ARRAY(ptr) \
    if (ptr) {                      \
        CC_DELETE_ARRAY(ptr);       \
    }

#define CC_NEW_T(T)                      _CC_NEW_T(T)
#define CC_NEW_ARRAY_T(T, count)         _CC_NEW_ARRAY_T(T, count)
#define CC_DELETE_T(ptr, T)              _CC_DELETE_T(ptr, T)
#define CC_DELETE_ARRAY_T(ptr, T, count) _CC_DELETE_ARRAY_T(ptr, T, count)
#define CC_SAFE_DELETE_T(ptr, T) \
    if (ptr) {                   \
        CC_DELETE_T(ptr, T);     \
        (ptr) = nullptr;         \
    }
#define CC_SAFE_DELETE_ARRAY_T(ptr, T, count) \
    if (ptr) {                                \
        CC_DELETE_ARRAY_T(ptr, T, count);     \
        (ptr) = nullptr;                      \
    }
#define CC_UNSAFE_DELETE_T(ptr, T) \
    if (ptr) {                     \
        CC_DELETE_T(ptr, T);       \
    }
#define CC_UNSAFE_DELETE_ARRAY_T(ptr, T, count) \
    if (ptr) {                                  \
        CC_DELETE_ARRAY_T(ptr, T, count);       \
    }

#define CC_MALLOC(bytes)       _CC_MALLOC(bytes)
#define CC_REALLOC(ptr, bytes) _CC_REALLOC(ptr, bytes)
#define CC_ALLOC(T, count)     _CC_ALLOC_T(T, count)
#define CC_FREE(ptr)           _CC_FREE(ptr)
#define CC_SAFE_FREE(ptr) \
    if (ptr) {            \
        CC_FREE(ptr);     \
        (ptr) = nullptr;  \
    }
#define CC_UNSAFE_FREE(ptr) \
    if (ptr) {              \
        CC_FREE(ptr);       \
    }

#define CC_MALLOC_SIMD(bytes) _CC_MALLOC_SIMD(bytes)
#define CC_FREE_SIMD(ptr)     _CC_FREE_SIMD(ptr)

#define CC_DESTROY(ptr)   \
    {                     \
        (ptr)->destroy(); \
    }

#define CC_SAFE_DESTROY(ptr) \
    if (ptr) {               \
        (ptr)->destroy();    \
    }

#define CC_SAFE_DESTROY_AND_DELETE(ptr) \
    if (ptr) {                          \
        (ptr)->destroy();               \
        CC_DELETE(ptr);                 \
        ptr = nullptr;                  \
    }

#define CC_SAFE_DESTROY_NULL(ptr) \
    if (ptr) {                    \
        (ptr)->destroy();         \
        (ptr) = nullptr;          \
    }

#define CC_SAFE_RELEASE_REF(ptr) \
    if (ptr) {                   \
        (ptr)->ReleaseRef();     \
        ptr = nullptr;           \
    }
#define CC_UNSAFE_RELEASE_REF(ptr) \
    if (ptr) {                     \
        (ptr)->ReleaseRef();       \
    }

#if 0
    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS) && (CC_MODE == CC_MODE_DEBUG)
CC_CORE_API void *BareNewErroneouslyCalled(size_t sz);
inline void *operator new(size_t sz) { return BareNewErroneouslyCalled(sz); }
inline void operator delete(void *ptr) throw() { free(ptr); }
    #endif
#endif

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS) && (__IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_11_0)
    #define ALIGNAS(x)
#else
    #define ALIGNAS(x) alignas(x)
#endif
