import { MouseCallback, MouseInputEvent, MouseWheelCallback, MouseWheelInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { SystemEventType } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Vec2 } from '../../../cocos/core/math';
import { SystemEvent } from '../../../cocos/core/platform/event-manager/system-event';

export class MouseInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();
    private _preMousePos: Vec2 = new Vec2();

    constructor () {
        this.support = !system.isMobile;
        this._registerEvent();
    }

    private _getLocation (event: jsb.MouseEvent): Vec2 {
        return new Vec2(event.x, event.y);
    }

    private _registerEvent () {
        jsb.onMouseDown = this._createCallback(SystemEventType.MOUSE_DOWN);
        jsb.onMouseMove = this._createCallback(SystemEventType.MOUSE_MOVE);
        jsb.onMouseUp =  this._createCallback(SystemEventType.MOUSE_UP);
        jsb.onMouseWheel = (event: jsb.MouseWheelEvent) => {
            const location = this._getLocation(event);
            const screenSize = system.getScreenSize();
            const matchStandardFactor = 120;
            const inputEvent: MouseWheelInputEvent = {
                type: SystemEventType.MOUSE_WHEEL,
                x: location.x,
                y: screenSize.height - location.y,
                button: event.button,
                deltaX: event.wheelDeltaX * matchStandardFactor, // scale up to match the web interface
                deltaY: event.wheelDeltaY * matchStandardFactor,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(SystemEventType.MOUSE_WHEEL, inputEvent);
        };
    }

    private _createCallback (eventType: SystemEvent.EventType) {
        return (event: jsb.MouseEvent) => {
            const location = this._getLocation(event);
            const screenSize = system.getScreenSize();
            const locationX = location.x;
            const locationY = screenSize.height - location.y;
            const inputEvent: MouseInputEvent = {
                type: eventType,
                x: locationX,
                y: locationY,
                movementX: locationX - this._preMousePos.x,
                movementY: this._preMousePos.y - locationY,
                button: event.button,
                timestamp: performance.now(),
            };
            // update previous mouse position.
            this._preMousePos.set(inputEvent.x, inputEvent.y);
            // emit web mouse event
            this._eventTarget.emit(eventType, inputEvent);
        };
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
    onWheel (cb: MouseWheelCallback) {
        this._eventTarget.on(SystemEventType.MOUSE_WHEEL, cb);
    }
}
