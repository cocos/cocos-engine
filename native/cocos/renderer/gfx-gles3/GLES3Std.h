/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #if defined(CC_STATIC)
        #define CC_GLES3_API
    #else
        #ifdef CC_GLES3_EXPORTS
            #define CC_GLES3_API __declspec(dllexport)
        #else
            #define CC_GLES3_API __declspec(dllimport)
        #endif
    #endif
#else
    #define CC_GLES3_API
#endif

#if CC_DEBUG > 0
#define GL_CHECK(x)                                                  \
    do {                                                             \
        x; GLenum err = glGetError();                                \
        if (err != GL_NO_ERROR) {                                    \
            CC_LOG_ERROR("%s returned GL error: 0x%x", #x, err);     \
            CCASSERT(0, "GL error");                                 \
        }                                                            \
    } while (0)
#define EGL_CHECK(x)                                                 \
    do {                                                             \
        x; EGLint err = eglGetError();                               \
        if (err != EGL_SUCCESS) {                                    \
            CC_LOG_ERROR("%s returned EGL error: 0x%x", #x, err);    \
            CCASSERT(0, "EGL error");                                \
        }                                                            \
    } while (0)
#else
#define GL_CHECK(x) x
#define EGL_CHECK(x) x
#endif
