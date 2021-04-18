import { TouchCallback, TouchData, TouchInputEvent } from 'pal/input';
import { Rect, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventTouch } from '../../../cocos/core/platform/event-manager/events';
import { legacyCC } from '../../../cocos/core/global-exports';
import { system } from 'pal/system';

export class TouchInputSource {
    public support: boolean;
    private _canvas?: HTMLCanvasElement;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = true;
        this._canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        // TODO: init canvas in input root
        if (!this._canvas) {
            console.warn('failed to access canvas');
        }
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onTouchStart = this._createCallback(EventTouch.BEGAN);
        jsb.onTouchMove = this._createCallback(EventTouch.MOVED);
        jsb.onTouchEnd = this._createCallback(EventTouch.ENDED);
        jsb.onTouchCancel = this._createCallback(EventTouch.CANCELLED);
    }

    private _createCallback (eventType: number) {
        return (touchList: TouchList) => {
            const touchDataList: TouchData[] = [];
            const length = touchList.length;
            const viewSize = system.getViewSize();
            for (let i = 0; i < length; ++i) {
                const touch = touchList[i];
                const location = this._getLocation(touch);
                let x = location.x;
                let y = viewSize.height - location.y;
                const touchData: TouchData = {
                    identifier: touch.identifier,
                    x,
                    y,
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
