(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./action.js", "../../core/index.js", "./action-instant.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./action.js"), require("../../core/index.js"), require("./action-instant.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.action, global.index, global.actionInstant);
    global.actionInterval = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _action, _index, _actionInstant) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.sequence = sequence;
  _exports.repeat = repeat;
  _exports.repeatForever = repeatForever;
  _exports.spawn = spawn;
  _exports.delayTime = delayTime;
  _exports.reverseTime = reverseTime;
  _exports.ReverseTime = _exports.Spawn = _exports.RepeatForever = _exports.Repeat = _exports.Sequence = _exports.ActionInterval = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * !#en
   * <p> An interval action is an action that takes place within a certain period of time. <br/>
   * It has an start time, and a finish time. The finish time is the parameter<br/>
   * duration plus the start time.</p>
   *
   * <p>These CCActionInterval actions have some interesting properties, like:<br/>
   * - They can run normally (default)  <br/>
   * - They can run reversed with the reverse method   <br/>
   * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
   *
   * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
   * then running it again in Reverse mode. </p>
   * !#zh 时间间隔动作，这种动作在已定时间内完成，继承 FiniteTimeAction。
   * @class ActionInterval
   * @extends FiniteTimeAction
   * @param {Number} d duration in seconds
   */
  var ActionInterval = /*#__PURE__*/function (_FiniteTimeAction) {
    _inherits(ActionInterval, _FiniteTimeAction);

    //Compatible with repeat class, Discard after can be deleted
    //Compatible with repeat class, Discard after can be deleted
    function ActionInterval(d) {
      var _this;

      _classCallCheck(this, ActionInterval);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ActionInterval).call(this));
      _this.MAX_VALUE = 2;
      _this._elapsed = 0;
      _this._firstTick = false;
      _this._easeList = [];
      _this._speed = 1;
      _this._repeatForever = false;
      _this._repeatMethod = false;
      _this._speedMethod = false;

      if (d !== undefined && !isNaN(d)) {
        _this.initWithDuration(d);
      }

      return _this;
    }
    /*
     * How many seconds had elapsed since the actions started to run.
     * @return {Number}
     */


    _createClass(ActionInterval, [{
      key: "getElapsed",
      value: function getElapsed() {
        return this._elapsed;
      }
      /*
       * Initializes the action.
       * @param {Number} d duration in seconds
       * @return {Boolean}
       */

    }, {
      key: "initWithDuration",
      value: function initWithDuration(d) {
        this._duration = d === 0 ? _index.macro.FLT_EPSILON : d; // prevent division by 0
        // This comparison could be in step:, but it might decrease the performance
        // by 3% in heavy based action games.

        this._elapsed = 0;
        this._firstTick = true;
        return true;
      }
    }, {
      key: "isDone",
      value: function isDone() {
        return this._elapsed >= this._duration;
      }
    }, {
      key: "_cloneDecoration",
      value: function _cloneDecoration(action) {
        action._repeatForever = this._repeatForever;
        action._speed = this._speed;
        action._timesForRepeat = this._timesForRepeat;
        action._easeList = this._easeList;
        action._speedMethod = this._speedMethod;
        action._repeatMethod = this._repeatMethod;
      }
    }, {
      key: "_reverseEaseList",
      value: function _reverseEaseList(action) {
        if (this._easeList) {
          action._easeList = [];

          for (var i = 0; i < this._easeList.length; i++) {
            action._easeList.push(this._easeList[i]);
          }
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new ActionInterval(this._duration);

        this._cloneDecoration(action);

        return action;
      }
      /**
       * !#en Implementation of ease motion.
       * !#zh 缓动运动。
       * @method easing
       * @param {Object} easeObj
       * @returns {ActionInterval}
       * @example
       * import { easeIn } from 'cc';
       * action.easing(easeIn(3.0));
       */

    }, {
      key: "easing",
      value: function easing(easeObj) {
        if (this._easeList) this._easeList.length = 0;else this._easeList = [];

        for (var i = 0; i < arguments.length; i++) {
          this._easeList.push(arguments[i]);
        }

        return this;
      }
    }, {
      key: "_computeEaseTime",
      value: function _computeEaseTime(dt) {
        // var locList = this._easeList;
        // if ((!locList) || (locList.length === 0))
        //     return dt;
        // for (var i = 0, n = locList.length; i < n; i++)
        //     dt = locList[i].easing(dt);
        return dt;
      }
    }, {
      key: "step",
      value: function step(dt) {
        if (this._firstTick) {
          this._firstTick = false;
          this._elapsed = 0;
        } else this._elapsed += dt; //this.update((1 > (this._elapsed / this._duration)) ? this._elapsed / this._duration : 1);
        //this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, cc.macro.FLT_EPSILON))));


        var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
        t = 1 > t ? t : 1;
        this.update(t > 0 ? t : 0); //Compatible with repeat class, Discard after can be deleted (this._repeatMethod)

        if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
          if (!this._repeatForever) {
            this._timesForRepeat--;
          } //var diff = locInnerAction.getElapsed() - locInnerAction._duration;


          this.startWithTarget(this.target); // to prevent jerk. issue #390 ,1247
          //this._innerAction.step(0);
          //this._innerAction.step(diff);

          this.step(this._elapsed - this._duration);
        }
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        _action.Action.prototype.startWithTarget.call(this, target);

        this._elapsed = 0;
        this._firstTick = true;
      }
    }, {
      key: "reverse",
      value: function reverse() {
        (0, _index.logID)(1010);
        return this;
      }
      /*
       * Set amplitude rate.
       * @warning It should be overridden in subclass.
       * @param {Number} amp
       */

    }, {
      key: "setAmplitudeRate",
      value: function setAmplitudeRate(amp) {
        // Abstract class needs implementation
        (0, _index.logID)(1011);
      }
      /*
       * Get amplitude rate.
       * @warning It should be overridden in subclass.
       * @return {Number} 0
       */

    }, {
      key: "getAmplitudeRate",
      value: function getAmplitudeRate() {
        // Abstract class needs implementation
        (0, _index.logID)(1012);
        return 0;
      }
      /**
       * !#en
       * Changes the speed of an action, making it take longer (speed>1)
       * or less (speed<1) time. <br/>
       * Useful to simulate 'slow motion' or 'fast forward' effect.
       * !#zh
       * 改变一个动作的速度，使它的执行使用更长的时间（speed > 1）<br/>
       * 或更少（speed < 1）可以有效得模拟“慢动作”或“快进”的效果。
       * @param {Number} speed
       * @returns {Action}
       */

    }, {
      key: "speed",
      value: function speed(_speed) {
        if (_speed <= 0) {
          (0, _index.logID)(1013);
          return this;
        }

        this._speedMethod = true; //Compatible with repeat class, Discard after can be deleted

        this._speed *= _speed;
        return this;
      }
      /**
       * Get this action speed.
       * @return {Number}
       */

    }, {
      key: "getSpeed",
      value: function getSpeed() {
        return this._speed;
      }
      /**
       * Set this action speed.
       * @param {Number} speed
       * @returns {ActionInterval}
       */

    }, {
      key: "setSpeed",
      value: function setSpeed(speed) {
        this._speed = speed;
        return this;
      }
      /**
       * !#en
       * Repeats an action a number of times.
       * To repeat an action forever use the CCRepeatForever action.
       * !#zh 重复动作可以按一定次数重复一个动作，使用 RepeatForever 动作来永远重复一个动作。
       * @method repeat
       * @param {Number} times
       * @returns {ActionInterval}
       */

    }, {
      key: "repeat",
      value: function repeat(times) {
        times = Math.round(times);

        if (isNaN(times) || times < 1) {
          (0, _index.logID)(1014);
          return this;
        }

        this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted

        this._timesForRepeat *= times;
        return this;
      }
      /**
       * !#en
       * Repeats an action for ever.  <br/>
       * To repeat the an action for a limited number of times use the Repeat action. <br/>
       * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 Repeat 动作。
       * @method repeatForever
       * @returns {ActionInterval}
       */

    }, {
      key: "repeatForever",
      value: function repeatForever() {
        this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted

        this._timesForRepeat = this.MAX_VALUE;
        this._repeatForever = true;
        return this;
      }
    }]);

    return ActionInterval;
  }(_action.FiniteTimeAction);
  /*
   * Runs actions sequentially, one after another.
   */


  _exports.ActionInterval = ActionInterval;

  var Sequence = /*#__PURE__*/function (_ActionInterval) {
    _inherits(Sequence, _ActionInterval);

    function Sequence(tempArray) {
      var _this2;

      _classCallCheck(this, Sequence);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Sequence).call(this));
      _this2._actions = [];
      _this2._split = 0;
      _this2._last = 0;
      _this2._reversed = false;
      var paramArray = tempArray instanceof Array ? tempArray : arguments;

      if (paramArray.length === 1) {
        (0, _index.errorID)(1019);
        return _possibleConstructorReturn(_this2);
      }

      var last = paramArray.length - 1;
      if (last >= 0 && paramArray[last] == null) (0, _index.logID)(1015);

      if (last >= 0) {
        var prev = paramArray[0],
            action1;

        for (var i = 1; i < last; i++) {
          if (paramArray[i]) {
            action1 = prev;
            prev = Sequence._actionOneTwo(action1, paramArray[i]);
          }
        }

        _this2.initWithTwoActions(prev, paramArray[last]);
      }

      return _this2;
    }
    /*
     * Initializes the action <br/>
     * @param {FiniteTimeAction} actionOne
     * @param {FiniteTimeAction} actionTwo
     * @return {Boolean}
     */


    _createClass(Sequence, [{
      key: "initWithTwoActions",
      value: function initWithTwoActions(actionOne, actionTwo) {
        if (!actionOne || !actionTwo) {
          (0, _index.errorID)(1025);
          return false;
        }

        var durationOne = actionOne._duration,
            durationTwo = actionTwo._duration;
        durationOne *= actionOne._repeatMethod ? actionOne._timesForRepeat : 1;
        durationTwo *= actionTwo._repeatMethod ? actionTwo._timesForRepeat : 1;
        var d = durationOne + durationTwo;
        this.initWithDuration(d);
        this._actions[0] = actionOne;
        this._actions[1] = actionTwo;
        return true;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new Sequence();

        this._cloneDecoration(action);

        action.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._split = this._actions[0]._duration / this._duration;
        this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1;
        this._last = -1;
      }
    }, {
      key: "stop",
      value: function stop() {
        // Issue #1305
        if (this._last !== -1) this._actions[this._last].stop();

        _action.Action.prototype.stop.call(this);
      }
    }, {
      key: "update",
      value: function update(dt) {
        var new_t,
            found = 0;
        var locSplit = this._split;
        var locActions = this._actions;
        var locLast = this._last;
        var actionFound;
        dt = this._computeEaseTime(dt);

        if (dt < locSplit) {
          // action[0]
          new_t = locSplit !== 0 ? dt / locSplit : 1;

          if (found === 0 && locLast === 1 && this._reversed) {
            // Reverse mode ?
            // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
            // since it will require a hack to know if an action is on reverse mode or not.
            // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
            locActions[1].update(0);
            locActions[1].stop();
          }
        } else {
          // action[1]
          found = 1;
          new_t = locSplit === 1 ? 1 : (dt - locSplit) / (1 - locSplit);

          if (locLast === -1) {
            // action[0] was skipped, execute it.
            locActions[0].startWithTarget(this.target);
            locActions[0].update(1);
            locActions[0].stop();
          }

          if (locLast === 0) {
            // switching to action 1. stop action 0.
            locActions[0].update(1);
            locActions[0].stop();
          }
        }

        actionFound = locActions[found]; // Last action found and it is done.

        if (locLast === found && actionFound.isDone()) return; // Last action not found

        if (locLast !== found) actionFound.startWithTarget(this.target);
        new_t = new_t * actionFound._timesForRepeat;
        actionFound.update(new_t > 1 ? new_t % 1 : new_t);
        this._last = found;
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var action = Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());

        this._cloneDecoration(action);

        this._reverseEaseList(action);

        action._reversed = true;
        return action;
      }
    }]);

    return Sequence;
  }(ActionInterval);
  /**
   * !#en
   * Helper constructor to create an array of sequenceable actions
   * The created action will run actions sequentially, one after another.
   * !#zh 顺序执行动作，创建的动作将按顺序依次运行。
   * @method sequence
   * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
   * @param {FiniteTimeAction} ...tempArray
   * @return {ActionInterval}
   * @example
   * import { sequence } from 'cc';
   * 
   * // Create sequence with actions
   * const seq = sequence(act1, act2);
   *
   * // Create sequence with array
   * const seq = sequence(actArray);
   */
  // todo: It should be use new


  _exports.Sequence = Sequence;

  Sequence._actionOneTwo = function (actionOne, actionTwo) {
    var sequence = new Sequence();
    sequence.initWithTwoActions(actionOne, actionTwo);
    return sequence;
  };

  function sequence(
  /*Multiple Arguments*/
  tempArray) {
    var paramArray = tempArray instanceof Array ? tempArray : arguments;

    if (paramArray.length === 1) {
      (0, _index.errorID)(1019);
      return null;
    }

    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null) (0, _index.logID)(1015);
    var result = null;

    if (last >= 0) {
      result = paramArray[0];

      for (var i = 1; i <= last; i++) {
        if (paramArray[i]) {
          result = Sequence._actionOneTwo(result, paramArray[i]);
        }
      }
    }

    return result;
  }

  ;
  /*
   * Repeats an action a number of times.
   * To repeat an action forever use the CCRepeatForever action.
   * @class Repeat
   * @extends ActionInterval
   * @param {FiniteTimeAction} action
   * @param {Number} times
   * @example
   * import { Repeat, sequence } from 'cc';
   * const rep = new Repeat(sequence(jump2, jump1), 5);
   */

  var Repeat = /*#__PURE__*/function (_ActionInterval2) {
    _inherits(Repeat, _ActionInterval2);

    function Repeat(action, times) {
      var _this3;

      _classCallCheck(this, Repeat);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Repeat).call(this));
      _this3._times = 0;
      _this3._total = 0;
      _this3._nextDt = 0;
      _this3._actionInstant = false;
      _this3._innerAction = null;
      times !== undefined && _this3.initWithAction(action, times);
      return _this3;
    }
    /*
     * @param {FiniteTimeAction} action
     * @param {Number} times
     * @return {Boolean}
     */


    _createClass(Repeat, [{
      key: "initWithAction",
      value: function initWithAction(action, times) {
        var duration = action._duration * times;

        if (this.initWithDuration(duration)) {
          this._times = times;
          this._innerAction = action;

          if (action instanceof _actionInstant.ActionInstant) {
            this._actionInstant = true;
            this._times -= 1;
          }

          this._total = 0;
          return true;
        }

        return false;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new Repeat();

        this._cloneDecoration(action);

        action.initWithAction(this._innerAction.clone(), this._times);
        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        this._total = 0;
        this._nextDt = this._innerAction._duration / this._duration;
        ActionInterval.prototype.startWithTarget.call(this, target);

        this._innerAction.startWithTarget(target);
      }
    }, {
      key: "stop",
      value: function stop() {
        this._innerAction.stop();

        _action.Action.prototype.stop.call(this);
      }
    }, {
      key: "update",
      value: function update(dt) {
        dt = this._computeEaseTime(dt);
        var locInnerAction = this._innerAction;
        var locDuration = this._duration;
        var locTimes = this._times;
        var locNextDt = this._nextDt;

        if (dt >= locNextDt) {
          while (dt > locNextDt && this._total < locTimes) {
            locInnerAction.update(1);
            this._total++;
            locInnerAction.stop();
            locInnerAction.startWithTarget(this.target);
            locNextDt += locInnerAction._duration / locDuration;
            this._nextDt = locNextDt > 1 ? 1 : locNextDt;
          } // fix for issue #1288, incorrect end value of repeat


          if (dt >= 1.0 && this._total < locTimes) {
            // fix for cocos-creator/fireball/issues/4310
            locInnerAction.update(1);
            this._total++;
          } // don't set a instant action back or update it, it has no use because it has no duration


          if (!this._actionInstant) {
            if (this._total === locTimes) {
              locInnerAction.stop();
            } else {
              // issue #390 prevent jerk, use right update
              locInnerAction.update(dt - (locNextDt - locInnerAction._duration / locDuration));
            }
          }
        } else {
          locInnerAction.update(dt * locTimes % 1.0);
        }
      }
    }, {
      key: "isDone",
      value: function isDone() {
        return this._total === this._times;
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var action = new Repeat(this._innerAction.reverse(), this._times);

        this._cloneDecoration(action);

        this._reverseEaseList(action);

        return action;
      }
      /*
       * Set inner Action.
       * @param {FiniteTimeAction} action
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
       * @return {FiniteTimeAction}
       */

    }, {
      key: "getInnerAction",
      value: function getInnerAction() {
        return this._innerAction;
      }
    }]);

    return Repeat;
  }(ActionInterval);
  /**
   * !#en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
   * !#zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
   * @method repeat
   * @param {FiniteTimeAction} action
   * @param {Number} times
   * @return {Action}
   * @example
   * import { repeat, sequence } from 'cc';
   * const rep = repeat(sequence(jump2, jump1), 5);
   */


  _exports.Repeat = Repeat;

  function repeat(action, times) {
    return new Repeat(action, times);
  }
  /*
   * Repeats an action for ever.  <br/>
   * To repeat the an action for a limited number of times use the Repeat action. <br/>
   * @warning This action can't be Sequenceable because it is not an IntervalAction
   * @class RepeatForever
   * @extends ActionInterval
   * @param {ActionInterval} action
   * @example
   * import { sequence, RepeatForever } from 'cc';
   * const rep = new RepeatForever(sequence(jump2, jump1), 5);
   */


  var RepeatForever = /*#__PURE__*/function (_ActionInterval3) {
    _inherits(RepeatForever, _ActionInterval3);

    function RepeatForever(action) {
      var _this4;

      _classCallCheck(this, RepeatForever);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(RepeatForever).call(this));
      _this4._innerAction = null;
      action && _this4.initWithAction(action);
      return _this4;
    }
    /*
     * @param {ActionInterval} action
     * @return {Boolean}
     */


    _createClass(RepeatForever, [{
      key: "initWithAction",
      value: function initWithAction(action) {
        if (!action) {
          (0, _index.errorID)(1026);
          return false;
        }

        this._innerAction = action;
        return true;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new RepeatForever();

        this._cloneDecoration(action);

        action.initWithAction(this._innerAction.clone());
        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        ActionInterval.prototype.startWithTarget.call(this, target);

        this._innerAction.startWithTarget(target);
      }
    }, {
      key: "step",
      value: function step(dt) {
        var locInnerAction = this._innerAction;
        locInnerAction.step(dt);

        if (locInnerAction.isDone()) {
          //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
          locInnerAction.startWithTarget(this.target); // to prevent jerk. issue #390 ,1247
          //this._innerAction.step(0);
          //this._innerAction.step(diff);

          locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
        }
      }
    }, {
      key: "isDone",
      value: function isDone() {
        return false;
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var action = new RepeatForever(this._innerAction.reverse());

        this._cloneDecoration(action);

        this._reverseEaseList(action);

        return action;
      }
      /*
       * Set inner action.
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
       * Get inner action.
       * @return {ActionInterval}
       */

    }, {
      key: "getInnerAction",
      value: function getInnerAction() {
        return this._innerAction;
      }
    }]);

    return RepeatForever;
  }(ActionInterval);
  /**
   * !#en Create a acton which repeat forever, as it runs forever, it can't be added into `sequence` and `spawn`.
   * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 `sequence` 或 `spawn` 中。
   * @method repeatForever
   * @param {FiniteTimeAction} action
   * @return {ActionInterval}
   * @example
   * import { repeatForever, rotateBy } from 'cc';
   * var repeat = repeatForever(rotateBy(1.0, 360));
   */


  _exports.RepeatForever = RepeatForever;

  function repeatForever(action) {
    return new RepeatForever(action);
  }
  /*
   * Spawn a new action immediately
   * @class Spawn
   * @extends ActionInterval
   */


  var Spawn = /*#__PURE__*/function (_ActionInterval4) {
    _inherits(Spawn, _ActionInterval4);

    function Spawn(tempArray) {
      var _this5;

      _classCallCheck(this, Spawn);

      _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Spawn).call(this));
      _this5._one = null;
      _this5._two = null;
      var paramArray = tempArray instanceof Array ? tempArray : arguments;

      if (paramArray.length === 1) {
        (0, _index.errorID)(1020);
        return _possibleConstructorReturn(_this5);
      }

      var last = paramArray.length - 1;
      if (last >= 0 && paramArray[last] == null) (0, _index.logID)(1015);

      if (last >= 0) {
        var prev = paramArray[0],
            action1;

        for (var i = 1; i < last; i++) {
          if (paramArray[i]) {
            action1 = prev;
            prev = Spawn._actionOneTwo(action1, paramArray[i]);
          }
        }

        _this5.initWithTwoActions(prev, paramArray[last]);
      }

      return _this5;
    }
    /* initializes the Spawn action with the 2 actions to spawn
     * @param {FiniteTimeAction} action1
     * @param {FiniteTimeAction} action2
     * @return {Boolean}
     */


    _createClass(Spawn, [{
      key: "initWithTwoActions",
      value: function initWithTwoActions(action1, action2) {
        if (!action1 || !action2) {
          (0, _index.errorID)(1027);
          return false;
        }

        var ret = false;
        var d1 = action1._duration;
        var d2 = action2._duration;

        if (this.initWithDuration(Math.max(d1, d2))) {
          this._one = action1;
          this._two = action2;

          if (d1 > d2) {
            this._two = Sequence._actionOneTwo(action2, delayTime(d1 - d2));
          } else if (d1 < d2) {
            this._one = Sequence._actionOneTwo(action1, delayTime(d2 - d1));
          }

          ret = true;
        }

        return ret;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new Spawn();

        this._cloneDecoration(action);

        action.initWithTwoActions(this._one.clone(), this._two.clone());
        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        ActionInterval.prototype.startWithTarget.call(this, target);

        this._one.startWithTarget(target);

        this._two.startWithTarget(target);
      }
    }, {
      key: "stop",
      value: function stop() {
        this._one.stop();

        this._two.stop();

        _action.Action.prototype.stop.call(this);
      }
    }, {
      key: "update",
      value: function update(dt) {
        dt = this._computeEaseTime(dt);
        if (this._one) this._one.update(dt);
        if (this._two) this._two.update(dt);
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var action = Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());

        this._cloneDecoration(action);

        this._reverseEaseList(action);

        return action;
      }
    }]);

    return Spawn;
  }(ActionInterval);
  /**
   * !#en Create a spawn action which runs several actions in parallel.
   * !#zh 同步执行动作，同步执行一组动作。
   * @method spawn
   * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
   * @param {FiniteTimeAction} ...tempArray
   * @return {FiniteTimeAction}
   * @example
   * import { spawn, jumpBy, rotateBy, Vec2 } from 'cc';
   * const action = spawn(jumpBy(2, new Vec2(300, 0), 50, 4), rotateBy(2, 720));
   * todo:It should be the direct use new
   */


  _exports.Spawn = Spawn;

  Spawn._actionOneTwo = function (action1, action2) {
    var pSpawn = new Spawn();
    pSpawn.initWithTwoActions(action1, action2);
    return pSpawn;
  };

  function spawn(
  /*Multiple Arguments*/
  tempArray) {
    var paramArray = tempArray instanceof Array ? tempArray : arguments;

    if (paramArray.length === 1) {
      (0, _index.errorID)(1020);
      return null;
    }

    if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null) (0, _index.logID)(1015);
    var prev = paramArray[0];

    for (var i = 1; i < paramArray.length; i++) {
      if (paramArray[i] != null) prev = Spawn._actionOneTwo(prev, paramArray[i]);
    }

    return prev;
  }
  /* Delays the action a certain amount of seconds
   * @class DelayTime
   * @extends ActionInterval
   */


  var DelayTime = /*#__PURE__*/function (_ActionInterval5) {
    _inherits(DelayTime, _ActionInterval5);

    function DelayTime() {
      _classCallCheck(this, DelayTime);

      return _possibleConstructorReturn(this, _getPrototypeOf(DelayTime).apply(this, arguments));
    }

    _createClass(DelayTime, [{
      key: "update",
      value: function update(dt) {}
    }, {
      key: "reverse",
      value: function reverse() {
        var action = new DelayTime(this._duration);

        this._cloneDecoration(action);

        this._reverseEaseList(action);

        return action;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new DelayTime();

        this._cloneDecoration(action);

        action.initWithDuration(this._duration);
        return action;
      }
    }]);

    return DelayTime;
  }(ActionInterval);
  /**
   * !#en Delays the action a certain amount of seconds.
   * !#zh 延迟指定的时间量。
   * @method delayTime
   * @param {Number} d duration in seconds
   * @return {ActionInterval}
   * @example
   * import { delayTime } from 'cc';
   * const delay = delayTime(1);
   */


  function delayTime(d) {
    return new DelayTime(d);
  }

  ;
  /**
   * <p>
   * Executes an action in reverse order, from time=duration to time=0                                     <br/>
   * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
   * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
   * scope is not recommended.
   * </p>
   * @class ReverseTime
   * @extends ActionInterval
   * @param {FiniteTimeAction} action
   * @example
   * import ReverseTime from 'cc';
   * var reverse = new ReverseTime(this);
   */

  var ReverseTime = /*#__PURE__*/function (_ActionInterval6) {
    _inherits(ReverseTime, _ActionInterval6);

    function ReverseTime(action) {
      var _this6;

      _classCallCheck(this, ReverseTime);

      _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ReverseTime).call(this));
      _this6._other = null;
      action && _this6.initWithAction(action);
      return _this6;
    }
    /*
     * @param {FiniteTimeAction} action
     * @return {Boolean}
     */


    _createClass(ReverseTime, [{
      key: "initWithAction",
      value: function initWithAction(action) {
        if (!action) {
          (0, _index.errorID)(1028);
          return false;
        }

        if (action === this._other) {
          (0, _index.errorID)(1029);
          return false;
        }

        if (ActionInterval.prototype.initWithDuration.call(this, action._duration)) {
          // Don't leak if action is reused
          this._other = action;
          return true;
        }

        return false;
      }
    }, {
      key: "clone",
      value: function clone() {
        var action = new ReverseTime();

        this._cloneDecoration(action);

        action.initWithAction(this._other.clone());
        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        ActionInterval.prototype.startWithTarget.call(this, target);

        this._other.startWithTarget(target);
      }
    }, {
      key: "update",
      value: function update(dt) {
        dt = this._computeEaseTime(dt);
        if (this._other) this._other.update(1 - dt);
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return this._other.clone();
      }
    }, {
      key: "stop",
      value: function stop() {
        this._other.stop();

        _action.Action.prototype.stop.call(this);
      }
    }]);

    return ReverseTime;
  }(ActionInterval);
  /**
   * !#en Executes an action in reverse order, from time=duration to time=0.
   * !#zh 反转目标动作的时间轴。
   * @method reverseTime
   * @param {FiniteTimeAction} action
   * @return {ActionInterval}
   * @example
   * import { reverseTime } from 'cc';
   * const reverse = reverseTime(this);
   */


  _exports.ReverseTime = ReverseTime;

  function reverseTime(action) {
    return new ReverseTime(action);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL2FjdGlvbnMvYWN0aW9uLWludGVydmFsLnRzIl0sIm5hbWVzIjpbIkFjdGlvbkludGVydmFsIiwiZCIsIk1BWF9WQUxVRSIsIl9lbGFwc2VkIiwiX2ZpcnN0VGljayIsIl9lYXNlTGlzdCIsIl9zcGVlZCIsIl9yZXBlYXRGb3JldmVyIiwiX3JlcGVhdE1ldGhvZCIsIl9zcGVlZE1ldGhvZCIsInVuZGVmaW5lZCIsImlzTmFOIiwiaW5pdFdpdGhEdXJhdGlvbiIsIl9kdXJhdGlvbiIsIm1hY3JvIiwiRkxUX0VQU0lMT04iLCJhY3Rpb24iLCJfdGltZXNGb3JSZXBlYXQiLCJpIiwibGVuZ3RoIiwicHVzaCIsIl9jbG9uZURlY29yYXRpb24iLCJlYXNlT2JqIiwiYXJndW1lbnRzIiwiZHQiLCJ0IiwidXBkYXRlIiwiaXNEb25lIiwic3RhcnRXaXRoVGFyZ2V0IiwidGFyZ2V0Iiwic3RlcCIsIkFjdGlvbiIsInByb3RvdHlwZSIsImNhbGwiLCJhbXAiLCJzcGVlZCIsInRpbWVzIiwiTWF0aCIsInJvdW5kIiwiRmluaXRlVGltZUFjdGlvbiIsIlNlcXVlbmNlIiwidGVtcEFycmF5IiwiX2FjdGlvbnMiLCJfc3BsaXQiLCJfbGFzdCIsIl9yZXZlcnNlZCIsInBhcmFtQXJyYXkiLCJBcnJheSIsImxhc3QiLCJwcmV2IiwiYWN0aW9uMSIsIl9hY3Rpb25PbmVUd28iLCJpbml0V2l0aFR3b0FjdGlvbnMiLCJhY3Rpb25PbmUiLCJhY3Rpb25Ud28iLCJkdXJhdGlvbk9uZSIsImR1cmF0aW9uVHdvIiwiY2xvbmUiLCJzdG9wIiwibmV3X3QiLCJmb3VuZCIsImxvY1NwbGl0IiwibG9jQWN0aW9ucyIsImxvY0xhc3QiLCJhY3Rpb25Gb3VuZCIsIl9jb21wdXRlRWFzZVRpbWUiLCJyZXZlcnNlIiwiX3JldmVyc2VFYXNlTGlzdCIsInNlcXVlbmNlIiwicmVzdWx0IiwiUmVwZWF0IiwiX3RpbWVzIiwiX3RvdGFsIiwiX25leHREdCIsIl9hY3Rpb25JbnN0YW50IiwiX2lubmVyQWN0aW9uIiwiaW5pdFdpdGhBY3Rpb24iLCJkdXJhdGlvbiIsIkFjdGlvbkluc3RhbnQiLCJsb2NJbm5lckFjdGlvbiIsImxvY0R1cmF0aW9uIiwibG9jVGltZXMiLCJsb2NOZXh0RHQiLCJyZXBlYXQiLCJSZXBlYXRGb3JldmVyIiwiZ2V0RWxhcHNlZCIsInJlcGVhdEZvcmV2ZXIiLCJTcGF3biIsIl9vbmUiLCJfdHdvIiwiYWN0aW9uMiIsInJldCIsImQxIiwiZDIiLCJtYXgiLCJkZWxheVRpbWUiLCJwU3Bhd24iLCJzcGF3biIsIkRlbGF5VGltZSIsIlJldmVyc2VUaW1lIiwiX290aGVyIiwicmV2ZXJzZVRpbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFrQmFBLGM7OztBQVFhO0FBQ1M7QUFFL0IsNEJBQWFDLENBQWIsRUFBeUI7QUFBQTs7QUFBQTs7QUFDckI7QUFEcUIsWUFUZkMsU0FTZSxHQVRILENBU0c7QUFBQSxZQVJmQyxRQVFlLEdBUkosQ0FRSTtBQUFBLFlBUGZDLFVBT2UsR0FQRixLQU9FO0FBQUEsWUFOZkMsU0FNZSxHQU5TLEVBTVQ7QUFBQSxZQUxmQyxNQUtlLEdBTE4sQ0FLTTtBQUFBLFlBSmZDLGNBSWUsR0FKRSxLQUlGO0FBQUEsWUFIekJDLGFBR3lCLEdBSFQsS0FHUztBQUFBLFlBRmZDLFlBRWUsR0FGQSxLQUVBOztBQUVyQixVQUFJUixDQUFDLEtBQUtTLFNBQU4sSUFBbUIsQ0FBQ0MsS0FBSyxDQUFDVixDQUFELENBQTdCLEVBQWtDO0FBQzlCLGNBQUtXLGdCQUFMLENBQXNCWCxDQUF0QjtBQUNIOztBQUpvQjtBQUt4QjtBQUVEOzs7Ozs7OzttQ0FJYztBQUNWLGVBQU8sS0FBS0UsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7O3VDQUtrQkYsQyxFQUFXO0FBQ3pCLGFBQUtZLFNBQUwsR0FBa0JaLENBQUMsS0FBSyxDQUFQLEdBQVlhLGFBQU1DLFdBQWxCLEdBQWdDZCxDQUFqRCxDQUR5QixDQUV6QjtBQUNBO0FBQ0E7O0FBQ0EsYUFBS0UsUUFBTCxHQUFnQixDQUFoQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxlQUFPLElBQVA7QUFDSDs7OytCQUVTO0FBQ04sZUFBUSxLQUFLRCxRQUFMLElBQWlCLEtBQUtVLFNBQTlCO0FBQ0g7Ozt1Q0FFaUJHLE0sRUFBd0I7QUFDdENBLFFBQUFBLE1BQU0sQ0FBQ1QsY0FBUCxHQUF3QixLQUFLQSxjQUE3QjtBQUNBUyxRQUFBQSxNQUFNLENBQUNWLE1BQVAsR0FBZ0IsS0FBS0EsTUFBckI7QUFDQVUsUUFBQUEsTUFBTSxDQUFDQyxlQUFQLEdBQXlCLEtBQUtBLGVBQTlCO0FBQ0FELFFBQUFBLE1BQU0sQ0FBQ1gsU0FBUCxHQUFtQixLQUFLQSxTQUF4QjtBQUNBVyxRQUFBQSxNQUFNLENBQUNQLFlBQVAsR0FBc0IsS0FBS0EsWUFBM0I7QUFDQU8sUUFBQUEsTUFBTSxDQUFDUixhQUFQLEdBQXVCLEtBQUtBLGFBQTVCO0FBQ0g7Ozt1Q0FFaUJRLE0sRUFBd0I7QUFDdEMsWUFBSSxLQUFLWCxTQUFULEVBQW9CO0FBQ2hCVyxVQUFBQSxNQUFNLENBQUNYLFNBQVAsR0FBbUIsRUFBbkI7O0FBQ0EsZUFBSyxJQUFJYSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtiLFNBQUwsQ0FBZWMsTUFBbkMsRUFBMkNELENBQUMsRUFBNUMsRUFBZ0Q7QUFDNUNGLFlBQUFBLE1BQU0sQ0FBQ1gsU0FBUCxDQUFpQmUsSUFBakIsQ0FBc0IsS0FBS2YsU0FBTCxDQUFlYSxDQUFmLENBQXRCO0FBQ0g7QUFDSjtBQUNKOzs7OEJBRVE7QUFDTCxZQUFJRixNQUFNLEdBQUcsSUFBSWhCLGNBQUosQ0FBbUIsS0FBS2EsU0FBeEIsQ0FBYjs7QUFDQSxhQUFLUSxnQkFBTCxDQUFzQkwsTUFBdEI7O0FBQ0EsZUFBT0EsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7NkJBVVFNLE8sRUFBOEI7QUFDbEMsWUFBSSxLQUFLakIsU0FBVCxFQUNJLEtBQUtBLFNBQUwsQ0FBZWMsTUFBZixHQUF3QixDQUF4QixDQURKLEtBR0ksS0FBS2QsU0FBTCxHQUFpQixFQUFqQjs7QUFDSixhQUFLLElBQUlhLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdLLFNBQVMsQ0FBQ0osTUFBOUIsRUFBc0NELENBQUMsRUFBdkM7QUFDSSxlQUFLYixTQUFMLENBQWVlLElBQWYsQ0FBb0JHLFNBQVMsQ0FBQ0wsQ0FBRCxDQUE3QjtBQURKOztBQUVBLGVBQU8sSUFBUDtBQUNIOzs7dUNBRWlCTSxFLEVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU9BLEVBQVA7QUFDSDs7OzJCQUVLQSxFLEVBQVk7QUFDZCxZQUFJLEtBQUtwQixVQUFULEVBQXFCO0FBQ2pCLGVBQUtBLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxlQUFLRCxRQUFMLEdBQWdCLENBQWhCO0FBQ0gsU0FIRCxNQUlJLEtBQUtBLFFBQUwsSUFBaUJxQixFQUFqQixDQUxVLENBT2Q7QUFDQTs7O0FBQ0EsWUFBSUMsQ0FBQyxHQUFHLEtBQUt0QixRQUFMLElBQWlCLEtBQUtVLFNBQUwsR0FBaUIsa0JBQWpCLEdBQXNDLEtBQUtBLFNBQTNDLEdBQXVELGtCQUF4RSxDQUFSO0FBQ0FZLFFBQUFBLENBQUMsR0FBSSxJQUFJQSxDQUFKLEdBQVFBLENBQVIsR0FBWSxDQUFqQjtBQUNBLGFBQUtDLE1BQUwsQ0FBWUQsQ0FBQyxHQUFHLENBQUosR0FBUUEsQ0FBUixHQUFZLENBQXhCLEVBWGMsQ0FhZDs7QUFDQSxZQUFJLEtBQUtqQixhQUFMLElBQXNCLEtBQUtTLGVBQUwsR0FBdUIsQ0FBN0MsSUFBa0QsS0FBS1UsTUFBTCxFQUF0RCxFQUFxRTtBQUNqRSxjQUFJLENBQUMsS0FBS3BCLGNBQVYsRUFBMEI7QUFDdEIsaUJBQUtVLGVBQUw7QUFDSCxXQUhnRSxDQUlqRTs7O0FBQ0EsZUFBS1csZUFBTCxDQUFxQixLQUFLQyxNQUExQixFQUxpRSxDQU1qRTtBQUNBO0FBQ0E7O0FBQ0EsZUFBS0MsSUFBTCxDQUFVLEtBQUszQixRQUFMLEdBQWdCLEtBQUtVLFNBQS9CO0FBRUg7QUFDSjs7O3NDQUVnQmdCLE0sRUFBYTtBQUMxQkUsdUJBQU9DLFNBQVAsQ0FBaUJKLGVBQWpCLENBQWlDSyxJQUFqQyxDQUFzQyxJQUF0QyxFQUE0Q0osTUFBNUM7O0FBQ0EsYUFBSzFCLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxhQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0g7OztnQ0FFVTtBQUNQLDBCQUFNLElBQU47QUFDQSxlQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozt1Q0FLa0I4QixHLEVBQVU7QUFDeEI7QUFDQSwwQkFBTSxJQUFOO0FBQ0g7QUFFRDs7Ozs7Ozs7eUNBS29CO0FBQ2hCO0FBQ0EsMEJBQU0sSUFBTjtBQUNBLGVBQU8sQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OzRCQVdPQyxNLEVBQXVCO0FBQzFCLFlBQUlBLE1BQUssSUFBSSxDQUFiLEVBQWdCO0FBQ1osNEJBQU0sSUFBTjtBQUNBLGlCQUFPLElBQVA7QUFDSDs7QUFFRCxhQUFLMUIsWUFBTCxHQUFvQixJQUFwQixDQU4wQixDQU1EOztBQUN6QixhQUFLSCxNQUFMLElBQWU2QixNQUFmO0FBQ0EsZUFBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7OztpQ0FJb0I7QUFDaEIsZUFBTyxLQUFLN0IsTUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7OytCQUtVNkIsSyxFQUErQjtBQUNyQyxhQUFLN0IsTUFBTCxHQUFjNkIsS0FBZDtBQUNBLGVBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs2QkFTUUMsSyxFQUErQjtBQUNuQ0EsUUFBQUEsS0FBSyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0YsS0FBWCxDQUFSOztBQUNBLFlBQUl6QixLQUFLLENBQUN5QixLQUFELENBQUwsSUFBZ0JBLEtBQUssR0FBRyxDQUE1QixFQUErQjtBQUMzQiw0QkFBTSxJQUFOO0FBQ0EsaUJBQU8sSUFBUDtBQUNIOztBQUNELGFBQUs1QixhQUFMLEdBQXFCLElBQXJCLENBTm1DLENBTVQ7O0FBQzFCLGFBQUtTLGVBQUwsSUFBd0JtQixLQUF4QjtBQUNBLGVBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7O3NDQVFpQztBQUM3QixhQUFLNUIsYUFBTCxHQUFxQixJQUFyQixDQUQ2QixDQUNIOztBQUMxQixhQUFLUyxlQUFMLEdBQXVCLEtBQUtmLFNBQTVCO0FBQ0EsYUFBS0ssY0FBTCxHQUFzQixJQUF0QjtBQUNBLGVBQU8sSUFBUDtBQUNIOzs7O0lBdk8rQmdDLHdCO0FBME9wQzs7Ozs7OztNQUdhQyxROzs7QUF3QlQsc0JBQWFDLFNBQWIsRUFBNkI7QUFBQTs7QUFBQTs7QUFDekI7QUFEeUIsYUFoQnJCQyxRQWdCcUIsR0FoQlEsRUFnQlI7QUFBQSxhQWZyQkMsTUFlcUIsR0FmWixDQWVZO0FBQUEsYUFkckJDLEtBY3FCLEdBZGIsQ0FjYTtBQUFBLGFBYnJCQyxTQWFxQixHQWJULEtBYVM7QUFHekIsVUFBSUMsVUFBVSxHQUFJTCxTQUFTLFlBQVlNLEtBQXRCLEdBQStCTixTQUEvQixHQUEyQ2xCLFNBQTVEOztBQUNBLFVBQUl1QixVQUFVLENBQUMzQixNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQ3pCLDRCQUFRLElBQVI7QUFDQTtBQUNIOztBQUNELFVBQUk2QixJQUFJLEdBQUdGLFVBQVUsQ0FBQzNCLE1BQVgsR0FBb0IsQ0FBL0I7QUFDQSxVQUFLNkIsSUFBSSxJQUFJLENBQVQsSUFBZ0JGLFVBQVUsQ0FBQ0UsSUFBRCxDQUFWLElBQW9CLElBQXhDLEVBQ0ksa0JBQU0sSUFBTjs7QUFFSixVQUFJQSxJQUFJLElBQUksQ0FBWixFQUFlO0FBQ1gsWUFBSUMsSUFBSSxHQUFHSCxVQUFVLENBQUMsQ0FBRCxDQUFyQjtBQUFBLFlBQTBCSSxPQUExQjs7QUFDQSxhQUFLLElBQUloQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHOEIsSUFBcEIsRUFBMEI5QixDQUFDLEVBQTNCLEVBQStCO0FBQzNCLGNBQUk0QixVQUFVLENBQUM1QixDQUFELENBQWQsRUFBbUI7QUFDZmdDLFlBQUFBLE9BQU8sR0FBR0QsSUFBVjtBQUNBQSxZQUFBQSxJQUFJLEdBQUdULFFBQVEsQ0FBQ1csYUFBVCxDQUF1QkQsT0FBdkIsRUFBZ0NKLFVBQVUsQ0FBQzVCLENBQUQsQ0FBMUMsQ0FBUDtBQUNIO0FBQ0o7O0FBQ0QsZUFBS2tDLGtCQUFMLENBQXdCSCxJQUF4QixFQUE4QkgsVUFBVSxDQUFDRSxJQUFELENBQXhDO0FBQ0g7O0FBckJ3QjtBQXNCNUI7QUFFRDs7Ozs7Ozs7Ozt5Q0FNb0JLLFMsRUFBZ0JDLFMsRUFBZ0I7QUFDaEQsWUFBSSxDQUFDRCxTQUFELElBQWMsQ0FBQ0MsU0FBbkIsRUFBOEI7QUFDMUIsOEJBQVEsSUFBUjtBQUNBLGlCQUFPLEtBQVA7QUFDSDs7QUFFRCxZQUFJQyxXQUFXLEdBQUdGLFNBQVMsQ0FBQ3hDLFNBQTVCO0FBQUEsWUFBdUMyQyxXQUFXLEdBQUdGLFNBQVMsQ0FBQ3pDLFNBQS9EO0FBQ0EwQyxRQUFBQSxXQUFXLElBQUlGLFNBQVMsQ0FBQzdDLGFBQVYsR0FBMEI2QyxTQUFTLENBQUNwQyxlQUFwQyxHQUFzRCxDQUFyRTtBQUNBdUMsUUFBQUEsV0FBVyxJQUFJRixTQUFTLENBQUM5QyxhQUFWLEdBQTBCOEMsU0FBUyxDQUFDckMsZUFBcEMsR0FBc0QsQ0FBckU7QUFDQSxZQUFJaEIsQ0FBQyxHQUFHc0QsV0FBVyxHQUFHQyxXQUF0QjtBQUNBLGFBQUs1QyxnQkFBTCxDQUFzQlgsQ0FBdEI7QUFFQSxhQUFLeUMsUUFBTCxDQUFjLENBQWQsSUFBbUJXLFNBQW5CO0FBQ0EsYUFBS1gsUUFBTCxDQUFjLENBQWQsSUFBbUJZLFNBQW5CO0FBQ0EsZUFBTyxJQUFQO0FBQ0g7Ozs4QkFFUTtBQUNMLFlBQUl0QyxNQUFNLEdBQUcsSUFBSXdCLFFBQUosRUFBYjs7QUFDQSxhQUFLbkIsZ0JBQUwsQ0FBc0JMLE1BQXRCOztBQUNBQSxRQUFBQSxNQUFNLENBQUNvQyxrQkFBUCxDQUEwQixLQUFLVixRQUFMLENBQWMsQ0FBZCxFQUFpQmUsS0FBakIsRUFBMUIsRUFBb0QsS0FBS2YsUUFBTCxDQUFjLENBQWQsRUFBaUJlLEtBQWpCLEVBQXBEO0FBQ0EsZUFBT3pDLE1BQVA7QUFDSDs7O3NDQUVnQmEsTSxFQUFhO0FBQzFCN0IsUUFBQUEsY0FBYyxDQUFDZ0MsU0FBZixDQUF5QkosZUFBekIsQ0FBeUNLLElBQXpDLENBQThDLElBQTlDLEVBQW9ESixNQUFwRDtBQUNBLGFBQUtjLE1BQUwsR0FBYyxLQUFLRCxRQUFMLENBQWMsQ0FBZCxFQUFpQjdCLFNBQWpCLEdBQTZCLEtBQUtBLFNBQWhEO0FBQ0EsYUFBSzhCLE1BQUwsSUFBZSxLQUFLRCxRQUFMLENBQWMsQ0FBZCxFQUFpQmxDLGFBQWpCLEdBQWlDLEtBQUtrQyxRQUFMLENBQWMsQ0FBZCxFQUFpQnpCLGVBQWxELEdBQW9FLENBQW5GO0FBQ0EsYUFBSzJCLEtBQUwsR0FBYSxDQUFDLENBQWQ7QUFDSDs7OzZCQUVPO0FBQ0o7QUFDQSxZQUFJLEtBQUtBLEtBQUwsS0FBZSxDQUFDLENBQXBCLEVBQ0ksS0FBS0YsUUFBTCxDQUFjLEtBQUtFLEtBQW5CLEVBQTBCYyxJQUExQjs7QUFDSjNCLHVCQUFPQyxTQUFQLENBQWlCMEIsSUFBakIsQ0FBc0J6QixJQUF0QixDQUEyQixJQUEzQjtBQUNIOzs7NkJBRU9ULEUsRUFBWTtBQUNoQixZQUFJbUMsS0FBSjtBQUFBLFlBQW1CQyxLQUFLLEdBQUcsQ0FBM0I7QUFDQSxZQUFJQyxRQUFRLEdBQUcsS0FBS2xCLE1BQXBCO0FBQ0EsWUFBSW1CLFVBQVUsR0FBRyxLQUFLcEIsUUFBdEI7QUFDQSxZQUFJcUIsT0FBTyxHQUFHLEtBQUtuQixLQUFuQjtBQUNBLFlBQUlvQixXQUFKO0FBRUF4QyxRQUFBQSxFQUFFLEdBQUcsS0FBS3lDLGdCQUFMLENBQXNCekMsRUFBdEIsQ0FBTDs7QUFDQSxZQUFJQSxFQUFFLEdBQUdxQyxRQUFULEVBQW1CO0FBQ2Y7QUFDQUYsVUFBQUEsS0FBSyxHQUFJRSxRQUFRLEtBQUssQ0FBZCxHQUFtQnJDLEVBQUUsR0FBR3FDLFFBQXhCLEdBQW1DLENBQTNDOztBQUVBLGNBQUlELEtBQUssS0FBSyxDQUFWLElBQWVHLE9BQU8sS0FBSyxDQUEzQixJQUFnQyxLQUFLbEIsU0FBekMsRUFBb0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQWlCLFlBQUFBLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY3BDLE1BQWQsQ0FBcUIsQ0FBckI7QUFDQW9DLFlBQUFBLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0osSUFBZDtBQUNIO0FBQ0osU0FaRCxNQVlPO0FBQ0g7QUFDQUUsVUFBQUEsS0FBSyxHQUFHLENBQVI7QUFDQUQsVUFBQUEsS0FBSyxHQUFJRSxRQUFRLEtBQUssQ0FBZCxHQUFtQixDQUFuQixHQUF1QixDQUFDckMsRUFBRSxHQUFHcUMsUUFBTixLQUFtQixJQUFJQSxRQUF2QixDQUEvQjs7QUFFQSxjQUFJRSxPQUFPLEtBQUssQ0FBQyxDQUFqQixFQUFvQjtBQUNoQjtBQUNBRCxZQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNsQyxlQUFkLENBQThCLEtBQUtDLE1BQW5DO0FBQ0FpQyxZQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNwQyxNQUFkLENBQXFCLENBQXJCO0FBQ0FvQyxZQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNKLElBQWQ7QUFDSDs7QUFDRCxjQUFJSyxPQUFPLEtBQUssQ0FBaEIsRUFBbUI7QUFDZjtBQUNBRCxZQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNwQyxNQUFkLENBQXFCLENBQXJCO0FBQ0FvQyxZQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNKLElBQWQ7QUFDSDtBQUNKOztBQUVETSxRQUFBQSxXQUFXLEdBQUdGLFVBQVUsQ0FBQ0YsS0FBRCxDQUF4QixDQXRDZ0IsQ0F1Q2hCOztBQUNBLFlBQUlHLE9BQU8sS0FBS0gsS0FBWixJQUFxQkksV0FBVyxDQUFDckMsTUFBWixFQUF6QixFQUNJLE9BekNZLENBMkNoQjs7QUFDQSxZQUFJb0MsT0FBTyxLQUFLSCxLQUFoQixFQUNJSSxXQUFXLENBQUNwQyxlQUFaLENBQTRCLEtBQUtDLE1BQWpDO0FBRUo4QixRQUFBQSxLQUFLLEdBQUdBLEtBQUssR0FBR0ssV0FBVyxDQUFDL0MsZUFBNUI7QUFDQStDLFFBQUFBLFdBQVcsQ0FBQ3RDLE1BQVosQ0FBbUJpQyxLQUFLLEdBQUcsQ0FBUixHQUFZQSxLQUFLLEdBQUcsQ0FBcEIsR0FBd0JBLEtBQTNDO0FBQ0EsYUFBS2YsS0FBTCxHQUFhZ0IsS0FBYjtBQUNIOzs7Z0NBRVU7QUFDUCxZQUFJNUMsTUFBTSxHQUFHd0IsUUFBUSxDQUFDVyxhQUFULENBQXVCLEtBQUtULFFBQUwsQ0FBYyxDQUFkLEVBQWlCd0IsT0FBakIsRUFBdkIsRUFBbUQsS0FBS3hCLFFBQUwsQ0FBYyxDQUFkLEVBQWlCd0IsT0FBakIsRUFBbkQsQ0FBYjs7QUFDQSxhQUFLN0MsZ0JBQUwsQ0FBc0JMLE1BQXRCOztBQUNBLGFBQUttRCxnQkFBTCxDQUFzQm5ELE1BQXRCOztBQUNBQSxRQUFBQSxNQUFNLENBQUM2QixTQUFQLEdBQW1CLElBQW5CO0FBQ0EsZUFBTzdCLE1BQVA7QUFDSDs7OztJQXRKeUJoQixjO0FBeUo5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBOzs7OztBQTNLYXdDLEVBQUFBLFEsQ0FFRlcsYSxHQUFnQixVQUFVRSxTQUFWLEVBQXFDQyxTQUFyQyxFQUFnRTtBQUNuRixRQUFJYyxRQUFRLEdBQUcsSUFBSTVCLFFBQUosRUFBZjtBQUNBNEIsSUFBQUEsUUFBUSxDQUFDaEIsa0JBQVQsQ0FBNEJDLFNBQTVCLEVBQXVDQyxTQUF2QztBQUNBLFdBQU9jLFFBQVA7QUFDSCxHOztBQXNLRSxXQUFTQSxRQUFUO0FBQW1CO0FBQXNCM0IsRUFBQUEsU0FBekMsRUFBeUU7QUFDNUUsUUFBSUssVUFBVSxHQUFJTCxTQUFTLFlBQVlNLEtBQXRCLEdBQStCTixTQUEvQixHQUEyQ2xCLFNBQTVEOztBQUNBLFFBQUl1QixVQUFVLENBQUMzQixNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQ3pCLDBCQUFRLElBQVI7QUFDQSxhQUFPLElBQVA7QUFDSDs7QUFDRCxRQUFJNkIsSUFBSSxHQUFHRixVQUFVLENBQUMzQixNQUFYLEdBQW9CLENBQS9CO0FBQ0EsUUFBSzZCLElBQUksSUFBSSxDQUFULElBQWdCRixVQUFVLENBQUNFLElBQUQsQ0FBVixJQUFvQixJQUF4QyxFQUNJLGtCQUFNLElBQU47QUFFSixRQUFJcUIsTUFBVyxHQUFHLElBQWxCOztBQUNBLFFBQUlyQixJQUFJLElBQUksQ0FBWixFQUFlO0FBQ1hxQixNQUFBQSxNQUFNLEdBQUd2QixVQUFVLENBQUMsQ0FBRCxDQUFuQjs7QUFDQSxXQUFLLElBQUk1QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxJQUFJOEIsSUFBckIsRUFBMkI5QixDQUFDLEVBQTVCLEVBQWdDO0FBQzVCLFlBQUk0QixVQUFVLENBQUM1QixDQUFELENBQWQsRUFBbUI7QUFDZm1ELFVBQUFBLE1BQU0sR0FBRzdCLFFBQVEsQ0FBQ1csYUFBVCxDQUF1QmtCLE1BQXZCLEVBQStCdkIsVUFBVSxDQUFDNUIsQ0FBRCxDQUF6QyxDQUFUO0FBQ0g7QUFDSjtBQUNKOztBQUVELFdBQU9tRCxNQUFQO0FBQ0g7O0FBQUE7QUFFRDs7Ozs7Ozs7Ozs7O01BV2FDLE07OztBQVFULG9CQUFhdEQsTUFBYixFQUEyQm9CLEtBQTNCLEVBQXdDO0FBQUE7O0FBQUE7O0FBQ3BDO0FBRG9DLGFBTmhDbUMsTUFNZ0MsR0FOdkIsQ0FNdUI7QUFBQSxhQUxoQ0MsTUFLZ0MsR0FMdkIsQ0FLdUI7QUFBQSxhQUpoQ0MsT0FJZ0MsR0FKdEIsQ0FJc0I7QUFBQSxhQUhoQ0MsY0FHZ0MsR0FIZixLQUdlO0FBQUEsYUFGaENDLFlBRWdDLEdBRlEsSUFFUjtBQUVwQ3ZDLE1BQUFBLEtBQUssS0FBSzFCLFNBQVYsSUFBdUIsT0FBS2tFLGNBQUwsQ0FBb0I1RCxNQUFwQixFQUE0Qm9CLEtBQTVCLENBQXZCO0FBRm9DO0FBR3ZDO0FBRUQ7Ozs7Ozs7OztxQ0FLZ0JwQixNLEVBQTBCb0IsSyxFQUFlO0FBQ3JELFlBQUl5QyxRQUFRLEdBQUc3RCxNQUFNLENBQUNILFNBQVAsR0FBbUJ1QixLQUFsQzs7QUFFQSxZQUFJLEtBQUt4QixnQkFBTCxDQUFzQmlFLFFBQXRCLENBQUosRUFBcUM7QUFDakMsZUFBS04sTUFBTCxHQUFjbkMsS0FBZDtBQUNBLGVBQUt1QyxZQUFMLEdBQW9CM0QsTUFBcEI7O0FBQ0EsY0FBSUEsTUFBTSxZQUFZOEQsNEJBQXRCLEVBQXFDO0FBQ2pDLGlCQUFLSixjQUFMLEdBQXNCLElBQXRCO0FBQ0EsaUJBQUtILE1BQUwsSUFBZSxDQUFmO0FBQ0g7O0FBQ0QsZUFBS0MsTUFBTCxHQUFjLENBQWQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0g7O0FBQ0QsZUFBTyxLQUFQO0FBQ0g7Ozs4QkFFUTtBQUNMLFlBQUl4RCxNQUFNLEdBQUcsSUFBSXNELE1BQUosRUFBYjs7QUFDQSxhQUFLakQsZ0JBQUwsQ0FBc0JMLE1BQXRCOztBQUNBQSxRQUFBQSxNQUFNLENBQUM0RCxjQUFQLENBQXNCLEtBQUtELFlBQUwsQ0FBbUJsQixLQUFuQixFQUF0QixFQUFrRCxLQUFLYyxNQUF2RDtBQUNBLGVBQU92RCxNQUFQO0FBQ0g7OztzQ0FFZ0JhLE0sRUFBYTtBQUMxQixhQUFLMkMsTUFBTCxHQUFjLENBQWQ7QUFDQSxhQUFLQyxPQUFMLEdBQWUsS0FBS0UsWUFBTCxDQUFtQjlELFNBQW5CLEdBQStCLEtBQUtBLFNBQW5EO0FBQ0FiLFFBQUFBLGNBQWMsQ0FBQ2dDLFNBQWYsQ0FBeUJKLGVBQXpCLENBQXlDSyxJQUF6QyxDQUE4QyxJQUE5QyxFQUFvREosTUFBcEQ7O0FBQ0EsYUFBSzhDLFlBQUwsQ0FBbUIvQyxlQUFuQixDQUFtQ0MsTUFBbkM7QUFDSDs7OzZCQUVPO0FBQ0osYUFBSzhDLFlBQUwsQ0FBbUJqQixJQUFuQjs7QUFDQTNCLHVCQUFPQyxTQUFQLENBQWlCMEIsSUFBakIsQ0FBc0J6QixJQUF0QixDQUEyQixJQUEzQjtBQUNIOzs7NkJBRU9ULEUsRUFBWTtBQUNoQkEsUUFBQUEsRUFBRSxHQUFHLEtBQUt5QyxnQkFBTCxDQUFzQnpDLEVBQXRCLENBQUw7QUFDQSxZQUFJdUQsY0FBYyxHQUFHLEtBQUtKLFlBQTFCO0FBQ0EsWUFBSUssV0FBVyxHQUFHLEtBQUtuRSxTQUF2QjtBQUNBLFlBQUlvRSxRQUFRLEdBQUcsS0FBS1YsTUFBcEI7QUFDQSxZQUFJVyxTQUFTLEdBQUcsS0FBS1QsT0FBckI7O0FBRUEsWUFBSWpELEVBQUUsSUFBSTBELFNBQVYsRUFBcUI7QUFDakIsaUJBQU8xRCxFQUFFLEdBQUcwRCxTQUFMLElBQWtCLEtBQUtWLE1BQUwsR0FBY1MsUUFBdkMsRUFBaUQ7QUFDN0NGLFlBQUFBLGNBQWMsQ0FBQ3JELE1BQWYsQ0FBc0IsQ0FBdEI7QUFDQSxpQkFBSzhDLE1BQUw7QUFDQU8sWUFBQUEsY0FBYyxDQUFDckIsSUFBZjtBQUNBcUIsWUFBQUEsY0FBYyxDQUFDbkQsZUFBZixDQUErQixLQUFLQyxNQUFwQztBQUNBcUQsWUFBQUEsU0FBUyxJQUFJSCxjQUFjLENBQUNsRSxTQUFmLEdBQTJCbUUsV0FBeEM7QUFDQSxpQkFBS1AsT0FBTCxHQUFlUyxTQUFTLEdBQUcsQ0FBWixHQUFnQixDQUFoQixHQUFvQkEsU0FBbkM7QUFDSCxXQVJnQixDQVVqQjs7O0FBQ0EsY0FBSTFELEVBQUUsSUFBSSxHQUFOLElBQWEsS0FBS2dELE1BQUwsR0FBY1MsUUFBL0IsRUFBeUM7QUFDckM7QUFDQUYsWUFBQUEsY0FBYyxDQUFDckQsTUFBZixDQUFzQixDQUF0QjtBQUNBLGlCQUFLOEMsTUFBTDtBQUNILFdBZmdCLENBaUJqQjs7O0FBQ0EsY0FBSSxDQUFDLEtBQUtFLGNBQVYsRUFBMEI7QUFDdEIsZ0JBQUksS0FBS0YsTUFBTCxLQUFnQlMsUUFBcEIsRUFBOEI7QUFDMUJGLGNBQUFBLGNBQWMsQ0FBQ3JCLElBQWY7QUFDSCxhQUZELE1BRU87QUFDSDtBQUNBcUIsY0FBQUEsY0FBYyxDQUFDckQsTUFBZixDQUFzQkYsRUFBRSxJQUFJMEQsU0FBUyxHQUFHSCxjQUFjLENBQUNsRSxTQUFmLEdBQTJCbUUsV0FBM0MsQ0FBeEI7QUFDSDtBQUNKO0FBQ0osU0ExQkQsTUEwQk87QUFDSEQsVUFBQUEsY0FBYyxDQUFDckQsTUFBZixDQUF1QkYsRUFBRSxHQUFHeUQsUUFBTixHQUFrQixHQUF4QztBQUNIO0FBQ0o7OzsrQkFFUztBQUNOLGVBQU8sS0FBS1QsTUFBTCxLQUFnQixLQUFLRCxNQUE1QjtBQUNIOzs7Z0NBRVU7QUFDUCxZQUFJdkQsTUFBTSxHQUFHLElBQUlzRCxNQUFKLENBQVcsS0FBS0ssWUFBTCxDQUFtQlQsT0FBbkIsRUFBWCxFQUF5QyxLQUFLSyxNQUE5QyxDQUFiOztBQUNBLGFBQUtsRCxnQkFBTCxDQUFzQkwsTUFBdEI7O0FBQ0EsYUFBS21ELGdCQUFMLENBQXNCbkQsTUFBdEI7O0FBQ0EsZUFBT0EsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7cUNBSWdCQSxNLEVBQWE7QUFDekIsWUFBSSxLQUFLMkQsWUFBTCxLQUFzQjNELE1BQTFCLEVBQWtDO0FBQzlCLGVBQUsyRCxZQUFMLEdBQW9CM0QsTUFBcEI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7dUNBSWtCO0FBQ2QsZUFBTyxLQUFLMkQsWUFBWjtBQUNIOzs7O0lBdEh1QjNFLGM7QUF5SDVCOzs7Ozs7Ozs7Ozs7Ozs7QUFXTyxXQUFTbUYsTUFBVCxDQUFpQm5FLE1BQWpCLEVBQThCb0IsS0FBOUIsRUFBa0Q7QUFDckQsV0FBTyxJQUFJa0MsTUFBSixDQUFXdEQsTUFBWCxFQUFtQm9CLEtBQW5CLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7O01BV2FnRCxhOzs7QUFJVCwyQkFBYXBFLE1BQWIsRUFBc0M7QUFBQTs7QUFBQTs7QUFDbEM7QUFEa0MsYUFGOUIyRCxZQUU4QixHQUZRLElBRVI7QUFFbEMzRCxNQUFBQSxNQUFNLElBQUksT0FBSzRELGNBQUwsQ0FBb0I1RCxNQUFwQixDQUFWO0FBRmtDO0FBR3JDO0FBRUQ7Ozs7Ozs7O3FDQUlnQkEsTSxFQUF3QjtBQUNwQyxZQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNULDhCQUFRLElBQVI7QUFDQSxpQkFBTyxLQUFQO0FBQ0g7O0FBRUQsYUFBSzJELFlBQUwsR0FBb0IzRCxNQUFwQjtBQUNBLGVBQU8sSUFBUDtBQUNIOzs7OEJBRVE7QUFDTCxZQUFJQSxNQUFNLEdBQUcsSUFBSW9FLGFBQUosRUFBYjs7QUFDQSxhQUFLL0QsZ0JBQUwsQ0FBc0JMLE1BQXRCOztBQUNBQSxRQUFBQSxNQUFNLENBQUM0RCxjQUFQLENBQXNCLEtBQUtELFlBQUwsQ0FBbUJsQixLQUFuQixFQUF0QjtBQUNBLGVBQU96QyxNQUFQO0FBQ0g7OztzQ0FFZ0JhLE0sRUFBYTtBQUMxQjdCLFFBQUFBLGNBQWMsQ0FBQ2dDLFNBQWYsQ0FBeUJKLGVBQXpCLENBQXlDSyxJQUF6QyxDQUE4QyxJQUE5QyxFQUFvREosTUFBcEQ7O0FBQ0EsYUFBSzhDLFlBQUwsQ0FBbUIvQyxlQUFuQixDQUFtQ0MsTUFBbkM7QUFDSDs7OzJCQUVLTCxFLEVBQVM7QUFDWCxZQUFJdUQsY0FBYyxHQUFHLEtBQUtKLFlBQTFCO0FBQ0FJLFFBQUFBLGNBQWMsQ0FBQ2pELElBQWYsQ0FBb0JOLEVBQXBCOztBQUNBLFlBQUl1RCxjQUFjLENBQUNwRCxNQUFmLEVBQUosRUFBNkI7QUFDekI7QUFDQW9ELFVBQUFBLGNBQWMsQ0FBQ25ELGVBQWYsQ0FBK0IsS0FBS0MsTUFBcEMsRUFGeUIsQ0FHekI7QUFDQTtBQUNBOztBQUNBa0QsVUFBQUEsY0FBYyxDQUFDakQsSUFBZixDQUFvQmlELGNBQWMsQ0FBQ00sVUFBZixLQUE4Qk4sY0FBYyxDQUFDbEUsU0FBakU7QUFDSDtBQUNKOzs7K0JBRVM7QUFDTixlQUFPLEtBQVA7QUFDSDs7O2dDQUVVO0FBQ1AsWUFBSUcsTUFBTSxHQUFHLElBQUlvRSxhQUFKLENBQWtCLEtBQUtULFlBQUwsQ0FBbUJULE9BQW5CLEVBQWxCLENBQWI7O0FBQ0EsYUFBSzdDLGdCQUFMLENBQXNCTCxNQUF0Qjs7QUFDQSxhQUFLbUQsZ0JBQUwsQ0FBc0JuRCxNQUF0Qjs7QUFDQSxlQUFPQSxNQUFQO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJZ0JBLE0sRUFBYTtBQUN6QixZQUFJLEtBQUsyRCxZQUFMLEtBQXNCM0QsTUFBMUIsRUFBa0M7QUFDOUIsZUFBSzJELFlBQUwsR0FBb0IzRCxNQUFwQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozt1Q0FJa0I7QUFDZCxlQUFPLEtBQUsyRCxZQUFaO0FBQ0g7Ozs7SUEzRThCM0UsYztBQThFbkM7Ozs7Ozs7Ozs7Ozs7O0FBVU8sV0FBU3NGLGFBQVQsQ0FBd0J0RSxNQUF4QixFQUFpRTtBQUNwRSxXQUFPLElBQUlvRSxhQUFKLENBQWtCcEUsTUFBbEIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7TUFLYXVFLEs7OztBQVdULG1CQUFhOUMsU0FBYixFQUE4QjtBQUFBOztBQUFBOztBQUMxQjtBQUQwQixhQUh0QitDLElBR3NCLEdBSFEsSUFHUjtBQUFBLGFBRnRCQyxJQUVzQixHQUZRLElBRVI7QUFHMUIsVUFBSTNDLFVBQVUsR0FBSUwsU0FBUyxZQUFZTSxLQUF0QixHQUErQk4sU0FBL0IsR0FBMkNsQixTQUE1RDs7QUFDQSxVQUFJdUIsVUFBVSxDQUFDM0IsTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUN6Qiw0QkFBUSxJQUFSO0FBQ0E7QUFDSDs7QUFDRCxVQUFJNkIsSUFBSSxHQUFHRixVQUFVLENBQUMzQixNQUFYLEdBQW9CLENBQS9CO0FBQ0EsVUFBSzZCLElBQUksSUFBSSxDQUFULElBQWdCRixVQUFVLENBQUNFLElBQUQsQ0FBVixJQUFvQixJQUF4QyxFQUNJLGtCQUFNLElBQU47O0FBRUosVUFBSUEsSUFBSSxJQUFJLENBQVosRUFBZTtBQUNYLFlBQUlDLElBQUksR0FBR0gsVUFBVSxDQUFDLENBQUQsQ0FBckI7QUFBQSxZQUEwQkksT0FBMUI7O0FBQ0EsYUFBSyxJQUFJaEMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzhCLElBQXBCLEVBQTBCOUIsQ0FBQyxFQUEzQixFQUErQjtBQUMzQixjQUFJNEIsVUFBVSxDQUFDNUIsQ0FBRCxDQUFkLEVBQW1CO0FBQ2ZnQyxZQUFBQSxPQUFPLEdBQUdELElBQVY7QUFDQUEsWUFBQUEsSUFBSSxHQUFHc0MsS0FBSyxDQUFDcEMsYUFBTixDQUFvQkQsT0FBcEIsRUFBNkJKLFVBQVUsQ0FBQzVCLENBQUQsQ0FBdkMsQ0FBUDtBQUNIO0FBQ0o7O0FBQ0QsZUFBS2tDLGtCQUFMLENBQXdCSCxJQUF4QixFQUE4QkgsVUFBVSxDQUFDRSxJQUFELENBQXhDO0FBQ0g7O0FBckJ5QjtBQXNCN0I7QUFFRDs7Ozs7Ozs7O3lDQUtvQkUsTyxFQUFjd0MsTyxFQUFjO0FBQzVDLFlBQUksQ0FBQ3hDLE9BQUQsSUFBWSxDQUFDd0MsT0FBakIsRUFBMEI7QUFDdEIsOEJBQVEsSUFBUjtBQUNBLGlCQUFPLEtBQVA7QUFDSDs7QUFFRCxZQUFJQyxHQUFHLEdBQUcsS0FBVjtBQUVBLFlBQUlDLEVBQUUsR0FBRzFDLE9BQU8sQ0FBQ3JDLFNBQWpCO0FBQ0EsWUFBSWdGLEVBQUUsR0FBR0gsT0FBTyxDQUFDN0UsU0FBakI7O0FBRUEsWUFBSSxLQUFLRCxnQkFBTCxDQUFzQnlCLElBQUksQ0FBQ3lELEdBQUwsQ0FBU0YsRUFBVCxFQUFhQyxFQUFiLENBQXRCLENBQUosRUFBNkM7QUFDekMsZUFBS0wsSUFBTCxHQUFZdEMsT0FBWjtBQUNBLGVBQUt1QyxJQUFMLEdBQVlDLE9BQVo7O0FBRUEsY0FBSUUsRUFBRSxHQUFHQyxFQUFULEVBQWE7QUFDVCxpQkFBS0osSUFBTCxHQUFZakQsUUFBUSxDQUFDVyxhQUFULENBQXVCdUMsT0FBdkIsRUFBZ0NLLFNBQVMsQ0FBQ0gsRUFBRSxHQUFHQyxFQUFOLENBQXpDLENBQVo7QUFDSCxXQUZELE1BRU8sSUFBSUQsRUFBRSxHQUFHQyxFQUFULEVBQWE7QUFDaEIsaUJBQUtMLElBQUwsR0FBWWhELFFBQVEsQ0FBQ1csYUFBVCxDQUF1QkQsT0FBdkIsRUFBZ0M2QyxTQUFTLENBQUNGLEVBQUUsR0FBR0QsRUFBTixDQUF6QyxDQUFaO0FBQ0g7O0FBRURELFVBQUFBLEdBQUcsR0FBRyxJQUFOO0FBQ0g7O0FBQ0QsZUFBT0EsR0FBUDtBQUNIOzs7OEJBRVE7QUFDTCxZQUFJM0UsTUFBTSxHQUFHLElBQUl1RSxLQUFKLEVBQWI7O0FBQ0EsYUFBS2xFLGdCQUFMLENBQXNCTCxNQUF0Qjs7QUFDQUEsUUFBQUEsTUFBTSxDQUFDb0Msa0JBQVAsQ0FBMEIsS0FBS29DLElBQUwsQ0FBVy9CLEtBQVgsRUFBMUIsRUFBOEMsS0FBS2dDLElBQUwsQ0FBV2hDLEtBQVgsRUFBOUM7QUFDQSxlQUFPekMsTUFBUDtBQUNIOzs7c0NBRWdCYSxNLEVBQWE7QUFDMUI3QixRQUFBQSxjQUFjLENBQUNnQyxTQUFmLENBQXlCSixlQUF6QixDQUF5Q0ssSUFBekMsQ0FBOEMsSUFBOUMsRUFBb0RKLE1BQXBEOztBQUNBLGFBQUsyRCxJQUFMLENBQVc1RCxlQUFYLENBQTJCQyxNQUEzQjs7QUFDQSxhQUFLNEQsSUFBTCxDQUFXN0QsZUFBWCxDQUEyQkMsTUFBM0I7QUFDSDs7OzZCQUVPO0FBQ0osYUFBSzJELElBQUwsQ0FBVzlCLElBQVg7O0FBQ0EsYUFBSytCLElBQUwsQ0FBVy9CLElBQVg7O0FBQ0EzQix1QkFBT0MsU0FBUCxDQUFpQjBCLElBQWpCLENBQXNCekIsSUFBdEIsQ0FBMkIsSUFBM0I7QUFDSDs7OzZCQUVPVCxFLEVBQVM7QUFDYkEsUUFBQUEsRUFBRSxHQUFHLEtBQUt5QyxnQkFBTCxDQUFzQnpDLEVBQXRCLENBQUw7QUFDQSxZQUFJLEtBQUtnRSxJQUFULEVBQ0ksS0FBS0EsSUFBTCxDQUFVOUQsTUFBVixDQUFpQkYsRUFBakI7QUFDSixZQUFJLEtBQUtpRSxJQUFULEVBQ0ksS0FBS0EsSUFBTCxDQUFVL0QsTUFBVixDQUFpQkYsRUFBakI7QUFDUDs7O2dDQUVVO0FBQ1AsWUFBSVIsTUFBTSxHQUFHdUUsS0FBSyxDQUFDcEMsYUFBTixDQUFvQixLQUFLcUMsSUFBTCxDQUFXdEIsT0FBWCxFQUFwQixFQUEwQyxLQUFLdUIsSUFBTCxDQUFXdkIsT0FBWCxFQUExQyxDQUFiOztBQUNBLGFBQUs3QyxnQkFBTCxDQUFzQkwsTUFBdEI7O0FBQ0EsYUFBS21ELGdCQUFMLENBQXNCbkQsTUFBdEI7O0FBQ0EsZUFBT0EsTUFBUDtBQUNIOzs7O0lBbEdzQmhCLGM7QUFxRzNCOzs7Ozs7Ozs7Ozs7Ozs7O0FBckdhdUYsRUFBQUEsSyxDQUVGcEMsYSxHQUFnQixVQUFVRCxPQUFWLEVBQXdCd0MsT0FBeEIsRUFBc0M7QUFDekQsUUFBSU0sTUFBTSxHQUFHLElBQUlULEtBQUosRUFBYjtBQUNBUyxJQUFBQSxNQUFNLENBQUM1QyxrQkFBUCxDQUEwQkYsT0FBMUIsRUFBbUN3QyxPQUFuQztBQUNBLFdBQU9NLE1BQVA7QUFDSCxHOztBQTJHRSxXQUFTQyxLQUFUO0FBQWdCO0FBQXNCeEQsRUFBQUEsU0FBdEMsRUFBd0U7QUFDM0UsUUFBSUssVUFBVSxHQUFJTCxTQUFTLFlBQVlNLEtBQXRCLEdBQStCTixTQUEvQixHQUEyQ2xCLFNBQTVEOztBQUNBLFFBQUl1QixVQUFVLENBQUMzQixNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQ3pCLDBCQUFRLElBQVI7QUFDQSxhQUFPLElBQVA7QUFDSDs7QUFDRCxRQUFLMkIsVUFBVSxDQUFDM0IsTUFBWCxHQUFvQixDQUFyQixJQUE0QjJCLFVBQVUsQ0FBQ0EsVUFBVSxDQUFDM0IsTUFBWCxHQUFvQixDQUFyQixDQUFWLElBQXFDLElBQXJFLEVBQ0ksa0JBQU0sSUFBTjtBQUVKLFFBQUk4QixJQUFJLEdBQUdILFVBQVUsQ0FBQyxDQUFELENBQXJCOztBQUNBLFNBQUssSUFBSTVCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUc0QixVQUFVLENBQUMzQixNQUEvQixFQUF1Q0QsQ0FBQyxFQUF4QyxFQUE0QztBQUN4QyxVQUFJNEIsVUFBVSxDQUFDNUIsQ0FBRCxDQUFWLElBQWlCLElBQXJCLEVBQ0krQixJQUFJLEdBQUdzQyxLQUFLLENBQUNwQyxhQUFOLENBQW9CRixJQUFwQixFQUEwQkgsVUFBVSxDQUFDNUIsQ0FBRCxDQUFwQyxDQUFQO0FBQ1A7O0FBQ0QsV0FBTytCLElBQVA7QUFDSDtBQUVEOzs7Ozs7TUFJTWlELFM7Ozs7Ozs7Ozs7OzZCQUVNMUUsRSxFQUFTLENBQUc7OztnQ0FFVDtBQUNQLFlBQUlSLE1BQU0sR0FBRyxJQUFJa0YsU0FBSixDQUFjLEtBQUtyRixTQUFuQixDQUFiOztBQUNBLGFBQUtRLGdCQUFMLENBQXNCTCxNQUF0Qjs7QUFDQSxhQUFLbUQsZ0JBQUwsQ0FBc0JuRCxNQUF0Qjs7QUFDQSxlQUFPQSxNQUFQO0FBQ0g7Ozs4QkFFUTtBQUNMLFlBQUlBLE1BQU0sR0FBRyxJQUFJa0YsU0FBSixFQUFiOztBQUNBLGFBQUs3RSxnQkFBTCxDQUFzQkwsTUFBdEI7O0FBQ0FBLFFBQUFBLE1BQU0sQ0FBQ0osZ0JBQVAsQ0FBd0IsS0FBS0MsU0FBN0I7QUFDQSxlQUFPRyxNQUFQO0FBQ0g7Ozs7SUFoQm1CaEIsYztBQW1CeEI7Ozs7Ozs7Ozs7OztBQVVPLFdBQVMrRixTQUFULENBQW9COUYsQ0FBcEIsRUFBK0M7QUFDbEQsV0FBTyxJQUFJaUcsU0FBSixDQUFjakcsQ0FBZCxDQUFQO0FBQ0g7O0FBQUE7QUFFRDs7Ozs7Ozs7Ozs7Ozs7O01BY2FrRyxXOzs7QUFJVCx5QkFBYW5GLE1BQWIsRUFBMkI7QUFBQTs7QUFBQTs7QUFDdkI7QUFEdUIsYUFGbkJvRixNQUVtQixHQUZhLElBRWI7QUFFdkJwRixNQUFBQSxNQUFNLElBQUksT0FBSzRELGNBQUwsQ0FBb0I1RCxNQUFwQixDQUFWO0FBRnVCO0FBRzFCO0FBRUQ7Ozs7Ozs7O3FDQUlnQkEsTSxFQUF3QjtBQUNwQyxZQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNULDhCQUFRLElBQVI7QUFDQSxpQkFBTyxLQUFQO0FBQ0g7O0FBQ0QsWUFBSUEsTUFBTSxLQUFLLEtBQUtvRixNQUFwQixFQUE0QjtBQUN4Qiw4QkFBUSxJQUFSO0FBQ0EsaUJBQU8sS0FBUDtBQUNIOztBQUVELFlBQUlwRyxjQUFjLENBQUNnQyxTQUFmLENBQXlCcEIsZ0JBQXpCLENBQTBDcUIsSUFBMUMsQ0FBK0MsSUFBL0MsRUFBcURqQixNQUFNLENBQUNILFNBQTVELENBQUosRUFBNEU7QUFDeEU7QUFDQSxlQUFLdUYsTUFBTCxHQUFjcEYsTUFBZDtBQUNBLGlCQUFPLElBQVA7QUFDSDs7QUFDRCxlQUFPLEtBQVA7QUFDSDs7OzhCQUVRO0FBQ0wsWUFBSUEsTUFBTSxHQUFHLElBQUltRixXQUFKLEVBQWI7O0FBQ0EsYUFBSzlFLGdCQUFMLENBQXNCTCxNQUF0Qjs7QUFDQUEsUUFBQUEsTUFBTSxDQUFDNEQsY0FBUCxDQUFzQixLQUFLd0IsTUFBTCxDQUFhM0MsS0FBYixFQUF0QjtBQUNBLGVBQU96QyxNQUFQO0FBQ0g7OztzQ0FFZ0JhLE0sRUFBYTtBQUMxQjdCLFFBQUFBLGNBQWMsQ0FBQ2dDLFNBQWYsQ0FBeUJKLGVBQXpCLENBQXlDSyxJQUF6QyxDQUE4QyxJQUE5QyxFQUFvREosTUFBcEQ7O0FBQ0EsYUFBS3VFLE1BQUwsQ0FBYXhFLGVBQWIsQ0FBNkJDLE1BQTdCO0FBQ0g7Ozs2QkFFT0wsRSxFQUFZO0FBQ2hCQSxRQUFBQSxFQUFFLEdBQUcsS0FBS3lDLGdCQUFMLENBQXNCekMsRUFBdEIsQ0FBTDtBQUNBLFlBQUksS0FBSzRFLE1BQVQsRUFDSSxLQUFLQSxNQUFMLENBQVkxRSxNQUFaLENBQW1CLElBQUlGLEVBQXZCO0FBQ1A7OztnQ0FFVTtBQUNQLGVBQU8sS0FBSzRFLE1BQUwsQ0FBYTNDLEtBQWIsRUFBUDtBQUNIOzs7NkJBRU87QUFDSixhQUFLMkMsTUFBTCxDQUFhMUMsSUFBYjs7QUFDQTNCLHVCQUFPQyxTQUFQLENBQWlCMEIsSUFBakIsQ0FBc0J6QixJQUF0QixDQUEyQixJQUEzQjtBQUNIOzs7O0lBeEQ0QmpDLGM7QUEyRGpDOzs7Ozs7Ozs7Ozs7OztBQVVPLFdBQVNxRyxXQUFULENBQXNCckYsTUFBdEIsRUFBbUQ7QUFDdEQsV0FBTyxJQUFJbUYsV0FBSixDQUFnQm5GLE1BQWhCLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcclxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEZpbml0ZVRpbWVBY3Rpb24sIEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvblwiO1xyXG5pbXBvcnQgeyBtYWNybywgbG9nSUQsIGVycm9ySUQgfSBmcm9tIFwiLi4vLi4vY29yZVwiO1xyXG5pbXBvcnQgeyBBY3Rpb25JbnN0YW50IH0gZnJvbSBcIi4vYWN0aW9uLWluc3RhbnRcIjtcclxuXHJcbi8qKlxyXG4gKiAhI2VuXHJcbiAqIDxwPiBBbiBpbnRlcnZhbCBhY3Rpb24gaXMgYW4gYWN0aW9uIHRoYXQgdGFrZXMgcGxhY2Ugd2l0aGluIGEgY2VydGFpbiBwZXJpb2Qgb2YgdGltZS4gPGJyLz5cclxuICogSXQgaGFzIGFuIHN0YXJ0IHRpbWUsIGFuZCBhIGZpbmlzaCB0aW1lLiBUaGUgZmluaXNoIHRpbWUgaXMgdGhlIHBhcmFtZXRlcjxici8+XHJcbiAqIGR1cmF0aW9uIHBsdXMgdGhlIHN0YXJ0IHRpbWUuPC9wPlxyXG4gKlxyXG4gKiA8cD5UaGVzZSBDQ0FjdGlvbkludGVydmFsIGFjdGlvbnMgaGF2ZSBzb21lIGludGVyZXN0aW5nIHByb3BlcnRpZXMsIGxpa2U6PGJyLz5cclxuICogLSBUaGV5IGNhbiBydW4gbm9ybWFsbHkgKGRlZmF1bHQpICA8YnIvPlxyXG4gKiAtIFRoZXkgY2FuIHJ1biByZXZlcnNlZCB3aXRoIHRoZSByZXZlcnNlIG1ldGhvZCAgIDxici8+XHJcbiAqIC0gVGhleSBjYW4gcnVuIHdpdGggdGhlIHRpbWUgYWx0ZXJlZCB3aXRoIHRoZSBBY2NlbGVyYXRlLCBBY2NlbERlY2NlbCBhbmQgU3BlZWQgYWN0aW9ucy4gPC9wPlxyXG4gKlxyXG4gKiA8cD5Gb3IgZXhhbXBsZSwgeW91IGNhbiBzaW11bGF0ZSBhIFBpbmcgUG9uZyBlZmZlY3QgcnVubmluZyB0aGUgYWN0aW9uIG5vcm1hbGx5IGFuZDxici8+XHJcbiAqIHRoZW4gcnVubmluZyBpdCBhZ2FpbiBpbiBSZXZlcnNlIG1vZGUuIDwvcD5cclxuICogISN6aCDml7bpl7Tpl7TpmpTliqjkvZzvvIzov5nnp43liqjkvZzlnKjlt7Llrprml7bpl7TlhoXlrozmiJDvvIznu6fmib8gRmluaXRlVGltZUFjdGlvbuOAglxyXG4gKiBAY2xhc3MgQWN0aW9uSW50ZXJ2YWxcclxuICogQGV4dGVuZHMgRmluaXRlVGltZUFjdGlvblxyXG4gKiBAcGFyYW0ge051bWJlcn0gZCBkdXJhdGlvbiBpbiBzZWNvbmRzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQWN0aW9uSW50ZXJ2YWwgZXh0ZW5kcyBGaW5pdGVUaW1lQWN0aW9uIHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgTUFYX1ZBTFVFID0gMjtcclxuICAgIHByb3RlY3RlZCBfZWxhcHNlZCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2ZpcnN0VGljayA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9lYXNlTGlzdDogRnVuY3Rpb25bXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9zcGVlZCA9IDE7XHJcbiAgICBwcm90ZWN0ZWQgX3JlcGVhdEZvcmV2ZXIgPSBmYWxzZTtcclxuICAgIF9yZXBlYXRNZXRob2QgPSBmYWxzZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcclxuICAgIHByb3RlY3RlZCBfc3BlZWRNZXRob2QgPSBmYWxzZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZD86IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKGQgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4oZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0V2l0aER1cmF0aW9uKGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSG93IG1hbnkgc2Vjb25kcyBoYWQgZWxhcHNlZCBzaW5jZSB0aGUgYWN0aW9ucyBzdGFydGVkIHRvIHJ1bi5cclxuICAgICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0RWxhcHNlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsYXBzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZCBkdXJhdGlvbiBpbiBzZWNvbmRzXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBpbml0V2l0aER1cmF0aW9uIChkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IChkID09PSAwKSA/IG1hY3JvLkZMVF9FUFNJTE9OIDogZDtcclxuICAgICAgICAvLyBwcmV2ZW50IGRpdmlzaW9uIGJ5IDBcclxuICAgICAgICAvLyBUaGlzIGNvbXBhcmlzb24gY291bGQgYmUgaW4gc3RlcDosIGJ1dCBpdCBtaWdodCBkZWNyZWFzZSB0aGUgcGVyZm9ybWFuY2VcclxuICAgICAgICAvLyBieSAzJSBpbiBoZWF2eSBiYXNlZCBhY3Rpb24gZ2FtZXMuXHJcbiAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5fZmlyc3RUaWNrID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0RvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZWxhcHNlZCA+PSB0aGlzLl9kdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgX2Nsb25lRGVjb3JhdGlvbiAoYWN0aW9uOiBBY3Rpb25JbnRlcnZhbCkge1xyXG4gICAgICAgIGFjdGlvbi5fcmVwZWF0Rm9yZXZlciA9IHRoaXMuX3JlcGVhdEZvcmV2ZXI7XHJcbiAgICAgICAgYWN0aW9uLl9zcGVlZCA9IHRoaXMuX3NwZWVkO1xyXG4gICAgICAgIGFjdGlvbi5fdGltZXNGb3JSZXBlYXQgPSB0aGlzLl90aW1lc0ZvclJlcGVhdDtcclxuICAgICAgICBhY3Rpb24uX2Vhc2VMaXN0ID0gdGhpcy5fZWFzZUxpc3Q7XHJcbiAgICAgICAgYWN0aW9uLl9zcGVlZE1ldGhvZCA9IHRoaXMuX3NwZWVkTWV0aG9kO1xyXG4gICAgICAgIGFjdGlvbi5fcmVwZWF0TWV0aG9kID0gdGhpcy5fcmVwZWF0TWV0aG9kO1xyXG4gICAgfVxyXG5cclxuICAgIF9yZXZlcnNlRWFzZUxpc3QgKGFjdGlvbjogQWN0aW9uSW50ZXJ2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5fZWFzZUxpc3QpIHtcclxuICAgICAgICAgICAgYWN0aW9uLl9lYXNlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2Vhc2VMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24uX2Vhc2VMaXN0LnB1c2godGhpcy5fZWFzZUxpc3RbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IEFjdGlvbkludGVydmFsKHRoaXMuX2R1cmF0aW9uKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBJbXBsZW1lbnRhdGlvbiBvZiBlYXNlIG1vdGlvbi5cclxuICAgICAqICEjemgg57yT5Yqo6L+Q5Yqo44CCXHJcbiAgICAgKiBAbWV0aG9kIGVhc2luZ1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2VPYmpcclxuICAgICAqIEByZXR1cm5zIHtBY3Rpb25JbnRlcnZhbH1cclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBpbXBvcnQgeyBlYXNlSW4gfSBmcm9tICdjYyc7XHJcbiAgICAgKiBhY3Rpb24uZWFzaW5nKGVhc2VJbigzLjApKTtcclxuICAgICAqL1xyXG4gICAgZWFzaW5nIChlYXNlT2JqOiBhbnkpOiBBY3Rpb25JbnRlcnZhbCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Vhc2VMaXN0KVxyXG4gICAgICAgICAgICB0aGlzLl9lYXNlTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fZWFzZUxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgdGhpcy5fZWFzZUxpc3QucHVzaChhcmd1bWVudHNbaV0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIF9jb21wdXRlRWFzZVRpbWUgKGR0OiBhbnkpIHtcclxuICAgICAgICAvLyB2YXIgbG9jTGlzdCA9IHRoaXMuX2Vhc2VMaXN0O1xyXG4gICAgICAgIC8vIGlmICgoIWxvY0xpc3QpIHx8IChsb2NMaXN0Lmxlbmd0aCA9PT0gMCkpXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBkdDtcclxuICAgICAgICAvLyBmb3IgKHZhciBpID0gMCwgbiA9IGxvY0xpc3QubGVuZ3RoOyBpIDwgbjsgaSsrKVxyXG4gICAgICAgIC8vICAgICBkdCA9IGxvY0xpc3RbaV0uZWFzaW5nKGR0KTtcclxuICAgICAgICByZXR1cm4gZHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9maXJzdFRpY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3RUaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWQgPSAwO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9lbGFwc2VkICs9IGR0O1xyXG5cclxuICAgICAgICAvL3RoaXMudXBkYXRlKCgxID4gKHRoaXMuX2VsYXBzZWQgLyB0aGlzLl9kdXJhdGlvbikpID8gdGhpcy5fZWxhcHNlZCAvIHRoaXMuX2R1cmF0aW9uIDogMSk7XHJcbiAgICAgICAgLy90aGlzLnVwZGF0ZShNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB0aGlzLl9lbGFwc2VkIC8gTWF0aC5tYXgodGhpcy5fZHVyYXRpb24sIGNjLm1hY3JvLkZMVF9FUFNJTE9OKSkpKTtcclxuICAgICAgICB2YXIgdCA9IHRoaXMuX2VsYXBzZWQgLyAodGhpcy5fZHVyYXRpb24gPiAwLjAwMDAwMDExOTIwOTI4OTYgPyB0aGlzLl9kdXJhdGlvbiA6IDAuMDAwMDAwMTE5MjA5Mjg5Nik7XHJcbiAgICAgICAgdCA9ICgxID4gdCA/IHQgOiAxKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSh0ID4gMCA/IHQgOiAwKTtcclxuXHJcbiAgICAgICAgLy9Db21wYXRpYmxlIHdpdGggcmVwZWF0IGNsYXNzLCBEaXNjYXJkIGFmdGVyIGNhbiBiZSBkZWxldGVkICh0aGlzLl9yZXBlYXRNZXRob2QpXHJcbiAgICAgICAgaWYgKHRoaXMuX3JlcGVhdE1ldGhvZCAmJiB0aGlzLl90aW1lc0ZvclJlcGVhdCA+IDEgJiYgdGhpcy5pc0RvbmUoKSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlcGVhdEZvcmV2ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVzRm9yUmVwZWF0LS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy92YXIgZGlmZiA9IGxvY0lubmVyQWN0aW9uLmdldEVsYXBzZWQoKSAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFdpdGhUYXJnZXQodGhpcy50YXJnZXQpO1xyXG4gICAgICAgICAgICAvLyB0byBwcmV2ZW50IGplcmsuIGlzc3VlICMzOTAgLDEyNDdcclxuICAgICAgICAgICAgLy90aGlzLl9pbm5lckFjdGlvbi5zdGVwKDApO1xyXG4gICAgICAgICAgICAvL3RoaXMuX2lubmVyQWN0aW9uLnN0ZXAoZGlmZik7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlcCh0aGlzLl9lbGFwc2VkIC0gdGhpcy5fZHVyYXRpb24pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRXaXRoVGFyZ2V0ICh0YXJnZXQ6IGFueSkge1xyXG4gICAgICAgIEFjdGlvbi5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9lbGFwc2VkID0gMDtcclxuICAgICAgICB0aGlzLl9maXJzdFRpY2sgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIGxvZ0lEKDEwMTApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTZXQgYW1wbGl0dWRlIHJhdGUuXHJcbiAgICAgKiBAd2FybmluZyBJdCBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiBzdWJjbGFzcy5cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhbXBcclxuICAgICAqL1xyXG4gICAgc2V0QW1wbGl0dWRlUmF0ZSAoYW1wOiBhbnkpIHtcclxuICAgICAgICAvLyBBYnN0cmFjdCBjbGFzcyBuZWVkcyBpbXBsZW1lbnRhdGlvblxyXG4gICAgICAgIGxvZ0lEKDEwMTEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHZXQgYW1wbGl0dWRlIHJhdGUuXHJcbiAgICAgKiBAd2FybmluZyBJdCBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiBzdWJjbGFzcy5cclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gMFxyXG4gICAgICovXHJcbiAgICBnZXRBbXBsaXR1ZGVSYXRlICgpIHtcclxuICAgICAgICAvLyBBYnN0cmFjdCBjbGFzcyBuZWVkcyBpbXBsZW1lbnRhdGlvblxyXG4gICAgICAgIGxvZ0lEKDEwMTIpO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlblxyXG4gICAgICogQ2hhbmdlcyB0aGUgc3BlZWQgb2YgYW4gYWN0aW9uLCBtYWtpbmcgaXQgdGFrZSBsb25nZXIgKHNwZWVkPjEpXHJcbiAgICAgKiBvciBsZXNzIChzcGVlZDwxKSB0aW1lLiA8YnIvPlxyXG4gICAgICogVXNlZnVsIHRvIHNpbXVsYXRlICdzbG93IG1vdGlvbicgb3IgJ2Zhc3QgZm9yd2FyZCcgZWZmZWN0LlxyXG4gICAgICogISN6aFxyXG4gICAgICog5pS55Y+Y5LiA5Liq5Yqo5L2c55qE6YCf5bqm77yM5L2/5a6D55qE5omn6KGM5L2/55So5pu06ZW/55qE5pe26Ze077yIc3BlZWQgPiAx77yJPGJyLz5cclxuICAgICAqIOaIluabtOWwke+8iHNwZWVkIDwgMe+8ieWPr+S7peacieaViOW+l+aooeaLn+KAnOaFouWKqOS9nOKAneaIluKAnOW/q+i/m+KAneeahOaViOaenOOAglxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkXHJcbiAgICAgKiBAcmV0dXJucyB7QWN0aW9ufVxyXG4gICAgICovXHJcbiAgICBzcGVlZCAoc3BlZWQ6IG51bWJlcik6IEFjdGlvbiB7XHJcbiAgICAgICAgaWYgKHNwZWVkIDw9IDApIHtcclxuICAgICAgICAgICAgbG9nSUQoMTAxMyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc3BlZWRNZXRob2QgPSB0cnVlOy8vQ29tcGF0aWJsZSB3aXRoIHJlcGVhdCBjbGFzcywgRGlzY2FyZCBhZnRlciBjYW4gYmUgZGVsZXRlZFxyXG4gICAgICAgIHRoaXMuX3NwZWVkICo9IHNwZWVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoaXMgYWN0aW9uIHNwZWVkLlxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXRTcGVlZCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhpcyBhY3Rpb24gc3BlZWQuXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWRcclxuICAgICAqIEByZXR1cm5zIHtBY3Rpb25JbnRlcnZhbH1cclxuICAgICAqL1xyXG4gICAgc2V0U3BlZWQgKHNwZWVkOiBudW1iZXIpOiBBY3Rpb25JbnRlcnZhbCB7XHJcbiAgICAgICAgdGhpcy5fc3BlZWQgPSBzcGVlZDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICEjZW5cclxuICAgICAqIFJlcGVhdHMgYW4gYWN0aW9uIGEgbnVtYmVyIG9mIHRpbWVzLlxyXG4gICAgICogVG8gcmVwZWF0IGFuIGFjdGlvbiBmb3JldmVyIHVzZSB0aGUgQ0NSZXBlYXRGb3JldmVyIGFjdGlvbi5cclxuICAgICAqICEjemgg6YeN5aSN5Yqo5L2c5Y+v5Lul5oyJ5LiA5a6a5qyh5pWw6YeN5aSN5LiA5Liq5Yqo5L2c77yM5L2/55SoIFJlcGVhdEZvcmV2ZXIg5Yqo5L2c5p2l5rC46L+c6YeN5aSN5LiA5Liq5Yqo5L2c44CCXHJcbiAgICAgKiBAbWV0aG9kIHJlcGVhdFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVzXHJcbiAgICAgKiBAcmV0dXJucyB7QWN0aW9uSW50ZXJ2YWx9XHJcbiAgICAgKi9cclxuICAgIHJlcGVhdCAodGltZXM6IG51bWJlcik6IEFjdGlvbkludGVydmFsIHtcclxuICAgICAgICB0aW1lcyA9IE1hdGgucm91bmQodGltZXMpO1xyXG4gICAgICAgIGlmIChpc05hTih0aW1lcykgfHwgdGltZXMgPCAxKSB7XHJcbiAgICAgICAgICAgIGxvZ0lEKDEwMTQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcmVwZWF0TWV0aG9kID0gdHJ1ZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcclxuICAgICAgICB0aGlzLl90aW1lc0ZvclJlcGVhdCAqPSB0aW1lcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICEjZW5cclxuICAgICAqIFJlcGVhdHMgYW4gYWN0aW9uIGZvciBldmVyLiAgPGJyLz5cclxuICAgICAqIFRvIHJlcGVhdCB0aGUgYW4gYWN0aW9uIGZvciBhIGxpbWl0ZWQgbnVtYmVyIG9mIHRpbWVzIHVzZSB0aGUgUmVwZWF0IGFjdGlvbi4gPGJyLz5cclxuICAgICAqICEjemgg5rC46L+c5Zyw6YeN5aSN5LiA5Liq5Yqo5L2c77yM5pyJ6ZmQ5qyh5pWw5YaF6YeN5aSN5LiA5Liq5Yqo5L2c6K+35L2/55SoIFJlcGVhdCDliqjkvZzjgIJcclxuICAgICAqIEBtZXRob2QgcmVwZWF0Rm9yZXZlclxyXG4gICAgICogQHJldHVybnMge0FjdGlvbkludGVydmFsfVxyXG4gICAgICovXHJcbiAgICByZXBlYXRGb3JldmVyICgpOiBBY3Rpb25JbnRlcnZhbCB7XHJcbiAgICAgICAgdGhpcy5fcmVwZWF0TWV0aG9kID0gdHJ1ZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcclxuICAgICAgICB0aGlzLl90aW1lc0ZvclJlcGVhdCA9IHRoaXMuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHRoaXMuX3JlcGVhdEZvcmV2ZXIgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gKiBSdW5zIGFjdGlvbnMgc2VxdWVudGlhbGx5LCBvbmUgYWZ0ZXIgYW5vdGhlci5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZSBleHRlbmRzIEFjdGlvbkludGVydmFsIHtcclxuXHJcbiAgICBzdGF0aWMgX2FjdGlvbk9uZVR3byA9IGZ1bmN0aW9uIChhY3Rpb25PbmU6IEFjdGlvbkludGVydmFsLCBhY3Rpb25Ud286IEFjdGlvbkludGVydmFsKSB7XHJcbiAgICAgICAgdmFyIHNlcXVlbmNlID0gbmV3IFNlcXVlbmNlKCk7XHJcbiAgICAgICAgc2VxdWVuY2UuaW5pdFdpdGhUd29BY3Rpb25zKGFjdGlvbk9uZSwgYWN0aW9uVHdvKTtcclxuICAgICAgICByZXR1cm4gc2VxdWVuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWN0aW9uczogQWN0aW9uSW50ZXJ2YWxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc3BsaXQgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbGFzdCA9IDA7XHJcbiAgICBwcml2YXRlIF9yZXZlcnNlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGltcG9ydCB7IFNlcXVlbmNlIH0gZnJvbSAnY2MnO1xyXG4gICAgICogXHJcbiAgICAgKiAvLyBjcmVhdGUgc2VxdWVuY2Ugd2l0aCBhY3Rpb25zXHJcbiAgICAgKiBjb25zdCBzZXEgPSBuZXcgU2VxdWVuY2UoYWN0MSwgYWN0Mik7XHJcbiAgICAgKiBcclxuICAgICAqIC8vIGNyZWF0ZSBzZXF1ZW5jZSB3aXRoIGFycmF5XHJcbiAgICAgKiBjb25zdCBzZXEgPSBuZXcgU2VxdWVuY2UoYWN0QXJyYXkpO1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoLi4uYWN0aW9uczogRmluaXRlVGltZUFjdGlvbltdKTtcclxuICAgIGNvbnN0cnVjdG9yICh0ZW1wQXJyYXk6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHZhciBwYXJhbUFycmF5ID0gKHRlbXBBcnJheSBpbnN0YW5jZW9mIEFycmF5KSA/IHRlbXBBcnJheSA6IGFyZ3VtZW50cztcclxuICAgICAgICBpZiAocGFyYW1BcnJheS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxMDE5KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGFzdCA9IHBhcmFtQXJyYXkubGVuZ3RoIC0gMTtcclxuICAgICAgICBpZiAoKGxhc3QgPj0gMCkgJiYgKHBhcmFtQXJyYXlbbGFzdF0gPT0gbnVsbCkpXHJcbiAgICAgICAgICAgIGxvZ0lEKDEwMTUpO1xyXG5cclxuICAgICAgICBpZiAobGFzdCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gcGFyYW1BcnJheVswXSwgYWN0aW9uMTogYW55O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3Q7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtQXJyYXlbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24xID0gcHJldjtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2ID0gU2VxdWVuY2UuX2FjdGlvbk9uZVR3byhhY3Rpb24xLCBwYXJhbUFycmF5W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmluaXRXaXRoVHdvQWN0aW9ucyhwcmV2LCBwYXJhbUFycmF5W2xhc3RdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24gPGJyLz5cclxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uT25lXHJcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblR3b1xyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaW5pdFdpdGhUd29BY3Rpb25zIChhY3Rpb25PbmU6IGFueSwgYWN0aW9uVHdvOiBhbnkpIHtcclxuICAgICAgICBpZiAoIWFjdGlvbk9uZSB8fCAhYWN0aW9uVHdvKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTAyNSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkdXJhdGlvbk9uZSA9IGFjdGlvbk9uZS5fZHVyYXRpb24sIGR1cmF0aW9uVHdvID0gYWN0aW9uVHdvLl9kdXJhdGlvbjtcclxuICAgICAgICBkdXJhdGlvbk9uZSAqPSBhY3Rpb25PbmUuX3JlcGVhdE1ldGhvZCA/IGFjdGlvbk9uZS5fdGltZXNGb3JSZXBlYXQgOiAxO1xyXG4gICAgICAgIGR1cmF0aW9uVHdvICo9IGFjdGlvblR3by5fcmVwZWF0TWV0aG9kID8gYWN0aW9uVHdvLl90aW1lc0ZvclJlcGVhdCA6IDE7XHJcbiAgICAgICAgdmFyIGQgPSBkdXJhdGlvbk9uZSArIGR1cmF0aW9uVHdvO1xyXG4gICAgICAgIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYWN0aW9uc1swXSA9IGFjdGlvbk9uZTtcclxuICAgICAgICB0aGlzLl9hY3Rpb25zWzFdID0gYWN0aW9uVHdvO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IFNlcXVlbmNlKCk7XHJcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbiBhcyBhbnkpO1xyXG4gICAgICAgIGFjdGlvbi5pbml0V2l0aFR3b0FjdGlvbnModGhpcy5fYWN0aW9uc1swXS5jbG9uZSgpLCB0aGlzLl9hY3Rpb25zWzFdLmNsb25lKCkpO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb24gYXMgYW55O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0V2l0aFRhcmdldCAodGFyZ2V0OiBhbnkpIHtcclxuICAgICAgICBBY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9zcGxpdCA9IHRoaXMuX2FjdGlvbnNbMF0uX2R1cmF0aW9uIC8gdGhpcy5fZHVyYXRpb247XHJcbiAgICAgICAgdGhpcy5fc3BsaXQgKj0gdGhpcy5fYWN0aW9uc1swXS5fcmVwZWF0TWV0aG9kID8gdGhpcy5fYWN0aW9uc1swXS5fdGltZXNGb3JSZXBlYXQgOiAxO1xyXG4gICAgICAgIHRoaXMuX2xhc3QgPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wICgpIHtcclxuICAgICAgICAvLyBJc3N1ZSAjMTMwNVxyXG4gICAgICAgIGlmICh0aGlzLl9sYXN0ICE9PSAtMSlcclxuICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1t0aGlzLl9sYXN0XS5zdG9wKCk7XHJcbiAgICAgICAgQWN0aW9uLnByb3RvdHlwZS5zdG9wLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlIChkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIG5ld190OiBudW1iZXIsIGZvdW5kID0gMDtcclxuICAgICAgICB2YXIgbG9jU3BsaXQgPSB0aGlzLl9zcGxpdDtcclxuICAgICAgICB2YXIgbG9jQWN0aW9ucyA9IHRoaXMuX2FjdGlvbnM7XHJcbiAgICAgICAgdmFyIGxvY0xhc3QgPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgIHZhciBhY3Rpb25Gb3VuZDogQWN0aW9uSW50ZXJ2YWw7XHJcblxyXG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcclxuICAgICAgICBpZiAoZHQgPCBsb2NTcGxpdCkge1xyXG4gICAgICAgICAgICAvLyBhY3Rpb25bMF1cclxuICAgICAgICAgICAgbmV3X3QgPSAobG9jU3BsaXQgIT09IDApID8gZHQgLyBsb2NTcGxpdCA6IDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm91bmQgPT09IDAgJiYgbG9jTGFzdCA9PT0gMSAmJiB0aGlzLl9yZXZlcnNlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gUmV2ZXJzZSBtb2RlID9cclxuICAgICAgICAgICAgICAgIC8vIFhYWDogQnVnLiB0aGlzIGNhc2UgZG9lc24ndCBjb250ZW1wbGF0ZSB3aGVuIF9sYXN0PT0tMSwgZm91bmQ9MCBhbmQgaW4gXCJyZXZlcnNlIG1vZGVcIlxyXG4gICAgICAgICAgICAgICAgLy8gc2luY2UgaXQgd2lsbCByZXF1aXJlIGEgaGFjayB0byBrbm93IGlmIGFuIGFjdGlvbiBpcyBvbiByZXZlcnNlIG1vZGUgb3Igbm90LlxyXG4gICAgICAgICAgICAgICAgLy8gXCJzdGVwXCIgc2hvdWxkIGJlIG92ZXJyaWRlbiwgYW5kIHRoZSBcInJldmVyc2VNb2RlXCIgdmFsdWUgcHJvcGFnYXRlZCB0byBpbm5lciBTZXF1ZW5jZXMuXHJcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzFdLnVwZGF0ZSgwKTtcclxuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMV0uc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYWN0aW9uWzFdXHJcbiAgICAgICAgICAgIGZvdW5kID0gMTtcclxuICAgICAgICAgICAgbmV3X3QgPSAobG9jU3BsaXQgPT09IDEpID8gMSA6IChkdCAtIGxvY1NwbGl0KSAvICgxIC0gbG9jU3BsaXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxvY0xhc3QgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhY3Rpb25bMF0gd2FzIHNraXBwZWQsIGV4ZWN1dGUgaXQuXHJcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnN0YXJ0V2l0aFRhcmdldCh0aGlzLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnVwZGF0ZSgxKTtcclxuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMF0uc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsb2NMYXN0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzd2l0Y2hpbmcgdG8gYWN0aW9uIDEuIHN0b3AgYWN0aW9uIDAuXHJcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnVwZGF0ZSgxKTtcclxuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMF0uc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhY3Rpb25Gb3VuZCA9IGxvY0FjdGlvbnNbZm91bmRdO1xyXG4gICAgICAgIC8vIExhc3QgYWN0aW9uIGZvdW5kIGFuZCBpdCBpcyBkb25lLlxyXG4gICAgICAgIGlmIChsb2NMYXN0ID09PSBmb3VuZCAmJiBhY3Rpb25Gb3VuZC5pc0RvbmUoKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBMYXN0IGFjdGlvbiBub3QgZm91bmRcclxuICAgICAgICBpZiAobG9jTGFzdCAhPT0gZm91bmQpXHJcbiAgICAgICAgICAgIGFjdGlvbkZvdW5kLnN0YXJ0V2l0aFRhcmdldCh0aGlzLnRhcmdldCk7XHJcblxyXG4gICAgICAgIG5ld190ID0gbmV3X3QgKiBhY3Rpb25Gb3VuZC5fdGltZXNGb3JSZXBlYXQ7XHJcbiAgICAgICAgYWN0aW9uRm91bmQudXBkYXRlKG5ld190ID4gMSA/IG5ld190ICUgMSA6IG5ld190KTtcclxuICAgICAgICB0aGlzLl9sYXN0ID0gZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSAoKSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IFNlcXVlbmNlLl9hY3Rpb25PbmVUd28odGhpcy5fYWN0aW9uc1sxXS5yZXZlcnNlKCksIHRoaXMuX2FjdGlvbnNbMF0ucmV2ZXJzZSgpKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcclxuICAgICAgICBhY3Rpb24uX3JldmVyc2VkID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uIGFzIGFueTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW5cclxuICogSGVscGVyIGNvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhbiBhcnJheSBvZiBzZXF1ZW5jZWFibGUgYWN0aW9uc1xyXG4gKiBUaGUgY3JlYXRlZCBhY3Rpb24gd2lsbCBydW4gYWN0aW9ucyBzZXF1ZW50aWFsbHksIG9uZSBhZnRlciBhbm90aGVyLlxyXG4gKiAhI3poIOmhuuW6j+aJp+ihjOWKqOS9nO+8jOWIm+W7uueahOWKqOS9nOWwhuaMiemhuuW6j+S+neasoei/kOihjOOAglxyXG4gKiBAbWV0aG9kIHNlcXVlbmNlXHJcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbnxGaW5pdGVUaW1lQWN0aW9uW119IGFjdGlvbk9yQWN0aW9uQXJyYXlcclxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSAuLi50ZW1wQXJyYXlcclxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XHJcbiAqIEBleGFtcGxlXHJcbiAqIGltcG9ydCB7IHNlcXVlbmNlIH0gZnJvbSAnY2MnO1xyXG4gKiBcclxuICogLy8gQ3JlYXRlIHNlcXVlbmNlIHdpdGggYWN0aW9uc1xyXG4gKiBjb25zdCBzZXEgPSBzZXF1ZW5jZShhY3QxLCBhY3QyKTtcclxuICpcclxuICogLy8gQ3JlYXRlIHNlcXVlbmNlIHdpdGggYXJyYXlcclxuICogY29uc3Qgc2VxID0gc2VxdWVuY2UoYWN0QXJyYXkpO1xyXG4gKi9cclxuLy8gdG9kbzogSXQgc2hvdWxkIGJlIHVzZSBuZXdcclxuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlICgvKk11bHRpcGxlIEFyZ3VtZW50cyovdGVtcEFycmF5OiBhbnkpOiBBY3Rpb25JbnRlcnZhbCB7XHJcbiAgICB2YXIgcGFyYW1BcnJheSA9ICh0ZW1wQXJyYXkgaW5zdGFuY2VvZiBBcnJheSkgPyB0ZW1wQXJyYXkgOiBhcmd1bWVudHM7XHJcbiAgICBpZiAocGFyYW1BcnJheS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICBlcnJvcklEKDEwMTkpO1xyXG4gICAgICAgIHJldHVybiBudWxsIGFzIGFueTtcclxuICAgIH1cclxuICAgIHZhciBsYXN0ID0gcGFyYW1BcnJheS5sZW5ndGggLSAxO1xyXG4gICAgaWYgKChsYXN0ID49IDApICYmIChwYXJhbUFycmF5W2xhc3RdID09IG51bGwpKVxyXG4gICAgICAgIGxvZ0lEKDEwMTUpO1xyXG5cclxuICAgIHZhciByZXN1bHQ6IGFueSA9IG51bGw7XHJcbiAgICBpZiAobGFzdCA+PSAwKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcGFyYW1BcnJheVswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBsYXN0OyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBhcmFtQXJyYXlbaV0pIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFNlcXVlbmNlLl9hY3Rpb25PbmVUd28ocmVzdWx0LCBwYXJhbUFycmF5W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0IGFzIGFueTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFJlcGVhdHMgYW4gYWN0aW9uIGEgbnVtYmVyIG9mIHRpbWVzLlxyXG4gKiBUbyByZXBlYXQgYW4gYWN0aW9uIGZvcmV2ZXIgdXNlIHRoZSBDQ1JlcGVhdEZvcmV2ZXIgYWN0aW9uLlxyXG4gKiBAY2xhc3MgUmVwZWF0XHJcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXHJcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc1xyXG4gKiBAZXhhbXBsZVxyXG4gKiBpbXBvcnQgeyBSZXBlYXQsIHNlcXVlbmNlIH0gZnJvbSAnY2MnO1xyXG4gKiBjb25zdCByZXAgPSBuZXcgUmVwZWF0KHNlcXVlbmNlKGp1bXAyLCBqdW1wMSksIDUpO1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlcGVhdCBleHRlbmRzIEFjdGlvbkludGVydmFsIHtcclxuXHJcbiAgICBwcml2YXRlIF90aW1lcyA9IDA7XHJcbiAgICBwcml2YXRlIF90b3RhbCA9IDA7XHJcbiAgICBwcml2YXRlIF9uZXh0RHQgPSAwO1xyXG4gICAgcHJpdmF0ZSBfYWN0aW9uSW5zdGFudCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaW5uZXJBY3Rpb246IEZpbml0ZVRpbWVBY3Rpb24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoYWN0aW9uPzogYW55LCB0aW1lcz86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGltZXMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoQWN0aW9uKGFjdGlvbiwgdGltZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVzXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBpbml0V2l0aEFjdGlvbiAoYWN0aW9uOiBGaW5pdGVUaW1lQWN0aW9uLCB0aW1lczogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gYWN0aW9uLl9kdXJhdGlvbiAqIHRpbWVzO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uKSkge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lcyA9IHRpbWVzO1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcclxuICAgICAgICAgICAgaWYgKGFjdGlvbiBpbnN0YW5jZW9mIEFjdGlvbkluc3RhbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbkluc3RhbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZXMgLT0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90b3RhbCA9IDA7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUgKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgUmVwZWF0KCk7XHJcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoQWN0aW9uKHRoaXMuX2lubmVyQWN0aW9uIS5jbG9uZSgpLCB0aGlzLl90aW1lcyk7XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydFdpdGhUYXJnZXQgKHRhcmdldDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdG90YWwgPSAwO1xyXG4gICAgICAgIHRoaXMuX25leHREdCA9IHRoaXMuX2lubmVyQWN0aW9uIS5fZHVyYXRpb24gLyB0aGlzLl9kdXJhdGlvbjtcclxuICAgICAgICBBY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiEuc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCAoKSB7XHJcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24hLnN0b3AoKTtcclxuICAgICAgICBBY3Rpb24ucHJvdG90eXBlLnN0b3AuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XHJcbiAgICAgICAgdmFyIGxvY0lubmVyQWN0aW9uID0gdGhpcy5faW5uZXJBY3Rpb24hO1xyXG4gICAgICAgIHZhciBsb2NEdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uO1xyXG4gICAgICAgIHZhciBsb2NUaW1lcyA9IHRoaXMuX3RpbWVzO1xyXG4gICAgICAgIHZhciBsb2NOZXh0RHQgPSB0aGlzLl9uZXh0RHQ7XHJcblxyXG4gICAgICAgIGlmIChkdCA+PSBsb2NOZXh0RHQpIHtcclxuICAgICAgICAgICAgd2hpbGUgKGR0ID4gbG9jTmV4dER0ICYmIHRoaXMuX3RvdGFsIDwgbG9jVGltZXMpIHtcclxuICAgICAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnVwZGF0ZSgxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RvdGFsKys7XHJcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdGFydFdpdGhUYXJnZXQodGhpcy50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgbG9jTmV4dER0ICs9IGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbiAvIGxvY0R1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dER0ID0gbG9jTmV4dER0ID4gMSA/IDEgOiBsb2NOZXh0RHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGZpeCBmb3IgaXNzdWUgIzEyODgsIGluY29ycmVjdCBlbmQgdmFsdWUgb2YgcmVwZWF0XHJcbiAgICAgICAgICAgIGlmIChkdCA+PSAxLjAgJiYgdGhpcy5fdG90YWwgPCBsb2NUaW1lcykge1xyXG4gICAgICAgICAgICAgICAgLy8gZml4IGZvciBjb2Nvcy1jcmVhdG9yL2ZpcmViYWxsL2lzc3Vlcy80MzEwXHJcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi51cGRhdGUoMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90b3RhbCsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBkb24ndCBzZXQgYSBpbnN0YW50IGFjdGlvbiBiYWNrIG9yIHVwZGF0ZSBpdCwgaXQgaGFzIG5vIHVzZSBiZWNhdXNlIGl0IGhhcyBubyBkdXJhdGlvblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2FjdGlvbkluc3RhbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90b3RhbCA9PT0gbG9jVGltZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzc3VlICMzOTAgcHJldmVudCBqZXJrLCB1c2UgcmlnaHQgdXBkYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24udXBkYXRlKGR0IC0gKGxvY05leHREdCAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbiAvIGxvY0R1cmF0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NJbm5lckFjdGlvbi51cGRhdGUoKGR0ICogbG9jVGltZXMpICUgMS4wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNEb25lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdG90YWwgPT09IHRoaXMuX3RpbWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgUmVwZWF0KHRoaXMuX2lubmVyQWN0aW9uIS5yZXZlcnNlKCksIHRoaXMuX3RpbWVzKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2V0IGlubmVyIEFjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHNldElubmVyQWN0aW9uIChhY3Rpb246IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbm5lckFjdGlvbiAhPT0gYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lubmVyQWN0aW9uID0gYWN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogR2V0IGlubmVyIEFjdGlvbi5cclxuICAgICAqIEByZXR1cm4ge0Zpbml0ZVRpbWVBY3Rpb259XHJcbiAgICAgKi9cclxuICAgIGdldElubmVyQWN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXJBY3Rpb247XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAhI2VuIENyZWF0ZXMgYSBSZXBlYXQgYWN0aW9uLiBUaW1lcyBpcyBhbiB1bnNpZ25lZCBpbnRlZ2VyIGJldHdlZW4gMSBhbmQgcG93KDIsMzApXHJcbiAqICEjemgg6YeN5aSN5Yqo5L2c77yM5Y+v5Lul5oyJ5LiA5a6a5qyh5pWw6YeN5aSN5LiA5Liq5Yqo77yM5aaC5p6c5oOz5rC46L+c6YeN5aSN5LiA5Liq5Yqo5L2c6K+35L2/55SoIHJlcGVhdEZvcmV2ZXIg5Yqo5L2c5p2l5a6M5oiQ44CCXHJcbiAqIEBtZXRob2QgcmVwZWF0XHJcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc1xyXG4gKiBAcmV0dXJuIHtBY3Rpb259XHJcbiAqIEBleGFtcGxlXHJcbiAqIGltcG9ydCB7IHJlcGVhdCwgc2VxdWVuY2UgfSBmcm9tICdjYyc7XHJcbiAqIGNvbnN0IHJlcCA9IHJlcGVhdChzZXF1ZW5jZShqdW1wMiwganVtcDEpLCA1KTtcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQgKGFjdGlvbjogYW55LCB0aW1lczogYW55KTogQWN0aW9uIHtcclxuICAgIHJldHVybiBuZXcgUmVwZWF0KGFjdGlvbiwgdGltZXMpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBSZXBlYXRzIGFuIGFjdGlvbiBmb3IgZXZlci4gIDxici8+XHJcbiAqIFRvIHJlcGVhdCB0aGUgYW4gYWN0aW9uIGZvciBhIGxpbWl0ZWQgbnVtYmVyIG9mIHRpbWVzIHVzZSB0aGUgUmVwZWF0IGFjdGlvbi4gPGJyLz5cclxuICogQHdhcm5pbmcgVGhpcyBhY3Rpb24gY2FuJ3QgYmUgU2VxdWVuY2VhYmxlIGJlY2F1c2UgaXQgaXMgbm90IGFuIEludGVydmFsQWN0aW9uXHJcbiAqIEBjbGFzcyBSZXBlYXRGb3JldmVyXHJcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXHJcbiAqIEBwYXJhbSB7QWN0aW9uSW50ZXJ2YWx9IGFjdGlvblxyXG4gKiBAZXhhbXBsZVxyXG4gKiBpbXBvcnQgeyBzZXF1ZW5jZSwgUmVwZWF0Rm9yZXZlciB9IGZyb20gJ2NjJztcclxuICogY29uc3QgcmVwID0gbmV3IFJlcGVhdEZvcmV2ZXIoc2VxdWVuY2UoanVtcDIsIGp1bXAxKSwgNSk7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVwZWF0Rm9yZXZlciBleHRlbmRzIEFjdGlvbkludGVydmFsIHtcclxuXHJcbiAgICBwcml2YXRlIF9pbm5lckFjdGlvbjogQWN0aW9uSW50ZXJ2YWwgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoYWN0aW9uPzogQWN0aW9uSW50ZXJ2YWwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGFjdGlvbiAmJiB0aGlzLmluaXRXaXRoQWN0aW9uKGFjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEBwYXJhbSB7QWN0aW9uSW50ZXJ2YWx9IGFjdGlvblxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaW5pdFdpdGhBY3Rpb24gKGFjdGlvbjogQWN0aW9uSW50ZXJ2YWwpIHtcclxuICAgICAgICBpZiAoIWFjdGlvbikge1xyXG4gICAgICAgICAgICBlcnJvcklEKDEwMjYpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBSZXBlYXRGb3JldmVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoQWN0aW9uKHRoaXMuX2lubmVyQWN0aW9uIS5jbG9uZSgpKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0V2l0aFRhcmdldCAodGFyZ2V0OiBhbnkpIHtcclxuICAgICAgICBBY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiEuc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCAoZHQ6IGFueSkge1xyXG4gICAgICAgIHZhciBsb2NJbm5lckFjdGlvbiA9IHRoaXMuX2lubmVyQWN0aW9uITtcclxuICAgICAgICBsb2NJbm5lckFjdGlvbi5zdGVwKGR0KTtcclxuICAgICAgICBpZiAobG9jSW5uZXJBY3Rpb24uaXNEb25lKCkpIHtcclxuICAgICAgICAgICAgLy92YXIgZGlmZiA9IGxvY0lubmVyQWN0aW9uLmdldEVsYXBzZWQoKSAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbjtcclxuICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRoaXMudGFyZ2V0KTtcclxuICAgICAgICAgICAgLy8gdG8gcHJldmVudCBqZXJrLiBpc3N1ZSAjMzkwICwxMjQ3XHJcbiAgICAgICAgICAgIC8vdGhpcy5faW5uZXJBY3Rpb24uc3RlcCgwKTtcclxuICAgICAgICAgICAgLy90aGlzLl9pbm5lckFjdGlvbi5zdGVwKGRpZmYpO1xyXG4gICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdGVwKGxvY0lubmVyQWN0aW9uLmdldEVsYXBzZWQoKSAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzRG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgUmVwZWF0Rm9yZXZlcih0aGlzLl9pbm5lckFjdGlvbiEucmV2ZXJzZSgpKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU2V0IGlubmVyIGFjdGlvbi5cclxuICAgICAqIEBwYXJhbSB7QWN0aW9uSW50ZXJ2YWx9IGFjdGlvblxyXG4gICAgICovXHJcbiAgICBzZXRJbm5lckFjdGlvbiAoYWN0aW9uOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5faW5uZXJBY3Rpb24gIT09IGFjdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldCBpbm5lciBhY3Rpb24uXHJcbiAgICAgKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cclxuICAgICAqL1xyXG4gICAgZ2V0SW5uZXJBY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lckFjdGlvbjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW4gQ3JlYXRlIGEgYWN0b24gd2hpY2ggcmVwZWF0IGZvcmV2ZXIsIGFzIGl0IHJ1bnMgZm9yZXZlciwgaXQgY2FuJ3QgYmUgYWRkZWQgaW50byBgc2VxdWVuY2VgIGFuZCBgc3Bhd25gLlxyXG4gKiAhI3poIOawuOi/nOWcsOmHjeWkjeS4gOS4quWKqOS9nO+8jOaciemZkOasoeaVsOWGhemHjeWkjeS4gOS4quWKqOS9nOivt+S9v+eUqCByZXBlYXQg5Yqo5L2c77yM55Sx5LqO6L+Z5Liq5Yqo5L2c5LiN5Lya5YGc5q2i77yM5omA5Lul5LiN6IO96KKr5re75Yqg5YiwIGBzZXF1ZW5jZWAg5oiWIGBzcGF3bmAg5Lit44CCXHJcbiAqIEBtZXRob2QgcmVwZWF0Rm9yZXZlclxyXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxyXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cclxuICogQGV4YW1wbGVcclxuICogaW1wb3J0IHsgcmVwZWF0Rm9yZXZlciwgcm90YXRlQnkgfSBmcm9tICdjYyc7XHJcbiAqIHZhciByZXBlYXQgPSByZXBlYXRGb3JldmVyKHJvdGF0ZUJ5KDEuMCwgMzYwKSk7XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0Rm9yZXZlciAoYWN0aW9uPzogQWN0aW9uSW50ZXJ2YWwpOiBBY3Rpb25JbnRlcnZhbCB7XHJcbiAgICByZXR1cm4gbmV3IFJlcGVhdEZvcmV2ZXIoYWN0aW9uKTtcclxufVxyXG5cclxuLypcclxuICogU3Bhd24gYSBuZXcgYWN0aW9uIGltbWVkaWF0ZWx5XHJcbiAqIEBjbGFzcyBTcGF3blxyXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNwYXduIGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWwge1xyXG5cclxuICAgIHN0YXRpYyBfYWN0aW9uT25lVHdvID0gZnVuY3Rpb24gKGFjdGlvbjE6IGFueSwgYWN0aW9uMjogYW55KSB7XHJcbiAgICAgICAgdmFyIHBTcGF3biA9IG5ldyBTcGF3bigpO1xyXG4gICAgICAgIHBTcGF3bi5pbml0V2l0aFR3b0FjdGlvbnMoYWN0aW9uMSwgYWN0aW9uMik7XHJcbiAgICAgICAgcmV0dXJuIHBTcGF3bjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9vbmU6IEFjdGlvbkludGVydmFsIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90d286IEFjdGlvbkludGVydmFsIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHRlbXBBcnJheT86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHZhciBwYXJhbUFycmF5ID0gKHRlbXBBcnJheSBpbnN0YW5jZW9mIEFycmF5KSA/IHRlbXBBcnJheSA6IGFyZ3VtZW50cztcclxuICAgICAgICBpZiAocGFyYW1BcnJheS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxMDIwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGFzdCA9IHBhcmFtQXJyYXkubGVuZ3RoIC0gMTtcclxuICAgICAgICBpZiAoKGxhc3QgPj0gMCkgJiYgKHBhcmFtQXJyYXlbbGFzdF0gPT0gbnVsbCkpXHJcbiAgICAgICAgICAgIGxvZ0lEKDEwMTUpO1xyXG5cclxuICAgICAgICBpZiAobGFzdCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gcGFyYW1BcnJheVswXSwgYWN0aW9uMTogYW55O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxhc3Q7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtQXJyYXlbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24xID0gcHJldjtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2ID0gU3Bhd24uX2FjdGlvbk9uZVR3byhhY3Rpb24xLCBwYXJhbUFycmF5W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmluaXRXaXRoVHdvQWN0aW9ucyhwcmV2LCBwYXJhbUFycmF5W2xhc3RdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogaW5pdGlhbGl6ZXMgdGhlIFNwYXduIGFjdGlvbiB3aXRoIHRoZSAyIGFjdGlvbnMgdG8gc3Bhd25cclxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uMVxyXG4gICAgICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb24yXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBpbml0V2l0aFR3b0FjdGlvbnMgKGFjdGlvbjE6IGFueSwgYWN0aW9uMjogYW55KSB7XHJcbiAgICAgICAgaWYgKCFhY3Rpb24xIHx8ICFhY3Rpb24yKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTAyNyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdmFyIGQxID0gYWN0aW9uMS5fZHVyYXRpb247XHJcbiAgICAgICAgdmFyIGQyID0gYWN0aW9uMi5fZHVyYXRpb247XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmluaXRXaXRoRHVyYXRpb24oTWF0aC5tYXgoZDEsIGQyKSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25lID0gYWN0aW9uMTtcclxuICAgICAgICAgICAgdGhpcy5fdHdvID0gYWN0aW9uMjtcclxuXHJcbiAgICAgICAgICAgIGlmIChkMSA+IGQyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90d28gPSBTZXF1ZW5jZS5fYWN0aW9uT25lVHdvKGFjdGlvbjIsIGRlbGF5VGltZShkMSAtIGQyKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZDEgPCBkMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25lID0gU2VxdWVuY2UuX2FjdGlvbk9uZVR3byhhY3Rpb24xLCBkZWxheVRpbWUoZDIgLSBkMSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lICgpIHtcclxuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IFNwYXduKCk7XHJcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoVHdvQWN0aW9ucyh0aGlzLl9vbmUhLmNsb25lKCksIHRoaXMuX3R3byEuY2xvbmUoKSk7XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydFdpdGhUYXJnZXQgKHRhcmdldDogYW55KSB7XHJcbiAgICAgICAgQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgICAgdGhpcy5fb25lIS5zdGFydFdpdGhUYXJnZXQodGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl90d28hLnN0YXJ0V2l0aFRhcmdldCh0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AgKCkge1xyXG4gICAgICAgIHRoaXMuX29uZSEuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuX3R3byEuc3RvcCgpO1xyXG4gICAgICAgIEFjdGlvbi5wcm90b3R5cGUuc3RvcC5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSAoZHQ6IGFueSkge1xyXG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcclxuICAgICAgICBpZiAodGhpcy5fb25lKVxyXG4gICAgICAgICAgICB0aGlzLl9vbmUudXBkYXRlKGR0KTtcclxuICAgICAgICBpZiAodGhpcy5fdHdvKVxyXG4gICAgICAgICAgICB0aGlzLl90d28udXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXZlcnNlICgpIHtcclxuICAgICAgICB2YXIgYWN0aW9uID0gU3Bhd24uX2FjdGlvbk9uZVR3byh0aGlzLl9vbmUhLnJldmVyc2UoKSwgdGhpcy5fdHdvIS5yZXZlcnNlKCkpO1xyXG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xyXG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb24gYXMgYW55O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogISNlbiBDcmVhdGUgYSBzcGF3biBhY3Rpb24gd2hpY2ggcnVucyBzZXZlcmFsIGFjdGlvbnMgaW4gcGFyYWxsZWwuXHJcbiAqICEjemgg5ZCM5q2l5omn6KGM5Yqo5L2c77yM5ZCM5q2l5omn6KGM5LiA57uE5Yqo5L2c44CCXHJcbiAqIEBtZXRob2Qgc3Bhd25cclxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufEZpbml0ZVRpbWVBY3Rpb25bXX0gYWN0aW9uT3JBY3Rpb25BcnJheVxyXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IC4uLnRlbXBBcnJheVxyXG4gKiBAcmV0dXJuIHtGaW5pdGVUaW1lQWN0aW9ufVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBpbXBvcnQgeyBzcGF3biwganVtcEJ5LCByb3RhdGVCeSwgVmVjMiB9IGZyb20gJ2NjJztcclxuICogY29uc3QgYWN0aW9uID0gc3Bhd24oanVtcEJ5KDIsIG5ldyBWZWMyKDMwMCwgMCksIDUwLCA0KSwgcm90YXRlQnkoMiwgNzIwKSk7XHJcbiAqIHRvZG86SXQgc2hvdWxkIGJlIHRoZSBkaXJlY3QgdXNlIG5ld1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduICgvKk11bHRpcGxlIEFyZ3VtZW50cyovdGVtcEFycmF5OiBhbnkpOiBGaW5pdGVUaW1lQWN0aW9uIHtcclxuICAgIHZhciBwYXJhbUFycmF5ID0gKHRlbXBBcnJheSBpbnN0YW5jZW9mIEFycmF5KSA/IHRlbXBBcnJheSA6IGFyZ3VtZW50cztcclxuICAgIGlmIChwYXJhbUFycmF5Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGVycm9ySUQoMTAyMCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGwgYXMgYW55O1xyXG4gICAgfVxyXG4gICAgaWYgKChwYXJhbUFycmF5Lmxlbmd0aCA+IDApICYmIChwYXJhbUFycmF5W3BhcmFtQXJyYXkubGVuZ3RoIC0gMV0gPT0gbnVsbCkpXHJcbiAgICAgICAgbG9nSUQoMTAxNSk7XHJcblxyXG4gICAgdmFyIHByZXYgPSBwYXJhbUFycmF5WzBdO1xyXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwYXJhbUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHBhcmFtQXJyYXlbaV0gIT0gbnVsbClcclxuICAgICAgICAgICAgcHJldiA9IFNwYXduLl9hY3Rpb25PbmVUd28ocHJldiwgcGFyYW1BcnJheVtpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJldjtcclxufVxyXG5cclxuLyogRGVsYXlzIHRoZSBhY3Rpb24gYSBjZXJ0YWluIGFtb3VudCBvZiBzZWNvbmRzXHJcbiAqIEBjbGFzcyBEZWxheVRpbWVcclxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcclxuICovXHJcbmNsYXNzIERlbGF5VGltZSBleHRlbmRzIEFjdGlvbkludGVydmFsIHtcclxuXHJcbiAgICB1cGRhdGUgKGR0OiBhbnkpIHsgfVxyXG5cclxuICAgIHJldmVyc2UgKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgRGVsYXlUaW1lKHRoaXMuX2R1cmF0aW9uKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9uZSAoKSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBEZWxheVRpbWUoKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqICEjZW4gRGVsYXlzIHRoZSBhY3Rpb24gYSBjZXJ0YWluIGFtb3VudCBvZiBzZWNvbmRzLlxyXG4gKiAhI3poIOW7tui/n+aMh+WumueahOaXtumXtOmHj+OAglxyXG4gKiBAbWV0aG9kIGRlbGF5VGltZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gZCBkdXJhdGlvbiBpbiBzZWNvbmRzXHJcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBpbXBvcnQgeyBkZWxheVRpbWUgfSBmcm9tICdjYyc7XHJcbiAqIGNvbnN0IGRlbGF5ID0gZGVsYXlUaW1lKDEpO1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5VGltZSAoZDogbnVtYmVyKTogQWN0aW9uSW50ZXJ2YWwge1xyXG4gICAgcmV0dXJuIG5ldyBEZWxheVRpbWUoZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogPHA+XHJcbiAqIEV4ZWN1dGVzIGFuIGFjdGlvbiBpbiByZXZlcnNlIG9yZGVyLCBmcm9tIHRpbWU9ZHVyYXRpb24gdG8gdGltZT0wICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XHJcbiAqIEB3YXJuaW5nIFVzZSB0aGlzIGFjdGlvbiBjYXJlZnVsbHkuIFRoaXMgYWN0aW9uIGlzIG5vdCBzZXF1ZW5jZWFibGUuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cclxuICogVXNlIGl0IGFzIHRoZSBkZWZhdWx0IFwicmV2ZXJzZWRcIiBtZXRob2Qgb2YgeW91ciBvd24gYWN0aW9ucywgYnV0IHVzaW5nIGl0IG91dHNpZGUgdGhlIFwicmV2ZXJzZWRcIiAgICAgIDxici8+XHJcbiAqIHNjb3BlIGlzIG5vdCByZWNvbW1lbmRlZC5cclxuICogPC9wPlxyXG4gKiBAY2xhc3MgUmV2ZXJzZVRpbWVcclxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcclxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cclxuICogQGV4YW1wbGVcclxuICogaW1wb3J0IFJldmVyc2VUaW1lIGZyb20gJ2NjJztcclxuICogdmFyIHJldmVyc2UgPSBuZXcgUmV2ZXJzZVRpbWUodGhpcyk7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmV2ZXJzZVRpbWUgZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfb3RoZXI6IEFjdGlvbkludGVydmFsIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGFjdGlvbj86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgYWN0aW9uICYmIHRoaXMuaW5pdFdpdGhBY3Rpb24oYWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGluaXRXaXRoQWN0aW9uIChhY3Rpb246IEFjdGlvbkludGVydmFsKSB7XHJcbiAgICAgICAgaWYgKCFhY3Rpb24pIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxMDI4KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYWN0aW9uID09PSB0aGlzLl9vdGhlcikge1xyXG4gICAgICAgICAgICBlcnJvcklEKDEwMjkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBhY3Rpb24uX2R1cmF0aW9uKSkge1xyXG4gICAgICAgICAgICAvLyBEb24ndCBsZWFrIGlmIGFjdGlvbiBpcyByZXVzZWRcclxuICAgICAgICAgICAgdGhpcy5fb3RoZXIgPSBhY3Rpb247XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUgKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgUmV2ZXJzZVRpbWUoKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICBhY3Rpb24uaW5pdFdpdGhBY3Rpb24odGhpcy5fb3RoZXIhLmNsb25lKCkpO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRXaXRoVGFyZ2V0ICh0YXJnZXQ6IGFueSkge1xyXG4gICAgICAgIEFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xyXG4gICAgICAgIHRoaXMuX290aGVyIS5zdGFydFdpdGhUYXJnZXQodGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX290aGVyKVxyXG4gICAgICAgICAgICB0aGlzLl9vdGhlci51cGRhdGUoMSAtIGR0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXZlcnNlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3RoZXIhLmNsb25lKCkgYXMgYW55O1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AgKCkge1xyXG4gICAgICAgIHRoaXMuX290aGVyIS5zdG9wKCk7XHJcbiAgICAgICAgQWN0aW9uLnByb3RvdHlwZS5zdG9wLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAhI2VuIEV4ZWN1dGVzIGFuIGFjdGlvbiBpbiByZXZlcnNlIG9yZGVyLCBmcm9tIHRpbWU9ZHVyYXRpb24gdG8gdGltZT0wLlxyXG4gKiAhI3poIOWPjei9rOebruagh+WKqOS9nOeahOaXtumXtOi9tOOAglxyXG4gKiBAbWV0aG9kIHJldmVyc2VUaW1lXHJcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXHJcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxyXG4gKiBAZXhhbXBsZVxyXG4gKiBpbXBvcnQgeyByZXZlcnNlVGltZSB9IGZyb20gJ2NjJztcclxuICogY29uc3QgcmV2ZXJzZSA9IHJldmVyc2VUaW1lKHRoaXMpO1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2VUaW1lIChhY3Rpb246IGFueSk6IEFjdGlvbkludGVydmFsIHtcclxuICAgIHJldHVybiBuZXcgUmV2ZXJzZVRpbWUoYWN0aW9uKTtcclxufVxyXG4iXX0=