import { TouchCallback } from 'pal/input';
import { minigame } from 'pal/minigame';
import { screenAdapter } from 'pal/screen-adapter';
import { Size, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { SystemEvent } from '../../../cocos/input';
import { EventTouch, SystemEventType, Touch } from '../../../cocos/input/types';
import { legacyCC } from '../../../cocos/core/global-exports';
import { touchManager } from '../touch-manager';
import { macro } from '../../../cocos/core';

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
            const handleTouches: Touch[] = [];
            const windowSize = screenAdapter.windowSize;
            const length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                const changedTouch = event.changedTouches[i];
                const touchID = changedTouch.identifier;
                if (touchID === null) {
                    continue;
                }
                const location = this._getLocation(changedTouch, windowSize);
                const touch = touchManager.getTouch(touchID, location.x, location.y);
                if (!touch) {
                    continue;
                }
                if (eventType === SystemEventType.TOUCH_END || eventType === SystemEventType.TOUCH_CANCEL) {
                    touchManager.releaseTouch(touchID);
                }
                handleTouches.push(touch);
                if (!macro.ENABLE_MULTI_TOUCH) {
                    break;
                }
            }
            if (handleTouches.length > 0) {
                const eventTouch = new EventTouch(handleTouches, false, eventType,
                    macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
                this._eventTarget.emit(eventType, eventTouch);
            }
        };
    }

    private _getLocation (touch: globalThis.Touch, windowSize: Size): Vec2 {
        let x = touch.clientX;
        let y = windowSize.height - touch.clientY;
        // TODO: should not call engine API
        const view = legacyCC.view;
        const dpr = view._devicePixelRatio;
        x *= dpr;
        y *= dpr;
        return new Vec2(x, y);
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
