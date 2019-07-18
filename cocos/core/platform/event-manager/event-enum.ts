/**
 * @category event
 */
import { CCEnum } from '../../value-types/enum';

/**
 * @zh
 * 一般用于系统事件或者节点事件的事件枚举
 */
export enum SystemEventType {
    /**
     * @en
     * The event type for touch start event, you can use its value directly: 'touchstart'.
     *
     * @zh
     * 手指开始触摸事件。
     */
    TOUCH_START = 'touch-start',

    /**
     * @en
     * The event type for touch move event, you can use its value directly: 'touchmove'.
     *
     * @zh
     * 当手指在屏幕上移动时。
     */
    TOUCH_MOVE = 'touch-move',

    /**
     * @en
     * The event type for touch end event, you can use its value directly: 'touchend'.
     *
     * @zh
     * 手指结束触摸事件。
     */
    TOUCH_END = 'touch-end',

    /**
     * @en
     * The event type for touch end event, you can use its value directly: 'touchcancel'.
     *
     * @zh
     * 当手指在目标节点区域外离开屏幕时。
     */
    TOUCH_CANCEL = 'touch-cancel',

    /**
     * @en
     * The event type for mouse down events, you can use its value directly: 'mousedown'.
     *
     * @zh
     * 当鼠标按下时触发一次。
     */
    MOUSE_DOWN = 'mouse-down',

    /**
     * @en
     * The event type for mouse move events, you can use its value directly: 'mousemove'.
     *
     * @zh
     * 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。
     */
    MOUSE_MOVE = 'mouse-move',

    /**
     * @en
     * The event type for mouse up events, you can use its value directly: 'mouseup'.
     *
     * @zh
     * 当鼠标从按下状态松开时触发一次。
     */
    MOUSE_UP = 'mouse-up',

    /**
     * @en
     * The event type for mouse wheel events, you can use its value directly: 'mousewheel'.
     *
     * @zh 手指开始触摸事件
     */
    MOUSE_WHEEL = 'mouse-wheel',

    /**
     * @en
     * The event type for mouse leave target events, you can use its value directly: 'mouseleave'.
     *
     * @zh
     * 当鼠标移入目标节点区域时，不论是否按下.
     */
    MOUSE_ENTER = 'mouse-enter',

    /**
     * @en
     * The event type for mouse leave target events, you can use its value directly: 'mouseleave'.
     *
     * @zh
     * 当鼠标移出目标节点区域时，不论是否按下。
     */
    MOUSE_LEAVE = 'mouse-leave',

    /**
     * @en The event type for press the key down event, you can use its value directly: 'keydown'
     * @zh 当按下按键时触发的事件
     */
    KEY_DOWN = 'keydown',

    /**
     * @en The event type for press the key up event, you can use its value directly: 'keyup'
     * @zh 当松开按键时触发的事件
     */
    KEY_UP = 'keyup',

    /**
     * @en
     * The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     *
     * @zh
     * 重力感应
     */
    DEVICEMOTION = 'devicemotion',

    /**
     * @en
     * The event type for position, rotation, scale changed.
     *
     * @zh
     * 节点改变位置、旋转或缩放事件.
     */
    TRANSFORM_CHANGED = 'transform-changed',

    /**
     * @en
     * The event type for position changed.
     *
     * @zh
     * 节点位置改变事件
     */
    POSITION_PART = 'position-part',

    /**
     * @en
     * The event type for rotation changed.
     *
     * @zh
     * 节点旋转事件
     */
    ROTATION_PART = 'rotation-part',

    /**
     * @en The event type for scale changed.
     * @zh 节点缩放事件
     */
    SCALE_PART = 'scale-part',

    /**
     * @en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'.
     * @zh
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
     * 当节点锚点改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     */
    ANCHOR_CHANGED = 'anchor-changed',

    /**
     * @en
     * The event type for add children.
     *
     * @zh
     * 节点子类添加。
     */
    CHILD_ADDED = 'child-added',

    /**
     * @en
     * The event type for removed children.
     *
     * @zh
     * 节点子类移除。
     */
    CHILD_REMOVED = 'child-removed',
}

CCEnum(SystemEventType);

cc.SystemEventType = SystemEventType;
