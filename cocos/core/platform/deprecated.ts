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

import { markAsWarning, removeProperty, replaceProperty } from '../utils';
import { Event } from '../event';
import { EventKeyboard, EventMouse, EventTouch, SystemEvent, SystemEventType } from './event-manager';
import { sys } from './sys';
import { View } from './view';
import { Node } from '../scene-graph';

removeProperty(View.prototype, 'View.prototype', [
    {
        name: 'isAntiAliasEnabled',
        suggest: 'The API of Texture2d have been largely modified, no alternative',
    },
    {
        name: 'enableAntiAlias',
        suggest: 'The API of Texture2d have been largely modified, no alternative',
    },
]);

// deprecate Event property
replaceProperty(Event, 'Event', [
    {
        name: 'NO_TYPE',
        target: SystemEventType,
        targetName: 'SystemEventType',
    },
    {
        name: 'ACCELERATION',
        newName: 'DEVICEMOTION',
        target: SystemEvent.DeviceEvent,
        targetName: 'SystemEvent.DeviceEvent',
    },
]);

markAsWarning(Event, 'Event', [
    {
        name: 'TOUCH',
        suggest: 'please use SystemEvent.TouchEvent.TOUCH_START, SystemEvent.TouchEvent.TOUCH_MOVE, SystemEvent.TouchEvent.TOUCH_END and SystemEvent.TouchEvent.TOUCH_CANCEL instead',
    },
    {
        name: 'MOUSE',
        suggest: 'please use SystemEvent.MouseEvent.MOUSE_DOWN, SystemEvent.MouseEvent.MOUSE_MOVE, SystemEvent.MouseEvent.MOUSE_UP, SystemEvent.MouseEvent.MOUSE_WHEEL, Node.EventType.MOUSE_ENTER and Node.EventType.MOUSE_LEAVE instead',
    },
    {
        name: 'KEYBOARD',
        suggest: 'please use SystemEvent.KeyboardEvent.KEY_DOWN and SystemEvent.KeyboardEvent.KEY_UP instead',
    },
]);

// depracate EventMouse property
replaceProperty(EventMouse, 'EventMouse',
    ['DOWN', 'UP', 'MOVE'].map((item) => ({
        name: item,
        newName: `MOUSE_${item}`,
        target: SystemEvent.MouseEvent,
        targetName: 'SystemEvent.MouseEvent',
    })));
replaceProperty(EventMouse, 'EventMouse', [
    {
        name: 'SCROLL',
        newName: 'MOUSE_WHEEL',
        target: SystemEvent.MouseEvent,
        targetName: 'SystemEvent.MouseEvent',
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
        target: SystemEvent.TouchEvent,
        targetName: 'SystemEvent.TouchEvent',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'MOVED',
        newName: 'TOUCH_MOVE',
        target: SystemEvent.TouchEvent,
        targetName: 'SystemEvent.TouchEvent',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'ENDED',
        newName: 'TOUCH_END',
        target: SystemEvent.TouchEvent,
        targetName: 'SystemEvent.TouchEvent',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'CANCELLED',
        newName: 'TOUCH_CANCEL',
        target: SystemEvent.TouchEvent,
        targetName: 'SystemEvent.TouchEvent',
    },
]);
markAsWarning(EventTouch.prototype, 'EventTouch.prototype', [
    {
        name: 'getEventCode',
        suggest: 'please use EventTouch.prototype.type instead',
    },
]);

// deprecated EventKeyboard property
markAsWarning(EventKeyboard.prototype, 'EventKeyboard.prototype', [
    {
        name: 'isPressed',
        suggest: 'use EventKeyboard.prototype.type !== SystemEvent.KeyboardEvent.KEY_UP instead',
    },
]);

// deprecate languageCode field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'ENGLISH', 'CHINESE', 'FRENCH', 'ITALIAN',
        'GERMAN', 'SPANISH', 'DUTCH', 'RUSSIAN', 'KOREAN',
        'JAPANESE', 'HUNGARIAN', 'PORTUGUESE', 'ARABIC', 'NORWEGIAN',
        'POLISH', 'TURKISH', 'UKRAINIAN', 'ROMANIAN', 'BULGARIAN'].map((item) => ({
        name: `LANGUAGE_${item}`,
        newName: item,
        target: sys.Language,
        targetName: 'sys.Language',
    })));

