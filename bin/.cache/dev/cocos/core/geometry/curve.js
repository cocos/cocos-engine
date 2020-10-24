(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../math/utils.js", "../value-types/enum.js", "../animation/types.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../math/utils.js"), require("../value-types/enum.js"), require("../animation/types.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.utils, global._enum, global.types);
    global.curve = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _utils, _enum, _types) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.evalOptCurve = evalOptCurve;
  _exports.AnimationCurve = _exports.OptimizedKey = _exports.Keyframe = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var LOOK_FORWARD = 3;
  var WrapMode = (0, _enum.Enum)({
    Default: _types.WrapModeMask.Default,
    Normal: _types.WrapModeMask.Normal,
    Clamp: _types.WrapModeMask.Clamp,
    Loop: _types.WrapModeMask.Loop,
    PingPong: _types.WrapModeMask.PingPong
  });
  /**
   * @en
   * A key frame in the curve.
   * @zh 
   * 曲线中的一个关键帧。
   */

  var Keyframe = function Keyframe() {
    _classCallCheck(this, Keyframe);

    this.time = 0;
    this.value = 0;
    this.inTangent = 0;
    this.outTangent = 0;
  };

  _exports.Keyframe = Keyframe;

  _class.CCClass.fastDefine('cc.Keyframe', Keyframe, {
    time: 0,
    value: 0,
    inTangent: 0,
    outTangent: 0
  });

  var OptimizedKey = /*#__PURE__*/function () {
    function OptimizedKey() {
      _classCallCheck(this, OptimizedKey);

      this.index = void 0;
      this.time = void 0;
      this.endTime = void 0;
      this.coefficient = void 0;
      this.index = -1;
      this.time = 0;
      this.endTime = 0;
      this.coefficient = new Float32Array(4);
    }

    _createClass(OptimizedKey, [{
      key: "evaluate",
      value: function evaluate(T) {
        var t = T - this.time;
        return evalOptCurve(t, this.coefficient);
      }
    }]);

    return OptimizedKey;
  }();

  _exports.OptimizedKey = OptimizedKey;

  function evalOptCurve(t, coefs) {
    return t * (t * (t * coefs[0] + coefs[1]) + coefs[2]) + coefs[3];
  }
  /**
   * @en
   * Describe a curve in which three times Hermite interpolation is used for each adjacent key frame.
   * @zh
   * 描述一条曲线，其中每个相邻关键帧采用三次hermite插值计算。
   */


  var AnimationCurve = /*#__PURE__*/function () {
    /**
     * @en
     * The key frame of the curve.
     * @zh 
     * 曲线的关键帧。
     */

    /**
     * @en
     * Loop mode [[WrapMode]] when the sampling time exceeds the left end.
     * @zh 
     * 当采样时间超出左端时采用的循环模式[[WrapMode]]。
     */

    /**
     * @en
     * Cycle mode [[WrapMode]] when the sampling time exceeds the right end.
     * @zh 
     * 当采样时间超出右端时采用的循环模式[[WrapMode]]。
     */

    /**
     * 构造函数。
     * @param keyFrames 关键帧。
     */
    function AnimationCurve() {
      var keyFrames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, AnimationCurve);

      this.keyFrames = void 0;
      this.preWrapMode = WrapMode.Loop;
      this.postWrapMode = WrapMode.Clamp;
      this.cachedKey = void 0;
      this.keyFrames = keyFrames || [].concat(AnimationCurve.defaultKF);
      this.cachedKey = new OptimizedKey();
    }
    /**
     * @en
     * Add a keyframe.
     * @zh 
     * 添加一个关键帧。
     * @param keyFrame 关键帧。
     */


    _createClass(AnimationCurve, [{
      key: "addKey",
      value: function addKey(keyFrame) {
        if (this.keyFrames == null) {
          this.keyFrames = [];
        }

        this.keyFrames.push(keyFrame);
      }
      /**
       * @ignore
       * @param time
       */

    }, {
      key: "evaluate_slow",
      value: function evaluate_slow(time) {
        var wrappedTime = time;
        var wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
        var startTime = this.keyFrames[0].time;
        var endTime = this.keyFrames[this.keyFrames.length - 1].time;

        switch (wrapMode) {
          case WrapMode.Loop:
            wrappedTime = (0, _utils.repeat)(time - startTime, endTime - startTime) + startTime;
            break;

          case WrapMode.PingPong:
            wrappedTime = (0, _utils.pingPong)(time - startTime, endTime - startTime) + startTime;
            break;

          case WrapMode.Clamp:
            wrappedTime = (0, _utils.clamp)(time, startTime, endTime);
            break;
        }

        var preKFIndex = 0;

        if (wrappedTime > this.keyFrames[0].time) {
          if (wrappedTime >= this.keyFrames[this.keyFrames.length - 1].time) {
            preKFIndex = this.keyFrames.length - 2;
          } else {
            for (var i = 0; i < this.keyFrames.length - 1; i++) {
              if (wrappedTime >= this.keyFrames[0].time && wrappedTime <= this.keyFrames[i + 1].time) {
                preKFIndex = i;
                break;
              }
            }
          }
        }

        var keyframe0 = this.keyFrames[preKFIndex];
        var keyframe1 = this.keyFrames[preKFIndex + 1];
        var t = (0, _utils.inverseLerp)(keyframe0.time, keyframe1.time, wrappedTime);
        var dt = keyframe1.time - keyframe0.time;
        var m0 = keyframe0.outTangent * dt;
        var m1 = keyframe1.inTangent * dt;
        var t2 = t * t;
        var t3 = t2 * t;
        var a = 2 * t3 - 3 * t2 + 1;
        var b = t3 - 2 * t2 + t;
        var c = t3 - t2;
        var d = -2 * t3 + 3 * t2;
        return a * keyframe0.value + b * m0 + c * m1 + d * keyframe1.value;
      }
      /**
       * @en
       * Calculate the curve interpolation at a given point in time.
       * @zh 
       * 计算给定时间点的曲线插值。
       * @param time 时间。
       */

    }, {
      key: "evaluate",
      value: function evaluate(time) {
        var wrappedTime = time;
        var wrapMode = time < 0 ? this.preWrapMode : this.postWrapMode;
        var startTime = this.keyFrames[0].time;
        var endTime = this.keyFrames[this.keyFrames.length - 1].time;

        switch (wrapMode) {
          case WrapMode.Loop:
            wrappedTime = (0, _utils.repeat)(time - startTime, endTime - startTime) + startTime;
            break;

          case WrapMode.PingPong:
            wrappedTime = (0, _utils.pingPong)(time - startTime, endTime - startTime) + startTime;
            break;

          case WrapMode.Clamp:
            wrappedTime = (0, _utils.clamp)(time, startTime, endTime);
            break;
        }

        if (wrappedTime >= this.cachedKey.time && wrappedTime < this.cachedKey.endTime) {
          return this.cachedKey.evaluate(wrappedTime);
        } else {
          var leftIndex = this.findIndex(this.cachedKey, wrappedTime);
          var rightIndex = leftIndex + 1;

          if (rightIndex === this.keyFrames.length) {
            rightIndex -= 1;
          }

          this.calcOptimizedKey(this.cachedKey, leftIndex, rightIndex);
          return this.cachedKey.evaluate(wrappedTime);
        }
      }
      /**
       * @ignore
       * @param optKey
       * @param leftIndex
       * @param rightIndex
       */

    }, {
      key: "calcOptimizedKey",
      value: function calcOptimizedKey(optKey, leftIndex, rightIndex) {
        var lhs = this.keyFrames[leftIndex];
        var rhs = this.keyFrames[rightIndex];
        optKey.index = leftIndex;
        optKey.time = lhs.time;
        optKey.endTime = rhs.time;
        var dx = rhs.time - lhs.time;
        var dy = rhs.value - lhs.value;
        var length = 1 / (dx * dx);
        var d1 = lhs.outTangent * dx;
        var d2 = rhs.inTangent * dx;
        optKey.coefficient[0] = (d1 + d2 - dy - dy) * length / dx;
        optKey.coefficient[1] = (dy + dy + dy - d1 - d1 - d2) * length;
        optKey.coefficient[2] = lhs.outTangent;
        optKey.coefficient[3] = lhs.value;
      }
      /**
       * @ignore
       * @param optKey
       * @param t
       */

    }, {
      key: "findIndex",
      value: function findIndex(optKey, t) {
        var cachedIndex = optKey.index;

        if (cachedIndex !== -1) {
          var cachedTime = this.keyFrames[cachedIndex].time;

          if (t > cachedTime) {
            for (var i = 0; i < LOOK_FORWARD; i++) {
              var currIndex = cachedIndex + i;

              if (currIndex + 1 < this.keyFrames.length && this.keyFrames[currIndex + 1].time > t) {
                return currIndex;
              }
            }
          } else {
            for (var _i = 0; _i < LOOK_FORWARD; _i++) {
              var _currIndex = cachedIndex - _i;

              if (_currIndex >= 0 && this.keyFrames[_currIndex - 1].time <= t) {
                return _currIndex - 1;
              }
            }
          }
        }

        var left = 0;
        var right = this.keyFrames.length;
        var mid = Math.floor((left + right) / 2);

        while (right - left > 1) {
          if (this.keyFrames[mid].time >= t) {
            right = mid;
          } else {
            left = mid + 1;
          }

          mid = Math.floor((left + right) / 2);
        }

        return left;
      }
    }]);

    return AnimationCurve;
  }();

  _exports.AnimationCurve = AnimationCurve;
  AnimationCurve.defaultKF = [{
    time: 0,
    value: 1,
    inTangent: 0,
    outTangent: 0
  }, {
    time: 1,
    value: 1,
    inTangent: 0,
    outTangent: 0
  }];

  _class.CCClass.fastDefine('cc.AnimationCurve', AnimationCurve, {
    preWrapMode: WrapMode.Default,
    postWrapMode: WrapMode.Default,
    keyFrames: []
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvY3VydmUudHMiXSwibmFtZXMiOlsiTE9PS19GT1JXQVJEIiwiV3JhcE1vZGUiLCJEZWZhdWx0IiwiV3JhcE1vZGVNYXNrIiwiTm9ybWFsIiwiQ2xhbXAiLCJMb29wIiwiUGluZ1BvbmciLCJLZXlmcmFtZSIsInRpbWUiLCJ2YWx1ZSIsImluVGFuZ2VudCIsIm91dFRhbmdlbnQiLCJDQ0NsYXNzIiwiZmFzdERlZmluZSIsIk9wdGltaXplZEtleSIsImluZGV4IiwiZW5kVGltZSIsImNvZWZmaWNpZW50IiwiRmxvYXQzMkFycmF5IiwiVCIsInQiLCJldmFsT3B0Q3VydmUiLCJjb2VmcyIsIkFuaW1hdGlvbkN1cnZlIiwia2V5RnJhbWVzIiwicHJlV3JhcE1vZGUiLCJwb3N0V3JhcE1vZGUiLCJjYWNoZWRLZXkiLCJjb25jYXQiLCJkZWZhdWx0S0YiLCJrZXlGcmFtZSIsInB1c2giLCJ3cmFwcGVkVGltZSIsIndyYXBNb2RlIiwic3RhcnRUaW1lIiwibGVuZ3RoIiwicHJlS0ZJbmRleCIsImkiLCJrZXlmcmFtZTAiLCJrZXlmcmFtZTEiLCJkdCIsIm0wIiwibTEiLCJ0MiIsInQzIiwiYSIsImIiLCJjIiwiZCIsImV2YWx1YXRlIiwibGVmdEluZGV4IiwiZmluZEluZGV4IiwicmlnaHRJbmRleCIsImNhbGNPcHRpbWl6ZWRLZXkiLCJvcHRLZXkiLCJsaHMiLCJyaHMiLCJkeCIsImR5IiwiZDEiLCJkMiIsImNhY2hlZEluZGV4IiwiY2FjaGVkVGltZSIsImN1cnJJbmRleCIsImxlZnQiLCJyaWdodCIsIm1pZCIsIk1hdGgiLCJmbG9vciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTUEsWUFBWSxHQUFHLENBQXJCO0FBRUEsTUFBTUMsUUFBUSxHQUFHLGdCQUFLO0FBQ2xCQyxJQUFBQSxPQUFPLEVBQUVDLG9CQUFhRCxPQURKO0FBRWxC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QUFuQixFQUF3Q1UsY0FBeEMsRUFBd0Q7QUFDcERFLElBQUFBLFdBQVcsRUFBRXpCLFFBQVEsQ0FBQ0MsT0FEOEI7QUFFcER5QixJQUFBQSxZQUFZLEVBQUUxQixRQUFRLENBQUNDLE9BRjZCO0FBR3BEdUIsSUFBQUEsU0FBUyxFQUFFO0FBSHlDLEdBQXhEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBnZW9tZXRyeVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi8uLi9jb3JlL2RhdGEvY2xhc3MnO1xyXG5pbXBvcnQgeyBjbGFtcCwgaW52ZXJzZUxlcnAsIHBpbmdQb25nLCByZXBlYXQgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBFbnVtIH0gZnJvbSAnLi4vLi4vY29yZS92YWx1ZS10eXBlcy9lbnVtJztcclxuaW1wb3J0IHsgV3JhcE1vZGVNYXNrIH0gZnJvbSAnLi4vLi4vY29yZS9hbmltYXRpb24vdHlwZXMnO1xyXG5jb25zdCBMT09LX0ZPUldBUkQgPSAzO1xyXG5cclxuY29uc3QgV3JhcE1vZGUgPSBFbnVtKHtcclxuICAgIERlZmF1bHQ6IFdyYXBNb2RlTWFzay5EZWZhdWx0LFxyXG4gICAgTm9ybWFsOiBXcmFwTW9kZU1hc2suTm9ybWFsLFxyXG4gICAgQ2xhbXA6IFdyYXBNb2RlTWFzay5DbGFtcCxcclxuICAgIExvb3A6IFdyYXBNb2RlTWFzay5Mb29wLFxyXG4gICAgUGluZ1Bvbmc6IFdyYXBNb2RlTWFzay5QaW5nUG9uZyxcclxufSk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEEga2V5IGZyYW1lIGluIHRoZSBjdXJ2ZS5cclxuICogQHpoIFxyXG4gKiDmm7Lnur/kuK3nmoTkuIDkuKrlhbPplK7luKfjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBLZXlmcmFtZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2T5YmN5bin5pe26Ze044CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0aW1lID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlvZPliY3luKfnmoTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHZhbHVlID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlt6bliIfnur/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluVGFuZ2VudCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Y+z5YiH57q/44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvdXRUYW5nZW50ID0gMDtcclxufVxyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5LZXlmcmFtZScsIEtleWZyYW1lLCB7XHJcbiAgICB0aW1lOiAwLFxyXG4gICAgdmFsdWU6IDAsXHJcbiAgICBpblRhbmdlbnQ6IDAsXHJcbiAgICBvdXRUYW5nZW50OiAwLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBPcHRpbWl6ZWRLZXkge1xyXG4gICAgcHVibGljIGluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdGltZTogbnVtYmVyO1xyXG4gICAgcHVibGljIGVuZFRpbWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjb2VmZmljaWVudDogRmxvYXQzMkFycmF5O1xyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuZW5kVGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2VmZmljaWVudCA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGV2YWx1YXRlIChUOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ID0gVCAtIHRoaXMudGltZTtcclxuICAgICAgICByZXR1cm4gZXZhbE9wdEN1cnZlKHQsIHRoaXMuY29lZmZpY2llbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXZhbE9wdEN1cnZlICh0OiBudW1iZXIsIGNvZWZzOiBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSkge1xyXG4gICAgcmV0dXJuICh0ICogKHQgKiAodCAqIGNvZWZzWzBdICsgY29lZnNbMV0pICsgY29lZnNbMl0pKSArIGNvZWZzWzNdO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIERlc2NyaWJlIGEgY3VydmUgaW4gd2hpY2ggdGhyZWUgdGltZXMgSGVybWl0ZSBpbnRlcnBvbGF0aW9uIGlzIHVzZWQgZm9yIGVhY2ggYWRqYWNlbnQga2V5IGZyYW1lLlxyXG4gKiBAemhcclxuICog5o+P6L+w5LiA5p2h5puy57q/77yM5YW25Lit5q+P5Liq55u46YK75YWz6ZSu5bin6YeH55So5LiJ5qyhaGVybWl0ZeaPkuWAvOiuoeeul+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkN1cnZlIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBkZWZhdWx0S0Y6IEtleWZyYW1lW10gPSBbe1xyXG4gICAgICAgIHRpbWU6IDAsXHJcbiAgICAgICAgdmFsdWU6IDEsXHJcbiAgICAgICAgaW5UYW5nZW50OiAwLFxyXG4gICAgICAgIG91dFRhbmdlbnQ6IDAsXHJcbiAgICB9LCB7XHJcbiAgICAgICAgdGltZTogMSxcclxuICAgICAgICB2YWx1ZTogMSxcclxuICAgICAgICBpblRhbmdlbnQ6IDAsXHJcbiAgICAgICAgb3V0VGFuZ2VudDogMCxcclxuICAgIH1dO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUga2V5IGZyYW1lIG9mIHRoZSBjdXJ2ZS5cclxuICAgICAqIEB6aCBcclxuICAgICAqIOabsue6v+eahOWFs+mUruW4p+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMga2V5RnJhbWVzOiBLZXlmcmFtZVtdIHwgbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTG9vcCBtb2RlIFtbV3JhcE1vZGVdXSB3aGVuIHRoZSBzYW1wbGluZyB0aW1lIGV4Y2VlZHMgdGhlIGxlZnQgZW5kLlxyXG4gICAgICogQHpoIFxyXG4gICAgICog5b2T6YeH5qC35pe26Ze06LaF5Ye65bem56uv5pe26YeH55So55qE5b6q546v5qih5byPW1tXcmFwTW9kZV1d44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcmVXcmFwTW9kZTogbnVtYmVyID0gV3JhcE1vZGUuTG9vcDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ3ljbGUgbW9kZSBbW1dyYXBNb2RlXV0gd2hlbiB0aGUgc2FtcGxpbmcgdGltZSBleGNlZWRzIHRoZSByaWdodCBlbmQuXHJcbiAgICAgKiBAemggXHJcbiAgICAgKiDlvZPph4fmoLfml7bpl7TotoXlh7rlj7Pnq6/ml7bph4fnlKjnmoTlvqrnjq/mqKHlvI9bW1dyYXBNb2RlXV3jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvc3RXcmFwTW9kZTogbnVtYmVyID0gV3JhcE1vZGUuQ2xhbXA7XHJcblxyXG4gICAgcHJpdmF0ZSBjYWNoZWRLZXk6IE9wdGltaXplZEtleTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaehOmAoOWHveaVsOOAglxyXG4gICAgICogQHBhcmFtIGtleUZyYW1lcyDlhbPplK7luKfjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGtleUZyYW1lczogS2V5ZnJhbWVbXSB8IG51bGwgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5rZXlGcmFtZXMgPSBrZXlGcmFtZXMgfHwgKFtdIGFzIEtleWZyYW1lW10pLmNvbmNhdChBbmltYXRpb25DdXJ2ZS5kZWZhdWx0S0YpO1xyXG4gICAgICAgIHRoaXMuY2FjaGVkS2V5ID0gbmV3IE9wdGltaXplZEtleSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYSBrZXlmcmFtZS5cclxuICAgICAqIEB6aCBcclxuICAgICAqIOa3u+WKoOS4gOS4quWFs+mUruW4p+OAglxyXG4gICAgICogQHBhcmFtIGtleUZyYW1lIOWFs+mUruW4p+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkS2V5IChrZXlGcmFtZTogS2V5ZnJhbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5rZXlGcmFtZXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmtleUZyYW1lcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtleUZyYW1lcy5wdXNoKGtleUZyYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpZ25vcmVcclxuICAgICAqIEBwYXJhbSB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBldmFsdWF0ZV9zbG93ICh0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgd3JhcHBlZFRpbWUgPSB0aW1lO1xyXG4gICAgICAgIGNvbnN0IHdyYXBNb2RlID0gdGltZSA8IDAgPyB0aGlzLnByZVdyYXBNb2RlIDogdGhpcy5wb3N0V3JhcE1vZGU7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gdGhpcy5rZXlGcmFtZXMhWzBdLnRpbWU7XHJcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IHRoaXMua2V5RnJhbWVzIVt0aGlzLmtleUZyYW1lcyEubGVuZ3RoIC0gMV0udGltZTtcclxuICAgICAgICBzd2l0Y2ggKHdyYXBNb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgV3JhcE1vZGUuTG9vcDpcclxuICAgICAgICAgICAgICAgIHdyYXBwZWRUaW1lID0gcmVwZWF0KHRpbWUgLSBzdGFydFRpbWUsIGVuZFRpbWUgLSBzdGFydFRpbWUpICsgc3RhcnRUaW1lO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgV3JhcE1vZGUuUGluZ1Bvbmc6XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVkVGltZSA9IHBpbmdQb25nKHRpbWUgLSBzdGFydFRpbWUsIGVuZFRpbWUgLSBzdGFydFRpbWUpICsgc3RhcnRUaW1lO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgV3JhcE1vZGUuQ2xhbXA6XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVkVGltZSA9IGNsYW1wKHRpbWUsIHN0YXJ0VGltZSwgZW5kVGltZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByZUtGSW5kZXggPSAwO1xyXG4gICAgICAgIGlmICh3cmFwcGVkVGltZSA+IHRoaXMua2V5RnJhbWVzIVswXS50aW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh3cmFwcGVkVGltZSA+PSB0aGlzLmtleUZyYW1lcyFbdGhpcy5rZXlGcmFtZXMhLmxlbmd0aCAtIDFdLnRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHByZUtGSW5kZXggPSB0aGlzLmtleUZyYW1lcyEubGVuZ3RoIC0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5rZXlGcmFtZXMhLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3cmFwcGVkVGltZSA+PSB0aGlzLmtleUZyYW1lcyFbMF0udGltZSAmJiB3cmFwcGVkVGltZSA8PSB0aGlzLmtleUZyYW1lcyFbaSArIDFdLnRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlS0ZJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBrZXlmcmFtZTAgPSB0aGlzLmtleUZyYW1lcyFbcHJlS0ZJbmRleF07XHJcbiAgICAgICAgY29uc3Qga2V5ZnJhbWUxID0gdGhpcy5rZXlGcmFtZXMhW3ByZUtGSW5kZXggKyAxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdCA9IGludmVyc2VMZXJwKGtleWZyYW1lMC50aW1lLCBrZXlmcmFtZTEudGltZSwgd3JhcHBlZFRpbWUpO1xyXG4gICAgICAgIGNvbnN0IGR0ID0ga2V5ZnJhbWUxLnRpbWUgLSBrZXlmcmFtZTAudGltZTtcclxuXHJcbiAgICAgICAgY29uc3QgbTAgPSBrZXlmcmFtZTAub3V0VGFuZ2VudCAqIGR0O1xyXG4gICAgICAgIGNvbnN0IG0xID0ga2V5ZnJhbWUxLmluVGFuZ2VudCAqIGR0O1xyXG5cclxuICAgICAgICBjb25zdCB0MiA9IHQgKiB0O1xyXG4gICAgICAgIGNvbnN0IHQzID0gdDIgKiB0O1xyXG5cclxuICAgICAgICBjb25zdCBhID0gMiAqIHQzIC0gMyAqIHQyICsgMTtcclxuICAgICAgICBjb25zdCBiID0gdDMgLSAyICogdDIgKyB0O1xyXG4gICAgICAgIGNvbnN0IGMgPSB0MyAtIHQyO1xyXG4gICAgICAgIGNvbnN0IGQgPSAtMiAqIHQzICsgMyAqIHQyO1xyXG5cclxuICAgICAgICByZXR1cm4gYSAqIGtleWZyYW1lMC52YWx1ZSArIGIgKiBtMCArIGMgKiBtMSArIGQgKiBrZXlmcmFtZTEudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENhbGN1bGF0ZSB0aGUgY3VydmUgaW50ZXJwb2xhdGlvbiBhdCBhIGdpdmVuIHBvaW50IGluIHRpbWUuXHJcbiAgICAgKiBAemggXHJcbiAgICAgKiDorqHnrpfnu5nlrprml7bpl7TngrnnmoTmm7Lnur/mj5LlgLzjgIJcclxuICAgICAqIEBwYXJhbSB0aW1lIOaXtumXtOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXZhbHVhdGUgKHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB3cmFwcGVkVGltZSA9IHRpbWU7XHJcbiAgICAgICAgY29uc3Qgd3JhcE1vZGUgPSB0aW1lIDwgMCA/IHRoaXMucHJlV3JhcE1vZGUgOiB0aGlzLnBvc3RXcmFwTW9kZTtcclxuICAgICAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLmtleUZyYW1lcyFbMF0udGltZTtcclxuICAgICAgICBjb25zdCBlbmRUaW1lID0gdGhpcy5rZXlGcmFtZXMhW3RoaXMua2V5RnJhbWVzIS5sZW5ndGggLSAxXS50aW1lO1xyXG4gICAgICAgIHN3aXRjaCAod3JhcE1vZGUpIHtcclxuICAgICAgICAgICAgY2FzZSBXcmFwTW9kZS5Mb29wOlxyXG4gICAgICAgICAgICAgICAgd3JhcHBlZFRpbWUgPSByZXBlYXQodGltZSAtIHN0YXJ0VGltZSwgZW5kVGltZSAtIHN0YXJ0VGltZSkgKyBzdGFydFRpbWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBXcmFwTW9kZS5QaW5nUG9uZzpcclxuICAgICAgICAgICAgICAgIHdyYXBwZWRUaW1lID0gcGluZ1BvbmcodGltZSAtIHN0YXJ0VGltZSwgZW5kVGltZSAtIHN0YXJ0VGltZSkgKyBzdGFydFRpbWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBXcmFwTW9kZS5DbGFtcDpcclxuICAgICAgICAgICAgICAgIHdyYXBwZWRUaW1lID0gY2xhbXAodGltZSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod3JhcHBlZFRpbWUgPj0gdGhpcy5jYWNoZWRLZXkudGltZSAmJiB3cmFwcGVkVGltZSA8IHRoaXMuY2FjaGVkS2V5LmVuZFRpbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkS2V5LmV2YWx1YXRlKHdyYXBwZWRUaW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBsZWZ0SW5kZXggPSB0aGlzLmZpbmRJbmRleCh0aGlzLmNhY2hlZEtleSwgd3JhcHBlZFRpbWUpO1xyXG4gICAgICAgICAgICBsZXQgcmlnaHRJbmRleCA9IGxlZnRJbmRleCArIDE7XHJcbiAgICAgICAgICAgIGlmIChyaWdodEluZGV4ID09PSB0aGlzLmtleUZyYW1lcyEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByaWdodEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWxjT3B0aW1pemVkS2V5KHRoaXMuY2FjaGVkS2V5LCBsZWZ0SW5kZXgsIHJpZ2h0SW5kZXgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRLZXkuZXZhbHVhdGUod3JhcHBlZFRpbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpZ25vcmVcclxuICAgICAqIEBwYXJhbSBvcHRLZXlcclxuICAgICAqIEBwYXJhbSBsZWZ0SW5kZXhcclxuICAgICAqIEBwYXJhbSByaWdodEluZGV4XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjYWxjT3B0aW1pemVkS2V5IChvcHRLZXk6IE9wdGltaXplZEtleSwgbGVmdEluZGV4OiBudW1iZXIsIHJpZ2h0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxocyA9IHRoaXMua2V5RnJhbWVzIVtsZWZ0SW5kZXhdO1xyXG4gICAgICAgIGNvbnN0IHJocyA9IHRoaXMua2V5RnJhbWVzIVtyaWdodEluZGV4XTtcclxuICAgICAgICBvcHRLZXkuaW5kZXggPSBsZWZ0SW5kZXg7XHJcbiAgICAgICAgb3B0S2V5LnRpbWUgPSBsaHMudGltZTtcclxuICAgICAgICBvcHRLZXkuZW5kVGltZSA9IHJocy50aW1lO1xyXG5cclxuICAgICAgICBjb25zdCBkeCA9IHJocy50aW1lIC0gbGhzLnRpbWU7XHJcbiAgICAgICAgY29uc3QgZHkgPSByaHMudmFsdWUgLSBsaHMudmFsdWU7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gMSAvIChkeCAqIGR4KTtcclxuICAgICAgICBjb25zdCBkMSA9IGxocy5vdXRUYW5nZW50ICogZHg7XHJcbiAgICAgICAgY29uc3QgZDIgPSByaHMuaW5UYW5nZW50ICogZHg7XHJcblxyXG4gICAgICAgIG9wdEtleS5jb2VmZmljaWVudFswXSA9IChkMSArIGQyIC0gZHkgLSBkeSkgKiBsZW5ndGggLyBkeDtcclxuICAgICAgICBvcHRLZXkuY29lZmZpY2llbnRbMV0gPSAoZHkgKyBkeSArIGR5IC0gZDEgLSBkMSAtIGQyKSAqIGxlbmd0aDtcclxuICAgICAgICBvcHRLZXkuY29lZmZpY2llbnRbMl0gPSBsaHMub3V0VGFuZ2VudDtcclxuICAgICAgICBvcHRLZXkuY29lZmZpY2llbnRbM10gPSBsaHMudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaWdub3JlXHJcbiAgICAgKiBAcGFyYW0gb3B0S2V5XHJcbiAgICAgKiBAcGFyYW0gdFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGZpbmRJbmRleCAob3B0S2V5OiBPcHRpbWl6ZWRLZXksIHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGNhY2hlZEluZGV4ID0gb3B0S2V5LmluZGV4O1xyXG4gICAgICAgIGlmIChjYWNoZWRJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgY29uc3QgY2FjaGVkVGltZSA9IHRoaXMua2V5RnJhbWVzIVtjYWNoZWRJbmRleF0udGltZTtcclxuICAgICAgICAgICAgaWYgKHQgPiBjYWNoZWRUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IExPT0tfRk9SV0FSRDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyckluZGV4ID0gY2FjaGVkSW5kZXggKyBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJySW5kZXggKyAxIDwgdGhpcy5rZXlGcmFtZXMhLmxlbmd0aCAmJiB0aGlzLmtleUZyYW1lcyFbY3VyckluZGV4ICsgMV0udGltZSA+IHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IExPT0tfRk9SV0FSRDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyckluZGV4ID0gY2FjaGVkSW5kZXggLSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJySW5kZXggPj0gMCAmJiB0aGlzLmtleUZyYW1lcyFbY3VyckluZGV4IC0gMV0udGltZSA8PSB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJySW5kZXggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbGVmdCA9IDA7XHJcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5rZXlGcmFtZXMhLmxlbmd0aDtcclxuICAgICAgICBsZXQgbWlkID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xyXG4gICAgICAgIHdoaWxlIChyaWdodCAtIGxlZnQgPiAxKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtleUZyYW1lcyFbbWlkXS50aW1lID49IHQpIHtcclxuICAgICAgICAgICAgICAgIHJpZ2h0ID0gbWlkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG1pZCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWlkID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGVmdDtcclxuICAgIH1cclxufVxyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5BbmltYXRpb25DdXJ2ZScsIEFuaW1hdGlvbkN1cnZlLCB7XHJcbiAgICBwcmVXcmFwTW9kZTogV3JhcE1vZGUuRGVmYXVsdCxcclxuICAgIHBvc3RXcmFwTW9kZTogV3JhcE1vZGUuRGVmYXVsdCxcclxuICAgIGtleUZyYW1lczogW10sXHJcbn0pO1xyXG4iXX0=