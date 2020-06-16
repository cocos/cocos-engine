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


#if CC_PLATFORM == CC_PLATFORM_ANDROID

#include "platform/CCDevice.h"
#include <string.h>
#include <android/log.h>
#include <jni.h>
#include <android_native_app_glue.h>
#include <android/window.h>
#include <android/sensor.h>
#include "platform/android/jni/JniHelper.h"
#include "platform/CCFileUtils.h"
#include "base/ccUTF8.h"

#ifndef JCLS_HELPER
#define JCLS_HELPER "org/cocos2dx/lib/Cocos2dxHelper"
#endif

#define SENSOR_EVENT_DELAY   200000

namespace {
    int getSensorEvents(int fd, int events, void* data);
    struct Sensor
    {
        ASensorManager* sensorManager = nullptr;
        const ASensor* accelerometerSensor = nullptr;
        const ASensor* linearAccelerometerSensor = nullptr;
        const ASensor* gyroscopeSensor = nullptr;
        ASensorEventQueue* sensorEventQueue = nullptr;
        cc::Device::MotionValue motionValue;
        int delay = 0; // us

        Sensor()
        {
            sensorManager = ASensorManager_getInstance();
            if (!sensorManager)
                return;

            accelerometerSensor = ASensorManager_getDefaultSensor(sensorManager, ASENSOR_TYPE_ACCELEROMETER);
            linearAccelerometerSensor = ASensorManager_getDefaultSensor(sensorManager, ASENSOR_TYPE_LINEAR_ACCELERATION);
            gyroscopeSensor = ASensorManager_getDefaultSensor(sensorManager, ASENSOR_TYPE_GYROSCOPE);

            android_app* app = cc::JniHelper::getAndroidApp();
            sensorEventQueue = ASensorManager_createEventQueue(sensorManager, app->looper, 3, getSensorEvents, NULL);
            if (!sensorEventQueue)
                return;

            delay = SENSOR_EVENT_DELAY;
            enable();
        }

        ~Sensor() {
            if (sensorEventQueue)
                ASensorManager_destroyEventQueue(sensorManager, sensorEventQueue);
        }

        void enable() {
            if (!sensorEventQueue)
                return;

            if (accelerometerSensor) {
                ASensorEventQueue_enableSensor(sensorEventQueue, accelerometerSensor);
                ASensorEventQueue_setEventRate(sensorEventQueue, accelerometerSensor, delay);
            }
            if (linearAccelerometerSensor) {
                ASensorEventQueue_enableSensor(sensorEventQueue, linearAccelerometerSensor);
                ASensorEventQueue_setEventRate(sensorEventQueue, linearAccelerometerSensor, delay);
            }
            if (gyroscopeSensor) {
                ASensorEventQueue_enableSensor(sensorEventQueue, gyroscopeSensor);
                ASensorEventQueue_setEventRate(sensorEventQueue, gyroscopeSensor, delay);
            }
        }

        void disable() {
            if (!sensorEventQueue)
                return;

            if (accelerometerSensor)
                ASensorEventQueue_disableSensor(sensorEventQueue, accelerometerSensor);
            if (linearAccelerometerSensor)
                ASensorEventQueue_disableSensor(sensorEventQueue, linearAccelerometerSensor);
            if (gyroscopeSensor)
                ASensorEventQueue_disableSensor(sensorEventQueue, gyroscopeSensor);
        }

        void setSensorInterval(float interval) {
            disable();
            delay = (int)(interval * 1000000);
            enable();
        }
    };

    struct Sensor* g_sensor = nullptr;
    int getSensorEvents(int fd, int events, void* data) {
        ASensorEvent event;
        while (ASensorEventQueue_getEvents(g_sensor->sensorEventQueue, &event, 1) > 0) {
            if (event.type == ASENSOR_TYPE_ACCELEROMETER) {
                g_sensor->motionValue.accelerationIncludingGravityX = event.acceleration.x;
                g_sensor->motionValue.accelerationIncludingGravityY = event.acceleration.y;
                g_sensor->motionValue.accelerationIncludingGravityZ = event.acceleration.z;
            }
            else if (event.type == ASENSOR_TYPE_GYROSCOPE) {
                g_sensor->motionValue.rotationRateAlpha = CC_RADIANS_TO_DEGREES(event.acceleration.azimuth);
                g_sensor->motionValue.rotationRateBeta = CC_RADIANS_TO_DEGREES(event.acceleration.pitch);
                g_sensor->motionValue.rotationRateGamma = CC_RADIANS_TO_DEGREES(event.acceleration.roll);
            }
            else if (event.type == ASENSOR_TYPE_LINEAR_ACCELERATION) {
                g_sensor->motionValue.accelerationX = event.acceleration.x;
                g_sensor->motionValue.accelerationY = event.acceleration.y;
                g_sensor->motionValue.accelerationZ = event.acceleration.z;
            }
        }
        // return 1 to continue receiving callbacks
        // or 0 to have this file descriptor and callback unregistered from the looper
        return 1;
    }
}

namespace cc {

int Device::getDPI()
{
    static int dpi = -1;
    if (dpi == -1)
    {
        AConfiguration* config = AConfiguration_new();
        AConfiguration_fromAssetManager(config, JniHelper::getAndroidApp()->activity->assetManager);
        int32_t density = AConfiguration_getDensity(config);
        AConfiguration_delete(config);
        dpi = density * 160;
    }
    return dpi;
}

void Device::setAccelerometerEnabled(bool isEnabled)
{
    if (isEnabled)
    {
        if (!g_sensor)
            g_sensor = new (std::nothrow) struct Sensor();

        if (g_sensor)
            g_sensor->enable();
    }
    else
    {
        if (g_sensor)
            g_sensor->disable();
    }
}

void Device::setAccelerometerInterval(float interval)
{
    if (g_sensor)
        g_sensor->setSensorInterval(interval);
}

const Device::MotionValue& Device::getDeviceMotionValue()
{
    return g_sensor->motionValue;
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
    // JniHelper::callStaticVoidMethod(JCLS_HELPER, "setKeepScreenOn", value);
    ANativeActivity_setWindowFlags(JniHelper::getAndroidApp()->activity, AWINDOW_FLAG_KEEP_SCREEN_ON, 0);
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

cc::Vec4 Device::getSafeAreaEdge()
{
    // no SafeArea concept on android, return ZERO Vec4.
    return cc::Vec4();
}

int Device::getDevicePixelRatio()
{
    return 1;
}
}

#endif // CC_PLATFORM == CC_PLATFORM_ANDROID
