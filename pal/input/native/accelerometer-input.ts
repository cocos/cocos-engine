import { AccelerometerCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { screenAdapter } from 'pal/screen-adapter';
import { EventTarget } from '../../../cocos/core/event';
import { OS } from '../../system-info/enum-type';
import { Orientation } from '../../screen-adapter/enum-type';
import { Acceleration, EventAcceleration } from '../../../cocos/input/types';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export class AccelerometerInputSource {
    public support: boolean;

    private _intervalInSeconds = 0.2;
    private _intervalId? :number;
    private _isEnabled = false;
    private _eventTarget: EventTarget = new  EventTarget();
    private _didAccelerateFunc: () => void;

    constructor () {
        const support = systemInfo.isMobile;
        this.support = support;
        this._didAccelerateFunc = this._didAccelerate.bind(this);
    }

    private _didAccelerate () {
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
        if (systemInfo.os === OS.ANDROID || systemInfo.os === OS.OHOS) {
            x = -x;
            y = -y;
        }

        const timestamp = performance.now();
        const acceleration = new Acceleration(x, y, z, timestamp);
        const eventAcceleration = new EventAcceleration(acceleration);
        this._eventTarget.emit(InputEventType.DEVICEMOTION, eventAcceleration);
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
    public on (eventType: InputEventType, callback: AccelerometerCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
