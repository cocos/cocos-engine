(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../fence.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../fence.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.fence);
    global.webgl2Fence = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _fence) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Fence = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Fence = /*#__PURE__*/function (_GFXFence) {
    _inherits(WebGL2Fence, _GFXFence);

    function WebGL2Fence() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Fence);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Fence)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._sync = null;
      return _this;
    }

    _createClass(WebGL2Fence, [{
      key: "initialize",
      value: function initialize(info) {
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "wait",
      value: function wait() {
        if (this._sync) {
          var gl = this._device.gl;
          gl.clientWaitSync(this._sync, 0, gl.TIMEOUT_IGNORED);
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        if (this._sync) {
          var gl = this._device.gl;
          gl.deleteSync(this._sync);
          this._sync = null;
        }
      }
    }, {
      key: "insert",
      value: function insert() {
        var gl = this._device.gl;

        if (this._sync) {
          gl.deleteSync(this._sync);
        }

        this._sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      }
    }]);

    return WebGL2Fence;
  }(_fence.GFXFence);

  _exports.WebGL2Fence = WebGL2Fence;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItZmVuY2UudHMiXSwibmFtZXMiOlsiV2ViR0wyRmVuY2UiLCJfc3luYyIsImluZm8iLCJnbCIsIl9kZXZpY2UiLCJjbGllbnRXYWl0U3luYyIsIlRJTUVPVVRfSUdOT1JFRCIsImRlbGV0ZVN5bmMiLCJmZW5jZVN5bmMiLCJTWU5DX0dQVV9DT01NQU5EU19DT01QTEVURSIsIkdGWEZlbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUdhQSxXOzs7Ozs7Ozs7Ozs7Ozs7WUFFREMsSyxHQUEwQixJOzs7Ozs7aUNBRWZDLEksRUFBNkI7QUFDNUMsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUIsQ0FDakI7Ozs2QkFFYztBQUNYLFlBQUksS0FBS0QsS0FBVCxFQUFnQjtBQUNaLGNBQU1FLEVBQUUsR0FBSSxLQUFLQyxPQUFOLENBQStCRCxFQUExQztBQUNBQSxVQUFBQSxFQUFFLENBQUNFLGNBQUgsQ0FBa0IsS0FBS0osS0FBdkIsRUFBOEIsQ0FBOUIsRUFBaUNFLEVBQUUsQ0FBQ0csZUFBcEM7QUFDSDtBQUNKOzs7OEJBRWU7QUFDWixZQUFJLEtBQUtMLEtBQVQsRUFBZ0I7QUFDWixjQUFNRSxFQUFFLEdBQUksS0FBS0MsT0FBTixDQUErQkQsRUFBMUM7QUFDQUEsVUFBQUEsRUFBRSxDQUFDSSxVQUFILENBQWMsS0FBS04sS0FBbkI7QUFDQSxlQUFLQSxLQUFMLEdBQWEsSUFBYjtBQUNIO0FBQ0o7OzsrQkFFZ0I7QUFDYixZQUFNRSxFQUFFLEdBQUksS0FBS0MsT0FBTixDQUErQkQsRUFBMUM7O0FBQ0EsWUFBSSxLQUFLRixLQUFULEVBQWdCO0FBQUVFLFVBQUFBLEVBQUUsQ0FBQ0ksVUFBSCxDQUFjLEtBQUtOLEtBQW5CO0FBQTRCOztBQUM5QyxhQUFLQSxLQUFMLEdBQWFFLEVBQUUsQ0FBQ0ssU0FBSCxDQUFhTCxFQUFFLENBQUNNLDBCQUFoQixFQUE0QyxDQUE1QyxDQUFiO0FBQ0g7Ozs7SUE5QjRCQyxlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYRmVuY2UsIEdGWEZlbmNlSW5mbyB9IGZyb20gJy4uL2ZlbmNlJztcclxuaW1wb3J0IHsgV2ViR0wyRGV2aWNlIH0gZnJvbSAnLi93ZWJnbDItZGV2aWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTDJGZW5jZSBleHRlbmRzIEdGWEZlbmNlIHtcclxuXHJcbiAgICBwcml2YXRlIF9zeW5jOiBXZWJHTFN5bmMgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYRmVuY2VJbmZvKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3YWl0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3luYykge1xyXG4gICAgICAgICAgICBjb25zdCBnbCA9ICh0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlKS5nbDtcclxuICAgICAgICAgICAgZ2wuY2xpZW50V2FpdFN5bmModGhpcy5fc3luYywgMCwgZ2wuVElNRU9VVF9JR05PUkVEKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3luYykge1xyXG4gICAgICAgICAgICBjb25zdCBnbCA9ICh0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlKS5nbDtcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU3luYyh0aGlzLl9zeW5jKTtcclxuICAgICAgICAgICAgdGhpcy5fc3luYyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnNlcnQgKCkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UpLmdsO1xyXG4gICAgICAgIGlmICh0aGlzLl9zeW5jKSB7IGdsLmRlbGV0ZVN5bmModGhpcy5fc3luYyk7IH1cclxuICAgICAgICB0aGlzLl9zeW5jID0gZ2wuZmVuY2VTeW5jKGdsLlNZTkNfR1BVX0NPTU1BTkRTX0NPTVBMRVRFLCAwKTtcclxuICAgIH1cclxufVxyXG4iXX0=