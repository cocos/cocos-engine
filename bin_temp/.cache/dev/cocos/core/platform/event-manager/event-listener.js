(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../global-exports.js", "../debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../global-exports.js"), require("../debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.debug);
    global.eventListener = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Keyboard = _exports.Acceleration = _exports.TouchAllAtOnce = _exports.TouchOneByOne = _exports.Mouse = _exports.EventListener = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en The base class of event listener.                                                                        <br/>
   * If you need custom listener which with different callback, you need to inherit this class.               <br/>
   * For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
   * EventListenerTouchOneByOne, EventListenerCustom.<br/>
   * @zh 封装用户的事件处理逻辑
   * 注意：这是一个抽象类，开发者不应该直接实例化这个类，请参考 [[create]] 。
   */
  var EventListener = /*#__PURE__*/function () {
    _createClass(EventListener, [{
      key: "onEvent",
      // Whether the listener is enabled
      get: function get() {
        return this._onEvent;
      }
    }], [{
      key: "create",

      /**
       * @en The type code of unknown event listener.<br/>
       * @zh 未知的事件监听器类型
       */

      /**
       * @en The type code of one by one touch event listener.<br/>
       * @zh 触摸事件监听器类型，触点会一个一个得分开被派发
       */

      /**
       * @en The type code of all at once touch event listener.<br/>
       * @zh 触摸事件监听器类型，触点会被一次性全部派发
       */

      /**
       * @en The type code of keyboard event listener.<br/>
       * @zh 键盘事件监听器类型
       */

      /**
       * @en The type code of mouse event listener.<br/>
       * @zh 鼠标事件监听器类型
       */

      /**
       * @en The type code of acceleration event listener.<br/>
       * @zh 加速器事件监听器类型
       */

      /**
       * @en The type code of custom event listener.<br/>
       * @zh 自定义事件监听器类型
       */

      /**
       * @en Create a EventListener object with configuration including the event type, handlers and other parameters.<br/>
       * In handlers, this refer to the event listener object itself.<br/>
       * You can also pass custom parameters in the configuration object,<br/>
       * all custom parameters will be polyfilled into the event listener object and can be accessed in handlers.<br/>
       * @zh 通过指定不同的 Event 对象来设置想要创建的事件监听器。
       * @param argObj a json object
       */
      value: function create(argObj) {
        (0, _debug.assertID)(argObj && argObj.event, 1900);
        var listenerType = argObj.event;
        delete argObj.event;
        var listener = null;

        if (listenerType === _globalExports.legacyCC.EventListener.TOUCH_ONE_BY_ONE) {
          listener = new TouchOneByOne();
        } else if (listenerType === _globalExports.legacyCC.EventListener.TOUCH_ALL_AT_ONCE) {
          listener = new TouchAllAtOnce();
        } else if (listenerType === _globalExports.legacyCC.EventListener.MOUSE) {
          listener = new Mouse();
        } else if (listenerType === _globalExports.legacyCC.EventListener.KEYBOARD) {
          listener = new Keyboard();
        } else if (listenerType === _globalExports.legacyCC.EventListener.ACCELERATION) {
          listener = new Acceleration(argObj.callback);
          delete argObj.callback;
        }

        if (listener) {
          for (var _i = 0, _Object$keys = Object.keys(argObj); _i < _Object$keys.length; _i++) {
            var key = _Object$keys[_i];
            listener[key] = argObj[key];
          }
        }

        return listener;
      } // hack: How to solve the problem of uncertain attribute
      // callback's this object

    }]);

    function EventListener(type, listenerID, callback) {
      _classCallCheck(this, EventListener);

      this.owner = null;
      this.mask = null;
      this._previousIn = false;
      this._target = null;
      this._onEvent = void 0;
      this._type = void 0;
      this._listenerID = void 0;
      this._registered = false;
      this._fixedPriority = 0;
      this._node = null;
      this._paused = true;
      this._isEnabled = true;
      this._onEvent = callback;
      this._type = type || 0;
      this._listenerID = listenerID || '';
    }
    /**
     * @en
     * <p><br/>
     *     Sets paused state for the listener<br/>
     *     The paused state is only used for scene graph priority listeners.<br/>
     *     `EventDispatcher.resumeAllEventListenersForTarget(node)` will set the paused state to `true`,<br/>
     *     while `EventDispatcher.pauseAllEventListenersForTarget(node)` will set it to `false`.<br/>
     *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,<br/>
     *              call `setEnabled(false)` instead.<br/>
     *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners<br/>
     *              which associated with that node will be automatically updated.<br/>
     * </p><br/>
     * @zh
     * *为侦听器设置暂停状态<br/>
     * 暂停状态仅用于场景图优先级侦听器。<br/>
     * `EventDispatcher :: resumeAllEventListenersForTarget（node）`将暂停状态设置为`true`，<br/>
     * 而`EventDispatcher :: pauseAllEventListenersForTarget（node）`将它设置为`false`。<br/>
     * 注意：<br/>
     * - 固定优先级侦听器永远不会被暂停。 如果固定优先级不想接收事件，改为调用`setEnabled（false）`。<br/>
     * - 在“Node”的onEnter和onExit中，监听器的“暂停状态”与该节点关联的*将自动更新。
     */


    _createClass(EventListener, [{
      key: "_setPaused",
      value: function _setPaused(paused) {
        this._paused = paused;
      }
      /**
       * @en Checks whether the listener is paused.<br/>
       * @zh 检查侦听器是否已暂停。
       */

    }, {
      key: "_isPaused",
      value: function _isPaused() {
        return this._paused;
      }
      /**
       * @en Marks the listener was registered by EventDispatcher.<br/>
       * @zh 标记监听器已由 EventDispatcher 注册。
       */

    }, {
      key: "_setRegistered",
      value: function _setRegistered(registered) {
        this._registered = registered;
      }
      /**
       * @en Checks whether the listener was registered by EventDispatcher<br/>
       * @zh 检查监听器是否已由 EventDispatcher 注册。
       * @private
       */

    }, {
      key: "_isRegistered",
      value: function _isRegistered() {
        return this._registered;
      }
      /**
       * @en Gets the type of this listener<br/>
       * note： It's different from `EventType`, e.g.<br/>
       * TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce<br/>
       * @zh 获取此侦听器的类型<br/>
       * 注意：它与`EventType`不同，例如<br/>
       * TouchEvent 有两种事件监听器 -  EventListenerOneByOne，EventListenerAllAtOnce
       */

    }, {
      key: "_getType",
      value: function _getType() {
        return this._type;
      }
      /**
       * @en Gets the listener ID of this listener<br/>
       * When event is being dispatched, listener ID is used as key for searching listeners according to event type.<br/>
       * @zh 获取此侦听器的侦听器 ID。<br/>
       * 调度事件时，侦听器 ID 用作根据事件类型搜索侦听器的键。
       */

    }, {
      key: "_getListenerID",
      value: function _getListenerID() {
        return this._listenerID;
      }
      /**
       * @en Sets the fixed priority for this listener<br/>
       * note: This method is only used for `fixed priority listeners`,<br/>
       *   it needs to access a non-zero value. 0 is reserved for scene graph priority listeners<br/>
       * @zh 设置此侦听器的固定优先级。<br/>
       * 注意：此方法仅用于“固定优先级侦听器”，<br/>
       * 它需要访问非零值。 0保留给场景图优先级侦听器。
       */

    }, {
      key: "_setFixedPriority",
      value: function _setFixedPriority(fixedPriority) {
        this._fixedPriority = fixedPriority;
      }
      /**
       * @en Gets the fixed priority of this listener<br/>
       * @zh 获取此侦听器的固定优先级。
       * @return 如果它是场景图优先级侦听器则返回 0 ，则对于固定优先级侦听器则不为零
       */

    }, {
      key: "_getFixedPriority",
      value: function _getFixedPriority() {
        return this._fixedPriority;
      }
      /**
       * @en Sets scene graph priority for this listener<br/>
       * @zh 设置此侦听器的场景图优先级。
       * @param {Node} node
       */

    }, {
      key: "_setSceneGraphPriority",
      value: function _setSceneGraphPriority(node) {
        this._target = node;
        this._node = node;
      }
      /**
       * @en Gets scene graph priority of this listener<br/>
       * @zh 获取此侦听器的场景图优先级。
       * @return 如果它是固定优先级侦听器，则为场景图优先级侦听器非 null 。
       */

    }, {
      key: "_getSceneGraphPriority",
      value: function _getSceneGraphPriority() {
        return this._node;
      }
      /**
       * @en Checks whether the listener is available.<br/>
       * @zh 检测监听器是否有效
       */

    }, {
      key: "checkAvailable",
      value: function checkAvailable() {
        return this._onEvent !== null;
      }
      /**
       * @en Clones the listener, its subclasses have to override this method.<br/>
       * @zh 克隆监听器,它的子类必须重写此方法。
       */

    }, {
      key: "clone",
      value: function clone() {
        return null;
      }
      /**
       * @en
       * Enables or disables the listener<br/>
       * note: Only listeners with `enabled` state will be able to receive events.<br/>
       * When an listener was initialized, it's enabled by default.<br/>
       * An event listener can receive events when it is enabled and is not paused.<br/>
       * paused state is always false when it is a fixed priority listener.<br/>
       * @zh
       * 启用或禁用监听器。<br/>
       * 注意：只有处于“启用”状态的侦听器才能接收事件。<br/>
       * 初始化侦听器时，默认情况下启用它。<br/>
       * 事件侦听器可以在启用且未暂停时接收事件。<br/>
       * 当固定优先级侦听器时，暂停状态始终为false。<br/>
       */

    }, {
      key: "setEnabled",
      value: function setEnabled(enabled) {
        this._isEnabled = enabled;
      }
      /**
       * @en Checks whether the listener is enabled<br/>
       * @zh 检查监听器是否可用。
       */

    }, {
      key: "isEnabled",
      value: function isEnabled() {
        return this._isEnabled;
      }
    }]);

    return EventListener;
  }();

  _exports.EventListener = EventListener;
  EventListener.UNKNOWN = 0;
  EventListener.TOUCH_ONE_BY_ONE = 1;
  EventListener.TOUCH_ALL_AT_ONCE = 2;
  EventListener.KEYBOARD = 3;
  EventListener.MOUSE = 4;
  EventListener.ACCELERATION = 6;
  EventListener.CUSTOM = 8;
  EventListener.ListenerID = {
    MOUSE: '__cc_mouse',
    TOUCH_ONE_BY_ONE: '__cc_touch_one_by_one',
    TOUCH_ALL_AT_ONCE: '__cc_touch_all_at_once',
    KEYBOARD: '__cc_keyboard',
    ACCELERATION: '__cc_acceleration'
  };
  var ListenerID = EventListener.ListenerID;

  var Mouse = /*#__PURE__*/function (_EventListener) {
    _inherits(Mouse, _EventListener);

    function Mouse() {
      var _this;

      _classCallCheck(this, Mouse);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Mouse).call(this, EventListener.MOUSE, ListenerID.MOUSE, null));
      _this.onMouseDown = null;
      _this.onMouseUp = null;
      _this.onMouseMove = null;
      _this.onMouseScroll = null;

      _this._onEvent = function (event) {
        return _this._callback(event);
      };

      return _this;
    }

    _createClass(Mouse, [{
      key: "_callback",
      value: function _callback(event) {
        var eventType = _globalExports.legacyCC.Event.EventMouse;

        switch (event.eventType) {
          case eventType.DOWN:
            if (this.onMouseDown) {
              this.onMouseDown(event);
            }

            break;

          case eventType.UP:
            if (this.onMouseUp) {
              this.onMouseUp(event);
            }

            break;

          case eventType.MOVE:
            if (this.onMouseMove) {
              this.onMouseMove(event);
            }

            break;

          case eventType.SCROLL:
            if (this.onMouseScroll) {
              this.onMouseScroll(event);
            }

            break;

          default:
            break;
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var eventListener = new Mouse();
        eventListener.onMouseDown = this.onMouseDown;
        eventListener.onMouseUp = this.onMouseUp;
        eventListener.onMouseMove = this.onMouseMove;
        eventListener.onMouseScroll = this.onMouseScroll;
        return eventListener;
      }
    }, {
      key: "checkAvailable",
      value: function checkAvailable() {
        return true;
      }
    }]);

    return Mouse;
  }(EventListener);

  _exports.Mouse = Mouse;

  var TouchOneByOne = /*#__PURE__*/function (_EventListener2) {
    _inherits(TouchOneByOne, _EventListener2);

    function TouchOneByOne() {
      var _this2;

      _classCallCheck(this, TouchOneByOne);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TouchOneByOne).call(this, EventListener.TOUCH_ONE_BY_ONE, ListenerID.TOUCH_ONE_BY_ONE, null));
      _this2.swallowTouches = false;
      _this2.onTouchBegan = null;
      _this2.onTouchMoved = null;
      _this2.onTouchEnded = null;
      _this2.onTouchCancelled = null;
      _this2._claimedTouches = [];
      return _this2;
    }

    _createClass(TouchOneByOne, [{
      key: "setSwallowTouches",
      value: function setSwallowTouches(needSwallow) {
        this.swallowTouches = needSwallow;
      }
    }, {
      key: "isSwallowTouches",
      value: function isSwallowTouches() {
        return this.swallowTouches;
      }
    }, {
      key: "clone",
      value: function clone() {
        var eventListener = new TouchOneByOne();
        eventListener.onTouchBegan = this.onTouchBegan;
        eventListener.onTouchMoved = this.onTouchMoved;
        eventListener.onTouchEnded = this.onTouchEnded;
        eventListener.onTouchCancelled = this.onTouchCancelled;
        eventListener.swallowTouches = this.swallowTouches;
        return eventListener;
      }
    }, {
      key: "checkAvailable",
      value: function checkAvailable() {
        if (!this.onTouchBegan) {
          (0, _debug.logID)(1801);
          return false;
        }

        return true;
      }
    }]);

    return TouchOneByOne;
  }(EventListener);

  _exports.TouchOneByOne = TouchOneByOne;

  var TouchAllAtOnce = /*#__PURE__*/function (_EventListener3) {
    _inherits(TouchAllAtOnce, _EventListener3);

    function TouchAllAtOnce() {
      var _this3;

      _classCallCheck(this, TouchAllAtOnce);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(TouchAllAtOnce).call(this, EventListener.TOUCH_ALL_AT_ONCE, ListenerID.TOUCH_ALL_AT_ONCE, null));
      _this3.onTouchesBegan = null;
      _this3.onTouchesMoved = null;
      _this3.onTouchesEnded = null;
      _this3.onTouchesCancelled = null;
      return _this3;
    }

    _createClass(TouchAllAtOnce, [{
      key: "clone",
      value: function clone() {
        var eventListener = new TouchAllAtOnce();
        eventListener.onTouchesBegan = this.onTouchesBegan;
        eventListener.onTouchesMoved = this.onTouchesMoved;
        eventListener.onTouchesEnded = this.onTouchesEnded;
        eventListener.onTouchesCancelled = this.onTouchesCancelled;
        return eventListener;
      }
    }, {
      key: "checkAvailable",
      value: function checkAvailable() {
        if (this.onTouchesBegan === null && this.onTouchesMoved === null && this.onTouchesEnded === null && this.onTouchesCancelled === null) {
          (0, _debug.logID)(1802);
          return false;
        }

        return true;
      }
    }]);

    return TouchAllAtOnce;
  }(EventListener); // Acceleration


  _exports.TouchAllAtOnce = TouchAllAtOnce;

  var Acceleration = /*#__PURE__*/function (_EventListener4) {
    _inherits(Acceleration, _EventListener4);

    function Acceleration(callback) {
      var _this4;

      _classCallCheck(this, Acceleration);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Acceleration).call(this, EventListener.ACCELERATION, ListenerID.ACCELERATION, null));
      _this4._onAccelerationEvent = null;

      _this4._onEvent = function (event) {
        return _this4._callback(event);
      };

      _this4._onAccelerationEvent = callback;
      return _this4;
    }

    _createClass(Acceleration, [{
      key: "_callback",
      value: function _callback(event) {
        if (this._onAccelerationEvent) {
          this._onAccelerationEvent(event.acc, event);
        }
      }
    }, {
      key: "checkAvailable",
      value: function checkAvailable() {
        (0, _debug.assertID)(this._onAccelerationEvent, 1803);
        return true;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Acceleration(this._onAccelerationEvent);
      }
    }]);

    return Acceleration;
  }(EventListener); // Keyboard


  _exports.Acceleration = Acceleration;

  var Keyboard = /*#__PURE__*/function (_EventListener5) {
    _inherits(Keyboard, _EventListener5);

    function Keyboard() {
      var _this5;

      _classCallCheck(this, Keyboard);

      _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Keyboard).call(this, EventListener.KEYBOARD, ListenerID.KEYBOARD, null));
      _this5.onKeyPressed = null;
      _this5.onKeyReleased = null;

      _this5._onEvent = function (event) {
        return _this5._callback(event);
      };

      return _this5;
    }

    _createClass(Keyboard, [{
      key: "_callback",
      value: function _callback(event) {
        if (event.isPressed) {
          if (this.onKeyPressed) {
            this.onKeyPressed(event.keyCode, event);
          }
        } else {
          if (this.onKeyReleased) {
            this.onKeyReleased(event.keyCode, event);
          }
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var eventListener = new Keyboard();
        eventListener.onKeyPressed = this.onKeyPressed;
        eventListener.onKeyReleased = this.onKeyReleased;
        return eventListener;
      }
    }, {
      key: "checkAvailable",
      value: function checkAvailable() {
        if (this.onKeyPressed === null && this.onKeyReleased === null) {
          (0, _debug.logID)(1800);
          return false;
        }

        return true;
      }
    }]);

    return Keyboard;
  }(EventListener);

  _exports.Keyboard = Keyboard;
  _globalExports.legacyCC.EventListener = EventListener;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1saXN0ZW5lci50cyJdLCJuYW1lcyI6WyJFdmVudExpc3RlbmVyIiwiX29uRXZlbnQiLCJhcmdPYmoiLCJldmVudCIsImxpc3RlbmVyVHlwZSIsImxpc3RlbmVyIiwibGVnYWN5Q0MiLCJUT1VDSF9PTkVfQllfT05FIiwiVG91Y2hPbmVCeU9uZSIsIlRPVUNIX0FMTF9BVF9PTkNFIiwiVG91Y2hBbGxBdE9uY2UiLCJNT1VTRSIsIk1vdXNlIiwiS0VZQk9BUkQiLCJLZXlib2FyZCIsIkFDQ0VMRVJBVElPTiIsIkFjY2VsZXJhdGlvbiIsImNhbGxiYWNrIiwiT2JqZWN0Iiwia2V5cyIsImtleSIsInR5cGUiLCJsaXN0ZW5lcklEIiwib3duZXIiLCJtYXNrIiwiX3ByZXZpb3VzSW4iLCJfdGFyZ2V0IiwiX3R5cGUiLCJfbGlzdGVuZXJJRCIsIl9yZWdpc3RlcmVkIiwiX2ZpeGVkUHJpb3JpdHkiLCJfbm9kZSIsIl9wYXVzZWQiLCJfaXNFbmFibGVkIiwicGF1c2VkIiwicmVnaXN0ZXJlZCIsImZpeGVkUHJpb3JpdHkiLCJub2RlIiwiZW5hYmxlZCIsIlVOS05PV04iLCJDVVNUT00iLCJMaXN0ZW5lcklEIiwib25Nb3VzZURvd24iLCJvbk1vdXNlVXAiLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VTY3JvbGwiLCJfY2FsbGJhY2siLCJldmVudFR5cGUiLCJFdmVudCIsIkV2ZW50TW91c2UiLCJET1dOIiwiVVAiLCJNT1ZFIiwiU0NST0xMIiwiZXZlbnRMaXN0ZW5lciIsInN3YWxsb3dUb3VjaGVzIiwib25Ub3VjaEJlZ2FuIiwib25Ub3VjaE1vdmVkIiwib25Ub3VjaEVuZGVkIiwib25Ub3VjaENhbmNlbGxlZCIsIl9jbGFpbWVkVG91Y2hlcyIsIm5lZWRTd2FsbG93Iiwib25Ub3VjaGVzQmVnYW4iLCJvblRvdWNoZXNNb3ZlZCIsIm9uVG91Y2hlc0VuZGVkIiwib25Ub3VjaGVzQ2FuY2VsbGVkIiwiX29uQWNjZWxlcmF0aW9uRXZlbnQiLCJhY2MiLCJvbktleVByZXNzZWQiLCJvbktleVJlbGVhc2VkIiwiaXNQcmVzc2VkIiwia2V5Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Q0E7Ozs7Ozs7O01BUWFBLGE7OztBQXVIc0I7MEJBRVQ7QUFDbEIsZUFBTyxLQUFLQyxRQUFaO0FBQ0g7Ozs7QUExSEQ7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7O0FBY0E7Ozs7Ozs7OzZCQVFzQkMsTSxFQUFpRDtBQUNuRSw2QkFBU0EsTUFBTSxJQUFJQSxNQUFNLENBQUNDLEtBQTFCLEVBQWlDLElBQWpDO0FBRUEsWUFBTUMsWUFBWSxHQUFHRixNQUFNLENBQUNDLEtBQTVCO0FBQ0EsZUFBT0QsTUFBTSxDQUFDQyxLQUFkO0FBRUEsWUFBSUUsUUFBOEIsR0FBRyxJQUFyQzs7QUFDQSxZQUFJRCxZQUFZLEtBQUtFLHdCQUFTTixhQUFULENBQXVCTyxnQkFBNUMsRUFBOEQ7QUFDMURGLFVBQUFBLFFBQVEsR0FBRyxJQUFJRyxhQUFKLEVBQVg7QUFDSCxTQUZELE1BRU8sSUFBSUosWUFBWSxLQUFLRSx3QkFBU04sYUFBVCxDQUF1QlMsaUJBQTVDLEVBQStEO0FBQ2xFSixVQUFBQSxRQUFRLEdBQUcsSUFBSUssY0FBSixFQUFYO0FBQ0gsU0FGTSxNQUVBLElBQUlOLFlBQVksS0FBS0Usd0JBQVNOLGFBQVQsQ0FBdUJXLEtBQTVDLEVBQW1EO0FBQ3RETixVQUFBQSxRQUFRLEdBQUcsSUFBSU8sS0FBSixFQUFYO0FBQ0gsU0FGTSxNQUVBLElBQUlSLFlBQVksS0FBS0Usd0JBQVNOLGFBQVQsQ0FBdUJhLFFBQTVDLEVBQXNEO0FBQ3pEUixVQUFBQSxRQUFRLEdBQUcsSUFBSVMsUUFBSixFQUFYO0FBQ0gsU0FGTSxNQUVBLElBQUlWLFlBQVksS0FBS0Us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QUh3QixJQUd4QjtBQUFBLGFBRlJDLGFBRVEsR0FGeUIsSUFFekI7O0FBRVgsYUFBS3BFLFFBQUwsR0FBZ0IsVUFBQ0UsS0FBRDtBQUFBLGVBQWdCLE9BQUsyQyxTQUFMLENBQWUzQyxLQUFmLENBQWhCO0FBQUEsT0FBaEI7O0FBRlc7QUFHZDs7OztnQ0FFaUJBLEssRUFBc0I7QUFDcEMsWUFBSUEsS0FBSyxDQUFDbUUsU0FBVixFQUFxQjtBQUNqQixjQUFJLEtBQUtGLFlBQVQsRUFBdUI7QUFDbkIsaUJBQUtBLFlBQUwsQ0FBa0JqRSxLQUFLLENBQUNvRSxPQUF4QixFQUFpQ3BFLEtBQWpDO0FBQ0g7QUFDSixTQUpELE1BSU87QUFDSCxjQUFJLEtBQUtrRSxhQUFULEVBQXdCO0FBQ3BCLGlCQUFLQSxhQUFMLENBQW1CbEUsS0FBSyxDQUFDb0UsT0FBekIsRUFBa0NwRSxLQUFsQztBQUNIO0FBQ0o7QUFDSjs7OzhCQUVlO0FBQ1osWUFBTW1ELGFBQWEsR0FBRyxJQUFJeEMsUUFBSixFQUF0QjtBQUNBd0MsUUFBQUEsYUFBYSxDQUFDYyxZQUFkLEdBQTZCLEtBQUtBLFlBQWxDO0FBQ0FkLFFBQUFBLGFBQWEsQ0FBQ2UsYUFBZCxHQUE4QixLQUFLQSxhQUFuQztBQUNBLGVBQU9mLGFBQVA7QUFDSDs7O3VDQUV3QjtBQUNyQixZQUFJLEtBQUtjLFlBQUwsS0FBc0IsSUFBdEIsSUFBOEIsS0FBS0MsYUFBTCxLQUF1QixJQUF6RCxFQUErRDtBQUMzRCw0QkFBTSxJQUFOO0FBQ0EsaUJBQU8sS0FBUDtBQUNIOztBQUNELGVBQU8sSUFBUDtBQUNIOzs7O0lBbEN5QnJFLGE7OztBQXFDOUJNLDBCQUFTTixhQUFULEdBQXlCQSxhQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAyMCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRXZlbnRLZXlib2FyZCwgRXZlbnRBY2NlbGVyYXRpb24sIEV2ZW50TW91c2UgfSBmcm9tICcuL2V2ZW50cyc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBsb2dJRCwgYXNzZXJ0SUQgfSBmcm9tICcuLi9kZWJ1Zyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFdmVudExpc3RlbmVyQ3JlYXRlSW5mbyB7XHJcbiAgICBldmVudD86IG51bWJlcjtcclxuXHJcbiAgICBbeDogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElMaXN0ZW5lck1hc2sge1xyXG4gICAgaW5kZXg6IG51bWJlcjtcclxuICAgIG5vZGU6IE5vZGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIGJhc2UgY2xhc3Mgb2YgZXZlbnQgbGlzdGVuZXIuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cclxuICogSWYgeW91IG5lZWQgY3VzdG9tIGxpc3RlbmVyIHdoaWNoIHdpdGggZGlmZmVyZW50IGNhbGxiYWNrLCB5b3UgbmVlZCB0byBpbmhlcml0IHRoaXMgY2xhc3MuICAgICAgICAgICAgICAgPGJyLz5cclxuICogRm9yIGluc3RhbmNlLCB5b3UgY291bGQgcmVmZXIgdG8gRXZlbnRMaXN0ZW5lckFjY2VsZXJhdGlvbiwgRXZlbnRMaXN0ZW5lcktleWJvYXJkLCAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cclxuICogRXZlbnRMaXN0ZW5lclRvdWNoT25lQnlPbmUsIEV2ZW50TGlzdGVuZXJDdXN0b20uPGJyLz5cclxuICogQHpoIOWwgeijheeUqOaIt+eahOS6i+S7tuWkhOeQhumAu+i+kVxyXG4gKiDms6jmhI/vvJrov5nmmK/kuIDkuKrmir3osaHnsbvvvIzlvIDlj5HogIXkuI3lupTor6Xnm7TmjqXlrp7kvovljJbov5nkuKrnsbvvvIzor7flj4LogIMgW1tjcmVhdGVdXSDjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudExpc3RlbmVyIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0eXBlIGNvZGUgb2YgdW5rbm93biBldmVudCBsaXN0ZW5lci48YnIvPlxyXG4gICAgICogQHpoIOacquefpeeahOS6i+S7tuebkeWQrOWZqOexu+Wei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFVOS05PV04gPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0eXBlIGNvZGUgb2Ygb25lIGJ5IG9uZSB0b3VjaCBldmVudCBsaXN0ZW5lci48YnIvPlxyXG4gICAgICogQHpoIOinpuaRuOS6i+S7tuebkeWQrOWZqOexu+Wei++8jOinpueCueS8muS4gOS4quS4gOS4quW+l+WIhuW8gOiiq+a0vuWPkVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFRPVUNIX09ORV9CWV9PTkUgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0eXBlIGNvZGUgb2YgYWxsIGF0IG9uY2UgdG91Y2ggZXZlbnQgbGlzdGVuZXIuPGJyLz5cclxuICAgICAqIEB6aCDop6bmkbjkuovku7bnm5HlkKzlmajnsbvlnovvvIzop6bngrnkvJrooqvkuIDmrKHmgKflhajpg6jmtL7lj5FcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBUT1VDSF9BTExfQVRfT05DRSA9IDI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHR5cGUgY29kZSBvZiBrZXlib2FyZCBldmVudCBsaXN0ZW5lci48YnIvPlxyXG4gICAgICogQHpoIOmUruebmOS6i+S7tuebkeWQrOWZqOexu+Wei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEtFWUJPQVJEID0gMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdHlwZSBjb2RlIG9mIG1vdXNlIGV2ZW50IGxpc3RlbmVyLjxici8+XHJcbiAgICAgKiBAemgg6byg5qCH5LqL5Lu255uR5ZCs5Zmo57G75Z6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTU9VU0UgPSA0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0eXBlIGNvZGUgb2YgYWNjZWxlcmF0aW9uIGV2ZW50IGxpc3RlbmVyLjxici8+XHJcbiAgICAgKiBAemgg5Yqg6YCf5Zmo5LqL5Lu255uR5ZCs5Zmo57G75Z6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgQUNDRUxFUkFUSU9OID0gNjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdHlwZSBjb2RlIG9mIGN1c3RvbSBldmVudCBsaXN0ZW5lci48YnIvPlxyXG4gICAgICogQHpoIOiHquWumuS5ieS6i+S7tuebkeWQrOWZqOexu+Wei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIENVU1RPTSA9IDg7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBMaXN0ZW5lcklEID0ge1xyXG4gICAgICAgIE1PVVNFOiAnX19jY19tb3VzZScsXHJcbiAgICAgICAgVE9VQ0hfT05FX0JZX09ORTogJ19fY2NfdG91Y2hfb25lX2J5X29uZScsXHJcbiAgICAgICAgVE9VQ0hfQUxMX0FUX09OQ0U6ICdfX2NjX3RvdWNoX2FsbF9hdF9vbmNlJyxcclxuICAgICAgICBLRVlCT0FSRDogJ19fY2Nfa2V5Ym9hcmQnLFxyXG4gICAgICAgIEFDQ0VMRVJBVElPTjogJ19fY2NfYWNjZWxlcmF0aW9uJyxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ3JlYXRlIGEgRXZlbnRMaXN0ZW5lciBvYmplY3Qgd2l0aCBjb25maWd1cmF0aW9uIGluY2x1ZGluZyB0aGUgZXZlbnQgdHlwZSwgaGFuZGxlcnMgYW5kIG90aGVyIHBhcmFtZXRlcnMuPGJyLz5cclxuICAgICAqIEluIGhhbmRsZXJzLCB0aGlzIHJlZmVyIHRvIHRoZSBldmVudCBsaXN0ZW5lciBvYmplY3QgaXRzZWxmLjxici8+XHJcbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBjdXN0b20gcGFyYW1ldGVycyBpbiB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QsPGJyLz5cclxuICAgICAqIGFsbCBjdXN0b20gcGFyYW1ldGVycyB3aWxsIGJlIHBvbHlmaWxsZWQgaW50byB0aGUgZXZlbnQgbGlzdGVuZXIgb2JqZWN0IGFuZCBjYW4gYmUgYWNjZXNzZWQgaW4gaGFuZGxlcnMuPGJyLz5cclxuICAgICAqIEB6aCDpgJrov4fmjIflrprkuI3lkIznmoQgRXZlbnQg5a+56LGh5p2l6K6+572u5oOz6KaB5Yib5bu655qE5LqL5Lu255uR5ZCs5Zmo44CCXHJcbiAgICAgKiBAcGFyYW0gYXJnT2JqIGEganNvbiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKGFyZ09iajogSUV2ZW50TGlzdGVuZXJDcmVhdGVJbmZvKTogRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAgICAgYXNzZXJ0SUQoYXJnT2JqICYmIGFyZ09iai5ldmVudCwgMTkwMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyVHlwZSA9IGFyZ09iai5ldmVudDtcclxuICAgICAgICBkZWxldGUgYXJnT2JqLmV2ZW50O1xyXG5cclxuICAgICAgICBsZXQgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBpZiAobGlzdGVuZXJUeXBlID09PSBsZWdhY3lDQy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUpIHtcclxuICAgICAgICAgICAgbGlzdGVuZXIgPSBuZXcgVG91Y2hPbmVCeU9uZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBsZWdhY3lDQy5FdmVudExpc3RlbmVyLlRPVUNIX0FMTF9BVF9PTkNFKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyID0gbmV3IFRvdWNoQWxsQXRPbmNlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lclR5cGUgPT09IGxlZ2FjeUNDLkV2ZW50TGlzdGVuZXIuTU9VU0UpIHtcclxuICAgICAgICAgICAgbGlzdGVuZXIgPSBuZXcgTW91c2UoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gbGVnYWN5Q0MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCkge1xyXG4gICAgICAgICAgICBsaXN0ZW5lciA9IG5ldyBLZXlib2FyZCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBsZWdhY3lDQy5FdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTikge1xyXG4gICAgICAgICAgICBsaXN0ZW5lciA9IG5ldyBBY2NlbGVyYXRpb24oYXJnT2JqLmNhbGxiYWNrKTtcclxuICAgICAgICAgICAgZGVsZXRlIGFyZ09iai5jYWxsYmFjaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhcmdPYmopKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcltrZXldID0gYXJnT2JqW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaXN0ZW5lciE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGFjazogSG93IHRvIHNvbHZlIHRoZSBwcm9ibGVtIG9mIHVuY2VydGFpbiBhdHRyaWJ1dGVcclxuICAgIC8vIGNhbGxiYWNrJ3MgdGhpcyBvYmplY3RcclxuICAgIHB1YmxpYyBvd25lcjogT2JqZWN0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbWFzazogSUxpc3RlbmVyTWFzayB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIF9wcmV2aW91c0luPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBfdGFyZ2V0OiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8vIEV2ZW50IGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICBwcm90ZWN0ZWQgX29uRXZlbnQ6ICgoLi4uYXJnczogYW55W10pID0+IGFueSkgfCBudWxsO1xyXG5cclxuICAgIC8vIEV2ZW50IGxpc3RlbmVyIHR5cGVcclxuICAgIHByaXZhdGUgX3R5cGU6IG51bWJlcjtcclxuXHJcbiAgICAvLyBFdmVudCBsaXN0ZW5lciBJRFxyXG4gICAgcHJpdmF0ZSBfbGlzdGVuZXJJRDogc3RyaW5nO1xyXG5cclxuICAgIC8vIFdoZXRoZXIgdGhlIGxpc3RlbmVyIGhhcyBiZWVuIGFkZGVkIHRvIGRpc3BhdGNoZXIuXHJcbiAgICBwcml2YXRlIF9yZWdpc3RlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgLy8gVGhlIGhpZ2hlciB0aGUgbnVtYmVyLCB0aGUgaGlnaGVyIHRoZSBwcmlvcml0eSwgMCBpcyBmb3Igc2NlbmUgZ3JhcGggYmFzZSBwcmlvcml0eS5cclxuICAgIHByaXZhdGUgX2ZpeGVkUHJpb3JpdHkgPSAwO1xyXG5cclxuICAgIC8vIHNjZW5lIGdyYXBoIGJhc2VkIHByaW9yaXR5XHJcbiAgICAvLyBAdHlwZSB7Tm9kZX1cclxuICAgIHByaXZhdGUgX25vZGU6IGFueSA9IG51bGw7ICAgICAgICAgIC8vIHNjZW5lIGdyYXBoIGJhc2VkIHByaW9yaXR5XHJcblxyXG4gICAgLy8gV2hldGhlciB0aGUgbGlzdGVuZXIgaXMgcGF1c2VkXHJcbiAgICBwcml2YXRlIF9wYXVzZWQgPSB0cnVlOyAgICAgICAgLy8gV2hldGhlciB0aGUgbGlzdGVuZXIgaXMgcGF1c2VkXHJcblxyXG4gICAgLy8gV2hldGhlciB0aGUgbGlzdGVuZXIgaXMgZW5hYmxlZFxyXG4gICAgcHJpdmF0ZSBfaXNFbmFibGVkID0gdHJ1ZTsgICAgIC8vIFdoZXRoZXIgdGhlIGxpc3RlbmVyIGlzIGVuYWJsZWRcclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uRXZlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vbkV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICh0eXBlOiBudW1iZXIsIGxpc3RlbmVySUQ6IHN0cmluZywgY2FsbGJhY2s6ICgoLi4uYXJnczogYW55W10pID0+IGFueSkgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fb25FdmVudCA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlIHx8IDA7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJJRCA9IGxpc3RlbmVySUQgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIDxwPjxici8+XHJcbiAgICAgKiAgICAgU2V0cyBwYXVzZWQgc3RhdGUgZm9yIHRoZSBsaXN0ZW5lcjxici8+XHJcbiAgICAgKiAgICAgVGhlIHBhdXNlZCBzdGF0ZSBpcyBvbmx5IHVzZWQgZm9yIHNjZW5lIGdyYXBoIHByaW9yaXR5IGxpc3RlbmVycy48YnIvPlxyXG4gICAgICogICAgIGBFdmVudERpc3BhdGNoZXIucmVzdW1lQWxsRXZlbnRMaXN0ZW5lcnNGb3JUYXJnZXQobm9kZSlgIHdpbGwgc2V0IHRoZSBwYXVzZWQgc3RhdGUgdG8gYHRydWVgLDxici8+XHJcbiAgICAgKiAgICAgd2hpbGUgYEV2ZW50RGlzcGF0Y2hlci5wYXVzZUFsbEV2ZW50TGlzdGVuZXJzRm9yVGFyZ2V0KG5vZGUpYCB3aWxsIHNldCBpdCB0byBgZmFsc2VgLjxici8+XHJcbiAgICAgKiAgICAgQG5vdGUgMSkgRml4ZWQgcHJpb3JpdHkgbGlzdGVuZXJzIHdpbGwgbmV2ZXIgZ2V0IHBhdXNlZC4gSWYgYSBmaXhlZCBwcmlvcml0eSBkb2Vzbid0IHdhbnQgdG8gcmVjZWl2ZSBldmVudHMsPGJyLz5cclxuICAgICAqICAgICAgICAgICAgICBjYWxsIGBzZXRFbmFibGVkKGZhbHNlKWAgaW5zdGVhZC48YnIvPlxyXG4gICAgICogICAgICAgICAgICAyKSBJbiBgTm9kZWAncyBvbkVudGVyIGFuZCBvbkV4aXQsIHRoZSBgcGF1c2VkIHN0YXRlYCBvZiB0aGUgbGlzdGVuZXJzPGJyLz5cclxuICAgICAqICAgICAgICAgICAgICB3aGljaCBhc3NvY2lhdGVkIHdpdGggdGhhdCBub2RlIHdpbGwgYmUgYXV0b21hdGljYWxseSB1cGRhdGVkLjxici8+XHJcbiAgICAgKiA8L3A+PGJyLz5cclxuICAgICAqIEB6aFxyXG4gICAgICogKuS4uuS+puWQrOWZqOiuvue9ruaaguWBnOeKtuaAgTxici8+XHJcbiAgICAgKiDmmoLlgZznirbmgIHku4XnlKjkuo7lnLrmma/lm77kvJjlhYjnuqfkvqblkKzlmajjgII8YnIvPlxyXG4gICAgICogYEV2ZW50RGlzcGF0Y2hlciA6OiByZXN1bWVBbGxFdmVudExpc3RlbmVyc0ZvclRhcmdldO+8iG5vZGXvvIlg5bCG5pqC5YGc54q25oCB6K6+572u5Li6YHRydWVg77yMPGJyLz5cclxuICAgICAqIOiAjGBFdmVudERpc3BhdGNoZXIgOjogcGF1c2VBbGxFdmVudExpc3RlbmVyc0ZvclRhcmdldO+8iG5vZGXvvIlg5bCG5a6D6K6+572u5Li6YGZhbHNlYOOAgjxici8+XHJcbiAgICAgKiDms6jmhI/vvJo8YnIvPlxyXG4gICAgICogLSDlm7rlrprkvJjlhYjnuqfkvqblkKzlmajmsLjov5zkuI3kvJrooqvmmoLlgZzjgIIg5aaC5p6c5Zu65a6a5LyY5YWI57qn5LiN5oOz5o6l5pS25LqL5Lu277yM5pS55Li66LCD55SoYHNldEVuYWJsZWTvvIhmYWxzZe+8iWDjgII8YnIvPlxyXG4gICAgICogLSDlnKjigJxOb2Rl4oCd55qEb25FbnRlcuWSjG9uRXhpdOS4re+8jOebkeWQrOWZqOeahOKAnOaaguWBnOeKtuaAgeKAneS4juivpeiKgueCueWFs+iBlOeahCrlsIboh6rliqjmm7TmlrDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9zZXRQYXVzZWQgKHBhdXNlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IHBhdXNlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDaGVja3Mgd2hldGhlciB0aGUgbGlzdGVuZXIgaXMgcGF1c2VkLjxici8+XHJcbiAgICAgKiBAemgg5qOA5p+l5L6m5ZCs5Zmo5piv5ZCm5bey5pqC5YGc44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfaXNQYXVzZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXVzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWFya3MgdGhlIGxpc3RlbmVyIHdhcyByZWdpc3RlcmVkIGJ5IEV2ZW50RGlzcGF0Y2hlci48YnIvPlxyXG4gICAgICogQHpoIOagh+iusOebkeWQrOWZqOW3sueUsSBFdmVudERpc3BhdGNoZXIg5rOo5YaM44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfc2V0UmVnaXN0ZXJlZCAocmVnaXN0ZXJlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyZWQgPSByZWdpc3RlcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0ZW5lciB3YXMgcmVnaXN0ZXJlZCBieSBFdmVudERpc3BhdGNoZXI8YnIvPlxyXG4gICAgICogQHpoIOajgOafpeebkeWQrOWZqOaYr+WQpuW3sueUsSBFdmVudERpc3BhdGNoZXIg5rOo5YaM44CCXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2lzUmVnaXN0ZXJlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0cyB0aGUgdHlwZSBvZiB0aGlzIGxpc3RlbmVyPGJyLz5cclxuICAgICAqIG5vdGXvvJogSXQncyBkaWZmZXJlbnQgZnJvbSBgRXZlbnRUeXBlYCwgZS5nLjxici8+XHJcbiAgICAgKiBUb3VjaEV2ZW50IGhhcyB0d28ga2luZHMgb2YgZXZlbnQgbGlzdGVuZXJzIC0gRXZlbnRMaXN0ZW5lck9uZUJ5T25lLCBFdmVudExpc3RlbmVyQWxsQXRPbmNlPGJyLz5cclxuICAgICAqIEB6aCDojrflj5bmraTkvqblkKzlmajnmoTnsbvlnos8YnIvPlxyXG7CoMKgwqDCoMKgKiDms6jmhI/vvJrlroPkuI5gRXZlbnRUeXBlYOS4jeWQjO+8jOS+i+Wmgjxici8+XHJcbsKgwqDCoMKgwqAqIFRvdWNoRXZlbnQg5pyJ5Lik56eN5LqL5Lu255uR5ZCs5ZmoIC0gIEV2ZW50TGlzdGVuZXJPbmVCeU9uZe+8jEV2ZW50TGlzdGVuZXJBbGxBdE9uY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9nZXRUeXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXRzIHRoZSBsaXN0ZW5lciBJRCBvZiB0aGlzIGxpc3RlbmVyPGJyLz5cclxuICAgICAqIFdoZW4gZXZlbnQgaXMgYmVpbmcgZGlzcGF0Y2hlZCwgbGlzdGVuZXIgSUQgaXMgdXNlZCBhcyBrZXkgZm9yIHNlYXJjaGluZyBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIGV2ZW50IHR5cGUuPGJyLz5cclxuICAgICAqIEB6aCDojrflj5bmraTkvqblkKzlmajnmoTkvqblkKzlmaggSUTjgII8YnIvPlxyXG4gICAgICog6LCD5bqm5LqL5Lu25pe277yM5L6m5ZCs5ZmoIElEIOeUqOS9nOagueaNruS6i+S7tuexu+Wei+aQnOe0ouS+puWQrOWZqOeahOmUruOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2dldExpc3RlbmVySUQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcklEO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldHMgdGhlIGZpeGVkIHByaW9yaXR5IGZvciB0aGlzIGxpc3RlbmVyPGJyLz5cclxuICAgICAqIG5vdGU6IFRoaXMgbWV0aG9kIGlzIG9ubHkgdXNlZCBmb3IgYGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyc2AsPGJyLz5cclxuICAgICAqICAgaXQgbmVlZHMgdG8gYWNjZXNzIGEgbm9uLXplcm8gdmFsdWUuIDAgaXMgcmVzZXJ2ZWQgZm9yIHNjZW5lIGdyYXBoIHByaW9yaXR5IGxpc3RlbmVyczxici8+XHJcbiAgICAgKiBAemgg6K6+572u5q2k5L6m5ZCs5Zmo55qE5Zu65a6a5LyY5YWI57qn44CCPGJyLz5cclxuICAgICAqIOazqOaEj++8muatpOaWueazleS7heeUqOS6juKAnOWbuuWumuS8mOWFiOe6p+S+puWQrOWZqOKAne+8jDxici8+XHJcbiAgICAgKiDlroPpnIDopoHorr/pl67pnZ7pm7blgLzjgIIgMOS/neeVmee7meWcuuaZr+WbvuS8mOWFiOe6p+S+puWQrOWZqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX3NldEZpeGVkUHJpb3JpdHkgKGZpeGVkUHJpb3JpdHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZpeGVkUHJpb3JpdHkgPSBmaXhlZFByaW9yaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldHMgdGhlIGZpeGVkIHByaW9yaXR5IG9mIHRoaXMgbGlzdGVuZXI8YnIvPlxyXG4gICAgICogQHpoIOiOt+WPluatpOS+puWQrOWZqOeahOWbuuWumuS8mOWFiOe6p+OAglxyXG4gICAgICogQHJldHVybiDlpoLmnpzlroPmmK/lnLrmma/lm77kvJjlhYjnuqfkvqblkKzlmajliJnov5Tlm54gMCDvvIzliJnlr7nkuo7lm7rlrprkvJjlhYjnuqfkvqblkKzlmajliJnkuI3kuLrpm7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9nZXRGaXhlZFByaW9yaXR5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRQcmlvcml0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHNjZW5lIGdyYXBoIHByaW9yaXR5IGZvciB0aGlzIGxpc3RlbmVyPGJyLz5cclxuICAgICAqIEB6aCDorr7nva7mraTkvqblkKzlmajnmoTlnLrmma/lm77kvJjlhYjnuqfjgIJcclxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX3NldFNjZW5lR3JhcGhQcmlvcml0eSAobm9kZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gbm9kZTtcclxuICAgICAgICB0aGlzLl9ub2RlID0gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXRzIHNjZW5lIGdyYXBoIHByaW9yaXR5IG9mIHRoaXMgbGlzdGVuZXI8YnIvPlxyXG4gICAgICogQHpoIOiOt+WPluatpOS+puWQrOWZqOeahOWcuuaZr+WbvuS8mOWFiOe6p+OAglxyXG4gICAgICogQHJldHVybiDlpoLmnpzlroPmmK/lm7rlrprkvJjlhYjnuqfkvqblkKzlmajvvIzliJnkuLrlnLrmma/lm77kvJjlhYjnuqfkvqblkKzlmajpnZ4gbnVsbCDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9nZXRTY2VuZUdyYXBoUHJpb3JpdHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0ZW5lciBpcyBhdmFpbGFibGUuPGJyLz5cclxuICAgICAqIEB6aCDmo4DmtYvnm5HlkKzlmajmmK/lkKbmnInmlYhcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNoZWNrQXZhaWxhYmxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25FdmVudCAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDbG9uZXMgdGhlIGxpc3RlbmVyLCBpdHMgc3ViY2xhc3NlcyBoYXZlIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLjxici8+XHJcbiAgICAgKiBAemgg5YWL6ZqG55uR5ZCs5ZmoLOWug+eahOWtkOexu+W/hemhu+mHjeWGmeatpOaWueazleOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xvbmUgKCk6IEV2ZW50TGlzdGVuZXIgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRW5hYmxlcyBvciBkaXNhYmxlcyB0aGUgbGlzdGVuZXI8YnIvPlxyXG4gICAgICogbm90ZTogT25seSBsaXN0ZW5lcnMgd2l0aCBgZW5hYmxlZGAgc3RhdGUgd2lsbCBiZSBhYmxlIHRvIHJlY2VpdmUgZXZlbnRzLjxici8+XHJcbiAgICAgKiBXaGVuIGFuIGxpc3RlbmVyIHdhcyBpbml0aWFsaXplZCwgaXQncyBlbmFibGVkIGJ5IGRlZmF1bHQuPGJyLz5cclxuICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbiByZWNlaXZlIGV2ZW50cyB3aGVuIGl0IGlzIGVuYWJsZWQgYW5kIGlzIG5vdCBwYXVzZWQuPGJyLz5cclxuICAgICAqIHBhdXNlZCBzdGF0ZSBpcyBhbHdheXMgZmFsc2Ugd2hlbiBpdCBpcyBhIGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyLjxici8+XHJcbiAgICAgKiBAemhcclxuICAgICAqIOWQr+eUqOaIluemgeeUqOebkeWQrOWZqOOAgjxici8+XHJcbiAgICAgKiDms6jmhI/vvJrlj6rmnInlpITkuo7igJzlkK/nlKjigJ3nirbmgIHnmoTkvqblkKzlmajmiY3og73mjqXmlLbkuovku7bjgII8YnIvPlxyXG7CoMKgwqDCoMKgKiDliJ3lp4vljJbkvqblkKzlmajml7bvvIzpu5jorqTmg4XlhrXkuIvlkK/nlKjlroPjgII8YnIvPlxyXG7CoMKgwqDCoMKgKiDkuovku7bkvqblkKzlmajlj6/ku6XlnKjlkK/nlKjkuJTmnKrmmoLlgZzml7bmjqXmlLbkuovku7bjgII8YnIvPlxyXG7CoMKgwqDCoMKgKiDlvZPlm7rlrprkvJjlhYjnuqfkvqblkKzlmajml7bvvIzmmoLlgZznirbmgIHlp4vnu4jkuLpmYWxzZeOAgjxici8+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRFbmFibGVkIChlbmFibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNFbmFibGVkID0gZW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDaGVja3Mgd2hldGhlciB0aGUgbGlzdGVuZXIgaXMgZW5hYmxlZDxici8+XHJcbiAgICAgKiBAemgg5qOA5p+l55uR5ZCs5Zmo5piv5ZCm5Y+v55So44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0VuYWJsZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0VuYWJsZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IExpc3RlbmVySUQgPSBFdmVudExpc3RlbmVyLkxpc3RlbmVySUQ7XHJcblxyXG5leHBvcnQgY2xhc3MgTW91c2UgZXh0ZW5kcyBFdmVudExpc3RlbmVyIHtcclxuICAgIHB1YmxpYyBvbk1vdXNlRG93bjogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBvbk1vdXNlVXA6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25Nb3VzZU1vdmU6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25Nb3VzZVNjcm9sbDogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRXZlbnRMaXN0ZW5lci5NT1VTRSwgTGlzdGVuZXJJRC5NT1VTRSwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5fb25FdmVudCA9IChldmVudDogYW55KSA9PiB0aGlzLl9jYWxsYmFjayhldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9jYWxsYmFjayAoZXZlbnQ6IEV2ZW50TW91c2UpIHtcclxuICAgICAgICBjb25zdCBldmVudFR5cGUgPSBsZWdhY3lDQy5FdmVudC5FdmVudE1vdXNlO1xyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZXZlbnRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgZXZlbnRUeXBlLkRPV046XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbk1vdXNlRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZURvd24oZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgZXZlbnRUeXBlLlVQOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25Nb3VzZVVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlVXAoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgZXZlbnRUeXBlLk1PVkU6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbk1vdXNlTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgZXZlbnRUeXBlLlNDUk9MTDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTW91c2VTY3JvbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VTY3JvbGwoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lICgpIHtcclxuICAgICAgICBjb25zdCBldmVudExpc3RlbmVyID0gbmV3IE1vdXNlKCk7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vbk1vdXNlRG93biA9IHRoaXMub25Nb3VzZURvd247XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vbk1vdXNlVXAgPSB0aGlzLm9uTW91c2VVcDtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uTW91c2VNb3ZlID0gdGhpcy5vbk1vdXNlTW92ZTtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uTW91c2VTY3JvbGwgPSB0aGlzLm9uTW91c2VTY3JvbGw7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50TGlzdGVuZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoZWNrQXZhaWxhYmxlICgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRvdWNoT25lQnlPbmUgZXh0ZW5kcyBFdmVudExpc3RlbmVyIHtcclxuICAgIHB1YmxpYyBzd2FsbG93VG91Y2hlcyA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9uVG91Y2hCZWdhbjogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBvblRvdWNoTW92ZWQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25Ub3VjaEVuZGVkOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9uVG91Y2hDYW5jZWxsZWQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIF9jbGFpbWVkVG91Y2hlczogYW55W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLCBMaXN0ZW5lcklELlRPVUNIX09ORV9CWV9PTkUsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTd2FsbG93VG91Y2hlcyAobmVlZFN3YWxsb3cpIHtcclxuICAgICAgICB0aGlzLnN3YWxsb3dUb3VjaGVzID0gbmVlZFN3YWxsb3c7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzU3dhbGxvd1RvdWNoZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN3YWxsb3dUb3VjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRMaXN0ZW5lciA9IG5ldyBUb3VjaE9uZUJ5T25lKCk7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vblRvdWNoQmVnYW4gPSB0aGlzLm9uVG91Y2hCZWdhbjtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hNb3ZlZCA9IHRoaXMub25Ub3VjaE1vdmVkO1xyXG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaEVuZGVkID0gdGhpcy5vblRvdWNoRW5kZWQ7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vblRvdWNoQ2FuY2VsbGVkID0gdGhpcy5vblRvdWNoQ2FuY2VsbGVkO1xyXG4gICAgICAgIGV2ZW50TGlzdGVuZXIuc3dhbGxvd1RvdWNoZXMgPSB0aGlzLnN3YWxsb3dUb3VjaGVzO1xyXG4gICAgICAgIHJldHVybiBldmVudExpc3RlbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGVja0F2YWlsYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9uVG91Y2hCZWdhbikge1xyXG4gICAgICAgICAgICBsb2dJRCgxODAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRvdWNoQWxsQXRPbmNlIGV4dGVuZHMgRXZlbnRMaXN0ZW5lciB7XHJcbiAgICBwdWJsaWMgb25Ub3VjaGVzQmVnYW46IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25Ub3VjaGVzTW92ZWQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25Ub3VjaGVzRW5kZWQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25Ub3VjaGVzQ2FuY2VsbGVkOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihFdmVudExpc3RlbmVyLlRPVUNIX0FMTF9BVF9PTkNFLCBMaXN0ZW5lcklELlRPVUNIX0FMTF9BVF9PTkNFLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUgKCkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXIgPSBuZXcgVG91Y2hBbGxBdE9uY2UoKTtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hlc0JlZ2FuID0gdGhpcy5vblRvdWNoZXNCZWdhbjtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hlc01vdmVkID0gdGhpcy5vblRvdWNoZXNNb3ZlZDtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hlc0VuZGVkID0gdGhpcy5vblRvdWNoZXNFbmRlZDtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hlc0NhbmNlbGxlZCA9IHRoaXMub25Ub3VjaGVzQ2FuY2VsbGVkO1xyXG4gICAgICAgIHJldHVybiBldmVudExpc3RlbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGVja0F2YWlsYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub25Ub3VjaGVzQmVnYW4gPT09IG51bGwgJiYgdGhpcy5vblRvdWNoZXNNb3ZlZCA9PT0gbnVsbFxyXG4gICAgICAgICAgICAmJiB0aGlzLm9uVG91Y2hlc0VuZGVkID09PSBudWxsICYmIHRoaXMub25Ub3VjaGVzQ2FuY2VsbGVkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxvZ0lEKDE4MDIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBBY2NlbGVyYXRpb25cclxuZXhwb3J0IGNsYXNzIEFjY2VsZXJhdGlvbiBleHRlbmRzIEV2ZW50TGlzdGVuZXIge1xyXG4gICAgcHVibGljIF9vbkFjY2VsZXJhdGlvbkV2ZW50OiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjYWxsYmFjazogRnVuY3Rpb24gfCBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04sIExpc3RlbmVySUQuQUNDRUxFUkFUSU9OLCBudWxsKTtcclxuICAgICAgICB0aGlzLl9vbkV2ZW50ID0gKGV2ZW50OiBhbnkpID0+IHRoaXMuX2NhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgICB0aGlzLl9vbkFjY2VsZXJhdGlvbkV2ZW50ID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9jYWxsYmFjayAoZXZlbnQ6IEV2ZW50QWNjZWxlcmF0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX29uQWNjZWxlcmF0aW9uRXZlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25BY2NlbGVyYXRpb25FdmVudChldmVudC5hY2MsIGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoZWNrQXZhaWxhYmxlICgpIHtcclxuICAgICAgICBhc3NlcnRJRCh0aGlzLl9vbkFjY2VsZXJhdGlvbkV2ZW50LCAxODAzKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQWNjZWxlcmF0aW9uKHRoaXMuX29uQWNjZWxlcmF0aW9uRXZlbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBLZXlib2FyZFxyXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmQgZXh0ZW5kcyBFdmVudExpc3RlbmVyIHtcclxuICAgIHB1YmxpYyBvbktleVByZXNzZWQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25LZXlSZWxlYXNlZDogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCwgTGlzdGVuZXJJRC5LRVlCT0FSRCwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5fb25FdmVudCA9IChldmVudDogYW55KSA9PiB0aGlzLl9jYWxsYmFjayhldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9jYWxsYmFjayAoZXZlbnQ6IEV2ZW50S2V5Ym9hcmQpIHtcclxuICAgICAgICBpZiAoZXZlbnQuaXNQcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uS2V5UHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbktleVByZXNzZWQoZXZlbnQua2V5Q29kZSwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25LZXlSZWxlYXNlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbktleVJlbGVhc2VkKGV2ZW50LmtleUNvZGUsIGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvbmUgKCkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50TGlzdGVuZXIgPSBuZXcgS2V5Ym9hcmQoKTtcclxuICAgICAgICBldmVudExpc3RlbmVyLm9uS2V5UHJlc3NlZCA9IHRoaXMub25LZXlQcmVzc2VkO1xyXG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25LZXlSZWxlYXNlZCA9IHRoaXMub25LZXlSZWxlYXNlZDtcclxuICAgICAgICByZXR1cm4gZXZlbnRMaXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hlY2tBdmFpbGFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uS2V5UHJlc3NlZCA9PT0gbnVsbCAmJiB0aGlzLm9uS2V5UmVsZWFzZWQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgbG9nSUQoMTgwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLkV2ZW50TGlzdGVuZXIgPSBFdmVudExpc3RlbmVyO1xyXG4iXX0=