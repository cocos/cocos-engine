import { TouchCallback } from 'pal/input';
import { screenAdapter } from 'pal/screen-adapter';
import { Size, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { EventTouch, Touch } from '../../../cocos/input/types';
import { touchManager } from '../touch-manager';
import { macro } from '../../../cocos/core/platform/macro';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export class TouchInputSource {
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onTouchStart = this._createCallback(InputEventType.TOUCH_START);
        jsb.onTouchMove = this._createCallback(InputEventType.TOUCH_MOVE);
        jsb.onTouchEnd = this._createCallback(InputEventType.TOUCH_END);
        jsb.onTouchCancel = this._createCallback(InputEventType.TOUCH_CANCEL);
    }

    private _createCallback (eventType: InputEventType) {
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
                if (eventType === InputEventType.TOUCH_END || eventType === InputEventType.TOUCH_CANCEL) {
                    touchManager.releaseTouch(touchID);
                }
                handleTouches.push(touch);
            }
            if (handleTouches.length > 0) {
                const eventTouch = new EventTouch(handleTouches, false, eventType,
                    macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
                this._eventTarget.emit(eventType, eventTouch);
            }
        };
    }

    private _getLocation (touch: globalThis.Touch, windowSize: Size): Vec2 {
        const dpr = screenAdapter.devicePixelRatio;
        const x = touch.clientX * dpr;
        const y = windowSize.height - touch.clientY * dpr;
        return new Vec2(x, y);
    }

    public on (eventType: InputEventType, callback: TouchCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
