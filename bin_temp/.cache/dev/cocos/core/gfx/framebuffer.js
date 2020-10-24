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
    global.framebuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXFramebuffer = _exports.GFXFramebufferInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXFramebufferInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXFramebufferInfo(renderPass) {
    var colorTextures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var depthStencilTexture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var colorMipmapLevels = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var depStencilMipmapLevel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, GFXFramebufferInfo);

    this.renderPass = renderPass;
    this.colorTextures = colorTextures;
    this.depthStencilTexture = depthStencilTexture;
    this.colorMipmapLevels = colorMipmapLevels;
    this.depStencilMipmapLevel = depStencilMipmapLevel;
  };
  /**
   * @en GFX frame buffer.
   * @zh GFX 帧缓冲。
   */


  _exports.GFXFramebufferInfo = GFXFramebufferInfo;

  var GFXFramebuffer = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXFramebuffer, _GFXObject);

    _createClass(GFXFramebuffer, [{
      key: "renderPass",

      /**
       * @en Get current render pass.
       * @zh GFX 渲染过程。
       */
      get: function get() {
        return this._renderPass;
      }
      /**
       * @en Get current color views.
       * @zh 颜色纹理视图数组。
       */

    }, {
      key: "colorTextures",
      get: function get() {
        return this._colorTextures;
      }
      /**
       * @en Get current depth stencil views.
       * @zh 深度模板纹理视图。
       */

    }, {
      key: "depthStencilTexture",
      get: function get() {
        return this._depthStencilTexture;
      }
    }]);

    function GFXFramebuffer(device) {
      var _this;

      _classCallCheck(this, GFXFramebuffer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXFramebuffer).call(this, _define.GFXObjectType.FRAMEBUFFER));
      _this._device = void 0;
      _this._renderPass = null;
      _this._colorTextures = [];
      _this._depthStencilTexture = null;
      _this._device = device;
      return _this;
    }

    return GFXFramebuffer;
  }(_define.GFXObject);

  _exports.GFXFramebuffer = GFXFramebuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2ZyYW1lYnVmZmVyLnRzIl0sIm5hbWVzIjpbIkdGWEZyYW1lYnVmZmVySW5mbyIsInJlbmRlclBhc3MiLCJjb2xvclRleHR1cmVzIiwiZGVwdGhTdGVuY2lsVGV4dHVyZSIsImNvbG9yTWlwbWFwTGV2ZWxzIiwiZGVwU3RlbmNpbE1pcG1hcExldmVsIiwiR0ZYRnJhbWVidWZmZXIiLCJfcmVuZGVyUGFzcyIsIl9jb2xvclRleHR1cmVzIiwiX2RlcHRoU3RlbmNpbFRleHR1cmUiLCJkZXZpY2UiLCJHRlhPYmplY3RUeXBlIiwiRlJBTUVCVUZGRVIiLCJfZGV2aWNlIiwiR0ZYT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNhQSxrQixHQUNxQjtBQUU5Qiw4QkFDV0MsVUFEWCxFQU1FO0FBQUEsUUFKU0MsYUFJVCx1RUFKZ0QsRUFJaEQ7QUFBQSxRQUhTQyxtQkFHVCx1RUFIa0QsSUFHbEQ7QUFBQSxRQUZTQyxpQkFFVCx1RUFGdUMsRUFFdkM7QUFBQSxRQURTQyxxQkFDVCx1RUFEeUMsQ0FDekM7O0FBQUE7O0FBQUEsU0FMU0osVUFLVCxHQUxTQSxVQUtUO0FBQUEsU0FKU0MsYUFJVCxHQUpTQSxhQUlUO0FBQUEsU0FIU0MsbUJBR1QsR0FIU0EsbUJBR1Q7QUFBQSxTQUZTQyxpQkFFVCxHQUZTQSxpQkFFVDtBQUFBLFNBRFNDLHFCQUNULEdBRFNBLHFCQUNUO0FBQUUsRztBQUdSOzs7Ozs7OztNQUlzQkMsYzs7Ozs7O0FBRWxCOzs7OzBCQUl3QztBQUNwQyxlQUFPLEtBQUtDLFdBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUltRDtBQUMvQyxlQUFPLEtBQUtDLGNBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlxRDtBQUNqRCxlQUFPLEtBQUtDLG9CQUFaO0FBQ0g7OztBQVVELDRCQUFhQyxNQUFiLEVBQWdDO0FBQUE7O0FBQUE7O0FBQzVCLDBGQUFNQyxzQkFBY0MsV0FBcEI7QUFENEIsWUFSdEJDLE9BUXNCO0FBQUEsWUFOdEJOLFdBTXNCLEdBTmMsSUFNZDtBQUFBLFlBSnRCQyxjQUlzQixHQUprQixFQUlsQjtBQUFBLFlBRnRCQyxvQkFFc0IsR0FGb0IsSUFFcEI7QUFFNUIsWUFBS0ksT0FBTCxHQUFlSCxNQUFmO0FBRjRCO0FBRy9COzs7SUFyQ3dDSSxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYT2JqZWN0LCBHRlhPYmplY3RUeXBlIH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcbmltcG9ydCB7IEdGWFJlbmRlclBhc3MgfSBmcm9tICcuL3JlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgR0ZYVGV4dHVyZSB9IGZyb20gJy4vdGV4dHVyZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYRnJhbWVidWZmZXJJbmZvIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcyxcclxuICAgICAgICBwdWJsaWMgY29sb3JUZXh0dXJlczogKEdGWFRleHR1cmUgfCBudWxsKVtdID0gW10sIC8vIHBhc3MgbnVsbCB0byB1c2Ugc3dhcGNoYWluIGJ1ZmZlcnNcclxuICAgICAgICBwdWJsaWMgZGVwdGhTdGVuY2lsVGV4dHVyZTogR0ZYVGV4dHVyZSB8IG51bGwgPSBudWxsLFxyXG4gICAgICAgIHB1YmxpYyBjb2xvck1pcG1hcExldmVsczogbnVtYmVyW10gPSBbXSxcclxuICAgICAgICBwdWJsaWMgZGVwU3RlbmNpbE1pcG1hcExldmVsOiBudW1iZXIgPSAwLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBmcmFtZSBidWZmZXIuXHJcbiAqIEB6aCBHRlgg5bin57yT5Yay44CCXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR0ZYRnJhbWVidWZmZXIgZXh0ZW5kcyBHRlhPYmplY3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IHJlbmRlciBwYXNzLlxyXG4gICAgICogQHpoIEdGWCDmuLLmn5Pov4fnqIvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCByZW5kZXJQYXNzICgpOiBHRlhSZW5kZXJQYXNzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyUGFzcyE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGN1cnJlbnQgY29sb3Igdmlld3MuXHJcbiAgICAgKiBAemgg6aKc6Imy57q555CG6KeG5Zu+5pWw57uE44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgY29sb3JUZXh0dXJlcyAoKTogKEdGWFRleHR1cmUgfCBudWxsKVtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3JUZXh0dXJlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCBkZXB0aCBzdGVuY2lsIHZpZXdzLlxyXG4gICAgICogQHpoIOa3seW6puaooeadv+e6ueeQhuinhuWbvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGRlcHRoU3RlbmNpbFRleHR1cmUgKCk6IEdGWFRleHR1cmUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVwdGhTdGVuY2lsVGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfY29sb3JUZXh0dXJlczogKEdGWFRleHR1cmUgfCBudWxsKVtdID0gW107XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXB0aFN0ZW5jaWxUZXh0dXJlOiBHRlhUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoR0ZYT2JqZWN0VHlwZS5GUkFNRUJVRkZFUik7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpbml0aWFsaXplIChpbmZvOiBHRlhGcmFtZWJ1ZmZlckluZm8pOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXN0cm95ICgpOiB2b2lkO1xyXG59XHJcbiJdfQ==