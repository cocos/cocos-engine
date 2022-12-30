/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "base/Log.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #if defined(CC_STATIC)
        #define CC_GLES2_API
    #else
        #ifdef CC_GLES2_EXPORTS
            #define CC_GLES2_API __declspec(dllexport)
        #else
            #define CC_GLES2_API __declspec(dllimport)
        #endif
    #endif
#else
    #define CC_GLES2_API
#endif

#if CC_DEBUG > 0
    #define GL_CHECK(x)                                              \
        do {                                                         \
            x;                                                       \
            GLenum err = glGetError();                               \
            if (err != GL_NO_ERROR) {                                \
                CC_LOG_ERROR("%s returned GL error: 0x%x", #x, err); \
                CC_ABORT();                                          \
            }                                                        \
        } while (0)
    #define EGL_CHECK(x)                                              \
        do {                                                          \
            x;                                                        \
            EGLint err = eglGetError();                               \
            if (err != EGL_SUCCESS) {                                 \
                CC_LOG_ERROR("%s returned EGL error: 0x%x", #x, err); \
                CC_ABORT();                                           \
            }                                                         \
        } while (0)
#else
    #define GL_CHECK(x)  x
    #define EGL_CHECK(x) x
#endif
