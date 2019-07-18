/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category event
 */

import { EventTarget } from '../../event/event-target';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch } from './CCEvent';
import { SystemEventType } from './event-enum';
import { EventListener } from './event-listener';
// import { CCEnum } from '../../value-types/enum';
import eventManager from './event-manager';
import inputManager from './input-manager';

/**
 * @en
 * The System event, it currently supports keyboard events and accelerometer events.<br>
 * You can get the SystemEvent instance with cc.systemEvent.<br>
 * example:
 * ```
 * cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 * @zh
 * 系统事件，它目前支持按键事件和重力感应事件。<br>
 * 你可以通过 cc.systemEvent 获取到 SystemEvent 的实例。<br>
 * @example
 * ```
 * cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 * @class SystemEvent
 * @extends EventTarget
 */

let keyboardListener: EventListener | null = null;
let accelerationListener: EventListener | null = null;
let touchListener: EventListener | null = null;
let mouseListener: EventListener | null = null;
export class SystemEvent extends EventTarget {
    public static EventType = SystemEventType;
    constructor () {
        super();
    }
    /**
     * @en
     * whether enable accelerometer event.
     *
     * @zh
     * 是否启用加速度计事件。
     *
     * @param {Boolean} isEnable
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (CC_EDITOR) {
            return;
        }
        inputManager.setAccelerometerEnabled(isEnable);
    }

    /**
     * @en
     * set accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     *
     * @method setAccelerometerInterval
     * @param {Number} interval
     */
    public setAccelerometerInterval (interval: number) {
        if (CC_EDITOR) {
            return;
        }
        inputManager.setAccelerometerInterval(interval);
    }

    public on (type: SystemEventType.KEY_DOWN | SystemEventType.KEY_UP, callback: (event: EventKeyboard) => void, target?: Object);
    public on (type: SystemEventType.MOUSE_DOWN | SystemEventType.MOUSE_ENTER | SystemEventType.MOUSE_LEAVE |
                     SystemEventType.MOUSE_MOVE | SystemEventType.MOUSE_UP | SystemEventType.MOUSE_WHEEL ,
               callback: (event: EventMouse) => void, target?: Object);
    public on (type: SystemEventType.TOUCH_START | SystemEventType.TOUCH_MOVE | SystemEventType.TOUCH_END | SystemEventType.TOUCH_CANCEL,
               callback: (event: EventTouch) => void, target?: Object);
    public on (type: SystemEventType.DEVICEMOTION, callback: (event: EventAcceleration) => void, target?: Object);
    /**
     * @zh
     * 系统事件注册。
     *
     * @param type - 事件名。
     * @param callback - 事件回调。
     * @param target - 接收事件目标。
     */
    public on (type: string, callback: Function, target?: Object) {
        if (CC_EDITOR) {
            return;
        }
        super.on(type, callback, target);

        // Keyboard
        if (type === SystemEventType.KEY_DOWN || type === SystemEventType.KEY_UP) {
            if (!keyboardListener) {
                keyboardListener = EventListener.create({
                    event: EventListener.KEYBOARD,
                    onKeyPressed (keyCode, event) {
                        event.type = SystemEventType.KEY_DOWN;
                        systemEvent.emit(event.type, event);
                    },
                    onKeyReleased (keyCode, event) {
                        event.type = SystemEventType.KEY_UP;
                        systemEvent.emit(event.type, event);
                    },
                });
            }
            if (!eventManager.hasEventListener(EventListener.ListenerID.KEYBOARD)) {
                eventManager.addListener(keyboardListener, 256);
            }
        }

        // Acceleration
        if (type === SystemEventType.DEVICEMOTION) {
            if (!accelerationListener) {
                accelerationListener = EventListener.create({
                    event: EventListener.ACCELERATION,
                    callback (acc, event) {
                        event.type = SystemEventType.DEVICEMOTION;
                        cc.systemEvent.emit(event.type, event);
                    },
                });
            }
            if (!eventManager.hasEventListener(EventListener.ListenerID.ACCELERATION)) {
                eventManager.addListener(accelerationListener!, 256);
            }
        }

        // touch
        if (type === SystemEventType.TOUCH_START ||
            type === SystemEventType.TOUCH_MOVE ||
            type === SystemEventType.TOUCH_END ||
            type === SystemEventType.TOUCH_CANCEL
        ) {
            if (!touchListener) {
                touchListener = EventListener.create({
                    event: EventListener.TOUCH_ONE_BY_ONE,
                    onTouchBegan (touch, event) {
                        event.type = SystemEventType.TOUCH_START;
                        cc.systemEvent.emit(event.type, touch, event);
                        return true;
                    },
                    onTouchMoved (touch, event) {
                        event.type = SystemEventType.TOUCH_MOVE;
                        cc.systemEvent.emit(event.type, touch, event);
                    },
                    onTouchEnded (touch, event) {
                        event.type = SystemEventType.TOUCH_END;
                        cc.systemEvent.emit(event.type, touch, event);
                    },
                    onTouchCancelled (touch, event) {
                        event.type = SystemEventType.TOUCH_CANCEL;
                        cc.systemEvent.emit(event.type, touch, event);
                    },
                });
                eventManager.addListener(touchListener, 256);
            }
        }

        // mouse
        if (type === SystemEventType.MOUSE_DOWN ||
            type === SystemEventType.MOUSE_MOVE ||
            type === SystemEventType.MOUSE_UP ||
            type === SystemEventType.MOUSE_WHEEL
        ) {
            if (!mouseListener) {
                mouseListener = EventListener.create({
                    event: EventListener.MOUSE,
                    onMouseDown (event) {
                        event.type = SystemEventType.MOUSE_DOWN;
                        cc.systemEvent.emit(event.type, event);
                    },
                    onMouseMove (event) {
                        event.type = SystemEventType.MOUSE_MOVE;
                        cc.systemEvent.emit(event.type, event);
                    },
                    onMouseUp (event) {
                        event.type = SystemEventType.MOUSE_UP;
                        cc.systemEvent.emit(event.type, event);
                    },
                    onMouseScroll (event) {
                        event.type = SystemEventType.MOUSE_WHEEL;
                        cc.systemEvent.emit(event.type, event);
                    },
                });
                eventManager.addListener(mouseListener, 256);
            }
        }

        return callback;
    }

    /**
     * @zh
     * 注销事件。
     *
     * @param type - 事件名。
     * @param callback - 事件回调。
     * @param target - 回调接收对象。
     */
    public off (type: string, callback?: Function, target?: Object) {
        if (CC_EDITOR) {
            return;
        }
        super.off(type, callback, target);

        // Keyboard
        if (keyboardListener && (type === SystemEventType.KEY_DOWN || type === SystemEventType.KEY_UP)) {
            const hasKeyDownEventListener = this.hasEventListener(SystemEventType.KEY_DOWN);
            const hasKeyUpEventListener = this.hasEventListener(SystemEventType.KEY_UP);
            if (!hasKeyDownEventListener && !hasKeyUpEventListener) {
                eventManager.removeListener(keyboardListener);
            }
        }

        // Acceleration
        if (accelerationListener && type === SystemEventType.DEVICEMOTION) {
            eventManager.removeListener(accelerationListener);
        }
    }
}

cc.SystemEvent = SystemEvent;
/**
 * @module cc
 */

/**
 * 系统事件单例，方便全局使用。
 */
export const systemEvent = new SystemEvent();
cc.systemEvent = systemEvent;
