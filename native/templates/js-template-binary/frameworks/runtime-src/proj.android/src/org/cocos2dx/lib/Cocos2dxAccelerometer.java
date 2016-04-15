/****************************************************************************
Copyright (c) 2010-2013 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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
import android.content.res.Configuration;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.view.Display;
import android.view.Surface;
import android.view.WindowManager;

public class Cocos2dxAccelerometer implements SensorEventListener {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final String TAG = "Cocos2dxAccelerometer";

    // ===========================================================
    // Fields
    // ===========================================================

    private final Context mContext;
    private final SensorManager mSensorManager;
    private final Sensor mAccelerometer;
    private final int mNaturalOrientation;

    // ===========================================================
    // Constructors
    // ===========================================================

    public Cocos2dxAccelerometer(final Context context) {
        mContext = context;

        mSensorManager = (SensorManager) mContext.getSystemService(Context.SENSOR_SERVICE);
        mAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        final Display display = ((WindowManager) mContext.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
        mNaturalOrientation = display.getOrientation();
    }

    public void enable() {
        mSensorManager.registerListener(this, mAccelerometer, SensorManager.SENSOR_DELAY_GAME);
    }

    public void setInterval(float interval) {
        // Honeycomb version is 11
        if(android.os.Build.VERSION.SDK_INT < 11) {
            mSensorManager.registerListener(this, mAccelerometer, SensorManager.SENSOR_DELAY_GAME);
        } else {
            //convert seconds to microseconds
            mSensorManager.registerListener(this, mAccelerometer, (int)(interval*100000));
        }
    }

    public void disable() {
        mSensorManager.unregisterListener(this);
    }

    // ===========================================================
    // Methods for/from SuperClass/Interfaces
    // ===========================================================

    @Override
    public void onSensorChanged(final SensorEvent sensorEvent) {
        if (sensorEvent.sensor.getType() != Sensor.TYPE_ACCELEROMETER) {
            return;
        }

        float x = sensorEvent.values[0];
        float y = sensorEvent.values[1];
        final float z = sensorEvent.values[2];

        /*
         * Because the axes are not swapped when the device's screen orientation
         * changes. So we should swap it here. In tablets such as Motorola Xoom,
         * the default orientation is landscape, so should consider this.
         */
        final int orientation = mContext.getResources().getConfiguration().orientation;

        if ((orientation == Configuration.ORIENTATION_LANDSCAPE) && (mNaturalOrientation != Surface.ROTATION_0)) {
            final float tmp = x;
            x = -y;
            y = tmp;
        } else if ((orientation == Configuration.ORIENTATION_PORTRAIT) && (mNaturalOrientation != Surface.ROTATION_0)) {
            final float tmp = x;
            x = y;
            y = -tmp;
        }

        Cocos2dxGLSurfaceView.queueAccelerometer(x,y,z,sensorEvent.timestamp);
    }

    @Override
    public void onAccuracyChanged(final Sensor sensor, final int accuracy) {
    }

    // ===========================================================
    // Methods
        // Native method called from Cocos2dxGLSurfaceView (To be in the same thread)
    // ===========================================================

    public static native void onSensorChanged(final float x, final float y, final float z, final long timestamp);
}

