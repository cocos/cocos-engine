/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2015 Chukong Technologies Inc.

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

var JS = require("../platform/js");

/**
 * Base class of all kinds of events.
 * @class Event
 * @constructor
 * @param {string} type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
 * @param {boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
cc.Event = function(type, bubbles) {
    /**
     * The name of the event (case-sensitive), e.g. "click", "fire", or "submit".
     * @property type
     * @type {String}
     */
    this.type = type;

    /**
     * A reference to the target to which the event was originally dispatched.
     * @property bubbles
     * @type {Object}
     */
    this.bubbles = bubbles || false;

    /**
     * A reference to the target to which the event was originally dispatched.
     * @property target
     * @type {Object}
     */
    this.target = null;

    /**
     * A reference to the currently registered target for the event.
     * @property currentTarget
     * @type {Object}
     */
    this.currentTarget = null;

    /**
     * Indicates which phase of the event flow is currently being evaluated.
     * Returns an integer value represented by 4 constants:
     *  - Event.NONE = 0
     *  - Event.CAPTURING_PHASE = 1
     *  - Event.AT_TARGET = 2
     *  - Event.BUBBLING_PHASE = 3
     * The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
     * (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
     *
     * @property eventPhase
     * @type {Number}
     */
    this.eventPhase = 0;

    /**
     * Indicates whether or not event.preventDefault() has been called on the event.
     * @property _defaultPrevented
     * @type {Boolean}
     * @private
     */
    this._defaultPrevented = false;

    /**
     * Indicates whether or not event.stopPropagation() has been called on the event.
     * @property _propagationStopped
     * @type {Boolean}
     * @private
     */
    this._propagationStopped = false;

    /**
     * Indicates whether or not event.stopPropagationImmediate() has been called on the event.
     * @property _propagationImmediateStopped
     * @type {Boolean}
     * @private
     */
    this._propagationImmediateStopped = false;
};
cc.Event.prototype = {
    constructor: cc.Event,

    /**
     * Reset the event for being stored in the object pool.
     * @method unuse
     * @returns {String}
     */
    unuse: function () {
        this.type = cc.Event.NO_TYPE;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = cc.Event.NONE;
        this._defaultPrevented = false;
        this._propagationStopped = false;
        this._propagationImmediateStopped = false;
    },

    /**
     * Reuse the event for being used again by the object pool.
     * @method reuse
     * @returns {String}
     */
    reuse: function (type, bubbles) {
        this.type = type;
        this.bubbles = bubbles || false;
    },

    /**
     * If invoked when the cancelable attribute value is true, signals to the operation that caused event to be dispatched that it needs to be canceled.
     * @method preventDefault
     */
    preventDefault: function () {
        this._defaultPrevented = true;
    },

    /**
     * Stops propagation for current event.
     * @method stopPropagation
     */
    stopPropagation: function () {
        this._propagationStopped = true;
    },

    /**
     * Stops propagation for current event immediately, 
     * the event won't even be dispatched to the listeners attached in the current target.
     * @method stopPropagationImmediate
     */
    stopPropagationImmediate: function () {
        this._propagationImmediateStopped = true;
    },

    /**
     * Checks whether the event has been stopped.
     * @method isStopped
     * @returns {Boolean}
     */
    isStopped: function () {
        return this._propagationStopped || this._propagationImmediateStopped;
    },

    /**
     * <p>
     *     Gets current target of the event                                                            <br/>
     *     note: It only be available when the event listener is associated with node.                <br/>
     *          It returns 0 when the listener is associated with fixed priority.
     * </p>
     * @method getCurrentTarget
     * @returns {Node}  The target with which the event associates.
     */
    getCurrentTarget: function () {
        return this.currentTarget;
    },
    
    /**
     * Gets the event type.
     * @method getType
     * @returns {String}
     */
    getType: function () {
        return this.type;
    }
};

//event type
/**
 * Code for event without type.
 * @constant
 * @type {string}
 */
cc.Event.NO_TYPE = 'no_type';

//event phase
/**
 * Events not currently dispatched are in this phase
 * @property NONE
 * @type {Number}
 * @static
 * @final
 */
cc.Event.NONE = 0;
/**
 * The capturing phase comprises the journey from the root to the last node before the event target's node
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * @property CAPTURING_PHASE
 * @type {Number}
 * @static
 * @final
 */
cc.Event.CAPTURING_PHASE = 1;
/**
 * The target phase comprises only the event target node
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * @property AT_TARGET
 * @type {Number}
 * @static
 * @final
 */
cc.Event.AT_TARGET = 2;
/**
 * The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * @property BUBBLING_PHASE
 * @type {Number}
 * @static
 * @final
 */
cc.Event.BUBBLING_PHASE = 3;

/**
 * The Custom event
 * @class Event.EventCustom
 * @constructor
 * @extends Event
 * @param {String} type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventCustom = function (type, bubbles) {
    cc.Event.call(this, type, bubbles);

    /**
     * A reference to the detailed data of the event
     * @property detail
     * @type {Object}
     */
    this.detail = null;
};

JS.extend(EventCustom, cc.Event);
JS.mixin(EventCustom.prototype, {
    /**
     * Sets user data
     * @param {*} data
     */
    setUserData: function (data) {
        this.detail = data;
    },

    /**
     * Gets user data
     * @returns {*}
     */
    getUserData: function () {
        return this.detail;
    },

    /**
     * Gets event name
     * @returns {String}
     */
    getEventName: cc.Event.prototype.getType
});

cc.Event.EventCustom = EventCustom;

module.exports = cc.Event;