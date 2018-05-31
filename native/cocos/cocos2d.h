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

#ifndef __COCOS2D_H__
#define __COCOS2D_H__

// 0x00 HI ME LO
// 00   03 08 00
#define COCOS2D_VERSION 0x00031300

//
// all cocos2d include files
//
#include "base/ccConfig.h"

// base
#include "base/CCAutoreleasePool.h"
#include "base/CCData.h"
#include "base/CCMap.h"
#include "base/CCRef.h"
#include "base/CCRefPtr.h"
#include "base/CCValue.h"
#include "base/CCVector.h"
#include "base/ZipUtils.h"
#include "base/base64.h"
#include "base/ccConfig.h"
#include "base/ccMacros.h"
#include "base/ccTypes.h"
#include "base/ccUTF8.h"
#include "base/ccUtils.h"


// math
#include "math/CCGeometry.h"
#include "math/CCVertex.h"
#include "math/Mat4.h"
#include "math/MathUtil.h"
#include "math/Quaternion.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"


// include

// renderer

// platform
#include "platform/CCDevice.h"
#include "platform/CCFileUtils.h"
#include "platform/CCImage.h"
#include "platform/CCPlatformConfig.h"
#include "base/ccMacros.h"
#include "platform/CCSAXParser.h"
#include "platform/CCCanvasRenderingContext2D.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    #include "platform/ios/CCGL-ios.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    #include "platform/android/CCGL-android.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
    #include "platform/win32/CCGL-win32.h"
    #include "platform/win32/CCStdC-win32.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_WIN32

#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    #include "platform/mac/CCGL-mac.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_MAC

NS_CC_BEGIN

CC_DLL const char* cocos2dVersion();

NS_CC_END

#endif // __COCOS2D_H__

