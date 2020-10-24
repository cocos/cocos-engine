(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../define.js", "../texture.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../define.js"), require("../texture.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.texture, global.webgl2Commands);
    global.webgl2Texture = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _texture, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Texture = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Texture = /*#__PURE__*/function (_GFXTexture) {
    _inherits(WebGL2Texture, _GFXTexture);

    function WebGL2Texture() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Texture);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Texture)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuTexture = null;
      return _this;
    }

    _createClass(WebGL2Texture, [{
      key: "initialize",
      value: function initialize(info) {
        if ('texture' in info) {
          console.log('WebGL2 does not support texture view.');
          return false;
        }

        this._type = info.type;
        this._usage = info.usage;
        this._format = info.format;
        this._width = info.width;
        this._height = info.height;
        this._depth = info.depth;
        this._layerCount = info.layerCount;
        this._levelCount = info.levelCount;
        this._samples = info.samples;
        this._flags = info.flags;
        this._isPowerOf2 = (0, _texture.IsPowerOf2)(this._width) && (0, _texture.IsPowerOf2)(this._height);
        this._size = (0, _define.GFXFormatSurfaceSize)(this._format, this.width, this.height, this.depth, this._levelCount) * this._layerCount;

        if (this._flags & _define.GFXTextureFlagBit.BAKUP_BUFFER) {
          this._buffer = new ArrayBuffer(this._size);
        }

        this._gpuTexture = {
          type: this._type,
          format: this._format,
          usage: this._usage,
          width: this._width,
          height: this._height,
          depth: this._depth,
          size: this._size,
          arrayLayer: this._layerCount,
          mipLevel: this._levelCount,
          samples: this._samples,
          flags: this._flags,
          isPowerOf2: this._isPowerOf2,
          glTarget: 0,
          glInternalFmt: 0,
          glFormat: 0,
          glType: 0,
          glUsage: 0,
          glTexture: null,
          glRenderbuffer: null,
          glWrapS: 0,
          glWrapT: 0,
          glMinFilter: 0,
          glMagFilter: 0
        };
        (0, _webgl2Commands.WebGL2CmdFuncCreateTexture)(this._device, this._gpuTexture);
        this._device.memoryStatus.textureSize += this._size;
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuTexture) {
          (0, _webgl2Commands.WebGL2CmdFuncDestroyTexture)(this._device, this._gpuTexture);
          this._device.memoryStatus.textureSize -= this._size;
          this._gpuTexture = null;
        }

        this._buffer = null;
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        var oldSize = this._size;
        this._width = width;
        this._height = height;
        this._size = (0, _define.GFXFormatSurfaceSize)(this._format, this.width, this.height, this.depth, this._levelCount) * this._layerCount;

        if (this._gpuTexture) {
          this._gpuTexture.width = width;
          this._gpuTexture.height = height;
          this._gpuTexture.size = this._size;
          (0, _webgl2Commands.WebGL2CmdFuncResizeTexture)(this._device, this._gpuTexture);
          this._device.memoryStatus.textureSize -= oldSize;
          this._device.memoryStatus.textureSize += this._size;
        }
      }
    }, {
      key: "gpuTexture",
      get: function get() {
        return this._gpuTexture;
      }
    }]);

    return WebGL2Texture;
  }(_texture.GFXTexture);

  _exports.WebGL2Texture = WebGL2Texture;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItdGV4dHVyZS50cyJdLCJuYW1lcyI6WyJXZWJHTDJUZXh0dXJlIiwiX2dwdVRleHR1cmUiLCJpbmZvIiwiY29uc29sZSIsImxvZyIsIl90eXBlIiwidHlwZSIsIl91c2FnZSIsInVzYWdlIiwiX2Zvcm1hdCIsImZvcm1hdCIsIl93aWR0aCIsIndpZHRoIiwiX2hlaWdodCIsImhlaWdodCIsIl9kZXB0aCIsImRlcHRoIiwiX2xheWVyQ291bnQiLCJsYXllckNvdW50IiwiX2xldmVsQ291bnQiLCJsZXZlbENvdW50IiwiX3NhbXBsZXMiLCJzYW1wbGVzIiwiX2ZsYWdzIiwiZmxhZ3MiLCJfaXNQb3dlck9mMiIsIl9zaXplIiwiR0ZYVGV4dHVyZUZsYWdCaXQiLCJCQUtVUF9CVUZGRVIiLCJfYnVmZmVyIiwiQXJyYXlCdWZmZXIiLCJzaXplIiwiYXJyYXlMYXllciIsIm1pcExldmVsIiwiaXNQb3dlck9mMiIsImdsVGFyZ2V0IiwiZ2xJbnRlcm5hbEZtdCIsImdsRm9ybWF0IiwiZ2xUeXBlIiwiZ2xVc2FnZSIsImdsVGV4dHVyZSIsImdsUmVuZGVyYnVmZmVyIiwiZ2xXcmFwUyIsImdsV3JhcFQiLCJnbE1pbkZpbHRlciIsImdsTWFnRmlsdGVyIiwiX2RldmljZSIsIm1lbW9yeVN0YXR1cyIsInRleHR1cmVTaXplIiwib2xkU2l6ZSIsIkdGWFRleHR1cmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLGE7Ozs7Ozs7Ozs7Ozs7OztZQU1EQyxXLEdBQXdDLEk7Ozs7OztpQ0FFN0JDLEksRUFBb0Q7QUFDbkUsWUFBSSxhQUFhQSxJQUFqQixFQUF1QjtBQUNuQkMsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksdUNBQVo7QUFDQSxpQkFBTyxLQUFQO0FBQ0g7O0FBRUQsYUFBS0MsS0FBTCxHQUFhSCxJQUFJ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R0FBRyxLQUFLdkIsS0FBckI7QUFDQSxhQUFLZixNQUFMLEdBQWNDLEtBQWQ7QUFDQSxhQUFLQyxPQUFMLEdBQWVDLE1BQWY7QUFDQSxhQUFLWSxLQUFMLEdBQWEsa0NBQXFCLEtBQUtqQixPQUExQixFQUFtQyxLQUFLRyxLQUF4QyxFQUErQyxLQUFLRSxNQUFwRCxFQUNULEtBQUtFLEtBREksRUFDRyxLQUFLRyxXQURSLElBQ3VCLEtBQUtGLFdBRHpDOztBQUdBLFlBQUksS0FBS2hCLFdBQVQsRUFBc0I7QUFDbEIsZUFBS0EsV0FBTCxDQUFpQlcsS0FBakIsR0FBeUJBLEtBQXpCO0FBQ0EsZUFBS1gsV0FBTCxDQUFpQmEsTUFBakIsR0FBMEJBLE1BQTFCO0FBQ0EsZUFBS2IsV0FBTCxDQUFpQjhCLElBQWpCLEdBQXdCLEtBQUtMLEtBQTdCO0FBQ0EsMERBQTJCLEtBQUtvQixPQUFoQyxFQUF5RCxLQUFLN0MsV0FBOUQ7QUFDQSxlQUFLNkMsT0FBTCxDQUFhQyxZQUFiLENBQTBCQyxXQUExQixJQUF5Q0MsT0FBekM7QUFDQSxlQUFLSCxPQUFMLENBQWFDLFlBQWIsQ0FBMEJDLFdBQTFCLElBQXlDLEtBQUt0QixLQUE5QztBQUNIO0FBQ0o7OzswQkF6Rm9DO0FBQ2pDLGVBQVEsS0FBS3pCLFdBQWI7QUFDSDs7OztJQUo4QmlELG1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYVGV4dHVyZUZsYWdCaXQsIEdGWEZvcm1hdFN1cmZhY2VTaXplIH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYVGV4dHVyZSwgR0ZYVGV4dHVyZUluZm8sIElzUG93ZXJPZjIsIEdGWFRleHR1cmVWaWV3SW5mbyB9IGZyb20gJy4uL3RleHR1cmUnO1xyXG5pbXBvcnQgeyBXZWJHTDJDbWRGdW5jQ3JlYXRlVGV4dHVyZSwgV2ViR0wyQ21kRnVuY0Rlc3Ryb3lUZXh0dXJlLCBXZWJHTDJDbWRGdW5jUmVzaXplVGV4dHVyZSB9IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmRzJztcclxuaW1wb3J0IHsgV2ViR0wyRGV2aWNlIH0gZnJvbSAnLi93ZWJnbDItZGV2aWNlJztcclxuaW1wb3J0IHsgSVdlYkdMMkdQVVRleHR1cmUgfSBmcm9tICcuL3dlYmdsMi1ncHUtb2JqZWN0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyVGV4dHVyZSBleHRlbmRzIEdGWFRleHR1cmUge1xyXG5cclxuICAgIGdldCBncHVUZXh0dXJlICgpOiBJV2ViR0wyR1BVVGV4dHVyZSB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVUZXh0dXJlITtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ncHVUZXh0dXJlOiBJV2ViR0wyR1BVVGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhUZXh0dXJlSW5mbyB8IEdGWFRleHR1cmVWaWV3SW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICgndGV4dHVyZScgaW4gaW5mbykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnV2ViR0wyIGRvZXMgbm90IHN1cHBvcnQgdGV4dHVyZSB2aWV3LicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gaW5mby50eXBlO1xyXG4gICAgICAgIHRoaXMuX3VzYWdlID0gaW5mby51c2FnZTtcclxuICAgICAgICB0aGlzLl9mb3JtYXQgPSBpbmZvLmZvcm1hdDtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IGluZm8ud2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaW5mby5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fZGVwdGggPSBpbmZvLmRlcHRoO1xyXG4gICAgICAgIHRoaXMuX2xheWVyQ291bnQgPSBpbmZvLmxheWVyQ291bnQ7XHJcbiAgICAgICAgdGhpcy5fbGV2ZWxDb3VudCA9IGluZm8ubGV2ZWxDb3VudDtcclxuICAgICAgICB0aGlzLl9zYW1wbGVzID0gaW5mby5zYW1wbGVzO1xyXG4gICAgICAgIHRoaXMuX2ZsYWdzID0gaW5mby5mbGFncztcclxuICAgICAgICB0aGlzLl9pc1Bvd2VyT2YyID0gSXNQb3dlck9mMih0aGlzLl93aWR0aCkgJiYgSXNQb3dlck9mMih0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSBHRlhGb3JtYXRTdXJmYWNlU2l6ZSh0aGlzLl9mb3JtYXQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmRlcHRoLCB0aGlzLl9sZXZlbENvdW50KSAqIHRoaXMuX2xheWVyQ291bnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9mbGFncyAmIEdGWFRleHR1cmVGbGFnQml0LkJBS1VQX0JVRkZFUikge1xyXG4gICAgICAgICAgICB0aGlzLl9idWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5fc2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ncHVUZXh0dXJlID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IHRoaXMuX2Zvcm1hdCxcclxuICAgICAgICAgICAgdXNhZ2U6IHRoaXMuX3VzYWdlLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICBkZXB0aDogdGhpcy5fZGVwdGgsXHJcbiAgICAgICAgICAgIHNpemU6IHRoaXMuX3NpemUsXHJcbiAgICAgICAgICAgIGFycmF5TGF5ZXI6IHRoaXMuX2xheWVyQ291bnQsXHJcbiAgICAgICAgICAgIG1pcExldmVsOiB0aGlzLl9sZXZlbENvdW50LFxyXG4gICAgICAgICAgICBzYW1wbGVzOiB0aGlzLl9zYW1wbGVzLFxyXG4gICAgICAgICAgICBmbGFnczogdGhpcy5fZmxhZ3MsXHJcbiAgICAgICAgICAgIGlzUG93ZXJPZjI6IHRoaXMuX2lzUG93ZXJPZjIsXHJcblxyXG4gICAgICAgICAgICBnbFRhcmdldDogMCxcclxuICAgICAgICAgICAgZ2xJbnRlcm5hbEZtdDogMCxcclxuICAgICAgICAgICAgZ2xGb3JtYXQ6IDAsXHJcbiAgICAgICAgICAgIGdsVHlwZTogMCxcclxuICAgICAgICAgICAgZ2xVc2FnZTogMCxcclxuICAgICAgICAgICAgZ2xUZXh0dXJlOiBudWxsLFxyXG4gICAgICAgICAgICBnbFJlbmRlcmJ1ZmZlcjogbnVsbCxcclxuICAgICAgICAgICAgZ2xXcmFwUzogMCxcclxuICAgICAgICAgICAgZ2xXcmFwVDogMCxcclxuICAgICAgICAgICAgZ2xNaW5GaWx0ZXI6IDAsXHJcbiAgICAgICAgICAgIGdsTWFnRmlsdGVyOiAwLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFdlYkdMMkNtZEZ1bmNDcmVhdGVUZXh0dXJlKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsIHRoaXMuX2dwdVRleHR1cmUpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXZpY2UubWVtb3J5U3RhdHVzLnRleHR1cmVTaXplICs9IHRoaXMuX3NpemU7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ3B1VGV4dHVyZSkge1xyXG4gICAgICAgICAgICBXZWJHTDJDbWRGdW5jRGVzdHJveVRleHR1cmUodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1VGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMudGV4dHVyZVNpemUgLT0gdGhpcy5fc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5fZ3B1VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2l6ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb2xkU2l6ZSA9IHRoaXMuX3NpemU7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fc2l6ZSA9IEdGWEZvcm1hdFN1cmZhY2VTaXplKHRoaXMuX2Zvcm1hdCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuZGVwdGgsIHRoaXMuX2xldmVsQ291bnQpICogdGhpcy5fbGF5ZXJDb3VudDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2dwdVRleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ3B1VGV4dHVyZS53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9ncHVUZXh0dXJlLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5fZ3B1VGV4dHVyZS5zaXplID0gdGhpcy5fc2l6ZTtcclxuICAgICAgICAgICAgV2ViR0wyQ21kRnVuY1Jlc2l6ZVRleHR1cmUodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1VGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5tZW1vcnlTdGF0dXMudGV4dHVyZVNpemUgLT0gb2xkU2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5fZGV2aWNlLm1lbW9yeVN0YXR1cy50ZXh0dXJlU2l6ZSArPSB0aGlzLl9zaXplO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=