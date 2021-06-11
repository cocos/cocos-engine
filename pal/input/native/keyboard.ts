import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { KeyboardEvent } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { KeyCode } from '../../../cocos/core/platform/event-manager/key-code';

const nativeKeyCode2Keycode: Record<number, KeyCode> = {
    12: KeyCode.NUM_LOCK,
    10048: KeyCode.NUM_0,
    10049: KeyCode.NUM_1,
    10050: KeyCode.NUM_2,
    10051: KeyCode.NUM_3,
    10052: KeyCode.NUM_4,
    10053: KeyCode.NUM_5,
    10054: KeyCode.NUM_6,
    10055: KeyCode.NUM_7,
    10056: KeyCode.NUM_8,
    10057: KeyCode.NUM_9,
    20013: KeyCode.NUM_ENTER,
    20016: KeyCode.SHIFT_RIGHT,
    20017: KeyCode.CTRL_RIGHT,
    20018: KeyCode.ALT_RIGHT,
};

function getKeyCode (keyCode: number): KeyCode {
    return nativeKeyCode2Keycode[keyCode] || keyCode;
}

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
            const keycode = getKeyCode(event.keyCode);
            if (!this._keyStateMap[keycode]) {
                const keyDownInputEvent = this._getInputEvent(event, KeyboardEvent.KEY_DOWN);
                this._eventTarget.emit(KeyboardEvent.KEY_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(event, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
            this._keyStateMap[keycode] = true;
        };
        jsb.onKeyUp =  (event: jsb.KeyboardEvent) => {
            const keycode = getKeyCode(event.keyCode);
            const inputEvent: KeyboardInputEvent = {
                type: KeyboardEvent.KEY_UP,
                code: keycode,
                timestamp: performance.now(),
            };
            this._keyStateMap[keycode] = false;
            this._eventTarget.emit(KeyboardEvent.KEY_UP, inputEvent);
        };
    }

    private _getInputEvent (event: jsb.KeyboardEvent, eventType: KeyboardEvent) {
        const keycode = getKeyCode(event.keyCode);
        const inputEvent: KeyboardInputEvent = {
            type: eventType,
            code: keycode,
            timestamp: performance.now(),
        };
        return inputEvent;
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(KeyboardEvent.KEY_DOWN, cb);
    }

    public onPressing (cb: KeyboardCallback) {
        this._eventTarget.on('keydown', cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on(KeyboardEvent.KEY_UP, cb);
    }
}
