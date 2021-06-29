import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { KeyCode } from '../../../cocos/core/platform/event-manager/key-code';
import { SystemEvent } from '../../../cocos/core/platform/event-manager/system-event';

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

    constructor () {
        this.support = document.documentElement.onkeyup !== undefined;
        this._registerEvent();
    }

    private _registerEvent () {
        const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        canvas?.addEventListener('keydown', (event: any) => {
            event.stopPropagation();
            event.preventDefault();
            if (!event.repeat) {
                const keyDownInputEvent = this._getInputEvent(event, SystemEvent.EventType.KEY_DOWN);
                this._eventTarget.emit(SystemEvent.EventType.KEY_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(event, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
        });
        canvas?.addEventListener('keyup', (event: any) => {
            const inputEvent = this._getInputEvent(event, SystemEvent.EventType.KEY_UP);
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(SystemEvent.EventType.KEY_UP, inputEvent);
        });
    }

    private _getInputEvent (event: any, eventType: SystemEvent.EventType) {
        const keyCode = getKeyCode(event.code);
        const inputEvent: KeyboardInputEvent = {
            type: eventType,
            code: keyCode,
            timestamp: performance.now(),
        };
        return inputEvent;
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEvent.EventType.KEY_DOWN, cb);
    }

    public onPressing (cb: KeyboardCallback) {
        this._eventTarget.on('keydown', cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEvent.EventType.KEY_UP, cb);
    }
}
