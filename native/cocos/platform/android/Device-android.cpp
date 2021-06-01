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

#include <android/log.h>
#include <android/sensor.h>
#include <android/window.h>
#include <android_native_app_glue.h>
#include <jni.h>
#include <cstring>
#include "base/UTF8.h"
#include "platform/Device.h"
#include "platform/FileUtils.h"
#include "platform/android/jni/JniCocosActivity.h"
#include "platform/java/jni/JniHelper.h"

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
        AConfiguration *config = AConfiguration_new();
        AConfiguration_fromAssetManager(config, cocosApp.assetManager);
        int32_t density = AConfiguration_getDensity(config);
        AConfiguration_delete(config);
        const int stdDpi = 160;
        dpi              = density * stdDpi;
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

    motionValue.accelerationIncludingGravityX = v[0];
    motionValue.accelerationIncludingGravityY = v[1];
    motionValue.accelerationIncludingGravityZ = v[2];

    motionValue.accelerationX = v[3];
    motionValue.accelerationY = v[4];
    motionValue.accelerationZ = v[5];

    motionValue.rotationRateAlpha = v[6];
    motionValue.rotationRateBeta  = v[7];
    motionValue.rotationRateGamma = v[8];

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
            return Orientation::LANDSCAPE_LEFT;
        default:
            break;
    }
    return Orientation::PORTRAIT;
}

std::string Device::getDeviceModel() {
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getDeviceModel");
}

void Device::setKeepScreenOn(bool keepScreenOn) {
    // JniHelper::callStaticVoidMethod(JCLS_HELPER, "setKeepScreenOn", value);
    //    ANativeActivity_setWindowFlags(JniHelper::getAndroidApp()->activity, AWINDOW_FLAG_KEEP_SCREEN_ON, 0);
    CC_UNUSED_PARAM(keepScreenOn);
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
