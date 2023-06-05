/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable brace-style */
import { systemInfo } from 'pal/system-info';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { Feature } from '../../system-info/enum-type';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventGamepad } from '../../../cocos/input/types';
import { InputSourceButton, InputSourceDpad, InputSourceOrientation, InputSourcePosition, InputSourceStick } from '../input-source';
import { Quat, Vec3, js } from '../../../cocos/core';

export type GamepadCallback = (res: EventGamepad) => void;

enum Button {
    BUTTON_SOUTH,
    BUTTON_EAST,
    BUTTON_WEST,
    BUTTON_NORTH,
    NS_MINUS,
    NS_PLUS,
    BUTTON_L1,
    BUTTON_L2,
    BUTTON_L3,
    BUTTON_R1,
    BUTTON_R2,
    BUTTON_R3,
    DPAD_UP,
    DPAD_DOWN,
    DPAD_LEFT,
    DPAD_RIGHT,
    LEFT_STICK_UP,
    LEFT_STICK_DOWN,
    LEFT_STICK_LEFT,
    LEFT_STICK_RIGHT,
    RIGHT_STICK_UP,
    RIGHT_STICK_DOWN,
    RIGHT_STICK_LEFT,
    RIGHT_STICK_RIGHT,
    ROKID_MENU,
    ROKID_START,
}

type NativeButtonState = Record<Button, number>

const _nativeButtonMap = {
    1: Button.BUTTON_EAST,
    2: Button.BUTTON_SOUTH,
    3: Button.BUTTON_NORTH,
    4: Button.BUTTON_WEST,
    5: Button.BUTTON_L1,
    6: Button.BUTTON_R1,
    7: Button.NS_MINUS,
    8: Button.NS_PLUS,
    9: Button.BUTTON_L3,
    10: Button.BUTTON_R3,
    11: Button.ROKID_MENU,
    12: Button.ROKID_START,
};

interface IAxisValue {
    negative: number;
    positive: number;
}

export class GamepadInputDevice {
    public static all: GamepadInputDevice[] = [];
    public static xr: (GamepadInputDevice | null) = null;

    public get buttonNorth (): InputSourceButton { return this._buttonNorth; }
    public get buttonEast (): InputSourceButton { return this._buttonEast; }
    public get buttonWest (): InputSourceButton { return this._buttonWest; }
    public get buttonSouth (): InputSourceButton { return this._buttonSouth; }
    public get buttonL1 (): InputSourceButton { return this._buttonL1; }
    public get buttonL2 (): InputSourceButton { return this._buttonL2; }
    public get buttonL3 (): InputSourceButton { return this._buttonL3; }
    public get buttonR1 (): InputSourceButton { return this._buttonR1; }
    public get buttonR2 (): InputSourceButton { return this._buttonR2; }
    public get buttonR3 (): InputSourceButton { return this._buttonR3; }
    // public get buttonTouchPad () { return this._buttonTouchPad; }
    // public get buttonHome () { return this._buttonHome; }
    public get buttonShare (): InputSourceButton { return this._buttonShare; }
    public get buttonOptions (): InputSourceButton { return this._buttonOptions; }
    public get dpad (): InputSourceDpad { return this._dpad; }
    public get leftStick (): InputSourceStick { return this._leftStick; }
    public get rightStick (): InputSourceStick { return this._rightStick; }
    public get buttonStart (): InputSourceButton { return this._buttonStart; }
    public get gripLeft (): InputSourceButton { return this._gripLeft; }
    public get gripRight (): InputSourceButton { return this._gripRight; }
    public get handLeftPosition (): InputSourcePosition { return this._handLeftPosition; }
    public get handLeftOrientation (): InputSourceOrientation { return this._handLeftOrientation; }
    public get handRightPosition (): InputSourcePosition { return this._handRightPosition; }
    public get handRightOrientation (): InputSourceOrientation { return this._handRightOrientation; }
    public get aimLeftPosition (): InputSourcePosition { return this._aimLeftPosition; }
    public get aimLeftOrientation (): InputSourceOrientation { return this._aimLeftOrientation; }
    public get aimRightPosition (): InputSourcePosition { return this._aimRightPosition; }
    public get aimRightOrientation (): InputSourceOrientation { return this._aimRightOrientation; }

