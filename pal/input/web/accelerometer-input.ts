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

import { AccelerometerCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { screenAdapter } from 'pal/screen-adapter';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType, OS } from '../../system-info/enum-type';
import { EventAcceleration, Acceleration } from '../../../cocos/input/types';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { warn } from '../../../cocos/core/platform/debug';

export class AccelerometerInputSource {
    private _intervalInMileSeconds = 200;
    private _accelTimer = 0;
    private _eventTarget: EventTarget = new  EventTarget();
    private _deviceEventName: 'devicemotion' |'deviceorientation';
    private _globalEventClass: typeof window.DeviceMotionEvent | typeof window.DeviceOrientationEvent;
    private _didAccelerateFunc: (event: DeviceMotionEvent | DeviceOrientationEvent) => void;

    constructor () {
        // init event name
        this._globalEventClass = window.DeviceMotionEvent || window.DeviceOrientationEvent;
        // TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
        if (systemInfo.browserType === BrowserType.MOBILE_QQ) {
            this._globalEventClass = window.DeviceOrientationEvent;
        }
        this._deviceEventName = this._globalEventClass === window.DeviceMotionEvent ? 'devicemotion' : 'deviceorientation';
        this._didAccelerateFunc  = this._didAccelerate.bind(this);
    }

    private _registerEvent (): void {
        this._accelTimer = performance.now();
        window.addEventListener(this._deviceEventName, this._didAccelerateFunc, false);
    }

    private _unregisterEvent (): void {
        this._accelTimer = 0;
        window.removeEventListener(this._deviceEventName, this._didAccelerateFunc, false);
    }

    private _didAccelerate (event: DeviceMotionEvent | DeviceOrientationEvent): void {
        const now = performance.now();
        if (now - this._accelTimer < this._intervalInMileSeconds) {
            return;
        }
        this._accelTimer = now;

        let x = 0;
        let y = 0;
        let z = 0;
        if (this._globalEventClass === window.DeviceMotionEvent) {
            const deviceMotionEvent = event as DeviceMotionEvent;
            const eventAcceleration = deviceMotionEvent.accelerationIncludingGravity;
            x = (eventAcceleration?.x || 0) * 0.1;
            y = (eventAcceleration?.y || 0) * 0.1;
            z = (eventAcceleration?.z || 0) * 0.1;
        } else {
            const deviceOrientationEvent = event as DeviceOrientationEvent;
            x = ((deviceOrientationEvent.gamma || 0) / 90) * 0.981;
            y = -((deviceOrientationEvent.beta || 0) / 90) * 0.981;
            z = ((deviceOrientationEvent.alpha || 0) / 90) * 0.981;
        }

        if (screenAdapter.isFrameRotated) {
            const tmp = x;
            x = -y;
            y = tmp;
        }

        // TODO: window.orientation is deprecated: https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation
        // try to use experimental screen.orientation: https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
        const PORTRAIT = 0;
        const LANDSCAPE_LEFT = -90;
        const PORTRAIT_UPSIDE_DOWN = 180;
        const LANDSCAPE_RIGHT = 90;
        const tmpX = x;
        if (window.orientation === LANDSCAPE_RIGHT) {
            x = -y;
            y = tmpX;
        } else if (window.orientation === LANDSCAPE_LEFT) {
            x = y;
            y = -tmpX;
        } else if (window.orientation === PORTRAIT_UPSIDE_DOWN) {
            x = -x;
            y = -y;
        }

        // fix android acc values are opposite
        if (systemInfo.os === OS.ANDROID
            && systemInfo.browserType !== BrowserType.MOBILE_QQ) {
            x = -x;
            y = -y;
        }
        const timestamp = performance.now();
        const acceleration = new Acceleration(x, y, z, timestamp);
        const eventAcceleration = new EventAcceleration(acceleration);
        this._eventTarget.emit(InputEventType.DEVICEMOTION, eventAcceleration);
    }

    public start (): void {
        // for iOS 13+, safari
        // NOTE: since TS 4.4, `requestPermission` is not defined in class DeviceMotionEvent in `lib.dom.d.ts`, this should be a breaking change in TS.
        // Accessing the `requestPermission` would emit a type error, so we assert `DeviceMotionEvent` as any type to skip the TS type checking.
        if (window.DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            (DeviceMotionEvent as any).requestPermission().then((response) => {
                if (response === 'granted') {
                    this._registerEvent();
                }
            }).catch((e) => { warn(e); });
        } else {
            this._registerEvent();
        }
    }
    public stop (): void {
        this._unregisterEvent();
    }
    public setInterval (intervalInMileSeconds: number): void {
        this._intervalInMileSeconds = intervalInMileSeconds;
    }
    public on (eventType: InputEventType, callback: AccelerometerCallback, target?: any): void {
        this._eventTarget.on(eventType, callback, target);
    }
}
