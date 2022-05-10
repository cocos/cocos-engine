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

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.hardware.BatteryState;
import android.hardware.input.InputManager;
import android.hardware.lights.Light;
import android.hardware.lights.LightState;
import android.hardware.lights.LightsManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.BatteryManager;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.util.Log;
import android.view.InputDevice;
import android.view.KeyCharacterMap;
import android.view.KeyEvent;
import android.view.MotionEvent;

import java.util.ArrayList;
import java.util.List;

public class GameControllerManager {
    public static final int MAX_GAMECONTROLLERS = 8;
    // MAX_MICE is for actual physical mice/touchpads, game controller
    // devices that have MOUSE sources for simulating a mouse are not included. We support
    // 2 for the use case of a laptop with a touchpad and an external mouse connected.
    public static final int MAX_MICE = 2;
    public static final int VIBRATION_EFFECT_MIN_API = Build.VERSION_CODES.O;
    // Must match paddleboat.h flags/enums
    public static final int DEVICEFLAG_BATTERY = 0x04000000;
    public static final int DEVICEFLAG_ACCELEROMETER = 0x00400000;
    public static final int DEVICEFLAG_GYROSCOPE = 0x00800000;
    public static final int DEVICEFLAG_LIGHT_PLAYER = 0x01000000;
    public static final int DEVICEFLAG_LIGHT_RGB = 0x02000000;
    public static final int DEVICEFLAG_VIBRATION = 0x08000000;
    public static final int DEVICEFLAG_VIBRATION_DUAL_MOTOR = 0x10000000;
    public static final int DEVICEFLAG_VIRTUAL_MOUSE = 0x40000000;
    public static final int LIGHT_TYPE_PLAYER = 0;
    public static final int LIGHT_TYPE_RGB = 1;
    public static final int MOTION_ACCELEROMETER = 0;
    public static final int MOTION_GYROSCOPE = 1;
    private static final int VIBRATOR_MANAGER_MIN_API = Build.VERSION_CODES.S;
    private static final String FINGERPRINT_DEVICE_NAME = "uinput-fpc";
    private static final String TAG = "GameControllerManager";
    private static final int GAMECONTROLLER_SOURCE_MASK =
            InputDevice.SOURCE_DPAD | InputDevice.SOURCE_JOYSTICK | InputDevice.SOURCE_GAMEPAD;
    private static final int MOUSE_SOURCE_MASK = InputDevice.SOURCE_MOUSE;
    private boolean nativeReady;
    private final boolean printControllerInfo;
    private boolean reportMotionEvents;
    private final InputManager inputManager;
    private final ArrayList<Integer> mouseDeviceIds;
    private final ArrayList<Integer> pendingControllerDeviceIds;
    private final ArrayList<Integer> pendingMouseDeviceIds;
    private final ArrayList<GameControllerInfo> gameControllers;
    private GameControllerThread gameControllerThread;

    public GameControllerManager(Context appContext, boolean appPrintControllerInfo) {
        if (appPrintControllerInfo) {
            Log.d(TAG, "device Info:" +
                    "\n  BRAND: " + Build.BRAND +
                    "\n DEVICE: " + Build.DEVICE +
                    "\n  MANUF: " + Build.MANUFACTURER +
                    "\n  MODEL: " + Build.MODEL +
                    "\nPRODUCT: " + Build.PRODUCT +
                    "\n    API: " + Build.VERSION.SDK_INT);
        }

        nativeReady = false;
        reportMotionEvents = false;
        inputManager = (InputManager) appContext.getSystemService(Context.INPUT_SERVICE);
        printControllerInfo = appPrintControllerInfo;
        mouseDeviceIds = new ArrayList<Integer>(MAX_GAMECONTROLLERS);
        pendingControllerDeviceIds = new ArrayList<Integer>(MAX_GAMECONTROLLERS);
        pendingMouseDeviceIds = new ArrayList<Integer>(MAX_GAMECONTROLLERS);
        gameControllers = new ArrayList<GameControllerInfo>(MAX_GAMECONTROLLERS);

        // Queue up initially connected devices to be processed when
        // the native side signals it is ready
        scanDevices();
    }

