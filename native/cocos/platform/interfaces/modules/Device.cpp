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

#include "platform/interfaces/modules/Device.h"

#include "application/ApplicationManager.h"
#include "platform/interfaces/modules/IAccelerometer.h"
#include "platform/interfaces/modules/IBattery.h"
#include "platform/interfaces/modules/INetwork.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/interfaces/modules/IVibrator.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"

namespace cc {

int Device::getDPI() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IScreen));
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getDPI();
}

float Device::getDevicePixelRatio() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IScreen));
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getDevicePixelRatio();
}

void Device::setKeepScreenOn(bool keepScreenOn) {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IScreen));
    return CC_GET_PLATFORM_INTERFACE(IScreen)->setKeepScreenOn(keepScreenOn);
}

void Device::setAccelerometerEnabled(bool isEnabled) {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IAccelerometer));
    return CC_GET_PLATFORM_INTERFACE(IAccelerometer)->setAccelerometerEnabled(isEnabled);
}

void Device::setAccelerometerInterval(float interval) {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IAccelerometer));
    return CC_GET_PLATFORM_INTERFACE(IAccelerometer)->setAccelerometerInterval(interval);
}

const IAccelerometer::MotionValue &Device::getDeviceMotionValue() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IAccelerometer));
    return CC_GET_PLATFORM_INTERFACE(IAccelerometer)->getDeviceMotionValue();
}

IScreen::Orientation Device::getDeviceOrientation() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IScreen));
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getDeviceOrientation();
}

ccstd::string Device::getDeviceModel() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(ISystem));
    return CC_GET_PLATFORM_INTERFACE(ISystem)->getDeviceModel();
}

void Device::vibrate(float duration) {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IVibrator));
    return CC_GET_PLATFORM_INTERFACE(IVibrator)->vibrate(duration);
}

float Device::getBatteryLevel() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IBattery));
    return CC_GET_PLATFORM_INTERFACE(IBattery)->getBatteryLevel();
}

INetwork::NetworkType Device::getNetworkType() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(INetwork));
    return CC_GET_PLATFORM_INTERFACE(INetwork)->getNetworkType();
}

Vec4 Device::getSafeAreaEdge() {
    CC_ASSERT_NOT_NULL(CC_GET_PLATFORM_INTERFACE(IScreen));
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getSafeAreaEdge();
}

} // namespace cc
