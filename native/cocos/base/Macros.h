/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2011 Zynga Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include <BaseTsd.h>
    #if !defined(__SSIZE_T) && !defined(_SSIZE_T_)
        #define __SSIZE_T
typedef SSIZE_T ssize_t;
        #ifndef _SSIZE_T_
            #define _SSIZE_T_
        #endif
        #ifndef _SSIZE_T_DEFINED
            #define _SSIZE_T_DEFINED
        #endif
    #endif // __SSIZE_T
#endif

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/log.h>
    #define CC_ASSERT(cond)                                        \
        if (!(cond)) {                                             \
            __android_log_print(ANDROID_LOG_ERROR,                 \
                                "assert",                          \
                                "%s function:%s line:%d",          \
                                __FILE__, __FUNCTION__, __LINE__); \
        }
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include <hilog/log.h>
    #define CC_ASSERT(cond)                                                      \
        if (!(cond)) {                                                           \
            HILOG_ERROR(LOG_APP,                                                 \
                        "assert %{public}s function:%{public}s line:%{public}d", \
                        __FILE__, __FUNCTION__, __LINE__);                       \
        }
#else
    #include <assert.h>
    #define CC_ASSERT(cond) assert(cond)
#endif

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #if defined(CC_STATIC)
        #define CC_DLL
    #else
        #if defined(_USRDLL)
            #define CC_DLL __declspec(dllexport)
        #else /* use a DLL library */
            #define CC_DLL __declspec(dllimport)
        #endif
    #endif
#else
    #define CC_DLL
#endif

#ifndef CCASSERT
    #if CC_DEBUG > 0
        #define CCASSERT(cond, msg) CC_ASSERT(cond)
    // #endif
    #else
        #define CCASSERT(cond, msg)
    #endif

    #define GP_ASSERT(cond) CCASSERT(cond, "")
#endif // CCASSERT

/** @def CC_DEGREES_TO_RADIANS
 converts degrees to radians
 */
#define CC_DEGREES_TO_RADIANS(__ANGLE__) ((__ANGLE__)*0.01745329252f) // PI / 180

/** @def CC_RADIANS_TO_DEGREES
 converts radians to degrees
 */
#define CC_RADIANS_TO_DEGREES(__ANGLE__) ((__ANGLE__)*57.29577951f) // PI * 180

#ifndef FLT_EPSILON
    #define FLT_EPSILON 1.192092896e-07F
#endif // FLT_EPSILON

/**
Helper macros which converts 4-byte little/big endian
integral number to the machine native number representation

It should work same as apples CFSwapInt32LittleToHost(..)
*/

/// when define returns true it means that our architecture uses big endian
#define CC_HOST_IS_BIG_ENDIAN           (bool)(*(unsigned short *)"\0\xff" < 0x100)
#define CC_SWAP32(i)                    ((i & 0x000000ff) << 24 | (i & 0x0000ff00) << 8 | (i & 0x00ff0000) >> 8 | (i & 0xff000000) >> 24)
#define CC_SWAP16(i)                    ((i & 0x00ff) << 8 | (i & 0xff00) >> 8)
#define CC_SWAP_INT32_LITTLE_TO_HOST(i) ((CC_HOST_IS_BIG_ENDIAN == true) ? CC_SWAP32(i) : (i))
#define CC_SWAP_INT16_LITTLE_TO_HOST(i) ((CC_HOST_IS_BIG_ENDIAN == true) ? CC_SWAP16(i) : (i))
#define CC_SWAP_INT32_BIG_TO_HOST(i)    ((CC_HOST_IS_BIG_ENDIAN == true) ? (i) : CC_SWAP32(i))
#define CC_SWAP_INT16_BIG_TO_HOST(i)    ((CC_HOST_IS_BIG_ENDIAN == true) ? (i) : CC_SWAP16(i))

