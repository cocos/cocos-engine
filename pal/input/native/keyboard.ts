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
        jsb.onKeyDown = this._createCallback('keydown');
        jsb.onKeyUp =  this._createCallback('keyup');
    }

    private _createCallback (eventType: string) {
        return (event: jsb.KeyboardEvent) => {
            const inputEvent: KeyboardInputEvent = {
                type: eventType,
                code: event.keyCode,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(eventType, inputEvent);
        };
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEYBOARD_DOWN, cb);
    }

    public onPressing (cb: KeyboardCallback) {
        this._eventTarget.on('keydown', cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEYBOARD_UP, cb);
    }
}
