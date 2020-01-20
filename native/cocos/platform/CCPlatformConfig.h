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
#pragma once

/// @cond DO_NOT_SHOW

// Initial platform stuff to set.
#define CC_PLATFORM_WINDOWS     1
#define CC_PLATFORM_LINUX       2
#define CC_PLATFORM_MAC_OSX     3
#define CC_PLATFORM_MAC_IOS     4
#define CC_PLATFORM_ANDROID     5
#define CC_PLATFORM_NACL        6

// Platform recognition
#if defined(_WIN32) || defined(__WIN32__) || defined(WIN32) || defined(_WIN64) || defined(__WIN64__) || defined(WIN64)
#    define CC_PLATFORM    CC_PLATFORM_WINDOWS
#elif defined(__APPLE_CC__)
// Device                                                     Simulator
// Both requiring OS version 4.0 or greater
#   if __ENVIRONMENT_IPHONE_OS_VERSION_MIN_REQUIRED__ >= 40000 || __IPHONE_OS_VERSION_MIN_REQUIRED >= 40000
#       define CC_PLATFORM        CC_PLATFORM_MAC_IOS
#   else
#       define CC_PLATFORM        CC_PLATFORM_MAC_OSX
#   endif
#elif defined(__ANDROID__)
#    define CC_PLATFORM   CC_PLATFORM_ANDROID
#elif defined(linux) || defined(__linux) || defined(__linux__)
#    define CC_PLATFORM   CC_PLATFORM_LINUX
#elif defined(__native_client__)
#   define CC_PLATFORM   CC_PLATFORM_NACL
#else
#    error "Couldn't recognize platform"
#endif

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
#ifndef __MINGW32__
#pragma warning (disable:4127)
#endif
#endif

/// @endcond
