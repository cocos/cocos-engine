/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

var js = cc.js;

require('../event/event');

/**
 * !#en The mouse event
 * !#zh 鼠标事件类型
 * @class Event.EventMouse
 *
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

js.extend(EventMouse, cc.Event);
var proto = EventMouse.prototype;

/**
 * !#en Sets scroll data.
 * !#zh 设置鼠标的滚动数据。
 * @method setScrollData
 * @param {Number} scrollX
 * @param {Number} scrollY
 */
proto.setScrollData = function (scrollX, scrollY) {
    this._scrollX = scrollX;
    this._scrollY = scrollY;
};

/**
 * !#en Returns the x axis scroll value.
 * !#zh 获取鼠标滚动的X轴距离，只有滚动时才有效。
 * @method getScrollX
 * @returns {Number}
 */
proto.getScrollX = function () {
    return this._scrollX;
};

/**
 * !#en Returns the y axis scroll value.
 * !#zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
 * @method getScrollY
 * @returns {Number}
 */
proto.getScrollY = function () {
    return this._scrollY;
};

/**
 * !#en Sets cursor location.
 * !#zh 设置当前鼠标位置。
 * @method setLocation
 * @param {Number} x
 * @param {Number} y
 */
proto.setLocation = function (x, y) {
    this._x = x;
    this._y = y;
};

/**
 * !#en Returns cursor location.
 * !#zh 获取鼠标位置对象，对象包含 x 和 y 属性。
 * @method getLocation
 * @return {Vec2} location
 */
proto.getLocation = function () {
    return cc.v2(this._x, this._y);
};

/**
 * !#en Returns the current cursor location in screen coordinates.
 * !#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
 * @method getLocationInView
 * @return {Vec2}
 */
proto.getLocationInView = function() {
    return cc.v2(this._x, cc.view._designResolutionSize.height - this._y);
};

proto._setPrevCursor = function (x, y) {
    this._prevX = x;
    this._prevY = y;
};

/**
 * !#en Returns the previous touch location.
 * !#zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
 * @method getPreviousLocation
 * @return {Vec2}
 */
proto.getPreviousLocation = function () {
    return cc.v2(this._prevX, this._prevY);
};

/**
 * !#en Returns the delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
 * @method getDelta
 * @return {Vec2}
 */
proto.getDelta = function () {
    return cc.v2(this._x - this._prevX, this._y - this._prevY);
};

/**
 * !#en Returns the X axis delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的 X 轴距离。
 * @method getDeltaX
 * @return {Number}
 */
proto.getDeltaX = function () {
    return this._x - this._prevX;
};

/**
 * !#en Returns the Y axis delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的 Y 轴距离。
 * @method getDeltaY
 * @return {Number}
 */
proto.getDeltaY = function () {
    return this._y - this._prevY;
};

/**
 * !#en Sets mouse button.
 * !#zh 设置鼠标按键。
 * @method setButton
 * @param {Number} button
 */
proto.setButton = function (button) {
    this._button = button;
};

/**
 * !#en Returns mouse button.
 * !#zh 获取鼠标按键。
 * @method getButton
 * @returns {Number}
 */
proto.getButton = function () {
    return this._button;
};

/**
 * !#en Returns location X axis data.
 * !#zh 获取鼠标当前位置 X 轴。
 * @method getLocationX
 * @returns {Number}
 */
proto.getLocationX = function () {
    return this._x;
};

/**
 * !#en Returns location Y axis data.
 * !#zh 获取鼠标当前位置 Y 轴。
 * @method getLocationY
 * @returns {Number}
 */
proto.getLocationY = function () {
    return this._y;
};

//Inner event types of MouseEvent
/**
 * !#en The none event code of mouse event.
 * !#zh 无。
 * @property NONE
 * @static
 * @type {Number}
 */
EventMouse.NONE = 0;
/**
 * !#en The event type code of mouse down event.
 * !#zh 鼠标按下事件。
 * @property DOWN
 * @static
 * @type {Number}
 */
EventMouse.DOWN = 1;
/**
 * !#en The event type code of mouse up event.
 * !#zh 鼠标按下后释放事件。
 * @property UP
 * @static
 * @type {Number}
 */
EventMouse.UP = 2;
/**
 * !#en The event type code of mouse move event.
 * !#zh 鼠标移动事件。
 * @property MOVE
 * @static
 * @type {Number}
 */
