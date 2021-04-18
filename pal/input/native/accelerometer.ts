import { AccelerometerCallback, AccelerometerInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { SystemEventType } from '../../../cocos/core';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Orientation, OS } from '../../system/enum-type';

export class AccelerometerInputSource {
    public support: boolean;

    private _intervalInSeconds: number = 0.2;
    private _intervalId? :number;
    private _isEnabled: boolean = false;
    private _eventTarget: EventTarget = new  EventTarget();
    private _didAccelerateFunc: () => void;

    constructor () {
        let support = system.isMobile;
        this.support = support;
        this._didAccelerateFunc = this._didAccelerate.bind(this);
    }

    private _didAccelerate () {
        let deviceMotionValue = jsb.device.getDeviceMotionValue();
        let x = deviceMotionValue[3] * 0.1;
        let y = deviceMotionValue[4] * 0.1;
        let z = deviceMotionValue[5] * 0.1;

        // TODO: support window.orientation ?
        let orientation = system.getOrientation();
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
        if (system.os === OS.ANDROID) {
            x = -x;
            y = -y;
        }
        const accelerometer: AccelerometerInputEvent = {
            type: SystemEventType.DEVICEMOTION,
            x,
            y,
            z,
            timestamp: performance.now(),
        };

        this._eventTarget.emit(SystemEventType.DEVICEMOTION, accelerometer);
    }

    public start () {
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._intervalId = setInterval(this._didAccelerateFunc);
        jsb.device.setAccelerometerInterval(this._intervalInSeconds);
        jsb.device.setAccelerometerEnabled(true);
        this._isEnabled = true;
    }
    public stop () {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
        jsb.device.setAccelerometerEnabled(false);
        this._isEnabled = false;
    }
    public setInterval (interval: number) {
        jsb.device.setAccelerometerInterval(interval / 1000);
        if (this._isEnabled) {
            // restart accelerometer
            jsb.device.setAccelerometerEnabled(false);
            jsb.device.setAccelerometerEnabled(true);
        }
    }
    public onChange (cb: AccelerometerCallback) {
        this._eventTarget.on(SystemEventType.DEVICEMOTION, cb);
    }
}
