import { TouchCallback } from 'pal/input';
import { TEST } from 'internal:constants';
import { systemInfo } from 'pal/system-info';
import { screenAdapter } from 'pal/screen-adapter';
import { Rect, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { Touch, EventTouch } from '../../../cocos/input/types';
import { touchManager } from '../touch-manager';
import { macro } from '../../../cocos/core/platform/macro';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { Feature } from '../../system-info/enum-type';

export class TouchInputSource {
    private _canvas?: HTMLCanvasElement;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        if (systemInfo.hasFeature(Feature.INPUT_TOUCH)) {
            this._canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            if (!this._canvas && !TEST) {
                console.warn('failed to access canvas');
            }
            this._registerEvent();
        }
    }

    private _registerEvent () {
        // IDEA: need to register on window ?
        this._canvas?.addEventListener('touchstart', this._createCallback(InputEventType.TOUCH_START));
        this._canvas?.addEventListener('touchmove', this._createCallback(InputEventType.TOUCH_MOVE));
        this._canvas?.addEventListener('touchend', this._createCallback(InputEventType.TOUCH_END));
        this._canvas?.addEventListener('touchcancel', this._createCallback(InputEventType.TOUCH_CANCEL));
    }

    private _createCallback (eventType: InputEventType) {
        return (event: TouchEvent) => {
            const canvasRect = this._getCanvasRect();
            const handleTouches: Touch[] = [];
            const length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                const changedTouch = event.changedTouches[i];
                const touchID = changedTouch.identifier;
                if (touchID === null) {
                    continue;
                }
                const location = this._getLocation(changedTouch, canvasRect);
                const touch = touchManager.getTouch(touchID, location.x, location.y);
                if (!touch) {
                    continue;
                }
                if (eventType === InputEventType.TOUCH_END || eventType === InputEventType.TOUCH_CANCEL) {
                    touchManager.releaseTouch(touchID);
                }
                handleTouches.push(touch);
            }
            event.stopPropagation();
            if (event.target === this._canvas) {
                event.preventDefault();
            }
            if (eventType === InputEventType.TOUCH_START) {
                this._canvas?.focus();
            }
            if (handleTouches.length > 0) {
                const eventTouch = new EventTouch(handleTouches, false, eventType,
                    macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
                this._eventTarget.emit(eventType, eventTouch);
            }
        };
    }

    private _getCanvasRect (): Rect {
        const canvas = this._canvas;
        const box = canvas?.getBoundingClientRect();
        if (box) {
            return new Rect(box.x, box.y, box.width, box.height);
        }
        return new Rect(0, 0, 0, 0);
    }

    private _getLocation (touch: globalThis.Touch, canvasRect: Rect): Vec2 {
        let x = touch.clientX - canvasRect.x;
        let y = canvasRect.y + canvasRect.height - touch.clientY;
        if (screenAdapter.isFrameRotated) {
            const tmp = x;
            x = canvasRect.height - y;
            y = tmp;
        }
        const dpr = screenAdapter.devicePixelRatio;
        x *= dpr;
        y *= dpr;
        return new Vec2(x, y);
    }

    public on (eventType: InputEventType, callback: TouchCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
