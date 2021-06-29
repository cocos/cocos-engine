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
import { SystemEventType } from './event-enum';
import { EventListener } from './event-listener';
import eventManager from './event-manager';
import inputManager from './input-manager';
import { Touch } from './touch';
import { legacyCC } from '../../global-exports';
import { logID, warnID } from '../debug';

let keyboardListener: EventListener | null = null;
let accelerationListener: EventListener | null = null;
let touchListener: EventListener | null = null;
let mouseListener: EventListener | null = null;

export declare namespace SystemEvent {
    /**
     * @en The event type supported by SystemEvent and Node events
     * @zh SystemEvent 支持的事件类型以及节点事件类型
     */
    export enum EventType {
        /**
         * @en
         * Code for event without type.
         *
         * @zh
         * 没有类型的事件。
         *
         * @inner This is an inner type for event initiation.
         */
        NO_TYPE = 'no_type',

        /**
         * @en
         * The event type for touch start event
         *
         * @zh
         * 手指开始触摸事件。
         */
        TOUCH_START = 'touch-start',

        /**
         * @en
         * The event type for touch move event
         *
         * @zh
         * 当手指在屏幕上移动时。
         */
        TOUCH_MOVE = 'touch-move',

        /**
         * @en
         * The event type for touch end event
         *
         * @zh
         * 手指结束触摸事件。
         */
        TOUCH_END = 'touch-end',

        /**
         * @en
         * The event type for touch end event
         *
         * @zh
         * 当手指在目标节点区域外离开屏幕时。
         */
        TOUCH_CANCEL = 'touch-cancel',

        /**
         * @en
         * The event type for mouse down events
         *
         * @zh
         * 当鼠标按下时触发一次。
         */
        MOUSE_DOWN = 'mouse-down',

        /**
         * @en
         * The event type for mouse move events
         *
         * @zh
         * 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。
         */
        MOUSE_MOVE = 'mouse-move',

        /**
         * @en
         * The event type for mouse up events
         *
         * @zh
         * 当鼠标从按下状态松开时触发一次。
         */
        MOUSE_UP = 'mouse-up',

        /**
         * @en
         * The event type for mouse wheel events
         *
         * @zh 手指开始触摸事件
         */
        MOUSE_WHEEL = 'mouse-wheel',

        /**
         * @en
         * The event type for mouse leave target events
         *
         * @zh
         * 当鼠标移入目标节点区域时，不论是否按下.
         *
         * @deprecated since v3.3, please use Node.EventType.MOUSE_ENTER instead.
         */
        MOUSE_ENTER = 'mouse-enter',

        /**
         * @en
         * The event type for mouse leave target events
         *
         * @zh
         * 当鼠标移出目标节点区域时，不论是否按下。
         *
         * @deprecated since v3.3, please use Node.EventType.MOUSE_LEAVE instead.
         */
        MOUSE_LEAVE = 'mouse-leave',

        /**
         * @en The event type for press the key down event, the event will be continuously dispatched in the key pressed state
         * @zh 当按下按键时触发的事件, 该事件在按下状态会持续派发
         * @deprecated since v3.3, please use SystemEvent.EventType.KEY_DOWN instead. The SystemEventType.KEY_DOWN event will be continuously dispatched in the key pressed state, it's not a good API design for developers.
         */
        KEY_DOWN = 'keydown',

        /**
         * @en The event type for press the key up event
         * @zh 当松开按键时触发的事件
         * @deprecated since v3.3, please use SystemEvent.EventType.KEY_UP instead
         */
        KEY_UP = 'keyup',

        /**
         * @en
         * The event type for press the devicemotion event
         *
         * @zh
         * 重力感应
         */
        DEVICEMOTION = 'devicemotion',

        /**
         * @en
         * The event type for position, rotation, scale changed.Use the type parameter as [[Node.TransformBit]] to check which part is changed
         *
         * @zh
         * 节点改变位置、旋转或缩放事件。如果具体需要判断是哪一个事件，可通过判断回调的第一个参数类型是 [[Node.TransformBit]] 中的哪一个来获取
         * @example
         * ```
         * this.node.on(Node.EventType.TRANSFORM_CHANGED, (type)=>{
         *  if (type & Node.TransformBit.POSITION) {
         *       //...
         *   }
         * }, this);
         * ```
         *
         * @deprecated since v3.3, please use Node.EventType.TRANSFORM_CHANGED instead
         */
        TRANSFORM_CHANGED = 'transform-changed',

