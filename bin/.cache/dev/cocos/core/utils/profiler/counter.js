(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.counter = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Counter = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Counter = /*#__PURE__*/function () {
    _createClass(Counter, [{
      key: "value",
      get: function get() {
        return this._value;
      },
      set: function set(val) {
        this._value = val;
      }
    }]);

    function Counter(id, opts, now) {
      _classCallCheck(this, Counter);

      this._id = void 0;
      this._opts = void 0;
      this._accumStart = void 0;
      this._total = 0;
      this._value = 0;
      this._averageValue = 0;
      this._accumValue = 0;
      this._accumSamples = 0;
      this._id = id;
      this._opts = opts;
      this._accumStart = now;
    }

    _createClass(Counter, [{
      key: "sample",
      value: function sample(now) {
        this._average(this._value, now);
      }
    }, {
      key: "human",
      value: function human() {
        var _this$_opts = this._opts,
            average = _this$_opts.average,
            isInteger = _this$_opts.isInteger;
        var v = average ? this._averageValue : this._value;
        return isInteger ? Math.round(v) : Math.round(v * 100) / 100;
      }
    }, {
      key: "alarm",
      value: function alarm() {
        return this._opts.below && this._value < this._opts.below || this._opts.over && this._value > this._opts.over;
      }
    }, {
      key: "_average",
      value: function _average(v) {
        var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (this._opts.average) {
          this._accumValue += v;
          ++this._accumSamples;
          var t = now;

          if (t - this._accumStart >= this._opts.average) {
            this._averageValue = this._accumValue / this._accumSamples;
            this._accumValue = 0;
            this._accumStart = t;
            this._accumSamples = 0;
          }
        }
      }
    }]);

    return Counter;
  }();

  _exports.Counter = Counter;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvcHJvZmlsZXIvY291bnRlci50cyJdLCJuYW1lcyI6WyJDb3VudGVyIiwiX3ZhbHVlIiwidmFsIiwiaWQiLCJvcHRzIiwibm93IiwiX2lkIiwiX29wdHMiLCJfYWNjdW1TdGFydCIsIl90b3RhbCIsIl9hdmVyYWdlVmFsdWUiLCJfYWNjdW1WYWx1ZSIsIl9hY2N1bVNhbXBsZXMiLCJfYXZlcmFnZSIsImF2ZXJhZ2UiLCJpc0ludGVnZXIiLCJ2IiwiTWF0aCIsInJvdW5kIiwiYmVsb3ciLCJvdmVyIiwidCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFhYUEsTzs7OzBCQUNJO0FBQ1QsZUFBTyxLQUFLQyxNQUFaO0FBQ0gsTzt3QkFFVUMsRyxFQUFLO0FBQ1osYUFBS0QsTUFBTCxHQUFjQyxHQUFkO0FBQ0g7OztBQVdELHFCQUFhQyxFQUFiLEVBQXlCQyxJQUF6QixFQUErQ0MsR0FBL0MsRUFBNEQ7QUFBQTs7QUFBQSxXQVRsREMsR0FTa0Q7QUFBQSxXQVJsREMsS0FRa0Q7QUFBQSxXQVBsREMsV0FPa0Q7QUFBQSxXQU5sREMsTUFNa0QsR0FOekMsQ0FNeUM7QUFBQSxXQUxsRFIsTUFLa0QsR0FMekMsQ0FLeUM7QUFBQSxXQUpsRFMsYUFJa0QsR0FKbEMsQ0FJa0M7QUFBQSxXQUhsREMsV0FHa0QsR0FIcEMsQ0FHb0M7QUFBQSxXQUZsREMsYUFFa0QsR0FGbEMsQ0FFa0M7QUFDeEQsV0FBS04sR0FBTCxHQUFXSCxFQUFYO0FBQ0EsV0FBS0ksS0FBTCxHQUFhSCxJQUFiO0FBQ0EsV0FBS0ksV0FBTCxHQUFtQkgsR0FBbkI7QUFDSDs7Ozs2QkFFY0EsRyxFQUFhO0FBQ3hCLGFBQUtRLFFBQUwsQ0FBYyxLQUFLWixNQUFuQixFQUEyQkksR0FBM0I7QUFDSDs7OzhCQUVlO0FBQUEsMEJBQ21CLEtBQUtFLEtBRHhCO0FBQUEsWUFDSk8sT0FESSxlQUNKQSxPQURJO0FBQUEsWUFDS0MsU0FETCxlQUNLQSxTQURMO0FBRVosWUFBTUMsQ0FBQyxHQUFHRixPQUFPLEdBQUcsS0FBS0osYUFBUixHQUF3QixLQUFLVCxNQUE5QztBQUNBLGVBQU9jLFNBQVMsR0FBR0UsSUFBSSxDQUFDQyxLQUFMLENBQVdGLENBQVgsQ0FBSCxHQUFtQkMsSUFBSSxDQUFDQyxLQUFMLENBQVdGLENBQUMsR0FBRyxHQUFmLElBQXNCLEdBQXpEO0FBQ0g7Ozs4QkFFZTtBQUNaLGVBQ0ssS0FBS1QsS0FBTCxDQUFXWSxLQUFYLElBQW9CLEtBQUtsQixNQUFMLEdBQWMsS0FBS00sS0FBTCxDQUFXWSxLQUE5QyxJQUNDLEtBQUtaLEtBQUwsQ0FBV2EsSUFBWCxJQUFtQixLQUFLbkIsTUFBTCxHQUFjLEtBQUtNLEtBQUwsQ0FBV2EsSUFGakQ7QUFJSDs7OytCQUVtQkosQyxFQUE0QjtBQUFBLFlBQWpCWCxHQUFpQix1RUFBSCxDQUFHOztBQUM1QyxZQUFJLEtBQUtFLEtBQUwsQ0FBV08sT0FBZixFQUF3QjtBQUNwQixlQUFLSCxXQUFMLElBQW9CSyxDQUFwQjtBQUNBLFlBQUUsS0FBS0osYUFBUDtBQUVBLGNBQU1TLENBQUMsR0FBR2hCLEdBQVY7O0FBQ0EsY0FBSWdCLENBQUMsR0FBRyxLQUFLYixXQUFULElBQXdCLEtBQUtELEtBQUwsQ0FBV08sT0FBdkMsRUFBZ0Q7QUFDNUMsaUJBQUtKLGFBQUwsR0FBcUIsS0FBS0MsV0FBTCxHQUFtQixLQUFLQyxhQUE3QztBQUNBLGlCQUFLRCxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsaUJBQUtILFdBQUwsR0FBbUJhLENBQW5CO0FBQ0EsaUJBQUtULGFBQUwsR0FBcUIsQ0FBckI7QUFDSDtBQUNKO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGludGVyZmFjZSBJQ291bnRlck9wdGlvbiB7XHJcbiAgICBkZXNjOiBzdHJpbmc7XHJcbiAgICBjb3VudGVyOiBDb3VudGVyO1xyXG4gICAgbWluPzogbnVtYmVyO1xyXG4gICAgbWF4PzogbnVtYmVyO1xyXG4gICAgYXZlcmFnZT86IG51bWJlcjtcclxuICAgIGJlbG93PzogbnVtYmVyO1xyXG4gICAgb3Zlcj86IG51bWJlcjtcclxuICAgIGNvbG9yPzogc3RyaW5nO1xyXG4gICAgaXNJbnRlZ2VyPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvdW50ZXIge1xyXG4gICAgZ2V0IHZhbHVlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhbHVlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2lkOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgX29wdHM6IElDb3VudGVyT3B0aW9uO1xyXG4gICAgcHJvdGVjdGVkIF9hY2N1bVN0YXJ0OiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgX3RvdGFsID0gMDtcclxuICAgIHByb3RlY3RlZCBfdmFsdWUgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9hdmVyYWdlVmFsdWUgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9hY2N1bVZhbHVlID0gMDtcclxuICAgIHByb3RlY3RlZCBfYWNjdW1TYW1wbGVzID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoaWQ6IHN0cmluZywgb3B0czogSUNvdW50ZXJPcHRpb24sIG5vdzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9vcHRzID0gb3B0cztcclxuICAgICAgICB0aGlzLl9hY2N1bVN0YXJ0ID0gbm93O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzYW1wbGUgKG5vdzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYXZlcmFnZSh0aGlzLl92YWx1ZSwgbm93KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaHVtYW4gKCkge1xyXG4gICAgICAgIGNvbnN0IHsgYXZlcmFnZSwgaXNJbnRlZ2VyIH0gPSB0aGlzLl9vcHRzO1xyXG4gICAgICAgIGNvbnN0IHYgPSBhdmVyYWdlID8gdGhpcy5fYXZlcmFnZVZhbHVlIDogdGhpcy5fdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIGlzSW50ZWdlciA/IE1hdGgucm91bmQodikgOiBNYXRoLnJvdW5kKHYgKiAxMDApIC8gMTAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhbGFybSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgKHRoaXMuX29wdHMuYmVsb3cgJiYgdGhpcy5fdmFsdWUgPCB0aGlzLl9vcHRzLmJlbG93KSB8fFxyXG4gICAgICAgICAgICAodGhpcy5fb3B0cy5vdmVyICYmIHRoaXMuX3ZhbHVlID4gdGhpcy5fb3B0cy5vdmVyKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hdmVyYWdlICh2OiBudW1iZXIsIG5vdzogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9vcHRzLmF2ZXJhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fYWNjdW1WYWx1ZSArPSB2O1xyXG4gICAgICAgICAgICArK3RoaXMuX2FjY3VtU2FtcGxlcztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBub3c7XHJcbiAgICAgICAgICAgIGlmICh0IC0gdGhpcy5fYWNjdW1TdGFydCA+PSB0aGlzLl9vcHRzLmF2ZXJhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F2ZXJhZ2VWYWx1ZSA9IHRoaXMuX2FjY3VtVmFsdWUgLyB0aGlzLl9hY2N1bVNhbXBsZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2N1bVZhbHVlID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjY3VtU3RhcnQgPSB0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjdW1TYW1wbGVzID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=