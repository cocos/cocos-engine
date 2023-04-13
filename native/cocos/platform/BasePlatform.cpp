/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/BasePlatform.h"
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "platform/win32/WindowsPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "platform/android/AndroidPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    #include "platform/ohos/OhosPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_MACOS)
    #include "platform/mac/MacPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_IOS)
    #include "platform/ios/IOSPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    #include "platform/linux/LinuxPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_QNX)
    #include "platform/qnx/QnxPlatform.h"
#elif (CC_PLATFORM == CC_PLATFORM_OPENHARMONY)
    #include "platform/openharmony/OpenHarmonyPlatform.h"
#endif

namespace cc {
BasePlatform* BasePlatform::_currentPlatform = nullptr;

BasePlatform::BasePlatform() {
    // Only one platform can be initialized.
    CC_ASSERT_NULL(_currentPlatform);
    _currentPlatform = this;
}

BasePlatform::~BasePlatform() {
    _currentPlatform = nullptr;
}

BasePlatform* BasePlatform::createDefaultPlatform() {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    static WindowsPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    static AndroidPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    static OhosPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_MACOS)
    static MacPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_IOS)
    static IOSPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    static LinuxPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_QNX)
    static QnxPlatform platform;
#elif (CC_PLATFORM == CC_PLATFORM_OPENHARMONY)
    static OpenHarmonyPlatform platform;
#endif
    return &platform;
}

BasePlatform* BasePlatform::getPlatform() {
    if (_currentPlatform) {
        return _currentPlatform;
    }
    createDefaultPlatform();
    CC_ASSERT_NOT_NULL(_currentPlatform);
    return _currentPlatform;
}

} // namespace cc