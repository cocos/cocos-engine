(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../gfx/device.js", "./asset.js", "./asset-enum.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../gfx/device.js"), require("./asset.js"), require("./asset-enum.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.device, global.asset, global.assetEnum, global.defaultConstants, global.globalExports, global.debug);
    global.imageAsset = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _device, _asset, _assetEnum, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ImageAsset = void 0;

  var _dec, _class, _class2, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function fetchImageSource(imageSource) {
    return '_data' in imageSource ? imageSource._data : imageSource;
  }
  /**
   * 图像资源。
   */


  var ImageAsset = (_dec = (0, _index.ccclass)('cc.ImageAsset'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(ImageAsset, _Asset);

    _createClass(ImageAsset, [{
      key: "_nativeAsset",
      get: function get() {
        // Maybe returned to pool in webgl.
        return this._nativeData;
      },
      set: function set(value) {
        if (!(value instanceof HTMLElement)) {
          value.format = value.format || this._format;
        }

        this.reset(value);
      }
      /**
       * 此图像资源的图像数据。
       */

    }, {
      key: "data",
      get: function get() {
        if (this._nativeData instanceof HTMLImageElement || this._nativeData instanceof HTMLCanvasElement) {
          return this._nativeData;
        } else {
          return this._nativeData._data;
        }
      }
      /**
       * 此图像资源的像素宽度。
       */

    }, {
      key: "width",
      get: function get() {
        return this._nativeData.width || this._width;
      }
      /**
       * 此图像资源的像素高度。
       */

    }, {
      key: "height",
      get: function get() {
        return this._nativeData.height || this._height;
      }
      /**
       * 此图像资源的像素格式。
       */

    }, {
      key: "format",
      get: function get() {
        return this._format;
      }
      /**
       * 此图像资源是否为压缩像素格式。
       */

    }, {
      key: "isCompressed",
      get: function get() {
        return this._format >= _assetEnum.PixelFormat.RGB_ETC1 && this._format <= _assetEnum.PixelFormat.RGBA_ASTC_12x12 || this._format >= _assetEnum.PixelFormat.RGB_A_PVRTC_2BPPV1 && this._format <= _assetEnum.PixelFormat.RGBA_ETC1;
      }
      /**
       * 此图像资源的原始图像源的 URL。当原始图像元不是 HTML 文件时可能为空。
       * @deprecated 请转用 `this.nativeUrl`。
       */

    }, {
      key: "url",
      get: function get() {
        return this._url;
      }
    }, {
      key: "_texture",
      set: function set(tex) {
        this._tex = tex;
      },
      get: function get() {
        if (!this._tex) {
          var tex = new _globalExports.legacyCC.Texture2D();
          tex.name = this._url;
          tex.image = this;
          this._tex = tex;
        }

        return this._tex;
      }
    }]);

    /**
     * @param nativeAsset
     */
    function ImageAsset(nativeAsset) {
      var _this;

      _classCallCheck(this, ImageAsset);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageAsset).call(this));
      _this._nativeData = void 0;
      _this._tex = void 0;
      _this._url = void 0;
      _this._exportedExts = undefined;
      _this._format = _assetEnum.PixelFormat.RGBA8888;
      _this._width = 0;
      _this._height = 0;
      _this._url = '';
      _this.loaded = false;
      _this._nativeData = {
        _data: null,
        width: 0,
        height: 0,
        format: 0,
        _compressed: false
      };

      if (_defaultConstants.EDITOR) {
        _this._exportedExts = null;
      }

      if (nativeAsset !== undefined) {
        _this.reset(nativeAsset);
      }

      return _this;
    }
    /**
     * 重置此图像资源使用的原始图像源。
     * @param data 新的原始图像源。
     */


    _createClass(ImageAsset, [{
      key: "reset",
      value: function reset(data) {
        var _this2 = this;

        if (!(data instanceof HTMLElement)) {
          // this._nativeData = Object.create(data);
          this._nativeData = data;
          this._format = data.format;

          this._onDataComplete();
        } else {
          this._nativeData = data;

          if (_defaultConstants.MINIGAME || data.complete || data instanceof HTMLCanvasElement) {
            // todo need adatper
            this._onDataComplete();
          } else {
            this.loaded = false;
            data.addEventListener('load', function () {
              _this2._onDataComplete();
            });
            data.addEventListener('error', function (err) {
              (0, _debug.warnID)(3119, err.message);
            });
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this.data && this.data instanceof HTMLImageElement) {
          this.data.src = "";

          this._setRawAsset("");

          _globalExports.legacyCC.loader.removeItem(this.data.id);
        }

        return _get(_getPrototypeOf(ImageAsset.prototype), "destroy", this).call(this);
      } // SERIALIZATION

    }, {
      key: "_serialize",
      value: function _serialize() {
        var targetExtensions = this._exportedExts;

        if (!targetExtensions && this._native) {
          targetExtensions = [this._native];
        }

        if (!targetExtensions) {
          return '';
        }

        var extensionIndices = [];

        var _iterator = _createForOfIteratorHelper(targetExtensions),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var targetExtension = _step.value;
            var extensionFormat = targetExtension.split('@');
            var i = ImageAsset.extnames.indexOf(extensionFormat[0]);
            var exportedExtensionID = i < 0 ? targetExtension : "".concat(i);

            if (extensionFormat[1]) {
              exportedExtensionID += '@' + extensionFormat[1];
            }

            extensionIndices.push(exportedExtensionID);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return {
          fmt: extensionIndices.join('_'),
          w: this.width,
          h: this.height
        };
      }
    }, {
      key: "_deserialize",
      value: function _deserialize(data, handle) {
        var fmtStr = '';

        if (typeof data === 'string') {
          fmtStr = data;
        } else {
          this._width = data.w;
          this._height = data.h;
          fmtStr = data.fmt;
        }

        var device = _getGlobalDevice();

        var extensionIDs = fmtStr.split('_');
        var preferedExtensionIndex = Number.MAX_VALUE;
        var format = this._format;
        var ext = '';
        var SupportTextureFormats = _globalExports.legacyCC.macro.SUPPORT_TEXTURE_FORMATS;

        var _iterator2 = _createForOfIteratorHelper(extensionIDs),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var extensionID = _step2.value;
            var extFormat = extensionID.split('@');
            var i = parseInt(extFormat[0], undefined);
            var tmpExt = ImageAsset.extnames[i] || extFormat.join();
            var index = SupportTextureFormats.indexOf(tmpExt);

            if (index !== -1 && index < preferedExtensionIndex) {
              var fmt = extFormat[1] ? parseInt(extFormat[1]) : this._format; // check whether or not support compressed texture

              if (tmpExt === '.astc' && (!device || !device.hasFeature(_device.GFXFeature.FORMAT_ASTC))) {
                continue;
              } else if (tmpExt === '.pvr' && (!device || !device.hasFeature(_device.GFXFeature.FORMAT_PVRTC))) {
                continue;
              } else if ((fmt === _assetEnum.PixelFormat.RGB_ETC1 || fmt === _assetEnum.PixelFormat.RGBA_ETC1) && (!device || !device.hasFeature(_device.GFXFeature.FORMAT_ETC1))) {
                continue;
              } else if ((fmt === _assetEnum.PixelFormat.RGB_ETC2 || fmt === _assetEnum.PixelFormat.RGBA_ETC2) && (!device || !device.hasFeature(_device.GFXFeature.FORMAT_ETC2))) {
                continue;
              } else if (tmpExt === '.webp' && !_globalExports.legacyCC.sys.capabilities.webp) {
                continue;
              }

              preferedExtensionIndex = index;
              ext = tmpExt;
              format = fmt;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (ext) {
          this._setRawAsset(ext);

          this._format = format;
        } // preset uuid to get correct nativeUrl


        var loadingItem = handle.customEnv;
        var uuid = loadingItem && loadingItem.uuid;

        if (uuid) {
          this._uuid = uuid;
          this._url = this.nativeUrl;
        }
      }
    }, {
      key: "_onDataComplete",
      value: function _onDataComplete() {
        this.loaded = true;
        this.emit('load');
      }
    }]);

    return ImageAsset;
  }(_asset.Asset), _class3.extnames = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'], _temp), (_applyDecoratedDescriptor(_class2.prototype, "_nativeAsset", [_index.override], Object.getOwnPropertyDescriptor(_class2.prototype, "_nativeAsset"), _class2.prototype)), _class2)) || _class);
  _exports.ImageAsset = ImageAsset;

  function _getGlobalDevice() {
    if (_globalExports.legacyCC.director.root) {
      return _globalExports.legacyCC.director.root.device;
    } else {
      return null;
    }
  }
  /**
   * @zh
   * 当该资源加载成功后触发该事件。
   * @en
   * This event is emitted when the asset is loaded
   *
   * @event loads
   */


  _globalExports.legacyCC.ImageAsset = ImageAsset;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2ltYWdlLWFzc2V0LnRzIl0sIm5hbWVzIjpbImZldGNoSW1hZ2VTb3VyY2UiLCJpbWFnZVNvdXJjZSIsIl9kYXRhIiwiSW1hZ2VBc3NldCIsIl9uYXRpdmVEYXRhIiwidmFsdWUiLCJIVE1MRWxlbWVudCIsImZvcm1hdCIsIl9mb3JtYXQiLCJyZXNldCIsIkhUTUxJbWFnZUVsZW1lbnQiLCJIVE1MQ2FudmFzRWxlbWVudCIsIndpZHRoIiwiX3dpZHRoIiwiaGVpZ2h0IiwiX2hlaWdodCIsIlBpeGVsRm9ybWF0IiwiUkdCX0VUQzEiLCJSR0JBX0FTVENfMTJ4MTIiLCJSR0JfQV9QVlJUQ18yQlBQVjEiLCJSR0JBX0VUQzEiLCJfdXJsIiwidGV4IiwiX3RleCIsImxlZ2FjeUNDIiwiVGV4dHVyZTJEIiwibmFtZSIsImltYWdlIiwibmF0aXZlQXNzZXQiLCJfZXhwb3J0ZWRFeHRzIiwidW5kZWZpbmVkIiwiUkdCQTg4ODgiLCJsb2FkZWQiLCJfY29tcHJlc3NlZCIsIkVESVRPUiIsImRhdGEiLCJfb25EYXRhQ29tcGxldGUiLCJNSU5JR0FNRSIsImNvbXBsZXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVyciIsIm1lc3NhZ2UiLCJzcmMiLCJfc2V0UmF3QXNzZXQiLCJsb2FkZXIiLCJyZW1vdmVJdGVtIiwiaWQiLCJ0YXJnZXRFeHRlbnNpb25zIiwiX25hdGl2ZSIsImV4dGVuc2lvbkluZGljZXMiLCJ0YXJnZXRFeHRlbnNpb24iLCJleHRlbnNpb25Gb3JtYXQiLCJzcGxpdCIsImkiLCJleHRuYW1lcyIsImluZGV4T2YiLCJleHBvcnRlZEV4dGVuc2lvbklEIiwicHVzaCIsImZtdCIsImpvaW4iLCJ3IiwiaCIsImhhbmRsZSIsImZtdFN0ciIsImRldmljZSIsIl9nZXRHbG9iYWxEZXZpY2UiLCJleHRlbnNpb25JRHMiLCJwcmVmZXJlZEV4dGVuc2lvbkluZGV4IiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwiZXh0IiwiU3VwcG9ydFRleHR1cmVGb3JtYXRzIiwibWFjcm8iLCJTVVBQT1JUX1RFWFRVUkVfRk9STUFUUyIsImV4dGVuc2lvbklEIiwiZXh0Rm9ybWF0IiwicGFyc2VJbnQiLCJ0bXBFeHQiLCJpbmRleCIsImhhc0ZlYXR1cmUiLCJHRlhGZWF0dXJlIiwiRk9STUFUX0FTVEMiLCJGT1JNQVRfUFZSVEMiLCJGT1JNQVRfRVRDMSIsIlJHQl9FVEMyIiwiUkdCQV9FVEMyIiwiRk9STUFUX0VUQzIiLCJzeXMiLCJjYXBhYmlsaXRpZXMiLCJ3ZWJwIiwibG9hZGluZ0l0ZW0iLCJjdXN0b21FbnYiLCJ1dWlkIiwiX3V1aWQiLCJuYXRpdmVVcmwiLCJlbWl0IiwiQXNzZXQiLCJvdmVycmlkZSIsImRpcmVjdG9yIiwicm9vdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNEQSxXQUFTQSxnQkFBVCxDQUEyQkMsV0FBM0IsRUFBcUQ7QUFDakQsV0FBTyxXQUFXQSxXQUFYLEdBQXlCQSxXQUFXLENBQUNDLEtBQXJDLEdBQTZDRCxXQUFwRDtBQUNIO0FBRUQ7Ozs7O01BSWFFLFUsV0FEWixvQkFBUSxlQUFSLEM7Ozs7OzBCQUl1QjtBQUNoQjtBQUNBLGVBQU8sS0FBS0MsV0FBWjtBQUNILE87d0JBRWlCQyxLLEVBQW9CO0FBQ2xDLFlBQUksRUFBRUEsS0FBSyxZQUFZQyxXQUFuQixDQUFKLEVBQXFDO0FBQ2pDRCxVQUFBQSxLQUFLLENBQUNFLE1BQU4sR0FBZUYsS0FBSyxDQUFDRSxNQUFOLElBQWdCLEtBQUtDLE9BQXBDO0FBQ0g7O0FBQ0QsYUFBS0MsS0FBTCxDQUFXSixLQUFYO0FBQ0g7QUFFRDs7Ozs7OzBCQUdZO0FBQ1IsWUFBSSxLQUFLRCxXQUFMLFlBQTRCTSxnQkFBNUIsSUFBZ0QsS0FBS04sV0FBTCxZQUE0Qk8saUJBQWhGLEVBQW1HO0FBQy9GLGlCQUFPLEtBQUtQLFdBQVo7QUFDSCxTQUZELE1BRU87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Q0FBa0JDLElBQWxCLENBQXVCbkMsTUFBOUI7QUFDSCxLQUZELE1BRU87QUFDSCxhQUFPLElBQVA7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7QUFTQXhDLDBCQUFTckIsVUFBVCxHQUFzQkEsVUFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGFzc2V0XHJcbiAqL1xyXG5cclxuLy8gQHRzLWNoZWNrXHJcbmltcG9ydCB7Y2NjbGFzcywgb3ZlcnJpZGV9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IEdGWERldmljZSwgR0ZYRmVhdHVyZSB9IGZyb20gJy4uL2dmeC9kZXZpY2UnO1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQnO1xyXG5pbXBvcnQgeyBQaXhlbEZvcm1hdCB9IGZyb20gJy4vYXNzZXQtZW51bSc7XHJcbmltcG9ydCB7IEVESVRPUiwgTUlOSUdBTUUgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgd2FybklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5cclxuLyoqXHJcbiAqIOWGheWtmOWbvuWDj+a6kOOAglxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJTWVtb3J5SW1hZ2VTb3VyY2Uge1xyXG4gICAgX2RhdGE6IEFycmF5QnVmZmVyVmlldyB8IG51bGw7XHJcbiAgICBfY29tcHJlc3NlZDogYm9vbGVhbjtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGZvcm1hdDogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICog5Zu+5YOP6LWE5rqQ55qE5Y6f5aeL5Zu+5YOP5rqQ44CC5Y+v5Lul5p2l5rqQ5LqOIEhUTUwg5YWD57Sg5Lmf5Y+v5Lul5p2l5rqQ5LqO5YaF5a2Y44CCXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBJbWFnZVNvdXJjZSA9IEhUTUxDYW52YXNFbGVtZW50IHwgSFRNTEltYWdlRWxlbWVudCB8IElNZW1vcnlJbWFnZVNvdXJjZTtcclxuXHJcbmZ1bmN0aW9uIGZldGNoSW1hZ2VTb3VyY2UgKGltYWdlU291cmNlOiBJbWFnZVNvdXJjZSkge1xyXG4gICAgcmV0dXJuICdfZGF0YScgaW4gaW1hZ2VTb3VyY2UgPyBpbWFnZVNvdXJjZS5fZGF0YSA6IGltYWdlU291cmNlO1xyXG59XHJcblxyXG4vKipcclxuICog5Zu+5YOP6LWE5rqQ44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuSW1hZ2VBc3NldCcpXHJcbmV4cG9ydCBjbGFzcyBJbWFnZUFzc2V0IGV4dGVuZHMgQXNzZXQge1xyXG5cclxuICAgIEBvdmVycmlkZVxyXG4gICAgZ2V0IF9uYXRpdmVBc3NldCAoKSB7XHJcbiAgICAgICAgLy8gTWF5YmUgcmV0dXJuZWQgdG8gcG9vbCBpbiB3ZWJnbC5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgX25hdGl2ZUFzc2V0ICh2YWx1ZTogSW1hZ2VTb3VyY2UpIHtcclxuICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5mb3JtYXQgPSB2YWx1ZS5mb3JtYXQgfHwgdGhpcy5fZm9ybWF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlc2V0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOatpOWbvuWDj+i1hOa6kOeahOWbvuWDj+aVsOaNruOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX25hdGl2ZURhdGEgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50IHx8IHRoaXMuX25hdGl2ZURhdGEgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlRGF0YTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlRGF0YS5fZGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraTlm77lg4/otYTmupDnmoTlg4/ntKDlrr3luqbjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlRGF0YS53aWR0aCB8fCB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOatpOWbvuWDj+i1hOa6kOeahOWDj+e0oOmrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlRGF0YS5oZWlnaHQgfHwgdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q2k5Zu+5YOP6LWE5rqQ55qE5YOP57Sg5qC85byP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBmb3JtYXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraTlm77lg4/otYTmupDmmK/lkKbkuLrljovnvKnlg4/ntKDmoLzlvI/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzQ29tcHJlc3NlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9mb3JtYXQgPj0gUGl4ZWxGb3JtYXQuUkdCX0VUQzEgJiYgdGhpcy5fZm9ybWF0IDw9IFBpeGVsRm9ybWF0LlJHQkFfQVNUQ18xMngxMikgfHxcclxuICAgICAgICAodGhpcy5fZm9ybWF0ID49IFBpeGVsRm9ybWF0LlJHQl9BX1BWUlRDXzJCUFBWMSAmJiB0aGlzLl9mb3JtYXQgPD0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOatpOWbvuWDj+i1hOa6kOeahOWOn+Wni+WbvuWDj+a6kOeahCBVUkzjgILlvZPljp/lp4vlm77lg4/lhYPkuI3mmK8gSFRNTCDmlofku7bml7blj6/og73kuLrnqbrjgIJcclxuICAgICAqIEBkZXByZWNhdGVkIOivt+i9rOeUqCBgdGhpcy5uYXRpdmVVcmxg44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB1cmwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cmw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IF90ZXh0dXJlICh0ZXgpIHtcclxuICAgICAgICB0aGlzLl90ZXggPSB0ZXg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IF90ZXh0dXJlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3RleCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZXggPSBuZXcgbGVnYWN5Q0MuVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgICAgIHRleC5uYW1lID0gdGhpcy5fdXJsO1xyXG4gICAgICAgICAgICB0ZXguaW1hZ2UgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXggPSB0ZXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZXh0bmFtZXMgPSBbJy5wbmcnLCAnLmpwZycsICcuanBlZycsICcuYm1wJywgJy53ZWJwJywgJy5wdnInLCAnLnBrbScsICcuYXN0YyddO1xyXG5cclxuICAgIHByaXZhdGUgX25hdGl2ZURhdGE6IEltYWdlU291cmNlO1xyXG5cclxuICAgIHByaXZhdGUgX3RleDtcclxuXHJcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZztcclxuXHJcbiAgICBwcml2YXRlIF9leHBvcnRlZEV4dHM6IHN0cmluZ1tdIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBwcml2YXRlIF9mb3JtYXQ6IFBpeGVsRm9ybWF0ID0gUGl4ZWxGb3JtYXQuUkdCQTg4ODg7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG5hdGl2ZUFzc2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChuYXRpdmVBc3NldD86IEltYWdlU291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXJsID0gJyc7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbmF0aXZlRGF0YSA9IHtcclxuICAgICAgICAgICAgX2RhdGE6IG51bGwsXHJcbiAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICAgIGZvcm1hdDogMCxcclxuICAgICAgICAgICAgX2NvbXByZXNzZWQ6IGZhbHNlLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwb3J0ZWRFeHRzID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuYXRpdmVBc3NldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQobmF0aXZlQXNzZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHjee9ruatpOWbvuWDj+i1hOa6kOS9v+eUqOeahOWOn+Wni+WbvuWDj+a6kOOAglxyXG4gICAgICogQHBhcmFtIGRhdGEg5paw55qE5Y6f5aeL5Zu+5YOP5rqQ44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldCAoZGF0YTogSW1hZ2VTb3VyY2UpIHtcclxuICAgICAgICBpZiAoIShkYXRhIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX25hdGl2ZURhdGEgPSBPYmplY3QuY3JlYXRlKGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9uYXRpdmVEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5fZm9ybWF0ID0gZGF0YS5mb3JtYXQ7XHJcbiAgICAgICAgICAgIHRoaXMuX29uRGF0YUNvbXBsZXRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbmF0aXZlRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGlmIChNSU5JR0FNRSB8fCAoZGF0YSBhcyBhbnkpLmNvbXBsZXRlIHx8IGRhdGEgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkgeyAvLyB0b2RvIG5lZWQgYWRhdHBlclxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25EYXRhQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25EYXRhQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuSUQoMzExOSwgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc3JjID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5fc2V0UmF3QXNzZXQoXCJcIik7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmxvYWRlci5yZW1vdmVJdGVtKHRoaXMuZGF0YS5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU0VSSUFMSVpBVElPTlxyXG5cclxuICAgIHB1YmxpYyBfc2VyaWFsaXplICgpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0RXh0ZW5zaW9ucyA9IHRoaXMuX2V4cG9ydGVkRXh0cztcclxuICAgICAgICBpZiAoIXRhcmdldEV4dGVuc2lvbnMgJiYgdGhpcy5fbmF0aXZlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldEV4dGVuc2lvbnMgPSBbdGhpcy5fbmF0aXZlXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGFyZ2V0RXh0ZW5zaW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBleHRlbnNpb25JbmRpY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgdGFyZ2V0RXh0ZW5zaW9uIG9mIHRhcmdldEV4dGVuc2lvbnMpIHtcclxuICAgICAgICAgICAgY29uc3QgZXh0ZW5zaW9uRm9ybWF0ID0gdGFyZ2V0RXh0ZW5zaW9uLnNwbGl0KCdAJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSBJbWFnZUFzc2V0LmV4dG5hbWVzLmluZGV4T2YoZXh0ZW5zaW9uRm9ybWF0WzBdKTtcclxuICAgICAgICAgICAgbGV0IGV4cG9ydGVkRXh0ZW5zaW9uSUQgPSBpIDwgMCA/IHRhcmdldEV4dGVuc2lvbiA6IGAke2l9YDtcclxuICAgICAgICAgICAgaWYgKGV4dGVuc2lvbkZvcm1hdFsxXSkge1xyXG4gICAgICAgICAgICAgICAgZXhwb3J0ZWRFeHRlbnNpb25JRCArPSAnQCcgKyBleHRlbnNpb25Gb3JtYXRbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXh0ZW5zaW9uSW5kaWNlcy5wdXNoKGV4cG9ydGVkRXh0ZW5zaW9uSUQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBmbXQ6IGV4dGVuc2lvbkluZGljZXMuam9pbignXycpLCB3OiB0aGlzLndpZHRoLCBoOiB0aGlzLmhlaWdodCB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfZGVzZXJpYWxpemUgKGRhdGE6IGFueSwgaGFuZGxlOiBhbnkpIHtcclxuICAgICAgICBsZXQgZm10U3RyID0gJyc7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBmbXRTdHIgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fd2lkdGggPSBkYXRhLnc7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IGRhdGEuaDtcclxuICAgICAgICAgICAgZm10U3RyID0gZGF0YS5mbXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IF9nZXRHbG9iYWxEZXZpY2UoKTtcclxuICAgICAgICBjb25zdCBleHRlbnNpb25JRHMgPSBmbXRTdHIuc3BsaXQoJ18nKTtcclxuXHJcbiAgICAgICAgbGV0IHByZWZlcmVkRXh0ZW5zaW9uSW5kZXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIGxldCBmb3JtYXQgPSB0aGlzLl9mb3JtYXQ7XHJcbiAgICAgICAgbGV0IGV4dCA9ICcnO1xyXG4gICAgICAgIGNvbnN0IFN1cHBvcnRUZXh0dXJlRm9ybWF0cyA9IGxlZ2FjeUNDLm1hY3JvLlNVUFBPUlRfVEVYVFVSRV9GT1JNQVRTIGFzIHN0cmluZ1tdO1xyXG4gICAgICAgIGZvciAoY29uc3QgZXh0ZW5zaW9uSUQgb2YgZXh0ZW5zaW9uSURzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4dEZvcm1hdCA9IGV4dGVuc2lvbklELnNwbGl0KCdAJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpID0gcGFyc2VJbnQoZXh0Rm9ybWF0WzBdLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBjb25zdCB0bXBFeHQgPSBJbWFnZUFzc2V0LmV4dG5hbWVzW2ldIHx8IGV4dEZvcm1hdC5qb2luKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IFN1cHBvcnRUZXh0dXJlRm9ybWF0cy5pbmRleE9mKHRtcEV4dCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEgJiYgaW5kZXggPCBwcmVmZXJlZEV4dGVuc2lvbkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmbXQgPSBleHRGb3JtYXRbMV0gPyBwYXJzZUludChleHRGb3JtYXRbMV0pIDogdGhpcy5fZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciBvciBub3Qgc3VwcG9ydCBjb21wcmVzc2VkIHRleHR1cmVcclxuICAgICAgICAgICAgICAgIGlmICggdG1wRXh0ID09PSAnLmFzdGMnICYmICghZGV2aWNlIHx8ICFkZXZpY2UuaGFzRmVhdHVyZShHRlhGZWF0dXJlLkZPUk1BVF9BU1RDKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRtcEV4dCA9PT0gJy5wdnInICYmICghZGV2aWNlIHx8ICFkZXZpY2UuaGFzRmVhdHVyZShHRlhGZWF0dXJlLkZPUk1BVF9QVlJUQykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChmbXQgPT09IFBpeGVsRm9ybWF0LlJHQl9FVEMxIHx8IGZtdCA9PT0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMxKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICghZGV2aWNlIHx8ICFkZXZpY2UuaGFzRmVhdHVyZShHRlhGZWF0dXJlLkZPUk1BVF9FVEMxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGZtdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0VUQzIgfHwgZm10ID09PSBQaXhlbEZvcm1hdC5SR0JBX0VUQzIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKCFkZXZpY2UgfHwgIWRldmljZS5oYXNGZWF0dXJlKEdGWEZlYXR1cmUuRk9STUFUX0VUQzIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0bXBFeHQgPT09ICcud2VicCcgJiYgIWxlZ2FjeUNDLnN5cy5jYXBhYmlsaXRpZXMud2VicCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJlZmVyZWRFeHRlbnNpb25JbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgZXh0ID0gdG1wRXh0O1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZm10O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldFJhd0Fzc2V0KGV4dCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvcm1hdCA9IGZvcm1hdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHByZXNldCB1dWlkIHRvIGdldCBjb3JyZWN0IG5hdGl2ZVVybFxyXG4gICAgICAgIGNvbnN0IGxvYWRpbmdJdGVtID0gaGFuZGxlLmN1c3RvbUVudjtcclxuICAgICAgICBjb25zdCB1dWlkID0gbG9hZGluZ0l0ZW0gJiYgbG9hZGluZ0l0ZW0udXVpZDtcclxuICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICB0aGlzLl91dWlkID0gdXVpZDtcclxuICAgICAgICAgICAgdGhpcy5fdXJsID0gdGhpcy5uYXRpdmVVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfb25EYXRhQ29tcGxldGUgKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVtaXQoJ2xvYWQnKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX2dldEdsb2JhbERldmljZSAoKTogR0ZYRGV2aWNlIHwgbnVsbCB7XHJcbiAgICBpZiAobGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCkge1xyXG4gICAgICAgIHJldHVybiBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRldmljZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog5b2T6K+l6LWE5rqQ5Yqg6L295oiQ5Yqf5ZCO6Kem5Y+R6K+l5LqL5Lu244CCXHJcbiAqIEBlblxyXG4gKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXNzZXQgaXMgbG9hZGVkXHJcbiAqXHJcbiAqIEBldmVudCBsb2Fkc1xyXG4gKi9cclxuXHJcbmxlZ2FjeUNDLkltYWdlQXNzZXQgPSBJbWFnZUFzc2V0O1xyXG4iXX0=