EventMouse.MOVE = 3;
/**
 * !#en The event type code of mouse scroll event.
 * !#zh 鼠标滚轮事件。
 * @property SCROLL
 * @static
 * @type {Number}
 */
EventMouse.SCROLL = 4;

/**
 * !#en The tag of Mouse left button.
 * !#zh 鼠标左键的标签。
 * @property BUTTON_LEFT
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_LEFT = 0;

/**
 * !#en The tag of Mouse right button  (The right button number is 2 on browser).
 * !#zh 鼠标右键的标签。
 * @property BUTTON_RIGHT
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_RIGHT = 2;

/**
 * !#en The tag of Mouse middle button  (The right button number is 1 on browser).
 * !#zh 鼠标中键的标签。
 * @property BUTTON_MIDDLE
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_MIDDLE = 1;

/**
 * !#en The tag of Mouse button 4.
 * !#zh 鼠标按键 4 的标签。
 * @property BUTTON_4
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_4 = 3;

/**
 * !#en The tag of Mouse button 5.
 * !#zh 鼠标按键 5 的标签。
 * @property BUTTON_5
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_5 = 4;

/**
 * !#en The tag of Mouse button 6.
 * !#zh 鼠标按键 6 的标签。
 * @property BUTTON_6
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_6 = 5;

/**
 * !#en The tag of Mouse button 7.
 * !#zh 鼠标按键 7 的标签。
 * @property BUTTON_7
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_7 = 6;

/**
 * !#en The tag of Mouse button 8.
 * !#zh 鼠标按键 8 的标签。
 * @property BUTTON_8
 * @static
 * @type {Number}
 */
EventMouse.BUTTON_8 = 7;

/**
 * !#en The touch event
 * !#zh 触摸事件
 * @class Event.EventTouch
 * @constructor
 * @extends Event
 */
/**
 * @method constructor
 * @param {Array} touchArr - The array of the touches
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventTouch = function (touchArr, bubbles) {
    cc.Event.call(this, cc.Event.TOUCH, bubbles);
    this._eventCode = 0;
    this._touches = touchArr || [];
    /**
     * !#en The current touch object
     * !#zh 当前触点对象
     * @property touch
     * @type {Touch}
     */
    this.touch = null;
    // Actually duplicated, because of history issue, currentTouch was in the original design, touch was added in creator engine
    // They should point to the same object
    this.currentTouch = null;
};

js.extend(EventTouch, cc.Event);
proto = EventTouch.prototype;

/**
 * !#en Returns event code.
 * !#zh 获取事件类型。
 * @method getEventCode
 * @returns {Number}
 */
proto.getEventCode = function () {
    return this._eventCode;
};

/**
 * !#en Returns touches of event.
 * !#zh 获取触摸点的列表。
 * @method getTouches
 * @returns {Array}
 */
proto.getTouches = function () {
    return this._touches;
};

proto._setEventCode = function (eventCode) {
    this._eventCode = eventCode;
};

proto._setTouches = function (touches) {
    this._touches = touches;
};

/**
 * !#en Sets touch location.
 * !#zh 设置当前触点位置
 * @method setLocation
 * @param {Number} x
 * @param {Number} y
 */
proto.setLocation = function (x, y) {
    this.touch && this.touch.setTouchInfo(this.touch.getID(), x, y);
};

/**
 * !#en Returns touch location.
 * !#zh 获取触点位置。
 * @method getLocation
 * @return {Vec2} location
 */
proto.getLocation = function () {
    return this.touch ? this.touch.getLocation() : cc.v2();
};

/**
 * !#en Returns the current touch location in screen coordinates.
 * !#zh 获取当前触点在游戏窗口中的位置。
 * @method getLocationInView
 * @return {Vec2}
 */
proto.getLocationInView = function() {
    return this.touch ? this.touch.getLocationInView() : cc.v2();
};

/**
 * !#en Returns the previous touch location.
 * !#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
 * @method getPreviousLocation
 * @return {Vec2}
 */
proto.getPreviousLocation = function () {
    return this.touch ? this.touch.getPreviousLocation() : cc.v2();
};

