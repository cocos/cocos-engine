const Event = require('./Event')

const __numberShiftMap = {
    '48': ')', // 0
    '49': '!', // 1
    '50': '@', // 2
    '51': '#', // 3
    '52': '$', // 4
    '53': '%', // 5
    '54': '^', // 6
    '55': '&', // 7
    '56': '*', // 8
    '57': '(', // 9
};

var __capsLockActive = false;

class KeyboardEvent extends Event {
    constructor(type, KeyboardEventInit) {
        super(type)
        if (typeof KeyboardEventInit === 'object') {
            this._altKeyActive = KeyboardEventInit.altKey ? KeyboardEventInit.altKey : false;
            this._ctrlKeyActive = KeyboardEventInit.ctrlKey ? KeyboardEventInit.ctrlKey : false;
            this._metaKeyActive = KeyboardEventInit.metaKey ? KeyboardEventInit.metaKey : false;
            this._shiftKeyActive = KeyboardEventInit.shiftKey ? KeyboardEventInit.shiftKey : false;
            this._keyCode = KeyboardEventInit.keyCode ? KeyboardEventInit.keyCode : -1;
            this._repeat = KeyboardEventInit.repeat ? KeyboardEventInit.repeat : false;
        }
        else {
            this._altKeyActive = false;
            this._ctrlKeyActive = false;
            this._metaKeyActive = false;
            this._shiftKeyActive = false;
            this._keyCode = -1;
            this._repeat = false;
        }

        var keyCode = this._keyCode;
        if (keyCode >= 48 && keyCode <= 57) { // 0 ~ 9
            var number = (keyCode - 48);
            this._code = 'Digit' + number;
            this._key = this._shiftKeyActive ? __numberShiftMap[keyCode] : ('' + number);
        }
        else if (keyCode >= 10048 && keyCode <= 10057) { // Numberpad 0 ~ 9
            // reset to web keyCode since it's a hack in C++ for distinguish numbers in Numberpad.
            keyCode = this._keyCode = keyCode - 10000;
            var number = (keyCode - 48);
            this._code = 'Numpad' + number;
            this._key = '' + number;
        }
        else if (keyCode >= 65 && keyCode <= 90) { // A ~ Z
            var charCode = String.fromCharCode(keyCode);
            this._code = 'Key' + charCode;
            this._key = (this._shiftKeyActive ^ __capsLockActive) ? charCode : charCode.toLowerCase();
        }
        else if (keyCode >= 97 && keyCode <= 122) { // a ~ z
            var charCode = String.fromCharCode(keyCode);
            this._keyCode = keyCode - (97 - 65); // always return uppercase keycode for backward-compatibility
            this._code = 'Key' + charCode;
            this._key = (this._shiftKeyActive ^ __capsLockActive) ? charCode.toUpperCase() : charCode;
        }
        else if (keyCode >= 112 && keyCode <= 123) { // F1 ~ F12
            this._code = this._key = 'F' + (keyCode - 111);
        }
        else if (keyCode === 27) {
            this._code = this._key = 'Escape';
        }
        else if (keyCode === 189) {
            this._code = 'Minus';
            this._key = this._shiftKeyActive ? '_' : '-';
        }
        else if (keyCode === 187) {
            this._code = 'Equal';
            this._key = this._shiftKeyActive ? '+' : '=';
        }
        else if (keyCode === 220) {
            this._code = 'Backslash';
            this._key = this._shiftKeyActive ? '|' : '\\';
        }
        else if (keyCode === 192) {
            this._code = 'Backquote';
            this._key = this._shiftKeyActive ? '~' : '`';
        }
        else if (keyCode === 8) {
            this._code = this._key = 'Backspace';
        }
        else if (keyCode === 13) {
            this._code = this._key = 'Enter';
        }
        else if (keyCode === 219) {
            this._code = 'BracketLeft';
            this._key = this._shiftKeyActive ? '{' : '[';
        }
        else if (keyCode === 221) {
            this._code = 'BracketRight';
            this._key = this._shiftKeyActive ? '}' : ']';
        }
        else if (keyCode === 186) {
            this._code = 'Semicolon';
            this._key = this._shiftKeyActive ? ':' : ';';
        }
        else if (keyCode === 222) {
            this._code = 'Quote';
            this._key = this._shiftKeyActive ? '"' : "'";
        }
        else if (keyCode === 9) {
            this._code = this._key = 'Tab';
        }
        else if (keyCode === 17) {
            this._code = 'ControlLeft';
            this._key = 'Control';
        }
        else if (keyCode === 20017) {
            this._keyCode = 17; // Reset to the real value.
            this._code = 'ControlRight';
            this._key = 'Control';
        }
        else if (keyCode === 16) {
            this._code = 'ShiftLeft';
            this._key = 'Shift';
        }
        else if (keyCode === 20016) {
            this._keyCode = 16; // Reset to the real value.
            this._code = 'ShiftRight';
            this._key = 'Shift';
        }
        else if (keyCode === 18) {
            this._code = 'AltLeft';
            this._key = 'Alt';
        }
        else if (keyCode === 20018) {
            this._keyCode = 18; // Reset to the real value.
            this._code = 'AltRight';
            this._key = 'Alt';
        }
        else if (keyCode === 91) {
            this._code = 'MetaLeft';
            this._key = 'Meta';
        }
        else if (keyCode === 93) {
            this._code = 'MetaRight';
            this._key = 'Meta';
        }
        else if (keyCode === 37) {
            this._code = this._key = 'ArrowLeft';
        }
        else if (keyCode === 38) {
            this._code = this._key = 'ArrowUp';
        }
        else if (keyCode === 39) {
            this._code = this._key = 'ArrowRight';
        }
        else if (keyCode === 40) {
            this._code = this._key = 'ArrowDown';
        }
        else if (keyCode === 20093) {
            this._keyCode = 93; // Bug of brower since its keycode is the same as MetaRight.
            this._code = this._key = 'ContextMenu';
        }
        else if (keyCode === 20013) {
            this._keyCode = 13;
            this._code = 'NumpadEnter';
            this._key = 'Enter';
        }
        else if (keyCode === 107) {
            this._code = 'NumpadAdd';
            this._key = '+';
        }
        else if (keyCode === 109) {
            this._code = 'NumpadSubtract';
            this._key = '-';
        }
        else if (keyCode === 106) {
            this._code = 'NumpadMultiply';
            this._key = '*';
        }
        else if (keyCode === 111) {
            this._code = 'NumpadDivide';
            this._key = '/';
        }
        else if (keyCode === 12) {
            this._code = 'NumLock';
            this._key = 'Clear';
        }
        else if (keyCode === 124) {
            this._code = this._key = 'F13';
        }
        else if (keyCode === 36) {
            this._code = this._key = 'Home';
        }
        else if (keyCode === 33) {
            this._code = this._key = 'PageUp';
        }
        else if (keyCode === 34) {
            this._code = this._key = 'PageDown';
        }
        else if (keyCode === 35) {
            this._code = this._key = 'End';
        }
        else if (keyCode === 188) {
            this._code = 'Comma';
            this._key = this._shiftKeyActive ? '<' : ',';
        }
        else if (keyCode === 190) {
            this._code = 'Period';
            this._key = this._shiftKeyActive ? '>' : '.';
        }
        else if (keyCode === 191) {
            this._code = 'Slash';
            this._key = this._shiftKeyActive ? '?' : '/';
        }
        else if (keyCode === 32) {
            this._code = 'Space';
            this._key = ' ';
        }
        else if (keyCode === 46) {
            this._code = this._key = 'Delete';
        }
        else if (keyCode === 110) {
            this._code = 'NumpadDecimal';
            this._key = '.';
        }
        else if (keyCode === 20) {
            this._code = this._key = 'CapsLock';
            if (type === 'keyup') {
                __capsLockActive = !__capsLockActive;
            }
        }
        else {
            console.log("Unknown keyCode: " + this._keyCode);
        }
    }