    static public int getControllerFlagsForDevice(InputDevice inputDevice) {
        int controllerFlags = 0;

        boolean hasVirtualMouse = isDeviceOfSource(inputDevice.getId(), MOUSE_SOURCE_MASK);
        if (hasVirtualMouse) {
            controllerFlags |= DEVICEFLAG_VIRTUAL_MOUSE;
        }

        int vibratorCount = getVibratorCount(inputDevice);
        if (vibratorCount > 0) {
            controllerFlags |= DEVICEFLAG_VIBRATION;
            if (vibratorCount > 1) {
                controllerFlags |= DEVICEFLAG_VIBRATION_DUAL_MOTOR;
            }
        }

        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            SensorManager sensorManager = inputDevice.getSensorManager();
            if (sensorManager != null) {
                if (sensorManager.getSensorList(Sensor.TYPE_ACCELEROMETER).size() > 0) {
                    controllerFlags |= DEVICEFLAG_ACCELEROMETER;
                }
                if (sensorManager.getSensorList(Sensor.TYPE_GYROSCOPE).size() > 0) {
                    controllerFlags |= DEVICEFLAG_GYROSCOPE;
                }
            }

            LightsManager lightsManager = inputDevice.getLightsManager();
            if (lightsManager != null) {
                for (Light currentLight : lightsManager.getLights()) {
                    if (currentLight.getType() == Light.LIGHT_TYPE_PLAYER_ID) {
                        controllerFlags |= DEVICEFLAG_LIGHT_PLAYER;
                    } else if (currentLight.hasRgbControl()) {
                        controllerFlags |= DEVICEFLAG_LIGHT_RGB;
                    }
                }
            }

            BatteryState batteryState = inputDevice.getBatteryState();
            if (batteryState != null) {
                if (batteryState.isPresent()) {
                    controllerFlags |= DEVICEFLAG_BATTERY;
                }
            }
        }
        return controllerFlags;
    }

    static public int getVibratorCount(InputDevice inputDevice) {
        if (inputDevice != null) {
            if (Build.VERSION.SDK_INT >= VIBRATOR_MANAGER_MIN_API) {
                VibratorManager vibratorManager = inputDevice.getVibratorManager();
                if (vibratorManager != null) {
                    int[] vibratorIds = vibratorManager.getVibratorIds();
                    int vibratorCount = vibratorIds.length;
                    if (vibratorCount > 0) {
                        return vibratorCount;
                    }
                }
            } else if (Build.VERSION.SDK_INT >= GameControllerManager.VIBRATION_EFFECT_MIN_API) {
                Vibrator deviceVibrator = inputDevice.getVibrator();
                if (deviceVibrator != null) {
                    if (deviceVibrator.hasVibrator()) {
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    private static boolean isDeviceOfSource(int deviceId, int matchingSourceMask) {
        boolean isSource = false;
        InputDevice inputDevice = InputDevice.getDevice(deviceId);
        int inputDeviceSources = inputDevice.getSources();
        int sourceMask = InputDevice.SOURCE_ANY & matchingSourceMask;

        if (inputDevice.isVirtual() == false) {
            if ((inputDeviceSources & sourceMask) != 0) {
                List<InputDevice.MotionRange> motionRanges = inputDevice.getMotionRanges();
                if (motionRanges.size() > 0) {
                    isSource = true;
                }
            }
        }

        return isSource;
    }

    public boolean getPrintControllerInfo() {
        return printControllerInfo;
    }

    public InputManager getAppInputManager() {
        return inputManager;
    }

    public void onStop() {
        if (gameControllerThread != null) {
            gameControllerThread.onStop();
        }
    }

    public void onStart() {
        if (gameControllerThread != null) {
            scanDevices();
            gameControllerThread.onStart();
        } else {
            gameControllerThread = new GameControllerThread();
            gameControllerThread.setGameControllerManager(this);
            gameControllerThread.start();
        }
    }

    void checkForControllerRemovals(int[] deviceIds) {
        if (!nativeReady) {
            for (int index = 0; index < pendingControllerDeviceIds.size(); ++index) {
                boolean foundDevice = false;
                for (int deviceId : deviceIds) {
                    if (pendingControllerDeviceIds.get(index) == deviceId) {
                        foundDevice = true;
                        break;
                    }
                }
                if (!foundDevice) {
                    pendingControllerDeviceIds.remove(index--);
                }
            }
        }
        for (int index = 0; index < gameControllers.size(); ++index) {
            boolean foundDevice = false;
            for (int deviceId : deviceIds) {
                if (gameControllers.get(index).GetGameControllerDeviceId() == deviceId) {
                    foundDevice = true;
                    break;
                }
            }
            if (!foundDevice) {
                onInputDeviceRemoved(gameControllers.get(index).GetGameControllerDeviceId());
            }
        }
    }

    void checkForMouseRemovals(int[] deviceIds) {
        if (!nativeReady) {
            for (int index = 0; index < pendingMouseDeviceIds.size(); ++index) {
                boolean foundDevice = false;
                for (int deviceId : deviceIds) {
                    if (pendingMouseDeviceIds.get(index) == deviceId) {
                        foundDevice = true;
                        break;
                    }
                }
                if (!foundDevice) {
                    pendingMouseDeviceIds.remove(index--);
                }
            }
        }
        for (int index = 0; index < mouseDeviceIds.size(); ++index) {
            int mouseDeviceId = mouseDeviceIds.get(index);
            boolean foundDevice = false;
            for (int deviceId : deviceIds) {
                if (mouseDeviceId == deviceId) {
                    foundDevice = true;
                    break;
                }
            }
            if (!foundDevice) {
                onInputDeviceRemoved(mouseDeviceId);
            }
        }
    }

    void processControllerAddition(int deviceId) {
        boolean foundDevice = false;
        if (!nativeReady) {
            for (int index = 0; index < pendingControllerDeviceIds.size(); ++index) {
                if (pendingControllerDeviceIds.get(index) == deviceId) {
                    foundDevice = true;
                    break;
                }
            }
            if (!foundDevice) {
                pendingControllerDeviceIds.add(deviceId);
            }
        } else {
            for (int index = 0; index < gameControllers.size(); ++index) {
                if (gameControllers.get(index).GetGameControllerDeviceId() == deviceId) {
                    foundDevice = true;
                    break;
                }
            }
            if (!foundDevice) {
                onGameControllerAdded(deviceId);
            }
        }
    }

    void processMouseAddition(int deviceId) {
        boolean foundDevice = false;
        if (!nativeReady) {
            for (int index = 0; index < pendingMouseDeviceIds.size(); ++index) {
                if (pendingMouseDeviceIds.get(index) == deviceId) {
                    foundDevice = true;
                    break;
                }
            }
            if (!foundDevice) {
                pendingMouseDeviceIds.add(deviceId);
            }
        } else {
            for (int index = 0; index < mouseDeviceIds.size(); ++index) {
                if (mouseDeviceIds.get(index) == deviceId) {
                    foundDevice = true;
                    break;
                }
            }
            if (!foundDevice) {
                onMouseAdded(deviceId);
            }
        }
    }

    boolean getIsGameController(int deviceId) {
        boolean isGameController = false;
        if (isDeviceOfSource(deviceId, GAMECONTROLLER_SOURCE_MASK)) {
            InputDevice inputDevice = InputDevice.getDevice(deviceId);
            if (inputDevice != null) {
                String deviceName = inputDevice.getName();
                if (deviceName.equalsIgnoreCase(FINGERPRINT_DEVICE_NAME) == false) {
                    isGameController = true;
                }
            }
        }
        return isGameController;
    }

    void scanDevices() {
        // We don't get connection/disconnection messages for devices while in the background.
        // On resume, scan the device list to see if we missed any connections or disconnections.
        int[] deviceIds = inputManager.getInputDeviceIds();

        // Scan for additions
        for (int deviceId : deviceIds) {
            boolean isGameController = getIsGameController(deviceId);
            boolean isMouse = isDeviceOfSource(deviceId, MOUSE_SOURCE_MASK);

            if (isMouse && !isGameController) {
                processMouseAddition(deviceId);
            } else if (isGameController) {
                processControllerAddition(deviceId);
            }
        }

        // Scan for controller and mouse removals
        checkForControllerRemovals(deviceIds);
        checkForMouseRemovals(deviceIds);
    }

    GameControllerInfo onGameControllerAdded(int deviceId) {
        GameControllerInfo gameControllerInfo = null;
        if (gameControllers.size() < MAX_GAMECONTROLLERS) {
            if (printControllerInfo) {
                Log.d(TAG, "onGameControllerDeviceAdded");
                logControllerInfo(deviceId);
            }
            InputDevice newDevice = InputDevice.getDevice(deviceId);
            gameControllerInfo = new GameControllerInfo(newDevice);
            GameControllerListener gameControllerListener = new GameControllerListener(this,
                    newDevice, gameControllerInfo.GetGameControllerFlags(), reportMotionEvents);
            gameControllerInfo.SetListener(gameControllerListener);
            gameControllers.add(gameControllerInfo);
            notifyNativeConnection(gameControllerInfo);
        }
        return gameControllerInfo;
    }

    void onMouseAdded(int deviceId) {
        if (mouseDeviceIds.size() < MAX_MICE) {
            if (printControllerInfo) {
                Log.d(TAG, "onMouseDeviceAdded id: " + deviceId + " name: " +
                        InputDevice.getDevice(deviceId).getName());
                logControllerInfo(deviceId);
            }
            mouseDeviceIds.add(deviceId);
            onMouseConnected(deviceId);
        }
    }

    void onGameControllerDeviceRemoved(int deviceId) {
        // Remove from pending connected if it hadn't been processed yet
        for (int index = 0; index < pendingControllerDeviceIds.size(); ++index) {
            if (pendingControllerDeviceIds.get(index) == deviceId) {
                pendingControllerDeviceIds.remove(index);
                break;
            }
        }

        for (int index = 0; index < gameControllers.size(); ++index) {
            GameControllerInfo controller = gameControllers.get(index);
            if (controller.GetGameControllerDeviceId() == deviceId) {
                if (nativeReady) {
                    onControllerDisconnected(deviceId);
                }
                controller.GetListener().shutdownListener();
                controller.SetListener(null);
                gameControllers.remove(index);
                break;
            }
        }
    }

    boolean onMouseDeviceRemoved(int deviceId) {
        boolean removed = false;
        // Remove from pending connected if it hadn't been processed yet
        for (int index = 0; index < pendingMouseDeviceIds.size(); ++index) {
            if (pendingMouseDeviceIds.get(index) == deviceId) {
                pendingMouseDeviceIds.remove(index);
                removed = true;
                break;
            }
        }

        for (int index = 0; index < mouseDeviceIds.size(); ++index) {
            if (mouseDeviceIds.get(index) == deviceId) {
                if (nativeReady) {
                    onMouseDisconnected(deviceId);
                }
                mouseDeviceIds.remove(index);
                removed = true;
                break;
            }
        }
        return removed;
    }

    public void onInputDeviceAdded(int deviceId) {
        boolean isGameController = getIsGameController(deviceId);
        boolean isMouse = isDeviceOfSource(deviceId, MOUSE_SOURCE_MASK);

        if (isMouse && !isGameController) {
            processMouseAddition(deviceId);
        } else if (isGameController) {
            processControllerAddition(deviceId);
        }
    }

    public void onInputDeviceRemoved(int deviceId) {
        onMouseDeviceRemoved(deviceId);
        onGameControllerDeviceRemoved(deviceId);
    }

    public void onInputDeviceChanged(int deviceId) {
        /* Handle the case where an input device changes to start reporting itself
        as a game controller. If we weren't previously tracking it as a game controller,
        make sure we run the controller connection flow to notify the client.
         */
        boolean isGameController = getIsGameController(deviceId);
        if (isGameController) {
            boolean foundDeviceId = false;
            for (int pendingDeviceId : pendingControllerDeviceIds) {
                if (pendingDeviceId == deviceId) {
                    foundDeviceId = true;
                    break;
                }
            }
            if (!foundDeviceId) {
                for (int index = 0; index < gameControllers.size(); ++index) {
                    GameControllerInfo controller = gameControllers.get(index);
                    if (controller.GetGameControllerDeviceId() == deviceId) {
                        foundDeviceId = true;
                        // If an existing game controller got a changed message, reset
                        // our listener in case any of the controller capabilities changed.
                        InputDevice inputDevice = inputManager.getInputDevice(deviceId);
                        int controllerFlags = controller.GetGameControllerFlags();
                        controller.GetListener().resetListener(inputDevice, controllerFlags);
                        break;
                    }
                }
            }
            if (!foundDeviceId) {
                processControllerAddition(deviceId);
            }
        }

    }

    public int getApiLevel() {
        return Build.VERSION.SDK_INT;
    }

    public void setNativeReady() {
        nativeReady = true;
        Log.d(TAG, "setNativeReady");

        // Send any pending notifications about connected devices now that native side is ready
        for (int deviceId : pendingControllerDeviceIds) {
            GameControllerInfo gcInfo = onGameControllerAdded(deviceId);
            if (gcInfo != null) {
                if (printControllerInfo) {
                    Log.d(TAG, "setNativeReady notifyNativeConnection for deviceId: " + deviceId);
                }
            }
        }
        pendingControllerDeviceIds.clear();

        for (int deviceId : pendingMouseDeviceIds) {
            onMouseAdded(deviceId);
        }
    }

    public void setReportMotionEvents() {
        reportMotionEvents = true;
        for (GameControllerInfo controller : gameControllers) {
            controller.GetListener().setReportMotionEvents();
        }
    }

    public float getBatteryLevel(int deviceId) {
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            InputDevice inputDevice = inputManager.getInputDevice(deviceId);
            if (inputDevice != null) {
                BatteryState batteryState = inputDevice.getBatteryState();
                if (batteryState != null) {
                    if (batteryState.isPresent()) {
                        final float batteryLevel = batteryState.getCapacity();
                        return batteryLevel;
                    }
                }
            }
        }
        return 1.0f;
    }

    public int getBatteryStatus(int deviceId) {
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            InputDevice inputDevice = inputManager.getInputDevice(deviceId);
            if (inputDevice != null) {
                BatteryState batteryState = inputDevice.getBatteryState();
                if (batteryState != null) {
                    if (batteryState.isPresent()) {
                        final int batteryStatus = batteryState.getStatus();
                        return batteryStatus;
                    }
                }
            }
        }
        return BatteryManager.BATTERY_STATUS_UNKNOWN;
    }

    public void setLight(int deviceId, int lightType, int lightValue) {
        for (int index = 0; index < gameControllers.size(); ++index) {
            GameControllerInfo controller = gameControllers.get(index);
            if (controller.GetGameControllerDeviceId() == deviceId) {
                controller.GetListener().setLight(lightType, lightValue);
                break;
            }
        }
    }

    @SuppressLint("NewApi")
    private void updateVibrator(Vibrator vibrator, int intensity, int duration) {
        if (vibrator != null) {
            if (intensity == 0) {
                vibrator.cancel();
            } else if (duration > 0) {
                vibrator.vibrate(VibrationEffect.createOneShot((long) duration, intensity));
            }
        }
    }

    void setVibrationMultiChannel(InputDevice inputDevice, int leftIntensity, int leftDuration,
                                  int rightIntensity, int rightDuration) {
        if (Build.VERSION.SDK_INT >= VIBRATOR_MANAGER_MIN_API) {
            VibratorManager vibratorManager = inputDevice.getVibratorManager();
            if (vibratorManager != null) {
                int[] vibratorIds = vibratorManager.getVibratorIds();
                int vibratorCount = vibratorIds.length;
                Log.d(TAG, "Vibrator Count: " + vibratorCount);
                if (vibratorCount > 0) {
                    // We have an assumption that game controllers have two vibrators
                    // corresponding to a left motor and a right motor, and the left
                    // motor will be first.
                    updateVibrator(vibratorManager.getVibrator(vibratorIds[0]), leftIntensity,
                            leftDuration);
                    if (vibratorCount > 1) {
                        updateVibrator(vibratorManager.getVibrator(vibratorIds[1]),
                                rightIntensity, rightDuration);
                    }
                }
            }
        }
    }

    public void setVibration(int deviceId, int leftIntensity, int leftDuration, int rightIntensity,
                             int rightDuration) {
        InputDevice inputDevice = inputManager.getInputDevice(deviceId);
        if (inputDevice != null) {
            if (Build.VERSION.SDK_INT >= VIBRATOR_MANAGER_MIN_API) {
                setVibrationMultiChannel(inputDevice, leftIntensity, leftDuration, rightIntensity,
                        rightDuration);
            } else if (Build.VERSION.SDK_INT >= VIBRATION_EFFECT_MIN_API) {
                Vibrator deviceVibrator = inputDevice.getVibrator();
                updateVibrator(deviceVibrator, leftIntensity, leftDuration);
            }
        }
    }

    public String getDeviceNameById(int deviceId) {
        InputDevice inputDevice = inputManager.getInputDevice(deviceId);
        if (inputDevice != null) {
            return inputDevice.getName();
        }
        return "";
    }

    private void notifyNativeConnection(GameControllerInfo gcInfo) {
        onControllerConnected(gcInfo.GetGameControllerDeviceInfoArray(),
                gcInfo.GetGameControllerAxisMinArray(),
                gcInfo.GetGameControllerAxisMaxArray(),
                gcInfo.GetGameControllerAxisFlatArray(),
                gcInfo.GetGameControllerAxisFuzzArray());
    }

    private String generateSourceString(int source) {
        String sourceString = "Source Classes: ";
        int sourceMasked = source & InputDevice.SOURCE_ANY;
        int sourceClass = source & InputDevice.SOURCE_CLASS_MASK;

        if ((sourceClass & InputDevice.SOURCE_CLASS_BUTTON) != 0)
            sourceString += "BUTTON ";
        if ((sourceClass & InputDevice.SOURCE_CLASS_JOYSTICK) != 0)
            sourceString += "JOYSTICK ";
        if ((sourceClass & InputDevice.SOURCE_CLASS_POINTER) != 0)
            sourceString += "POINTER ";
        if ((sourceClass & InputDevice.SOURCE_CLASS_POSITION) != 0)
            sourceString += "POSITION ";
        if ((sourceClass & InputDevice.SOURCE_CLASS_TRACKBALL) != 0)
            sourceString += "TRACKBALL ";

        sourceString += "\nSources: ";

        if ((sourceMasked & InputDevice.SOURCE_BLUETOOTH_STYLUS) != 0)
            sourceString += "BLUETOOTH_STYLUS ";
        if ((sourceMasked & InputDevice.SOURCE_DPAD) != 0)
            sourceString += "DPAD ";
        if ((sourceMasked & InputDevice.SOURCE_HDMI) != 0)
            sourceString += "HDMI ";
        if ((sourceMasked & InputDevice.SOURCE_JOYSTICK) != 0)
            sourceString += "JOYSTICK ";
        if ((sourceMasked & InputDevice.SOURCE_KEYBOARD) != 0)
            sourceString += "KEYBOARD ";
        if ((sourceMasked & InputDevice.SOURCE_MOUSE) != 0)
            sourceString += "MOUSE ";
        if ((sourceMasked & InputDevice.SOURCE_MOUSE_RELATIVE) != 0)
            sourceString += "MOUSE_RELATIVE ";
        if ((sourceMasked & InputDevice.SOURCE_ROTARY_ENCODER) != 0)
            sourceString += "ROTARY_ENCODER ";
        if ((sourceMasked & InputDevice.SOURCE_STYLUS) != 0)
            sourceString += "STYLUS ";
        if ((sourceMasked & InputDevice.SOURCE_TOUCHPAD) != 0)
            sourceString += "TOUCHPAD ";
        if ((sourceMasked & InputDevice.SOURCE_TOUCHSCREEN) != 0)
            sourceString += "TOUCHSCREEN ";
        if ((sourceMasked & InputDevice.SOURCE_TOUCH_NAVIGATION) != 0)
            sourceString += "TOUCH_NAVIGATION ";
        if ((sourceMasked & InputDevice.SOURCE_TRACKBALL) != 0)
            sourceString += "TRACKBALL ";

        return sourceString;
    }

    private String getAxisString(int axis) {
        switch (axis) {
            case MotionEvent.AXIS_BRAKE:
                return "AXIS_BRAKE";
            case MotionEvent.AXIS_DISTANCE:
                return "AXIS_DISTANCE";
            case MotionEvent.AXIS_GAS:
                return "AXIS_GAS";
            case MotionEvent.AXIS_GENERIC_1:
                return "AXIS_GENERIC_1";
            case MotionEvent.AXIS_GENERIC_2:
                return "AXIS_GENERIC_2";
            case MotionEvent.AXIS_GENERIC_3:
                return "AXIS_GENERIC_3";
            case MotionEvent.AXIS_GENERIC_4:
                return "AXIS_GENERIC_4";
            case MotionEvent.AXIS_GENERIC_5:
                return "AXIS_GENERIC_5";
            case MotionEvent.AXIS_GENERIC_6:
                return "AXIS_GENERIC_6";
            case MotionEvent.AXIS_GENERIC_7:
                return "AXIS_GENERIC_7";
            case MotionEvent.AXIS_GENERIC_8:
                return "AXIS_GENERIC_8";
            case MotionEvent.AXIS_GENERIC_9:
                return "AXIS_GENERIC_9";
            case MotionEvent.AXIS_GENERIC_10:
                return "AXIS_GENERIC_10";
            case MotionEvent.AXIS_GENERIC_11:
                return "AXIS_GENERIC_11";
            case MotionEvent.AXIS_GENERIC_12:
                return "AXIS_GENERIC_12";
            case MotionEvent.AXIS_GENERIC_13:
                return "AXIS_GENERIC_13";
            case MotionEvent.AXIS_GENERIC_14:
                return "AXIS_GENERIC_14";
            case MotionEvent.AXIS_GENERIC_15:
                return "AXIS_GENERIC_15";
            case MotionEvent.AXIS_GENERIC_16:
                return "AXIS_GENERIC_16";
            case MotionEvent.AXIS_HAT_X:
                return "AXIS_HAT_X";
            case MotionEvent.AXIS_HAT_Y:
                return "AXIS_HAT_Y";
            case MotionEvent.AXIS_HSCROLL:
                return "AXIS_HSCROLL";
            case MotionEvent.AXIS_LTRIGGER:
                return "AXIS_LTRIGGER";
            case MotionEvent.AXIS_ORIENTATION:
                return "AXIS_ORIENTATION";
            case MotionEvent.AXIS_PRESSURE:
                return "AXIS_PRESSURE";
            case MotionEvent.AXIS_RELATIVE_X:
                return "AXIS_RELATIVE_X";
            case MotionEvent.AXIS_RELATIVE_Y:
                return "AXIS_RELATIVE_Y";
            case MotionEvent.AXIS_RTRIGGER:
                return "AXIS_RTRIGGER";
            case MotionEvent.AXIS_RUDDER:
                return "AXIS_RUDDER";
            case MotionEvent.AXIS_RX:
                return "AXIS_RX";
            case MotionEvent.AXIS_RY:
                return "AXIS_RY";
            case MotionEvent.AXIS_RZ:
                return "AXIS_RZ";
            case MotionEvent.AXIS_SCROLL:
                return "AXIS_SCROLL";
            case MotionEvent.AXIS_SIZE:
                return "AXIS_SIZE";
            case MotionEvent.AXIS_THROTTLE:
                return "AXIS_THROTTLE";
            case MotionEvent.AXIS_TILT:
                return "AXIS_TILT";
            case MotionEvent.AXIS_TOOL_MAJOR:
                return "AXIS_TOOL_MAJOR";
            case MotionEvent.AXIS_TOOL_MINOR:
                return "AXIS_TOOL_MINOR";
            case MotionEvent.AXIS_TOUCH_MAJOR:
                return "AXIS_TOUCH_MAJOR";
            case MotionEvent.AXIS_TOUCH_MINOR:
                return "AXIS_TOUCH_MINOR";
            case MotionEvent.AXIS_VSCROLL:
                return "AXIS_VSCROLL";
            case MotionEvent.AXIS_WHEEL:
                return "AXIS_WHEEL";
            case MotionEvent.AXIS_X:
                return "AXIS_X";
            case MotionEvent.AXIS_Y:
                return "AXIS_Y";
            case MotionEvent.AXIS_Z:
                return "AXIS_Z";
            default:
                break;
        }
        return "AXIS_NONE";
    }

    private void logMotionRange(InputDevice.MotionRange motionRange) {
        String axisString = getAxisString(motionRange.getAxis());
        String axisSourceString = generateSourceString(motionRange.getSource());
        float axisFlat = motionRange.getFlat();
        float axisFuzz = motionRange.getFuzz();
        float axisMax = motionRange.getMax();
        float axisMin = motionRange.getMin();
        float axisRange = motionRange.getRange();
        float axisResolution = -1;
        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.JELLY_BEAN_MR2)
            axisResolution = motionRange.getResolution();

        Log.d(TAG, "MotionRange:" +
                "\n" + axisString +
                "\n" + axisSourceString +
                "\n   Axis Min   : " + axisMin +
                "\n   Axis Max   : " + axisMax +
                "\n   Axis Range : " + axisRange +
                "\n   Axis Flat  : " + axisFlat +
                "\n   Axis Fuzz  : " + axisFuzz +
                "\n   Axis Res   : " + axisResolution);
    }

    private void logControllerInfo(int deviceId) {
        InputDevice inputDevice = InputDevice.getDevice(deviceId);
        int controllerNumber = -1;
        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.KITKAT)
            controllerNumber = inputDevice.getControllerNumber();
        String deviceDescriptor = inputDevice.getDescriptor();
        String deviceName = inputDevice.getName();
        int deviceProductId = -1;
        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.KITKAT)
          deviceProductId = inputDevice.getProductId();
        int deviceSources = inputDevice.getSources();
        int deviceVendorId = -1;
        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.KITKAT)
          deviceVendorId = inputDevice.getVendorId();
        boolean hasVibrator = inputDevice.getVibrator().hasVibrator();
        boolean isVirtual = inputDevice.isVirtual();

        Log.d(TAG, "logControllerInfo" +
                "\nfor deviceId: " + deviceId +
                "\nname: " + deviceName +
                "\ndescriptor: " + deviceDescriptor +
                "\nvendorId: " + deviceVendorId +
                "\nproductId " + deviceProductId +
                "\nhasVibrator: " + hasVibrator +
                "\nisVirtual: " + isVirtual +
                "\n" + generateSourceString(deviceSources));

        List<InputDevice.MotionRange> motionRanges = inputDevice.getMotionRanges();
        Log.d(TAG, "Motion Range count: " + motionRanges.size());

        for (InputDevice.MotionRange motionRange : motionRanges) {
            logMotionRange(motionRange);
        }
    }

    // JNI interface functions for native GameControllerManager
    public native void onControllerConnected(int[] deviceInfoArray,
                                             float[] axisMinArray, float[] axisMaxArray,
                                             float[] axisFlatArray, float[] axisFloorArray);

    public native void onControllerDisconnected(int deviceId);

    public native void onMotionData(int deviceId, int motionType, long timestamp,
                                    float dataX, float dataY, float dataZ);

    public native void onMouseConnected(int deviceId);

    public native void onMouseDisconnected(int deviceId);
}
