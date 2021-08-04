/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX

    #include "platform/Device.h"
    #include "platform/apple/Device-apple.h"
    #include "Reachability.h"

    #include <Foundation/Foundation.h>
    #include <Cocoa/Cocoa.h>
    #include <sys/utsname.h>
    #include <string>

namespace cc {

int Device::getDPI() {
    NSScreen *screen = [NSScreen mainScreen];
    NSDictionary *description = [screen deviceDescription];
    NSSize displayPixelSize = [[description objectForKey:NSDeviceSize] sizeValue];
    CGSize displayPhysicalSize = CGDisplayScreenSize([[description objectForKey:@"NSScreenNumber"] unsignedIntValue]);

    return ((displayPixelSize.width / displayPhysicalSize.width) * 25.4f);
}

void Device::setAccelerometerEnabled(bool isEnabled) {
}

void Device::setAccelerometerInterval(float interval) {
}

const Device::MotionValue &Device::getDeviceMotionValue() {
    static MotionValue __motionValue;
    return __motionValue;
}

Device::Orientation Device::getDeviceOrientation() {
    return Device::Orientation::LANDSCAPE_RIGHT;
}

std::string Device::getDeviceModel() {
    struct utsname systemInfo;
    uname(&systemInfo);
    return systemInfo.machine;
}

void Device::setKeepScreenOn(bool value) {
    CC_UNUSED_PARAM(value);
}

void Device::vibrate(float duration) {
    CC_UNUSED_PARAM(duration);
}

float Device::getBatteryLevel() {
    return 1.0f;
}

Device::NetworkType Device::getNetworkType() {
    static Reachability *__reachability = nullptr;
    if (__reachability == nullptr) {
        __reachability = Reachability::createForInternetConnection();
        __reachability->retain();
    }

    NetworkType ret = NetworkType::NONE;
    Reachability::NetworkStatus status = __reachability->getCurrentReachabilityStatus();
    switch (status) {
        case Reachability::NetworkStatus::REACHABLE_VIA_WIFI:
            ret = NetworkType::LAN;
            break;
        case Reachability::NetworkStatus::REACHABLE_VIA_WWAN:
            ret = NetworkType::WWAN;
            break;
        default:
            ret = NetworkType::NONE;
            break;
    }

    return ret;
}

Vec4 Device::getSafeAreaEdge() {
    // no SafeArea concept on mac, return ZERO Vec4.
    return Vec4();
}

} // namespace cc

#endif // CC_PLATFORM == CC_PLATFORM_MAC_OSX
