/****************************************************************************
 * Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.
 *
 * http://www.cocos.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ****************************************************************************/

package com.cocos.lib;


import ohos.app.Context;
import ohos.sensor.agent.CategoryOrientationAgent;
import ohos.sensor.agent.SensorAgent;
import ohos.sensor.bean.CategoryOrientation;
import ohos.sensor.data.CategoryOrientationData;
import ohos.sensor.listener.ICategoryOrientationDataCallback;

public class CocosOrientationHelper implements ICategoryOrientationDataCallback {

    private int mCurrentOrientation;
    private CategoryOrientationAgent agent;
    private CategoryOrientation orientation;

    private final int matrix_length = 9;
    private final int rotationVectorLength = 9;

    public CocosOrientationHelper(Context context) {
        agent = new CategoryOrientationAgent();
        orientation = agent.getSingleSensor(CategoryOrientation.SENSOR_TYPE_ORIENTATION);
        mCurrentOrientation = CocosHelper.getDeviceRotation();
    }

    public void onPause() {
        agent.releaseSensorDataCallback(this, orientation);
    }

    public void onResume() {
        boolean ok = agent.setSensorDataCallback(this, orientation, SensorAgent.SENSOR_SAMPLING_RATE_GAME);
    }


    private static native void nativeOnOrientationChanged(int rotation);

    @Override
    public void onSensorDataModified(CategoryOrientationData data) {
        final int curOrientation = CocosHelper.getDeviceRotation();
        if (curOrientation != mCurrentOrientation) {
            mCurrentOrientation = curOrientation;
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    nativeOnOrientationChanged(mCurrentOrientation);
                }
            });
        }
    }

    @Override
    public void onAccuracyDataModified(CategoryOrientation categoryOrientation, int i) {

    }

    @Override
    public void onCommandCompleted(CategoryOrientation categoryOrientation) {

    }
}
