/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
    _defaultPrevented: false,
    _propagationStopped: false,
    _propagationImmediateStopped: false,

    unuse: function () {
        this.type = cc.Event.NO_TYPE;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = cc.Event.NONE;
        this._defaultPrevented = false;
        this._propagationStopped = false;
        this._propagationImmediateStopped = false;
    },
    reuse: function (type, bubbles) {
        this.type = type;
        this.bubbles = bubbles || false;
    },
    preventDefault: function () {
        this._defaultPrevented = true;
    },
    stopPropagationImmediate: function () {
        this._propagationImmediateStopped = true;
    },
});

// cc.Event.EventCustom
cc.Event.EventCustom = function (type, bubbles) {
    cc.Event.call(this, cc.Event.CUSTOM);
    this.type = type;
    this.bubbles = bubbles || false;
    this.detail = null;
};
cc.js.extend(cc.Event.EventCustom, cc.Event);
cc.js.mixin(cc.Event.EventCustom.prototype, {
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
                                event._defaultPrevented = false;
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
    this._removeListeners(target, recursive || false);
};
cc.eventManager._pauseTarget = cc.eventManager.pauseTarget;
cc.eventManager.pauseTarget = function (target, recursive) {
    if (target instanceof cc.Component) {
        target = target.node._sgNode;
    }
    if (target instanceof cc.Node) {
        target = target._sgNode;
    }
    this._pauseTarget(this, target, recursive || false);
};
cc.eventManager._resumeTarget = cc.eventManager.resumeTarget;
cc.eventManager.resumeTarget = function (target, recursive) {
    if (target instanceof cc.Component) {
        target = target.node._sgNode;
    }
    if (target instanceof cc.Node) {
        target = target._sgNode;
    }
    this._resumeTarget(this, target, recursive || false);
};