// new callbacks based on C++11
#define CC_CALLBACK_0(__selector__, __target__, ...) std::bind(&__selector__, __target__, ##__VA_ARGS__)
#define CC_CALLBACK_1(__selector__, __target__, ...) std::bind(&__selector__, __target__, std::placeholders::_1, ##__VA_ARGS__)
#define CC_CALLBACK_2(__selector__, __target__, ...) std::bind(&__selector__, __target__, std::placeholders::_1, std::placeholders::_2, ##__VA_ARGS__)
#define CC_CALLBACK_3(__selector__, __target__, ...) std::bind(&__selector__, __target__, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, ##__VA_ARGS__)

// Generic macros

#define CC_SAFE_DELETE(p) \
    do {                  \
        delete (p);       \
        (p) = nullptr;    \
    } while (0)
#define CC_SAFE_DELETE_ARRAY(p) \
    do {                        \
        if (p) {                \
            delete[](p);        \
            (p) = nullptr;      \
        }                       \
    } while (0)
#define CC_SAFE_FREE(p)    \
    do {                   \
        if (p) {           \
            free(p);       \
            (p) = nullptr; \
        }                  \
    } while (0)
#define CC_SAFE_RELEASE(p)  \
    do {                    \
        if (p) {            \
            (p)->release(); \
        }                   \
    } while (0)
#define CC_SAFE_RELEASE_NULL(p) \
    do {                        \
        if (p) {                \
            (p)->release();     \
            (p) = nullptr;      \
        }                       \
    } while (0)
#define CC_SAFE_RETAIN(p)  \
    do {                   \
        if (p) {           \
            (p)->retain(); \
        }                  \
    } while (0)
#define CC_BREAK_IF(cond) \
    if (cond) break

/** @def CC_DEPRECATED_ATTRIBUTE
* Only certain compilers support __attribute__((deprecated)).
*/
#if defined(__GNUC__) && ((__GNUC__ >= 4) || ((__GNUC__ == 3) && (__GNUC_MINOR__ >= 1)))
    #define CC_DEPRECATED_ATTRIBUTE __attribute__((deprecated))
#elif _MSC_VER >= 1400 //vs 2005 or higher
    #define CC_DEPRECATED_ATTRIBUTE __declspec(deprecated)
#else
    #define CC_DEPRECATED_ATTRIBUTE
#endif

/** @def CC_DEPRECATED(...)
* Macro to mark things deprecated as of a particular version
* can be used with arbitrary parameters which are thrown away.
* e.g. CC_DEPRECATED(4.0) or CC_DEPRECATED(4.0, "not going to need this anymore") etc.
*/
#define CC_DEPRECATED(...) CC_DEPRECATED_ATTRIBUTE

#ifdef __GNUC__
    #define CC_UNUSED __attribute__((unused))
#else
    #define CC_UNUSED
#endif

#define CC_UNUSED_PARAM(unusedparam) (void)unusedparam

#ifndef NULL
    #ifdef __cplusplus
        #define NULL 0
    #else
        #define NULL ((void *)0)
    #endif
#endif

/** @def CC_FORMAT_PRINTF(formatPos, argPos)
 * Only certain compiler support __attribute__((format))
 *
 * @param formatPos 1-based position of format string argument.
 * @param argPos    1-based position of first format-dependent argument.
 */
#if defined(__GNUC__) && (__GNUC__ >= 4)
    #define CC_FORMAT_PRINTF(formatPos, argPos) __attribute__((__format__(printf, formatPos, argPos)))
#elif defined(__has_attribute)
    #if __has_attribute(format)
        #define CC_FORMAT_PRINTF(formatPos, argPos) __attribute__((__format__(printf, formatPos, argPos)))
    #else
        #define CC_FORMAT_PRINTF(formatPos, argPos)
    #endif // __has_attribute(format)
#else
    #define CC_FORMAT_PRINTF(formatPos, argPos)
#endif

// Initial compiler-related stuff to set.
#define CC_COMPILER_MSVC  1
#define CC_COMPILER_CLANG 2
#define CC_COMPILER_GNUC  3

