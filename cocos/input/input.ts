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

import { EDITOR } from 'internal:constants';
import { TouchInputSource, MouseInputSource, KeyboardInputSource, AccelerometerInputSource } from 'pal/input';
import { touchManager } from '../../pal/input/touch-manager';
import { EventTarget } from '../core/event/event-target';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch, Touch } from './types';
import { InputEventType } from './types/event-enum';

const pointerEventTypeMap = {
    [InputEventType.MOUSE_DOWN]: InputEventType.TOUCH_START,
    [InputEventType.MOUSE_MOVE]: InputEventType.TOUCH_MOVE,
    [InputEventType.MOUSE_UP]: InputEventType.TOUCH_END,
};

export declare namespace Input {
    export type EventType = EnumAlias<typeof InputEventType>;
}

interface InputEventMap {
    [Input.EventType.MOUSE_DOWN]: (event: EventMouse) => void,
    [Input.EventType.MOUSE_MOVE]: (event: EventMouse) => void,
    [Input.EventType.MOUSE_UP]: (event: EventMouse) => void,
    [Input.EventType.MOUSE_WHEEL]: (event: EventMouse) => void,
    [Input.EventType.TOUCH_START]: (event: EventTouch) => void,
    [Input.EventType.TOUCH_MOVE]: (event: EventTouch) => void,
    [Input.EventType.TOUCH_END]: (event: EventTouch) => void,
    [Input.EventType.TOUCH_CANCEL]: (event: EventTouch) => void,
    [Input.EventType.KEY_DOWN]: (event: EventKeyboard) => void,
    [Input.EventType.KEY_PRESSING]: (event: EventKeyboard) => void,
    [Input.EventType.KEY_UP]: (event: EventKeyboard) => void,
    [Input.EventType.DEVICEMOTION]: (event: EventAcceleration) => void,
}

/**
 * @en
 * This Input class manages all events of input. include: touch, mouse, accelerometer and keyboard.
 * You can get the `Input` instance with `input`.
 *
 * @zh
 * 该输入类管理所有的输入事件，包括：触摸、鼠标、加速计 和 键盘。
 * 你可以通过 `input` 获取到 `Input` 的实例。
 *
 * @example
 * ```
 * input.on(Input.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * input.off(Input.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 */
export class Input {
    /**
     * @en The input event type
     * @zh 输入事件类型
     */
    public static EventType = InputEventType;
    private static _inputList: Input[] = [];
    private _emitTouch = false;  // HACK: TouchEvent callback has a touch parameter to emit in systemEvent module.

    private _eventTarget: EventTarget = new EventTarget();
    private _touchInput = new TouchInputSource();
    private _mouseInput = new MouseInputSource();
    private _keyboardInput = new KeyboardInputSource();
    private _accelerometerInput = new AccelerometerInputSource();

    private _eventTouchList: EventTouch[] = [];
    private _eventMouseList: EventMouse[] = [];
    private _eventKeyboardList: EventKeyboard[] = [];
    private _eventAccelerationList: EventAcceleration[] = [];

    private _needSimulateTouchMoveEvent = false;

    constructor () {
        this._registerEvent();
        Input._inputList.push(this);
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
        if (eventType === InputEventType.TOUCH_END) {
            touchManager.releaseTouch(touchID);
        }
        this._eventTouchList.push(eventTouch);
    }

    private _registerEvent () {
        if (this._touchInput.support) {
            const eventTouchList = this._eventTouchList;
            this._touchInput.on(InputEventType.TOUCH_START, (event) => { eventTouchList.push(event); });
            this._touchInput.on(InputEventType.TOUCH_MOVE, (event) => { eventTouchList.push(event); });
            this._touchInput.on(InputEventType.TOUCH_END, (event) => { eventTouchList.push(event); });
            this._touchInput.on(InputEventType.TOUCH_CANCEL, (event) => { eventTouchList.push(event); });
        }

        if (this._mouseInput.support) {
            const eventMouseList = this._eventMouseList;
            this._mouseInput.on(InputEventType.MOUSE_DOWN, (event) => {
                this._needSimulateTouchMoveEvent = true;
                this._simulateEventTouch(event);
                eventMouseList.push(event);
            });
            this._mouseInput.on(InputEventType.MOUSE_MOVE, (event) => {
                if (this._needSimulateTouchMoveEvent) {
                    this._simulateEventTouch(event);
                }
                eventMouseList.push(event);
            });
            this._mouseInput.on(InputEventType.MOUSE_UP, (event) => {
                this._needSimulateTouchMoveEvent = false;
                this._simulateEventTouch(event);
                eventMouseList.push(event);
            });
            this._mouseInput.on(InputEventType.MOUSE_WHEEL, (event) => { eventMouseList.push(event); });
        }

        if (this._keyboardInput.support) {
            const eventKeyboardList = this._eventKeyboardList;
            this._keyboardInput.on(InputEventType.KEY_DOWN, (event) => { eventKeyboardList.push(event); });
            this._keyboardInput.on(InputEventType.KEY_PRESSING, (event) => { eventKeyboardList.push(event); });
            this._keyboardInput.on(InputEventType.KEY_UP, (event) => { eventKeyboardList.push(event); });
        }

        if (this._accelerometerInput.support) {
            const eventAccelerationList = this._eventAccelerationList;
            this._accelerometerInput.on(InputEventType.DEVICEMOTION, (event) => { eventAccelerationList.push(event); });
        }
    }

