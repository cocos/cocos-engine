/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { EventTarget, cclegacy } from '../core';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch, SystemEventType, Touch } from './types';
import { input } from './input';
import { InputEventType } from './types/event-enum';

export declare namespace SystemEvent {
    /**
     * @en The event type supported by SystemEvent and Node events
     * @zh SystemEvent 支持的事件类型以及节点事件类型
     */
    export type EventType = EnumAlias<typeof SystemEventType>;
}

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

    constructor () {
        super();

        input.on(InputEventType.MOUSE_DOWN, (e): void => { this.emit(SystemEventType.MOUSE_DOWN, e);  });
        input.on(InputEventType.MOUSE_MOVE, (e): void => { this.emit(SystemEventType.MOUSE_MOVE, e);  });
        input.on(InputEventType.MOUSE_UP, (e): void => { this.emit(SystemEventType.MOUSE_UP, e);  });
        input.on(InputEventType.MOUSE_WHEEL, (e): void => { this.emit(SystemEventType.MOUSE_WHEEL, e);  });

        input.on(InputEventType.TOUCH_START, (e): void => { this.emit(SystemEventType.TOUCH_START, e.touch, e);  });
        input.on(InputEventType.TOUCH_MOVE, (e): void => { this.emit(SystemEventType.TOUCH_MOVE, e.touch, e);  });
        input.on(InputEventType.TOUCH_END, (e): void => { this.emit(SystemEventType.TOUCH_END, e.touch, e);  });
        input.on(InputEventType.TOUCH_CANCEL, (e): void => { this.emit(SystemEventType.TOUCH_CANCEL, e.touch, e);  });

        input.on(InputEventType.KEY_DOWN, (e): void => { this.emit(SystemEventType.KEY_DOWN, e);  });
        input.on(InputEventType.KEY_PRESSING, (e): void => { this.emit(SystemEventType.KEY_DOWN, e);  });
        input.on(InputEventType.KEY_UP, (e): void => { this.emit(SystemEventType.KEY_UP, e);  });

        input.on(InputEventType.DEVICEMOTION, (e): void => { this.emit(SystemEventType.DEVICEMOTION, e);  });
    }
    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */
    public setAccelerometerEnabled (isEnabled: boolean): void {
        input.setAccelerometerEnabled(isEnabled);
    }

    /**
     * @en
     * Sets the accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     */
    public setAccelerometerInterval (interval: number): void {
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
    public on<TFunction extends (...any) => void>(type: string, callback: TFunction, target?: unknown, once?: boolean): TFunction {
        super.on(type, callback, target, once);
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
    public off<K extends keyof SystemEventMap> (type: K, callback?: SystemEventMap[K], target?: any): void {
        super.off(type, callback, target);
    }
}

cclegacy.SystemEvent = SystemEvent;
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
cclegacy.systemEvent = systemEvent;
