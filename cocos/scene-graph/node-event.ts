/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

/**
 * @en All event types which [[Node]] could emit
 * @zh 所有 [[Node]] 可能派发的事件类型
 */
export enum NodeEventType {
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
     */
    MOUSE_ENTER = 'mouse-enter',

    /**
     * @en
     * The event type for mouse leave target events
     *
     * @zh
     * 当鼠标移出目标节点区域时，不论是否按下。
     */
    MOUSE_LEAVE = 'mouse-leave',

    /**
     * @en The event type for press the key down event, the event will be continuously dispatched in the key pressed state
     * @zh 当按下按键时触发的事件, 该事件在按下状态会持续派发
     * @deprecated since v3.3, please use SystemEvent.EventType.KEY_DOWN instead
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
     *
     * @deprecated since v3.3, please use SystemEvent.EventType.DEVICEMOTION instead
     */
    DEVICEMOTION = 'devicemotion',

    /**
     * @en
     * The event type for position, rotation, scale changed.Use the type parameter as `Node.TransformBit` to check which part is changed
     *
     * @zh
     * 节点改变位置、旋转或缩放事件。如果具体需要判断是哪一个事件，可通过判断回调的第一个参数类型是 `Node.TransformBit` 中的哪一个来获取
     * @example
     * ```
     * this.node.on(Node.EventType.TRANSFORM_CHANGED, (type)=>{
     *  if (type & Node.TransformBit.POSITION) {
     *       //...
     *   }
     * }, this);
     * ```
     */
    TRANSFORM_CHANGED = 'transform-changed',

    /**
     * @en
     * The event occur when mobility changed.
     * @zh
     * 当可移动性改变时触发的事件
     */
    MOBILITY_CHANGED = 'mobility-changed',

    /**
     * @en The event type for notifying the host scene has been changed for a persist node.
     * @zh 当场景常驻节点的场景发生改变时触发的事件，一般在切换场景过程中触发。
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
     */
    COLOR_CHANGED = 'color-changed',

    /**
     * @en
     * The event type for adding a new child node to the target node.
     *
     * @zh
     * 给目标节点添加子节点时触发的事件。
     */
    CHILD_ADDED = 'child-added',

    /**
     * @en
     * The event type for removing a child node from the target node.
     *
     * @zh
     * 给目标节点移除子节点时触发的事件。
     */
    CHILD_REMOVED = 'child-removed',

    /**
     * @en The event type for changing the parent of the target node
     * @zh 目标节点的父节点改变时触发的事件。
     */
    PARENT_CHANGED = 'parent-changed',

    /**
     * @en The event type for destroying the target node
     * @zh 目标节点被销毁时触发的事件。
     */
    NODE_DESTROYED = 'node-destroyed',

    /**
     * @en The event type for node layer change events.
     * @zh 节点 layer 改变时触发的事件。
     */
    LAYER_CHANGED = 'layer-changed',

    /**
     * @en This event indicates that the order of child nodes has been changed.
     * @zh 该事件表示子节点的排序发生了改变。
     * @deprecated since v3.8.2 @en Please use `CHILDREN_ORDER_CHANGED`. @zh 请使用 `CHILDREN_ORDER_CHANGED`。
     */
    SIBLING_ORDER_CHANGED = 'sibling-order-changed',

    /**
     * @en This event indicates that the order of child nodes has been changed.
     * @zh 该事件表示子节点的排序发生了改变。
     */
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    CHILDREN_ORDER_CHANGED = 'sibling-order-changed',

    /**
     * @en
     * Note: This event is only emitted from the top most node whose active value did changed,
     * not including its child nodes.
     * @zh
     * 注意：此节点激活时，此事件仅从最顶部的节点发出。
     */
    ACTIVE_IN_HIERARCHY_CHANGED = 'active-in-hierarchy-changed',

    /**
     * @en
     * The event occur when node add a new component.
     * @zh
     * 当节点上增加组件时触发的事件
     */
    COMPONENT_ADDED = 'component-added',

    /**
     * @en
     * The event occur when node remove a component.
     * @zh
     * 当节点上移除组件时触发的事件
     */
    COMPONENT_REMOVED = 'component-removed',

    /**
     * @en
     * The event occur when light probe changed in light probe group.
     * @zh
     * 当光照探针组组件的探针改变时触发的事件
     */
    LIGHT_PROBE_CHANGED = 'light-probe-changed',

    /**
     * @en
     * The event occur after light probe's baking data is changed
     * @zh
     * 当光照探针烘焙数据修改后触发的事件
     */
    LIGHT_PROBE_BAKING_CHANGED = 'light-probe-baking-changed',
}
