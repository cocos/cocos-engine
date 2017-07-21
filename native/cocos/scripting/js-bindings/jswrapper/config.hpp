#pragma once

//#define SCRIPT_ENGINE_SM
//#define SCRIPT_ENGINE_V8
//#define SCRIPT_ENGINE_JSC
#define SCRIPT_ENGINE_CHAKRACORE

#ifdef ANDROID

#include <android/log.h>

#define  LOG_TAG    "jswrapper"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
#define  LOGE(...)  __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

#else

#define LOGD printf
#define LOGE printf

#endif
