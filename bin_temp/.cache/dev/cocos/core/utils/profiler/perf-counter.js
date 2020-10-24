(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "./counter.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("./counter.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.counter);
    global.perfCounter = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _counter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PerfCounter = void 0;

  var _dec, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var PerfCounter = (_dec = (0, _index.ccclass)('cc.PerfCounter'), _dec(_class = (_temp = /*#__PURE__*/function (_Counter) {
    _inherits(PerfCounter, _Counter);

    function PerfCounter(id, opts, now) {
      var _this;

      _classCallCheck(this, PerfCounter);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PerfCounter).call(this, id, opts, now));
      _this._time = void 0;
      _this._time = now;
      return _this;
    }

    _createClass(PerfCounter, [{
      key: "start",
      value: function start() {
        var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this._time = now; // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idstart);
      }
    }, {
      key: "end",
      value: function end() {
        var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this._value = now - this._time; // DISABLE: long time running will cause performance drop down
        // window.performance.mark(this._idend);
        // window.performance.measure(this._id, this._idstart, this._idend);

        this._average(this._value);
      }
    }, {
      key: "tick",
      value: function tick() {
        this.end();
        this.start();
      }
    }, {
      key: "frame",
      value: function frame(now) {
        var t = now;
        var e = t - this._time;
        this._total++;
        var avg = this._opts.average || 1000;

        if (e > avg) {
          this._value = this._total * 1000 / e;
          this._total = 0;
          this._time = t;

          this._average(this._value);
        }
      }
    }]);

    return PerfCounter;
  }(_counter.Counter), _temp)) || _class);
  _exports.PerfCounter = PerfCounter;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvcHJvZmlsZXIvcGVyZi1jb3VudGVyLnRzIl0sIm5hbWVzIjpbIlBlcmZDb3VudGVyIiwiaWQiLCJvcHRzIiwibm93IiwiX3RpbWUiLCJfdmFsdWUiLCJfYXZlcmFnZSIsImVuZCIsInN0YXJ0IiwidCIsImUiLCJfdG90YWwiLCJhdmciLCJfb3B0cyIsImF2ZXJhZ2UiLCJDb3VudGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BSWFBLFcsV0FEWixvQkFBUSxnQkFBUixDOzs7QUFHRyx5QkFBYUMsRUFBYixFQUF5QkMsSUFBekIsRUFBK0NDLEdBQS9DLEVBQTREO0FBQUE7O0FBQUE7O0FBQ3hELHVGQUFNRixFQUFOLEVBQVVDLElBQVYsRUFBZ0JDLEdBQWhCO0FBRHdELFlBRHBEQyxLQUNvRDtBQUV4RCxZQUFLQSxLQUFMLEdBQWFELEdBQWI7QUFGd0Q7QUFHM0Q7Ozs7OEJBQzhCO0FBQUEsWUFBakJBLEdBQWlCLHVFQUFILENBQUc7QUFDM0IsYUFBS0MsS0FBTCxHQUFhRCxHQUFiLENBRDJCLENBRzNCO0FBQ0E7QUFDSDs7OzRCQUU0QjtBQUFBLFlBQWpCQSxHQUFpQix1RUFBSCxDQUFHO0FBQ3pCLGFBQUtFLE1BQUwsR0FBY0YsR0FBRyxHQUFHLEtBQUtDLEtBQXpCLENBRHlCLENBR3pCO0FBQ0E7QUFDQTs7QUFFQSxhQUFLRSxRQUFMLENBQWMsS0FBS0QsTUFBbkI7QUFDSDs7OzZCQUVjO0FBQ1gsYUFBS0UsR0FBTDtBQUNBLGFBQUtDLEtBQUw7QUFDSDs7OzRCQUVhTCxHLEVBQWE7QUFDdkIsWUFBTU0sQ0FBQyxHQUFHTixHQUFWO0FBQ0EsWUFBTU8sQ0FBQyxHQUFHRCxDQUFDLEdBQUcsS0FBS0wsS0FBbkI7QUFDQSxhQUFLTyxNQUFMO0FBQ0EsWUFBTUMsR0FBRyxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsT0FBWCxJQUFzQixJQUFsQzs7QUFFQSxZQUFJSixDQUFDLEdBQUdFLEdBQVIsRUFBYTtBQUNULGVBQUtQLE1BQUwsR0FBYyxLQUFLTSxNQUFMLEdBQWMsSUFBZCxHQUFxQkQsQ0FBbkM7QUFDQSxlQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLGVBQUtQLEtBQUwsR0FBYUssQ0FBYjs7QUFDQSxlQUFLSCxRQUFMLENBQWMsS0FBS0QsTUFBbkI7QUFDSDtBQUNKOzs7O0lBeEM0QlUsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ291bnRlciwgSUNvdW50ZXJPcHRpb24gfSBmcm9tICcuL2NvdW50ZXInO1xyXG5cclxuQGNjY2xhc3MoJ2NjLlBlcmZDb3VudGVyJylcclxuZXhwb3J0IGNsYXNzIFBlcmZDb3VudGVyIGV4dGVuZHMgQ291bnRlciB7XHJcbiAgICBwcml2YXRlIF90aW1lOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvciAoaWQ6IHN0cmluZywgb3B0czogSUNvdW50ZXJPcHRpb24sIG5vdzogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIG9wdHMsIG5vdyk7XHJcbiAgICAgICAgdGhpcy5fdGltZSA9IG5vdztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGFydCAobm93OiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZSA9IG5vdztcclxuXHJcbiAgICAgICAgLy8gRElTQUJMRTogbG9uZyB0aW1lIHJ1bm5pbmcgd2lsbCBjYXVzZSBwZXJmb3JtYW5jZSBkcm9wIGRvd25cclxuICAgICAgICAvLyB3aW5kb3cucGVyZm9ybWFuY2UubWFyayh0aGlzLl9pZHN0YXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5kIChub3c6IG51bWJlciA9IDApIHtcclxuICAgICAgICB0aGlzLl92YWx1ZSA9IG5vdyAtIHRoaXMuX3RpbWU7XHJcblxyXG4gICAgICAgIC8vIERJU0FCTEU6IGxvbmcgdGltZSBydW5uaW5nIHdpbGwgY2F1c2UgcGVyZm9ybWFuY2UgZHJvcCBkb3duXHJcbiAgICAgICAgLy8gd2luZG93LnBlcmZvcm1hbmNlLm1hcmsodGhpcy5faWRlbmQpO1xyXG4gICAgICAgIC8vIHdpbmRvdy5wZXJmb3JtYW5jZS5tZWFzdXJlKHRoaXMuX2lkLCB0aGlzLl9pZHN0YXJ0LCB0aGlzLl9pZGVuZCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2F2ZXJhZ2UodGhpcy5fdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0aWNrICgpIHtcclxuICAgICAgICB0aGlzLmVuZCgpO1xyXG4gICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJhbWUgKG5vdzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IG5vdztcclxuICAgICAgICBjb25zdCBlID0gdCAtIHRoaXMuX3RpbWU7XHJcbiAgICAgICAgdGhpcy5fdG90YWwrKztcclxuICAgICAgICBjb25zdCBhdmcgPSB0aGlzLl9vcHRzLmF2ZXJhZ2UgfHwgMTAwMDtcclxuXHJcbiAgICAgICAgaWYgKGUgPiBhdmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLl90b3RhbCAqIDEwMDAgLyBlO1xyXG4gICAgICAgICAgICB0aGlzLl90b3RhbCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSB0O1xyXG4gICAgICAgICAgICB0aGlzLl9hdmVyYWdlKHRoaXMuX3ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19