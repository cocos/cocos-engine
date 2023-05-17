/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import './deprecated-3.3.0';
import './deprecated-3.4.0';
import { markAsWarning, replaceProperty, macro } from '../core';
import { Event, EventMouse, EventTouch, SystemEventType } from './types';
import { SystemEvent } from './system-event';

replaceProperty(SystemEventType, 'Node.EventType', [
    {
        name: 'POSITION_PART',
        newName: 'TRANSFORM_CHANGED',
    },
    {
        name: 'ROTATION_PART',
        newName: 'TRANSFORM_CHANGED',
    },
    {
        name: 'SCALE_PART',
        newName: 'TRANSFORM_CHANGED',
    },
]);

// deprecate Event property
replaceProperty(Event, 'Event', [
    {
        name: 'ACCELERATION',
        newName: 'DEVICEMOTION',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);

markAsWarning(Event, 'Event', [
    {
        name: 'TOUCH',
        suggest: 'please use SystemEvent.EventType.TOUCH_START, SystemEvent.EventType.TOUCH_MOVE, SystemEvent.EventType.TOUCH_END and SystemEvent.EventType.TOUCH_CANCEL instead',
    },
    {
        name: 'MOUSE',
        suggest: 'please use SystemEvent.EventType.MOUSE_DOWN, SystemEvent.EventType.MOUSE_MOVE, SystemEvent.EventType.MOUSE_UP, SystemEvent.EventType.MOUSE_WHEEL, Node.EventType.MOUSE_ENTER and Node.EventType.MOUSE_LEAVE instead',
    },
    {
        name: 'KEYBOARD',
        suggest: 'please use SystemEvent.EventType.KEY_DOWN and SystemEvent.EventType.KEY_UP instead',
    },
]);

// depracate EventMouse property
replaceProperty(EventMouse, 'EventMouse',
    ['DOWN', 'UP', 'MOVE'].map((item) => ({
        name: item,
        newName: `MOUSE_${item}`,
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    })));
replaceProperty(EventMouse, 'EventMouse', [
    {
        name: 'SCROLL',
        newName: 'MOUSE_WHEEL',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
markAsWarning(EventMouse.prototype, 'EventMouse.prototype', [
    {
        name: 'eventType',
        suggest: 'please use EventMouse.prototype.type instead',
    },
]);

// depracate EventTouch property
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'BEGAN',
        newName: 'TOUCH_START',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'MOVED',
        newName: 'TOUCH_MOVE',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'ENDED',
        newName: 'TOUCH_END',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'CANCELLED',
        newName: 'TOUCH_CANCEL',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
markAsWarning(EventTouch.prototype, 'EventTouch.prototype', [
    {
        name: 'getEventCode',
        suggest: 'please use EventTouch.prototype.type instead',
    },
]);
replaceProperty(EventTouch.prototype, 'EventTouch.prototype', [
    {
        name: 'getUILocationInView',
        newName: 'getLocationInView',
        target: EventTouch,
        targetName: 'EventTouch',
    },
]);

markAsWarning(macro.KEY, 'macro.KEY',
    [
        'back',
        'menu',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '*', '+', '-', '/', ';', '=', ',', '.', '[', ']',
        'dpadLeft', 'dpadRight', 'dpadUp', 'dpadDown', 'dpadCenter',
    ].map((item) => ({
        name: item,
    })));

markAsWarning(macro.KEY, 'macro.KEY', [
    {
        name: 'shift',
        suggest: 'please use KeyCode.SHIFT_LEFT instead',
    },
]);

markAsWarning(macro.KEY, 'macro.KEY', [
    {
        name: 'ctrl',
        suggest: 'please use KeyCode.CTRL_LEFT instead',
    },
]);

markAsWarning(macro.KEY, 'macro.KEY', [
    {
        name: 'alt',
        suggest: 'please use KeyCode.ALT_LEFT instead',
    },
]);

markAsWarning(macro, 'macro', [
    {
        name: 'KEY',
        suggest: 'please use KeyCode instead',
    },
]);
