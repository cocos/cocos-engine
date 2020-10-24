(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/index.js", "../../core/data/decorators/index.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/index.js"), require("../../core/data/decorators/index.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.globalExports);
    global.viewGroup = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ViewGroup = void 0;

  var _dec, _dec2, _class;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var ViewGroup = (_dec = (0, _index2.ccclass)('cc.ViewGroup'), _dec2 = (0, _index2.executionOrder)(110), _dec(_class = _dec2(_class = /*#__PURE__*/function (_Component) {
    _inherits(ViewGroup, _Component);

    function ViewGroup() {
      _classCallCheck(this, ViewGroup);

      return _possibleConstructorReturn(this, _getPrototypeOf(ViewGroup).apply(this, arguments));
    }

    return ViewGroup;
  }(_index.Component)) || _class) || _class);
  _exports.ViewGroup = ViewGroup;
  _globalExports.legacyCC.ViewGroup = ViewGroup;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdmlldy1ncm91cC50cyJdLCJuYW1lcyI6WyJWaWV3R3JvdXAiLCJDb21wb25lbnQiLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Ba0RhQSxTLFdBRloscUJBQVEsY0FBUixDLFVBQ0EsNEJBQWUsR0FBZixDOzs7Ozs7Ozs7O0lBQzhCQyxnQjs7QUFJL0JDLDBCQUFTRixTQUFULEdBQXFCQSxTQUFyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEhhbmRsaW5nIHRvdWNoIGV2ZW50cyBpbiBhIFZpZXdHcm91cCB0YWtlcyBzcGVjaWFsIGNhcmUsXHJcbiAqIGJlY2F1c2UgaXQncyBjb21tb24gZm9yIGEgVmlld0dyb3VwIHRvIGhhdmUgY2hpbGRyZW4gdGhhdCBhcmUgdGFyZ2V0cyBmb3IgZGlmZmVyZW50IHRvdWNoIGV2ZW50cyB0aGFuIHRoZSBWaWV3R3JvdXAgaXRzZWxmLlxyXG4gKiBUbyBtYWtlIHN1cmUgdGhhdCBlYWNoIHZpZXcgY29ycmVjdGx5IHJlY2VpdmVzIHRoZSB0b3VjaCBldmVudHMgaW50ZW5kZWQgZm9yIGl0LFxyXG4gKiBWaWV3R3JvdXAgc2hvdWxkIHJlZ2lzdGVyIGNhcHR1cmUgcGhhc2UgZXZlbnQgYW5kIGhhbmRsZSB0aGUgZXZlbnQgcHJvcGFnYXRpb24gcHJvcGVybHkuXHJcbiAqIFBsZWFzZSByZWZlciB0byBTY3JvbGxWaWV3IGZvciBtb3JlIGluZm9ybWF0aW9uLlxyXG4gKlxyXG4gKiBAemhcclxuICogVmlld0dyb3VwIOeahOS6i+S7tuWkhOeQhuavlOi+g+eJueauiu+8jOWboOS4uiBWaWV3R3JvdXAg6YeM6Z2i55qE5a2Q6IqC54K55YWz5b+D55qE5LqL5Lu26LefIFZpZXdHcm91cCDmnKzouqvlj6/og73kuI3kuIDmoLfjgIJcclxuICog5Li65LqG6K6p5a2Q6IqC54K56IO95aSf5q2j56Gu5Zyw5aSE55CG5LqL5Lu277yMVmlld0dyb3VwIOmcgOimgeazqOWGjCBjYXB0dXJlIOmYtuauteeahOS6i+S7tu+8jOW5tuS4lOWQiOeQhuWcsOWkhOeQhiBWaWV3R3JvdXAg5LmL6Ze055qE5LqL5Lu25Lyg6YCS44CCXHJcbiAqIOivt+WPguiAgyBTY3JvbGxWaWV3IOeahOWunueOsOadpeiOt+WPluabtOWkmuS/oeaBr+OAglxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGV4ZWN1dGlvbk9yZGVyIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbkBjY2NsYXNzKCdjYy5WaWV3R3JvdXAnKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5leHBvcnQgY2xhc3MgVmlld0dyb3VwIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbn1cclxuXHJcbmxlZ2FjeUNDLlZpZXdHcm91cCA9IFZpZXdHcm91cDtcclxuIl19