    private _clearEvents () {
        this._eventMouseList.length = 0;
        this._eventTouchList.length = 0;
        this._eventKeyboardList.length = 0;
        this._eventAccelerationList.length = 0;
    }

    private _frameDispatchEvents () {
        const length = Input._inputList.length;
        const inputList = Input._inputList;
        for (let i = 0; i < length; ++i) {
            const input = inputList[i];

            const eventMouseList = input._eventMouseList;
            // TODO: culling event queue
            for (let i = 0, length = eventMouseList.length; i < length; ++i) {
                const eventMouse = eventMouseList[i];
                input._eventTarget.emit(eventMouse.type, eventMouse);
            }

            const eventTouchList = input._eventTouchList;
            // TODO: culling event queue
            for (let i = 0, length = eventTouchList.length; i < length; ++i) {
                const eventTouch = eventTouchList[i];
                const touches = eventTouch.getTouches();
                const touchesLength = touches.length;
                for (let j = 0; j < touchesLength; ++j) {
                    eventTouch.touch = touches[j];
                    eventTouch.propagationStopped = eventTouch.propagationImmediateStopped = false;
                    if (input._emitTouch) {
                        // TODO: deprecate EventTouch.touch property
                        input._eventTarget.emit(eventTouch.type, eventTouch.touch, eventTouch);
                    } else {
                        input._eventTarget.emit(eventTouch.type, eventTouch);
                    }
                }
            }

            const eventKeyboardList = input._eventKeyboardList;
            // TODO: culling event queue
            for (let i = 0, length = eventKeyboardList.length; i < length; ++i) {
                const eventKeyboard = eventKeyboardList[i];
                input._eventTarget.emit(eventKeyboard.type, eventKeyboard);
            }

            const eventAccelerationList = input._eventAccelerationList;
            // TODO: culling event queue
            for (let i = 0, length = eventAccelerationList.length; i < length; ++i) {
                const eventAcceleration = eventAccelerationList[i];
                input._eventTarget.emit(eventAcceleration.type, eventAcceleration);
            }

            input._clearEvents();
        }
    }

    /**
     * @en
     * Register a callback of a specific input event type.
     * @zh
     * 注册特定的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public on<K extends keyof InputEventMap> (eventType: K, callback: InputEventMap[K], target?: any) {
        if (EDITOR) {
            return callback;
        }
        this._eventTarget.on(eventType, callback, target);
        return callback;
    }

    /**
     * @en
     * Register a callback of a specific input event type once.
     * @zh
     * 注册单次的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public once<K extends keyof InputEventMap> (eventType: K, callback: InputEventMap[K], target?: any) {
        if (EDITOR) {
            return callback;
        }
        this._eventTarget.once(eventType, callback, target);
        return callback;
    }

    /**
     * @en
     * Unregister a callback of a specific input event type.
     * @zh
     * 取消注册特定的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public off<K extends keyof InputEventMap> (eventType: K, callback?: InputEventMap[K], target?: any) {
        if (EDITOR) {
            return;
        }
        this._eventTarget.off(eventType, callback, target);
    }
    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (EDITOR) {
            return;
        }
        if (isEnable) {
            this._accelerometerInput.start();
        } else {
            this._accelerometerInput.stop();
        }
    }

    /**
     * @en
     * Sets the accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     */
    public setAccelerometerInterval (intervalInMileSeconds: number): void {
        if (EDITOR) {
            return;
        }
        this._accelerometerInput.setInterval(intervalInMileSeconds);
    }
}

/**
 * @en
 * The singleton of the Input class, this singleton manages all events of input. include: touch, mouse, accelerometer and keyboard.
 *
 * @zh
 * 输入类单例，该单例管理所有的输入事件，包括：触摸、鼠标、加速计 和 键盘。
 *
 * @example
 * ```
 * input.on(Input.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * input.off(Input.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 */
export const input = new Input();
