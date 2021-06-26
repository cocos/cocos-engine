import { MouseCallback, MouseInputEvent, MouseWheelCallback, MouseWheelInputEvent } from 'pal/input';
import { MouseEventData, MouseWheelEventData, minigame } from 'pal/minigame';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { MouseEvent } from '../../../cocos/core/platform/event-manager/event-enum';

export class MouseInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();
    private _isPressed = false;

    constructor () {
        this.support = typeof minigame.wx === 'object' && typeof minigame.wx.onMouseDown !== 'undefined';
        if (this.support) {
            this._registerEvent();
        }
    }

    private _registerEvent () {
        minigame.wx?.onMouseDown?.(this._createCallback(MouseEvent.MOUSE_DOWN));
        minigame.wx?.onMouseMove?.(this._createCallback(MouseEvent.MOUSE_MOVE));
        minigame.wx?.onMouseUp?.(this._createCallback(MouseEvent.MOUSE_UP));
        minigame.wx?.onWheel?.((event: MouseWheelEventData) => {
            const sysInfo = minigame.getSystemInfoSync();
            const inputEvent: MouseWheelInputEvent = {
                type: MouseEvent.MOUSE_WHEEL,
                x: event.x,
                y: sysInfo.screenHeight - event.y,
                button: event.button,
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                timestamp: performance.now(),
            };
                // emit web mouse event
            this._eventTarget.emit(MouseEvent.MOUSE_WHEEL, inputEvent);
        });
    }

    private _createCallback (eventType: MouseEvent) {
        return (event: MouseEventData) => {
            const sysInfo = minigame.getSystemInfoSync();
            let button = event.button;
            switch (eventType) {
            case MouseEvent.MOUSE_DOWN:
                this._isPressed = true;
                break;
            case MouseEvent.MOUSE_UP:
                this._isPressed = false;
                break;
            case MouseEvent.MOUSE_MOVE:
                if (!this._isPressed) {
                    button = -1;  // TODO: should not access EventMouse.BUTTON_MISSING, need a button enum type
                }
                break;
            default:
                break;
            }
            const inputEvent: MouseInputEvent = {
                type: eventType,
                x: event.x,
                y: sysInfo.screenHeight - event.y,
                button,
                timestamp: performance.now(),
            };
            // emit web mouse event
            this._eventTarget.emit(eventType, inputEvent);
        };
    }

    onDown (cb: MouseCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_DOWN, cb);
    }
    onMove (cb: MouseCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_MOVE, cb);
    }
    onUp (cb: MouseCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_UP, cb);
    }
    onWheel (cb: MouseWheelCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_WHEEL, cb);
    }
}
