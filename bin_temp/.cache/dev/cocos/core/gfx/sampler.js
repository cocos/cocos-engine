(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define);
    global.sampler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXSampler = _exports.GFXSamplerInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXSamplerInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXSamplerInfo() {
    var minFilter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXFilter.LINEAR;
    var magFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXFilter.LINEAR;
    var mipFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXFilter.NONE;
    var addressU = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _define.GFXAddress.WRAP;
    var addressV = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _define.GFXAddress.WRAP;
    var addressW = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _define.GFXAddress.WRAP;
    var maxAnisotropy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 16;
    var cmpFunc = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _define.GFXComparisonFunc.NEVER;
    var borderColor = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : new _define.GFXColor();
    var minLOD = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
    var maxLOD = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;
    var mipLODBias = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0.0;

    _classCallCheck(this, GFXSamplerInfo);

    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this.mipFilter = mipFilter;
    this.addressU = addressU;
    this.addressV = addressV;
    this.addressW = addressW;
    this.maxAnisotropy = maxAnisotropy;
    this.cmpFunc = cmpFunc;
    this.borderColor = borderColor;
    this.minLOD = minLOD;
    this.maxLOD = maxLOD;
    this.mipLODBias = mipLODBias;
  };
  /**
   * @en GFX sampler.
   * @zh GFX 采样器。
   */


  _exports.GFXSamplerInfo = GFXSamplerInfo;

  var GFXSampler = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXSampler, _GFXObject);

    _createClass(GFXSampler, [{
      key: "minFilter",
      get: function get() {
        return this._minFilter;
      }
    }, {
      key: "magFilter",
      get: function get() {
        return this._magFilter;
      }
    }, {
      key: "mipFilter",
      get: function get() {
        return this._mipFilter;
      }
    }, {
      key: "addressU",
      get: function get() {
        return this._addressU;
      }
    }, {
      key: "addressV",
      get: function get() {
        return this._addressV;
      }
    }, {
      key: "addressW",
      get: function get() {
        return this._addressW;
      }
    }, {
      key: "maxAnisotropy",
      get: function get() {
        return this._maxAnisotropy;
      }
    }, {
      key: "cmpFunc",
      get: function get() {
        return this._cmpFunc;
      }
    }, {
      key: "borderColor",
      get: function get() {
        return this._borderColor;
      }
    }, {
      key: "minLOD",
      get: function get() {
        return this._minLOD;
      }
    }, {
      key: "maxLOD",
      get: function get() {
        return this._maxLOD;
      }
    }, {
      key: "mipLODBias",
      get: function get() {
        return this._mipLODBias;
      }
    }]);

    function GFXSampler(device) {
      var _this;

      _classCallCheck(this, GFXSampler);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXSampler).call(this, _define.GFXObjectType.SAMPLER));
      _this._device = void 0;
      _this._minFilter = _define.GFXFilter.LINEAR;
      _this._magFilter = _define.GFXFilter.LINEAR;
      _this._mipFilter = _define.GFXFilter.NONE;
      _this._addressU = _define.GFXAddress.WRAP;
      _this._addressV = _define.GFXAddress.WRAP;
      _this._addressW = _define.GFXAddress.WRAP;
      _this._maxAnisotropy = 16;
      _this._cmpFunc = _define.GFXComparisonFunc.NEVER;
      _this._borderColor = new _define.GFXColor();
      _this._minLOD = 0;
      _this._maxLOD = 0;
      _this._mipLODBias = 0.0;
      _this._device = device;
      return _this;
    }

    return GFXSampler;
  }(_define.GFXObject);

  _exports.GFXSampler = GFXSampler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3NhbXBsZXIudHMiXSwibmFtZXMiOlsiR0ZYU2FtcGxlckluZm8iLCJtaW5GaWx0ZXIiLCJHRlhGaWx0ZXIiLCJMSU5FQVIiLCJtYWdGaWx0ZXIiLCJtaXBGaWx0ZXIiLCJOT05FIiwiYWRkcmVzc1UiLCJHRlhBZGRyZXNzIiwiV1JBUCIsImFkZHJlc3NWIiwiYWRkcmVzc1ciLCJtYXhBbmlzb3Ryb3B5IiwiY21wRnVuYyIsIkdGWENvbXBhcmlzb25GdW5jIiwiTkVWRVIiLCJib3JkZXJDb2xvciIsIkdGWENvbG9yIiwibWluTE9EIiwibWF4TE9EIiwibWlwTE9EQmlhcyIsIkdGWFNhbXBsZXIiLCJfbWluRmlsdGVyIiwiX21hZ0ZpbHRlciIsIl9taXBGaWx0ZXIiLCJfYWRkcmVzc1UiLCJfYWRkcmVzc1YiLCJfYWRkcmVzc1ciLCJfbWF4QW5pc290cm9weSIsIl9jbXBGdW5jIiwiX2JvcmRlckNvbG9yIiwiX21pbkxPRCIsIl9tYXhMT0QiLCJfbWlwTE9EQmlhcyIsImRldmljZSIsIkdGWE9iamVjdFR5cGUiLCJTQU1QTEVSIiwiX2RldmljZSIsIkdGWE9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFPYUEsYyxHQUNxQjtBQUU5Qiw0QkFhRTtBQUFBLFFBWlNDLFNBWVQsdUVBWmdDQyxrQkFBVUMsTUFZMUM7QUFBQSxRQVhTQyxTQVdULHVFQVhnQ0Ysa0JBQVVDLE1BVzFDO0FBQUEsUUFWU0UsU0FVVCx1RUFWZ0NILGtCQUFVSSxJQVUxQztBQUFBLFFBVFNDLFFBU1QsdUVBVGdDQyxtQkFBV0MsSUFTM0M7QUFBQSxRQVJTQyxRQVFULHVFQVJnQ0YsbUJBQVdDLElBUTNDO0FBQUEsUUFQU0UsUUFPVCx1RUFQZ0NILG1CQUFXQyxJQU8zQztBQUFBLFFBTlNHLGFBTVQsdUVBTmlDLEVBTWpDO0FBQUEsUUFMU0MsT0FLVCx1RUFMc0NDLDBCQUFrQkMsS0FLeEQ7QUFBQSxRQUpTQyxXQUlULHVFQUppQyxJQUFJQyxnQkFBSixFQUlqQztBQUFBLFFBSFNDLE1BR1QsdUVBSDBCLENBRzFCO0FBQUEsUUFGU0MsTUFFVCwwRUFGMEIsQ0FFMUI7QUFBQSxRQURTQyxVQUNULDBFQUQ4QixHQUM5Qjs7QUFBQTs7QUFBQSxTQVpTbkIsU0FZVCxHQVpTQSxTQVlUO0FBQUEsU0FYU0csU0FXVCxHQVhTQSxTQVdUO0FBQUEsU0FWU0MsU0FVVCxHQVZTQSxTQVVUO0FBQUEsU0FUU0UsUUFTVCxHQVRTQSxRQVNUO0FBQUEsU0FSU0csUUFRVCxHQVJTQSxRQVFUO0FBQUEsU0FQU0MsUUFPVCxHQVBTQSxRQU9UO0FBQUEsU0FOU0MsYUFNVCxHQU5TQSxhQU1UO0FBQUEsU0FMU0MsT0FLVCxHQUxTQSxPQUtUO0FBQUEsU0FKU0csV0FJVCxHQUpTQSxXQUlUO0FBQUEsU0FIU0UsTUFHVCxHQUhTQSxNQUdUO0FBQUEsU0FGU0MsTUFFVCxHQUZTQSxNQUVUO0FBQUEsU0FEU0MsVUFDVCxHQURTQSxVQUNUO0FBQUUsRztBQUdSOzs7Ozs7OztNQUlzQkMsVTs7Ozs7MEJBRUQ7QUFBRSxlQUFPLEtBQUtDLFVBQVo7QUFBeUI7OzswQkFDM0I7QUFBRSxlQUFPLEtBQUtDLFVBQVo7QUFBeUI7OzswQkFDM0I7QUFBRSxlQUFPLEtBQUtDLFVBQVo7QUFBeUI7OzswQkFDNUI7QUFBRSxlQUFPLEtBQUtDLFNBQVo7QUFBd0I7OzswQkFDMUI7QUFBRSxlQUFPLEtBQUtDLFNBQVo7QUFBd0I7OzswQkFDMUI7QUFBRSxlQUFPLEtBQUtDLFNBQVo7QUFBd0I7OzswQkFDckI7QUFBRSxlQUFPLEtBQUtDLGNBQVo7QUFBNkI7OzswQkFDckM7QUFBRSxlQUFPLEtBQUtDLFFBQVo7QUFBdUI7OzswQkFDckI7QUFBRSxlQUFPLEtBQUtDLFlBQVo7QUFBMkI7OzswQkFDbEM7QUFBRSxlQUFPLEtBQUtDLE9BQVo7QUFBc0I7OzswQkFDeEI7QUFBRSxlQUFPLEtBQUtDLE9BQVo7QUFBc0I7OzswQkFDcEI7QUFBRSxlQUFPLEtBQUtDLFdBQVo7QUFBMEI7OztBQWlCOUMsd0JBQWFDLE1BQWIsRUFBZ0M7QUFBQTs7QUFBQTs7QUFDNUIsc0ZBQU1DLHNCQUFjQyxPQUFwQjtBQUQ0QixZQWZ0QkMsT0Flc0I7QUFBQSxZQWJ0QmYsVUFhc0IsR0FiRXBCLGtCQUFVQyxNQWFaO0FBQUEsWUFadEJvQixVQVlzQixHQVpFckIsa0JBQVVDLE1BWVo7QUFBQSxZQVh0QnFCLFVBV3NCLEdBWEV0QixrQkFBVUksSUFXWjtBQUFBLFlBVnRCbUIsU0FVc0IsR0FWRWpCLG1CQUFXQyxJQVViO0FBQUEsWUFUdEJpQixTQVNzQixHQVRFbEIsbUJBQVdDLElBU2I7QUFBQSxZQVJ0QmtCLFNBUXNCLEdBUkVuQixtQkFBV0MsSUFRYjtBQUFBLFlBUHRCbUIsY0FPc0IsR0FQRyxFQU9IO0FBQUEsWUFOdEJDLFFBTXNCLEdBTlFmLDBCQUFrQkMsS0FNMUI7QUFBQSxZQUx0QmUsWUFLc0IsR0FMRyxJQUFJYixnQkFBSixFQUtIO0FBQUEsWUFKdEJjLE9BSXNCLEdBSkosQ0FJSTtBQUFBLFlBSHRCQyxPQUdzQixHQUhKLENBR0k7QUFBQSxZQUZ0QkMsV0FFc0IsR0FGQSxHQUVBO0FBRTVCLFlBQUtJLE9BQUwsR0FBZUgsTUFBZjtBQUY0QjtBQUcvQjs7O0lBakNvQ0ksaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWEFkZHJlc3MsIEdGWENvbXBhcmlzb25GdW5jLCBHRlhGaWx0ZXIsIEdGWE9iamVjdCwgR0ZYT2JqZWN0VHlwZSwgR0ZYQ29sb3IgfSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhTYW1wbGVySW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIG1pbkZpbHRlcjogR0ZYRmlsdGVyID0gR0ZYRmlsdGVyLkxJTkVBUixcclxuICAgICAgICBwdWJsaWMgbWFnRmlsdGVyOiBHRlhGaWx0ZXIgPSBHRlhGaWx0ZXIuTElORUFSLFxyXG4gICAgICAgIHB1YmxpYyBtaXBGaWx0ZXI6IEdGWEZpbHRlciA9IEdGWEZpbHRlci5OT05FLFxyXG4gICAgICAgIHB1YmxpYyBhZGRyZXNzVTogR0ZYQWRkcmVzcyA9IEdGWEFkZHJlc3MuV1JBUCxcclxuICAgICAgICBwdWJsaWMgYWRkcmVzc1Y6IEdGWEFkZHJlc3MgPSBHRlhBZGRyZXNzLldSQVAsXHJcbiAgICAgICAgcHVibGljIGFkZHJlc3NXOiBHRlhBZGRyZXNzID0gR0ZYQWRkcmVzcy5XUkFQLFxyXG4gICAgICAgIHB1YmxpYyBtYXhBbmlzb3Ryb3B5OiBudW1iZXIgPSAxNixcclxuICAgICAgICBwdWJsaWMgY21wRnVuYzogR0ZYQ29tcGFyaXNvbkZ1bmMgPSBHRlhDb21wYXJpc29uRnVuYy5ORVZFUixcclxuICAgICAgICBwdWJsaWMgYm9yZGVyQ29sb3I6IEdGWENvbG9yID0gbmV3IEdGWENvbG9yKCksXHJcbiAgICAgICAgcHVibGljIG1pbkxPRDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgbWF4TE9EOiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyBtaXBMT0RCaWFzOiBudW1iZXIgPSAwLjAsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIHNhbXBsZXIuXHJcbiAqIEB6aCBHRlgg6YeH5qC35Zmo44CCXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR0ZYU2FtcGxlciBleHRlbmRzIEdGWE9iamVjdCB7XHJcblxyXG4gICAgZ2V0IG1pbkZpbHRlciAoKSB7IHJldHVybiB0aGlzLl9taW5GaWx0ZXI7IH1cclxuICAgIGdldCBtYWdGaWx0ZXIgKCkgeyByZXR1cm4gdGhpcy5fbWFnRmlsdGVyOyB9XHJcbiAgICBnZXQgbWlwRmlsdGVyICgpIHsgcmV0dXJuIHRoaXMuX21pcEZpbHRlcjsgfVxyXG4gICAgZ2V0IGFkZHJlc3NVICgpIHsgcmV0dXJuIHRoaXMuX2FkZHJlc3NVOyB9XHJcbiAgICBnZXQgYWRkcmVzc1YgKCkgeyByZXR1cm4gdGhpcy5fYWRkcmVzc1Y7IH1cclxuICAgIGdldCBhZGRyZXNzVyAoKSB7IHJldHVybiB0aGlzLl9hZGRyZXNzVzsgfVxyXG4gICAgZ2V0IG1heEFuaXNvdHJvcHkgKCkgeyByZXR1cm4gdGhpcy5fbWF4QW5pc290cm9weTsgfVxyXG4gICAgZ2V0IGNtcEZ1bmMgKCkgeyByZXR1cm4gdGhpcy5fY21wRnVuYzsgfVxyXG4gICAgZ2V0IGJvcmRlckNvbG9yICgpIHsgcmV0dXJuIHRoaXMuX2JvcmRlckNvbG9yOyB9XHJcbiAgICBnZXQgbWluTE9EICgpIHsgcmV0dXJuIHRoaXMuX21pbkxPRDsgfVxyXG4gICAgZ2V0IG1heExPRCAoKSB7IHJldHVybiB0aGlzLl9tYXhMT0Q7IH1cclxuICAgIGdldCBtaXBMT0RCaWFzICgpIHsgcmV0dXJuIHRoaXMuX21pcExPREJpYXM7IH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfbWluRmlsdGVyOiBHRlhGaWx0ZXIgPSBHRlhGaWx0ZXIuTElORUFSO1xyXG4gICAgcHJvdGVjdGVkIF9tYWdGaWx0ZXI6IEdGWEZpbHRlciA9IEdGWEZpbHRlci5MSU5FQVI7XHJcbiAgICBwcm90ZWN0ZWQgX21pcEZpbHRlcjogR0ZYRmlsdGVyID0gR0ZYRmlsdGVyLk5PTkU7XHJcbiAgICBwcm90ZWN0ZWQgX2FkZHJlc3NVOiBHRlhBZGRyZXNzID0gR0ZYQWRkcmVzcy5XUkFQO1xyXG4gICAgcHJvdGVjdGVkIF9hZGRyZXNzVjogR0ZYQWRkcmVzcyA9IEdGWEFkZHJlc3MuV1JBUDtcclxuICAgIHByb3RlY3RlZCBfYWRkcmVzc1c6IEdGWEFkZHJlc3MgPSBHRlhBZGRyZXNzLldSQVA7XHJcbiAgICBwcm90ZWN0ZWQgX21heEFuaXNvdHJvcHk6IG51bWJlciA9IDE2O1xyXG4gICAgcHJvdGVjdGVkIF9jbXBGdW5jOiBHRlhDb21wYXJpc29uRnVuYyA9IEdGWENvbXBhcmlzb25GdW5jLk5FVkVSO1xyXG4gICAgcHJvdGVjdGVkIF9ib3JkZXJDb2xvcjogR0ZYQ29sb3IgPSBuZXcgR0ZYQ29sb3IoKTtcclxuICAgIHByb3RlY3RlZCBfbWluTE9EOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tYXhMT0Q6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX21pcExPREJpYXM6IG51bWJlciA9IDAuMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZGV2aWNlOiBHRlhEZXZpY2UpIHtcclxuICAgICAgICBzdXBlcihHRlhPYmplY3RUeXBlLlNBTVBMRVIpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYU2FtcGxlckluZm8pOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXN0cm95ICgpOiB2b2lkO1xyXG59XHJcbiJdfQ==