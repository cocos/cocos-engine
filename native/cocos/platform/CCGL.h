/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
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

#ifndef __PLATFORM_CCGL_H__
#define __PLATFORM_CCGL_H__
/// @cond DO_NOT_SHOW

#include "platform/CCPlatformConfig.h"

#ifndef GL_TEXTURE_MIN_LOD
#define GL_TEXTURE_MIN_LOD 0x813A
#endif

#ifndef GL_UNPACK_FLIP_Y_WEBGL
#define GL_UNPACK_FLIP_Y_WEBGL 0x9240
#endif

#ifndef GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL
#define GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL 0x9241
#endif

#ifndef GL_CONTEXT_LOST_WEBGL
#define GL_CONTEXT_LOST_WEBGL 0x9242
#endif

#ifndef GL_UNPACK_COLORSPACE_CONVERSION_WEBGL
#define GL_UNPACK_COLORSPACE_CONVERSION_WEBGL 0x9243
#endif

#ifndef GL_BROWSER_DEFAULT_WEBGL
#define GL_BROWSER_DEFAULT_WEBGL 0x9244
#endif

#ifndef GL_DEPTH_STENCIL_ATTACHMENT
#define GL_DEPTH_STENCIL_ATTACHMENT 0x821A
#endif

/* Shader Precision-Specified Types */
#ifndef GL_LOW_FLOAT
#define GL_LOW_FLOAT                                     0x8DF0
#endif

#ifndef GL_MEDIUM_FLOAT
#define GL_MEDIUM_FLOAT                                  0x8DF1
#endif

#ifndef GL_HIGH_FLOAT
#define GL_HIGH_FLOAT                                    0x8DF2
#endif

#ifndef GL_LOW_INT
#define GL_LOW_INT                                       0x8DF3
#endif

#ifndef GL_MEDIUM_INT
#define GL_MEDIUM_INT                                    0x8DF4
#endif

#ifndef GL_HIGH_INT
#define GL_HIGH_INT                                      0x8DF5
#endif

#ifndef GL_MAX_VERTEX_UNIFORM_VECTORS
#define GL_MAX_VERTEX_UNIFORM_VECTORS                  0x8DFB
#endif

#ifndef GL_MAX_FRAGMENT_UNIFORM_VECTORS
#define GL_MAX_FRAGMENT_UNIFORM_VECTORS                0x8DFD
#endif

#ifndef GL_MAX_VARYING_VECTORS
#define GL_MAX_VARYING_VECTORS                         0x8DFC
#endif

#ifndef GL_DEPTH_STENCIL
#define GL_DEPTH_STENCIL 0x84F9
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC
#include "platform/mac/CCGL-mac.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "platform/ios/CCGL-ios.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "platform/android/CCGL-android.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
#include "platform/win32/CCGL-win32.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_WINRT
#include "platform/winrt/CCGL.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_LINUX
#include "platform/linux/CCGL-linux.h"
#endif

/// @endcond
#endif /* __PLATFORM_CCPLATFORMDEFINE_H__*/

