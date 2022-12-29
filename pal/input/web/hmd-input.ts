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

import { HMDCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

export class HMDInputDevice {
    public get viewLeftPosition () { return this._viewLeftPosition; }
    public get viewLeftOrientation () { return this._viewLeftOrientation; }
    public get viewRightPosition () { return this._viewRightPosition; }
    public get viewRightOrientation () { return this._viewRightOrientation; }
    public get headMiddlePosition () { return this._headMiddlePosition; }
    public get headMiddleOrientation () { return this._headMiddleOrientation; }

    private _eventTarget: EventTarget = new EventTarget();

    private _viewLeftPosition!: InputSourcePosition;
    private _viewLeftOrientation!: InputSourceOrientation;
    private _viewRightPosition!: InputSourcePosition;
    private _viewRightOrientation!: InputSourceOrientation;
    private _headMiddlePosition!: InputSourcePosition;
    private _headMiddleOrientation!: InputSourceOrientation;

    constructor () {
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HMDCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }

    private _initInputSource () {
        this._viewLeftPosition = new InputSourcePosition();
        this._viewLeftPosition.getValue = () => Vec3.ZERO;
        this._viewLeftOrientation = new InputSourceOrientation();
        this._viewLeftOrientation.getValue = () =>  Quat.IDENTITY;

        this._viewRightPosition = new InputSourcePosition();
        this._viewRightPosition.getValue = () => Vec3.ZERO;
        this._viewRightOrientation = new InputSourceOrientation();
        this._viewRightOrientation.getValue = () =>  Quat.IDENTITY;

        this._headMiddlePosition = new InputSourcePosition();
        this._headMiddlePosition.getValue = () => Vec3.ZERO;
        this._headMiddleOrientation = new InputSourceOrientation();
        this._headMiddleOrientation.getValue = () =>  Quat.IDENTITY;
    }
}
