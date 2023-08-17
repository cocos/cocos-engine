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

import { KeyboardCallback } from 'pal/input';
import { KeyCode, EventKeyboard } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { code2KeyCode } from '../keycodes';

function getKeyCode (code: string): KeyCode {
    return code2KeyCode[code] || KeyCode.NONE;
}

export class KeyboardInputSource {
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this._registerEvent();
    }

    public dispatchKeyboardDownEvent (nativeKeyboardEvent: KeyboardEvent): void { this._handleKeyboardDown(nativeKeyboardEvent); }
    public dispatchKeyboardUpEvent (nativeKeyboardEvent: KeyboardEvent): void { this._handleKeyboardUp(nativeKeyboardEvent); }

    public on (eventType: InputEventType, callback: KeyboardCallback, target?: any): void {
        this._eventTarget.on(eventType, callback,  target);
    }

    private _registerEvent (): void {
        const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        canvas?.addEventListener('keydown', this._handleKeyboardDown.bind(this));
        canvas?.addEventListener('keyup', this._handleKeyboardUp.bind(this));
    }

    private _getInputEvent (event: any, eventType: InputEventType): EventKeyboard {
        const keyCode = getKeyCode(event.code);
        const eventKeyboard = new EventKeyboard(keyCode, eventType);
        return eventKeyboard;
    }

    private _handleKeyboardDown (event: KeyboardEvent): void {
        event.stopPropagation();
        event.preventDefault();
        if (!event.repeat) {
            const keyDownInputEvent = this._getInputEvent(event, InputEventType.KEY_DOWN);
            this._eventTarget.emit(InputEventType.KEY_DOWN, keyDownInputEvent);
        } else {
            const keyPressingInputEvent = this._getInputEvent(event, InputEventType.KEY_PRESSING);
            this._eventTarget.emit(InputEventType.KEY_PRESSING, keyPressingInputEvent);
        }
    }

    private _handleKeyboardUp (event: KeyboardEvent): void {
        const inputEvent = this._getInputEvent(event, InputEventType.KEY_UP);
        event.stopPropagation();
        event.preventDefault();
        this._eventTarget.emit(InputEventType.KEY_UP, inputEvent);
    }
}