// deprecate os field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'IOS', 'ANDROID', 'WINDOWS', 'LINUX', 'OSX'].map((item) => ({
        name: `OS_${item}`,
        newName: item,
        target: sys.OS,
        targetName: 'sys.OS',
    })));

// deprecate browserType field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'WECHAT', 'ANDROID', 'IE', 'EDGE', 'QQ', 'MOBILE_QQ',
        'UC', 'UCBS', 'BAIDU_APP', 'BAIDU', 'MAXTHON', 'OPERA',
        'OUPENG', 'MIUI', 'FIREFOX', 'SAFARI', 'CHROME', 'LIEBAO',
        'QZONE', 'SOUGOU', 'HUAWEI'].map((item) => ({
        name: `BROWSER_TYPE_${item}`,
        newName: item,
        target: sys.BrowserType,
        targetName: 'sys.BrowserType',
    })));
replaceProperty(sys, 'sys', [
    {
        name: 'BROWSER_TYPE_360',
        newName: 'BROWSER_360',
        target: sys.BrowserType,
        targetName: 'sys.BrowserType',
    },
]);

// deprecate platform field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'EDITOR_PAGE', 'EDITOR_CORE', 'MOBILE_BROWSER', 'DESKTOP_BROWSER', 'WIN32', 'MACOS', 'IOS', 'ANDROID',
        'WECHAT_GAME', 'BAIDU_MINI_GAME', 'XIAOMI_QUICK_GAME', 'ALIPAY_MINI_GAME', 'BYTEDANCE_MINI_GAME',
        'OPPO_MINI_GAME', 'VIVO_MINI_GAME', 'HUAWEI_QUICK_GAME', 'COCOSPLAY',  'LINKSURE_MINI_GAME', 'QTT_MINI_GAME'].map((item) => ({
        name: item,
        target: sys.Platform,
        targetName: 'sys.Platform',
    })));

// remove platform field
replaceProperty(sys, 'sys', [
    {
        name: 'IPHONE',
        newName: 'IOS',
        target: sys.Platform,
        targetName: 'sys.Platform',
    },
    {
        name: 'IPAD',
        newName: 'IOS',
        target: sys.Platform,
        targetName: 'sys.Platform',
    },
]);
removeProperty(sys, 'sys',
    ['LINUX', 'BLACKBERRY', 'NACL', 'EMSCRIPTEN', 'TIZEN',
        'WINRT', 'WP8', 'QQ_PLAY', 'FB_PLAYABLE_ADS'].map((item) => ({
        name: item,
    })));

// deprecate KEY event
markAsWarning(SystemEventType, 'SystemEventType', [
    {
        name: 'KEY_DOWN',
        suggest: 'please use SystemEvent.KeyboardEvent.KEY_DOWN instead. The SystemEventType.KEY_DOWN event will be continuously dispatched in the key pressed state, it\'s not a good API design for developers.',
    },
    {
        name: 'KEY_UP',
        suggest: 'please use SystemEvent.KeyboardEvent.KEY_UP instead.',
    },
]);

replaceProperty(SystemEventType, 'SystemEventType', [
    'MOUSE_ENTER',
    'MOUSE_LEAVE',
    'TRANSFORM_CHANGED',
    'SCENE_CHANGED_FOR_PERSISTS',
    'SIZE_CHANGED',
    'ANCHOR_CHANGED',
    'COLOR_CHANGED',
    'CHILD_ADDED',
    'CHILD_REMOVED',
    'PARENT_CHANGED',
    'NODE_DESTROYED',
    'LAYER_CHANGED',
    'SIBLING_ORDER_CHANGED',
].map((name: string) => ({
    name,
    target: Node.EventType,
    targetName: 'Node.EventType',
})));

replaceProperty(Node.EventType, 'Node.EventType', [
    {
        name: 'DEVICEMOTION',
        target: SystemEventType,
        targetName: 'SystemEventType',
    },
    {
        name: 'KEY_DOWN',
        target: SystemEventType,
        targetName: 'SystemEventType',
    },
    {
        name: 'KEY_UP',
        target: SystemEventType,
        targetName: 'SystemEventType',
    },
]);