// CPU Architecture
#define CC_CPU_UNKNOWN 0
#define CC_CPU_X86     1
#define CC_CPU_PPC     2
#define CC_CPU_ARM     3
#define CC_CPU_MIPS    4

// 32-bits or 64-bits CPU
#define CC_CPU_ARCH_32 1
#define CC_CPU_ARCH_64 2

// Endian
#define CC_ENDIAN_LITTLE 1
#define CC_ENDIAN_BIG    2

// Charset
#define CC_CHARSET_UNICODE   1
#define CC_CHARSET_MULTIBYTE 2

// Precision
#define CC_PRECISION_FLOAT  1
#define CC_PRECISION_DOUBLE 2

// Mode
#define CC_MODE_DEBUG   1
#define CC_MODE_RELEASE 2

// Memory Allocator
#define CC_MEMORY_ALLOCATOR_STD        0
#define CC_MEMORY_ALLOCATOR_NEDPOOLING 1
#define CC_MEMORY_ALLOCATOR_JEMALLOC   2

// STL Memory Allocator
#define CC_STL_MEMORY_ALLOCATOR_STANDARD 1
#define CC_STL_MEMORY_ALLOCATOR_CUSTOM   2

// Compiler type and version recognition
#if defined(_MSC_VER)
    #define CC_COMPILER CC_COMPILER_MSVC
    #if _MSC_VER >= 1900
        #define CC_COMPILER_VERSION 130
    #elif _MSC_VER >= 1800
        #define CC_COMPILER_VERSION 120
    #elif _MSC_VER >= 1700
        #define CC_COMPILER_VERSION 110
    #elif _MSC_VER >= 1600
        #define CC_COMPILER_VERSION 100
    #elif _MSC_VER >= 1500
        #define CC_COMPILER_VERSION 90
    #elif _MSC_VER >= 1400
        #define CC_COMPILER_VERSION 80
    #elif _MSC_VER >= 1300
        #define CC_COMPILER_VERSION 70
    #endif
#elif defined(__clang__)
    #define CC_COMPILER         CC_COMPILER_CLANG
    #define CC_COMPILER_VERSION (((__clang_major__)*100) + (__clang_minor__ * 10) + __clang_patchlevel__)
#elif defined(__GNUC__)
    #define CC_COMPILER         CC_COMPILER_GNUC
    #define CC_COMPILER_VERSION (((__GNUC__)*100) + (__GNUC_MINOR__ * 10) + __GNUC_PATCHLEVEL__)
#else
    #error "Unknown compiler. Abort!"
#endif

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #define CC_ENDIAN CC_ENDIAN_LITTLE
#else
    #if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        #include <machine/endian.h>
    #elif (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
        #include <Endian.h>
    #else
        #include <endian.h>
    #endif // (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    #
    #if __BYTE_ORDER == __LITTLE_ENDIAN
        #define CC_ENDIAN CC_ENDIAN_LITTLE
    #else
        #define CC_ENDIAN CC_ENDIAN_BIG
    #endif //__BYTE_ORDER == __LITTLE_ENDIAN
#endif

// CPU architecture type recognition
#if (defined(_MSC_VER) && (defined(_M_IX86) || defined(_M_X64))) || (defined(__GNUC__) && (defined(__i386__) || defined(__x86_64__)))
    #define CC_CPU CC_CPU_X86
#elif CC_PLATFORM == CC_PLATFORM_MAC_OSX && CC_ENDIAN == CC_ENDIAN_BIG
    #define CC_CPU CC_CPU_PPC
#elif CC_PLATFORM == CC_PLATFORM_MAC_OSX
    #define CC_CPU CC_CPU_X86
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS && (defined(__i386__) || defined(__x86_64__))
    #define CC_CPU CC_CPU_X86
#elif defined(__arm__) || defined(_M_ARM) || defined(__arm64__) || defined(_aarch64_)
    #define CC_CPU CC_CPU_ARM
#elif defined(__mips64) || defined(__mips64_)
    #define CC_CPU CC_CPU_MIPS
