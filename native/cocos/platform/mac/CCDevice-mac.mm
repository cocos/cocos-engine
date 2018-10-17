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

#include "platform/CCPlatformConfig.h"
#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC

#include "platform/CCDevice.h"
#include "platform/apple/CCDevice-apple.h"
#include "base/ccTypes.h"
#include "CCReachability.h"

#include <Foundation/Foundation.h>
#include <Cocoa/Cocoa.h>
#include <sys/utsname.h>
#include <string>

NS_CC_BEGIN

int Device::getDPI()
{
    NSScreen *screen = [NSScreen mainScreen];
    NSDictionary *description = [screen deviceDescription];
    NSSize displayPixelSize = [[description objectForKey:NSDeviceSize] sizeValue];
    CGSize displayPhysicalSize = CGDisplayScreenSize([[description objectForKey:@"NSScreenNumber"] unsignedIntValue]);
    
    return ((displayPixelSize.width / displayPhysicalSize.width) * 25.4f);
}

void Device::setAccelerometerEnabled(bool isEnabled)
{

}

void Device::setAccelerometerInterval(float interval)
{

}

const Device::MotionValue& Device::getDeviceMotionValue()
{
    static MotionValue __motionValue;
    return __motionValue;
}

Device::Rotation Device::getDeviceRotation()
{
    return Device::Rotation::_0;
}

std::string Device::getDeviceModel()
{
    struct utsname systemInfo;
    uname(&systemInfo);
    return systemInfo.machine;
}

void Device::setKeepScreenOn(bool value)
{
    CC_UNUSED_PARAM(value);
}

void Device::vibrate(float duration)
{
    CC_UNUSED_PARAM(duration);
}

float Device::getBatteryLevel()
{
    return 1.0f;
}

Device::NetworkType Device::getNetworkType()
{
    static Reachability* __reachability = nullptr;
    if (__reachability == nullptr)
    {
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
        default:
            ret = NetworkType::NONE;
            break;
    }

    return ret;
}

cocos2d::Vec4 Device::getSafeAreaEdge()
{
    // no SafeArea concept on mac, return ZERO Vec4.
    return cocos2d::Vec4();
}

NS_CC_END

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_MAC
