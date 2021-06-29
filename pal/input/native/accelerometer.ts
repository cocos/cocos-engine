import { AccelerometerCallback, AccelerometerInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Orientation, OS } from '../../system/enum-type';
import { SystemEvent } from '../../../cocos/core/platform/event-manager/system-event';

export class AccelerometerInputSource {
    public support: boolean;

    private _intervalInSeconds = 0.2;
    private _intervalId? :number;
    private _isEnabled = false;
    private _eventTarget: EventTarget = new  EventTarget();
    private _didAccelerateFunc: () => void;

    constructor () {
        const support = system.isMobile;
        this.support = support;
        this._didAccelerateFunc = this._didAccelerate.bind(this);
    }

    private _didAccelerate () {
        const deviceMotionValue = jsb.device.getDeviceMotionValue();
        let x = deviceMotionValue[3] * 0.1;
        let y = deviceMotionValue[4] * 0.1;
        const z = deviceMotionValue[5] * 0.1;

        const orientation = system.getOrientation();
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
        if (system.os === OS.ANDROID || system.os === OS.OHOS) {
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
        if (this._intervalId) {
            clearInterval(this._intervalId);
        }
        this._intervalId = setInterval(this._didAccelerateFunc, this._intervalInSeconds * 1000);
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
    public setInterval (intervalInMileseconds: number) {
        this._intervalInSeconds = intervalInMileseconds / 1000;
        jsb.device.setAccelerometerInterval(this._intervalInSeconds);
        if (this._isEnabled) {
            // restart accelerometer
            jsb.device.setAccelerometerEnabled(false);
            jsb.device.setAccelerometerEnabled(true);
        }
    }
    public onChange (cb: AccelerometerCallback) {
        this._eventTarget.on(SystemEvent.EventType.DEVICEMOTION, cb);
    }
}
