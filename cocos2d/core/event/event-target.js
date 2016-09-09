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
var EventListeners = require('./event-listeners');
require('./event');
var JS = cc.js;

var cachedArray = new Array(16);
cachedArray.length = 0;

var _doDispatchEvent = function (owner, event) {
    var target, i;
    event.target = owner;

    // Event.CAPTURING_PHASE
    cachedArray.length = 0;
    owner._getCapturingTargets(event.type, cachedArray);
    // capturing
    event.eventPhase = 1;
    for (i = cachedArray.length - 1; i >= 0; --i) {
        target = cachedArray[i];
        if (target._isTargetActive(event.type) && target._capturingListeners) {
            event.currentTarget = target;
            // fire event
            target._capturingListeners.invoke(event);
            // check if propagation stopped
            if (event._propagationStopped) {
                cachedArray.length = 0;
                return;
            }
        }
    }
    cachedArray.length = 0;

    // Event.AT_TARGET
    // checks if destroyed in capturing callbacks
    if (owner._isTargetActive(event.type)) {
        // Event.AT_TARGET
        event.eventPhase = 2;
        event.currentTarget = owner;
        if (owner._capturingListeners) {
            owner._capturingListeners.invoke(event);
        }
        if (!event._propagationImmediateStopped && owner._bubblingListeners) {
            owner._bubblingListeners.invoke(event);
        }
    }

    if (!event._propagationStopped && event.bubbles) {
        // Event.BUBBLING_PHASE
        owner._getBubblingTargets(event.type, cachedArray);
        // propagate
        event.eventPhase = 3;
        for (i = 0; i < cachedArray.length; ++i) {
            target = cachedArray[i];
            if (target._isTargetActive(event.type) && target._bubblingListeners) {
                event.currentTarget = target;
                // fire event
                target._bubblingListeners.invoke(event);
                // check if propagation stopped
                if (event._propagationStopped) {
                    cachedArray.length = 0;
                    return;
                }
            }
        }
    }
    cachedArray.length = 0;
};

/**
 * !#en
 * EventTarget is an object to which an event is dispatched when something has occurred.
 * Entity are the most common event targets, but other objects can be event targets too.
 *
 * Event targets are an important part of the Fireball event model.
 * The event target serves as the focal point for how events flow through the scene graph.
 * When an event such as a mouse click or a keypress occurs, Fireball dispatches an event object
 * into the event flow from the root of the hierarchy. The event object then makes its way through
 * the scene graph until it reaches the event target, at which point it begins its return trip through
 * the scene graph. This round-trip journey to the event target is conceptually divided into three phases:
 * - The capture phase comprises the journey from the root to the last node before the event target's node
 * - The target phase comprises only the event target node
 * - The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the tree
 * See also: http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 *
 * Event targets can implement the following methods:
 *  - _getCapturingTargets
 *  - _getBubblingTargets
 *
 * !#zh
 * 事件目标是事件触发时，分派的事件对象，Node 是最常见的事件目标，
 * 但是其他对象也可以是事件目标。<br/>
 *
 * @class EventTarget
 */
var EventTarget = function () {
    /*
     * @property _capturingListeners
     * @type {EventListeners}
     * @default null
     * @private
     */
    this._capturingListeners = null;

    /*
     * @property _bubblingListeners
     * @type {EventListeners}
     * @default null
     * @private
     */
    this._bubblingListeners = null;
};

