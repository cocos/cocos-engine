import { AccelerometerCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event';
import { BrowserType, OS } from '../../system-info/enum-type';
import { legacyCC } from '../../../cocos/core/global-exports';
import { EventAcceleration, Acceleration } from '../../../cocos/input/types';
import { InputEventType } from '../../../cocos/input/types/event-enum';

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

    private _registerEvent () {
        this._accelTimer = performance.now();
        window.addEventListener(this._deviceEventName, this._didAccelerateFunc, false);
    }

    private _unregisterEvent () {
        this._accelTimer = 0;
        window.removeEventListener(this._deviceEventName, this._didAccelerateFunc, false);
    }

    private _didAccelerate (event: DeviceMotionEvent | DeviceOrientationEvent) {
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

        // TODO: should not call engine API
        if (legacyCC.view._isRotated) {
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

    public start () {
        // for iOS 13+, safari
        if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then((response) => {
                if (response === 'granted') {
                    this._registerEvent();
                }
            }).catch((e) => {});
        } else {
            this._registerEvent();
        }
    }
    public stop () {
        this._unregisterEvent();
    }
    public setInterval (intervalInMileSeconds: number) {
        this._intervalInMileSeconds = intervalInMileSeconds;
    }
    public on (eventType: InputEventType, callback: AccelerometerCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
