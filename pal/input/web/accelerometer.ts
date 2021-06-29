import { AccelerometerCallback, AccelerometerInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType, OS } from '../../system/enum-type';
import { legacyCC } from '../../../cocos/core/global-exports';
import { SystemEvent } from '../../../cocos/core/platform/event-manager/system-event';

export class AccelerometerInputSource {
    public support: boolean;

    private _intervalInMileseconds = 200;
    private _accelTimer = 0;
    private _eventTarget: EventTarget = new  EventTarget();
    private _deviceEventName: 'devicemotion' |'deviceorientation';
    private _globalEventClass: typeof window.DeviceMotionEvent | typeof window.DeviceOrientationEvent;
    private _didAccelerateFunc: (event: DeviceMotionEvent | DeviceOrientationEvent) => void;

    constructor () {
        this.support = (window.DeviceMotionEvent !== undefined || window.DeviceOrientationEvent !== undefined);

        // init event name
        this._globalEventClass = window.DeviceMotionEvent || window.DeviceOrientationEvent;
        // TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
        if (system.browserType === BrowserType.MOBILE_QQ) {
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
        if (now - this._accelTimer < this._intervalInMileseconds) {
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
        if (system.os === OS.ANDROID
            && system.browserType !== BrowserType.MOBILE_QQ) {
            x = -x;
            y = -y;
        }
        const accelerometer: AccelerometerInputEvent = {
            type: SystemEvent.EventType.DEVICEMOTION,
            x,
            y,
            z,
            timestamp: performance.now(),
        };

        this._eventTarget.emit(SystemEvent.EventType.DEVICEMOTION, accelerometer);
    }

    public start () {
        this._registerEvent();
    }
    public stop () {
        this._unregisterEvent();
    }
    public setInterval (intervalInMileseconds: number) {
        this._intervalInMileseconds = intervalInMileseconds;
    }
    public onChange (cb: AccelerometerCallback) {
        this._eventTarget.on(SystemEvent.EventType.DEVICEMOTION, cb);
    }
}
