(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../event/event.js", "../../math/vec2.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../event/event.js"), require("../../math/vec2.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.event, global.vec2, global.globalExports);
    global.events = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _event, _vec, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EventKeyboard = _exports.EventAcceleration = _exports.EventTouch = _exports.EventMouse = void 0;
  _event = _interopRequireDefault(_event);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _vec2 = new _vec.Vec2();
  /**
   * @en The mouse event
   * @zh 鼠标事件类型
   */


  var EventMouse = /*#__PURE__*/function (_Event) {
    _inherits(EventMouse, _Event);

    // Inner event types of MouseEvent

    /**
     * @en The none event code of mouse event.
     * @zh 无效事件代码
     */

    /**
     * @en The event code of mouse down event.
     * @zh 鼠标按下事件代码。
     */

    /**
     * @en The event code of mouse up event.
     * @zh 鼠标按下后释放事件代码。
     */

    /**
     * @en The event code of mouse move event.
     * @zh 鼠标移动事件。
     */

    /**
     * @en The event code of mouse scroll event.
     * @zh 鼠标滚轮事件。
     */

    /**
     * @en The default tag when no button is pressed
     * @zh 按键默认的缺省状态
     */

    /**
     * @en The tag of mouse's left button.
     * @zh 鼠标左键的标签。
     */

    /**
     * @en The tag of mouse's right button  (The right button number is 2 on browser).
     * @zh 鼠标右键的标签。
     */

    /**
     * @en The tag of mouse's middle button.
     * @zh 鼠标中键的标签。
     */

    /**
     * @en The tag of mouse's button 4.
     * @zh 鼠标按键 4 的标签。
     */

    /**
     * @en The tag of mouse's button 5.
     * @zh 鼠标按键 5 的标签。
     */

    /**
     * @en The tag of mouse's button 6.
     * @zh 鼠标按键 6 的标签。
     */

    /**
     * @en The tag of mouse's button 7.
     * @zh 鼠标按键 7 的标签。
     */

    /**
     * @en The tag of mouse's button 8.
     * @zh 鼠标按键 8 的标签。
     */

    /**
     * @en Mouse movement on x axis of the UI coordinate system.
     * @zh 鼠标在 UI 坐标系下 X 轴上的移动距离
     */

    /**
     * @en Mouse movement on y axis of the UI coordinate system.
     * @zh 鼠标在 UI 坐标系下 Y 轴上的移动距离
     */

    /**
     * @en The type of the event, possible values are UP, DOWN, MOVE, SCROLL
     * @zh 鼠标事件类型，可以是 UP, DOWN, MOVE, CANCELED。
     */

    /**
     * @param eventType - The type of the event, possible values are UP, DOWN, MOVE, SCROLL
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    function EventMouse(eventType, bubbles, prevLoc) {
      var _this;

      _classCallCheck(this, EventMouse);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(EventMouse).call(this, _event.default.MOUSE, bubbles));
      _this.movementX = 0;
      _this.movementY = 0;
      _this.eventType = void 0;
      _this._button = EventMouse.BUTTON_MISSING;
      _this._x = 0;
      _this._y = 0;
      _this._prevX = 0;
      _this._prevY = 0;
      _this._scrollX = 0;
      _this._scrollY = 0;
      _this.eventType = eventType;

      if (prevLoc) {
        _this._prevX = prevLoc.x;
        _this._prevY = prevLoc.y;
      }

      return _this;
    }
    /**
     * @en Sets scroll data of the mouse.
     * @zh 设置鼠标滚轮的滚动数据。
     * @param scrollX - The scroll value on x axis
     * @param scrollY - The scroll value on y axis
     */


    _createClass(EventMouse, [{
      key: "setScrollData",
      value: function setScrollData(scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
      }
      /**
       * @en Returns the scroll value on x axis.
       * @zh 获取鼠标滚动的 X 轴距离，只有滚动时才有效。
       */

    }, {
      key: "getScrollX",
      value: function getScrollX() {
        return this._scrollX;
      }
      /**
       * @en Returns the scroll value on y axis.
       * @zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
       */

    }, {
      key: "getScrollY",
      value: function getScrollY() {
        return this._scrollY;
      }
      /**
       * @en Sets cursor location.
       * @zh 设置当前鼠标位置。
       * @param x - The location on x axis
       * @param y - The location on y axis
       */

    }, {
      key: "setLocation",
      value: function setLocation(x, y) {
        this._x = x;
        this._y = y;
      }
      /**
       * @en Returns cursor location.
       * @zh 获取鼠标相对于左下角位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getLocation",
      value: function getLocation(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, this._x, this._y);

        return out;
      }
      /**
       * @en Returns the current cursor location in game view coordinates.
       * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getLocationInView",
      value: function getLocationInView(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, this._x, _globalExports.legacyCC.view._designResolutionSize.height - this._y);

        return out;
      }
      /**
       * @en Returns the current cursor location in ui coordinates.
       * @zh 获取当前事件在 UI 窗口内的坐标位置，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUILocation",
      value: function getUILocation(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, this._x, this._y);

        _globalExports.legacyCC.view._convertPointWithScale(out);

        return out;
      }
      /**
       * @en Returns the previous touch location.
       * @zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getPreviousLocation",
      value: function getPreviousLocation(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, this._prevX, this._prevY);

        return out;
      }
      /**
       * @en Returns the previous touch location.
       * @zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUIPreviousLocation",
      value: function getUIPreviousLocation(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, this._prevX, this._prevY);

        _globalExports.legacyCC.view._convertPointWithScale(out);

        return out;
      }
      /**
       * @en Returns the delta distance from the previous location to current location.
       * @zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getDelta",
      value: function getDelta(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, this._x - this._prevX, this._y - this._prevY);

        return out;
      }
      /**
       * @en Returns the X axis delta distance from the previous location to current location.
       * @zh 获取鼠标距离上一次事件移动的 X 轴距离。
       */

    }, {
      key: "getDeltaX",
      value: function getDeltaX() {
        return this._x - this._prevX;
      }
      /**
       * @en Returns the Y axis delta distance from the previous location to current location.
       * @zh 获取鼠标距离上一次事件移动的 Y 轴距离。
       */

    }, {
      key: "getDeltaY",
      value: function getDeltaY() {
        return this._y - this._prevY;
      }
      /**
       * @en Returns the delta distance from the previous location to current location in the UI coordinates.
       * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的距离对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUIDelta",
      value: function getUIDelta(out) {
        if (!out) {
          out = new _vec.Vec2();
        }

        _vec.Vec2.set(out, (this._x - this._prevX) / _globalExports.legacyCC.view.getScaleX(), (this._y - this._prevY) / _globalExports.legacyCC.view.getScaleY());

        return out;
      }
      /**
       * @en Returns the X axis delta distance from the previous location to current location in the UI coordinates.
       * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的 X 轴距离。
       */

    }, {
      key: "getUIDeltaX",
      value: function getUIDeltaX() {
        return (this._x - this._prevX) / _globalExports.legacyCC.view.getScaleX();
      }
      /**
       * @en Returns the Y axis delta distance from the previous location to current location in the UI coordinates.
       * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的 Y 轴距离。
       */

    }, {
      key: "getUIDeltaY",
      value: function getUIDeltaY() {
        return (this._y - this._prevY) / _globalExports.legacyCC.view.getScaleY();
      }
      /**
       * @en Sets mouse button code.
       * @zh 设置鼠标按键。
       * @param button - The button code
       */

    }, {
      key: "setButton",
      value: function setButton(button) {
        this._button = button;
      }
      /**
       * @en Returns mouse button code.
       * @zh 获取鼠标按键。
       */

    }, {
      key: "getButton",
      value: function getButton() {
        return this._button;
      }
      /**
       * @en Returns location data on X axis.
       * @zh 获取鼠标当前 X 轴位置。
       */

    }, {
      key: "getLocationX",
      value: function getLocationX() {
        return this._x;
      }
      /**
       * @en Returns location data on Y axis.
       * @zh 获取鼠标当前 Y 轴位置。
       */

    }, {
      key: "getLocationY",
      value: function getLocationY() {
        return this._y;
      }
      /**
       * @en Returns location data on X axis.
       * @zh 获取鼠标当前 X 轴位置。
       */

    }, {
      key: "getUILocationX",
      value: function getUILocationX() {
        var viewport = _globalExports.legacyCC.view.getViewportRect();

        return (this._x - viewport.x) / _globalExports.legacyCC.view.getScaleX();
      }
      /**
       * @en Returns location data on Y axis.
       * @zh 获取鼠标当前 Y 轴位置。
       */

    }, {
      key: "getUILocationY",
      value: function getUILocationY() {
        var viewport = _globalExports.legacyCC.view.getViewportRect();

        return (this._y - viewport.y) / _globalExports.legacyCC.view.getScaleY();
      }
    }]);

    return EventMouse;
  }(_event.default);
  /**
   * @en
   * The touch event.
   *
   * @zh
   * 触摸事件。
   */


  _exports.EventMouse = EventMouse;
  EventMouse.NONE = 0;
  EventMouse.DOWN = 1;
  EventMouse.UP = 2;
  EventMouse.MOVE = 3;
  EventMouse.SCROLL = 4;
  EventMouse.BUTTON_MISSING = -1;
  EventMouse.BUTTON_LEFT = 0;
  EventMouse.BUTTON_RIGHT = 2;
  EventMouse.BUTTON_MIDDLE = 1;
  EventMouse.BUTTON_4 = 3;
  EventMouse.BUTTON_5 = 4;
  EventMouse.BUTTON_6 = 5;
  EventMouse.BUTTON_7 = 6;
  EventMouse.BUTTON_8 = 7;

  var EventTouch = /*#__PURE__*/function (_Event2) {
    _inherits(EventTouch, _Event2);

    /**
     * @en The maximum touch point numbers simultaneously
     * @zh 同时存在的最大触点数量。
     */

    /**
     * @en The event type code of touch began event.
     * @zh 开始触摸事件。
     */

    /**
     * @en The event type code of touch moved event.
     * @zh 触摸后移动事件。
     */

    /**
     * @en The event type code of touch ended event.
     * @zh 结束触摸事件。
     */

    /**
     * @en The event type code of touch canceled event.
     * @zh 取消触摸事件。
     */

    /**
     * @en The current touch object
     * @zh 当前触点对象
     */

    /**
     * @en Indicate whether the touch event is simulated or real
     * @zh 表示触摸事件是真实触点触发的还是模拟的
     */

    /**
     * @param touches - An array of current touches
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     * @param eventCode - The type code of the touch event
     */
    function EventTouch(changedTouches, bubbles, eventCode, touches) {
      var _this2;

      _classCallCheck(this, EventTouch);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(EventTouch).call(this, _event.default.TOUCH, bubbles));
      _this2.touch = null;
      _this2.simulate = false;
      _this2._eventCode = void 0;
      _this2._touches = void 0;
      _this2._allTouches = void 0;
      _this2._eventCode = eventCode || 0;
      _this2._touches = changedTouches || [];
      _this2._allTouches = touches || [];
      return _this2;
    }
    /**
     * @en Returns event type code.
     * @zh 获取触摸事件类型。
     */


    _createClass(EventTouch, [{
      key: "getEventCode",
      value: function getEventCode() {
        return this._eventCode;
      }
      /**
       * @en Returns touches of event.
       * @zh 获取有变动的触摸点的列表。
       * 注意：第一根手指按下不动，接着按第二根手指，这时候触点信息就只有变动的这根手指（第二根手指）的信息。
       * 如果需要获取全部手指的信息，请使用 `getAllTouches`。
       */

    }, {
      key: "getTouches",
      value: function getTouches() {
        return this._touches;
      }
      /**
       * @en Returns touches of event.
       * @zh 获取所有触摸点的列表。
       * 注意：如果手指行为是 touch end，这个时候列表是没有该手指信息的。如需知道该手指信息，可通过 `getTouches` 获取识别。
       */

    }, {
      key: "getAllTouches",
      value: function getAllTouches() {
        return this._allTouches;
      }
      /**
       * @en Sets touch location.
       * @zh 设置当前触点位置
       * @param x - The current touch location on the x axis
       * @param y - The current touch location on the y axis
       */

    }, {
      key: "setLocation",
      value: function setLocation(x, y) {
        if (this.touch) {
          this.touch.setTouchInfo(this.touch.getID(), x, y);
        }
      }
      /**
       * @en Returns the current touch location.
       * @zh 获取触点位置。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getLocation",
      value: function getLocation(out) {
        return this.touch ? this.touch.getLocation(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the current touch location in UI coordinates.
       * @zh 获取 UI 坐标系下的触点位置。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUILocation",
      value: function getUILocation(out) {
        return this.touch ? this.touch.getUILocation(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the current touch location in game screen coordinates.
       * @zh 获取当前触点在游戏窗口中的位置。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getLocationInView",
      value: function getLocationInView(out) {
        return this.touch ? this.touch.getLocationInView(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the previous touch location.
       * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getPreviousLocation",
      value: function getPreviousLocation(out) {
        return this.touch ? this.touch.getPreviousLocation(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the start touch location.
       * @zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getStartLocation",
      value: function getStartLocation(out) {
        return this.touch ? this.touch.getStartLocation(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the start touch location in UI coordinates.
       * @zh 获取触点落下时的 UI 世界下位置对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getUIStartLocation",
      value: function getUIStartLocation(out) {
        return this.touch ? this.touch.getUIStartLocation(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the id of the current touch point.
       * @zh 获取触点的标识 ID，可以用来在多点触摸中跟踪触点。
       */

    }, {
      key: "getID",
      value: function getID() {
        return this.touch ? this.touch.getID() : null;
      }
      /**
       * @en Returns the delta distance from the previous location to current location.
       * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
       */

    }, {
      key: "getDelta",
      value: function getDelta(out) {
        return this.touch ? this.touch.getDelta(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the delta distance from the previous location to current location.
       * @zh 获取触点距离上一次事件 UI 世界下移动的距离对象，对象包含 x 和 y 属性。
       * @param out - Pass the out object to avoid object creation, very good practice
      */

    }, {
      key: "getUIDelta",
      value: function getUIDelta(out) {
        return this.touch ? this.touch.getUIDelta(out) : new _vec.Vec2();
      }
      /**
       * @en Returns the X axis delta distance from the previous location to current location.
       * @zh 获取触点距离上一次事件移动的 x 轴距离。
       */

    }, {
      key: "getDeltaX",
      value: function getDeltaX() {
        return this.touch ? this.touch.getDelta(_vec2).x : 0;
      }
      /**
       * @en Returns the Y axis delta distance from the previous location to current location.
       * @zh 获取触点距离上一次事件移动的 y 轴距离。
       */

    }, {
      key: "getDeltaY",
      value: function getDeltaY() {
        return this.touch ? this.touch.getDelta(_vec2).y : 0;
      }
      /**
       * @en Returns location X axis data.
       * @zh 获取当前触点 X 轴位置。
       */

    }, {
      key: "getLocationX",
      value: function getLocationX() {
        return this.touch ? this.touch.getLocationX() : 0;
      }
      /**
       * @en Returns location Y axis data.
       * @zh 获取当前触点 Y 轴位置。
       */

    }, {
      key: "getLocationY",
      value: function getLocationY() {
        return this.touch ? this.touch.getLocationY() : 0;
      }
    }]);

    return EventTouch;
  }(_event.default);
  /**
   * @en
   * The acceleration event.
   * @zh
   * 加速计事件。
   */


  _exports.EventTouch = EventTouch;
  EventTouch.MAX_TOUCHES = 5;
  EventTouch.BEGAN = 0;
  EventTouch.MOVED = 1;
  EventTouch.ENDED = 2;
  EventTouch.CANCELLED = 3;

  var EventAcceleration = /*#__PURE__*/function (_Event3) {
    _inherits(EventAcceleration, _Event3);

    /**
     * @en The acceleration object
     * @zh 加速度对象
     */

    /**
     * @param acc - The acceleration
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    function EventAcceleration(acc, bubbles) {
      var _this3;

      _classCallCheck(this, EventAcceleration);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(EventAcceleration).call(this, _event.default.ACCELERATION, bubbles));
      _this3.acc = void 0;
      _this3.acc = acc;
      return _this3;
    }

    return EventAcceleration;
  }(_event.default);
  /**
   * @en
   * The keyboard event.
   * @zh
   * 键盘事件。
   */


  _exports.EventAcceleration = EventAcceleration;

  var EventKeyboard = /*#__PURE__*/function (_Event4) {
    _inherits(EventKeyboard, _Event4);

    /**
     * @en The keyCode read-only property represents a system and implementation dependent numerical code
     * identifying the unmodified value of the pressed key.
     * This is usually the decimal ASCII (RFC 20) or Windows 1252 code corresponding to the key.
     * If the key can't be identified, this value is 0.
     * @zh keyCode 是只读属性它表示一个系统和依赖于实现的数字代码，可以识别按键的未修改值。
     * 这通常是十进制 ASCII (RFC20) 或者 Windows 1252 代码，所对应的密钥。
     * 如果无法识别该键，则该值为 0。
     */

    /**
     * @en Raw DOM KeyboardEvent.
     * @zh 原始 DOM KeyboardEvent 事件对象
     */

    /**
     * @en Indicates whether the current key is being pressed
     * @zh 表示当前按键是否正在被按下
     */

    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param isPressed - Indicates whether the current key is being pressed
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    function EventKeyboard(keyCode, isPressed, bubbles) {
      var _this4;

      _classCallCheck(this, EventKeyboard);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(EventKeyboard).call(this, _event.default.KEYBOARD, bubbles));
      _this4.keyCode = void 0;
      _this4.rawEvent = void 0;
      _this4.isPressed = void 0;

      if (typeof keyCode === 'number') {
        _this4.keyCode = keyCode;
      } else {
        _this4.keyCode = keyCode.keyCode;
        _this4.rawEvent = keyCode;
      }

      _this4.isPressed = isPressed;
      return _this4;
    }

    return EventKeyboard;
  }(_event.default); // TODO
  // @ts-ignore


  _exports.EventKeyboard = EventKeyboard;
  _event.default.EventMouse = EventMouse; // TODO
  // @ts-ignore

  _event.default.EventTouch = EventTouch; // TODO
  // @ts-ignore

  _event.default.EventAcceleration = EventAcceleration; // TODO
  // @ts-ignore

  _event.default.EventKeyboard = EventKeyboard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudHMudHMiXSwibmFtZXMiOlsiX3ZlYzIiLCJWZWMyIiwiRXZlbnRNb3VzZSIsImV2ZW50VHlwZSIsImJ1YmJsZXMiLCJwcmV2TG9jIiwiRXZlbnQiLCJNT1VTRSIsIm1vdmVtZW50WCIsIm1vdmVtZW50WSIsIl9idXR0b24iLCJCVVRUT05fTUlTU0lORyIsIl94IiwiX3kiLCJfcHJldlgiLCJfcHJldlkiLCJfc2Nyb2xsWCIsIl9zY3JvbGxZIiwieCIsInkiLCJzY3JvbGxYIiwic2Nyb2xsWSIsIm91dCIsInNldCIsImxlZ2FjeUNDIiwidmlldyIsIl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSIsImhlaWdodCIsIl9jb252ZXJ0UG9pbnRXaXRoU2NhbGUiLCJnZXRTY2FsZVgiLCJnZXRTY2FsZVkiLCJidXR0b24iLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0UmVjdCIsIk5PTkUiLCJET1dOIiwiVVAiLCJNT1ZFIiwiU0NST0xMIiwiQlVUVE9OX0xFRlQiLCJCVVRUT05fUklHSFQiLCJCVVRUT05fTUlERExFIiwiQlVUVE9OXzQiLCJCVVRUT05fNSIsIkJVVFRPTl82IiwiQlVUVE9OXzciLCJCVVRUT05fOCIsIkV2ZW50VG91Y2giLCJjaGFuZ2VkVG91Y2hlcyIsImV2ZW50Q29kZSIsInRvdWNoZXMiLCJUT1VDSCIsInRvdWNoIiwic2ltdWxhdGUiLCJfZXZlbnRDb2RlIiwiX3RvdWNoZXMiLCJfYWxsVG91Y2hlcyIsInNldFRvdWNoSW5mbyIsImdldElEIiwiZ2V0TG9jYXRpb24iLCJnZXRVSUxvY2F0aW9uIiwiZ2V0TG9jYXRpb25JblZpZXciLCJnZXRQcmV2aW91c0xvY2F0aW9uIiwiZ2V0U3RhcnRMb2NhdGlvbiIsImdldFVJU3RhcnRMb2NhdGlvbiIsImdldERlbHRhIiwiZ2V0VUlEZWx0YSIsImdldExvY2F0aW9uWCIsImdldExvY2F0aW9uWSIsIk1BWF9UT1VDSEVTIiwiQkVHQU4iLCJNT1ZFRCIsIkVOREVEIiwiQ0FOQ0VMTEVEIiwiRXZlbnRBY2NlbGVyYXRpb24iLCJhY2MiLCJBQ0NFTEVSQVRJT04iLCJFdmVudEtleWJvYXJkIiwia2V5Q29kZSIsImlzUHJlc3NlZCIsIktFWUJPQVJEIiwicmF3RXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NBLE1BQUlBLEtBQUssR0FBRyxJQUFJQyxTQUFKLEVBQVo7QUFFQTs7Ozs7O01BSWFDLFU7OztBQUNUOztBQUVBOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQU1BOzs7OztBQW9CQTs7OztBQUlBLHdCQUFhQyxTQUFiLEVBQWdDQyxPQUFoQyxFQUFtREMsT0FBbkQsRUFBbUU7QUFBQTs7QUFBQTs7QUFDL0Qsc0ZBQU1DLGVBQU1DLEtBQVosRUFBbUJILE9BQW5CO0FBRCtELFlBaEM1REksU0FnQzRELEdBaEN4QyxDQWdDd0M7QUFBQSxZQTFCNURDLFNBMEI0RCxHQTFCeEMsQ0EwQndDO0FBQUEsWUFwQjVETixTQW9CNEQ7QUFBQSxZQWxCM0RPLE9Ba0IyRCxHQWxCekNSLFVBQVUsQ0FBQ1MsY0FrQjhCO0FBQUEsWUFoQjNEQyxFQWdCMkQsR0FoQjlDLENBZ0I4QztBQUFBLFlBZDNEQyxFQWMyRCxHQWQ5QyxDQWM4QztBQUFBLFlBWjNEQyxNQVkyRCxHQVoxQyxDQVkwQztBQUFBLFlBVjNEQyxNQVUyRCxHQVYxQyxDQVUwQztBQUFBLFlBUjNEQyxRQVEyRCxHQVJ4QyxDQVF3QztBQUFBLFlBTjNEQyxRQU0yRCxHQU54QyxDQU13QztBQUUvRCxZQUFLZCxTQUFMLEdBQWlCQSxTQUFqQjs7QUFDQSxVQUFJRSxPQUFKLEVBQWE7QUFDVCxjQUFLUyxNQUFMLEdBQWNULE9BQU8sQ0FBQ2EsQ0FBdEI7QUFDQSxjQUFLSCxNQUFMLEdBQWNWLE9BQU8sQ0FBQ2MsQ0FBdEI7QUFDSDs7QUFOOEQ7QUFPbEU7QUFFRDs7Ozs7Ozs7OztvQ0FNc0JDLE8sRUFBaUJDLE8sRUFBaUI7QUFDcEQsYUFBS0wsUUFBTCxHQUFnQkksT0FBaEI7QUFDQSxhQUFLSCxRQUFMLEdBQWdCSSxPQUFoQjtBQUNIO0FBRUQ7Ozs7Ozs7bUNBSXFCO0FBQ2pCLGVBQU8sS0FBS0wsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7bUNBSXFCO0FBQ2pCLGVBQU8sS0FBS0MsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7OztrQ0FNb0JDLEMsRUFBV0MsQyxFQUFXO0FBQ3RDLGFBQUtQLEVBQUwsR0FBVU0sQ0FBVjtBQUNBLGFBQUtMLEVBQUwsR0FBVU0sQ0FBVjtBQUNIO0FBRUQ7Ozs7Ozs7O2tDQUtvQkcsRyxFQUFZO0FBQzVCLFlBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ05BLFVBQUFBLEdBQUcsR0FBRyxJQUFJckIsU0FBSixFQUFOO0FBQ0g7O0FBRURBLGtCQUFLc0IsR0FBTCxDQUFTRCxHQUFULEVBQWMsS0FBS1YsRUFBbkIsRUFBdUIsS0FBS0MsRUFBNUI7O0FBQ0EsZUFBT1MsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7O3dDQUswQkEsRyxFQUFZO0FBQ2xDLFlBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ05BLFVBQUFBLEdBQUcsR0FBRyxJQUFJckIsU0FBSixFQUFOO0FBQ0g7O0FBRURBLGtCQUFLc0IsR0FBTCxDQUFTRCxHQUFULEVBQWMsS0FBS1YsRUFBbkIsRUFBdUJZLHdCQUFTQyxJQUFULENBQWNDLHFCQUFkLENBQW9DQyxNQUFwQyxHQUE2QyxLQUFLZCxFQUF6RTs7QUFDQSxlQUFPUyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7b0NBS3NCQSxHLEVBQVc7QUFDN0IsWUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDTkEsVUFBQUEsR0FBRyxHQUFHLElBQUlyQixTQUFKLEVBQU47QUFDSDs7QUFFREEsa0JBQUtzQixHQUFMLENBQVNELEdBQVQsRUFBYyxLQUFLVixFQUFuQixFQUF1QixLQUFLQyxFQUE1Qjs7QUFDQVcsZ0NBQVNDLElBQVQsQ0FBY0csc0JBQWQsQ0FBcUNOLEdBQXJDOztBQUNBLGVBQU9BLEdBQVA7QUFDSDtBQUVEOzs7Ozs7OzswQ0FLNEJBLEcsRUFBWTtBQUNwQyxZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNOQSxVQUFBQSxHQUFHLEdBQUcsSUFBSXJCLFNBQUosRUFBTjtBQUNIOztBQUVEQSxrQkFBS3NCLEdBQUwsQ0FBU0QsR0FBVCxFQUFjLEtBQUtSLE1BQW5CLEVBQTJCLEtBQUtDLE1BQWhDOztBQUNBLGVBQU9PLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs0Q0FLOEJBLEcsRUFBWTtBQUN0QyxZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNOQSxVQUFBQSxHQUFHLEdBQUcsSUFBSXJCLFNBQUosRUFBTjtBQUNIOztBQUVEQSxrQkFBS3NCLEdBQUwsQ0FBU0QsR0FBVCxFQUFjLEtBQUtSLE1BQW5CLEVBQTJCLEtBQUtDLE1BQWhDOztBQUNBUyxnQ0FBU0MsSUFBVCxDQUFjRyxzQkFBZCxDQUFxQ04sR0FBckM7O0FBQ0EsZUFBT0EsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OytCQUtpQkEsRyxFQUFZO0FBQ3pCLFlBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ05BLFVBQUFBLEdBQUcsR0FBRyxJQUFJckIsU0FBSixFQUFOO0FBQ0g7O0FBRURBLGtCQUFLc0IsR0FBTCxDQUFTRCxHQUFULEVBQWMsS0FBS1YsRUFBTCxHQUFVLEtBQUtFLE1BQTdCLEVBQXFDLEtBQUtELEVBQUwsR0FBVSxLQUFLRSxNQUFwRDs7QUFDQSxlQUFPTyxHQUFQO0FBQ0g7QUFFRDs7Ozs7OztrQ0FJb0I7QUFDaEIsZUFBTyxLQUFLVixFQUFMLEdBQVUsS0FBS0UsTUFBdEI7QUFDSDtBQUVEOzs7Ozs7O2tDQUlvQjtBQUNoQixlQUFPLEtBQUtELEVBQUwsR0FBVSxLQUFLRSxNQUF0QjtBQUNIO0FBRUQ7Ozs7Ozs7O2lDQUttQk8sRyxFQUFZO0FBQzNCLFlBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ05BLFVBQUFBLEdBQUcsR0FBRyxJQUFJckIsU0FBSixFQUFOO0FBQ0g7O0FBRURBLGtCQUFLc0IsR0FBTCxDQUFTRCxHQUFULEVBQWMsQ0FBQyxLQUFLVixFQUFMLEdBQVUsS0FBS0UsTUFBaEIsSUFBMEJVLHdCQUFTQyxJQUFULENBQWNJLFNBQWQsRUFBeEMsRUFBbUUsQ0FBQyxLQUFLaEIsRUFBTCxHQUFVLEtBQUtFLE1BQWhCLElBQTBCUyx3QkFBU0MsSUFBVCxDQUFjSyxTQUFkLEVBQTdGOztBQUNBLGVBQU9SLEdBQVA7QUFDSDtBQUVEOzs7Ozs7O29DQUlzQjtBQUNsQixlQUFPLENBQUMsS0FBS1YsRUFBTCxHQUFVLEtBQUtFLE1BQWhCLElBQTBCVSx3QkFBU0MsSUFBVCxDQUFjSSxTQUFkLEVBQWpDO0FBQ0g7QUFFRDs7Ozs7OztvQ0FJc0I7QUFDbEIsZUFBTyxDQUFDLEtBQUtoQixFQUFMLEdBQVUsS0FBS0UsTUFBaEIsSUFBMEJTLHdCQUFTQyxJQUFULENBQWNLLFNBQWQsRUFBakM7QUFDSDtBQUVEOzs7Ozs7OztnQ0FLa0JDLE0sRUFBZ0I7QUFDOUIsYUFBS3JCLE9BQUwsR0FBZXFCLE1BQWY7QUFDSDtBQUVEOzs7Ozs7O2tDQUlvQjtBQUNoQixlQUFPLEtBQUtyQixPQUFaO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJdUI7QUFDbkIsZUFBTyxLQUFLRSxFQUFaO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJdUI7QUFDbkIsZUFBTyxLQUFLQyxFQUFaO0FBQ0g7QUFFRDs7Ozs7Ozt1Q0FJeUI7QUFDckIsWUFBTW1CLFFBQVEsR0FBR1Isd0JBQVNDLElBQVQsQ0FBY1EsZUFBZCxFQUFqQjs7QUFDQSxlQUFPLENBQUMsS0FBS3JCLEVBQUwsR0FBVW9CLFFBQVEsQ0FBQ2QsQ0FBcEIsSUFBeUJNLHdCQUFTQyxJQUFULENBQWNJLFNBQWQsRUFBaEM7QUFDSDtBQUVEOzs7Ozs7O3VDQUl5QjtBQUNyQixZQUFNRyxRQUFRLEdBQUdSLHdCQUFTQyxJQUFULENBQWNRLGVBQWQsRUFBakI7O0FBQ0EsZUFBTyxDQUFDLEtBQUtwQixFQUFMLEdBQVVtQixRQUFRLENBQUNiLENBQXBCLElBQXlCSyx3QkFBU0MsSUFBVCxDQUFjSyxTQUFkLEVBQWhDO0FBQ0g7Ozs7SUEvVjJCeEIsYztBQWtXaEM7Ozs7Ozs7Ozs7QUFsV2FKLEVBQUFBLFUsQ0FPS2dDLEksR0FBTyxDO0FBUFpoQyxFQUFBQSxVLENBYUtpQyxJLEdBQU8sQztBQWJaakMsRUFBQUEsVSxDQW1CS2tDLEUsR0FBSyxDO0FBbkJWbEMsRUFBQUEsVSxDQXlCS21DLEksR0FBTyxDO0FBekJabkMsRUFBQUEsVSxDQStCS29DLE0sR0FBUyxDO0FBL0JkcEMsRUFBQUEsVSxDQXFDS1MsYyxHQUFpQixDQUFDLEM7QUFyQ3ZCVCxFQUFBQSxVLENBMkNLcUMsVyxHQUFjLEM7QUEzQ25CckMsRUFBQUEsVSxDQWlES3NDLFksR0FBZSxDO0FBakRwQnRDLEVBQUFBLFUsQ0F1REt1QyxhLEdBQWdCLEM7QUF2RHJCdkMsRUFBQUEsVSxDQTZES3dDLFEsR0FBVyxDO0FBN0RoQnhDLEVBQUFBLFUsQ0FtRUt5QyxRLEdBQVcsQztBQW5FaEJ6QyxFQUFBQSxVLENBeUVLMEMsUSxHQUFXLEM7QUF6RWhCMUMsRUFBQUEsVSxDQStFSzJDLFEsR0FBVyxDO0FBL0VoQjNDLEVBQUFBLFUsQ0FxRks0QyxRLEdBQVcsQzs7TUFvUmhCQyxVOzs7QUFDVDs7Ozs7QUFNQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFNQTs7Ozs7QUFLQTs7Ozs7QUFZQTs7Ozs7QUFLQSx3QkFBYUMsY0FBYixFQUF1QzVDLE9BQXZDLEVBQTBENkMsU0FBMUQsRUFBOEVDLE9BQTlFLEVBQWlHO0FBQUE7O0FBQUE7O0FBQzdGLHVGQUFNNUMsZUFBTTZDLEtBQVosRUFBbUIvQyxPQUFuQjtBQUQ2RixhQWxCMUZnRCxLQWtCMEYsR0FsQnBFLElBa0JvRTtBQUFBLGFBYjFGQyxRQWEwRixHQWIvRSxLQWErRTtBQUFBLGFBWHpGQyxVQVd5RjtBQUFBLGFBVHpGQyxRQVN5RjtBQUFBLGFBUHpGQyxXQU95RjtBQUU3RixhQUFLRixVQUFMLEdBQWtCTCxTQUFTLElBQUksQ0FBL0I7QUFDQSxhQUFLTSxRQUFMLEdBQWdCUCxjQUFjLElBQUksRUFBbEM7QUFDQSxhQUFLUSxXQUFMLEdBQW1CTixPQUFPLElBQUksRUFBOUI7QUFKNkY7QUFLaEc7QUFFRDs7Ozs7Ozs7cUNBSXVCO0FBQ25CLGVBQU8sS0FBS0ksVUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7OzttQ0FNcUI7QUFDakIsZUFBTyxLQUFLQyxRQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7c0NBS3dCO0FBQ3BCLGVBQU8sS0FBS0MsV0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7OztrQ0FNb0J0QyxDLEVBQVdDLEMsRUFBVztBQUN0QyxZQUFJLEtBQUtpQyxLQUFULEVBQWdCO0FBQ1osZUFBS0EsS0FBTCxDQUFXSyxZQUFYLENBQXdCLEtBQUtMLEtBQUwsQ0FBV00sS0FBWCxFQUF4QixFQUE0Q3hDLENBQTVDLEVBQStDQyxDQUEvQztBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7a0NBS29CRyxHLEVBQVk7QUFDNUIsZUFBTyxLQUFLOEIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV08sV0FBWCxDQUF1QnJDLEdBQXZCLENBQWIsR0FBMkMsSUFBSXJCLFNBQUosRUFBbEQ7QUFDSDtBQUVEOzs7Ozs7OztvQ0FLcUJxQixHLEVBQVk7QUFDN0IsZUFBTyxLQUFLOEIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV1EsYUFBWCxDQUF5QnRDLEdBQXpCLENBQWIsR0FBNkMsSUFBSXJCLFNBQUosRUFBcEQ7QUFDSDtBQUVEOzs7Ozs7Ozt3Q0FLMEJxQixHLEVBQVk7QUFDbEMsZUFBTyxLQUFLOEIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV1MsaUJBQVgsQ0FBNkJ2QyxHQUE3QixDQUFiLEdBQWlELElBQUlyQixTQUFKLEVBQXhEO0FBQ0g7QUFFRDs7Ozs7Ozs7MENBSzRCcUIsRyxFQUFZO0FBQ3BDLGVBQU8sS0FBSzhCLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdVLG1CQUFYLENBQStCeEMsR0FBL0IsQ0FBYixHQUFtRCxJQUFJckIsU0FBSixFQUExRDtBQUNIO0FBRUQ7Ozs7Ozs7O3VDQUt5QnFCLEcsRUFBWTtBQUNqQyxlQUFPLEtBQUs4QixLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXVyxnQkFBWCxDQUE0QnpDLEdBQTVCLENBQWIsR0FBZ0QsSUFBSXJCLFNBQUosRUFBdkQ7QUFDSDtBQUVEOzs7Ozs7Ozt5Q0FLMEJxQixHLEVBQVk7QUFDbEMsZUFBTyxLQUFLOEIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV1ksa0JBQVgsQ0FBOEIxQyxHQUE5QixDQUFiLEdBQWtELElBQUlyQixTQUFKLEVBQXpEO0FBQ0g7QUFFRDs7Ozs7Ozs4QkFJZ0I7QUFDWixlQUFPLEtBQUttRCxLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXTSxLQUFYLEVBQWIsR0FBa0MsSUFBekM7QUFDSDtBQUVEOzs7Ozs7OzsrQkFLaUJwQyxHLEVBQVk7QUFDekIsZUFBTyxLQUFLOEIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV2EsUUFBWCxDQUFvQjNDLEdBQXBCLENBQWIsR0FBd0MsSUFBSXJCLFNBQUosRUFBL0M7QUFDSDtBQUVEOzs7Ozs7OztpQ0FLa0JxQixHLEVBQVk7QUFDMUIsZUFBTyxLQUFLOEIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV2MsVUFBWCxDQUFzQjVDLEdBQXRCLENBQWIsR0FBMEMsSUFBSXJCLFNBQUosRUFBakQ7QUFDSDtBQUVEOzs7Ozs7O2tDQUlvQjtBQUNoQixlQUFPLEtBQUttRCxLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXYSxRQUFYLENBQW9CakUsS0FBcEIsRUFBMkJrQixDQUF4QyxHQUE0QyxDQUFuRDtBQUNIO0FBRUQ7Ozs7Ozs7a0NBSW9CO0FBQ2hCLGVBQU8sS0FBS2tDLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdhLFFBQVgsQ0FBb0JqRSxLQUFwQixFQUEyQm1CLENBQXhDLEdBQTRDLENBQW5EO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJdUI7QUFDbkIsZUFBTyxLQUFLaUMsS0FBTCxHQUFhLEtBQUtBLEtBQUwsQ0FBV2UsWUFBWCxFQUFiLEdBQXlDLENBQWhEO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJdUI7QUFDbkIsZUFBTyxLQUFLZixLQUFMLEdBQWEsS0FBS0EsS0FBTCxDQUFXZ0IsWUFBWCxFQUFiLEdBQXlDLENBQWhEO0FBQ0g7Ozs7SUE5TTJCOUQsYztBQWlOaEM7Ozs7Ozs7OztBQWpOYXlDLEVBQUFBLFUsQ0FLS3NCLFcsR0FBYyxDO0FBTG5CdEIsRUFBQUEsVSxDQVdLdUIsSyxHQUFRLEM7QUFYYnZCLEVBQUFBLFUsQ0FnQkt3QixLLEdBQVEsQztBQWhCYnhCLEVBQUFBLFUsQ0FxQkt5QixLLEdBQVEsQztBQXJCYnpCLEVBQUFBLFUsQ0EwQkswQixTLEdBQVksQzs7TUE2TGpCQyxpQjs7O0FBQ1Q7Ozs7O0FBTUE7Ozs7QUFJQSwrQkFBYUMsR0FBYixFQUFnQ3ZFLE9BQWhDLEVBQW1EO0FBQUE7O0FBQUE7O0FBQy9DLDhGQUFNRSxlQUFNc0UsWUFBWixFQUEwQnhFLE9BQTFCO0FBRCtDLGFBTjVDdUUsR0FNNEM7QUFFL0MsYUFBS0EsR0FBTCxHQUFXQSxHQUFYO0FBRitDO0FBR2xEOzs7SUFka0NyRSxjO0FBaUJ2Qzs7Ozs7Ozs7OztNQU1hdUUsYTs7O0FBQ1Q7Ozs7Ozs7Ozs7QUFXQTs7Ozs7QUFNQTs7Ozs7QUFNQTs7Ozs7QUFLQSwyQkFBYUMsT0FBYixFQUE4Q0MsU0FBOUMsRUFBa0UzRSxPQUFsRSxFQUFxRjtBQUFBOztBQUFBOztBQUNqRiwwRkFBTUUsZUFBTTBFLFFBQVosRUFBc0I1RSxPQUF0QjtBQURpRixhQW5COUUwRSxPQW1COEU7QUFBQSxhQWI5RUcsUUFhOEU7QUFBQSxhQVA5RUYsU0FPOEU7O0FBRWpGLFVBQUksT0FBT0QsT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUM3QixlQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDSCxPQUZELE1BRU87QUFDSCxlQUFLQSxPQUFMLEdBQWVBLE9BQU8sQ0FBQ0EsT0FBdkI7QUFDQSxlQUFLRyxRQUFMLEdBQWdCSCxPQUFoQjtBQUNIOztBQUNELGFBQUtDLFNBQUwsR0FBaUJBLFNBQWpCO0FBUmlGO0FBU3BGOzs7SUF0QzhCekUsYyxHQXlDbkM7QUFDQTs7OztBQUNBQSxpQkFBTUosVUFBTixHQUFtQkEsVUFBbkIsQyxDQUVBO0FBQ0E7O0FBQ0FJLGlCQUFNeUMsVUFBTixHQUFtQkEsVUFBbkIsQyxDQUVBO0FBQ0E7O0FBQ0F6QyxpQkFBTW9FLGlCQUFOLEdBQTBCQSxpQkFBMUIsQyxDQUVBO0FBQ0E7O0FBQ0FwRSxpQkFBTXVFLGFBQU4sR0FBc0JBLGFBQXRCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDIwIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGV2ZW50XHJcbiAqL1xyXG5cclxuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2V2ZW50L2V2ZW50JztcclxuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uLy4uL21hdGgvdmVjMic7XHJcbmltcG9ydCB7IFRvdWNoIH0gZnJvbSAnLi90b3VjaCc7XHJcbmltcG9ydCB7IEFjY2VsZXJhdGlvbiB9IGZyb20gJy4vaW5wdXQtbWFuYWdlcic7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxubGV0IF92ZWMyID0gbmV3IFZlYzIoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIG1vdXNlIGV2ZW50XHJcbiAqIEB6aCDpvKDmoIfkuovku7bnsbvlnotcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1vdXNlIGV4dGVuZHMgRXZlbnQge1xyXG4gICAgLy8gSW5uZXIgZXZlbnQgdHlwZXMgb2YgTW91c2VFdmVudFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBub25lIGV2ZW50IGNvZGUgb2YgbW91c2UgZXZlbnQuXHJcbiAgICAgKiBAemgg5peg5pWI5LqL5Lu25Luj56CBXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTk9ORSA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IGNvZGUgb2YgbW91c2UgZG93biBldmVudC5cclxuICAgICAqIEB6aCDpvKDmoIfmjInkuIvkuovku7bku6PnoIHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBET1dOID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgY29kZSBvZiBtb3VzZSB1cCBldmVudC5cclxuICAgICAqIEB6aCDpvKDmoIfmjInkuIvlkI7ph4rmlL7kuovku7bku6PnoIHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBVUCA9IDI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IGNvZGUgb2YgbW91c2UgbW92ZSBldmVudC5cclxuICAgICAqIEB6aCDpvKDmoIfnp7vliqjkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBNT1ZFID0gMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgY29kZSBvZiBtb3VzZSBzY3JvbGwgZXZlbnQuXHJcbiAgICAgKiBAemgg6byg5qCH5rua6L2u5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgU0NST0xMID0gNDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZGVmYXVsdCB0YWcgd2hlbiBubyBidXR0b24gaXMgcHJlc3NlZFxyXG4gICAgICogQHpoIOaMiemUrum7mOiupOeahOe8uuecgeeKtuaAgVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJVVFRPTl9NSVNTSU5HID0gLTE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHRhZyBvZiBtb3VzZSdzIGxlZnQgYnV0dG9uLlxyXG4gICAgICogQHpoIOm8oOagh+W3pumUrueahOagh+etvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJVVFRPTl9MRUZUID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdGFnIG9mIG1vdXNlJ3MgcmlnaHQgYnV0dG9uICAoVGhlIHJpZ2h0IGJ1dHRvbiBudW1iZXIgaXMgMiBvbiBicm93c2VyKS5cclxuICAgICAqIEB6aCDpvKDmoIflj7PplK7nmoTmoIfnrb7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBCVVRUT05fUklHSFQgPSAyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0YWcgb2YgbW91c2UncyBtaWRkbGUgYnV0dG9uLlxyXG4gICAgICogQHpoIOm8oOagh+S4remUrueahOagh+etvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJVVFRPTl9NSURETEUgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0YWcgb2YgbW91c2UncyBidXR0b24gNC5cclxuICAgICAqIEB6aCDpvKDmoIfmjInplK4gNCDnmoTmoIfnrb7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBCVVRUT05fNCA9IDM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHRhZyBvZiBtb3VzZSdzIGJ1dHRvbiA1LlxyXG4gICAgICogQHpoIOm8oOagh+aMiemUriA1IOeahOagh+etvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJVVFRPTl81ID0gNDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdGFnIG9mIG1vdXNlJ3MgYnV0dG9uIDYuXHJcbiAgICAgKiBAemgg6byg5qCH5oyJ6ZSuIDYg55qE5qCH562+44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgQlVUVE9OXzYgPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0YWcgb2YgbW91c2UncyBidXR0b24gNy5cclxuICAgICAqIEB6aCDpvKDmoIfmjInplK4gNyDnmoTmoIfnrb7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBCVVRUT05fNyA9IDY7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHRhZyBvZiBtb3VzZSdzIGJ1dHRvbiA4LlxyXG4gICAgICogQHpoIOm8oOagh+aMiemUriA4IOeahOagh+etvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJVVFRPTl84ID0gNztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNb3VzZSBtb3ZlbWVudCBvbiB4IGF4aXMgb2YgdGhlIFVJIGNvb3JkaW5hdGUgc3lzdGVtLlxyXG4gICAgICogQHpoIOm8oOagh+WcqCBVSSDlnZDmoIfns7vkuIsgWCDovbTkuIrnmoTnp7vliqjot53nprtcclxuICAgICAqL1xyXG4gICAgcHVibGljIG1vdmVtZW50WDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNb3VzZSBtb3ZlbWVudCBvbiB5IGF4aXMgb2YgdGhlIFVJIGNvb3JkaW5hdGUgc3lzdGVtLlxyXG4gICAgICogQHpoIOm8oOagh+WcqCBVSSDlnZDmoIfns7vkuIsgWSDovbTkuIrnmoTnp7vliqjot53nprtcclxuICAgICAqL1xyXG4gICAgcHVibGljIG1vdmVtZW50WTogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdHlwZSBvZiB0aGUgZXZlbnQsIHBvc3NpYmxlIHZhbHVlcyBhcmUgVVAsIERPV04sIE1PVkUsIFNDUk9MTFxyXG4gICAgICogQHpoIOm8oOagh+S6i+S7tuexu+Wei++8jOWPr+S7peaYryBVUCwgRE9XTiwgTU9WRSwgQ0FOQ0VMRUTjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGV2ZW50VHlwZTogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX2J1dHRvbjogbnVtYmVyID0gRXZlbnRNb3VzZS5CVVRUT05fTUlTU0lORztcclxuXHJcbiAgICBwcml2YXRlIF94OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3k6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfcHJldlg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfcHJldlk6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2Nyb2xsWDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9zY3JvbGxZOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGV2ZW50VHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCwgcG9zc2libGUgdmFsdWVzIGFyZSBVUCwgRE9XTiwgTU9WRSwgU0NST0xMXHJcbiAgICAgKiBAcGFyYW0gYnViYmxlcyAtIEluZGljYXRlIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgaGllcmFyY2h5IG9yIG5vdC5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGV2ZW50VHlwZTogbnVtYmVyLCBidWJibGVzPzogYm9vbGVhbiwgcHJldkxvYz86IFZlYzIpIHtcclxuICAgICAgICBzdXBlcihFdmVudC5NT1VTRSwgYnViYmxlcyk7XHJcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBldmVudFR5cGU7XHJcbiAgICAgICAgaWYgKHByZXZMb2MpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldlggPSBwcmV2TG9jLng7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZXZZID0gcHJldkxvYy55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHNjcm9sbCBkYXRhIG9mIHRoZSBtb3VzZS5cclxuICAgICAqIEB6aCDorr7nva7pvKDmoIfmu5rova7nmoTmu5rliqjmlbDmja7jgIJcclxuICAgICAqIEBwYXJhbSBzY3JvbGxYIC0gVGhlIHNjcm9sbCB2YWx1ZSBvbiB4IGF4aXNcclxuICAgICAqIEBwYXJhbSBzY3JvbGxZIC0gVGhlIHNjcm9sbCB2YWx1ZSBvbiB5IGF4aXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFNjcm9sbERhdGEgKHNjcm9sbFg6IG51bWJlciwgc2Nyb2xsWTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsWCA9IHNjcm9sbFg7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsWSA9IHNjcm9sbFk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgc2Nyb2xsIHZhbHVlIG9uIHggYXhpcy5cclxuICAgICAqIEB6aCDojrflj5bpvKDmoIfmu5rliqjnmoQgWCDovbTot53nprvvvIzlj6rmnInmu5rliqjml7bmiY3mnInmlYjjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNjcm9sbFggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxYO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHNjcm9sbCB2YWx1ZSBvbiB5IGF4aXMuXHJcbiAgICAgKiBAemgg6I635Y+W5rua6L2u5rua5Yqo55qEIFkg6L206Led56a777yM5Y+q5pyJ5rua5Yqo5pe25omN5pyJ5pWI44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTY3JvbGxZICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsWTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIGN1cnNvciBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDorr7nva7lvZPliY3pvKDmoIfkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSB4IC0gVGhlIGxvY2F0aW9uIG9uIHggYXhpc1xyXG4gICAgICogQHBhcmFtIHkgLSBUaGUgbG9jYXRpb24gb24geSBheGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRMb2NhdGlvbiAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGN1cnNvciBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5bpvKDmoIfnm7jlr7nkuo7lt6bkuIvop5LkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMb2NhdGlvbiAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBWZWMyLnNldChvdXQsIHRoaXMuX3gsIHRoaXMuX3kpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgY3VycmVudCBjdXJzb3IgbG9jYXRpb24gaW4gZ2FtZSB2aWV3IGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeS6i+S7tuWcqOa4uOaIj+eql+WPo+WGheeahOWdkOagh+S9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uSW5WaWV3IChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzIuc2V0KG91dCwgdGhpcy5feCwgbGVnYWN5Q0Mudmlldy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0IC0gdGhpcy5feSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjdXJyZW50IGN1cnNvciBsb2NhdGlvbiBpbiB1aSBjb29yZGluYXRlcy5cclxuICAgICAqIEB6aCDojrflj5blvZPliY3kuovku7blnKggVUkg56qX5Y+j5YaF55qE5Z2Q5qCH5L2N572u77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IC0gUGFzcyB0aGUgb3V0IG9iamVjdCB0byBhdm9pZCBvYmplY3QgY3JlYXRpb24sIHZlcnkgZ29vZCBwcmFjdGljZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VUlMb2NhdGlvbiAob3V0PzogVmVjMil7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzIuc2V0KG91dCwgdGhpcy5feCwgdGhpcy5feSk7XHJcbiAgICAgICAgbGVnYWN5Q0Mudmlldy5fY29udmVydFBvaW50V2l0aFNjYWxlKG91dCk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBwcmV2aW91cyB0b3VjaCBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5bpvKDmoIfngrnlh7vlnKjkuIrkuIDmrKHkuovku7bml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQcmV2aW91c0xvY2F0aW9uIChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzIuc2V0KG91dCwgdGhpcy5fcHJldlgsIHRoaXMuX3ByZXZZKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHByZXZpb3VzIHRvdWNoIGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPlum8oOagh+eCueWHu+WcqOS4iuS4gOasoeS6i+S7tuaXtueahOS9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJUHJldmlvdXNMb2NhdGlvbiAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgIG91dCA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBWZWMyLnNldChvdXQsIHRoaXMuX3ByZXZYLCB0aGlzLl9wcmV2WSk7XHJcbiAgICAgICAgbGVnYWN5Q0Mudmlldy5fY29udmVydFBvaW50V2l0aFNjYWxlKG91dCk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPlum8oOagh+i3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahOi3neemu+Wvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldERlbHRhIChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgaWYgKCFvdXQpIHtcclxuICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzIuc2V0KG91dCwgdGhpcy5feCAtIHRoaXMuX3ByZXZYLCB0aGlzLl95IC0gdGhpcy5fcHJldlkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgWCBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAemgg6I635Y+W6byg5qCH6Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo55qEIFgg6L206Led56a744CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXREZWx0YVggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94IC0gdGhpcy5fcHJldlg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgWSBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24uXHJcbiAgICAgKiBAemgg6I635Y+W6byg5qCH6Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo55qEIFkg6L206Led56a744CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXREZWx0YVkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl95IC0gdGhpcy5fcHJldlk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgcHJldmlvdXMgbG9jYXRpb24gdG8gY3VycmVudCBsb2NhdGlvbiBpbiB0aGUgVUkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6byg5qCH6Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo5ZyoIFVJIOWdkOagh+ezu+S4i+eahOi3neemu+Wvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJRGVsdGEgKG91dD86IFZlYzIpIHtcclxuICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICBvdXQgPSBuZXcgVmVjMigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVmVjMi5zZXQob3V0LCAodGhpcy5feCAtIHRoaXMuX3ByZXZYKSAvIGxlZ2FjeUNDLnZpZXcuZ2V0U2NhbGVYKCksICh0aGlzLl95IC0gdGhpcy5fcHJldlkpIC8gbGVnYWN5Q0Mudmlldy5nZXRTY2FsZVkoKSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBYIGF4aXMgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgcHJldmlvdXMgbG9jYXRpb24gdG8gY3VycmVudCBsb2NhdGlvbiBpbiB0aGUgVUkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6byg5qCH6Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo5ZyoIFVJIOWdkOagh+ezu+S4i+eahCBYIOi9tOi3neemu+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VUlEZWx0YVggKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5feCAtIHRoaXMuX3ByZXZYKSAvIGxlZ2FjeUNDLnZpZXcuZ2V0U2NhbGVYKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgWSBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24gaW4gdGhlIFVJIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPlum8oOagh+i3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOWcqCBVSSDlnZDmoIfns7vkuIvnmoQgWSDovbTot53nprvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJRGVsdGFZICgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3kgLSB0aGlzLl9wcmV2WSkgLyBsZWdhY3lDQy52aWV3LmdldFNjYWxlWSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldHMgbW91c2UgYnV0dG9uIGNvZGUuXHJcbiAgICAgKiBAemgg6K6+572u6byg5qCH5oyJ6ZSu44CCXHJcbiAgICAgKiBAcGFyYW0gYnV0dG9uIC0gVGhlIGJ1dHRvbiBjb2RlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRCdXR0b24gKGJ1dHRvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uID0gYnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgbW91c2UgYnV0dG9uIGNvZGUuXHJcbiAgICAgKiBAemgg6I635Y+W6byg5qCH5oyJ6ZSu44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCdXR0b24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9idXR0b247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBsb2NhdGlvbiBkYXRhIG9uIFggYXhpcy5cclxuICAgICAqIEB6aCDojrflj5bpvKDmoIflvZPliY0gWCDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uWCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBsb2NhdGlvbiBkYXRhIG9uIFkgYXhpcy5cclxuICAgICAqIEB6aCDojrflj5bpvKDmoIflvZPliY0gWSDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uWSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBsb2NhdGlvbiBkYXRhIG9uIFggYXhpcy5cclxuICAgICAqIEB6aCDojrflj5bpvKDmoIflvZPliY0gWCDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJTG9jYXRpb25YICgpIHtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGxlZ2FjeUNDLnZpZXcuZ2V0Vmlld3BvcnRSZWN0KCk7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl94IC0gdmlld3BvcnQueCkgLyBsZWdhY3lDQy52aWV3LmdldFNjYWxlWCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgbG9jYXRpb24gZGF0YSBvbiBZIGF4aXMuXHJcbiAgICAgKiBAemgg6I635Y+W6byg5qCH5b2T5YmNIFkg6L205L2N572u44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRVSUxvY2F0aW9uWSAoKSB7XHJcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSBsZWdhY3lDQy52aWV3LmdldFZpZXdwb3J0UmVjdCgpO1xyXG4gICAgICAgIHJldHVybiAodGhpcy5feSAtIHZpZXdwb3J0LnkpIC8gbGVnYWN5Q0Mudmlldy5nZXRTY2FsZVkoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgdG91Y2ggZXZlbnQuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDop6bmkbjkuovku7bjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudFRvdWNoIGV4dGVuZHMgRXZlbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG1heGltdW0gdG91Y2ggcG9pbnQgbnVtYmVycyBzaW11bHRhbmVvdXNseVxyXG4gICAgICogQHpoIOWQjOaXtuWtmOWcqOeahOacgOWkp+inpueCueaVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE1BWF9UT1VDSEVTID0gNTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgdHlwZSBjb2RlIG9mIHRvdWNoIGJlZ2FuIGV2ZW50LlxyXG4gICAgICogQHpoIOW8gOWni+inpuaRuOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJFR0FOID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgdG91Y2ggbW92ZWQgZXZlbnQuXHJcbiAgICAgKiBAemgg6Kem5pG45ZCO56e75Yqo5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTU9WRUQgPSAxO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiB0b3VjaCBlbmRlZCBldmVudC5cclxuICAgICAqIEB6aCDnu5PmnZ/op6bmkbjkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBFTkRFRCA9IDI7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgdHlwZSBjb2RlIG9mIHRvdWNoIGNhbmNlbGVkIGV2ZW50LlxyXG4gICAgICogQHpoIOWPlua2iOinpuaRuOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIENBTkNFTExFRCA9IDM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGN1cnJlbnQgdG91Y2ggb2JqZWN0XHJcbiAgICAgKiBAemgg5b2T5YmN6Kem54K55a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b3VjaDogVG91Y2ggfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEluZGljYXRlIHdoZXRoZXIgdGhlIHRvdWNoIGV2ZW50IGlzIHNpbXVsYXRlZCBvciByZWFsXHJcbiAgICAgKiBAemgg6KGo56S66Kem5pG45LqL5Lu25piv55yf5a6e6Kem54K56Kem5Y+R55qE6L+Y5piv5qih5ouf55qEXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaW11bGF0ZSA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX2V2ZW50Q29kZTogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX3RvdWNoZXM6IFRvdWNoW107XHJcblxyXG4gICAgcHJpdmF0ZSBfYWxsVG91Y2hlczogVG91Y2hbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB0b3VjaGVzIC0gQW4gYXJyYXkgb2YgY3VycmVudCB0b3VjaGVzXHJcbiAgICAgKiBAcGFyYW0gYnViYmxlcyAtIEluZGljYXRlIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgaGllcmFyY2h5IG9yIG5vdC5cclxuICAgICAqIEBwYXJhbSBldmVudENvZGUgLSBUaGUgdHlwZSBjb2RlIG9mIHRoZSB0b3VjaCBldmVudFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoY2hhbmdlZFRvdWNoZXM/OiBUb3VjaFtdLCBidWJibGVzPzogYm9vbGVhbiwgZXZlbnRDb2RlPzogbnVtYmVyLCB0b3VjaGVzPzogVG91Y2hbXSkge1xyXG4gICAgICAgIHN1cGVyKEV2ZW50LlRPVUNILCBidWJibGVzKTtcclxuICAgICAgICB0aGlzLl9ldmVudENvZGUgPSBldmVudENvZGUgfHwgMDtcclxuICAgICAgICB0aGlzLl90b3VjaGVzID0gY2hhbmdlZFRvdWNoZXMgfHwgW107XHJcbiAgICAgICAgdGhpcy5fYWxsVG91Y2hlcyA9IHRvdWNoZXMgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBldmVudCB0eXBlIGNvZGUuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem5pG45LqL5Lu257G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRFdmVudENvZGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudENvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0b3VjaGVzIG9mIGV2ZW50LlxyXG4gICAgICogQHpoIOiOt+WPluacieWPmOWKqOeahOinpuaRuOeCueeahOWIl+ihqOOAglxyXG4gICAgICog5rOo5oSP77ya56ys5LiA5qC55omL5oyH5oyJ5LiL5LiN5Yqo77yM5o6l552A5oyJ56ys5LqM5qC55omL5oyH77yM6L+Z5pe25YCZ6Kem54K55L+h5oGv5bCx5Y+q5pyJ5Y+Y5Yqo55qE6L+Z5qC55omL5oyH77yI56ys5LqM5qC55omL5oyH77yJ55qE5L+h5oGv44CCXHJcbiAgICAgKiDlpoLmnpzpnIDopoHojrflj5blhajpg6jmiYvmjIfnmoTkv6Hmga/vvIzor7fkvb/nlKggYGdldEFsbFRvdWNoZXNg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRUb3VjaGVzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdG91Y2hlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRvdWNoZXMgb2YgZXZlbnQuXHJcbiAgICAgKiBAemgg6I635Y+W5omA5pyJ6Kem5pG454K555qE5YiX6KGo44CCXHJcbiAgICAgKiDms6jmhI/vvJrlpoLmnpzmiYvmjIfooYzkuLrmmK8gdG91Y2ggZW5k77yM6L+Z5Liq5pe25YCZ5YiX6KGo5piv5rKh5pyJ6K+l5omL5oyH5L+h5oGv55qE44CC5aaC6ZyA55+l6YGT6K+l5omL5oyH5L+h5oGv77yM5Y+v6YCa6L+HIGBnZXRUb3VjaGVzYCDojrflj5bor4bliKvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEFsbFRvdWNoZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxUb3VjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldHMgdG91Y2ggbG9jYXRpb24uXHJcbiAgICAgKiBAemgg6K6+572u5b2T5YmN6Kem54K55L2N572uXHJcbiAgICAgKiBAcGFyYW0geCAtIFRoZSBjdXJyZW50IHRvdWNoIGxvY2F0aW9uIG9uIHRoZSB4IGF4aXNcclxuICAgICAqIEBwYXJhbSB5IC0gVGhlIGN1cnJlbnQgdG91Y2ggbG9jYXRpb24gb24gdGhlIHkgYXhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TG9jYXRpb24gKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudG91Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy50b3VjaC5zZXRUb3VjaEluZm8odGhpcy50b3VjaC5nZXRJRCgpLCB4LCB5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgY3VycmVudCB0b3VjaCBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5bop6bngrnkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMb2NhdGlvbiAob3V0PzogVmVjMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXRMb2NhdGlvbihvdXQpIDogbmV3IFZlYzIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjdXJyZW50IHRvdWNoIGxvY2F0aW9uIGluIFVJIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPliBVSSDlnZDmoIfns7vkuIvnmoTop6bngrnkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRVSUxvY2F0aW9uKG91dD86IFZlYzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0VUlMb2NhdGlvbihvdXQpIDogbmV3IFZlYzIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjdXJyZW50IHRvdWNoIGxvY2F0aW9uIGluIGdhbWUgc2NyZWVuIGNvb3JkaW5hdGVzLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeinpueCueWcqOa4uOaIj+eql+WPo+S4reeahOS9jee9ruOAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uSW5WaWV3IChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldExvY2F0aW9uSW5WaWV3KG91dCkgOiBuZXcgVmVjMigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHByZXZpb3VzIHRvdWNoIGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPluinpueCueWcqOS4iuS4gOasoeS6i+S7tuaXtueahOS9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFByZXZpb3VzTG9jYXRpb24gKG91dD86IFZlYzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0UHJldmlvdXNMb2NhdGlvbihvdXQpIDogbmV3IFZlYzIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBzdGFydCB0b3VjaCBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5bop6bngrnokL3kuIvml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTdGFydExvY2F0aW9uIChvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldFN0YXJ0TG9jYXRpb24ob3V0KSA6IG5ldyBWZWMyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgc3RhcnQgdG91Y2ggbG9jYXRpb24gaW4gVUkgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemgg6I635Y+W6Kem54K56JC95LiL5pe255qEIFVJIOS4lueVjOS4i+S9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxyXG4gICAgICogQHBhcmFtIG91dCAtIFBhc3MgdGhlIG91dCBvYmplY3QgdG8gYXZvaWQgb2JqZWN0IGNyZWF0aW9uLCB2ZXJ5IGdvb2QgcHJhY3RpY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVJU3RhcnRMb2NhdGlvbihvdXQ/OiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldFVJU3RhcnRMb2NhdGlvbihvdXQpIDogbmV3IFZlYzIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgY3VycmVudCB0b3VjaCBwb2ludC5cclxuICAgICAqIEB6aCDojrflj5bop6bngrnnmoTmoIfor4YgSUTvvIzlj6/ku6XnlKjmnaXlnKjlpJrngrnop6bmkbjkuK3ot5/ouKrop6bngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldElEICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0SUQoKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgcHJldmlvdXMgbG9jYXRpb24gdG8gY3VycmVudCBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5bop6bngrnot53nprvkuIrkuIDmrKHkuovku7bnp7vliqjnmoTot53nprvlr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXREZWx0YSAob3V0PzogVmVjMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXREZWx0YShvdXQpIDogbmV3IFZlYzIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPluinpueCuei3neemu+S4iuS4gOasoeS6i+S7tiBVSSDkuJbnlYzkuIvnp7vliqjnmoTot53nprvlr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSBQYXNzIHRoZSBvdXQgb2JqZWN0IHRvIGF2b2lkIG9iamVjdCBjcmVhdGlvbiwgdmVyeSBnb29kIHByYWN0aWNlXHJcbiAgICAqL1xyXG4gICAgcHVibGljIGdldFVJRGVsdGEob3V0PzogVmVjMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXRVSURlbHRhKG91dCkgOiBuZXcgVmVjMigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIFggYXhpcyBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPluinpueCuei3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahCB4IOi9tOi3neemu+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RGVsdGFYICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0RGVsdGEoX3ZlYzIpLnggOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIFkgYXhpcyBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPluinpueCuei3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahCB5IOi9tOi3neemu+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RGVsdGFZICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0RGVsdGEoX3ZlYzIpLnkgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgbG9jYXRpb24gWCBheGlzIGRhdGEuXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN6Kem54K5IFgg6L205L2N572u44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMb2NhdGlvblggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXRMb2NhdGlvblgoKSA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBsb2NhdGlvbiBZIGF4aXMgZGF0YS5cclxuICAgICAqIEB6aCDojrflj5blvZPliY3op6bngrkgWSDovbTkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldExvY2F0aW9uWSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldExvY2F0aW9uWSgpIDogMDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgYWNjZWxlcmF0aW9uIGV2ZW50LlxyXG4gKiBAemhcclxuICog5Yqg6YCf6K6h5LqL5Lu244CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRBY2NlbGVyYXRpb24gZXh0ZW5kcyBFdmVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYWNjZWxlcmF0aW9uIG9iamVjdFxyXG4gICAgICogQHpoIOWKoOmAn+W6puWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWNjOiBBY2NlbGVyYXRpb247XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gYWNjIC0gVGhlIGFjY2VsZXJhdGlvblxyXG4gICAgICogQHBhcmFtIGJ1YmJsZXMgLSBJbmRpY2F0ZSB3aGV0aGVyIHRoZSBldmVudCBidWJibGVzIHVwIHRocm91Z2ggdGhlIGhpZXJhcmNoeSBvciBub3QuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChhY2M6IEFjY2VsZXJhdGlvbiwgYnViYmxlcz86IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcihFdmVudC5BQ0NFTEVSQVRJT04sIGJ1YmJsZXMpO1xyXG4gICAgICAgIHRoaXMuYWNjID0gYWNjO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBrZXlib2FyZCBldmVudC5cclxuICogQHpoXHJcbiAqIOmUruebmOS6i+S7tuOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEV2ZW50S2V5Ym9hcmQgZXh0ZW5kcyBFdmVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUga2V5Q29kZSByZWFkLW9ubHkgcHJvcGVydHkgcmVwcmVzZW50cyBhIHN5c3RlbSBhbmQgaW1wbGVtZW50YXRpb24gZGVwZW5kZW50IG51bWVyaWNhbCBjb2RlXHJcbiAgICAgKiBpZGVudGlmeWluZyB0aGUgdW5tb2RpZmllZCB2YWx1ZSBvZiB0aGUgcHJlc3NlZCBrZXkuXHJcbiAgICAgKiBUaGlzIGlzIHVzdWFsbHkgdGhlIGRlY2ltYWwgQVNDSUkgKFJGQyAyMCkgb3IgV2luZG93cyAxMjUyIGNvZGUgY29ycmVzcG9uZGluZyB0byB0aGUga2V5LlxyXG4gICAgICogSWYgdGhlIGtleSBjYW4ndCBiZSBpZGVudGlmaWVkLCB0aGlzIHZhbHVlIGlzIDAuXHJcbiAgICAgKiBAemgga2V5Q29kZSDmmK/lj6ror7vlsZ7mgKflroPooajnpLrkuIDkuKrns7vnu5/lkozkvp3otZbkuo7lrp7njrDnmoTmlbDlrZfku6PnoIHvvIzlj6/ku6Xor4bliKvmjInplK7nmoTmnKrkv67mlLnlgLzjgIJcclxuICAgICAqIOi/memAmuW4uOaYr+WNgei/m+WItiBBU0NJSSAoUkZDMjApIOaIluiAhSBXaW5kb3dzIDEyNTIg5Luj56CB77yM5omA5a+55bqU55qE5a+G6ZKl44CCXHJcbiAgICAgKiDlpoLmnpzml6Dms5Xor4bliKvor6XplK7vvIzliJnor6XlgLzkuLogMOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMga2V5Q29kZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJhdyBET00gS2V5Ym9hcmRFdmVudC5cclxuICAgICAqIEB6aCDljp/lp4sgRE9NIEtleWJvYXJkRXZlbnQg5LqL5Lu25a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByYXdFdmVudD86IEtleWJvYXJkRXZlbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN1cnJlbnQga2V5IGlzIGJlaW5nIHByZXNzZWRcclxuICAgICAqIEB6aCDooajnpLrlvZPliY3mjInplK7mmK/lkKbmraPlnKjooqvmjInkuItcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzUHJlc3NlZDogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBrZXlDb2RlIC0gVGhlIGtleSBjb2RlIG9mIHRoZSBjdXJyZW50IGtleSBvciB0aGUgRE9NIEtleWJvYXJkRXZlbnRcclxuICAgICAqIEBwYXJhbSBpc1ByZXNzZWQgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY3VycmVudCBrZXkgaXMgYmVpbmcgcHJlc3NlZFxyXG4gICAgICogQHBhcmFtIGJ1YmJsZXMgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZXZlbnQgYnViYmxlcyB1cCB0aHJvdWdoIHRoZSBoaWVyYXJjaHkgb3Igbm90LlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoa2V5Q29kZTogbnVtYmVyIHwgS2V5Ym9hcmRFdmVudCwgaXNQcmVzc2VkOiBib29sZWFuLCBidWJibGVzPzogYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKEV2ZW50LktFWUJPQVJELCBidWJibGVzKTtcclxuICAgICAgICBpZiAodHlwZW9mIGtleUNvZGUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHRoaXMua2V5Q29kZSA9IGtleUNvZGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlDb2RlID0ga2V5Q29kZS5rZXlDb2RlO1xyXG4gICAgICAgICAgICB0aGlzLnJhd0V2ZW50ID0ga2V5Q29kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc1ByZXNzZWQgPSBpc1ByZXNzZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRPRE9cclxuLy8gQHRzLWlnbm9yZVxyXG5FdmVudC5FdmVudE1vdXNlID0gRXZlbnRNb3VzZTtcclxuXHJcbi8vIFRPRE9cclxuLy8gQHRzLWlnbm9yZVxyXG5FdmVudC5FdmVudFRvdWNoID0gRXZlbnRUb3VjaDtcclxuXHJcbi8vIFRPRE9cclxuLy8gQHRzLWlnbm9yZVxyXG5FdmVudC5FdmVudEFjY2VsZXJhdGlvbiA9IEV2ZW50QWNjZWxlcmF0aW9uO1xyXG5cclxuLy8gVE9ET1xyXG4vLyBAdHMtaWdub3JlXHJcbkV2ZW50LkV2ZW50S2V5Ym9hcmQgPSBFdmVudEtleWJvYXJkO1xyXG4iXX0=