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

import { HandleCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event';
import { EventHandle } from '../../../cocos/input/types';
import { InputSourceButton, InputSourceStick, InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

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

export enum KeyEventType {
    KET_CLICK,
    KET_STICK,
    KET_GRAB
}

enum StickAxisCode {
    UNDEFINE = 0,
    X,
    Y,
    LEFT_STICK_X,
    LEFT_STICK_Y,
    RIGHT_STICK_X,
    RIGHT_STICK_Y,
    LEFT_TRIGGER,
    RIGHT_TIRGGER,
    LEFT_GRIP,
    RIGHT_GRIP,
}

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

type NativeButtonState = Record<Button, number>

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

    constructor () {
        this._initInputSource();
        window.addEventListener('xr-remote-input', (evt: Event): void => {
            const remoteInputEvent: CustomEvent = evt as CustomEvent;
            const keyEventType: KeyEventType = remoteInputEvent.detail.keyEventType;
            const stickAxisCode = remoteInputEvent.detail.stickAxisCode;
            const stickAxisValue = remoteInputEvent.detail.stickAxisValue;
            const stickKeyCode = remoteInputEvent.detail.stickKeyCode;
            const isButtonPressed = remoteInputEvent.detail.isButtonPressed;

            if (keyEventType === KeyEventType.KET_CLICK) {
                const button = _nativeButtonMap[stickKeyCode];
                this._nativeButtonState[button] = isButtonPressed ? 1 : 0;
            } else if (keyEventType === KeyEventType.KET_STICK || keyEventType === KeyEventType.KET_GRAB) {
                //
                let negativeButton: Button|undefined;
                let positiveButton: Button|undefined;
                let axisValue: IAxisValue|undefined;
                switch (stickAxisCode) {
                case StickAxisCode.LEFT_STICK_X:
                    negativeButton = Button.LEFT_STICK_LEFT;
                    positiveButton = Button.LEFT_STICK_RIGHT;
                    axisValue = this._axisToButtons(stickAxisValue);
                    break;
                case StickAxisCode.LEFT_STICK_Y:
                    negativeButton = Button.LEFT_STICK_DOWN;
                    positiveButton = Button.LEFT_STICK_UP;
                    axisValue = this._axisToButtons(stickAxisValue);
                    break;
                case StickAxisCode.RIGHT_STICK_X:
                    negativeButton = Button.RIGHT_STICK_LEFT;
                    positiveButton = Button.RIGHT_STICK_RIGHT;
                    axisValue = this._axisToButtons(stickAxisValue);
                    break;
                case StickAxisCode.RIGHT_STICK_Y:
                    negativeButton = Button.RIGHT_STICK_DOWN;
                    positiveButton = Button.RIGHT_STICK_UP;
                    axisValue = this._axisToButtons(stickAxisValue);
                    break;
                case StickAxisCode.LEFT_TRIGGER:
                    this._nativeButtonState[Button.TRIGGER_LEFT] = stickAxisValue;
                    break;
                case StickAxisCode.RIGHT_TIRGGER:
                    this._nativeButtonState[Button.TRIGGER_RIGHT] = stickAxisValue;
                    break;
                case StickAxisCode.LEFT_GRIP:
                    this._nativeButtonState[Button.GRIP_LEFT] = stickAxisValue;
                    break;
                case StickAxisCode.RIGHT_GRIP:
                    this._nativeButtonState[Button.GRIP_RIGHT] = stickAxisValue;
                    break;
                default:
                    break;
                }

                if (negativeButton && positiveButton && axisValue) {
                    this._nativeButtonState[negativeButton] = axisValue.negative;
                    this._nativeButtonState[positiveButton] = axisValue.positive;
                }
            }

            this._eventTarget.emit(InputEventType.HANDLE_INPUT, new EventHandle(InputEventType.HANDLE_INPUT, this));
        });
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

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HandleCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
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
        this._leftStick = new InputSourceStick({
            up: leftStickUp,
            down: leftStickDown,
            left: leftStickLeft,
            right: leftStickRight,
        });

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
        this._rightStick = new InputSourceStick({
            up: rightStickUp,
            down: rightStickDown,
            left: rightStickLeft,
            right: rightStickRight,
        });

        this._buttonOptions = new InputSourceButton();
        this._buttonOptions.getValue = () => this._nativeButtonState[Button.ROKID_MENU];
        this._buttonStart = new InputSourceButton();
        this._buttonStart.getValue = () => this._nativeButtonState[Button.ROKID_START];

        this._handLeftPosition = new InputSourcePosition();
        this._handLeftPosition.getValue = () => Vec3.ZERO;
        this._handLeftOrientation = new InputSourceOrientation();
        this._handLeftOrientation.getValue = () => Quat.IDENTITY;

        this._handRightPosition = new InputSourcePosition();
        this._handRightPosition.getValue = () => Vec3.ZERO;
        this._handRightOrientation = new InputSourceOrientation();
        this._handRightOrientation.getValue = () => Quat.IDENTITY;

        this._aimLeftPosition = new InputSourcePosition();
        this._aimLeftPosition.getValue = () => Vec3.ZERO;
        this._aimLeftOrientation = new InputSourceOrientation();
        this._aimLeftOrientation.getValue = () => Quat.IDENTITY;

        this._aimRightPosition = new InputSourcePosition();
        this._aimRightPosition.getValue = () => Vec3.ZERO;
        this._aimRightOrientation = new InputSourceOrientation();
        this._aimRightOrientation.getValue = () => Quat.IDENTITY;
    }
}