JS.mixin(EventTarget.prototype, {

    /**
     * !#en Checks whether the EventTarget object has any callback registered for a specific type of event.
     * !#zh 检查事件目标对象是否为不特定类型的事件注册的回调。
     * @param {String} type - The type of event.
     * @param {Boolean} checkCapture - Check for capturing or bubbling phase, check bubbling phase by default.
     * @return {Boolean} True if a callback of the specified type is registered in specified phase; false otherwise.
     */
    hasEventListener: function (type, checkCapture) {
        if (checkCapture && this._capturingListeners && this._capturingListeners.has(type))
            return true;
        if (!checkCapture && this._bubblingListeners && this._bubblingListeners.has(type))
            return true;
        return false;
    },

    /**
     * !#en
     * Register an callback of a specific event type on the EventTarget.
     * This method is merely an alias to addEventListener.
     * !#zh
     * 注册事件目标的特定事件类型回调，仅仅是 addEventListener 的别名。
     *
     * @method on
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.param event
     * @param {Object} target - The target to invoke the callback, can be null
     * @param {Boolean} useCapture - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @example
     * node.on(cc.Node.EventType.TOUCH_END, function (event) {
     *     cc.log("this is callback");
     * }, node);
     */
    on: function (type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        }
        else useCapture = !!useCapture;
        if (!callback) {
            cc.error('Callback of event must be non-nil');
            return;
        }
        var listeners = null;
        if (useCapture) {
            listeners = this._capturingListeners = this._capturingListeners || new EventListeners();
        }
        else {
            listeners = this._bubblingListeners = this._bubblingListeners || new EventListeners();
        }
        if ( ! listeners.has(type, callback, target) ) {
            listeners.add(type, callback, target);

            if (target && target.__eventTargets)
                target.__eventTargets.push(this);
        }
        return callback;
    },

    /**
     * !#en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * !#zh
     * 删除之前与同类型，回调，目标或 useCapture 注册的回调，仅仅是 removeEventListener 的别名。
     *
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} callback - The callback to remove.
     * @param {Object} target - The target to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} useCapture - Specifies whether the callback being removed was registered as a capturing callback or not.
     *                              If not specified, useCapture defaults to false. If a callback was registered twice,
     *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
     *                              does not affect a non-capturing version of the same listener, and vice versa.
     * @example
     * // register touchEnd eventListener
     * var touchEnd = node.on(cc.Node.EventType.TOUCH_END, function (event) {
     *     cc.log("this is callback");
     * }, node);
     * // remove touchEnd eventListener
     * node.off(cc.Node.EventType.TOUCH_END, touchEnd, node);
     */
    off: function (type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        }
        else useCapture = !!useCapture;
        if (!callback) {
            return;
        }
        var listeners = useCapture ? this._capturingListeners : this._bubblingListeners;
        if (listeners) {
            listeners.remove(type, callback, target);

            if (target && target.__eventTargets) {
                var index = target.__eventTargets.indexOf(this);
                target.__eventTargets.splice(index, 1);
            }
        }
    },

    /**
     * !#en Removes all callbacks previously registered with the same target.
     * !#zh 删除指定目标上的所有注册回调。
     * @method targetOff
     * @param {Object} target - The target to be searched for all related callbacks
     */
    targetOff: function (target) {
        if (this._capturingListeners) {
            this._capturingListeners.removeAll(target);
        }
        if (this._bubblingListeners) {
            this._bubblingListeners.removeAll(target);
        }
    },

    /**
     * !#en
     * Register an callback of a specific event type on the EventTarget,
     * the callback will remove itself after the first time it is triggered.
     * !#zh
     * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @method once
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.param event
     * @param {Object} target - The target to invoke the callback, can be null
     * @param {Boolean} useCapture - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     * @example
     * node.once(cc.Node.EventType.TOUCH_END, function (event) {
     *     cc.log("this is callback");
     * }, node);
     */
    once: function (type, callback, target, useCapture) {
        var self = this;
        var cb = function (event) {
            self.off(type, cb, target, useCapture);
            callback.call(this, event);
        };
        this.on(type, cb, target, useCapture);
    },

    /**
     * !#en
     * Dispatches an event into the event flow.
     * The event target is the EventTarget object upon which the dispatchEvent() method is called.
     * !#zh 分发事件到事件流中。
     *
     * @method dispatchEvent
     * @param {Event} event - The Event object that is dispatched into the event flow
     */
    dispatchEvent: function (event) {
        _doDispatchEvent(this, event);
        cachedArray.length = 0;
    },

    /**
     * !#en
     * Send an event to this object directly, this method will not propagate the event to any other objects.
     * The event will be created from the supplied message, you can get the "detail" argument from event.detail.
     * !#zh
     * 该对象直接发送事件， 这种方法不会对事件传播到任何其他对象。
     *
     * @method emit
     * @param {String} message - the message to send
     * @param {*} [detail] - whatever argument the message needs
     */
    emit: function (message, detail) {
        if (CC_DEV && typeof message !== 'string') {
            cc.error('The message must be provided');
            return;
        }
        //don't emit event when listeners are not exists.
        var caplisteners = this._capturingListeners && this._capturingListeners._callbackTable[message];
        var bublisteners = this._bubblingListeners && this._bubblingListeners._callbackTable[message];
        if ((!caplisteners || caplisteners.length === 0) && (!bublisteners || bublisteners.length === 0)) {
            return;
        }

        var event = new cc.Event.EventCustom(message);
        event.detail = detail;

        // Event.AT_TARGET
        event.eventPhase = 2;
        event.target = event.currentTarget = this;
        if (caplisteners) {
            this._capturingListeners.invoke(event);
        }
        if (bublisteners && !event._propagationImmediateStopped) {
            this._bubblingListeners.invoke(event);
        }
    },

    /*
     * Get whether the target is active for events.
     * The name is for avoiding conflict with user defined functions.
     *
     * Subclasses can override this method to make event target active or inactive.
     * @method _isTargetActive
     * @param {String} type - the event type
     * @return {Boolean} - A boolean value indicates the event target is active or not
     */
    _isTargetActive: function (type) {
        return true;
    },

    /*
     * Get all the targets listening to the supplied type of event in the target's capturing phase.
     * The capturing phase comprises the journey from the root to the last node BEFORE the event target's node.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getCapturingTargets
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     * @example {@link utils/api/engine/docs/cocos2d/core/event/_getCapturingTargets.js}
     */
    _getCapturingTargets: function (type, array) {

    },

    /*
     * Get all the targets listening to the supplied type of event in the target's bubbling phase.
     * The bubbling phase comprises any SUBSEQUENT nodes encountered on the return trip to the root of the tree.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getBubblingTargets
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     */
    _getBubblingTargets: function (type, array) {
        // Object can override this method to make event propagable.
    }
});
// Improve performance of function call (avoid using EventTarget.prototype.on.call)
EventTarget.prototype._EventTargetOn = EventTarget.prototype.on;
EventTarget.prototype._EventTargetOnce = EventTarget.prototype.once;
EventTarget.prototype._EventTargetOff = EventTarget.prototype.off;
EventTarget.prototype._EventTargetTargetOff = EventTarget.prototype.targetOff;

cc.EventTarget = module.exports = EventTarget;
