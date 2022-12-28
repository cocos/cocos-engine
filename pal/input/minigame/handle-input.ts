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
import { InputSourceButton, InputSourceStick, InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

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

    constructor () {
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HandleCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }

    private _initInputSource () {
        this._buttonNorth = new InputSourceButton();
        this._buttonNorth.getValue = () => 0;
        this._buttonEast = new InputSourceButton();
        this._buttonEast.getValue = () => 0;
        this._buttonWest = new InputSourceButton();
        this._buttonWest.getValue = () => 0;
        this._buttonSouth = new InputSourceButton();
        this._buttonSouth.getValue = () => 0;

        this._buttonTriggerLeft = new InputSourceButton();
        this._buttonTriggerLeft.getValue = () => 0;
        this._buttonTriggerRight = new InputSourceButton();
        this._buttonTriggerRight.getValue = () => 0;
        this._triggerLeft = new InputSourceButton();
        this._triggerLeft.getValue = () => 0;
        this._triggerRight = new InputSourceButton();
        this._triggerRight.getValue = () => 0;
        this._gripLeft = new InputSourceButton();
        this._gripLeft.getValue = () => 0;
        this._gripRight = new InputSourceButton();
        this._gripRight.getValue = () => 0;

        this._buttonLeftStick = new InputSourceButton();
        this._buttonLeftStick.getValue = () => 0;
        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = () => 0;
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = () => 0;
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = () => 0;
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = () => 0;
        this._leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        this._buttonRightStick = new InputSourceButton();
        this._buttonRightStick.getValue = () => 0;
        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = () => 0;
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = () => 0;
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = () => 0;
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = () => 0;
        this._rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });

        this._buttonOptions = new InputSourceButton();
        this._buttonOptions.getValue = () => 0;
        this._buttonStart = new InputSourceButton();
        this._buttonStart.getValue = () => 0;

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
