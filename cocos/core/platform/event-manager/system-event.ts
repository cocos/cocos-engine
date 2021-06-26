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

import { EDITOR } from 'internal:constants';
import { EventTarget } from '../../event/event-target';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch } from './events';
import { DeviceEvent, KeyboardEvent, MouseEvent, SystemEventType, TouchEvent } from './event-enum';
import { EventListener } from './event-listener';
import eventManager from './event-manager';
import inputManager from './input-manager';
import { Touch } from './touch';
import { legacyCC } from '../../global-exports';
import { logID, warnID } from '../debug';
import { KeyCode } from './key-code';

let keyboardListener: EventListener | null = null;
let accelerationListener: EventListener | null = null;
let touchListener: EventListener | null = null;
let mouseListener: EventListener | null = null;

/**
* @en
* The System event, it currently supports keyboard events and accelerometer events.<br/>
* You can get the `SystemEvent` instance with `systemEvent`.<br/>
* @zh
* 系统事件，它目前支持按键事件和重力感应事件。<br/>
* 你可以通过 `systemEvent` 获取到 `SystemEvent` 的实例。<br/>
* @example
* ```
* import { systemEvent, SystemEvent } from 'cc';
* systemEvent.on(SystemEvent.DeviceEvent.DEVICEMOTION, this.onDeviceMotionEvent, this);
* systemEvent.off(SystemEvent.DeviceEvent.DEVICEMOTION, this.onDeviceMotionEvent, this);
* ```
*/

export class SystemEvent extends EventTarget {
    /**
     * @en The event type supported by SystemEvent and Node events
     * @zh SystemEvent 支持的事件类型以及节点事件类型
     *
     * @deprecated since v3.3, please use SystemEvent.TouchEvent, SystemEvent.MouseEvent, SystemEvent.KeyboardEvent, SystemEvent.DeviceEvent and Node.EventType instead
     */
    public static EventType = SystemEventType;

    public static TouchEvent = TouchEvent;
    public static MouseEvent = MouseEvent;
    public static KeyboardEvent = KeyboardEvent;
    public static DeviceEvent = DeviceEvent;

    /**
     * @en Enum type of keyCode for key event
     * @zh 按键事件的按键码
     */
    public static KeyCode = KeyCode;

    constructor () {
        super();
    }
    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */
    public setAccelerometerEnabled (isEnabled: boolean) {
        if (EDITOR) {
            return;
        }

        // for iOS 13+
        if (isEnabled && window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then((response) => {
                logID(3520, response);
                inputManager.setAccelerometerEnabled(response === 'granted');
            }).catch((error) => {
                warnID(3521, error.message);
                inputManager.setAccelerometerEnabled(false);
            });
        } else {
            inputManager.setAccelerometerEnabled(isEnabled);
        }
    }

    /**
     * @en
     * Sets the accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     */
    public setAccelerometerInterval (interval: number) {
        if (EDITOR) {
            return;
        }
        inputManager.setAccelerometerInterval(interval);
    }

