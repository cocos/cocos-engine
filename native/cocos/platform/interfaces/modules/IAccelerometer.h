/****************************************************************************
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

#pragma once

#include "platform/interfaces/OSInterface.h"

namespace cc {

class IAccelerometer : public OSInterface {
public:
    struct MotionValue {
        float accelerationX = 0.0F;
        float accelerationY = 0.0F;
        float accelerationZ = 0.0F;

        float accelerationIncludingGravityX = 0.0F;
        float accelerationIncludingGravityY = 0.0F;
        float accelerationIncludingGravityZ = 0.0F;

        float rotationRateAlpha = 0.0F;
        float rotationRateBeta  = 0.0F;
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
    /**
     @brief Create default accelerometer interface.
     @return accelerometer interface.
     */
    static OSInterface::Ptr createAccelerometerInterface();
private:
};

} // namespace cc