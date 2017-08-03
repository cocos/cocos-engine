/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

var Pool = require('../cocos2d/core/platform/js').Pool;
var Event = require('../cocos2d/core/event/event');
require('../cocos2d/core/event-manager/CCEvent');

Event.EventMouse.pool = new Pool(5);
Event.EventMouse.pool.get = function (fromEvt, eventType) {
    var event = this._get() || new Event.EventMouse(eventType, true);
    event._button = fromEvt.getButton();
    var loc = fromEvt.getLocation();
    event._x = loc.x;
    event._y = loc.y;
    var listener = fromEvt._listener;
    if (listener) {
        event._prevX = listener._previousX;
        event._prevY = listener._previousY;
    }
    event._scrollX = fromEvt.getScrollX();
    event._scrollY = fromEvt.getScrollY();

    event._target = null;
    event._currentTarget = null;
    event.eventPhase = cc.Event.NONE;
    event._propagationStopped = false;
    event._propagationImmediateStopped = false;
    return event;
};

Event.EventTouch.pool = new Pool(5);
Event.EventTouch.pool.get = function (fromEvt) {
    var touchArr = fromEvt.getTouches();
    var event = this._get() || new Event.EventTouch(touchArr, true);
    event._eventCode = fromEvt.getEventCode();

    event._target = null;
    event._currentTarget = null;
    event.eventPhase = cc.Event.NONE;
    event._propagationStopped = false;
    event._propagationImmediateStopped = false;
    return event;
}

// cc.eventManager.addListener
cc.eventManager.addListener = function(listener, nodeOrPriority) {
    if(!(listener instanceof cc.EventListener)) {
        listener = cc.EventListener.create(listener);
    }

    if (typeof nodeOrPriority === 'number') {
        if (nodeOrPriority === 0) {
            cc.logID(3500);
            return;
        }

        cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
    } else {
        var node = nodeOrPriority;
        if (nodeOrPriority instanceof cc._BaseNode) {
            node = nodeOrPriority._sgNode;
        }
        else if (!(node instanceof _ccsg.Node)) {
            cc.warnID(3506);
            return;
        }
        cc.eventManager.addEventListenerWithSceneGraphPriority(listener, node);
    }

    return listener;
};
cc.eventManager._removeListeners = cc.eventManager.removeListeners;
cc.eventManager.removeListeners = function (target, recursive) {
    if (target instanceof cc._BaseNode) {
        target = target._sgNode;
    }
    
    if (target instanceof _ccsg.Node || cc.js.isNumber(target)) {
        this._removeListeners(target, recursive || false);
    }
    else {
        cc.warnID(3506);
    }
};
cc.eventManager._pauseTarget = cc.eventManager.pauseTarget;
cc.eventManager.pauseTarget = function (target, recursive) {
    var sgTarget = target;
    target._eventPaused = true;
    if (target instanceof cc._BaseNode) {
        sgTarget = target._sgNode;
    }
    else if (!(sgTarget instanceof _ccsg.Node)) {
        cc.warnID(3506);
        return;
    }

    if (sgTarget !== target && !sgTarget.isRunning()) {
        var originOnEnter = sgTarget.onEnter;
        sgTarget.onEnter = function () {
            originOnEnter.call(this);
            if (target._eventPaused) {
                cc.eventManager._pauseTarget(this, recursive || false);
            }
            this.onEnter = originOnEnter;
        };
    }
    this._pauseTarget(sgTarget, recursive || false);
};
cc.eventManager._resumeTarget = cc.eventManager.resumeTarget;
cc.eventManager.resumeTarget = function (target, recursive) {
    target._eventPaused = false;
    if (target instanceof cc._BaseNode) {
        target = target._sgNode;
    }
    else if (!(target instanceof _ccsg.Node)) {
        cc.warnID(3506);
        return;
    }
    this._resumeTarget(target, recursive || false);
};

cc._EventListenerKeyboard = cc.EventListenerKeyboard;
cc._EventListenerKeyboard.LISTENER_ID = "__cc_keyboard";
cc._EventListenerAcceleration = cc.EventListenerAcceleration;
cc._EventListenerAcceleration.LISTENER_ID = "__cc_acceleration";
cc._EventListenerTouchAllAtOnce = cc.EventListenerTouchAllAtOnce;
cc._EventListenerTouchAllAtOnce.LISTENER_ID = "__cc_touch_all_at_once";
cc._EventListenerTouchOneByOne = cc.EventListenerTouchOneByOne;
cc._EventListenerTouchOneByOne.LISTENER_ID = "__cc_touch_one_by_one";
cc._EventListenerMouse = cc.EventListenerMouse;
cc._EventListenerMouse.LISTENER_ID = "__cc_mouse";