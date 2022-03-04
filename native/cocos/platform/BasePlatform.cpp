/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/BasePlatform.h"
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "platform/win32/WindowsPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "platform/android/AndroidPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include "platform/ohos/OhosPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    #include "platform/mac/MacPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #include "platform/ios/IOSPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    #include "platform/linux/LinuxPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_QNX)
    #include "platform/qnx/QnxPlatform.h"
#endif

namespace cc {
BasePlatform::BasePlatform()  = default;
BasePlatform::~BasePlatform() = default;

BasePlatform *BasePlatform::getPlatform() {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    static WindowsPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    static AndroidPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    static OhosPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    static MacPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    static IOSPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    static LinuxPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_QNX)
    static QnxPlatform platform;
#endif
    return &platform;
}
} // namespace cc