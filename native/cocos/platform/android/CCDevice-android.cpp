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
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID

#include "platform/CCDevice.h"
#include <string.h>
#include <android/log.h>
#include <jni.h>
#include "base/ccTypes.h"
#include "platform/android/jni/JniHelper.h"
#include "platform/CCFileUtils.h"
#include "base/ccUTF8.h"

#ifndef JCLS_HELPER
#define JCLS_HELPER "org/cocos2dx/lib/Cocos2dxHelper"
#endif

NS_CC_BEGIN

int Device::getDPI()
{
    static int dpi = -1;
    if (dpi == -1)
    {
        dpi = JniHelper::callStaticIntMethod(JCLS_HELPER, "getDPI");
    }
    return dpi;
}

void Device::setAccelerometerEnabled(bool isEnabled)
{
    if (isEnabled)
    {
        JniHelper::callStaticVoidMethod(JCLS_HELPER, "enableAccelerometer");
    }
    else
    {
        JniHelper::callStaticVoidMethod(JCLS_HELPER, "disableAccelerometer");
    }
}

void Device::setAccelerometerInterval(float interval)
{
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "setAccelerometerInterval", interval);
}

const Device::MotionValue& Device::getDeviceMotionValue()
{
    static MotionValue __motionValue;
    float* v = JniHelper::callStaticFloatArrayMethod(JCLS_HELPER, "getDeviceMotionValue");
    __motionValue.accelerationX = v[0];
    __motionValue.accelerationY = v[1];
    __motionValue.accelerationZ = v[2];

    __motionValue.accelerationIncludingGravityX = v[3];
    __motionValue.accelerationIncludingGravityY = v[4];
    __motionValue.accelerationIncludingGravityZ = v[5];

    __motionValue.rotationRateAlpha = v[6];
    __motionValue.rotationRateBeta = v[7];
    __motionValue.rotationRateGamma = v[8];

    return __motionValue;
}

Device::Rotation Device::getDeviceRotation()
{
    int rotation = JniHelper::callStaticIntMethod(JCLS_HELPER, "getDeviceRotation");
    return (Device::Rotation)rotation;
}

std::string Device::getDeviceModel()
{
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getDeviceModel");
}

void Device::setKeepScreenOn(bool value)
{
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "setKeepScreenOn", value);
}

void Device::vibrate(float duration)
{
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "vibrate", duration);
}

float Device::getBatteryLevel()
{
    return JniHelper::callStaticFloatMethod(JCLS_HELPER, "getBatteryLevel");
}

Device::NetworkType Device::getNetworkType()
{
    return (Device::NetworkType)JniHelper::callStaticIntMethod(JCLS_HELPER, "getNetworkType");
}

cocos2d::Vec4 Device::getSafeAreaEdge()
{
    // no SafeArea concept on android, return ZERO Vec4.
    return cocos2d::Vec4();
}

NS_CC_END

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
