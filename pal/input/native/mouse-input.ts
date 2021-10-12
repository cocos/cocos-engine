import { MouseCallback } from 'pal/input';
import { screenAdapter } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { EventMouse } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { Vec2 } from '../../../cocos/core/math';
import { legacyCC } from '../../../cocos/core/global-exports';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export class MouseInputSource {
    private _eventTarget: EventTarget = new EventTarget();
    private _preMousePos: Vec2 = new Vec2();
    private _isPressed = false;

    constructor () {
        this._registerEvent();
    }

    private _getLocation (event: jsb.MouseEvent): Vec2 {
        const windowSize = screenAdapter.windowSize;
        const x = event.x;
        const y = windowSize.height - event.y;
        return new Vec2(x, y);
    }

    private _registerEvent () {
        jsb.onMouseDown = this._createCallback(InputEventType.MOUSE_DOWN);
        jsb.onMouseMove = this._createCallback(InputEventType.MOUSE_MOVE);
        jsb.onMouseUp =  this._createCallback(InputEventType.MOUSE_UP);
        jsb.onMouseWheel = this._handleMouseWheel.bind(this);
    }

    private _createCallback (eventType: InputEventType) {
        return (mouseEvent: jsb.MouseEvent) => {
            const location = this._getLocation(mouseEvent);
            let button = mouseEvent.button;
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

    private _handleMouseWheel (mouseEvent: jsb.MouseWheelEvent) {
        const eventType = InputEventType.MOUSE_WHEEL;
        const location = this._getLocation(mouseEvent);
        const button = mouseEvent.button;

        const eventMouse = new EventMouse(eventType, false, this._preMousePos);
        eventMouse.setLocation(location.x, location.y);
        eventMouse.setButton(button);
        eventMouse.movementX = location.x - this._preMousePos.x;
        eventMouse.movementY = this._preMousePos.y - location.y;

        const matchStandardFactor = 120;
        eventMouse.setScrollData(mouseEvent.wheelDeltaX * matchStandardFactor, mouseEvent.wheelDeltaY * matchStandardFactor);
        // update previous mouse position.
        this._preMousePos.set(location.x, location.y);
        this._eventTarget.emit(eventType, eventMouse);
    }

    public on (eventType: InputEventType, callback: MouseCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
