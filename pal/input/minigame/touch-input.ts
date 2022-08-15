import { TouchCallback } from 'pal/input';
import { minigame } from 'pal/minigame';
import { screenAdapter } from 'pal/screen-adapter';
import { ALIPAY, VIVO } from 'internal:constants';
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
        minigame.onTouchStart(this._createCallback(InputEventType.TOUCH_START));
        minigame.onTouchMove(this._createCallback(InputEventType.TOUCH_MOVE));
        minigame.onTouchEnd(this._createCallback(InputEventType.TOUCH_END));
        minigame.onTouchCancel(this._createCallback(InputEventType.TOUCH_CANCEL));
    }

    private _createCallback (eventType: InputEventType) {
        return (event: any) => {
            const handleTouches: Touch[] = [];
            const windowSize = screenAdapter.windowSize;
            const dpr = screenAdapter.devicePixelRatio;
            const length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                const changedTouch = event.changedTouches[i];
                const touchID = changedTouch.identifier;
                if (touchID === null) {
                    continue;
                }
                const location = this._getLocation(changedTouch, windowSize, dpr);
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

    private _getLocation (touch: globalThis.Touch, windowSize: Size, dpr: number): Vec2 {
        if (ALIPAY) {
            // HACK: on Alipay platform,
            // the physical screen size = systemInfo.screenSize * dpr = systemInfo.windowSize * dpr * dpr
            // the location of touch event is in systemInfo.windowSize space
            const x = touch.clientX * dpr * dpr;
            const y = windowSize.height - touch.clientY * dpr * dpr;
            return new Vec2(x, y);
        }
        const x = touch.clientX * dpr;
        const y = windowSize.height - touch.clientY * dpr;
        return new Vec2(x, y);
    }

    public on (eventType: InputEventType, callback: TouchCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
