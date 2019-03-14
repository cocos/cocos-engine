import { ccenum } from '../../value-types/enum';

/**
 * !#zh
 * 一般用于系统事件或者节点事件的事件枚举
 */
export enum EventType {
    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property TOUCH_START
     * @type {String}
     * @static
     */
    TOUCH_START = 'touch-start',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property TOUCH_MOVE
     * @type {String}
     * @static
     */
    TOUCH_MOVE = 'touch-move',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property TOUCH_END
     * @type {String}
     * @static
     */
    TOUCH_END = 'touch-end',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property TOUCH_CANCEL
     * @type {String}
     * @static
     */
    TOUCH_CANCEL = 'touch-cancel',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property MOUSE_DOWN
     * @type {String}
     * @static
     */
    MOUSE_DOWN = 'mouse-down',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property MOUSE_MOVE
     * @type {String}
     * @static
     */
    MOUSE_MOVE = 'mouse-move',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property MOUSE_UP
     * @type {String}
     * @static
     */
    MOUSE_UP = 'mouse-up',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 手指开始触摸事件
     * @property MOUSE_WHEEL
     * @type {String}
     * @static
     */
    MOUSE_WHEEL = 'mouse-wheel',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 鼠标进入事件
     * @property MOUSE_ENTER
     * @type {String}
     * @static
     */
    MOUSE_ENTER = 'mouse-enter',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 鼠标离开事件
     * @property MOUSE_LEAVE
     * @type {String}
     * @static
     */
    MOUSE_LEAVE = 'mouse-leave',

    /**
     * !#en The event type for press the key down event, you can use its value directly: 'keydown'
     * !#zh 当按下按键时触发的事件
     * @property KEY_DOWN
     * @type {String}
     * @static
     */
    KEY_DOWN = 'keydown',

    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 当松开按键时触发的事件
     * @property KEY_UP
     * @type {String}
     * @static
     */
    KEY_UP = 'keyup',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 重力感应
     * @property DEVICEMOTION
     * @type {String}
     * @static
     */
    DEVICEMOTION = 'devicemotion',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 节点改变位置、旋转或缩放事件
     * @property TRANSFORM_CHANGED
     * @type {String}
     * @static
     */
    TRANSFORM_CHANGED = 'transform-changed',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 节点位置改变事件
     * @property POSITION_PART
     * @type {String}
     * @static
     */
    POSITION_PART = 'position-part',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 节点旋转事件
     * @property ROTATION_PART
     * @type {String}
     * @static
     */
    ROTATION_PART = 'rotation-part',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 节点缩放事件
     * @property SCALE_PART
     * @type {String}
     * @static
     */
    SCALE_PART = 'scale-part',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh
     * @property SCENE_CHANGED_FOR_PERSISTS
     * @type {String}
     * @static
     */
    SCENE_CHANGED_FOR_PERSISTS = 'scene-changed-for-persists',

    /**
     * !#en The event type for size change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点尺寸改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} SIZE_CHANGED
     * @static
     */
    SIZE_CHANGED = 'size-changed',
    /**
     * !#en The event type for anchor point change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点锚点改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} ANCHOR_CHANGED
     * @static
     */
    ANCHOR_CHANGED = 'anchor-changed',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 节点子类添加
     * @property CHILD_ADDED
     * @type {String}
     * @static
     */
    CHILD_ADDED = 'child-added',

    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 节点子类移除
     * @property CHILD_REMOVED
     * @type {String}
     * @static
     */
    CHILD_REMOVED = 'child-removed',
}

ccenum(EventType);

cc.SystemEventType = EventType;
