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
    #define SCRIPT_ENGINE_TYPE           SCRIPT_ENGINE_NONE
#endif

#define SE_ENABLE_INSPECTOR 0

#define SE_DEBUG 2

#ifdef ANDROID

#include <android/log.h>

#define  LOG_TAG    "jswrapper"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
#define  LOGE(...)  __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

#elif defined(_WIN32) && defined(_WINDOWS)

#ifndef QUOTEME_
#define QUOTEME_(x) #x
#endif

#ifndef QUOTEME
#define QUOTEME(x) QUOTEME_(x)
#endif

void seLog(const char * format, ...);

#define LOG_TAG    "jswrapper"
#define LOGD(fmt, ...) seLog("D/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)
#define LOGE(fmt, ...) seLog("E/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)

#else

#define LOGD printf
#define LOGE printf

#endif

#if defined (__unix__) || (defined (__APPLE__) && defined (__MACH__))

#define __POSIX__

#endif

#if defined(_WIN32) && defined(_WINDOWS)
#include <BaseTsd.h>

#ifndef __SSIZE_T
#define __SSIZE_T
typedef SSIZE_T ssize_t;
#endif // __SSIZE_T

#endif

