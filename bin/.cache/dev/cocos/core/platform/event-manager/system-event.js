(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../event/event-target.js", "./event-enum.js", "./event-listener.js", "./event-manager.js", "./input-manager.js", "../../default-constants.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../event/event-target.js"), require("./event-enum.js"), require("./event-listener.js"), require("./event-manager.js"), require("./input-manager.js"), require("../../default-constants.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.eventTarget, global.eventEnum, global.eventListener, global.eventManager, global.inputManager, global.defaultConstants, global.globalExports);
    global.systemEvent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _eventTarget, _eventEnum, _eventListener, _eventManager, _inputManager, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.systemEvent = _exports.SystemEvent = void 0;
  _eventManager = _interopRequireDefault(_eventManager);
  _inputManager = _interopRequireDefault(_inputManager);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var keyboardListener = null;
  var accelerationListener = null;
  var touchListener = null;
  var mouseListener = null;
  /**
  * @en
  * The System event, it currently supports keyboard events and accelerometer events.<br/>
  * You can get the `SystemEvent` instance with `systemEvent`.<br/>
  * @zh
  * 系统事件，它目前支持按键事件和重力感应事件。<br/>
  * 你可以通过 `systemEvent` 获取到 `SystemEvent` 的实例。<br/>
  * @example
  * ```
  * import { systemEvent, SystemEvent } from 'cc';
  * systemEvent.on(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
  * systemEvent.off(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
  * ```
  */

  var SystemEvent = /*#__PURE__*/function (_EventTarget) {
    _inherits(SystemEvent, _EventTarget);

    function SystemEvent() {
      _classCallCheck(this, SystemEvent);

      return _possibleConstructorReturn(this, _getPrototypeOf(SystemEvent).call(this));
    }
    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */


    _createClass(SystemEvent, [{
      key: "setAccelerometerEnabled",
      value: function setAccelerometerEnabled(isEnabled) {
        if (_defaultConstants.EDITOR) {
          return;
        } // for iOS 13+


        if (isEnabled && window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
          DeviceMotionEvent.requestPermission().then(function (response) {
            console.log("Device Motion Event request permission: ".concat(response));

            _inputManager.default.setAccelerometerEnabled(response === 'granted');
          });
        } else {
          _inputManager.default.setAccelerometerEnabled(isEnabled);
        }
      }
      /**
       * @en
       * Sets the accelerometer interval value.
       *
       * @zh
       * 设置加速度计间隔值。
       */

    }, {
      key: "setAccelerometerInterval",
      value: function setAccelerometerInterval(interval) {
        if (_defaultConstants.EDITOR) {
          return;
        }

        _inputManager.default.setAccelerometerInterval(interval);
      }
    }, {
      key: "on",

      /**
       * @en
       * Register an callback of a specific system event type.
       * @zh
       * 注册特定事件类型回调。
       *
       * @param type - The event type
       * @param callback - The event listener's callback
       * @param target - The event listener's target and callee
       */
      value: function on(type, callback, target, once) {
        if (_defaultConstants.EDITOR && !_globalExports.legacyCC.GAME_VIEW) {
          return;
        }

        _get(_getPrototypeOf(SystemEvent.prototype), "on", this).call(this, type, callback, target, once); // Keyboard


        if (type === _eventEnum.SystemEventType.KEY_DOWN || type === _eventEnum.SystemEventType.KEY_UP) {
          if (!keyboardListener) {
            keyboardListener = _eventListener.EventListener.create({
              event: _eventListener.EventListener.KEYBOARD,
              onKeyPressed: function onKeyPressed(keyCode, event) {
                event.type = _eventEnum.SystemEventType.KEY_DOWN;
                systemEvent.emit(event.type, event);
              },
              onKeyReleased: function onKeyReleased(keyCode, event) {
                event.type = _eventEnum.SystemEventType.KEY_UP;
                systemEvent.emit(event.type, event);
              }
            });

            _eventManager.default.addListener(keyboardListener, 256);
          }
        } // Acceleration


        if (type === _eventEnum.SystemEventType.DEVICEMOTION) {
          if (!accelerationListener) {
            accelerationListener = _eventListener.EventListener.create({
              event: _eventListener.EventListener.ACCELERATION,
              callback: function callback(acc, event) {
                event.type = _eventEnum.SystemEventType.DEVICEMOTION;

                _globalExports.legacyCC.systemEvent.emit(event.type, event);
              }
            });

            _eventManager.default.addListener(accelerationListener, 256);
          }
        } // touch


        if (type === _eventEnum.SystemEventType.TOUCH_START || type === _eventEnum.SystemEventType.TOUCH_MOVE || type === _eventEnum.SystemEventType.TOUCH_END || type === _eventEnum.SystemEventType.TOUCH_CANCEL) {
          if (!touchListener) {
            touchListener = _eventListener.EventListener.create({
              event: _eventListener.EventListener.TOUCH_ONE_BY_ONE,
              onTouchBegan: function onTouchBegan(touch, event) {
                event.type = _eventEnum.SystemEventType.TOUCH_START;

                _globalExports.legacyCC.systemEvent.emit(event.type, touch, event);

                return true;
              },
              onTouchMoved: function onTouchMoved(touch, event) {
                event.type = _eventEnum.SystemEventType.TOUCH_MOVE;

                _globalExports.legacyCC.systemEvent.emit(event.type, touch, event);
              },
              onTouchEnded: function onTouchEnded(touch, event) {
                event.type = _eventEnum.SystemEventType.TOUCH_END;

                _globalExports.legacyCC.systemEvent.emit(event.type, touch, event);
              },
              onTouchCancelled: function onTouchCancelled(touch, event) {
                event.type = _eventEnum.SystemEventType.TOUCH_CANCEL;

                _globalExports.legacyCC.systemEvent.emit(event.type, touch, event);
              }
            });

            _eventManager.default.addListener(touchListener, 256);
          }
        } // mouse


        if (type === _eventEnum.SystemEventType.MOUSE_DOWN || type === _eventEnum.SystemEventType.MOUSE_MOVE || type === _eventEnum.SystemEventType.MOUSE_UP || type === _eventEnum.SystemEventType.MOUSE_WHEEL) {
          if (!mouseListener) {
            mouseListener = _eventListener.EventListener.create({
              event: _eventListener.EventListener.MOUSE,
              onMouseDown: function onMouseDown(event) {
                event.type = _eventEnum.SystemEventType.MOUSE_DOWN;

                _globalExports.legacyCC.systemEvent.emit(event.type, event);
              },
              onMouseMove: function onMouseMove(event) {
                event.type = _eventEnum.SystemEventType.MOUSE_MOVE;

                _globalExports.legacyCC.systemEvent.emit(event.type, event);
              },
              onMouseUp: function onMouseUp(event) {
                event.type = _eventEnum.SystemEventType.MOUSE_UP;

                _globalExports.legacyCC.systemEvent.emit(event.type, event);
              },
              onMouseScroll: function onMouseScroll(event) {
                event.type = _eventEnum.SystemEventType.MOUSE_WHEEL;

                _globalExports.legacyCC.systemEvent.emit(event.type, event);
              }
            });

            _eventManager.default.addListener(mouseListener, 256);
          }
        }

        return callback;
      }
      /**
       * @en
       * Removes the listeners previously registered with the same type, callback, target and or useCapture,
       * if only type is passed as parameter, all listeners registered with that type will be removed.
       * @zh
       * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
       *
       * @param type - A string representing the event type being removed.
       * @param callback - The callback to remove.
       * @param target - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
       */

    }, {
      key: "off",
      value: function off(type, callback, target) {
        if (_defaultConstants.EDITOR && !_globalExports.legacyCC.GAME_VIEW) {
          return;
        }

        _get(_getPrototypeOf(SystemEvent.prototype), "off", this).call(this, type, callback, target); // Keyboard


        if (keyboardListener && (type === _eventEnum.SystemEventType.KEY_DOWN || type === _eventEnum.SystemEventType.KEY_UP)) {
          var hasKeyDownEventListener = this.hasEventListener(_eventEnum.SystemEventType.KEY_DOWN);
          var hasKeyUpEventListener = this.hasEventListener(_eventEnum.SystemEventType.KEY_UP);

          if (!hasKeyDownEventListener && !hasKeyUpEventListener) {
            _eventManager.default.removeListener(keyboardListener);

            keyboardListener = null;
          }
        } // Acceleration


        if (accelerationListener && type === _eventEnum.SystemEventType.DEVICEMOTION) {
          _eventManager.default.removeListener(accelerationListener);

          accelerationListener = null;
        }

        if (touchListener && (type === _eventEnum.SystemEventType.TOUCH_START || type === _eventEnum.SystemEventType.TOUCH_MOVE || type === _eventEnum.SystemEventType.TOUCH_END || type === _eventEnum.SystemEventType.TOUCH_CANCEL)) {
          var hasTouchStart = this.hasEventListener(_eventEnum.SystemEventType.TOUCH_START);
          var hasTouchMove = this.hasEventListener(_eventEnum.SystemEventType.TOUCH_MOVE);
          var hasTouchEnd = this.hasEventListener(_eventEnum.SystemEventType.TOUCH_END);
          var hasTouchCancel = this.hasEventListener(_eventEnum.SystemEventType.TOUCH_CANCEL);

          if (!hasTouchStart && !hasTouchMove && !hasTouchEnd && !hasTouchCancel) {
            _eventManager.default.removeListener(touchListener);

            touchListener = null;
          }
        }

        if (mouseListener && (type === _eventEnum.SystemEventType.MOUSE_DOWN || type === _eventEnum.SystemEventType.MOUSE_MOVE || type === _eventEnum.SystemEventType.MOUSE_UP || type === _eventEnum.SystemEventType.MOUSE_WHEEL)) {
          var hasMouseDown = this.hasEventListener(_eventEnum.SystemEventType.MOUSE_DOWN);
          var hasMouseMove = this.hasEventListener(_eventEnum.SystemEventType.MOUSE_MOVE);
          var hasMouseUp = this.hasEventListener(_eventEnum.SystemEventType.MOUSE_UP);
          var hasMouseWheel = this.hasEventListener(_eventEnum.SystemEventType.MOUSE_WHEEL);

          if (!hasMouseDown && !hasMouseMove && !hasMouseUp && !hasMouseWheel) {
            _eventManager.default.removeListener(mouseListener);

            mouseListener = null;
          }
        }
      }
    }]);

    return SystemEvent;
  }(_eventTarget.EventTarget);

  _exports.SystemEvent = SystemEvent;
  SystemEvent.EventType = _eventEnum.SystemEventType;
  _globalExports.legacyCC.SystemEvent = SystemEvent;
  /**
   * @module cc
   */

  /**
   * @en The singleton of the SystemEvent, there should only be one instance to be used globally
   * @zh 系统事件单例，方便全局使用。
   */

  var systemEvent = new SystemEvent();
  _exports.systemEvent = systemEvent;
  _globalExports.legacyCC.systemEvent = systemEvent;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9zeXN0ZW0tZXZlbnQudHMiXSwibmFtZXMiOlsia2V5Ym9hcmRMaXN0ZW5lciIsImFjY2VsZXJhdGlvbkxpc3RlbmVyIiwidG91Y2hMaXN0ZW5lciIsIm1vdXNlTGlzdGVuZXIiLCJTeXN0ZW1FdmVudCIsImlzRW5hYmxlZCIsIkVESVRPUiIsIndpbmRvdyIsIkRldmljZU1vdGlvbkV2ZW50IiwicmVxdWVzdFBlcm1pc3Npb24iLCJ0aGVuIiwicmVzcG9uc2UiLCJjb25zb2xlIiwibG9nIiwiaW5wdXRNYW5hZ2VyIiwic2V0QWNjZWxlcm9tZXRlckVuYWJsZWQiLCJpbnRlcnZhbCIsInNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbCIsInR5cGUiLCJjYWxsYmFjayIsInRhcmdldCIsIm9uY2UiLCJsZWdhY3lDQyIsIkdBTUVfVklFVyIsIlN5c3RlbUV2ZW50VHlwZSIsIktFWV9ET1dOIiwiS0VZX1VQIiwiRXZlbnRMaXN0ZW5lciIsImNyZWF0ZSIsImV2ZW50IiwiS0VZQk9BUkQiLCJvbktleVByZXNzZWQiLCJrZXlDb2RlIiwic3lzdGVtRXZlbnQiLCJlbWl0Iiwib25LZXlSZWxlYXNlZCIsImV2ZW50TWFuYWdlciIsImFkZExpc3RlbmVyIiwiREVWSUNFTU9USU9OIiwiQUNDRUxFUkFUSU9OIiwiYWNjIiwiVE9VQ0hfU1RBUlQiLCJUT1VDSF9NT1ZFIiwiVE9VQ0hfRU5EIiwiVE9VQ0hfQ0FOQ0VMIiwiVE9VQ0hfT05FX0JZX09ORSIsIm9uVG91Y2hCZWdhbiIsInRvdWNoIiwib25Ub3VjaE1vdmVkIiwib25Ub3VjaEVuZGVkIiwib25Ub3VjaENhbmNlbGxlZCIsIk1PVVNFX0RPV04iLCJNT1VTRV9NT1ZFIiwiTU9VU0VfVVAiLCJNT1VTRV9XSEVFTCIsIk1PVVNFIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsIm9uTW91c2VTY3JvbGwiLCJoYXNLZXlEb3duRXZlbnRMaXN0ZW5lciIsImhhc0V2ZW50TGlzdGVuZXIiLCJoYXNLZXlVcEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsImhhc1RvdWNoU3RhcnQiLCJoYXNUb3VjaE1vdmUiLCJoYXNUb3VjaEVuZCIsImhhc1RvdWNoQ2FuY2VsIiwiaGFzTW91c2VEb3duIiwiaGFzTW91c2VNb3ZlIiwiaGFzTW91c2VVcCIsImhhc01vdXNlV2hlZWwiLCJFdmVudFRhcmdldCIsIkV2ZW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQSxNQUFJQSxnQkFBc0MsR0FBRyxJQUE3QztBQUNBLE1BQUlDLG9CQUEwQyxHQUFHLElBQWpEO0FBQ0EsTUFBSUMsYUFBbUMsR0FBRyxJQUExQztBQUNBLE1BQUlDLGFBQW1DLEdBQUcsSUFBMUM7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O01BZWFDLFc7OztBQUVULDJCQUFlO0FBQUE7O0FBQUE7QUFFZDtBQUNEOzs7Ozs7Ozs7Ozs4Q0FPZ0NDLFMsRUFBb0I7QUFDaEQsWUFBSUMsd0JBQUosRUFBWTtBQUNSO0FBQ0gsU0FIK0MsQ0FLaEQ7OztBQUNBLFlBQUlELFNBQVMsSUFBSUUsTUFBTSxDQUFDQyxpQkFBcEIsSUFBeUMsT0FBT0EsaUJBQWlCLENBQUNDLGlCQUF6QixLQUErQyxVQUE1RixFQUF3RztBQUNwR0QsVUFBQUEsaUJBQWlCLENBQUNDLGlCQUFsQixHQUFzQ0MsSUFBdEMsQ0FBMkMsVUFBQUMsUUFBUSxFQUFJO0FBQ25EQyxZQUFBQSxPQUFPLENBQUNDLEdBQVIsbURBQXVERixRQUF2RDs7QUFDQUcsa0NBQWFDLHVCQUFiLENBQXFDSixRQUFRLEtBQUssU0FBbEQ7QUFDSCxXQUhEO0FBSUgsU0FMRCxNQUtPO0FBQ0hHLGdDQUFhQyx1QkFBYixDQUFxQ1YsU0FBckM7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7K0NBT2lDVyxRLEVBQWtCO0FBQy9DLFlB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RUFBcEI7O0FBQ1BrQiwwQkFBU1csV0FBVCxHQUF1QkEsV0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgZXZlbnRcclxuICovXHJcblxyXG5pbXBvcnQgeyBFdmVudFRhcmdldCB9IGZyb20gJy4uLy4uL2V2ZW50L2V2ZW50LXRhcmdldCc7XHJcbmltcG9ydCB7IEV2ZW50QWNjZWxlcmF0aW9uLCBFdmVudEtleWJvYXJkLCBFdmVudE1vdXNlLCBFdmVudFRvdWNoIH0gZnJvbSAnLi9ldmVudHMnO1xyXG5pbXBvcnQgeyBTeXN0ZW1FdmVudFR5cGUgfSBmcm9tICcuL2V2ZW50LWVudW0nO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lcic7XHJcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcclxuaW1wb3J0IGlucHV0TWFuYWdlciBmcm9tICcuL2lucHV0LW1hbmFnZXInO1xyXG5pbXBvcnQgeyBUb3VjaCB9IGZyb20gJy4vdG91Y2gnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmxldCBrZXlib2FyZExpc3RlbmVyOiBFdmVudExpc3RlbmVyIHwgbnVsbCA9IG51bGw7XHJcbmxldCBhY2NlbGVyYXRpb25MaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciB8IG51bGwgPSBudWxsO1xyXG5sZXQgdG91Y2hMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciB8IG51bGwgPSBudWxsO1xyXG5sZXQgbW91c2VMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciB8IG51bGwgPSBudWxsO1xyXG5cclxuLyoqXHJcbiogQGVuXHJcbiogVGhlIFN5c3RlbSBldmVudCwgaXQgY3VycmVudGx5IHN1cHBvcnRzIGtleWJvYXJkIGV2ZW50cyBhbmQgYWNjZWxlcm9tZXRlciBldmVudHMuPGJyLz5cclxuKiBZb3UgY2FuIGdldCB0aGUgYFN5c3RlbUV2ZW50YCBpbnN0YW5jZSB3aXRoIGBzeXN0ZW1FdmVudGAuPGJyLz5cclxuKiBAemhcclxuKiDns7vnu5/kuovku7bvvIzlroPnm67liY3mlK/mjIHmjInplK7kuovku7blkozph43lipvmhJ/lupTkuovku7bjgII8YnIvPlxyXG4qIOS9oOWPr+S7pemAmui/hyBgc3lzdGVtRXZlbnRgIOiOt+WPluWIsCBgU3lzdGVtRXZlbnRgIOeahOWunuS+i+OAgjxici8+XHJcbiogQGV4YW1wbGVcclxuKiBgYGBcclxuKiBpbXBvcnQgeyBzeXN0ZW1FdmVudCwgU3lzdGVtRXZlbnQgfSBmcm9tICdjYyc7XHJcbiogc3lzdGVtRXZlbnQub24oU3lzdGVtRXZlbnQuRXZlbnRUeXBlLkRFVklDRU1PVElPTiwgdGhpcy5vbkRldmljZU1vdGlvbkV2ZW50LCB0aGlzKTtcclxuKiBzeXN0ZW1FdmVudC5vZmYoU3lzdGVtRXZlbnQuRXZlbnRUeXBlLkRFVklDRU1PVElPTiwgdGhpcy5vbkRldmljZU1vdGlvbkV2ZW50LCB0aGlzKTtcclxuKiBgYGBcclxuKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBTeXN0ZW1FdmVudCBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgRXZlbnRUeXBlID0gU3lzdGVtRXZlbnRUeXBlO1xyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB3aGV0aGVyIHRvIGVuYWJsZSB0aGUgYWNjZWxlcm9tZXRlciBldmVudCBsaXN0ZW5lciBvciBub3QuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblkK/nlKjliqDpgJ/luqborqHkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEFjY2VsZXJvbWV0ZXJFbmFibGVkIChpc0VuYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZvciBpT1MgMTMrXHJcbiAgICAgICAgaWYgKGlzRW5hYmxlZCAmJiB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgJiYgdHlwZW9mIERldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIERldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRGV2aWNlIE1vdGlvbiBFdmVudCByZXF1ZXN0IHBlcm1pc3Npb246ICR7cmVzcG9uc2V9YCk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dE1hbmFnZXIuc2V0QWNjZWxlcm9tZXRlckVuYWJsZWQocmVzcG9uc2UgPT09ICdncmFudGVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVyRW5hYmxlZChpc0VuYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB0aGUgYWNjZWxlcm9tZXRlciBpbnRlcnZhbCB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruWKoOmAn+W6puiuoemXtOmalOWAvOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QWNjZWxlcm9tZXRlckludGVydmFsIChpbnRlcnZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbiAodHlwZTogU3lzdGVtRXZlbnRUeXBlLktFWV9ET1dOIHwgU3lzdGVtRXZlbnRUeXBlLktFWV9VUCwgY2FsbGJhY2s6IChldmVudD86IEV2ZW50S2V5Ym9hcmQpID0+IHZvaWQsIHRhcmdldD86IE9iamVjdCk7XHJcbiAgICBwdWJsaWMgb24gKHR5cGU6IFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9ET1dOIHwgU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0VOVEVSIHwgU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0xFQVZFIHxcclxuICAgICAgICAgICAgICAgICAgICAgU3lzdGVtRXZlbnRUeXBlLk1PVVNFX01PVkUgfCBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfVVAgfCBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfV0hFRUwgLFxyXG4gICAgICAgICAgICAgICBjYWxsYmFjazogKGV2ZW50PzogRXZlbnRNb3VzZSkgPT4gdm9pZCwgdGFyZ2V0PzogT2JqZWN0KTtcclxuICAgIHB1YmxpYyBvbiAodHlwZTogU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJUIHwgU3lzdGVtRXZlbnRUeXBlLlRPVUNIX01PVkUgfCBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5EIHwgU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCxcclxuICAgICAgICAgICAgICAgY2FsbGJhY2s6ICh0b3VjaD86IFRvdWNoLCBldmVudD86IEV2ZW50VG91Y2gpID0+IHZvaWQsIHRhcmdldD86IE9iamVjdCk7XHJcbiAgICBwdWJsaWMgb24gKHR5cGU6IFN5c3RlbUV2ZW50VHlwZS5ERVZJQ0VNT1RJT04sIGNhbGxiYWNrOiAoZXZlbnQ/OiBFdmVudEFjY2VsZXJhdGlvbikgPT4gdm9pZCwgdGFyZ2V0PzogT2JqZWN0KTtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZWdpc3RlciBhbiBjYWxsYmFjayBvZiBhIHNwZWNpZmljIHN5c3RlbSBldmVudCB0eXBlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDms6jlhoznibnlrprkuovku7bnsbvlnovlm57osIPjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdHlwZSAtIFRoZSBldmVudCB0eXBlXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgZXZlbnQgbGlzdGVuZXIncyBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBldmVudCBsaXN0ZW5lcidzIHRhcmdldCBhbmQgY2FsbGVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbiAodHlwZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCwgb25jZT86IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoRURJVE9SICYmICFsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5vbih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCBvbmNlKTtcclxuXHJcbiAgICAgICAgLy8gS2V5Ym9hcmRcclxuICAgICAgICBpZiAodHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLktFWV9ET1dOIHx8IHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5LRVlfVVApIHtcclxuICAgICAgICAgICAgaWYgKCFrZXlib2FyZExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBrZXlib2FyZExpc3RlbmVyID0gRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBFdmVudExpc3RlbmVyLktFWUJPQVJELFxyXG4gICAgICAgICAgICAgICAgICAgIG9uS2V5UHJlc3NlZCAoa2V5Q29kZTogbnVtYmVyLCBldmVudDogRXZlbnRLZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLktFWV9ET1dOO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzeXN0ZW1FdmVudC5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQgKGtleUNvZGU6IG51bWJlciwgZXZlbnQ6IEV2ZW50S2V5Ym9hcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5LRVlfVVA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihrZXlib2FyZExpc3RlbmVyLCAyNTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBY2NlbGVyYXRpb25cclxuICAgICAgICBpZiAodHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLkRFVklDRU1PVElPTikge1xyXG4gICAgICAgICAgICBpZiAoIWFjY2VsZXJhdGlvbkxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb25MaXN0ZW5lciA9IEV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudDogRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgKGFjYzogT2JqZWN0LCBldmVudDogRXZlbnRBY2NlbGVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5ERVZJQ0VNT1RJT047XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLnN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihhY2NlbGVyYXRpb25MaXN0ZW5lciEsIDI1Nik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRvdWNoXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVCB8fFxyXG4gICAgICAgICAgICB0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSB8fFxyXG4gICAgICAgICAgICB0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5EIHx8XHJcbiAgICAgICAgICAgIHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9DQU5DRUxcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgaWYgKCF0b3VjaExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0b3VjaExpc3RlbmVyID0gRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBFdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Ub3VjaEJlZ2FuICh0b3VjaDogVG91Y2gsIGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfU1RBUlQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLnN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgdG91Y2gsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoTW92ZWQgKHRvdWNoOiBUb3VjaCwgZXZlbnQ6IEV2ZW50VG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9NT1ZFO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdhY3lDQy5zeXN0ZW1FdmVudC5lbWl0KGV2ZW50LnR5cGUsIHRvdWNoLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoRW5kZWQgKHRvdWNoOiBUb3VjaCwgZXZlbnQ6IEV2ZW50VG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9FTkQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLnN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgdG91Y2gsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uVG91Y2hDYW5jZWxsZWQgKHRvdWNoOiBUb3VjaCwgZXZlbnQ6IEV2ZW50VG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9DQU5DRUw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLnN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgdG91Y2gsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodG91Y2hMaXN0ZW5lciwgMjU2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbW91c2VcclxuICAgICAgICBpZiAodHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0RPV04gfHxcclxuICAgICAgICAgICAgdHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX01PVkUgfHxcclxuICAgICAgICAgICAgdHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1VQIHx8XHJcbiAgICAgICAgICAgIHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9XSEVFTFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBpZiAoIW1vdXNlTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIG1vdXNlTGlzdGVuZXIgPSBFdmVudExpc3RlbmVyLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IEV2ZW50TGlzdGVuZXIuTU9VU0UsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd24gKGV2ZW50OiBFdmVudE1vdXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfRE9XTjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVnYWN5Q0Muc3lzdGVtRXZlbnQuZW1pdChldmVudC50eXBlLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTW92ZSAoZXZlbnQ6RXZlbnRNb3VzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX01PVkU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLnN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZVVwIChldmVudDogRXZlbnRNb3VzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1VQO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdhY3lDQy5zeXN0ZW1FdmVudC5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VTY3JvbGwgKGV2ZW50OiBFdmVudE1vdXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfV0hFRUw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLnN5c3RlbUV2ZW50LmVtaXQoZXZlbnQudHlwZSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihtb3VzZUxpc3RlbmVyLCAyNTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlbW92ZXMgdGhlIGxpc3RlbmVycyBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgd2l0aCB0aGUgc2FtZSB0eXBlLCBjYWxsYmFjaywgdGFyZ2V0IGFuZCBvciB1c2VDYXB0dXJlLFxyXG4gICAgICogaWYgb25seSB0eXBlIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIsIGFsbCBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIoOmZpOS5i+WJjeeUqOWQjOexu+Wei++8jOWbnuiwg++8jOebruagh+aIliB1c2VDYXB0dXJlIOazqOWGjOeahOS6i+S7tuebkeWQrOWZqO+8jOWmguaenOWPquS8oOmAkiB0eXBl77yM5bCG5Lya5Yig6ZmkIHR5cGUg57G75Z6L55qE5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgYmVpbmcgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGlmIGl0J3Mgbm90IGdpdmVuLCBvbmx5IGNhbGxiYWNrIHdpdGhvdXQgdGFyZ2V0IHdpbGwgYmUgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb2ZmICh0eXBlOiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCkge1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgIWxlZ2FjeUNDLkdBTUVfVklFVykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLm9mZih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcclxuXHJcbiAgICAgICAgLy8gS2V5Ym9hcmRcclxuICAgICAgICBpZiAoa2V5Ym9hcmRMaXN0ZW5lciAmJiAodHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLktFWV9ET1dOIHx8IHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5LRVlfVVApKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0tleURvd25FdmVudExpc3RlbmVyID0gdGhpcy5oYXNFdmVudExpc3RlbmVyKFN5c3RlbUV2ZW50VHlwZS5LRVlfRE9XTik7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0tleVVwRXZlbnRMaXN0ZW5lciA9IHRoaXMuaGFzRXZlbnRMaXN0ZW5lcihTeXN0ZW1FdmVudFR5cGUuS0VZX1VQKTtcclxuICAgICAgICAgICAgaWYgKCFoYXNLZXlEb3duRXZlbnRMaXN0ZW5lciAmJiAhaGFzS2V5VXBFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIoa2V5Ym9hcmRMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBrZXlib2FyZExpc3RlbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWNjZWxlcmF0aW9uXHJcbiAgICAgICAgaWYgKGFjY2VsZXJhdGlvbkxpc3RlbmVyICYmIHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5ERVZJQ0VNT1RJT04pIHtcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKGFjY2VsZXJhdGlvbkxpc3RlbmVyKTtcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uTGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRvdWNoTGlzdGVuZXIgJiYgKHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVCB8fCB0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSB8fFxyXG4gICAgICAgICAgICB0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5EIHx8IHR5cGUgPT09IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9DQU5DRUwpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc1RvdWNoU3RhcnQgPSB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJUKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzVG91Y2hNb3ZlID0gdGhpcy5oYXNFdmVudExpc3RlbmVyKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9NT1ZFKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzVG91Y2hFbmQgPSB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0VORCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc1RvdWNoQ2FuY2VsID0gdGhpcy5oYXNFdmVudExpc3RlbmVyKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9DQU5DRUwpO1xyXG4gICAgICAgICAgICBpZighaGFzVG91Y2hTdGFydCAmJiAhaGFzVG91Y2hNb3ZlICYmICFoYXNUb3VjaEVuZCAmJiAhaGFzVG91Y2hDYW5jZWwpe1xyXG4gICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRvdWNoTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgdG91Y2hMaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtb3VzZUxpc3RlbmVyICYmICh0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfRE9XTiB8fCB0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfTU9WRSB8fFxyXG4gICAgICAgICAgICB0eXBlID09PSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfVVAgfHwgdHlwZSA9PT0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1dIRUVMKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBoYXNNb3VzZURvd24gPSB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0RPV04pO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNNb3VzZU1vdmUgPSB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoU3lzdGVtRXZlbnRUeXBlLk1PVVNFX01PVkUpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNNb3VzZVVwID0gdGhpcy5oYXNFdmVudExpc3RlbmVyKFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9VUCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc01vdXNlV2hlZWwgPSB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1dIRUVMKTtcclxuICAgICAgICAgICAgaWYgKCFoYXNNb3VzZURvd24gJiYgIWhhc01vdXNlTW92ZSAmJiAhaGFzTW91c2VVcCAmJiAhaGFzTW91c2VXaGVlbCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKG1vdXNlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgbW91c2VMaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlN5c3RlbUV2ZW50ID0gU3lzdGVtRXZlbnQ7XHJcbi8qKlxyXG4gKiBAbW9kdWxlIGNjXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgc2luZ2xldG9uIG9mIHRoZSBTeXN0ZW1FdmVudCwgdGhlcmUgc2hvdWxkIG9ubHkgYmUgb25lIGluc3RhbmNlIHRvIGJlIHVzZWQgZ2xvYmFsbHlcclxuICogQHpoIOezu+e7n+S6i+S7tuWNleS+i++8jOaWueS+v+WFqOWxgOS9v+eUqOOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHN5c3RlbUV2ZW50ID0gbmV3IFN5c3RlbUV2ZW50KCk7XHJcbmxlZ2FjeUNDLnN5c3RlbUV2ZW50ID0gc3lzdGVtRXZlbnQ7XHJcbiJdfQ==