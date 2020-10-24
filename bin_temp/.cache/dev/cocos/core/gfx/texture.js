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
    global.texture = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.IsPowerOf2 = IsPowerOf2;
  _exports.GFXTexture = _exports.GFXTextureViewInfo = _exports.GFXTextureInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXTextureInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXTextureInfo(type) {
    var usage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXTextureUsageBit.NONE;
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXFormat.UNKNOWN;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var flags = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _define.GFXTextureFlagBit.NONE;
    var layerCount = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
    var levelCount = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
    var samples = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : _define.GFXSampleCount.X1;
    var depth = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 1;

    _classCallCheck(this, GFXTextureInfo);

    this.type = type;
    this.usage = usage;
    this.format = format;
    this.width = width;
    this.height = height;
    this.flags = flags;
    this.layerCount = layerCount;
    this.levelCount = levelCount;
    this.samples = samples;
    this.depth = depth;
  };

  _exports.GFXTextureInfo = GFXTextureInfo;

  var GFXTextureViewInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXTextureViewInfo(texture) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXTextureType.TEX2D;
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXFormat.UNKNOWN;
    var baseLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var levelCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var baseLayer = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var layerCount = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;

    _classCallCheck(this, GFXTextureViewInfo);

    this.texture = texture;
    this.type = type;
    this.format = format;
    this.baseLevel = baseLevel;
    this.levelCount = levelCount;
    this.baseLayer = baseLayer;
    this.layerCount = layerCount;
  };

  _exports.GFXTextureViewInfo = GFXTextureViewInfo;

  function IsPowerOf2(x) {
    return x > 0 && (x & x - 1) === 0;
  }
  /**
   * @en GFX texture.
   * @zh GFX 纹理。
   */


  var GFXTexture = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXTexture, _GFXObject);

    _createClass(GFXTexture, [{
      key: "type",

      /**
       * @en Get texture type.
       * @zh 纹理类型。
       */
      get: function get() {
        return this._type;
      }
      /**
       * @en Get texture usage.
       * @zh 纹理使用方式。
       */

    }, {
      key: "usage",
      get: function get() {
        return this._usage;
      }
      /**
       * @en Get texture format.
       * @zh 纹理格式。
       */

    }, {
      key: "format",
      get: function get() {
        return this._format;
      }
      /**
       * @en Get texture width.
       * @zh 纹理宽度。
       */

    }, {
      key: "width",
      get: function get() {
        return this._width;
      }
      /**
       * @en Get texture height.
       * @zh 纹理高度。
       */

    }, {
      key: "height",
      get: function get() {
        return this._height;
      }
      /**
       * @en Get texture depth.
       * @zh 纹理深度。
       */

    }, {
      key: "depth",
      get: function get() {
        return this._depth;
      }
      /**
       * @en Get texture array layer.
       * @zh 纹理数组层数。
       */

    }, {
      key: "layerCount",
      get: function get() {
        return this._layerCount;
      }
      /**
       * @en Get texture mip level.
       * @zh 纹理 mip 层级数。
       */

    }, {
      key: "levelCount",
      get: function get() {
        return this._levelCount;
      }
      /**
       * @en Get texture samples.
       * @zh 纹理采样数。
       */

    }, {
      key: "samples",
      get: function get() {
        return this._samples;
      }
      /**
       * @en Get texture flags.
       * @zh 纹理标识位。
       */

    }, {
      key: "flags",
      get: function get() {
        return this._flags;
      }
      /**
       * @en Get texture size.
       * @zh 纹理大小。
       */

    }, {
      key: "size",
      get: function get() {
        return this._size;
      }
      /**
       * @en Get texture buffer.
       * @zh 纹理缓冲。
       */

    }, {
      key: "buffer",
      get: function get() {
        return this._buffer;
      }
    }]);

    function GFXTexture(device) {
      var _this;

      _classCallCheck(this, GFXTexture);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXTexture).call(this, _define.GFXObjectType.TEXTURE));
      _this._device = void 0;
      _this._type = _define.GFXTextureType.TEX2D;
      _this._usage = _define.GFXTextureUsageBit.NONE;
      _this._format = _define.GFXFormat.UNKNOWN;
      _this._width = 0;
      _this._height = 0;
      _this._depth = 1;
      _this._layerCount = 1;
      _this._levelCount = 1;
      _this._samples = _define.GFXSampleCount.X1;
      _this._flags = _define.GFXTextureFlagBit.NONE;
      _this._isPowerOf2 = false;
      _this._size = 0;
      _this._buffer = null;
      _this._device = device;
      return _this;
    }

    return GFXTexture;
  }(_define.GFXObject);

  _exports.GFXTexture = GFXTexture;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3RleHR1cmUudHMiXSwibmFtZXMiOlsiR0ZYVGV4dHVyZUluZm8iLCJ0eXBlIiwidXNhZ2UiLCJHRlhUZXh0dXJlVXNhZ2VCaXQiLCJOT05FIiwiZm9ybWF0IiwiR0ZYRm9ybWF0IiwiVU5LTk9XTiIsIndpZHRoIiwiaGVpZ2h0IiwiZmxhZ3MiLCJHRlhUZXh0dXJlRmxhZ0JpdCIsImxheWVyQ291bnQiLCJsZXZlbENvdW50Iiwic2FtcGxlcyIsIkdGWFNhbXBsZUNvdW50IiwiWDEiLCJkZXB0aCIsIkdGWFRleHR1cmVWaWV3SW5mbyIsInRleHR1cmUiLCJHRlhUZXh0dXJlVHlwZSIsIlRFWDJEIiwiYmFzZUxldmVsIiwiYmFzZUxheWVyIiwiSXNQb3dlck9mMiIsIngiLCJHRlhUZXh0dXJlIiwiX3R5cGUiLCJfdXNhZ2UiLCJfZm9ybWF0IiwiX3dpZHRoIiwiX2hlaWdodCIsIl9kZXB0aCIsIl9sYXllckNvdW50IiwiX2xldmVsQ291bnQiLCJfc2FtcGxlcyIsIl9mbGFncyIsIl9zaXplIiwiX2J1ZmZlciIsImRldmljZSIsIkdGWE9iamVjdFR5cGUiLCJURVhUVVJFIiwiX2RldmljZSIsIl9pc1Bvd2VyT2YyIiwiR0ZYT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQmFBLGMsR0FDcUI7QUFFOUIsMEJBQ1dDLElBRFgsRUFXRTtBQUFBLFFBVFNDLEtBU1QsdUVBVGtDQywyQkFBbUJDLElBU3JEO0FBQUEsUUFSU0MsTUFRVCx1RUFSNkJDLGtCQUFVQyxPQVF2QztBQUFBLFFBUFNDLEtBT1QsdUVBUHlCLENBT3pCO0FBQUEsUUFOU0MsTUFNVCx1RUFOMEIsQ0FNMUI7QUFBQSxRQUxTQyxLQUtULHVFQUxrQ0MsMEJBQWtCUCxJQUtwRDtBQUFBLFFBSlNRLFVBSVQsdUVBSjhCLENBSTlCO0FBQUEsUUFIU0MsVUFHVCx1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WUFQdEJDLFdBT3NCLEdBUEEsQ0FPQTtBQUFBLFlBTnRCQyxRQU1zQixHQU5LcEIsdUJBQWVDLEVBTXBCO0FBQUEsWUFMdEJvQixNQUtzQixHQUxJekIsMEJBQWtCUCxJQUt0QjtBQUFBLFlBSnRCdUMsV0FJc0IsR0FKQyxLQUlEO0FBQUEsWUFIdEJOLEtBR3NCLEdBSE4sQ0FHTTtBQUFBLFlBRnRCQyxPQUVzQixHQUZRLElBRVI7QUFFNUIsWUFBS0ksT0FBTCxHQUFlSCxNQUFmO0FBRjRCO0FBRy9COzs7SUFySG9DSyxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEdGWEZvcm1hdCxcclxuICAgIEdGWE9iamVjdCxcclxuICAgIEdGWE9iamVjdFR5cGUsXHJcbiAgICBHRlhTYW1wbGVDb3VudCxcclxuICAgIEdGWFRleHR1cmVGbGFnQml0LFxyXG4gICAgR0ZYVGV4dHVyZUZsYWdzLFxyXG4gICAgR0ZYVGV4dHVyZVR5cGUsXHJcbiAgICBHRlhUZXh0dXJlVXNhZ2UsXHJcbiAgICBHRlhUZXh0dXJlVXNhZ2VCaXQsXHJcbn0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYVGV4dHVyZUluZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyB0eXBlOiBHRlhUZXh0dXJlVHlwZSxcclxuICAgICAgICBwdWJsaWMgdXNhZ2U6IEdGWFRleHR1cmVVc2FnZSA9IEdGWFRleHR1cmVVc2FnZUJpdC5OT05FLFxyXG4gICAgICAgIHB1YmxpYyBmb3JtYXQ6IEdGWEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOLFxyXG4gICAgICAgIHB1YmxpYyB3aWR0aDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyBmbGFnczogR0ZYVGV4dHVyZUZsYWdzID0gR0ZYVGV4dHVyZUZsYWdCaXQuTk9ORSxcclxuICAgICAgICBwdWJsaWMgbGF5ZXJDb3VudDogbnVtYmVyID0gMSxcclxuICAgICAgICBwdWJsaWMgbGV2ZWxDb3VudDogbnVtYmVyID0gMSxcclxuICAgICAgICBwdWJsaWMgc2FtcGxlczogR0ZYU2FtcGxlQ291bnQgPSBHRlhTYW1wbGVDb3VudC5YMSxcclxuICAgICAgICBwdWJsaWMgZGVwdGg6IG51bWJlciA9IDEsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhUZXh0dXJlVmlld0luZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyB0ZXh0dXJlOiBHRlhUZXh0dXJlLFxyXG4gICAgICAgIHB1YmxpYyB0eXBlOiBHRlhUZXh0dXJlVHlwZSA9IEdGWFRleHR1cmVUeXBlLlRFWDJELFxyXG4gICAgICAgIHB1YmxpYyBmb3JtYXQ6IEdGWEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOLFxyXG4gICAgICAgIHB1YmxpYyBiYXNlTGV2ZWw6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIGxldmVsQ291bnQ6IG51bWJlciA9IDEsXHJcbiAgICAgICAgcHVibGljIGJhc2VMYXllcjogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgbGF5ZXJDb3VudDogbnVtYmVyID0gMSxcclxuICAgICkge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzUG93ZXJPZjIgKHg6IG51bWJlcik6IGJvb2xlYW57XHJcbiAgICByZXR1cm4geCA+IDAgJiYgKHggJiAoeCAtIDEpKSA9PT0gMDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHRlggdGV4dHVyZS5cclxuICogQHpoIEdGWCDnurnnkIbjgIJcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHRlhUZXh0dXJlIGV4dGVuZHMgR0ZYT2JqZWN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGV4dHVyZSB0eXBlLlxyXG4gICAgICogQHpoIOe6ueeQhuexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdHlwZSAoKTogR0ZYVGV4dHVyZVR5cGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIHVzYWdlLlxyXG4gICAgICogQHpoIOe6ueeQhuS9v+eUqOaWueW8j+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdXNhZ2UgKCk6IEdGWFRleHR1cmVVc2FnZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIGZvcm1hdC5cclxuICAgICAqIEB6aCDnurnnkIbmoLzlvI/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGZvcm1hdCAoKTogR0ZYRm9ybWF0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9ybWF0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIHdpZHRoLlxyXG4gICAgICogQHpoIOe6ueeQhuWuveW6puOAglxyXG4gICAgICovXHJcbiAgICBnZXQgd2lkdGggKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIGhlaWdodC5cclxuICAgICAqIEB6aCDnurnnkIbpq5jluqbjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGhlaWdodCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIGRlcHRoLlxyXG4gICAgICogQHpoIOe6ueeQhua3seW6puOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGVwdGggKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlcHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIGFycmF5IGxheWVyLlxyXG4gICAgICogQHpoIOe6ueeQhuaVsOe7hOWxguaVsOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbGF5ZXJDb3VudCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGV4dHVyZSBtaXAgbGV2ZWwuXHJcbiAgICAgKiBAemgg57q555CGIG1pcCDlsYLnuqfmlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGxldmVsQ291bnQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xldmVsQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHRleHR1cmUgc2FtcGxlcy5cclxuICAgICAqIEB6aCDnurnnkIbph4fmoLfmlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNhbXBsZXMgKCk6IEdGWFNhbXBsZUNvdW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2FtcGxlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGV4dHVyZSBmbGFncy5cclxuICAgICAqIEB6aCDnurnnkIbmoIfor4bkvY3jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGZsYWdzICgpOiBHRlhUZXh0dXJlRmxhZ3Mge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mbGFncztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGV4dHVyZSBzaXplLlxyXG4gICAgICogQHpoIOe6ueeQhuWkp+Wwj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgc2l6ZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGV4dHVyZSBidWZmZXIuXHJcbiAgICAgKiBAemgg57q555CG57yT5Yay44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBidWZmZXIgKCk6IEFycmF5QnVmZmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdHlwZTogR0ZYVGV4dHVyZVR5cGUgPSBHRlhUZXh0dXJlVHlwZS5URVgyRDtcclxuICAgIHByb3RlY3RlZCBfdXNhZ2U6IEdGWFRleHR1cmVVc2FnZSA9IEdGWFRleHR1cmVVc2FnZUJpdC5OT05FO1xyXG4gICAgcHJvdGVjdGVkIF9mb3JtYXQ6IEdGWEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOO1xyXG4gICAgcHJvdGVjdGVkIF93aWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfaGVpZ2h0OiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9kZXB0aDogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfbGF5ZXJDb3VudDogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfbGV2ZWxDb3VudDogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfc2FtcGxlczogR0ZYU2FtcGxlQ291bnQgPSBHRlhTYW1wbGVDb3VudC5YMTtcclxuICAgIHByb3RlY3RlZCBfZmxhZ3M6IEdGWFRleHR1cmVGbGFncyA9IEdGWFRleHR1cmVGbGFnQml0Lk5PTkU7XHJcbiAgICBwcm90ZWN0ZWQgX2lzUG93ZXJPZjI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfc2l6ZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfYnVmZmVyOiBBcnJheUJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuVEVYVFVSRSk7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpbml0aWFsaXplIChpbmZvOiBHRlhUZXh0dXJlSW5mbyk6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGRlc3Ryb3kgKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzaXplIHRleHR1cmUuXHJcbiAgICAgKiBAemgg6YeN572u57q555CG5aSn5bCP44CCXHJcbiAgICAgKiBAcGFyYW0gd2lkdGggVGhlIG5ldyB3aWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgVGhlIG5ldyBoZWlnaHQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZXNpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogdm9pZDtcclxufVxyXG4iXX0=