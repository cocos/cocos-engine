/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

#include "PlatformUtils.h"
#include "../config.hpp"

#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#elif TARGET_OS_MAC
#import <Foundation/Foundation.h>
#endif

namespace se {

    bool isSupportTypedArrayAPI()
    {
        static bool isSupported = false;
        static bool isInited = false;
        if (!isInited)
        {
#if TARGET_OS_IPHONE
            float version = [[UIDevice currentDevice].systemVersion floatValue];
            isSupported = (version >= 10.0f);
#elif TARGET_OS_MAC
            NSOperatingSystemVersion minimumSupportedOSVersion = { .majorVersion = 10, .minorVersion = 12, .patchVersion = 0 };
            isSupported = [NSProcessInfo.processInfo isOperatingSystemAtLeastVersion:minimumSupportedOSVersion] ? true : false;
#else
            SE_LOGE("isSupportTypedArrayAPI: Unknown system!");
#endif
            isInited = true;
        }
        return isSupported;
    }

    bool isSupportArrayTestAPI()
    {
        static bool isSupported = false;
        static bool isInited = false;
        if (!isInited)
        {
#if TARGET_OS_IPHONE
            float version = [[UIDevice currentDevice].systemVersion floatValue];
            isSupported = (version >= 9.0f);
#elif TARGET_OS_MAC
            NSOperatingSystemVersion minimumSupportedOSVersion = { .majorVersion = 10, .minorVersion = 11, .patchVersion = 0 };
            isSupported = [NSProcessInfo.processInfo isOperatingSystemAtLeastVersion:minimumSupportedOSVersion] ? true : false;
#else
            SE_LOGE("isSupportArrayTestAPI: Unknown system!");
#endif
            isInited = true;
        }
        return isSupported;
    }

} // namespace se
