var EventListeners = require('./event-listeners');
var Event = require('./event');
var EventCustom = Event.EventCustom;
var JS = cc.js;

var cachedArray = new Array(16);
cachedArray.length = 0;

var _doDispatchEvent = function (owner, event, args) {
    var target, i;
    event.target = owner;

    // Event.CAPTURING_PHASE
    owner._getCapturingTargets(event.type, cachedArray);
    // propagate
    event.eventPhase = 1;
    for (i = cachedArray.length - 1; i >= 0; --i) {
        target = cachedArray[i];
        if (target._isTargetActive(event.type) && target._capturingListeners) {
            event.currentTarget = target;
            // fire event
            target._capturingListeners.invoke(event);
            // check if propagation stopped
            if (event._propagationStopped) {
                return;
            }
        }
    }
    cachedArray.length = 0;

    // Event.AT_TARGET
    // checks if destroyed in capturing callbacks
    if (owner._isTargetActive(event.type)) {
        _doSendEvent(owner, event);
        if (event._propagationStopped) {
            return;
        }
    }

    if (event.bubbles) {
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
                    return;
                }
            }
        }
    }
    cachedArray.length = 0;
};


var _doSendEvent = function (owner, event) {
    // Event.AT_TARGET
    event.eventPhase = 2;
    event.currentTarget = owner;
    if (owner._capturingListeners) {
        owner._capturingListeners.invoke(event);
        if (event._propagationStopped) {
            return;
        }
    }
    if (owner._bubblingListeners) {
        owner._bubblingListeners.invoke(event);
    }
};

/**
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
 * @class EventTarget
 */
var EventTarget = function () {
};

JS.mixin(EventTarget.prototype, {
    /**
     * @property _capturingListeners
     * @type {EventListeners}
     * @default null
     * @private
     */
    _capturingListeners: null,

    /**
     * @property _bubblingListeners
     * @type {EventListeners}
     * @default null
     * @private
     */
    _bubblingListeners: null,

    /**
     * Checks whether the EventTarget object has any callback registered for a specific type of event.
     *
     * @param {String} type - The type of event.
     * @param {Boolean} A value of true if a callback of the specified type is registered; false otherwise.
     */
    hasEventListener: function (type) {
        return this._bubblingListeners.has(type) || this._capturingListeners.has(type);
    },

    /**
     * Register an callback of a specific event type on the EventTarget.
     * This method is merely an alias to addEventListener.
     *
     * @method on
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.param event
     * @param {Object} [target] - The target to invoke the callback, can be null
     * @param {Boolean} [useCapture=false] - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
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
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     *
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} callback - The callback to remove.
     * @param {Object} [target] - The target to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} [useCapture=false] - Specifies whether the callback being removed was registered as a capturing callback or not.
     *                              If not specified, useCapture defaults to false. If a callback was registered twice,
     *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
     *                              does not affect a non-capturing version of the same listener, and vice versa.
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
     * Removes all callbacks previously registered with the same target.
     *
     * @method targetOff
     * @param {Object} target - The target to be searched for all related callbacks
     */
    targetOff: function (target) {
        this._capturingListeners.removeAll(target);
        this._bubblingListeners.removeAll(target);
    },

    /**
     * Register an callback of a specific event type on the EventTarget, the callback will remove itself after the first time it is triggered.
     *
     * @method once
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.param event
     * @param {Object} [target] - The target to invoke the callback, can be null
     * @param {Boolean} [useCapture=false] - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
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
     * Dispatches an event into the event flow. The event target is the EventTarget object upon which the dispatchEvent() method is called.
     *
     * @method dispatchEvent
     * @param {Event} event - The Event object that is dispatched into the event flow
     * @return {Boolean} - returns true if either the event's preventDefault() method was not invoked,
     *                      or its cancelable attribute value is false, and false otherwise.
     */
    dispatchEvent: function (event) {
        _doDispatchEvent(this, event);
        cachedArray.length = 0;
        var notPrevented = ! event._defaultPrevented;
        // event.unuse();
        return notPrevented;
    },

    /**
     * Send an event to this object directly, this method will not propagate the event to any other objects.
     * The event will be created from the supplied message, you can get the "detail" argument from event.detail.
     *
     * @method emit
     * @param {String} message - the message to send
     * @param {any} [detail] - whatever argument the message needs
     */
    emit: function (message, detail) {
        if ( typeof message === 'string' ) {
            var event = new EventCustom(message);
            event.detail = detail;
            _doSendEvent(this, event);
        }
        else {
            cc.error('The message must be provided');
        }
    },

    /**
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

    /**
     * Get all the targets listening to the supplied type of event in the target's capturing phase.
     * The capturing phase comprises the journey from the root to the last node BEFORE the event target's node.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getCapturingTargets
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     * @example {@link utils/api/cocos/docs/cocos2d/core/event/_getCapturingTargets.js}
     */
    _getCapturingTargets: function (type, array) {

    },

    /**
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

/**
 * Polyfill the functionalities of EventTarget into a existing object.
 * @static
 * @memberof EventTarget
 * @param {Object} object - An object to be extended with EventTarget capability
 */
EventTarget.polyfill = function (object) {
    var proto = EventTarget.prototype;
    // Can't use cc.js.mixin because we don't want to inject polyfill or overwrite _getXXXTargets
    object._capturingListeners = null;
    object._bubblingListeners = null;

    object.hasEventListener = proto.hasEventListener;
    object.on = proto.on;
    object.off = proto.off;
    object.once = proto.once;
    object.dispatchEvent = proto.dispatchEvent;
    object.emit = proto.emit;
    if (!object._isTargetActive)
        object._isTargetActive = proto._isTargetActive;
    if (!object._getCapturingTargets)
        object._getCapturingTargets = proto._getCapturingTargets;
    if (!object._getBubblingTargets)
        object._getBubblingTargets = proto._getBubblingTargets;
};

cc.EventTarget = module.exports = EventTarget;
