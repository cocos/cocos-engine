/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

#pragma once

#include "base/Data.h"
#include "base/Macros.h"
#include "math/Vec4.h"

#include "platform/interfaces/modules/IAccelerometer.h"
#include "platform/interfaces/modules/INetwork.h"
#include "platform/interfaces/modules/IScreen.h"

namespace cc {

struct FontDefinition;

/**
 * @addtogroup platform
 * @{
 */

/**
 * @class Device
 * @brief
 */
class CC_DLL Device {
public:
    using Orientation = IScreen::Orientation;
    using MotionValue = IAccelerometer::MotionValue;

    /**
     *  Gets the DPI of device
     *  @return The DPI of device.
     */
    static int getDPI();

    /**
     * Get device pixel ratio.
     */
    static float getDevicePixelRatio();

    /**
     * To enable or disable accelerometer.
     */
    static void setAccelerometerEnabled(bool isEnabled);

    /**
     *  Sets the interval of accelerometer.
     */
    static void setAccelerometerInterval(float interval);

    /**
     *  Gets the motion value of current device.
     */
    static const IAccelerometer::MotionValue &getDeviceMotionValue();

    /**
     *  Gets the orientation of device.
     */
    static IScreen::Orientation getDeviceOrientation();

    /**
     *  Gets device model information.
     */
    static ccstd::string getDeviceModel();

    /**
     * Controls whether the screen should remain on.
     *
     * @param keepScreenOn One flag indicating that the screen should remain on.
     */
    static void setKeepScreenOn(bool keepScreenOn);

    /**
     * Vibrate for the specified amount of time.
     * If vibrate is not supported, then invoking this method has no effect.
     * Some platforms limit to a maximum duration of 5 seconds.
     * Duration is ignored on iOS due to API limitations.
     * @param duration The duration in seconds.
     */
    static void vibrate(float duration);

    /**
     * Gets battery level, only avaiable on iOS and Android.
     * @return 0.0 ~ 1.0
     */
    static float getBatteryLevel();

    static INetwork::NetworkType getNetworkType();

    /*
     * Gets the SafeArea edge.
     * Vec4(x, y, z, w) means Edge(top, left, bottom, right)
     */
    static Vec4 getSafeAreaEdge();

private:
    Device();
    CC_DISALLOW_COPY_MOVE_ASSIGN(Device)
};

// end group
/// @}

} // namespace cc
