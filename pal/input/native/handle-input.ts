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

import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventHandle } from '../../../cocos/input/types';
import { InputSourceButton, InputSourceStick, InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

export type HandleCallback = (res: EventHandle) => void;

enum Button {
    BUTTON_EAST,
    BUTTON_SOUTH,
    BUTTON_WEST,
    BUTTON_NORTH,
    BUTTON_TRIGGER_LEFT,
    BUTTON_TRIGGER_RIGHT,
    TRIGGER_LEFT,
    TRIGGER_RIGHT,
    GRIP_LEFT,
    GRIP_RIGHT,
    BUTTON_LEFT_STICK,
    LEFT_STICK_UP,
    LEFT_STICK_DOWN,
    LEFT_STICK_LEFT,
    LEFT_STICK_RIGHT,
    BUTTON_RIGHT_STICK,
    RIGHT_STICK_UP,
    RIGHT_STICK_DOWN,
    RIGHT_STICK_LEFT,
    RIGHT_STICK_RIGHT,
    ROKID_MENU,
    ROKID_START,
}

enum Pose {
    HAND_LEFT,
    HAND_RIGHT,
    AIM_LEFT,
    AIM_RIGHT,
}

interface IPoseValue {
    position: Vec3;
    orientation: Quat;
}

type NativeButtonState = Record<Button, number>
type NativePoseState = Record<Pose, IPoseValue>

const _nativeButtonMap = {
    1: Button.BUTTON_EAST,
    2: Button.BUTTON_SOUTH,
    3: Button.BUTTON_NORTH,
    4: Button.BUTTON_WEST,
    9: Button.BUTTON_LEFT_STICK,
    10: Button.BUTTON_RIGHT_STICK,
    11: Button.ROKID_MENU,
    12: Button.ROKID_START,
    13: Button.BUTTON_TRIGGER_LEFT,
    14: Button.BUTTON_TRIGGER_RIGHT,
};

interface IAxisValue {
    negative: number;
    positive: number;
}

export class HandleInputDevice {
    public get buttonNorth () { return this._buttonNorth; }
    public get buttonEast () { return this._buttonEast; }
    public get buttonWest () { return this._buttonWest; }
    public get buttonSouth () { return this._buttonSouth; }
    public get buttonTriggerLeft () { return this._buttonTriggerLeft; }
    public get buttonTriggerRight () { return this._buttonTriggerRight; }
    public get triggerLeft () { return this._triggerLeft; }
    public get triggerRight () { return this._triggerRight; }
    public get gripLeft () { return this._gripLeft; }
    public get gripRight () { return this._gripRight; }
    public get leftStick () { return this._leftStick; }
    public get rightStick () { return this._rightStick; }
    public get buttonLeftStick () { return this._buttonLeftStick; }
    public get buttonRightStick () { return this._buttonRightStick; }
    public get buttonOptions () { return this._buttonOptions; }
    public get buttonStart () { return this._buttonStart; }
    public get handLeftPosition () { return this._handLeftPosition; }
    public get handLeftOrientation () { return this._handLeftOrientation; }
    public get handRightPosition () { return this._handRightPosition; }
    public get handRightOrientation () { return this._handRightOrientation; }
    public get aimLeftPosition () { return this._aimLeftPosition; }
    public get aimLeftOrientation () { return this._aimLeftOrientation; }
    public get aimRightPosition () { return this._aimRightPosition; }
    public get aimRightOrientation () { return this._aimRightOrientation; }

    private _eventTarget: EventTarget = new EventTarget();

    private _buttonNorth!: InputSourceButton;
    private _buttonEast!: InputSourceButton;
    private _buttonWest!: InputSourceButton;
    private _buttonSouth!: InputSourceButton;
    private _buttonTriggerLeft!: InputSourceButton;
    private _buttonTriggerRight!: InputSourceButton;
    private _triggerLeft!: InputSourceButton;
    private _triggerRight!: InputSourceButton;
    private _gripLeft!: InputSourceButton;
    private _gripRight!: InputSourceButton;
    private _leftStick!: InputSourceStick;
    private _rightStick!: InputSourceStick;
    private _buttonLeftStick!: InputSourceButton;
    private _buttonRightStick!: InputSourceButton;
    private _buttonOptions!: InputSourceButton;
    private _buttonStart!: InputSourceButton;
    private _handLeftPosition!: InputSourcePosition;
    private _handLeftOrientation!: InputSourceOrientation;
    private _handRightPosition!: InputSourcePosition;
    private _handRightOrientation!: InputSourceOrientation;
    private _aimLeftPosition!: InputSourcePosition;
    private _aimLeftOrientation!: InputSourceOrientation;
    private _aimRightPosition!: InputSourcePosition;
    private _aimRightOrientation!: InputSourceOrientation;

    private _nativeButtonState: NativeButtonState = {
        [Button.BUTTON_SOUTH]: 0,
        [Button.BUTTON_EAST]: 0,
        [Button.BUTTON_WEST]: 0,
        [Button.BUTTON_NORTH]: 0,
        [Button.BUTTON_TRIGGER_LEFT]: 0,
        [Button.BUTTON_TRIGGER_RIGHT]: 0,
        [Button.TRIGGER_LEFT]: 0,
        [Button.TRIGGER_RIGHT]: 0,
        [Button.GRIP_LEFT]: 0,
        [Button.GRIP_RIGHT]: 0,
        [Button.LEFT_STICK_UP]: 0,
        [Button.LEFT_STICK_DOWN]: 0,
        [Button.LEFT_STICK_LEFT]: 0,
        [Button.LEFT_STICK_RIGHT]: 0,
        [Button.RIGHT_STICK_UP]: 0,
        [Button.RIGHT_STICK_DOWN]: 0,
        [Button.RIGHT_STICK_LEFT]: 0,
        [Button.RIGHT_STICK_RIGHT]: 0,
        [Button.BUTTON_LEFT_STICK]: 0,
        [Button.BUTTON_RIGHT_STICK]: 0,
        [Button.ROKID_MENU]: 0,
        [Button.ROKID_START]: 0,
    };

    private _nativePoseState: NativePoseState = {
        [Pose.HAND_LEFT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.HAND_RIGHT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.AIM_LEFT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.AIM_RIGHT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
    }

    constructor () {
        this._initInputSource();
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onHandleInput = (infoList: jsb.ControllerInfo[]) => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                this._updateNativeButtonState(info);
                this._eventTarget.emit(InputEventType.HANDLE_INPUT, new EventHandle(InputEventType.HANDLE_INPUT, this));
            }
        };

        jsb.onHandlePoseInput = (infoList: jsb.PoseInfo[]) => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                this._updateNativePoseState(info);
            }
            this._eventTarget.emit(InputEventType.HANDLE_POSE_INPUT, new EventHandle(InputEventType.HANDLE_POSE_INPUT, this));
        };
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HandleCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
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

    private _updateNativeButtonState (info: jsb.ControllerInfo) {
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
                if (code === 7) {
                    this._nativeButtonState[Button.TRIGGER_LEFT] = value;
                } else if (code === 8) {
                    this._nativeButtonState[Button.TRIGGER_RIGHT] = value;
                } else if (code === 9) {
                    this._nativeButtonState[Button.GRIP_LEFT] = value;
                } else if (code === 10) {
                    this._nativeButtonState[Button.GRIP_RIGHT] = value;
                }
                break;
            }
            if (negativeButton && positiveButton && axisValue) {
                this._nativeButtonState[negativeButton] = axisValue.negative;
                this._nativeButtonState[positiveButton] = axisValue.positive;
            }
        }
    }

    private _updateNativePoseState (info: jsb.PoseInfo) {
        switch (info.code) {
            case 1:
                this._nativePoseState[Pose.HAND_LEFT] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            case 2:
                this._nativePoseState[Pose.AIM_LEFT] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            case 4:
                this._nativePoseState[Pose.HAND_RIGHT] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            case 5:
                this._nativePoseState[Pose.AIM_RIGHT] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            default:
                break;
        }
    }

    private _initInputSource () {
        this._buttonNorth = new InputSourceButton();
        this._buttonNorth.getValue = () => this._nativeButtonState[Button.BUTTON_NORTH];
        this._buttonEast = new InputSourceButton();
        this._buttonEast.getValue = () => this._nativeButtonState[Button.BUTTON_EAST];
        this._buttonWest = new InputSourceButton();
        this._buttonWest.getValue = () => this._nativeButtonState[Button.BUTTON_WEST];
        this._buttonSouth = new InputSourceButton();
        this._buttonSouth.getValue = () => this._nativeButtonState[Button.BUTTON_SOUTH];

        this._buttonTriggerLeft = new InputSourceButton();
        this._buttonTriggerLeft.getValue = () => this._nativeButtonState[Button.BUTTON_TRIGGER_LEFT];
        this._buttonTriggerRight = new InputSourceButton();
        this._buttonTriggerRight.getValue = () => this._nativeButtonState[Button.BUTTON_TRIGGER_RIGHT];
        this._triggerLeft = new InputSourceButton();
        this._triggerLeft.getValue = () => this._nativeButtonState[Button.TRIGGER_LEFT];
        this._triggerRight = new InputSourceButton();
        this._triggerRight.getValue = () => this._nativeButtonState[Button.TRIGGER_RIGHT];
        this._gripLeft = new InputSourceButton();
        this._gripLeft.getValue = () => this._nativeButtonState[Button.GRIP_LEFT];
        this._gripRight = new InputSourceButton();
        this._gripRight.getValue = () => this._nativeButtonState[Button.GRIP_RIGHT];

        this._buttonLeftStick = new InputSourceButton();
        this._buttonLeftStick.getValue = () => this._nativeButtonState[Button.BUTTON_LEFT_STICK];
        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = () => this._nativeButtonState[Button.LEFT_STICK_UP];
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = () => this._nativeButtonState[Button.LEFT_STICK_DOWN];
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = () => this._nativeButtonState[Button.LEFT_STICK_LEFT];
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = () => this._nativeButtonState[Button.LEFT_STICK_RIGHT];
        this._leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        this._buttonRightStick = new InputSourceButton();
        this._buttonRightStick.getValue = () => this._nativeButtonState[Button.BUTTON_RIGHT_STICK];
        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_UP];
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_DOWN];
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_LEFT];
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_RIGHT];
        this._rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });

        this._buttonOptions = new InputSourceButton();
        this._buttonOptions.getValue = () => this._nativeButtonState[Button.ROKID_MENU];
        this._buttonStart = new InputSourceButton();
        this._buttonStart.getValue = () => this._nativeButtonState[Button.ROKID_START];

        this._handLeftPosition = new InputSourcePosition();
        this._handLeftPosition.getValue = () => this._nativePoseState[Pose.HAND_LEFT].position;
        this._handLeftOrientation = new InputSourceOrientation();
        this._handLeftOrientation.getValue = () => this._nativePoseState[Pose.HAND_LEFT].orientation;

        this._handRightPosition = new InputSourcePosition();
        this._handRightPosition.getValue = () => this._nativePoseState[Pose.HAND_RIGHT].position;
        this._handRightOrientation = new InputSourceOrientation();
        this._handRightOrientation.getValue = () => this._nativePoseState[Pose.HAND_RIGHT].orientation;

        this._aimLeftPosition = new InputSourcePosition();
        this._aimLeftPosition.getValue = () => this._nativePoseState[Pose.AIM_LEFT].position;
        this._aimLeftOrientation = new InputSourceOrientation();
        this._aimLeftOrientation.getValue = () => this._nativePoseState[Pose.AIM_LEFT].orientation;

        this._aimRightPosition = new InputSourcePosition();
        this._aimRightPosition.getValue = () => this._nativePoseState[Pose.AIM_RIGHT].position;
        this._aimRightOrientation = new InputSourceOrientation();
        this._aimRightOrientation.getValue = () => this._nativePoseState[Pose.AIM_RIGHT].orientation;
    }
}
