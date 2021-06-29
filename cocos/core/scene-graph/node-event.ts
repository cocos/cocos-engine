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
     * @deprecated since v3.3, please use SystemEventType.KEY_DOWN instead
     */
    KEY_DOWN = 'keydown',

    /**
     * @en The event type for press the key up event
     * @zh 当松开按键时触发的事件
     * @deprecated since v3.3, please use SystemEventType.KEY_UP instead
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
     */
    TRANSFORM_CHANGED = 'transform-changed',

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
     * @en The event type for node's sibling order changed.
     * @zh 当节点在兄弟节点中的顺序发生变化时触发的事件。
     */
    SIBLING_ORDER_CHANGED = 'sibling-order-changed',
}
