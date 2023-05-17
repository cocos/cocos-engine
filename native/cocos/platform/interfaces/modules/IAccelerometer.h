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

#pragma once

#include "platform/interfaces/OSInterface.h"

namespace cc {

class CC_DLL IAccelerometer : public OSInterface {
public:
    struct MotionValue {
        float accelerationX = 0.0F;
        float accelerationY = 0.0F;
        float accelerationZ = 0.0F;

        float accelerationIncludingGravityX = 0.0F;
        float accelerationIncludingGravityY = 0.0F;
        float accelerationIncludingGravityZ = 0.0F;

        float rotationRateAlpha = 0.0F;
        float rotationRateBeta = 0.0F;
        float rotationRateGamma = 0.0F;
    };

    /**
     * To enable or disable accelerometer.
     */
    virtual void setAccelerometerEnabled(bool isEnabled) = 0;

    /**
     *  Sets the interval of accelerometer.
     */
    virtual void setAccelerometerInterval(float interval) = 0;

    /**
     *  Gets the motion value of current device.
     */
    virtual const MotionValue &getDeviceMotionValue() = 0;
};

} // namespace cc
