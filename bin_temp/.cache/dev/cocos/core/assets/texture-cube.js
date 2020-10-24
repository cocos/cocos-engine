(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../gfx/define.js", "./image-asset.js", "./simple-texture.js", "../global-exports.js", "../gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../gfx/define.js"), require("./image-asset.js"), require("./simple-texture.js"), require("../global-exports.js"), require("../gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.imageAsset, global.simpleTexture, global.globalExports, global.index);
    global.textureCube = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _imageAsset, _simpleTexture, _globalExports, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TextureCube = void 0;

  var _dec, _class, _class2, _descriptor, _class3, _temp;

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
   * 立方体每个面的约定索引。
   */
  var FaceIndex;
  /**
   * 立方体贴图资源。
   * 立方体贴图资源的每个 Mipmap 层级都为 6 张图像资源，分别代表了立方体贴图的 6 个面。
   */

  (function (FaceIndex) {
    FaceIndex[FaceIndex["right"] = 0] = "right";
    FaceIndex[FaceIndex["left"] = 1] = "left";
    FaceIndex[FaceIndex["top"] = 2] = "top";
    FaceIndex[FaceIndex["bottom"] = 3] = "bottom";
    FaceIndex[FaceIndex["front"] = 4] = "front";
    FaceIndex[FaceIndex["back"] = 5] = "back";
  })(FaceIndex || (FaceIndex = {}));

  var TextureCube = (_dec = (0, _index.ccclass)('cc.TextureCube'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_SimpleTexture) {
    _inherits(TextureCube, _SimpleTexture);

    function TextureCube() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, TextureCube);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TextureCube)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_mipmaps", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(TextureCube, [{
      key: "onLoaded",
      value: function onLoaded() {
        this.mipmaps = this._mipmaps;
        this.loaded = true;
        this.emit('load');
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
    }, {
      key: "updateMipmaps",
      value: function updateMipmaps() {
        var _this2 = this;

        var firstLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var count = arguments.length > 1 ? arguments[1] : undefined;

        if (firstLevel >= this._mipmaps.length) {
          return;
        }

        var nUpdate = Math.min(count === undefined ? this._mipmaps.length : count, this._mipmaps.length - firstLevel);

        var _loop = function _loop(i) {
          var level = firstLevel + i;

          _forEachFace(_this2._mipmaps[level], function (face, faceIndex) {
            _this2._assignImage(face, level, faceIndex);
          });
        };

        for (var i = 0; i < nUpdate; ++i) {
          _loop(i);
        }
      }
      /**
       * 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this._mipmaps = [];
        return _get(_getPrototypeOf(TextureCube.prototype), "destroy", this).call(this);
      }
      /**
       * 释放占用的 GPU 资源。
       * @deprecated 请转用 `this.destroy()`。
       */

    }, {
      key: "releaseTexture",
      value: function releaseTexture() {
        this.mipmaps = [];
      }
    }, {
      key: "_serialize",
      value: function _serialize(exporting) {
        return {
          base: _get(_getPrototypeOf(TextureCube.prototype), "_serialize", this).call(this),
          mipmaps: this._mipmaps.map(function (mipmap) {
            return exporting ? {
              front: EditorExtends.UuidUtils.compressUuid(mipmap.front._uuid, true),
              back: EditorExtends.UuidUtils.compressUuid(mipmap.back._uuid, true),
              left: EditorExtends.UuidUtils.compressUuid(mipmap.left._uuid, true),
              right: EditorExtends.UuidUtils.compressUuid(mipmap.right._uuid, true),
              top: EditorExtends.UuidUtils.compressUuid(mipmap.top._uuid, true),
              bottom: EditorExtends.UuidUtils.compressUuid(mipmap.bottom._uuid, true)
            } : {
              front: mipmap.front._uuid,
              back: mipmap.back._uuid,
              left: mipmap.left._uuid,
              right: mipmap.right._uuid,
              top: mipmap.top._uuid,
              bottom: mipmap.bottom._uuid
            };
          })
        };
      }
    }, {
      key: "_deserialize",
      value: function _deserialize(serializedData, handle) {
        var data = serializedData;

        _get(_getPrototypeOf(TextureCube.prototype), "_deserialize", this).call(this, data.base, handle);

        this._mipmaps = new Array(data.mipmaps.length);

        for (var i = 0; i < data.mipmaps.length; ++i) {
          // Prevent resource load failed
          this._mipmaps[i] = {
            front: new _imageAsset.ImageAsset(),
            back: new _imageAsset.ImageAsset(),
            left: new _imageAsset.ImageAsset(),
            right: new _imageAsset.ImageAsset(),
            top: new _imageAsset.ImageAsset(),
            bottom: new _imageAsset.ImageAsset()
          };
          var mipmap = data.mipmaps[i];
          handle.result.push(this._mipmaps[i], "front", mipmap.front);
          handle.result.push(this._mipmaps[i], "back", mipmap.back);
          handle.result.push(this._mipmaps[i], "left", mipmap.left);
          handle.result.push(this._mipmaps[i], "right", mipmap.right);
          handle.result.push(this._mipmaps[i], "top", mipmap.top);
          handle.result.push(this._mipmaps[i], "bottom", mipmap.bottom);
        }
      }
    }, {
      key: "_getGfxTextureCreateInfo",
      value: function _getGfxTextureCreateInfo(presumed) {
        var texInfo = new _index2.GFXTextureInfo(_define.GFXTextureType.CUBE);
        texInfo.width = this._width;
        texInfo.height = this._height;
        texInfo.layerCount = 6;
        Object.assign(texInfo, presumed);
        texInfo.flags = texInfo.flags | _define.GFXTextureFlagBit.CUBEMAP;
        return texInfo;
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
        var _this3 = this;

        this._mipmaps = value;

        this._setMipmapLevel(this._mipmaps.length);

        if (this._mipmaps.length > 0) {
          var imageAsset = this._mipmaps[0].front;
          this.reset({
            width: imageAsset.width,
            height: imageAsset.height,
            format: imageAsset.format,
            mipmapLevel: this._mipmaps.length
          });

          this._mipmaps.forEach(function (mipmap, level) {
            _forEachFace(mipmap, function (face, faceIndex) {
              _this3._assignImage(face, level, faceIndex);
            });
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
       * 0 级 Mipmap。<br>
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
      /**
       * 通过二维贴图指定每个 Mipmap 的每个面创建立方体贴图。
       * @param textures 数组长度必须是6的倍数。
       * 每 6 个二维贴图依次构成立方体贴图的 Mipmap。6 个面应该按 `FaceIndex` 规定顺序排列。
       * @param out 出口立方体贴图，若未定义则将创建为新的立方体贴图。
       * @returns `out`
       * @example
       * ```ts
       * const textures = new Array<Texture2D>(6);
       * textures[TextureCube.FaceIndex.front] = frontImage;
       * textures[TextureCube.FaceIndex.back] = backImage;
       * textures[TextureCube.FaceIndex.left] = leftImage;
       * textures[TextureCube.FaceIndex.right] = rightImage;
       * textures[TextureCube.FaceIndex.top] = topImage;
       * textures[TextureCube.FaceIndex.bottom] = bottomImage;
       * const textureCube = TextureCube.fromTexture2DArray(textures);
       * ```
       */

    }], [{
      key: "fromTexture2DArray",
      value: function fromTexture2DArray(textures, out) {
        var mipmaps = [];
        var nMipmaps = textures.length / 6;

        for (var i = 0; i < nMipmaps; i++) {
          var x = i * 6;
          mipmaps.push({
            front: textures[x + FaceIndex.front].image,
            back: textures[x + FaceIndex.back].image,
            left: textures[x + FaceIndex.left].image,
            right: textures[x + FaceIndex.right].image,
            top: textures[x + FaceIndex.top].image,
            bottom: textures[x + FaceIndex.bottom].image
          });
        }

        out = out || new TextureCube();
        out.mipmaps = mipmaps;
        return out;
      }
    }]);

    return TextureCube;
  }(_simpleTexture.SimpleTexture), _class3.FaceIndex = FaceIndex, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mipmaps", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.TextureCube = TextureCube;
  _globalExports.legacyCC.TextureCube = TextureCube;

  /**
   * @param {Mipmap} mipmap
   * @param {(face: ImageAsset) => void} callback
   */
  function _forEachFace(mipmap, callback) {
    callback(mipmap.front, FaceIndex.front);
    callback(mipmap.back, FaceIndex.back);
    callback(mipmap.left, FaceIndex.left);
    callback(mipmap.right, FaceIndex.right);
    callback(mipmap.top, FaceIndex.top);
    callback(mipmap.bottom, FaceIndex.bottom);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3RleHR1cmUtY3ViZS50cyJdLCJuYW1lcyI6WyJGYWNlSW5kZXgiLCJUZXh0dXJlQ3ViZSIsIm1pcG1hcHMiLCJfbWlwbWFwcyIsImxvYWRlZCIsImVtaXQiLCJpbmZvIiwiX3dpZHRoIiwid2lkdGgiLCJfaGVpZ2h0IiwiaGVpZ2h0IiwiX3NldEdGWEZvcm1hdCIsImZvcm1hdCIsIl9zZXRNaXBtYXBMZXZlbCIsIm1pcG1hcExldmVsIiwiX3RyeVJlc2V0IiwiZmlyc3RMZXZlbCIsImNvdW50IiwibGVuZ3RoIiwiblVwZGF0ZSIsIk1hdGgiLCJtaW4iLCJ1bmRlZmluZWQiLCJpIiwibGV2ZWwiLCJfZm9yRWFjaEZhY2UiLCJmYWNlIiwiZmFjZUluZGV4IiwiX2Fzc2lnbkltYWdlIiwiZXhwb3J0aW5nIiwiYmFzZSIsIm1hcCIsIm1pcG1hcCIsImZyb250IiwiRWRpdG9yRXh0ZW5kcyIsIlV1aWRVdGlscyIsImNvbXByZXNzVXVpZCIsIl91dWlkIiwiYmFjayIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInNlcmlhbGl6ZWREYXRhIiwiaGFuZGxlIiwiZGF0YSIsIkFycmF5IiwiSW1hZ2VBc3NldCIsInJlc3VsdCIsInB1c2giLCJwcmVzdW1lZCIsInRleEluZm8iLCJHRlhUZXh0dXJlSW5mbyIsIkdGWFRleHR1cmVUeXBlIiwiQ1VCRSIsImxheWVyQ291bnQiLCJPYmplY3QiLCJhc3NpZ24iLCJmbGFncyIsIkdGWFRleHR1cmVGbGFnQml0IiwiQ1VCRU1BUCIsInZhbHVlIiwiaW1hZ2VBc3NldCIsInJlc2V0IiwiZm9yRWFjaCIsInRleHR1cmVzIiwib3V0Iiwibk1pcG1hcHMiLCJ4IiwiaW1hZ2UiLCJTaW1wbGVUZXh0dXJlIiwic2VyaWFsaXphYmxlIiwibGVnYWN5Q0MiLCJjYWxsYmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QyxJQUF4QixDQUFSO0FBQ0FrQyxJQUFBQSxRQUFRLENBQUN6QyxNQUFNLENBQUNRLEtBQVIsRUFBZXhDLFNBQVMsQ0FBQ3dDLEtBQXpCLENBQVI7QUFDQWlDLElBQUFBLFFBQVEsQ0FBQ3pDLE1BQU0sQ0FBQ1MsR0FBUixFQUFhekMsU0FBUyxDQUFDeUMsR0FBdkIsQ0FBUjtBQUNBZ0MsSUFBQUEsUUFBUSxDQUFDekMsTUFBTSxDQUFDVSxNQUFSLEVBQWdCMUMsU0FBUyxDQUFDMEMsTUFBMUIsQ0FBUjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBhc3NldFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IEdGWFRleHR1cmVGbGFnQml0LCBHRlhUZXh0dXJlVHlwZSB9IGZyb20gJy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBJbWFnZUFzc2V0IH0gZnJvbSAnLi9pbWFnZS1hc3NldCc7XHJcbmltcG9ydCB7IFByZXN1bWVkR0ZYVGV4dHVyZUluZm8sIFNpbXBsZVRleHR1cmUgfSBmcm9tICcuL3NpbXBsZS10ZXh0dXJlJztcclxuaW1wb3J0IHsgSVRleHR1cmUyRENyZWF0ZUluZm8sIFRleHR1cmUyRCB9IGZyb20gJy4vdGV4dHVyZS0yZCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlSW5mbyB9IGZyb20gJy4uL2dmeCc7XHJcblxyXG5leHBvcnQgdHlwZSBJVGV4dHVyZUN1YmVDcmVhdGVJbmZvID0gSVRleHR1cmUyRENyZWF0ZUluZm87XHJcblxyXG4vKipcclxuICog56uL5pa55L2T6LS05Zu+55qEIE1pcG1hcOOAglxyXG4gKi9cclxuaW50ZXJmYWNlIElUZXh0dXJlQ3ViZU1pcG1hcCB7XHJcbiAgICBmcm9udDogSW1hZ2VBc3NldDtcclxuICAgIGJhY2s6IEltYWdlQXNzZXQ7XHJcbiAgICBsZWZ0OiBJbWFnZUFzc2V0O1xyXG4gICAgcmlnaHQ6IEltYWdlQXNzZXQ7XHJcbiAgICB0b3A6IEltYWdlQXNzZXQ7XHJcbiAgICBib3R0b206IEltYWdlQXNzZXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDnq4vmlrnkvZPmr4/kuKrpnaLnmoTnuqblrprntKLlvJXjgIJcclxuICovXHJcbmVudW0gRmFjZUluZGV4IHtcclxuICAgIHJpZ2h0ID0gMCxcclxuICAgIGxlZnQgPSAxLFxyXG4gICAgdG9wID0gMixcclxuICAgIGJvdHRvbSA9IDMsXHJcbiAgICBmcm9udCA9IDQsXHJcbiAgICBiYWNrID0gNSxcclxufVxyXG5cclxuLyoqXHJcbiAqIOeri+aWueS9k+i0tOWbvui1hOa6kOOAglxyXG4gKiDnq4vmlrnkvZPotLTlm77otYTmupDnmoTmr4/kuKogTWlwbWFwIOWxgue6p+mDveS4uiA2IOW8oOWbvuWDj+i1hOa6kO+8jOWIhuWIq+S7o+ihqOS6hueri+aWueS9k+i0tOWbvueahCA2IOS4qumdouOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlRleHR1cmVDdWJlJylcclxuZXhwb3J0IGNsYXNzIFRleHR1cmVDdWJlIGV4dGVuZHMgU2ltcGxlVGV4dHVyZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEZhY2VJbmRleCA9IEZhY2VJbmRleDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJgOacieWxgue6pyBNaXBtYXDvvIzms6jmhI/vvIzov5nph4zkuI3ljIXlkKvoh6rliqjnlJ/miJDnmoQgTWlwbWFw44CCXHJcbiAgICAgKiDlvZPorr7nva4gTWlwbWFwIOaXtu+8jOi0tOWbvueahOWwuuWvuOS7peWPiuWDj+e0oOagvOW8j+WPr+iDveS8muaUueWPmOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWlwbWFwcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pcG1hcHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG1pcG1hcHMgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbWlwbWFwcyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NldE1pcG1hcExldmVsKHRoaXMuX21pcG1hcHMubGVuZ3RoKTtcclxuICAgICAgICBpZiAodGhpcy5fbWlwbWFwcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlQXNzZXQ6IEltYWdlQXNzZXQgPSB0aGlzLl9taXBtYXBzWzBdLmZyb250O1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0KHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBpbWFnZUFzc2V0LndpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBpbWFnZUFzc2V0LmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGZvcm1hdDogaW1hZ2VBc3NldC5mb3JtYXQsXHJcbiAgICAgICAgICAgICAgICBtaXBtYXBMZXZlbDogdGhpcy5fbWlwbWFwcy5sZW5ndGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9taXBtYXBzLmZvckVhY2goKG1pcG1hcCwgbGV2ZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIF9mb3JFYWNoRmFjZShtaXBtYXAsIChmYWNlLCBmYWNlSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hc3NpZ25JbWFnZShmYWNlLCBsZXZlbCwgZmFjZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0KHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgICAgICAgbWlwbWFwTGV2ZWw6IHRoaXMuX21pcG1hcHMubGVuZ3RoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAwIOe6pyBNaXBtYXDjgII8YnI+XHJcbiAgICAgKiDms6jmhI/vvIxgdGhpcy5pbWFnZSA9IGlgIOetieS7t+S6jiBgdGhpcy5taXBtYXBzID0gW2ldYO+8jFxyXG4gICAgICog5Lmf5bCx5piv6K+077yM6YCa6L+HIGB0aGlzLmltYWdlYCDorr7nva4gMCDnuqcgTWlwbWFwIOaXtuWwhumakOW8j+WcsOa4hemZpOS5i+WJjeeahOaJgOaciSBNaXBtYXDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGltYWdlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWlwbWFwcy5sZW5ndGggPT09IDAgPyBudWxsIDogdGhpcy5fbWlwbWFwc1swXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW1hZ2UgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5taXBtYXBzID0gdmFsdWUgPyBbdmFsdWVdIDogW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpgJrov4fkuoznu7TotLTlm77mjIflrprmr4/kuKogTWlwbWFwIOeahOavj+S4qumdouWIm+W7uueri+aWueS9k+i0tOWbvuOAglxyXG4gICAgICogQHBhcmFtIHRleHR1cmVzIOaVsOe7hOmVv+W6puW/hemhu+aYrzbnmoTlgI3mlbDjgIJcclxuICAgICAqIOavjyA2IOS4quS6jOe7tOi0tOWbvuS+neasoeaehOaIkOeri+aWueS9k+i0tOWbvueahCBNaXBtYXDjgII2IOS4qumdouW6lOivpeaMiSBgRmFjZUluZGV4YCDop4Tlrprpobrluo/mjpLliJfjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5Ye65Y+j56uL5pa55L2T6LS05Zu+77yM6Iul5pyq5a6a5LmJ5YiZ5bCG5Yib5bu65Li65paw55qE56uL5pa55L2T6LS05Zu+44CCXHJcbiAgICAgKiBAcmV0dXJucyBgb3V0YFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBjb25zdCB0ZXh0dXJlcyA9IG5ldyBBcnJheTxUZXh0dXJlMkQ+KDYpO1xyXG4gICAgICogdGV4dHVyZXNbVGV4dHVyZUN1YmUuRmFjZUluZGV4LmZyb250XSA9IGZyb250SW1hZ2U7XHJcbiAgICAgKiB0ZXh0dXJlc1tUZXh0dXJlQ3ViZS5GYWNlSW5kZXguYmFja10gPSBiYWNrSW1hZ2U7XHJcbiAgICAgKiB0ZXh0dXJlc1tUZXh0dXJlQ3ViZS5GYWNlSW5kZXgubGVmdF0gPSBsZWZ0SW1hZ2U7XHJcbiAgICAgKiB0ZXh0dXJlc1tUZXh0dXJlQ3ViZS5GYWNlSW5kZXgucmlnaHRdID0gcmlnaHRJbWFnZTtcclxuICAgICAqIHRleHR1cmVzW1RleHR1cmVDdWJlLkZhY2VJbmRleC50b3BdID0gdG9wSW1hZ2U7XHJcbiAgICAgKiB0ZXh0dXJlc1tUZXh0dXJlQ3ViZS5GYWNlSW5kZXguYm90dG9tXSA9IGJvdHRvbUltYWdlO1xyXG4gICAgICogY29uc3QgdGV4dHVyZUN1YmUgPSBUZXh0dXJlQ3ViZS5mcm9tVGV4dHVyZTJEQXJyYXkodGV4dHVyZXMpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVRleHR1cmUyREFycmF5ICh0ZXh0dXJlczogVGV4dHVyZTJEW10sIG91dD86IFRleHR1cmVDdWJlKSB7XHJcbiAgICAgICAgY29uc3QgbWlwbWFwczogSVRleHR1cmVDdWJlTWlwbWFwW10gPSBbXTtcclxuICAgICAgICBjb25zdCBuTWlwbWFwcyA9IHRleHR1cmVzLmxlbmd0aCAvIDY7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuTWlwbWFwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBpICogNjtcclxuICAgICAgICAgICAgbWlwbWFwcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGZyb250OiB0ZXh0dXJlc1t4ICsgRmFjZUluZGV4LmZyb250XS5pbWFnZSEsXHJcbiAgICAgICAgICAgICAgICBiYWNrOiB0ZXh0dXJlc1t4ICsgRmFjZUluZGV4LmJhY2tdLmltYWdlISxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHRleHR1cmVzW3ggKyBGYWNlSW5kZXgubGVmdF0uaW1hZ2UhLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IHRleHR1cmVzW3ggKyBGYWNlSW5kZXgucmlnaHRdLmltYWdlISxcclxuICAgICAgICAgICAgICAgIHRvcDogdGV4dHVyZXNbeCArIEZhY2VJbmRleC50b3BdLmltYWdlISxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogdGV4dHVyZXNbeCArIEZhY2VJbmRleC5ib3R0b21dLmltYWdlISxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVGV4dHVyZUN1YmUoKTtcclxuICAgICAgICBvdXQubWlwbWFwcyA9IG1pcG1hcHM7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgX21pcG1hcHM6IElUZXh0dXJlQ3ViZU1pcG1hcFtdID0gW107XHJcblxyXG4gICAgcHVibGljIG9uTG9hZGVkICgpIHtcclxuICAgICAgICB0aGlzLm1pcG1hcHMgPSB0aGlzLl9taXBtYXBzO1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVtaXQoJ2xvYWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuW9k+WJjei0tOWbvumHjee9ruS4uuaMh+WumuWwuuWvuOOAgeWDj+e0oOagvOW8j+S7peWPiuaMh+WumiBtaXBtYXAg5bGC57qn44CC6YeN572u5ZCO77yM6LS05Zu+55qE5YOP57Sg5pWw5o2u5bCG5Y+Y5Li65pyq5a6a5LmJ44CCXHJcbiAgICAgKiBtaXBtYXAg5Zu+5YOP55qE5pWw5o2u5LiN5Lya6Ieq5Yqo5pu05paw5Yiw6LS05Zu+5Lit77yM5L2g5b+F6aG75pi+5byP6LCD55SoIGB0aGlzLnVwbG9hZERhdGFgIOadpeS4iuS8oOi0tOWbvuaVsOaNruOAglxyXG4gICAgICogQHBhcmFtIGluZm8g6LS05Zu+6YeN572u6YCJ6aG544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldCAoaW5mbzogSVRleHR1cmVDdWJlQ3JlYXRlSW5mbykge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gaW5mby53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBpbmZvLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9zZXRHRlhGb3JtYXQoaW5mby5mb3JtYXQpO1xyXG4gICAgICAgIHRoaXMuX3NldE1pcG1hcExldmVsKGluZm8ubWlwbWFwTGV2ZWwgfHwgMSk7XHJcbiAgICAgICAgdGhpcy5fdHJ5UmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlTWlwbWFwcyAoZmlyc3RMZXZlbDogbnVtYmVyID0gMCwgY291bnQ/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoZmlyc3RMZXZlbCA+PSB0aGlzLl9taXBtYXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuVXBkYXRlID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgIGNvdW50ID09PSB1bmRlZmluZWQgPyB0aGlzLl9taXBtYXBzLmxlbmd0aCA6IGNvdW50LFxyXG4gICAgICAgICAgICB0aGlzLl9taXBtYXBzLmxlbmd0aCAtIGZpcnN0TGV2ZWwpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5VcGRhdGU7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBsZXZlbCA9IGZpcnN0TGV2ZWwgKyBpO1xyXG4gICAgICAgICAgICBfZm9yRWFjaEZhY2UodGhpcy5fbWlwbWFwc1tsZXZlbF0sIChmYWNlLCBmYWNlSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Fzc2lnbkltYWdlKGZhY2UsIGxldmVsLCBmYWNlSW5kZXgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4HmraTotLTlm77vvIzmuIXnqbrmiYDmnIkgTWlwbWFwIOW5tumHiuaUvuWNoOeUqOeahCBHUFUg6LWE5rqQ44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9taXBtYXBzID0gW107XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuWNoOeUqOeahCBHUFUg6LWE5rqQ44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCDor7fovaznlKggYHRoaXMuZGVzdHJveSgpYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVsZWFzZVRleHR1cmUgKCkge1xyXG4gICAgICAgIHRoaXMubWlwbWFwcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfc2VyaWFsaXplIChleHBvcnRpbmc/OiBhbnkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBiYXNlOiBzdXBlci5fc2VyaWFsaXplKCksXHJcbiAgICAgICAgICAgIG1pcG1hcHM6IHRoaXMuX21pcG1hcHMubWFwKChtaXBtYXApID0+IGV4cG9ydGluZyA/IHtcclxuICAgICAgICAgICAgICAgIGZyb250OiBFZGl0b3JFeHRlbmRzLlV1aWRVdGlscy5jb21wcmVzc1V1aWQobWlwbWFwLmZyb250Ll91dWlkLCB0cnVlKSxcclxuICAgICAgICAgICAgICAgIGJhY2s6IEVkaXRvckV4dGVuZHMuVXVpZFV0aWxzLmNvbXByZXNzVXVpZChtaXBtYXAuYmFjay5fdXVpZCwgdHJ1ZSksXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBFZGl0b3JFeHRlbmRzLlV1aWRVdGlscy5jb21wcmVzc1V1aWQobWlwbWFwLmxlZnQuX3V1aWQsIHRydWUpLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IEVkaXRvckV4dGVuZHMuVXVpZFV0aWxzLmNvbXByZXNzVXVpZChtaXBtYXAucmlnaHQuX3V1aWQsIHRydWUpLFxyXG4gICAgICAgICAgICAgICAgdG9wOiBFZGl0b3JFeHRlbmRzLlV1aWRVdGlscy5jb21wcmVzc1V1aWQobWlwbWFwLnRvcC5fdXVpZCwgdHJ1ZSksXHJcbiAgICAgICAgICAgICAgICBib3R0b206IEVkaXRvckV4dGVuZHMuVXVpZFV0aWxzLmNvbXByZXNzVXVpZChtaXBtYXAuYm90dG9tLl91dWlkLCB0cnVlKSxcclxuICAgICAgICAgICAgfSA6IHtcclxuICAgICAgICAgICAgICAgIGZyb250OiBtaXBtYXAuZnJvbnQuX3V1aWQsXHJcbiAgICAgICAgICAgICAgICBiYWNrOiBtaXBtYXAuYmFjay5fdXVpZCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IG1pcG1hcC5sZWZ0Ll91dWlkLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IG1pcG1hcC5yaWdodC5fdXVpZCxcclxuICAgICAgICAgICAgICAgIHRvcDogbWlwbWFwLnRvcC5fdXVpZCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogbWlwbWFwLmJvdHRvbS5fdXVpZCxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2Rlc2VyaWFsaXplIChzZXJpYWxpemVkRGF0YTogSVRleHR1cmVDdWJlU2VyaWFsaXplRGF0YSwgaGFuZGxlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gc2VyaWFsaXplZERhdGEgYXMgSVRleHR1cmVDdWJlU2VyaWFsaXplRGF0YTtcclxuICAgICAgICBzdXBlci5fZGVzZXJpYWxpemUoZGF0YS5iYXNlLCBoYW5kbGUpO1xyXG5cclxuICAgICAgICB0aGlzLl9taXBtYXBzID0gbmV3IEFycmF5KGRhdGEubWlwbWFwcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5taXBtYXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIC8vIFByZXZlbnQgcmVzb3VyY2UgbG9hZCBmYWlsZWRcclxuICAgICAgICAgICAgdGhpcy5fbWlwbWFwc1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIGZyb250OiBuZXcgSW1hZ2VBc3NldCgpLFxyXG4gICAgICAgICAgICAgICAgYmFjazogbmV3IEltYWdlQXNzZXQoKSxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IG5ldyBJbWFnZUFzc2V0KCksXHJcbiAgICAgICAgICAgICAgICByaWdodDogbmV3IEltYWdlQXNzZXQoKSxcclxuICAgICAgICAgICAgICAgIHRvcDogbmV3IEltYWdlQXNzZXQoKSxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogbmV3IEltYWdlQXNzZXQoKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgbWlwbWFwID0gZGF0YS5taXBtYXBzW2ldO1xyXG4gICAgICAgICAgICBoYW5kbGUucmVzdWx0LnB1c2godGhpcy5fbWlwbWFwc1tpXSwgYGZyb250YCwgbWlwbWFwLmZyb250KTtcclxuICAgICAgICAgICAgaGFuZGxlLnJlc3VsdC5wdXNoKHRoaXMuX21pcG1hcHNbaV0sIGBiYWNrYCwgbWlwbWFwLmJhY2spO1xyXG4gICAgICAgICAgICBoYW5kbGUucmVzdWx0LnB1c2godGhpcy5fbWlwbWFwc1tpXSwgYGxlZnRgLCBtaXBtYXAubGVmdCk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5yZXN1bHQucHVzaCh0aGlzLl9taXBtYXBzW2ldLCBgcmlnaHRgLCBtaXBtYXAucmlnaHQpO1xyXG4gICAgICAgICAgICBoYW5kbGUucmVzdWx0LnB1c2godGhpcy5fbWlwbWFwc1tpXSwgYHRvcGAsIG1pcG1hcC50b3ApO1xyXG4gICAgICAgICAgICBoYW5kbGUucmVzdWx0LnB1c2godGhpcy5fbWlwbWFwc1tpXSwgYGJvdHRvbWAsIG1pcG1hcC5ib3R0b20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldEdmeFRleHR1cmVDcmVhdGVJbmZvIChwcmVzdW1lZDogUHJlc3VtZWRHRlhUZXh0dXJlSW5mbyk6IEdGWFRleHR1cmVJbmZvIHtcclxuICAgICAgICBjb25zdCB0ZXhJbmZvID0gbmV3IEdGWFRleHR1cmVJbmZvKEdGWFRleHR1cmVUeXBlLkNVQkUpO1xyXG4gICAgICAgIHRleEluZm8ud2lkdGggPSB0aGlzLl93aWR0aDtcclxuICAgICAgICB0ZXhJbmZvLmhlaWdodCA9IHRoaXMuX2hlaWdodDtcclxuICAgICAgICB0ZXhJbmZvLmxheWVyQ291bnQgPSA2O1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGV4SW5mbywgcHJlc3VtZWQpO1xyXG4gICAgICAgIHRleEluZm8uZmxhZ3MgPSB0ZXhJbmZvLmZsYWdzIHwgR0ZYVGV4dHVyZUZsYWdCaXQuQ1VCRU1BUDtcclxuICAgICAgICByZXR1cm4gdGV4SW5mbztcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuVGV4dHVyZUN1YmUgPSBUZXh0dXJlQ3ViZTtcclxuXHJcbmludGVyZmFjZSBJVGV4dHVyZUN1YmVTZXJpYWxpemVEYXRhIHtcclxuICAgIGJhc2U6IHN0cmluZztcclxuICAgIG1pcG1hcHM6IHtcclxuICAgICAgICBmcm9udDogc3RyaW5nO1xyXG4gICAgICAgIGJhY2s6IHN0cmluZztcclxuICAgICAgICBsZWZ0OiBzdHJpbmc7XHJcbiAgICAgICAgcmlnaHQ6IHN0cmluZztcclxuICAgICAgICB0b3A6IHN0cmluZztcclxuICAgICAgICBib3R0b206IHN0cmluZztcclxuICAgIH1bXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7TWlwbWFwfSBtaXBtYXBcclxuICogQHBhcmFtIHsoZmFjZTogSW1hZ2VBc3NldCkgPT4gdm9pZH0gY2FsbGJhY2tcclxuICovXHJcbmZ1bmN0aW9uIF9mb3JFYWNoRmFjZSAobWlwbWFwOiBJVGV4dHVyZUN1YmVNaXBtYXAsIGNhbGxiYWNrOiAoZmFjZTogSW1hZ2VBc3NldCwgZmFjZUluZGV4OiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgIGNhbGxiYWNrKG1pcG1hcC5mcm9udCwgRmFjZUluZGV4LmZyb250KTtcclxuICAgIGNhbGxiYWNrKG1pcG1hcC5iYWNrLCBGYWNlSW5kZXguYmFjayk7XHJcbiAgICBjYWxsYmFjayhtaXBtYXAubGVmdCwgRmFjZUluZGV4LmxlZnQpO1xyXG4gICAgY2FsbGJhY2sobWlwbWFwLnJpZ2h0LCBGYWNlSW5kZXgucmlnaHQpO1xyXG4gICAgY2FsbGJhY2sobWlwbWFwLnRvcCwgRmFjZUluZGV4LnRvcCk7XHJcbiAgICBjYWxsYmFjayhtaXBtYXAuYm90dG9tLCBGYWNlSW5kZXguYm90dG9tKTtcclxufVxyXG4iXX0=