#else
    #define CC_CPU CC_CPU_UNKNOWN
#endif

#if defined(__x86_64__) || defined(_M_X64) || defined(__powerpc64__) || defined(__alpha__) || defined(__ia64__) || defined(__s390__) || defined(__s390x__) || defined(__arm64__) || defined(_aarch64_) || defined(__mips64) || defined(__mips64_)
    #define CC_CPU_ARCH CC_CPU_ARCH_64
#else
    #define CC_CPU_ARCH CC_CPU_ARCH_32
#endif

// C11 features
#if (CC_COMPILER == CC_COMPILER_MSVC)
    #if (_MSC_VER >= 1700)
        #define CC_C11_TYPED_ENUMS
    #endif
#elif (CC_COMPILER == CC_COMPILER_GNUC)
    #if (__GNUC_MINOR__ >= 4)
        #define CC_C11_TYPED_ENUMS
    #endif
#endif

// Disable MSVC warning
#if (CC_COMPILER == CC_COMPILER_MSVC)
    #pragma warning(disable : 4251 4275 4819)
    #ifndef _CRT_SECURE_NO_DEPRECATE
        #define _CRT_SECURE_NO_DEPRECATE
    #endif
    #ifndef _SCL_SECURE_NO_DEPRECATE
        #define _SCL_SECURE_NO_DEPRECATE
    #endif
#endif

// Charset Settings
#if defined(_UNICODE) || defined(UNICODE)
    #define CC_CHARSET CC_CHARSET_UNICODE
#else
    #define CC_CHARSET CC_CHARSET_MULTIBYTE
#endif

// Asserts expression is true at compile-time
#define CC_COMPILER_ASSERT(x) typedef int COMPILER_ASSERT_[!!(x)]

#if (CC_COMPILER == CC_COMPILER_MSVC)
    #define CC_RESTRICT __restrict //MSVC
#else
    #define CC_RESTRICT __restrict__ //GCC... and others?
#endif

#define CC_CACHELINE_SIZE 64

#if (CC_COMPILER == CC_COMPILER_MSVC)
    // MSVC ENABLE/DISABLE WARNING DEFINITION
    #define CC_DISABLE_WARNINGS() \
        __pragma(warning(push, 0))

    #define CC_ENABLE_WARNINGS() \
        __pragma(warning(pop))
#elif (CC_COMPILER == CC_COMPILER_GNUC)
    // GCC ENABLE/DISABLE WARNING DEFINITION
    #define CC_DISABLE_WARNINGS()                               \
        _Pragma("GCC diagnostic push")                          \
            _Pragma("GCC diagnostic ignored \"-Wall\"")         \
                _Pragma("clang diagnostic ignored \"-Wextra\"") \
                    _Pragma("clang diagnostic ignored \"-Wtautological-compare\"")

    #define CC_ENABLE_WARNINGS() \
        _Pragma("GCC diagnostic pop")
#elif (CC_COMPILER == CC_COMPILER_CLANG)
    // CLANG ENABLE/DISABLE WARNING DEFINITION
    #define CC_DISABLE_WARNINGS()                               \
        _Pragma("clang diagnostic push")                        \
            _Pragma("clang diagnostic ignored \"-Wall\"")       \
                _Pragma("clang diagnostic ignored \"-Wextra\"") \
                    _Pragma("clang diagnostic ignored \"-Wtautological-compare\"")

    #define CC_ENABLE_WARNINGS() \
        _Pragma("clang diagnostic pop")
#endif

#define ENABLE_COPY_SEMANTICS(cls) \
    cls(const cls &) = default;    \
    cls &operator=(const cls &) = default;

#define DISABLE_COPY_SEMANTICS(cls) \
    cls(const cls &) = delete;      \
    cls &operator=(const cls &) = delete;

#define ENABLE_MOVE_SEMANTICS(cls) \
    cls(cls &&)  = default;        \
    cls &operator=(cls &&) = default;

