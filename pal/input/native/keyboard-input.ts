/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { KeyCode, EventKeyboard } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { code2KeyCode } from '../keycodes';

export type KeyboardCallback = (res: EventKeyboard) => void;

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

function getKeyCode (event: jsb.KeyboardEvent): KeyCode {
    if (event.code) {
        if (event.code in code2KeyCode) {
            return code2KeyCode[event.code];
        } else {
            console.error(`Can not find keyCode for code: ${event.code}`);
        }
    }
    return nativeKeyCode2KeyCode[event.keyCode] || event.keyCode;
}

export class KeyboardInputSource {
    private _eventTarget: EventTarget = new EventTarget();

    // On native platform, KeyboardEvent.repeat is always false, so we need a map to manage the key state.
    private _keyStateMap: Record<number, boolean> = {};

    private _handleKeyboardDown: (event: jsb.KeyboardEvent) => void;
    private _handleKeyboardUp: (event: jsb.KeyboardEvent) => void;

    constructor () {
        this._handleKeyboardDown = (event: jsb.KeyboardEvent): void => {
            const keyCode = getKeyCode(event);
            if (!this._keyStateMap[keyCode]) {
                const eventKeyDown = this._getInputEvent(event, InputEventType.KEY_DOWN);
                this._eventTarget.emit(InputEventType.KEY_DOWN, eventKeyDown);
            } else {
                const eventKeyPressing = this._getInputEvent(event, InputEventType.KEY_PRESSING);
                this._eventTarget.emit(InputEventType.KEY_PRESSING, eventKeyPressing);
            }
            this._keyStateMap[keyCode] = true;
        };
        this._handleKeyboardUp = (event: jsb.KeyboardEvent): void => {
            const keyCode = getKeyCode(event);
            const eventKeyUp = this._getInputEvent(event, InputEventType.KEY_UP);
            this._keyStateMap[keyCode] = false;
            this._eventTarget.emit(InputEventType.KEY_UP, eventKeyUp);
        };
        this._registerEvent();
    }

    public dispatchKeyboardDownEvent (nativeKeyboardEvent: jsb.KeyboardEvent): void { this._handleKeyboardDown(nativeKeyboardEvent); }
    public dispatchKeyboardUpEvent (nativeKeyboardEvent: jsb.KeyboardEvent): void { this._handleKeyboardUp(nativeKeyboardEvent); }

    private _registerEvent (): void {
        jsb.onKeyDown = this._handleKeyboardDown;
        jsb.onKeyUp = this._handleKeyboardUp;
    }

    private _getInputEvent (event: jsb.KeyboardEvent, eventType: InputEventType): EventKeyboard {
        const keyCode = getKeyCode(event);
        const eventKeyboard = new EventKeyboard(keyCode, eventType);
        eventKeyboard.windowId = event.windowId;
        return eventKeyboard;
    }

    public on (eventType: InputEventType, callback: KeyboardCallback, target?: any): void {
        this._eventTarget.on(eventType, callback, target);
    }
}
