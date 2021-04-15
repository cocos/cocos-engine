import { TouchCallback, TouchData, TouchInputEvent } from 'pal/input';
import { Rect, Vec2 }from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventTouch } from '../../../cocos/core/platform/event-manager/events';

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
        this._canvas?.addEventListener('touchstart', this._createCallback(EventTouch.BEGAN));
        this._canvas?.addEventListener('touchmove', this._createCallback(EventTouch.MOVED));
        this._canvas?.addEventListener('touchend', this._createCallback(EventTouch.ENDED));
        this._canvas?.addEventListener('touchcancel', this._createCallback(EventTouch.CANCELLED));
    }

    private _createCallback (eventType: number) {
        return (event: TouchEvent) => {
            let canvasRect = this._getCanvasRect();
            let touchDataList: TouchData[] = [];
            let length = event.changedTouches.length;
            for (let i = 0; i < length; ++i) {
                let touch = event.changedTouches[i];
                let location = this._getLocation(touch);
                let touchData: TouchData = {
                    identifier: touch.identifier,
                    x: location.x - canvasRect.x,
                    y: canvasRect.y + canvasRect.height - location.y,
                    force: touch.force,
                };
                touchDataList.push(touchData);
            }
            let inputEvent: TouchInputEvent = {
                type: eventType,
                changedTouches: touchDataList,
                timestamp: performance.now(),
            };
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(eventType.toString(), inputEvent);
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

    public onStart(cb: TouchCallback) {
        this._eventTarget.on(EventTouch.BEGAN.toString(), cb);
    }
    public onMove(cb: TouchCallback) {
        this._eventTarget.on(EventTouch.MOVED.toString(), cb);
    }
    public onEnd(cb: TouchCallback) {
        this._eventTarget.on(EventTouch.ENDED.toString(), cb);
    }
    public onCancel(cb: TouchCallback) {
        this._eventTarget.on(EventTouch.CANCELLED.toString(), cb);
    }
}