(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../data/object.js", "../utils/js.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../data/object.js"), require("../utils/js.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.object, global.js, global.globalExports);
    global.rawAsset = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _object, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RawAsset = void 0;

  var _dec, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * 原生资源的基类。内部使用。
   * @private
   */
  var RawAsset = (_dec = (0, _index.ccclass)('cc.RawAsset'), _dec(_class = (_temp = /*#__PURE__*/function (_CCObject) {
    _inherits(RawAsset, _CCObject);

    _createClass(RawAsset, null, [{
      key: "isRawAssetType",

      /**
       * 内部使用。
       */
      value: function isRawAssetType(ctor) {
        return (0, _js.isChildClassOf)(ctor, _globalExports.legacyCC.RawAsset) && !(0, _js.isChildClassOf)(ctor, _globalExports.legacyCC.Asset);
      }
      /**
       * 内部使用。
       */
      // @ts-ignore

    }]);

    function RawAsset() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RawAsset);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RawAsset)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._uuid = void 0;
      Object.defineProperty(_assertThisInitialized(_this), '_uuid', {
        value: '',
        writable: true // enumerable is false by default, to avoid uuid being assigned to empty string during destroy

      });
      return _this;
    }

    return RawAsset;
  }(_object.CCObject), _temp)) || _class);
  _exports.RawAsset = RawAsset;
  _globalExports.legacyCC.RawAsset = RawAsset;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3Jhdy1hc3NldC50cyJdLCJuYW1lcyI6WyJSYXdBc3NldCIsImN0b3IiLCJsZWdhY3lDQyIsIkFzc2V0IiwiYXJncyIsIl91dWlkIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIndyaXRhYmxlIiwiQ0NPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0E7Ozs7TUFLYUEsUSxXQURaLG9CQUFRLGFBQVIsQzs7Ozs7O0FBRUc7OztxQ0FHOEJDLEksRUFBZ0I7QUFDMUMsZUFBTyx3QkFBZUEsSUFBZixFQUFxQkMsd0JBQVNGLFFBQTlCLEtBQTJDLENBQUMsd0JBQWVDLElBQWYsRUFBcUJDLHdCQUFTQyxLQUE5QixDQUFuRDtBQUNIO0FBRUQ7OztBQUdBOzs7O0FBR0Esd0JBQThEO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsd0NBQTlDQyxJQUE4QztBQUE5Q0EsUUFBQUEsSUFBOEM7QUFBQTs7QUFDMUQseUlBQVNBLElBQVQ7QUFEMEQsWUFGdkRDLEtBRXVEO0FBRzFEQyxNQUFBQSxNQUFNLENBQUNDLGNBQVAsZ0NBQTRCLE9BQTVCLEVBQXFDO0FBQ2pDQyxRQUFBQSxLQUFLLEVBQUUsRUFEMEI7QUFFakNDLFFBQUFBLFFBQVEsRUFBRSxJQUZ1QixDQUdqQzs7QUFIaUMsT0FBckM7QUFIMEQ7QUFRN0Q7OztJQXRCeUJDLGdCOztBQXlCOUJSLDBCQUFTRixRQUFULEdBQW9CQSxRQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcyB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENDT2JqZWN0IH0gZnJvbSAnLi4vZGF0YS9vYmplY3QnO1xyXG5pbXBvcnQgeyBpc0NoaWxkQ2xhc3NPZiB9IGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICog5Y6f55Sf6LWE5rqQ55qE5Z+657G744CC5YaF6YOo5L2/55So44CCXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuUmF3QXNzZXQnKVxyXG5leHBvcnQgY2xhc3MgUmF3QXNzZXQgZXh0ZW5kcyBDQ09iamVjdCB7XHJcbiAgICAvKipcclxuICAgICAqIOWGhemDqOS9v+eUqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGlzUmF3QXNzZXRUeXBlIChjdG9yOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHJldHVybiBpc0NoaWxkQ2xhc3NPZihjdG9yLCBsZWdhY3lDQy5SYXdBc3NldCkgJiYgIWlzQ2hpbGRDbGFzc09mKGN0b3IsIGxlZ2FjeUNDLkFzc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWGhemDqOS9v+eUqOOAglxyXG4gICAgICovXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwdWJsaWMgX3V1aWQ6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoLi4uYXJnczogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBDQ09iamVjdD4pIHtcclxuICAgICAgICBzdXBlciguLi5hcmdzKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfdXVpZCcsIHtcclxuICAgICAgICAgICAgdmFsdWU6ICcnLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gZW51bWVyYWJsZSBpcyBmYWxzZSBieSBkZWZhdWx0LCB0byBhdm9pZCB1dWlkIGJlaW5nIGFzc2lnbmVkIHRvIGVtcHR5IHN0cmluZyBkdXJpbmcgZGVzdHJveVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5SYXdBc3NldCA9IFJhd0Fzc2V0O1xyXG4iXX0=