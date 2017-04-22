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

// cc.Event
cc.Event.NO_TYPE = 'no_type';
cc.Event.NONE = 0;
cc.Event.CAPTURING_PHASE = 1;
cc.Event.AT_TARGET = 2;
cc.Event.BUBBLING_PHASE = 3;

cc.Event.EventMouse = cc.EventMouse;
cc.Event.EventTouch = cc.EventTouch;
cc.Event.EventAcceleration = cc.EventAcceleration;
cc.Event.EventKeyboard = cc.EventKeyboard;

var proto = cc.Event.prototype;
proto._getCurrentTarget = proto.getCurrentTarget;
proto.getCurrentTarget = function () {
    return this._currentTarget || this._getCurrentTarget();
};
proto._stopPropagation = proto.stopPropagation;
proto.stopPropagation = function () {
    this._propagationStopped = true;
    this._stopPropagation();
};
proto._isStopped = proto.isStopped;
proto.isStopped = function () {
    return this._propagationStopped || this._propagationImmediateStopped || this._isStopped();
};
cc.js.mixin(proto, {
    type: 'no_type',
    _target: null,
    _currentTarget: null,
    eventPhase: 0,
    bubbles: false,
    _propagationStopped: false,
    _propagationImmediateStopped: false,

    unuse: function () {
        this.type = cc.Event.NO_TYPE;
        this._target = null;
        this._currentTarget = null;
        this.eventPhase = cc.Event.NONE;
        this._propagationStopped = false;
        this._propagationImmediateStopped = false;
    },
    reuse: function (type, bubbles) {
        this.type = type;
        this.bubbles = bubbles || false;
    },
    stopPropagationImmediate: function () {
        this._propagationImmediateStopped = true;
    },
});
cc.js.getset(proto, 'target', function () {
    if (!this._target) {
        var currentTarget = this._currentTarget || this._getCurrentTarget();
        this._target = currentTarget._entity || currentTarget;
    }
    return this._target;
}, function (value) {
    this._target = value;
});
cc.js.getset(proto, 'currentTarget', proto.getCurrentTarget, function (value) {
    this._currentTarget = value;
});

// cc.Event.EventCustom
cc.Event.EventCustom = function (type, bubbles) {
    this.target = null;
    this.currentTarget = null;
    this.eventPhase = 0;
    this._propagationStopped = false;
    this._propagationImmediateStopped = false;

    this.type = type;
    this.bubbles = bubbles || false;
    this.detail = null;
};
cc.js.extend(cc.Event.EventCustom, cc.Event);
cc.js.mixin(cc.Event.EventCustom.prototype, {
    reset: cc.Event.EventCustom,
    stopPropagation: function () {
        this._propagationStopped = true;
    },
    isStopped: function () {
        return this._propagationStopped || this._propagationImmediateStopped;
    },
    getCurrentTarget: function () {
        return this.currentTarget;
    },
    getType: function () {
        return this.type;
    },

    setUserData: function (data) {
        this.detail = data;
    },
    getUserData: function () {
        return this.detail;
    },
    getEventName: cc.Event.prototype.getType
});

var _eventPool = [];
var MAX_POOL_SIZE = 10;
cc.Event.EventCustom.put = function (event) {
    if (_eventPool.length < MAX_POOL_SIZE) {
        _eventPool.push(event);
    }
};
cc.Event.EventCustom.get = function (type, bubbles) {
    var event = _eventPool.pop();
    if (event) {
        event.reset(type, bubbles);
    }
    else {
        event = new cc.Event.EventCustom(type, bubbles);
    }
    return event;
};

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

cc.js.mixin(cc.EventTouch.prototype, {
    setLocation: function (x, y) {
        this.touch && this.touch.setTouchInfo(this.touch.getID(), x, y);
    },

    getLocation: function () {
        return this.touch ? this.touch.getLocation() : cc.v2();
    },

    getLocationInView: function() {
        return this.touch ? this.touch.getLocationInView() : cc.v2();
    },

    getPreviousLocation:function () {
        return this.touch ? this.touch.getPreviousLocation() : cc.v2();
    },

    getStartLocation: function() {
        return this.touch ? this.touch.getStartLocation() : cc.v2();
    },

    getID:function () {
        return this.touch ? this.touch.getID() : null;
    },

    getDelta: function () {
        return this.touch ? this.touch.getDelta() : cc.v2();
    },

    getDeltaX: function () {
        return this.touch ? this.touch.getDelta().x : 0;
    },

    getDeltaY: function () {
        return this.touch ? this.touch.getDelta().y : 0;
    },

    getLocationX: function () {
        return this.touch ? this.touch.getLocationX() : 0;
    },

    getLocationY: function () {
        return this.touch ? this.touch.getLocationY() : 0;
    }
});