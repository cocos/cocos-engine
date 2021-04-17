import { TouchCallback, TouchData, TouchInputEvent } from 'pal/input';
import { Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventTouch } from '../../../cocos/core/platform/event-manager/events';
import { minigame } from 'pal/minigame';

export class TouchInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = true;
        this._registerEvent();
    }

    private _registerEvent () {
        minigame.onTouchStart(this._createCallback(EventTouch.BEGAN));
        minigame.onTouchMove(this._createCallback(EventTouch.MOVED));
        minigame.onTouchEnd(this._createCallback(EventTouch.ENDED));
        minigame.onTouchCancel(this._createCallback(EventTouch.CANCELLED));
    }

    private _createCallback (eventType: number) {
        return (event: TouchEvent) => {
            let sysInfo = minigame.getSystemInfoSync();
            const touchDataList: TouchData[] = [];
            const length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                const touch = event.changedTouches[i];
                const location = this._getLocation(touch);
                const touchData: TouchData = {
                    identifier: touch.identifier,
                    x: location.x,
                    y: sysInfo.screenHeight - location.y,
                    force: touch.force,
                };
                touchDataList.push(touchData);
            }
            const inputEvent: TouchInputEvent = {
                type: eventType,
                changedTouches: touchDataList,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(eventType.toString(), inputEvent);
        };
    }

    private _getLocation (event: Touch): Vec2 {
        return new Vec2(event.clientX, event.clientY);
    }

    public onStart (cb: TouchCallback) {
        this._eventTarget.on(EventTouch.BEGAN.toString(), cb);
    }
    public onMove (cb: TouchCallback) {
        this._eventTarget.on(EventTouch.MOVED.toString(), cb);
    }
    public onEnd (cb: TouchCallback) {
        this._eventTarget.on(EventTouch.ENDED.toString(), cb);
    }
    public onCancel (cb: TouchCallback) {
        this._eventTarget.on(EventTouch.CANCELLED.toString(), cb);
    }
}
