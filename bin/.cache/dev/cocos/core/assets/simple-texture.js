(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../gfx/define.js", "../gfx/device.js", "../platform/debug.js", "./asset-enum.js", "./texture-base.js", "../default-constants.js", "../global-exports.js", "../platform/macro.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../gfx/define.js"), require("../gfx/device.js"), require("../platform/debug.js"), require("./asset-enum.js"), require("./texture-base.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/macro.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.device, global.debug, global.assetEnum, global.textureBase, global.defaultConstants, global.globalExports, global.macro);
    global.simpleTexture = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _device, _debug, _assetEnum, _textureBase, _defaultConstants, _globalExports, _macro) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SimpleTexture = void 0;

  var _dec, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _regions = [new _define.GFXBufferTextureCopy()];

  function getMipLevel(width, height) {
    var size = Math.max(width, height);
    var level = 0;

    while (size) {
      size >>= 1;
      level++;
    }

    return level;
  }

  function isPOT(n) {
    return n && (n & n - 1) === 0;
  }

  function canGenerateMipmap(device, w, h) {
    var needCheckPOT = device.gfxAPI === _device.GFXAPI.WEBGL;

    if (needCheckPOT) {
      return isPOT(w) && isPOT(h);
    }

    return true;
  }
  /**
   * 简单贴图基类。
   * 简单贴图内部创建了 GFX 贴图和该贴图上的 GFX 贴图视图。
   * 简单贴图允许指定不同的 Mipmap 层级。
   */


  var SimpleTexture = (_dec = (0, _index.ccclass)('cc.SimpleTexture'), _dec(_class = (_temp = /*#__PURE__*/function (_TextureBase) {
    _inherits(SimpleTexture, _TextureBase);

    function SimpleTexture() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, SimpleTexture);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SimpleTexture)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gfxTexture = null;
      _this._mipmapLevel = 1;
      return _this;
    }

    _createClass(SimpleTexture, [{
      key: "getGFXTexture",

      /**
       * 获取此贴图底层的 GFX 贴图对象。
       */
      value: function getGFXTexture() {
        return this._gfxTexture;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._tryDestroyTexture();

        return _get(_getPrototypeOf(SimpleTexture.prototype), "destroy", this).call(this);
      }
      /**
       * 更新 0 级 Mipmap。
       */

    }, {
      key: "updateImage",
      value: function updateImage() {
        this.updateMipmaps(0);
      }
      /**
       * 更新指定层级范围内的 Mipmap。当 Mipmap 数据发生了改变时应调用此方法提交更改。
       * 若指定的层级范围超出了实际已有的层级范围，只有覆盖的那些层级范围会被更新。
       * @param firstLevel 起始层级。
       * @param count 层级数量。
       */

    }, {
      key: "updateMipmaps",
      value: function updateMipmaps() {
        var firstLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var count = arguments.length > 1 ? arguments[1] : undefined;
      }
      /**
       * 上传图像数据到指定层级的 Mipmap 中。
       * 图像的尺寸影响 Mipmap 的更新范围：
       * - 当图像是 `ArrayBuffer` 时，图像的尺寸必须和 Mipmap 的尺寸一致；否则，
       * - 若图像的尺寸与 Mipmap 的尺寸相同，上传后整个 Mipmap 的数据将与图像数据一致；
       * - 若图像的尺寸小于指定层级 Mipmap 的尺寸（不管是长或宽），则从贴图左上角开始，图像尺寸范围内的 Mipmap 会被更新；
       * - 若图像的尺寸超出了指定层级 Mipmap 的尺寸（不管是长或宽），都将引起错误。
       * @param source 图像数据源。
       * @param level Mipmap 层级。
       * @param arrayIndex 数组索引。
       */

    }, {
      key: "uploadData",
      value: function uploadData(source) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var arrayIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        if (!this._gfxTexture || this._gfxTexture.levelCount <= level) {
          return;
        }

        var gfxDevice = this._getGFXDevice();

        if (!gfxDevice) {
          return;
        }

        var region = _regions[0];
        region.texExtent.width = this._gfxTexture.width >> level;
        region.texExtent.height = this._gfxTexture.height >> level;
        region.texSubres.mipLevel = level;
        region.texSubres.baseArrayLayer = arrayIndex;

        if (_defaultConstants.DEV) {
          if (source instanceof HTMLElement) {
            if (source.height > region.texExtent.height || source.width > region.texExtent.width) {
              (0, _debug.error)("Image source(".concat(this.name, ") bounds override."));
            }
          }
        }

        if (ArrayBuffer.isView(source)) {
          gfxDevice.copyBuffersToTexture([source], this._gfxTexture, _regions);
        } else {
          gfxDevice.copyTexImagesToTexture([source], this._gfxTexture, _regions);
        }
      }
    }, {
      key: "_assignImage",
      value: function _assignImage(image, level, arrayIndex) {
        var _this2 = this;

        var upload = function upload() {
          var data = image.data;

          if (!data) {
            return;
          }

          _this2.uploadData(data, level, arrayIndex);

          _this2._checkTextureLoaded();

          if (_macro.macro.CLEANUP_IMAGE_CACHE) {
            _globalExports.legacyCC.loader.release(image);
          }
        };

        if (image.loaded) {
          upload();
        } else {
          image.once('load', function () {
            upload();
          });

          if (!this.isCompressed) {
            var defaultImg = _globalExports.legacyCC.builtinResMgr.get('black-texture').image;

            this.uploadData(defaultImg.data, level, arrayIndex);
          }

          _globalExports.legacyCC.textureUtil.postLoadImage(image);
        }
      }
    }, {
      key: "_checkTextureLoaded",
      value: function _checkTextureLoaded() {
        this._textureReady();
      }
    }, {
      key: "_textureReady",
      value: function _textureReady() {
        this.loaded = true;
        this.emit('load');
      }
      /**
       * Set mipmap level of this texture.
       * The value is passes as presumed info to `this._getGfxTextureCreateInfo()`.
       * @param value The mipmap level.
       */

    }, {
      key: "_setMipmapLevel",
      value: function _setMipmapLevel(value) {
        this._mipmapLevel = value < 1 ? 1 : value;
      }
      /**
       * @en This method is overrided by derived classes to provide GFX texture info.
       * @zh 这个方法被派生类重写以提供GFX纹理信息。
       * @param presumed The presumed GFX texture info.
       */

    }, {
      key: "_getGfxTextureCreateInfo",
      value: function _getGfxTextureCreateInfo(presumed) {
        return null;
      }
    }, {
      key: "_tryReset",
      value: function _tryReset() {
        this._tryDestroyTexture();

        if (this._mipmapLevel === 0) {
          return;
        }

        var device = this._getGFXDevice();

        if (!device) {
          return;
        }

        this._createTexture(device);
      }
    }, {
      key: "_createTexture",
      value: function _createTexture(device) {
        var flags = _define.GFXTextureFlagBit.NONE;

        if (this._mipFilter !== _assetEnum.Filter.NONE && canGenerateMipmap(device, this._width, this._height)) {
          this._mipmapLevel = getMipLevel(this._width, this._height);
          flags = _define.GFXTextureFlagBit.GEN_MIPMAP;
        }

        var textureCreateInfo = this._getGfxTextureCreateInfo({
          usage: _define.GFXTextureUsageBit.SAMPLED | _define.GFXTextureUsageBit.TRANSFER_DST,
          format: this._getGFXFormat(),
          levelCount: this._mipmapLevel,
          flags: flags
        });

        if (!textureCreateInfo) {
          return;
        }

        var texture = device.createTexture(textureCreateInfo);
        this._gfxTexture = texture;
      }
    }, {
      key: "_tryDestroyTexture",
      value: function _tryDestroyTexture() {
        if (this._gfxTexture) {
          this._gfxTexture.destroy();

          this._gfxTexture = null;
        }
      }
    }, {
      key: "mipmapLevel",
      get: function get() {
        return this._mipmapLevel;
      }
    }]);

    return SimpleTexture;
  }(_textureBase.TextureBase), _temp)) || _class);
  _exports.SimpleTexture = SimpleTexture;
  _globalExports.legacyCC.SimpleTexture = SimpleTexture;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3NpbXBsZS10ZXh0dXJlLnRzIl0sIm5hbWVzIjpbIl9yZWdpb25zIiwiR0ZYQnVmZmVyVGV4dHVyZUNvcHkiLCJnZXRNaXBMZXZlbCIsIndpZHRoIiwiaGVpZ2h0Iiwic2l6ZSIsIk1hdGgiLCJtYXgiLCJsZXZlbCIsImlzUE9UIiwibiIsImNhbkdlbmVyYXRlTWlwbWFwIiwiZGV2aWNlIiwidyIsImgiLCJuZWVkQ2hlY2tQT1QiLCJnZnhBUEkiLCJHRlhBUEkiLCJXRUJHTCIsIlNpbXBsZVRleHR1cmUiLCJfZ2Z4VGV4dHVyZSIsIl9taXBtYXBMZXZlbCIsIl90cnlEZXN0cm95VGV4dHVyZSIsInVwZGF0ZU1pcG1hcHMiLCJmaXJzdExldmVsIiwiY291bnQiLCJzb3VyY2UiLCJhcnJheUluZGV4IiwibGV2ZWxDb3VudCIsImdmeERldmljZSIsIl9nZXRHRlhEZXZpY2UiLCJyZWdpb24iLCJ0ZXhFeHRlbnQiLCJ0ZXhTdWJyZXMiLCJtaXBMZXZlbCIsImJhc2VBcnJheUxheWVyIiwiREVWIiwiSFRNTEVsZW1lbnQiLCJuYW1lIiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJjb3B5QnVmZmVyc1RvVGV4dHVyZSIsImNvcHlUZXhJbWFnZXNUb1RleHR1cmUiLCJpbWFnZSIsInVwbG9hZCIsImRhdGEiLCJ1cGxvYWREYXRhIiwiX2NoZWNrVGV4dHVyZUxvYWRlZCIsIm1hY3JvIiwiQ0xFQU5VUF9JTUFHRV9DQUNIRSIsImxlZ2FjeUNDIiwibG9hZGVyIiwicmVsZWFzZSIsImxvYWRlZCIsIm9uY2UiLCJpc0NvbXByZXNzZWQiLCJkZWZhdWx0SW1nIiwiYnVpbHRpblJlc01nciIsImdldCIsInRleHR1cmVVdGlsIiwicG9zdExvYWRJbWFnZSIsIl90ZXh0dXJlUmVhZHkiLCJlbWl0IiwidmFsdWUiLCJwcmVzdW1lZCIsIl9jcmVhdGVUZXh0dXJlIiwiZmxhZ3MiLCJHRlhUZXh0dXJlRmxhZ0JpdCIsIk5PTkUiLCJfbWlwRmlsdGVyIiwiRmlsdGVyIiwiX3dpZHRoIiwiX2hlaWdodCIsIkdFTl9NSVBNQVAiLCJ0ZXh0dXJlQ3JlYXRlSW5mbyIsIl9nZXRHZnhUZXh0dXJlQ3JlYXRlSW5mbyIsInVzYWdlIiwiR0ZYVGV4dHVyZVVzYWdlQml0IiwiU0FNUExFRCIsIlRSQU5TRkVSX0RTVCIsImZvcm1hdCIsIl9nZXRHRlhGb3JtYXQiLCJ0ZXh0dXJlIiwiY3JlYXRlVGV4dHVyZSIsImRlc3Ryb3kiLCJUZXh0dXJlQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsTUFBTUEsUUFBZ0MsR0FBRyxDQUFDLElBQUlDLDRCQUFKLEVBQUQsQ0FBekM7O0FBSUEsV0FBU0MsV0FBVCxDQUFzQkMsS0FBdEIsRUFBcUNDLE1BQXJDLEVBQXFEO0FBQ2pELFFBQUlDLElBQUksR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNKLEtBQVQsRUFBZ0JDLE1BQWhCLENBQVg7QUFDQSxRQUFJSSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxXQUFPSCxJQUFQLEVBQWE7QUFBRUEsTUFBQUEsSUFBSSxLQUFLLENBQVQ7QUFBWUcsTUFBQUEsS0FBSztBQUFLOztBQUNyQyxXQUFPQSxLQUFQO0FBQ0g7O0FBRUQsV0FBU0MsS0FBVCxDQUFnQkMsQ0FBaEIsRUFBMkI7QUFBRSxXQUFPQSxDQUFDLElBQUksQ0FBQ0EsQ0FBQyxHQUFJQSxDQUFDLEdBQUcsQ0FBVixNQUFrQixDQUE5QjtBQUFrQzs7QUFDL0QsV0FBU0MsaUJBQVQsQ0FBNEJDLE1BQTVCLEVBQStDQyxDQUEvQyxFQUEwREMsQ0FBMUQsRUFBcUU7QUFDakUsUUFBTUMsWUFBWSxHQUFHSCxNQUFNLENBQUNJLE1BQVAsS0FBa0JDLGVBQU9DLEtBQTlDOztBQUNBLFFBQUlILFlBQUosRUFBa0I7QUFBRSxhQUFPTixLQUFLLENBQUNJLENBQUQsQ0FBTCxJQUFZSixLQUFLLENBQUNLLENBQUQsQ0FB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SzJELE1BQWQsRUFBc0IsS0FBS0MsT0FBM0IsQ0FBeEQsRUFBNkY7QUFDekYsZUFBS25ELFlBQUwsR0FBb0JuQixXQUFXLENBQUMsS0FBS3FFLE1BQU4sRUFBYyxLQUFLQyxPQUFuQixDQUEvQjtBQUNBTixVQUFBQSxLQUFLLEdBQUdDLDBCQUFrQk0sVUFBMUI7QUFDSDs7QUFFRCxZQUFNQyxpQkFBaUIsR0FBRyxLQUFLQyx3QkFBTCxDQUE4QjtBQUNwREMsVUFBQUEsS0FBSyxFQUFFQywyQkFBbUJDLE9BQW5CLEdBQTZCRCwyQkFBbUJFLFlBREg7QUFFcERDLFVBQUFBLE1BQU0sRUFBRSxLQUFLQyxhQUFMLEVBRjRDO0FBR3BEckQsVUFBQUEsVUFBVSxFQUFFLEtBQUtQLFlBSG1DO0FBSXBENkMsVUFBQUEsS0FBSyxFQUFMQTtBQUpvRCxTQUE5QixDQUExQjs7QUFNQSxZQUFJLENBQUNRLGlCQUFMLEVBQXdCO0FBQ3BCO0FBQ0g7O0FBRUQsWUFBTVEsT0FBTyxHQUFHdEUsTUFBTSxDQUFDdUUsYUFBUCxDQUFxQlQsaUJBQXJCLENBQWhCO0FBRUEsYUFBS3RELFdBQUwsR0FBbUI4RCxPQUFuQjtBQUNIOzs7MkNBRStCO0FBQzVCLFlBQUksS0FBSzlELFdBQVQsRUFBc0I7QUFDbEIsZUFBS0EsV0FBTCxDQUFpQmdFLE9BQWpCOztBQUNBLGVBQUtoRSxXQUFMLEdBQW1CLElBQW5CO0FBQ0g7QUFDSjs7OzBCQXpLa0I7QUFDZixlQUFPLEtBQUtDLFlBQVo7QUFDSDs7OztJQU44QmdFLHdCOztBQWdMbkNuQywwQkFBUy9CLGFBQVQsR0FBeUJBLGFBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBhc3NldFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXJUZXh0dXJlQ29weSwgR0ZYVGV4dHVyZUZsYWdCaXQsIEdGWFRleHR1cmVVc2FnZUJpdCB9IGZyb20gJy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhBUEksIEdGWERldmljZSB9IGZyb20gJy4uL2dmeC9kZXZpY2UnO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlLCBHRlhUZXh0dXJlSW5mbyB9IGZyb20gJy4uL2dmeC90ZXh0dXJlJztcclxuaW1wb3J0IHsgZXJyb3IgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IEZpbHRlciB9IGZyb20gJy4vYXNzZXQtZW51bSc7XHJcbmltcG9ydCB7IEltYWdlQXNzZXQgfSBmcm9tICcuL2ltYWdlLWFzc2V0JztcclxuaW1wb3J0IHsgVGV4dHVyZUJhc2UgfSBmcm9tICcuL3RleHR1cmUtYmFzZSc7XHJcbmltcG9ydCB7IERFViB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBtYWNybyB9IGZyb20gJy4uL3BsYXRmb3JtL21hY3JvJztcclxuXHJcbmNvbnN0IF9yZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdID0gW25ldyBHRlhCdWZmZXJUZXh0dXJlQ29weSgpXTtcclxuXHJcbmV4cG9ydCB0eXBlIFByZXN1bWVkR0ZYVGV4dHVyZUluZm8gPSBQaWNrPEdGWFRleHR1cmVJbmZvLCAndXNhZ2UnIHwgJ2ZsYWdzJyB8ICdmb3JtYXQnIHwgJ2xldmVsQ291bnQnPjtcclxuXHJcbmZ1bmN0aW9uIGdldE1pcExldmVsICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgbGV0IHNpemUgPSBNYXRoLm1heCh3aWR0aCwgaGVpZ2h0KTtcclxuICAgIGxldCBsZXZlbCA9IDA7XHJcbiAgICB3aGlsZSAoc2l6ZSkgeyBzaXplID4+PSAxOyBsZXZlbCsrOyB9XHJcbiAgICByZXR1cm4gbGV2ZWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUE9UIChuOiBudW1iZXIpIHsgcmV0dXJuIG4gJiYgKG4gJiAobiAtIDEpKSA9PT0gMDsgfVxyXG5mdW5jdGlvbiBjYW5HZW5lcmF0ZU1pcG1hcCAoZGV2aWNlOiBHRlhEZXZpY2UsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBuZWVkQ2hlY2tQT1QgPSBkZXZpY2UuZ2Z4QVBJID09PSBHRlhBUEkuV0VCR0w7XHJcbiAgICBpZiAobmVlZENoZWNrUE9UKSB7IHJldHVybiBpc1BPVCh3KSAmJiBpc1BPVChoKTsgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDnroDljZXotLTlm77ln7rnsbvjgIJcclxuICog566A5Y2V6LS05Zu+5YaF6YOo5Yib5bu65LqGIEdGWCDotLTlm77lkozor6XotLTlm77kuIrnmoQgR0ZYIOi0tOWbvuinhuWbvuOAglxyXG4gKiDnroDljZXotLTlm77lhYHorrjmjIflrprkuI3lkIznmoQgTWlwbWFwIOWxgue6p+OAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlNpbXBsZVRleHR1cmUnKVxyXG5leHBvcnQgY2xhc3MgU2ltcGxlVGV4dHVyZSBleHRlbmRzIFRleHR1cmVCYXNlIHtcclxuICAgIHByb3RlY3RlZCBfZ2Z4VGV4dHVyZTogR0ZYVGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfbWlwbWFwTGV2ZWwgPSAxO1xyXG5cclxuICAgIGdldCBtaXBtYXBMZXZlbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pcG1hcExldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5q2k6LS05Zu+5bqV5bGC55qEIEdGWCDotLTlm77lr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEdGWFRleHR1cmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZnhUZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl90cnlEZXN0cm95VGV4dHVyZSgpO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrAgMCDnuqcgTWlwbWFw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVJbWFnZSAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaXBtYXBzKDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5oyH5a6a5bGC57qn6IyD5Zu05YaF55qEIE1pcG1hcOOAguW9kyBNaXBtYXAg5pWw5o2u5Y+R55Sf5LqG5pS55Y+Y5pe25bqU6LCD55So5q2k5pa55rOV5o+Q5Lqk5pu05pS544CCXHJcbiAgICAgKiDoi6XmjIflrprnmoTlsYLnuqfojIPlm7TotoXlh7rkuoblrp7pmYXlt7LmnInnmoTlsYLnuqfojIPlm7TvvIzlj6rmnInopobnm5bnmoTpgqPkupvlsYLnuqfojIPlm7TkvJrooqvmm7TmlrDjgIJcclxuICAgICAqIEBwYXJhbSBmaXJzdExldmVsIOi1t+Wni+Wxgue6p+OAglxyXG4gICAgICogQHBhcmFtIGNvdW50IOWxgue6p+aVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlTWlwbWFwcyAoZmlyc3RMZXZlbDogbnVtYmVyID0gMCwgY291bnQ/OiBudW1iZXIpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuIrkvKDlm77lg4/mlbDmja7liLDmjIflrprlsYLnuqfnmoQgTWlwbWFwIOS4reOAglxyXG4gICAgICog5Zu+5YOP55qE5bC65a+45b2x5ZONIE1pcG1hcCDnmoTmm7TmlrDojIPlm7TvvJpcclxuICAgICAqIC0g5b2T5Zu+5YOP5pivIGBBcnJheUJ1ZmZlcmAg5pe277yM5Zu+5YOP55qE5bC65a+45b+F6aG75ZKMIE1pcG1hcCDnmoTlsLrlr7jkuIDoh7TvvJvlkKbliJnvvIxcclxuICAgICAqIC0g6Iul5Zu+5YOP55qE5bC65a+45LiOIE1pcG1hcCDnmoTlsLrlr7jnm7jlkIzvvIzkuIrkvKDlkI7mlbTkuKogTWlwbWFwIOeahOaVsOaNruWwhuS4juWbvuWDj+aVsOaNruS4gOiHtO+8m1xyXG4gICAgICogLSDoi6Xlm77lg4/nmoTlsLrlr7jlsI/kuo7mjIflrprlsYLnuqcgTWlwbWFwIOeahOWwuuWvuO+8iOS4jeeuoeaYr+mVv+aIluWuve+8ie+8jOWImeS7jui0tOWbvuW3puS4iuinkuW8gOWni++8jOWbvuWDj+WwuuWvuOiMg+WbtOWGheeahCBNaXBtYXAg5Lya6KKr5pu05paw77ybXHJcbiAgICAgKiAtIOiLpeWbvuWDj+eahOWwuuWvuOi2heWHuuS6huaMh+WumuWxgue6pyBNaXBtYXAg55qE5bC65a+477yI5LiN566h5piv6ZW/5oiW5a6977yJ77yM6YO95bCG5byV6LW36ZSZ6K+v44CCXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIOWbvuWDj+aVsOaNrua6kOOAglxyXG4gICAgICogQHBhcmFtIGxldmVsIE1pcG1hcCDlsYLnuqfjgIJcclxuICAgICAqIEBwYXJhbSBhcnJheUluZGV4IOaVsOe7hOe0ouW8leOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBsb2FkRGF0YSAoc291cmNlOiBIVE1MQ2FudmFzRWxlbWVudCB8IEhUTUxJbWFnZUVsZW1lbnQgfCBBcnJheUJ1ZmZlclZpZXcsIGxldmVsOiBudW1iZXIgPSAwLCBhcnJheUluZGV4OiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9nZnhUZXh0dXJlIHx8IHRoaXMuX2dmeFRleHR1cmUubGV2ZWxDb3VudCA8PSBsZXZlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBnZnhEZXZpY2UgPSB0aGlzLl9nZXRHRlhEZXZpY2UoKTtcclxuICAgICAgICBpZiAoIWdmeERldmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWdpb24gPSBfcmVnaW9uc1swXTtcclxuICAgICAgICByZWdpb24udGV4RXh0ZW50LndpZHRoID0gdGhpcy5fZ2Z4VGV4dHVyZS53aWR0aCA+PiBsZXZlbDtcclxuICAgICAgICByZWdpb24udGV4RXh0ZW50LmhlaWdodCA9IHRoaXMuX2dmeFRleHR1cmUuaGVpZ2h0ID4+IGxldmVsO1xyXG4gICAgICAgIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwgPSBsZXZlbDtcclxuICAgICAgICByZWdpb24udGV4U3VicmVzLmJhc2VBcnJheUxheWVyID0gYXJyYXlJbmRleDtcclxuXHJcbiAgICAgICAgaWYgKERFVikge1xyXG4gICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGVpZ2h0ID4gcmVnaW9uLnRleEV4dGVudC5oZWlnaHQgfHxcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2Uud2lkdGggPiByZWdpb24udGV4RXh0ZW50LndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoYEltYWdlIHNvdXJjZSgke3RoaXMubmFtZX0pIGJvdW5kcyBvdmVycmlkZS5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIGdmeERldmljZS5jb3B5QnVmZmVyc1RvVGV4dHVyZShbc291cmNlXSwgdGhpcy5fZ2Z4VGV4dHVyZSwgX3JlZ2lvbnMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdmeERldmljZS5jb3B5VGV4SW1hZ2VzVG9UZXh0dXJlKFtzb3VyY2VdLCB0aGlzLl9nZnhUZXh0dXJlLCBfcmVnaW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXNzaWduSW1hZ2UgKGltYWdlOiBJbWFnZUFzc2V0LCBsZXZlbDogbnVtYmVyLCBhcnJheUluZGV4PzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdXBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gaW1hZ2UuZGF0YTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGxvYWREYXRhKGRhdGEsIGxldmVsLCBhcnJheUluZGV4KTtcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tUZXh0dXJlTG9hZGVkKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWFjcm8uQ0xFQU5VUF9JTUFHRV9DQUNIRSkge1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MubG9hZGVyLnJlbGVhc2UoaW1hZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoaW1hZ2UubG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHVwbG9hZCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGltYWdlLm9uY2UoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0NvbXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRJbWcgPSBsZWdhY3lDQy5idWlsdGluUmVzTWdyLmdldCgnYmxhY2stdGV4dHVyZScpLmltYWdlIGFzIEltYWdlQXNzZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZERhdGEoZGVmYXVsdEltZy5kYXRhIGFzIEhUTUxDYW52YXNFbGVtZW50LCBsZXZlbCwgYXJyYXlJbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGVnYWN5Q0MudGV4dHVyZVV0aWwucG9zdExvYWRJbWFnZShpbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2hlY2tUZXh0dXJlTG9hZGVkICgpIHtcclxuICAgICAgICB0aGlzLl90ZXh0dXJlUmVhZHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RleHR1cmVSZWFkeSAoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW1pdCgnbG9hZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IG1pcG1hcCBsZXZlbCBvZiB0aGlzIHRleHR1cmUuXHJcbiAgICAgKiBUaGUgdmFsdWUgaXMgcGFzc2VzIGFzIHByZXN1bWVkIGluZm8gdG8gYHRoaXMuX2dldEdmeFRleHR1cmVDcmVhdGVJbmZvKClgLlxyXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBtaXBtYXAgbGV2ZWwuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBfc2V0TWlwbWFwTGV2ZWwgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9taXBtYXBMZXZlbCA9IHZhbHVlIDwgMSA/IDEgOiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGlzIG1ldGhvZCBpcyBvdmVycmlkZWQgYnkgZGVyaXZlZCBjbGFzc2VzIHRvIHByb3ZpZGUgR0ZYIHRleHR1cmUgaW5mby5cclxuICAgICAqIEB6aCDov5nkuKrmlrnms5XooqvmtL7nlJ/nsbvph43lhpnku6Xmj5DkvptHRljnurnnkIbkv6Hmga/jgIJcclxuICAgICAqIEBwYXJhbSBwcmVzdW1lZCBUaGUgcHJlc3VtZWQgR0ZYIHRleHR1cmUgaW5mby5cclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIF9nZXRHZnhUZXh0dXJlQ3JlYXRlSW5mbyAocHJlc3VtZWQ6IFByZXN1bWVkR0ZYVGV4dHVyZUluZm8pOiBHRlhUZXh0dXJlSW5mbyB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdHJ5UmVzZXQgKCkge1xyXG4gICAgICAgIHRoaXMuX3RyeURlc3Ryb3lUZXh0dXJlKCk7XHJcbiAgICAgICAgaWYodGhpcy5fbWlwbWFwTGV2ZWwgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLl9nZXRHRlhEZXZpY2UoKTtcclxuICAgICAgICBpZiAoIWRldmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NyZWF0ZVRleHR1cmUoZGV2aWNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZVRleHR1cmUgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgbGV0IGZsYWdzID0gR0ZYVGV4dHVyZUZsYWdCaXQuTk9ORTtcclxuICAgICAgICBpZiAodGhpcy5fbWlwRmlsdGVyICE9PSBGaWx0ZXIuTk9ORSAmJiBjYW5HZW5lcmF0ZU1pcG1hcChkZXZpY2UsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21pcG1hcExldmVsID0gZ2V0TWlwTGV2ZWwodGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcbiAgICAgICAgICAgIGZsYWdzID0gR0ZYVGV4dHVyZUZsYWdCaXQuR0VOX01JUE1BUDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHR1cmVDcmVhdGVJbmZvID0gdGhpcy5fZ2V0R2Z4VGV4dHVyZUNyZWF0ZUluZm8oe1xyXG4gICAgICAgICAgICB1c2FnZTogR0ZYVGV4dHVyZVVzYWdlQml0LlNBTVBMRUQgfCBHRlhUZXh0dXJlVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBmb3JtYXQ6IHRoaXMuX2dldEdGWEZvcm1hdCgpLFxyXG4gICAgICAgICAgICBsZXZlbENvdW50OiB0aGlzLl9taXBtYXBMZXZlbCxcclxuICAgICAgICAgICAgZmxhZ3MsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCF0ZXh0dXJlQ3JlYXRlSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gZGV2aWNlLmNyZWF0ZVRleHR1cmUodGV4dHVyZUNyZWF0ZUluZm8pO1xyXG5cclxuICAgICAgICB0aGlzLl9nZnhUZXh0dXJlID0gdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RyeURlc3Ryb3lUZXh0dXJlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ2Z4VGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9nZnhUZXh0dXJlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fZ2Z4VGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5TaW1wbGVUZXh0dXJlID0gU2ltcGxlVGV4dHVyZTtcclxuIl19