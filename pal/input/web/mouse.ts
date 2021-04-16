import { MouseCallback, MouseInputEvent, MouseWheelCallback, MouseWheelInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { EventMouse } from '../../../cocos/core/platform/event-manager/events';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Rect, Vec2 } from '../../../cocos/core/math';

type MouseEventNames = 'mousedown' | 'mouseup' | 'mousemove' | 'wheel';

export class MouseInputSource {
    public support: boolean;
    private _canvas?: HTMLCanvasElement;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = !system.isMobile;
        this._canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        if (!this._canvas) {
            console.warn('failed to access canvas');
        }
        this._registerEvent();
    }

    private _getCanvasRect (): Rect {
        const canvas = this._canvas;
        const box = canvas?.getBoundingClientRect();
        if (box) {
            return new Rect(box.x, box.y, box.width, box.height);
        }
        return new Rect(0, 0, 0, 0);
    }

    private _getLocation (event: MouseEvent): Vec2 {
        return new Vec2(event.clientX, event.clientY);
    }

    private _registerEvent () {
        this._registerEventOnWindowAndCanvas('mousedown', this._createCallback(EventMouse.DOWN));
        this._registerEventOnWindowAndCanvas('mousemove', this._createCallback(EventMouse.MOVE));
        this._registerEventOnWindowAndCanvas('mouseup', this._createCallback(EventMouse.UP));
        // register wheel event
        this._canvas?.addEventListener('wheel', (event: WheelEvent) => {
            const canvasRect = this._getCanvasRect();
            const location = this._getLocation(event);
            const wheelSensitivityFactor = 5;
            const inputEvent: MouseWheelInputEvent = {
                type: EventMouse.SCROLL,
                x: location.x - canvasRect.x,
                y: canvasRect.y + canvasRect.height - location.y,
                button: event.button,  // TODO: what is the button when tracking mouse move ?
                deltaX: event.deltaX * wheelSensitivityFactor,
                deltaY: -event.deltaY * wheelSensitivityFactor,
                timestamp: performance.now(),
            };
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(EventMouse.SCROLL.toString(), inputEvent);
        });
    }

    _registerEventOnWindowAndCanvas (eventName: MouseEventNames, eventCb: (event: MouseEvent) => void) {
        window.addEventListener(eventName, eventCb);
        this._canvas?.addEventListener(eventName,  eventCb);
    }

    private _createCallback (eventType: number) {
        return (event: MouseEvent) => {
            const canvasRect = this._getCanvasRect();
            const location = this._getLocation(event);
            const inputEvent: MouseInputEvent = {
                type: eventType,
                x: location.x - canvasRect.x,
                y: canvasRect.y + canvasRect.height - location.y,
                button: (event).button,
                timestamp: performance.now(),
            };
            event.stopPropagation();
            event.preventDefault();
            // emit web mouse event
            this._eventTarget.emit(eventType.toString(), inputEvent);
        };
    }

    // TODO: eventType need to be typed as string

    onDown (cb: MouseCallback) {
        this._eventTarget.on(EventMouse.DOWN.toString(), cb);
    }
    onMove (cb: MouseCallback) {
        this._eventTarget.on(EventMouse.MOVE.toString(), cb);
    }
    onUp (cb: MouseCallback) {
        this._eventTarget.on(EventMouse.UP.toString(), cb);
    }
    onWheel (cb: MouseWheelCallback) {
        this._eventTarget.on(EventMouse.SCROLL.toString(), cb);
    }
}
