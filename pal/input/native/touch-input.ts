import { TouchCallback } from 'pal/input';
import { screenAdapter } from 'pal/screen-adapter';
import { Size, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { EventTouch, SystemEventType, Touch } from '../../../cocos/input/types';
import { touchManager } from '../touch-manager';
import { legacyCC } from '../../../cocos/core/global-exports';
import { macro } from '../../../cocos/core';

export class TouchInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = true;
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onTouchStart = this._createCallback(SystemEventType.TOUCH_START);
        jsb.onTouchMove = this._createCallback(SystemEventType.TOUCH_MOVE);
        jsb.onTouchEnd = this._createCallback(SystemEventType.TOUCH_END);
        jsb.onTouchCancel = this._createCallback(SystemEventType.TOUCH_CANCEL);
    }

    private _createCallback (eventType: SystemEventType) {
        return (changedTouches: TouchList) => {
            const handleTouches: Touch[] = [];
            const length = changedTouches.length;
            const windowSize = screenAdapter.windowSize;
            for (let i = 0; i < length; ++i) {
                const changedTouch = changedTouches[i];
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