    public on (type: KeyboardEvent, callback: (event: EventKeyboard) => void, target?: unknown);
    public on (type: MouseEvent, callback: (event: EventMouse) => void, target?: unknown);
    public on (type: TouchEvent, callback: (touch: Touch, event: EventTouch) => void, target?: unknown);
    public on (type: DeviceEvent, callback: (event: EventAcceleration) => void, target?: unknown);
    // #region deprecated
    public on (type: SystemEventType.KEY_DOWN | SystemEventType.KEY_UP, callback: (event: EventKeyboard) => void, target?: unknown);
    public on (type: SystemEventType.MOUSE_DOWN | SystemEventType.MOUSE_MOVE | SystemEventType.MOUSE_UP | SystemEventType.MOUSE_WHEEL,
        callback: (event: EventMouse) => void, target?: unknown);
    public on (type: SystemEventType.TOUCH_START | SystemEventType.TOUCH_MOVE | SystemEventType.TOUCH_END | SystemEventType.TOUCH_CANCEL,
        callback: (touch: Touch, event: EventTouch) => void, target?: unknown);
    public on (type: SystemEventType.DEVICEMOTION, callback: (event: EventAcceleration) => void, target?: unknown);
    // #endregion deprecated
    /**
     * @en
     * Register an callback of a specific system event type.
     * @zh
     * 注册特定事件类型回调。
     *
     * @param type - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public on<TFunction extends (...any) => void> (type: string, callback: TFunction, target?, once?: boolean) {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            return;
        }
        super.on(type, callback, target, once);

        // Keyboard
        if (type === KeyboardEvent.KEY_DOWN || type === 'keydown' || type === KeyboardEvent.KEY_UP) {
            if (!keyboardListener) {
                keyboardListener = EventListener.create({
                    event: EventListener.KEYBOARD,
                    onKeyDown (keyCode: number, event: EventKeyboard) {
                        systemEvent.emit(event.type, event);
                    },
                    // deprecated
                    onKeyPressed (keyCode: number, event: EventKeyboard) {
                        systemEvent.emit(event.type, event);
                    },
                    onKeyReleased (keyCode: number, event: EventKeyboard) {
                        systemEvent.emit(event.type, event);
                    },
                });
                eventManager.addListener(keyboardListener, 256);
            }
        }

        // Acceleration
        if (type === DeviceEvent.DEVICEMOTION) {
            if (!accelerationListener) {
                accelerationListener = EventListener.create({
                    event: EventListener.ACCELERATION,
                    callback (acc: any, event: EventAcceleration) {
                        legacyCC.systemEvent.emit(event.type, event);
                    },
                });
                eventManager.addListener(accelerationListener, 256);
            }
        }

        // touch
        if (type === TouchEvent.TOUCH_START
            || type === TouchEvent.TOUCH_MOVE
            || type === TouchEvent.TOUCH_END
            || type === TouchEvent.TOUCH_CANCEL
        ) {
            if (!touchListener) {
                touchListener = EventListener.create({
                    event: EventListener.TOUCH_ONE_BY_ONE,
                    onTouchBegan (touch: Touch, event: EventTouch) {
                        legacyCC.systemEvent.emit(event.type, touch, event);
                        return true;
                    },
                    onTouchMoved (touch: Touch, event: EventTouch) {
                        legacyCC.systemEvent.emit(event.type, touch, event);
                    },
                    onTouchEnded (touch: Touch, event: EventTouch) {
                        legacyCC.systemEvent.emit(event.type, touch, event);
                    },
                    onTouchCancelled (touch: Touch, event: EventTouch) {
                        legacyCC.systemEvent.emit(event.type, touch, event);
                    },
                });
                eventManager.addListener(touchListener, 256);
            }
        }

        // mouse
        if (type === MouseEvent.MOUSE_DOWN
            || type === MouseEvent.MOUSE_MOVE
            || type === MouseEvent.MOUSE_UP
            || type === MouseEvent.MOUSE_WHEEL
        ) {
            if (!mouseListener) {
                mouseListener = EventListener.create({
                    event: EventListener.MOUSE,
                    onMouseDown (event: EventMouse) {
                        legacyCC.systemEvent.emit(event.type, event);
                    },
                    onMouseMove (event:EventMouse) {
                        legacyCC.systemEvent.emit(event.type, event);
                    },
                    onMouseUp (event: EventMouse) {
                        legacyCC.systemEvent.emit(event.type, event);
                    },
                    onMouseScroll (event: EventMouse) {
                        legacyCC.systemEvent.emit(event.type, event);
                    },
                });
                eventManager.addListener(mouseListener, 256);
            }
        }
    }

    public off (type: KeyboardEvent, callback?: (event: EventKeyboard) => void, target?: unknown);
    public off (type: MouseEvent, callback?: (event: EventMouse) => void, target?: unknown);
    public off (type: TouchEvent, callback?: (touch: Touch, event: EventTouch) => void, target?: unknown);
    public off (type: DeviceEvent, callback?: (event: EventAcceleration) => void, target?: unknown);
    // #region deprecated
    public off (type: SystemEventType.KEY_DOWN | SystemEventType.KEY_UP, callback?: (event: EventKeyboard) => void, target?: unknown);
    public off (type: SystemEventType.MOUSE_DOWN | SystemEventType.MOUSE_MOVE | SystemEventType.MOUSE_UP | SystemEventType.MOUSE_WHEEL,
        callback?: (event: EventMouse) => void, target?: unknown);
    public off (type: SystemEventType.TOUCH_START | SystemEventType.TOUCH_MOVE | SystemEventType.TOUCH_END | SystemEventType.TOUCH_CANCEL,
        callback?: (touch: Touch, event: EventTouch) => void, target?: unknown);
    public off (type: SystemEventType.DEVICEMOTION, callback?: (event: EventAcceleration) => void, target?: unknown);
    // #endregion deprecated
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
    public off (type: string, callback?: (...any) => void, target?) {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            return;
        }
        super.off(type, callback, target);

        // Keyboard
        if (keyboardListener && (type === KeyboardEvent.KEY_DOWN || type === 'keydown' || type === KeyboardEvent.KEY_UP)) {
            const hasKeyDownEventListener = this.hasEventListener(KeyboardEvent.KEY_DOWN);
            const hasKeyPressingEventListener = this.hasEventListener('keydown');  // SystemEventType.KEY_DOWN
            const hasKeyUpEventListener = this.hasEventListener(KeyboardEvent.KEY_UP);
            if (!hasKeyDownEventListener && !hasKeyPressingEventListener && !hasKeyUpEventListener) {
                eventManager.removeListener(keyboardListener);
                keyboardListener = null;
            }
        }

        // Acceleration
        if (accelerationListener && type === DeviceEvent.DEVICEMOTION) {
            eventManager.removeListener(accelerationListener);
            accelerationListener = null;
        }

        if (touchListener && (type === TouchEvent.TOUCH_START || type === TouchEvent.TOUCH_MOVE
            || type === TouchEvent.TOUCH_END || type === TouchEvent.TOUCH_CANCEL)
        ) {
            const hasTouchStart = this.hasEventListener(TouchEvent.TOUCH_START);
            const hasTouchMove = this.hasEventListener(TouchEvent.TOUCH_MOVE);
            const hasTouchEnd = this.hasEventListener(TouchEvent.TOUCH_END);
            const hasTouchCancel = this.hasEventListener(TouchEvent.TOUCH_CANCEL);
            if (!hasTouchStart && !hasTouchMove && !hasTouchEnd && !hasTouchCancel) {
                eventManager.removeListener(touchListener);
                touchListener = null;
            }
        }

        if (mouseListener && (type === MouseEvent.MOUSE_DOWN || type === MouseEvent.MOUSE_MOVE
            || type === MouseEvent.MOUSE_UP || type === MouseEvent.MOUSE_WHEEL)
        ) {
            const hasMouseDown = this.hasEventListener(MouseEvent.MOUSE_DOWN);
            const hasMouseMove = this.hasEventListener(MouseEvent.MOUSE_MOVE);
            const hasMouseUp = this.hasEventListener(MouseEvent.MOUSE_UP);
            const hasMouseWheel = this.hasEventListener(MouseEvent.MOUSE_WHEEL);
            if (!hasMouseDown && !hasMouseMove && !hasMouseUp && !hasMouseWheel) {
                eventManager.removeListener(mouseListener);
                mouseListener = null;
            }
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
 */
export const systemEvent = new SystemEvent();
legacyCC.systemEvent = systemEvent;
