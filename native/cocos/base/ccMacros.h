/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "base/CCLog.h"
#include "base/ccConfig.h"
#include "platform/CCPlatformDefine.h"

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
    #if COCOS2D_DEBUG > 0
        // todo: minggo
        // #if CC_ENABLE_SCRIPT_BINDING
        // extern bool CC_DLL cc_assert_script_compatible(const char *msg);
        // #define CCASSERT(cond, msg) do {                              \
    //       if (!(cond)) {                                          \
    //         if (!cc_assert_script_compatible(msg) && strlen(msg)) \
    //           cocos2d::log("Assert failed: %s", msg);             \
    //         CC_ASSERT(cond);                                      \
    //       } \
    //     } while (0)
        // #else
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

/// @name namespace cocos2d
/// @{
#ifdef __cplusplus
    #define NS_CC_BEGIN namespace cocos2d {
    #define NS_CC_END   }
    #define USING_NS_CC using namespace cocos2d
    #define NS_CC       ::cocos2d

    #define NS_PP_BEGIN namespace pipeline {
    #define NS_PP_END   }
#else
    #define NS_CC_BEGIN
    #define NS_CC_END
    #define USING_NS_CC
    #define NS_CC

    #define NS_PP_BEGIN
    #define NS_PP_END
#endif
//  end of namespace group
/// @}

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

#define __CCLOGWITHFUNCTION(s, ...) \
    cocos2d::log("%s : %s", __FUNCTION__, cocos2d::StringUtils::format(s, ##__VA_ARGS__).c_str())

/// @name Cocos2d debug
/// @{
#if !defined(COCOS2D_DEBUG) || COCOS2D_DEBUG == 0
    #define CCLOG(...) \
        do {           \
        } while (0)
    #define CCLOGINFO(...) \
        do {               \
        } while (0)
    #define CCLOGERROR(...) \
        do {                \
        } while (0)
    #define CCLOGWARN(...) \
        do {               \
        } while (0)

#elif COCOS2D_DEBUG == 1

    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        #define COCOS_LOG_TAG "cocos2d-x"
        #define CCLOG(...)    __android_log_print(ANDROID_LOG_DEBUG, COCOS_LOG_TAG, __VA_ARGS__)
        #define CCLOGINFO(format, ...) \
            do {                       \
            } while (0)
        #define CCLOGWARN(...)  __android_log_print(ANDROID_LOG_WARN, COCOS_LOG_TAG, __VA_ARGS__)
        #define CCLOGERROR(...) __android_log_print(ANDROID_LOG_ERROR, COCOS_LOG_TAG, __VA_ARGS__)
    #else
        #define CCLOG(format, ...)      cocos2d::log(format, ##__VA_ARGS__)
        #define CCLOGERROR(format, ...) cocos2d::log(format, ##__VA_ARGS__)
        #define CCLOGINFO(format, ...) \
            do {                       \
            } while (0)
        #define CCLOGWARN(...) __CCLOGWITHFUNCTION(__VA_ARGS__)
    #endif

#elif COCOS2D_DEBUG > 1
    #define CCLOG(format, ...)      cocos2d::log(format, ##__VA_ARGS__)
    #define CCLOGERROR(format, ...) cocos2d::log(format, ##__VA_ARGS__)
    #define CCLOGINFO(format, ...)  cocos2d::log(format, ##__VA_ARGS__)
    #define CCLOGWARN(...)          __CCLOGWITHFUNCTION(__VA_ARGS__)
#endif // COCOS2D_DEBUG

//  end of debug group
/// @}

/** @def CC_DISALLOW_COPY_AND_ASSIGN(TypeName)
* A macro to disallow the copy constructor and operator= functions.
* This should be used in the private: declarations for a class
*/
#if defined(__GNUC__) && ((__GNUC__ >= 5) || ((__GNUG__ == 4) && (__GNUC_MINOR__ >= 4))) || (defined(__clang__) && (__clang_major__ >= 3)) || (_MSC_VER >= 1800)
    #define CC_DISALLOW_COPY_AND_ASSIGN(TypeName) \
        TypeName(const TypeName &) = delete;      \
        TypeName &operator=(const TypeName &) = delete;
#else
    #define CC_DISALLOW_COPY_AND_ASSIGN(TypeName) \
        TypeName(const TypeName &);               \
        TypeName &operator=(const TypeName &);
#endif

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
