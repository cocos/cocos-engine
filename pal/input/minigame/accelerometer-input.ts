import { AccelerometerCallback } from 'pal/input';
import { minigame, AccelerometerIntervalMode } from 'pal/minigame';
import { Acceleration, EventAcceleration } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export class AccelerometerInputSource {
    private _isStarted = false;
    private _accelMode: AccelerometerIntervalMode = 'normal';
    private _eventTarget: EventTarget = new  EventTarget();
    private _didAccelerateFunc: (event: AccelerometerData) => void;

    constructor () {
        this._didAccelerateFunc  = this._didAccelerate.bind(this);
    }

    private _registerEvent () {
        minigame.onAccelerometerChange(this._didAccelerateFunc);
    }

    private _unregisterEvent () {
        minigame.offAccelerometerChange(this._didAccelerateFunc);
    }

    private _didAccelerate (event: AccelerometerData) {
        const timestamp = performance.now();
        const acceleration = new Acceleration(event.x, event.y, event.z, timestamp);
        const eventAcceleration = new EventAcceleration(acceleration);
        this._eventTarget.emit(InputEventType.DEVICEMOTION, eventAcceleration);
    }

    public start () {
        this._registerEvent();
        minigame.startAccelerometer({
            interval: this._accelMode,
            success: () => {
                this._isStarted = true;
            },
        });
    }
    public stop () {
        minigame.stopAccelerometer({
            success: () => {
                this._isStarted = false;
            },
            fail () {
                console.error('failed to stop accelerometer');
            },
        });
        this._unregisterEvent();
    }
    public setInterval (intervalInMileseconds: number) {
        // reference: https://developers.weixin.qq.com/minigame/dev/api/device/accelerometer/wx.startAccelerometer.html
        if (intervalInMileseconds >= 200) {
            this._accelMode = 'normal';
        } else if (intervalInMileseconds >= 60) {
            this._accelMode = 'ui';
        } else {
            this._accelMode = 'game';
        }
        if (this._isStarted) {
            // restart accelerometer
            this.stop();
            this.start();
        }
    }
    public on (eventType: InputEventType, callback: AccelerometerCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
