/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/modules/Accelerometer.h"
#include "platform/java/jni/JniImp.h"

namespace cc {

void Accelerometer::setAccelerometerEnabled(bool isEnabled) {
    setAccelerometerEnabledJNI(isEnabled);
}

void Accelerometer::setAccelerometerInterval(float interval) {
    setAccelerometerIntervalJNI(interval);
}

const Accelerometer::MotionValue &Accelerometer::getDeviceMotionValue() {
    static MotionValue motionValue;
    float *v = getDeviceMotionValueJNI();

    if (v) {
        motionValue.accelerationIncludingGravityX = v[0];
        motionValue.accelerationIncludingGravityY = v[1];
        motionValue.accelerationIncludingGravityZ = v[2];

        motionValue.accelerationX = v[3];
        motionValue.accelerationY = v[4];
        motionValue.accelerationZ = v[5];

        motionValue.rotationRateAlpha = v[6];
        motionValue.rotationRateBeta = v[7];
        motionValue.rotationRateGamma = v[8];
    } else {
        memset(&motionValue, 0, sizeof(motionValue));
    }
    return motionValue;
}

} // namespace cc
