import { MouseCallback, MouseInputEvent, MouseWheelCallback, MouseWheelInputEvent } from 'pal/input';
import { EventMouse } from '../../../cocos/core/platform/event-manager/events';
import { EventTarget } from '../../../cocos/core/event/event-target';

type MouseEventNames = 'mousedown' | 'mouseup' | 'mousemove' | 'wheel';

export class MouseInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = false;  // TODO: pc-wechat
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
