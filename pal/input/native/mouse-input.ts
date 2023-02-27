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

import { MouseCallback } from 'pal/input';
import { screenAdapter } from 'pal/screen-adapter';
import { EventMouse } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { Vec2 } from '../../../cocos/core/math';
import { InputEventType } from '../../../cocos/input/types/event-enum';

declare const jsb: any;

export class MouseInputSource {
    private _eventTarget: EventTarget = new EventTarget();
    private _preMousePos: Vec2 = new Vec2();
    private _isPressed = false;
    private _windowManager: any;
    private _pointLocked = false;

    private _handleMouseDown: (mouseEvent: jsb.MouseEvent) => void;
    private _handleMouseMove: (mouseEvent: jsb.MouseEvent) => void;
    private _handleMouseUp: (mouseEvent: jsb.MouseEvent) => void;
    private _boundedHandleMouseWheel: (mouseEvent: jsb.MouseWheelEvent) => void;

    constructor () {
        this._handleMouseDown = this._createCallback(InputEventType.MOUSE_DOWN);
        this._handleMouseMove = this._createCallback(InputEventType.MOUSE_MOVE);
        this._handleMouseUp =  this._createCallback(InputEventType.MOUSE_UP);
        this._boundedHandleMouseWheel = this._handleMouseWheel.bind(this);
        this._registerEvent();
        this._windowManager = jsb.ISystemWindowManager.getInstance();
    }

    public dispatchMouseDownEvent (nativeMouseEvent: any) { this._handleMouseDown(nativeMouseEvent); }
    public dispatchMouseMoveEvent (nativeMouseEvent: any) { this._handleMouseMove(nativeMouseEvent); }
    public dispatchMouseUpEvent (nativeMouseEvent: any) { this._handleMouseUp(nativeMouseEvent); }
    public dispatchScrollEvent (nativeMouseEvent: any) { this._boundedHandleMouseWheel(nativeMouseEvent); }

    private _getLocation (event: jsb.MouseEvent): Vec2 {
        const window = this._windowManager.getWindow(event.windowId);
        const windowSize = window.getViewSize();
        const dpr = screenAdapter.devicePixelRatio;
        const x = event.x * dpr;
        const y = windowSize.height - event.y * dpr;
        return new Vec2(x, y);
    }

    private _registerEvent () {
        jsb.onMouseDown = this._handleMouseDown;
        jsb.onMouseMove = this._handleMouseMove;
        jsb.onMouseUp =  this._handleMouseUp;
        jsb.onMouseWheel = this._boundedHandleMouseWheel;
        jsb.onPointerlockChange = (value: boolean) => {
            this._pointLocked = value;
        };
    }

    private _createCallback (eventType: InputEventType) {
        return (mouseEvent: jsb.MouseEvent) => {
            const location = this._getLocation(mouseEvent);
            let button = mouseEvent.button;
            switch (eventType) {
            case InputEventType.MOUSE_DOWN:
                this._isPressed = true;
                break;
            case InputEventType.MOUSE_UP:
                this._isPressed = false;
                break;
            case InputEventType.MOUSE_MOVE:
                if (!this._isPressed) {
                    button = EventMouse.BUTTON_MISSING;
                }
                break;
            default:
                break;
            }

            const eventMouse = new EventMouse(eventType, false, this._preMousePos, mouseEvent.windowId);
            eventMouse.setLocation(location.x, location.y);
            eventMouse.setButton(button);
            const dpr = screenAdapter.devicePixelRatio;
            eventMouse.movementX = typeof mouseEvent.xDelta === 'undefined' ? 0 : mouseEvent.xDelta * dpr;
            eventMouse.movementY = typeof mouseEvent.yDelta === 'undefined' ? 0 : mouseEvent.yDelta * dpr;
            // update previous mouse position.
            this._preMousePos.set(location.x, location.y);
            this._eventTarget.emit(eventType, eventMouse);
        };
    }

    private _handleMouseWheel (mouseEvent: jsb.MouseWheelEvent) {
        const eventType = InputEventType.MOUSE_WHEEL;
        const location = this._getLocation(mouseEvent);
        const button = mouseEvent.button;

        const eventMouse = new EventMouse(eventType, false, this._preMousePos, mouseEvent.windowId);
        eventMouse.setLocation(location.x, location.y);
        eventMouse.setButton(button);
        eventMouse.movementX = location.x - this._preMousePos.x;
        eventMouse.movementY = this._preMousePos.y - location.y;

        const matchStandardFactor = 120;
        eventMouse.setScrollData(mouseEvent.wheelDeltaX * matchStandardFactor, mouseEvent.wheelDeltaY * matchStandardFactor);
        // update previous mouse position.
        this._preMousePos.set(location.x, location.y);
        this._eventTarget.emit(eventType, eventMouse);
    }

    public on (eventType: InputEventType, callback: MouseCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
