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

    private _handleKeyboardDown: (event: jsb.KeyboardEvent) => void;
    private _handleKeyboardUp: (event: jsb.KeyboardEvent) => void;

    constructor () {
        this._handleKeyboardDown = (event: jsb.KeyboardEvent) => {
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
        this._handleKeyboardUp = (event: jsb.KeyboardEvent) => {
            const keyCode = getKeyCode(event.keyCode);
            const eventKeyUp = this._getInputEvent(event, InputEventType.KEY_UP);
            this._keyStateMap[keyCode] = false;
            this._eventTarget.emit(InputEventType.KEY_UP, eventKeyUp);
        };
        this._registerEvent();
    }

    public dispatchKeyboardDownEvent (nativeKeyboardEvent: jsb.KeyboardEvent) { this._handleKeyboardDown(nativeKeyboardEvent); }
    public dispatchKeyboardUpEvent (nativeKeyboardEvent: jsb.KeyboardEvent) { this._handleKeyboardUp(nativeKeyboardEvent); }

    private _registerEvent () {
        jsb.onKeyDown = this._handleKeyboardDown;
        jsb.onKeyUp = this._handleKeyboardUp;
    }

    private _getInputEvent (event: jsb.KeyboardEvent, eventType: InputEventType) {
        const keyCode = getKeyCode(event.keyCode);
        const eventKeyboard = new EventKeyboard(keyCode, eventType);
        eventKeyboard.windowId = event.windowId;
        return eventKeyboard;
    }

    public on (eventType: InputEventType, callback: KeyboardCallback, target?: any) {
        this._eventTarget.on(eventType, callback,  target);
    }
}
