/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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

export type GamepadCallback = (res: EventGamepad) => void;

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
        return 0;
    }
    public get connected (): boolean {
        return false;
    }

    private static _eventTarget: EventTarget = new EventTarget();

    private declare _buttonNorth: InputSourceButton;
    private declare _buttonEast: InputSourceButton;
    private declare _buttonWest: InputSourceButton;
    private declare _buttonSouth: InputSourceButton;
    private declare _buttonL1: InputSourceButton;
    private declare _buttonL2: InputSourceButton;
    private declare _buttonL3: InputSourceButton;
    private declare _buttonR1: InputSourceButton;
    private declare _buttonR2: InputSourceButton;
    private declare _buttonR3: InputSourceButton;
    // private declare buttonTouchPad: InputSourceButton;
    // private declare buttonHome: InputSourceButton;
    private declare _buttonShare: InputSourceButton;
    private declare _buttonOptions: InputSourceButton;
    private declare _dpad: InputSourceDpad;
    private declare _leftStick: InputSourceStick;
    private declare _rightStick: InputSourceStick;
    private declare _buttonStart: InputSourceButton;
    private declare _gripLeft: InputSourceButton;
    private declare _gripRight: InputSourceButton;
    private declare _handLeftPosition: InputSourcePosition;
    private declare _handLeftOrientation: InputSourceOrientation;
    private declare _handRightPosition: InputSourcePosition;
    private declare _handRightOrientation: InputSourceOrientation;
    private declare _aimLeftPosition: InputSourcePosition;
    private declare _aimLeftOrientation: InputSourceOrientation;
    private declare _aimRightPosition: InputSourcePosition;
    private declare _aimRightOrientation: InputSourceOrientation;


    constructor (deviceId: number) {

    }

    /**
     * @engineInternal
     */
    public static _init (): void {
        if (!systemInfo.hasFeature(Feature.EVENT_GAMEPAD)) {
            return;
        }

    }

    /**
     * @engineInternal
     */
    public static _on (eventType: InputEventType, cb: GamepadCallback, target?: any): void {
        GamepadInputDevice._eventTarget.on(eventType, cb, target);
    }




}
