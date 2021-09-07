import { TouchCallback, TouchData, TouchInputEvent } from 'pal/input';
import { minigame } from 'pal/minigame';
import { Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { SystemEvent } from '../../../cocos/input';
import { SystemEventType } from '../../../cocos/input/types';

export class TouchInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = true;
        this._registerEvent();
    }

    private _registerEvent () {
        minigame.onTouchStart(this._createCallback(SystemEventType.TOUCH_START));
        minigame.onTouchMove(this._createCallback(SystemEventType.TOUCH_MOVE));
        minigame.onTouchEnd(this._createCallback(SystemEventType.TOUCH_END));
        minigame.onTouchCancel(this._createCallback(SystemEventType.TOUCH_CANCEL));
    }

    private _createCallback (eventType: SystemEvent.EventType) {
        return (event: any) => {
            const sysInfo = minigame.getSystemInfoSync();
            const touchDataList: TouchData[] = [];
            const length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                const touch = event.changedTouches[i];
                const location = this._getLocation(touch);
                const touchData: TouchData = {
                    identifier: touch.identifier,
                    x: location.x,
                    y: sysInfo.windowHeight - location.y,
                    force: touch.force,
                };
                touchDataList.push(touchData);
            }
            const inputEvent: TouchInputEvent = {
                type: eventType,
                changedTouches: touchDataList,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(eventType, inputEvent);
        };
    }

    private _getLocation (event: Touch): Vec2 {
        return new Vec2(event.clientX, event.clientY);
    }

    public onStart (cb: TouchCallback) {
        this._eventTarget.on(SystemEventType.TOUCH_START, cb);
    }
    public onMove (cb: TouchCallback) {
        this._eventTarget.on(SystemEventType.TOUCH_MOVE, cb);
    }
    public onEnd (cb: TouchCallback) {
        this._eventTarget.on(SystemEventType.TOUCH_END, cb);
    }
    public onCancel (cb: TouchCallback) {
        this._eventTarget.on(SystemEventType.TOUCH_CANCEL, cb);
    }
}
