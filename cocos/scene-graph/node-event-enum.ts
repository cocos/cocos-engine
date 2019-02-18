import { ccenum } from '../core/value-types/enum';

export enum EventType {
    TRANSFORM_CHANGED = 'transform-changed',
    POSITION_PART = 'position-part',
    ROTATION_PART = 'rotation-part',
    SCALE_PART = 'scale-part',

    SCENE_CHANGED_FOR_PERSISTS = 'scene-changed-for-persists',

    TOUCH_START = 'touch-start',
    TOUCH_MOVE = 'touch-move',
    TOUCH_END = 'touch-end',
    TOUCH_CANCEL = 'touch-cancel',
    MOUSE_DOWN = 'mouse-down',
    MOUSE_ENTER = 'mouse-enter',
    MOUSE_MOVE = 'mouse-move',
    MOUSE_LEAVE = 'mouse-leave',
    MOUSE_UP = 'mouse-up',
    MOUSE_WHEEL = 'mouse-wheel',

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
    CHILD_ADDED = 'child-added',
    CHILD_REMOVED = 'child-removed',
}

ccenum(EventType);