    public get deviceId (): number {
        return this._deviceId;
    }
    public get connected (): boolean {
        return this._connected;
    }

    private static _eventTarget: EventTarget = new EventTarget();

    private _buttonNorth!: InputSourceButton;
    private _buttonEast!: InputSourceButton;
    private _buttonWest!: InputSourceButton;
    private _buttonSouth!: InputSourceButton;
    private _buttonL1!: InputSourceButton;
    private _buttonL2!: InputSourceButton;
    private _buttonL3!: InputSourceButton;
    private _buttonR1!: InputSourceButton;
    private _buttonR2!: InputSourceButton;
    private _buttonR3!: InputSourceButton;
    // private buttonTouchPad!: InputSourceButton;
    // private buttonHome!: InputSourceButton;
    private _buttonShare!: InputSourceButton;
    private _buttonOptions!: InputSourceButton;
    private _dpad!: InputSourceDpad;
    private _leftStick!: InputSourceStick;
    private _rightStick!: InputSourceStick;
    private _buttonStart!: InputSourceButton;
    private _gripLeft!: InputSourceButton;
    private _gripRight!: InputSourceButton;
    private _handLeftPosition!: InputSourcePosition;
    private _handLeftOrientation!: InputSourceOrientation;
    private _handRightPosition!: InputSourcePosition;
    private _handRightOrientation!: InputSourceOrientation;
    private _aimLeftPosition!: InputSourcePosition;
    private _aimLeftOrientation!: InputSourceOrientation;
    private _aimRightPosition!: InputSourcePosition;
    private _aimRightOrientation!: InputSourceOrientation;

    private _deviceId = -1;
    private _connected = false;
    private _nativeButtonState: NativeButtonState = {
        [Button.BUTTON_SOUTH]: 0,
        [Button.BUTTON_EAST]: 0,
        [Button.BUTTON_WEST]: 0,
        [Button.BUTTON_NORTH]: 0,
        [Button.NS_MINUS]: 0,
        [Button.NS_PLUS]: 0,
        [Button.BUTTON_L1]: 0,
        [Button.BUTTON_L2]: 0,
        [Button.BUTTON_L3]: 0,
        [Button.BUTTON_R1]: 0,
        [Button.BUTTON_R2]: 0,
        [Button.BUTTON_R3]: 0,
        [Button.DPAD_UP]: 0,
        [Button.DPAD_DOWN]: 0,
        [Button.DPAD_LEFT]: 0,
        [Button.DPAD_RIGHT]: 0,
        [Button.LEFT_STICK_UP]: 0,
        [Button.LEFT_STICK_DOWN]: 0,
        [Button.LEFT_STICK_LEFT]: 0,
        [Button.LEFT_STICK_RIGHT]: 0,
        [Button.RIGHT_STICK_UP]: 0,
        [Button.RIGHT_STICK_DOWN]: 0,
        [Button.RIGHT_STICK_LEFT]: 0,
        [Button.RIGHT_STICK_RIGHT]: 0,
        [Button.ROKID_MENU]: 0,
        [Button.ROKID_START]: 0,
    };

    constructor (deviceId: number) {
        this._deviceId = deviceId;
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public static _init (): void {
        if (!systemInfo.hasFeature(Feature.EVENT_GAMEPAD)) {
            return;
        }
        GamepadInputDevice._registerEvent();
    }

    /**
     * @engineInternal
     */
    public static _on (eventType: InputEventType, cb: GamepadCallback, target?: any): void {
        GamepadInputDevice._eventTarget.on(eventType, cb, target);
    }

    private static _removeInputDevice (id: number): void {
        const removeIndex = GamepadInputDevice.all.findIndex((device) => device.deviceId === id);
        if (removeIndex === -1) {
            return;
        }
        js.array.fastRemoveAt(GamepadInputDevice.all, removeIndex);
    }
    private static _getInputDevice (id: number): GamepadInputDevice | undefined {
        return GamepadInputDevice.all.find((device) => device.deviceId === id);
    }
    private static _createInputDevice (id: number, connected: boolean): GamepadInputDevice {
        const device = new GamepadInputDevice(id);
        device._connected = connected;
        GamepadInputDevice.all.push(device);
        return device;
    }
    private static _getOrCreateInputDevice (id: number, connected: boolean): GamepadInputDevice {
        let device =  GamepadInputDevice._getInputDevice(id);
        if (!device) {
            device = GamepadInputDevice._createInputDevice(id, connected);
        }
        device._connected = connected;
        return device;
    }

    private static _registerEvent (): void {
        jsb.onControllerInput = (infoList: jsb.ControllerInfo[]): void => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                const device = GamepadInputDevice._getOrCreateInputDevice(info.id, true);
                device._updateNativeButtonState(info);
                GamepadInputDevice._eventTarget.emit(InputEventType.GAMEPAD_INPUT, new EventGamepad(InputEventType.GAMEPAD_INPUT, device));
            }
        };

