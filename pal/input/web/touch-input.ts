import { TouchCallback } from 'pal/input';
import { TEST } from 'internal:constants';
import { Rect, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { legacyCC } from '../../../cocos/core/global-exports';
import { SystemEventType, Touch, EventTouch } from '../../../cocos/input/types';
import { touchManager } from '../touch-manager';
import { macro } from '../../../cocos/core/platform/macro';

export class TouchInputSource {
    public support: boolean;
    private _canvas?: HTMLCanvasElement;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = (document.documentElement.ontouchstart !== undefined || document.ontouchstart !== undefined || navigator.msPointerEnabled);
        if (this.support) {
            this._canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            if (!this._canvas && !TEST) {
                console.warn('failed to access canvas');
            }
            this._registerEvent();
        }
    }

    private _registerEvent () {
        // IDEA: need to register on window ?
        this._canvas?.addEventListener('touchstart', this._createCallback(SystemEventType.TOUCH_START));
        this._canvas?.addEventListener('touchmove', this._createCallback(SystemEventType.TOUCH_MOVE));
        this._canvas?.addEventListener('touchend', this._createCallback(SystemEventType.TOUCH_END));
        this._canvas?.addEventListener('touchcancel', this._createCallback(SystemEventType.TOUCH_CANCEL));
    }

    private _createCallback (eventType: SystemEventType) {
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
                if (eventType === SystemEventType.TOUCH_END || eventType === SystemEventType.TOUCH_CANCEL) {
                    touchManager.releaseTouch(touchID);
                }
                handleTouches.push(touch);
                if (!macro.ENABLE_MULTI_TOUCH) {
                    break;
                }
            }
            event.stopPropagation();
            if (event.target === this._canvas) {
                event.preventDefault();
            }
            if (eventType === SystemEventType.TOUCH_START) {
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
        // TODO: should not call engine API
        const view = legacyCC.view;
        if (view._isRotated) {
            const tmp = x;
            x = canvasRect.height - y;
            y = tmp;
        }
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
