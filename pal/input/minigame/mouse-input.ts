import { MouseCallback } from 'pal/input';
import { MouseEventData, MouseWheelEventData, minigame } from 'pal/minigame';
import { screenAdapter } from 'pal/screen-adapter';
import { SystemEvent } from '../../../cocos/input';
import { Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { EventMouse, SystemEventType } from '../../../cocos/input/types';
import { legacyCC } from '../../../cocos/core/global-exports';

export class MouseInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();
    private _isPressed = false;
    private _preMousePos: Vec2 = new Vec2();

    constructor () {
        this.support = typeof minigame.wx === 'object' && typeof minigame.wx.onMouseDown !== 'undefined';
        if (this.support) {
            this._registerEvent();
        }
    }

    private _getLocation (event: MouseEventData): Vec2 {
        const windowSize = screenAdapter.windowSize;
        let x = event.x;
        let y = windowSize.height - event.y;
        // TODO: should not call engine API
        const view = legacyCC.view;
        const dpr = view._devicePixelRatio;
        x *= dpr;
        y *= dpr;
        return new Vec2(x, y);
    }

    private _registerEvent () {
        minigame.wx?.onMouseDown?.(this._createCallback(SystemEventType.MOUSE_DOWN));
        minigame.wx?.onMouseMove?.(this._createCallback(SystemEventType.MOUSE_MOVE));
        minigame.wx?.onMouseUp?.(this._createCallback(SystemEventType.MOUSE_UP));
        minigame.wx?.onWheel?.(this._handleMouseWheel.bind(this));
    }

    private _createCallback (eventType: SystemEvent.EventType) {
        return (event: MouseEventData) => {
            const location = this._getLocation(event);
            let button = event.button;
            switch (eventType) {
            case SystemEventType.MOUSE_DOWN:
                this._isPressed = true;
                break;
            case SystemEventType.MOUSE_UP:
                this._isPressed = false;
                break;
            case SystemEventType.MOUSE_MOVE:
                if (!this._isPressed) {
                    button = EventMouse.BUTTON_MISSING;
                }
                break;
            default:
                break;
            }

            const eventMouse = new EventMouse(eventType, false, this._preMousePos);
            eventMouse.setLocation(location.x, location.y);
            eventMouse.setButton(button);
            eventMouse.movementX = location.x - this._preMousePos.x;
            eventMouse.movementY = this._preMousePos.y - location.y;

            // update previous mouse position.
            this._preMousePos.set(location.x, location.y);
            this._eventTarget.emit(eventType, eventMouse);
        };
    }

    private _handleMouseWheel (event: MouseWheelEventData) {
        const eventType = SystemEventType.MOUSE_WHEEL;
        const location = this._getLocation(event);
        const button = event.button;

        const eventMouse = new EventMouse(eventType, false, this._preMousePos);
        eventMouse.setLocation(location.x, location.y);
        eventMouse.setButton(button);
        eventMouse.movementX = location.x - this._preMousePos.x;
        eventMouse.movementY = this._preMousePos.y - location.y;

        eventMouse.setScrollData(event.deltaX, event.deltaY);
        // update previous mouse position.
        this._preMousePos.set(location.x, location.y);
        this._eventTarget.emit(SystemEventType.MOUSE_WHEEL, eventMouse);
    }

    onDown (cb: MouseCallback) {
        this._eventTarget.on(SystemEventType.MOUSE_DOWN, cb);
    }
    onMove (cb: MouseCallback) {
        this._eventTarget.on(SystemEventType.MOUSE_MOVE, cb);
    }
    onUp (cb: MouseCallback) {
        this._eventTarget.on(SystemEventType.MOUSE_UP, cb);
    }
    onWheel (cb: MouseCallback) {
        this._eventTarget.on(SystemEventType.MOUSE_WHEEL, cb);
    }
}
