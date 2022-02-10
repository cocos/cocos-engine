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

#include "platform/interfaces/modules/Device.h"

#include "application/ApplicationManager.h"
#include "platform/interfaces/modules/IAccelerometer.h"
#include "platform/interfaces/modules/IBattery.h"
#include "platform/interfaces/modules/INetwork.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/interfaces/modules/IVibrator.h"

namespace cc {

int Device::getDPI() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IScreen) != nullptr, "Screen interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getDPI();
}

float Device::getDevicePixelRatio() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IScreen) != nullptr, "Screen interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getDevicePixelRatio();
}

void Device::setKeepScreenOn(bool keepScreenOn) {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IScreen) != nullptr, "Screen interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IScreen)->setKeepScreenOn(keepScreenOn);
}

void Device::setAccelerometerEnabled(bool isEnabled) {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IAccelerometer) != nullptr, "Accelerometer interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IAccelerometer)->setAccelerometerEnabled(isEnabled);
}

void Device::setAccelerometerInterval(float interval) {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IAccelerometer) != nullptr, "Accelerometer interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IAccelerometer)->setAccelerometerInterval(interval);
}

const IAccelerometer::MotionValue &Device::getDeviceMotionValue() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IAccelerometer) != nullptr, "Accelerometer interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IAccelerometer)->getDeviceMotionValue();
}

IScreen::Orientation Device::getDeviceOrientation() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IScreen) != nullptr, "Screen interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getDeviceOrientation();
}

std::string Device::getDeviceModel() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(ISystem) != nullptr, "System interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(ISystem)->getDeviceModel();
}

void Device::vibrate(float duration) {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IVibrator) != nullptr, "Vibrator interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IVibrator)->vibrate(duration);
}

float Device::getBatteryLevel() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IBattery) != nullptr, "Battery interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IBattery)->getBatteryLevel();
}

INetwork::NetworkType Device::getNetworkType() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(INetwork) != nullptr, "Network interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(INetwork)->getNetworkType();
}

Vec4 Device::getSafeAreaEdge() {
    CCASSERT(CC_GET_PLATFORM_INTERFACE(IScreen) != nullptr, "Screen interface does not exist");
    return CC_GET_PLATFORM_INTERFACE(IScreen)->getSafeAreaEdge();
}

} // namespace cc