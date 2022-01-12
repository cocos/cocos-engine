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

import { EDITOR, NATIVE } from 'internal:constants';
import { TouchInputSource, MouseInputSource, KeyboardInputSource, AccelerometerInputSource } from 'pal/input';
import { touchManager } from '../../pal/input/touch-manager';
import { sys } from '../core/platform/sys';
import { EventTarget } from '../core/event/event-target';
import { Event, EventAcceleration, EventKeyboard, EventMouse, EventTouch, Touch } from './types';
import { InputEventType } from './types/event-enum';

export enum EventDispatcherPriority {
    GLOBAL = 0,
    UI = 1,
}

export interface IEventDispatcher {
    /**
     * Priority to emit event to dispatcher
     */
    readonly priority: EventDispatcherPriority;
    /**
     * @param event
     * @returns Whether dispatch to next event dispatcher
     */
    dispatchEvent (event: Event): boolean;
}

class InputEventDispatcher implements IEventDispatcher {
    private _inputEventTarget: EventTarget;
    priority: EventDispatcherPriority = EventDispatcherPriority.GLOBAL;
    constructor (inputEventTarget: EventTarget) {
        this._inputEventTarget = inputEventTarget;
    }
    dispatchEvent (event: Event): boolean {
        this._inputEventTarget.emit(event.type, event);
        return true;
    }
}

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

    /**
     * @en Dispatch input event immediately.
     * The input events are collocted to be dispatched in each main loop by default.
     * If you need to recieve the input event immediately, please set this to true.
     * NOTE: if set this to true, the input events are dispatched between each tick, the input event can't be optimized by engine.
     *
     * @zh 立即派发输入事件。
     * 输入事件默认会被收集到每一帧主循环里派发，如果你需要立即接收到输入事件，请把该属性设为 true。
     * 注意：如果设置为 true，则输入事件可能会在帧间触发，这样的输入事件是没办法被引擎优化的。
     */
    private _dispatchImmediately = !NATIVE;

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

    private _inputEventDispatcher: InputEventDispatcher;
    private _eventDispatcherList: IEventDispatcher[] = [];

    constructor () {
        this._registerEvent();
        this._inputEventDispatcher = new InputEventDispatcher(this._eventTarget);
        this._registerEventDispatcher(this._inputEventDispatcher);
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
        this._dispatchOrPushEventTouch(eventTouch, this._eventTouchList);
    }

    // TODO: public in engine
    private _registerEventDispatcher (eventDispatcher: IEventDispatcher) {
        this._eventDispatcherList.push(eventDispatcher);
        this._eventDispatcherList.sort((a, b) => b.priority - a.priority);
    }

    private _emitEvent (event: Event) {
        const length = this._eventDispatcherList.length;
        for (let i = 0; i < length; ++i) {
            const dispatcher = this._eventDispatcherList[i];
            if (!dispatcher.dispatchEvent(event)) {
                break;
            }
        }
    }

    private _registerEvent () {
        if (sys.hasFeature(sys.Feature.INPUT_TOUCH)) {
            const eventTouchList = this._eventTouchList;
            this._touchInput.on(InputEventType.TOUCH_START, (event) => { this._dispatchOrPushEventTouch(event, eventTouchList); });
            this._touchInput.on(InputEventType.TOUCH_MOVE, (event) => { this._dispatchOrPushEventTouch(event, eventTouchList); });
            this._touchInput.on(InputEventType.TOUCH_END, (event) => { this._dispatchOrPushEventTouch(event, eventTouchList); });
            this._touchInput.on(InputEventType.TOUCH_CANCEL, (event) => { this._dispatchOrPushEventTouch(event, eventTouchList); });
        }

        if (sys.hasFeature(sys.Feature.EVENT_MOUSE)) {
            const eventMouseList = this._eventMouseList;
            this._mouseInput.on(InputEventType.MOUSE_DOWN, (event) => {
                this._needSimulateTouchMoveEvent = true;
                this._simulateEventTouch(event);
                this._dispatchOrPushEvent(event, eventMouseList);
            });
            this._mouseInput.on(InputEventType.MOUSE_MOVE, (event) => {
                if (this._needSimulateTouchMoveEvent) {
                    this._simulateEventTouch(event);
                }
                this._dispatchOrPushEvent(event, eventMouseList);
            });
            this._mouseInput.on(InputEventType.MOUSE_UP, (event) => {
                this._needSimulateTouchMoveEvent = false;
                this._simulateEventTouch(event);
                this._dispatchOrPushEvent(event, eventMouseList);
            });
            this._mouseInput.on(InputEventType.MOUSE_WHEEL, (event) => { this._dispatchOrPushEvent(event, eventMouseList); });
        }

        if (sys.hasFeature(sys.Feature.EVENT_KEYBOARD)) {
            const eventKeyboardList = this._eventKeyboardList;
            this._keyboardInput.on(InputEventType.KEY_DOWN, (event) => { this._dispatchOrPushEvent(event, eventKeyboardList); });
            this._keyboardInput.on(InputEventType.KEY_PRESSING, (event) => { this._dispatchOrPushEvent(event, eventKeyboardList); });
            this._keyboardInput.on(InputEventType.KEY_UP, (event) => { this._dispatchOrPushEvent(event, eventKeyboardList); });
        }

        if (sys.hasFeature(sys.Feature.EVENT_ACCELEROMETER)) {
            const eventAccelerationList = this._eventAccelerationList;
            this._accelerometerInput.on(InputEventType.DEVICEMOTION, (event) => { this._dispatchOrPushEvent(event, eventAccelerationList); });
        }
    }

    private _clearEvents () {
        this._eventMouseList.length = 0;
        this._eventTouchList.length = 0;
        this._eventKeyboardList.length = 0;
        this._eventAccelerationList.length = 0;
    }

    private _dispatchOrPushEvent (event: Event, eventList: Event[]) {
        if (this._dispatchImmediately) {
            this._emitEvent(event);
        } else {
            eventList.push(event);
        }
    }

    private _dispatchOrPushEventTouch (eventTouch: EventTouch, touchEventList: EventTouch[]) {
        if (this._dispatchImmediately) {
            const touches = eventTouch.getTouches();
            const touchesLength = touches.length;
            for (let i = 0; i < touchesLength; ++i) {
                eventTouch.touch = touches[i];
                eventTouch.propagationStopped = eventTouch.propagationImmediateStopped = false;
                this._emitEvent(eventTouch);
            }
        } else {
            touchEventList.push(eventTouch);
        }
    }

    private _frameDispatchEvents () {
        const eventMouseList = this._eventMouseList;
        // TODO: culling event queue
        for (let i = 0, length = eventMouseList.length; i < length; ++i) {
            const eventMouse = eventMouseList[i];
            this._emitEvent(eventMouse);
        }

        const eventTouchList = this._eventTouchList;
        // TODO: culling event queue
        for (let i = 0, length = eventTouchList.length; i < length; ++i) {
            const eventTouch = eventTouchList[i];
            const touches = eventTouch.getTouches();
            const touchesLength = touches.length;
            for (let j = 0; j < touchesLength; ++j) {
                eventTouch.touch = touches[j];
                eventTouch.propagationStopped = eventTouch.propagationImmediateStopped = false;
                this._emitEvent(eventTouch);
            }
        }

        const eventKeyboardList = this._eventKeyboardList;
        // TODO: culling event queue
        for (let i = 0, length = eventKeyboardList.length; i < length; ++i) {
            const eventKeyboard = eventKeyboardList[i];
            this._emitEvent(eventKeyboard);
        }

        const eventAccelerationList = this._eventAccelerationList;
        // TODO: culling event queue
        for (let i = 0, length = eventAccelerationList.length; i < length; ++i) {
            const eventAcceleration = eventAccelerationList[i];
            this._emitEvent(eventAcceleration);
        }

        this._clearEvents();
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
