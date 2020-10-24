(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../sampler.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../sampler.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.sampler, global.webgl2Commands);
    global.webgl2Sampler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _sampler, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Sampler = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Sampler = /*#__PURE__*/function (_GFXSampler) {
    _inherits(WebGL2Sampler, _GFXSampler);

    function WebGL2Sampler() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Sampler);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Sampler)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuSampler = null;
      return _this;
    }

    _createClass(WebGL2Sampler, [{
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
        this._gpuSampler = {
          glSampler: null,
          minFilter: this._minFilter,
          magFilter: this._magFilter,
          mipFilter: this._mipFilter,
          addressU: this._addressU,
          addressV: this._addressV,
          addressW: this._addressW,
          minLOD: this._minLOD,
          maxLOD: this._maxLOD,
          glMinFilter: 0,
          glMagFilter: 0,
          glWrapS: 0,
          glWrapT: 0,
          glWrapR: 0
        };
        (0, _webgl2Commands.WebGL2CmdFuncCreateSampler)(this._device, this._gpuSampler);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuSampler) {
          (0, _webgl2Commands.WebGL2CmdFuncDestroySampler)(this._device, this._gpuSampler);
          this._gpuSampler = null;
        }
      }
    }, {
      key: "gpuSampler",
      get: function get() {
        return this._gpuSampler;
      }
    }]);

    return WebGL2Sampler;
  }(_sampler.GFXSampler);

  _exports.WebGL2Sampler = WebGL2Sampler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItc2FtcGxlci50cyJdLCJuYW1lcyI6WyJXZWJHTDJTYW1wbGVyIiwiX2dwdVNhbXBsZXIiLCJpbmZvIiwiX21pbkZpbHRlciIsIm1pbkZpbHRlciIsIl9tYWdGaWx0ZXIiLCJtYWdGaWx0ZXIiLCJfbWlwRmlsdGVyIiwibWlwRmlsdGVyIiwiX2FkZHJlc3NVIiwiYWRkcmVzc1UiLCJfYWRkcmVzc1YiLCJhZGRyZXNzViIsIl9hZGRyZXNzVyIsImFkZHJlc3NXIiwiX21heEFuaXNvdHJvcHkiLCJtYXhBbmlzb3Ryb3B5IiwiX2NtcEZ1bmMiLCJjbXBGdW5jIiwiX2JvcmRlckNvbG9yIiwiYm9yZGVyQ29sb3IiLCJfbWluTE9EIiwibWluTE9EIiwiX21heExPRCIsIm1heExPRCIsIl9taXBMT0RCaWFzIiwibWlwTE9EQmlhcyIsImdsU2FtcGxlciIsImdsTWluRmlsdGVyIiwiZ2xNYWdGaWx0ZXIiLCJnbFdyYXBTIiwiZ2xXcmFwVCIsImdsV3JhcFIiLCJfZGV2aWNlIiwiR0ZYU2FtcGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFLYUEsYTs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLFcsR0FBd0MsSTs7Ozs7O2lDQUU3QkMsSSxFQUErQjtBQUU5QyxhQUFLQyxVQUFMLEdBQWtCRCxJQUFJLENBQUNFLFNBQXZCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQkgsSUFBSSxDQUFDSSxTQUF2QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JMLElBQUksQ0FBQ00sU0FBdkI7QUFDQSxhQUFLQyxTQUFMLEdBQWlCUCxJQUFJLENBQUNRLFFBQXRCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQlQsSUFBSSxDQUFDVSxRQUF0QjtBQUNBLGFBQUtDLFNBQUwsR0FBaUJYLElBQUksQ0FBQ1ksUUFBdEI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCYixJQUFJLENBQUNjLGFBQTNCO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQmYsSUFBSSxDQUFDZ0IsT0FBckI7QUFDQSxhQUFLQyxZQUFMLEdBQW9CakIsSUFBSSxDQUFDa0IsV0FBekI7QUFDQSxhQUFLQyxPQUFMLEdBQWVuQixJQUFJLENBQUNvQixNQUFwQjtBQUNBLGFBQUtDLE9BQUwsR0FBZXJCLElBQUksQ0FBQ3NCLE1BQXBCO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQnZCLElBQUksQ0FBQ3dCLFVBQXhCO0FBRUEsYUFBS3pCLFdBQUwsR0FBbUI7QUFDZjBCLFVBQUFBLFNBQVMsRUFBRSxJQURJO0FBRWZ2QixVQUFBQSxTQUFTLEVBQUUsS0FBS0QsVUFGRDtBQUdmRyxVQUFBQSxTQUFTLEVBQUUsS0FBS0QsVUFIRDtBQUlmRyxVQUFBQSxTQUFTLEVBQUUsS0FBS0QsVUFKRDtBQUtmRyxVQUFBQSxRQUFRLEVBQUUsS0FBS0QsU0FMQTtBQU1mRyxVQUFBQSxRQUFRLEVBQUUsS0FBS0QsU0FOQTtBQU9mRyxVQUFBQSxRQUFRLEVBQUUsS0FBS0QsU0FQQTtBQVFmUyxVQUFBQSxNQUFNLEVBQUUsS0FBS0QsT0FSRTtBQVNmRyxVQUFBQSxNQUFNLEVBQUUsS0FBS0QsT0FURTtBQVdmSyxVQUFBQSxXQUFXLEVBQUUsQ0FYRTtBQVlmQyxVQUFBQSxXQUFXLEVBQUUsQ0FaRTtBQWFmQyxVQUFBQSxPQUFPLEVBQUUsQ0FiTTtBQWNmQyxVQUFBQSxPQUFPLEVBQUUsQ0FkTTtBQWVmQyxVQUFBQSxPQUFPLEVBQUU7QUFmTSxTQUFuQjtBQWtCQSx3REFBMkIsS0FBS0MsT0FBaEMsRUFBeUQsS0FBS2hDLFdBQTlEO0FBRUEsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUI7QUFDZCxZQUFJLEtBQUtBLFdBQVQsRUFBc0I7QUFDbEIsMkRBQTRCLEtBQUtnQyxPQUFqQyxFQUEwRCxLQUFLaEMsV0FBL0Q7QUFDQSxlQUFLQSxXQUFMLEdBQW1CLElBQW5CO0FBQ0g7QUFDSjs7OzBCQWpEMkM7QUFDeEMsZUFBUSxLQUFLQSxXQUFiO0FBQ0g7Ozs7SUFKOEJpQyxtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFNhbXBsZXIsIEdGWFNhbXBsZXJJbmZvIH0gZnJvbSAnLi4vc2FtcGxlcic7XHJcbmltcG9ydCB7IFdlYkdMMkNtZEZ1bmNDcmVhdGVTYW1wbGVyLCBXZWJHTDJDbWRGdW5jRGVzdHJveVNhbXBsZXIgfSBmcm9tICcuL3dlYmdsMi1jb21tYW5kcyc7XHJcbmltcG9ydCB7IFdlYkdMMkRldmljZSB9IGZyb20gJy4vd2ViZ2wyLWRldmljZSc7XHJcbmltcG9ydCB7IElXZWJHTDJHUFVTYW1wbGVyIH0gZnJvbSAnLi93ZWJnbDItZ3B1LW9iamVjdHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMlNhbXBsZXIgZXh0ZW5kcyBHRlhTYW1wbGVyIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdwdVNhbXBsZXIgKCk6IElXZWJHTDJHUFVTYW1wbGVyIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2dwdVNhbXBsZXIhO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dwdVNhbXBsZXI6IElXZWJHTDJHUFVTYW1wbGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWFNhbXBsZXJJbmZvKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHRoaXMuX21pbkZpbHRlciA9IGluZm8ubWluRmlsdGVyO1xyXG4gICAgICAgIHRoaXMuX21hZ0ZpbHRlciA9IGluZm8ubWFnRmlsdGVyO1xyXG4gICAgICAgIHRoaXMuX21pcEZpbHRlciA9IGluZm8ubWlwRmlsdGVyO1xyXG4gICAgICAgIHRoaXMuX2FkZHJlc3NVID0gaW5mby5hZGRyZXNzVTtcclxuICAgICAgICB0aGlzLl9hZGRyZXNzViA9IGluZm8uYWRkcmVzc1Y7XHJcbiAgICAgICAgdGhpcy5fYWRkcmVzc1cgPSBpbmZvLmFkZHJlc3NXO1xyXG4gICAgICAgIHRoaXMuX21heEFuaXNvdHJvcHkgPSBpbmZvLm1heEFuaXNvdHJvcHk7XHJcbiAgICAgICAgdGhpcy5fY21wRnVuYyA9IGluZm8uY21wRnVuYztcclxuICAgICAgICB0aGlzLl9ib3JkZXJDb2xvciA9IGluZm8uYm9yZGVyQ29sb3I7XHJcbiAgICAgICAgdGhpcy5fbWluTE9EID0gaW5mby5taW5MT0Q7XHJcbiAgICAgICAgdGhpcy5fbWF4TE9EID0gaW5mby5tYXhMT0Q7XHJcbiAgICAgICAgdGhpcy5fbWlwTE9EQmlhcyA9IGluZm8ubWlwTE9EQmlhcztcclxuXHJcbiAgICAgICAgdGhpcy5fZ3B1U2FtcGxlciA9IHtcclxuICAgICAgICAgICAgZ2xTYW1wbGVyOiBudWxsLFxyXG4gICAgICAgICAgICBtaW5GaWx0ZXI6IHRoaXMuX21pbkZpbHRlcixcclxuICAgICAgICAgICAgbWFnRmlsdGVyOiB0aGlzLl9tYWdGaWx0ZXIsXHJcbiAgICAgICAgICAgIG1pcEZpbHRlcjogdGhpcy5fbWlwRmlsdGVyLFxyXG4gICAgICAgICAgICBhZGRyZXNzVTogdGhpcy5fYWRkcmVzc1UsXHJcbiAgICAgICAgICAgIGFkZHJlc3NWOiB0aGlzLl9hZGRyZXNzVixcclxuICAgICAgICAgICAgYWRkcmVzc1c6IHRoaXMuX2FkZHJlc3NXLFxyXG4gICAgICAgICAgICBtaW5MT0Q6IHRoaXMuX21pbkxPRCxcclxuICAgICAgICAgICAgbWF4TE9EOiB0aGlzLl9tYXhMT0QsXHJcblxyXG4gICAgICAgICAgICBnbE1pbkZpbHRlcjogMCxcclxuICAgICAgICAgICAgZ2xNYWdGaWx0ZXI6IDAsXHJcbiAgICAgICAgICAgIGdsV3JhcFM6IDAsXHJcbiAgICAgICAgICAgIGdsV3JhcFQ6IDAsXHJcbiAgICAgICAgICAgIGdsV3JhcFI6IDAsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgV2ViR0wyQ21kRnVuY0NyZWF0ZVNhbXBsZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1U2FtcGxlcik7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ3B1U2FtcGxlcikge1xyXG4gICAgICAgICAgICBXZWJHTDJDbWRGdW5jRGVzdHJveVNhbXBsZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1U2FtcGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2dwdVNhbXBsZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=