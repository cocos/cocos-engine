import { TouchCallback, TouchData, TouchInputEvent } from 'pal/input';
import { TEST } from 'internal:constants';
import { Rect, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { legacyCC } from '../../../cocos/core/global-exports';
import { SystemEvent } from '../../../cocos/input';
import { SystemEventType } from '../../../cocos/input/types';

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

    private _createCallback (eventType: SystemEvent.EventType) {
        return (event: any) => {
            const canvasRect = this._getCanvasRect();
            const touchDataList: TouchData[] = [];
            const length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                const touch = event.changedTouches[i];
                const location = this._getLocation(touch);
                let x = location.x - canvasRect.x;
                let y = canvasRect.y + canvasRect.height - location.y;
                // TODO: should not call engine API
                if (legacyCC.view._isRotated) {
                    const tmp = x;
                    x = canvasRect.height - y;
                    y = tmp;
                }

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
            event.stopPropagation();
            if (event.target === this._canvas) {
                event.preventDefault();
            }
            if (event.type === 'touchstart') {
                this._canvas?.focus();
            }
            this._eventTarget.emit(eventType, inputEvent);
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
