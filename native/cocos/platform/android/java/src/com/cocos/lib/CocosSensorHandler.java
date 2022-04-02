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

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

public class CocosSensorHandler implements SensorEventListener {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final String TAG = "CocosSensorHandler";
    private static CocosSensorHandler mSensorHandler;

    private final Context mContext;
    private final SensorManager mSensorManager;
    private final Sensor mAcceleration;
    private final Sensor mAccelerationIncludingGravity;
    private final Sensor mGyroscope;
    private int mSamplingPeriodUs = SensorManager.SENSOR_DELAY_GAME;

    private static float[] sDeviceMotionValues = new float[9];

    // ===========================================================
    // Constructors
    // ===========================================================

    public CocosSensorHandler(final Context context) {
        mContext = context;

        mSensorManager = (SensorManager) mContext.getSystemService(Context.SENSOR_SERVICE);
        mAcceleration = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mAccelerationIncludingGravity = mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        mGyroscope = mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);

        mSensorHandler = this;
    }

    // ===========================================================
    // Getter & Setter
    // ===========================================================
    public void enable() {
        mSensorManager.registerListener(this, mAcceleration, mSamplingPeriodUs);
        mSensorManager.registerListener(this, mAccelerationIncludingGravity, mSamplingPeriodUs);
        mSensorManager.registerListener(this, mGyroscope, mSamplingPeriodUs);
    }

    public void disable() {
        this.mSensorManager.unregisterListener(this);
    }

    public void setInterval(float interval) {
        if (android.os.Build.VERSION.SDK_INT >= 11) {
            mSamplingPeriodUs = (int) (interval * 1000000);
        }
        disable();
        enable();
    }

    // ===========================================================
    // Methods for/from SuperClass/Interfaces
    // ===========================================================
    @Override
    public void onSensorChanged(final SensorEvent sensorEvent) {
        int type = sensorEvent.sensor.getType();
        if (type == Sensor.TYPE_ACCELEROMETER) {
            sDeviceMotionValues[0] = sensorEvent.values[0];
            sDeviceMotionValues[1] = sensorEvent.values[1];
            // Issue https://github.com/cocos-creator/2d-tasks/issues/2532
            // use negative event.acceleration.z to match iOS value
            sDeviceMotionValues[2] = -sensorEvent.values[2];
        } else if (type == Sensor.TYPE_LINEAR_ACCELERATION) {
            sDeviceMotionValues[3] = sensorEvent.values[0];
            sDeviceMotionValues[4] = sensorEvent.values[1];
            sDeviceMotionValues[5] = sensorEvent.values[2];
        } else if (type == Sensor.TYPE_GYROSCOPE) {
            // The unit is rad/s, need to be converted to deg/s
            sDeviceMotionValues[6] = (float) Math.toDegrees(sensorEvent.values[0]);
            sDeviceMotionValues[7] = (float) Math.toDegrees(sensorEvent.values[1]);
            sDeviceMotionValues[8] = (float) Math.toDegrees(sensorEvent.values[2]);
        }
    }

    @Override
    public void onAccuracyChanged(final Sensor sensor, final int accuracy) {
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
        if (enabled) {
            mSensorHandler.enable();
        } else {
            mSensorHandler.disable();
        }
        mSensorHandler.enable();
    }

    public static float[] getDeviceMotionValue() {
        return sDeviceMotionValues;
    }
}