#define DISABLE_MOVE_SEMANTICS(cls) \
    cls(cls &&)  = delete;          \
    cls &operator=(cls &&) = delete;

#if (CC_COMPILER == CC_COMPILER_MSVC)
    #define CC_ALIGN(N)        __declspec(align(N))
    #define CC_CACHE_ALIGN     __declspec(align(CC_CACHELINE_SIZE))
    #define CC_PACKED_ALIGN(N) __declspec(align(N))

    #define CC_ALIGNED_DECL(type, var, alignment) __declspec(align(alignment)) type var

    #define CC_READ_COMPILER_BARRIER()  _ReadBarrier()
    #define CC_WRITE_COMPILER_BARRIER() _WriteBarrier()
    #define CC_COMPILER_BARRIER()       _ReadWriteBarrier()

    #define CC_READ_MEMORY_BARRIER()  MemoryBarrier()
    #define CC_WRITE_MEMORY_BARRIER() MemoryBarrier()
    #define CC_MEMORY_BARRIER()       MemoryBarrier()

    #define CC_CPU_READ_MEMORY_BARRIER() \
        do {                             \
            __asm { lfence}               \
        } while (0)
    #define CC_CPU_WRITE_MEMORY_BARRIER() \
        do {                              \
            __asm { sfence}                \
        } while (0)
    #define CC_CPU_MEMORY_BARRIER() \
        do {                        \
            __asm { mfence}          \
        } while (0)

#elif (CC_COMPILER == CC_COMPILER_GNUC) || (CC_COMPILER == CC_COMPILER_CLANG)
    #define CC_ALIGN(N)        __attribute__((__aligned__((N))))
    #define CC_CACHE_ALIGN     __attribute__((__aligned__((CC_CACHELINE_SIZE))))
    #define CC_PACKED_ALIGN(N) __attribute__((packed, aligned(N)))

    #define CC_ALIGNED_DECL(type, var, alignment) type var __attribute__((__aligned__(alignment)))

    #define CC_READ_COMPILER_BARRIER()        \
        do {                                  \
            __asm__ __volatile__(""           \
                                 :            \
                                 :            \
                                 : "memory"); \
        } while (0)
    #define CC_WRITE_COMPILER_BARRIER()       \
        do {                                  \
            __asm__ __volatile__(""           \
                                 :            \
                                 :            \
                                 : "memory"); \
        } while (0)
    #define CC_COMPILER_BARRIER()             \
        do {                                  \
            __asm__ __volatile__(""           \
                                 :            \
                                 :            \
                                 : "memory"); \
        } while (0)

    #define CC_READ_MEMORY_BARRIER() \
        do {                         \
            __sync_synchronize();    \
        } while (0)
    #define CC_WRITE_MEMORY_BARRIER() \
        do {                          \
            __sync_synchronize();     \
        } while (0)
    #define CC_MEMORY_BARRIER()   \
        do {                      \
            __sync_synchronize(); \
        } while (0)

    #define CC_CPU_READ_MEMORY_BARRIER()      \
        do {                                  \
            __asm__ __volatile__("lfence"     \
                                 :            \
                                 :            \
                                 : "memory"); \
        } while (0)
    #define CC_CPU_WRITE_MEMORY_BARRIER()     \
        do {                                  \
            __asm__ __volatile__("sfence"     \
                                 :            \
                                 :            \
                                 : "memory"); \
        } while (0)
    #define CC_CPU_MEMORY_BARRIER()           \
        do {                                  \
            __asm__ __volatile__("mfence"     \
                                 :            \
                                 :            \
                                 : "memory"); \
        } while (0)

#else
    #error "Unsupported compiler!"
#endif

#define CC_SIMD_ALIGNMENT 16

#if (CC_COMPILER == CC_COMPILER_MSVC)
    #define CC_DECL_MALLOC __declspec(restrict) __declspec(noalias)
#else
    #define CC_DECL_MALLOC __attribute__((malloc))
#endif