/**
 * !#en Returns the start touch location.
 * !#zh 获获取触点落下时的位置对象，对象包含 x 和 y 属性。
 * @method getStartLocation
 * @returns {Vec2}
 */
proto.getStartLocation = function() {
    return this.touch ? this.touch.getStartLocation() : cc.v2();
};

/**
 * !#en Returns the id of cc.Touch.
 * !#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
 * @method getID
 * @return {Number}
 */
proto.getID = function () {
    return this.touch ? this.touch.getID() : null;
};

/**
 * !#en Returns the delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
 * @method getDelta
 * @return {Vec2}
 */
proto.getDelta = function () {
    return this.touch ? this.touch.getDelta() : cc.v2();
};

/**
 * !#en Returns the X axis delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的 x 轴距离。
 * @method getDeltaX
 * @return {Number}
 */
proto.getDeltaX = function () {
    return this.touch ? this.touch.getDelta().x : 0;
};

/**
 * !#en Returns the Y axis delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的 y 轴距离。
 * @method getDeltaY
 * @return {Number}
 */
proto.getDeltaY = function () {
    return this.touch ? this.touch.getDelta().y : 0;
};

/**
 * !#en Returns location X axis data.
 * !#zh 获取当前触点 X 轴位置。
 * @method getLocationX
 * @returns {Number}
 */
proto.getLocationX = function () {
    return this.touch ? this.touch.getLocationX() : 0;
};

/**
 * !#en Returns location Y axis data.
 * !#zh 获取当前触点 Y 轴位置。
 * @method getLocationY
 * @returns {Number}
 */
proto.getLocationY = function () {
    return this.touch ? this.touch.getLocationY() : 0;
};

/**
 * !#en The maximum touch numbers
 * !#zh 最大触摸数量。
 * @constant
 * @type {Number}
 */
EventTouch.MAX_TOUCHES = 5;

/**
 * !#en The event type code of touch began event.
 * !#zh 开始触摸事件
 * @constant
 * @type {Number}
 */
EventTouch.BEGAN = 0;
/**
 * !#en The event type code of touch moved event.
 * !#zh 触摸后移动事件
 * @constant
 * @type {Number}
 */
EventTouch.MOVED = 1;
/**
 * !#en The event type code of touch ended event.
 * !#zh 结束触摸事件
 * @constant
 * @type {Number}
 */
EventTouch.ENDED = 2;
/**
 * !#en The event type code of touch cancelled event.
 * !#zh 取消触摸事件
 * @constant
 * @type {Number}
 */
EventTouch.CANCELED = 3;

/**
 * !#en The acceleration event
 * !#zh 加速度事件
 * @class Event.EventAcceleration
 * @extends Event
 *
 * @param {Object} acc - The acceleration
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventAcceleration = function (acc, bubbles) {
    cc.Event.call(this, cc.Event.ACCELERATION, bubbles);
    this.acc = acc;
};
js.extend(EventAcceleration, cc.Event);

/**
 * !#en The keyboard event
 * !#zh 键盘事件
 * @class Event.EventKeyboard
 * @extends Event
 *
 * @param {Number} keyCode - The key code of which triggered this event
 * @param {Boolean} isPressed - A boolean indicating whether the key have been pressed
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventKeyboard = function (keyCode, isPressed, bubbles) {
    cc.Event.call(this, cc.Event.KEYBOARD, bubbles);
    /**
     * !#en
     * The keyCode read-only property represents a system and implementation dependent numerical code identifying the unmodified value of the pressed key.
     * This is usually the decimal ASCII (RFC 20) or Windows 1252 code corresponding to the key.
     * If the key can't be identified, this value is 0.
     *
     * !#zh
     * keyCode 是只读属性它表示一个系统和依赖于实现的数字代码，可以识别按键的未修改值。
     * 这通常是十进制 ASCII (RFC20) 或者 Windows 1252 代码，所对应的密钥。
     * 如果无法识别该键，则该值为 0。
     *
     * @property keyCode
     * @type {Number}
     */
    this.keyCode = keyCode;
    this.isPressed = isPressed;
};
js.extend(EventKeyboard, cc.Event);

cc.Event.EventMouse = EventMouse;
cc.Event.EventTouch = EventTouch;
cc.Event.EventAcceleration = EventAcceleration;
cc.Event.EventKeyboard = EventKeyboard;

module.exports = cc.Event;
