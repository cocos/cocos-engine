(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../renderer/core/sampler-lib.js", "../utils/id-generator.js", "./asset.js", "./asset-enum.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../renderer/core/sampler-lib.js"), require("../utils/id-generator.js"), require("./asset.js"), require("./asset-enum.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.samplerLib, global.idGenerator, global.asset, global.assetEnum, global.globalExports, global.debug);
    global.textureBase = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _samplerLib, _idGenerator, _asset, _assetEnum, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TextureBase = void 0;
  _idGenerator = _interopRequireDefault(_idGenerator);

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

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

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var idGenerator = new _idGenerator.default('Tex');
  /**
   * 贴图资源基类。它定义了所有贴图共用的概念。
   */

  var TextureBase = (_dec = (0, _index.ccclass)('cc.TextureBase'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(TextureBase, _Asset);

    _createClass(TextureBase, [{
      key: "isCompressed",

      /**
       * 此贴图是否为压缩的像素格式。
       */
      get: function get() {
        return this._format >= _assetEnum.PixelFormat.RGB_ETC1 && this._format <= _assetEnum.PixelFormat.RGBA_PVRTC_4BPPV1;
      }
      /**
       * 此贴图的像素宽度。
       */

    }, {
      key: "width",
      get: function get() {
        return this._width;
      }
      /**
       * 此贴图的像素高度。
       */

    }, {
      key: "height",
      get: function get() {
        return this._height;
      }
    }]);

    function TextureBase() {
      var _this;

      _classCallCheck(this, TextureBase);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TextureBase).call(this)); // Id for generate hash in material

      _initializerDefineProperty(_this, "_format", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_minFilter", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_magFilter", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_mipFilter", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_wrapS", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_wrapT", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_wrapR", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_anisotropy", _descriptor8, _assertThisInitialized(_this));

      _this._width = 1;
      _this._height = 1;
      _this._id = void 0;
      _this._samplerInfo = [];
      _this._samplerHash = 0;
      _this._gfxSampler = null;
      _this._gfxDevice = null;
      _this._id = idGenerator.getNewId();
      _this.loaded = false;
      _this._gfxDevice = _this._getGFXDevice();
      return _this;
    }
    /**
     * 获取标识符。
     * @returns 此贴图的标识符。
     */


    _createClass(TextureBase, [{
      key: "getId",
      value: function getId() {
        return this._id;
      }
      /**
       * 获取像素格式。
       * @returns 此贴图的像素格式。
       */

    }, {
      key: "getPixelFormat",
      value: function getPixelFormat() {
        return this._format;
      }
      /**
       * 获取各向异性。
       * @returns 此贴图的各向异性。
       */

    }, {
      key: "getAnisotropy",
      value: function getAnisotropy() {
        return this._anisotropy;
      }
      /**
       * 设置此贴图的缠绕模式。
       * 注意，若贴图尺寸不是 2 的整数幂，缠绕模式仅允许 `WrapMode.CLAMP_TO_EDGE`。
       * @param wrapS S(U) 坐标的采样模式。
       * @param wrapT T(V) 坐标的采样模式。
       * @param wrapR R(W) 坐标的采样模式。
       */

    }, {
      key: "setWrapMode",
      value: function setWrapMode(wrapS, wrapT, wrapR) {
        this._wrapS = wrapS;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.addressU] = wrapS;
        this._wrapT = wrapT;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.addressV] = wrapT;

        if (wrapR !== undefined) {
          this._wrapR = wrapR;
          this._samplerInfo[_samplerLib.SamplerInfoIndex.addressW] = wrapR;
        }

        this._samplerHash = (0, _samplerLib.genSamplerHash)(this._samplerInfo); // for editor assetDB

        if (this._gfxDevice) {
          this._gfxSampler = _samplerLib.samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
      }
      /**
       * 设置此贴图的过滤算法。
       * @param minFilter 缩小过滤算法。
       * @param magFilter 放大过滤算法。
       */

    }, {
      key: "setFilters",
      value: function setFilters(minFilter, magFilter) {
        this._minFilter = minFilter;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.minFilter] = minFilter;
        this._magFilter = magFilter;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.magFilter] = magFilter;
        this._samplerHash = (0, _samplerLib.genSamplerHash)(this._samplerInfo);

        if (this._gfxDevice) {
          this._gfxSampler = _samplerLib.samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
      }
      /**
       * 设置此贴图的 mip 过滤算法。
       * @param mipFilter mip 过滤算法。
       */

    }, {
      key: "setMipFilter",
      value: function setMipFilter(mipFilter) {
        this._mipFilter = mipFilter;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.mipFilter] = mipFilter;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.maxLOD] = mipFilter === _assetEnum.Filter.NONE ? 0 : 15; // WebGL2 on some platform need this

        this._samplerHash = (0, _samplerLib.genSamplerHash)(this._samplerInfo);

        if (this._gfxDevice) {
          this._gfxSampler = _samplerLib.samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
      }
      /**
       * 设置此贴图的各向异性。
       * @param anisotropy 各向异性。
       */

    }, {
      key: "setAnisotropy",
      value: function setAnisotropy(anisotropy) {
        this._anisotropy = anisotropy;
        this._samplerInfo[_samplerLib.SamplerInfoIndex.maxAnisotropy] = anisotropy;
        this._samplerHash = (0, _samplerLib.genSamplerHash)(this._samplerInfo);

        if (this._gfxDevice) {
          this._gfxSampler = _samplerLib.samplerLib.getSampler(this._gfxDevice, this._samplerHash);
        }
      }
      /**
       * 销毁此贴图，并释放占有的所有 GPU 资源。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        return _get(_getPrototypeOf(TextureBase.prototype), "destroy", this).call(this);
      }
      /**
       * 获取此贴图底层的 GFX 纹理对象。
       */

    }, {
      key: "getGFXTexture",
      value: function getGFXTexture() {
        return null;
      }
      /**
       * 获取此贴图内部使用的 GFX 采样器信息。
       * @private
       */

    }, {
      key: "getSamplerHash",
      value: function getSamplerHash() {
        return this._samplerHash;
      }
      /**
       * 获取此贴图底层的 GFX 采样信息。
       */

    }, {
      key: "getGFXSampler",
      value: function getGFXSampler() {
        if (!this._gfxSampler) {
          if (this._gfxDevice) {
            this._gfxSampler = _samplerLib.samplerLib.getSampler(this._gfxDevice, this._samplerHash);
          } else {
            (0, _debug.errorID)(9302);
          }
        }

        return this._gfxSampler;
      } // SERIALIZATION

      /**
       * @return
       */

    }, {
      key: "_serialize",
      value: function _serialize(exporting) {
        return this._minFilter + ',' + this._magFilter + ',' + this._wrapS + ',' + this._wrapT + ',' + this._mipFilter + ',' + this._anisotropy;
      }
      /**
       *
       * @param data
       */

    }, {
      key: "_deserialize",
      value: function _deserialize(serializedData, handle) {
        var data = serializedData;
        var fields = data.split(',');
        fields.unshift('');

        if (fields.length >= 5) {
          // decode filters
          this.setFilters(parseInt(fields[1]), parseInt(fields[2])); // decode wraps

          this.setWrapMode(parseInt(fields[3]), parseInt(fields[4]));
        }

        if (fields.length >= 7) {
          this.setMipFilter(parseInt(fields[5]));
          this.setAnisotropy(parseInt(fields[6]));
        }
      }
    }, {
      key: "_getGFXDevice",
      value: function _getGFXDevice() {
        return _globalExports.legacyCC.director.root && _globalExports.legacyCC.director.root.device;
      }
    }, {
      key: "_getGFXFormat",
      value: function _getGFXFormat() {
        return this._getGFXPixelFormat(this._format);
      }
    }, {
      key: "_setGFXFormat",
      value: function _setGFXFormat(format) {
        this._format = format === undefined ? _assetEnum.PixelFormat.RGBA8888 : format;
      }
    }, {
      key: "_getGFXPixelFormat",
      value: function _getGFXPixelFormat(format) {
        if (format === _assetEnum.PixelFormat.RGBA_ETC1) {
          format = _assetEnum.PixelFormat.RGB_ETC1;
        } else if (format === _assetEnum.PixelFormat.RGB_A_PVRTC_4BPPV1) {
          format = _assetEnum.PixelFormat.RGB_PVRTC_4BPPV1;
        } else if (format === _assetEnum.PixelFormat.RGB_A_PVRTC_2BPPV1) {
          format = _assetEnum.PixelFormat.RGB_PVRTC_2BPPV1;
        }

        return format;
      }
    }]);

    return TextureBase;
  }(_asset.Asset), _class3.PixelFormat = _assetEnum.PixelFormat, _class3.WrapMode = _assetEnum.WrapMode, _class3.Filter = _assetEnum.Filter, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_format", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.PixelFormat.RGBA8888;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_minFilter", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.Filter.LINEAR;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_magFilter", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.Filter.LINEAR;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_mipFilter", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.Filter.NONE;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_wrapS", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.WrapMode.REPEAT;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_wrapT", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.WrapMode.REPEAT;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_wrapR", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _assetEnum.WrapMode.REPEAT;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_anisotropy", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 8;
    }
  })), _class2)) || _class);
  _exports.TextureBase = TextureBase;
  _globalExports.legacyCC.TextureBase = TextureBase;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3RleHR1cmUtYmFzZS50cyJdLCJuYW1lcyI6WyJpZEdlbmVyYXRvciIsIklER2VuZXJhdG9yIiwiVGV4dHVyZUJhc2UiLCJfZm9ybWF0IiwiUGl4ZWxGb3JtYXQiLCJSR0JfRVRDMSIsIlJHQkFfUFZSVENfNEJQUFYxIiwiX3dpZHRoIiwiX2hlaWdodCIsIl9pZCIsIl9zYW1wbGVySW5mbyIsIl9zYW1wbGVySGFzaCIsIl9nZnhTYW1wbGVyIiwiX2dmeERldmljZSIsImdldE5ld0lkIiwibG9hZGVkIiwiX2dldEdGWERldmljZSIsIl9hbmlzb3Ryb3B5Iiwid3JhcFMiLCJ3cmFwVCIsIndyYXBSIiwiX3dyYXBTIiwiU2FtcGxlckluZm9JbmRleCIsImFkZHJlc3NVIiwiX3dyYXBUIiwiYWRkcmVzc1YiLCJ1bmRlZmluZWQiLCJfd3JhcFIiLCJhZGRyZXNzVyIsInNhbXBsZXJMaWIiLCJnZXRTYW1wbGVyIiwibWluRmlsdGVyIiwibWFnRmlsdGVyIiwiX21pbkZpbHRlciIsIl9tYWdGaWx0ZXIiLCJtaXBGaWx0ZXIiLCJfbWlwRmlsdGVyIiwibWF4TE9EIiwiRmlsdGVyIiwiTk9ORSIsImFuaXNvdHJvcHkiLCJtYXhBbmlzb3Ryb3B5IiwiZXhwb3J0aW5nIiwic2VyaWFsaXplZERhdGEiLCJoYW5kbGUiLCJkYXRhIiwiZmllbGRzIiwic3BsaXQiLCJ1bnNoaWZ0IiwibGVuZ3RoIiwic2V0RmlsdGVycyIsInBhcnNlSW50Iiwic2V0V3JhcE1vZGUiLCJzZXRNaXBGaWx0ZXIiLCJzZXRBbmlzb3Ryb3B5IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJkZXZpY2UiLCJfZ2V0R0ZYUGl4ZWxGb3JtYXQiLCJmb3JtYXQiLCJSR0JBODg4OCIsIlJHQkFfRVRDMSIsIlJHQl9BX1BWUlRDXzRCUFBWMSIsIlJHQl9QVlJUQ180QlBQVjEiLCJSR0JfQV9QVlJUQ18yQlBQVjEiLCJSR0JfUFZSVENfMkJQUFYxIiwiQXNzZXQiLCJXcmFwTW9kZSIsInNlcmlhbGl6YWJsZSIsIkxJTkVBUiIsIlJFUEVBVCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQ0EsTUFBTUEsV0FBVyxHQUFHLElBQUlDLG9CQUFKLENBQWdCLEtBQWhCLENBQXBCO0FBQ0E7Ozs7TUFJYUMsVyxXQURaLG9CQUFRLGdCQUFSLEM7Ozs7OztBQUVHOzs7MEJBR29DO0FBQ2hDLGVBQU8sS0FBS0MsT0FBTCxJQUFnQkMsdUJBQVlDLFFBQTVCLElBQXdDLEtBQUtGLE9BQUwsSUFBZ0JDLHVCQUFZRSxpQkFBM0U7QUFDSDtBQUVEOzs7Ozs7MEJBRzRCO0FBQ3hCLGVBQU8sS0FBS0MsTUFBWjtBQUNIO0FBRUQ7Ozs7OzswQkFHNkI7QUFDekIsZUFBTyxLQUFLQyxPQUFaO0FBQ0g7OztBQXlDRCwyQkFBZTtBQUFBOztBQUFBOztBQUNYLHdGQURXLENBR1g7O0FBSFc7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsWUFUTEQsTUFTSyxHQVRZLENBU1o7QUFBQSxZQVJMQyxPQVFLLEdBUmEsQ0FRYjtBQUFBLFlBTlBDLEdBTU87QUFBQSxZQUxQQyxZQUtPLEdBTGdDLEVBS2hDO0FBQUEsWUFKUEMsWUFJTyxHQUpnQixDQUloQjtBQUFBLFlBSFBDLFdBR08sR0FIMEIsSUFHMUI7QUFBQSxZQUZQQyxVQUVPLEdBRndCLElBRXhCO0FBSVgsWUFBS0osR0FBTCxHQUFXVCxXQUFXLENBQUNjLFFBQVosRUFBWDtBQUVBLFlBQUtDLE1BQUwsR0FBYyxLQUFkO0FBQ0EsWUFBS0YsVUFBTCxHQUFrQixNQUFLRyxhQUFMLEVBQWxCO0FBUFc7QUFRZDtBQUVEOzs7Ozs7Ozs4QkFJZ0I7QUFDWixlQUFPLEtBQUtQLEdBQVo7QUFDSDtBQUVEOzs7Ozs7O3VDQUl5QjtBQUNyQixlQUFPLEtBQUtOLE9BQVo7QUFDSDtBQUVEOzs7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Q3VCLEM7Ozs7QUE2TTVCZCwwQkFBU3JELFdBQVQsR0FBdUJBLFdBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBhc3NldFxyXG4gKi9cclxuXHJcbi8vIEB0cy1jaGVja1xyXG5pbXBvcnQge2NjY2xhc3MsIHNlcmlhbGl6YWJsZX0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUgfSBmcm9tICcuLi9nZngvdGV4dHVyZSc7XHJcbmltcG9ydCB7IGdlblNhbXBsZXJIYXNoLCBTYW1wbGVySW5mb0luZGV4LCBzYW1wbGVyTGliIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9zYW1wbGVyLWxpYic7XHJcbmltcG9ydCBJREdlbmVyYXRvciBmcm9tICcuLi91dGlscy9pZC1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQnO1xyXG5pbXBvcnQgeyBGaWx0ZXIsIFBpeGVsRm9ybWF0LCBXcmFwTW9kZSB9IGZyb20gJy4vYXNzZXQtZW51bSc7XHJcbmltcG9ydCB7IEdGWFNhbXBsZXIgfSBmcm9tICcuLi9nZngnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbmNvbnN0IGlkR2VuZXJhdG9yID0gbmV3IElER2VuZXJhdG9yKCdUZXgnKTtcclxuLyoqXHJcbiAqIOi0tOWbvui1hOa6kOWfuuexu+OAguWug+WumuS5ieS6huaJgOaciei0tOWbvuWFseeUqOeahOamguW/teOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlRleHR1cmVCYXNlJylcclxuZXhwb3J0IGNsYXNzIFRleHR1cmVCYXNlIGV4dGVuZHMgQXNzZXQge1xyXG4gICAgLyoqXHJcbiAgICAgKiDmraTotLTlm77mmK/lkKbkuLrljovnvKnnmoTlg4/ntKDmoLzlvI/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBpc0NvbXByZXNzZWQgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQgPj0gUGl4ZWxGb3JtYXQuUkdCX0VUQzEgJiYgdGhpcy5fZm9ybWF0IDw9IFBpeGVsRm9ybWF0LlJHQkFfUFZSVENfNEJQUFYxO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q2k6LS05Zu+55qE5YOP57Sg5a695bqm44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgd2lkdGggKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q2k6LS05Zu+55qE5YOP57Sg6auY5bqm44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBQaXhlbEZvcm1hdCA9IFBpeGVsRm9ybWF0O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgV3JhcE1vZGUgPSBXcmFwTW9kZTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZpbHRlciA9IEZpbHRlcjtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2Zvcm1hdDogbnVtYmVyID0gUGl4ZWxGb3JtYXQuUkdCQTg4ODg7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9taW5GaWx0ZXI6IG51bWJlciA9IEZpbHRlci5MSU5FQVI7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9tYWdGaWx0ZXI6IG51bWJlciA9IEZpbHRlci5MSU5FQVI7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9taXBGaWx0ZXI6IG51bWJlciA9IEZpbHRlci5OT05FO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfd3JhcFM6IG51bWJlciA9IFdyYXBNb2RlLlJFUEVBVDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3dyYXBUOiBudW1iZXIgPSBXcmFwTW9kZS5SRVBFQVQ7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF93cmFwUjogbnVtYmVyID0gV3JhcE1vZGUuUkVQRUFUO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfYW5pc290cm9weSA9IDg7XHJcblxyXG4gICAgcHJvdGVjdGVkIF93aWR0aDogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfaGVpZ2h0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9zYW1wbGVySW5mbzogKG51bWJlciB8IHVuZGVmaW5lZClbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc2FtcGxlckhhc2g6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9nZnhTYW1wbGVyOiBHRlhTYW1wbGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9nZnhEZXZpY2U6IEdGWERldmljZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyBJZCBmb3IgZ2VuZXJhdGUgaGFzaCBpbiBtYXRlcmlhbFxyXG4gICAgICAgIHRoaXMuX2lkID0gaWRHZW5lcmF0b3IuZ2V0TmV3SWQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9nZnhEZXZpY2UgPSB0aGlzLl9nZXRHRlhEZXZpY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluagh+ivhuespuOAglxyXG4gICAgICogQHJldHVybnMg5q2k6LS05Zu+55qE5qCH6K+G56ym44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRJZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5YOP57Sg5qC85byP44CCXHJcbiAgICAgKiBAcmV0dXJucyDmraTotLTlm77nmoTlg4/ntKDmoLzlvI/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFBpeGVsRm9ybWF0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9ybWF0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5ZCE5ZCR5byC5oCn44CCXHJcbiAgICAgKiBAcmV0dXJucyDmraTotLTlm77nmoTlkITlkJHlvILmgKfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEFuaXNvdHJvcHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbmlzb3Ryb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5q2k6LS05Zu+55qE57yg57uV5qih5byP44CCXHJcbiAgICAgKiDms6jmhI/vvIzoi6XotLTlm77lsLrlr7jkuI3mmK8gMiDnmoTmlbTmlbDluYLvvIznvKDnu5XmqKHlvI/ku4XlhYHorrggYFdyYXBNb2RlLkNMQU1QX1RPX0VER0Vg44CCXHJcbiAgICAgKiBAcGFyYW0gd3JhcFMgUyhVKSDlnZDmoIfnmoTph4fmoLfmqKHlvI/jgIJcclxuICAgICAqIEBwYXJhbSB3cmFwVCBUKFYpIOWdkOagh+eahOmHh+agt+aooeW8j+OAglxyXG4gICAgICogQHBhcmFtIHdyYXBSIFIoVykg5Z2Q5qCH55qE6YeH5qC35qih5byP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRXcmFwTW9kZSAod3JhcFM6IFdyYXBNb2RlLCB3cmFwVDogV3JhcE1vZGUsIHdyYXBSPzogV3JhcE1vZGUpIHtcclxuICAgICAgICB0aGlzLl93cmFwUyA9IHdyYXBTO1xyXG4gICAgICAgIHRoaXMuX3NhbXBsZXJJbmZvW1NhbXBsZXJJbmZvSW5kZXguYWRkcmVzc1VdID0gd3JhcFM7XHJcbiAgICAgICAgdGhpcy5fd3JhcFQgPSB3cmFwVDtcclxuICAgICAgICB0aGlzLl9zYW1wbGVySW5mb1tTYW1wbGVySW5mb0luZGV4LmFkZHJlc3NWXSA9IHdyYXBUO1xyXG4gICAgICAgIGlmICh3cmFwUiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dyYXBSID0gd3JhcFI7XHJcbiAgICAgICAgICAgIHRoaXMuX3NhbXBsZXJJbmZvW1NhbXBsZXJJbmZvSW5kZXguYWRkcmVzc1ddID0gd3JhcFI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zYW1wbGVySGFzaCA9IGdlblNhbXBsZXJIYXNoKHRoaXMuX3NhbXBsZXJJbmZvKTtcclxuICAgICAgICAvLyBmb3IgZWRpdG9yIGFzc2V0REJcclxuICAgICAgICBpZiAodGhpcy5fZ2Z4RGV2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dmeFNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIodGhpcy5fZ2Z4RGV2aWNlLCB0aGlzLl9zYW1wbGVySGFzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5q2k6LS05Zu+55qE6L+H5ruk566X5rOV44CCXHJcbiAgICAgKiBAcGFyYW0gbWluRmlsdGVyIOe8qeWwj+i/h+a7pOeul+azleOAglxyXG4gICAgICogQHBhcmFtIG1hZ0ZpbHRlciDmlL7lpKfov4fmu6Tnrpfms5XjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEZpbHRlcnMgKG1pbkZpbHRlcjogRmlsdGVyLCBtYWdGaWx0ZXI6IEZpbHRlcikge1xyXG4gICAgICAgIHRoaXMuX21pbkZpbHRlciA9IG1pbkZpbHRlcjtcclxuICAgICAgICB0aGlzLl9zYW1wbGVySW5mb1tTYW1wbGVySW5mb0luZGV4Lm1pbkZpbHRlcl0gPSBtaW5GaWx0ZXI7XHJcbiAgICAgICAgdGhpcy5fbWFnRmlsdGVyID0gbWFnRmlsdGVyO1xyXG4gICAgICAgIHRoaXMuX3NhbXBsZXJJbmZvW1NhbXBsZXJJbmZvSW5kZXgubWFnRmlsdGVyXSA9IG1hZ0ZpbHRlcjtcclxuICAgICAgICB0aGlzLl9zYW1wbGVySGFzaCA9IGdlblNhbXBsZXJIYXNoKHRoaXMuX3NhbXBsZXJJbmZvKTtcclxuICAgICAgICBpZiAodGhpcy5fZ2Z4RGV2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dmeFNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIodGhpcy5fZ2Z4RGV2aWNlLCB0aGlzLl9zYW1wbGVySGFzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5q2k6LS05Zu+55qEIG1pcCDov4fmu6Tnrpfms5XjgIJcclxuICAgICAqIEBwYXJhbSBtaXBGaWx0ZXIgbWlwIOi/h+a7pOeul+azleOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TWlwRmlsdGVyIChtaXBGaWx0ZXI6IEZpbHRlcikge1xyXG4gICAgICAgIHRoaXMuX21pcEZpbHRlciA9IG1pcEZpbHRlcjtcclxuICAgICAgICB0aGlzLl9zYW1wbGVySW5mb1tTYW1wbGVySW5mb0luZGV4Lm1pcEZpbHRlcl0gPSBtaXBGaWx0ZXI7XHJcbiAgICAgICAgdGhpcy5fc2FtcGxlckluZm9bU2FtcGxlckluZm9JbmRleC5tYXhMT0RdID0gbWlwRmlsdGVyID09PSBGaWx0ZXIuTk9ORSA/IDAgOiAxNTsgLy8gV2ViR0wyIG9uIHNvbWUgcGxhdGZvcm0gbmVlZCB0aGlzXHJcbiAgICAgICAgdGhpcy5fc2FtcGxlckhhc2ggPSBnZW5TYW1wbGVySGFzaCh0aGlzLl9zYW1wbGVySW5mbyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dmeERldmljZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9nZnhTYW1wbGVyID0gc2FtcGxlckxpYi5nZXRTYW1wbGVyKHRoaXMuX2dmeERldmljZSwgdGhpcy5fc2FtcGxlckhhc2gpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruatpOi0tOWbvueahOWQhOWQkeW8guaAp+OAglxyXG4gICAgICogQHBhcmFtIGFuaXNvdHJvcHkg5ZCE5ZCR5byC5oCn44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRBbmlzb3Ryb3B5IChhbmlzb3Ryb3B5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9hbmlzb3Ryb3B5ID0gYW5pc290cm9weTtcclxuICAgICAgICB0aGlzLl9zYW1wbGVySW5mb1tTYW1wbGVySW5mb0luZGV4Lm1heEFuaXNvdHJvcHldID0gYW5pc290cm9weTtcclxuICAgICAgICB0aGlzLl9zYW1wbGVySGFzaCA9IGdlblNhbXBsZXJIYXNoKHRoaXMuX3NhbXBsZXJJbmZvKTtcclxuICAgICAgICBpZiAodGhpcy5fZ2Z4RGV2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dmeFNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIodGhpcy5fZ2Z4RGV2aWNlLCB0aGlzLl9zYW1wbGVySGFzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZSA5q+B5q2k6LS05Zu+77yM5bm26YeK5pS+5Y2g5pyJ55qE5omA5pyJIEdQVSDotYTmupDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmraTotLTlm77lupXlsYLnmoQgR0ZYIOe6ueeQhuWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0R0ZYVGV4dHVyZSAoKTogR0ZYVGV4dHVyZSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5q2k6LS05Zu+5YaF6YOo5L2/55So55qEIEdGWCDph4fmoLflmajkv6Hmga/jgIJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTYW1wbGVySGFzaCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhbXBsZXJIYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5q2k6LS05Zu+5bqV5bGC55qEIEdGWCDph4fmoLfkv6Hmga/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEdGWFNhbXBsZXIgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZ2Z4U2FtcGxlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZ2Z4RGV2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZnhTYW1wbGVyID0gc2FtcGxlckxpYi5nZXRTYW1wbGVyKHRoaXMuX2dmeERldmljZSwgdGhpcy5fc2FtcGxlckhhc2gpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCg5MzAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2Z4U2FtcGxlciE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU0VSSUFMSVpBVElPTlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVyblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX3NlcmlhbGl6ZSAoZXhwb3J0aW5nPzogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWluRmlsdGVyICsgJywnICsgdGhpcy5fbWFnRmlsdGVyICsgJywnICtcclxuICAgICAgICAgICAgdGhpcy5fd3JhcFMgKyAnLCcgKyB0aGlzLl93cmFwVCArICcsJyArXHJcbiAgICAgICAgICAgIHRoaXMuX21pcEZpbHRlciArICcsJyArIHRoaXMuX2FuaXNvdHJvcHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9kZXNlcmlhbGl6ZSAoc2VyaWFsaXplZERhdGE6IGFueSwgaGFuZGxlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gc2VyaWFsaXplZERhdGEgYXMgc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGRhdGEuc3BsaXQoJywnKTtcclxuICAgICAgICBmaWVsZHMudW5zaGlmdCgnJyk7XHJcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPj0gNSkge1xyXG4gICAgICAgICAgICAvLyBkZWNvZGUgZmlsdGVyc1xyXG4gICAgICAgICAgICB0aGlzLnNldEZpbHRlcnMocGFyc2VJbnQoZmllbGRzWzFdKSwgcGFyc2VJbnQoZmllbGRzWzJdKSk7XHJcbiAgICAgICAgICAgIC8vIGRlY29kZSB3cmFwc1xyXG4gICAgICAgICAgICB0aGlzLnNldFdyYXBNb2RlKHBhcnNlSW50KGZpZWxkc1szXSksIHBhcnNlSW50KGZpZWxkc1s0XSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA+PSA3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TWlwRmlsdGVyKHBhcnNlSW50KGZpZWxkc1s1XSkpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFuaXNvdHJvcHkocGFyc2VJbnQoZmllbGRzWzZdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0R0ZYRGV2aWNlICgpOiBHRlhEZXZpY2UgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCAmJiBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldEdGWEZvcm1hdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEdGWFBpeGVsRm9ybWF0KHRoaXMuX2Zvcm1hdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zZXRHRlhGb3JtYXQgKGZvcm1hdD86IFBpeGVsRm9ybWF0KSB7XHJcbiAgICAgICAgdGhpcy5fZm9ybWF0ID0gZm9ybWF0ID09PSB1bmRlZmluZWQgPyBQaXhlbEZvcm1hdC5SR0JBODg4OCA6IGZvcm1hdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldEdGWFBpeGVsRm9ybWF0IChmb3JtYXQpIHtcclxuICAgICAgICBpZiAoZm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JBX0VUQzEpIHtcclxuICAgICAgICAgICAgZm9ybWF0ID0gUGl4ZWxGb3JtYXQuUkdCX0VUQzE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0FfUFZSVENfNEJQUFYxKSB7XHJcbiAgICAgICAgICAgIGZvcm1hdCA9IFBpeGVsRm9ybWF0LlJHQl9QVlJUQ180QlBQVjE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0FfUFZSVENfMkJQUFYxKSB7XHJcbiAgICAgICAgICAgIGZvcm1hdCA9IFBpeGVsRm9ybWF0LlJHQl9QVlJUQ18yQlBQVjE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlRleHR1cmVCYXNlID0gVGV4dHVyZUJhc2U7XHJcbiJdfQ==