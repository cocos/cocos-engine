import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { KeyboardEvent } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Keyboard } from '../../../cocos/core/platform/event-manager/keyboard-enum';

const code2Keyboard: Record<string, Keyboard> = {
    Backspace: Keyboard.BACKSPACE,
    Tab: Keyboard.TAB,
    Enter: Keyboard.ENTER,
    ShiftLeft: Keyboard.SHIFT_LEFT,
    ControlLeft: Keyboard.CTRL_LEFT,
    AltLeft: Keyboard.ALT_LEFT,
    ShiftRight: Keyboard.SHIFT_RIGHT,
    ControlRight: Keyboard.CTRL_RIGHT,
    AltRight: Keyboard.ALT_RIGHT,
    Pause: Keyboard.PAUSE,
    CapsLock: Keyboard.CAPSLOCK,
    Escape: Keyboard.ESCAPE,
    Space: Keyboard.SPACE,
    PageUp: Keyboard.PAGEUP,
    PageDown: Keyboard.PAGEDOWN,
    End: Keyboard.END,
    Home: Keyboard.HOME,
    ArrowLeft: Keyboard.ARROW_LEFT,
    ArrowUp: Keyboard.ARROW_UP,
    ArrowRight: Keyboard.ARROW_RIGHT,
    ArrowDown: Keyboard.ARROW_DOWN,
    Insert: Keyboard.INSERT,
    Delete: Keyboard.DELETE,
    Digit0: Keyboard.DIGIT_0,
    Digit1: Keyboard.DIGIT_1,
    Digit2: Keyboard.DIGIT_2,
    Digit3: Keyboard.DIGIT_3,
    Digit4: Keyboard.DIGIT_4,
    Digit5: Keyboard.DIGIT_5,
    Digit6: Keyboard.DIGIT_6,
    Digit7: Keyboard.DIGIT_7,
    Digit8: Keyboard.DIGIT_8,
    Digit9: Keyboard.DIGIT_9,
    KeyA: Keyboard.KEY_A,
    KeyB: Keyboard.KEY_B,
    KeyC: Keyboard.KEY_C,
    KeyD: Keyboard.KEY_D,
    KeyE: Keyboard.KEY_E,
    KeyF: Keyboard.KEY_F,
    KeyG: Keyboard.KEY_G,
    KeyH: Keyboard.KEY_H,
    KeyI: Keyboard.KEY_I,
    KeyJ: Keyboard.KEY_J,
    KeyK: Keyboard.KEY_K,
    KeyL: Keyboard.KEY_L,
    KeyM: Keyboard.KEY_M,
    KeyN: Keyboard.KEY_N,
    KeyO: Keyboard.KEY_O,
    KeyP: Keyboard.KEY_P,
    KeyQ: Keyboard.KEY_Q,
    KeyR: Keyboard.KEY_R,
    KeyS: Keyboard.KEY_S,
    KeyT: Keyboard.KEY_T,
    KeyU: Keyboard.KEY_U,
    KeyV: Keyboard.KEY_V,
    KeyW: Keyboard.KEY_W,
    KeyX: Keyboard.KEY_X,
    KeyY: Keyboard.KEY_Y,
    KeyZ: Keyboard.KEY_Z,
    Numpad0: Keyboard.NUM_0,
    Numpad1: Keyboard.NUM_1,
    Numpad2: Keyboard.NUM_2,
    Numpad3: Keyboard.NUM_3,
    Numpad4: Keyboard.NUM_4,
    Numpad5: Keyboard.NUM_5,
    Numpad6: Keyboard.NUM_6,
    Numpad7: Keyboard.NUM_7,
    Numpad8: Keyboard.NUM_8,
    Numpad9: Keyboard.NUM_9,
    NumpadMultiply: Keyboard.NUM_MUTIPLY,
    NumpadAdd: Keyboard.NUM_PLUS,
    NumpadSubtract: Keyboard.NUM_MINUS,
    NumpadDecimal: Keyboard.NUM_DEL,
    NumpadDivide: Keyboard.NUM_SLASH,
    NumpadEnter: Keyboard.NUM_ENTER,
    F1: Keyboard.F1,
    F2: Keyboard.F2,
    F3: Keyboard.F3,
    F4: Keyboard.F4,
    F5: Keyboard.F5,
    F6: Keyboard.F6,
    F7: Keyboard.F7,
    F8: Keyboard.F8,
    F9: Keyboard.F9,
    F10: Keyboard.F10,
    F11: Keyboard.F11,
    F12: Keyboard.F12,
    NumLock: Keyboard.NUM_LOCK,
    ScrollLock: Keyboard.SCROLLLOCK,
    Semicolon: Keyboard.SEMICOLON,
    Equal: Keyboard.EQUAL,
    Comma: Keyboard.COMMA,
    Minus: Keyboard.DASH,
    Period: Keyboard.PERIOD,
    Slash: Keyboard.SLASH,
    Backquote: Keyboard.BACKQUOTE,
    BracketLeft: Keyboard.BRACKET_LEFT,
    Backslash: Keyboard.BACKSLASH,
    BracketRight: Keyboard.BRACKET_RIGHT,
    Quote: Keyboard.QUOTE,
};

function getKeyboardEnum (code: string): Keyboard {
    return code2Keyboard[code] || Keyboard.NONE;
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
                const keyDownInputEvent = this._getInputEvent(event, KeyboardEvent.KEY_DOWN);
                this._eventTarget.emit(KeyboardEvent.KEY_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(event, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
        });
        canvas?.addEventListener('keyup', (event: any) => {
            const inputEvent = this._getInputEvent(event, KeyboardEvent.KEY_UP);
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(KeyboardEvent.KEY_UP, inputEvent);
        });
    }

    private _getInputEvent (event: any, eventType: KeyboardEvent) {
        const keyboard = getKeyboardEnum(event.code);
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
