import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { SystemEventType } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';

export class KeyboardInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = !system.isMobile;
        this._registerEvent();
    }

    private _registerEvent () {
        window.addEventListener('keydown', this._createCallback(SystemEventType.KEY_DOWN));
        window.addEventListener('keyup', this._createCallback(SystemEventType.KEY_UP));
    }

    private _createCallback (eventType: string) {
        return (event: KeyboardEvent) => {
            const inputEvent: KeyboardInputEvent = {
                type: eventType,
                code: event.keyCode,  // TODO: keyCode is deprecated on Web standard
                timestamp: performance.now(),
            };
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(eventType, inputEvent);
        };
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEY_DOWN, cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEY_UP, cb);
    }
}
