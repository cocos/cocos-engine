import { MouseCallback, MouseInputEvent, MouseWheelCallback, MouseWheelInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { EventMouse } from '../../../cocos/core/platform/event-manager/events';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Vec2 } from '../../../cocos/core/math';

export class MouseInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = !system.isMobile;
        this._registerEvent();
    }

    private _getLocation (event: jsb.MouseEvent): Vec2 {
        return new Vec2(event.x, event.y);
    }

    private _registerEvent () {
        jsb.onMouseDown = this._createCallback(EventMouse.DOWN);
        jsb.onMouseMove = this._createCallback(EventMouse.MOVE);
        jsb.onMouseUp =  this._createCallback(EventMouse.UP);
        jsb.onMouseWheel = (event: jsb.MouseWheelEvent) => {
            const location = this._getLocation(event);
            const viewSize = system.getViewSize();
            const matchStandardFactor = 120;
            const inputEvent: MouseWheelInputEvent = {
                type: EventMouse.SCROLL,
                x: location.x,
                y: viewSize.height - location.y,
                button: event.button,
                deltaX: event.wheelDeltaX * matchStandardFactor, // scale up to match the web interface
                deltaY: event.wheelDeltaY * matchStandardFactor,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(EventMouse.SCROLL.toString(), inputEvent);
        };
    }

    private _createCallback (eventType: number) {
        return (event: jsb.MouseEvent) => {
            const location = this._getLocation(event);
            const viewSize = system.getViewSize();
            const inputEvent: MouseInputEvent = {
                type: eventType,
                x: location.x,
                y: viewSize.height - location.y,
                button: event.button,
                timestamp: performance.now(),
            };
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
