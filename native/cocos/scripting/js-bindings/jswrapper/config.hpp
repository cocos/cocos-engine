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

#else

#define LOGD printf
#define LOGE printf

#endif

#if defined (__unix__) || (defined (__APPLE__) && defined (__MACH__))

#define __POSIX__

#endif
