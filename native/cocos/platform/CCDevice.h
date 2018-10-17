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

#ifndef __CCDEVICE_H__
#define __CCDEVICE_H__

#include "base/ccMacros.h"
#include "base/CCData.h"
#include "math/Vec4.h"

NS_CC_BEGIN

struct FontDefinition;

/**
 * @addtogroup platform
 * @{
 */

/**
 * @class Device
 * @brief
 */
class CC_DLL Device
{
public:
    enum class Rotation {
        _0 = 0,
        _90,
        _180,
        _270
    };

    struct MotionValue {
        float accelerationX = 0.0f;
        float accelerationY = 0.0f;
        float accelerationZ = 0.0f;

        float accelerationIncludingGravityX = 0.0f;
        float accelerationIncludingGravityY = 0.0f;
        float accelerationIncludingGravityZ = 0.0f;

        float rotationRateAlpha = 0.0f;
        float rotationRateBeta = 0.0f;
        float rotationRateGamma = 0.0f;
    };

    /**
     *  Gets the DPI of device
     *  @return The DPI of device.
     */
    static int getDPI();

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
    static const MotionValue& getDeviceMotionValue();

    /**
     *  Gets the rotation of device.
     */
    static Rotation getDeviceRotation();

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

    enum class NetworkType
    {
        NONE,
        LAN,
        WWAN
    };

    static NetworkType getNetworkType();

    /*
     * Gets the SafeArea edge.
     * Vec4(x, y, z, w) means Edge(top, left, bottom, right)
     */
    static cocos2d::Vec4 getSafeAreaEdge();

private:
	Device();
	CC_DISALLOW_COPY_AND_ASSIGN(Device);
};

// end group
/// @}

NS_CC_END

#endif /* __CCDEVICE_H__ */
