(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../gfx/define.js", "./asset-enum.js", "./image-asset.js", "./simple-texture.js", "../global-exports.js", "../gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../gfx/define.js"), require("./asset-enum.js"), require("./image-asset.js"), require("./simple-texture.js"), require("../global-exports.js"), require("../gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.assetEnum, global.imageAsset, global.simpleTexture, global.globalExports, global.index);
    global.texture2d = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _assetEnum, _imageAsset, _simpleTexture, _globalExports, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Texture2D = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * 二维贴图资源。
   * 二维贴图资源的每个 Mipmap 层级都为一张图像资源。
   */
  var Texture2D = (_dec = (0, _index.ccclass)('cc.Texture2D'), _dec2 = (0, _index.type)([_imageAsset.ImageAsset]), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_SimpleTexture) {
    _inherits(Texture2D, _SimpleTexture);

    function Texture2D() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Texture2D);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Texture2D)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_mipmaps", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(Texture2D, [{
      key: "initialize",
      value: function initialize() {
        this.mipmaps = this._mipmaps;
      }
    }, {
      key: "onLoaded",
      value: function onLoaded() {
        this.initialize();
      }
      /**
       * 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
       * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 `this.uploadData` 来上传贴图数据。
       * @param info 贴图重置选项。
       */

    }, {
      key: "reset",
      value: function reset(info) {
        this._width = info.width;
        this._height = info.height;

        this._setGFXFormat(info.format);

        this._setMipmapLevel(info.mipmapLevel || 1);

        this._tryReset();
      }
      /**
       * 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级的贴图。重置后，贴图的像素数据将变为未定义。
       * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 `this.uploadData` 来上传贴图数据。
       * @param width 像素宽度。
       * @param height 像素高度。
       * @param format 像素格式。
       * @param mipmapLevel mipmap 层级。
       * @deprecated 将在 V1.0.0 移除，请转用 `this.reset()`。
       */

    }, {
      key: "create",
      value: function create(width, height) {
        var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _assetEnum.PixelFormat.RGBA8888;
        var mipmapLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        this.reset({
          width: width,
          height: height,
          format: format,
          mipmapLevel: mipmapLevel
        });
      }
      /**
       * 返回此贴图的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return this._mipmaps.length !== 0 ? this._mipmaps[0].url : '';
      }
    }, {
      key: "updateMipmaps",
      value: function updateMipmaps() {
        var firstLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var count = arguments.length > 1 ? arguments[1] : undefined;

        if (firstLevel >= this._mipmaps.length) {
          return;
        }

        var nUpdate = Math.min(count === undefined ? this._mipmaps.length : count, this._mipmaps.length - firstLevel);

        for (var i = 0; i < nUpdate; ++i) {
          var level = firstLevel + i;

          this._assignImage(this._mipmaps[level], level);
        }
      }
      /**
       * 若此贴图 0 级 Mipmap 的图像资源的实际源存在并为 HTML 元素则返回它，否则返回 `null`。
       * @returns HTML 元素或 `null`。
       * @deprecated 请转用 `this.image.data`。
       */

    }, {
      key: "getHtmlElementObj",
      value: function getHtmlElementObj() {
        return this._mipmaps[0] && this._mipmaps[0].data instanceof HTMLElement ? this._mipmaps[0].data : null;
      }
      /**
       * 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this._mipmaps = [];
        return _get(_getPrototypeOf(Texture2D.prototype), "destroy", this).call(this);
      }
      /**
       * 返回此贴图的描述。
       * @returns 此贴图的描述。
       */

    }, {
      key: "description",
      value: function description() {
        var url = this._mipmaps[0] ? this._mipmaps[0].url : '';
        return "<cc.Texture2D | Name = ".concat(url, " | Dimension = ").concat(this.width, " x ").concat(this.height, ">");
      }
      /**
       * 释放占用的 GPU 资源。
       * @deprecated 请转用 `this.destroy()`。
       */

    }, {
      key: "releaseTexture",
      value: function releaseTexture() {
        this.destroy();
      }
    }, {
      key: "_serialize",
      value: function _serialize(exporting) {
        return {
          base: _get(_getPrototypeOf(Texture2D.prototype), "_serialize", this).call(this, exporting),
          mipmaps: this._mipmaps.map(function (mipmap) {
            if (!mipmap || !mipmap._uuid) {
              return null;
            }

            if (exporting) {
              return EditorExtends.UuidUtils.compressUuid(mipmap._uuid, true);
            }

            return mipmap._uuid;
          })
        };
      }
    }, {
      key: "_deserialize",
      value: function _deserialize(serializedData, handle) {
        var data = serializedData;

        _get(_getPrototypeOf(Texture2D.prototype), "_deserialize", this).call(this, data.base, handle);

        this._mipmaps = new Array(data.mipmaps.length);

        for (var i = 0; i < data.mipmaps.length; ++i) {
          // Prevent resource load failed
          this._mipmaps[i] = new _imageAsset.ImageAsset();

          if (!data.mipmaps[i]) {
            continue;
          }

          var mipmapUUID = data.mipmaps[i];
          handle.result.push(this._mipmaps, "".concat(i), mipmapUUID);
          this._mipmaps[i]._texture = this;
        }
      }
    }, {
      key: "_getGfxTextureCreateInfo",
      value: function _getGfxTextureCreateInfo(presumed) {
        var texInfo = new _index2.GFXTextureInfo(_define.GFXTextureType.TEX2D);
        texInfo.width = this._width;
        texInfo.height = this._height;
        return Object.assign(texInfo, presumed);
      }
    }, {
      key: "_checkTextureLoaded",
      value: function _checkTextureLoaded() {
        var ready = true;

        for (var i = 0; i < this._mipmaps.length; ++i) {
          var image = this._mipmaps[i];

          if (!image.loaded) {
            ready = false;
            break;
          }
        }

        if (ready) {
          _get(_getPrototypeOf(Texture2D.prototype), "_textureReady", this).call(this);
        }
      }
    }, {
      key: "mipmaps",

      /**
       * 所有层级 Mipmap，注意，这里不包含自动生成的 Mipmap。
       * 当设置 Mipmap 时，贴图的尺寸以及像素格式可能会改变。
       */
      get: function get() {
        return this._mipmaps;
      },
      set: function set(value) {
        var _this2 = this;

        this._mipmaps = value;

        this._setMipmapLevel(this._mipmaps.length);

        if (this._mipmaps.length > 0) {
          var imageAsset = this._mipmaps[0];
          this.reset({
            width: imageAsset.width,
            height: imageAsset.height,
            format: imageAsset.format,
            mipmapLevel: this._mipmaps.length
          });

          this._mipmaps.forEach(function (mipmap, level) {
            _this2._assignImage(mipmap, level);
          });
        } else {
          this.reset({
            width: 0,
            height: 0,
            mipmapLevel: this._mipmaps.length
          });
        }
      }
      /**
       * 0 级 Mipmap。
       * 注意，`this.image = i` 等价于 `this.mipmaps = [i]`，
       * 也就是说，通过 `this.image` 设置 0 级 Mipmap 时将隐式地清除之前的所有 Mipmap。
       */

    }, {
      key: "image",
      get: function get() {
        return this._mipmaps.length === 0 ? null : this._mipmaps[0];
      },
      set: function set(value) {
        this.mipmaps = value ? [value] : [];
      }
    }]);

    return Texture2D;
  }(_simpleTexture.SimpleTexture), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mipmaps", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.Texture2D = Texture2D;
  _globalExports.legacyCC.Texture2D = Texture2D;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3RleHR1cmUtMmQudHMiXSwibmFtZXMiOlsiVGV4dHVyZTJEIiwiSW1hZ2VBc3NldCIsIm1pcG1hcHMiLCJfbWlwbWFwcyIsImluaXRpYWxpemUiLCJpbmZvIiwiX3dpZHRoIiwid2lkdGgiLCJfaGVpZ2h0IiwiaGVpZ2h0IiwiX3NldEdGWEZvcm1hdCIsImZvcm1hdCIsIl9zZXRNaXBtYXBMZXZlbCIsIm1pcG1hcExldmVsIiwiX3RyeVJlc2V0IiwiUGl4ZWxGb3JtYXQiLCJSR0JBODg4OCIsInJlc2V0IiwibGVuZ3RoIiwidXJsIiwiZmlyc3RMZXZlbCIsImNvdW50IiwiblVwZGF0ZSIsIk1hdGgiLCJtaW4iLCJ1bmRlZmluZWQiLCJpIiwibGV2ZWwiLCJfYXNzaWduSW1hZ2UiLCJkYXRhIiwiSFRNTEVsZW1lbnQiLCJkZXN0cm95IiwiZXhwb3J0aW5nIiwiYmFzZSIsIm1hcCIsIm1pcG1hcCIsIl91dWlkIiwiRWRpdG9yRXh0ZW5kcyIsIlV1aWRVdGlscyIsImNvbXByZXNzVXVpZCIsInNlcmlhbGl6ZWREYXRhIiwiaGFuZGxlIiwiQXJyYXkiLCJtaXBtYXBVVUlEIiwicmVzdWx0IiwicHVzaCIsIl90ZXh0dXJlIiwicHJlc3VtZWQiLCJ0ZXhJbmZvIiwiR0ZYVGV4dHVyZUluZm8iLCJHRlhUZXh0dXJlVHlwZSIsIlRFWDJEIiwiT2JqZWN0IiwiYXNzaWduIiwicmVhZHkiLCJpbWFnZSIsImxvYWRlZCIsInZhbHVlIiwiaW1hZ2VBc3NldCIsImZvckVhY2giLCJTaW1wbGVUZXh0dXJlIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUVBOzs7O01BS2FBLFMsV0FEWixvQkFBUSxjQUFSLEMsVUE4Q0ksaUJBQUssQ0FBQ0Msc0JBQUQsQ0FBTCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUQsRUFBU1IsS0FBVCxFQUFtQjtBQUNyQyxZQUFBLE1BQUksQ0FBQ0MsWUFBTCxDQUFrQk8sTUFBbEIsRUFBMEJSLEtBQTFCO0FBQ0gsV0FGRDtBQUdILFNBWEQsTUFXTztBQUNILGVBQUtWLEtBQUwsQ0FBVztBQUNQVixZQUFBQSxLQUFLLEVBQUUsQ0FEQTtBQUVQRSxZQUFBQSxNQUFNLEVBQUUsQ0FGRDtBQUdQSSxZQUFBQSxXQUFXLEVBQUUsS0FBS1YsUUFBTCxDQUFjZTtBQUhwQixXQUFYO0FBS0g7QUFDSjtBQUVEOzs7Ozs7OzswQkFLYTtBQUNULGVBQU8sS0FBS2YsUUFBTCxDQUFjZSxNQUFkLEtBQXlCLENBQXpCLEdBQTZCLElBQTdCLEdBQW9DLEtBQUtmLFFBQUwsQ0FBYyxDQUFkLENBQTNDO0FBQ0gsTzt3QkFFVXNELEssRUFBTztBQUNkLGFBQUt2RCxPQUFMLEdBQWV1RCxLQUFLLEdBQUcsQ0FBQ0EsS0FBRCxDQUFILEdBQWEsRUFBakM7QUFDSDs7OztJQTNDMEJHLDRCOzs7OzthQThDSyxFOzs7O0FBd0pwQ0MsMEJBQVM3RCxTQUFULEdBQXFCQSxTQUFyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCB0eXBlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgR0ZYVGV4dHVyZVR5cGUgfSBmcm9tICcuLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgUGl4ZWxGb3JtYXQgfSBmcm9tICcuL2Fzc2V0LWVudW0nO1xyXG5pbXBvcnQgeyBJbWFnZUFzc2V0IH0gZnJvbSAnLi9pbWFnZS1hc3NldCc7XHJcbmltcG9ydCB7IFByZXN1bWVkR0ZYVGV4dHVyZUluZm8sIFNpbXBsZVRleHR1cmUgfSBmcm9tICcuL3NpbXBsZS10ZXh0dXJlJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IEdGWFRleHR1cmVJbmZvIH0gZnJvbSAnLi4vZ2Z4JztcclxuXHJcbi8qKlxyXG4gKiDotLTlm77liJvlu7rpgInpobnjgIJcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRleHR1cmUyRENyZWF0ZUluZm8ge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlg4/ntKDlrr3luqbjgIJcclxuICAgICAqL1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWDj+e0oOmrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWDj+e0oOagvOW8j+OAglxyXG4gICAgICogQGRlZmF1bHQgUGl4ZWxGb3JtYXQuUkdCQTg4ODhcclxuICAgICAqL1xyXG4gICAgZm9ybWF0PzogUGl4ZWxGb3JtYXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXBtYXAg5bGC57qn44CCXHJcbiAgICAgKiBAZGVmYXVsdCAxXHJcbiAgICAgKi9cclxuICAgIG1pcG1hcExldmVsPzogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICog5LqM57u06LS05Zu+6LWE5rqQ44CCXHJcbiAqIOS6jOe7tOi0tOWbvui1hOa6kOeahOavj+S4qiBNaXBtYXAg5bGC57qn6YO95Li65LiA5byg5Zu+5YOP6LWE5rqQ44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuVGV4dHVyZTJEJylcclxuZXhwb3J0IGNsYXNzIFRleHR1cmUyRCBleHRlbmRzIFNpbXBsZVRleHR1cmUge1xyXG4gICAgLyoqXHJcbiAgICAgKiDmiYDmnInlsYLnuqcgTWlwbWFw77yM5rOo5oSP77yM6L+Z6YeM5LiN5YyF5ZCr6Ieq5Yqo55Sf5oiQ55qEIE1pcG1hcOOAglxyXG4gICAgICog5b2T6K6+572uIE1pcG1hcCDml7bvvIzotLTlm77nmoTlsLrlr7jku6Xlj4rlg4/ntKDmoLzlvI/lj6/og73kvJrmlLnlj5jjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG1pcG1hcHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9taXBtYXBzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBtaXBtYXBzICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX21pcG1hcHMgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zZXRNaXBtYXBMZXZlbCh0aGlzLl9taXBtYXBzLmxlbmd0aCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21pcG1hcHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbWFnZUFzc2V0OiBJbWFnZUFzc2V0ID0gdGhpcy5fbWlwbWFwc1swXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCh7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogaW1hZ2VBc3NldC53aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogaW1hZ2VBc3NldC5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IGltYWdlQXNzZXQuZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgbWlwbWFwTGV2ZWw6IHRoaXMuX21pcG1hcHMubGVuZ3RoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fbWlwbWFwcy5mb3JFYWNoKChtaXBtYXAsIGxldmVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hc3NpZ25JbWFnZShtaXBtYXAsIGxldmVsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCh7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMCxcclxuICAgICAgICAgICAgICAgIG1pcG1hcExldmVsOiB0aGlzLl9taXBtYXBzLmxlbmd0aCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogMCDnuqcgTWlwbWFw44CCXHJcbiAgICAgKiDms6jmhI/vvIxgdGhpcy5pbWFnZSA9IGlgIOetieS7t+S6jiBgdGhpcy5taXBtYXBzID0gW2ldYO+8jFxyXG4gICAgICog5Lmf5bCx5piv6K+077yM6YCa6L+HIGB0aGlzLmltYWdlYCDorr7nva4gMCDnuqcgTWlwbWFwIOaXtuWwhumakOW8j+WcsOa4hemZpOS5i+WJjeeahOaJgOaciSBNaXBtYXDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGltYWdlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWlwbWFwcy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5fbWlwbWFwc1swXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW1hZ2UgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5taXBtYXBzID0gdmFsdWUgPyBbdmFsdWVdIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgQHR5cGUoW0ltYWdlQXNzZXRdKVxyXG4gICAgcHVibGljIF9taXBtYXBzOiBJbWFnZUFzc2V0W10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5taXBtYXBzID0gdGhpcy5fbWlwbWFwcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkZWQgKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG5b2T5YmN6LS05Zu+6YeN572u5Li65oyH5a6a5bC65a+444CB5YOP57Sg5qC85byP5Lul5Y+K5oyH5a6aIG1pcG1hcCDlsYLnuqfjgILph43nva7lkI7vvIzotLTlm77nmoTlg4/ntKDmlbDmja7lsIblj5jkuLrmnKrlrprkuYnjgIJcclxuICAgICAqIG1pcG1hcCDlm77lg4/nmoTmlbDmja7kuI3kvJroh6rliqjmm7TmlrDliLDotLTlm77kuK3vvIzkvaDlv4XpobvmmL7lvI/osIPnlKggYHRoaXMudXBsb2FkRGF0YWAg5p2l5LiK5Lyg6LS05Zu+5pWw5o2u44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyDotLTlm77ph43nva7pgInpobnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0IChpbmZvOiBJVGV4dHVyZTJEQ3JlYXRlSW5mbykge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gaW5mby53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBpbmZvLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9zZXRHRlhGb3JtYXQoaW5mby5mb3JtYXQpO1xyXG4gICAgICAgIHRoaXMuX3NldE1pcG1hcExldmVsKGluZm8ubWlwbWFwTGV2ZWwgfHwgMSk7XHJcbiAgICAgICAgdGhpcy5fdHJ5UmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuW9k+WJjei0tOWbvumHjee9ruS4uuaMh+WumuWwuuWvuOOAgeWDj+e0oOagvOW8j+S7peWPiuaMh+WumiBtaXBtYXAg5bGC57qn55qE6LS05Zu+44CC6YeN572u5ZCO77yM6LS05Zu+55qE5YOP57Sg5pWw5o2u5bCG5Y+Y5Li65pyq5a6a5LmJ44CCXHJcbiAgICAgKiBtaXBtYXAg5Zu+5YOP55qE5pWw5o2u5LiN5Lya6Ieq5Yqo5pu05paw5Yiw6LS05Zu+5Lit77yM5L2g5b+F6aG75pi+5byP6LCD55SoIGB0aGlzLnVwbG9hZERhdGFgIOadpeS4iuS8oOi0tOWbvuaVsOaNruOAglxyXG4gICAgICogQHBhcmFtIHdpZHRoIOWDj+e0oOWuveW6puOAglxyXG4gICAgICogQHBhcmFtIGhlaWdodCDlg4/ntKDpq5jluqbjgIJcclxuICAgICAqIEBwYXJhbSBmb3JtYXQg5YOP57Sg5qC85byP44CCXHJcbiAgICAgKiBAcGFyYW0gbWlwbWFwTGV2ZWwgbWlwbWFwIOWxgue6p+OAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg5bCG5ZyoIFYxLjAuMCDnp7vpmaTvvIzor7fovaznlKggYHRoaXMucmVzZXQoKWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGZvcm1hdCA9IFBpeGVsRm9ybWF0LlJHQkE4ODg4LCBtaXBtYXBMZXZlbCA9IDEpIHtcclxuICAgICAgICB0aGlzLnJlc2V0KHtcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgZm9ybWF0LFxyXG4gICAgICAgICAgICBtaXBtYXBMZXZlbCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuatpOi0tOWbvueahOWtl+espuS4suihqOekuuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9taXBtYXBzLmxlbmd0aCAhPT0gMCA/IHRoaXMuX21pcG1hcHNbMF0udXJsIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZU1pcG1hcHMgKGZpcnN0TGV2ZWw6IG51bWJlciA9IDAsIGNvdW50PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGZpcnN0TGV2ZWwgPj0gdGhpcy5fbWlwbWFwcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgblVwZGF0ZSA9IE1hdGgubWluKFxyXG4gICAgICAgICAgICBjb3VudCA9PT0gdW5kZWZpbmVkID8gdGhpcy5fbWlwbWFwcy5sZW5ndGggOiBjb3VudCxcclxuICAgICAgICAgICAgdGhpcy5fbWlwbWFwcy5sZW5ndGggLSBmaXJzdExldmVsKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuVXBkYXRlOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgbGV2ZWwgPSBmaXJzdExldmVsICsgaTtcclxuICAgICAgICAgICAgdGhpcy5fYXNzaWduSW1hZ2UodGhpcy5fbWlwbWFwc1tsZXZlbF0sIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoi6XmraTotLTlm74gMCDnuqcgTWlwbWFwIOeahOWbvuWDj+i1hOa6kOeahOWunumZhea6kOWtmOWcqOW5tuS4uiBIVE1MIOWFg+e0oOWImei/lOWbnuWug++8jOWQpuWImei/lOWbniBgbnVsbGDjgIJcclxuICAgICAqIEByZXR1cm5zIEhUTUwg5YWD57Sg5oiWIGBudWxsYOOAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg6K+36L2s55SoIGB0aGlzLmltYWdlLmRhdGFg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRIdG1sRWxlbWVudE9iaiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9taXBtYXBzWzBdICYmICh0aGlzLl9taXBtYXBzWzBdLmRhdGEgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpID8gdGhpcy5fbWlwbWFwc1swXS5kYXRhIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgeatpOi0tOWbvu+8jOa4heepuuaJgOaciSBNaXBtYXAg5bm26YeK5pS+5Y2g55So55qEIEdQVSDotYTmupDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX21pcG1hcHMgPSBbXTtcclxuICAgICAgICByZXR1cm4gc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue5q2k6LS05Zu+55qE5o+P6L+w44CCXHJcbiAgICAgKiBAcmV0dXJucyDmraTotLTlm77nmoTmj4/ov7DjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc2NyaXB0aW9uICgpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLl9taXBtYXBzWzBdID8gdGhpcy5fbWlwbWFwc1swXS51cmwgOiAnJztcclxuICAgICAgICByZXR1cm4gYDxjYy5UZXh0dXJlMkQgfCBOYW1lID0gJHt1cmx9IHwgRGltZW5zaW9uID0gJHt0aGlzLndpZHRofSB4ICR7dGhpcy5oZWlnaHR9PmA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7ljaDnlKjnmoQgR1BVIOi1hOa6kOOAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg6K+36L2s55SoIGB0aGlzLmRlc3Ryb3koKWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbGVhc2VUZXh0dXJlICgpIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3NlcmlhbGl6ZSAoZXhwb3J0aW5nPzogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBiYXNlOiBzdXBlci5fc2VyaWFsaXplKGV4cG9ydGluZyksXHJcbiAgICAgICAgICAgIG1pcG1hcHM6IHRoaXMuX21pcG1hcHMubWFwKChtaXBtYXApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghbWlwbWFwIHx8ICFtaXBtYXAuX3V1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChleHBvcnRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRWRpdG9yRXh0ZW5kcy5VdWlkVXRpbHMuY29tcHJlc3NVdWlkKG1pcG1hcC5fdXVpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlwbWFwLl91dWlkO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfZGVzZXJpYWxpemUgKHNlcmlhbGl6ZWREYXRhOiBhbnksIGhhbmRsZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHNlcmlhbGl6ZWREYXRhIGFzIElUZXh0dXJlMkRTZXJpYWxpemVEYXRhO1xyXG4gICAgICAgIHN1cGVyLl9kZXNlcmlhbGl6ZShkYXRhLmJhc2UsIGhhbmRsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX21pcG1hcHMgPSBuZXcgQXJyYXkoZGF0YS5taXBtYXBzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLm1pcG1hcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgLy8gUHJldmVudCByZXNvdXJjZSBsb2FkIGZhaWxlZFxyXG4gICAgICAgICAgICB0aGlzLl9taXBtYXBzW2ldID0gbmV3IEltYWdlQXNzZXQoKTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhLm1pcG1hcHNbaV0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG1pcG1hcFVVSUQgPSBkYXRhLm1pcG1hcHNbaV07XHJcbiAgICAgICAgICAgIGhhbmRsZS5yZXN1bHQucHVzaCh0aGlzLl9taXBtYXBzLCBgJHtpfWAsIG1pcG1hcFVVSUQpO1xyXG4gICAgICAgICAgICB0aGlzLl9taXBtYXBzW2ldLl90ZXh0dXJlID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRHZnhUZXh0dXJlQ3JlYXRlSW5mbyAocHJlc3VtZWQ6IFByZXN1bWVkR0ZYVGV4dHVyZUluZm8pIHtcclxuICAgICAgICBjb25zdCB0ZXhJbmZvID0gbmV3IEdGWFRleHR1cmVJbmZvKEdGWFRleHR1cmVUeXBlLlRFWDJEKTtcclxuICAgICAgICB0ZXhJbmZvLndpZHRoID0gdGhpcy5fd2lkdGg7XHJcbiAgICAgICAgdGV4SW5mby5oZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24odGV4SW5mbywgcHJlc3VtZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2hlY2tUZXh0dXJlTG9hZGVkICgpIHtcclxuICAgICAgICBsZXQgcmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWlwbWFwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBpbWFnZSA9IHRoaXMuX21pcG1hcHNbaV07XHJcbiAgICAgICAgICAgIGlmICghaW1hZ2UubG9hZGVkKXtcclxuICAgICAgICAgICAgICAgIHJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlYWR5KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLl90ZXh0dXJlUmVhZHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlRleHR1cmUyRCA9IFRleHR1cmUyRDtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRleHR1cmUyRFNlcmlhbGl6ZURhdGEge1xyXG4gICAgYmFzZTogc3RyaW5nO1xyXG4gICAgbWlwbWFwczogc3RyaW5nW107XHJcbn1cclxuIl19