/* Stack-alignment
 If macro __CC_SIMD_ALIGN_STACK defined, means there requests
 special code to ensure stack align to a 16-bytes boundary.

 Note:
 This macro can only guarantee callee stack pointer (esp) align
 to a 16-bytes boundary, but not that for frame pointer (ebp).
 Because most compiler might use frame pointer to access to stack
 variables, so you need to wrap those alignment required functions
 with extra function call.
 */
#if defined(__INTEL_COMPILER)
    // For intel's compiler, simply calling alloca seems to do the right
    // thing. The size of the allocated block seems to be irrelevant.
    #define CC_SIMD_ALIGN_STACK() _alloca(16)
    #define CC_SIMD_ALIGN_ATTRIBUTE

#elif (CC_CPU == CC_CPU_X86) && (CC_COMPILER == CC_COMPILER_GNUC || CC_COMPILER == CC_COMPILER_CLANG) && (CC_CPU_ARCH != CC_CPU_ARCH_64)
    // mark functions with GCC attribute to force stack alignment to 16 bytes
    #define CC_SIMD_ALIGN_ATTRIBUTE __attribute__((force_align_arg_pointer))
#elif (CC_COMPILER == CC_COMPILER_MSVC)
    // Fortunately, MSVC will align the stack automatically
    #define CC_SIMD_ALIGN_ATTRIBUTE
#else
    #define CC_SIMD_ALIGN_ATTRIBUTE
#endif

// mode
#if (defined(_DEBUG) || defined(DEBUG)) && (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #define CC_MODE CC_MODE_DEBUG
#else
    #define CC_MODE CC_MODE_RELEASE
#endif

// Engine Memory Management
// #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
//     #if (CC_MODE == CC_MODE_DEBUG)
//         #define CC_MEMORY_TRACKER
//     #endif
// #elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
// //#    define CC_MEMORY_TRACKER
// #else
// #endif

// use simd
//#define CC_USE_SIMD

// Memory Allocator
// #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
//     #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_STD
//     #undef CC_MEMORY_TRACKER
// //#if defined(CC_MEMORY_TRACKER)
// //#    define CC_MEMORY_ALLOCATOR  CC_MEMORY_ALLOCATOR_JEMALLOC
// //#else
// //#    define CC_MEMORY_ALLOCATOR  CC_MEMORY_ALLOCATOR_STD
// //#endif
// #elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
//     #if defined(CC_MEMORY_TRACKER)
//         #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_JEMALLOC
//     #else
//         #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_STD
//     #endif
// #else
//     #define CC_MEMORY_ALLOCATOR CC_MEMORY_ALLOCATOR_STD
// #endif

// // STL memory allocator
// #if (CC_MEMORY_ALLOCATOR == CC_MEMORY_ALLOCATOR_STD)
//     #define CC_STL_MEMORY_ALLOCATOR CC_STL_MEMORY_ALLOCATOR_STANDARD
// #else
//     #define CC_STL_MEMORY_ALLOCATOR CC_STL_MEMORY_ALLOCATOR_CUSTOM
// #endif

#define CC_TOSTR(s) #s

#define ENABLE_IF_T(t1)          std::enable_if_t<std::is_same<t1, T>::value, T>
#define ENABLE_IF_T2(t1, t2)     std::enable_if_t<std::is_same<t1, T>::value || std::is_same<t2, T>::value, T>
#define ENABLE_IF_T3(t1, t2, t3) std::enable_if_t<std::is_same<t1, T>::value || std::is_same<t2, T>::value || std::is_same<t3, T>::value, T>

#define ENABLE_IF_T_RET(t1)          std::enable_if_t<std::is_same<t1, T>::value, RET>
#define ENABLE_IF_T2_RET(t1, t2)     std::enable_if_t<std::is_same<t1, T>::value || std::is_same<t2, T>::value, RET>
#define ENABLE_IF_T3_RET(t1, t2, t3) std::enable_if_t<std::is_same<t1, T>::value || std::is_same<t2, T>::value || std::is_same<t3, T>::value, void>
