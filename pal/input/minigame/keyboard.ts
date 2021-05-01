import { WECHAT } from 'internal:constants';
import { system } from 'pal/system';
import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { KeyboardEventData, minigame } from 'pal/minigame';
import { KeyboardEvent } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';

// map from CCMacro
const key2keyCode = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    control: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    ' ': 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    '*': 106,
    '+': 107,
    '-': 109,
    '/': 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    ';': 186,
    '=': 187,
    ',': 188,
    '.': 190,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222,
};

const code2KeyCode = {
    Delete: 46,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    Numpad0: 96,
    Numpad1: 97,
    Numpad2: 98,
    Numpad3: 99,
    Numpad4: 100,
    Numpad5: 101,
    Numpad6: 102,
    Numpad7: 103,
    Numpad8: 104,
    Numpad9: 105,
    NumpadDecimal: 110,
};

export class KeyboardInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = WECHAT && !system.isMobile;
        if (this.support) {
            this._registerEvent();
        }
    }

    private _registerEvent () {
        minigame.onKeyDown?.((res) => {
            const inputEvent: KeyboardInputEvent = {
                code: this._getKeyCode(res),
                type: SystemEventType.KEY_DOWN,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(SystemEventType.KEY_DOWN, inputEvent);
        });
        minigame.onKeyUp?.((res) => {
            const inputEvent: KeyboardInputEvent = {
                code: this._getKeyCode(res),
                type: SystemEventType.KEY_UP,
                timestamp: performance.now(),
            };
            this._eventTarget.emit(SystemEventType.KEY_UP, inputEvent);
        });
    }

    private _getKeyCode (res: KeyboardEventData) {
        const key = res.key.toLowerCase();
        const code = res.code;
        // distinguish different numLock states
        if (/^\d$/.test(key) || key === 'delete') {
            return code2KeyCode[code] as number;
        }
        return key2keyCode[key] as number || 0;
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
