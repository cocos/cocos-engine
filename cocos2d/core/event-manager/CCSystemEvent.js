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

var JS = cc.js;

var Event = cc.Event;

/**
 * The type code of Touch event.
 * @constant
 * @type {String}
 */
cc.Event.TOUCH = 'touch';
/**
 * The type code of Mouse event.
 * @constant
 * @type {String}
 */
cc.Event.MOUSE = 'mouse';
/**
 * The type code of UI focus event.
 * @constant
 * @type {String}
 */
cc.Event.FOCUS = 'focus';
/**
 * The type code of Keyboard event.
 * @constant
 * @memberof cc.Event
 * @type {String}
 */
cc.Event.KEYBOARD = 'keyboard';
/**
 * The type code of Acceleration event.
 * @constant
 * @memberof cc.Event
 * @type {String}
 */
cc.Event.ACCELERATION = 'acceleration';

/**
 * The mouse event
 * @class Event.EventMouse
 * @constructor
 * @extends Event
 * @param {Number} eventType - The mouse event type, UP, DOWN, MOVE, CANCELED
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventMouse = function (eventType, bubbles) {
    cc.Event.call(this, cc.Event.MOUSE, bubbles);
    this._eventType = eventType;
    this._button = 0;
    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
    this._scrollX = 0;
    this._scrollY = 0;
};

JS.extend(EventMouse, cc.Event);
JS.mixin(EventMouse.prototype, {
    /**
     * Sets scroll data.
     * @method setScrollData
     * @param {Number} scrollX
     * @param {Number} scrollY
     */
    setScrollData: function (scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
    },

    /**
     * Returns the x axis scroll value.
     * @method getScrollX
     * @returns {Number}
     */
    getScrollX: function () {
        return this._scrollX;
    },

    /**
     * Returns the y axis scroll value.
     * @method getScrollY
     * @returns {Number}
     */
    getScrollY: function () {
        return this._scrollY;
    },

    /**
     * Sets cursor location.
     * @method setLocation
     * @param {Number} x
     * @param {Number} y
     */
    setLocation: function (x, y) {
        this._x = x;
        this._y = y;
    },

    /**
     * Returns cursor location.
     * @method getLocation
     * @return {Vec2} location
     */
    getLocation: function () {
        return {x: this._x, y: this._y};
    },

    /**
     * Returns the current cursor location in screen coordinates.
     * @method getLocationInView
     * @return {Vec2}
     */
    getLocationInView: function() {
        return {x: this._x, y: cc.view._designResolutionSize.height - this._y};
    },

    _setPrevCursor: function (x, y) {
        this._prevX = x;
        this._prevY = y;
    },

    /**
     * Returns the delta distance from the previous location to current location.
     * @method getDelta
     * @return {Vec2}
     */
    getDelta: function () {
        return {x: this._x - this._prevX, y: this._y - this._prevY};
    },

    /**
     * Returns the X axis delta distance from the previous location to current location.
     * @method getDeltaX
     * @return {Number}
     */
    getDeltaX: function () {
        return this._x - this._prevX;
    },

    /**
     * Returns the Y axis delta distance from the previous location to current location.
     * @method getDeltaY
     * @return {Number}
     */
    getDeltaY: function () {
        return this._y - this._prevY;
    },

    /**
     * Sets mouse button.
     * @method setButton
     * @param {Number} button
     */
    setButton: function (button) {
        this._button = button;
    },

    /**
     * Returns mouse button.
     * @method getButton
     * @returns {Number}
     */
    getButton: function () {
        return this._button;
    },

    /**
     * Returns location X axis data.
     * @method getLocationX
     * @returns {Number}
     */
    getLocationX: function () {
        return this._x;
    },

    /**
     * Returns location Y axis data.
     * @method getLocationY
     * @returns {Number}
     */
    getLocationY: function () {
        return this._y;
    }
});

//Inner event types of MouseEvent
/**
 * The none event code of mouse event.
 * @constant
 * @type {Number}
 */
EventMouse.NONE = 0;
/**
 * The event type code of mouse down event.
 * @constant
 * @type {Number}
 */
EventMouse.DOWN = 1;
/**
 * The event type code of mouse up event.
 * @constant
 * @type {Number}
 */
