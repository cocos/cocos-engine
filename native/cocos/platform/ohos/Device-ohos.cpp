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

#include <hilog/log.h>
#include <jni.h>
#include <native_layer.h>
#include <native_layer_jni.h>
#include <cstring>
#include "base/UTF8.h"
#include "platform/Device.h"
#include "platform/FileUtils.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/ohos/jni/JniCocosAbility.h"

#ifndef JCLS_HELPER
    #define JCLS_HELPER "com/cocos/lib/CocosHelper"
#endif

#ifndef JCLS_SENSOR
    #define JCLS_SENSOR "com/cocos/lib/CocosSensorHandler"
#endif

namespace {
cc::Device::MotionValue motionValue;

// constant from Android API:
// reference: https://developer.android.com/reference/android/view/Surface#ROTATION_0
enum Rotation {
    ROTATION_0 = 0,
    ROTATION_90,
    ROTATION_180,
    ROTATION_270
};
} // namespace

namespace cc {

int Device::getDPI() {
    static int dpi = -1;
    if (dpi == -1) {
        dpi = JniHelper::callStaticIntMethod(JCLS_HELPER, "getDPI");
    }
    return dpi;
}

void Device::setAccelerometerEnabled(bool isEnabled) {
    JniHelper::callStaticVoidMethod(JCLS_SENSOR, "setAccelerometerEnabled", isEnabled);
}

void Device::setAccelerometerInterval(float interval) {
    JniHelper::callStaticVoidMethod(JCLS_SENSOR, "setAccelerometerInterval", interval);
}

const Device::MotionValue &Device::getDeviceMotionValue() {
    float *v = JniHelper::callStaticFloatArrayMethod(JCLS_SENSOR, "getDeviceMotionValue");

    if (v) {
        motionValue.accelerationIncludingGravityX = v[0];
        motionValue.accelerationIncludingGravityY = v[1];
        motionValue.accelerationIncludingGravityZ = v[2];

        motionValue.accelerationX = v[3];
        motionValue.accelerationY = v[4];
        motionValue.accelerationZ = v[5];

        motionValue.rotationRateAlpha = v[6];
        motionValue.rotationRateBeta  = v[7];
        motionValue.rotationRateGamma = v[8];
    } else {
        memset(&motionValue, 0, sizeof(motionValue));
    }
    return motionValue;
}

Device::Orientation Device::getDeviceOrientation() {
    int rotation = JniHelper::callStaticIntMethod(JCLS_HELPER, "getDeviceRotation");
    switch (rotation) {
        case ROTATION_0:
            return Orientation::PORTRAIT;
        case ROTATION_90:
            return Orientation::LANDSCAPE_RIGHT;
        case ROTATION_180:
            return Orientation::PORTRAIT_UPSIDE_DOWN;
        case ROTATION_270:
        default:
            return Orientation::LANDSCAPE_LEFT;
    }
}

std::string Device::getDeviceModel() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getDeviceModel");
}

void Device::setKeepScreenOn(bool keepScreenOn) {
    // JniHelper::callStaticVoidMethod(JCLS_HELPER, "setKeepScreenOn", value);
    //    ANativeActivity_setWindowFlags(JniHelper::getAndroidApp()->activity, AWINDOW_FLAG_KEEP_SCREEN_ON, 0);
}

void Device::vibrate(float duration) {
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "vibrate", duration);
}

float Device::getBatteryLevel() {
    return JniHelper::callStaticFloatMethod(JCLS_HELPER, "getBatteryLevel");
}

Device::NetworkType Device::getNetworkType() {
    return static_cast<Device::NetworkType>(JniHelper::callStaticIntMethod(JCLS_HELPER, "getNetworkType"));
}

cc::Vec4 Device::getSafeAreaEdge() {
    float *data = JniHelper::callStaticFloatArrayMethod(JCLS_HELPER, "getSafeArea");
    return cc::Vec4(data[0], data[1], data[2], data[3]);
}

float Device::getDevicePixelRatio() {
    return 1;
}
} // namespace cc
