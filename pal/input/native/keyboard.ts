import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { SystemEventType } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';

export class KeyboardInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    // On native platform, KeyboardEvent.repeat is always false, so we need a map to manage the key state.
    private _keyStateMap: Record<number, boolean> = {};

    constructor () {
        this.support = !system.isMobile;
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onKeyDown = (event: jsb.KeyboardEvent) => {
            const keyCode = event.keyCode;
            if (!this._keyStateMap[keyCode]) {
                const keyDownInputEvent = this._getInputEvent(event, SystemEventType.KEYBOARD_DOWN);
                this._eventTarget.emit(SystemEventType.KEYBOARD_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(event, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
            this._keyStateMap[keyCode] = true;
        };
        jsb.onKeyUp =  (event: jsb.KeyboardEvent) => {
            const keyCode = event.keyCode;
            const inputEvent: KeyboardInputEvent = {
                type: SystemEventType.KEYBOARD_UP,
                code: keyCode,
                timestamp: performance.now(),
            };
            this._keyStateMap[keyCode] = false;
            this._eventTarget.emit(SystemEventType.KEYBOARD_UP, inputEvent);
        };
    }

    private _getInputEvent (event: jsb.KeyboardEvent, eventType: SystemEventType) {
        const inputEvent: KeyboardInputEvent = {
            type: eventType,
            code: event.keyCode,  // TODO: keyCode is deprecated on Web standard
            timestamp: performance.now(),
        };
        return inputEvent;
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
