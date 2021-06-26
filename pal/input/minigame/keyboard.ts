import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { KeyboardEventData, minigame } from 'pal/minigame';
import { KeyboardEvent } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { KeyCode } from '../../../cocos/core/platform/event-manager/key-code';

const code2KeyCode: Record<string, KeyCode> = {
    Backspace: KeyCode.BACKSPACE,
    Tab: KeyCode.TAB,
    Enter: KeyCode.ENTER,
    ShiftLeft: KeyCode.SHIFT_LEFT,
    ControlLeft: KeyCode.CTRL_LEFT,
    AltLeft: KeyCode.ALT_LEFT,
    ShiftRight: KeyCode.SHIFT_RIGHT,
    ControlRight: KeyCode.CTRL_RIGHT,
    AltRight: KeyCode.ALT_RIGHT,
    Pause: KeyCode.PAUSE,
    CapsLock: KeyCode.CAPSLOCK,
    Escape: KeyCode.ESCAPE,
    Space: KeyCode.SPACE,
    PageUp: KeyCode.PAGEUP,
    PageDown: KeyCode.PAGEDOWN,
    End: KeyCode.END,
    Home: KeyCode.HOME,
    ArrowLeft: KeyCode.ARROW_LEFT,
    ArrowUp: KeyCode.ARROW_UP,
    ArrowRight: KeyCode.ARROW_RIGHT,
    ArrowDown: KeyCode.ARROW_DOWN,
    Insert: KeyCode.INSERT,
    Delete: KeyCode.DELETE,
    Digit0: KeyCode.DIGIT_0,
    Digit1: KeyCode.DIGIT_1,
    Digit2: KeyCode.DIGIT_2,
    Digit3: KeyCode.DIGIT_3,
    Digit4: KeyCode.DIGIT_4,
    Digit5: KeyCode.DIGIT_5,
    Digit6: KeyCode.DIGIT_6,
    Digit7: KeyCode.DIGIT_7,
    Digit8: KeyCode.DIGIT_8,
    Digit9: KeyCode.DIGIT_9,
    KeyA: KeyCode.KEY_A,
    KeyB: KeyCode.KEY_B,
    KeyC: KeyCode.KEY_C,
    KeyD: KeyCode.KEY_D,
    KeyE: KeyCode.KEY_E,
    KeyF: KeyCode.KEY_F,
    KeyG: KeyCode.KEY_G,
    KeyH: KeyCode.KEY_H,
    KeyI: KeyCode.KEY_I,
    KeyJ: KeyCode.KEY_J,
    KeyK: KeyCode.KEY_K,
    KeyL: KeyCode.KEY_L,
    KeyM: KeyCode.KEY_M,
    KeyN: KeyCode.KEY_N,
    KeyO: KeyCode.KEY_O,
    KeyP: KeyCode.KEY_P,
    KeyQ: KeyCode.KEY_Q,
    KeyR: KeyCode.KEY_R,
    KeyS: KeyCode.KEY_S,
    KeyT: KeyCode.KEY_T,
    KeyU: KeyCode.KEY_U,
    KeyV: KeyCode.KEY_V,
    KeyW: KeyCode.KEY_W,
    KeyX: KeyCode.KEY_X,
    KeyY: KeyCode.KEY_Y,
    KeyZ: KeyCode.KEY_Z,
    Numpad0: KeyCode.NUM_0,
    Numpad1: KeyCode.NUM_1,
    Numpad2: KeyCode.NUM_2,
    Numpad3: KeyCode.NUM_3,
    Numpad4: KeyCode.NUM_4,
    Numpad5: KeyCode.NUM_5,
    Numpad6: KeyCode.NUM_6,
    Numpad7: KeyCode.NUM_7,
    Numpad8: KeyCode.NUM_8,
    Numpad9: KeyCode.NUM_9,
    NumpadMultiply: KeyCode.NUM_MUTIPLY,
    NumpadAdd: KeyCode.NUM_PLUS,
    NumpadSubtract: KeyCode.NUM_SUBTRACT,
    NumpadDecimal: KeyCode.NUM_DECIMAL,
    NumpadDivide: KeyCode.NUM_DIVIDE,
    NumpadEnter: KeyCode.NUM_ENTER,
    F1: KeyCode.F1,
    F2: KeyCode.F2,
    F3: KeyCode.F3,
    F4: KeyCode.F4,
    F5: KeyCode.F5,
    F6: KeyCode.F6,
    F7: KeyCode.F7,
    F8: KeyCode.F8,
    F9: KeyCode.F9,
    F10: KeyCode.F10,
    F11: KeyCode.F11,
    F12: KeyCode.F12,
    NumLock: KeyCode.NUM_LOCK,
    ScrollLock: KeyCode.SCROLLLOCK,
    Semicolon: KeyCode.SEMICOLON,
    Equal: KeyCode.EQUAL,
    Comma: KeyCode.COMMA,
    Minus: KeyCode.DASH,
    Period: KeyCode.PERIOD,
    Slash: KeyCode.SLASH,
    Backquote: KeyCode.BACKQUOTE,
    BracketLeft: KeyCode.BRACKET_LEFT,
    Backslash: KeyCode.BACKSLASH,
    BracketRight: KeyCode.BRACKET_RIGHT,
    Quote: KeyCode.QUOTE,
};

function getKeyCode (code: string): KeyCode {
    return code2KeyCode[code] || KeyCode.NONE;
}

export class KeyboardInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    // KeyboardEvent.repeat is not supported on Wechat PC platform.
    private _keyStateMap: Record<number, boolean> = {};

    constructor () {
        this.support = typeof minigame.wx === 'object' && typeof minigame.wx.onKeyDown !== 'undefined';
        if (this.support) {
            this._registerEvent();
        }
    }

    private _registerEvent () {
        minigame.wx?.onKeyDown?.((res) => {
            const keyCode = getKeyCode(res.code);
            if (!this._keyStateMap[keyCode]) {
                const keyDownInputEvent = this._getInputEvent(res, KeyboardEvent.KEY_DOWN);
                this._eventTarget.emit(KeyboardEvent.KEY_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(res, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
            this._keyStateMap[keyCode] = true;
        });
        minigame.wx?.onKeyUp?.((res) => {
            const keyCode = getKeyCode(res.code);
            const inputEvent: KeyboardInputEvent = {
                code: keyCode,
                type: KeyboardEvent.KEY_UP,
                timestamp: performance.now(),
            };
            this._keyStateMap[keyCode] = false;
            this._eventTarget.emit(KeyboardEvent.KEY_UP, inputEvent);
        });
    }

    private _getInputEvent (event: KeyboardEventData, eventType: KeyboardEvent) {
        const keyCode = getKeyCode(event.code);
        const inputEvent: KeyboardInputEvent = {
            type: eventType,
            code: keyCode,
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
