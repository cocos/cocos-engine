(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../math/index.js", "../utils/murmurhash2_gc.js", "./asset.js", "../default-constants.js", "../global-exports.js", "./image-asset.js", "./texture-2d.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../math/index.js"), require("../utils/murmurhash2_gc.js"), require("./asset.js"), require("../default-constants.js"), require("../global-exports.js"), require("./image-asset.js"), require("./texture-2d.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.murmurhash2_gc, global.asset, global.defaultConstants, global.globalExports, global.imageAsset, global.texture2d, global.debug);
    global.spriteFrame = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _murmurhash2_gc, _asset, _defaultConstants, _globalExports, _imageAsset, _texture2d, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SpriteFrame = void 0;

  var _dec, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  var INSET_LEFT = 0;
  var INSET_TOP = 1;
  var INSET_RIGHT = 2;
  var INSET_BOTTOM = 3;
  var temp_uvs = [{
    u: 0,
    v: 0
  }, {
    u: 0,
    v: 0
  }, {
    u: 0,
    v: 0
  }, {
    u: 0,
    v: 0
  }];
  /**
   * @en
   * A `SpriteFrame` has:<br/>
   *  - texture: A `Texture2D` that will be used by render components<br/>
   *  - rectangle: A rectangle of the texture
   *
   * @zh
   * 精灵帧资源。
   * 一个 SpriteFrame 包含：<br/>
   *  - 纹理：会被渲染组件使用的 Texture2D 对象。<br/>
   *  - 矩形：在纹理中的矩形区域。
   * 可通过 `SpriteFrame` 获取该组件。
   *
   * @example
   * ```ts
   * import { loader } from 'cc';
   * // First way to use a SpriteFrame
   * const url = "assets/PurpleMonster/icon/spriteFrame";
   * loader.loadRes(url, (err, spriteFrame) => {
   *   const node = new Node("New Sprite");
   *   const sprite = node.addComponent(Sprite);
   *   sprite.spriteFrame = spriteFrame;
   *   node.parent = self.node;
   * });
   *
   * // Second way to use a SpriteFrame
   * const self = this;
   * const url = "test_assets/PurpleMonster";
   * loader.loadRes(url, (err, imageAsset) => {
   *  if(err){
   *    return;
   *  }
   *
   *  const node = new Node("New Sprite");
   *  const sprite = node.addComponent(Sprite);
   *  const spriteFrame = new SpriteFrame();
   *  const tex = imageAsset._texture;
   *  spriteFrame.texture = tex;
   *  sprite.spriteFrame = spriteFrame;
   *  node.parent = self.node;
   * });
   *
   * // Third way to use a SpriteFrame
   * const self = this;
   * const cameraComp = this.getComponent(Camera);
   * const renderTexture = new RenderTexture();
   * rendetTex.reset({
   *   width: 512,
   *   height: 512,
   *   depthStencilFormat: RenderTexture.DepthStencilFormat.DEPTH_24_STENCIL_8
   * });
   *
   * cameraComp.targetTexture = renderTexture;
   * const spriteFrame = new SpriteFrame();
   * spriteFrame.texture = renderTexture;
   * ```
   */

  var SpriteFrame = (_dec = (0, _index.ccclass)('cc.SpriteFrame'), _dec(_class = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(SpriteFrame, _Asset);

    _createClass(SpriteFrame, [{
      key: "insetTop",

      /**
       * @en
       * Top border of the sprite.
       *
       * @zh
       * sprite 的顶部边框。
       */
      get: function get() {
        return this._capInsets[INSET_TOP];
      },
      set: function set(value) {
        if (this._capInsets[INSET_TOP] === value) {
          return;
        }

        this._capInsets[INSET_TOP] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
      /**
       * @en
       * Bottom border of the sprite.
       *
       * @zh
       * sprite 的底部边框。
       */

    }, {
      key: "insetBottom",
      get: function get() {
        return this._capInsets[INSET_BOTTOM];
      },
      set: function set(value) {
        if (this._capInsets[INSET_BOTTOM] === value) {
          return;
        }

        this._capInsets[INSET_BOTTOM] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
      /**
       * @en
       * Left border of the sprite.
       *
       * @zh
       * sprite 的左边边框。
       */

    }, {
      key: "insetLeft",
      get: function get() {
        return this._capInsets[INSET_LEFT];
      },
      set: function set(value) {
        if (this._capInsets[INSET_LEFT] === value) {
          return;
        }

        this._capInsets[INSET_LEFT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
      /**
       * @en
       * Right border of the sprite.
       *
       * @zh
       * sprite 的右边边框。
       */

    }, {
      key: "insetRight",
      get: function get() {
        return this._capInsets[INSET_RIGHT];
      },
      set: function set(value) {
        if (this._capInsets[INSET_RIGHT] === value) {
          return;
        }

        this._capInsets[INSET_RIGHT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
      /**
       * @en
       * Returns the rect of the sprite frame in the texture.
       * If it's a atlas texture, a transparent pixel area is proposed for the actual mapping of the current texture.
       *
       * @zh
       * 获取 SpriteFrame 的纹理矩形区域。
       * 如果是一个 atlas 的贴图，则为当前贴图的实际剔除透明像素区域。
       */

    }, {
      key: "rect",
      get: function get() {
        return this._rect;
      },
      set: function set(value) {
        if (this._rect.equals(value)) {
          return;
        }

        this._rect.set(value);

        if (this._texture) {
          this._calculateUV();
        }
      }
      /**
       * @en
       * Returns the original size of the trimmed image.
       *
       * @zh
       * 获取修剪前的原始大小。
       */

    }, {
      key: "originalSize",
      get: function get() {
        return this._originalSize;
      },
      set: function set(value) {
        if (this._originalSize.equals(value)) {
          return;
        }

        this._originalSize.set(value);

        if (this._texture) {
          this._calculateUV();
        }
      }
      /**
       * @en
       * Returns the offset of the frame in the texture.
       *
       * @zh
       * 获取偏移量。
       */

    }, {
      key: "offset",
      get: function get() {
        return this._offset;
      },
      set: function set(value) {
        this._offset.set(value);
      }
      /**
       * @en
       * Returns whether the sprite frame is rotated in the texture.
       *
       * @zh
       * 获取 SpriteFrame 是否旋转。
       */

    }, {
      key: "rotated",
      get: function get() {
        return this._rotated;
      },
      set: function set(rotated) {
        if (this._rotated === rotated) {
          return;
        }

        this._rotated = rotated;

        if (this._texture) {
          this._calculateUV();
        }
      }
    }, {
      key: "texture",
      get: function get() {
        return this._texture;
      },
      set: function set(value) {
        if (!value) {
          console.warn("Error Texture in ".concat(this.name));
          return;
        }

        this.reset({
          texture: value
        }, true);
      }
    }, {
      key: "atlasUuid",
      get: function get() {
        return this._atlasUuid;
      },
      set: function set(value) {
        this._atlasUuid = value;
      }
    }, {
      key: "width",
      get: function get() {
        return this._texture.width;
      }
    }, {
      key: "height",
      get: function get() {
        return this._texture.height;
      }
    }, {
      key: "_textureSource",
      set: function set(value) {
        if (value) {
          this._refreshTexture(value);

          this._calculateUV();
        }
      }
    }], [{
      key: "createWithImage",

      /**
       * @en
       * Create a SpriteFrame object by an image asset or an native image asset
       * @zh
       * 通过 Image 资源或者原始 image 资源创建一个 SpriteFrame 对象
       * @param imageSourceOrImageAsset ImageAsset or ImageSource, ImageSource support HTMLCanvasElement HTMLImageElement IMemoryImageSource
       */
      value: function createWithImage(imageSourceOrImageAsset) {
        var img = imageSourceOrImageAsset instanceof _imageAsset.ImageAsset ? imageSourceOrImageAsset : new _imageAsset.ImageAsset(imageSourceOrImageAsset);
        var tex = new _texture2d.Texture2D();
        tex.image = img;
        var spf = new SpriteFrame();
        spf.texture = tex;
        return spf;
      }
    }]);

    function SpriteFrame() {
      var _this;

      _classCallCheck(this, SpriteFrame);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SpriteFrame).call(this));
      _this.vertices = null;
      _this.uv = [];
      _this.uvHash = 0;
      _this.uvSliced = [];
      _this._rect = new _index2.Rect();
      _this._offset = new _index2.Vec2();
      _this._originalSize = new _index2.Size();
      _this._rotated = false;
      _this._capInsets = [0, 0, 0, 0];
      _this._atlasUuid = '';
      _this._texture = void 0;
      _this._flipUv = false;

      if (_defaultConstants.EDITOR) {
        // Atlas asset uuid
        _this._atlasUuid = '';
      }

      return _this;
    }
    /**
     * @en
     * Returns whether the texture have been loaded.
     *
     * @zh
     * 返回是否已加载精灵帧。
     */


    _createClass(SpriteFrame, [{
      key: "textureLoaded",
      value: function textureLoaded() {
        return this.texture && this.texture.loaded;
      }
      /**
       * @en
       * Returns whether the sprite frame is rotated in the texture.
       *
       * @zh
       * 获取 SpriteFrame 是否旋转。
       * @deprecated 即将在 1.2 废除，请使用 `isRotated = rect.rotated`。
       */

    }, {
      key: "isRotated",
      value: function isRotated() {
        return this._rotated;
      }
      /**
       * @en
       * Set whether the sprite frame is rotated in the texture.
       *
       * @zh
       * 设置 SpriteFrame 是否旋转。
       * @param value
       * @deprecated 即将在 1.2 废除，请使用 `rect.rotated = true`。
       */

    }, {
      key: "setRotated",
      value: function setRotated(rotated) {
        this.rotated = rotated;
      }
      /**
       * @en
       * Returns the rect of the sprite frame in the texture.
       * If it's a atlas texture, a transparent pixel area is proposed for the actual mapping of the current texture.
       *
       * @zh
       * 获取 SpriteFrame 的纹理矩形区域。
       * 如果是一个 atlas 的贴图，则为当前贴图的实际剔除透明像素区域。
       * @deprecated 即将在 1.2 废除，请使用 `rect.set(spritFrame.rect)`。
       */

    }, {
      key: "getRect",
      value: function getRect(out) {
        if (out) {
          out.set(this._rect);
          return out;
        }

        return this._rect.clone();
      }
      /**
       * @en
       * Sets the rect of the sprite frame in the texture.
       *
       * @zh
       * 设置 SpriteFrame 的纹理矩形区域。
       * @deprecated 即将在 1.2 废除，请使用 `spritFrame.rect = rect`。
       */

    }, {
      key: "setRect",
      value: function setRect(rect) {
        this.rect = rect;
      }
      /**
       * @en
       * Returns the original size of the trimmed image.
       *
       * @zh
       * 获取修剪前的原始大小。
       * @deprecated 即将在 1.2 废除，请使用 `size.set(spritFrame.originalSize)`。
       */

    }, {
      key: "getOriginalSize",
      value: function getOriginalSize(out) {
        if (out) {
          out.set(this._originalSize);
          return out;
        }

        return this._originalSize.clone();
      }
      /**
       * @en
       * Sets the original size of the trimmed image.
       *
       * @zh
       * 设置修剪前的原始大小。
       *
       * @param size - 设置精灵原始大小。
       * @deprecated 即将在 1.2 废除，请使用 `spritFrame.originalSize = size`。
       */

    }, {
      key: "setOriginalSize",
      value: function setOriginalSize(size) {
        this.originalSize = size;
      }
      /**
       * @en
       * Returns the offset of the frame in the texture.
       *
       * @zh
       * 获取偏移量。
       *
       * @param out - 可复用的偏移量。
       * @deprecated 即将在 1.2 废除，请使用 `offset.set(spritFrame.offset)`。
       */

    }, {
      key: "getOffset",
      value: function getOffset(out) {
        if (out) {
          out.set(this._offset);
          return out;
        }

        return this._offset.clone();
      }
      /**
       * @en
       * Sets the offset of the frame in the texture.
       *
       * @zh
       * 设置偏移量。
       *
       * @param offsets - 偏移量。
       * @deprecated 即将在 1.2 废除，请使用 `spritFrame.offset = offset`。
       */

    }, {
      key: "setOffset",
      value: function setOffset(offset) {
        this.offset = offset;
      }
    }, {
      key: "getGFXTexture",
      value: function getGFXTexture() {
        return this._texture.getGFXTexture();
      }
    }, {
      key: "getGFXSampler",
      value: function getGFXSampler() {
        return this._texture.getGFXSampler();
      }
      /**
       * 重置 SpriteFrame 数据。
       * @param info SpriteFrame 初始化数据。
       */

    }, {
      key: "reset",
      value: function reset(info) {
        var clearData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var calUV = false;

        if (clearData) {
          this._originalSize.set(0, 0);

          this._rect.set(0, 0, 0, 0);

          this._offset.set(0, 0);

          this._capInsets = [0, 0, 0, 0];
          this._rotated = false;
          calUV = true;
        }

        if (info) {
          if (info.texture) {
            this.loaded = false;
            this._rect.x = this._rect.y = 0;
            this._rect.width = info.texture.width;
            this._rect.height = info.texture.height;

            this._refreshTexture(info.texture);

            this.checkRect(this._texture);
          }

          if (info.originalSize) {
            this._originalSize.set(info.originalSize);
          }

          if (info.rect) {
            this._rect.set(info.rect);
          }

          if (info.offset) {
            this._offset.set(info.offset);
          }

          if (info.borderTop !== undefined) {
            this._capInsets[INSET_TOP] = info.borderTop;
          }

          if (info.borderBottom !== undefined) {
            this._capInsets[INSET_BOTTOM] = info.borderBottom;
          }

          if (info.borderLeft !== undefined) {
            this._capInsets[INSET_LEFT] = info.borderLeft;
          }

          if (info.borderRight !== undefined) {
            this._capInsets[INSET_RIGHT] = info.borderRight;
          }

          if (info.isRotate !== undefined) {
            this._rotated = !!info.isRotate;
          }

          if (info.isFlipUv !== undefined) {
            this._flipUv = !!info.isFlipUv;
          }

          calUV = true;
        }

        if (calUV && this.texture) {
          this._calculateUV();
        }
      }
      /**
       * @zh
       * 判断精灵计算的矩形区域是否越界。
       *
       * @param texture
       */

    }, {
      key: "checkRect",
      value: function checkRect(texture) {
        var rect = this._rect;
        var maxX = rect.x;
        var maxY = rect.y;

        if (this._rotated) {
          maxX += rect.height;
          maxY += rect.width;
        } else {
          maxX += rect.width;
          maxY += rect.height;
        }

        if (maxX > texture.width) {
          (0, _debug.errorID)(3300, this.name + '/' + texture.name, maxX, texture.width);
          return false;
        }

        if (maxY > texture.height) {
          (0, _debug.errorID)(3301, this.name + '/' + texture.name, maxY, texture.height);
          return false;
        }

        return true;
      }
    }, {
      key: "onLoaded",
      value: function onLoaded() {
        this.loaded = true;
        this.emit('load');
      }
    }, {
      key: "destroy",
      value: function destroy() {
        return _get(_getPrototypeOf(SpriteFrame.prototype), "destroy", this).call(this);
      }
      /*
       * @zh
       * 计算裁切的 UV。
       */

    }, {
      key: "_calculateSlicedUV",
      value: function _calculateSlicedUV() {
        var rect = this._rect; // const texture = this._getCalculateTarget()!;

        var tex = this.texture;
        var atlasWidth = tex.width;
        var atlasHeight = tex.height;
        var leftWidth = this._capInsets[INSET_LEFT];
        var rightWidth = this._capInsets[INSET_RIGHT];
        var centerWidth = rect.width - leftWidth - rightWidth;
        var topHeight = this._capInsets[INSET_TOP];
        var bottomHeight = this._capInsets[INSET_BOTTOM];
        var centerHeight = rect.height - topHeight - bottomHeight;
        var uvSliced = this.uvSliced;
        uvSliced.length = 0;

        if (this._rotated) {
          // Canceling out the floating-point rounding errors by slightly nudging the UV coordinates
          temp_uvs[0].u = (rect.x + 0.5) / atlasWidth;
          temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
          temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
          temp_uvs[3].u = (rect.x + rect.height - 0.5) / atlasWidth;
          temp_uvs[3].v = (rect.y + 0.5) / atlasHeight;
          temp_uvs[2].v = (rect.y + leftWidth) / atlasHeight;
          temp_uvs[1].v = (rect.y + leftWidth + centerWidth) / atlasHeight;
          temp_uvs[0].v = (rect.y + rect.width - 0.5) / atlasHeight;

          for (var row = 0; row < 4; ++row) {
            var rowD = temp_uvs[row];

            for (var col = 0; col < 4; ++col) {
              var colD = temp_uvs[3 - col];
              uvSliced.push({
                u: rowD.u,
                v: colD.v
              });
            }
          }
        } else {
          // Canceling out the floating-point rounding errors by slightly nudging the UV coordinates
          temp_uvs[0].u = (rect.x + 0.5) / atlasWidth;
          temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
          temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
          temp_uvs[3].u = (rect.x + rect.width - 0.5) / atlasWidth;
          temp_uvs[3].v = (rect.y + 0.5) / atlasHeight;
          temp_uvs[2].v = (rect.y + topHeight) / atlasHeight;
          temp_uvs[1].v = (rect.y + topHeight + centerHeight) / atlasHeight;
          temp_uvs[0].v = (rect.y + rect.height - 0.5) / atlasHeight;

          for (var _row = 0; _row < 4; ++_row) {
            var _rowD = temp_uvs[_row];

            for (var _col = 0; _col < 4; ++_col) {
              var _colD = temp_uvs[_col];
              uvSliced.push({
                u: _colD.u,
                v: _rowD.v
              });
            }
          }
        }
      }
      /**
       * @zh
       * 计算 UV。
       */

    }, {
      key: "_calculateUV",
      value: function _calculateUV() {
        var rect = this._rect;
        var uv = this.uv;
        var tex = this.texture;
        var texw = tex.width;
        var texh = tex.height;

        if (this._rotated) {
          // Canceling out the floating-point rounding errors by slightly nudging the UV coordinates
          var l = texw === 0 ? 0 : (rect.x + 0.5) / texw;
          var r = texw === 0 ? 0 : (rect.x + rect.height - 0.5) / texw;
          var t = texh === 0 ? 0 : (rect.y + 0.5) / texh;
          var b = texh === 0 ? 0 : (rect.y + rect.width - 0.5) / texh;

          if (this._flipUv) {
            uv[0] = l;
            uv[1] = t;
            uv[2] = l;
            uv[3] = b;
            uv[4] = r;
            uv[5] = t;
            uv[6] = r;
            uv[7] = b;
          } else {
            uv[0] = l;
            uv[1] = t;
            uv[2] = l;
            uv[3] = b;
            uv[4] = r;
            uv[5] = t;
            uv[6] = r;
            uv[7] = b;
          }
        } else {
          // Canceling out the floating-point rounding errors by slightly nudging the UV coordinates
          var _l = texw === 0 ? 0 : (rect.x + 0.5) / texw;

          var _r = texw === 0 ? 0 : (rect.x + rect.width - 0.5) / texw;

          var _b = texh === 0 ? 0 : (rect.y + rect.height - 0.5) / texh;

          var _t = texh === 0 ? 0 : (rect.y + 0.5) / texh;

          if (this._flipUv) {
            uv[0] = _l;
            uv[1] = _t;
            uv[2] = _r;
            uv[3] = _t;
            uv[4] = _l;
            uv[5] = _b;
            uv[6] = _r;
            uv[7] = _b;
          } else {
            uv[0] = _l;
            uv[1] = _b;
            uv[2] = _r;
            uv[3] = _b;
            uv[4] = _l;
            uv[5] = _t;
            uv[6] = _r;
            uv[7] = _t;
          }
        }

        var uvHashStr = '';

        for (var i = 0; i < uv.length; i++) {
          uvHashStr += uv[i];
        }

        this.uvHash = (0, _murmurhash2_gc.murmurhash2_32_gc)(uvHashStr, 666);
        var vertices = this.vertices;

        if (vertices) {
          vertices.nu.length = 0;
          vertices.nv.length = 0;

          for (var _i = 0; _i < vertices.u.length; _i++) {
            vertices.nu[_i] = vertices.u[_i] / texw;
            vertices.nv[_i] = vertices.v[_i] / texh;
          }
        }

        this._calculateSlicedUV();
      } // SERIALIZATION

    }, {
      key: "_serialize",
      value: function _serialize(exporting) {
        var rect = this._rect;
        var offset = this._offset;
        var originalSize = this._originalSize;
        var uuid = this._uuid;
        var texture;

        if (this._texture) {
          texture = this._texture._uuid;
        }

        if (uuid && exporting) {
          uuid = EditorExtends.UuidUtils.compressUuid(uuid, true);
        }

        if (texture && exporting) {
          texture = EditorExtends.UuidUtils.compressUuid(texture, true);
        }

        var vertices;

        if (this.vertices) {
          vertices = {
            triangles: this.vertices.triangles,
            x: this.vertices.x,
            y: this.vertices.y,
            u: this.vertices.u,
            v: this.vertices.v
          };
        }

        var serialize = {
          name: this._name,
          atlas: exporting ? undefined : this._atlasUuid,
          // strip from json if exporting
          rect: rect,
          offset: offset,
          originalSize: originalSize,
          rotated: this._rotated,
          capInsets: this._capInsets,
          vertices: vertices,
          texture: texture
        }; // 为 underfined 的数据则不在序列化文件里显示

        return serialize;
      }
    }, {
      key: "_deserialize",
      value: function _deserialize(serializeData, handle) {
        var data = serializeData;
        var rect = data.rect;

        if (rect) {
          this._rect = new _index2.Rect(rect.x, rect.y, rect.width, rect.height);
        }

        var offset = data.offset;

        if (data.offset) {
          this._offset = new _index2.Vec2(offset.x, offset.y);
        }

        var originalSize = data.originalSize;

        if (data.originalSize) {
          this._originalSize = new _index2.Size(originalSize.width, originalSize.height);
        }

        this._rotated = !!data.rotated;
        this._name = data.name;
        var capInsets = data.capInsets;

        if (capInsets) {
          this._capInsets[INSET_LEFT] = capInsets[INSET_LEFT];
          this._capInsets[INSET_TOP] = capInsets[INSET_TOP];
          this._capInsets[INSET_RIGHT] = capInsets[INSET_RIGHT];
          this._capInsets[INSET_BOTTOM] = capInsets[INSET_BOTTOM];
        }

        if (data.texture) {
          handle.result.push(this, '_textureSource', data.texture);
        }

        if (_defaultConstants.EDITOR) {
          this._atlasUuid = data.atlas ? data.atlas : '';
        }

        this.vertices = data.vertices;

        if (this.vertices) {
          // initialize normal uv arrays
          this.vertices.nu = [];
          this.vertices.nv = [];
        }
      }
    }, {
      key: "_textureLoaded",
      value: function _textureLoaded() {
        var tex = this._texture;
        var config = {};
        var isReset = false;

        if (this._rect.width === 0 || this._rect.height === 0 || !this.checkRect(tex)) {
          config.rect = new _index2.Rect(0, 0, tex.width, tex.height);
          isReset = true;
        } // If original size is not set or rect check failed, we should reset the original size


        if (this._originalSize.width === 0 || this._originalSize.height === 0 || isReset) {
          config.originalSize = new _index2.Size(tex.width, tex.height);
          isReset = true;
        }

        if (isReset) {
          this.reset(config);
          this.onLoaded();
        }
      }
    }, {
      key: "_refreshTexture",
      value: function _refreshTexture(texture) {
        this._texture = texture;

        if (texture.loaded) {
          this._textureLoaded();
        } else {
          texture.once('load', this._textureLoaded, this);
        }
      }
    }]);

    return SpriteFrame;
  }(_asset.Asset), _temp)) || _class);
  _exports.SpriteFrame = SpriteFrame;
  _globalExports.legacyCC.SpriteFrame = SpriteFrame;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3Nwcml0ZS1mcmFtZS50cyJdLCJuYW1lcyI6WyJJTlNFVF9MRUZUIiwiSU5TRVRfVE9QIiwiSU5TRVRfUklHSFQiLCJJTlNFVF9CT1RUT00iLCJ0ZW1wX3V2cyIsInUiLCJ2IiwiU3ByaXRlRnJhbWUiLCJfY2FwSW5zZXRzIiwidmFsdWUiLCJfdGV4dHVyZSIsIl9jYWxjdWxhdGVTbGljZWRVViIsIl9yZWN0IiwiZXF1YWxzIiwic2V0IiwiX2NhbGN1bGF0ZVVWIiwiX29yaWdpbmFsU2l6ZSIsIl9vZmZzZXQiLCJfcm90YXRlZCIsInJvdGF0ZWQiLCJjb25zb2xlIiwid2FybiIsIm5hbWUiLCJyZXNldCIsInRleHR1cmUiLCJfYXRsYXNVdWlkIiwid2lkdGgiLCJoZWlnaHQiLCJfcmVmcmVzaFRleHR1cmUiLCJpbWFnZVNvdXJjZU9ySW1hZ2VBc3NldCIsImltZyIsIkltYWdlQXNzZXQiLCJ0ZXgiLCJUZXh0dXJlMkQiLCJpbWFnZSIsInNwZiIsInZlcnRpY2VzIiwidXYiLCJ1dkhhc2giLCJ1dlNsaWNlZCIsIlJlY3QiLCJWZWMyIiwiU2l6ZSIsIl9mbGlwVXYiLCJFRElUT1IiLCJsb2FkZWQiLCJvdXQiLCJjbG9uZSIsInJlY3QiLCJzaXplIiwib3JpZ2luYWxTaXplIiwib2Zmc2V0IiwiZ2V0R0ZYVGV4dHVyZSIsImdldEdGWFNhbXBsZXIiLCJpbmZvIiwiY2xlYXJEYXRhIiwiY2FsVVYiLCJ4IiwieSIsImNoZWNrUmVjdCIsImJvcmRlclRvcCIsInVuZGVmaW5lZCIsImJvcmRlckJvdHRvbSIsImJvcmRlckxlZnQiLCJib3JkZXJSaWdodCIsImlzUm90YXRlIiwiaXNGbGlwVXYiLCJtYXhYIiwibWF4WSIsImVtaXQiLCJhdGxhc1dpZHRoIiwiYXRsYXNIZWlnaHQiLCJsZWZ0V2lkdGgiLCJyaWdodFdpZHRoIiwiY2VudGVyV2lkdGgiLCJ0b3BIZWlnaHQiLCJib3R0b21IZWlnaHQiLCJjZW50ZXJIZWlnaHQiLCJsZW5ndGgiLCJyb3ciLCJyb3dEIiwiY29sIiwiY29sRCIsInB1c2giLCJ0ZXh3IiwidGV4aCIsImwiLCJyIiwidCIsImIiLCJ1dkhhc2hTdHIiLCJpIiwibnUiLCJudiIsImV4cG9ydGluZyIsInV1aWQiLCJfdXVpZCIsIkVkaXRvckV4dGVuZHMiLCJVdWlkVXRpbHMiLCJjb21wcmVzc1V1aWQiLCJ0cmlhbmdsZXMiLCJzZXJpYWxpemUiLCJfbmFtZSIsImF0bGFzIiwiY2FwSW5zZXRzIiwic2VyaWFsaXplRGF0YSIsImhhbmRsZSIsImRhdGEiLCJyZXN1bHQiLCJjb25maWciLCJpc1Jlc2V0Iiwib25Mb2FkZWQiLCJfdGV4dHVyZUxvYWRlZCIsIm9uY2UiLCJBc3NldCIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRDQSxNQUFNQSxVQUFVLEdBQUcsQ0FBbkI7QUFDQSxNQUFNQyxTQUFTLEdBQUcsQ0FBbEI7QUFDQSxNQUFNQyxXQUFXLEdBQUcsQ0FBcEI7QUFDQSxNQUFNQyxZQUFZLEdBQUcsQ0FBckI7QUFnRkEsTUFBTUMsUUFBZSxHQUFHLENBQUM7QUFBRUMsSUFBQUEsQ0FBQyxFQUFFLENBQUw7QUFBUUMsSUFBQUEsQ0FBQyxFQUFFO0FBQVgsR0FBRCxFQUFpQjtBQUFFRCxJQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRQyxJQUFBQSxDQUFDLEVBQUU7QUFBWCxHQUFqQixFQUFpQztBQUFFRCxJQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRQyxJQUFBQSxDQUFDLEVBQUU7QUFBWCxHQUFqQyxFQUFpRDtBQUFFRCxJQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRQyxJQUFBQSxDQUFDLEVBQUU7QUFBWCxHQUFqRCxDQUF4QjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BMERhQyxXLFdBRFosb0JBQVEsZ0JBQVIs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TUFBOUIsQ0FBZDtBQUNBbUYsVUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDSCxTQVB1QixDQVN4Qjs7O0FBQ0EsWUFBSSxLQUFLOUYsYUFBTCxDQUFtQlUsS0FBbkIsS0FBNkIsQ0FBN0IsSUFDQSxLQUFLVixhQUFMLENBQW1CVyxNQUFuQixLQUE4QixDQUQ5QixJQUVBbUYsT0FGSixFQUdFO0FBQ0VELFVBQUFBLE1BQU0sQ0FBQzNELFlBQVAsR0FBc0IsSUFBSVIsWUFBSixDQUFTVixHQUFHLENBQUNOLEtBQWIsRUFBb0JNLEdBQUcsQ0FBQ0wsTUFBeEIsQ0FBdEI7QUFDQW1GLFVBQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0g7O0FBRUQsWUFBSUEsT0FBSixFQUFhO0FBQ1QsZUFBS3ZGLEtBQUwsQ0FBV3NGLE1BQVg7QUFDQSxlQUFLRSxRQUFMO0FBQ0g7QUFDSjs7O3NDQUUwQnZGLE8sRUFBc0M7QUFDN0QsYUFBS2QsUUFBTCxHQUFnQmMsT0FBaEI7O0FBQ0EsWUFBSUEsT0FBTyxDQUFDcUIsTUFBWixFQUFvQjtBQUNoQixlQUFLbUUsY0FBTDtBQUNILFNBRkQsTUFFTztBQUNIeEYsVUFBQUEsT0FBTyxDQUFDeUYsSUFBUixDQUFhLE1BQWIsRUFBcUIsS0FBS0QsY0FBMUIsRUFBMEMsSUFBMUM7QUFDSDtBQUNKOzs7O0lBOXdCNEJFLFk7O0FBaXhCakNDLDBCQUFTNUcsV0FBVCxHQUF1QkEsV0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIOWGhee9rui1hOa6kFxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUmVjdCwgU2l6ZSwgVmVjMiB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBtdXJtdXJoYXNoMl8zMl9nYyB9IGZyb20gJy4uL3V0aWxzL211cm11cmhhc2gyX2djJztcclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuL2Fzc2V0JztcclxuaW1wb3J0IHsgUmVuZGVyVGV4dHVyZSB9IGZyb20gJy4vcmVuZGVyLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBUZXh0dXJlQmFzZSB9IGZyb20gJy4vdGV4dHVyZS1iYXNlJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IEltYWdlQXNzZXQsIEltYWdlU291cmNlIH0gZnJvbSAnLi9pbWFnZS1hc3NldCc7XHJcbmltcG9ydCB7IFRleHR1cmUyRCB9IGZyb20gJy4vdGV4dHVyZS0yZCc7XHJcbmltcG9ydCB7IGVycm9ySUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG5jb25zdCBJTlNFVF9MRUZUID0gMDtcclxuY29uc3QgSU5TRVRfVE9QID0gMTtcclxuY29uc3QgSU5TRVRfUklHSFQgPSAyO1xyXG5jb25zdCBJTlNFVF9CT1RUT00gPSAzO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVVYge1xyXG4gICAgdTogbnVtYmVyO1xyXG4gICAgdjogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVZlcnRpY2VzIHtcclxuICAgIHg6IGFueTtcclxuICAgIHk6IGFueTtcclxuICAgIHRyaWFuZ2xlczogYW55O1xyXG4gICAgbnU6IG51bWJlcltdO1xyXG4gICAgdTogbnVtYmVyW107XHJcbiAgICBudjogbnVtYmVyW107XHJcbiAgICB2OiBudW1iZXJbXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIElTcHJpdGVGcmFtZXNTZXJpYWxpemVEYXRhe1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgYmFzZTogc3RyaW5nO1xyXG4gICAgaW1hZ2U6IHN0cmluZztcclxuICAgIGF0bGFzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICByZWN0OiBSZWN0O1xyXG4gICAgb2Zmc2V0OiBWZWMyO1xyXG4gICAgb3JpZ2luYWxTaXplOiBTaXplO1xyXG4gICAgcm90YXRlZDogYm9vbGVhbjtcclxuICAgIGNhcEluc2V0czogbnVtYmVyW107XHJcbiAgICB2ZXJ0aWNlczogSVZlcnRpY2VzO1xyXG4gICAgdGV4dHVyZTogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVNwcml0ZUZyYW1lT3JpZ2luYWwge1xyXG4gICAgc3ByaXRlZnJhbWU6IFNwcml0ZUZyYW1lO1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVNwcml0ZUZyYW1lSW5pdEluZm8ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemggVGV4dHVyZSDlr7nosaHotYTmupDjgIJcclxuICAgICAqL1xyXG4gICAgdGV4dHVyZT86IFRleHR1cmVCYXNlIHwgUmVuZGVyVGV4dHVyZTtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeyvueBteW4p+WOn+Wni+WwuuWvuOOAglxyXG4gICAgICovXHJcbiAgICBvcmlnaW5hbFNpemU/OiBTaXplO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57K+54G15bin6KOB5YiH55+p5b2i44CCXHJcbiAgICAgKi9cclxuICAgIHJlY3Q/OiBSZWN0O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57K+54G15bin5YGP56e76YeP44CCXHJcbiAgICAgKi9cclxuICAgIG9mZnNldD86IFZlYzI7XHJcbiAgICAvKipcclxuICAgICAqIEB6aCDkuIrovrnnlYzjgIJcclxuICAgICAqL1xyXG4gICAgYm9yZGVyVG9wPzogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LiL6L6555WM44CCXHJcbiAgICAgKi9cclxuICAgIGJvcmRlckJvdHRvbT86IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW3pui+ueeVjFxyXG4gICAgICovXHJcbiAgICBib3JkZXJMZWZ0PzogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Y+z6L6555WMXHJcbiAgICAgKi9cclxuICAgIGJvcmRlclJpZ2h0PzogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5piv5ZCm5peL6L2s44CCXHJcbiAgICAgKi9cclxuICAgIGlzUm90YXRlPzogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaYr+WQpui9rOe9riBVVuOAglxyXG4gICAgICovXHJcbiAgICBpc0ZsaXBVdj86IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IHRlbXBfdXZzOiBJVVZbXSA9IFt7IHU6IDAsIHY6IDAgfSwgeyB1OiAwLCB2OiAwIH0sIHsgdTogMCwgdjogMCB9LCB7IHU6IDAsIHY6IDAgfV07XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEEgYFNwcml0ZUZyYW1lYCBoYXM6PGJyLz5cclxuICogIC0gdGV4dHVyZTogQSBgVGV4dHVyZTJEYCB0aGF0IHdpbGwgYmUgdXNlZCBieSByZW5kZXIgY29tcG9uZW50czxici8+XHJcbiAqICAtIHJlY3RhbmdsZTogQSByZWN0YW5nbGUgb2YgdGhlIHRleHR1cmVcclxuICpcclxuICogQHpoXHJcbiAqIOeyvueBteW4p+i1hOa6kOOAglxyXG4gKiDkuIDkuKogU3ByaXRlRnJhbWUg5YyF5ZCr77yaPGJyLz5cclxuICogIC0g57q555CG77ya5Lya6KKr5riy5p+T57uE5Lu25L2/55So55qEIFRleHR1cmUyRCDlr7nosaHjgII8YnIvPlxyXG4gKiAgLSDnn6nlvaLvvJrlnKjnurnnkIbkuK3nmoTnn6nlvaLljLrln5/jgIJcclxuICog5Y+v6YCa6L+HIGBTcHJpdGVGcmFtZWAg6I635Y+W6K+l57uE5Lu244CCXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IGxvYWRlciB9IGZyb20gJ2NjJztcclxuICogLy8gRmlyc3Qgd2F5IHRvIHVzZSBhIFNwcml0ZUZyYW1lXHJcbiAqIGNvbnN0IHVybCA9IFwiYXNzZXRzL1B1cnBsZU1vbnN0ZXIvaWNvbi9zcHJpdGVGcmFtZVwiO1xyXG4gKiBsb2FkZXIubG9hZFJlcyh1cmwsIChlcnIsIHNwcml0ZUZyYW1lKSA9PiB7XHJcbiAqICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKFwiTmV3IFNwcml0ZVwiKTtcclxuICogICBjb25zdCBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChTcHJpdGUpO1xyXG4gKiAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IHNwcml0ZUZyYW1lO1xyXG4gKiAgIG5vZGUucGFyZW50ID0gc2VsZi5ub2RlO1xyXG4gKiB9KTtcclxuICpcclxuICogLy8gU2Vjb25kIHdheSB0byB1c2UgYSBTcHJpdGVGcmFtZVxyXG4gKiBjb25zdCBzZWxmID0gdGhpcztcclxuICogY29uc3QgdXJsID0gXCJ0ZXN0X2Fzc2V0cy9QdXJwbGVNb25zdGVyXCI7XHJcbiAqIGxvYWRlci5sb2FkUmVzKHVybCwgKGVyciwgaW1hZ2VBc3NldCkgPT4ge1xyXG4gKiAgaWYoZXJyKXtcclxuICogICAgcmV0dXJuO1xyXG4gKiAgfVxyXG4gKlxyXG4gKiAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKFwiTmV3IFNwcml0ZVwiKTtcclxuICogIGNvbnN0IHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KFNwcml0ZSk7XHJcbiAqICBjb25zdCBzcHJpdGVGcmFtZSA9IG5ldyBTcHJpdGVGcmFtZSgpO1xyXG4gKiAgY29uc3QgdGV4ID0gaW1hZ2VBc3NldC5fdGV4dHVyZTtcclxuICogIHNwcml0ZUZyYW1lLnRleHR1cmUgPSB0ZXg7XHJcbiAqICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTtcclxuICogIG5vZGUucGFyZW50ID0gc2VsZi5ub2RlO1xyXG4gKiB9KTtcclxuICpcclxuICogLy8gVGhpcmQgd2F5IHRvIHVzZSBhIFNwcml0ZUZyYW1lXHJcbiAqIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gKiBjb25zdCBjYW1lcmFDb21wID0gdGhpcy5nZXRDb21wb25lbnQoQ2FtZXJhKTtcclxuICogY29uc3QgcmVuZGVyVGV4dHVyZSA9IG5ldyBSZW5kZXJUZXh0dXJlKCk7XHJcbiAqIHJlbmRldFRleC5yZXNldCh7XHJcbiAqICAgd2lkdGg6IDUxMixcclxuICogICBoZWlnaHQ6IDUxMixcclxuICogICBkZXB0aFN0ZW5jaWxGb3JtYXQ6IFJlbmRlclRleHR1cmUuRGVwdGhTdGVuY2lsRm9ybWF0LkRFUFRIXzI0X1NURU5DSUxfOFxyXG4gKiB9KTtcclxuICpcclxuICogY2FtZXJhQ29tcC50YXJnZXRUZXh0dXJlID0gcmVuZGVyVGV4dHVyZTtcclxuICogY29uc3Qgc3ByaXRlRnJhbWUgPSBuZXcgU3ByaXRlRnJhbWUoKTtcclxuICogc3ByaXRlRnJhbWUudGV4dHVyZSA9IHJlbmRlclRleHR1cmU7XHJcbiAqIGBgYFxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlNwcml0ZUZyYW1lJylcclxuZXhwb3J0IGNsYXNzIFNwcml0ZUZyYW1lIGV4dGVuZHMgQXNzZXQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDcmVhdGUgYSBTcHJpdGVGcmFtZSBvYmplY3QgYnkgYW4gaW1hZ2UgYXNzZXQgb3IgYW4gbmF0aXZlIGltYWdlIGFzc2V0XHJcbiAgICAgKiBAemhcclxuICAgICAqIOmAmui/hyBJbWFnZSDotYTmupDmiJbogIXljp/lp4sgaW1hZ2Ug6LWE5rqQ5Yib5bu65LiA5LiqIFNwcml0ZUZyYW1lIOWvueixoVxyXG4gICAgICogQHBhcmFtIGltYWdlU291cmNlT3JJbWFnZUFzc2V0IEltYWdlQXNzZXQgb3IgSW1hZ2VTb3VyY2UsIEltYWdlU291cmNlIHN1cHBvcnQgSFRNTENhbnZhc0VsZW1lbnQgSFRNTEltYWdlRWxlbWVudCBJTWVtb3J5SW1hZ2VTb3VyY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVXaXRoSW1hZ2UgKGltYWdlU291cmNlT3JJbWFnZUFzc2V0OiBJbWFnZVNvdXJjZSB8IEltYWdlQXNzZXQpIHtcclxuICAgICAgICBjb25zdCBpbWcgPSBpbWFnZVNvdXJjZU9ySW1hZ2VBc3NldCBpbnN0YW5jZW9mIEltYWdlQXNzZXQgPyBpbWFnZVNvdXJjZU9ySW1hZ2VBc3NldCA6IG5ldyBJbWFnZUFzc2V0KGltYWdlU291cmNlT3JJbWFnZUFzc2V0KTtcclxuICAgICAgICBjb25zdCB0ZXggPSBuZXcgVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgdGV4LmltYWdlID0gaW1nO1xyXG4gICAgICAgIGNvbnN0IHNwZiA9IG5ldyBTcHJpdGVGcmFtZSgpO1xyXG4gICAgICAgIHNwZi50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgIHJldHVybiBzcGY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRvcCBib3JkZXIgb2YgdGhlIHNwcml0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIHNwcml0ZSDnmoTpobbpg6jovrnmoYbjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGluc2V0VG9wICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1RPUF07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGluc2V0VG9wICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXSA9PT0gdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBCb3R0b20gYm9yZGVyIG9mIHRoZSBzcHJpdGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiBzcHJpdGUg55qE5bqV6YOo6L655qGG44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBpbnNldEJvdHRvbSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9CT1RUT01dO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpbnNldEJvdHRvbSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV0gPT09IHZhbHVlKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV0gPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTGVmdCBib3JkZXIgb2YgdGhlIHNwcml0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIHNwcml0ZSDnmoTlt6bovrnovrnmoYbjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGluc2V0TGVmdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW5zZXRMZWZ0ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYXBJbnNldHNbSU5TRVRfTEVGVF0gPT09IHZhbHVlKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2xpY2VkVVYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJpZ2h0IGJvcmRlciBvZiB0aGUgc3ByaXRlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICogc3ByaXRlIOeahOWPs+i+uei+ueahhuOAglxyXG4gICAgICovXHJcbiAgICBnZXQgaW5zZXRSaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9SSUdIVF07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGluc2V0UmlnaHQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhcEluc2V0c1tJTlNFVF9SSUdIVF0gPT09IHZhbHVlKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHRoZSByZWN0IG9mIHRoZSBzcHJpdGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXHJcbiAgICAgKiBJZiBpdCdzIGEgYXRsYXMgdGV4dHVyZSwgYSB0cmFuc3BhcmVudCBwaXhlbCBhcmVhIGlzIHByb3Bvc2VkIGZvciB0aGUgYWN0dWFsIG1hcHBpbmcgb2YgdGhlIGN1cnJlbnQgdGV4dHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPliBTcHJpdGVGcmFtZSDnmoTnurnnkIbnn6nlvaLljLrln5/jgIJcclxuICAgICAqIOWmguaenOaYr+S4gOS4qiBhdGxhcyDnmoTotLTlm77vvIzliJnkuLrlvZPliY3otLTlm77nmoTlrp7pmYXliZTpmaTpgI/mmI7lg4/ntKDljLrln5/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHJlY3QgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByZWN0ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZWN0LmVxdWFscyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcmVjdC5zZXQodmFsdWUpO1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzaXplIG9mIHRoZSB0cmltbWVkIGltYWdlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5L+u5Ymq5YmN55qE5Y6f5aeL5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBvcmlnaW5hbFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG9yaWdpbmFsU2l6ZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxTaXplLmVxdWFscyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlVVYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blgY/np7vph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG9mZnNldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb2Zmc2V0ICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX29mZnNldC5zZXQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyByb3RhdGVkIGluIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+WIFNwcml0ZUZyYW1lIOaYr+WQpuaXi+i9rOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgcm90YXRlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJvdGF0ZWQgKHJvdGF0ZWQpIHtcclxuICAgICAgICBpZiAodGhpcy5fcm90YXRlZCA9PT0gcm90YXRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yb3RhdGVkID0gcm90YXRlZDtcclxuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dHVyZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRleHR1cmUgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEVycm9yIFRleHR1cmUgaW4gJHt0aGlzLm5hbWV9YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVzZXQoeyB0ZXh0dXJlOiB2YWx1ZSB9LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYXRsYXNVdWlkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXRsYXNVdWlkO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBhdGxhc1V1aWQgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9hdGxhc1V1aWQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgd2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgX3RleHR1cmVTb3VyY2UgKHZhbHVlOiBUZXh0dXJlQmFzZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB2ZXJ0aWNlczogSVZlcnRpY2VzIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS4jeW4puijgeWIh+eahCBVVuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXY6IG51bWJlcltdID0gW107XHJcbiAgICBwdWJsaWMgdXZIYXNoOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDluKbmnInoo4HliIfnmoQgVVbjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHV2U2xpY2VkOiBJVVZbXSA9IFtdO1xyXG5cclxuICAgIC8vIHRoZSBsb2NhdGlvbiBvZiB0aGUgc3ByaXRlIG9uIHJlbmRlcmluZyB0ZXh0dXJlXHJcbiAgICBwcm90ZWN0ZWQgX3JlY3QgPSBuZXcgUmVjdCgpO1xyXG5cclxuICAgIC8vIGZvciB0cmltbWluZ1xyXG4gICAgcHJvdGVjdGVkIF9vZmZzZXQgPSBuZXcgVmVjMigpO1xyXG5cclxuICAgIC8vIGZvciB0cmltbWluZ1xyXG4gICAgcHJvdGVjdGVkIF9vcmlnaW5hbFNpemUgPSBuZXcgU2l6ZSgpO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcm90YXRlZCA9IGZhbHNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfY2FwSW5zZXRzID0gWzAsIDAsIDAsIDBdO1xyXG5cclxuICAgIHByb3RlY3RlZCBfYXRsYXNVdWlkOiBzdHJpbmcgPSAnJztcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByb3RlY3RlZCBfdGV4dHVyZTogVGV4dHVyZUJhc2UgfCBSZW5kZXJUZXh0dXJlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZmxpcFV2ID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgLy8gQXRsYXMgYXNzZXQgdXVpZFxyXG4gICAgICAgICAgICB0aGlzLl9hdGxhc1V1aWQgPSAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgdGV4dHVyZSBoYXZlIGJlZW4gbG9hZGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L+U5Zue5piv5ZCm5bey5Yqg6L2957K+54G15bin44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0ZXh0dXJlTG9hZGVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0dXJlICYmIHRoaXMudGV4dHVyZS5sb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgc3ByaXRlIGZyYW1lIGlzIHJvdGF0ZWQgaW4gdGhlIHRleHR1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5YgU3ByaXRlRnJhbWUg5piv5ZCm5peL6L2s44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCDljbPlsIblnKggMS4yIOW6n+mZpO+8jOivt+S9v+eUqCBgaXNSb3RhdGVkID0gcmVjdC5yb3RhdGVkYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNSb3RhdGVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyByb3RhdGVkIGluIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572uIFNwcml0ZUZyYW1lIOaYr+WQpuaXi+i9rOOAglxyXG4gICAgICogQHBhcmFtIHZhbHVlXHJcbiAgICAgKiBAZGVwcmVjYXRlZCDljbPlsIblnKggMS4yIOW6n+mZpO+8jOivt+S9v+eUqCBgcmVjdC5yb3RhdGVkID0gdHJ1ZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFJvdGF0ZWQgKHJvdGF0ZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgIHRoaXMucm90YXRlZCA9IHJvdGF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgdGhlIHJlY3Qgb2YgdGhlIHNwcml0ZSBmcmFtZSBpbiB0aGUgdGV4dHVyZS5cclxuICAgICAqIElmIGl0J3MgYSBhdGxhcyB0ZXh0dXJlLCBhIHRyYW5zcGFyZW50IHBpeGVsIGFyZWEgaXMgcHJvcG9zZWQgZm9yIHRoZSBhY3R1YWwgbWFwcGluZyBvZiB0aGUgY3VycmVudCB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+WIFNwcml0ZUZyYW1lIOeahOe6ueeQhuefqeW9ouWMuuWfn+OAglxyXG4gICAgICog5aaC5p6c5piv5LiA5LiqIGF0bGFzIOeahOi0tOWbvu+8jOWImeS4uuW9k+WJjei0tOWbvueahOWunumZheWJlOmZpOmAj+aYjuWDj+e0oOWMuuWfn+OAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg5Y2z5bCG5ZyoIDEuMiDlup/pmaTvvIzor7fkvb/nlKggYHJlY3Quc2V0KHNwcml0RnJhbWUucmVjdClg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSZWN0IChvdXQ/OiBSZWN0KSB7XHJcbiAgICAgICAgaWYgKG91dCkge1xyXG4gICAgICAgICAgICBvdXQuc2V0KHRoaXMuX3JlY3QpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY3QuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB0aGUgcmVjdCBvZiB0aGUgc3ByaXRlIGZyYW1lIGluIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572uIFNwcml0ZUZyYW1lIOeahOe6ueeQhuefqeW9ouWMuuWfn+OAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg5Y2z5bCG5ZyoIDEuMiDlup/pmaTvvIzor7fkvb/nlKggYHNwcml0RnJhbWUucmVjdCA9IHJlY3Rg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRSZWN0IChyZWN0OiBSZWN0KSB7XHJcbiAgICAgICB0aGlzLnJlY3QgPSByZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzaXplIG9mIHRoZSB0cmltbWVkIGltYWdlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5L+u5Ymq5YmN55qE5Y6f5aeL5aSn5bCP44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCDljbPlsIblnKggMS4yIOW6n+mZpO+8jOivt+S9v+eUqCBgc2l6ZS5zZXQoc3ByaXRGcmFtZS5vcmlnaW5hbFNpemUpYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0T3JpZ2luYWxTaXplIChvdXQ/OiBTaXplKSB7XHJcbiAgICAgICAgaWYgKG91dCkge1xyXG4gICAgICAgICAgICBvdXQuc2V0KHRoaXMuX29yaWdpbmFsU2l6ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxTaXplLmNsb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldHMgdGhlIG9yaWdpbmFsIHNpemUgb2YgdGhlIHRyaW1tZWQgaW1hZ2UuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7kv67liarliY3nmoTljp/lp4vlpKflsI/jgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSAtIOiuvue9rueyvueBteWOn+Wni+Wkp+Wwj+OAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg5Y2z5bCG5ZyoIDEuMiDlup/pmaTvvIzor7fkvb/nlKggYHNwcml0RnJhbWUub3JpZ2luYWxTaXplID0gc2l6ZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE9yaWdpbmFsU2l6ZSAoc2l6ZTogU2l6ZSkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxTaXplID0gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgb2Zmc2V0IG9mIHRoZSBmcmFtZSBpbiB0aGUgdGV4dHVyZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWBj+enu+mHj+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvdXQgLSDlj6/lpI3nlKjnmoTlgY/np7vph4/jgIJcclxuICAgICAqIEBkZXByZWNhdGVkIOWNs+WwhuWcqCAxLjIg5bqf6Zmk77yM6K+35L2/55SoIGBvZmZzZXQuc2V0KHNwcml0RnJhbWUub2Zmc2V0KWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE9mZnNldCAob3V0PzogVmVjMikge1xyXG4gICAgICAgIGlmIChvdXQpIHtcclxuICAgICAgICAgICAgb3V0LnNldCh0aGlzLl9vZmZzZXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldC5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBvZmZzZXQgb2YgdGhlIGZyYW1lIGluIHRoZSB0ZXh0dXJlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u5YGP56e76YeP44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG9mZnNldHMgLSDlgY/np7vph4/jgIJcclxuICAgICAqIEBkZXByZWNhdGVkIOWNs+WwhuWcqCAxLjIg5bqf6Zmk77yM6K+35L2/55SoIGBzcHJpdEZyYW1lLm9mZnNldCA9IG9mZnNldGDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE9mZnNldCAob2Zmc2V0OiBWZWMyKSB7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEdGWFRleHR1cmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlLmdldEdGWFRleHR1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0R0ZYU2FtcGxlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmUuZ2V0R0ZYU2FtcGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN572uIFNwcml0ZUZyYW1lIOaVsOaNruOAglxyXG4gICAgICogQHBhcmFtIGluZm8gU3ByaXRlRnJhbWUg5Yid5aeL5YyW5pWw5o2u44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldCAoaW5mbz86IElTcHJpdGVGcmFtZUluaXRJbmZvLCBjbGVhckRhdGEgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBjYWxVViA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChjbGVhckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplLnNldCgwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVjdC5zZXQoMCwgMCwgMCAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQuc2V0KDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHMgPSBbMCAsIDAsIDAsIDBdO1xyXG4gICAgICAgICAgICB0aGlzLl9yb3RhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhbFVWID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmZvKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmZvLnRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN0LnggPSB0aGlzLl9yZWN0LnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjdC53aWR0aCA9IGluZm8udGV4dHVyZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3QuaGVpZ2h0ID0gaW5mby50ZXh0dXJlLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUZXh0dXJlKGluZm8udGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrUmVjdCh0aGlzLl90ZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZm8ub3JpZ2luYWxTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUuc2V0KGluZm8ub3JpZ2luYWxTaXplKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZm8ucmVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjdC5zZXQoaW5mby5yZWN0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZm8ub2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXQuc2V0KGluZm8ub2Zmc2V0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZm8uYm9yZGVyVG9wICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9UT1BdID0gaW5mby5ib3JkZXJUb3A7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbmZvLmJvcmRlckJvdHRvbSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfQk9UVE9NXSA9IGluZm8uYm9yZGVyQm90dG9tO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5mby5ib3JkZXJMZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXSA9IGluZm8uYm9yZGVyTGVmdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZm8uYm9yZGVyUmlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXSA9IGluZm8uYm9yZGVyUmlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbmZvLmlzUm90YXRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JvdGF0ZWQgPSAhIWluZm8uaXNSb3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbmZvLmlzRmxpcFV2ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBVdiA9ICEhaW5mby5pc0ZsaXBVdjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FsVVYgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhbFVWICYmIHRoaXMudGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yik5pat57K+54G16K6h566X55qE55+p5b2i5Yy65Z+f5piv5ZCm6LaK55WM44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRleHR1cmVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNoZWNrUmVjdCAodGV4dHVyZTogVGV4dHVyZUJhc2UgfCBSZW5kZXJUZXh0dXJlKSB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuX3JlY3Q7XHJcbiAgICAgICAgbGV0IG1heFggPSByZWN0Lng7XHJcbiAgICAgICAgbGV0IG1heFkgPSByZWN0Lnk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0ZWQpIHtcclxuICAgICAgICAgICAgbWF4WCArPSByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgbWF4WSArPSByZWN0LndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1heFggKz0gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgbWF4WSArPSByZWN0LmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXhYID4gdGV4dHVyZS53aWR0aCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDMzMDAsIHRoaXMubmFtZSArICcvJyArIHRleHR1cmUubmFtZSwgbWF4WCwgdGV4dHVyZS53aWR0aCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXhZID4gdGV4dHVyZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgzMzAxLCB0aGlzLm5hbWUgKyAnLycgKyB0ZXh0dXJlLm5hbWUsIG1heFksIHRleHR1cmUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZGVkICgpIHtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6h566X6KOB5YiH55qEIFVW44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfY2FsY3VsYXRlU2xpY2VkVVYgKCkge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLl9yZWN0O1xyXG4gICAgICAgIC8vIGNvbnN0IHRleHR1cmUgPSB0aGlzLl9nZXRDYWxjdWxhdGVUYXJnZXQoKSE7XHJcbiAgICAgICAgY29uc3QgdGV4ID0gdGhpcy50ZXh0dXJlO1xyXG4gICAgICAgIGNvbnN0IGF0bGFzV2lkdGggPSB0ZXgud2lkdGg7XHJcbiAgICAgICAgY29uc3QgYXRsYXNIZWlnaHQgPSB0ZXguaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGxlZnRXaWR0aCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9MRUZUXTtcclxuICAgICAgICBjb25zdCByaWdodFdpZHRoID0gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXTtcclxuICAgICAgICBjb25zdCBjZW50ZXJXaWR0aCA9IHJlY3Qud2lkdGggLSBsZWZ0V2lkdGggLSByaWdodFdpZHRoO1xyXG4gICAgICAgIGNvbnN0IHRvcEhlaWdodCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9UT1BdO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbUhlaWdodCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9CT1RUT01dO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlckhlaWdodCA9IHJlY3QuaGVpZ2h0IC0gdG9wSGVpZ2h0IC0gYm90dG9tSGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCB1dlNsaWNlZCA9IHRoaXMudXZTbGljZWQ7XHJcbiAgICAgICAgdXZTbGljZWQubGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAodGhpcy5fcm90YXRlZCkge1xyXG4gICAgICAgICAgICAvLyBDYW5jZWxpbmcgb3V0IHRoZSBmbG9hdGluZy1wb2ludCByb3VuZGluZyBlcnJvcnMgYnkgc2xpZ2h0bHkgbnVkZ2luZyB0aGUgVVYgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgdGVtcF91dnNbMF0udSA9IChyZWN0LnggKyAwLjUpIC8gYXRsYXNXaWR0aDtcclxuICAgICAgICAgICAgdGVtcF91dnNbMV0udSA9IChyZWN0LnggKyBib3R0b21IZWlnaHQpIC8gYXRsYXNXaWR0aDtcclxuICAgICAgICAgICAgdGVtcF91dnNbMl0udSA9IChyZWN0LnggKyBib3R0b21IZWlnaHQgKyBjZW50ZXJIZWlnaHQpIC8gYXRsYXNXaWR0aDtcclxuICAgICAgICAgICAgdGVtcF91dnNbM10udSA9IChyZWN0LnggKyByZWN0LmhlaWdodCAtIDAuNSkgLyBhdGxhc1dpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wX3V2c1szXS52ID0gKHJlY3QueSArIDAuNSkgLyBhdGxhc0hlaWdodDtcclxuICAgICAgICAgICAgdGVtcF91dnNbMl0udiA9IChyZWN0LnkgKyBsZWZ0V2lkdGgpIC8gYXRsYXNIZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBfdXZzWzFdLnYgPSAocmVjdC55ICsgbGVmdFdpZHRoICsgY2VudGVyV2lkdGgpIC8gYXRsYXNIZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBfdXZzWzBdLnYgPSAocmVjdC55ICsgcmVjdC53aWR0aCAtIDAuNSkgLyBhdGxhc0hlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDQ7ICsrcm93KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3dEID0gdGVtcF91dnNbcm93XTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDQ7ICsrY29sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sRCA9IHRlbXBfdXZzWzMgLSBjb2xdO1xyXG4gICAgICAgICAgICAgICAgICAgIHV2U2xpY2VkLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1OiByb3dELnUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHY6IGNvbEQudixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIENhbmNlbGluZyBvdXQgdGhlIGZsb2F0aW5nLXBvaW50IHJvdW5kaW5nIGVycm9ycyBieSBzbGlnaHRseSBudWRnaW5nIHRoZSBVViBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICB0ZW1wX3V2c1swXS51ID0gKHJlY3QueCArIDAuNSkgLyBhdGxhc1dpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wX3V2c1sxXS51ID0gKHJlY3QueCArIGxlZnRXaWR0aCkgLyBhdGxhc1dpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wX3V2c1syXS51ID0gKHJlY3QueCArIGxlZnRXaWR0aCArIGNlbnRlcldpZHRoKSAvIGF0bGFzV2lkdGg7XHJcbiAgICAgICAgICAgIHRlbXBfdXZzWzNdLnUgPSAocmVjdC54ICsgcmVjdC53aWR0aCAtIDAuNSkgLyBhdGxhc1dpZHRoO1xyXG4gICAgICAgICAgICB0ZW1wX3V2c1szXS52ID0gKHJlY3QueSArIDAuNSkgLyBhdGxhc0hlaWdodDtcclxuICAgICAgICAgICAgdGVtcF91dnNbMl0udiA9IChyZWN0LnkgKyB0b3BIZWlnaHQpIC8gYXRsYXNIZWlnaHQ7XHJcbiAgICAgICAgICAgIHRlbXBfdXZzWzFdLnYgPSAocmVjdC55ICsgdG9wSGVpZ2h0ICsgY2VudGVySGVpZ2h0KSAvIGF0bGFzSGVpZ2h0O1xyXG4gICAgICAgICAgICB0ZW1wX3V2c1swXS52ID0gKHJlY3QueSArIHJlY3QuaGVpZ2h0IC0gMC41KSAvIGF0bGFzSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgNDsgKytyb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0QgPSB0ZW1wX3V2c1tyb3ddO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNDsgKytjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2xEID0gdGVtcF91dnNbY29sXTtcclxuICAgICAgICAgICAgICAgICAgICB1dlNsaWNlZC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdTogY29sRC51LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2OiByb3dELnYsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuoeeulyBVVuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2NhbGN1bGF0ZVVWICgpIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5fcmVjdDtcclxuICAgICAgICBjb25zdCB1diA9IHRoaXMudXY7XHJcbiAgICAgICAgY29uc3QgdGV4ID0gdGhpcy50ZXh0dXJlO1xyXG4gICAgICAgIGNvbnN0IHRleHcgPSB0ZXgud2lkdGg7XHJcbiAgICAgICAgY29uc3QgdGV4aCA9IHRleC5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9yb3RhdGVkKSB7XHJcbiAgICAgICAgICAgIC8vIENhbmNlbGluZyBvdXQgdGhlIGZsb2F0aW5nLXBvaW50IHJvdW5kaW5nIGVycm9ycyBieSBzbGlnaHRseSBudWRnaW5nIHRoZSBVViBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICBjb25zdCBsID0gdGV4dyA9PT0gMCA/IDAgOiAocmVjdC54ICsgMC41KSAvIHRleHc7XHJcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0ZXh3ID09PSAwID8gMCA6IChyZWN0LnggKyByZWN0LmhlaWdodCAtIDAuNSkgLyB0ZXh3O1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGV4aCA9PT0gMCA/IDAgOiAocmVjdC55ICsgMC41KSAvIHRleGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSB0ZXhoID09PSAwID8gMCA6IChyZWN0LnkgKyByZWN0LndpZHRoIC0gMC41KSAvIHRleGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbGlwVXYpIHtcclxuICAgICAgICAgICAgICAgIHV2WzBdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzFdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzJdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzNdID0gYjtcclxuICAgICAgICAgICAgICAgIHV2WzRdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzVdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzZdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzddID0gYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV2WzBdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzFdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzJdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzNdID0gYjtcclxuICAgICAgICAgICAgICAgIHV2WzRdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzVdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzZdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzddID0gYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIENhbmNlbGluZyBvdXQgdGhlIGZsb2F0aW5nLXBvaW50IHJvdW5kaW5nIGVycm9ycyBieSBzbGlnaHRseSBudWRnaW5nIHRoZSBVViBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICBjb25zdCBsID0gdGV4dyA9PT0gMCA/IDAgOiAocmVjdC54ICsgMC41KSAvIHRleHc7XHJcbiAgICAgICAgICAgIGNvbnN0IHIgPSB0ZXh3ID09PSAwID8gMCA6IChyZWN0LnggKyByZWN0LndpZHRoIC0gMC41KSAvIHRleHc7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSB0ZXhoID09PSAwID8gMCA6IChyZWN0LnkgKyByZWN0LmhlaWdodCAtIDAuNSkgLyB0ZXhoO1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGV4aCA9PT0gMCA/IDAgOiAocmVjdC55ICsgMC41KSAvIHRleGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbGlwVXYpIHtcclxuICAgICAgICAgICAgICAgIHV2WzBdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzFdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzJdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzNdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzRdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzVdID0gYjtcclxuICAgICAgICAgICAgICAgIHV2WzZdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzddID0gYjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV2WzBdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzFdID0gYjtcclxuICAgICAgICAgICAgICAgIHV2WzJdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzNdID0gYjtcclxuICAgICAgICAgICAgICAgIHV2WzRdID0gbDtcclxuICAgICAgICAgICAgICAgIHV2WzVdID0gdDtcclxuICAgICAgICAgICAgICAgIHV2WzZdID0gcjtcclxuICAgICAgICAgICAgICAgIHV2WzddID0gdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHV2SGFzaFN0ciA9ICcnO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXYubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdXZIYXNoU3RyICs9IHV2W2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnV2SGFzaCA9IG11cm11cmhhc2gyXzMyX2djKHV2SGFzaFN0ciwgNjY2KTtcclxuXHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xyXG4gICAgICAgIGlmICh2ZXJ0aWNlcykge1xyXG4gICAgICAgICAgICB2ZXJ0aWNlcy5udS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlcy5udi5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLnUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLm51W2ldID0gdmVydGljZXMudVtpXSAvIHRleHc7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcy5udltpXSA9IHZlcnRpY2VzLnZbaV0gLyB0ZXhoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jYWxjdWxhdGVTbGljZWRVVigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNFUklBTElaQVRJT05cclxuICAgIHB1YmxpYyBfc2VyaWFsaXplIChleHBvcnRpbmc/OiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLl9yZWN0O1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuX29mZnNldDtcclxuICAgICAgICBjb25zdCBvcmlnaW5hbFNpemUgPSB0aGlzLl9vcmlnaW5hbFNpemU7XHJcbiAgICAgICAgbGV0IHV1aWQgPSB0aGlzLl91dWlkO1xyXG4gICAgICAgIGxldCB0ZXh0dXJlO1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlLl91dWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHV1aWQgJiYgZXhwb3J0aW5nKSB7XHJcbiAgICAgICAgICAgIHV1aWQgPSBFZGl0b3JFeHRlbmRzLlV1aWRVdGlscy5jb21wcmVzc1V1aWQodXVpZCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZXh0dXJlICYmIGV4cG9ydGluZykge1xyXG4gICAgICAgICAgICB0ZXh0dXJlID0gRWRpdG9yRXh0ZW5kcy5VdWlkVXRpbHMuY29tcHJlc3NVdWlkKHRleHR1cmUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHZlcnRpY2VzO1xyXG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzKSB7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzID0ge1xyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzOiB0aGlzLnZlcnRpY2VzLnRyaWFuZ2xlcyxcclxuICAgICAgICAgICAgICAgIHg6IHRoaXMudmVydGljZXMueCxcclxuICAgICAgICAgICAgICAgIHk6IHRoaXMudmVydGljZXMueSxcclxuICAgICAgICAgICAgICAgIHU6IHRoaXMudmVydGljZXMudSxcclxuICAgICAgICAgICAgICAgIHY6IHRoaXMudmVydGljZXMudixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5fbmFtZSxcclxuICAgICAgICAgICAgYXRsYXM6IGV4cG9ydGluZyA/IHVuZGVmaW5lZCA6IHRoaXMuX2F0bGFzVXVpZCwgIC8vIHN0cmlwIGZyb20ganNvbiBpZiBleHBvcnRpbmdcclxuICAgICAgICAgICAgcmVjdCxcclxuICAgICAgICAgICAgb2Zmc2V0LFxyXG4gICAgICAgICAgICBvcmlnaW5hbFNpemUsXHJcbiAgICAgICAgICAgIHJvdGF0ZWQ6IHRoaXMuX3JvdGF0ZWQsXHJcbiAgICAgICAgICAgIGNhcEluc2V0czogdGhpcy5fY2FwSW5zZXRzLFxyXG4gICAgICAgICAgICB2ZXJ0aWNlcyxcclxuICAgICAgICAgICAgdGV4dHVyZSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDkuLogdW5kZXJmaW5lZCDnmoTmlbDmja7liJnkuI3lnKjluo/liJfljJbmlofku7bph4zmmL7npLpcclxuICAgICAgICByZXR1cm4gc2VyaWFsaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfZGVzZXJpYWxpemUgKHNlcmlhbGl6ZURhdGE6IGFueSwgaGFuZGxlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gc2VyaWFsaXplRGF0YSBhcyBJU3ByaXRlRnJhbWVzU2VyaWFsaXplRGF0YTtcclxuICAgICAgICBjb25zdCByZWN0ID0gZGF0YS5yZWN0O1xyXG4gICAgICAgIGlmIChyZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3QgPSBuZXcgUmVjdChyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZGF0YS5vZmZzZXQ7XHJcbiAgICAgICAgaWYgKGRhdGEub2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IG5ldyBWZWMyKG9mZnNldC54LCBvZmZzZXQueSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvcmlnaW5hbFNpemUgPSBkYXRhLm9yaWdpbmFsU2l6ZTtcclxuICAgICAgICBpZiAoZGF0YS5vcmlnaW5hbFNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplID0gbmV3IFNpemUob3JpZ2luYWxTaXplLndpZHRoLCBvcmlnaW5hbFNpemUuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcm90YXRlZCA9ICEhZGF0YS5yb3RhdGVkO1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBkYXRhLm5hbWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhcEluc2V0cyA9IGRhdGEuY2FwSW5zZXRzO1xyXG4gICAgICAgIGlmIChjYXBJbnNldHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdID0gY2FwSW5zZXRzW0lOU0VUX0xFRlRdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXSA9IGNhcEluc2V0c1tJTlNFVF9UT1BdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfUklHSFRdID0gY2FwSW5zZXRzW0lOU0VUX1JJR0hUXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV0gPSBjYXBJbnNldHNbSU5TRVRfQk9UVE9NXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRhLnRleHR1cmUpIHtcclxuICAgICAgICAgICAgaGFuZGxlLnJlc3VsdC5wdXNoKHRoaXMsICdfdGV4dHVyZVNvdXJjZScsIGRhdGEudGV4dHVyZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0bGFzVXVpZCA9IGRhdGEuYXRsYXMgPyBkYXRhLmF0bGFzIDogJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZlcnRpY2VzID0gZGF0YS52ZXJ0aWNlcztcclxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNlcykge1xyXG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIG5vcm1hbCB1diBhcnJheXNcclxuICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcy5udSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzLm52ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdGV4dHVyZUxvYWRlZCAoKSB7XHJcbiAgICAgICAgY29uc3QgdGV4ID0gdGhpcy5fdGV4dHVyZTtcclxuICAgICAgICBjb25zdCBjb25maWc6IElTcHJpdGVGcmFtZUluaXRJbmZvID0ge307XHJcbiAgICAgICAgbGV0IGlzUmVzZXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5fcmVjdC53aWR0aCA9PT0gMCB8fCB0aGlzLl9yZWN0LmhlaWdodCA9PT0gMCB8fCAhdGhpcy5jaGVja1JlY3QodGV4KSkge1xyXG4gICAgICAgICAgICBjb25maWcucmVjdCA9IG5ldyBSZWN0KDAsIDAsIHRleC53aWR0aCwgdGV4LmhlaWdodCk7XHJcbiAgICAgICAgICAgIGlzUmVzZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgb3JpZ2luYWwgc2l6ZSBpcyBub3Qgc2V0IG9yIHJlY3QgY2hlY2sgZmFpbGVkLCB3ZSBzaG91bGQgcmVzZXQgdGhlIG9yaWdpbmFsIHNpemVcclxuICAgICAgICBpZiAodGhpcy5fb3JpZ2luYWxTaXplLndpZHRoID09PSAwIHx8XHJcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2l6ZS5oZWlnaHQgPT09IDAgfHxcclxuICAgICAgICAgICAgaXNSZXNldFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25maWcub3JpZ2luYWxTaXplID0gbmV3IFNpemUodGV4LndpZHRoLCB0ZXguaGVpZ2h0KTtcclxuICAgICAgICAgICAgaXNSZXNldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNSZXNldCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0KGNvbmZpZyk7XHJcbiAgICAgICAgICAgIHRoaXMub25Mb2FkZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZWZyZXNoVGV4dHVyZSAodGV4dHVyZTogVGV4dHVyZUJhc2UgfCBSZW5kZXJUZXh0dXJlKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICAgICAgaWYgKHRleHR1cmUubG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVMb2FkZWQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0dXJlLm9uY2UoJ2xvYWQnLCB0aGlzLl90ZXh0dXJlTG9hZGVkLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlNwcml0ZUZyYW1lID0gU3ByaXRlRnJhbWU7XHJcbiJdfQ==