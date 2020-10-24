(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/index.js", "../../core/data/decorators/index.js", "../../core/value-types/enum.js", "../assembler/label/font-utils.js", "../../core/components/ui-base/ui-renderable.js", "../../core/platform/debug.js", "../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/index.js"), require("../../core/data/decorators/index.js"), require("../../core/value-types/enum.js"), require("../assembler/label/font-utils.js"), require("../../core/components/ui-base/ui-renderable.js"), require("../../core/platform/debug.js"), require("../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global._enum, global.fontUtils, global.uiRenderable, global.debug, global.defaultConstants);
    global.label = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _enum, _fontUtils, _uiRenderable, _debug, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Label = _exports.CacheMode = _exports.Overflow = _exports.VerticalTextAlignment = _exports.HorizontalTextAlignment = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

  function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en Enum for horizontal text alignment.
   *
   * @zh 文本横向对齐类型。
   */
  var HorizontalTextAlignment;
  _exports.HorizontalTextAlignment = HorizontalTextAlignment;

  (function (HorizontalTextAlignment) {
    HorizontalTextAlignment[HorizontalTextAlignment["LEFT"] = 0] = "LEFT";
    HorizontalTextAlignment[HorizontalTextAlignment["CENTER"] = 1] = "CENTER";
    HorizontalTextAlignment[HorizontalTextAlignment["RIGHT"] = 2] = "RIGHT";
  })(HorizontalTextAlignment || (_exports.HorizontalTextAlignment = HorizontalTextAlignment = {}));

  (0, _enum.ccenum)(HorizontalTextAlignment);
  /**
   * @en Enum for vertical text alignment.
   *
   * @zh 文本垂直对齐类型。
   */

  var VerticalTextAlignment;
  _exports.VerticalTextAlignment = VerticalTextAlignment;

  (function (VerticalTextAlignment) {
    VerticalTextAlignment[VerticalTextAlignment["TOP"] = 0] = "TOP";
    VerticalTextAlignment[VerticalTextAlignment["CENTER"] = 1] = "CENTER";
    VerticalTextAlignment[VerticalTextAlignment["BOTTOM"] = 2] = "BOTTOM";
  })(VerticalTextAlignment || (_exports.VerticalTextAlignment = VerticalTextAlignment = {}));

  (0, _enum.ccenum)(VerticalTextAlignment);
  /**
   * @en Enum for Overflow.
   *
   * @zh 文本超载类型。
   */

  var Overflow;
  _exports.Overflow = Overflow;

  (function (Overflow) {
    Overflow[Overflow["NONE"] = 0] = "NONE";
    Overflow[Overflow["CLAMP"] = 1] = "CLAMP";
    Overflow[Overflow["SHRINK"] = 2] = "SHRINK";
    Overflow[Overflow["RESIZE_HEIGHT"] = 3] = "RESIZE_HEIGHT";
  })(Overflow || (_exports.Overflow = Overflow = {}));

  (0, _enum.ccenum)(Overflow);
  /**
   * @en Enum for cache mode.
   *
   * @zh 文本图集缓存类型。
   */

  var CacheMode;
  _exports.CacheMode = CacheMode;

  (function (CacheMode) {
    CacheMode[CacheMode["NONE"] = 0] = "NONE";
    CacheMode[CacheMode["BITMAP"] = 1] = "BITMAP";
    CacheMode[CacheMode["CHAR"] = 2] = "CHAR";
  })(CacheMode || (_exports.CacheMode = CacheMode = {}));

  (0, _enum.ccenum)(CacheMode);
  /**
   * @zh
   * Type 类型。
   */

  /**
   * @zh
   * TTF字体。
   */

  /**
   * @zh
   * 位图字体。
   */

  /**
   * @zh
   * 系统字体。
   */

  /**
   * @en
   * The Label Component.
   *
   * @zh
   * 文字标签组件。
   */

  var Label = (_dec = (0, _index2.ccclass)('cc.Label'), _dec2 = (0, _index2.help)('i18n:cc.Label'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/Render/Label'), _dec5 = (0, _index2.displayOrder)(4), _dec6 = (0, _index2.tooltip)('Label 显示的文本内容字符串'), _dec7 = (0, _index2.type)(HorizontalTextAlignment), _dec8 = (0, _index2.displayOrder)(5), _dec9 = (0, _index2.tooltip)('文字水平对齐模式'), _dec10 = (0, _index2.type)(VerticalTextAlignment), _dec11 = (0, _index2.displayOrder)(6), _dec12 = (0, _index2.tooltip)('文字垂直对齐模式'), _dec13 = (0, _index2.displayOrder)(7), _dec14 = (0, _index2.tooltip)('文字尺寸，以 point 为单位'), _dec15 = (0, _index2.displayOrder)(8), _dec16 = (0, _index2.tooltip)('文字字体名字'), _dec17 = (0, _index2.displayOrder)(8), _dec18 = (0, _index2.tooltip)('文字行高，以 point 为单位'), _dec19 = (0, _index2.type)(Overflow), _dec20 = (0, _index2.displayOrder)(9), _dec21 = (0, _index2.tooltip)('文字排版模式，包括以下三种：\n 1. CLAMP: 节点约束框之外的文字会被截断 \n 2. SHRINK: 自动根据节点约束框缩小文字\n 3. RESIZE_HEIGHT: 根据文本内容自动更新节点的 height 属性.'), _dec22 = (0, _index2.displayOrder)(10), _dec23 = (0, _index2.tooltip)('自动换行'), _dec24 = (0, _index2.type)(_index.Font), _dec25 = (0, _index2.displayOrder)(11), _dec26 = (0, _index2.tooltip)('Label 使用的字体资源'), _dec27 = (0, _index2.displayOrder)(12), _dec28 = (0, _index2.tooltip)('是否使用系统默认字体'), _dec29 = (0, _index2.type)(CacheMode), _dec30 = (0, _index2.displayOrder)(13), _dec31 = (0, _index2.tooltip)('文本缓存模式，包括以下三种：\n 1. NONE: 不做任何缓存，文本内容进行一次绘制 \n 2. BITMAP: 将文本作为静态图像加入动态图集进行批次合并，但是不能频繁动态修改文本内容 \n 3. CHAR: 将文本拆分为字符并且把字符纹理缓存到一张字符图集中进行复用，适用于字符内容重复并且频繁更新的文本内容'), _dec32 = (0, _index2.displayOrder)(15), _dec33 = (0, _index2.tooltip)('字体加粗'), _dec34 = (0, _index2.displayOrder)(16), _dec35 = (0, _index2.tooltip)('字体倾斜'), _dec36 = (0, _index2.displayOrder)(17), _dec37 = (0, _index2.tooltip)('字体加下划线'), _dec38 = (0, _index2.type)(_index.Material), _dec39 = (0, _index2.displayName)('Materials'), _dec40 = (0, _index2.visible)(false), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_UIRenderable) {
    _inherits(Label, _UIRenderable);

    _createClass(Label, [{
      key: "string",

      /**
       * @en
       * Content string of label.
       *
       * @zh
       * 标签显示的文本内容。
       */
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        value = value + '';

        if (this._string === value) {
          return;
        }

        this._string = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Horizontal Alignment of label.
       *
       * @zh
       * 文本内容的水平对齐方式。
       */

    }, {
      key: "horizontalAlign",
      get: function get() {
        return this._horizontalAlign;
      },
      set: function set(value) {
        if (this._horizontalAlign === value) {
          return;
        }

        this._horizontalAlign = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Vertical Alignment of label.
       *
       * @zh
       * 文本内容的垂直对齐方式。
       */

    }, {
      key: "verticalAlign",
      get: function get() {
        return this._verticalAlign;
      },
      set: function set(value) {
        if (this._verticalAlign === value) {
          return;
        }

        this._verticalAlign = value;
        this.updateRenderData();
      }
      /**
       * @en
       * The actual rendering font size in shrink mode.
       *
       * @zh
       * SHRINK 模式下面文本实际渲染的字体大小。
       */

    }, {
      key: "actualFontSize",
      get: function get() {
        return this._actualFontSize;
      },
      set: function set(value) {
        this._actualFontSize = value;
      }
      /**
       * @en
       * Font size of label.
       *
       * @zh
       * 文本字体大小。
       */

    }, {
      key: "fontSize",
      get: function get() {
        return this._fontSize;
      },
      set: function set(value) {
        if (this._fontSize === value) {
          return;
        }

        this._fontSize = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Font family of label, only take effect when useSystemFont property is true.
       *
       * @zh
       * 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
       */

    }, {
      key: "fontFamily",
      get: function get() {
        return this._fontFamily;
      },
      set: function set(value) {
        if (this._fontFamily === value) {
          return;
        }

        this._fontFamily = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Line Height of label.
       *
       * @zh
       * 文本行高。
       */

    }, {
      key: "lineHeight",
      get: function get() {
        return this._lineHeight;
      },
      set: function set(value) {
        if (this._lineHeight === value) {
          return;
        }

        this._lineHeight = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Overflow of label.
       *
       * @zh
       * 文字显示超出范围时的处理方式。
       */

    }, {
      key: "overflow",
      get: function get() {
        return this._overflow;
      },
      set: function set(value) {
        if (this._overflow === value) {
          return;
        }

        this._overflow = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Whether auto wrap label when string width is large than label width.
       *
       * @zh
       * 是否自动换行。
       */

    }, {
      key: "enableWrapText",
      get: function get() {
        return this._enableWrapText;
      },
      set: function set(value) {
        if (this._enableWrapText === value) {
          return;
        }

        this._enableWrapText = value;
        this.updateRenderData();
      }
      /**
       * @en
       * The font of label.
       *
       * @zh
       * 文本字体。
       */

    }, {
      key: "font",
      get: function get() {
        // return this._N$file;
        return this._font;
      },
      set: function set(value) {
        if (this._font === value) {
          return;
        } // if delete the font, we should change isSystemFontUsed to true


        this._isSystemFontUsed = !value;

        if (_defaultConstants.EDITOR && value) {
          this._userDefinedFont = value;
        } // this._N$file = value;


        this._font = value; // if (value && this._isSystemFontUsed)
        //     this._isSystemFontUsed = false;

        if (typeof value === 'string') {
          (0, _debug.warnID)(4000);
        }

        if (this._renderData) {
          this.destroyRenderData();
          this._renderData = null;
        }

        this._fontAtlas = null;
        this.updateRenderData(true);
      }
      /**
       * @en
       * Whether use system font name or not.
       *
       * @zh
       * 是否使用系统字体。
       */

    }, {
      key: "useSystemFont",
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) {
          return;
        }

        this.destroyRenderData();
        this._renderData = null;

        if (_defaultConstants.EDITOR) {
          if (!value && this._isSystemFontUsed && this._userDefinedFont) {
            this.font = this._userDefinedFont;
            this.spacingX = this._spacingX;
            return;
          }
        }

        this._isSystemFontUsed = !!value;

        if (value) {
          this.font = null;

          this._flushAssembler();

          this.updateRenderData();
        } // else if (!this._userDefinedFont) {
        //     this.disableRender();
        // }

      }
      /**
       * @en
       * The cache mode of label. This mode only supports system fonts.
       *
       * @zh
       * 文本缓存模式, 该模式只支持系统字体。
       */

    }, {
      key: "cacheMode",
      get: function get() {
        return this._cacheMode;
      },
      set: function set(value) {
        if (this._cacheMode === value) {
          return;
        } // if (this._cacheMode === CacheMode.BITMAP && !(this._font instanceof BitmapFont) && this._frame) {
        //     this._frame._resetDynamicAtlasFrame();
        // }


        if (this._cacheMode === CacheMode.CHAR) {
          this._ttfSpriteFrame = null;
        }

        this._cacheMode = value;
        this.updateRenderData(true);
      }
    }, {
      key: "spriteFrame",
      get: function get() {
        return this._texture;
      }
      /**
       * @en
       * Whether the font is bold.
       *
       * @zh
       * 字体是否加粗。
       */

    }, {
      key: "isBold",
      get: function get() {
        return this._isBold;
      },
      set: function set(value) {
        if (this._isBold === value) {
          return;
        }

        this._isBold = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Whether the font is italic.
       *
       * @zh
       * 字体是否倾斜。
       */

    }, {
      key: "isItalic",
      get: function get() {
        return this._isItalic;
      },
      set: function set(value) {
        if (this._isItalic === value) {
          return;
        }

        this._isItalic = value;
        this.updateRenderData();
      }
      /**
       * @en
       * Whether the font is underline.
       *
       * @zh
       * 字体是否加下划线。
       */

    }, {
      key: "isUnderline",
      get: function get() {
        return this._isUnderline;
      },
      set: function set(value) {
        if (this._isUnderline === value) {
          return;
        }

        this._isUnderline = value;
        this.updateRenderData();
      }
    }, {
      key: "sharedMaterials",
      get: function get() {
        return _get(_getPrototypeOf(Label.prototype), "sharedMaterials", this);
      },
      set: function set(val) {
        _set(_getPrototypeOf(Label.prototype), "sharedMaterials", val, this, true);
      }
    }, {
      key: "assemblerData",
      get: function get() {
        return this._assemblerData;
      }
    }, {
      key: "fontAtlas",
      get: function get() {
        return this._fontAtlas;
      },
      set: function set(value) {
        this._fontAtlas = value;
      }
    }, {
      key: "spacingX",
      get: function get() {
        return this._spacingX;
      },
      set: function set(value) {
        if (this._spacingX === value) {
          return;
        }

        this._spacingX = value;
        this.updateRenderData();
      }
    }, {
      key: "_bmFontOriginalSize",
      get: function get() {
        if (this._font instanceof _index.BitmapFont) {
          return this._font.fontSize;
        } else {
          return -1;
        }
      }
    }]);

    function Label() {
      var _this;

      _classCallCheck(this, Label);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Label).call(this));

      _initializerDefineProperty(_this, "_useOriginalSize", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_string", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_horizontalAlign", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_verticalAlign", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_actualFontSize", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fontSize", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fontFamily", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_lineHeight", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_overflow", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_enableWrapText", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_font", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isSystemFontUsed", _descriptor12, _assertThisInitialized(_this));

      _this._spacingX = 0;

      _initializerDefineProperty(_this, "_isItalic", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isBold", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isUnderline", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_cacheMode", _descriptor16, _assertThisInitialized(_this));

      _this._N$file = null;
      _this._texture = null;
      _this._ttfSpriteFrame = null;
      _this._userDefinedFont = null;
      _this._assemblerData = null;
      _this._fontAtlas = null;
      _this._letterTexture = null;

      if (_defaultConstants.EDITOR) {
        _this._userDefinedFont = null;
      }

      _this._ttfSpriteFrame = null;
      return _this;
    }

    _createClass(Label, [{
      key: "onEnable",
      value: function onEnable() {
        _get(_getPrototypeOf(Label.prototype), "onEnable", this).call(this); // TODO: Hack for barbarians


        if (!this._font && !this._isSystemFontUsed) {
          this.useSystemFont = true;
        } // Reapply default font family if necessary


        if (this._isSystemFontUsed && !this._fontFamily) {
          this.fontFamily = 'Arial';
        }

        this.updateRenderData(true);
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _get(_getPrototypeOf(Label.prototype), "onDisable", this).call(this);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._assembler && this._assembler.resetAssemblerData) {
          this._assembler.resetAssemblerData(this._assemblerData);
        }

        this._assemblerData = null;

        if (this._ttfSpriteFrame) {
          var tex = this._ttfSpriteFrame.texture;

          if (tex) {
            var tex2d = tex;

            if (tex2d.image) {
              tex2d.image.destroy();
            }

            tex.destroy();
          }

          this._ttfSpriteFrame = null;
        } // texture cannot be destroyed in here, lettertexture image source is public.


        this._letterTexture = null;

        _get(_getPrototypeOf(Label.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "updateRenderData",
      value: function updateRenderData() {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.markForUpdateRenderData();

        if (force) {
          this._flushAssembler();

          this._applyFontTexture();
        }
      }
    }, {
      key: "_render",
      value: function _render(render) {
        render.commitComp(this, this._texture.getGFXTexture(), this._assembler, this._texture.getGFXSampler());
      }
    }, {
      key: "_updateColor",
      value: function _updateColor() {
        if (this._font instanceof _index.BitmapFont) {
          _get(_getPrototypeOf(Label.prototype), "_updateColor", this).call(this);
        } else {
          this.updateRenderData(false);
        }
      }
    }, {
      key: "_canRender",
      value: function _canRender() {
        if (!_get(_getPrototypeOf(Label.prototype), "_canRender", this).call(this) || !this._string) {
          return false;
        }

        var font = this._font;

        if (font && font instanceof _index.BitmapFont) {
          var spriteFrame = font.spriteFrame; // cannot be activated if texture not loaded yet

          if (!spriteFrame || !spriteFrame.textureLoaded()) {
            return false;
          }
        }

        return true;
      }
    }, {
      key: "_flushAssembler",
      value: function _flushAssembler() {
        var assembler = Label.Assembler.getAssembler(this);

        if (this._assembler !== assembler) {
          this.destroyRenderData();
          this._assembler = assembler;
        }

        if (!this._renderData) {
          if (this._assembler && this._assembler.createData) {
            this._renderData = this._assembler.createData(this);
            this._renderData.material = this.material;
          }
        }
      }
    }, {
      key: "_applyFontTexture",
      value: function _applyFontTexture() {
        var _this2 = this;

        var font = this._font;

        if (font instanceof _index.BitmapFont) {
          var spriteFrame = font.spriteFrame;

          var onBMFontTextureLoaded = function onBMFontTextureLoaded() {
            // TODO: old texture in material have been released by loader
            _this2._texture = spriteFrame;

            if (_this2._assembler) {
              _this2._assembler.updateRenderData(_this2);
            }
          }; // cannot be activated if texture not loaded yet


          if (spriteFrame) {
            if (spriteFrame.loaded || spriteFrame.textureLoaded) {
              onBMFontTextureLoaded();
            } else {
              spriteFrame.once('load', onBMFontTextureLoaded, this);
            }
          }
        } else {
          if (this.cacheMode === CacheMode.CHAR) {
            this._letterTexture = this._assembler.getAssemblerData();
            this._texture = this._letterTexture;
          } else if (!this._ttfSpriteFrame) {
            this._ttfSpriteFrame = new _index.SpriteFrame();
            this._assemblerData = this._assembler.getAssemblerData();
            var image = new _index.ImageAsset(this._assemblerData.canvas);
            var tex = image._texture;
            this._ttfSpriteFrame.texture = tex;
          }

          if (this.cacheMode !== CacheMode.CHAR) {
            // this._frame._refreshTexture(this._texture);
            this._texture = this._ttfSpriteFrame;
          }

          if (this._assembler) {
            this._assembler.updateRenderData(this);
          }
        }
      }
    }]);

    return Label;
  }(_uiRenderable.UIRenderable), _class3.HorizontalAlign = HorizontalTextAlignment, _class3.VerticalAlign = VerticalTextAlignment, _class3.Overflow = Overflow, _class3.CacheMode = CacheMode, _class3._canvasPool = new _fontUtils.CanvasPool(), _temp), (_applyDecoratedDescriptor(_class2.prototype, "string", [_dec5, _dec6, _index2.multiline], Object.getOwnPropertyDescriptor(_class2.prototype, "string"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "horizontalAlign", [_dec7, _dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "horizontalAlign"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "verticalAlign", [_dec10, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "verticalAlign"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fontSize", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "fontSize"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fontFamily", [_dec15, _dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "fontFamily"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "lineHeight", [_dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "lineHeight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "overflow", [_dec19, _dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "overflow"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "enableWrapText", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "enableWrapText"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "font", [_dec24, _dec25, _dec26], Object.getOwnPropertyDescriptor(_class2.prototype, "font"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "useSystemFont", [_dec27, _dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "useSystemFont"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cacheMode", [_dec29, _dec30, _dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "cacheMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isBold", [_dec32, _dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "isBold"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isItalic", [_dec34, _dec35], Object.getOwnPropertyDescriptor(_class2.prototype, "isItalic"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isUnderline", [_dec36, _dec37], Object.getOwnPropertyDescriptor(_class2.prototype, "isUnderline"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "sharedMaterials", [_dec38, _index2.override, _dec39, _dec40], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterials"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_useOriginalSize", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_string", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 'label';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_horizontalAlign", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return HorizontalTextAlignment.CENTER;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_verticalAlign", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return VerticalTextAlignment.CENTER;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_actualFontSize", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_fontSize", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 40;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_fontFamily", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 'Arial';
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_lineHeight", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 40;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_overflow", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Overflow.NONE;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_enableWrapText", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_font", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_isSystemFontUsed", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_isItalic", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_isBold", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_isUnderline", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "_cacheMode", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return CacheMode.NONE;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.Label = Label;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvbGFiZWwudHMiXSwibmFtZXMiOlsiSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQiLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJPdmVyZmxvdyIsIkNhY2hlTW9kZSIsIkxhYmVsIiwiRm9udCIsIk1hdGVyaWFsIiwiX3N0cmluZyIsInZhbHVlIiwidXBkYXRlUmVuZGVyRGF0YSIsIl9ob3Jpem9udGFsQWxpZ24iLCJfdmVydGljYWxBbGlnbiIsIl9hY3R1YWxGb250U2l6ZSIsIl9mb250U2l6ZSIsIl9mb250RmFtaWx5IiwiX2xpbmVIZWlnaHQiLCJfb3ZlcmZsb3ciLCJfZW5hYmxlV3JhcFRleHQiLCJfZm9udCIsIl9pc1N5c3RlbUZvbnRVc2VkIiwiRURJVE9SIiwiX3VzZXJEZWZpbmVkRm9udCIsIl9yZW5kZXJEYXRhIiwiZGVzdHJveVJlbmRlckRhdGEiLCJfZm9udEF0bGFzIiwiZm9udCIsInNwYWNpbmdYIiwiX3NwYWNpbmdYIiwiX2ZsdXNoQXNzZW1ibGVyIiwiX2NhY2hlTW9kZSIsIkNIQVIiLCJfdHRmU3ByaXRlRnJhbWUiLCJfdGV4dHVyZSIsIl9pc0JvbGQiLCJfaXNJdGFsaWMiLCJfaXNVbmRlcmxpbmUiLCJ2YWwiLCJfYXNzZW1ibGVyRGF0YSIsIkJpdG1hcEZvbnQiLCJmb250U2l6ZSIsIl9OJGZpbGUiLCJfbGV0dGVyVGV4dHVyZSIsInVzZVN5c3RlbUZvbnQiLCJmb250RmFtaWx5IiwiX2Fzc2VtYmxlciIsInJlc2V0QXNzZW1ibGVyRGF0YSIsInRleCIsInRleHR1cmUiLCJ0ZXgyZCIsImltYWdlIiwiZGVzdHJveSIsImZvcmNlIiwibWFya0ZvclVwZGF0ZVJlbmRlckRhdGEiLCJfYXBwbHlGb250VGV4dHVyZSIsInJlbmRlciIsImNvbW1pdENvbXAiLCJnZXRHRlhUZXh0dXJlIiwiZ2V0R0ZYU2FtcGxlciIsInNwcml0ZUZyYW1lIiwidGV4dHVyZUxvYWRlZCIsImFzc2VtYmxlciIsIkFzc2VtYmxlciIsImdldEFzc2VtYmxlciIsImNyZWF0ZURhdGEiLCJtYXRlcmlhbCIsIm9uQk1Gb250VGV4dHVyZUxvYWRlZCIsImxvYWRlZCIsIm9uY2UiLCJjYWNoZU1vZGUiLCJnZXRBc3NlbWJsZXJEYXRhIiwiU3ByaXRlRnJhbWUiLCJJbWFnZUFzc2V0IiwiY2FudmFzIiwiVUlSZW5kZXJhYmxlIiwiSG9yaXpvbnRhbEFsaWduIiwiVmVydGljYWxBbGlnbiIsIl9jYW52YXNQb29sIiwiQ2FudmFzUG9vbCIsIm11bHRpbGluZSIsIm92ZXJyaWRlIiwic2VyaWFsaXphYmxlIiwiQ0VOVEVSIiwiTk9ORSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ0E7Ozs7O01BS1lBLHVCOzs7YUFBQUEsdUI7QUFBQUEsSUFBQUEsdUIsQ0FBQUEsdUI7QUFBQUEsSUFBQUEsdUIsQ0FBQUEsdUI7QUFBQUEsSUFBQUEsdUIsQ0FBQUEsdUI7S0FBQUEsdUIsd0NBQUFBLHVCOztBQXFCWixvQkFBT0EsdUJBQVA7QUFFQTs7Ozs7O01BS1lDLHFCOzs7YUFBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7S0FBQUEscUIsc0NBQUFBLHFCOztBQXFCWixvQkFBT0EscUJBQVA7QUFFQTs7Ozs7O01BS1lDLFE7OzthQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtBQUFBQSxJQUFBQSxRLENBQUFBLFE7QUFBQUEsSUFBQUEsUSxDQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtLQUFBQSxRLHlCQUFBQSxROztBQTRCWixvQkFBT0EsUUFBUDtBQUVBOzs7Ozs7TUFLWUMsUzs7O2FBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFB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VUFBTCxDQUFpQm5DLGdCQUFqQixDQUFrQyxJQUFsQztBQUNIO0FBQ0o7QUFDSjs7OztJQS9tQnNCZ0UsMEIsV0EyYVRDLGUsR0FBa0IxRSx1QixVQUNsQjJFLGEsR0FBZ0IxRSxxQixVQUNoQkMsUSxHQUFXQSxRLFVBQ1hDLFMsR0FBWUEsUyxVQUNaeUUsVyxHQUFjLElBQUlDLHFCQUFKLEUsaUZBcmEzQkMsaUIsd3dFQW9YQUMsZ0IsOExBbURBQyxvQjs7Ozs7YUFDNEIsSTs7OEVBQzVCQSxvQjs7Ozs7YUFDbUIsTzs7dUZBQ25CQSxvQjs7Ozs7YUFDNEJoRix1QkFBdUIsQ0FBQ2lGLE07O3FGQUNwREQsb0I7Ozs7O2FBQzBCL0UscUJBQXFCLENBQUNnRixNOztzRkFDaERELG9COzs7OzthQUMyQixDOztnRkFDM0JBLG9COzs7OzthQUNxQixFOztrRkFDckJBLG9COzs7OzthQUN1QixPOztrRkFDdkJBLG9COzs7OzthQUN1QixFOztnRkFDdkJBLG9COzs7OzthQUMrQjlFLFFBQVEsQ0FBQ2dGLEk7O3VGQUN4Q0Ysb0I7Ozs7O2FBQzJCLEk7OzZFQUMzQkEsb0I7Ozs7O2FBQzhCLEk7O3lGQUM5QkEsb0I7Ozs7O2FBQzZCLEk7O2lGQUU3QkEsb0I7Ozs7O2FBQ3FCLEs7OytFQUNyQkEsb0I7Ozs7O2FBQ21CLEs7O29GQUNuQkEsb0I7Ozs7O2FBQ3dCLEs7O2tGQUN4QkEsb0I7Ozs7O2FBQ3NCN0UsU0FBUyxDQUFDK0UsSSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBCaXRtYXBGb250LCBGb250LCBJbWFnZUFzc2V0LCBTcHJpdGVGcmFtZSwgVGV4dHVyZTJELCBNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2NvcmUvYXNzZXRzJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdmlzaWJsZSwgZGlzcGxheU5hbWUsIG11bHRpbGluZSwgdHlwZSwgcmVhZE9ubHksIG92ZXJyaWRlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBjY2VudW0gfSBmcm9tICcuLi8uLi9jb3JlL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5pbXBvcnQgeyBVSSB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvdWknO1xyXG5pbXBvcnQgeyBGb250QXRsYXMgfSBmcm9tICcuLi9hc3NlbWJsZXIvbGFiZWwvYm1mb250VXRpbHMnO1xyXG5pbXBvcnQgeyBDYW52YXNQb29sLCBJU2hhcmVkTGFiZWxEYXRhIH0gZnJvbSAnLi4vYXNzZW1ibGVyL2xhYmVsL2ZvbnQtdXRpbHMnO1xyXG5pbXBvcnQgeyBMZXR0ZXJSZW5kZXJUZXh0dXJlIH0gZnJvbSAnLi4vYXNzZW1ibGVyL2xhYmVsL2xldHRlci1mb250JztcclxuaW1wb3J0IHsgVUlSZW5kZXJhYmxlIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UvdWktcmVuZGVyYWJsZSc7XHJcbmltcG9ydCB7IHdhcm5JRCB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBzeXMgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtL3N5cyc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuIEVudW0gZm9yIGhvcml6b250YWwgdGV4dCBhbGlnbm1lbnQuXHJcbiAqXHJcbiAqIEB6aCDmlofmnKzmqKrlkJHlr7npvZDnsbvlnovjgIJcclxuICovXHJcbmV4cG9ydCBlbnVtIEhvcml6b250YWxUZXh0QWxpZ25tZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFsaWdubWVudCBsZWZ0IGZvciB0ZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aCDlt6blr7npvZDjgIJcclxuICAgICAqL1xyXG4gICAgTEVGVCA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBbGlnbm1lbnQgY2VudGVyIGZvciB0ZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aCDkuK3lv4Plr7npvZDjgIJcclxuICAgICAqL1xyXG4gICAgQ0VOVEVSID0gMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFsaWdubWVudCByaWdodCBmb3IgdGV4dC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5Y+z5a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIFJJR0hUID0gMixcclxufVxyXG5cclxuY2NlbnVtKEhvcml6b250YWxUZXh0QWxpZ25tZW50KTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgdmVydGljYWwgdGV4dCBhbGlnbm1lbnQuXHJcbiAqXHJcbiAqIEB6aCDmlofmnKzlnoLnm7Tlr7npvZDnsbvlnovjgIJcclxuICovXHJcbmV4cG9ydCBlbnVtIFZlcnRpY2FsVGV4dEFsaWdubWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBbGlnbm1lbnQgdG9wIGZvciB0ZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aCDkuIrlr7npvZDjgIJcclxuICAgICAqL1xyXG4gICAgVE9QID0gMCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFsaWdubWVudCBjZW50ZXIgZm9yIHRleHQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOS4reW/g+Wvuem9kOOAglxyXG4gICAgICovXHJcbiAgICBDRU5URVIgPSAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxpZ25tZW50IGJvdHRvbSBmb3IgdGV4dC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5LiL5a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIEJPVFRPTSA9IDIsXHJcbn1cclxuXHJcbmNjZW51bShWZXJ0aWNhbFRleHRBbGlnbm1lbnQpO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBPdmVyZmxvdy5cclxuICpcclxuICogQHpoIOaWh+acrOi2hei9veexu+Wei+OAglxyXG4gKi9cclxuZXhwb3J0IGVudW0gT3ZlcmZsb3cge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTm9uZS5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5LiN5YGa5Lu75L2V6ZmQ5Yi244CCXHJcbiAgICAgKi9cclxuICAgIE5PTkUgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW4gQ0xBTVAgbW9kZSwgd2hlbiBsYWJlbCBjb250ZW50IGdvZXMgb3V0IG9mIHRoZSBib3VuZGluZyBib3gsIGl0IHdpbGwgYmUgY2xpcHBlZC5cclxuICAgICAqXHJcbiAgICAgKiBAemggQ0xBTVAg5qih5byP5Lit77yM5b2T5paH5pys5YaF5a656LaF5Ye66L6555WM5qGG5pe277yM5aSa5L2Z55qE5Lya6KKr5oiq5pat44CCXHJcbiAgICAgKi9cclxuICAgIENMQU1QID0gMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEluIFNIUklOSyBtb2RlLCB0aGUgZm9udCBzaXplIHdpbGwgY2hhbmdlIGR5bmFtaWNhbGx5IHRvIGFkYXB0IHRoZSBjb250ZW50IHNpemUuXHJcbiAgICAgKiBUaGlzIG1vZGUgbWF5IHRha2VzIHVwIG1vcmUgQ1BVIHJlc291cmNlcyB3aGVuIHRoZSBsYWJlbCBpcyByZWZyZXNoZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIFNIUklOSyDmqKHlvI/vvIzlrZfkvZPlpKflsI/kvJrliqjmgIHlj5jljJbvvIzku6XpgILlupTlhoXlrrnlpKflsI/jgILov5nkuKrmqKHlvI/lnKjmlofmnKzliLfmlrDnmoTml7blgJnlj6/og73kvJrljaDnlKjovoPlpJogQ1BVIOi1hOa6kOOAglxyXG4gICAgICovXHJcbiAgICBTSFJJTksgPSAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW4gUkVTSVpFX0hFSUdIVCBtb2RlLCB5b3UgY2FuIG9ubHkgY2hhbmdlIHRoZSB3aWR0aCBvZiBsYWJlbCBhbmQgdGhlIGhlaWdodCBpcyBjaGFuZ2VkIGF1dG9tYXRpY2FsbHkuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOWcqCBSRVNJWkVfSEVJR0hUIOaooeW8j+S4i++8jOWPquiDveabtOaUueaWh+acrOeahOWuveW6pu+8jOmrmOW6puaYr+iHquWKqOaUueWPmOeahOOAglxyXG4gICAgICovXHJcbiAgICBSRVNJWkVfSEVJR0hUID0gMyxcclxufVxyXG5cclxuY2NlbnVtKE92ZXJmbG93KTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgY2FjaGUgbW9kZS5cclxuICpcclxuICogQHpoIOaWh+acrOWbvumbhue8k+WtmOexu+Wei+OAglxyXG4gKi9cclxuZXhwb3J0IGVudW0gQ2FjaGVNb2RlIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIERvIG5vdCBkbyBhbnkgY2FjaGluZy5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5LiN5YGa5Lu75L2V57yT5a2Y44CCXHJcbiAgICAgKi9cclxuICAgIE5PTkUgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW4gQklUTUFQIG1vZGUsIGNhY2hlIHRoZSBsYWJlbCBhcyBhIHN0YXRpYyBpbWFnZSBhbmQgYWRkIGl0IHRvIHRoZSBkeW5hbWljIGF0bGFzIGZvciBiYXRjaCByZW5kZXJpbmcsXHJcbiAgICAgKiBhbmQgY2FuIGJhdGNoaW5nIHdpdGggU3ByaXRlcyB1c2luZyBicm9rZW4gaW1hZ2VzLlxyXG4gICAgICpcclxuICAgICAqIEB6aCBCSVRNQVAg5qih5byP77yM5bCGIGxhYmVsIOe8k+WtmOaIkOmdmeaAgeWbvuWDj+W5tuWKoOWFpeWIsOWKqOaAgeWbvumbhu+8jOS7peS+v+i/m+ihjOaJueasoeWQiOW5tu+8jOWPr+S4juS9v+eUqOeijuWbvueahCBTcHJpdGUg6L+b6KGM5ZCI5om544CCXHJcbiAgICAgKiDvvIjms6jvvJrliqjmgIHlm77pm4blnKggQ2hyb21lIOS7peWPiuW+ruS/oeWwj+a4uOaIj+aaguaXtuWFs+mXre+8jOivpeWKn+iDveaXoOaViO+8ieOAglxyXG4gICAgICovXHJcbiAgICBCSVRNQVAgPSAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW4gQ0hBUiBtb2RlLCBzcGxpdCB0ZXh0IGludG8gY2hhcmFjdGVycyBhbmQgY2FjaGUgY2hhcmFjdGVycyBpbnRvIGEgZHluYW1pYyBhdGxhcyB3aGljaCB0aGUgc2l6ZSBvZiAxMDI0ICogMTAyNC5cclxuICAgICAqXHJcbiAgICAgKiBAemggQ0hBUiDmqKHlvI/vvIzlsIbmlofmnKzmi4bliIbkuLrlrZfnrKbvvIzlubblsIblrZfnrKbnvJPlrZjliLDkuIDlvKDljZXni6znmoTlpKflsI/kuLogMTAyNCAqIDEwMjQg55qE5Zu+6ZuG5Lit6L+b6KGM6YeN5aSN5L2/55So77yM5LiN5YaN5L2/55So5Yqo5oCB5Zu+6ZuG44CCXHJcbiAgICAgKiDvvIjms6jvvJrlvZPlm77pm4bmu6Hml7blsIbkuI3lho3ov5vooYznvJPlrZjvvIzmmoLml7bkuI3mlK/mjIEgU0hSSU5LIOiHqumAguW6lOaWh+acrOWwuuWvuO+8iOWQjue7reWujOWWhO+8ie+8ieOAglxyXG4gICAgICovXHJcbiAgICBDSEFSID0gMixcclxufVxyXG5cclxuY2NlbnVtKENhY2hlTW9kZSk7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIFR5cGUg57G75Z6L44CCXHJcbiAqL1xyXG4vKipcclxuICogQHpoXHJcbiAqIFRURuWtl+S9k+OAglxyXG4gKi9cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDkvY3lm77lrZfkvZPjgIJcclxuICovXHJcbi8qKlxyXG4gKiBAemhcclxuICog57O757uf5a2X5L2T44CCXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgTGFiZWwgQ29tcG9uZW50LlxyXG4gKlxyXG4gKiBAemhcclxuICog5paH5a2X5qCH562+57uE5Lu244CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuTGFiZWwnKVxyXG5AaGVscCgnaTE4bjpjYy5MYWJlbCcpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9SZW5kZXIvTGFiZWwnKVxyXG5leHBvcnQgY2xhc3MgTGFiZWwgZXh0ZW5kcyBVSVJlbmRlcmFibGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbnRlbnQgc3RyaW5nIG9mIGxhYmVsLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5qCH562+5pi+56S655qE5paH5pys5YaF5a6544CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoNClcclxuICAgIEB0b29sdGlwKCdMYWJlbCDmmL7npLrnmoTmlofmnKzlhoXlrrnlrZfnrKbkuLInKVxyXG4gICAgQG11bHRpbGluZVxyXG4gICAgZ2V0IHN0cmluZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmluZztcclxuICAgIH1cclxuICAgIHNldCBzdHJpbmcgKHZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSArICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdHJpbmcgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3N0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBIb3Jpem9udGFsIEFsaWdubWVudCBvZiBsYWJlbC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaWh+acrOWGheWuueeahOawtOW5s+Wvuem9kOaWueW8j+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShIb3Jpem9udGFsVGV4dEFsaWdubWVudClcclxuICAgIEBkaXNwbGF5T3JkZXIoNSlcclxuICAgIEB0b29sdGlwKCfmloflrZfmsLTlubPlr7npvZDmqKHlvI8nKVxyXG4gICAgZ2V0IGhvcml6b250YWxBbGlnbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hvcml6b250YWxBbGlnbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaG9yaXpvbnRhbEFsaWduICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ob3Jpem9udGFsQWxpZ24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2hvcml6b250YWxBbGlnbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBWZXJ0aWNhbCBBbGlnbm1lbnQgb2YgbGFiZWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmlofmnKzlhoXlrrnnmoTlnoLnm7Tlr7npvZDmlrnlvI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVmVydGljYWxUZXh0QWxpZ25tZW50KVxyXG4gICAgQGRpc3BsYXlPcmRlcig2KVxyXG4gICAgQHRvb2x0aXAoJ+aWh+Wtl+WeguebtOWvuem9kOaooeW8jycpXHJcbiAgICBnZXQgdmVydGljYWxBbGlnbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsQWxpZ247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZlcnRpY2FsQWxpZ24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZlcnRpY2FsQWxpZ24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZlcnRpY2FsQWxpZ24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGFjdHVhbCByZW5kZXJpbmcgZm9udCBzaXplIGluIHNocmluayBtb2RlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICogU0hSSU5LIOaooeW8j+S4i+mdouaWh+acrOWunumZhea4suafk+eahOWtl+S9k+Wkp+Wwj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgYWN0dWFsRm9udFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hY3R1YWxGb250U2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYWN0dWFsRm9udFNpemUgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fYWN0dWFsRm9udFNpemUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRm9udCBzaXplIG9mIGxhYmVsLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5paH5pys5a2X5L2T5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoNylcclxuICAgIEB0b29sdGlwKCfmloflrZflsLrlr7jvvIzku6UgcG9pbnQg5Li65Y2V5L2NJylcclxuICAgIGdldCBmb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb250U2l6ZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fZm9udFNpemUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEZvbnQgZmFtaWx5IG9mIGxhYmVsLCBvbmx5IHRha2UgZWZmZWN0IHdoZW4gdXNlU3lzdGVtRm9udCBwcm9wZXJ0eSBpcyB0cnVlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5paH5pys5a2X5L2T5ZCN56ewLCDlj6rlnKggdXNlU3lzdGVtRm9udCDlsZ7mgKfkuLogdHJ1ZSDnmoTml7blgJnnlJ/mlYjjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcig4KVxyXG4gICAgQHRvb2x0aXAoJ+aWh+Wtl+Wtl+S9k+WQjeWtlycpXHJcbiAgICBnZXQgZm9udEZhbWlseSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvbnRGYW1pbHkgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZvbnRGYW1pbHkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTGluZSBIZWlnaHQgb2YgbGFiZWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmlofmnKzooYzpq5jjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcig4KVxyXG4gICAgQHRvb2x0aXAoJ+aWh+Wtl+ihjOmrmO+8jOS7pSBwb2ludCDkuLrljZXkvY0nKVxyXG4gICAgZ2V0IGxpbmVIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saW5lSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2V0IGxpbmVIZWlnaHQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpbmVIZWlnaHQgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2xpbmVIZWlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogT3ZlcmZsb3cgb2YgbGFiZWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmloflrZfmmL7npLrotoXlh7rojIPlm7Tml7bnmoTlpITnkIbmlrnlvI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoT3ZlcmZsb3cpXHJcbiAgICBAZGlzcGxheU9yZGVyKDkpXHJcbiAgICBAdG9vbHRpcCgn5paH5a2X5o6S54mI5qih5byP77yM5YyF5ous5Lul5LiL5LiJ56eN77yaXFxuIDEuIENMQU1QOiDoioLngrnnuqbmnZ/moYbkuYvlpJbnmoTmloflrZfkvJrooqvmiKrmlq0gXFxuIDIuIFNIUklOSzog6Ieq5Yqo5qC55o2u6IqC54K557qm5p2f5qGG57yp5bCP5paH5a2XXFxuIDMuIFJFU0laRV9IRUlHSFQ6IOagueaNruaWh+acrOWGheWuueiHquWKqOabtOaWsOiKgueCueeahCBoZWlnaHQg5bGe5oCnLicpXHJcbiAgICBnZXQgb3ZlcmZsb3cgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVyZmxvdztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb3ZlcmZsb3cgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX292ZXJmbG93ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9vdmVyZmxvdyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIGF1dG8gd3JhcCBsYWJlbCB3aGVuIHN0cmluZyB3aWR0aCBpcyBsYXJnZSB0aGFuIGxhYmVsIHdpZHRoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm6Ieq5Yqo5o2i6KGM44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMTApXHJcbiAgICBAdG9vbHRpcCgn6Ieq5Yqo5o2i6KGMJylcclxuICAgIGdldCBlbmFibGVXcmFwVGV4dCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZVdyYXBUZXh0O1xyXG4gICAgfVxyXG4gICAgc2V0IGVuYWJsZVdyYXBUZXh0ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVXcmFwVGV4dCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZW5hYmxlV3JhcFRleHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGZvbnQgb2YgbGFiZWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmlofmnKzlrZfkvZPjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRm9udClcclxuICAgIEBkaXNwbGF5T3JkZXIoMTEpXHJcbiAgICBAdG9vbHRpcCgnTGFiZWwg5L2/55So55qE5a2X5L2T6LWE5rqQJylcclxuICAgIGdldCBmb250ICgpIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5fTiRmaWxlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb250ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9mb250ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiBkZWxldGUgdGhlIGZvbnQsIHdlIHNob3VsZCBjaGFuZ2UgaXNTeXN0ZW1Gb250VXNlZCB0byB0cnVlXHJcbiAgICAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9ICF2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91c2VyRGVmaW5lZEZvbnQgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMuX04kZmlsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAvLyBpZiAodmFsdWUgJiYgdGhpcy5faXNTeXN0ZW1Gb250VXNlZClcclxuICAgICAgICAvLyAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB3YXJuSUQoNDAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGEgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZm9udEF0bGFzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJlbmRlckRhdGEodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdXNlIHN5c3RlbSBmb250IG5hbWUgb3Igbm90LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5L2/55So57O757uf5a2X5L2T44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMTIpXHJcbiAgICBAdG9vbHRpcCgn5piv5ZCm5L2/55So57O757uf6buY6K6k5a2X5L2TJylcclxuICAgIGdldCB1c2VTeXN0ZW1Gb250ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTeXN0ZW1Gb250VXNlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdXNlU3lzdGVtRm9udCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZXN0cm95UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUgJiYgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCAmJiB0aGlzLl91c2VyRGVmaW5lZEZvbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udCA9IHRoaXMuX3VzZXJEZWZpbmVkRm9udDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BhY2luZ1ggPSB0aGlzLl9zcGFjaW5nWDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9ICEhdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsdXNoQXNzZW1ibGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbHNlIGlmICghdGhpcy5fdXNlckRlZmluZWRGb250KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBjYWNoZSBtb2RlIG9mIGxhYmVsLiBUaGlzIG1vZGUgb25seSBzdXBwb3J0cyBzeXN0ZW0gZm9udHMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmlofmnKznvJPlrZjmqKHlvI8sIOivpeaooeW8j+WPquaUr+aMgeezu+e7n+Wtl+S9k+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDYWNoZU1vZGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDEzKVxyXG4gICAgQHRvb2x0aXAoJ+aWh+acrOe8k+WtmOaooeW8j++8jOWMheaLrOS7peS4i+S4ieenje+8mlxcbiAxLiBOT05FOiDkuI3lgZrku7vkvZXnvJPlrZjvvIzmlofmnKzlhoXlrrnov5vooYzkuIDmrKHnu5jliLYgXFxuIDIuIEJJVE1BUDog5bCG5paH5pys5L2c5Li66Z2Z5oCB5Zu+5YOP5Yqg5YWl5Yqo5oCB5Zu+6ZuG6L+b6KGM5om55qyh5ZCI5bm277yM5L2G5piv5LiN6IO96aKR57mB5Yqo5oCB5L+u5pS55paH5pys5YaF5a65IFxcbiAzLiBDSEFSOiDlsIbmlofmnKzmi4bliIbkuLrlrZfnrKblubbkuJTmiorlrZfnrKbnurnnkIbnvJPlrZjliLDkuIDlvKDlrZfnrKblm77pm4bkuK3ov5vooYzlpI3nlKjvvIzpgILnlKjkuo7lrZfnrKblhoXlrrnph43lpI3lubbkuJTpopHnuYHmm7TmlrDnmoTmlofmnKzlhoXlrrknKVxyXG4gICAgZ2V0IGNhY2hlTW9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlTW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2FjaGVNb2RlICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZU1vZGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmICh0aGlzLl9jYWNoZU1vZGUgPT09IENhY2hlTW9kZS5CSVRNQVAgJiYgISh0aGlzLl9mb250IGluc3RhbmNlb2YgQml0bWFwRm9udCkgJiYgdGhpcy5fZnJhbWUpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5fZnJhbWUuX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUoKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZU1vZGUgPT09IENhY2hlTW9kZS5DSEFSKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3R0ZlNwcml0ZUZyYW1lID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3ByaXRlRnJhbWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBmb250IGlzIGJvbGQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlrZfkvZPmmK/lkKbliqDnspfjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxNSlcclxuICAgIEB0b29sdGlwKCflrZfkvZPliqDnspcnKVxyXG4gICAgZ2V0IGlzQm9sZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQm9sZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaXNCb2xkICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0JvbGQgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzQm9sZCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBmb250IGlzIGl0YWxpYy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWtl+S9k+aYr+WQpuWAvuaWnOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDE2KVxyXG4gICAgQHRvb2x0aXAoJ+Wtl+S9k+WAvuaWnCcpXHJcbiAgICBnZXQgaXNJdGFsaWMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0l0YWxpYztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaXNJdGFsaWMgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSXRhbGljID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0l0YWxpYyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBmb250IGlzIHVuZGVybGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWtl+S9k+aYr+WQpuWKoOS4i+WIkue6v+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDE3KVxyXG4gICAgQHRvb2x0aXAoJ+Wtl+S9k+WKoOS4i+WIkue6vycpXHJcbiAgICBnZXQgaXNVbmRlcmxpbmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VuZGVybGluZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaXNVbmRlcmxpbmUgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVW5kZXJsaW5lID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc1VuZGVybGluZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEB0eXBlKE1hdGVyaWFsKVxyXG4gICAgQG92ZXJyaWRlXHJcbiAgICBAZGlzcGxheU5hbWUoJ01hdGVyaWFscycpXHJcbiAgICBAdmlzaWJsZShmYWxzZSlcclxuICAgIGdldCBzaGFyZWRNYXRlcmlhbHMgKCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zaGFyZWRNYXRlcmlhbHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNoYXJlZE1hdGVyaWFscyAodmFsKSB7XHJcbiAgICAgICAgc3VwZXIuc2hhcmVkTWF0ZXJpYWxzID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhc3NlbWJsZXJEYXRhICgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3NlbWJsZXJEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb250QXRsYXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250QXRsYXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvbnRBdGxhcyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9mb250QXRsYXMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3BhY2luZ1ggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcGFjaW5nWDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3BhY2luZ1ggKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNpbmdYID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zcGFjaW5nWCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBfYm1Gb250T3JpZ2luYWxTaXplICgpe1xyXG4gICAgICAgIGlmICh0aGlzLl9mb250IGluc3RhbmNlb2YgQml0bWFwRm9udCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udC5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBIb3Jpem9udGFsQWxpZ24gPSBIb3Jpem9udGFsVGV4dEFsaWdubWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgVmVydGljYWxBbGlnbiA9IFZlcnRpY2FsVGV4dEFsaWdubWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgT3ZlcmZsb3cgPSBPdmVyZmxvdztcclxuICAgIHB1YmxpYyBzdGF0aWMgQ2FjaGVNb2RlID0gQ2FjaGVNb2RlO1xyXG4gICAgcHVibGljIHN0YXRpYyBfY2FudmFzUG9vbCA9IG5ldyBDYW52YXNQb29sKCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF91c2VPcmlnaW5hbFNpemUgPSB0cnVlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zdHJpbmcgPSAnbGFiZWwnO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9ob3Jpem9udGFsQWxpZ24gPSBIb3Jpem9udGFsVGV4dEFsaWdubWVudC5DRU5URVI7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3ZlcnRpY2FsQWxpZ24gPSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9hY3R1YWxGb250U2l6ZSA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvbnRTaXplID0gNDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvbnRGYW1pbHkgPSAnQXJpYWwnO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9saW5lSGVpZ2h0ID0gNDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX292ZXJmbG93OiBPdmVyZmxvdyA9IE92ZXJmbG93Lk5PTkU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2VuYWJsZVdyYXBUZXh0ID0gdHJ1ZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZm9udDogRm9udCB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pc1N5c3RlbUZvbnRVc2VkID0gdHJ1ZTtcclxuICAgIHByb3RlY3RlZCBfc3BhY2luZ1ggPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pc0l0YWxpYyA9IGZhbHNlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pc0JvbGQgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfaXNVbmRlcmxpbmUgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY2FjaGVNb2RlID0gQ2FjaGVNb2RlLk5PTkU7XHJcblxyXG4gICAgLy8gZG9uJ3QgbmVlZCBzZXJpYWxpemVcclxuICAgIC8vIOi/meS4quS/neWtmOS6huaXp+mhueebrueahCBmaWxlIOaVsOaNrlxyXG4gICAgcHJvdGVjdGVkIF9OJGZpbGU6IEZvbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfdGV4dHVyZTogU3ByaXRlRnJhbWUgfCBMZXR0ZXJSZW5kZXJUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3R0ZlNwcml0ZUZyYW1lOiBTcHJpdGVGcmFtZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF91c2VyRGVmaW5lZEZvbnQ6IEZvbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfYXNzZW1ibGVyRGF0YTogSVNoYXJlZExhYmVsRGF0YSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9mb250QXRsYXM6IEZvbnRBdGxhcyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9sZXR0ZXJUZXh0dXJlOiBMZXR0ZXJSZW5kZXJUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl91c2VyRGVmaW5lZEZvbnQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdHRmU3ByaXRlRnJhbWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25FbmFibGUoKTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFjayBmb3IgYmFyYmFyaWFuc1xyXG4gICAgICAgIGlmICghdGhpcy5fZm9udCAmJiAhdGhpcy5faXNTeXN0ZW1Gb250VXNlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVzZVN5c3RlbUZvbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZWFwcGx5IGRlZmF1bHQgZm9udCBmYW1pbHkgaWYgbmVjZXNzYXJ5XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgJiYgIXRoaXMuX2ZvbnRGYW1pbHkpIHtcclxuICAgICAgICAgICAgdGhpcy5mb250RmFtaWx5ID0gJ0FyaWFsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICBzdXBlci5vbkRpc2FibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci5yZXNldEFzc2VtYmxlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyLnJlc2V0QXNzZW1ibGVyRGF0YSh0aGlzLl9hc3NlbWJsZXJEYXRhISk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hc3NlbWJsZXJEYXRhID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5fdHRmU3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgdGV4ID0gdGhpcy5fdHRmU3ByaXRlRnJhbWUudGV4dHVyZTtcclxuICAgICAgICAgICAgaWYgKHRleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4MmQgPSB0ZXggYXMgVGV4dHVyZTJEO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleDJkLmltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4MmQuaW1hZ2UuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGV4LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90dGZTcHJpdGVGcmFtZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0ZXh0dXJlIGNhbm5vdCBiZSBkZXN0cm95ZWQgaW4gaGVyZSwgbGV0dGVydGV4dHVyZSBpbWFnZSBzb3VyY2UgaXMgcHVibGljLlxyXG4gICAgICAgIHRoaXMuX2xldHRlclRleHR1cmUgPSBudWxsO1xyXG5cclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVuZGVyRGF0YSAoZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuXHJcbiAgICAgICAgaWYgKGZvcmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsdXNoQXNzZW1ibGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5Rm9udFRleHR1cmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXIgKHJlbmRlcjogVUkpIHtcclxuICAgICAgICByZW5kZXIuY29tbWl0Q29tcCh0aGlzLCB0aGlzLl90ZXh0dXJlIS5nZXRHRlhUZXh0dXJlKCksIHRoaXMuX2Fzc2VtYmxlciEsIHRoaXMuX3RleHR1cmUhLmdldEdGWFNhbXBsZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVDb2xvciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZvbnQgaW5zdGFuY2VvZiBCaXRtYXBGb250KSB7XHJcbiAgICAgICAgICAgc3VwZXIuX3VwZGF0ZUNvbG9yKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVSZW5kZXJEYXRhKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYW5SZW5kZXIgKCkge1xyXG4gICAgICAgIGlmICghc3VwZXIuX2NhblJlbmRlcigpIHx8ICF0aGlzLl9zdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZm9udCA9IHRoaXMuX2ZvbnQ7XHJcbiAgICAgICAgaWYgKGZvbnQgJiYgZm9udCBpbnN0YW5jZW9mIEJpdG1hcEZvbnQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3ByaXRlRnJhbWUgPSBmb250LnNwcml0ZUZyYW1lO1xyXG4gICAgICAgICAgICAvLyBjYW5ub3QgYmUgYWN0aXZhdGVkIGlmIHRleHR1cmUgbm90IGxvYWRlZCB5ZXRcclxuICAgICAgICAgICAgaWYgKCFzcHJpdGVGcmFtZSB8fCAhc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZmx1c2hBc3NlbWJsZXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGFzc2VtYmxlciA9IExhYmVsLkFzc2VtYmxlciEuZ2V0QXNzZW1ibGVyKHRoaXMpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyICE9PSBhc3NlbWJsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXN0cm95UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIgPSBhc3NlbWJsZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX3JlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Fzc2VtYmxlciAmJiB0aGlzLl9hc3NlbWJsZXIuY3JlYXRlRGF0YSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gdGhpcy5fYXNzZW1ibGVyLmNyZWF0ZURhdGEodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhIS5tYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hcHBseUZvbnRUZXh0dXJlICgpIHtcclxuICAgICAgICBjb25zdCBmb250ID0gdGhpcy5fZm9udDtcclxuICAgICAgICBpZiAoZm9udCBpbnN0YW5jZW9mIEJpdG1hcEZvbnQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3ByaXRlRnJhbWUgPSBmb250LnNwcml0ZUZyYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBvbkJNRm9udFRleHR1cmVMb2FkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBvbGQgdGV4dHVyZSBpbiBtYXRlcmlhbCBoYXZlIGJlZW4gcmVsZWFzZWQgYnkgbG9hZGVyXHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0dXJlID0gc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyIS51cGRhdGVSZW5kZXJEYXRhKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBjYW5ub3QgYmUgYWN0aXZhdGVkIGlmIHRleHR1cmUgbm90IGxvYWRlZCB5ZXRcclxuICAgICAgICAgICAgaWYgKHNwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3ByaXRlRnJhbWUubG9hZGVkIHx8IHNwcml0ZUZyYW1lLnRleHR1cmVMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbkJNRm9udFRleHR1cmVMb2FkZWQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlRnJhbWUub25jZSgnbG9hZCcsIG9uQk1Gb250VGV4dHVyZUxvYWRlZCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZU1vZGUgPT09IENhY2hlTW9kZS5DSEFSKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sZXR0ZXJUZXh0dXJlID0gdGhpcy5fYXNzZW1ibGVyIS5nZXRBc3NlbWJsZXJEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0dXJlID0gdGhpcy5fbGV0dGVyVGV4dHVyZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fdHRmU3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3R0ZlNwcml0ZUZyYW1lID0gbmV3IFNwcml0ZUZyYW1lKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXJEYXRhID0gdGhpcy5fYXNzZW1ibGVyIS5nZXRBc3NlbWJsZXJEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZUFzc2V0KHRoaXMuX2Fzc2VtYmxlckRhdGEhLmNhbnZhcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXggPSBpbWFnZS5fdGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3R0ZlNwcml0ZUZyYW1lLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlTW9kZSAhPT0gQ2FjaGVNb2RlLkNIQVIpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2ZyYW1lLl9yZWZyZXNoVGV4dHVyZSh0aGlzLl90ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSB0aGlzLl90dGZTcHJpdGVGcmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Fzc2VtYmxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyIS51cGRhdGVSZW5kZXJEYXRhKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==