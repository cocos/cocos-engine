/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
import { ccenum } from '../../value-types/enum';
import { legacyCC } from '../../global-exports';
import { NodeEventType } from '../../scene-graph/node-event';

/**
 * @en The event type supported by SystemEvent and Node events
 * @zh SystemEvent 支持的事件类型以及节点事件类型
 *
 * @deprecated since v3.3, please use SystemEvent.EventType instead
 */
export enum SystemEventType {
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
     * @en The event type for the key press event, the event will only be dispatched at the time key is pressed down.
     * @zh 当按下按键时触发的事件, 该事件只在按下时派发
     */
    KEY_PRESS = 'keypress',

    /**
     * @en The event type for the key down event, the event will be continuously dispatched in the key pressed state
     * @zh 当按下按键时触发的事件, 该事件在按下状态会持续派发
     */
    KEY_DOWN = 'keydown',

    /**
     * @en The event type for the key release event
     * @zh 当松开按键时触发的事件
     */
    KEY_RELEASE = 'keyup',

    /**
     * @en The event type for press the key up event
     * @zh 当松开按键时触发的事件
     * @deprecated since v3.3, please use SystemEvent.EventType.KEY_RELEASE instead
     */
    KEY_UP = KEY_RELEASE,

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

ccenum(SystemEventType);

export type SystemEventTypeUnion = SystemEventType | NodeEventType;

legacyCC.SystemEventType = SystemEventType;
