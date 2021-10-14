import { KeyboardCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { KeyCode, EventKeyboard } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { InputEventType } from '../../../cocos/input/types/event-enum';

const nativeKeyCode2KeyCode: Record<number, KeyCode> = {
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
    return nativeKeyCode2KeyCode[keyCode] || keyCode;
}

export class KeyboardInputSource {
    private _eventTarget: EventTarget = new EventTarget();

    // On native platform, KeyboardEvent.repeat is always false, so we need a map to manage the key state.
    private _keyStateMap: Record<number, boolean> = {};

    constructor () {
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onKeyDown = (event: jsb.KeyboardEvent) => {
            const keyCode = getKeyCode(event.keyCode);
            if (!this._keyStateMap[keyCode]) {
                const eventKeyDown = this._getInputEvent(event, InputEventType.KEY_DOWN);
                this._eventTarget.emit(InputEventType.KEY_DOWN, eventKeyDown);
            } else {
                const eventKeyPressing = this._getInputEvent(event, InputEventType.KEY_PRESSING);
                this._eventTarget.emit(InputEventType.KEY_PRESSING, eventKeyPressing);
            }
            this._keyStateMap[keyCode] = true;
        };
        jsb.onKeyUp = (event: jsb.KeyboardEvent) => {
            const keyCode = getKeyCode(event.keyCode);
            const eventKeyUp = this._getInputEvent(event, InputEventType.KEY_UP);
            this._keyStateMap[keyCode] = false;
            this._eventTarget.emit(InputEventType.KEY_UP, eventKeyUp);
        };
    }

    private _getInputEvent (event: jsb.KeyboardEvent, eventType: InputEventType) {
        const keyCode = getKeyCode(event.keyCode);
        const eventKeyboard = new EventKeyboard(keyCode, eventType);
        return eventKeyboard;
    }

    public on (eventType: InputEventType, callback: KeyboardCallback, target?: any) {
        this._eventTarget.on(eventType, callback,  target);
    }
}
