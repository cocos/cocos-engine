(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/sprite-atlas.js", "../../core/assets/sprite-frame.js", "../../core/data/decorators/index.js", "../../core/platform/event-manager/event-enum.js", "../../core/math/index.js", "../../core/value-types/enum.js", "../../core/math/utils.js", "../../core/components/ui-base/ui-renderable.js", "../../core/default-constants.js", "../../core/global-exports.js", "../../core/assets/asset-enum.js", "../../core/assets/texture-base.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/sprite-atlas.js"), require("../../core/assets/sprite-frame.js"), require("../../core/data/decorators/index.js"), require("../../core/platform/event-manager/event-enum.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("../../core/math/utils.js"), require("../../core/components/ui-base/ui-renderable.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"), require("../../core/assets/asset-enum.js"), require("../../core/assets/texture-base.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.spriteAtlas, global.spriteFrame, global.index, global.eventEnum, global.index, global._enum, global.utils, global.uiRenderable, global.defaultConstants, global.globalExports, global.assetEnum, global.textureBase);
    global.sprite = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _spriteAtlas, _spriteFrame, _index, _eventEnum, _index2, _enum, _utils, _uiRenderable, _defaultConstants, _globalExports, _assetEnum, _textureBase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Sprite = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _class3, _temp;

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

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Enum for sprite type.
   *
   * @zh
   * Sprite 类型。
   */
  var SpriteType;

  (function (SpriteType) {
    SpriteType[SpriteType["SIMPLE"] = 0] = "SIMPLE";
    SpriteType[SpriteType["SLICED"] = 1] = "SLICED";
    SpriteType[SpriteType["TILED"] = 2] = "TILED";
    SpriteType[SpriteType["FILLED"] = 3] = "FILLED";
  })(SpriteType || (SpriteType = {}));

  (0, _enum.ccenum)(SpriteType);
  /**
   * @en
   * Enum for fill type.
   *
   * @zh
   * 填充类型。
   */

  var FillType;

  (function (FillType) {
    FillType[FillType["HORIZONTAL"] = 0] = "HORIZONTAL";
    FillType[FillType["VERTICAL"] = 1] = "VERTICAL";
    FillType[FillType["RADIAL"] = 2] = "RADIAL";
  })(FillType || (FillType = {}));

  (0, _enum.ccenum)(FillType);
  /**
   * @en
   * Sprite Size can track trimmed size, raw size or none.
   *
   * @zh
   * 精灵尺寸调整模式。
   */

  var SizeMode;

  (function (SizeMode) {
    SizeMode[SizeMode["CUSTOM"] = 0] = "CUSTOM";
    SizeMode[SizeMode["TRIMMED"] = 1] = "TRIMMED";
    SizeMode[SizeMode["RAW"] = 2] = "RAW";
  })(SizeMode || (SizeMode = {}));

  (0, _enum.ccenum)(SizeMode);
  var EventType;
  /**
   * @en
   * Renders a sprite in the scene.
   *
   * @zh
   * 渲染精灵组件。
   */

  (function (EventType) {
    EventType["SPRITE_FRAME_CHANGED"] = "spriteframe-changed";
  })(EventType || (EventType = {}));

  var Sprite = (_dec = (0, _index.ccclass)('cc.Sprite'), _dec2 = (0, _index.help)('i18n:cc.Sprite'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/Render/Sprite'), _dec5 = (0, _index.type)(_spriteAtlas.SpriteAtlas), _dec6 = (0, _index.displayOrder)(4), _dec7 = (0, _index.tooltip)('图片资源所属的 Atlas 图集资源'), _dec8 = (0, _index.type)(_spriteFrame.SpriteFrame), _dec9 = (0, _index.displayOrder)(5), _dec10 = (0, _index.tooltip)('渲染 Sprite 使用的 SpriteFrame 图片资源'), _dec11 = (0, _index.type)(SpriteType), _dec12 = (0, _index.displayOrder)(6), _dec13 = (0, _index.tooltip)('渲染模式：\n- 普通（Simple）：修改尺寸会整体拉伸图像，适用于序列帧动画和普通图像 \n' + '- 九宫格（Sliced）：修改尺寸时四个角的区域不会拉伸，适用于 UI 按钮和面板背景 \n' + '- 填充（Filled）：设置一定的填充起始位置和方向，能够以一定比率剪裁显示图片'), _dec14 = (0, _index.type)(FillType), _dec15 = (0, _index.tooltip)('填充方向，可以选择横向（Horizontal），纵向（Vertical）和扇形（Radial）三种方向'), _dec16 = (0, _index.tooltip)('扇形填充时，指定扇形的中心点，取值范围 0 ~ 1'), _dec17 = (0, _index.range)([0, 1, 0.1]), _dec18 = (0, _index.tooltip)('填充起始位置，输入一个 0 ~ 1 之间的小数表示起始位置的百分比'), _dec19 = (0, _index.range)([-1, 1, 0.1]), _dec20 = (0, _index.tooltip)('填充总量，取值范围 0 ~ 1 指定显示图像范围的百分比'), _dec21 = (0, _index.displayOrder)(8), _dec22 = (0, _index.tooltip)('节点约束框内是否包括透明像素区域，勾选此项会去除节点约束框内的透明区域'), _dec23 = (0, _index.type)(SizeMode), _dec24 = (0, _index.displayOrder)(7), _dec25 = (0, _index.tooltip)('指定 Sprite 所在节点的尺寸，CUSTOM 表示自定义尺寸，TRIMMED 表示取原始图片剪裁透明像素后的尺寸，RAW 表示取原始图片未剪裁的尺寸'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_UIRenderable) {
    _inherits(Sprite, _UIRenderable);

    function Sprite() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Sprite);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Sprite)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_spriteFrame", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_type", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fillType", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_sizeMode", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fillCenter", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fillStart", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fillRange", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isTrimmedMode", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_useGrayscale", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_atlas", _descriptor10, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(Sprite, [{
      key: "__preload",
      // static State = State;
      value: function __preload() {
        this.changeMaterialForDefine();

        _get(_getPrototypeOf(Sprite.prototype), "__preload", this).call(this);

        if (_defaultConstants.EDITOR) {
          this._resized();

          this.node.on(_eventEnum.SystemEventType.SIZE_CHANGED, this._resized, this);
        }

        if (this._spriteFrame) {
          this._spriteFrame.on('load', this._markForUpdateUvDirty, this);

          this._markForUpdateUvDirty();
        }
      } // /**
      //  * Change the state of sprite.
      //  * @method setState
      //  * @see `Sprite.State`
      //  * @param state {Sprite.State} NORMAL or GRAY State.
      //  */
      // getState() {
      //     return this._state;
      // }
      // setState(state) {
      //     if (this._state === state) return;
      //     this._state = state;
      //     this._activateMaterial();
      // }
      // onLoad() {}

    }, {
      key: "onEnable",
      value: function onEnable() {
        _get(_getPrototypeOf(Sprite.prototype), "onEnable", this).call(this); // this._flushAssembler();


        this._activateMaterial(); // updateBlendFunc for custom material


        if (this.getMaterial(0)) {
          this._updateBlendFunc();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(Sprite.prototype), "onDestroy", this).call(this);

        this.destroyRenderData();

        if (_defaultConstants.EDITOR) {
          this.node.off(_eventEnum.SystemEventType.SIZE_CHANGED, this._resized, this);
        }

        if (this._spriteFrame) {
          this._spriteFrame.off('load');
        }
      }
      /**
       * @en
       * Quickly switch to other sprite frame in the sprite atlas.
       * If there is no atlas, the switch fails.
       *
       * @zh
       * 精灵图集内的精灵替换
       *
       * @returns
       */

    }, {
      key: "changeSpriteFrameFromAtlas",
      value: function changeSpriteFrameFromAtlas(name) {
        if (!this._atlas) {
          console.warn('SpriteAtlas is null.');
          return;
        }

        var sprite = this._atlas.getSpriteFrame(name);

        this.spriteFrame = sprite;
      }
    }, {
      key: "changeMaterialForDefine",
      value: function changeMaterialForDefine() {
        var texture;

        if (this._spriteFrame) {
          texture = this._spriteFrame.texture;
        }

        var value = false;

        if (texture instanceof _textureBase.TextureBase) {
          var format = texture.getPixelFormat();
          value = format === _assetEnum.PixelFormat.RGBA_ETC1 || format === _assetEnum.PixelFormat.RGB_A_PVRTC_4BPPV1 || format === _assetEnum.PixelFormat.RGB_A_PVRTC_2BPPV1;
        }

        if (value && this.grayscale) {
          this._instanceMaterialType = _uiRenderable.InstanceMaterialType.USE_ALPHA_SEPARATED_AND_GRAY;
        } else if (value) {
          this._instanceMaterialType = _uiRenderable.InstanceMaterialType.USE_ALPHA_SEPARATED;
        } else if (this.grayscale) {
          this._instanceMaterialType = _uiRenderable.InstanceMaterialType.GRAYSCALE;
        } else {
          this._instanceMaterialType = _uiRenderable.InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
        }

        this._uiMaterialDirty = true;
      }
    }, {
      key: "_render",
      value: function _render(render) {
        render.commitComp(this, this._spriteFrame.getGFXTexture(), this._assembler, this._spriteFrame.texture.getGFXSampler()); // render.commitComp(this, this._spriteFrame!.getGFXTextureView(), this._assembler!);
      }
    }, {
      key: "_canRender",
      value: function _canRender() {
        // if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        //     if (!this._enabled) { return false; }
        // } else {
        //     if (!this._enabled || !this._material) { return false; }
        // }
        // const spriteFrame = this._spriteFrame;
        // if (!spriteFrame || !spriteFrame.textureLoaded()) {
        //     return false;
        // }
        // return true;
        if (!_get(_getPrototypeOf(Sprite.prototype), "_canRender", this).call(this)) {
          return false;
        }

        var spriteFrame = this._spriteFrame;

        if (!spriteFrame || !spriteFrame.textureLoaded()) {
          return false;
        }

        return true;
      }
    }, {
      key: "_flushAssembler",
      value: function _flushAssembler() {
        var assembler = Sprite.Assembler.getAssembler(this);

        if (this._assembler !== assembler) {
          this.destroyRenderData();
          this._assembler = assembler;
        }

        if (!this._renderData) {
          if (this._assembler && this._assembler.createData) {
            this._renderData = this._assembler.createData(this);
            this._renderData.material = this.getRenderMaterial(0);
            this.markForUpdateRenderData();

            this._updateColor();
          }
        }
      }
    }, {
      key: "_applySpriteSize",
      value: function _applySpriteSize() {
        if (this._spriteFrame) {
          if (SizeMode.RAW === this._sizeMode) {
            var size = this._spriteFrame.originalSize;

            this.node._uiProps.uiTransformComp.setContentSize(size);
          } else if (SizeMode.TRIMMED === this._sizeMode) {
            var rect = this._spriteFrame.getRect();

            this.node._uiProps.uiTransformComp.setContentSize(rect.width, rect.height);
          }

          this._activateMaterial();
        }
      }
    }, {
      key: "_resized",
      value: function _resized() {
        if (!_defaultConstants.EDITOR) {
          return;
        }

        if (this._spriteFrame) {
          var actualSize = this.node._uiProps.uiTransformComp.contentSize;
          var expectedW = actualSize.width;
          var expectedH = actualSize.height;

          if (this._sizeMode === SizeMode.RAW) {
            var size = this._spriteFrame.getOriginalSize();

            expectedW = size.width;
            expectedH = size.height;
          } else if (this._sizeMode === SizeMode.TRIMMED) {
            var rect = this._spriteFrame.getRect();

            expectedW = rect.width;
            expectedH = rect.height;
          }

          if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
            this._sizeMode = SizeMode.CUSTOM;
          }
        }
      }
    }, {
      key: "_activateMaterial",
      value: function _activateMaterial() {
        var spriteFrame = this._spriteFrame;
        var material = this.getRenderMaterial(0); // WebGL

        if (_globalExports.legacyCC.game.renderType !== _globalExports.legacyCC.game.RENDER_TYPE_CANVAS) {
          // if (!material) {
          //     this._material = cc.builtinResMgr.get('sprite-material');
          //     material = this._material;
          //     if (spriteFrame && spriteFrame.textureLoaded()) {
          //         material!.setProperty('mainTexture', spriteFrame);
          //         this.markForUpdateRenderData();
          //     }
          // }
          // TODO: use editor assets
          // else {
          if (spriteFrame) {
            if (material) {
              // const matTexture = material.getProperty('mainTexture');
              // if (matTexture !== spriteFrame) {
              // material.setProperty('mainTexture', spriteFrame.texture);
              this.markForUpdateRenderData(); // }
            }
          } // }


          if (this._renderData) {
            this._renderData.material = material;
          }
        } else {
          this.markForUpdateRenderData(); // this.markForRender(true);
        }
      }
      /*
          private _applyAtlas (spriteFrame: SpriteFrame | null) {
              if (!EDITOR) {
                  return;
              }
              // Set atlas
              if (spriteFrame) {
                  if (spriteFrame.atlasUuid.length > 0) {
                      if (!this._atlas || this._atlas._uuid !== spriteFrame.atlasUuid) {
                          const self = this;
                          AssetLibrary.loadAsset(spriteFrame.atlasUuid, (err, asset) => {
                              self._atlas = asset;
                          });
                      }
                  }else{
                      this._atlas = null;
                  }
              }
          }
      */

    }, {
      key: "_onTextureLoaded",
      value: function _onTextureLoaded() {
        if (!this.isValid) {
          return;
        }

        this.changeMaterialForDefine();

        this._applySpriteSize();
      }
    }, {
      key: "_applySpriteFrame",
      value: function _applySpriteFrame(oldFrame) {
        // if (oldFrame && oldFrame.off) {
        //     oldFrame.off('load', this._onTextureLoaded, this);
        // }
        var spriteFrame = this._spriteFrame; // if (!spriteFrame || (this._material && this._material._texture) !== (spriteFrame && spriteFrame._texture)) {
        //     // disable render flow until texture is loaded
        //     this.markForRender(false);
        // }

        if (this._renderData) {
          if (oldFrame) {
            oldFrame.off('load', this._markForUpdateUvDirty);
          }

          if (spriteFrame) {
            spriteFrame.on('load', this._markForUpdateUvDirty, this);
          }

          if (!this._renderData.uvDirty) {
            if (oldFrame && spriteFrame) {
              this._renderData.uvDirty = oldFrame.uvHash !== spriteFrame.uvHash;
            } else {
              this._renderData.uvDirty = true;
            }
          }

          this._renderDataFlag = this._renderData.uvDirty;
        }

        if (spriteFrame) {
          if (!oldFrame || spriteFrame !== oldFrame) {
            // this._material.setProperty('mainTexture', spriteFrame);
            if (spriteFrame.loaded) {
              this._onTextureLoaded();
            } else {
              spriteFrame.once('load', this._onTextureLoaded, this);
            }
          }
        }
        /*
                if (EDITOR) {
                    // Set atlas
                    this._applyAtlas(spriteFrame);
                }
        */

      }
      /**
       * 强制刷新 uv。
       */

    }, {
      key: "_markForUpdateUvDirty",
      value: function _markForUpdateUvDirty() {
        if (this._renderData) {
          this._renderData.uvDirty = true;
          this._renderDataFlag = true;
        }
      }
    }, {
      key: "spriteAtlas",

      /**
       * @en
       * The sprite atlas where the sprite is.
       *
       * @zh
       * 精灵的图集。
       */
      get: function get() {
        return this._atlas;
      },
      set: function set(value) {
        if (this._atlas === value) {
          return;
        }

        this._atlas = value; //        this.spriteFrame = null;
      }
      /**
       * @en
       * The sprite frame of the sprite.
       *
       * @zh
       * 精灵的精灵帧。
       */

    }, {
      key: "spriteFrame",
      get: function get() {
        return this._spriteFrame;
      },
      set: function set(value) {
        if (this._spriteFrame === value) {
          return;
        }

        var lastSprite = this._spriteFrame;
        this._spriteFrame = value; // render & update render data flag will be triggered while applying new sprite frame

        this.markForUpdateRenderData(false);

        this._applySpriteFrame(lastSprite);

        if (_defaultConstants.EDITOR) {
          // @ts-ignore
          this.node.emit(EventType.SPRITE_FRAME_CHANGED, this);
        }
      }
      /**
       * @en
       * The sprite render type.
       *
       * @zh
       * 精灵渲染类型。
       *
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * sprite.type = Sprite.Type.SIMPLE;
       * ```
       */

    }, {
      key: "type",
      get: function get() {
        return this._type;
      },
      set: function set(value) {
        if (this._type !== value) {
          this._type = value;

          this._flushAssembler();
        }
      }
      /**
       * @en
       * The fill type, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
       *
       * @zh
       * 精灵填充类型，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
       *
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * sprite.fillType = Sprite.FillType.HORIZONTAL;
       * ```
       */

    }, {
      key: "fillType",
      get: function get() {
        return this._fillType;
      },
      set: function set(value) {
        if (this._fillType !== value) {
          if (value === FillType.RADIAL || this._fillType === FillType.RADIAL) {
            this.destroyRenderData();
            this._renderData = null;
          } else {
            if (this._renderData) {
              this.markForUpdateRenderData(true);
            }
          }
        }

        this._fillType = value;

        this._flushAssembler();
      }
      /**
       * @en
       * The fill Center, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
       *
       * @zh
       * 填充中心点，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
       *
       * @example
       * ```ts
       * import { Vec2 } from 'cc';
       * sprite.fillCenter = new Vec2(0, 0);
       * ```
       */

    }, {
      key: "fillCenter",
      get: function get() {
        return this._fillCenter;
      },
      set: function set(value) {
        this._fillCenter.x = value.x;
        this._fillCenter.y = value.y;

        if (this._type === SpriteType.FILLED && this._renderData) {
          this.markForUpdateRenderData();
        }
      }
      /**
       * @en
       * The fill Start, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
       *
       * @zh
       * 填充起始点，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
       *
       * @example
       * ```ts
       * // -1 To 1 between the numbers
       * sprite.fillStart = 0.5;
       * ```
       */

    }, {
      key: "fillStart",
      get: function get() {
        return this._fillStart;
      },
      set: function set(value) {
        this._fillStart = (0, _utils.clamp)(value, -1, 1);

        if (this._type === SpriteType.FILLED && this._renderData) {
          this.markForUpdateRenderData();
          this._renderData.uvDirty = true;
        }
      }
      /**
       * @en
       * The fill Range, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
       *
       * @zh
       * 填充范围，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
       *
       * @example
       * ```ts
       * // -1 To 1 between the numbers
       * sprite.fillRange = 1;
       * ```
       */

    }, {
      key: "fillRange",
      get: function get() {
        return this._fillRange;
      },
      set: function set(value) {
        // positive: counterclockwise, negative: clockwise
        this._fillRange = (0, _utils.clamp)(value, -1, 1);

        if (this._type === SpriteType.FILLED && this._renderData) {
          this.markForUpdateRenderData();
          this._renderData.uvDirty = true;
        }
      }
      /**
       * @en
       * specify the frame is trimmed or not.
       *
       * @zh
       * 是否使用裁剪模式。
       *
       * @example
       * ```ts
       * sprite.trim = true;
       * ```
       */

    }, {
      key: "trim",
      get: function get() {
        return this._isTrimmedMode;
      },
      set: function set(value) {
        if (this._isTrimmedMode === value) {
          return;
        }

        this._isTrimmedMode = value;

        if (this._type === SpriteType.SIMPLE
        /*|| this._type === SpriteType.MESH*/
        && this._renderData) {
          this.markForUpdateRenderData(true);
        }
      }
    }, {
      key: "grayscale",
      get: function get() {
        return this._useGrayscale;
      },
      set: function set(value) {
        if (this._useGrayscale === value) {
          return;
        }

        this._useGrayscale = value;

        if (value === true) {
          this._instanceMaterialType = _uiRenderable.InstanceMaterialType.GRAYSCALE;
        } else {
          this._instanceMaterialType = _uiRenderable.InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
        }

        this._uiMaterialDirty = true;
      }
      /**
       * @en
       * Specify the size tracing mode.
       *
       * @zh
       * 精灵尺寸调整模式。
       *
       * @example
       * ```ts
       * import { Sprite } from 'cc';
       * sprite.sizeMode = Sprite.SizeMode.CUSTOM;
       * ```
       */

    }, {
      key: "sizeMode",
      get: function get() {
        return this._sizeMode;
      },
      set: function set(value) {
        if (this._sizeMode === value) {
          return;
        }

        this._sizeMode = value;

        if (value !== SizeMode.CUSTOM) {
          this._applySpriteSize();
        }
      }
    }]);

    return Sprite;
  }(_uiRenderable.UIRenderable), _class3.FillType = FillType, _class3.Type = SpriteType, _class3.SizeMode = SizeMode, _class3.EventType = EventType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "spriteAtlas", [_dec5, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "spriteAtlas"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec8, _dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "spriteFrame"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fillType", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "fillType"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fillCenter", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "fillCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fillStart", [_dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "fillStart"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fillRange", [_dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "fillRange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "trim", [_dec21, _dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "trim"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "grayscale", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "grayscale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "sizeMode", [_dec23, _dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "sizeMode"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_spriteFrame", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_type", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return SpriteType.SIMPLE;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_fillType", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return FillType.HORIZONTAL;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_sizeMode", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return SizeMode.TRIMMED;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_fillCenter", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec2(0, 0);
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_fillStart", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_fillRange", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_isTrimmedMode", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_useGrayscale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_atlas", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.Sprite = Sprite;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvc3ByaXRlLnRzIl0sIm5hbWVzIjpbIlNwcml0ZVR5cGUiLCJGaWxsVHlwZSIsIlNpemVNb2RlIiwiRXZlbnRUeXBlIiwiU3ByaXRlIiwiU3ByaXRlQXRsYXMiLCJTcHJpdGVGcmFtZSIsImNoYW5nZU1hdGVyaWFsRm9yRGVmaW5lIiwiRURJVE9SIiwiX3Jlc2l6ZWQiLCJub2RlIiwib24iLCJTeXN0ZW1FdmVudFR5cGUiLCJTSVpFX0NIQU5HRUQiLCJfc3ByaXRlRnJhbWUiLCJfbWFya0ZvclVwZGF0ZVV2RGlydHkiLCJfYWN0aXZhdGVNYXRlcmlhbCIsImdldE1hdGVyaWFsIiwiX3VwZGF0ZUJsZW5kRnVuYyIsImRlc3Ryb3lSZW5kZXJEYXRhIiwib2ZmIiwibmFtZSIsIl9hdGxhcyIsImNvbnNvbGUiLCJ3YXJuIiwic3ByaXRlIiwiZ2V0U3ByaXRlRnJhbWUiLCJzcHJpdGVGcmFtZSIsInRleHR1cmUiLCJ2YWx1ZSIsIlRleHR1cmVCYXNlIiwiZm9ybWF0IiwiZ2V0UGl4ZWxGb3JtYXQiLCJQaXhlbEZvcm1hdCIsIlJHQkFfRVRDMSIsIlJHQl9BX1BWUlRDXzRCUFBWMSIsIlJHQl9BX1BWUlRDXzJCUFBWMSIsImdyYXlzY2FsZSIsIl9pbnN0YW5jZU1hdGVyaWFsVHlwZSIsIkluc3RhbmNlTWF0ZXJpYWxUeXBlIiwiVVNFX0FMUEhBX1NFUEFSQVRFRF9BTkRfR1JBWSIsIlVTRV9BTFBIQV9TRVBBUkFURUQiLCJHUkFZU0NBTEUiLCJBRERfQ09MT1JfQU5EX1RFWFRVUkUiLCJfdWlNYXRlcmlhbERpcnR5IiwicmVuZGVyIiwiY29tbWl0Q29tcCIsImdldEdGWFRleHR1cmUiLCJfYXNzZW1ibGVyIiwiZ2V0R0ZYU2FtcGxlciIsInRleHR1cmVMb2FkZWQiLCJhc3NlbWJsZXIiLCJBc3NlbWJsZXIiLCJnZXRBc3NlbWJsZXIiLCJfcmVuZGVyRGF0YSIsImNyZWF0ZURhdGEiLCJtYXRlcmlhbCIsImdldFJlbmRlck1hdGVyaWFsIiwibWFya0ZvclVwZGF0ZVJlbmRlckRhdGEiLCJfdXBkYXRlQ29sb3IiLCJSQVciLCJfc2l6ZU1vZGUiLCJzaXplIiwib3JpZ2luYWxTaXplIiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJzZXRDb250ZW50U2l6ZSIsIlRSSU1NRUQiLCJyZWN0IiwiZ2V0UmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiYWN0dWFsU2l6ZSIsImNvbnRlbnRTaXplIiwiZXhwZWN0ZWRXIiwiZXhwZWN0ZWRIIiwiZ2V0T3JpZ2luYWxTaXplIiwiQ1VTVE9NIiwibGVnYWN5Q0MiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsImlzVmFsaWQiLCJfYXBwbHlTcHJpdGVTaXplIiwib2xkRnJhbWUiLCJ1dkRpcnR5IiwidXZIYXNoIiwiX3JlbmRlckRhdGFGbGFnIiwibG9hZGVkIiwiX29uVGV4dHVyZUxvYWRlZCIsIm9uY2UiLCJsYXN0U3ByaXRlIiwiX2FwcGx5U3ByaXRlRnJhbWUiLCJlbWl0IiwiU1BSSVRFX0ZSQU1FX0NIQU5HRUQiLCJfdHlwZSIsIl9mbHVzaEFzc2VtYmxlciIsIl9maWxsVHlwZSIsIlJBRElBTCIsIl9maWxsQ2VudGVyIiwieCIsInkiLCJGSUxMRUQiLCJfZmlsbFN0YXJ0IiwiX2ZpbGxSYW5nZSIsIl9pc1RyaW1tZWRNb2RlIiwiU0lNUExFIiwiX3VzZUdyYXlzY2FsZSIsIlVJUmVuZGVyYWJsZSIsIlR5cGUiLCJlZGl0YWJsZSIsInNlcmlhbGl6YWJsZSIsIkhPUklaT05UQUwiLCJWZWMyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRDQTs7Ozs7OztNQU9LQSxVOzthQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEs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LEdBQVdBLFEsVUFDWDRHLEksR0FBTzdHLFUsVUFDUEUsUSxHQUFXQSxRLFVBQ1hDLFMsR0FBWUEsUyw2MENBbER6QjJHLGUsMlVBb0RBQyxtQjs7Ozs7YUFDNEMsSTs7NEVBQzVDQSxtQjs7Ozs7YUFDaUIvRyxVQUFVLENBQUMwRyxNOztnRkFDNUJLLG1COzs7OzthQUNxQjlHLFFBQVEsQ0FBQytHLFU7O2dGQUM5QkQsbUI7Ozs7O2FBQ3FCN0csUUFBUSxDQUFDaUUsTzs7a0ZBQzlCNEMsbUI7Ozs7O2FBQzZCLElBQUlFLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDOztpRkFDN0JGLG1COzs7OzthQUNzQixDOztpRkFDdEJBLG1COzs7OzthQUNzQixDOztxRkFDdEJBLG1COzs7OzthQUMwQixJOztvRkFDMUJBLG1COzs7OzthQUN5QixLOzs4RUFFekJBLG1COzs7OzthQUNzQyxJIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFNwcml0ZUF0bGFzIH0gZnJvbSAnLi4vLi4vY29yZS9hc3NldHMvc3ByaXRlLWF0bGFzJztcclxuaW1wb3J0IHsgU3ByaXRlRnJhbWUgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cy9zcHJpdGUtZnJhbWUnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRpb25PcmRlciwgbWVudSwgdG9vbHRpcCwgZGlzcGxheU9yZGVyLCB0eXBlLCByYW5nZSwgZWRpdGFibGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1lbnVtJztcclxuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IGNsYW1wIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3V0aWxzJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpJztcclxuaW1wb3J0IHsgVUlSZW5kZXJhYmxlLCBJbnN0YW5jZU1hdGVyaWFsVHlwZSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXJlbmRlcmFibGUnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBQaXhlbEZvcm1hdCB9IGZyb20gJy4uLy4uL2NvcmUvYXNzZXRzL2Fzc2V0LWVudW0nO1xyXG5pbXBvcnQgeyBUZXh0dXJlQmFzZSB9IGZyb20gJy4uLy4uL2NvcmUvYXNzZXRzL3RleHR1cmUtYmFzZSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEVudW0gZm9yIHNwcml0ZSB0eXBlLlxyXG4gKlxyXG4gKiBAemhcclxuICogU3ByaXRlIOexu+Wei+OAglxyXG4gKi9cclxuZW51bSBTcHJpdGVUeXBlIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc2ltcGxlIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmma7pgJrnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgU0lNUExFID0gMCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc2xpY2VkIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliIfniYfvvIjkuZ3lrqvmoLzvvInnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgU0xJQ0VEID0gMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgdGlsZWQgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAemggIOW5s+mTuuexu+Wei1xyXG4gICAgICovXHJcbiAgICBUSUxFRCA9ICAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBmaWxsZWQgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWhq+WFheexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBGSUxMRUQgPSAzLFxyXG4gICAgLy8gLyoqXHJcbiAgICAvLyAgKiBAZW4gVGhlIG1lc2ggdHlwZS5cclxuICAgIC8vICAqIEB6aCAg5LulIE1lc2gg5LiJ6KeS5b2i57uE5oiQ55qE57G75Z6LXHJcbiAgICAvLyAgKi9cclxuICAgIC8vIE1FU0g6IDRcclxufVxyXG5cclxuY2NlbnVtKFNwcml0ZVR5cGUpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBFbnVtIGZvciBmaWxsIHR5cGUuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDloavlhYXnsbvlnovjgIJcclxuICovXHJcbmVudW0gRmlsbFR5cGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBob3Jpem9udGFsIGZpbGwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmsLTlubPmlrnlkJHloavlhYXjgIJcclxuICAgICAqL1xyXG4gICAgSE9SSVpPTlRBTCA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHZlcnRpY2FsIGZpbGwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlnoLnm7TmlrnlkJHloavlhYXjgIJcclxuICAgICAqL1xyXG4gICAgVkVSVElDQUwgPSAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSByYWRpYWwgZmlsbC5cclxuICAgICAqXHJcbiAgICAgKiBAemggIOW+hOWQkeWhq+WFhVxyXG4gICAgICovXHJcbiAgICBSQURJQUwgPSAyLFxyXG59XHJcblxyXG5jY2VudW0oRmlsbFR5cGUpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTcHJpdGUgU2l6ZSBjYW4gdHJhY2sgdHJpbW1lZCBzaXplLCByYXcgc2l6ZSBvciBub25lLlxyXG4gKlxyXG4gKiBAemhcclxuICog57K+54G15bC65a+46LCD5pW05qih5byP44CCXHJcbiAqL1xyXG5lbnVtIFNpemVNb2RlIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBVc2UgdGhlIGN1c3RvbWl6ZWQgbm9kZSBzaXplLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5L2/55So6IqC54K56aKE6K6+55qE5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIENVU1RPTSA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTWF0Y2ggdGhlIHRyaW1tZWQgc2l6ZSBvZiB0aGUgc3ByaXRlIGZyYW1lIGF1dG9tYXRpY2FsbHkuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDoh6rliqjpgILphY3kuLrnsr7ngbXoo4HliarlkI7nmoTlsLrlr7jjgIJcclxuICAgICAqL1xyXG4gICAgVFJJTU1FRCA9IDEsXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTWF0Y2ggdGhlIHJhdyBzaXplIG9mIHRoZSBzcHJpdGUgZnJhbWUgYXV0b21hdGljYWxseS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiHquWKqOmAgumFjeS4uueyvueBteWOn+WbvuWwuuWvuOOAglxyXG4gICAgICovXHJcbiAgICBSQVcgPSAyLFxyXG59XHJcblxyXG5jY2VudW0oU2l6ZU1vZGUpO1xyXG5cclxuZW51bSBFdmVudFR5cGUge1xyXG4gICAgU1BSSVRFX0ZSQU1FX0NIQU5HRUQgPSAnc3ByaXRlZnJhbWUtY2hhbmdlZCcsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogUmVuZGVycyBhIHNwcml0ZSBpbiB0aGUgc2NlbmUuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDmuLLmn5Pnsr7ngbXnu4Tku7bjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5TcHJpdGUnKVxyXG5AaGVscCgnaTE4bjpjYy5TcHJpdGUnKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvUmVuZGVyL1Nwcml0ZScpXHJcbmV4cG9ydCBjbGFzcyBTcHJpdGUgZXh0ZW5kcyBVSVJlbmRlcmFibGUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc3ByaXRlIGF0bGFzIHdoZXJlIHRoZSBzcHJpdGUgaXMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnsr7ngbXnmoTlm77pm4bjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3ByaXRlQXRsYXMpXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgn5Zu+54mH6LWE5rqQ5omA5bGe55qEIEF0bGFzIOWbvumbhui1hOa6kCcpXHJcbiAgICBnZXQgc3ByaXRlQXRsYXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdGxhcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3ByaXRlQXRsYXMgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2F0bGFzID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hdGxhcyA9IHZhbHVlO1xyXG4vLyAgICAgICAgdGhpcy5zcHJpdGVGcmFtZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBzcHJpdGUgZnJhbWUgb2YgdGhlIHNwcml0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOeyvueBteeahOeyvueBteW4p+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGVGcmFtZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoNSlcclxuICAgIEB0b29sdGlwKCfmuLLmn5MgU3ByaXRlIOS9v+eUqOeahCBTcHJpdGVGcmFtZSDlm77niYfotYTmupAnKVxyXG4gICAgZ2V0IHNwcml0ZUZyYW1lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlRnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNwcml0ZUZyYW1lICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGVGcmFtZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbGFzdFNwcml0ZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xyXG4gICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lID0gdmFsdWU7XHJcbiAgICAgICAgLy8gcmVuZGVyICYgdXBkYXRlIHJlbmRlciBkYXRhIGZsYWcgd2lsbCBiZSB0cmlnZ2VyZWQgd2hpbGUgYXBwbHlpbmcgbmV3IHNwcml0ZSBmcmFtZVxyXG4gICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlRnJhbWUobGFzdFNwcml0ZSk7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5lbWl0KEV2ZW50VHlwZS5TUFJJVEVfRlJBTUVfQ0hBTkdFRCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc3ByaXRlIHJlbmRlciB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57K+54G15riy5p+T57G75Z6L44CCXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICdjYyc7XHJcbiAgICAgKiBzcHJpdGUudHlwZSA9IFNwcml0ZS5UeXBlLlNJTVBMRTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGVUeXBlKVxyXG4gICAgQGRpc3BsYXlPcmRlcig2KVxyXG4gICAgQHRvb2x0aXAoJ+a4suafk+aooeW8j++8mlxcbi0g5pmu6YCa77yIU2ltcGxl77yJ77ya5L+u5pS55bC65a+45Lya5pW05L2T5ouJ5Ly45Zu+5YOP77yM6YCC55So5LqO5bqP5YiX5bin5Yqo55S75ZKM5pmu6YCa5Zu+5YOPIFxcbicgK1xyXG4gICAgJy0g5Lmd5a6r5qC877yIU2xpY2Vk77yJ77ya5L+u5pS55bC65a+45pe25Zub5Liq6KeS55qE5Yy65Z+f5LiN5Lya5ouJ5Ly477yM6YCC55So5LqOIFVJIOaMiemSruWSjOmdouadv+iDjOaZryBcXG4nICtcclxuICAgICctIOWhq+WFhe+8iEZpbGxlZO+8ie+8muiuvue9ruS4gOWumueahOWhq+WFhei1t+Wni+S9jee9ruWSjOaWueWQke+8jOiDveWkn+S7peS4gOWumuavlOeOh+WJquijgeaYvuekuuWbvueJhycpXHJcbiAgICBnZXQgdHlwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcbiAgICBzZXQgdHlwZSAodmFsdWU6IFNwcml0ZVR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLl9mbHVzaEFzc2VtYmxlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGZpbGwgdHlwZSwgVGhpcyB3aWxsIG9ubHkgaGF2ZSBhbnkgZWZmZWN0IGlmIHRoZSBcInR5cGVcIiBpcyBzZXQgdG8g4oCcU3ByaXRlLlR5cGUuRklMTEVE4oCdLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57K+54G15aGr5YWF57G75Z6L77yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IFNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IFNwcml0ZSB9IGZyb20gJ2NjJztcclxuICAgICAqIHNwcml0ZS5maWxsVHlwZSA9IFNwcml0ZS5GaWxsVHlwZS5IT1JJWk9OVEFMO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEZpbGxUeXBlKVxyXG4gICAgQHRvb2x0aXAoJ+Whq+WFheaWueWQke+8jOWPr+S7pemAieaLqeaoquWQke+8iEhvcml6b250YWzvvInvvIznurXlkJHvvIhWZXJ0aWNhbO+8ieWSjOaJh+W9ou+8iFJhZGlhbO+8ieS4ieenjeaWueWQkScpXHJcbiAgICBnZXQgZmlsbFR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maWxsVHlwZTtcclxuICAgIH1cclxuICAgIHNldCBmaWxsVHlwZSAodmFsdWU6IEZpbGxUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZpbGxUeXBlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IEZpbGxUeXBlLlJBRElBTCB8fCB0aGlzLl9maWxsVHlwZSA9PT0gRmlsbFR5cGUuUkFESUFMKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3lSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZW5kZXJEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrRm9yVXBkYXRlUmVuZGVyRGF0YSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZmlsbFR5cGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9mbHVzaEFzc2VtYmxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZmlsbCBDZW50ZXIsIFRoaXMgd2lsbCBvbmx5IGhhdmUgYW55IGVmZmVjdCBpZiB0aGUgXCJ0eXBlXCIgaXMgc2V0IHRvIOKAnFNwcml0ZS5UeXBlLkZJTExFROKAnS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWhq+WFheS4reW/g+eCue+8jOS7hea4suafk+exu+Wei+iuvue9ruS4uiBTcHJpdGUuVHlwZS5GSUxMRUQg5pe25pyJ5pWI44CCXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBWZWMyIH0gZnJvbSAnY2MnO1xyXG4gICAgICogc3ByaXRlLmZpbGxDZW50ZXIgPSBuZXcgVmVjMigwLCAwKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5omH5b2i5aGr5YWF5pe277yM5oyH5a6a5omH5b2i55qE5Lit5b+D54K577yM5Y+W5YC86IyD5Zu0IDAgfiAxJylcclxuICAgIGdldCBmaWxsQ2VudGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlsbENlbnRlcjtcclxuICAgIH1cclxuICAgIHNldCBmaWxsQ2VudGVyICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2ZpbGxDZW50ZXIueCA9IHZhbHVlLng7XHJcbiAgICAgICAgdGhpcy5fZmlsbENlbnRlci55ID0gdmFsdWUueTtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5GSUxMRUQgJiYgdGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZmlsbCBTdGFydCwgVGhpcyB3aWxsIG9ubHkgaGF2ZSBhbnkgZWZmZWN0IGlmIHRoZSBcInR5cGVcIiBpcyBzZXQgdG8g4oCcU3ByaXRlLlR5cGUuRklMTEVE4oCdLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aGr5YWF6LW35aeL54K577yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IFNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIC8vIC0xIFRvIDEgYmV0d2VlbiB0aGUgbnVtYmVyc1xyXG4gICAgICogc3ByaXRlLmZpbGxTdGFydCA9IDAuNTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBAcmFuZ2UoWzAsIDEsIDAuMV0pXHJcbiAgICBAdG9vbHRpcCgn5aGr5YWF6LW35aeL5L2N572u77yM6L6T5YWl5LiA5LiqIDAgfiAxIOS5i+mXtOeahOWwj+aVsOihqOekuui1t+Wni+S9jee9rueahOeZvuWIhuavlCcpXHJcbiAgICBnZXQgZmlsbFN0YXJ0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlsbFN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmaWxsU3RhcnQgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZmlsbFN0YXJ0ID0gY2xhbXAodmFsdWUsIC0xLCAxKTtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5GSUxMRUQgJiYgdGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEudXZEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZmlsbCBSYW5nZSwgVGhpcyB3aWxsIG9ubHkgaGF2ZSBhbnkgZWZmZWN0IGlmIHRoZSBcInR5cGVcIiBpcyBzZXQgdG8g4oCcU3ByaXRlLlR5cGUuRklMTEVE4oCdLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aGr5YWF6IyD5Zu077yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IFNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIC8vIC0xIFRvIDEgYmV0d2VlbiB0aGUgbnVtYmVyc1xyXG4gICAgICogc3ByaXRlLmZpbGxSYW5nZSA9IDE7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQHJhbmdlKFstMSwgMSwgMC4xXSlcclxuICAgIEB0b29sdGlwKCfloavlhYXmgLvph4/vvIzlj5blgLzojIPlm7QgMCB+IDEg5oyH5a6a5pi+56S65Zu+5YOP6IyD5Zu055qE55m+5YiG5q+UJylcclxuICAgIGdldCBmaWxsUmFuZ2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maWxsUmFuZ2U7XHJcbiAgICB9XHJcbiAgICBzZXQgZmlsbFJhbmdlICh2YWx1ZSkge1xyXG4gICAgICAgIC8vIHBvc2l0aXZlOiBjb3VudGVyY2xvY2t3aXNlLCBuZWdhdGl2ZTogY2xvY2t3aXNlXHJcbiAgICAgICAgdGhpcy5fZmlsbFJhbmdlID0gY2xhbXAodmFsdWUsIC0xLCAxKTtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5GSUxMRUQgJiYgdGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEudXZEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIHNwZWNpZnkgdGhlIGZyYW1lIGlzIHRyaW1tZWQgb3Igbm90LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5L2/55So6KOB5Ymq5qih5byP44CCXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBzcHJpdGUudHJpbSA9IHRydWU7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcig4KVxyXG4gICAgQHRvb2x0aXAoJ+iKgueCuee6puadn+ahhuWGheaYr+WQpuWMheaLrOmAj+aYjuWDj+e0oOWMuuWfn++8jOWLvumAieatpOmhueS8muWOu+mZpOiKgueCuee6puadn+ahhuWGheeahOmAj+aYjuWMuuWfnycpXHJcbiAgICBnZXQgdHJpbSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVHJpbW1lZE1vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRyaW0gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVHJpbW1lZE1vZGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzVHJpbW1lZE1vZGUgPSB2YWx1ZTtcclxuICAgICAgICBpZiAoKHRoaXMuX3R5cGUgPT09IFNwcml0ZVR5cGUuU0lNUExFIC8qfHwgdGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5NRVNIKi8pICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXJrRm9yVXBkYXRlUmVuZGVyRGF0YSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgZ3JheXNjYWxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlR3JheXNjYWxlO1xyXG4gICAgfVxyXG4gICAgc2V0IGdyYXlzY2FsZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fdXNlR3JheXNjYWxlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VzZUdyYXlzY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZU1hdGVyaWFsVHlwZSA9IEluc3RhbmNlTWF0ZXJpYWxUeXBlLkdSQVlTQ0FMRTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZU1hdGVyaWFsVHlwZSA9IEluc3RhbmNlTWF0ZXJpYWxUeXBlLkFERF9DT0xPUl9BTkRfVEVYVFVSRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdWlNYXRlcmlhbERpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3BlY2lmeSB0aGUgc2l6ZSB0cmFjaW5nIG1vZGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnsr7ngbXlsLrlr7josIPmlbTmqKHlvI/jgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IFNwcml0ZSB9IGZyb20gJ2NjJztcclxuICAgICAqIHNwcml0ZS5zaXplTW9kZSA9IFNwcml0ZS5TaXplTW9kZS5DVVNUT007XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU2l6ZU1vZGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDcpXHJcbiAgICBAdG9vbHRpcCgn5oyH5a6aIFNwcml0ZSDmiYDlnKjoioLngrnnmoTlsLrlr7jvvIxDVVNUT00g6KGo56S66Ieq5a6a5LmJ5bC65a+477yMVFJJTU1FRCDooajnpLrlj5bljp/lp4vlm77niYfliaroo4HpgI/mmI7lg4/ntKDlkI7nmoTlsLrlr7jvvIxSQVcg6KGo56S65Y+W5Y6f5aeL5Zu+54mH5pyq5Ymq6KOB55qE5bC65a+4JylcclxuICAgIGdldCBzaXplTW9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemVNb2RlO1xyXG4gICAgfVxyXG4gICAgc2V0IHNpemVNb2RlICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaXplTW9kZSA9PT0gdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zaXplTW9kZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gU2l6ZU1vZGUuQ1VTVE9NKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlU2l6ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEZpbGxUeXBlID0gRmlsbFR5cGU7XHJcbiAgICBwdWJsaWMgc3RhdGljIFR5cGUgPSBTcHJpdGVUeXBlO1xyXG4gICAgcHVibGljIHN0YXRpYyBTaXplTW9kZSA9IFNpemVNb2RlO1xyXG4gICAgcHVibGljIHN0YXRpYyBFdmVudFR5cGUgPSBFdmVudFR5cGU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zcHJpdGVGcmFtZTogU3ByaXRlRnJhbWUgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdHlwZSA9IFNwcml0ZVR5cGUuU0lNUExFO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9maWxsVHlwZSA9IEZpbGxUeXBlLkhPUklaT05UQUw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3NpemVNb2RlID0gU2l6ZU1vZGUuVFJJTU1FRDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZmlsbENlbnRlcjogVmVjMiA9IG5ldyBWZWMyKDAsIDApO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9maWxsU3RhcnQgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9maWxsUmFuZ2UgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pc1RyaW1tZWRNb2RlID0gdHJ1ZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdXNlR3JheXNjYWxlID0gZmFsc2U7XHJcbiAgICAvLyBfc3RhdGUgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9hdGxhczogU3ByaXRlQXRsYXMgfCBudWxsID0gbnVsbDtcclxuICAgIC8vIHN0YXRpYyBTdGF0ZSA9IFN0YXRlO1xyXG5cclxuICAgIHB1YmxpYyBfX3ByZWxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlTWF0ZXJpYWxGb3JEZWZpbmUoKTtcclxuXHJcbiAgICAgICAgc3VwZXIuX19wcmVsb2FkKCk7XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzaXplZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLl9zcHJpdGVGcmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lLm9uKCdsb2FkJywgdGhpcy5fbWFya0ZvclVwZGF0ZVV2RGlydHksIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrRm9yVXBkYXRlVXZEaXJ0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyAvKipcclxuICAgIC8vICAqIENoYW5nZSB0aGUgc3RhdGUgb2Ygc3ByaXRlLlxyXG4gICAgLy8gICogQG1ldGhvZCBzZXRTdGF0ZVxyXG4gICAgLy8gICogQHNlZSBgU3ByaXRlLlN0YXRlYFxyXG4gICAgLy8gICogQHBhcmFtIHN0YXRlIHtTcHJpdGUuU3RhdGV9IE5PUk1BTCBvciBHUkFZIFN0YXRlLlxyXG4gICAgLy8gICovXHJcbiAgICAvLyBnZXRTdGF0ZSgpIHtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2V0U3RhdGUoc3RhdGUpIHtcclxuICAgIC8vICAgICBpZiAodGhpcy5fc3RhdGUgPT09IHN0YXRlKSByZXR1cm47XHJcbiAgICAvLyAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcclxuICAgIC8vICAgICB0aGlzLl9hY3RpdmF0ZU1hdGVyaWFsKCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gb25Mb2FkKCkge31cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRW5hYmxlKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuX2ZsdXNoQXNzZW1ibGVyKCk7XHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xyXG4gICAgICAgIC8vIHVwZGF0ZUJsZW5kRnVuYyBmb3IgY3VzdG9tIG1hdGVyaWFsXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0TWF0ZXJpYWwoMCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmxlbmRGdW5jKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVJlbmRlckRhdGEoKTtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUub2ZmKCdsb2FkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBRdWlja2x5IHN3aXRjaCB0byBvdGhlciBzcHJpdGUgZnJhbWUgaW4gdGhlIHNwcml0ZSBhdGxhcy5cclxuICAgICAqIElmIHRoZXJlIGlzIG5vIGF0bGFzLCB0aGUgc3dpdGNoIGZhaWxzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57K+54G15Zu+6ZuG5YaF55qE57K+54G15pu/5o2iXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNoYW5nZVNwcml0ZUZyYW1lRnJvbUF0bGFzIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2F0bGFzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3ByaXRlQXRsYXMgaXMgbnVsbC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzcHJpdGUgPSB0aGlzLl9hdGxhcy5nZXRTcHJpdGVGcmFtZShuYW1lKTtcclxuICAgICAgICB0aGlzLnNwcml0ZUZyYW1lID0gc3ByaXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VNYXRlcmlhbEZvckRlZmluZSAoKSB7XHJcbiAgICAgICAgbGV0IHRleHR1cmU7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRleHR1cmUgPSB0aGlzLl9zcHJpdGVGcmFtZS50ZXh0dXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmFsdWUgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGV4dHVyZSBpbnN0YW5jZW9mIFRleHR1cmVCYXNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IHRleHR1cmUuZ2V0UGl4ZWxGb3JtYXQoKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAoZm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JBX0VUQzEgfHwgZm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JfQV9QVlJUQ180QlBQVjEgfHwgZm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JfQV9QVlJUQ18yQlBQVjEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHRoaXMuZ3JheXNjYWxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlTWF0ZXJpYWxUeXBlID0gSW5zdGFuY2VNYXRlcmlhbFR5cGUuVVNFX0FMUEhBX1NFUEFSQVRFRF9BTkRfR1JBWTtcclxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlTWF0ZXJpYWxUeXBlID0gSW5zdGFuY2VNYXRlcmlhbFR5cGUuVVNFX0FMUEhBX1NFUEFSQVRFRDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JheXNjYWxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlTWF0ZXJpYWxUeXBlID0gSW5zdGFuY2VNYXRlcmlhbFR5cGUuR1JBWVNDQUxFO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlTWF0ZXJpYWxUeXBlID0gSW5zdGFuY2VNYXRlcmlhbFR5cGUuQUREX0NPTE9SX0FORF9URVhUVVJFO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91aU1hdGVyaWFsRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVuZGVyIChyZW5kZXI6IFVJKSB7XHJcbiAgICAgICAgcmVuZGVyLmNvbW1pdENvbXAodGhpcywgdGhpcy5fc3ByaXRlRnJhbWUhLmdldEdGWFRleHR1cmUoKSwgdGhpcy5fYXNzZW1ibGVyISwgdGhpcy5fc3ByaXRlRnJhbWUhLnRleHR1cmUuZ2V0R0ZYU2FtcGxlcigpKTtcclxuICAgICAgICAvLyByZW5kZXIuY29tbWl0Q29tcCh0aGlzLCB0aGlzLl9zcHJpdGVGcmFtZSEuZ2V0R0ZYVGV4dHVyZVZpZXcoKSwgdGhpcy5fYXNzZW1ibGVyISk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYW5SZW5kZXIgKCkge1xyXG4gICAgICAgIC8vIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XHJcbiAgICAgICAgLy8gICAgIGlmICghdGhpcy5fZW5hYmxlZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBpZiAoIXRoaXMuX2VuYWJsZWQgfHwgIXRoaXMuX21hdGVyaWFsKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gY29uc3Qgc3ByaXRlRnJhbWUgPSB0aGlzLl9zcHJpdGVGcmFtZTtcclxuICAgICAgICAvLyBpZiAoIXNwcml0ZUZyYW1lIHx8ICFzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAoIXN1cGVyLl9jYW5SZW5kZXIoKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNwcml0ZUZyYW1lID0gdGhpcy5fc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgaWYgKCFzcHJpdGVGcmFtZSB8fCAhc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZmx1c2hBc3NlbWJsZXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGFzc2VtYmxlciA9IFNwcml0ZS5Bc3NlbWJsZXIhLmdldEFzc2VtYmxlcih0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VtYmxlciAhPT0gYXNzZW1ibGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveVJlbmRlckRhdGEoKTtcclxuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyID0gYXNzZW1ibGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLmNyZWF0ZURhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEgPSB0aGlzLl9hc3NlbWJsZXIuY3JlYXRlRGF0YSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEhLm1hdGVyaWFsID0gdGhpcy5nZXRSZW5kZXJNYXRlcmlhbCgwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXBwbHlTcHJpdGVTaXplICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgaWYgKFNpemVNb2RlLlJBVyA9PT0gdGhpcy5fc2l6ZU1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLl9zcHJpdGVGcmFtZS5vcmlnaW5hbFNpemU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZShzaXplKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChTaXplTW9kZS5UUklNTUVEID09PSB0aGlzLl9zaXplTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuX3Nwcml0ZUZyYW1lLmdldFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLnNldENvbnRlbnRTaXplKHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXNpemVkICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0dWFsU2l6ZSA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLmNvbnRlbnRTaXplO1xyXG4gICAgICAgICAgICBsZXQgZXhwZWN0ZWRXID0gYWN0dWFsU2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgbGV0IGV4cGVjdGVkSCA9IGFjdHVhbFNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2l6ZU1vZGUgPT09IFNpemVNb2RlLlJBVykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX3Nwcml0ZUZyYW1lLmdldE9yaWdpbmFsU2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRXID0gc2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGV4cGVjdGVkSCA9IHNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3NpemVNb2RlID09PSBTaXplTW9kZS5UUklNTUVEKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5fc3ByaXRlRnJhbWUuZ2V0UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRXID0gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgICAgIGV4cGVjdGVkSCA9IHJlY3QuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cGVjdGVkVyAhPT0gYWN0dWFsU2l6ZS53aWR0aCB8fCBleHBlY3RlZEggIT09IGFjdHVhbFNpemUuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplTW9kZSA9IFNpemVNb2RlLkNVU1RPTTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hY3RpdmF0ZU1hdGVyaWFsICgpIHtcclxuICAgICAgICBjb25zdCBzcHJpdGVGcmFtZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xyXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gdGhpcy5nZXRSZW5kZXJNYXRlcmlhbCgwKTtcclxuICAgICAgICAvLyBXZWJHTFxyXG4gICAgICAgIGlmIChsZWdhY3lDQy5nYW1lLnJlbmRlclR5cGUgIT09IGxlZ2FjeUNDLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XHJcbiAgICAgICAgICAgIC8vIGlmICghbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuX21hdGVyaWFsID0gY2MuYnVpbHRpblJlc01nci5nZXQoJ3Nwcml0ZS1tYXRlcmlhbCcpO1xyXG4gICAgICAgICAgICAvLyAgICAgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbDtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzcHJpdGVGcmFtZSAmJiBzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBtYXRlcmlhbCEuc2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgc3ByaXRlRnJhbWUpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBUT0RPOiB1c2UgZWRpdG9yIGFzc2V0c1xyXG4gICAgICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBtYXRUZXh0dXJlID0gbWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKG1hdFRleHR1cmUgIT09IHNwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgc3ByaXRlRnJhbWUudGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrRm9yVXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuLypcclxuICAgIHByaXZhdGUgX2FwcGx5QXRsYXMgKHNwcml0ZUZyYW1lOiBTcHJpdGVGcmFtZSB8IG51bGwpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldCBhdGxhc1xyXG4gICAgICAgIGlmIChzcHJpdGVGcmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoc3ByaXRlRnJhbWUuYXRsYXNVdWlkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fYXRsYXMgfHwgdGhpcy5fYXRsYXMuX3V1aWQgIT09IHNwcml0ZUZyYW1lLmF0bGFzVXVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIEFzc2V0TGlicmFyeS5sb2FkQXNzZXQoc3ByaXRlRnJhbWUuYXRsYXNVdWlkLCAoZXJyLCBhc3NldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9hdGxhcyA9IGFzc2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F0bGFzID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuKi9cclxuICAgIHByaXZhdGUgX29uVGV4dHVyZUxvYWRlZCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VNYXRlcmlhbEZvckRlZmluZSgpO1xyXG4gICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlU2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FwcGx5U3ByaXRlRnJhbWUgKG9sZEZyYW1lOiBTcHJpdGVGcmFtZSB8IG51bGwpIHtcclxuICAgICAgICAvLyBpZiAob2xkRnJhbWUgJiYgb2xkRnJhbWUub2ZmKSB7XHJcbiAgICAgICAgLy8gICAgIG9sZEZyYW1lLm9mZignbG9hZCcsIHRoaXMuX29uVGV4dHVyZUxvYWRlZCwgdGhpcyk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBjb25zdCBzcHJpdGVGcmFtZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xyXG4gICAgICAgIC8vIGlmICghc3ByaXRlRnJhbWUgfHwgKHRoaXMuX21hdGVyaWFsICYmIHRoaXMuX21hdGVyaWFsLl90ZXh0dXJlKSAhPT0gKHNwcml0ZUZyYW1lICYmIHNwcml0ZUZyYW1lLl90ZXh0dXJlKSkge1xyXG4gICAgICAgIC8vICAgICAvLyBkaXNhYmxlIHJlbmRlciBmbG93IHVudGlsIHRleHR1cmUgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gICAgIHRoaXMubWFya0ZvclJlbmRlcihmYWxzZSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICBpZihvbGRGcmFtZSl7XHJcbiAgICAgICAgICAgICAgICBvbGRGcmFtZS5vZmYoJ2xvYWQnLCB0aGlzLl9tYXJrRm9yVXBkYXRlVXZEaXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHNwcml0ZUZyYW1lKXtcclxuICAgICAgICAgICAgICAgIHNwcml0ZUZyYW1lLm9uKCdsb2FkJywgdGhpcy5fbWFya0ZvclVwZGF0ZVV2RGlydHksIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlbmRlckRhdGEudXZEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEZyYW1lICYmIHNwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyRGF0YS51dkRpcnR5ID0gb2xkRnJhbWUudXZIYXNoICE9PSBzcHJpdGVGcmFtZS51dkhhc2g7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEhLnV2RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhRmxhZyA9IHRoaXMuX3JlbmRlckRhdGEhLnV2RGlydHlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzcHJpdGVGcmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoIW9sZEZyYW1lIHx8IHNwcml0ZUZyYW1lICE9PSBvbGRGcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgc3ByaXRlRnJhbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNwcml0ZUZyYW1lLmxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uVGV4dHVyZUxvYWRlZCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVGcmFtZS5vbmNlKCdsb2FkJywgdGhpcy5fb25UZXh0dXJlTG9hZGVkLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLypcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIC8vIFNldCBhdGxhc1xyXG4gICAgICAgICAgICB0aGlzLl9hcHBseUF0bGFzKHNwcml0ZUZyYW1lKTtcclxuICAgICAgICB9XHJcbiovXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvLrliLbliLfmlrAgdXbjgIJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfbWFya0ZvclVwZGF0ZVV2RGlydHkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEudXZEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGFGbGFnID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19