    // Returns a Boolean indicating if the modifier key, like Alt, Shift, Ctrl, or Meta, was pressed when the event was created.
    getModifierState() {
        return false;
    }

    // Returns a Boolean that is true if the Alt ( Option or ⌥ on OS X) key was active when the key event was generated.
    get altKey() {
        return this._altKeyActive;
    }

    // Returns a DOMString with the code value of the key represented by the event.
    get code() {
        return this._code;
    }

    // Returns a Boolean that is true if the Ctrl key was active when the key event was generated.
    get ctrlKey() {
        return this._ctrlKeyActive;
    }

    // Returns a Boolean that is true if the event is fired between after compositionstart and before compositionend.
    get isComposing() {
        return false;
    }

    // Returns a DOMString representing the key value of the key represented by the event.
    get key() {
        return this._key;
    }

    get keyCode() {
        return this._keyCode;
    }

    // Returns a Number representing the location of the key on the keyboard or other input device.
    get location() {
        return 0;
    }

    // Returns a Boolean that is true if the Meta key (on Mac keyboards, the ⌘ Command key; on Windows keyboards, the Windows key (⊞)) was active when the key event was generated.
    get metaKey() {
        return this._metaKeyActive;
    }

    // Returns a Boolean that is true if the key is being held down such that it is automatically repeating.
    get repeat() {
        return this._repeat;
    }

    // Returns a Boolean that is true if the Shift key was active when the key event was generated.
    get shiftKey() {
        return this._shiftKeyActive;
    }
}

module.exports = KeyboardEvent
