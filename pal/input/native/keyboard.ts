import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { system } from 'pal/system';
import { KeyboardEvent } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Keyboard } from '../../../cocos/core/platform/event-manager/keyboard-enum';

const keyCode2Keyboard: Record<number, Keyboard> = {
    12: Keyboard.NUM_LOCK,
    10048: Keyboard.NUM_0,
    10049: Keyboard.NUM_1,
    10050: Keyboard.NUM_2,
    10051: Keyboard.NUM_3,
    10052: Keyboard.NUM_4,
    10053: Keyboard.NUM_5,
    10054: Keyboard.NUM_6,
    10055: Keyboard.NUM_7,
    10056: Keyboard.NUM_8,
    10057: Keyboard.NUM_9,
    20013: Keyboard.NUM_ENTER,
    20016: Keyboard.SHIFT_RIGHT,
    20017: Keyboard.CTRL_RIGHT,
    20018: Keyboard.ALT_RIGHT,
};

function getKeyboardEnum (keyCode: number): Keyboard {
    return keyCode2Keyboard[keyCode] || keyCode;
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
            const keyboard = getKeyboardEnum(event.keyCode);
            if (!this._keyStateMap[keyboard]) {
                const keyDownInputEvent = this._getInputEvent(event, KeyboardEvent.KEY_DOWN);
                this._eventTarget.emit(KeyboardEvent.KEY_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(event, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
            this._keyStateMap[keyboard] = true;
        };
        jsb.onKeyUp =  (event: jsb.KeyboardEvent) => {
            const keyboard = getKeyboardEnum(event.keyCode);
            const inputEvent: KeyboardInputEvent = {
                type: KeyboardEvent.KEY_UP,
                code: keyboard,
                timestamp: performance.now(),
            };
            this._keyStateMap[keyboard] = false;
            this._eventTarget.emit(KeyboardEvent.KEY_UP, inputEvent);
        };
    }

    private _getInputEvent (event: jsb.KeyboardEvent, eventType: KeyboardEvent) {
        const keyboard = getKeyboardEnum(event.keyCode);
        const inputEvent: KeyboardInputEvent = {
            type: eventType,
            code: keyboard,
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
