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

    private _eventTouchList: EventTouch[] = [];
    private _eventMouseList: EventMouse[] = [];
    private _eventKeyboardList: EventKeyboard[] = [];
    private _eventAccelerationList: EventAcceleration[] = [];

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
        this._eventTouchList.push(eventTouch);
    }

    private _registerEvent () {
        if (this._touch.support) {
            const eventTouchList = this._eventTouchList;
            this._touch.onStart((event) => { eventTouchList.push(event); });
            this._touch.onMove((event) => { eventTouchList.push(event); });
            this._touch.onEnd((event) => { eventTouchList.push(event); });
            this._touch.onCancel((event) => { eventTouchList.push(event); });
        }

        if (this._mouse.support) {
            const eventMouseList = this._eventMouseList;
            this._mouse.onDown((event) => {
                this._needSimulateTouchMoveEvent = true;
                this._simulateEventTouch(event);
                eventMouseList.push(event);
            });
            this._mouse.onMove((event) => {
                if (this._needSimulateTouchMoveEvent) {
                    this._simulateEventTouch(event);
                }
                eventMouseList.push(event);
            });
            this._mouse.onUp((event) => {
                this._needSimulateTouchMoveEvent = false;
                this._simulateEventTouch(event);
                eventMouseList.push(event);
            });
            this._mouse.onWheel((event) => { eventMouseList.push(event); });
        }

        if (this._keyboard.support) {
            const eventKeyboardList = this._eventKeyboardList;
            // this._keyboard.onDown((event) => { keyboardEvents.push(event); });
            this._keyboard.onPressing((event) => { eventKeyboardList.push(event); });
            this._keyboard.onUp((event) => { eventKeyboardList.push(event); });
        }

        if (this._accelerometer.support) {
            const eventAccelerationList = this._eventAccelerationList;
            this._accelerometer.onChange((event) => { eventAccelerationList.push(event); });
        }
    }

    /**
     * Clear events when game is resumed.
     */
    public clearEvents () {
        this._eventMouseList.length = 0;
        this._eventTouchList.length = 0;
        this._eventKeyboardList.length = 0;
        this._eventAccelerationList.length = 0;
    }

    public frameDispatchEvents () {
        const eventMouseList = this._eventMouseList;
        // TODO: culling event queue
        for (let i = 0, length = eventMouseList.length; i < length; ++i) {
            const eventMouse = eventMouseList[i];
            eventManager.dispatchEvent(eventMouse);
        }

        const eventTouchList = this._eventTouchList;
        // TODO: culling event queue
        for (let i = 0, length = eventTouchList.length; i < length; ++i) {
            const eventTouch = eventTouchList[i];
            eventManager.dispatchEvent(eventTouch);
        }

        const eventKeyboardList = this._eventKeyboardList;
        // TODO: culling event queue
        for (let i = 0, length = eventKeyboardList.length; i < length; ++i) {
            const eventKeyboard = eventKeyboardList[i];
            eventManager.dispatchEvent(eventKeyboard);
        }

        const eventAccelerationList = this._eventAccelerationList;
        // TODO: culling event queue
        for (let i = 0, length = eventAccelerationList.length; i < length; ++i) {
            const eventAcceleration = eventAccelerationList[i];
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
