// Copyright (C) 2021 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
package com.google.android.games.paddleboat;

import android.os.Build;
import android.view.InputDevice;

import java.util.List;

public class GameControllerInfo {
    private static final int MAX_AXIS_COUNT = 48;
    // Axis bits won't fit in 32-bits, split them across low/high
    private static final int AXIS_COUNT_LOW = 31;

    // Indices into the mGameControllerDeviceInfoArray that
    // pass device specific information to the native client
    private static final int DEVICEINFO_INDEX_DEVICEID = 0;
    private static final int DEVICEINFO_INDEX_VENDORID = 1;
    private static final int DEVICEINFO_INDEX_PRODUCTID = 2;
    private static final int DEVICEINFO_INDEX_AXISBITS_LOW = 3;
    private static final int DEVICEINFO_INDEX_AXISBITS_HIGH = 4;
    private static final int DEVICEINFO_INDEX_CONTROLLERNUMBER = 5;
    private static final int DEVICEINFO_INDEX_DEVICEFLAGS = 6;
    private static final int DEVICEINFO_ARRAY_SIZE = 7;

    private static final int DEVICEFLAG_VIBRATION = 0x8000000;
    private static final int DEVICEFLAG_VIBRATION_DUAL_MOTOR = 0x10000000;
    private static final int DEVICEFLAG_VIRTUAL_MOUSE = 0x40000000;

    private final int[] mGameControllerDeviceInfoArray;
    private final float[] mGameControllerAxisMinArray;
    private final float[] mGameControllerAxisMaxArray;
    private final float[] mGameControllerAxisFlatArray;
    private final float[] mGameControllerAxisFuzzArray;
    private final String mGameControllerNameString;

    private GameControllerListener mListener = null;

    GameControllerInfo(InputDevice inputDevice) {
        mGameControllerDeviceInfoArray = new int[DEVICEINFO_ARRAY_SIZE];
        mGameControllerAxisMinArray = new float[MAX_AXIS_COUNT];
        mGameControllerAxisMaxArray = new float[MAX_AXIS_COUNT];
        mGameControllerAxisFlatArray = new float[MAX_AXIS_COUNT];
        mGameControllerAxisFuzzArray = new float[MAX_AXIS_COUNT];

        for (int index = 0; index < DEVICEINFO_ARRAY_SIZE; ++index) {
            mGameControllerDeviceInfoArray[index] = 0;
        }

        for (int index = 0; index < MAX_AXIS_COUNT; ++index) {
            mGameControllerAxisMinArray[index] = 0.0f;
            mGameControllerAxisMaxArray[index] = 0.0f;
            mGameControllerAxisFlatArray[index] = 0.0f;
            mGameControllerAxisFuzzArray[index] = 0.0f;
        }

        mGameControllerNameString = inputDevice.getName();
        EnumerateAxis(inputDevice);
        EnumerateInfoArray(inputDevice);
    }

    public GameControllerListener GetListener() {
        return mListener;
    }

    public void SetListener(GameControllerListener listener) {
        mListener = listener;
    }

    public int GetGameControllerDeviceId() {
        return mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_DEVICEID];
    }

    public int GetGameControllerFlags() {
        return mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_DEVICEFLAGS];
    }

    public int[] GetGameControllerDeviceInfoArray() {
        return mGameControllerDeviceInfoArray;
    }

    public float[] GetGameControllerAxisMinArray() {
        return mGameControllerAxisMinArray;
    }

    public float[] GetGameControllerAxisMaxArray() {
        return mGameControllerAxisMaxArray;
    }

    public float[] GetGameControllerAxisFlatArray() {
        return mGameControllerAxisFlatArray;
    }

    public float[] GetGameControllerAxisFuzzArray() {
        return mGameControllerAxisFuzzArray;
    }

    public String GetGameControllerNameString() {
        return mGameControllerNameString;
    }

    private void EnumerateAxis(InputDevice inputDevice) {
        List<InputDevice.MotionRange> motionRanges = inputDevice.getMotionRanges();
        for (InputDevice.MotionRange motionRange : motionRanges) {
            int axisIndex = motionRange.getAxis();
            if (axisIndex >= 0 && axisIndex < MAX_AXIS_COUNT) {
                int axisSource = motionRange.getSource();
                if (axisSource == InputDevice.SOURCE_JOYSTICK ||
                        axisSource == InputDevice.SOURCE_GAMEPAD) {
                    if (axisIndex <= AXIS_COUNT_LOW) {
                        mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_AXISBITS_LOW] |=
                                (1 << axisIndex);
                    } else {
                        mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_AXISBITS_HIGH] |=
                                (1 << (axisIndex - (AXIS_COUNT_LOW + 1)));
                    }
                    mGameControllerAxisMinArray[axisIndex] = motionRange.getMin();
                    mGameControllerAxisMaxArray[axisIndex] = motionRange.getMax();
                    mGameControllerAxisFlatArray[axisIndex] = motionRange.getFlat();
                    mGameControllerAxisFuzzArray[axisIndex] = motionRange.getFuzz();
                }
            }
        }
    }

    private void EnumerateInfoArray(InputDevice inputDevice) {
        mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_DEVICEID] = inputDevice.getId();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_VENDORID] = inputDevice.getVendorId();
            mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_PRODUCTID] = inputDevice.getProductId();
            mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_CONTROLLERNUMBER] =
                    inputDevice.getControllerNumber();
        }
        mGameControllerDeviceInfoArray[DEVICEINFO_INDEX_DEVICEFLAGS] =
                GameControllerManager.getControllerFlagsForDevice(inputDevice);
    }
}
