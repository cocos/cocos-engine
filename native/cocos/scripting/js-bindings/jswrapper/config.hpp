/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

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

#define SCRIPT_ENGINE_NONE           0
#define SCRIPT_ENGINE_SM             1
#define SCRIPT_ENGINE_V8             2
#define SCRIPT_ENGINE_JSC            3
#define SCRIPT_ENGINE_CHAKRACORE     4

#if defined(__APPLE__) // macOS and iOS use JavaScriptCore
    #define SCRIPT_ENGINE_TYPE           SCRIPT_ENGINE_JSC
#elif defined(ANDROID) || (defined(_WIN32) && defined(_WINDOWS)) // Windows and Android use V8
    #define SCRIPT_ENGINE_TYPE           SCRIPT_ENGINE_V8
#else
    #error "Unknown Script Engine"
#endif

#if defined(COCOS2D_DEBUG) && COCOS2D_DEBUG > 0
#define SE_ENABLE_INSPECTOR 1
#define SE_DEBUG 2
#else
#define SE_ENABLE_INSPECTOR 0
#define SE_DEBUG 0
#endif

#ifdef ANDROID

#include <android/log.h>

#define  LOG_TAG    "jswrapper"
#define  SE_LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
#define  SE_LOGE(...)  __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

#elif defined(_WIN32) && defined(_WINDOWS)

#ifndef QUOTEME_
#define QUOTEME_(x) #x
#endif

#ifndef QUOTEME
#define QUOTEME(x) QUOTEME_(x)
#endif

void seLog(const char * format, ...);

#define LOG_TAG    "jswrapper"
#define SE_LOGD(fmt, ...) seLog("D/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)
#define SE_LOGE(fmt, ...) seLog("E/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)

#else

#define SE_LOGD(...) do { printf(__VA_ARGS__); fflush(stdout); } while (false)
#define SE_LOGE(...) do { printf(__VA_ARGS__); fflush(stdout); } while (false)

#endif

#if defined (__unix__) || (defined (__APPLE__) && defined (__MACH__))

#define __POSIX__

#endif

#if defined(_WIN32) && defined(_WINDOWS)
#include <BaseTsd.h>

#ifndef __SSIZE_T
#define __SSIZE_T
typedef SSIZE_T ssize_t;
#define _SSIZE_T_DEFINED // libuv also defines ssize_t, use the one defined here.
#endif // __SSIZE_T

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

