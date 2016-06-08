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

cc.Event.prototype._getCurrentTarget = cc.Event.prototype.getCurrentTarget;
cc.Event.prototype.getCurrentTarget = function () {
    return this.currentTarget || this._getCurrentTarget();
};
cc.Event.prototype._stopPropagation = cc.Event.prototype.stopPropagation;
cc.Event.prototype.stopPropagation = function () {
    this._propagationStopped = true;
    this._stopPropagation();
};
cc.Event.prototype._isStopped = cc.Event.prototype.isStopped;
cc.Event.prototype.isStopped = function () {
    return this._propagationStopped || this._propagationImmediateStopped || this._isStopped();
};
cc.js.mixin(cc.Event.prototype, {
    type: 'no_type',
    target: null,
    currentTarget: null,
    eventPhase: 0,
    bubbles: false,
    _propagationStopped: false,
    _propagationImmediateStopped: false,

    unuse: function () {
        this.type = cc.Event.NO_TYPE;
        this.target = null;
        this.currentTarget = null;
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

// cc.eventManager.addListener
cc.eventManager.addListener = function(listener, nodeOrPriority) {
    if(!(listener instanceof cc.EventListener)) {
        listener = cc.EventListener.create(listener);
    }

    if (typeof nodeOrPriority === 'number') {
        if (nodeOrPriority === 0) {
            cc.log('0 priority is forbidden for fixed priority since it\'s used for scene graph based priority.');
            return;
        }

        cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
    } else {
        var node = nodeOrPriority;
        if (nodeOrPriority instanceof cc.Component) {
            node = nodeOrPriority.node._sgNode;
        }
        if (nodeOrPriority instanceof cc.Node) {
            node = nodeOrPriority._sgNode;
        }
        // rebind target
        if (node !== nodeOrPriority) {
            var keys = Object.keys(listener);
            // Overwrite all functions
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                var value = listener[key];
                if (typeof value === 'function') {
                    // var _value = value;
                    listener[key] = (function (realCallback) {
                        return function (event1, event2) {
                            // event must be the last argument, and arguments count could be 1 or 2 
                            var event = event2 || event1;
                            // Augment event object to fit cc.Event
                            if (event) {
                                event.target = nodeOrPriority;
                                event.currentTarget = nodeOrPriority;
                                event.bubbles = false;
                                event.eventPhase = 0;
                                event._propagationStopped = false;
                                event._propagationImmediateStopped = false;
                            }
                            return realCallback.call(this, event1, event2);
                        };
                    })(value);
                }
            }
        }
        cc.eventManager.addEventListenerWithSceneGraphPriority(listener, node);
    }

    return listener;
};
cc.eventManager._removeListeners = cc.eventManager.removeListeners;
cc.eventManager.removeListeners = function (target, recursive) {
    if (target instanceof cc.Component) {
        target = target.node._sgNode;
    }
    if (target instanceof cc.Node) {
        target = target._sgNode;
    }
    else if (!(target instanceof _ccsg.Node)) {
        return;
    }
    this._removeListeners(target, recursive || false);
};
cc.eventManager._pauseTarget = cc.eventManager.pauseTarget;
cc.eventManager.pauseTarget = function (target, recursive) {
    var sgTarget = target;
    target._eventPaused = true;
    if (target instanceof cc.Component) {
        sgTarget = target.node._sgNode;
    }
    else if (target instanceof cc.Node) {
        sgTarget = target._sgNode;
    }
    else if (!(sgTarget instanceof _ccsg.Node)) {
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
    if (target instanceof cc.Component) {
        target = target.node._sgNode;
    }
    if (target instanceof cc.Node) {
        target = target._sgNode;
    }
    else if (!(target instanceof _ccsg.Node)) {
        return;
    }
    this._resumeTarget(target, recursive || false);
};

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
        return this.touch ? this.getID() : null;
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