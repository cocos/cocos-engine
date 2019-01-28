import { ccenum } from '../core/value-types/enum';

export enum EventType {
    TRANSFORM_CHANGED = 'transform-changed',
    POSITION_PART = 'position-part',
    ROTATION_PART = 'rotation-part',
    SCALE_PART = 'scale-part',
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
}

ccenum(EventType);
