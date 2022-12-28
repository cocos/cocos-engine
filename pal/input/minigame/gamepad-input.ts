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

import { GamepadCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { InputSourceButton, InputSourceDpad, InputSourceStick } from '../input-source';

export class GamepadInputDevice {
    public static all: GamepadInputDevice[] = [];

    public get buttonNorth () { return this._buttonNorth; }
    public get buttonEast () { return this._buttonEast; }
    public get buttonWest () { return this._buttonWest; }
    public get buttonSouth () { return this._buttonSouth; }
    public get buttonL1 () { return this._buttonL1; }
    public get buttonL2 () { return this._buttonL2; }
    public get buttonL3 () { return this._buttonL3; }
    public get buttonR1 () { return this._buttonR1; }
    public get buttonR2 () { return this._buttonR2; }
    public get buttonR3 () { return this._buttonR3; }
    // public get buttonTouchPad () { return this._buttonTouchPad; }
    // public get buttonHome () { return this._buttonHome; }
    public get buttonShare () { return this._buttonShare; }
    public get buttonOptions () { return this._buttonOptions; }
    public get dpad () { return this._dpad; }
    public get leftStick () { return this._leftStick; }
    public get rightStick () { return this._rightStick; }
    public get buttonStart () { return this._buttonStart; }

    public get deviceId () {
        return this._deviceId;
    }
    public get connected () {
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

    private _deviceId = -1;
    private _connected = false;

    constructor (deviceId: number) {
        this._deviceId = deviceId;
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public static _init () {
        // not supported
    }

    /**
     * @engineInternal
     */
    public static _on (eventType: InputEventType, cb: GamepadCallback, target?: any) {
        GamepadInputDevice._eventTarget.on(eventType, cb, target);
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

        this._buttonL1 = new InputSourceButton();
        this._buttonL1.getValue = () => 0;
        this._buttonL2 = new InputSourceButton();
        this._buttonL2.getValue = () => 0;
        this._buttonL3 = new InputSourceButton();
        this._buttonL3.getValue = () => 0;
        this._buttonR1 = new InputSourceButton();
        this._buttonR1.getValue = () => 0;
        this._buttonR2 = new InputSourceButton();
        this._buttonR2.getValue = () => 0;
        this._buttonR3 = new InputSourceButton();
        this._buttonR3.getValue = () => 0;

        // this._buttonTouchPad = new InputSourceButton();
        // this._buttonTouchPad.getValue = () => 0;
        // this._buttonHome = new InputSourceButton();
        // this._buttonHome.getValue = () => 0;

        this._buttonShare = new InputSourceButton();
        this._buttonShare.getValue = () => 0;
        this._buttonOptions = new InputSourceButton();
        this._buttonOptions.getValue = () => 0;

        const dpadUp = new InputSourceButton();
        dpadUp.getValue = () => 0;
        const dpadDown = new InputSourceButton();
        dpadDown.getValue = () => 0;
        const dpadLeft = new InputSourceButton();
        dpadLeft.getValue = () => 0;
        const dpadRight = new InputSourceButton();
        dpadRight.getValue = () => 0;
        this._dpad = new InputSourceDpad({ up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight });

        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = () => 0;
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = () => 0;
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = () => 0;
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = () => 0;
        this._leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = () => 0;
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = () => 0;
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = () => 0;
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = () => 0;
        this._rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });

        this._buttonStart = new InputSourceButton();
        this._buttonStart.getValue = () => 0;
    }
}
