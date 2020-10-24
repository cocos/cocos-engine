(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../math/index.js", "../../math/rect.js", "../macro.js", "../sys.js", "./event-manager.js", "./events.js", "./touch.js", "../../default-constants.js", "../../global-exports.js", "../debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../math/index.js"), require("../../math/rect.js"), require("../macro.js"), require("../sys.js"), require("./event-manager.js"), require("./events.js"), require("./touch.js"), require("../../default-constants.js"), require("../../global-exports.js"), require("../debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.rect, global.macro, global.sys, global.eventManager, global.events, global.touch, global.defaultConstants, global.globalExports, global.debug);
    global.inputManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index5, _rect, _macro, _sys, _eventManager, _events, _touch, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.Acceleration = void 0;
  _eventManager = _interopRequireDefault(_eventManager);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var TOUCH_TIMEOUT = _macro.macro.TOUCH_TIMEOUT;
  var PORTRAIT = 0;
  var LANDSCAPE_LEFT = -90;
  var PORTRAIT_UPSIDE_DOWN = 180;
  var LANDSCAPE_RIGHT = 90;

  var _didAccelerateFun;

  var _vec2 = new _index5.Vec2();

  var _preLocation = new _index5.Vec2();

  /**
   * @en the device accelerometer reports values for each axis in units of g-force.
   * @zh 设备重力传感器传递的各个轴的数据。
   */
  var Acceleration = function Acceleration() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var timestamp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, Acceleration);

    this.x = void 0;
    this.y = void 0;
    this.z = void 0;
    this.timestamp = void 0;
    this.x = x;
    this.y = y;
    this.z = z;
    this.timestamp = timestamp;
  };

  _exports.Acceleration = Acceleration;
  _globalExports.legacyCC.internal.Acceleration = Acceleration;
  /**
   *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
   */

  var InputManager = /*#__PURE__*/function () {
    function InputManager() {
      _classCallCheck(this, InputManager);

      this._mousePressed = false;
      this._isRegisterEvent = false;
      this._preTouchPoint = new _index5.Vec2();
      this._prevMousePoint = new _index5.Vec2();
      this._preTouchPool = [];
      this._preTouchPoolPointer = 0;
      this._touches = [];
      this._touchesIntegerDict = {};
      this._indexBitsUsed = 0;
      this._maxTouches = 8;
      this._accelEnabled = false;
      this._accelInterval = 1 / 5;
      this._accelMinus = 1;
      this._accelCurTime = 0;
      this._acceleration = null;
      this._accelDeviceEvent = null;
      this._glView = null;
      this._pointLocked = false;
    }

    _createClass(InputManager, [{
      key: "handleTouchesBegin",
      value: function handleTouchesBegin(touches) {
        var handleTouches = [];
        var locTouchIntDict = this._touchesIntegerDict;

        for (var i = 0; i < touches.length; ++i) {
          var touch = touches[i];
          var touchID = touch.getID();

          if (touchID === null) {
            continue;
          }

          var _index = locTouchIntDict[touchID];

          if (_index === undefined) {
            var unusedIndex = this._getUnUsedIndex();

            if (unusedIndex === -1) {
              (0, _debug.logID)(2300, unusedIndex);
              continue;
            } // curTouch = this._touches[unusedIndex] = touch;


            touch.getLocation(_vec2);
            var curTouch = new _touch.Touch(_vec2.x, _vec2.y, touchID);
            this._touches[unusedIndex] = curTouch;
            touch.getPreviousLocation(_vec2);
            curTouch.setPrevPoint(_vec2);
            locTouchIntDict[touchID] = unusedIndex;
            handleTouches.push(curTouch);
          }
        }

        if (handleTouches.length > 0) {
          // this._glView!._convertTouchesWithScale(handleTouches);
          var touchEvent = new _events.EventTouch(handleTouches, false, _events.EventTouch.BEGAN, _macro.macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);

          _eventManager.default.dispatchEvent(touchEvent);
        }
      }
    }, {
      key: "handleTouchesMove",
      value: function handleTouchesMove(touches) {
        var handleTouches = [];
        var locTouches = this._touches;

        for (var i = 0; i < touches.length; ++i) {
          var touch = touches[i];
          var touchID = touch.getID();

          if (touchID === null) {
            continue;
          }

          var _index2 = this._touchesIntegerDict[touchID];

          if (_index2 === undefined) {
            // cc.log("if the index doesn't exist, it is an error");
            continue;
          }

          if (locTouches[_index2]) {
            touch.getLocation(_vec2);

            locTouches[_index2].setPoint(_vec2);

            touch.getPreviousLocation(_vec2);

            locTouches[_index2].setPrevPoint(_vec2);

            handleTouches.push(locTouches[_index2]);
          }
        }

        if (handleTouches.length > 0) {
          // this._glView!._convertTouchesWithScale(handleTouches);
          var touchEvent = new _events.EventTouch(handleTouches, false, _events.EventTouch.MOVED, _macro.macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);

          _eventManager.default.dispatchEvent(touchEvent);
        }
      }
    }, {
      key: "handleTouchesEnd",
      value: function handleTouchesEnd(touches) {
        var handleTouches = this.getSetOfTouchesEndOrCancel(touches);

        if (handleTouches.length > 0) {
          // this._glView!._convertTouchesWithScale(handleTouches);
          var touchEvent = new _events.EventTouch(handleTouches, false, _events.EventTouch.ENDED, _macro.macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);

          _eventManager.default.dispatchEvent(touchEvent);
        }

        this._preTouchPool.length = 0;
      }
    }, {
      key: "handleTouchesCancel",
      value: function handleTouchesCancel(touches) {
        var handleTouches = this.getSetOfTouchesEndOrCancel(touches);

        if (handleTouches.length > 0) {
          // this._glView!._convertTouchesWithScale(handleTouches);
          var touchEvent = new _events.EventTouch(handleTouches, false, _events.EventTouch.CANCELLED, _macro.macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);

          _eventManager.default.dispatchEvent(touchEvent);
        }

        this._preTouchPool.length = 0;
      }
    }, {
      key: "getSetOfTouchesEndOrCancel",
      value: function getSetOfTouchesEndOrCancel(touches) {
        var handleTouches = [];
        var locTouches = this._touches;
        var locTouchesIntDict = this._touchesIntegerDict;

        for (var i = 0; i < touches.length; ++i) {
          var touch = touches[i];
          var touchID = touch.getID();

          if (touchID === null) {
            continue;
          }

          var _index3 = locTouchesIntDict[touchID];

          if (_index3 === undefined) {
            // cc.log("if the index doesn't exist, it is an error");
            continue;
          }

          if (locTouches[_index3]) {
            touch.getLocation(_vec2);

            locTouches[_index3].setPoint(_vec2);

            touch.getPreviousLocation(_vec2);

            locTouches[_index3].setPrevPoint(_vec2);

            handleTouches.push(locTouches[_index3]);

            this._removeUsedIndexBit(_index3);

            delete locTouchesIntDict[touchID];
          }
        }

        return handleTouches;
      }
    }, {
      key: "getHTMLElementPosition",
      value: function getHTMLElementPosition(element) {
        var docElem = document.documentElement;
        var leftOffset = _sys.sys.os === _sys.sys.OS_IOS && _sys.sys.isBrowser ? window.screenLeft : window.pageXOffset;
        leftOffset -= docElem.clientLeft;
        var topOffset = _sys.sys.os === _sys.sys.OS_IOS && _sys.sys.isBrowser ? window.screenTop : window.pageYOffset;
        topOffset -= docElem.clientTop;

        if (element.getBoundingClientRect) {
          var box = element.getBoundingClientRect();
          return {
            left: box.left + leftOffset,
            top: box.top + topOffset,
            width: box.width,
            height: box.height
          };
        } else {
          if (element instanceof HTMLCanvasElement) {
            return {
              left: leftOffset,
              top: topOffset,
              width: element.width,
              height: element.height
            };
          } else {
            return {
              left: leftOffset,
              top: topOffset,
              width: parseInt(element.style.width || '0', undefined),
              height: parseInt(element.style.height || '0', undefined)
            };
          }
        }
      }
    }, {
      key: "getPreTouch",
      value: function getPreTouch(touch) {
        var preTouch = null;
        var locPreTouchPool = this._preTouchPool;
        var id = touch.getID();

        for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
          if (locPreTouchPool[i].getID() === id) {
            preTouch = locPreTouchPool[i];
            break;
          }
        }

        if (!preTouch) {
          preTouch = touch;
        }

        return preTouch;
      }
    }, {
      key: "setPreTouch",
      value: function setPreTouch(touch) {
        var find = false;
        var locPreTouchPool = this._preTouchPool;
        var id = touch.getID();

        for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
          if (locPreTouchPool[i].getID() === id) {
            locPreTouchPool[i] = touch;
            find = true;
            break;
          }
        }

        if (!find) {
          if (locPreTouchPool.length <= 50) {
            locPreTouchPool.push(touch);
          } else {
            locPreTouchPool[this._preTouchPoolPointer] = touch;
            this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50;
          }
        }
      }
    }, {
      key: "getTouchByXY",
      value: function getTouchByXY(event, tx, ty, pos) {
        var locPreTouch = this._preTouchPoint;

        var location = this._glView.convertToLocationInView(tx, ty, pos);

        if (this._pointLocked) {
          location.x = locPreTouch.x + event.movementX;
          location.y = locPreTouch.y - event.movementY;
        }

        var touch = new _touch.Touch(location.x, location.y, 0);
        touch.setPrevPoint(locPreTouch.x, locPreTouch.y);
        locPreTouch.x = location.x;
        locPreTouch.y = location.y;
        return touch;
      }
    }, {
      key: "getMouseEvent",
      value: function getMouseEvent(location, pos, eventType) {
        var locPreMouse = this._prevMousePoint;
        var mouseEvent = new _events.EventMouse(eventType, false, locPreMouse);
        locPreMouse.x = location.x;
        locPreMouse.y = location.y; // this._glView!._convertMouseToLocationInView(locPreMouse, pos);

        this._glView._convertMouseToLocation(locPreMouse, pos);

        mouseEvent.setLocation(locPreMouse.x, locPreMouse.y);
        return mouseEvent;
      }
    }, {
      key: "getPointByEvent",
      value: function getPointByEvent(event, pos) {
        if (event.pageX != null) {
          // not avalable in <= IE8
          return {
            x: event.pageX,
            y: event.pageY
          };
        }

        pos.left -= document.body.scrollLeft;
        pos.top -= document.body.scrollTop;
        return {
          x: event.clientX,
          y: event.clientY
        };
      }
    }, {
      key: "getTouchesByEvent",
      value: function getTouchesByEvent(event, position) {
        var touches = [];
        var locView = this._glView;
        var locPreTouch = this._preTouchPoint;
        var length = event.changedTouches.length;

        for (var i = 0; i < length; i++) {
          // const changedTouch = event.changedTouches.item(i);
          var changedTouch = event.changedTouches[i];

          if (!changedTouch) {
            continue;
          }

          var _location = void 0;

          if (_sys.sys.BROWSER_TYPE_FIREFOX === _sys.sys.browserType) {
            _location = locView.convertToLocationInView(changedTouch.pageX, changedTouch.pageY, position, _vec2);
          } else {
            _location = locView.convertToLocationInView(changedTouch.clientX, changedTouch.clientY, position, _vec2);
          }

          var touch = void 0;

          if (changedTouch.identifier != null) {
            touch = new _touch.Touch(_location.x, _location.y, changedTouch.identifier); // use Touch Pool

            this.getPreTouch(touch).getLocation(_preLocation);
            touch.setPrevPoint(_preLocation.x, _preLocation.y);
            this.setPreTouch(touch);
          } else {
            touch = new _touch.Touch(_location.x, _location.y);
            touch.setPrevPoint(locPreTouch.x, locPreTouch.y);
          }

          locPreTouch.x = _location.x;
          locPreTouch.y = _location.y;
          touches.push(touch);

          if (!_macro.macro.ENABLE_MULTI_TOUCH) {
            break;
          }
        }

        return touches;
      }
    }, {
      key: "registerSystemEvent",
      value: function registerSystemEvent(element) {
        if (this._isRegisterEvent || !element) {
          return;
        }

        this._glView = _globalExports.legacyCC.view;
        var prohibition = _sys.sys.isMobile;
        var supportMouse = ('mouse' in _sys.sys.capabilities);
        var supportTouches = ('touches' in _sys.sys.capabilities); // Register mouse events.

        if (supportMouse) {
          this._registerMouseEvents(element, prohibition);
        } // Register mouse pointer events.


        if (window.navigator.msPointerEnabled) {
          this._registerMousePointerEvents(element);
        } // Register touch events.


        if (supportTouches) {
          this._registerTouchEvents(element);
        }

        this._registerKeyboardEvent();

        this._isRegisterEvent = true;
      }
      /**
       * Whether enable accelerometer event.
       */

    }, {
      key: "setAccelerometerEnabled",
      value: function setAccelerometerEnabled(isEnable) {
        if (this._accelEnabled === isEnable) {
          return;
        }

        this._accelEnabled = isEnable;

        var scheduler = _globalExports.legacyCC.director.getScheduler();

        scheduler.enableForTarget(this);

        if (this._accelEnabled) {
          this._registerAccelerometerEvent();

          this._accelCurTime = 0;
          scheduler.scheduleUpdate(this);
        } else {
          this._unregisterAccelerometerEvent();

          this._accelCurTime = 0;
          scheduler.unscheduleUpdate(this);
        }

        if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED) {
          // @ts-ignore
          jsb.device.setMotionEnabled(isEnable);
        }
      }
    }, {
      key: "didAccelerate",
      value: function didAccelerate(eventData) {
        if (!this._accelEnabled) {
          return;
        }

        var mAcceleration = this._acceleration;
        var x = 0;
        var y = 0;
        var z = 0; // TODO
        // @ts-ignore

        if (this._accelDeviceEvent === window.DeviceMotionEvent) {
          var deviceMotionEvent = eventData;
          var eventAcceleration = deviceMotionEvent.accelerationIncludingGravity;

          if (eventAcceleration) {
            x = this._accelMinus * (eventAcceleration.x || 0) * 0.1;
            y = this._accelMinus * (eventAcceleration.y || 0) * 0.1;
            z = (eventAcceleration.z || 0) * 0.1;
          }
        } else {
          var deviceOrientationEvent = eventData;
          x = (deviceOrientationEvent.gamma || 0) / 90 * 0.981;
          y = -((deviceOrientationEvent.beta || 0) / 90) * 0.981;
          z = (deviceOrientationEvent.alpha || 0) / 90 * 0.981;
        }

        if (_globalExports.legacyCC.view._isRotated) {
          var tmp = x;
          x = -y;
          y = tmp;
        }

        mAcceleration.x = x;
        mAcceleration.y = y;
        mAcceleration.z = z;
        mAcceleration.timestamp = eventData.timeStamp || Date.now();
        var tmpX = mAcceleration.x;

        if (window.orientation === LANDSCAPE_RIGHT) {
          mAcceleration.x = -mAcceleration.y;
          mAcceleration.y = tmpX;
        } else if (window.orientation === LANDSCAPE_LEFT) {
          mAcceleration.x = mAcceleration.y;
          mAcceleration.y = -tmpX;
        } else if (window.orientation === PORTRAIT_UPSIDE_DOWN) {
          mAcceleration.x = -mAcceleration.x;
          mAcceleration.y = -mAcceleration.y;
        } // fix android acc values are opposite


        if (_globalExports.legacyCC.sys.os === _globalExports.legacyCC.sys.OS_ANDROID && _globalExports.legacyCC.sys.browserType !== _globalExports.legacyCC.sys.BROWSER_TYPE_MOBILE_QQ) {
          mAcceleration.x = -mAcceleration.x;
          mAcceleration.y = -mAcceleration.y;
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        if (this._accelCurTime > this._accelInterval) {
          this._accelCurTime -= this._accelInterval;

          _eventManager.default.dispatchEvent(new _events.EventAcceleration(this._acceleration));
        }

        this._accelCurTime += dt;
      }
      /**
       * set accelerometer interval value
       * @method setAccelerometerInterval
       * @param {Number} interval
       */

    }, {
      key: "setAccelerometerInterval",
      value: function setAccelerometerInterval(interval) {
        if (this._accelInterval !== interval) {
          this._accelInterval = interval;

          if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED) {
            // @ts-ignore
            if (jsb.device && jsb.device.setMotionInterval) {
              // @ts-ignore
              jsb.device.setMotionInterval(interval);
            }
          }
        }
      }
    }, {
      key: "_getUnUsedIndex",
      value: function _getUnUsedIndex() {
        var temp = this._indexBitsUsed;

        var now = _globalExports.legacyCC.director.getCurrentTime();

        for (var i = 0; i < this._maxTouches; i++) {
          if (!(temp & 0x00000001)) {
            this._indexBitsUsed |= 1 << i;
            return i;
          } else {
            var touch = this._touches[i];

            if (now - touch.lastModified > TOUCH_TIMEOUT) {
              this._removeUsedIndexBit(i);

              var touchID = touch.getID();

              if (touchID !== null) {
                delete this._touchesIntegerDict[touchID];
              }

              return i;
            }
          }

          temp >>= 1;
        } // all bits are used


        return -1;
      }
    }, {
      key: "_removeUsedIndexBit",
      value: function _removeUsedIndexBit(index) {
        if (index < 0 || index >= this._maxTouches) {
          return;
        }

        var temp = 1 << index;
        temp = ~temp;
        this._indexBitsUsed &= temp;
      }
    }, {
      key: "_registerMouseEvents",
      value: function _registerMouseEvents(element, prohibition) {
        // HACK
        //  - At the same time to trigger the ontouch event and onmouse event
        //  - The function will execute 2 times
        // The known browser:
        //  liebiao
        //  miui
        this._registerPointerLockEvent();

        if (!prohibition) {
          this._registerWindowMouseEvents(element);
        }

        this._registerElementMouseEvents(element, prohibition);
      }
    }, {
      key: "_registerPointerLockEvent",
      value: function _registerPointerLockEvent() {
        var _this = this;

        var lockChangeAlert = function lockChangeAlert() {
          var canvas = _globalExports.legacyCC.game.canvas; // @ts-ignore

          if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
            _this._pointLocked = true;
          } else {
            _this._pointLocked = false;
          }
        };

        if ('onpointerlockchange' in document) {
          document.addEventListener('pointerlockchange', lockChangeAlert, false);
        } else if ('onmozpointerlockchange' in document) {
          // @ts-ignore
          document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
        }
      }
    }, {
      key: "_registerWindowMouseEvents",
      value: function _registerWindowMouseEvents(element) {
        var _this2 = this;

        window.addEventListener('mousedown', function () {
          _this2._mousePressed = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
          if (!_this2._mousePressed) {
            return;
          }

          _this2._mousePressed = false;

          var position = _this2.getHTMLElementPosition(element);

          var location = _this2.getPointByEvent(event, position);

          var positionRect = (0, _rect.rect)(position.left, position.top, position.width, position.height);

          if (!positionRect.contains(new _index5.Vec2(location.x, location.y))) {
            _this2.handleTouchesEnd([_this2.getTouchByXY(event, location.x, location.y, position)]);

            var _mouseEvent = _this2.getMouseEvent(location, position, _events.EventMouse.UP);

            _mouseEvent.setButton(event.button);

            _eventManager.default.dispatchEvent(_mouseEvent);
          }
        }, false);
      }
    }, {
      key: "_registerElementMouseEvents",
      value: function _registerElementMouseEvents(element, prohibition) {
        var _this3 = this;

        // Register canvas mouse events.
        var listenDOMMouseEvent = function listenDOMMouseEvent(eventName, type, handler) {
          element.addEventListener(eventName, function (event) {
            var pos = _this3.getHTMLElementPosition(element);

            var location = _this3.getPointByEvent(event, pos);

            var mouseEvent = _this3.getMouseEvent(location, pos, type);

            mouseEvent.setButton(event.button);
            handler(event, mouseEvent, location, pos);

            _eventManager.default.dispatchEvent(mouseEvent);

            event.stopPropagation();
            event.preventDefault();
          });
        };

        if (!prohibition) {
          listenDOMMouseEvent('mousedown', _events.EventMouse.DOWN, function (event, mouseEvent, location, pos) {
            _this3._mousePressed = true;

            _this3.handleTouchesBegin([_this3.getTouchByXY(event, location.x, location.y, pos)]);

            element.focus();
          });
          listenDOMMouseEvent('mouseup', _events.EventMouse.UP, function (event, mouseEvent, location, pos) {
            _this3._mousePressed = false;

            _this3.handleTouchesEnd([_this3.getTouchByXY(event, location.x, location.y, pos)]);
          });
          listenDOMMouseEvent('mousemove', _events.EventMouse.MOVE, function (event, mouseEvent, location, pos) {
            _this3.handleTouchesMove([_this3.getTouchByXY(event, location.x, location.y, pos)]);

            if (!_this3._mousePressed) {
              mouseEvent.setButton(_events.EventMouse.BUTTON_MISSING);
            }

            if (event.movementX !== undefined && event.movementY !== undefined) {
              mouseEvent.movementX = event.movementX;
              mouseEvent.movementY = event.movementY;
            }
          });
        } // @ts-ignore


        listenDOMMouseEvent('mousewheel', _events.EventMouse.SCROLL, function (event, mouseEvent, location, pos) {
          // @ts-ignore
          mouseEvent.setScrollData(0, event.wheelDelta);
        });
        /* firefox fix */
        // @ts-ignore

        listenDOMMouseEvent('DOMMouseScroll', _events.EventMouse.SCROLL, function (event, mouseEvent, location, pos) {
          mouseEvent.setScrollData(0, event.detail * -120);
        });
      }
    }, {
      key: "_registerMousePointerEvents",
      value: function _registerMousePointerEvents(element) {
        var _this4 = this;

        var _pointerEventsMap = {
          MSPointerDown: this.handleTouchesBegin,
          MSPointerMove: this.handleTouchesMove,
          MSPointerUp: this.handleTouchesEnd,
          MSPointerCancel: this.handleTouchesCancel
        }; // tslint:disable-next-line: forin

        var _loop = function _loop(eventName) {
          var touchEvent = _pointerEventsMap[eventName]; // @ts-ignore

          element.addEventListener(eventName, function (event) {
            var pos = _this4.getHTMLElementPosition(element);

            pos.left -= document.documentElement.scrollLeft;
            pos.top -= document.documentElement.scrollTop;
            touchEvent.call(_this4, [_this4.getTouchByXY(event, event.clientX, event.clientY, pos)]);
            event.stopPropagation();
          }, false);
        };

        for (var eventName in _pointerEventsMap) {
          _loop(eventName);
        }
      }
    }, {
      key: "_registerTouchEvents",
      value: function _registerTouchEvents(element) {
        var _this5 = this;

        var makeTouchListener = function makeTouchListener(touchesHandler) {
          return function (event) {
            if (!event.changedTouches) {
              return;
            }

            var pos = _this5.getHTMLElementPosition(element);

            var body = document.body;
            pos.left -= body.scrollLeft || 0;
            pos.top -= body.scrollTop || 0;
            touchesHandler(_this5.getTouchesByEvent(event, pos));
            event.stopPropagation();
            event.preventDefault();
          };
        };

        element.addEventListener('touchstart', makeTouchListener(function (touchesToHandle) {
          _this5.handleTouchesBegin(touchesToHandle);

          element.focus();
        }), false);
        element.addEventListener('touchmove', makeTouchListener(function (touchesToHandle) {
          _this5.handleTouchesMove(touchesToHandle);
        }), false);
        element.addEventListener('touchend', makeTouchListener(function (touchesToHandle) {
          _this5.handleTouchesEnd(touchesToHandle);
        }), false);
        element.addEventListener('touchcancel', makeTouchListener(function (touchesToHandle) {
          _this5.handleTouchesCancel(touchesToHandle);
        }), false);
      }
    }, {
      key: "_registerKeyboardEvent",
      value: function _registerKeyboardEvent() {
        var canvas = _globalExports.legacyCC.game.canvas;
        canvas.addEventListener('keydown', function (event) {
          _eventManager.default.dispatchEvent(new _events.EventKeyboard(event, true));

          event.stopPropagation();
          event.preventDefault();
        }, false);
        canvas.addEventListener('keyup', function (event) {
          _eventManager.default.dispatchEvent(new _events.EventKeyboard(event, false));

          event.stopPropagation();
          event.preventDefault();
        }, false);
      }
    }, {
      key: "_registerAccelerometerEvent",
      value: function _registerAccelerometerEvent() {
        var _this6 = this;

        this._acceleration = new Acceleration(); // TODO
        // @ts-ignore

        this._accelDeviceEvent = window.DeviceMotionEvent || window.DeviceOrientationEvent; // TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.

        if (_globalExports.legacyCC.sys.browserType === _globalExports.legacyCC.sys.BROWSER_TYPE_MOBILE_QQ) {
          // TODO
          // @ts-ignore
          this._accelDeviceEvent = window.DeviceOrientationEvent;
        }

        var _deviceEventType = // TODO
        // @ts-ignore
        this._accelDeviceEvent === window.DeviceMotionEvent ? 'devicemotion' : 'deviceorientation'; // @ts-ignore


        _didAccelerateFun = function _didAccelerateFun() {
          return _this6.didAccelerate.apply(_this6, arguments);
        };

        window.addEventListener(_deviceEventType, _didAccelerateFun, false);
      }
    }, {
      key: "_unregisterAccelerometerEvent",
      value: function _unregisterAccelerometerEvent() {
        var _deviceEventType = // TODO
        // @ts-ignore
        this._accelDeviceEvent === window.DeviceMotionEvent ? 'devicemotion' : 'deviceorientation';

        if (_didAccelerateFun) {
          window.removeEventListener(_deviceEventType, _didAccelerateFun, false);
        }
      }
    }, {
      key: "_getUsefulTouches",
      value: function _getUsefulTouches() {
        var touches = [];
        var touchDict = this._touchesIntegerDict;

        for (var id in touchDict) {
          var _index4 = parseInt(id);

          var usedID = touchDict[_index4];

          if (usedID === undefined || usedID === null) {
            continue;
          }

          var touch = this._touches[usedID];
          touches.push(touch);
        }

        return touches;
      }
    }]);

    return InputManager;
  }();

  var inputManager = new InputManager();
  var _default = inputManager;
  _exports.default = _default;
  _globalExports.legacyCC.internal.inputManager = inputManager;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9pbnB1dC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbIlRPVUNIX1RJTUVPVVQiLCJtYWNybyIsIlBPUlRSQUlUIiwiTEFORFNDQVBFX0xFRlQiLCJQT1JUUkFJVF9VUFNJREVfRE9XTiIsIkxBTkRTQ0FQRV9SSUdIVCIsIl9kaWRBY2NlbGVyYXRlRnVuIiwiX3ZlYzIiLCJWZWMyIiwiX3ByZUxvY2F0aW9uIiwiQWNjZWxlcmF0aW9uIiwieCIsInkiLCJ6IiwidGltZXN0YW1wIiwibGVnYWN5Q0MiLCJpbnRlcm5hbCIsIklucHV0TWFuYWdlciIsIl9tb3VzZVByZXNzZWQiLCJfaXNSZWdpc3RlckV2ZW50IiwiX3ByZVRvdWNoUG9pbnQiLCJfcHJldk1vdXNlUG9pbnQiLCJfcHJlVG91Y2hQb29sIiwiX3ByZVRvdWNoUG9vbFBvaW50ZXIiLCJfdG91Y2hlcyIsIl90b3VjaGVzSW50ZWdlckRpY3QiLCJfaW5kZXhCaXRzVXNlZCIsIl9tYXhUb3VjaGVzIiwiX2FjY2VsRW5hYmxlZCIsIl9hY2NlbEludGVydmFsIiwiX2FjY2VsTWludXMiLCJfYWNjZWxDdXJUaW1lIiwiX2FjY2VsZXJhdGlvbiIsIl9hY2NlbERldmljZUV2ZW50IiwiX2dsVmlldyIsIl9wb2ludExvY2tlZCIsInRvdWNoZXMiLCJoYW5kbGVUb3VjaGVzIiwibG9jVG91Y2hJbnREaWN0IiwiaSIsImxlbmd0aCIsInRvdWNoIiwidG91Y2hJRCIsImdldElEIiwiaW5kZXgiLCJ1bmRlZmluZWQiLCJ1bnVzZWRJbmRleCIsIl9nZXRVblVzZWRJbmRleCIsImdldExvY2F0aW9uIiwiY3VyVG91Y2giLCJUb3VjaCIsImdldFByZXZpb3VzTG9jYXRpb24iLCJzZXRQcmV2UG9pbnQiLCJwdXNoIiwidG91Y2hFdmVudCIsIkV2ZW50VG91Y2giLCJCRUdBTiIsIkVOQUJMRV9NVUxUSV9UT1VDSCIsIl9nZXRVc2VmdWxUb3VjaGVzIiwiZXZlbnRNYW5hZ2VyIiwiZGlzcGF0Y2hFdmVudCIsImxvY1RvdWNoZXMiLCJzZXRQb2ludCIsIk1PVkVEIiwiZ2V0U2V0T2ZUb3VjaGVzRW5kT3JDYW5jZWwiLCJFTkRFRCIsIkNBTkNFTExFRCIsImxvY1RvdWNoZXNJbnREaWN0IiwiX3JlbW92ZVVzZWRJbmRleEJpdCIsImVsZW1lbnQiLCJkb2NFbGVtIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJsZWZ0T2Zmc2V0Iiwic3lzIiwib3MiLCJPU19JT1MiLCJpc0Jyb3dzZXIiLCJ3aW5kb3ciLCJzY3JlZW5MZWZ0IiwicGFnZVhPZmZzZXQiLCJjbGllbnRMZWZ0IiwidG9wT2Zmc2V0Iiwic2NyZWVuVG9wIiwicGFnZVlPZmZzZXQiLCJjbGllbnRUb3AiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3giLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJIVE1MQ2FudmFzRWxlbWVudCIsInBhcnNlSW50Iiwic3R5bGUiLCJwcmVUb3VjaCIsImxvY1ByZVRvdWNoUG9vbCIsImlkIiwiZmluZCIsImV2ZW50IiwidHgiLCJ0eSIsInBvcyIsImxvY1ByZVRvdWNoIiwibG9jYXRpb24iLCJjb252ZXJ0VG9Mb2NhdGlvbkluVmlldyIsIm1vdmVtZW50WCIsIm1vdmVtZW50WSIsImV2ZW50VHlwZSIsImxvY1ByZU1vdXNlIiwibW91c2VFdmVudCIsIkV2ZW50TW91c2UiLCJfY29udmVydE1vdXNlVG9Mb2NhdGlvbiIsInNldExvY2F0aW9uIiwicGFnZVgiLCJwYWdlWSIsImJvZHkiLCJzY3JvbGxMZWZ0Iiwic2Nyb2xsVG9wIiwiY2xpZW50WCIsImNsaWVudFkiLCJwb3NpdGlvbiIsImxvY1ZpZXciLCJjaGFuZ2VkVG91Y2hlcyIsImNoYW5nZWRUb3VjaCIsIkJST1dTRVJfVFlQRV9GSVJFRk9YIiwiYnJvd3NlclR5cGUiLCJpZGVudGlmaWVyIiwiZ2V0UHJlVG91Y2giLCJzZXRQcmVUb3VjaCIsInZpZXciLCJwcm9oaWJpdGlvbiIsImlzTW9iaWxlIiwic3VwcG9ydE1vdXNlIiwiY2FwYWJpbGl0aWVzIiwic3VwcG9ydFRvdWNoZXMiLCJfcmVnaXN0ZXJNb3VzZUV2ZW50cyIsIm5hdmlnYXRvciIsIm1zUG9pbnRlckVuYWJsZWQiLCJfcmVnaXN0ZXJNb3VzZVBvaW50ZXJFdmVudHMiLCJfcmVnaXN0ZXJUb3VjaEV2ZW50cyIsIl9yZWdpc3RlcktleWJvYXJkRXZlbnQiLCJpc0VuYWJsZSIsInNjaGVkdWxlciIsImRpcmVjdG9yIiwiZ2V0U2NoZWR1bGVyIiwiZW5hYmxlRm9yVGFyZ2V0IiwiX3JlZ2lzdGVyQWNjZWxlcm9tZXRlckV2ZW50Iiwic2NoZWR1bGVVcGRhdGUiLCJfdW5yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCIsInVuc2NoZWR1bGVVcGRhdGUiLCJKU0IiLCJSVU5USU1FX0JBU0VEIiwianNiIiwiZGV2aWNlIiwic2V0TW90aW9uRW5hYmxlZCIsImV2ZW50RGF0YSIsIm1BY2NlbGVyYXRpb24iLCJEZXZpY2VNb3Rpb25FdmVudCIsImRldmljZU1vdGlvbkV2ZW50IiwiZXZlbnRBY2NlbGVyYXRpb24iLCJhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IiwiZGV2aWNlT3JpZW50YXRpb25FdmVudCIsImdhbW1hIiwiYmV0YSIsImFscGhhIiwiX2lzUm90YXRlZCIsInRtcCIsInRpbWVTdGFtcCIsIkRhdGUiLCJub3ciLCJ0bXBYIiwib3JpZW50YXRpb24iLCJPU19BTkRST0lEIiwiQlJPV1NFUl9UWVBFX01PQklMRV9RUSIsImR0IiwiRXZlbnRBY2NlbGVyYXRpb24iLCJpbnRlcnZhbCIsInNldE1vdGlvbkludGVydmFsIiwidGVtcCIsImdldEN1cnJlbnRUaW1lIiwibGFzdE1vZGlmaWVkIiwiX3JlZ2lzdGVyUG9pbnRlckxvY2tFdmVudCIsIl9yZWdpc3RlcldpbmRvd01vdXNlRXZlbnRzIiwiX3JlZ2lzdGVyRWxlbWVudE1vdXNlRXZlbnRzIiwibG9ja0NoYW5nZUFsZXJ0IiwiY2FudmFzIiwiZ2FtZSIsInBvaW50ZXJMb2NrRWxlbWVudCIsIm1velBvaW50ZXJMb2NrRWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJnZXRIVE1MRWxlbWVudFBvc2l0aW9uIiwiZ2V0UG9pbnRCeUV2ZW50IiwicG9zaXRpb25SZWN0IiwiY29udGFpbnMiLCJoYW5kbGVUb3VjaGVzRW5kIiwiZ2V0VG91Y2hCeVhZIiwiZ2V0TW91c2VFdmVudCIsIlVQIiwic2V0QnV0dG9uIiwiYnV0dG9uIiwibGlzdGVuRE9NTW91c2VFdmVudCIsImV2ZW50TmFtZSIsInR5cGUiLCJoYW5kbGVyIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJET1dOIiwiaGFuZGxlVG91Y2hlc0JlZ2luIiwiZm9jdXMiLCJNT1ZFIiwiaGFuZGxlVG91Y2hlc01vdmUiLCJCVVRUT05fTUlTU0lORyIsIlNDUk9MTCIsInNldFNjcm9sbERhdGEiLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwiX3BvaW50ZXJFdmVudHNNYXAiLCJNU1BvaW50ZXJEb3duIiwiTVNQb2ludGVyTW92ZSIsIk1TUG9pbnRlclVwIiwiTVNQb2ludGVyQ2FuY2VsIiwiaGFuZGxlVG91Y2hlc0NhbmNlbCIsImNhbGwiLCJtYWtlVG91Y2hMaXN0ZW5lciIsInRvdWNoZXNIYW5kbGVyIiwiZ2V0VG91Y2hlc0J5RXZlbnQiLCJ0b3VjaGVzVG9IYW5kbGUiLCJFdmVudEtleWJvYXJkIiwiRGV2aWNlT3JpZW50YXRpb25FdmVudCIsIl9kZXZpY2VFdmVudFR5cGUiLCJkaWRBY2NlbGVyYXRlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRvdWNoRGljdCIsInVzZWRJRCIsImlucHV0TWFuYWdlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Q0EsTUFBTUEsYUFBYSxHQUFHQyxhQUFNRCxhQUE1QjtBQUVBLE1BQU1FLFFBQVEsR0FBRyxDQUFqQjtBQUNBLE1BQU1DLGNBQWMsR0FBRyxDQUFDLEVBQXhCO0FBQ0EsTUFB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QUFDQXpKLFFBQUFBLE1BQU0sQ0FBQ2dILGdCQUFQLENBQXdCd0MsZ0JBQXhCLEVBQTBDaE8saUJBQTFDLEVBQTZELEtBQTdEO0FBQ0g7OztzREFFd0M7QUFDckMsWUFBTWdPLGdCQUFnQixHQUNsQjtBQUNBO0FBQ0EsYUFBS3JNLGlCQUFMLEtBQTJCNkMsTUFBTSxDQUFDZ0YsaUJBQWxDLEdBQXNELGNBQXRELEdBQXVFLG1CQUgzRTs7QUFJQSxZQUFJeEosaUJBQUosRUFBdUI7QUFDbkJ3RSxVQUFBQSxNQUFNLENBQUMwSixtQkFBUCxDQUEyQkYsZ0JBQTNCLEVBQTZDaE8saUJBQTdDLEVBQWdFLEtBQWhFO0FBQ0g7QUFDSjs7OzBDQUU0QjtBQUN6QixZQUFNOEIsT0FBZ0IsR0FBRyxFQUF6QjtBQUNBLFlBQU1xTSxTQUFTLEdBQUcsS0FBS2hOLG1CQUF2Qjs7QUFDQSxhQUFLLElBQU13RSxFQUFYLElBQWlCd0ksU0FBakIsRUFBNEI7QUFDeEIsY0FBTTdMLE9BQUssR0FBR2lELFFBQVEsQ0FBQ0ksRUFBRCxDQUF0Qjs7QUFDQSxjQUFNeUksTUFBTSxHQUFHRCxTQUFTLENBQUM3TCxPQUFELENBQXhCOztBQUNBLGNBQUk4TCxNQUFNLEtBQUs3TCxTQUFYLElBQXdCNkwsTUFBTSxLQUFLLElBQXZDLEVBQTZDO0FBQ3pDO0FBQ0g7O0FBRUQsY0FBTWpNLEtBQUssR0FBRyxLQUFLakIsUUFBTCxDQUFja04sTUFBZCxDQUFkO0FBQ0F0TSxVQUFBQSxPQUFPLENBQUNpQixJQUFSLENBQWFaLEtBQWI7QUFDSDs7QUFFRCxlQUFPTCxPQUFQO0FBQ0g7Ozs7OztBQUlMLE1BQU11TSxZQUFZLEdBQUcsSUFBSTFOLFlBQUosRUFBckI7aUJBRWUwTixZOztBQUVmNU4sMEJBQVNDLFFBQVQsQ0FBa0IyTixZQUFsQixHQUFpQ0EsWUFBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uLy4uL21hdGgvaW5kZXgnO1xyXG5pbXBvcnQgeyByZWN0IH0gZnJvbSAnLi4vLi4vbWF0aC9yZWN0JztcclxuaW1wb3J0IHsgbWFjcm8gfSBmcm9tICcuLi9tYWNybyc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4uL3N5cyc7XHJcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgRXZlbnRBY2NlbGVyYXRpb24sIEV2ZW50S2V5Ym9hcmQsIEV2ZW50TW91c2UsIEV2ZW50VG91Y2ggfSBmcm9tICcuL2V2ZW50cyc7XHJcbmltcG9ydCB7IFRvdWNoIH0gZnJvbSAnLi90b3VjaCc7XHJcbmltcG9ydCB7IEpTQiwgUlVOVElNRV9CQVNFRCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBsb2dJRCB9IGZyb20gJy4uL2RlYnVnJztcclxuXHJcbmNvbnN0IFRPVUNIX1RJTUVPVVQgPSBtYWNyby5UT1VDSF9USU1FT1VUO1xyXG5cclxuY29uc3QgUE9SVFJBSVQgPSAwO1xyXG5jb25zdCBMQU5EU0NBUEVfTEVGVCA9IC05MDtcclxuY29uc3QgUE9SVFJBSVRfVVBTSURFX0RPV04gPSAxODA7XHJcbmNvbnN0IExBTkRTQ0FQRV9SSUdIVCA9IDkwO1xyXG5cclxubGV0IF9kaWRBY2NlbGVyYXRlRnVuO1xyXG5cclxuY29uc3QgX3ZlYzIgPSBuZXcgVmVjMigpO1xyXG5jb25zdCBfcHJlTG9jYXRpb24gPSBuZXcgVmVjMigpO1xyXG5cclxuaW50ZXJmYWNlIElIVE1MRWxlbWVudFBvc2l0aW9uIHtcclxuICAgIGxlZnQ6IG51bWJlcjtcclxuICAgIHRvcDogbnVtYmVyO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVZpZXcge1xyXG4gICAgY29udmVydFRvTG9jYXRpb25JblZpZXcgKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGVsZW1lbnRQb3NpdGlvbjogSUhUTUxFbGVtZW50UG9zaXRpb24sIG91dD86IFZlYzIpOiBWZWMyO1xyXG5cclxuICAgIF9jb252ZXJ0TW91c2VUb0xvY2F0aW9uIChwb2ludDogVmVjMiwgZWxlbWVudFBvc2l0aW9uOiBJSFRNTEVsZW1lbnRQb3NpdGlvbik6IHZvaWQ7XHJcbiAgICAvLyBfY29udmVydE1vdXNlVG9Mb2NhdGlvbkluVmlldyAocG9pbnQ6IFZlYzIsIGVsZW1lbnRQb3NpdGlvbjogSUhUTUxFbGVtZW50UG9zaXRpb24pOiB2b2lkO1xyXG5cclxuICAgIC8vIF9jb252ZXJ0VG91Y2hlc1dpdGhTY2FsZSAodG91Y2hlczogVG91Y2hbXSk6IHZvaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gdGhlIGRldmljZSBhY2NlbGVyb21ldGVyIHJlcG9ydHMgdmFsdWVzIGZvciBlYWNoIGF4aXMgaW4gdW5pdHMgb2YgZy1mb3JjZS5cclxuICogQHpoIOiuvuWkh+mHjeWKm+S8oOaEn+WZqOS8oOmAkueahOWQhOS4qui9tOeahOaVsOaNruOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFjY2VsZXJhdGlvbiB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB6OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdGltZXN0YW1wOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvciAoeCA9IDAsIHkgPSAwLCB6ID0gMCwgdGltZXN0YW1wID0gMCkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnogPSB6O1xyXG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgfVxyXG59XHJcbmxlZ2FjeUNDLmludGVybmFsLkFjY2VsZXJhdGlvbiA9IEFjY2VsZXJhdGlvbjtcclxuXHJcbi8qKlxyXG4gKiAgVGhpcyBjbGFzcyBtYW5hZ2VzIGFsbCBldmVudHMgb2YgaW5wdXQuIGluY2x1ZGU6IHRvdWNoLCBtb3VzZSwgYWNjZWxlcm9tZXRlciwga2V5Ym9hcmRcclxuICovXHJcbmNsYXNzIElucHV0TWFuYWdlciB7XHJcbiAgICBwcml2YXRlIF9tb3VzZVByZXNzZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9pc1JlZ2lzdGVyRXZlbnQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9wcmVUb3VjaFBvaW50ID0gbmV3IFZlYzIoKTtcclxuICAgIHByaXZhdGUgX3ByZXZNb3VzZVBvaW50ID0gbmV3IFZlYzIoKTtcclxuXHJcbiAgICBwcml2YXRlIF9wcmVUb3VjaFBvb2w6IFRvdWNoW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3ByZVRvdWNoUG9vbFBvaW50ZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX3RvdWNoZXM6IFRvdWNoW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3RvdWNoZXNJbnRlZ2VyRGljdDogeyBbaW5kZXg6IG51bWJlcl06IG51bWJlciB8IHVuZGVmaW5lZDsgfSA9IHsgfTtcclxuXHJcbiAgICBwcml2YXRlIF9pbmRleEJpdHNVc2VkID0gMDtcclxuICAgIHByaXZhdGUgX21heFRvdWNoZXMgPSA4O1xyXG5cclxuICAgIHByaXZhdGUgX2FjY2VsRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfYWNjZWxJbnRlcnZhbCA9IDEgLyA1O1xyXG4gICAgcHJpdmF0ZSBfYWNjZWxNaW51cyA9IDE7XHJcbiAgICBwcml2YXRlIF9hY2NlbEN1clRpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBfYWNjZWxlcmF0aW9uOiBBY2NlbGVyYXRpb24gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2FjY2VsRGV2aWNlRXZlbnQgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX2dsVmlldzogSVZpZXcgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9wb2ludExvY2tlZCA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBoYW5kbGVUb3VjaGVzQmVnaW4gKHRvdWNoZXM6IFRvdWNoW10pIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVUb3VjaGVzOiBUb3VjaFtdID0gW107XHJcbiAgICAgICAgY29uc3QgbG9jVG91Y2hJbnREaWN0ID0gdGhpcy5fdG91Y2hlc0ludGVnZXJEaWN0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IHRvdWNoZXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoSUQgPSB0b3VjaC5nZXRJRCgpO1xyXG4gICAgICAgICAgICBpZiAodG91Y2hJRCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBsb2NUb3VjaEludERpY3RbdG91Y2hJRF07XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bnVzZWRJbmRleCA9IHRoaXMuX2dldFVuVXNlZEluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodW51c2VkSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nSUQoMjMwMCwgdW51c2VkSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY3VyVG91Y2ggPSB0aGlzLl90b3VjaGVzW3VudXNlZEluZGV4XSA9IHRvdWNoO1xyXG4gICAgICAgICAgICAgICAgdG91Y2guZ2V0TG9jYXRpb24oX3ZlYzIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VyVG91Y2ggPSBuZXcgVG91Y2goX3ZlYzIueCwgX3ZlYzIueSwgdG91Y2hJRCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaGVzW3VudXNlZEluZGV4XSA9IGN1clRvdWNoO1xyXG4gICAgICAgICAgICAgICAgdG91Y2guZ2V0UHJldmlvdXNMb2NhdGlvbihfdmVjMik7XHJcbiAgICAgICAgICAgICAgICBjdXJUb3VjaC5zZXRQcmV2UG9pbnQoX3ZlYzIpO1xyXG4gICAgICAgICAgICAgICAgbG9jVG91Y2hJbnREaWN0W3RvdWNoSURdID0gdW51c2VkSW5kZXg7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVUb3VjaGVzLnB1c2goY3VyVG91Y2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoYW5kbGVUb3VjaGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5fZ2xWaWV3IS5fY29udmVydFRvdWNoZXNXaXRoU2NhbGUoaGFuZGxlVG91Y2hlcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoRXZlbnQgPSBuZXcgRXZlbnRUb3VjaChoYW5kbGVUb3VjaGVzLCBmYWxzZSwgRXZlbnRUb3VjaC5CRUdBTiwgbWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIID8gdGhpcy5fZ2V0VXNlZnVsVG91Y2hlcygpIDogaGFuZGxlVG91Y2hlcyk7XHJcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRvdWNoRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFuZGxlVG91Y2hlc01vdmUgKHRvdWNoZXM6IFRvdWNoW10pIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVUb3VjaGVzOiBUb3VjaFtdID0gW107XHJcbiAgICAgICAgY29uc3QgbG9jVG91Y2hlcyA9IHRoaXMuX3RvdWNoZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoID0gdG91Y2hlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgdG91Y2hJRCA9IHRvdWNoLmdldElEKCk7XHJcbiAgICAgICAgICAgIGlmICh0b3VjaElEID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RvdWNoZXNJbnRlZ2VyRGljdFt0b3VjaElEXTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhcImlmIHRoZSBpbmRleCBkb2Vzbid0IGV4aXN0LCBpdCBpcyBhbiBlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsb2NUb3VjaGVzW2luZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdG91Y2guZ2V0TG9jYXRpb24oX3ZlYzIpO1xyXG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uc2V0UG9pbnQoX3ZlYzIpO1xyXG4gICAgICAgICAgICAgICAgdG91Y2guZ2V0UHJldmlvdXNMb2NhdGlvbihfdmVjMik7XHJcbiAgICAgICAgICAgICAgICBsb2NUb3VjaGVzW2luZGV4XS5zZXRQcmV2UG9pbnQoX3ZlYzIpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlVG91Y2hlcy5wdXNoKGxvY1RvdWNoZXNbaW5kZXhdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaGFuZGxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX2dsVmlldyEuX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlKGhhbmRsZVRvdWNoZXMpO1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gbmV3IEV2ZW50VG91Y2goaGFuZGxlVG91Y2hlcywgZmFsc2UsIEV2ZW50VG91Y2guTU9WRUQsIG1hY3JvLkVOQUJMRV9NVUxUSV9UT1VDSCA/IHRoaXMuX2dldFVzZWZ1bFRvdWNoZXMoKSA6IGhhbmRsZVRvdWNoZXMpO1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCh0b3VjaEV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhbmRsZVRvdWNoZXNFbmQgKHRvdWNoZXM6IFRvdWNoW10pIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVUb3VjaGVzID0gdGhpcy5nZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCh0b3VjaGVzKTtcclxuICAgICAgICBpZiAoaGFuZGxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX2dsVmlldyEuX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlKGhhbmRsZVRvdWNoZXMpO1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gbmV3IEV2ZW50VG91Y2goaGFuZGxlVG91Y2hlcywgZmFsc2UsIEV2ZW50VG91Y2guRU5ERUQsIG1hY3JvLkVOQUJMRV9NVUxUSV9UT1VDSCA/IHRoaXMuX2dldFVzZWZ1bFRvdWNoZXMoKSA6IGhhbmRsZVRvdWNoZXMpO1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCh0b3VjaEV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJlVG91Y2hQb29sLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhbmRsZVRvdWNoZXNDYW5jZWwgKHRvdWNoZXM6IFRvdWNoW10pIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVUb3VjaGVzID0gdGhpcy5nZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCh0b3VjaGVzKTtcclxuICAgICAgICBpZiAoaGFuZGxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX2dsVmlldyEuX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlKGhhbmRsZVRvdWNoZXMpO1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gbmV3IEV2ZW50VG91Y2goaGFuZGxlVG91Y2hlcywgZmFsc2UsIEV2ZW50VG91Y2guQ0FOQ0VMTEVELCBtYWNyby5FTkFCTEVfTVVMVElfVE9VQ0ggPyB0aGlzLl9nZXRVc2VmdWxUb3VjaGVzKCkgOiBoYW5kbGVUb3VjaGVzKTtcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQodG91Y2hFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3ByZVRvdWNoUG9vbC5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCAodG91Y2hlczogVG91Y2hbXSkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZVRvdWNoZXM6IFRvdWNoW10gPSBbXTtcclxuICAgICAgICBjb25zdCBsb2NUb3VjaGVzID0gdGhpcy5fdG91Y2hlcztcclxuICAgICAgICBjb25zdCBsb2NUb3VjaGVzSW50RGljdCA9IHRoaXMuX3RvdWNoZXNJbnRlZ2VyRGljdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSB0b3VjaGVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaElEID0gdG91Y2guZ2V0SUQoKTtcclxuICAgICAgICAgICAgaWYgKHRvdWNoSUQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbG9jVG91Y2hlc0ludERpY3RbdG91Y2hJRF07XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJpZiB0aGUgaW5kZXggZG9lc24ndCBleGlzdCwgaXQgaXMgYW4gZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobG9jVG91Y2hlc1tpbmRleF0pIHtcclxuICAgICAgICAgICAgICAgIHRvdWNoLmdldExvY2F0aW9uKF92ZWMyKTtcclxuICAgICAgICAgICAgICAgIGxvY1RvdWNoZXNbaW5kZXhdLnNldFBvaW50KF92ZWMyKTtcclxuICAgICAgICAgICAgICAgIHRvdWNoLmdldFByZXZpb3VzTG9jYXRpb24oX3ZlYzIpO1xyXG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uc2V0UHJldlBvaW50KF92ZWMyKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVRvdWNoZXMucHVzaChsb2NUb3VjaGVzW2luZGV4XSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVc2VkSW5kZXhCaXQoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY1RvdWNoZXNJbnREaWN0W3RvdWNoSURdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoYW5kbGVUb3VjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIVE1MRWxlbWVudFBvc2l0aW9uIChlbGVtZW50OiBIVE1MRWxlbWVudCk6IElIVE1MRWxlbWVudFBvc2l0aW9uIHtcclxuICAgICAgICBjb25zdCBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgIGxldCBsZWZ0T2Zmc2V0ID0gc3lzLm9zID09PSBzeXMuT1NfSU9TICYmIHN5cy5pc0Jyb3dzZXIgPyB3aW5kb3cuc2NyZWVuTGVmdCA6IHdpbmRvdy5wYWdlWE9mZnNldDtcclxuICAgICAgICBsZWZ0T2Zmc2V0IC09IGRvY0VsZW0uY2xpZW50TGVmdDtcclxuICAgICAgICBsZXQgdG9wT2Zmc2V0ID0gc3lzLm9zID09PSBzeXMuT1NfSU9TICYmIHN5cy5pc0Jyb3dzZXIgPyB3aW5kb3cuc2NyZWVuVG9wIDogd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG4gICAgICAgIHRvcE9mZnNldCAtPSBkb2NFbGVtLmNsaWVudFRvcDtcclxuICAgICAgICBpZiAoZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcclxuICAgICAgICAgICAgY29uc3QgYm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgbGVmdE9mZnNldCxcclxuICAgICAgICAgICAgICAgIHRvcDogYm94LnRvcCArIHRvcE9mZnNldCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBib3gud2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJveC5oZWlnaHQsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0T2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdG9wT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50LndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0T2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdG9wT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUludChlbGVtZW50LnN0eWxlLndpZHRoIHx8ICcwJywgdW5kZWZpbmVkKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHBhcnNlSW50KGVsZW1lbnQuc3R5bGUuaGVpZ2h0IHx8ICcwJywgdW5kZWZpbmVkKSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFByZVRvdWNoICh0b3VjaDogVG91Y2gpIHtcclxuICAgICAgICBsZXQgcHJlVG91Y2g6IFRvdWNoIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgbG9jUHJlVG91Y2hQb29sID0gdGhpcy5fcHJlVG91Y2hQb29sO1xyXG4gICAgICAgIGNvbnN0IGlkID0gdG91Y2guZ2V0SUQoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gbG9jUHJlVG91Y2hQb29sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGlmIChsb2NQcmVUb3VjaFBvb2xbaV0uZ2V0SUQoKSA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIHByZVRvdWNoID0gbG9jUHJlVG91Y2hQb29sW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcmVUb3VjaCkge1xyXG4gICAgICAgICAgICBwcmVUb3VjaCA9IHRvdWNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJlVG91Y2g7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFByZVRvdWNoICh0b3VjaDogVG91Y2gpIHtcclxuICAgICAgICBsZXQgZmluZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGxvY1ByZVRvdWNoUG9vbCA9IHRoaXMuX3ByZVRvdWNoUG9vbDtcclxuICAgICAgICBjb25zdCBpZCA9IHRvdWNoLmdldElEKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGxvY1ByZVRvdWNoUG9vbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBpZiAobG9jUHJlVG91Y2hQb29sW2ldLmdldElEKCkgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NQcmVUb3VjaFBvb2xbaV0gPSB0b3VjaDtcclxuICAgICAgICAgICAgICAgIGZpbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmaW5kKSB7XHJcbiAgICAgICAgICAgIGlmIChsb2NQcmVUb3VjaFBvb2wubGVuZ3RoIDw9IDUwKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NQcmVUb3VjaFBvb2wucHVzaCh0b3VjaCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2NQcmVUb3VjaFBvb2xbdGhpcy5fcHJlVG91Y2hQb29sUG9pbnRlcl0gPSB0b3VjaDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZVRvdWNoUG9vbFBvaW50ZXIgPSAodGhpcy5fcHJlVG91Y2hQb29sUG9pbnRlciArIDEpICUgNTA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRvdWNoQnlYWSAoZXZlbnQ6IE1vdXNlRXZlbnQsIHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIHBvczogSUhUTUxFbGVtZW50UG9zaXRpb24pIHtcclxuICAgICAgICBjb25zdCBsb2NQcmVUb3VjaCA9IHRoaXMuX3ByZVRvdWNoUG9pbnQ7XHJcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLl9nbFZpZXchLmNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3KHR4LCB0eSwgcG9zKTtcclxuICAgICAgICBpZiAodGhpcy5fcG9pbnRMb2NrZWQpIHtcclxuICAgICAgICAgICAgbG9jYXRpb24ueCA9IGxvY1ByZVRvdWNoLnggKyBldmVudC5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLnkgPSBsb2NQcmVUb3VjaC55IC0gZXZlbnQubW92ZW1lbnRZO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0b3VjaCA9IG5ldyBUb3VjaChsb2NhdGlvbi54LCAgbG9jYXRpb24ueSwgMCk7XHJcbiAgICAgICAgdG91Y2guc2V0UHJldlBvaW50KGxvY1ByZVRvdWNoLngsIGxvY1ByZVRvdWNoLnkpO1xyXG4gICAgICAgIGxvY1ByZVRvdWNoLnggPSBsb2NhdGlvbi54O1xyXG4gICAgICAgIGxvY1ByZVRvdWNoLnkgPSBsb2NhdGlvbi55O1xyXG4gICAgICAgIHJldHVybiB0b3VjaDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TW91c2VFdmVudCAobG9jYXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IH0sIHBvczogSUhUTUxFbGVtZW50UG9zaXRpb24sIGV2ZW50VHlwZTogbnVtYmVyKTogRXZlbnRNb3VzZSB7XHJcbiAgICAgICAgY29uc3QgbG9jUHJlTW91c2UgPSB0aGlzLl9wcmV2TW91c2VQb2ludDtcclxuICAgICAgICBjb25zdCBtb3VzZUV2ZW50ID0gbmV3IEV2ZW50TW91c2UoZXZlbnRUeXBlLCBmYWxzZSwgbG9jUHJlTW91c2UpO1xyXG4gICAgICAgIGxvY1ByZU1vdXNlLnggPSBsb2NhdGlvbi54O1xyXG4gICAgICAgIGxvY1ByZU1vdXNlLnkgPSBsb2NhdGlvbi55O1xyXG4gICAgICAgIC8vIHRoaXMuX2dsVmlldyEuX2NvbnZlcnRNb3VzZVRvTG9jYXRpb25JblZpZXcobG9jUHJlTW91c2UsIHBvcyk7XHJcbiAgICAgICAgdGhpcy5fZ2xWaWV3IS5fY29udmVydE1vdXNlVG9Mb2NhdGlvbihsb2NQcmVNb3VzZSwgcG9zKTtcclxuICAgICAgICBtb3VzZUV2ZW50LnNldExvY2F0aW9uKGxvY1ByZU1vdXNlLngsIGxvY1ByZU1vdXNlLnkpO1xyXG4gICAgICAgIHJldHVybiBtb3VzZUV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQb2ludEJ5RXZlbnQgKGV2ZW50OiBNb3VzZUV2ZW50LCBwb3M6IElIVE1MRWxlbWVudFBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VYICE9IG51bGwpIHsgIC8vIG5vdCBhdmFsYWJsZSBpbiA8PSBJRThcclxuICAgICAgICAgICAgcmV0dXJuIHt4OiBldmVudC5wYWdlWCwgeTogZXZlbnQucGFnZVl9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcG9zLmxlZnQgLT0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIHBvcy50b3AgLT0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XHJcblxyXG4gICAgICAgIHJldHVybiB7eDogZXZlbnQuY2xpZW50WCwgeTogZXZlbnQuY2xpZW50WX07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFRvdWNoZXNCeUV2ZW50IChldmVudDogVG91Y2hFdmVudCwgcG9zaXRpb246IElIVE1MRWxlbWVudFBvc2l0aW9uKSB7XHJcbiAgICAgICAgY29uc3QgdG91Y2hlczogVG91Y2hbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGxvY1ZpZXcgPSB0aGlzLl9nbFZpZXc7XHJcbiAgICAgICAgY29uc3QgbG9jUHJlVG91Y2ggPSB0aGlzLl9wcmVUb3VjaFBvaW50O1xyXG5cclxuICAgICAgICBjb25zdCBsZW5ndGggPSBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBjb25zdCBjaGFuZ2VkVG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlcy5pdGVtKGkpO1xyXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkVG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFjaGFuZ2VkVG91Y2gpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBsb2NhdGlvbjtcclxuICAgICAgICAgICAgaWYgKHN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCA9PT0gc3lzLmJyb3dzZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IGxvY1ZpZXchLmNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3KFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRUb3VjaC5wYWdlWCwgY2hhbmdlZFRvdWNoLnBhZ2VZLCBwb3NpdGlvbiwgX3ZlYzIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24gPSBsb2NWaWV3IS5jb252ZXJ0VG9Mb2NhdGlvbkluVmlldyhcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkVG91Y2guY2xpZW50WCwgY2hhbmdlZFRvdWNoLmNsaWVudFksIHBvc2l0aW9uLCBfdmVjMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHRvdWNoOiBUb3VjaDtcclxuICAgICAgICAgICAgaWYgKGNoYW5nZWRUb3VjaC5pZGVudGlmaWVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRvdWNoID0gbmV3IFRvdWNoKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIGNoYW5nZWRUb3VjaC5pZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgIC8vIHVzZSBUb3VjaCBQb29sXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldFByZVRvdWNoKHRvdWNoKS5nZXRMb2NhdGlvbihfcHJlTG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgdG91Y2guc2V0UHJldlBvaW50KF9wcmVMb2NhdGlvbi54LCBfcHJlTG9jYXRpb24ueSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByZVRvdWNoKHRvdWNoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRvdWNoID0gbmV3IFRvdWNoKGxvY2F0aW9uLngsIGxvY2F0aW9uLnkpO1xyXG4gICAgICAgICAgICAgICAgdG91Y2guc2V0UHJldlBvaW50KGxvY1ByZVRvdWNoLngsIGxvY1ByZVRvdWNoLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxvY1ByZVRvdWNoLnggPSBsb2NhdGlvbi54O1xyXG4gICAgICAgICAgICBsb2NQcmVUb3VjaC55ID0gbG9jYXRpb24ueTtcclxuICAgICAgICAgICAgdG91Y2hlcy5wdXNoKHRvdWNoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG91Y2hlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJTeXN0ZW1FdmVudCAoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzUmVnaXN0ZXJFdmVudCB8fCAhZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9nbFZpZXcgPSBsZWdhY3lDQy52aWV3O1xyXG5cclxuICAgICAgICBsZXQgcHJvaGliaXRpb24gPSBzeXMuaXNNb2JpbGU7XHJcbiAgICAgICAgbGV0IHN1cHBvcnRNb3VzZSA9ICgnbW91c2UnIGluIHN5cy5jYXBhYmlsaXRpZXMpO1xyXG4gICAgICAgIGxldCBzdXBwb3J0VG91Y2hlcyA9ICgndG91Y2hlcycgaW4gc3lzLmNhcGFiaWxpdGllcyk7XHJcblxyXG4gICAgICAgIC8vIFJlZ2lzdGVyIG1vdXNlIGV2ZW50cy5cclxuICAgICAgICBpZiAoc3VwcG9ydE1vdXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyTW91c2VFdmVudHMoZWxlbWVudCwgcHJvaGliaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVnaXN0ZXIgbW91c2UgcG9pbnRlciBldmVudHMuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3Rlck1vdXNlUG9pbnRlckV2ZW50cyhlbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlZ2lzdGVyIHRvdWNoIGV2ZW50cy5cclxuICAgICAgICBpZiAoc3VwcG9ydFRvdWNoZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJUb3VjaEV2ZW50cyhlbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyS2V5Ym9hcmRFdmVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLl9pc1JlZ2lzdGVyRXZlbnQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBlbmFibGUgYWNjZWxlcm9tZXRlciBldmVudC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEFjY2VsZXJvbWV0ZXJFbmFibGVkIChpc0VuYWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2NlbEVuYWJsZWQgPT09IGlzRW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FjY2VsRW5hYmxlZCA9IGlzRW5hYmxlO1xyXG4gICAgICAgIGNvbnN0IHNjaGVkdWxlciA9IGxlZ2FjeUNDLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpO1xyXG4gICAgICAgIHNjaGVkdWxlci5lbmFibGVGb3JUYXJnZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjY2VsRW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9hY2NlbEN1clRpbWUgPSAwO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuc2NoZWR1bGVVcGRhdGUodGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fdW5yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9hY2NlbEN1clRpbWUgPSAwO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIudW5zY2hlZHVsZVVwZGF0ZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChKU0IgfHwgUlVOVElNRV9CQVNFRCkge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGpzYi5kZXZpY2Uuc2V0TW90aW9uRW5hYmxlZChpc0VuYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaWRBY2NlbGVyYXRlIChldmVudERhdGE6IERldmljZU1vdGlvbkV2ZW50IHwgRGV2aWNlT3JpZW50YXRpb25FdmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fYWNjZWxFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1BY2NlbGVyYXRpb24gPSB0aGlzLl9hY2NlbGVyYXRpb24hO1xyXG5cclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSAwO1xyXG4gICAgICAgIGxldCB6ID0gMDtcclxuXHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAodGhpcy5fYWNjZWxEZXZpY2VFdmVudCA9PT0gd2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRldmljZU1vdGlvbkV2ZW50ID0gZXZlbnREYXRhIGFzIERldmljZU1vdGlvbkV2ZW50O1xyXG4gICAgICAgICAgICBjb25zdCBldmVudEFjY2VsZXJhdGlvbiA9IGRldmljZU1vdGlvbkV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk7XHJcbiAgICAgICAgICAgIGlmIChldmVudEFjY2VsZXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgeCA9IHRoaXMuX2FjY2VsTWludXMgKiAoZXZlbnRBY2NlbGVyYXRpb24ueCB8fCAwKSAqIDAuMTtcclxuICAgICAgICAgICAgICAgIHkgPSB0aGlzLl9hY2NlbE1pbnVzICogKGV2ZW50QWNjZWxlcmF0aW9uLnkgfHwgMCkgKiAwLjE7XHJcbiAgICAgICAgICAgICAgICB6ID0gKGV2ZW50QWNjZWxlcmF0aW9uLnogfHwgMCkgKiAwLjE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBkZXZpY2VPcmllbnRhdGlvbkV2ZW50ID0gZXZlbnREYXRhIGFzIERldmljZU9yaWVudGF0aW9uRXZlbnQ7XHJcbiAgICAgICAgICAgIHggPSAoKGRldmljZU9yaWVudGF0aW9uRXZlbnQuZ2FtbWEgfHwgMCkgLyA5MCkgKiAwLjk4MTtcclxuICAgICAgICAgICAgeSA9IC0oKGRldmljZU9yaWVudGF0aW9uRXZlbnQuYmV0YSB8fCAwKSAvIDkwKSAqIDAuOTgxO1xyXG4gICAgICAgICAgICB6ID0gKChkZXZpY2VPcmllbnRhdGlvbkV2ZW50LmFscGhhIHx8IDApIC8gOTApICogMC45ODE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGVnYWN5Q0Mudmlldy5faXNSb3RhdGVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IHg7XHJcbiAgICAgICAgICAgIHggPSAteTtcclxuICAgICAgICAgICAgeSA9IHRtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbUFjY2VsZXJhdGlvbi54ID0geDtcclxuICAgICAgICBtQWNjZWxlcmF0aW9uLnkgPSB5O1xyXG4gICAgICAgIG1BY2NlbGVyYXRpb24ueiA9IHo7XHJcblxyXG4gICAgICAgIG1BY2NlbGVyYXRpb24udGltZXN0YW1wID0gZXZlbnREYXRhLnRpbWVTdGFtcCB8fCBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICBjb25zdCB0bXBYID0gbUFjY2VsZXJhdGlvbi54O1xyXG4gICAgICAgIGlmICh3aW5kb3cub3JpZW50YXRpb24gPT09IExBTkRTQ0FQRV9SSUdIVCkge1xyXG4gICAgICAgICAgICBtQWNjZWxlcmF0aW9uLnggPSAtbUFjY2VsZXJhdGlvbi55O1xyXG4gICAgICAgICAgICBtQWNjZWxlcmF0aW9uLnkgPSB0bXBYO1xyXG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm9yaWVudGF0aW9uID09PSBMQU5EU0NBUEVfTEVGVCkge1xyXG4gICAgICAgICAgICBtQWNjZWxlcmF0aW9uLnggPSBtQWNjZWxlcmF0aW9uLnk7XHJcbiAgICAgICAgICAgIG1BY2NlbGVyYXRpb24ueSA9IC10bXBYO1xyXG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm9yaWVudGF0aW9uID09PSBQT1JUUkFJVF9VUFNJREVfRE9XTikge1xyXG4gICAgICAgICAgICBtQWNjZWxlcmF0aW9uLnggPSAtbUFjY2VsZXJhdGlvbi54O1xyXG4gICAgICAgICAgICBtQWNjZWxlcmF0aW9uLnkgPSAtbUFjY2VsZXJhdGlvbi55O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmaXggYW5kcm9pZCBhY2MgdmFsdWVzIGFyZSBvcHBvc2l0ZVxyXG4gICAgICAgIGlmIChsZWdhY3lDQy5zeXMub3MgPT09IGxlZ2FjeUNDLnN5cy5PU19BTkRST0lEICYmXHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLnN5cy5icm93c2VyVHlwZSAhPT0gbGVnYWN5Q0Muc3lzLkJST1dTRVJfVFlQRV9NT0JJTEVfUVEpIHtcclxuICAgICAgICAgICAgbUFjY2VsZXJhdGlvbi54ID0gLW1BY2NlbGVyYXRpb24ueDtcclxuICAgICAgICAgICAgbUFjY2VsZXJhdGlvbi55ID0gLW1BY2NlbGVyYXRpb24ueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2NlbEN1clRpbWUgPiB0aGlzLl9hY2NlbEludGVydmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FjY2VsQ3VyVGltZSAtPSB0aGlzLl9hY2NlbEludGVydmFsO1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRBY2NlbGVyYXRpb24odGhpcy5fYWNjZWxlcmF0aW9uISkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hY2NlbEN1clRpbWUgKz0gZHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgYWNjZWxlcm9tZXRlciBpbnRlcnZhbCB2YWx1ZVxyXG4gICAgICogQG1ldGhvZCBzZXRBY2NlbGVyb21ldGVySW50ZXJ2YWxcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QWNjZWxlcm9tZXRlckludGVydmFsIChpbnRlcnZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2NlbEludGVydmFsICE9PSBpbnRlcnZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY2NlbEludGVydmFsID0gaW50ZXJ2YWw7XHJcblxyXG4gICAgICAgICAgICBpZiAoSlNCIHx8IFJVTlRJTUVfQkFTRUQpIHtcclxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIGlmIChqc2IuZGV2aWNlICYmIGpzYi5kZXZpY2Uuc2V0TW90aW9uSW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAganNiLmRldmljZS5zZXRNb3Rpb25JbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0VW5Vc2VkSW5kZXggKCkge1xyXG4gICAgICAgIGxldCB0ZW1wID0gdGhpcy5faW5kZXhCaXRzVXNlZDtcclxuICAgICAgICBjb25zdCBub3cgPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRDdXJyZW50VGltZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21heFRvdWNoZXM7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoISh0ZW1wICYgMHgwMDAwMDAwMSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4Qml0c1VzZWQgfD0gKDEgPDwgaSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvdWNoID0gdGhpcy5fdG91Y2hlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChub3cgLSB0b3VjaC5sYXN0TW9kaWZpZWQgPiBUT1VDSF9USU1FT1VUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVXNlZEluZGV4Qml0KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdWNoSUQgPSB0b3VjaC5nZXRJRCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3VjaElEICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90b3VjaGVzSW50ZWdlckRpY3RbdG91Y2hJRF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRlbXAgPj49IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhbGwgYml0cyBhcmUgdXNlZFxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW1vdmVVc2VkSW5kZXhCaXQgKGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLl9tYXhUb3VjaGVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0ZW1wID0gMSA8PCBpbmRleDtcclxuICAgICAgICB0ZW1wID0gfnRlbXA7XHJcbiAgICAgICAgdGhpcy5faW5kZXhCaXRzVXNlZCAmPSB0ZW1wO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlZ2lzdGVyTW91c2VFdmVudHMgKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwcm9oaWJpdGlvbjogYm9vbGVhbikge1xyXG4gICAgICAgIC8vIEhBQ0tcclxuICAgICAgICAvLyAgLSBBdCB0aGUgc2FtZSB0aW1lIHRvIHRyaWdnZXIgdGhlIG9udG91Y2ggZXZlbnQgYW5kIG9ubW91c2UgZXZlbnRcclxuICAgICAgICAvLyAgLSBUaGUgZnVuY3Rpb24gd2lsbCBleGVjdXRlIDIgdGltZXNcclxuICAgICAgICAvLyBUaGUga25vd24gYnJvd3NlcjpcclxuICAgICAgICAvLyAgbGllYmlhb1xyXG4gICAgICAgIC8vICBtaXVpXHJcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJQb2ludGVyTG9ja0V2ZW50KCk7XHJcbiAgICAgICAgaWYgKCFwcm9oaWJpdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlcldpbmRvd01vdXNlRXZlbnRzKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZWdpc3RlckVsZW1lbnRNb3VzZUV2ZW50cyhlbGVtZW50LCBwcm9oaWJpdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVnaXN0ZXJQb2ludGVyTG9ja0V2ZW50ICgpIHtcclxuICAgICAgICBjb25zdCBsb2NrQ2hhbmdlQWxlcnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzO1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT09IGNhbnZhcyB8fCBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnQgPT09IGNhbnZhcyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wb2ludExvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wb2ludExvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoJ29ucG9pbnRlcmxvY2tjaGFuZ2UnIGluIGRvY3VtZW50KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrY2hhbmdlJywgbG9ja0NoYW5nZUFsZXJ0LCBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgnb25tb3pwb2ludGVybG9ja2NoYW5nZScgaW4gZG9jdW1lbnQpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pwb2ludGVybG9ja2NoYW5nZScsIGxvY2tDaGFuZ2VBbGVydCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZWdpc3RlcldpbmRvd01vdXNlRXZlbnRzIChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdXNlUHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbW91c2VQcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbW91c2VQcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5nZXRIVE1MRWxlbWVudFBvc2l0aW9uKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZ2V0UG9pbnRCeUV2ZW50KGV2ZW50LCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uUmVjdCA9IHJlY3QocG9zaXRpb24ubGVmdCwgcG9zaXRpb24udG9wLCBwb3NpdGlvbi53aWR0aCwgcG9zaXRpb24uaGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKCFwb3NpdGlvblJlY3QuY29udGFpbnMobmV3IFZlYzIobG9jYXRpb24ueCwgbG9jYXRpb24ueSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoZXNFbmQoW3RoaXMuZ2V0VG91Y2hCeVhZKGV2ZW50LCBsb2NhdGlvbi54LCBsb2NhdGlvbi55LCBwb3NpdGlvbildKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlRXZlbnQgPSB0aGlzLmdldE1vdXNlRXZlbnQobG9jYXRpb24sIHBvc2l0aW9uLCBFdmVudE1vdXNlLlVQKTtcclxuICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0QnV0dG9uKGV2ZW50LmJ1dHRvbik7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChtb3VzZUV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZWdpc3RlckVsZW1lbnRNb3VzZUV2ZW50cyAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHByb2hpYml0aW9uOiBib29sZWFuKSB7XHJcbiAgICAgICAgLy8gUmVnaXN0ZXIgY2FudmFzIG1vdXNlIGV2ZW50cy5cclxuICAgICAgICB0eXBlIEhhbmRsZXIgPSAoXHJcbiAgICAgICAgICAgIGV2ZW50OiBNb3VzZUV2ZW50LFxyXG4gICAgICAgICAgICBtb3VzZUV2ZW50OiBFdmVudE1vdXNlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgfSxcclxuICAgICAgICAgICAgZWxlbWVudFBvc2l0aW9uOiBJSFRNTEVsZW1lbnRQb3NpdGlvbixcclxuICAgICAgICApID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIHR5cGUgTW91c2VFdmVudE5hbWVzID0gJ21vdXNlZG93bicgfCAnbW91c2V1cCcgfCAnbW91c2Vtb3ZlJztcclxuXHJcbiAgICAgICAgY29uc3QgbGlzdGVuRE9NTW91c2VFdmVudCA9IChldmVudE5hbWU6IE1vdXNlRXZlbnROYW1lcywgdHlwZTogbnVtYmVyLCBoYW5kbGVyOiBIYW5kbGVyKSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5nZXRIVE1MRWxlbWVudFBvc2l0aW9uKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdldFBvaW50QnlFdmVudChldmVudCwgcG9zKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlRXZlbnQgPSB0aGlzLmdldE1vdXNlRXZlbnQobG9jYXRpb24sIHBvcywgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICBtb3VzZUV2ZW50LnNldEJ1dHRvbihldmVudC5idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQsIG1vdXNlRXZlbnQsIGxvY2F0aW9uLCBwb3MpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KG1vdXNlRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIXByb2hpYml0aW9uKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbkRPTU1vdXNlRXZlbnQoJ21vdXNlZG93bicsIEV2ZW50TW91c2UuRE9XTiwgKGV2ZW50LCBtb3VzZUV2ZW50LCBsb2NhdGlvbiwgcG9zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZVByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVUb3VjaGVzQmVnaW4oW3RoaXMuZ2V0VG91Y2hCeVhZKGV2ZW50LCBsb2NhdGlvbi54LCBsb2NhdGlvbi55LCBwb3MpXSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGlzdGVuRE9NTW91c2VFdmVudCgnbW91c2V1cCcsIEV2ZW50TW91c2UuVVAsIChldmVudCwgbW91c2VFdmVudCwgbG9jYXRpb24sIHBvcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VQcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoZXNFbmQoW3RoaXMuZ2V0VG91Y2hCeVhZKGV2ZW50LCBsb2NhdGlvbi54LCBsb2NhdGlvbi55LCBwb3MpXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGlzdGVuRE9NTW91c2VFdmVudCgnbW91c2Vtb3ZlJywgRXZlbnRNb3VzZS5NT1ZFLCAoZXZlbnQsIG1vdXNlRXZlbnQsIGxvY2F0aW9uLCBwb3MpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVG91Y2hlc01vdmUoW3RoaXMuZ2V0VG91Y2hCeVhZKGV2ZW50LCBsb2NhdGlvbi54LCBsb2NhdGlvbi55LCBwb3MpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX21vdXNlUHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0QnV0dG9uKEV2ZW50TW91c2UuQlVUVE9OX01JU1NJTkcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Lm1vdmVtZW50WCAhPT0gdW5kZWZpbmVkICYmIGV2ZW50Lm1vdmVtZW50WSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW91c2VFdmVudC5tb3ZlbWVudFggPSBldmVudC5tb3ZlbWVudFg7XHJcbiAgICAgICAgICAgICAgICAgICAgbW91c2VFdmVudC5tb3ZlbWVudFkgPSBldmVudC5tb3ZlbWVudFk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxpc3RlbkRPTU1vdXNlRXZlbnQoJ21vdXNld2hlZWwnLCBFdmVudE1vdXNlLlNDUk9MTCwgKGV2ZW50LCBtb3VzZUV2ZW50LCBsb2NhdGlvbiwgcG9zKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zZXRTY3JvbGxEYXRhKDAsIGV2ZW50LndoZWVsRGVsdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKiBmaXJlZm94IGZpeCAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBsaXN0ZW5ET01Nb3VzZUV2ZW50KCdET01Nb3VzZVNjcm9sbCcsIEV2ZW50TW91c2UuU0NST0xMLCAoZXZlbnQsIG1vdXNlRXZlbnQsIGxvY2F0aW9uLCBwb3MpID0+IHtcclxuICAgICAgICAgICAgbW91c2VFdmVudC5zZXRTY3JvbGxEYXRhKDAsIGV2ZW50LmRldGFpbCAqIC0xMjApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlZ2lzdGVyTW91c2VQb2ludGVyRXZlbnRzIChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IF9wb2ludGVyRXZlbnRzTWFwID0ge1xyXG4gICAgICAgICAgICBNU1BvaW50ZXJEb3duICAgICA6IHRoaXMuaGFuZGxlVG91Y2hlc0JlZ2luLFxyXG4gICAgICAgICAgICBNU1BvaW50ZXJNb3ZlICAgICA6IHRoaXMuaGFuZGxlVG91Y2hlc01vdmUsXHJcbiAgICAgICAgICAgIE1TUG9pbnRlclVwICAgICAgIDogdGhpcy5oYW5kbGVUb3VjaGVzRW5kLFxyXG4gICAgICAgICAgICBNU1BvaW50ZXJDYW5jZWwgICA6IHRoaXMuaGFuZGxlVG91Y2hlc0NhbmNlbCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cclxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBpbiBfcG9pbnRlckV2ZW50c01hcCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gX3BvaW50ZXJFdmVudHNNYXBbZXZlbnROYW1lXTtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lIGFzIE1TUG9pbnRlckV2ZW50TmFtZXMsIChldmVudDogTVNQb2ludGVyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMuZ2V0SFRNTEVsZW1lbnRQb3NpdGlvbihlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHBvcy5sZWZ0IC09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgICAgICAgICAgcG9zLnRvcCAtPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgdG91Y2hFdmVudC5jYWxsKHRoaXMsIFt0aGlzLmdldFRvdWNoQnlYWShldmVudCwgZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgcG9zKV0pO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVnaXN0ZXJUb3VjaEV2ZW50cyAoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBtYWtlVG91Y2hMaXN0ZW5lciA9ICh0b3VjaGVzSGFuZGxlcjogKHRvdWNoZXNUb0hhbmRsZTogYW55KSA9PiB2b2lkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghZXZlbnQuY2hhbmdlZFRvdWNoZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLmdldEhUTUxFbGVtZW50UG9zaXRpb24oZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICAgICAgICAgIHBvcy5sZWZ0IC09IGJvZHkuc2Nyb2xsTGVmdCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgcG9zLnRvcCAtPSBib2R5LnNjcm9sbFRvcCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdG91Y2hlc0hhbmRsZXIodGhpcy5nZXRUb3VjaGVzQnlFdmVudChldmVudCwgcG9zKSk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgbWFrZVRvdWNoTGlzdGVuZXIoKHRvdWNoZXNUb0hhbmRsZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoZXNCZWdpbih0b3VjaGVzVG9IYW5kbGUpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgfSksIGZhbHNlKTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtYWtlVG91Y2hMaXN0ZW5lcigodG91Y2hlc1RvSGFuZGxlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVG91Y2hlc01vdmUodG91Y2hlc1RvSGFuZGxlKTtcclxuICAgICAgICB9KSwgZmFsc2UpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgbWFrZVRvdWNoTGlzdGVuZXIoKHRvdWNoZXNUb0hhbmRsZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoZXNFbmQodG91Y2hlc1RvSGFuZGxlKTtcclxuICAgICAgICB9KSwgZmFsc2UpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgbWFrZVRvdWNoTGlzdGVuZXIoKHRvdWNoZXNUb0hhbmRsZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoZXNDYW5jZWwodG91Y2hlc1RvSGFuZGxlKTtcclxuICAgICAgICB9KSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlZ2lzdGVyS2V5Ym9hcmRFdmVudCAoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gbGVnYWN5Q0MuZ2FtZS5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50S2V5Ym9hcmQoZXZlbnQsIHRydWUpKTtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRLZXlib2FyZChldmVudCwgZmFsc2UpKTtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlZ2lzdGVyQWNjZWxlcm9tZXRlckV2ZW50ICgpIHtcclxuICAgICAgICB0aGlzLl9hY2NlbGVyYXRpb24gPSBuZXcgQWNjZWxlcmF0aW9uKCk7XHJcbiAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLl9hY2NlbERldmljZUV2ZW50ID0gd2luZG93LkRldmljZU1vdGlvbkV2ZW50IHx8IHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50O1xyXG5cclxuICAgICAgICAvLyBUT0RPIGZpeCBEZXZpY2VNb3Rpb25FdmVudCBidWcgb24gUVEgQnJvd3NlciB2ZXJzaW9uIDQuMSBhbmQgYmVsb3cuXHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLnN5cy5icm93c2VyVHlwZSA9PT0gbGVnYWN5Q0Muc3lzLkJST1dTRVJfVFlQRV9NT0JJTEVfUVEpIHtcclxuICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5fYWNjZWxEZXZpY2VFdmVudCA9IHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgX2RldmljZUV2ZW50VHlwZSA9XHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB0aGlzLl9hY2NlbERldmljZUV2ZW50ID09PSB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgPyAnZGV2aWNlbW90aW9uJyA6ICdkZXZpY2VvcmllbnRhdGlvbic7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBfZGlkQWNjZWxlcmF0ZUZ1biA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdGhpcy5kaWRBY2NlbGVyYXRlKC4uLmFyZ3MpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKF9kZXZpY2VFdmVudFR5cGUsIF9kaWRBY2NlbGVyYXRlRnVuLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdW5yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCAoKSB7XHJcbiAgICAgICAgY29uc3QgX2RldmljZUV2ZW50VHlwZSA9XHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB0aGlzLl9hY2NlbERldmljZUV2ZW50ID09PSB3aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgPyAnZGV2aWNlbW90aW9uJyA6ICdkZXZpY2VvcmllbnRhdGlvbic7XHJcbiAgICAgICAgaWYgKF9kaWRBY2NlbGVyYXRlRnVuKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKF9kZXZpY2VFdmVudFR5cGUsIF9kaWRBY2NlbGVyYXRlRnVuLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFVzZWZ1bFRvdWNoZXMgKCkge1xyXG4gICAgICAgIGNvbnN0IHRvdWNoZXM6IFRvdWNoW10gPSBbXTtcclxuICAgICAgICBjb25zdCB0b3VjaERpY3QgPSB0aGlzLl90b3VjaGVzSW50ZWdlckRpY3Q7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBpbiB0b3VjaERpY3QpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChpZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZWRJRCA9IHRvdWNoRGljdFtpbmRleF07XHJcbiAgICAgICAgICAgIGlmICh1c2VkSUQgPT09IHVuZGVmaW5lZCB8fCB1c2VkSUQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IHRoaXMuX3RvdWNoZXNbdXNlZElEXTtcclxuICAgICAgICAgICAgdG91Y2hlcy5wdXNoKHRvdWNoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b3VjaGVzO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgaW5wdXRNYW5hZ2VyID0gbmV3IElucHV0TWFuYWdlcigpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5wdXRNYW5hZ2VyO1xyXG5cclxubGVnYWN5Q0MuaW50ZXJuYWwuaW5wdXRNYW5hZ2VyID0gaW5wdXRNYW5hZ2VyO1xyXG4iXX0=