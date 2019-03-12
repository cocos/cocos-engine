/****************************************************************************
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
 ****************************************************************************/

import { EventTarget } from '../../event/event-target';
import { EventType } from './event-enum';
import { EventListener } from './event-listener';
// import { ccenum } from '../../value-types/enum';
import eventManager from './event-manager';
import inputManager from './input-manager';

/**
 * !#en
 * The System event, it currently supports keyboard events and accelerometer events.<br>
 * You can get the SystemEvent instance with cc.systemEvent.<br>
 * example:
 * ```
 * cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 * !#zh
 * 系统事件，它目前支持按键事件和重力感应事件。<br>
 * 你可以通过 cc.systemEvent 获取到 SystemEvent 的实例。<br>
 * 参考示例：
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
    public static EventType = EventType;
    constructor () {
        super();
    }
    /**
     * !#en whether enable accelerometer event
     * !#zh 是否启用加速度计事件
     * @method setAccelerometerEnabled
     * @param {Boolean} isEnable
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (CC_EDITOR) {
            return;
        }
        inputManager.setAccelerometerEnabled(isEnable);
    }

    /**
     * !#en set accelerometer interval value
     * !#zh 设置加速度计间隔值
     * @method setAccelerometerInterval
     * @param {Number} interval
     */
    public setAccelerometerInterval (interval: number) {
        if (CC_EDITOR) {
            return;
        }
        inputManager.setAccelerometerInterval(interval);
    }

    public on (type: string, callback: Function, target?: Object) {
        if (CC_EDITOR) {
            return;
        }
        super.on(type, callback, target);

        // Keyboard
        if (type === EventType.KEY_DOWN || type === EventType.KEY_UP) {
            if (!keyboardListener) {
                keyboardListener = EventListener.create({
                    event: EventListener.KEYBOARD,
                    onKeyPressed (keyCode, event) {
                        event.type = EventType.KEY_DOWN;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onKeyReleased (keyCode, event) {
                        event.type = EventType.KEY_UP;
                        cc.systemEvent.dispatchEvent(event);
                    },
                });
            }
            if (!eventManager.hasEventListener(EventListener.ListenerID.KEYBOARD)) {
                eventManager.addListener(keyboardListener, 256);
            }
        }

        // Acceleration
        if (type === EventType.DEVICEMOTION) {
            if (!accelerationListener) {
                accelerationListener = EventListener.create({
                    event: EventListener.ACCELERATION,
                    callback (acc, event) {
                        event.type = EventType.DEVICEMOTION;
                        cc.systemEvent.dispatchEvent(event);
                    },
                });
            }
            if (!eventManager.hasEventListener(EventListener.ListenerID.ACCELERATION)) {
                eventManager.addListener(accelerationListener!, 256);
            }
        }

        // touch
        if (type === EventType.TOUCH_START ||
            type === EventType.TOUCH_MOVE ||
            type === EventType.TOUCH_END ||
            type === EventType.TOUCH_CANCEL
        ) {
            if (!touchListener) {
                touchListener = EventListener.create({
                    event: EventListener.TOUCH_ONE_BY_ONE,
                    onTouchBegan (event) {
                        event.type = EventType.TOUCH_START;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onTouchMoved (event) {
                        event.type = EventType.TOUCH_MOVE;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onTouchEnded (event) {
                        event.type = EventType.TOUCH_END;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onTouchCancelled (event) {
                        event.type = EventType.TOUCH_CANCEL;
                        cc.systemEvent.dispatchEvent(event);
                    },
                });
            }
            eventManager.addListener(touchListener, 256);
        }

        // mouse
        if (type === EventType.MOUSE_DOWN ||
            type === EventType.MOUSE_MOVE ||
            type === EventType.MOUSE_UP ||
            type === EventType.MOUSE_WHEEL
        ) {
            if (!mouseListener) {
                mouseListener = EventListener.create({
                    event: EventListener.MOUSE,
                    onMouseDown (event) {
                        event.type = EventType.MOUSE_DOWN;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onMouseMove (event) {
                        event.type = EventType.MOUSE_MOVE;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onMouseUp (event) {
                        event.type = EventType.MOUSE_UP;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onMouseScroll (event) {
                        event.type = EventType.MOUSE_WHEEL;
                        cc.systemEvent.dispatchEvent(event);
                    },
                });
            }
            eventManager.addListener(mouseListener, 256);
        }

        return callback;
    }

    public off (type: string, callback?: Function, target?: Object) {
        if (CC_EDITOR) {
            return;
        }
        super.off(type, callback, target);

        // Keyboard
        if (keyboardListener && (type === EventType.KEY_DOWN || type === EventType.KEY_UP)) {
            const hasKeyDownEventListener = this.hasEventListener(EventType.KEY_DOWN);
            const hasKeyUpEventListener = this.hasEventListener(EventType.KEY_UP);
            if (!hasKeyDownEventListener && !hasKeyUpEventListener) {
                eventManager.removeListener(keyboardListener);
            }
        }

        // Acceleration
        if (accelerationListener && type === EventType.DEVICEMOTION) {
            eventManager.removeListener(accelerationListener);
        }
    }
}

cc.SystemEvent = SystemEvent;
/**
 * @module cc
 */

/**
 * !#en The System event singleton for global usage
 * !#zh 系统事件单例，方便全局使用
 * @property systemEvent
 * @type {SystemEvent}
 */
cc.systemEvent = new cc.SystemEvent();
