/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const Event = require('./Event')

class KeyboardEvent extends Event {
    constructor(type, KeyboardEventInit) {
        super(type)
        if (typeof KeyboardEventInit === 'object') {
            this._altKeyActive = KeyboardEventInit.altKey ? KeyboardEventInit.altKey : false;
            this._ctrlKeyActive = KeyboardEventInit.ctrlKey ? KeyboardEventInit.ctrlKey : false;
            this._metaKeyActive = KeyboardEventInit.metaKey ? KeyboardEventInit.metaKey : false;
            this._shiftKeyActive = KeyboardEventInit.shiftKey ? KeyboardEventInit.shiftKey : false;
            
            this._code = KeyboardEventInit.code ? KeyboardEventInit.code : '';
            this._key = KeyboardEventInit.key ? KeyboardEventInit.key : '';
            this._keyCode = KeyboardEventInit.keyCode ? KeyboardEventInit.keyCode : -1;
            this._repeat = KeyboardEventInit.repeat ? KeyboardEventInit.repeat : false;
        }
        else {
            this._altKeyActive = false;
            this._ctrlKeyActive = false;
            this._metaKeyActive = false;
            this._shiftKeyActive = false;

            this._code = "";
            this._key = "";
            this._keyCode = -1;
            this._repeat = false;
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
