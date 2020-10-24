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
    global.webglFence = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _fence) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLFence = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLFence = /*#__PURE__*/function (_GFXFence) {
    _inherits(WebGLFence, _GFXFence);

    function WebGLFence() {
      _classCallCheck(this, WebGLFence);

      return _possibleConstructorReturn(this, _getPrototypeOf(WebGLFence).apply(this, arguments));
    }

    _createClass(WebGLFence, [{
      key: "initialize",
      value: function initialize(info) {
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {} // WebGL 1 doesn't have any syncing mechanism

    }, {
      key: "wait",
      value: function wait() {}
    }, {
      key: "reset",
      value: function reset() {}
    }]);

    return WebGLFence;
  }(_fence.GFXFence);

  _exports.WebGLFence = WebGLFence;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWZlbmNlLnRzIl0sIm5hbWVzIjpbIldlYkdMRmVuY2UiLCJpbmZvIiwiR0ZYRmVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRWFBLFU7Ozs7Ozs7Ozs7O2lDQUVVQyxJLEVBQTZCO0FBQzVDLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCLENBQ2pCLEMsQ0FFRDs7Ozs2QkFDZSxDQUFFOzs7OEJBQ0QsQ0FBRTs7OztJQVhVQyxlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYRmVuY2UsIEdGWEZlbmNlSW5mbyB9IGZyb20gJy4uL2ZlbmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTEZlbmNlIGV4dGVuZHMgR0ZYRmVuY2Uge1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhGZW5jZUluZm8pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV2ViR0wgMSBkb2Vzbid0IGhhdmUgYW55IHN5bmNpbmcgbWVjaGFuaXNtXHJcbiAgICBwdWJsaWMgd2FpdCAoKSB7fVxyXG4gICAgcHVibGljIHJlc2V0ICgpIHt9XHJcbn1cclxuIl19