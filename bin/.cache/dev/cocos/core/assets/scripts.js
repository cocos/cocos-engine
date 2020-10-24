(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "./asset.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("./asset.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.asset, global.globalExports);
    global.scripts = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _asset, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TypeScript = _exports.JavaScript = _exports.Script = void 0;

  var _dec, _class, _dec2, _class2, _dec3, _class3;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * @zh
   * 脚本资源基类。
   */
  var Script = (_dec = (0, _index.ccclass)('cc.Script'), _dec(_class = /*#__PURE__*/function (_Asset) {
    _inherits(Script, _Asset);

    function Script() {
      _classCallCheck(this, Script);

      return _possibleConstructorReturn(this, _getPrototypeOf(Script).apply(this, arguments));
    }

    return Script;
  }(_asset.Asset)) || _class);
  _exports.Script = Script;
  _globalExports.legacyCC._Script = Script;
  /**
   * @zh
   * JavaScript 脚本资源。
   */

  var JavaScript = (_dec2 = (0, _index.ccclass)('cc.JavaScript'), _dec2(_class2 = /*#__PURE__*/function (_Script) {
    _inherits(JavaScript, _Script);

    function JavaScript() {
      _classCallCheck(this, JavaScript);

      return _possibleConstructorReturn(this, _getPrototypeOf(JavaScript).apply(this, arguments));
    }

    return JavaScript;
  }(Script)) || _class2);
  _exports.JavaScript = JavaScript;
  _globalExports.legacyCC._JavaScript = JavaScript;
  /**
   * @zh
   * Typescript 脚本资源。
   */

  var TypeScript = (_dec3 = (0, _index.ccclass)('cc.TypeScript'), _dec3(_class3 = /*#__PURE__*/function (_Script2) {
    _inherits(TypeScript, _Script2);

    function TypeScript() {
      _classCallCheck(this, TypeScript);

      return _possibleConstructorReturn(this, _getPrototypeOf(TypeScript).apply(this, arguments));
    }

    return TypeScript;
  }(Script)) || _class3);
  _exports.TypeScript = TypeScript;
  _globalExports.legacyCC._TypeScript = TypeScript;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3NjcmlwdHMudHMiXSwibmFtZXMiOlsiU2NyaXB0IiwiQXNzZXQiLCJsZWdhY3lDQyIsIl9TY3JpcHQiLCJKYXZhU2NyaXB0IiwiX0phdmFTY3JpcHQiLCJUeXBlU2NyaXB0IiwiX1R5cGVTY3JpcHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDQTs7OztNQUthQSxNLFdBRFosb0JBQVEsV0FBUixDOzs7Ozs7Ozs7O0lBQzJCQyxZOztBQUU1QkMsMEJBQVNDLE9BQVQsR0FBbUJILE1BQW5CO0FBRUE7Ozs7O01BS2FJLFUsWUFEWixvQkFBUSxlQUFSLEM7Ozs7Ozs7Ozs7SUFDK0JKLE07O0FBRWhDRSwwQkFBU0csV0FBVCxHQUF1QkQsVUFBdkI7QUFFQTs7Ozs7TUFLYUUsVSxZQURaLG9CQUFRLGVBQVIsQzs7Ozs7Ozs7OztJQUMrQk4sTTs7QUFFaENFLDBCQUFTSyxXQUFULEdBQXVCRCxVQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQge2NjY2xhc3N9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnLi9hc3NldCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDohJrmnKzotYTmupDln7rnsbvjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5TY3JpcHQnKVxyXG5leHBvcnQgY2xhc3MgU2NyaXB0IGV4dGVuZHMgQXNzZXQge1xyXG59XHJcbmxlZ2FjeUNDLl9TY3JpcHQgPSBTY3JpcHQ7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIEphdmFTY3JpcHQg6ISa5pys6LWE5rqQ44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuSmF2YVNjcmlwdCcpXHJcbmV4cG9ydCBjbGFzcyBKYXZhU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcclxufVxyXG5sZWdhY3lDQy5fSmF2YVNjcmlwdCA9IEphdmFTY3JpcHQ7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIFR5cGVzY3JpcHQg6ISa5pys6LWE5rqQ44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuVHlwZVNjcmlwdCcpXHJcbmV4cG9ydCBjbGFzcyBUeXBlU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcclxufVxyXG5sZWdhY3lDQy5fVHlwZVNjcmlwdCA9IFR5cGVTY3JpcHQ7XHJcbiJdfQ==