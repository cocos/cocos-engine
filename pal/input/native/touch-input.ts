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

import { screenAdapter } from 'pal/screen-adapter';
import { Size, Vec2 } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event';
import { EventTouch, Touch } from '../../../cocos/input/types';
import { touchManager } from '../touch-manager';
import { macro } from '../../../cocos/core/platform/macro';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export type TouchCallback = (res: EventTouch) => void;

declare const jsb: any;

export class TouchInputSource {
    private _eventTarget: EventTarget = new EventTarget();
    private _windowManager: any;

    constructor () {
        this._registerEvent();
        this._windowManager = jsb.ISystemWindowManager.getInstance();
    }

    private _registerEvent (): void {
        jsb.onTouchStart = this._createCallback(InputEventType.TOUCH_START);
        jsb.onTouchMove = this._createCallback(InputEventType.TOUCH_MOVE);
        jsb.onTouchEnd = this._createCallback(InputEventType.TOUCH_END);
        jsb.onTouchCancel = this._createCallback(InputEventType.TOUCH_CANCEL);
    }

    private _createCallback (eventType: InputEventType) {
        return (changedTouches: TouchList, windowId: number): void => {
            const handleTouches: Touch[] = [];
            const length = changedTouches.length;
            const windowSize = this._windowManager.getWindow(windowId).getViewSize() as Size;
            for (let i = 0; i < length; ++i) {
                const changedTouch = changedTouches[i];
                const touchID = changedTouch.identifier;
                if (touchID === null) {
                    continue;
                }
                const location = this._getLocation(changedTouch, windowSize);
                const touch = touchManager.getOrCreateTouch(touchID, location.x, location.y);
                if (!touch) {
                    continue;
                }
                if (eventType === InputEventType.TOUCH_END || eventType === InputEventType.TOUCH_CANCEL) {
                    touchManager.releaseTouch(touchID);
                }
                handleTouches.push(touch);
            }
            if (handleTouches.length > 0) {
                const eventTouch = new EventTouch(
                    handleTouches,
                    false,
                    eventType,
                    macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches,
                );
                eventTouch.windowId = windowId;
                this._eventTarget.emit(eventType, eventTouch);
            }
        };
    }

    private _getLocation (touch: globalThis.Touch, windowSize: Size): Vec2 {
        const dpr = screenAdapter.devicePixelRatio;
        const x = touch.clientX * dpr;
        const y = windowSize.height - touch.clientY * dpr;
        return new Vec2(x, y);
    }

    public on (eventType: InputEventType, callback: TouchCallback, target?: any): void {
        this._eventTarget.on(eventType, callback, target);
    }
}
