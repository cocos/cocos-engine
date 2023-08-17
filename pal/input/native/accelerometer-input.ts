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

import { systemInfo } from 'pal/system-info';
import { screenAdapter } from 'pal/screen-adapter';
import { EventTarget } from '../../../cocos/core/event';
import { OS } from '../../system-info/enum-type';
import { Orientation } from '../../screen-adapter/enum-type';
import { Acceleration, EventAcceleration } from '../../../cocos/input/types';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export type AccelerometerCallback = (res: EventAcceleration) => void;

export class AccelerometerInputSource {
    private _intervalInSeconds = 0.2;
    private _intervalId? :number;
    private _isEnabled = false;
    private _eventTarget: EventTarget = new  EventTarget();
    private _didAccelerateFunc: () => void;

    constructor () {
        this._didAccelerateFunc = this._didAccelerate.bind(this);
    }

    private _didAccelerate (): void {
        const deviceMotionValue = jsb.device.getDeviceMotionValue();
        let x = deviceMotionValue[3] * 0.1;
        let y = deviceMotionValue[4] * 0.1;
        const z = deviceMotionValue[5] * 0.1;

        const orientation = screenAdapter.orientation;
        const tmpX = x;
        if (orientation === Orientation.LANDSCAPE_RIGHT) {
            x = -y;
            y = tmpX;
        } else if (orientation === Orientation.LANDSCAPE_LEFT) {
            x = y;
            y = -tmpX;
        } else if (orientation === Orientation.PORTRAIT_UPSIDE_DOWN) {
            x = -x;
            y = -y;
        }

        // fix android acc values are opposite
        if (systemInfo.os === OS.ANDROID || systemInfo.os === OS.OHOS || systemInfo.os === OS.OPENHARMONY) {
            x = -x;
            y = -y;
        }

        const timestamp = performance.now();
        const acceleration = new Acceleration(x, y, z, timestamp);
        const eventAcceleration = new EventAcceleration(acceleration);
        this._eventTarget.emit(InputEventType.DEVICEMOTION, eventAcceleration);
    }

    public start (): void {
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._intervalId = setInterval(this._didAccelerateFunc, this._intervalInSeconds * 1000);
        jsb.device.setAccelerometerInterval(this._intervalInSeconds);
        jsb.device.setAccelerometerEnabled(true);
        this._isEnabled = true;
    }
    public stop (): void {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
        jsb.device.setAccelerometerEnabled(false);
        this._isEnabled = false;
    }
    public setInterval (intervalInMileseconds: number): void {
        this._intervalInSeconds = intervalInMileseconds / 1000;
        jsb.device.setAccelerometerInterval(this._intervalInSeconds);
        if (this._isEnabled) {
            // restart accelerometer
            jsb.device.setAccelerometerEnabled(false);
            jsb.device.setAccelerometerEnabled(true);
        }
    }
    public on (eventType: InputEventType, callback: AccelerometerCallback, target?: any): void {
        this._eventTarget.on(eventType, callback, target);
    }
}
