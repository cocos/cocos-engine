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
package org.cocos2dx.lib;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

public class Cocos2dxAccelerometer implements SensorEventListener {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final String TAG = Cocos2dxAccelerometer.class.getSimpleName();

    // ===========================================================
    // Fields
    // ===========================================================
    private final Context mContext;
    private final SensorManager mSensorManager;
    private final Sensor mAcceleration;
    private final Sensor mAccelerationIncludingGravity;
    private final Sensor mGyroscope;
    private int mSamplingPeriodUs = SensorManager.SENSOR_DELAY_GAME;

    class Acceleration {
        public float x = 0.0f;
        public float y = 0.0f;
        public float z = 0.0f;
    }

    class RotationRate {
        public float alpha = 0.0f;
        public float beta = 0.0f;
        public float gamma = 0.0f;
    }

    class DeviceMotionEvent {
        public Acceleration acceleration = new Acceleration();
        public Acceleration accelerationIncludingGravity = new Acceleration();
        public RotationRate rotationRate = new RotationRate();
    }

    private DeviceMotionEvent mDeviceMotionEvent = new DeviceMotionEvent();

    // ===========================================================
    // Constructors
    // ===========================================================

    public Cocos2dxAccelerometer(final Context context) {
        mContext = context;

        mSensorManager = (SensorManager) mContext.getSystemService(Context.SENSOR_SERVICE);
        mAcceleration = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mAccelerationIncludingGravity = mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        mGyroscope = mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
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

    public DeviceMotionEvent getDeviceMotionEvent() {
        return mDeviceMotionEvent;
    }

    // ===========================================================
    // Methods for/from SuperClass/Interfaces
    // ===========================================================
    @Override
    public void onSensorChanged(final SensorEvent sensorEvent) {
        int type = sensorEvent.sensor.getType();
        if (type == Sensor.TYPE_ACCELEROMETER) {
            mDeviceMotionEvent.accelerationIncludingGravity.x = sensorEvent.values[0];
            mDeviceMotionEvent.accelerationIncludingGravity.y = sensorEvent.values[1];
            mDeviceMotionEvent.accelerationIncludingGravity.z = sensorEvent.values[2];
        }
        else if (type == Sensor.TYPE_LINEAR_ACCELERATION) {
            mDeviceMotionEvent.acceleration.x = sensorEvent.values[0];
            mDeviceMotionEvent.acceleration.y = sensorEvent.values[1];
            mDeviceMotionEvent.acceleration.z = sensorEvent.values[2];
        }
        else if (type == Sensor.TYPE_GYROSCOPE) {
            // The unit is rad/s, need to be converted to deg/s
            mDeviceMotionEvent.rotationRate.alpha = (float)Math.toDegrees(sensorEvent.values[0]);
            mDeviceMotionEvent.rotationRate.beta = (float)Math.toDegrees(sensorEvent.values[1]);
            mDeviceMotionEvent.rotationRate.gamma = (float)Math.toDegrees(sensorEvent.values[2]);
        }
    }

    @Override
    public void onAccuracyChanged(final Sensor sensor, final int accuracy) {
    }

    // ===========================================================
    // Methods
        // Native method called from Cocos2dxGLSurfaceView (To be in the same thread)
    // ===========================================================

    public static native void onSensorChanged(final float x, final float y, final float z, final long timestamp);

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================
}
