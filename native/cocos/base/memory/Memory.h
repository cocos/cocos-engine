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

#define CC_NEW(T)              new T
#define CC_NEW_ALIGN(T, align) _CC_NEW_ALIGN(T, align)
#define CC_NEW_ALIGN_ARGS(T, align, ...) _CC_NEW_ALIGN_ARGS(T, align, ...)
#define CC_NEW_ARRAY(T, count) new T[count]
#define CC_DELETE(ptr)         delete(ptr)
#define CC_DELETE_ARRAY(ptr)   delete[](ptr)
#define CC_DELETE_ALIGN(ptr, T, align) _CC_DELETE_ALIGN(ptr, T, align) 
#define CC_DELETE_ARRAY_ALIGN(ptr, T, count, align) _CC_DELETE_ARRAY_ALIGN(ptr, T, count, align) 
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

#define CC_MALLOC(bytes)       malloc(bytes)
#define CC_MALLOC_ALIGN(bytes, align)         _CC_MALLOC_ALIGN(align, bytes)
#define CC_REALLOC(ptr, bytes) realloc(ptr, bytes)
#define CC_FREE(ptr)           free((void*)ptr)
#define CC_FREE_ALIGN(ptr)     _CC_FREE_ALIGN(ptr)
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
        CC_DELETE(ptr);                 \
        ptr = nullptr;                  \
    }

#define CC_SAFE_DESTROY_NULL(ptr) \
    if (ptr) {                    \
        (ptr)->destroy();         \
        (ptr) = nullptr;          \
    }

#define CC_SAFE_RELEASE(p)  \
       if (p) {            \
           (p)->release(); \
       }                   

#define CC_SAFE_RELEASE_NULL(p) \
       if (p) {                \
           (p)->release();     \
           (p) = nullptr;      \
       } 
                             
#define CC_SAFE_ADD_REF(p) \
       if (p) {           \
           (p)->addRef(); \
       }                  

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS) && (__IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_11_0)
    #define ALIGNAS(x)
#else
    #define ALIGNAS(x) alignas(x)
#endif
