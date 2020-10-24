(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../define.js", "../sampler.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../define.js"), require("../sampler.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.sampler);
    global.webglSampler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _sampler) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLSampler = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLWraps = [0x2901, // WebGLRenderingContext.REPEAT,
  0x8370, // WebGLRenderingContext.MIRRORED_REPEAT,
  0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
  0x812F // WebGLRenderingContext.CLAMP_TO_EDGE,
  ];

  var WebGLSampler = /*#__PURE__*/function (_GFXSampler) {
    _inherits(WebGLSampler, _GFXSampler);

    function WebGLSampler() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLSampler);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLSampler)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuSampler = null;
      return _this;
    }

    _createClass(WebGLSampler, [{
      key: "initialize",
      value: function initialize(info) {
        this._minFilter = info.minFilter;
        this._magFilter = info.magFilter;
        this._mipFilter = info.mipFilter;
        this._addressU = info.addressU;
        this._addressV = info.addressV;
        this._addressW = info.addressW;
        this._maxAnisotropy = info.maxAnisotropy;
        this._cmpFunc = info.cmpFunc;
        this._borderColor = info.borderColor;
        this._minLOD = info.minLOD;
        this._maxLOD = info.maxLOD;
        this._mipLODBias = info.mipLODBias;
        var glMinFilter = 0;
        var glMagFilter = 0;
        var minFilter = this._minFilter;
        var magFilter = this._magFilter;
        var mipFilter = this._mipFilter;

        if (minFilter === _define.GFXFilter.LINEAR || minFilter === _define.GFXFilter.ANISOTROPIC) {
          if (mipFilter === _define.GFXFilter.LINEAR || mipFilter === _define.GFXFilter.ANISOTROPIC) {
            glMinFilter = 0x2703; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
          } else if (mipFilter === _define.GFXFilter.POINT) {
            glMinFilter = 0x2701; // WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
          } else {
            glMinFilter = 0x2601; // WebGLRenderingContext.LINEAR;
          }
        } else {
          if (mipFilter === _define.GFXFilter.LINEAR || mipFilter === _define.GFXFilter.ANISOTROPIC) {
            glMinFilter = 0x2702; // WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
          } else if (mipFilter === _define.GFXFilter.POINT) {
            glMinFilter = 0x2700; // WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
          } else {
            glMinFilter = 0x2600; // WebGLRenderingContext.NEAREST;
          }
        }

        if (magFilter === _define.GFXFilter.LINEAR || magFilter === _define.GFXFilter.ANISOTROPIC) {
          glMagFilter = 0x2601; // WebGLRenderingContext.LINEAR;
        } else {
          glMagFilter = 0x2600; // WebGLRenderingContext.NEAREST;
        }

        var glWrapS = WebGLWraps[this._addressU];
        var glWrapT = WebGLWraps[this._addressV];
        var glWrapR = WebGLWraps[this._addressW];
        this._gpuSampler = {
          glMinFilter: glMinFilter,
          glMagFilter: glMagFilter,
          glWrapS: glWrapS,
          glWrapT: glWrapT,
          glWrapR: glWrapR
        };
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._gpuSampler = null;
      }
    }, {
      key: "gpuSampler",
      get: function get() {
        return this._gpuSampler;
      }
    }]);

    return WebGLSampler;
  }(_sampler.GFXSampler);

  _exports.WebGLSampler = WebGLSampler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXNhbXBsZXIudHMiXSwibmFtZXMiOlsiV2ViR0xXcmFwcyIsIldlYkdMU2FtcGxlciIsIl9ncHVTYW1wbGVyIiwiaW5mbyIsIl9taW5GaWx0ZXIiLCJtaW5GaWx0ZXIiLCJfbWFnRmlsdGVyIiwibWFnRmlsdGVyIiwiX21pcEZpbHRlciIsIm1pcEZpbHRlciIsIl9hZGRyZXNzVSIsImFkZHJlc3NVIiwiX2FkZHJlc3NWIiwiYWRkcmVzc1YiLCJfYWRkcmVzc1ciLCJhZGRyZXNzVyIsIl9tYXhBbmlzb3Ryb3B5IiwibWF4QW5pc290cm9weSIsIl9jbXBGdW5jIiwiY21wRnVuYyIsIl9ib3JkZXJDb2xvciIsImJvcmRlckNvbG9yIiwiX21pbkxPRCIsIm1pbkxPRCIsIl9tYXhMT0QiLCJtYXhMT0QiLCJfbWlwTE9EQmlhcyIsIm1pcExPREJpYXMiLCJnbE1pbkZpbHRlciIsImdsTWFnRmlsdGVyIiwiR0ZYRmlsdGVyIiwiTElORUFSIiwiQU5JU09UUk9QSUMiLCJQT0lOVCIsImdsV3JhcFMiLCJnbFdyYXBUIiwiZ2xXcmFwUiIsIkdGWFNhbXBsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsTUFBTUEsVUFBb0IsR0FBRyxDQUN6QixNQUR5QixFQUNqQjtBQUNSLFFBRnlCLEVBRWpCO0FBQ1IsUUFIeUIsRUFHakI7QUFDUixRQUp5QixDQUlqQjtBQUppQixHQUE3Qjs7TUFPYUMsWTs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLFcsR0FBdUMsSTs7Ozs7O2lDQUU1QkMsSSxFQUErQjtBQUU5QyxhQUFLQyxVQUFMLEdBQWtCRCxJQUFJLENBQUNFLFNBQXZCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQkgsSUFBSSxDQUFDSSxTQUF2QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JMLElBQUksQ0FBQ00sU0FBdkI7QUFDQSxhQUFL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IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYU2FtcGxlciwgR0ZYU2FtcGxlckluZm8gfSBmcm9tICcuLi9zYW1wbGVyJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVU2FtcGxlciB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5cclxuY29uc3QgV2ViR0xXcmFwczogR0xlbnVtW10gPSBbXHJcbiAgICAweDI5MDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5SRVBFQVQsXHJcbiAgICAweDgzNzAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5NSVJST1JFRF9SRVBFQVQsXHJcbiAgICAweDgxMkYsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5DTEFNUF9UT19FREdFLFxyXG4gICAgMHg4MTJGLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuQ0xBTVBfVE9fRURHRSxcclxuXTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTFNhbXBsZXIgZXh0ZW5kcyBHRlhTYW1wbGVyIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdwdVNhbXBsZXIgKCk6IElXZWJHTEdQVVNhbXBsZXIge1xyXG4gICAgICAgIHJldHVybiAgdGhpcy5fZ3B1U2FtcGxlciE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1U2FtcGxlcjogSVdlYkdMR1BVU2FtcGxlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhTYW1wbGVySW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICB0aGlzLl9taW5GaWx0ZXIgPSBpbmZvLm1pbkZpbHRlcjtcclxuICAgICAgICB0aGlzLl9tYWdGaWx0ZXIgPSBpbmZvLm1hZ0ZpbHRlcjtcclxuICAgICAgICB0aGlzLl9taXBGaWx0ZXIgPSBpbmZvLm1pcEZpbHRlcjtcclxuICAgICAgICB0aGlzLl9hZGRyZXNzVSA9IGluZm8uYWRkcmVzc1U7XHJcbiAgICAgICAgdGhpcy5fYWRkcmVzc1YgPSBpbmZvLmFkZHJlc3NWO1xyXG4gICAgICAgIHRoaXMuX2FkZHJlc3NXID0gaW5mby5hZGRyZXNzVztcclxuICAgICAgICB0aGlzLl9tYXhBbmlzb3Ryb3B5ID0gaW5mby5tYXhBbmlzb3Ryb3B5O1xyXG4gICAgICAgIHRoaXMuX2NtcEZ1bmMgPSBpbmZvLmNtcEZ1bmM7XHJcbiAgICAgICAgdGhpcy5fYm9yZGVyQ29sb3IgPSBpbmZvLmJvcmRlckNvbG9yO1xyXG4gICAgICAgIHRoaXMuX21pbkxPRCA9IGluZm8ubWluTE9EO1xyXG4gICAgICAgIHRoaXMuX21heExPRCA9IGluZm8ubWF4TE9EO1xyXG4gICAgICAgIHRoaXMuX21pcExPREJpYXMgPSBpbmZvLm1pcExPREJpYXM7XHJcblxyXG4gICAgICAgIGxldCBnbE1pbkZpbHRlciA9IDA7XHJcbiAgICAgICAgbGV0IGdsTWFnRmlsdGVyID0gMDtcclxuXHJcbiAgICAgICAgY29uc3QgbWluRmlsdGVyID0gdGhpcy5fbWluRmlsdGVyO1xyXG4gICAgICAgIGNvbnN0IG1hZ0ZpbHRlciA9IHRoaXMuX21hZ0ZpbHRlcjtcclxuICAgICAgICBjb25zdCBtaXBGaWx0ZXIgPSB0aGlzLl9taXBGaWx0ZXI7XHJcblxyXG4gICAgICAgIGlmIChtaW5GaWx0ZXIgPT09IEdGWEZpbHRlci5MSU5FQVIgfHwgbWluRmlsdGVyID09PSBHRlhGaWx0ZXIuQU5JU09UUk9QSUMpIHtcclxuICAgICAgICAgICAgaWYgKG1pcEZpbHRlciA9PT0gR0ZYRmlsdGVyLkxJTkVBUiB8fCBtaXBGaWx0ZXIgPT09IEdGWEZpbHRlci5BTklTT1RST1BJQykge1xyXG4gICAgICAgICAgICAgICAgZ2xNaW5GaWx0ZXIgPSAweDI3MDM7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MSU5FQVJfTUlQTUFQX0xJTkVBUjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtaXBGaWx0ZXIgPT09IEdGWEZpbHRlci5QT0lOVCkge1xyXG4gICAgICAgICAgICAgICAgZ2xNaW5GaWx0ZXIgPSAweDI3MDE7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MSU5FQVJfTUlQTUFQX05FQVJFU1Q7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnbE1pbkZpbHRlciA9IDB4MjYwMTsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkxJTkVBUjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtaXBGaWx0ZXIgPT09IEdGWEZpbHRlci5MSU5FQVIgfHwgbWlwRmlsdGVyID09PSBHRlhGaWx0ZXIuQU5JU09UUk9QSUMpIHtcclxuICAgICAgICAgICAgICAgIGdsTWluRmlsdGVyID0gMHgyNzAyOyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTkVBUkVTVF9NSVBNQVBfTElORUFSO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1pcEZpbHRlciA9PT0gR0ZYRmlsdGVyLlBPSU5UKSB7XHJcbiAgICAgICAgICAgICAgICBnbE1pbkZpbHRlciA9IDB4MjcwMDsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5FQVJFU1RfTUlQTUFQX05FQVJFU1Q7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnbE1pbkZpbHRlciA9IDB4MjYwMDsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5FQVJFU1Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYWdGaWx0ZXIgPT09IEdGWEZpbHRlci5MSU5FQVIgfHwgbWFnRmlsdGVyID09PSBHRlhGaWx0ZXIuQU5JU09UUk9QSUMpIHtcclxuICAgICAgICAgICAgZ2xNYWdGaWx0ZXIgPSAweDI2MDE7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MSU5FQVI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2xNYWdGaWx0ZXIgPSAweDI2MDA7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5ORUFSRVNUO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZ2xXcmFwUyA9IFdlYkdMV3JhcHNbdGhpcy5fYWRkcmVzc1VdO1xyXG4gICAgICAgIGNvbnN0IGdsV3JhcFQgPSBXZWJHTFdyYXBzW3RoaXMuX2FkZHJlc3NWXTtcclxuICAgICAgICBjb25zdCBnbFdyYXBSID0gV2ViR0xXcmFwc1t0aGlzLl9hZGRyZXNzV107XHJcblxyXG4gICAgICAgIHRoaXMuX2dwdVNhbXBsZXIgPSB7XHJcbiAgICAgICAgICAgIGdsTWluRmlsdGVyLFxyXG4gICAgICAgICAgICBnbE1hZ0ZpbHRlcixcclxuICAgICAgICAgICAgZ2xXcmFwUyxcclxuICAgICAgICAgICAgZ2xXcmFwVCxcclxuICAgICAgICAgICAgZ2xXcmFwUixcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZ3B1U2FtcGxlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuIl19