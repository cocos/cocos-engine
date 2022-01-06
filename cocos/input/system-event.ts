/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

/**
 * @packageDocumentation
 * @module event
 */

import { EventTarget } from '../core/event';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch, SystemEventType, Touch } from './types';
import { input, Input } from './input';
import { legacyCC } from '../core/global-exports';
import { InputEventType } from './types/event-enum';

export const pointerEvent2SystemEvent = {
    [InputEventType.TOUCH_START]: `system-event-${InputEventType.TOUCH_START}`,
    [InputEventType.TOUCH_MOVE]: `system-event-${InputEventType.TOUCH_MOVE}`,
    [InputEventType.TOUCH_END]: `system-event-${InputEventType.TOUCH_END}`,
    [InputEventType.TOUCH_CANCEL]: `system-event-${InputEventType.TOUCH_CANCEL}`,
    [InputEventType.MOUSE_DOWN]: `system-event-${InputEventType.MOUSE_DOWN}`,
    [InputEventType.MOUSE_MOVE]: `system-event-${InputEventType.MOUSE_MOVE}`,
    [InputEventType.MOUSE_UP]: `system-event-${InputEventType.MOUSE_UP}`,
    [InputEventType.MOUSE_WHEEL]: `system-event-${InputEventType.MOUSE_WHEEL}`,
};

export declare namespace SystemEvent {
    /**
     * @en The event type supported by SystemEvent and Node events
     * @zh SystemEvent 支持的事件类型以及节点事件类型
     */
    export type EventType = EnumAlias<typeof SystemEventType>;
}

const inputEvents = Object.values(InputEventType);

interface SystemEventMap {
    [SystemEvent.EventType.MOUSE_DOWN]: (event: EventMouse) => void,
    [SystemEvent.EventType.MOUSE_MOVE]: (event: EventMouse) => void,
    [SystemEvent.EventType.MOUSE_UP]: (event: EventMouse) => void,
    [SystemEvent.EventType.MOUSE_WHEEL]: (event: EventMouse) => void,
    [SystemEvent.EventType.TOUCH_START]: (touch: Touch, event: EventTouch) => void,
    [SystemEvent.EventType.TOUCH_MOVE]: (touch: Touch, event: EventTouch) => void,
    [SystemEvent.EventType.TOUCH_END]: (touch: Touch, event: EventTouch) => void,
    [SystemEvent.EventType.TOUCH_CANCEL]: (touch: Touch, event: EventTouch) => void,
    [SystemEvent.EventType.KEY_DOWN]: (event: EventKeyboard) => void,
    [SystemEvent.EventType.KEY_UP]: (event: EventKeyboard) => void,
    [SystemEvent.EventType.DEVICEMOTION]: (event: EventAcceleration) => void,
}

/**
 * @en
 * The System event, it currently supports keyboard events and accelerometer events.<br/>
 * You can get the `SystemEvent` instance with `systemEvent`.<br/>
 * @zh
 * 系统事件，它目前支持按键事件和重力感应事件。<br/>
 * 你可以通过 `systemEvent` 获取到 `SystemEvent` 的实例。<br/>
 *
 * @deprecated since v3.4.0, please use Input class instead.
 *
 * @example
 * ```
 * import { systemEvent, SystemEvent } from 'cc';
 * systemEvent.on(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * systemEvent.off(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 */

export class SystemEvent extends EventTarget {
    public static EventType = SystemEventType;

    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */
    public setAccelerometerEnabled (isEnabled: boolean) {
        input.setAccelerometerEnabled(isEnabled);
    }

    /**
     * @en
     * Sets the accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     */
    public setAccelerometerInterval (interval: number) {
        input.setAccelerometerInterval(interval);
    }

    /**
     * @en
     * Register an callback of a specific system event type.
     * @zh
     * 注册特定事件类型回调。
     *
     * @param type - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     * @param once - Register the event listener once
     */
    // @ts-expect-error Property 'on' in type 'SystemEvent' is not assignable to the same property in base type
    public on<K extends keyof SystemEventMap> (type: K, callback: SystemEventMap[K], target?: any, once?: boolean) {
        const registerMethod = once ? input.once : input.on;
        // @ts-expect-error wrong type mapping
        if (inputEvents.includes(type)) {
            // @ts-expect-error wrong type mapping
            const mappedPointerType = pointerEvent2SystemEvent[type];
            if (mappedPointerType) {
                // @ts-expect-error wrong type mapping
                registerMethod.call(input, mappedPointerType, callback, target);
            } else if (type === SystemEventType.KEY_DOWN) {
                // @ts-expect-error wrong mapped type
                registerMethod.call(input, InputEventType.KEY_DOWN, callback, target);
                // @ts-expect-error wrong mapped type
                registerMethod.call(input, InputEventType.KEY_PRESSING, callback, target, once);
            } else {
                // @ts-expect-error wrong type mapping
                registerMethod.call(input, type, callback, target);
            }
        } else {
            super.on(type, callback, target, once);
        }
        return callback;
    }

    /**
     * @en
     * Removes the listeners previously registered with the same type, callback, target and or useCapture,
     * if only type is passed as parameter, all listeners registered with that type will be removed.
     * @zh
     * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     *
     * @param type - A string representing the event type being removed.
     * @param callback - The callback to remove.
     * @param target - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     */
    public off<K extends keyof SystemEventMap> (type: K, callback?: SystemEventMap[K], target?: any) {
        // @ts-expect-error wrong type mapping
        if (inputEvents.includes(type)) {
            // @ts-expect-error wrong type mapping
            const mappedPointerType = pointerEvent2SystemEvent[type];
            if (mappedPointerType) {
                input.off(mappedPointerType, callback, target);
            } else if (type === SystemEventType.KEY_DOWN) {
                // @ts-expect-error wrong mapped type
                input.off(InputEventType.KEY_DOWN, callback, target);
                // @ts-expect-error wrong mapped type
                input.off(InputEventType.KEY_PRESSING, callback, target);
            // eslint-disable-next-line brace-style
            } else {
                // @ts-expect-error wrong type mapping
                input.off(type, callback, target);
            }
        } else {
            super.off(type, callback, target);
        }
    }
}

legacyCC.SystemEvent = SystemEvent;
/**
 * @module cc
 */

/**
 * @en The singleton of the SystemEvent, there should only be one instance to be used globally
 * @zh 系统事件单例，方便全局使用。
 *
 * @deprecated since v3.4.0, please use input instead.
 */
export const systemEvent = new SystemEvent();
legacyCC.systemEvent = systemEvent;
