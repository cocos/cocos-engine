/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/openharmony/modules/Accelerometer.h"
#include "platform/openharmony/napi/NapiHelper.h"

namespace cc {

void Accelerometer::setAccelerometerEnabled(bool isEnabled) {
    //setAccelerometerEnabledJNI(isEnabled);
}

void Accelerometer::setAccelerometerInterval(float interval) {
    //setAccelerometerIntervalJNI(interval);
}

const Accelerometer::MotionValue &Accelerometer::getDeviceMotionValue() {
    static MotionValue motionValue;
    Napi::Value ret = NapiHelper::napiCallFunction("getDeviceMotionValue");
    if (!ret.IsArray()) {
        return motionValue;
    }

    auto v = ret.As<Napi::Array>();
    if (v.Length() == 9) {
        motionValue.accelerationIncludingGravityX = static_cast<Napi::Value>(v[(uint32_t)0]).As<Napi::Number>().FloatValue();
        motionValue.accelerationIncludingGravityY = static_cast<Napi::Value>(v[(uint32_t)1]).As<Napi::Number>().FloatValue();
        motionValue.accelerationIncludingGravityZ = static_cast<Napi::Value>(v[(uint32_t)2]).As<Napi::Number>().FloatValue();

        motionValue.accelerationX = static_cast<Napi::Value>(v[(uint32_t)3]).As<Napi::Number>().FloatValue();
        motionValue.accelerationY = static_cast<Napi::Value>(v[(uint32_t)4]).As<Napi::Number>().FloatValue();
        motionValue.accelerationZ = static_cast<Napi::Value>(v[(uint32_t)5]).As<Napi::Number>().FloatValue();

        motionValue.rotationRateAlpha = static_cast<Napi::Value>(v[(uint32_t)6]).As<Napi::Number>().FloatValue();
        motionValue.rotationRateBeta = static_cast<Napi::Value>(v[(uint32_t)7]).As<Napi::Number>().FloatValue();
        motionValue.rotationRateGamma = static_cast<Napi::Value>(v[(uint32_t)8]).As<Napi::Number>().FloatValue();
    } else {
        memset(&motionValue, 0, sizeof(motionValue));
    }
    return motionValue;
}

} // namespace cc
