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

import android.hardware.input.InputManager;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.lang.Thread;

public class GameControllerThread extends Thread implements InputManager.InputDeviceListener {
    private static final String TAG = "GameControllerThread";
    private boolean activeInputDeviceListener = false;
    private GameControllerManager mGameControllerManager;
    private Handler mHandler;

    public void setGameControllerManager(GameControllerManager gcManager) {
        mGameControllerManager = gcManager;
    }

    @Override
    public void run () {
        Looper.prepare();
        mHandler = new Handler(Looper.myLooper());
        onStart();
        Looper.loop();
    }

    public void onStop() {
        if (activeInputDeviceListener) {
            Log.d(TAG, "unregisterInputDeviceListener");
            mGameControllerManager.getAppInputManager().unregisterInputDeviceListener(this);
            activeInputDeviceListener = false;
        }
    }

    public void onStart() {
        if (!activeInputDeviceListener) {
            Log.d(TAG, "registerInputDeviceListener");
            mGameControllerManager.getAppInputManager().registerInputDeviceListener(this, mHandler);
            activeInputDeviceListener = true;
        }
    }

    @Override
    public void onInputDeviceAdded(int deviceId) {
        Log.d(TAG, "onInputDeviceAdded id: " + deviceId);
        mGameControllerManager.onInputDeviceAdded(deviceId);
    }

    @Override
    public void onInputDeviceRemoved(int deviceId) {
        Log.d(TAG, "onInputDeviceRemoved id: " + deviceId);
        mGameControllerManager.onInputDeviceRemoved(deviceId);
    }

    @Override
    public void onInputDeviceChanged(int deviceId) {
        Log.d(TAG, "onInputDeviceChanged id: " + deviceId);
        mGameControllerManager.onInputDeviceChanged(deviceId);
    }
}