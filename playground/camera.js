// camera

                "use strict";

var _dec, _class;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FirstPersonCamera = (_dec = cc._decorator.ccclass(), _dec(_class =
/*#__PURE__*/
function (_cc$Component) {
  _inherits(FirstPersonCamera, _cc$Component);

  function FirstPersonCamera() {
    var _this;

    _classCallCheck(this, FirstPersonCamera);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FirstPersonCamera).call(this));
    _this._lbtnDown = false;
    _this._rbtnDown = false;
    _this._keyStates = new Array(128);

    _this._keyStates.fill(false);

    return _this;
  }

  _createClass(FirstPersonCamera, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      var cameraComponent = this.node.getComponent("cc.CameraComponent");

      if (!cameraComponent) {
        console.error("Cannot find cc.CameraComponent on node ".concat(this.node.name));
      }

      cc.eventManager.setEnabled(true);
      var mouseListener = cc.EventListener.create({
        event: cc.EventListener.MOUSE,
        onMouseDown: function onMouseDown() {
          return _this2._mouseDownHandler.apply(_this2, arguments);
        },
        onMouseMove: function onMouseMove() {
          return _this2._mouseMoveHandler.apply(_this2, arguments);
        },
        onMouseUp: function onMouseUp() {
          return _this2._mouseUpHandler.apply(_this2, arguments);
        },
        onMouseScroll: function onMouseScroll() {
          return _this2._mouseWheelHandler.apply(_this2, arguments);
        }
      });
      cc.eventManager.addListener(mouseListener, 1);
      var keyListener = cc.EventListener.create({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function onKeyPressed() {
          return _this2._keyDownHandler.apply(_this2, arguments);
        },
        onKeyReleased: function onKeyReleased() {
          return _this2._keyUpHandler.apply(_this2, arguments);
        }
      });
      cc.eventManager.addListener(keyListener, 1);
    }
  }, {
    key: "update",
    value: function update(dt) {
      var _this3 = this;

      var translationDelta = dt * 10;

      var isKeyPressing = function isKeyPressing(keystr) {
        return _this3._keyStates[keystr.charCodeAt(0)];
      };

      if (isKeyPressing("W")) {
        this._translate(this._getForward(), translationDelta);
      }

      if (isKeyPressing("S")) {
        this._translate(this._getForward(), -translationDelta);
      }

      if (isKeyPressing("A")) {
        this._translate(this._getRight(), -translationDelta);
      }

      if (isKeyPressing("D")) {
        this._translate(this._getRight(), translationDelta);
      }

      if (isKeyPressing("Q")) {
        this._translate(cc.v3(0, 1, 0), -translationDelta);
      }

      if (isKeyPressing("E")) {
        this._translate(cc.v3(0, 1, 0), translationDelta);
      }
    }
  }, {
    key: "_mouseWheelHandler",
    value: function _mouseWheelHandler(event) {
      var delta = event._scrollY / 120; // forward to screen is positive

      this._translate(this._getForward(), delta);
    }
  }, {
    key: "_mouseDownHandler",
    value: function _mouseDownHandler(event) {
      if (event._button === 0) {
        this._lbtnDown = true;
      } else if (event._button === 1) {
        this._mbtnDown = true;
      } else if (event._button === 2) {
        cc.game.canvas.requestPointerLock();
        this._rbtnDown = true;
      }
    }
  }, {
    key: "_mouseUpHandler",
    value: function _mouseUpHandler(event) {
      if (event._button === 0) {
        this._lbtnDown = false;
      } else if (event._button === 1) {
        this._mbtnDown = false;
      } else if (event._button === 2) {
        document.exitPointerLock();
        this._rbtnDown = false;
      }
    }
  }, {
    key: "_mouseMoveHandler",
    value: function _mouseMoveHandler(event) {
      var dx = event.movementX;
      var dy = -event.movementY;

      if (dx !== 0) {
        if (this._rbtnDown) {
          this._rotateSelfHorizon(dx / 5);
        }
      }

      if (dy !== 0) {
        if (this._rbtnDown) {
          this._rotateSelfVertical(dy / 5);
        }
      }
    }
  }, {
    key: "_keyDownHandler",
    value: function _keyDownHandler(keycode) {
      if (keycode < this._keyStates.length) {
        this._keyStates[keycode] = true;
      }
    }
  }, {
    key: "_keyUpHandler",
    value: function _keyUpHandler(keycode) {
      if (keycode < this._keyStates.length) {
        this._keyStates[keycode] = false;
      }
    }
  }, {
    key: "_translate",
    value: function _translate(direction, delta) {
      var position = this.node.getPosition();
      cc.vmath.vec3.scaleAndAdd(position, position, direction, delta);
      this.node.setPosition(position);
    }
  }, {
    key: "_rotateSelfHorizon",
    value: function _rotateSelfHorizon(delta) {
      var rotation = this.node.getRotation();
      var up = cc.v3(0, 1, 0); //const up = this._getUp();

      cc.vmath.quat.rotateAround(rotation, rotation, up, -delta / 360.0 * 3.14159265);
      this.node.setRotation(rotation);
    }
  }, {
    key: "_rotateSelfVertical",
    value: function _rotateSelfVertical(delta) {
      var rotation = this.node.getRotation(); //const right = cc.v3(1, 0, 0);

      var right = this._getRight();

      cc.vmath.quat.rotateAround(rotation, rotation, right, delta / 360.0 * 3.14159265);
      this.node.setRotation(rotation);
    }
  }, {
    key: "_getForward",
    value: function _getForward() {
      return this._getDirection(0, 0, -1);
    }
  }, {
    key: "_getRight",
    value: function _getRight() {
      return this._getDirection(1, 0, 0);
    }
  }, {
    key: "_getUp",
    value: function _getUp() {
      return this._getDirection(0, 1, 0);
    }
  }, {
    key: "_getDirection",
    value: function _getDirection(x, y, z) {
      var result = cc.v3(x, y, z);
      cc.vmath.vec3.transformQuat(result, result, this.node.getRotation());
      return result;
    }
  }]);

  return FirstPersonCamera;
}(cc.Component)) || _class);
