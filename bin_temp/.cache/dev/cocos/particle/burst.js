(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/data/decorators/index.js", "../core/math/index.js", "./animator/curve-range.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/data/decorators/index.js"), require("../core/math/index.js"), require("./animator/curve-range.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.curveRange);
    global.burst = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _curveRange) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var Burst = (_dec = (0, _index.ccclass)('cc.Burst'), _dec2 = (0, _index.type)(_curveRange.default), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    _createClass(Burst, [{
      key: "time",

      /**
       * @zh 粒子系统开始运行到触发此次 Brust 的时间。
       */
      get: function get() {
        return this._time;
      },
      set: function set(val) {
        this._time = val;
        this._curTime = val;
      }
    }, {
      key: "repeatCount",

      /**
       * @zh Burst 的触发次数。
       */
      get: function get() {
        return this._repeatCount;
      },
      set: function set(val) {
        this._repeatCount = val;
        this._remainingCount = val;
      }
      /**
       * @zh 每次触发的间隔时间。
       */

    }]);

    function Burst() {
      _classCallCheck(this, Burst);

      _initializerDefineProperty(this, "_time", _descriptor, this);

      _initializerDefineProperty(this, "_repeatCount", _descriptor2, this);

      _initializerDefineProperty(this, "repeatInterval", _descriptor3, this);

      _initializerDefineProperty(this, "count", _descriptor4, this);

      this._remainingCount = void 0;
      this._curTime = void 0;
      this._remainingCount = 0;
      this._curTime = 0.0;
    }

    _createClass(Burst, [{
      key: "update",
      value: function update(psys, dt) {
        if (this._remainingCount === 0) {
          this._remainingCount = this._repeatCount;
          this._curTime = this._time;
        }

        if (this._remainingCount > 0) {
          var preFrameTime = (0, _index2.repeat)(psys._time - psys.startDelay.evaluate(0, 1), psys.duration) - dt;
          preFrameTime = preFrameTime > 0.0 ? preFrameTime : 0.0;
          var curFrameTime = (0, _index2.repeat)(psys.time - psys.startDelay.evaluate(0, 1), psys.duration);

          if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
            psys.emit(this.count.evaluate(this._curTime / psys.duration, 1), dt - (curFrameTime - this._curTime));
            this._curTime += this.repeatInterval;
            --this._remainingCount;
          }
        }
      }
    }, {
      key: "getMaxCount",
      value: function getMaxCount(psys) {
        return this.count.getMax() * Math.min(Math.ceil(psys.duration / this.repeatInterval), this.repeatCount);
      }
    }]);

    return Burst;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_time", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "time", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "time"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_repeatCount", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "repeatCount", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "repeatCount"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "repeatInterval", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "count", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.Burst', Burst, {
  //     _time: 0,
  //     minCount: 30,
  //     maxCount: 30,
  //     _repeatCount: 1,
  //     repeatInterval: 1,
  //     count: new CurveRange
  // });

  _exports.default = Burst;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2J1cnN0LnRzIl0sIm5hbWVzIjpbIkJ1cnN0IiwiQ3VydmVSYW5nZSIsIl90aW1lIiwidmFsIiwiX2N1clRpbWUiLCJfcmVwZWF0Q291bnQiLCJfcmVtYWluaW5nQ291bnQiLCJwc3lzIiwiZHQiLCJwcmVGcmFtZVRpbWUiLCJzdGFydERlbGF5IiwiZXZhbHVhdGUiLCJkdXJhdGlvbiIsImN1ckZyYW1lVGltZSIsInRpbWUiLCJlbWl0IiwiY291bnQiLCJyZXBlYXRJbnRlcnZhbCIsImdldE1heCIsIk1hdGgiLCJtaW4iLCJjZWlsIiwicmVwZWF0Q291bnQiLCJzZXJpYWxpemFibGUiLCJlZGl0YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNxQkEsSyxXQURwQixvQkFBUSxVQUFSLEMsVUE2Q0ksaUJBQUtDLG1CQUFMLEM7Ozs7QUF2Q0Q7OzswQkFJWTtBQUNSLGVBQU8sS0FBS0MsS0FBWjtBQUNILE87d0JBRVNDLEcsRUFBSztBQUNYLGFBQUtELEtBQUwsR0FBYUMsR0FBYjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0JELEdBQWhCO0FBQ0g7Ozs7QUFLRDs7OzBCQUltQjtBQUNmLGVBQU8sS0FBS0UsWUFBWjtBQUNILE87d0JBRWdCRixHLEVBQUs7QUFDbEIsYUFBS0UsWUFBTCxHQUFvQkYsR0FBcEI7QUFDQSxhQUFLRyxlQUFMLEdBQXVCSCxHQUF2QjtBQUNIO0FBRUQ7Ozs7OztBQWdCQSxxQkFBZTtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLFdBSFBHLGVBR087QUFBQSxXQUZQRixRQUVPO0FBQ1gsV0FBS0UsZUFBTCxHQUF1QixDQUF2QjtBQUNBLFdBQUtGLFFBQUwsR0FBZ0IsR0FBaEI7QUFDSDs7Ozs2QkFFY0csSSxFQUFNQyxFLEVBQVk7QUFDN0IsWUFBSSxLQUFLRixlQUFMLEtBQXlCLENBQTdCLEVBQWdDO0FBQzVCLGVBQUtBLGVBQUwsR0FBdUIsS0FBS0QsWUFBNUI7QUFDQSxlQUFLRCxRQUFMLEdBQWdCLEtBQUtGLEtBQXJCO0FBQ0g7O0FBQ0QsWUFBSSxLQUFLSSxlQUFMLEdBQXVCLENBQTNCLEVBQThCO0FBQzFCLGNBQUlHLFlBQVksR0FBRyxvQkFBT0YsSUFBSSxDQUFDTCxLQUFMLEdBQWFLLElBQUksQ0FBQ0csVUFBTCxDQUFnQkMsUUFBaEIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBcEIsRUFBb0RKLElBQUksQ0FBQ0ssUUFBekQsSUFBcUVKLEVBQXhGO0FBQ0FDLFVBQUFBLFlBQVksR0FBSUEsWUFBWSxHQUFHLEdBQWhCLEdBQXVCQSxZQUF2QixHQUFzQyxHQUFyRDtBQUNBLGNBQU1JLFlBQVksR0FBRyxvQkFBT04sSUFBSSxDQUFDTyxJQUFMLEdBQVlQLElBQUksQ0FBQ0csVUFBTCxDQUFnQkMsUUFBaEIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBbkIsRUFBbURKLElBQUksQ0FBQ0ssUUFBeEQsQ0FBckI7O0FBQ0EsY0FBSSxLQUFLUixRQUFMLElBQWlCSyxZQUFqQixJQUFpQyxLQUFLTCxRQUFMLEdBQWdCUyxZQUFyRCxFQUFtRTtBQUMvRE4sWUFBQUEsSUFBSSxDQUFDUSxJQUFMLENBQVUsS0FBS0MsS0FBTCxDQUFXTCxRQUFYLENBQW9CLEtBQUtQLFFBQUwsR0FBZ0JHLElBQUksQ0FBQ0ssUUFBekMsRUFBbUQsQ0FBbkQsQ0FBVixFQUFpRUosRUFBRSxJQUFJSyxZQUFZLEdBQUcsS0FBS1QsUUFBeEIsQ0FBbkU7QUFDQSxpQkFBS0EsUUFBTCxJQUFpQixLQUFLYSxjQUF0QjtBQUNBLGNBQUUsS0FBS1gsZUFBUDtBQUNIO0FBQ0o7QUFDSjs7O2tDQUVtQkMsSSxFQUFNO0FBQ3RCLGVBQU8sS0FBS1MsS0FBTCxDQUFXRSxNQUFYLEtBQXNCQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0QsSUFBSSxDQUFDRSxJQUFMLENBQVVkLElBQUksQ0FBQ0ssUUFBTCxHQUFnQixLQUFLSyxjQUEvQixDQUFULEVBQXlELEtBQUtLLFdBQTlELENBQTdCO0FBQ0g7Ozs7cUZBeEVBQyxtQjs7Ozs7YUFDdUIsQzs7NERBS3ZCQyxlLGdLQVVBRCxtQjs7Ozs7YUFDOEIsQzs7bUVBSzlCQyxlLHlLQWFBRCxtQixFQUNBQyxlOzs7OzthQUMrQixDOzs7Ozs7O2FBTUwsSUFBSXZCLG1CQUFKLEU7OzZCQWdDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgdHlwZSwgc2VyaWFsaXphYmxlLCBlZGl0YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IHJlcGVhdCB9IGZyb20gJy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCBDdXJ2ZVJhbmdlIGZyb20gJy4vYW5pbWF0b3IvY3VydmUtcmFuZ2UnO1xyXG5cclxuQGNjY2xhc3MoJ2NjLkJ1cnN0JylcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVyc3Qge1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3RpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q57O757uf5byA5aeL6L+Q6KGM5Yiw6Kem5Y+R5q2k5qyhIEJydXN0IOeahOaXtumXtOOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCB0aW1lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdGltZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZSA9IHZhbDtcclxuICAgICAgICB0aGlzLl9jdXJUaW1lID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3JlcGVhdENvdW50OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIEJ1cnN0IOeahOinpuWPkeasoeaVsOOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCByZXBlYXRDb3VudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcGVhdENvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByZXBlYXRDb3VudCAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fcmVwZWF0Q291bnQgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nQ291bnQgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5q+P5qyh6Kem5Y+R55qE6Ze06ZqU5pe26Ze044CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIHJlcGVhdEludGVydmFsOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWPkeWwhOeahOeykuWtkOeahOaVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgcHVibGljIGNvdW50OiBDdXJ2ZVJhbmdlID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICBwcml2YXRlIF9yZW1haW5pbmdDb3VudDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfY3VyVGltZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9yZW1haW5pbmdDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5fY3VyVGltZSA9IDAuMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlIChwc3lzLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZ0NvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbWFpbmluZ0NvdW50ID0gdGhpcy5fcmVwZWF0Q291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1clRpbWUgPSB0aGlzLl90aW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBwcmVGcmFtZVRpbWUgPSByZXBlYXQocHN5cy5fdGltZSAtIHBzeXMuc3RhcnREZWxheS5ldmFsdWF0ZSgwLCAxKSwgcHN5cy5kdXJhdGlvbikgLSBkdDtcclxuICAgICAgICAgICAgcHJlRnJhbWVUaW1lID0gKHByZUZyYW1lVGltZSA+IDAuMCkgPyBwcmVGcmFtZVRpbWUgOiAwLjA7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1ckZyYW1lVGltZSA9IHJlcGVhdChwc3lzLnRpbWUgLSBwc3lzLnN0YXJ0RGVsYXkuZXZhbHVhdGUoMCwgMSksIHBzeXMuZHVyYXRpb24pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VyVGltZSA+PSBwcmVGcmFtZVRpbWUgJiYgdGhpcy5fY3VyVGltZSA8IGN1ckZyYW1lVGltZSkge1xyXG4gICAgICAgICAgICAgICAgcHN5cy5lbWl0KHRoaXMuY291bnQuZXZhbHVhdGUodGhpcy5fY3VyVGltZSAvIHBzeXMuZHVyYXRpb24sIDEpLCBkdCAtIChjdXJGcmFtZVRpbWUgLSB0aGlzLl9jdXJUaW1lKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJUaW1lICs9IHRoaXMucmVwZWF0SW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgICAtLXRoaXMuX3JlbWFpbmluZ0NvdW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNYXhDb3VudCAocHN5cykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvdW50LmdldE1heCgpICogTWF0aC5taW4oTWF0aC5jZWlsKHBzeXMuZHVyYXRpb24gLyB0aGlzLnJlcGVhdEludGVydmFsKSwgdGhpcy5yZXBlYXRDb3VudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuQnVyc3QnLCBCdXJzdCwge1xyXG4vLyAgICAgX3RpbWU6IDAsXHJcbi8vICAgICBtaW5Db3VudDogMzAsXHJcbi8vICAgICBtYXhDb3VudDogMzAsXHJcbi8vICAgICBfcmVwZWF0Q291bnQ6IDEsXHJcbi8vICAgICByZXBlYXRJbnRlcnZhbDogMSxcclxuLy8gICAgIGNvdW50OiBuZXcgQ3VydmVSYW5nZVxyXG4vLyB9KTtcclxuIl19