        /**
         * @en The event type for notifying the host scene has been changed for a persist node.
         * @zh 当场景常驻节点的场景发生改变时触发的事件，一般在切换场景过程中触发。
         *
         * @deprecated since v3.3, please use Node.EventType.SCENE_CHANGED_FOR_PERSISTS instead
         */
        SCENE_CHANGED_FOR_PERSISTS = 'scene-changed-for-persists',

        /**
         * @en
         * The event type for size change events.
         * Performance note, this event will be triggered every time corresponding properties being changed,
         * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
         *
         * @zh
         * 当节点尺寸改变时触发的事件。
         * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
         *
         * @deprecated since v3.3, please use Node.EventType.SIZE_CHANGED instead
         */
        SIZE_CHANGED = 'size-changed',

        /**
         * @en
         * The event type for anchor point change events.
         * Performance note, this event will be triggered every time corresponding properties being changed,
         * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
         *
         * @zh
         * 当节点的 UITransform 锚点改变时触发的事件。
         * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
         *
         * @deprecated since v3.3, please use Node.EventType.ANCHOR_CHANGED instead
         */
        ANCHOR_CHANGED = 'anchor-changed',

        /**
         * @en
         * The event type for color change events.
         * Performance note, this event will be triggered every time corresponding properties being changed,
         * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
         *
         * @zh
         * 当节点的 UI 渲染组件颜色属性改变时触发的事件。
         * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
         *
         * @deprecated since v3.3, please use Node.EventType.COLOR_CHANGED instead
         */
        COLOR_CHANGED = 'color-changed',

        /**
         * @en
         * The event type for adding a new child node to the target node.
         *
         * @zh
         * 给目标节点添加子节点时触发的事件。
         *
         * @deprecated since v3.3, please use Node.EventType.CHILD_ADDED instead
         */
        CHILD_ADDED = 'child-added',

        /**
         * @en
         * The event type for removing a child node from the target node.
         *
         * @zh
         * 给目标节点移除子节点时触发的事件。
         *
         * @deprecated since v3.3, please use Node.EventType.CHILD_REMOVED instead
         */
        CHILD_REMOVED = 'child-removed',

        /**
         * @en The event type for changing the parent of the target node
         * @zh 目标节点的父节点改变时触发的事件。
         *
         * @deprecated since v3.3, please use Node.EventType.PARENT_CHANGED instead
         */
        PARENT_CHANGED = 'parent-changed',

        /**
         * @en The event type for destroying the target node
         * @zh 目标节点被销毁时触发的事件。
         *
         * @deprecated since v3.3, please use Node.EventType.NODE_DESTROYED instead
         */
        NODE_DESTROYED = 'node-destroyed',

        /**
         * @en The event type for node layer change events.
         * @zh 节点 layer 改变时触发的事件。
         *
         * @deprecated since v3.3, please use Node.EventType.LAYER_CHANGED instead
         */
        LAYER_CHANGED = 'layer-changed',

        /**
         * @en The event type for node's sibling order changed.
         * @zh 当节点在兄弟节点中的顺序发生变化时触发的事件。
         *
         * @deprecated since v3.3, please use Node.EventType.SIBLING_ORDER_CHANGED instead
         */
        SIBLING_ORDER_CHANGED = 'sibling-order-changed',
    }
}

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
* systemEvent.on(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
* systemEvent.off(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
* ```
*/

export class SystemEvent extends EventTarget {
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

    public on (type: SystemEvent.EventType.KEY_DOWN | SystemEvent.EventType.KEY_UP, callback: (event: EventKeyboard) => void, target?: unknown): typeof callback;
    public on (type: SystemEvent.EventType.MOUSE_DOWN | SystemEvent.EventType.MOUSE_MOVE | SystemEvent.EventType.MOUSE_UP | SystemEvent.EventType.MOUSE_WHEEL,
        callback: (event: EventMouse) => void, target?: unknown): typeof callback;
    public on (type: SystemEvent.EventType.TOUCH_START | SystemEvent.EventType.TOUCH_MOVE | SystemEvent.EventType.TOUCH_END | SystemEvent.EventType.TOUCH_CANCEL,
        callback: (touch: Touch, event: EventTouch) => void, target?: unknown): typeof callback;
    // #region deprecated
    public on (type: SystemEventType.KEY_DOWN | SystemEventType.KEY_UP, callback: (event: EventKeyboard) => void, target?: unknown): typeof callback;
    public on (type: SystemEventType.MOUSE_DOWN | SystemEventType.MOUSE_MOVE | SystemEventType.MOUSE_UP | SystemEventType.MOUSE_WHEEL,
        callback: (event: EventMouse) => void, target?: unknown): typeof callback;
    public on (type: SystemEventType.TOUCH_START | SystemEventType.TOUCH_MOVE | SystemEventType.TOUCH_END | SystemEventType.TOUCH_CANCEL,
        callback: (touch: Touch, event: EventTouch) => void, target?: unknown): typeof callback;
    public on (type: SystemEventType.DEVICEMOTION, callback: (event: EventAcceleration) => void, target?: unknown): typeof callback;
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
            return callback;
        }
        super.on(type, callback, target, once);

        // Keyboard
        if (type === SystemEvent.EventType.KEY_DOWN || type === 'keydown' || type === SystemEvent.EventType.KEY_UP) {
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
        if (type === SystemEvent.EventType.DEVICEMOTION) {
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
        if (type === SystemEvent.EventType.TOUCH_START
            || type === SystemEvent.EventType.TOUCH_MOVE
            || type === SystemEvent.EventType.TOUCH_END
            || type === SystemEvent.EventType.TOUCH_CANCEL
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
        if (type === SystemEvent.EventType.MOUSE_DOWN
            || type === SystemEvent.EventType.MOUSE_MOVE
            || type === SystemEvent.EventType.MOUSE_UP
            || type === SystemEvent.EventType.MOUSE_WHEEL
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

        return callback;
    }

    public off (type: SystemEvent.EventType.KEY_DOWN | SystemEvent.EventType.KEY_UP, callback?: (event: EventKeyboard) => void, target?: unknown);
    public off (type: SystemEvent.EventType.MOUSE_DOWN | SystemEvent.EventType.MOUSE_MOVE | SystemEvent.EventType.MOUSE_UP | SystemEvent.EventType.MOUSE_WHEEL,
        callback?: (event: EventMouse) => void, target?: unknown);
    public off (type: SystemEvent.EventType.TOUCH_START | SystemEvent.EventType.TOUCH_MOVE | SystemEvent.EventType.TOUCH_END | SystemEvent.EventType.TOUCH_CANCEL,
        callback?: (touch: Touch, event: EventTouch) => void, target?: unknown);
    public off (type: SystemEvent.EventType.DEVICEMOTION, callback?: (event: EventAcceleration) => void, target?: unknown);
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
        if (keyboardListener && (type === SystemEvent.EventType.KEY_DOWN || type === 'keydown' || type === SystemEvent.EventType.KEY_UP)) {
            const hasKeyDownEventListener = this.hasEventListener(SystemEvent.EventType.KEY_DOWN);
            const hasKeyPressingEventListener = this.hasEventListener('keydown');  // SystemEventType.KEY_DOWN
            const hasKeyUpEventListener = this.hasEventListener(SystemEvent.EventType.KEY_UP);
            if (!hasKeyDownEventListener && !hasKeyPressingEventListener && !hasKeyUpEventListener) {
                eventManager.removeListener(keyboardListener);
                keyboardListener = null;
            }
        }

        // Acceleration
        if (accelerationListener && type === SystemEvent.EventType.DEVICEMOTION) {
            eventManager.removeListener(accelerationListener);
            accelerationListener = null;
        }

        if (touchListener && (type === SystemEvent.EventType.TOUCH_START || type === SystemEvent.EventType.TOUCH_MOVE
            || type === SystemEvent.EventType.TOUCH_END || type === SystemEvent.EventType.TOUCH_CANCEL)
        ) {
            const hasTouchStart = this.hasEventListener(SystemEvent.EventType.TOUCH_START);
            const hasTouchMove = this.hasEventListener(SystemEvent.EventType.TOUCH_MOVE);
            const hasTouchEnd = this.hasEventListener(SystemEvent.EventType.TOUCH_END);
            const hasTouchCancel = this.hasEventListener(SystemEvent.EventType.TOUCH_CANCEL);
            if (!hasTouchStart && !hasTouchMove && !hasTouchEnd && !hasTouchCancel) {
                eventManager.removeListener(touchListener);
                touchListener = null;
            }
        }

        if (mouseListener && (type === SystemEvent.EventType.MOUSE_DOWN || type === SystemEvent.EventType.MOUSE_MOVE
            || type === SystemEvent.EventType.MOUSE_UP || type === SystemEvent.EventType.MOUSE_WHEEL)
        ) {
            const hasMouseDown = this.hasEventListener(SystemEvent.EventType.MOUSE_DOWN);
            const hasMouseMove = this.hasEventListener(SystemEvent.EventType.MOUSE_MOVE);
            const hasMouseUp = this.hasEventListener(SystemEvent.EventType.MOUSE_UP);
            const hasMouseWheel = this.hasEventListener(SystemEvent.EventType.MOUSE_WHEEL);
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
