(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.action = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Speed = _exports.FiniteTimeAction = _exports.Action = void 0;

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
   * !#en Base classAction for action classes.
   * !#zh Action 类是所有动作类型的基类。
   * @class Action
   */
  var Action = /*#__PURE__*/function () {
    function Action() {
      _classCallCheck(this, Action);

      this.originalTarget = null;
      this.target = null;
      this.tag = Action.TAG_INVALID;
    }

    _createClass(Action, [{
      key: "clone",

      /**
       * !#en
       * to copy object with deep copy.
       * returns a clone of action.
       * !#zh 返回一个克隆的动作。
       * @method clone
       * @return {Action}
       */
      value: function clone() {
        var action = new Action();
        action.originalTarget = null;
        action.target = null;
        action.tag = this.tag;
        return action;
      }
      /**
       * !#en
       * return true if the action has finished.
       * !#zh 如果动作已完成就返回 true。
       * @method isDone
       * @return {Boolean}
       */

    }, {
      key: "isDone",
      value: function isDone() {
        return true;
      } // called before the action start. It will also set the target.

    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        this.originalTarget = target;
        this.target = target;
      } // called after the action has finished. It will set the 'target' to nil.

    }, {
      key: "stop",
      value: function stop() {
        this.target = null;
      } // called every frame with it's delta time. <br />

    }, {
      key: "step",
      value: function step(dt) {
        (0, _index.logID)(1006);
      } // Called once per frame. Time is the number of seconds of a frame interval.

    }, {
      key: "update",
      value: function update(dt) {
        (0, _index.logID)(1007);
      }
      /**
       * !#en get the target.
       * !#zh 获取当前目标节点。
       * @method getTarget
       * @return {object}
       */

    }, {
      key: "getTarget",
      value: function getTarget() {
        return this.target;
      }
      /**
       * !#en The action will modify the target properties.
       * !#zh 设置目标节点。
       * @method setTarget
       * @param {object} target
       */

    }, {
      key: "setTarget",
      value: function setTarget(target) {
        this.target = target;
      }
      /**
       * !#en get the original target.
       * !#zh 获取原始目标节点。
       * @method getOriginalTarget
       * @return {object}
       */

    }, {
      key: "getOriginalTarget",
      value: function getOriginalTarget() {
        return this.originalTarget;
      } // Set the original target, since target can be nil.
      // Is the target that were used to run the action.
      // Unless you are doing something complex, like `ActionManager`, you should NOT call this method.

    }, {
      key: "setOriginalTarget",
      value: function setOriginalTarget(originalTarget) {
        this.originalTarget = originalTarget;
      }
      /**
       * !#en get tag number.
       * !#zh 获取用于识别动作的标签。
       * @method getTag
       * @return {Number}
       */

    }, {
      key: "getTag",
      value: function getTag() {
        return this.tag;
      }
      /**
       * !#en set tag number.
       * !#zh 设置标签，用于识别动作。
       * @method setTag
       * @param {Number} tag
       */

    }, {
      key: "setTag",
      value: function setTag(tag) {
        this.tag = tag;
      }
      /**
       * !#en
       * Returns a reversed action. <br />
       * For example: <br />
       * - The action will be x coordinates of 0 move to 100. <br />
       * - The reversed action will be x of 100 move to 0.
       * - Will be rewritten
       * !#zh 返回一个新的动作，执行与原动作完全相反的动作。
       * @method reverse
       * @return {Action | null}
       */

    }, {
      key: "reverse",
      value: function reverse() {
        (0, _index.logID)(1008);
        return null;
      } // Currently JavaScript Bindigns (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
      // and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
      // This is a hack, and should be removed once JSB fixes the retain/release bug.

    }, {
      key: "retain",
      value: function retain() {} // Currently JavaScript Bindigns (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
      // and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
      // This is a hack, and should be removed once JSB fixes the retain/release bug.

    }, {
      key: "release",
      value: function release() {}
    }]);

    return Action;
  }();
  /**
   * !#en
   * Base class actions that do have a finite time duration. <br/>
   * Possible actions: <br/>
   * - An action with a duration of 0 seconds. <br/>
   * - An action with a duration of 35.5 seconds.
   *
   * Infinite time actions are valid
   * !#zh 有限时间动作，这种动作拥有时长 duration 属性。
   * @class FiniteTimeAction
   * @extends Action
   */


  _exports.Action = Action;
  Action.TAG_INVALID = -1;

  var FiniteTimeAction = /*#__PURE__*/function (_Action) {
    _inherits(FiniteTimeAction, _Action);

    function FiniteTimeAction() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, FiniteTimeAction);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FiniteTimeAction)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._duration = 0;
      _this._timesForRepeat = 1;
      return _this;
    }

    _createClass(FiniteTimeAction, [{
      key: "getDuration",

      /**
       * !#en get duration of the action. (seconds).
       * !#zh 获取动作以秒为单位的持续时间。
       * @method getDuration
       * @return {Number}
       */
      value: function getDuration() {
        return this._duration * (this._timesForRepeat || 1);
      }
      /**
       * !#en set duration of the action. (seconds).
       * !#zh 设置动作以秒为单位的持续时间。
       * @method setDuration
       * @param {Number} duration
       */

    }, {
      key: "setDuration",
      value: function setDuration(duration) {
        this._duration = duration;
      }
      /**
       * !#en
       * to copy object with deep copy.
       * returns a clone of action.
       * !#zh 返回一个克隆的动作。
       * @method clone
       * @return {FiniteTimeAction}
       */

    }, {
      key: "clone",
      value: function clone() {
        return new FiniteTimeAction();
      }
    }]);

    return FiniteTimeAction;
  }(Action);
  /*
   * Changes the speed of an action, making it take longer (speed > 1)
   * or less (speed < 1) time. <br/>
   * Useful to simulate 'slow motion' or 'fast forward' effect.
   */


  _exports.FiniteTimeAction = FiniteTimeAction;

  var Speed = /*#__PURE__*/function (_Action2) {
    _inherits(Speed, _Action2);

    /**
     * @warning This action can't be `Sequence-able` because it is not an `IntervalAction`
     */
    function Speed(action) {
      var _this2;

      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      _classCallCheck(this, Speed);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Speed).call(this));
      _this2._speed = 0;
      _this2._innerAction = null;
      action && _this2.initWithAction(action, speed);
      return _this2;
    }
    /*
     * Gets the current running speed. <br />
     * Will get a percentage number, compared to the original speed.
     *
     * @method getSpeed
     * @return {Number}
     */


    _createClass(Speed, [{
      key: "getSpeed",
      value: function getSpeed() {
        return this._speed;
      }
      /*
       * alter the speed of the inner function in runtime.
       * @method setSpeed
       * @param {Number} speed
       */

    }, {
      key: "setSpeed",
      value: function setSpeed(speed) {
        this._speed = speed;
      }
      /*
       * initializes the action.
       * @method initWithAction
       * @param {ActionInterval} action
       * @param {Number} speed
       * @return {Boolean}
       */

    }, {
      key: "initWithAction",
      value: function initWithAction(action, speed) {
        if (!action) {
          (0, _index.errorID)(1021);
          return false;
        }

        this._innerAction = action;
        this._speed = speed;
        return true;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new Speed();
        action.initWithAction(this._innerAction.clone(), this._speed);
        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        Action.prototype.startWithTarget.call(this, target);

        this._innerAction.startWithTarget(target);
      }
    }, {
      key: "stop",
      value: function stop() {
        this._innerAction.stop();

        Action.prototype.stop.call(this);
      }
    }, {
      key: "step",
      value: function step(dt) {
        this._innerAction.step(dt * this._speed);
      }
    }, {
      key: "isDone",
      value: function isDone() {
        return this._innerAction.isDone();
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return new Speed(this._innerAction.reverse(), this._speed);
      }
      /*
       * Set inner Action.
       * @method setInnerAction
       * @param {ActionInterval} action
       */

    }, {
      key: "setInnerAction",
      value: function setInnerAction(action) {
        if (this._innerAction !== action) {
          this._innerAction = action;
        }
      }
      /*
       * Get inner Action.
       * @method getInnerAction
       * @return {ActionInterval}
       */

    }, {
      key: "getInnerAction",
      value: function getInnerAction() {
        return this._innerAction;
      }
    }]);

    return Speed;
  }(Action);

  _exports.Speed = Speed;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL2FjdGlvbnMvYWN0aW9uLnRzIl0sIm5hbWVzIjpbIkFjdGlvbiIsIm9yaWdpbmFsVGFyZ2V0IiwidGFyZ2V0IiwidGFnIiwiVEFHX0lOVkFMSUQiLCJhY3Rpb24iLCJkdCIsIkZpbml0ZVRpbWVBY3Rpb24iLCJfZHVyYXRpb24iLCJfdGltZXNGb3JSZXBlYXQiLCJkdXJhdGlvbiIsIlNwZWVkIiwic3BlZWQiLCJfc3BlZWQiLCJfaW5uZXJBY3Rpb24iLCJpbml0V2l0aEFjdGlvbiIsImNsb25lIiwicHJvdG90eXBlIiwic3RhcnRXaXRoVGFyZ2V0IiwiY2FsbCIsInN0b3AiLCJzdGVwIiwiaXNEb25lIiwicmV2ZXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ0E7Ozs7O01BS2FBLE07Ozs7V0FXQ0MsYyxHQUE4QixJO1dBQzlCQyxNLEdBQXNCLEk7V0FDdEJDLEcsR0FBTUgsTUFBTSxDQUFDSSxXOzs7Ozs7QUFFdkI7Ozs7Ozs7OzhCQVFpQjtBQUNiLFlBQUlDLE1BQU0sR0FBRyxJQUFJTCxNQUFKLEVBQWI7QUFDQUssUUFBQUEsTUFBTSxDQUFDSixjQUFQLEdBQXdCLElBQXhCO0FBQ0FJLFFBQUFBLE1BQU0sQ0FBQ0gsTUFBUCxHQUFnQixJQUFoQjtBQUNBRyxRQUFBQSxNQUFNLENBQUNGLEdBQVAsR0FBYSxLQUFLQSxHQUFsQjtBQUNBLGVBQU9FLE1BQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OytCQU9tQjtBQUNmLGVBQU8sSUFBUDtBQUNILE8sQ0FFRDs7OztzQ0FDaUJILE0sRUFBYTtBQUMxQixhQUFLRCxjQUFMLEdBQXNCQyxNQUF0QjtBQUNBLGFBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNILE8sQ0FFRDs7Ozs2QkFDUTtBQUNKLGFBQUtBLE1BQUwsR0FBYyxJQUFkO0FBQ0gsTyxDQUVEOzs7OzJCQUNNSSxFLEVBQVk7QUFD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O0FBQ2QsYUFBS1EsWUFBTCxDQUFtQk8sSUFBbkIsQ0FBd0JmLEVBQUUsR0FBRyxLQUFLTyxNQUFsQztBQUNIOzs7K0JBRVM7QUFDTixlQUFPLEtBQUtDLFlBQUwsQ0FBbUJRLE1BQW5CLEVBQVA7QUFDSDs7O2dDQUVVO0FBQ1AsZUFBTyxJQUFJWCxLQUFKLENBQVUsS0FBS0csWUFBTCxDQUFtQlMsT0FBbkIsRUFBVixFQUF5QyxLQUFLVixNQUE5QyxDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7cUNBS2dCUixNLEVBQWE7QUFDekIsWUFBSSxLQUFLUyxZQUFMLEtBQXNCVCxNQUExQixFQUFrQztBQUM5QixlQUFLUyxZQUFMLEdBQW9CVCxNQUFwQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7dUNBS2tCO0FBQ2QsZUFBTyxLQUFLUyxZQUFaO0FBQ0g7Ozs7SUFqR3NCZCxNIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgbG9nSUQsIGVycm9ySUQsIE5vZGUgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiAhI2VuIEJhc2UgY2xhc3NBY3Rpb24gZm9yIGFjdGlvbiBjbGFzc2VzLlxyXG4gKiAhI3poIEFjdGlvbiDnsbvmmK/miYDmnInliqjkvZznsbvlnovnmoTln7rnsbvjgIJcclxuICogQGNsYXNzIEFjdGlvblxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFjdGlvbiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIERlZmF1bHQgQWN0aW9uIHRhZy5cclxuICAgICAqICEjemgg6buY6K6k5Yqo5L2c5qCH562+44CCXHJcbiAgICAgKiBAY29uc3RhbnRcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBkZWZhdWx0IC0xXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBUQUdfSU5WQUxJRDogbnVtYmVyID0gLTE7XHJcblxyXG4gICAgcHJvdGVjdGVkIG9yaWdpbmFsVGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgdGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgdGFnID0gQWN0aW9uLlRBR19JTlZBTElEO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlblxyXG4gICAgICogdG8gY29weSBvYmplY3Qgd2l0aCBkZWVwIGNvcHkuXHJcbiAgICAgKiByZXR1cm5zIGEgY2xvbmUgb2YgYWN0aW9uLlxyXG4gICAgICogISN6aCDov5Tlm57kuIDkuKrlhYvpmobnmoTliqjkvZzjgIJcclxuICAgICAqIEBtZXRob2QgY2xvbmVcclxuICAgICAqIEByZXR1cm4ge0FjdGlvbn1cclxuICAgICAqL1xyXG4gICAgY2xvbmUgKCk6IEFjdGlvbiB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBBY3Rpb24oKTtcclxuICAgICAgICBhY3Rpb24ub3JpZ2luYWxUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgIGFjdGlvbi50YXJnZXQgPSBudWxsO1xyXG4gICAgICAgIGFjdGlvbi50YWcgPSB0aGlzLnRhZztcclxuICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlblxyXG4gICAgICogcmV0dXJuIHRydWUgaWYgdGhlIGFjdGlvbiBoYXMgZmluaXNoZWQuXHJcbiAgICAgKiAhI3poIOWmguaenOWKqOS9nOW3suWujOaIkOWwsei/lOWbniB0cnVl44CCXHJcbiAgICAgKiBAbWV0aG9kIGlzRG9uZVxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaXNEb25lICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxsZWQgYmVmb3JlIHRoZSBhY3Rpb24gc3RhcnQuIEl0IHdpbGwgYWxzbyBzZXQgdGhlIHRhcmdldC5cclxuICAgIHN0YXJ0V2l0aFRhcmdldCAodGFyZ2V0OiBhbnkpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGxlZCBhZnRlciB0aGUgYWN0aW9uIGhhcyBmaW5pc2hlZC4gSXQgd2lsbCBzZXQgdGhlICd0YXJnZXQnIHRvIG5pbC5cclxuICAgIHN0b3AgKCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUgd2l0aCBpdCdzIGRlbHRhIHRpbWUuIDxiciAvPlxyXG4gICAgc3RlcCAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGxvZ0lEKDEwMDYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGxlZCBvbmNlIHBlciBmcmFtZS4gVGltZSBpcyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgb2YgYSBmcmFtZSBpbnRlcnZhbC5cclxuICAgIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGxvZ0lEKDEwMDcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBnZXQgdGhlIHRhcmdldC5cclxuICAgICAqICEjemgg6I635Y+W5b2T5YmN55uu5qCH6IqC54K544CCXHJcbiAgICAgKiBAbWV0aG9kIGdldFRhcmdldFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBnZXRUYXJnZXQgKCk6IE5vZGUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIFRoZSBhY3Rpb24gd2lsbCBtb2RpZnkgdGhlIHRhcmdldCBwcm9wZXJ0aWVzLlxyXG4gICAgICogISN6aCDorr7nva7nm67moIfoioLngrnjgIJcclxuICAgICAqIEBtZXRob2Qgc2V0VGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIHNldFRhcmdldCAodGFyZ2V0OiBOb2RlKSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIGdldCB0aGUgb3JpZ2luYWwgdGFyZ2V0LlxyXG4gICAgICogISN6aCDojrflj5bljp/lp4vnm67moIfoioLngrnjgIJcclxuICAgICAqIEBtZXRob2QgZ2V0T3JpZ2luYWxUYXJnZXRcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqL1xyXG4gICAgZ2V0T3JpZ2luYWxUYXJnZXQgKCk6IE5vZGUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbFRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXQgdGhlIG9yaWdpbmFsIHRhcmdldCwgc2luY2UgdGFyZ2V0IGNhbiBiZSBuaWwuXHJcbiAgICAvLyBJcyB0aGUgdGFyZ2V0IHRoYXQgd2VyZSB1c2VkIHRvIHJ1biB0aGUgYWN0aW9uLlxyXG4gICAgLy8gVW5sZXNzIHlvdSBhcmUgZG9pbmcgc29tZXRoaW5nIGNvbXBsZXgsIGxpa2UgYEFjdGlvbk1hbmFnZXJgLCB5b3Ugc2hvdWxkIE5PVCBjYWxsIHRoaXMgbWV0aG9kLlxyXG4gICAgc2V0T3JpZ2luYWxUYXJnZXQgKG9yaWdpbmFsVGFyZ2V0OiBhbnkpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVGFyZ2V0ID0gb3JpZ2luYWxUYXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIGdldCB0YWcgbnVtYmVyLlxyXG4gICAgICogISN6aCDojrflj5bnlKjkuo7or4bliKvliqjkvZznmoTmoIfnrb7jgIJcclxuICAgICAqIEBtZXRob2QgZ2V0VGFnXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldFRhZyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIHNldCB0YWcgbnVtYmVyLlxyXG4gICAgICogISN6aCDorr7nva7moIfnrb7vvIznlKjkuo7or4bliKvliqjkvZzjgIJcclxuICAgICAqIEBtZXRob2Qgc2V0VGFnXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGFnXHJcbiAgICAgKi9cclxuICAgIHNldFRhZyAodGFnOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnRhZyA9IHRhZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICEjZW5cclxuICAgICAqIFJldHVybnMgYSByZXZlcnNlZCBhY3Rpb24uIDxiciAvPlxyXG4gICAgICogRm9yIGV4YW1wbGU6IDxiciAvPlxyXG4gICAgICogLSBUaGUgYWN0aW9uIHdpbGwgYmUgeCBjb29yZGluYXRlcyBvZiAwIG1vdmUgdG8gMTAwLiA8YnIgLz5cclxuICAgICAqIC0gVGhlIHJldmVyc2VkIGFjdGlvbiB3aWxsIGJlIHggb2YgMTAwIG1vdmUgdG8gMC5cclxuICAgICAqIC0gV2lsbCBiZSByZXdyaXR0ZW5cclxuICAgICAqICEjemgg6L+U5Zue5LiA5Liq5paw55qE5Yqo5L2c77yM5omn6KGM5LiO5Y6f5Yqo5L2c5a6M5YWo55u45Y+N55qE5Yqo5L2c44CCXHJcbiAgICAgKiBAbWV0aG9kIHJldmVyc2VcclxuICAgICAqIEByZXR1cm4ge0FjdGlvbiB8IG51bGx9XHJcbiAgICAgKi9cclxuICAgIHJldmVyc2UgKCk6IEFjdGlvbiB8IG51bGwge1xyXG4gICAgICAgIGxvZ0lEKDEwMDgpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEN1cnJlbnRseSBKYXZhU2NyaXB0IEJpbmRpZ25zIChKU0IpLCBpbiBzb21lIGNhc2VzLCBuZWVkcyB0byB1c2UgcmV0YWluIGFuZCByZWxlYXNlLiBUaGlzIGlzIGEgYnVnIGluIEpTQixcclxuICAgIC8vIGFuZCB0aGUgdWdseSB3b3JrYXJvdW5kIGlzIHRvIHVzZSByZXRhaW4vcmVsZWFzZS4gU28sIHRoZXNlIDIgbWV0aG9kcyB3ZXJlIGFkZGVkIHRvIGJlIGNvbXBhdGlibGUgd2l0aCBKU0IuXHJcbiAgICAvLyBUaGlzIGlzIGEgaGFjaywgYW5kIHNob3VsZCBiZSByZW1vdmVkIG9uY2UgSlNCIGZpeGVzIHRoZSByZXRhaW4vcmVsZWFzZSBidWcuXHJcbiAgICByZXRhaW4gKCkgeyB9XHJcblxyXG4gICAgLy8gQ3VycmVudGx5IEphdmFTY3JpcHQgQmluZGlnbnMgKEpTQiksIGluIHNvbWUgY2FzZXMsIG5lZWRzIHRvIHVzZSByZXRhaW4gYW5kIHJlbGVhc2UuIFRoaXMgaXMgYSBidWcgaW4gSlNCLFxyXG4gICAgLy8gYW5kIHRoZSB1Z2x5IHdvcmthcm91bmQgaXMgdG8gdXNlIHJldGFpbi9yZWxlYXNlLiBTbywgdGhlc2UgMiBtZXRob2RzIHdlcmUgYWRkZWQgdG8gYmUgY29tcGF0aWJsZSB3aXRoIEpTQi5cclxuICAgIC8vIFRoaXMgaXMgYSBoYWNrLCBhbmQgc2hvdWxkIGJlIHJlbW92ZWQgb25jZSBKU0IgZml4ZXMgdGhlIHJldGFpbi9yZWxlYXNlIGJ1Zy5cclxuICAgIHJlbGVhc2UgKCkgeyB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAhI2VuXHJcbiAqIEJhc2UgY2xhc3MgYWN0aW9ucyB0aGF0IGRvIGhhdmUgYSBmaW5pdGUgdGltZSBkdXJhdGlvbi4gPGJyLz5cclxuICogUG9zc2libGUgYWN0aW9uczogPGJyLz5cclxuICogLSBBbiBhY3Rpb24gd2l0aCBhIGR1cmF0aW9uIG9mIDAgc2Vjb25kcy4gPGJyLz5cclxuICogLSBBbiBhY3Rpb24gd2l0aCBhIGR1cmF0aW9uIG9mIDM1LjUgc2Vjb25kcy5cclxuICpcclxuICogSW5maW5pdGUgdGltZSBhY3Rpb25zIGFyZSB2YWxpZFxyXG4gKiAhI3poIOaciemZkOaXtumXtOWKqOS9nO+8jOi/meenjeWKqOS9nOaLpeacieaXtumVvyBkdXJhdGlvbiDlsZ7mgKfjgIJcclxuICogQGNsYXNzIEZpbml0ZVRpbWVBY3Rpb25cclxuICogQGV4dGVuZHMgQWN0aW9uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmluaXRlVGltZUFjdGlvbiBleHRlbmRzIEFjdGlvbiB7XHJcblxyXG4gICAgX2R1cmF0aW9uOiBudW1iZXIgPSAwO1xyXG4gICAgX3RpbWVzRm9yUmVwZWF0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBnZXQgZHVyYXRpb24gb2YgdGhlIGFjdGlvbi4gKHNlY29uZHMpLlxyXG4gICAgICogISN6aCDojrflj5bliqjkvZzku6Xnp5LkuLrljZXkvY3nmoTmjIHnu63ml7bpl7TjgIJcclxuICAgICAqIEBtZXRob2QgZ2V0RHVyYXRpb25cclxuICAgICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0RHVyYXRpb24gKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uICogKHRoaXMuX3RpbWVzRm9yUmVwZWF0IHx8IDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBzZXQgZHVyYXRpb24gb2YgdGhlIGFjdGlvbi4gKHNlY29uZHMpLlxyXG4gICAgICogISN6aCDorr7nva7liqjkvZzku6Xnp5LkuLrljZXkvY3nmoTmjIHnu63ml7bpl7TjgIJcclxuICAgICAqIEBtZXRob2Qgc2V0RHVyYXRpb25cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxyXG4gICAgICovXHJcbiAgICBzZXREdXJhdGlvbiAoZHVyYXRpb246IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuXHJcbiAgICAgKiB0byBjb3B5IG9iamVjdCB3aXRoIGRlZXAgY29weS5cclxuICAgICAqIHJldHVybnMgYSBjbG9uZSBvZiBhY3Rpb24uXHJcbiAgICAgKiAhI3poIOi/lOWbnuS4gOS4quWFi+mahueahOWKqOS9nOOAglxyXG4gICAgICogQG1ldGhvZCBjbG9uZVxyXG4gICAgICogQHJldHVybiB7RmluaXRlVGltZUFjdGlvbn1cclxuICAgICAqL1xyXG4gICAgY2xvbmUgKCk6IEZpbml0ZVRpbWVBY3Rpb24ge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmluaXRlVGltZUFjdGlvbigpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2VzIHRoZSBzcGVlZCBvZiBhbiBhY3Rpb24sIG1ha2luZyBpdCB0YWtlIGxvbmdlciAoc3BlZWQgPiAxKVxyXG4gKiBvciBsZXNzIChzcGVlZCA8IDEpIHRpbWUuIDxici8+XHJcbiAqIFVzZWZ1bCB0byBzaW11bGF0ZSAnc2xvdyBtb3Rpb24nIG9yICdmYXN0IGZvcndhcmQnIGVmZmVjdC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTcGVlZCBleHRlbmRzIEFjdGlvbiB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zcGVlZCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2lubmVyQWN0aW9uOiBBY3Rpb24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB3YXJuaW5nIFRoaXMgYWN0aW9uIGNhbid0IGJlIGBTZXF1ZW5jZS1hYmxlYCBiZWNhdXNlIGl0IGlzIG5vdCBhbiBgSW50ZXJ2YWxBY3Rpb25gXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChhY3Rpb24/OiBBY3Rpb24sIHNwZWVkOiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBhY3Rpb24gJiYgdGhpcy5pbml0V2l0aEFjdGlvbihhY3Rpb24sIHNwZWVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBydW5uaW5nIHNwZWVkLiA8YnIgLz5cclxuICAgICAqIFdpbGwgZ2V0IGEgcGVyY2VudGFnZSBudW1iZXIsIGNvbXBhcmVkIHRvIHRoZSBvcmlnaW5hbCBzcGVlZC5cclxuICAgICAqXHJcbiAgICAgKiBAbWV0aG9kIGdldFNwZWVkXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldFNwZWVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGFsdGVyIHRoZSBzcGVlZCBvZiB0aGUgaW5uZXIgZnVuY3Rpb24gaW4gcnVudGltZS5cclxuICAgICAqIEBtZXRob2Qgc2V0U3BlZWRcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZFxyXG4gICAgICovXHJcbiAgICBzZXRTcGVlZCAoc3BlZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NwZWVkID0gc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGluaXRpYWxpemVzIHRoZSBhY3Rpb24uXHJcbiAgICAgKiBAbWV0aG9kIGluaXRXaXRoQWN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge0FjdGlvbkludGVydmFsfSBhY3Rpb25cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZFxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaW5pdFdpdGhBY3Rpb24gKGFjdGlvbjogQWN0aW9uLCBzcGVlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCFhY3Rpb24pIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxMDIxKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24gPSBhY3Rpb247XHJcbiAgICAgICAgdGhpcy5fc3BlZWQgPSBzcGVlZDtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBTcGVlZCgpO1xyXG4gICAgICAgIGFjdGlvbi5pbml0V2l0aEFjdGlvbih0aGlzLl9pbm5lckFjdGlvbiEuY2xvbmUoKSwgdGhpcy5fc3BlZWQpO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRXaXRoVGFyZ2V0ICh0YXJnZXQ6IGFueSkge1xyXG4gICAgICAgIEFjdGlvbi5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiEuc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCAoKSB7XHJcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24hLnN0b3AoKTtcclxuICAgICAgICBBY3Rpb24ucHJvdG90eXBlLnN0b3AuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwIChkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24hLnN0ZXAoZHQgKiB0aGlzLl9zcGVlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEb25lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXJBY3Rpb24hLmlzRG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgU3BlZWQodGhpcy5faW5uZXJBY3Rpb24hLnJldmVyc2UoKSEsIHRoaXMuX3NwZWVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2V0IGlubmVyIEFjdGlvbi5cclxuICAgICAqIEBtZXRob2Qgc2V0SW5uZXJBY3Rpb25cclxuICAgICAqIEBwYXJhbSB7QWN0aW9uSW50ZXJ2YWx9IGFjdGlvblxyXG4gICAgICovXHJcbiAgICBzZXRJbm5lckFjdGlvbiAoYWN0aW9uOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5faW5uZXJBY3Rpb24gIT09IGFjdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldCBpbm5lciBBY3Rpb24uXHJcbiAgICAgKiBAbWV0aG9kIGdldElubmVyQWN0aW9uXHJcbiAgICAgKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cclxuICAgICAqL1xyXG4gICAgZ2V0SW5uZXJBY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lckFjdGlvbjtcclxuICAgIH1cclxufVxyXG4iXX0=