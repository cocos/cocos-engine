/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

#define SCRIPT_ENGINE_NONE 0
//#define SCRIPT_ENGINE_SM             1
#define SCRIPT_ENGINE_V8  2
#define SCRIPT_ENGINE_JSC 3
//#define SCRIPT_ENGINE_CHAKRACORE     4

#ifndef SCRIPT_ENGINE_TYPE
    #define SCRIPT_ENGINE_TYPE SCRIPT_ENGINE_V8
#endif

#ifndef USE_V8_DEBUGGER
    #if defined(CC_DEBUG) && CC_DEBUG > 0
        #define USE_V8_DEBUGGER 1
    #else
        #define USE_V8_DEBUGGER 0
    #endif
#endif

#define SE_LOG_TO_JS_ENV 0 // print log to JavaScript environment, for example DevTools

#if !defined(ANDROID_INSTANT) && defined(USE_V8_DEBUGGER) && USE_V8_DEBUGGER > 0
    #define SE_ENABLE_INSPECTOR 1
    #define SE_DEBUG            2
    #define HAVE_INSPECTOR      1
#else
    #define SE_ENABLE_INSPECTOR 0
    #define SE_DEBUG            0
    #define HAVE_INSPECTOR      0
#endif

#ifdef ANDROID

    #include <android/log.h>

    #define LOG_TAG      "jswrapper"
    #define SE_LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
    #define SE_LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)
#elif __OHOS__
    #if 1
        #include "cocos/base/Log.h"
        #define SE_LOGD(...) CC_LOG_DEBUG(__VA_ARGS__)
        #define SE_LOGE(...) CC_LOG_ERROR(__VA_ARGS__)
    #else
        #define SE_LOGD(...)
        #define SE_LOGE(...)
    #endif
#elif defined(_WIN32) && defined(_WINDOWS)

    #ifndef QUOTEME_
        #define QUOTEME_(x) #x
    #endif

    #ifndef QUOTEME
        #define QUOTEME(x) QUOTEME_(x)
    #endif

void seLogD(const char *format, ...);
void seLogE(const char *format, ...);

    #define LOG_TAG           "jswrapper"
    #define SE_LOGD(fmt, ...) seLogD("D/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)
    #define SE_LOGE(fmt, ...) seLogE("E/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)

#else

    #define SE_LOGD(...)                  \
        do {                              \
            fprintf(stdout, __VA_ARGS__); \
            fflush(stdout);               \
        } while (false)
    #define SE_LOGE(...)                  \
        do {                              \
            fprintf(stderr, __VA_ARGS__); \
            fflush(stderr);               \
        } while (false)

#endif

#if defined(__unix__) || (defined(__APPLE__) && defined(__MACH__))

    #define __POSIX__ //NOLINT

#endif

#if defined(_WIN32) && defined(_WINDOWS)
    #include <BaseTsd.h>

    #if !defined(__SSIZE_T)
typedef SSIZE_T ssize_t;
        #define __SSIZE_T
        #define _SSIZE_T_DEFINED // libuv also defines ssize_t, use the one defined here.
    #endif                       // __SSIZE_T

#endif // #if defined(_WIN32) && defined(_WINDOWS)

/** @def SE_DEPRECATED_ATTRIBUTE
 * Only certain compilers support __attribute__((deprecated)).
 */
#if defined(__GNUC__) && ((__GNUC__ >= 4) || ((__GNUC__ == 3) && (__GNUC_MINOR__ >= 1)))
    #define SE_DEPRECATED_ATTRIBUTE __attribute__((deprecated))
#elif _MSC_VER >= 1400 //vs 2005 or higher
    #define SE_DEPRECATED_ATTRIBUTE __declspec(deprecated)
#else
    #define SE_DEPRECATED_ATTRIBUTE
#endif // SE_DEPRECATED_ATTRIBUTE
