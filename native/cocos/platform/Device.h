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

#ifndef __CCDEVICE_H__
#define __CCDEVICE_H__

#include "base/Data.h"
#include "base/Macros.h"
#include "math/Vec4.h"


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
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation
    enum class Orientation {
        PORTRAIT             = 0,
        LANDSCAPE_LEFT       = -90,
        PORTRAIT_UPSIDE_DOWN = 180,
        LANDSCAPE_RIGHT      = 90
    };

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
    static const MotionValue &getDeviceMotionValue();

    /**
     *  Gets the orientation of device.
     */
    static Orientation getDeviceOrientation();

    /**
     *  Gets device model information.
     */
    static std::string getDeviceModel();

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

    enum class NetworkType {
        NONE,
        LAN,
        WWAN
    };

    static NetworkType getNetworkType();

    /*
     * Gets the SafeArea edge.
     * Vec4(x, y, z, w) means Edge(top, left, bottom, right)
     */
    static Vec4 getSafeAreaEdge();

private:
    Device();
    DISABLE_COPY_SEMANTICS(Device)
    DISABLE_MOVE_SEMANTICS(Device)
};

// end group
/// @}

} // namespace cc

#endif /* __CCDEVICE_H__ */
