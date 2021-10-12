import { MouseCallback } from 'pal/input';
import { MouseEventData, MouseWheelEventData, minigame } from 'pal/minigame';
import { screenAdapter } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { EventMouse } from '../../../cocos/input/types';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { Feature } from '../../system-info/enum-type';

export class MouseInputSource {
    private _eventTarget: EventTarget = new EventTarget();
    private _isPressed = false;
    private _preMousePos: Vec2 = new Vec2();

    constructor () {
        if (systemInfo.hasFeature(Feature.EVENT_MOUSE)) {
            this._registerEvent();
        }
    }

    private _getLocation (event: MouseEventData): Vec2 {
        const windowSize = screenAdapter.windowSize;
        const dpr = screenAdapter.devicePixelRatio;
        const x = event.x * dpr;
        const y = windowSize.height - event.y * dpr;
        return new Vec2(x, y);
    }

    private _registerEvent () {
        minigame.wx?.onMouseDown?.(this._createCallback(InputEventType.MOUSE_DOWN));
        minigame.wx?.onMouseMove?.(this._createCallback(InputEventType.MOUSE_MOVE));
        minigame.wx?.onMouseUp?.(this._createCallback(InputEventType.MOUSE_UP));
        minigame.wx?.onWheel?.(this._handleMouseWheel.bind(this));
    }

    private _createCallback (eventType: InputEventType) {
        return (event: MouseEventData) => {
            const location = this._getLocation(event);
            let button = event.button;
            switch (eventType) {
            case InputEventType.MOUSE_DOWN:
                this._isPressed = true;
                break;
            case InputEventType.MOUSE_UP:
                this._isPressed = false;
                break;
            case InputEventType.MOUSE_MOVE:
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
        const eventType = InputEventType.MOUSE_WHEEL;
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
        this._eventTarget.emit(InputEventType.MOUSE_WHEEL, eventMouse);
    }

    public on (eventType: InputEventType, callback: MouseCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
