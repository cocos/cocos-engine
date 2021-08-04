/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
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
package com.cocos.lib;


import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.sensor.agent.CategoryMotionAgent;
import ohos.sensor.agent.SensorAgent;
import ohos.sensor.bean.CategoryMotion;
import ohos.sensor.data.CategoryMotionData;
import ohos.sensor.listener.ICategoryMotionDataCallback;

public class CocosSensorHandler implements ICategoryMotionDataCallback {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final HiLogLabel TAG = new HiLogLabel(HiLog.LOG_APP, 0, "CocosSensorHandler");
    private static CocosSensorHandler mSensorHandler;

    private final CategoryMotionAgent mSensorManager;
    private final CategoryMotion mAcceleration;
    private final CategoryMotion mAccelerationIncludingGravity;
    private final CategoryMotion mGyroscope;
    private static float[] sDeviceMotionValues = new float[9];
    private boolean mEnabled = false;
    private long mMaxIntervalNanoSeconds = 0;
    // ===========================================================
    // Constructors
    // ===========================================================

    public CocosSensorHandler() {
        mSensorManager = new CategoryMotionAgent();
        mAcceleration = mSensorManager.getSingleSensor(CategoryMotion.SENSOR_TYPE_ACCELEROMETER);
        mAccelerationIncludingGravity = mSensorManager.getSingleSensor(CategoryMotion.SENSOR_TYPE_LINEAR_ACCELERATION);
        mGyroscope = mSensorManager.getSingleSensor(CategoryMotion.SENSOR_TYPE_GYROSCOPE);
        mSensorHandler = this;
    }

    // ===========================================================
    // Getter & Setter
    // ===========================================================
    public void enable() {
        if(mMaxIntervalNanoSeconds == 0) {
            mSensorManager.setSensorDataCallback(this, mAcceleration, SensorAgent.SENSOR_SAMPLING_RATE_FASTEST);
            mSensorManager.setSensorDataCallback(this, mAccelerationIncludingGravity, SensorAgent.SENSOR_SAMPLING_RATE_FASTEST);
            mSensorManager.setSensorDataCallback(this, mGyroscope, SensorAgent.SENSOR_SAMPLING_RATE_FASTEST);
        }else {
            mSensorManager.setSensorDataCallback(this, mAcceleration, SensorAgent.SENSOR_SAMPLING_RATE_FASTEST, mMaxIntervalNanoSeconds);
            mSensorManager.setSensorDataCallback(this, mAccelerationIncludingGravity, SensorAgent.SENSOR_SAMPLING_RATE_FASTEST, mMaxIntervalNanoSeconds);
            mSensorManager.setSensorDataCallback(this, mGyroscope, SensorAgent.SENSOR_SAMPLING_RATE_FASTEST, mMaxIntervalNanoSeconds);
        }
        mEnabled = true;
    }


    public void disable() {
        mSensorManager.releaseSensorDataCallback(this, mAcceleration);
        mSensorManager.releaseSensorDataCallback(this, mAccelerationIncludingGravity);
        mSensorManager.releaseSensorDataCallback(this, mGyroscope);
        mEnabled = false;
    }

    public void setInterval(float intervalSeconds) {
        mMaxIntervalNanoSeconds = (long)(1000_000_000L * intervalSeconds);
        if(mEnabled) {
            disable();
            enable();
        }
    }

    public void onPause() {
        disable();
    }

    public void onResume() {
        enable();
    }

    public static void setAccelerometerInterval(float interval) {
        mSensorHandler.setInterval(interval);
    }

    public static void setAccelerometerEnabled(boolean enabled) {
        if(enabled == mSensorHandler.mEnabled) {
            return;
        }
        if (enabled) {
            mSensorHandler.enable();
        } else {
            mSensorHandler.disable();
        }
    }

    @SuppressWarnings("unused")
    public static float[] getDeviceMotionValue() {
        return sDeviceMotionValues;
    }

    @Override
    public void onSensorDataModified(CategoryMotionData sensorEvent) {
        CategoryMotion type = sensorEvent.getSensor();
        if(type == null) return;
        final int sensorId = type.getSensorId();
        if (sensorId == mAcceleration.getSensorId()) {
            sDeviceMotionValues[0] = sensorEvent.values[0];
            sDeviceMotionValues[1] = sensorEvent.values[1];
            // Issue https://github.com/cocos-creator/2d-tasks/issues/2532
            // use negative event.acceleration.z to match iOS value
            sDeviceMotionValues[2] = -sensorEvent.values[2];
        } else if (sensorId == mAccelerationIncludingGravity.getSensorId()) {
            sDeviceMotionValues[3] = sensorEvent.values[0];
            sDeviceMotionValues[4] = sensorEvent.values[1];
            sDeviceMotionValues[5] = sensorEvent.values[2];
        } else if (sensorId == mGyroscope.getSensorId()) {
            // The unit is rad/s, need to be converted to deg/s
            sDeviceMotionValues[6] = (float) Math.toDegrees(sensorEvent.values[0]);
            sDeviceMotionValues[7] = (float) Math.toDegrees(sensorEvent.values[1]);
            sDeviceMotionValues[8] = (float) Math.toDegrees(sensorEvent.values[2]);
        }
    }

    @Override
    public void onAccuracyDataModified(CategoryMotion categoryMotion, int i) {

    }

    @Override
    public void onCommandCompleted(CategoryMotion categoryMotion) {

    }
}