EventMouse.UP = 2;
/**
 * The event type code of mouse move event.
 * @constant
 * @type {Number}
 */
EventMouse.MOVE = 3;
/**
 * The event type code of mouse scroll event.
 * @constant
 * @type {Number}
 */
EventMouse.SCROLL = 4;

/**
 * The tag of Mouse left button
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_LEFT = 0;

/**
 * The tag of Mouse right button  (The right button number is 2 on browser)
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_RIGHT = 2;

/**
 * The tag of Mouse middle button  (The right button number is 1 on browser)
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_MIDDLE = 1;

/**
 * The tag of Mouse button 4
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_4 = 3;

/**
 * The tag of Mouse button 5
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_5 = 4;

/**
 * The tag of Mouse button 6
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_6 = 5;

/**
 * The tag of Mouse button 7
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_7 = 6;

/**
 * The tag of Mouse button 8
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_8 = 7;

/**
 * The touch event
 * @class Event.EventTouch
 * @constructor
 * @extends Event
 * @param {Array} [touchArr=[]] - The array of the touches
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
EventTouch = function (touchArr, bubbles) {
    cc.Event.call(this, cc.Event.TOUCH, bubbles);
    this._eventCode = 0;
    this._touches = touchArr || [];
    this.currentTouch = null;
};

JS.extend(EventTouch, cc.Event);
JS.mixin(EventTouch.prototype, {
    /**
     * Returns event code.
     * @method getEventCode
     * @returns {Number}
     */
    getEventCode: function () {
        return this._eventCode;
    },

    /**
     * Returns touches of event.
     * @method getTouches
     * @returns {Array}
     */
    getTouches: function () {
        return this._touches;
    },

    _setEventCode: function (eventCode) {
        this._eventCode = eventCode;
    },

    _setTouches: function (touches) {
        this._touches = touches;
    }
});

/**
 * The maximum touch numbers
 * @constant
 * @type {Number}
 */
EventTouch.MAX_TOUCHES = 5;

/**
 * The event type code of touch began event.
 * @constant
 * @type {Number}
 */
EventTouch.BEGAN = 0;
/**
 * The event type code of touch moved event.
 * @constant
 * @type {Number}
 */
EventTouch.MOVED = 1;
/**
 * The event type code of touch ended event.
 * @constant
 * @type {Number}
 */
EventTouch.ENDED = 2;
/**
 * The event type code of touch cancelled event.
 * @constant
 * @type {Number}
 */
EventTouch.CANCELED = 3;

/**
 * Focus change event for UI widget
 * @class Event.EventFocus
 * @constructor
 * @extends Event
 * @param {Widget} widgetLoseFocus
 * @param {Widget} widgetGetFocus
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
EventFocus = function (widgetGetFocus, widgetLoseFocus, bubbles) {
    cc.Event.call(this, cc.Event.FOCUS, bubbles);
    this._widgetGetFocus = widgetGetFocus;
    this._widgetLoseFocus = widgetLoseFocus;
};
JS.extend(EventFocus, cc.Event);

/**
 * The acceleration event
 * @class Event.EventAcceleration
 * @extends Event
 * @constructor
 * @param {Object} acc - The acceleration
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
EventAcceleration = function (acc, bubbles) {
    cc.Event.call(this, Event.ACCELERATION, bubbles);
    this._acc = acc;
};
JS.extend(EventAcceleration, cc.Event);

/**
 * The keyboard event
 * @class Event.EventKeyboard
 * @extends Event
 * @constructor
 * @param {Number} keyCode - The key code of which triggered this event
 * @param {Boolean} isPressed - A boolean indicating whether the key have been pressed
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
EventKeyboard = function (keyCode, isPressed, bubbles) {
    cc.Event.call(this, Event.KEYBOARD, bubbles);
    this._keyCode = keyCode;
    this._isPressed = isPressed;
};
JS.extend(EventKeyboard, cc.Event);

cc.Event.EventMouse = EventMouse;
cc.Event.EventTouch = EventTouch;
cc.Event.EventFocus = EventFocus;
cc.Event.EventAcceleration = EventAcceleration;
cc.Event.EventKeyboard = EventKeyboard;

module.exports = Event;