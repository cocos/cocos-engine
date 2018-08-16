/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#include "platform/CCPlatformConfig.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include <android/log.h>
#endif

#ifndef RENDERER_BEGIN
#define RENDERER_BEGIN namespace cocos2d { namespace renderer {
#endif // RENDERER_BEGIN

#ifndef RENDERER_END
#define RENDERER_END }}
#endif // RENDERER_END

//#ifndef DISALLOW_COPY_ASSIGN_AND_MOVE
    #define CC_DISALLOW_COPY_ASSIGN_AND_MOVE(type) \
        type(const type&) = delete; \
        type& operator =(const type&) = delete; \
        type(type &&) = delete; \
        type& operator =(const type &&) = delete;
//#endif // DISALLOW_COPY_ASSIGN_AND_MOVE

#define RENDERER_LOG_TAG "renderer"
#define RENDERER_QUOTEME_(x) #x
#define RENDERER_QUOTEME(x) RENDERER_QUOTEME_(x)

#if defined(COCOS2D_DEBUG) && COCOS2D_DEBUG > 0
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#define RENDERER_LOGV(fmt, ...) __android_log_print(ANDROID_LOG_VERBOSE, RENDERER_LOG_TAG, " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#else
#define RENDERER_LOGV(fmt, ...) printf("V/" RENDERER_LOG_TAG " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#endif // (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#else
#define RENDERER_LOGV(fmt, ...) do {} while(false)
#endif // defined(COCOS2D_DEBUG) && COCOS2D_DEBUG > 0

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#define RENDERER_LOGD(fmt, ...) __android_log_print(ANDROID_LOG_DEBUG, RENDERER_LOG_TAG, " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define RENDERER_LOGI(fmt, ...) __android_log_print(ANDROID_LOG_INFO, RENDERER_LOG_TAG, " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define RENDERER_LOGW(fmt, ...) __android_log_print(ANDROID_LOG_WARN, RENDERER_LOG_TAG, " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define RENDERER_LOGE(fmt, ...) __android_log_print(ANDROID_LOG_ERROR, RENDERER_LOG_TAG, " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#else
#define RENDERER_LOGD(fmt, ...) printf("D/" RENDERER_LOG_TAG " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define RENDERER_LOGI(fmt, ...) printf("I/" RENDERER_LOG_TAG " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define RENDERER_LOGW(fmt, ...) printf("W/" RENDERER_LOG_TAG " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#define RENDERER_LOGE(fmt, ...) printf("E/" RENDERER_LOG_TAG " (" RENDERER_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)
#endif // (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)


#define RENDERER_DEBUG 1 // REFINE: remove this

#define RENDERER_SAFE_RELEASE(p) do { if((p) != nullptr) (p)->release(); } while(false)
#define RENDERER_SAFE_RETAIN(p) do { if((p) != nullptr) (p)->retain(); } while(false)

#define RENDERER_DEFINE_CREATE_METHOD_0(clsName, initMethod) \
static clsName* create() \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod()) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

#define RENDERER_DEFINE_CREATE_METHOD_1(clsName, initMethod, arg0Type) \
static clsName* create(arg0Type arg0) \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod(arg0)) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

#define RENDERER_DEFINE_CREATE_METHOD_2(clsName, initMethod, arg0Type, arg1Type) \
static clsName* create(arg0Type arg0, arg1Type arg1) \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod(arg0, arg1)) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

#define RENDERER_DEFINE_CREATE_METHOD_3(clsName, initMethod, arg0Type, arg1Type, arg2Type) \
static clsName* create(arg0Type arg0, arg1Type arg1, arg2Type arg2) \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod(arg0, arg1, arg2)) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

#define RENDERER_DEFINE_CREATE_METHOD_4(clsName, initMethod, arg0Type, arg1Type, arg2Type, arg3Type) \
static clsName* create(arg0Type arg0, arg1Type arg1, arg2Type arg2, arg3Type arg3) \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod(arg0, arg1, arg2, arg3)) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

#define RENDERER_DEFINE_CREATE_METHOD_5(clsName, initMethod, arg0Type, arg1Type, arg2Type, arg3Type, arg4Type) \
static clsName* create(arg0Type arg0, arg1Type arg1, arg2Type arg2, arg3Type arg3, arg4Type arg4) \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod(arg0, arg1, arg2, arg3, arg4)) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

#define RENDERER_DEFINE_CREATE_METHOD_6(clsName, initMethod, arg0Type, arg1Type, arg2Type, arg3Type, arg4Type, arg5Type) \
static clsName* create(arg0Type arg0, arg1Type arg1, arg2Type arg2, arg3Type arg3, arg4Type arg4, arg5Type arg5) \
{ \
    clsName* ret = new (std::nothrow) clsName(); \
    if (ret && ret->initMethod(arg0, arg1, arg2, arg3, arg4, arg5)) \
    { \
        ret->autorelease(); \
        return ret; \
    } \
    delete ret; \
    return nullptr; \
}

// enum class to GLENUM
#define ENUM_CLASS_TO_GLENUM(value)  static_cast<GLenum>(value)

#define _GL_CHECK(_call) \
                do { \
                    _call; \
                    GLenum gl_err = glGetError(); \
                    if (0 != gl_err) \
                        RENDERER_LOGE(#_call "; GL error 0x%x: %s:%s", gl_err, glEnumName(gl_err), __FUNCTION__); \
                } while(false)


#if COCOS2D_DEBUG > 0
#   define GL_CHECK(_call)   _GL_CHECK(_call)
#else
#   define GL_CHECK(_call)   _call
#endif // BRENDERER_CONFIG_DEBUG

#ifndef RENDERER_PI
#define RENDERER_PI 3.1415926535897932385f
#endif // RENDERER_PI
