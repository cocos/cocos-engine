(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/utils/binary-search.js", "../math/index.js", "../platform/debug.js", "../value-types/index.js", "./bezier.js", "./easing.js", "./types.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/utils/binary-search.js"), require("../math/index.js"), require("../platform/debug.js"), require("../value-types/index.js"), require("./bezier.js"), require("./easing.js"), require("./types.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.binarySearch, global.index, global.debug, global.index, global.bezier, global.easing, global.types, global.globalExports);
    global.animationCurve = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _binarySearch, _index, _debug, _index2, _bezier, easing, _types, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.sampleAnimationCurve = sampleAnimationCurve;
  _exports.computeRatioByType = computeRatioByType;
  _exports.EventInfo = _exports.AnimCurve = _exports.RatioSampler = void 0;
  easing = _interopRequireWildcard(easing);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var RatioSampler = /*#__PURE__*/function () {
    function RatioSampler(ratios) {
      _classCallCheck(this, RatioSampler);

      this.ratios = void 0;
      this._findRatio = void 0;
      this.ratios = ratios; // If every piece of ratios are the same, we can use the quick function to find frame index.

      var currRatioDif;
      var lastRatioDif;
      var canOptimize = true;
      var EPSILON = 1e-6;

      for (var i = 1, l = ratios.length; i < l; i++) {
        currRatioDif = ratios[i] - ratios[i - 1];

        if (i === 1) {
          lastRatioDif = currRatioDif;
        } else if (Math.abs(currRatioDif - lastRatioDif) > EPSILON) {
          canOptimize = false;
          break;
        }
      }

      this._findRatio = canOptimize ? quickFindIndex : _binarySearch.binarySearchEpsilon;
    }

    _createClass(RatioSampler, [{
      key: "sample",
      value: function sample(ratio) {
        return this._findRatio(this.ratios, ratio);
      }
    }]);

    return RatioSampler;
  }();

  _exports.RatioSampler = RatioSampler;
  _globalExports.legacyCC.RatioSampler = RatioSampler;
  /**
   * 动画曲线。
   */

  var AnimCurve = /*#__PURE__*/function () {
    _createClass(AnimCurve, null, [{
      key: "Bezier",
      value: function Bezier(controlPoints) {
        return controlPoints;
      }
    }]);

    function AnimCurve(propertyCurveData, duration) {
      _classCallCheck(this, AnimCurve);

      this.types = undefined;
      this.type = null;
      this._values = [];
      this._lerp = undefined;
      this._duration = void 0;
      this._array = void 0;
      this._duration = duration; // Install values.

      this._values = propertyCurveData.values;

      var getCurveType = function getCurveType(easingMethod) {
        if (typeof easingMethod === 'string') {
          return easingMethod;
        } else if (Array.isArray(easingMethod)) {
          if (easingMethod[0] === easingMethod[1] && easingMethod[2] === easingMethod[3]) {
            return AnimCurve.Linear;
          } else {
            return AnimCurve.Bezier(easingMethod);
          }
        } else {
          return AnimCurve.Linear;
        }
      };

      if (propertyCurveData.easingMethod !== undefined) {
        this.type = getCurveType(propertyCurveData.easingMethod);
      } else if (Array.isArray(propertyCurveData.easingMethods)) {
        this.types = propertyCurveData.easingMethods.map(getCurveType);
      } else if (propertyCurveData.easingMethods !== undefined) {
        this.types = new Array(this._values.length).fill(null);

        for (var _i = 0, _Object$keys = Object.keys(propertyCurveData.easingMethods); _i < _Object$keys.length; _i++) {
          var index = _Object$keys[_i];
          this.types[index] = getCurveType(propertyCurveData.easingMethods[index]);
        }
      } else {
        this.type = null;
      }

      var firstValue = propertyCurveData.values[0];
      var interpolate = propertyCurveData.interpolate === undefined ? true : propertyCurveData.interpolate; // Setup the lerp function.

      if (interpolate) {
        this._lerp = selectLerpFx(firstValue);
      }

      if (propertyCurveData._arrayLength !== undefined) {
        this._array = new Array(propertyCurveData._arrayLength);
      }
    }

    _createClass(AnimCurve, [{
      key: "hasLerp",
      value: function hasLerp() {
        return !!this._lerp;
      }
    }, {
      key: "valueAt",
      value: function valueAt(index) {
        if (this._array === undefined) {
          var value = this._values[index];

          if (value && value.getNoLerp) {
            return value.getNoLerp();
          } else {
            return value;
          }
        } else {
          for (var i = 0; i < this._array.length; ++i) {
            this._array[i] = this._values[this._array.length * index + i];
          }

          return this._array;
        }
      }
    }, {
      key: "valueBetween",
      value: function valueBetween(ratio, from, fromRatio, to, toRatio) {
        if (this._lerp) {
          var type = this.types ? this.types[from] : this.type;
          var dRatio = toRatio - fromRatio;
          var ratioBetweenFrames = (ratio - fromRatio) / dRatio;

          if (type) {
            ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
          }

          if (this._array === undefined) {
            var fromVal = this._values[from];
            var toVal = this._values[to];

            var value = this._lerp(fromVal, toVal, ratioBetweenFrames, dRatio * this._duration);

            return value;
          } else {
            for (var i = 0; i < this._array.length; ++i) {
              var _fromVal = this._values[this._array.length * from + i];
              var _toVal = this._values[this._array.length * to + i];
              this._array[i] = this._lerp(_fromVal, _toVal, ratioBetweenFrames, dRatio * this._duration);
            }

            return this._array;
          }
        } else {
          if (this._array === undefined) {
            return this.valueAt(from);
          } else {
            for (var _i2 = 0; _i2 < this._array.length; ++_i2) {
              this._array[_i2] = this._values[this._array.length * from + _i2];
            }

            return this._array;
          }
        }
      }
    }, {
      key: "empty",
      value: function empty() {
        return this._values.length === 0;
      }
      /**
       * Returns if this curve only yields constants.
       */

    }, {
      key: "constant",
      value: function constant() {
        return this._values.length === 1;
      }
    }]);

    return AnimCurve;
  }();

  _exports.AnimCurve = AnimCurve;
  AnimCurve.Linear = null;
  _globalExports.legacyCC.AnimCurve = AnimCurve;

  var EventInfo = /*#__PURE__*/function () {
    function EventInfo() {
      _classCallCheck(this, EventInfo);

      this.events = [];
    }

    _createClass(EventInfo, [{
      key: "add",

      /**
       * @param func event function
       * @param params event params
       */
      value: function add(func, params) {
        this.events.push({
          func: func || '',
          params: params || []
        });
      }
    }]);

    return EventInfo;
  }();
  /**
   * 采样动画曲线。
   * @param curve 动画曲线。
   * @param sampler 采样器。
   * @param ratio 采样比率。
   */


  _exports.EventInfo = EventInfo;

  function sampleAnimationCurve(curve, sampler, ratio) {
    var index = sampler.sample(ratio);

    if (index < 0) {
      index = ~index;

      if (index <= 0) {
        index = 0;
      } else if (index >= sampler.ratios.length) {
        index = sampler.ratios.length - 1;
      } else {
        return curve.valueBetween(ratio, index - 1, sampler.ratios[index - 1], index, sampler.ratios[index]);
      }
    }

    return curve.valueAt(index);
  }

  _globalExports.legacyCC.sampleAnimationCurve = sampleAnimationCurve;
  /**
   * Compute a new ratio by curve type.
   * @param ratio - The origin ratio
   * @param type - If it's Array, then ratio will be computed with bezierByTime.
   * If it's string, then ratio will be computed with cc.easing function
   */

  function computeRatioByType(ratio, type) {
    if (typeof type === 'string') {
      var func = easing[type];

      if (func) {
        ratio = func(ratio);
      } else {
        (0, _debug.errorID)(3906, type);
      }
    } else if (Array.isArray(type)) {
      // bezier curve
      ratio = (0, _bezier.bezierByTime)(type, ratio);
    }

    return ratio;
  }
  /**
   * Use this function if intervals between frames are same.
   */


  function quickFindIndex(ratios, ratio) {
    var length = ratios.length - 1;

    if (length === 0) {
      return 0;
    }

    var start = ratios[0];

    if (ratio < start) {
      return 0;
    }

    var end = ratios[length];

    if (ratio > end) {
      return length;
    }

    ratio = (ratio - start) / (end - start);
    var eachLength = 1 / length;
    var index = ratio / eachLength;
    var floorIndex = index | 0;
    var EPSILON = 1e-6;

    if (index - floorIndex < EPSILON) {
      return floorIndex;
    } else if (floorIndex + 1 - index < EPSILON) {
      return floorIndex + 1;
    }

    return ~(floorIndex + 1);
  }

  var selectLerpFx = function () {
    function makeValueTypeLerpFx(constructor) {
      var tempValue = new constructor();
      return function (from, to, ratio) {
        // @ts-ignore
        constructor.lerp(tempValue, from, to, ratio);
        return tempValue;
      };
    }

    function callLerpable(from, to, t, dt) {
      return from.lerp(to, t, dt);
    }

    function makeQuatSlerpFx() {
      var tempValue = new _index.Quat();
      return function (from, to, t, dt) {
        return _index.Quat.slerp(tempValue, from, to, t);
      };
    }

    return function (value) {
      if (value === null) {
        return undefined;
      }

      if (typeof value === 'number') {
        return _index.lerp;
      } else if (_typeof(value) === 'object' && value.constructor) {
        if (value instanceof _index.Quat) {
          return makeQuatSlerpFx();
        } else if (value instanceof _index2.ValueType) {
          return makeValueTypeLerpFx(value.constructor);
        } else if (value.constructor === Number) {
          return _index.lerp;
        } else if ((0, _types.isLerpable)(value)) {
          return callLerpable;
        }
      }

      return undefined;
    };
  }();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi1jdXJ2ZS50cyJdLCJuYW1lcyI6WyJSYXRpb1NhbXBsZXIiLCJyYXRpb3MiLCJfZmluZFJhdGlvIiwiY3VyclJhdGlvRGlmIiwibGFzdFJhdGlvRGlmIiwiY2FuT3B0aW1pemUiLCJFUFNJTE9OIiwiaSIsImwiLCJsZW5ndGgiLCJNYXRoIiwiYWJzIiwicXVpY2tGaW5kSW5kZXgiLCJiaW5hcnlTZWFyY2giLCJyYXRpbyIsImxlZ2FjeUNDIiwiQW5pbUN1cnZlIiwiY29udHJvbFBvaW50cyIsInByb3BlcnR5Q3VydmVEYXRhIiwiZHVyYXRpb24iLCJ0eXBlcyIsInVuZGVmaW5lZCIsInR5cGUiLCJfdmFsdWVzIiwiX2xlcnAiLCJfZHVyYXRpb24iLCJfYXJyYXkiLCJ2YWx1ZXMiLCJnZXRDdXJ2ZVR5cGUiLCJlYXNpbmdNZXRob2QiLCJBcnJheSIsImlzQXJyYXkiLCJMaW5lYXIiLCJCZXppZXIiLCJlYXNpbmdNZXRob2RzIiwibWFwIiwiZmlsbCIsIk9iamVjdCIsImtleXMiLCJpbmRleCIsImZpcnN0VmFsdWUiLCJpbnRlcnBvbGF0ZSIsInNlbGVjdExlcnBGeCIsIl9hcnJheUxlbmd0aCIsInZhbHVlIiwiZ2V0Tm9MZXJwIiwiZnJvbSIsImZyb21SYXRpbyIsInRvIiwidG9SYXRpbyIsImRSYXRpbyIsInJhdGlvQmV0d2VlbkZyYW1lcyIsImNvbXB1dGVSYXRpb0J5VHlwZSIsImZyb21WYWwiLCJ0b1ZhbCIsInZhbHVlQXQiLCJFdmVudEluZm8iLCJldmVudHMiLCJmdW5jIiwicGFyYW1zIiwicHVzaCIsInNhbXBsZUFuaW1hdGlvbkN1cnZlIiwiY3VydmUiLCJzYW1wbGVyIiwic2FtcGxlIiwidmFsdWVCZXR3ZWVuIiwiZWFzaW5nIiwic3RhcnQiLCJlbmQiLCJlYWNoTGVuZ3RoIiwiZmxvb3JJbmRleCIsIm1ha2VWYWx1ZVR5cGVMZXJwRngiLCJjb25zdHJ1Y3RvciIsInRlbXBWYWx1ZSIsImxlcnAiLCJjYWxsTGVycGFibGUiLCJ0IiwiZHQiLCJtYWtlUXVhdFNsZXJwRngiLCJRdWF0Iiwic2xlcnAiLCJWYWx1ZVR5cGUiLCJOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BMEVhQSxZO0FBS1QsMEJBQWFDLE1BQWIsRUFBK0I7QUFBQTs7QUFBQSxXQUp4QkEsTUFJd0I7QUFBQSxXQUZ2QkMsVUFFdUI7QUFDM0IsV0FBS0QsTUFBTCxHQUFjQSxNQUFkLENBRDJCLENBRTNCOztBQUNBLFVBQUlFLFlBQUo7QUFDQSxVQUFJQyxZQUFKO0FBQ0EsVUFBSUMsV0FBVyxHQUFHLElBQWxCO0FBQ0EsVUFBTUMsT0FBTyxHQUFHLElBQWhCOztBQUNBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQVIsRUFBV0MsQ0FBQyxHQUFHUCxNQUFNLENBQUNRLE1BQTNCLEVBQW1DRixDQUFDLEdBQUdDLENBQXZDLEVBQTBDRCxDQUFDLEVBQTNDLEVBQStDO0FBQzNDSixRQUFBQSxZQUFZLEdBQUdGLE1BQU0sQ0FBQ00sQ0FBRCxDQUFOLEdBQVlOLE1BQU0sQ0FBQ00sQ0FBQyxHQUFHLENBQUwsQ0FBakM7O0FBQ0EsWUFBSUEsQ0FBQyxLQUFLLENBQVYsRUFBYTtBQUNUSCxVQUFBQSxZQUFZLEdBQUdELFlBQWY7QUFDSCxTQUZELE1BR0ssSUFBSU8sSUFBSSxDQUFDQyxHQUFMLENBQVNSLFlBQVksR0FBR0MsWUFBeEIsSUFBd0NFLE9BQTVDLEVBQXFEO0FBQ3RERCxVQUFBQSxXQUFXLEdBQUcsS0FBZDtBQUNBO0FBQ0g7QUFDSjs7QUFDRCxXQUFLSCxVQUFMLEdBQWtCRyxXQUFXLEdBQUdPLGNBQUgsR0FBb0JDLGlDQUFqRDtBQUNIOzs7OzZCQUVjQyxLLEVBQWU7QUFDMUIsZUFBTyxLQUFLWixVQUFMLENBQWdCLEtBQUtELE1BQXJCLEVBQTZCYSxLQUE3QixDQUFQO0FBQ0g7Ozs7Ozs7QUFFTEMsMEJBQVNmLFlBQVQs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QU9SLFdBQVA7QUFDSCxTQUZNLE1BRUEsSUFBSSx1QkFBVzlCLEtBQVgsQ0FBSixFQUF1QjtBQUMxQixpQkFBTytCLFlBQVA7QUFDSDtBQUNKOztBQUNELGFBQU90RCxTQUFQO0FBQ0gsS0FsQkQ7QUFtQkgsR0F4Q29CLEVBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBhbmltYXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBiaW5hcnlTZWFyY2hFcHNpbG9uIGFzIGJpbmFyeVNlYXJjaCB9IGZyb20gJy4uL2RhdGEvdXRpbHMvYmluYXJ5LXNlYXJjaCc7XHJcbmltcG9ydCB7IGxlcnAsIFF1YXQgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgVmFsdWVUeXBlIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBiZXppZXJCeVRpbWUsIEJlemllckNvbnRyb2xQb2ludHMgfSBmcm9tICcuL2Jlemllcic7XHJcbmltcG9ydCAqIGFzIGVhc2luZyBmcm9tICcuL2Vhc2luZyc7XHJcbmltcG9ydCB7IElMZXJwYWJsZSwgaXNMZXJwYWJsZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiDooajnpLrmm7Lnur/lgLzvvIzmm7Lnur/lgLzlj6/ku6XmmK/ku7vmhI/nsbvlnovvvIzkvYblv4XpobvnrKblkIjmj5LlgLzmlrnlvI/nmoTopoHmsYLjgIJcclxuICovXHJcbmV4cG9ydCB0eXBlIEN1cnZlVmFsdWUgPSBhbnk7XHJcblxyXG4vKipcclxuICog6KGo56S65puy57q/55qE55uu5qCH5a+56LGh44CCXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBDdXJ2ZVRhcmdldCA9IFJlY29yZDxzdHJpbmcsIGFueT47XHJcblxyXG4vKipcclxuICog5YaF572u5bin5pe26Ze05riQ5Y+Y5pa55byP5ZCN56ew44CCXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBFYXNpbmdNZXRob2ROYW1lID0ga2V5b2YgKHR5cGVvZiBlYXNpbmcpO1xyXG5cclxuLyoqXHJcbiAqIOW4p+aXtumXtOa4kOWPmOaWueW8j+OAguWPr+iDveS4uuWGhee9ruW4p+aXtumXtOa4kOWPmOaWueW8j+eahOWQjeensOaIlui0neWhnuWwlOaOp+WItueCueOAglxyXG4gKi9cclxuZXhwb3J0IHR5cGUgRWFzaW5nTWV0aG9kID0gRWFzaW5nTWV0aG9kTmFtZSB8IEJlemllckNvbnRyb2xQb2ludHM7XHJcblxyXG50eXBlIExlcnBGdW5jdGlvbjxUID0gYW55PiA9IChmcm9tOiBULCB0bzogVCwgdDogbnVtYmVyLCBkdDogbnVtYmVyKSA9PiBUO1xyXG5cclxudHlwZSBDb21wcmVzc2VkRWFzaW5nTWV0aG9kcyA9IFJlY29yZDxudW1iZXIsIEVhc2luZ01ldGhvZD47XHJcblxyXG4vKipcclxuICog5puy57q/5pWw5o2u44CCXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9wZXJ0eUN1cnZlRGF0YSB7XHJcbiAgICAvKipcclxuICAgICAqIOabsue6v+S9v+eUqOeahOaXtumXtOi9tOOAglxyXG4gICAgICogQHNlZSB7QW5pbWF0aW9uQ2xpcC5rZXlzfVxyXG4gICAgICovXHJcbiAgICBrZXlzOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7Lnur/lgLzjgILmm7Lnur/lgLznmoTmlbDph4/lupTlkowgYGtleXNgIOaJgOW8leeUqOaXtumXtOi9tOeahOW4p+aVsOebuOWQjOOAglxyXG4gICAgICovXHJcbiAgICB2YWx1ZXM6IEN1cnZlVmFsdWVbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOabsue6v+S7u+aEj+S4pOW4p+aXtumXtOeahOa4kOWPmOaWueW8j+OAguS7heW9kyBgZWFzaW5nTWV0aG9kcyA9PT0gdW5kZWZpbmVkYCDml7bmnKzlrZfmrrXmiY3nlJ/mlYjjgIJcclxuICAgICAqL1xyXG4gICAgZWFzaW5nTWV0aG9kPzogRWFzaW5nTWV0aG9kO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5o+P6L+w5LqG5q+P5LiA5bin5pe26Ze05Yiw5LiL5LiA5bin5pe26Ze05LmL6Ze055qE5riQ5Y+Y5pa55byP44CCXHJcbiAgICAgKi9cclxuICAgIGVhc2luZ01ldGhvZHM/OiBFYXNpbmdNZXRob2RbXSB8IENvbXByZXNzZWRFYXNpbmdNZXRob2RzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm6L+b6KGM5o+S5YC844CCXHJcbiAgICAgKiBAZGVmYXVsdCB0cnVlXHJcbiAgICAgKi9cclxuICAgIGludGVycG9sYXRlPzogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZvciBpbnRlcm5hbCB1c2FnZSBvbmx5LlxyXG4gICAgICovXHJcbiAgICBfYXJyYXlMZW5ndGg/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSYXRpb1NhbXBsZXIge1xyXG4gICAgcHVibGljIHJhdGlvczogbnVtYmVyW107XHJcblxyXG4gICAgcHJpdmF0ZSBfZmluZFJhdGlvOiAocmF0aW9zOiBudW1iZXJbXSwgcmF0aW86IG51bWJlcikgPT4gbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyYXRpb3M6IG51bWJlcltdKSB7XHJcbiAgICAgICAgdGhpcy5yYXRpb3MgPSByYXRpb3M7XHJcbiAgICAgICAgLy8gSWYgZXZlcnkgcGllY2Ugb2YgcmF0aW9zIGFyZSB0aGUgc2FtZSwgd2UgY2FuIHVzZSB0aGUgcXVpY2sgZnVuY3Rpb24gdG8gZmluZCBmcmFtZSBpbmRleC5cclxuICAgICAgICBsZXQgY3VyclJhdGlvRGlmO1xyXG4gICAgICAgIGxldCBsYXN0UmF0aW9EaWY7XHJcbiAgICAgICAgbGV0IGNhbk9wdGltaXplID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBFUFNJTE9OID0gMWUtNjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMSwgbCA9IHJhdGlvcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY3VyclJhdGlvRGlmID0gcmF0aW9zW2ldIC0gcmF0aW9zW2kgLSAxXTtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RSYXRpb0RpZiA9IGN1cnJSYXRpb0RpZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhjdXJyUmF0aW9EaWYgLSBsYXN0UmF0aW9EaWYpID4gRVBTSUxPTikge1xyXG4gICAgICAgICAgICAgICAgY2FuT3B0aW1pemUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZpbmRSYXRpbyA9IGNhbk9wdGltaXplID8gcXVpY2tGaW5kSW5kZXggOiBiaW5hcnlTZWFyY2g7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNhbXBsZSAocmF0aW86IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maW5kUmF0aW8odGhpcy5yYXRpb3MsIHJhdGlvKTtcclxuICAgIH1cclxufVxyXG5sZWdhY3lDQy5SYXRpb1NhbXBsZXIgPSBSYXRpb1NhbXBsZXI7XHJcblxyXG4vKipcclxuICog5Yqo55S75puy57q/44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQW5pbUN1cnZlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgTGluZWFyID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEJlemllciAoY29udHJvbFBvaW50czogbnVtYmVyW10pIHtcclxuICAgICAgICByZXR1cm4gY29udHJvbFBvaW50cyBhcyBCZXppZXJDb250cm9sUG9pbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0eXBlcz86IEFycmF5PChFYXNpbmdNZXRob2QgfCBudWxsKT4gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgcHVibGljIHR5cGU/OiBFYXNpbmdNZXRob2QgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB2YWx1ZXMgb2YgdGhlIGtleWZyYW1lcy4gKHkpXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3ZhbHVlczogQ3VydmVWYWx1ZVtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMZXJwIGZ1bmN0aW9uIHVzZWQuIElmIHVuZGVmaW5lZCwgbm8gbGVycCBpcyBwZXJmb3JtZWQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2xlcnA6IHVuZGVmaW5lZCB8ICgoZnJvbTogYW55LCB0bzogYW55LCB0OiBudW1iZXIsIGR0OiBudW1iZXIpID0+IGFueSkgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgcHJpdmF0ZSBfZHVyYXRpb246IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIF9hcnJheT86IGFueVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChwcm9wZXJ0eUN1cnZlRGF0YTogT21pdDxJUHJvcGVydHlDdXJ2ZURhdGEsICdrZXlzJz4sIGR1cmF0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cclxuICAgICAgICAvLyBJbnN0YWxsIHZhbHVlcy5cclxuICAgICAgICB0aGlzLl92YWx1ZXMgPSBwcm9wZXJ0eUN1cnZlRGF0YS52YWx1ZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldEN1cnZlVHlwZSA9IChlYXNpbmdNZXRob2Q6IEVhc2luZ01ldGhvZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVhc2luZ01ldGhvZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlYXNpbmdNZXRob2Q7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlYXNpbmdNZXRob2QpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWFzaW5nTWV0aG9kWzBdID09PSBlYXNpbmdNZXRob2RbMV0gJiZcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmdNZXRob2RbMl0gPT09IGVhc2luZ01ldGhvZFszXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBBbmltQ3VydmUuTGluZWFyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQW5pbUN1cnZlLkJlemllcihlYXNpbmdNZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFuaW1DdXJ2ZS5MaW5lYXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eUN1cnZlRGF0YS5lYXNpbmdNZXRob2QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBnZXRDdXJ2ZVR5cGUocHJvcGVydHlDdXJ2ZURhdGEuZWFzaW5nTWV0aG9kKTtcclxuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocHJvcGVydHlDdXJ2ZURhdGEuZWFzaW5nTWV0aG9kcykpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlcyA9IHByb3BlcnR5Q3VydmVEYXRhLmVhc2luZ01ldGhvZHMubWFwKGdldEN1cnZlVHlwZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eUN1cnZlRGF0YS5lYXNpbmdNZXRob2RzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50eXBlcyA9IG5ldyBBcnJheSh0aGlzLl92YWx1ZXMubGVuZ3RoKS5maWxsKG51bGwpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGluZGV4IG9mIE9iamVjdC5rZXlzKHByb3BlcnR5Q3VydmVEYXRhLmVhc2luZ01ldGhvZHMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVzW2luZGV4XSA9IGdldEN1cnZlVHlwZShwcm9wZXJ0eUN1cnZlRGF0YS5lYXNpbmdNZXRob2RzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RWYWx1ZSA9IHByb3BlcnR5Q3VydmVEYXRhLnZhbHVlc1swXTtcclxuXHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGUgPSBwcm9wZXJ0eUN1cnZlRGF0YS5pbnRlcnBvbGF0ZSA9PT0gdW5kZWZpbmVkID9cclxuICAgICAgICAgICAgdHJ1ZSA6IHByb3BlcnR5Q3VydmVEYXRhLmludGVycG9sYXRlO1xyXG5cclxuICAgICAgICAvLyBTZXR1cCB0aGUgbGVycCBmdW5jdGlvbi5cclxuICAgICAgICBpZiAoaW50ZXJwb2xhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGVycCA9IHNlbGVjdExlcnBGeChmaXJzdFZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcm9wZXJ0eUN1cnZlRGF0YS5fYXJyYXlMZW5ndGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hcnJheSA9IG5ldyBBcnJheShwcm9wZXJ0eUN1cnZlRGF0YS5fYXJyYXlMZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzTGVycCAoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fbGVycDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdmFsdWVBdCAoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fdmFsdWVzW2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmdldE5vTGVycCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmdldE5vTGVycCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9hcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJyYXlbaV0gPSB0aGlzLl92YWx1ZXNbdGhpcy5fYXJyYXkubGVuZ3RoICogaW5kZXggKyBpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB2YWx1ZUJldHdlZW4gKHJhdGlvOiBudW1iZXIsIGZyb206IG51bWJlciwgZnJvbVJhdGlvOiBudW1iZXIsIHRvOiBudW1iZXIsIHRvUmF0aW86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9sZXJwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnR5cGVzID8gdGhpcy50eXBlc1tmcm9tXSA6IHRoaXMudHlwZTtcclxuICAgICAgICAgICAgY29uc3QgZFJhdGlvID0gKHRvUmF0aW8gLSBmcm9tUmF0aW8pO1xyXG4gICAgICAgICAgICBsZXQgcmF0aW9CZXR3ZWVuRnJhbWVzID0gKHJhdGlvIC0gZnJvbVJhdGlvKSAvIGRSYXRpbztcclxuICAgICAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJhdGlvQmV0d2VlbkZyYW1lcyA9IGNvbXB1dGVSYXRpb0J5VHlwZShyYXRpb0JldHdlZW5GcmFtZXMsIHR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYXJyYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbVZhbCA9IHRoaXMuX3ZhbHVlc1tmcm9tXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvVmFsID0gdGhpcy5fdmFsdWVzW3RvXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fbGVycChmcm9tVmFsLCB0b1ZhbCwgcmF0aW9CZXR3ZWVuRnJhbWVzLCBkUmF0aW8gKiB0aGlzLl9kdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2FycmF5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbVZhbCA9IHRoaXMuX3ZhbHVlc1t0aGlzLl9hcnJheS5sZW5ndGggKiAgZnJvbSArIGldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvVmFsID0gdGhpcy5fdmFsdWVzW3RoaXMuX2FycmF5Lmxlbmd0aCAqIHRvICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXJyYXlbaV0gPSB0aGlzLl9sZXJwKGZyb21WYWwsIHRvVmFsLCByYXRpb0JldHdlZW5GcmFtZXMsIGRSYXRpbyAqIHRoaXMuX2R1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcnJheTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUF0KGZyb20pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9hcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FycmF5W2ldID0gdGhpcy5fdmFsdWVzW3RoaXMuX2FycmF5Lmxlbmd0aCAqICBmcm9tICsgaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJyYXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVtcHR5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzLmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgaWYgdGhpcyBjdXJ2ZSBvbmx5IHlpZWxkcyBjb25zdGFudHMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdGFudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlcy5sZW5ndGggPT09IDE7XHJcbiAgICB9XHJcbn1cclxubGVnYWN5Q0MuQW5pbUN1cnZlID0gQW5pbUN1cnZlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50SW5mbyB7XHJcbiAgICBwdWJsaWMgZXZlbnRzOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGZ1bmMgZXZlbnQgZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSBwYXJhbXMgZXZlbnQgcGFyYW1zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGQgKGZ1bmM6IHN0cmluZywgcGFyYW1zOiBhbnlbXSkge1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICBmdW5jOiBmdW5jIHx8ICcnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOmHh+agt+WKqOeUu+absue6v+OAglxyXG4gKiBAcGFyYW0gY3VydmUg5Yqo55S75puy57q/44CCXHJcbiAqIEBwYXJhbSBzYW1wbGVyIOmHh+agt+WZqOOAglxyXG4gKiBAcGFyYW0gcmF0aW8g6YeH5qC35q+U546H44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2FtcGxlQW5pbWF0aW9uQ3VydmUgKGN1cnZlOiBBbmltQ3VydmUsIHNhbXBsZXI6IFJhdGlvU2FtcGxlciwgcmF0aW86IG51bWJlcikge1xyXG4gICAgbGV0IGluZGV4ID0gc2FtcGxlci5zYW1wbGUocmF0aW8pO1xyXG4gICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgIGluZGV4ID0gfmluZGV4O1xyXG4gICAgICAgIGlmIChpbmRleCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID49IHNhbXBsZXIucmF0aW9zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpbmRleCA9IHNhbXBsZXIucmF0aW9zLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnZlLnZhbHVlQmV0d2VlbihcclxuICAgICAgICAgICAgICAgIHJhdGlvLCBpbmRleCAtIDEsIHNhbXBsZXIucmF0aW9zW2luZGV4IC0gMV0sIGluZGV4LCBzYW1wbGVyLnJhdGlvc1tpbmRleF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjdXJ2ZS52YWx1ZUF0KGluZGV4KTtcclxufVxyXG5sZWdhY3lDQy5zYW1wbGVBbmltYXRpb25DdXJ2ZSA9IHNhbXBsZUFuaW1hdGlvbkN1cnZlO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBuZXcgcmF0aW8gYnkgY3VydmUgdHlwZS5cclxuICogQHBhcmFtIHJhdGlvIC0gVGhlIG9yaWdpbiByYXRpb1xyXG4gKiBAcGFyYW0gdHlwZSAtIElmIGl0J3MgQXJyYXksIHRoZW4gcmF0aW8gd2lsbCBiZSBjb21wdXRlZCB3aXRoIGJlemllckJ5VGltZS5cclxuICogSWYgaXQncyBzdHJpbmcsIHRoZW4gcmF0aW8gd2lsbCBiZSBjb21wdXRlZCB3aXRoIGNjLmVhc2luZyBmdW5jdGlvblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVSYXRpb0J5VHlwZSAocmF0aW86IG51bWJlciwgdHlwZTogRWFzaW5nTWV0aG9kKSB7XHJcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc3QgZnVuYyA9IGVhc2luZ1t0eXBlXTtcclxuICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICByYXRpbyA9IGZ1bmMocmF0aW8pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzkwNiwgdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XHJcbiAgICAgICAgLy8gYmV6aWVyIGN1cnZlXHJcbiAgICAgICAgcmF0aW8gPSBiZXppZXJCeVRpbWUodHlwZSwgcmF0aW8pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByYXRpbztcclxufVxyXG5cclxuLyoqXHJcbiAqIFVzZSB0aGlzIGZ1bmN0aW9uIGlmIGludGVydmFscyBiZXR3ZWVuIGZyYW1lcyBhcmUgc2FtZS5cclxuICovXHJcbmZ1bmN0aW9uIHF1aWNrRmluZEluZGV4IChyYXRpb3M6IG51bWJlcltdLCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBsZW5ndGggPSByYXRpb3MubGVuZ3RoIC0gMTtcclxuXHJcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7IHJldHVybiAwOyB9XHJcblxyXG4gICAgY29uc3Qgc3RhcnQgPSByYXRpb3NbMF07XHJcbiAgICBpZiAocmF0aW8gPCBzdGFydCkgeyByZXR1cm4gMDsgfVxyXG5cclxuICAgIGNvbnN0IGVuZCA9IHJhdGlvc1tsZW5ndGhdO1xyXG4gICAgaWYgKHJhdGlvID4gZW5kKSB7IHJldHVybiBsZW5ndGg7IH1cclxuXHJcbiAgICByYXRpbyA9IChyYXRpbyAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCk7XHJcblxyXG4gICAgY29uc3QgZWFjaExlbmd0aCA9IDEgLyBsZW5ndGg7XHJcbiAgICBjb25zdCBpbmRleCA9IHJhdGlvIC8gZWFjaExlbmd0aDtcclxuICAgIGNvbnN0IGZsb29ySW5kZXggPSBpbmRleCB8IDA7XHJcbiAgICBjb25zdCBFUFNJTE9OID0gMWUtNjtcclxuXHJcbiAgICBpZiAoKGluZGV4IC0gZmxvb3JJbmRleCkgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgcmV0dXJuIGZsb29ySW5kZXg7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgoZmxvb3JJbmRleCArIDEgLSBpbmRleCkgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgcmV0dXJuIGZsb29ySW5kZXggKyAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB+KGZsb29ySW5kZXggKyAxKTtcclxufVxyXG5cclxuY29uc3Qgc2VsZWN0TGVycEZ4ID0gKCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIG1ha2VWYWx1ZVR5cGVMZXJwRng8VCBleHRlbmRzIFZhbHVlVHlwZT4gKGNvbnN0cnVjdG9yOiBDb25zdHJ1Y3RvcjxUPikge1xyXG4gICAgICAgIGNvbnN0IHRlbXBWYWx1ZSA9IG5ldyBjb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgIHJldHVybiAoZnJvbTogVCwgdG86IFQsIHJhdGlvOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvci5sZXJwKHRlbXBWYWx1ZSwgZnJvbSwgdG8sIHJhdGlvKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBWYWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNhbGxMZXJwYWJsZSAoZnJvbTogSUxlcnBhYmxlLCB0bzogSUxlcnBhYmxlLCB0OiBudW1iZXIsIGR0OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBmcm9tLmxlcnAodG8sIHQsIGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlUXVhdFNsZXJwRnggKCkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBWYWx1ZSA9IG5ldyBRdWF0KCk7XHJcbiAgICAgICAgcmV0dXJuIChmcm9tOiBRdWF0LCB0bzogUXVhdCwgdDogbnVtYmVyLCBkdDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBRdWF0LnNsZXJwKHRlbXBWYWx1ZSwgZnJvbSwgdG8sIHQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICh2YWx1ZTogYW55KTogTGVycEZ1bmN0aW9uPGFueT4gfCB1bmRlZmluZWQgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbGVycDtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUXVhdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VRdWF0U2xlcnBGeCgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgVmFsdWVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZVZhbHVlVHlwZUxlcnBGeCh2YWx1ZS5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgVmFsdWVUeXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVycDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xlcnBhYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxMZXJwYWJsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxufSkoKTtcclxuIl19