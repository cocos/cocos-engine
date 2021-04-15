import { AccelerometerCallback, AccelerometerInputEvent } from 'pal/input';
import { clamp01, SystemEventType } from '../../../cocos/core';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType } from '../../system/enum-type';
import { system } from '../../system/minigame/system';

export class AccelerometerInputSource {
    public support: boolean;

    private _accelInterval = 1 / 5;
    private _accelTimer = 0;
    private _eventTarget: EventTarget = new  EventTarget();
    private _deviceEventName: 'devicemotion' |'deviceorientation';
    private _globalEventClass: typeof window.DeviceMotionEvent | typeof window.DeviceOrientationEvent;
    private _didAccelerateFunc: (event: DeviceMotionEvent | DeviceOrientationEvent) => void;

    constructor () {
        this.support = true;

        // init event name
        this._globalEventClass = window.DeviceMotionEvent || window.DeviceOrientationEvent;
        // TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
        if (system.browserType === BrowserType.QQ) {
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
        let now = performance.now();
        if (now - this._accelTimer < this._accelInterval) {
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

        // TODO
        // if (legacyCC.view._isRotated) {
        //     const tmp = x;
        //     x = -y;
        //     y = tmp;
        // }

        let accelerometer: AccelerometerInputEvent = {
            type: SystemEventType.DEVICEMOTION,
            x, y, z,
            timestamp: performance.now(),
        };

        this._eventTarget.emit(SystemEventType.DEVICEMOTION, accelerometer);
        // const tmpX = mAcceleration.x;
        // if (window.orientation === LANDSCAPE_RIGHT) {
        //     mAcceleration.x = -mAcceleration.y;
        //     mAcceleration.y = tmpX;
        // } else if (window.orientation === LANDSCAPE_LEFT) {
        //     mAcceleration.x = mAcceleration.y;
        //     mAcceleration.y = -tmpX;
        // } else if (window.orientation === PORTRAIT_UPSIDE_DOWN) {
        //     mAcceleration.x = -mAcceleration.x;
        //     mAcceleration.y = -mAcceleration.y;
        // }
        // // fix android acc values are opposite
        // if (legacyCC.sys.os === legacyCC.sys.OS_ANDROID
        //     && legacyCC.sys.browserType !== legacyCC.sys.BROWSER_TYPE_MOBILE_QQ) {
        //     mAcceleration.x = -mAcceleration.x;
        //     mAcceleration.y = -mAcceleration.y;
        // }
    }

    public start() {
        this._registerEvent();
    }
    public stop() {
        this._unregisterEvent();
    }
    public setInterval (interval: number) {
        interval = clamp01(interval);
        this._accelInterval = interval;
    }
    public onChange(cb: AccelerometerCallback) {
        this._eventTarget.on(SystemEventType.DEVICEMOTION, cb);
    }
}