/*
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

/**
 * @packageDocumentation
 * @hidden
 */

import { TouchInputSource, MouseInputSource, KeyboardInputSource, AccelerometerInputSource } from 'pal/input';
import { touchManager } from '../../pal/input/touch-manager';
import { eventManager } from './event-manager';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch, SystemEventType, Touch } from './types';

const pointerEventTypeMap = {
    [SystemEventType.MOUSE_DOWN]: SystemEventType.TOUCH_START,
    [SystemEventType.MOUSE_MOVE]: SystemEventType.TOUCH_MOVE,
    [SystemEventType.MOUSE_UP]: SystemEventType.TOUCH_END,
};

/**
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
 */
class InputManager {
    public _touch = new TouchInputSource();
    public _mouse = new MouseInputSource();
    public _keyboard = new KeyboardInputSource();
    public _accelerometer = new AccelerometerInputSource();

    private _touchEvents: EventTouch[] = [];
    private _mouseEvents: EventMouse[] = [];
    private _keyboardEvents: EventKeyboard[] = [];
    private _accelerometerEvents: EventAcceleration[] = [];

    private _needSimulateTouchMoveEvent = false;

    constructor () {
        this._registerEvent();
    }

    private _simulateEventTouch (eventMouse: EventMouse) {
        const eventType = pointerEventTypeMap[eventMouse.type];
        const touchID = 0;
        const touch = touchManager.getTouch(touchID, eventMouse.getLocationX(), eventMouse.getLocationY());
        if (!touch) {
            return;
        }
        const changedTouches = [touch];
        const eventTouch = new EventTouch(changedTouches, false, eventType, changedTouches);
        if (eventType === SystemEventType.TOUCH_END) {
            touchManager.releaseTouch(touchID);
        }
        this._touchEvents.push(eventTouch);
    }

    private _registerEvent () {
        if (this._touch.support) {
            const touchEvents = this._touchEvents;
            this._touch.onStart((event) => { touchEvents.push(event); });
            this._touch.onMove((event) => { touchEvents.push(event); });
            this._touch.onEnd((event) => { touchEvents.push(event); });
            this._touch.onCancel((event) => { touchEvents.push(event); });
        }

        if (this._mouse.support) {
            const mouseEvents = this._mouseEvents;
            this._mouse.onDown((event) => {
                this._needSimulateTouchMoveEvent = true;
                this._simulateEventTouch(event);
                mouseEvents.push(event);
            });
            this._mouse.onMove((event) => {
                if (this._needSimulateTouchMoveEvent) {
                    this._simulateEventTouch(event);
                }
                mouseEvents.push(event);
            });
            this._mouse.onUp((event) => {
                this._needSimulateTouchMoveEvent = false;
                this._simulateEventTouch(event);
                mouseEvents.push(event);
            });
            this._mouse.onWheel((event) => { mouseEvents.push(event); });
        }

        if (this._keyboard.support) {
            const keyboardEvents = this._keyboardEvents;
            // this._keyboard.onDown((event) => { keyboardEvents.push(event); });
            this._keyboard.onPressing((event) => { keyboardEvents.push(event); });
            this._keyboard.onUp((event) => { keyboardEvents.push(event); });
        }

        if (this._accelerometer.support) {
            const accelerometerEvents = this._accelerometerEvents;
            this._accelerometer.onChange((event) => { accelerometerEvents.push(event); });
        }
    }

    /**
     * Clear events when game is resumed.
     */
    public clearEvents () {
        this._mouseEvents.length = 0;
        this._touchEvents.length = 0;
        this._keyboardEvents.length = 0;
        this._accelerometerEvents.length = 0;
    }

    public frameDispatchEvents () {
        const mouseEvents = this._mouseEvents;
        // TODO: culling event queue
        for (let i = 0, length = mouseEvents.length; i < length; ++i) {
            const eventMouse = mouseEvents[i];
            eventManager.dispatchEvent(eventMouse);
        }

        const touchEvents = this._touchEvents;
        // TODO: culling event queue
        for (let i = 0, length = touchEvents.length; i < length; ++i) {
            const eventTouch = touchEvents[i];
            eventManager.dispatchEvent(eventTouch);
        }

        const keyboardEvents = this._keyboardEvents;
        // TODO: culling event queue
        for (let i = 0, length = keyboardEvents.length; i < length; ++i) {
            const eventKeyboard = keyboardEvents[i];
            eventManager.dispatchEvent(eventKeyboard);
        }

        const accelerometerEvents = this._accelerometerEvents;
        // TODO: culling event queue
        for (let i = 0, length = accelerometerEvents.length; i < length; ++i) {
            const eventAcceleration = accelerometerEvents[i];
            eventManager.dispatchEvent(eventAcceleration);
        }

        this.clearEvents();
    }

    // #region Accelerometer
    public setAccelerometerEnabled (isEnable: boolean) {
        if (isEnable) {
            this._accelerometer.start();
        } else {
            this._accelerometer.stop();
        }
    }
    public setAccelerometerInterval (intervalInMileSeconds: number): void {
        this._accelerometer.setInterval(intervalInMileSeconds);
    }
    // #endregion Accelerometer
}

export const inputManager = new InputManager();