        jsb.onControllerChange = (controllerIds): void => {
            // check connecting
            for (let i = 0; i < controllerIds.length; ++i) {
                const id = controllerIds[i];
                let device = GamepadInputDevice._getInputDevice(id);
                if (!device) {
                    device = GamepadInputDevice._createInputDevice(id, true);
                    GamepadInputDevice._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, device));
                }
            }
            // check disconnecting
            const allDevices = GamepadInputDevice.all;
            for (let i = 0; i < allDevices.length; ++i) {
                const device = allDevices[i];
                if (!controllerIds.includes(device.deviceId)) {
                    GamepadInputDevice._removeInputDevice(device.deviceId);
                    device._connected = false;
                    GamepadInputDevice._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, device));
                }
            }
        };
    }

    private _axisToButtons (axisValue: number): IAxisValue {
        const value = Math.abs(axisValue);
        if (axisValue > 0) {
            return { negative: 0, positive: value };
        } else if (axisValue < 0) {
            return { negative: value, positive: 0 };
        } else {
            return { negative: 0, positive: 0 };
        }
    }

    private _updateNativeButtonState (info: jsb.ControllerInfo): void {
        const { buttonInfoList, axisInfoList } = info;
        for (let i = 0; i < buttonInfoList.length; ++i) {
            const buttonInfo = buttonInfoList[i];
            const button = _nativeButtonMap[buttonInfo.code];
            this._nativeButtonState[button] = buttonInfo.isPressed ? 1 : 0;
        }
        for (let i = 0; i < axisInfoList.length; ++i) {
            const axisInfo = axisInfoList[i];
            const { code, value } = axisInfo;
            let negativeButton: Button | undefined;
            let positiveButton: Button | undefined;
            let axisValue: IAxisValue | undefined;
            switch (code) {
            case 1:
                negativeButton = Button.DPAD_LEFT;
                positiveButton = Button.DPAD_RIGHT;
                axisValue = this._axisToButtons(value);
                break;
            case 2:
                negativeButton = Button.DPAD_DOWN;
                positiveButton = Button.DPAD_UP;
                axisValue = this._axisToButtons(value);
                break;
            case 3:
                negativeButton = Button.LEFT_STICK_LEFT;
                positiveButton = Button.LEFT_STICK_RIGHT;
                axisValue = this._axisToButtons(value);
                break;
            case 4:
                negativeButton = Button.LEFT_STICK_DOWN;
                positiveButton = Button.LEFT_STICK_UP;
                axisValue = this._axisToButtons(value);
                break;
            case 5:
                negativeButton = Button.RIGHT_STICK_LEFT;
                positiveButton = Button.RIGHT_STICK_RIGHT;
                axisValue = this._axisToButtons(value);
                break;
            case 6:
                negativeButton = Button.RIGHT_STICK_DOWN;
                positiveButton = Button.RIGHT_STICK_UP;
                axisValue = this._axisToButtons(value);
                break;
            default:
                if (code === 7) { this._nativeButtonState[Button.BUTTON_L2] = value; }
                else if (code === 8) { this._nativeButtonState[Button.BUTTON_R2] = value; }
                break;
            }
            if (negativeButton && positiveButton && axisValue) {
                this._nativeButtonState[negativeButton] = axisValue.negative;
                this._nativeButtonState[positiveButton] = axisValue.positive;
            }
        }
    }

    private _initInputSource (): void {
        this._buttonNorth = new InputSourceButton();
        this._buttonNorth.getValue = (): number => this._nativeButtonState[Button.BUTTON_NORTH];
        this._buttonEast = new InputSourceButton();
        this._buttonEast.getValue = (): number => this._nativeButtonState[Button.BUTTON_EAST];
        this._buttonWest = new InputSourceButton();
        this._buttonWest.getValue = (): number => this._nativeButtonState[Button.BUTTON_WEST];
        this._buttonSouth = new InputSourceButton();
        this._buttonSouth.getValue = (): number => this._nativeButtonState[Button.BUTTON_SOUTH];

        this._buttonL1 = new InputSourceButton();
        this._buttonL1.getValue = (): number => this._nativeButtonState[Button.BUTTON_L1];
        this._buttonL2 = new InputSourceButton();
        this._buttonL2.getValue = (): number => this._nativeButtonState[Button.BUTTON_L2];
        this._buttonL3 = new InputSourceButton();
        this._buttonL3.getValue = (): number => this._nativeButtonState[Button.BUTTON_L3];
        this._buttonR1 = new InputSourceButton();
        this._buttonR1.getValue = (): number => this._nativeButtonState[Button.BUTTON_R1];
        this._buttonR2 = new InputSourceButton();
        this._buttonR2.getValue = (): number => this._nativeButtonState[Button.BUTTON_R2];
        this._buttonR3 = new InputSourceButton();
        this._buttonR3.getValue = (): number => this._nativeButtonState[Button.BUTTON_R3];

        // this._buttonTouchPad = new InputSourceButton();
        // this._buttonTouchPad.getValue = () => 0;  // TODO: NX unavailable
        // this._buttonHome = new InputSourceButton();
        // this._buttonHome.getValue = () => 0;  // TODO: NX unavailable

        this._buttonShare = new InputSourceButton();
        this._buttonShare.getValue = (): number => this._nativeButtonState[Button.NS_MINUS];  // TODO: NX only for now
        this._buttonOptions = new InputSourceButton();
        this._buttonOptions.getValue = (): number => this._nativeButtonState[Button.NS_PLUS] || this._nativeButtonState[Button.ROKID_MENU];

        const dpadUp = new InputSourceButton();
        dpadUp.getValue = (): number => this._nativeButtonState[Button.DPAD_UP];
        const dpadDown = new InputSourceButton();
        dpadDown.getValue = (): number => this._nativeButtonState[Button.DPAD_DOWN];
        const dpadLeft = new InputSourceButton();
        dpadLeft.getValue = (): number => this._nativeButtonState[Button.DPAD_LEFT];
        const dpadRight = new InputSourceButton();
        dpadRight.getValue = (): number => this._nativeButtonState[Button.DPAD_RIGHT];
        this._dpad = new InputSourceDpad({ up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight });

        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = (): number => this._nativeButtonState[Button.LEFT_STICK_UP];
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = (): number => this._nativeButtonState[Button.LEFT_STICK_DOWN];
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = (): number => this._nativeButtonState[Button.LEFT_STICK_LEFT];
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = (): number => this._nativeButtonState[Button.LEFT_STICK_RIGHT];
        this._leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = (): number => this._nativeButtonState[Button.RIGHT_STICK_UP];
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = (): number => this._nativeButtonState[Button.RIGHT_STICK_DOWN];
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = (): number => this._nativeButtonState[Button.RIGHT_STICK_LEFT];
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = (): number => this._nativeButtonState[Button.RIGHT_STICK_RIGHT];
        this._rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });

        this._buttonStart = new InputSourceButton();
        this._buttonStart.getValue = (): number => this._nativeButtonState[Button.ROKID_START];  // TODO: Rokid only for now

        this._gripLeft = new InputSourceButton();
        this._gripLeft.getValue = (): number => 0;
        this._gripRight = new InputSourceButton();
        this._gripRight.getValue = (): number => 0;

        this._handLeftPosition = new InputSourcePosition();
        this._handLeftPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        this._handLeftOrientation = new InputSourceOrientation();
        this._handLeftOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;

        this._handRightPosition = new InputSourcePosition();
        this._handRightPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        this._handRightOrientation = new InputSourceOrientation();
        this._handRightOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;

        this._aimLeftPosition = new InputSourcePosition();
        this._aimLeftPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        this._aimLeftOrientation = new InputSourceOrientation();
        this._aimLeftOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;

        this._aimRightPosition = new InputSourcePosition();
        this._aimRightPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        this._aimRightOrientation = new InputSourceOrientation();
        this._aimRightOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;
    }
}
