(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/assets/index.js", "../../../core/utils/index.js", "../../../core/utils/js.js", "../../../core/math/index.js", "../../../core/gfx/define.js", "../../components/index.js", "../../../core/assets/asset-enum.js", "../../../core/director.js", "../../../core/load-pipeline/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/assets/index.js"), require("../../../core/utils/index.js"), require("../../../core/utils/js.js"), require("../../../core/math/index.js"), require("../../../core/gfx/define.js"), require("../../components/index.js"), require("../../../core/assets/asset-enum.js"), require("../../../core/director.js"), require("../../../core/load-pipeline/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.js, global.index, global.define, global.index, global.assetEnum, global.director, global.index);
    global.letterFont = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _js, _index3, _define, _index4, _assetEnum, _director, _index5) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.letterFont = _exports.LetterAtlas = _exports.LetterRenderTexture = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  // const OUTLINE_SUPPORTED = cc.js.isChildClassOf(LabelOutline, UIComponent);
  var Overflow = _index4.Label.Overflow;

  var WHITE = _index3.Color.WHITE.clone();

  var space = 2;
  var TextAlignment = _index4.Label.HorizontalAlign;
  var VerticalTextAlignment = _index4.Label.VerticalAlign;

  var LetterInfo = function LetterInfo() {
    _classCallCheck(this, LetterInfo);

    this["char"] = '';
    this.valid = true;
    this.x = 0;
    this.y = 0;
    this.line = 0;
    this.hash = '';
  };

  var FontLetterDefinition = function FontLetterDefinition() {
    _classCallCheck(this, FontLetterDefinition);

    this.u = 0;
    this.v = 0;
    this.w = 0;
    this.h = 0;
    this.texture = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.valid = false;
    this.xAdvance = 0;
  };

  var _backgroundStyle = 'rgba(255, 255, 255, 0.005)';

  var LetterTexture = /*#__PURE__*/function () {
    function LetterTexture(_char, labelInfo) {
      _classCallCheck(this, LetterTexture);

      this.image = null;
      this.labelInfo = void 0;
      this["char"] = void 0;
      this.data = null;
      this.canvas = null;
      this.context = null;
      this.width = 0;
      this.height = 0;
      this.hash = void 0;
      this["char"] = _char;
      this.labelInfo = labelInfo;
      this.hash = _char.charCodeAt(0) + labelInfo.hash;
    }

    _createClass(LetterTexture, [{
      key: "updateRenderData",
      value: function updateRenderData() {
        this._updateProperties();

        this._updateTexture();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.image = null; // Label._canvasPool.put(this._data);
      }
    }, {
      key: "_updateProperties",
      value: function _updateProperties() {
        this.data = _index4.Label._canvasPool.get();
        this.canvas = this.data.canvas;
        this.context = this.data.context;

        if (this.context) {
          this.context.font = this.labelInfo.fontDesc;
          var width = (0, _index2.safeMeasureText)(this.context, this["char"]);
          this.width = parseFloat(width.toFixed(2));
          this.height = this.labelInfo.fontSize;
        }

        if (this.canvas.width !== this.width) {
          this.canvas.width = this.width;
        }

        if (this.canvas.height !== this.height) {
          this.canvas.height = this.height;
        }

        if (!this.image) {
          this.image = new _index.ImageAsset();
        }

        this.image.reset(this.canvas);
      }
    }, {
      key: "_updateTexture",
      value: function _updateTexture() {
        if (!this.context || !this.canvas) {
          return;
        }

        var context = this.context;
        var labelInfo = this.labelInfo;
        var width = this.canvas.width;
        var height = this.canvas.height;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.clearRect(0, 0, width, height); // Add a white background to avoid black edges.

        context.fillStyle = _backgroundStyle;
        context.fillRect(0, 0, width, height);
        context.font = labelInfo.fontDesc;
        var startX = width / 2;
        var startY = height / 2;
        var color = labelInfo.color; // use round for line join to avoid sharp intersect point

        context.lineJoin = 'round';
        context.fillStyle = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ", 1, ")");

        if (labelInfo.isOutlined) {
          var strokeColor = labelInfo.out || WHITE;
          context.strokeStyle = "rgba(".concat(strokeColor.r, ", ").concat(strokeColor.g, ", ").concat(strokeColor.b, ", ").concat(strokeColor.a / 255, ")");
          context.lineWidth = labelInfo.margin * 2;
          context.strokeText(this["char"], startX, startY);
        }

        context.fillText(this["char"], startX, startY); // this.texture.handleLoadedTexture();
        // (this.image as Texture2D).updateImage();
      }
    }]);

    return LetterTexture;
  }();

  var LetterRenderTexture = /*#__PURE__*/function (_Texture2D) {
    _inherits(LetterRenderTexture, _Texture2D);

    function LetterRenderTexture() {
      _classCallCheck(this, LetterRenderTexture);

      return _possibleConstructorReturn(this, _getPrototypeOf(LetterRenderTexture).apply(this, arguments));
    }

    _createClass(LetterRenderTexture, [{
      key: "initWithSize",

      /**
       * @en
       * Init the render texture with size.
       * @zh
       * 初始化 render texture。
       * @param [width]
       * @param [height]
       * @param [string]
       */
      value: function initWithSize(width, height) {
        var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _assetEnum.PixelFormat.RGBA8888;
        this.reset({
          width: width,
          height: height,
          format: format
        });
        this.loaded = true;
        this.emit('load');
      }
      /**
       * @en Draw a texture to the specified position
       * @zh 将指定的图片渲染到指定的位置上。
       * @param {Texture2D} image
       * @param {Number} x
       * @param {Number} y
       */

    }, {
      key: "drawTextureAt",
      value: function drawTextureAt(image, x, y) {
        var gfxTexture = this.getGFXTexture();

        if (!image || !gfxTexture) {
          return;
        }

        var gfxDevice = this._getGFXDevice();

        if (!gfxDevice) {
          console.warn('Unable to get device');
          return;
        }

        var region = new _define.GFXBufferTextureCopy();
        region.texOffset.x = x;
        region.texOffset.y = y;
        region.texExtent.width = image.width;
        region.texExtent.height = image.height;
        gfxDevice.copyTexImagesToTexture([image.data], gfxTexture, [region]);
      }
    }]);

    return LetterRenderTexture;
  }(_index.Texture2D);

  _exports.LetterRenderTexture = LetterRenderTexture;

  var LetterAtlas = /*#__PURE__*/function () {
    _createClass(LetterAtlas, [{
      key: "width",
      get: function get() {
        return this._width;
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      }
    }]);

    function LetterAtlas(width, height) {
      _classCallCheck(this, LetterAtlas);

      this.texture = void 0;
      this._x = space;
      this._y = space;
      this._nextY = space;
      this._width = 0;
      this._height = 0;
      this._letterDefinitions = new Map();
      this._dirty = false;
      this.texture = new LetterRenderTexture();
      this.texture.initWithSize(width, height);
      this._width = width;
      this._height = height;

      _director.director.on(_director.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
    }

    _createClass(LetterAtlas, [{
      key: "insertLetterTexture",
      value: function insertLetterTexture(letterTexture) {
        var texture = letterTexture.image;
        var device = _director.director.root.device;

        if (!texture || !this.texture || !device) {
          return null;
        }

        var width = texture.width;
        var height = texture.height;

        if (this._x + width + space > this._width) {
          this._x = space;
          this._y = this._nextY;
        }

        if (this._y + height > this._nextY) {
          this._nextY = this._y + height + space;
        }

        if (this._nextY > this._height) {
          return null;
        }

        this.texture.drawTextureAt(texture, this._x, this._y);
        this._dirty = true;
        var letterDefinition = new FontLetterDefinition();
        letterDefinition.u = this._x;
        letterDefinition.v = this._y;
        letterDefinition.texture = this.texture;
        letterDefinition.valid = true;
        letterDefinition.w = letterTexture.width;
        letterDefinition.h = letterTexture.height;
        letterDefinition.xAdvance = letterTexture.width;
        this._x += width + space;

        this._letterDefinitions.set(letterTexture.hash, letterDefinition);
        /*
        const region = new GFXBufferTextureCopy();
        region.texOffset.x = letterDefinition.offsetX;
        region.texOffset.y = letterDefinition.offsetY;
        region.texExtent.width = letterDefinition.w;
        region.texExtent.height = letterDefinition.h;
        */


        return letterDefinition;
      }
    }, {
      key: "update",
      value: function update() {
        if (!this._dirty) {
          return;
        } // this.texture.update();


        this._dirty = false;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._x = space;
        this._y = space;
        this._nextY = space; // const chars = this._letterDefinitions;
        // for (let i = 0, l = (Object.keys(chars)).length; i < l; i++) {
        //     const char = chars[i];
        //     if (!char.valid) {
        //         continue;
        //     }
        //     char.destroy();
        // }
        // this._letterDefinitions = createMap();

        this._letterDefinitions.clear();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.reset();

        if (this.texture) {
          this.texture.destroy();
        }
      }
    }, {
      key: "beforeSceneLoad",
      value: function beforeSceneLoad() {
        this.destroy();
        var texture = new LetterRenderTexture();
        texture.initWithSize(this._width, this._height); // texture.update();

        this.texture = texture;
      }
    }, {
      key: "getLetter",
      value: function getLetter(key) {
        return this._letterDefinitions.get(key);
      }
    }, {
      key: "addLetterDefinitions",
      value: function addLetterDefinitions(key, letterDefinition) {
        this._letterDefinitions[key] = letterDefinition;
      }
    }, {
      key: "cloneLetterDefinition",
      value: function cloneLetterDefinition() {
        var copyLetterDefinitions = {};

        for (var _i = 0, _Object$keys = Object.keys(this._letterDefinitions); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          var value = new FontLetterDefinition();
          (0, _js.mixin)(value, this._letterDefinitions[key]);
          copyLetterDefinitions[key] = value;
        }

        return copyLetterDefinitions;
      }
    }, {
      key: "assignLetterDefinitions",
      value: function assignLetterDefinitions(letterDefinitions) {
        var _this = this;

        letterDefinitions.forEach(function (value, key) {
          var oldValue = _this._letterDefinitions[key];
          (0, _js.mixin)(oldValue, value);
        });
      }
    }, {
      key: "scaleFontLetterDefinition",
      value: function scaleFontLetterDefinition(scaleFactor) {
        for (var _i2 = 0, _Object$keys2 = Object.keys(this._letterDefinitions); _i2 < _Object$keys2.length; _i2++) {
          var fontDefinition = _Object$keys2[_i2];
          var letterDefinitions = this._letterDefinitions[fontDefinition];
          letterDefinitions.w *= scaleFactor;
          letterDefinitions.h *= scaleFactor;
          letterDefinitions.offsetX *= scaleFactor;
          letterDefinitions.offsetY *= scaleFactor;
          letterDefinitions.xAdvance *= scaleFactor;
        }
      }
    }, {
      key: "getLetterDefinitionForChar",
      value: function getLetterDefinitionForChar(_char2, labelInfo) {
        var hash = _char2.charCodeAt(0) + labelInfo.hash;

        var letterDefinition = this._letterDefinitions.get(hash);

        if (!letterDefinition) {
          var temp = new LetterTexture(_char2, labelInfo);
          temp.updateRenderData();
          letterDefinition = this.insertLetterTexture(temp);
          temp.destroy();
        }

        return letterDefinition;
      }
    }]);

    return LetterAtlas;
  }();

  _exports.LetterAtlas = LetterAtlas;

  var _tmpRect = new _index3.Rect();

  var _comp = null;
  var _uiTrans = null;
  var _horizontalKerning = [];
  var _lettersInfo = [];
  var _linesWidth = [];
  var _linesOffsetX = [];

  var _labelDimensions = new _index3.Size();

  var _fontAtlas = null;
  var _fntConfig = null;
  var _numberOfLines = 0;
  var _textDesiredHeight = 0;
  var _letterOffsetY = 0;
  var _tailoredTopY = 0;
  var _tailoredBottomY = 0;
  var _bmfontScale = 1.0;
  var _lineBreakWithoutSpaces = false;
  var _lineSpacing = 0;
  var _string = '';
  var _fontSize = 0;
  var _originFontSize = 0;

  var _contentSize = new _index3.Size();

  var _hAlign = 0;
  var _vAlign = 0;
  var _spacingX = 0;
  var _lineHeight = 0;
  var _overflow = 0;
  var _isWrapText = false;
  var _labelWidth = 0;
  var _labelHeight = 0;
  var _maxLineWidth = 0;
  var _atlasWidth = 1024;
  var _atlasHeight = 1024;
  var _fontFamily = '';
  var _isBold = false;
  var _labelInfo = {
    fontSize: 0,
    lineHeight: 0,
    hash: '',
    fontFamily: '',
    fontDesc: 'Arial',
    hAlign: 0,
    vAlign: 0,
    color: WHITE,
    isOutlined: false,
    out: WHITE,
    margin: 0
  };
  var letterFont = {
    getAssemblerData: function getAssemblerData() {
      if (!_fontAtlas) {
        _fontAtlas = new LetterAtlas(_atlasWidth, _atlasHeight);
      }

      return _fontAtlas.texture;
    },
    updateRenderData: function updateRenderData(comp) {
      if (!comp.renderData || !comp.renderData.vertDirty) {
        return;
      }

      if (_comp === comp) {
        return;
      }

      _comp = comp;
      _uiTrans = comp.node._uiProps.uiTransformComp;

      this._updateFontFamily(comp);

      _labelInfo.fontFamily = _fontFamily;

      this._updateProperties();

      _labelInfo.fontDesc = this._getFontDesc();

      this._updateContent();

      _comp.actualFontSize = _fontSize;

      _uiTrans.setContentSize(_contentSize);

      _comp.renderData.vertDirty = _comp.renderData.uvDirty = false;
      _comp = null;

      this._resetProperties();
    },
    _updateFontScale: function _updateFontScale() {
      _bmfontScale = _fontSize / _originFontSize;
    },
    _updateProperties: function _updateProperties() {
      if (!_comp) {
        return;
      }

      _string = _comp.string.toString();
      _fontSize = _comp.fontSize;
      _originFontSize = _fontSize;
      var contentSize = _uiTrans.contentSize;
      _contentSize.width = contentSize.width;
      _contentSize.height = contentSize.height;
      _hAlign = _comp.horizontalAlign;
      _vAlign = _comp.verticalAlign;
      _spacingX = _comp.spacingX;
      _overflow = _comp.overflow;
      _lineHeight = _comp.lineHeight;
      _isBold = _comp.isBold; // should wrap text

      if (_overflow === Overflow.NONE) {
        _isWrapText = false;
      } else if (_overflow === Overflow.RESIZE_HEIGHT) {
        _isWrapText = true;
      } else {
        _isWrapText = _comp.enableWrapText;
      } // outline


      var outline =
      /*OUTLINE_SUPPORTED && */
      _comp.getComponent(_index4.LabelOutline);

      if (outline && outline.enabled) {
        _labelInfo.isOutlined = true;
        _labelInfo.margin = outline.width;
        _labelInfo.out = outline.color;
        _labelInfo.out.a = outline.color.a * _comp.color.a / 255.0;
      } else {
        _labelInfo.isOutlined = false;
        _labelInfo.margin = 0;
      }

      _labelInfo.lineHeight = _lineHeight;
      _labelInfo.fontSize = _fontSize;
      _labelInfo.fontFamily = _fontFamily;
      _labelInfo.color = _comp.color;
      _labelInfo.hash = this._computeHash(_labelInfo);

      this._setupBMFontOverflowMetrics();
    },
    _updateFontFamily: function _updateFontFamily(comp) {
      if (!comp.useSystemFont) {
        if (comp.font) {
          if (comp.font._nativeAsset) {
            _fontFamily = comp.font._nativeAsset;
          } else {
            _fontFamily = _index5.loader.getRes(comp.font.nativeUrl) || '';

            if (!_fontFamily) {
              _index5.loader.load(comp.font.nativeUrl, function (err, fontFamily) {
                _fontFamily = fontFamily || 'Arial';

                if (comp.font) {
                  comp.font._nativeAsset = fontFamily;
                }

                comp.updateRenderData(true);
              });
            }
          }
        } else {
          _fontFamily = 'Arial';
        }
      } else {
        _fontFamily = comp.fontFamily;
      }
    },
    _computeHash: function _computeHash(labelInfo) {
      var hashData = '';
      var color = labelInfo.color.toHEX('#rrggbb');
      var out = '';

      if (labelInfo.isOutlined) {
        out = labelInfo.out.toHEX('#rrggbb');
      }

      return hashData + labelInfo.fontSize + labelInfo.fontFamily + color + out;
    },
    _getFontDesc: function _getFontDesc() {
      var fontDesc = _fontSize.toString() + 'px ';
      fontDesc = fontDesc + _fontFamily;

      if (_isBold) {
        fontDesc = 'bold ' + fontDesc;
      }

      return fontDesc;
    },
    _resetProperties: function _resetProperties() {},
    _updateContent: function _updateContent() {
      this._updateFontScale(); // this._computeHorizontalKerningForText();


      this._alignText();
    },
    _computeHorizontalKerningForText: function _computeHorizontalKerningForText() {// const string = _string;
      // const stringLen = string.length;
      // const kerningDict = _fntConfig.kerningDict;
      // const horizontalKerning = _horizontalKerning;
      // let prev = -1;
      // for (let i = 0; i < stringLen; ++i) {
      //     const key = string.charCodeAt(i);
      //     const kerningAmount = kerningDict[(prev << 16) | (key & 0xffff)] || 0;
      //     if (i < stringLen - 1) {
      //         horizontalKerning[i] = kerningAmount;
      //     } else {
      //         horizontalKerning[i] = 0;
      //     }
      //     prev = key;
      // }
    },
    _multilineTextWrap: function _multilineTextWrap(nextTokenFunc) {
      var textLen = _string.length;
      var lineIndex = 0;
      var nextTokenX = 0;
      var nextTokenY = 0;
      var longestLine = 0;
      var letterRight = 0;
      var highestY = 0;
      var lowestY = 0;
      var letterDef = null;
      var letterPosition = new _index3.Vec2(0, 0);

      this._updateFontScale();

      for (var index = 0; index < textLen;) {
        var character = _string.charAt(index);

        if (character === '\n') {
          _linesWidth.push(letterRight);

          letterRight = 0;
          lineIndex++;
          nextTokenX = 0;
          nextTokenY -= _lineHeight * _bmfontScale + _lineSpacing;

          this._recordPlaceholderInfo(index, character);

          index++;
          continue;
        }

        var tokenLen = nextTokenFunc(_string, index, textLen);
        var tokenHighestY = highestY;
        var tokenLowestY = lowestY;
        var tokenRight = letterRight;
        var nextLetterX = nextTokenX;
        var newLine = false;

        for (var tmp = 0; tmp < tokenLen; ++tmp) {
          var letterIndex = index + tmp;
          character = _string.charAt(letterIndex);

          if (character === '\r') {
            this._recordPlaceholderInfo(letterIndex, character);

            continue;
          }

          letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);

          if (!letterDef) {
            this._recordPlaceholderInfo(letterIndex, character);

            continue;
          }

          var letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

          if (_isWrapText && _maxLineWidth > 0 && nextTokenX > 0 && letterX + letterDef.w * _bmfontScale > _maxLineWidth && !(0, _index2.isUnicodeSpace)(character)) {
            _linesWidth.push(letterRight);

            letterRight = 0;
            lineIndex++;
            nextTokenX = 0;
            nextTokenY -= _lineHeight * _bmfontScale + _lineSpacing;
            newLine = true;
            break;
          } else {
            letterPosition.x = letterX;
          }

          letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale;

          this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

          if (letterIndex + 1 < _horizontalKerning.length && letterIndex < textLen - 1) {
            nextLetterX += _horizontalKerning[letterIndex + 1];
          }

          nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;
          tokenRight = letterPosition.x + letterDef.w * _bmfontScale;

          if (tokenHighestY < letterPosition.y) {
            tokenHighestY = letterPosition.y;
          }

          if (tokenLowestY > letterPosition.y - letterDef.h * _bmfontScale) {
            tokenLowestY = letterPosition.y - letterDef.h * _bmfontScale;
          }
        } // end of for loop


        if (newLine) {
          continue;
        }

        nextTokenX = nextLetterX;
        letterRight = tokenRight;

        if (highestY < tokenHighestY) {
          highestY = tokenHighestY;
        }

        if (lowestY > tokenLowestY) {
          lowestY = tokenLowestY;
        }

        if (longestLine < letterRight) {
          longestLine = letterRight;
        }

        index += tokenLen;
      } // end of for loop


      _linesWidth.push(letterRight);

      _numberOfLines = lineIndex + 1;
      _textDesiredHeight = _numberOfLines * _lineHeight * _bmfontScale;

      if (_numberOfLines > 1) {
        _textDesiredHeight += (_numberOfLines - 1) * _lineSpacing;
      }

      _contentSize.width = _labelWidth;
      _contentSize.height = _labelHeight;

      if (_labelWidth <= 0) {
        _contentSize.width = parseFloat(longestLine.toFixed(2));
      }

      if (_labelHeight <= 0) {
        _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2));
      }

      _tailoredTopY = _contentSize.height;
      _tailoredBottomY = 0;

      if (highestY > 0) {
        _tailoredTopY = _contentSize.height + highestY;
      }

      if (lowestY < -_textDesiredHeight) {
        _tailoredBottomY = _textDesiredHeight + lowestY;
      }

      return true;
    },
    _getFirstCharLen: function _getFirstCharLen() {
      return 1;
    },
    _getFirstWordLen: function _getFirstWordLen(text, startIndex, textLen) {
      var character = text.charAt(startIndex);

      if ((0, _index2.isUnicodeCJK)(character) || character === '\n' || (0, _index2.isUnicodeSpace)(character)) {
        return 1;
      }

      if (!_fontAtlas) {
        return;
      }

      var len = 1;

      var letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);

      if (!letterDef) {
        return len;
      }

      var nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
      var letterX;

      for (var index = startIndex + 1; index < textLen; ++index) {
        character = text.charAt(index);
        letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);

        if (!letterDef) {
          break;
        }

        letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

        if (letterX + letterDef.w * _bmfontScale > _maxLineWidth && !(0, _index2.isUnicodeSpace)(character) && _maxLineWidth > 0) {
          return len;
        }

        nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

        if (character === '\n' || (0, _index2.isUnicodeSpace)(character) || (0, _index2.isUnicodeCJK)(character)) {
          break;
        }

        len++;
      }

      return len;
    },
    _multilineTextWrapByWord: function _multilineTextWrapByWord() {
      return this._multilineTextWrap(this._getFirstWordLen);
    },
    _multilineTextWrapByChar: function _multilineTextWrapByChar() {
      return this._multilineTextWrap(this._getFirstCharLen);
    },
    _recordPlaceholderInfo: function _recordPlaceholderInfo(letterIndex, _char3) {
      if (letterIndex >= _lettersInfo.length) {
        var tmpInfo = new LetterInfo();

        _lettersInfo.push(tmpInfo);
      }

      _lettersInfo[letterIndex]["char"] = _char3;
      _lettersInfo[letterIndex].hash = _char3.charCodeAt(0) + _labelInfo.hash;
      _lettersInfo[letterIndex].valid = false;
    },
    _recordLetterInfo: function _recordLetterInfo(letterPosition, character, letterIndex, lineIndex) {
      if (letterIndex >= _lettersInfo.length) {
        var tmpInfo = new LetterInfo();

        _lettersInfo.push(tmpInfo);
      }

      var _char4 = character.charCodeAt(0);

      var key = _char4 + _labelInfo.hash;
      _lettersInfo[letterIndex].line = lineIndex;
      _lettersInfo[letterIndex]["char"] = character;
      _lettersInfo[letterIndex].hash = key;

      var fontLetter = _fontAtlas && _fontAtlas.getLetter(key);

      _lettersInfo[letterIndex].valid = fontLetter ? !!fontLetter.valid : false;
      _lettersInfo[letterIndex].x = letterPosition.x;
      _lettersInfo[letterIndex].y = letterPosition.y;
    },
    _alignText: function _alignText() {
      _textDesiredHeight = 0;
      _linesWidth.length = 0;

      if (!_lineBreakWithoutSpaces) {
        this._multilineTextWrapByWord();
      } else {
        this._multilineTextWrapByChar();
      }

      this._computeAlignmentOffset();

      this._updateQuads(); // shrink
      // if (_overflow === Overflow.SHRINK) {
      //     if (_fontSize > 0 && this._isVerticalClamp()) {
      //         this._shrinkLabelToContentSize(this._isVerticalClamp);
      //     }
      // }
      // if (!this._updateQuads()) {
      //     if (_overflow === Overflow.SHRINK) {
      //         this._shrinkLabelToContentSize(this._isHorizontalClamp);
      //     }
      // }

    },
    _scaleFontSizeDown: function _scaleFontSizeDown(fontSize) {
      var shouldUpdateContent = true;

      if (!fontSize) {
        fontSize = 0.1;
        shouldUpdateContent = false;
      }

      _fontSize = fontSize;

      if (shouldUpdateContent) {
        this._updateContent();
      }
    },
    _isVerticalClamp: function _isVerticalClamp() {
      if (_textDesiredHeight > _contentSize.height) {
        return true;
      } else {
        return false;
      }
    },
    _isHorizontalClamp: function _isHorizontalClamp() {
      var letterClamp = false;

      for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
        var letterInfo = _lettersInfo[ctr];

        if (letterInfo.valid) {
          var letterDef = _fontAtlas.getLetter(letterInfo.hash);

          if (!letterDef) {
            continue;
          }

          var px = letterInfo.x + letterDef.w * _bmfontScale;
          var lineIndex = letterInfo.line;

          if (_labelWidth > 0) {
            if (!_isWrapText) {
              if (px > _contentSize.width) {
                letterClamp = true;
                break;
              }
            } else {
              var wordWidth = _linesWidth[lineIndex];

              if (wordWidth > _contentSize.width && (px > _contentSize.width || px < 0)) {
                letterClamp = true;
                break;
              }
            }
          }
        }
      }

      return letterClamp;
    },
    _isHorizontalClamped: function _isHorizontalClamped(px, lineIndex) {
      var wordWidth = _linesWidth[lineIndex];
      var letterOverClamp = px > _contentSize.width || px < 0;

      if (!_isWrapText) {
        return letterOverClamp;
      } else {
        return wordWidth > _contentSize.width && letterOverClamp;
      }
    },
    _updateQuads: function _updateQuads() {
      if (!_comp || !_fontAtlas) {
        return;
      }

      var texture = _fontAtlas.texture;
      var node = _comp.node;
      var renderData = _comp.renderData;
      renderData.dataLength = renderData.vertexCount = renderData.indicesCount = 0;
      var contentSize = _contentSize;
      var ap = _uiTrans.anchorPoint;
      var appX = ap.x * contentSize.width;
      var appY = ap.y * contentSize.height;
      var ret = true;

      for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
        var letterInfo = _lettersInfo[ctr];

        if (!letterInfo.valid) {
          continue;
        }

        var letterDef = _fontAtlas.getLetter(letterInfo.hash);

        if (!letterDef) {
          continue;
        }

        _tmpRect.height = letterDef.h;
        _tmpRect.width = letterDef.w;
        _tmpRect.x = letterDef.u;
        _tmpRect.y = letterDef.v;
        var py = letterInfo.y + _letterOffsetY;

        if (_labelHeight > 0) {
          if (py > _tailoredTopY) {
            var clipTop = py - _tailoredTopY;
            _tmpRect.y += clipTop;
            _tmpRect.height -= clipTop;
            py = py - clipTop;
          }

          if (py - letterDef.h * _bmfontScale < _tailoredBottomY) {
            _tmpRect.height = py < _tailoredBottomY ? 0 : py - _tailoredBottomY;
          }
        }

        var lineIndex = letterInfo.line;
        var px = letterInfo.x + letterDef.w / 2 * _bmfontScale + _linesOffsetX[lineIndex];

        if (_labelWidth > 0) {
          if (this._isHorizontalClamped(px, lineIndex)) {
            if (_overflow === Overflow.CLAMP) {
              _tmpRect.width = 0;
            } else if (_overflow === Overflow.SHRINK) {
              if (_contentSize.width > letterDef.w) {
                ret = false;
                break;
              } else {
                _tmpRect.width = 0;
              }
            }
          }
        }

        if (_tmpRect.height > 0 && _tmpRect.width > 0) {
          var letterPositionX = letterInfo.x + _linesOffsetX[letterInfo.line];
          this.appendQuad(_comp, texture, _tmpRect, false, letterPositionX - appX, py - appY, _bmfontScale);
        }
      }

      return ret;
    },
    appendQuad: function appendQuad(renderData, texture, rect, rotated, x, y, scale) {},
    _computeAlignmentOffset: function _computeAlignmentOffset() {
      _linesOffsetX.length = 0;

      switch (_hAlign) {
        case TextAlignment.LEFT:
          for (var i = 0; i < _numberOfLines; ++i) {
            _linesOffsetX.push(0);
          }

          break;

        case TextAlignment.CENTER:
          for (var _i3 = 0, l = _linesWidth.length; _i3 < l; _i3++) {
            _linesOffsetX.push((_contentSize.width - _linesWidth[_i3]) / 2);
          }

          break;

        case TextAlignment.RIGHT:
          for (var _i4 = 0, _l = _linesWidth.length; _i4 < _l; _i4++) {
            _linesOffsetX.push(_contentSize.width - _linesWidth[_i4]);
          }

          break;

        default:
          break;
      }

      switch (_vAlign) {
        case VerticalTextAlignment.TOP:
          _letterOffsetY = _contentSize.height;
          break;

        case VerticalTextAlignment.CENTER:
          _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2 - (_lineHeight - _fontSize) / 2;
          break;

        case VerticalTextAlignment.BOTTOM:
          _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2 - (_lineHeight - _fontSize);
          break;

        default:
          break;
      }
    },
    _setupBMFontOverflowMetrics: function _setupBMFontOverflowMetrics() {
      var newWidth = _contentSize.width;
      var newHeight = _contentSize.height;

      if (_overflow === Overflow.RESIZE_HEIGHT) {
        newHeight = 0;
      }

      if (_overflow === Overflow.NONE) {
        newWidth = 0;
        newHeight = 0;
      }

      _labelWidth = newWidth;
      _labelHeight = newHeight;
      _labelDimensions.width = newWidth;
      _labelDimensions.height = newHeight;
      _maxLineWidth = newWidth;
    }
  };
  _exports.letterFont = letterFont;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9sYWJlbC9sZXR0ZXItZm9udC50cyJdLCJuYW1lcyI6WyJPdmVyZmxvdyIsIkxhYmVsIiwiV0hJVEUiLCJDb2xvciIsImNsb25lIiwic3BhY2UiLCJUZXh0QWxpZ25tZW50IiwiSG9yaXpvbnRhbEFsaWduIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiVmVydGljYWxBbGlnbiIsIkxldHRlckluZm8iLCJ2YWxpZCIsIngiLCJ5IiwibGluZSIsImhhc2giLCJGb250TGV0dGVyRGVmaW5pdGlvbiIsInUiLCJ2IiwidyIsImgiLCJ0ZXh0dXJlIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJ4QWR2YW5jZSIsIl9iYWNrZ3JvdW5kU3R5bGUiLCJMZXR0ZXJUZXh0dXJlIiwiY2hhciIsImxhYmVsSW5mbyIsImltYWdlIiwiZGF0YSIsImNhbnZhcyIsImNvbnRleHQiLCJ3aWR0aCIsImhlaWdodCIsImNoYXJDb2RlQXQiLCJfdXBkYXRlUHJvcGVydGllcyIsIl91cGRhdGVUZXh0dXJlIiwiX2NhbnZhc1Bvb2wiLCJnZXQiLCJmb250IiwiZm9udERlc2MiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsImZvbnRTaXplIiwiSW1hZ2VBc3NldCIsInJlc2V0IiwidGV4dEFsaWduIiwidGV4dEJhc2VsaW5lIiwiY2xlYXJSZWN0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJzdGFydFgiLCJzdGFydFkiLCJjb2xvciIsImxpbmVKb2luIiwiciIsImciLCJiIiwiaXNPdXRsaW5lZCIsInN0cm9rZUNvbG9yIiwib3V0Iiwic3Ryb2tlU3R5bGUiLCJhIiwibGluZVdpZHRoIiwibWFyZ2luIiwic3Ryb2tlVGV4dCIsImZpbGxUZXh0IiwiTGV0dGVyUmVuZGVyVGV4dHVyZSIsImZvcm1hdCIsIlBpeGVsRm9ybWF0IiwiUkdCQTg4ODgiLCJsb2FkZWQiLCJlbWl0IiwiZ2Z4VGV4dHVyZSIsImdldEdGWFRleHR1cmUiLCJnZnhEZXZpY2UiLCJfZ2V0R0ZYRGV2aWNlIiwiY29uc29sZSIsIndhcm4iLCJyZWdpb24iLCJHRlhCdWZmZXJUZXh0dXJlQ29weSIsInRleE9mZnNldCIsInRleEV4dGVudCIsImNvcHlUZXhJbWFnZXNUb1RleHR1cmUiLCJUZXh0dXJlMkQiLCJMZXR0ZXJBdGxhcyIsIl93aWR0aCIsIl9oZWlnaHQiLCJfeCIsIl95IiwiX25leHRZIiwiX2xldHRlckRlZmluaXRpb25zIiwiTWFwIiwiX2RpcnR5IiwiaW5pdFdpdGhTaXplIiwiZGlyZWN0b3IiLCJvbiIsIkRpcmVjdG9yIiwiRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCIsImJlZm9yZVNjZW5lTG9hZCIsImxldHRlclRleHR1cmUiLCJkZXZpY2UiLCJyb290IiwiZHJhd1RleHR1cmVBdCIsImxldHRlckRlZmluaXRpb24iLCJzZXQiLCJjbGVhciIsImRlc3Ryb3kiLCJrZXkiLCJjb3B5TGV0dGVyRGVmaW5pdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwidmFsdWUiLCJsZXR0ZXJEZWZpbml0aW9ucyIsImZvckVhY2giLCJvbGRWYWx1ZSIsInNjYWxlRmFjdG9yIiwiZm9udERlZmluaXRpb24iLCJ0ZW1wIiwidXBkYXRlUmVuZGVyRGF0YSIsImluc2VydExldHRlclRleHR1cmUiLCJfdG1wUmVjdCIsIlJlY3QiLCJfY29tcCIsIl91aVRyYW5zIiwiX2hvcml6b250YWxLZXJuaW5nIiwiX2xldHRlcnNJbmZvIiwiX2xpbmVzV2lkdGgiLCJfbGluZXNPZmZzZXRYIiwiX2xhYmVsRGltZW5zaW9ucyIsIlNpemUiLCJfZm9udEF0bGFzIiwiX2ZudENvbmZpZyIsIl9udW1iZXJPZkxpbmVzIiwiX3RleHREZXNpcmVkSGVpZ2h0IiwiX2xldHRlck9mZnNldFkiLCJfdGFpbG9yZWRUb3BZIiwiX3RhaWxvcmVkQm90dG9tWSIsIl9ibWZvbnRTY2FsZSIsIl9saW5lQnJlYWtXaXRob3V0U3BhY2VzIiwiX2xpbmVTcGFjaW5nIiwiX3N0cmluZyIsIl9mb250U2l6ZSIsIl9vcmlnaW5Gb250U2l6ZSIsIl9jb250ZW50U2l6ZSIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX3NwYWNpbmdYIiwiX2xpbmVIZWlnaHQiLCJfb3ZlcmZsb3ciLCJfaXNXcmFwVGV4dCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0IiwiX21heExpbmVXaWR0aCIsIl9hdGxhc1dpZHRoIiwiX2F0bGFzSGVpZ2h0IiwiX2ZvbnRGYW1pbHkiLCJfaXNCb2xkIiwiX2xhYmVsSW5mbyIsImxpbmVIZWlnaHQiLCJmb250RmFtaWx5IiwiaEFsaWduIiwidkFsaWduIiwibGV0dGVyRm9udCIsImdldEFzc2VtYmxlckRhdGEiLCJjb21wIiwicmVuZGVyRGF0YSIsInZlcnREaXJ0eSIsIm5vZGUiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsIl91cGRhdGVGb250RmFtaWx5IiwiX2dldEZvbnREZXNjIiwiX3VwZGF0ZUNvbnRlbnQiLCJhY3R1YWxGb250U2l6ZSIsInNldENvbnRlbnRTaXplIiwidXZEaXJ0eSIsIl9yZXNldFByb3BlcnRpZXMiLCJfdXBkYXRlRm9udFNjYWxlIiwic3RyaW5nIiwidG9TdHJpbmciLCJjb250ZW50U2l6ZSIsImhvcml6b250YWxBbGlnbiIsInZlcnRpY2FsQWxpZ24iLCJzcGFjaW5nWCIsIm92ZXJmbG93IiwiaXNCb2xkIiwiTk9ORSIsIlJFU0laRV9IRUlHSFQiLCJlbmFibGVXcmFwVGV4dCIsIm91dGxpbmUiLCJnZXRDb21wb25lbnQiLCJMYWJlbE91dGxpbmUiLCJlbmFibGVkIiwiX2NvbXB1dGVIYXNoIiwiX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzIiwidXNlU3lzdGVtRm9udCIsIl9uYXRpdmVBc3NldCIsImxvYWRlciIsImdldFJlcyIsIm5hdGl2ZVVybCIsImxvYWQiLCJlcnIiLCJoYXNoRGF0YSIsInRvSEVYIiwiX2FsaWduVGV4dCIsIl9jb21wdXRlSG9yaXpvbnRhbEtlcm5pbmdGb3JUZXh0IiwiX211bHRpbGluZVRleHRXcmFwIiwibmV4dFRva2VuRnVuYyIsInRleHRMZW4iLCJsZW5ndGgiLCJsaW5lSW5kZXgiLCJuZXh0VG9rZW5YIiwibmV4dFRva2VuWSIsImxvbmdlc3RMaW5lIiwibGV0dGVyUmlnaHQiLCJoaWdoZXN0WSIsImxvd2VzdFkiLCJsZXR0ZXJEZWYiLCJsZXR0ZXJQb3NpdGlvbiIsIlZlYzIiLCJpbmRleCIsImNoYXJhY3RlciIsImNoYXJBdCIsInB1c2giLCJfcmVjb3JkUGxhY2Vob2xkZXJJbmZvIiwidG9rZW5MZW4iLCJ0b2tlbkhpZ2hlc3RZIiwidG9rZW5Mb3dlc3RZIiwidG9rZW5SaWdodCIsIm5leHRMZXR0ZXJYIiwibmV3TGluZSIsInRtcCIsImxldHRlckluZGV4IiwiZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIiLCJsZXR0ZXJYIiwiX3JlY29yZExldHRlckluZm8iLCJfZ2V0Rmlyc3RDaGFyTGVuIiwiX2dldEZpcnN0V29yZExlbiIsInRleHQiLCJzdGFydEluZGV4IiwibGVuIiwiX211bHRpbGluZVRleHRXcmFwQnlXb3JkIiwiX211bHRpbGluZVRleHRXcmFwQnlDaGFyIiwidG1wSW5mbyIsImZvbnRMZXR0ZXIiLCJnZXRMZXR0ZXIiLCJfY29tcHV0ZUFsaWdubWVudE9mZnNldCIsIl91cGRhdGVRdWFkcyIsIl9zY2FsZUZvbnRTaXplRG93biIsInNob3VsZFVwZGF0ZUNvbnRlbnQiLCJfaXNWZXJ0aWNhbENsYW1wIiwiX2lzSG9yaXpvbnRhbENsYW1wIiwibGV0dGVyQ2xhbXAiLCJjdHIiLCJsIiwibGV0dGVySW5mbyIsInB4Iiwid29yZFdpZHRoIiwiX2lzSG9yaXpvbnRhbENsYW1wZWQiLCJsZXR0ZXJPdmVyQ2xhbXAiLCJkYXRhTGVuZ3RoIiwidmVydGV4Q291bnQiLCJpbmRpY2VzQ291bnQiLCJhcCIsImFuY2hvclBvaW50IiwiYXBwWCIsImFwcFkiLCJyZXQiLCJweSIsImNsaXBUb3AiLCJDTEFNUCIsIlNIUklOSyIsImxldHRlclBvc2l0aW9uWCIsImFwcGVuZFF1YWQiLCJyZWN0Iiwicm90YXRlZCIsInNjYWxlIiwiTEVGVCIsImkiLCJDRU5URVIiLCJSSUdIVCIsIlRPUCIsIkJPVFRPTSIsIm5ld1dpZHRoIiwibmV3SGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDQTtBQUNBLE1BQU1BLFFBQVEsR0FBR0MsY0FBTUQsUUFBdkI7O0FBQ0EsTUFBTUUsS0FBSyxHQUFHQyxjQUFNRCxLQUFOLENBQVlFLEtBQVosRUFBZDs7QUFDQSxNQUFNQyxLQUFLLEdBQUcsQ0FBZDtBQUNBLE1BQU1DLGFBQWEsR0FBR0wsY0FBTU0sZUFBNUI7QUFDQSxNQUFNQyxxQkFBcUIsR0FBR1AsY0FBTVEsYUFBcEM7O01BZ0JNQyxVOzs7bUJBQ1ksRTtTQUNQQyxLLEdBQVEsSTtTQUNSQyxDLEdBQUksQztTQUNKQyxDLEdBQUksQztTQUNKQyxJLEdBQU8sQztTQUNQQyxJLEdBQU8sRTs7O01BR1pDLG9COzs7U0FDS0MsQyxHQUFJLEM7U0FDSkMsQyxHQUFJLEM7U0FDSkMsQyxHQUFJLEM7U0FDSkMsQyxHQUFJLEM7U0FDSkMsTyxHQUFzQyxJO1NBQ3RDQyxPLEdBQVUsQztTQUNWQyxPLEdBQVUsQztTQUNWWixLLEdBQVEsSztTQUNSYSxRLEdBQVcsQzs7O0FBR3RCLE1BQU1DLGdCQUFnQixHQUFHLDRCQUF6Qjs7TUFFTUMsYTtBQVVGLDJCQUFhQyxLQUFiLEVBQTJCQyxTQUEzQixFQUFrRDtBQUFBOztBQUFBLFdBVDNDQyxLQVMyQyxHQVRoQixJQVNnQjtBQUFBLFdBUjNDRCxTQVEyQztBQUFBO0FBQUEsV0FOM0NFLElBTTJDLEdBTlYsSUFNVTtBQUFBLFdBTDNDQyxNQUsyQyxHQUxSLElBS1E7QUFBQSxXQUozQ0MsT0FJMkMsR0FKQSxJQUlBO0FBQUEsV0FIM0NDLEtBRzJDLEdBSG5DLENBR21DO0FBQUEsV0FGM0NDLE1BRTJDLEdBRmxDLENBRWtDO0FBQUEsV0FEM0NuQixJQUMyQztBQUM5QyxxQkFBWVksS0FBWjtBQUNBLFdBQUtDLFNBQUws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RzdJLFlBQVksQ0FBQy9HLE1BQTdCOztBQUVBLFVBQUlvSCxTQUFTLEtBQUt0SixRQUFRLENBQUM2TCxhQUEzQixFQUEwQztBQUN0Q2lHLFFBQUFBLFNBQVMsR0FBRyxDQUFaO0FBQ0g7O0FBRUQsVUFBSXhJLFNBQVMsS0FBS3RKLFFBQVEsQ0FBQzRMLElBQTNCLEVBQWlDO0FBQzdCaUcsUUFBQUEsUUFBUSxHQUFHLENBQVg7QUFDQUMsUUFBQUEsU0FBUyxHQUFHLENBQVo7QUFDSDs7QUFFRHRJLE1BQUFBLFdBQVcsR0FBR3FJLFFBQWQ7QUFDQXBJLE1BQUFBLFlBQVksR0FBR3FJLFNBQWY7QUFDQTVKLE1BQUFBLGdCQUFnQixDQUFDakcsS0FBakIsR0FBeUI0UCxRQUF6QjtBQUNBM0osTUFBQUEsZ0JBQWdCLENBQUNoRyxNQUFqQixHQUEwQjRQLFNBQTFCO0FBQ0FwSSxNQUFBQSxhQUFhLEdBQUdtSSxRQUFoQjtBQUNIO0FBcm1CcUIsR0FBbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW1hZ2VBc3NldCwgVGV4dHVyZTJEIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9hc3NldHMnO1xyXG5pbXBvcnQgeyBpc1VuaWNvZGVDSkssIGlzVW5pY29kZVNwYWNlLCBzYWZlTWVhc3VyZVRleHR9IGZyb20gJy4uLy4uLy4uL2NvcmUvdXRpbHMnO1xyXG5pbXBvcnQgeyBtaXhpbiB9IGZyb20gJy4uLy4uLy4uL2NvcmUvdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBDb2xvciwgUmVjdCwgU2l6ZSwgVmVjMiB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlclRleHR1cmVDb3B5LCBHRlhFeHRlbnQsIEdGWE9mZnNldCwgR0ZYVGV4dHVyZVN1YnJlcyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IExhYmVsLCBMYWJlbE91dGxpbmUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgSVNoYXJlZExhYmVsRGF0YSB9IGZyb20gJy4vZm9udC11dGlscyc7XHJcbmltcG9ydCB7IFBpeGVsRm9ybWF0IH0gZnJvbSAnLi4vLi4vLi4vY29yZS9hc3NldHMvYXNzZXQtZW51bSc7XHJcbmltcG9ydCB7IGRpcmVjdG9yLCBEaXJlY3RvciB9IGZyb20gJy4uLy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBsb2FkZXIgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2xvYWQtcGlwZWxpbmUnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXRyYW5zZm9ybSc7XHJcblxyXG4vLyBjb25zdCBPVVRMSU5FX1NVUFBPUlRFRCA9IGNjLmpzLmlzQ2hpbGRDbGFzc09mKExhYmVsT3V0bGluZSwgVUlDb21wb25lbnQpO1xyXG5jb25zdCBPdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93O1xyXG5jb25zdCBXSElURSA9IENvbG9yLldISVRFLmNsb25lKCk7XHJcbmNvbnN0IHNwYWNlID0gMjtcclxuY29uc3QgVGV4dEFsaWdubWVudCA9IExhYmVsLkhvcml6b250YWxBbGlnbjtcclxuY29uc3QgVmVydGljYWxUZXh0QWxpZ25tZW50ID0gTGFiZWwuVmVydGljYWxBbGlnbjtcclxuXHJcbmludGVyZmFjZSBJTGFiZWxJbmZvIHtcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbiAgICBsaW5lSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBoYXNoOiBzdHJpbmc7XHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250RGVzYzogc3RyaW5nO1xyXG4gICAgaEFsaWduOiBudW1iZXI7XHJcbiAgICB2QWxpZ246IG51bWJlcjtcclxuICAgIGNvbG9yOiBDb2xvcjtcclxuICAgIGlzT3V0bGluZWQ6IGJvb2xlYW47XHJcbiAgICBvdXQ6IENvbG9yO1xyXG4gICAgbWFyZ2luOiBudW1iZXI7XHJcbn1cclxuXHJcbmNsYXNzIExldHRlckluZm8ge1xyXG4gICAgcHVibGljIGNoYXIgPSAnJztcclxuICAgIHB1YmxpYyB2YWxpZCA9IHRydWU7XHJcbiAgICBwdWJsaWMgeCA9IDA7XHJcbiAgICBwdWJsaWMgeSA9IDA7XHJcbiAgICBwdWJsaWMgbGluZSA9IDA7XHJcbiAgICBwdWJsaWMgaGFzaCA9ICcnO1xyXG59XHJcblxyXG5jbGFzcyBGb250TGV0dGVyRGVmaW5pdGlvbiB7XHJcbiAgICBwdWJsaWMgdSA9IDA7XHJcbiAgICBwdWJsaWMgdiA9IDA7XHJcbiAgICBwdWJsaWMgdyA9IDA7XHJcbiAgICBwdWJsaWMgaCA9IDA7XHJcbiAgICBwdWJsaWMgdGV4dHVyZTogTGV0dGVyUmVuZGVyVGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG9mZnNldFggPSAwO1xyXG4gICAgcHVibGljIG9mZnNldFkgPSAwO1xyXG4gICAgcHVibGljIHZhbGlkID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgeEFkdmFuY2UgPSAwO1xyXG59XHJcblxyXG5jb25zdCBfYmFja2dyb3VuZFN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMDUpJztcclxuXHJcbmNsYXNzIExldHRlclRleHR1cmUge1xyXG4gICAgcHVibGljIGltYWdlOiBJbWFnZUFzc2V0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbGFiZWxJbmZvOiBJTGFiZWxJbmZvO1xyXG4gICAgcHVibGljIGNoYXI6IHN0cmluZztcclxuICAgIHB1YmxpYyBkYXRhOiBJU2hhcmVkTGFiZWxEYXRhIHwgbnVsbCAgPSBudWxsO1xyXG4gICAgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB3aWR0aCA9IDA7XHJcbiAgICBwdWJsaWMgaGVpZ2h0ID0gMDtcclxuICAgIHB1YmxpYyBoYXNoOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvciAoY2hhcjogc3RyaW5nLCBsYWJlbEluZm86IElMYWJlbEluZm8pIHtcclxuICAgICAgICB0aGlzLmNoYXIgPSBjaGFyO1xyXG4gICAgICAgIHRoaXMubGFiZWxJbmZvID0gbGFiZWxJbmZvO1xyXG4gICAgICAgIHRoaXMuaGFzaCA9IGNoYXIuY2hhckNvZGVBdCgwKSArIGxhYmVsSW5mby5oYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVSZW5kZXJEYXRhICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlVGV4dHVyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLmltYWdlID0gbnVsbDtcclxuICAgICAgICAvLyBMYWJlbC5fY2FudmFzUG9vbC5wdXQodGhpcy5fZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlUHJvcGVydGllcyAoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gTGFiZWwuX2NhbnZhc1Bvb2wuZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmRhdGEuY2FudmFzO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuZGF0YS5jb250ZXh0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQpe1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMubGFiZWxJbmZvLmZvbnREZXNjO1xyXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHNhZmVNZWFzdXJlVGV4dCh0aGlzLmNvbnRleHQsIHRoaXMuY2hhcik7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBwYXJzZUZsb2F0KHdpZHRoLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMubGFiZWxJbmZvLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzLndpZHRoICE9PSB0aGlzLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNhbnZhcy5oZWlnaHQgIT09IHRoaXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2VBc3NldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbWFnZS5yZXNldCh0aGlzLmNhbnZhcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlVGV4dHVyZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQgfHwgIXRoaXMuY2FudmFzKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjb25zdCBsYWJlbEluZm8gPSB0aGlzLmxhYmVsSW5mbztcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIC8vIEFkZCBhIHdoaXRlIGJhY2tncm91bmQgdG8gYXZvaWQgYmxhY2sgZWRnZXMuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBfYmFja2dyb3VuZFN0eWxlO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gbGFiZWxJbmZvLmZvbnREZXNjO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFydFggPSB3aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRZID0gaGVpZ2h0IC8gMjtcclxuICAgICAgICBjb25zdCBjb2xvciA9IGxhYmVsSW5mby5jb2xvcjtcclxuICAgICAgICAvLyB1c2Ugcm91bmQgZm9yIGxpbmUgam9pbiB0byBhdm9pZCBzaGFycCBpbnRlcnNlY3QgcG9pbnRcclxuICAgICAgICBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGByZ2JhKCR7Y29sb3Iucn0sICR7Y29sb3IuZ30sICR7Y29sb3IuYn0sICR7MX0pYDtcclxuICAgICAgICBpZiAobGFiZWxJbmZvLmlzT3V0bGluZWQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3Ryb2tlQ29sb3IgPSBsYWJlbEluZm8ub3V0IHx8IFdISVRFO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gYHJnYmEoJHtzdHJva2VDb2xvci5yfSwgJHtzdHJva2VDb2xvci5nfSwgJHtzdHJva2VDb2xvci5ifSwgJHtzdHJva2VDb2xvci5hIC8gMjU1fSlgO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IGxhYmVsSW5mby5tYXJnaW4gKiAyO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQodGhpcy5jaGFyLCBzdGFydFgsIHN0YXJ0WSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQodGhpcy5jaGFyLCBzdGFydFgsIHN0YXJ0WSk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcbiAgICAgICAgLy8gKHRoaXMuaW1hZ2UgYXMgVGV4dHVyZTJEKS51cGRhdGVJbWFnZSgpO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExldHRlclJlbmRlclRleHR1cmUgZXh0ZW5kcyBUZXh0dXJlMkQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluaXQgdGhlIHJlbmRlciB0ZXh0dXJlIHdpdGggc2l6ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Yid5aeL5YyWIHJlbmRlciB0ZXh0dXJl44CCXHJcbiAgICAgKiBAcGFyYW0gW3dpZHRoXVxyXG4gICAgICogQHBhcmFtIFtoZWlnaHRdXHJcbiAgICAgKiBAcGFyYW0gW3N0cmluZ11cclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRXaXRoU2l6ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGZvcm1hdDogbnVtYmVyID0gUGl4ZWxGb3JtYXQuUkdCQTg4ODgpIHtcclxuICAgICAgICB0aGlzLnJlc2V0KHtcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgZm9ybWF0LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVtaXQoJ2xvYWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEcmF3IGEgdGV4dHVyZSB0byB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uXHJcbiAgICAgKiBAemgg5bCG5oyH5a6a55qE5Zu+54mH5riy5p+T5Yiw5oyH5a6a55qE5L2N572u5LiK44CCXHJcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gaW1hZ2VcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhd1RleHR1cmVBdCAoaW1hZ2U6IEltYWdlQXNzZXQsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZ2Z4VGV4dHVyZSA9IHRoaXMuZ2V0R0ZYVGV4dHVyZSgpO1xyXG4gICAgICAgIGlmICghaW1hZ2UgfHwgIWdmeFRleHR1cmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZ2Z4RGV2aWNlID0gdGhpcy5fZ2V0R0ZYRGV2aWNlKCk7XHJcbiAgICAgICAgaWYgKCFnZnhEZXZpY2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdVbmFibGUgdG8gZ2V0IGRldmljZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWdpb24gPSBuZXcgR0ZYQnVmZmVyVGV4dHVyZUNvcHkoKTtcclxuICAgICAgICByZWdpb24udGV4T2Zmc2V0LnggPSB4O1xyXG4gICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueSA9IHk7XHJcbiAgICAgICAgcmVnaW9uLnRleEV4dGVudC53aWR0aCA9IGltYWdlLndpZHRoO1xyXG4gICAgICAgIHJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIGdmeERldmljZS5jb3B5VGV4SW1hZ2VzVG9UZXh0dXJlKFtpbWFnZS5kYXRhIGFzIEhUTUxDYW52YXNFbGVtZW50XSwgZ2Z4VGV4dHVyZSwgW3JlZ2lvbl0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGV0dGVyQXRsYXMge1xyXG4gICAgZ2V0IHdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdGV4dHVyZTogTGV0dGVyUmVuZGVyVGV4dHVyZTtcclxuICAgIHByaXZhdGUgX3ggPSBzcGFjZTtcclxuICAgIHByaXZhdGUgX3kgPSBzcGFjZTtcclxuICAgIHByaXZhdGUgX25leHRZID0gc3BhY2U7XHJcbiAgICBwcml2YXRlIF93aWR0aCA9IDA7XHJcbiAgICBwcml2YXRlIF9oZWlnaHQgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbGV0dGVyRGVmaW5pdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgRm9udExldHRlckRlZmluaXRpb24+KCk7XHJcbiAgICBwcml2YXRlIF9kaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudGV4dHVyZSA9IG5ldyBMZXR0ZXJSZW5kZXJUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlLmluaXRXaXRoU2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgZGlyZWN0b3Iub24oRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCwgdGhpcy5iZWZvcmVTY2VuZUxvYWQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnNlcnRMZXR0ZXJUZXh0dXJlIChsZXR0ZXJUZXh0dXJlOiBMZXR0ZXJUZXh0dXJlKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IGxldHRlclRleHR1cmUuaW1hZ2U7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gZGlyZWN0b3Iucm9vdCEuZGV2aWNlO1xyXG4gICAgICAgIGlmICghdGV4dHVyZSB8fCAhdGhpcy50ZXh0dXJlIHx8ICFkZXZpY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRleHR1cmUud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGV4dHVyZS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmICgodGhpcy5feCArIHdpZHRoICsgc3BhY2UpID4gdGhpcy5fd2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5feCA9IHNwYWNlO1xyXG4gICAgICAgICAgICB0aGlzLl95ID0gdGhpcy5fbmV4dFk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKHRoaXMuX3kgKyBoZWlnaHQpID4gdGhpcy5fbmV4dFkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dFkgPSB0aGlzLl95ICsgaGVpZ2h0ICsgc3BhY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fbmV4dFkgPiB0aGlzLl9oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRleHR1cmUuZHJhd1RleHR1cmVBdCh0ZXh0dXJlLCB0aGlzLl94LCB0aGlzLl95KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBsZXR0ZXJEZWZpbml0aW9uID0gbmV3IEZvbnRMZXR0ZXJEZWZpbml0aW9uKCk7XHJcbiAgICAgICAgbGV0dGVyRGVmaW5pdGlvbi51ID0gdGhpcy5feDtcclxuICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLnYgPSB0aGlzLl95O1xyXG4gICAgICAgIGxldHRlckRlZmluaXRpb24udGV4dHVyZSA9IHRoaXMudGV4dHVyZTtcclxuICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLnZhbGlkID0gdHJ1ZTtcclxuICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLncgPSBsZXR0ZXJUZXh0dXJlLndpZHRoO1xyXG4gICAgICAgIGxldHRlckRlZmluaXRpb24uaCA9IGxldHRlclRleHR1cmUuaGVpZ2h0O1xyXG4gICAgICAgIGxldHRlckRlZmluaXRpb24ueEFkdmFuY2UgPSBsZXR0ZXJUZXh0dXJlLndpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLl94ICs9IHdpZHRoICsgc3BhY2U7XHJcblxyXG4gICAgICAgIHRoaXMuX2xldHRlckRlZmluaXRpb25zLnNldChsZXR0ZXJUZXh0dXJlLmhhc2gsIGxldHRlckRlZmluaXRpb24pO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIGNvbnN0IHJlZ2lvbiA9IG5ldyBHRlhCdWZmZXJUZXh0dXJlQ29weSgpO1xyXG4gICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCA9IGxldHRlckRlZmluaXRpb24ub2Zmc2V0WDtcclxuICAgICAgICByZWdpb24udGV4T2Zmc2V0LnkgPSBsZXR0ZXJEZWZpbml0aW9uLm9mZnNldFk7XHJcbiAgICAgICAgcmVnaW9uLnRleEV4dGVudC53aWR0aCA9IGxldHRlckRlZmluaXRpb24udztcclxuICAgICAgICByZWdpb24udGV4RXh0ZW50LmhlaWdodCA9IGxldHRlckRlZmluaXRpb24uaDtcclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICByZXR1cm4gbGV0dGVyRGVmaW5pdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2RpcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy50ZXh0dXJlLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICB0aGlzLl94ID0gc3BhY2U7XHJcbiAgICAgICAgdGhpcy5feSA9IHNwYWNlO1xyXG4gICAgICAgIHRoaXMuX25leHRZID0gc3BhY2U7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGNoYXJzID0gdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnM7XHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDAsIGwgPSAoT2JqZWN0LmtleXMoY2hhcnMpKS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgY29uc3QgY2hhciA9IGNoYXJzW2ldO1xyXG4gICAgICAgIC8vICAgICBpZiAoIWNoYXIudmFsaWQpIHtcclxuICAgICAgICAvLyAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIGNoYXIuZGVzdHJveSgpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnMgPSBjcmVhdGVNYXAoKTtcclxuICAgICAgICB0aGlzLl9sZXR0ZXJEZWZpbml0aW9ucy5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMudGV4dHVyZSl7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiZWZvcmVTY2VuZUxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IExldHRlclJlbmRlclRleHR1cmUoKTtcclxuICAgICAgICB0ZXh0dXJlLmluaXRXaXRoU2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuICAgICAgICAvLyB0ZXh0dXJlLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMZXR0ZXIgKGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xldHRlckRlZmluaXRpb25zLmdldChrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRMZXR0ZXJEZWZpbml0aW9ucyAoa2V5OiBzdHJpbmcsIGxldHRlckRlZmluaXRpb246IEZvbnRMZXR0ZXJEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNba2V5XSA9IGxldHRlckRlZmluaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lTGV0dGVyRGVmaW5pdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgY29weUxldHRlckRlZmluaXRpb25zID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fbGV0dGVyRGVmaW5pdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbmV3IEZvbnRMZXR0ZXJEZWZpbml0aW9uKCk7XHJcbiAgICAgICAgICAgIG1peGluKHZhbHVlLCB0aGlzLl9sZXR0ZXJEZWZpbml0aW9uc1trZXldKTtcclxuICAgICAgICAgICAgY29weUxldHRlckRlZmluaXRpb25zW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvcHlMZXR0ZXJEZWZpbml0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXNzaWduTGV0dGVyRGVmaW5pdGlvbnMgKGxldHRlckRlZmluaXRpb25zOiBNYXA8c3RyaW5nLCBGb250TGV0dGVyRGVmaW5pdGlvbj4gKSB7XHJcbiAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX2xldHRlckRlZmluaXRpb25zW2tleV07XHJcbiAgICAgICAgICAgIG1peGluKG9sZFZhbHVlLCB2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNjYWxlRm9udExldHRlckRlZmluaXRpb24gKHNjYWxlRmFjdG9yOiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGZvbnREZWZpbml0aW9uIG9mIE9iamVjdC5rZXlzKHRoaXMuX2xldHRlckRlZmluaXRpb25zKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsZXR0ZXJEZWZpbml0aW9ucyA9IHRoaXMuX2xldHRlckRlZmluaXRpb25zW2ZvbnREZWZpbml0aW9uXTtcclxuICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMudyAqPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMuaCAqPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMub2Zmc2V0WCAqPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMub2Zmc2V0WSAqPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMueEFkdmFuY2UgKj0gc2NhbGVGYWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhciAoY2hhcjogc3RyaW5nLCBsYWJlbEluZm86IElMYWJlbEluZm8pIHtcclxuICAgICAgICBjb25zdCBoYXNoID0gY2hhci5jaGFyQ29kZUF0KDApICsgbGFiZWxJbmZvLmhhc2g7XHJcbiAgICAgICAgbGV0IGxldHRlckRlZmluaXRpb246IEZvbnRMZXR0ZXJEZWZpbml0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHRoaXMuX2xldHRlckRlZmluaXRpb25zLmdldChoYXNoKTtcclxuICAgICAgICBpZiAoIWxldHRlckRlZmluaXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5ldyBMZXR0ZXJUZXh0dXJlKGNoYXIsIGxhYmVsSW5mbyk7XHJcbiAgICAgICAgICAgIHRlbXAudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9uID0gdGhpcy5pbnNlcnRMZXR0ZXJUZXh0dXJlKHRlbXApO1xyXG4gICAgICAgICAgICB0ZW1wLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsZXR0ZXJEZWZpbml0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBfdG1wUmVjdCA9IG5ldyBSZWN0KCk7XHJcblxyXG5sZXQgX2NvbXA6IExhYmVsIHwgbnVsbCA9IG51bGw7XHJcbmxldCBfdWlUcmFuczogVUlUcmFuc2Zvcm0gfCBudWxsID0gbnVsbDtcclxuXHJcbmNvbnN0IF9ob3Jpem9udGFsS2VybmluZzogbnVtYmVyW10gPSBbXTtcclxuY29uc3QgX2xldHRlcnNJbmZvOiBMZXR0ZXJJbmZvW10gPSBbXTtcclxuY29uc3QgX2xpbmVzV2lkdGg6IG51bWJlcltdID0gW107XHJcbmNvbnN0IF9saW5lc09mZnNldFg6IG51bWJlcltdID0gW107XHJcbmNvbnN0IF9sYWJlbERpbWVuc2lvbnMgPSBuZXcgU2l6ZSgpO1xyXG5cclxubGV0IF9mb250QXRsYXM6IExldHRlckF0bGFzIHwgbnVsbCA9IG51bGw7XHJcbmNvbnN0IF9mbnRDb25maWcgPSBudWxsO1xyXG5sZXQgX251bWJlck9mTGluZXMgPSAwO1xyXG5sZXQgX3RleHREZXNpcmVkSGVpZ2h0ID0gMDtcclxubGV0IF9sZXR0ZXJPZmZzZXRZID0gMDtcclxubGV0IF90YWlsb3JlZFRvcFkgPSAwO1xyXG5sZXQgX3RhaWxvcmVkQm90dG9tWSA9IDA7XHJcbmxldCBfYm1mb250U2NhbGUgPSAxLjA7XHJcbmNvbnN0IF9saW5lQnJlYWtXaXRob3V0U3BhY2VzID0gZmFsc2U7XHJcbmNvbnN0IF9saW5lU3BhY2luZyA9IDA7XHJcbmxldCBfc3RyaW5nID0gJyc7XHJcbmxldCBfZm9udFNpemUgPSAwO1xyXG5sZXQgX29yaWdpbkZvbnRTaXplID0gMDtcclxuY29uc3QgX2NvbnRlbnRTaXplID0gbmV3IFNpemUoKTtcclxubGV0IF9oQWxpZ24gPSAwO1xyXG5sZXQgX3ZBbGlnbiA9IDA7XHJcbmxldCBfc3BhY2luZ1ggPSAwO1xyXG5sZXQgX2xpbmVIZWlnaHQgPSAwO1xyXG5sZXQgX292ZXJmbG93ID0gMDtcclxubGV0IF9pc1dyYXBUZXh0ID0gZmFsc2U7XHJcbmxldCBfbGFiZWxXaWR0aCA9IDA7XHJcbmxldCBfbGFiZWxIZWlnaHQgPSAwO1xyXG5sZXQgX21heExpbmVXaWR0aCA9IDA7XHJcbmNvbnN0IF9hdGxhc1dpZHRoID0gMTAyNDtcclxuY29uc3QgX2F0bGFzSGVpZ2h0ID0gMTAyNDtcclxubGV0IF9mb250RmFtaWx5ID0gJyc7XHJcbmxldCBfaXNCb2xkID0gZmFsc2U7XHJcbmNvbnN0IF9sYWJlbEluZm86IElMYWJlbEluZm8gPSB7XHJcbiAgICBmb250U2l6ZTogMCxcclxuICAgIGxpbmVIZWlnaHQ6IDAsXHJcbiAgICBoYXNoOiAnJyxcclxuICAgIGZvbnRGYW1pbHk6ICcnLFxyXG4gICAgZm9udERlc2M6ICdBcmlhbCcsXHJcbiAgICBoQWxpZ246IDAsXHJcbiAgICB2QWxpZ246IDAsXHJcbiAgICBjb2xvcjogV0hJVEUsXHJcbiAgICBpc091dGxpbmVkOiBmYWxzZSxcclxuICAgIG91dDogV0hJVEUsXHJcbiAgICBtYXJnaW46IDAsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgbGV0dGVyRm9udCA9IHtcclxuICAgIGdldEFzc2VtYmxlckRhdGEgKCkge1xyXG4gICAgICAgIGlmICghX2ZvbnRBdGxhcykge1xyXG4gICAgICAgICAgICBfZm9udEF0bGFzID0gbmV3IExldHRlckF0bGFzKF9hdGxhc1dpZHRoLCBfYXRsYXNIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIF9mb250QXRsYXMudGV4dHVyZTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlUmVuZGVyRGF0YSAoY29tcDogTGFiZWwpIHtcclxuICAgICAgICBpZiAoIWNvbXAucmVuZGVyRGF0YSB8fCAhY29tcC5yZW5kZXJEYXRhLnZlcnREaXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX2NvbXAgPT09IGNvbXApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2NvbXAgPSBjb21wO1xyXG4gICAgICAgIF91aVRyYW5zID0gY29tcC5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRm9udEZhbWlseShjb21wKTtcclxuICAgICAgICBfbGFiZWxJbmZvLmZvbnRGYW1pbHkgPSBfZm9udEZhbWlseTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvcGVydGllcygpO1xyXG4gICAgICAgIF9sYWJlbEluZm8uZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVDb250ZW50KCk7XHJcblxyXG4gICAgICAgIF9jb21wLmFjdHVhbEZvbnRTaXplID0gX2ZvbnRTaXplO1xyXG4gICAgICAgIF91aVRyYW5zIS5zZXRDb250ZW50U2l6ZShfY29udGVudFNpemUpO1xyXG5cclxuICAgICAgICBfY29tcC5yZW5kZXJEYXRhIS52ZXJ0RGlydHkgPSBfY29tcC5yZW5kZXJEYXRhIS51dkRpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIF9jb21wID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVzZXRQcm9wZXJ0aWVzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF91cGRhdGVGb250U2NhbGUgKCkge1xyXG4gICAgICAgIF9ibWZvbnRTY2FsZSA9IF9mb250U2l6ZSAvIF9vcmlnaW5Gb250U2l6ZTtcclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZVByb3BlcnRpZXMgKCkge1xyXG4gICAgICAgIGlmICghX2NvbXApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfc3RyaW5nID0gX2NvbXAuc3RyaW5nLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgX2ZvbnRTaXplID0gX2NvbXAuZm9udFNpemU7XHJcbiAgICAgICAgX29yaWdpbkZvbnRTaXplID0gX2ZvbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRTaXplID0gX3VpVHJhbnMhLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IGNvbnRlbnRTaXplLndpZHRoO1xyXG4gICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgPSBjb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgX2hBbGlnbiA9IF9jb21wLmhvcml6b250YWxBbGlnbjtcclxuICAgICAgICBfdkFsaWduID0gX2NvbXAudmVydGljYWxBbGlnbjtcclxuICAgICAgICBfc3BhY2luZ1ggPSBfY29tcC5zcGFjaW5nWDtcclxuICAgICAgICBfb3ZlcmZsb3cgPSBfY29tcC5vdmVyZmxvdztcclxuICAgICAgICBfbGluZUhlaWdodCA9IF9jb21wLmxpbmVIZWlnaHQ7XHJcbiAgICAgICAgX2lzQm9sZCA9IF9jb21wLmlzQm9sZDtcclxuXHJcbiAgICAgICAgLy8gc2hvdWxkIHdyYXAgdGV4dFxyXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93Lk5PTkUpIHtcclxuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XHJcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gX2NvbXAuZW5hYmxlV3JhcFRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBvdXRsaW5lXHJcbiAgICAgICAgY29uc3Qgb3V0bGluZTogTGFiZWxPdXRsaW5lIHwgbnVsbCA9IC8qT1VUTElORV9TVVBQT1JURUQgJiYgKi9fY29tcC5nZXRDb21wb25lbnQoTGFiZWxPdXRsaW5lKTtcclxuICAgICAgICBpZiAob3V0bGluZSAmJiBvdXRsaW5lLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgX2xhYmVsSW5mby5pc091dGxpbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgX2xhYmVsSW5mby5tYXJnaW4gPSBvdXRsaW5lLndpZHRoO1xyXG4gICAgICAgICAgICBfbGFiZWxJbmZvLm91dCA9IG91dGxpbmUuY29sb3I7XHJcbiAgICAgICAgICAgIF9sYWJlbEluZm8ub3V0LmEgPSBvdXRsaW5lLmNvbG9yLmEgKiBfY29tcC5jb2xvci5hIC8gMjU1LjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBfbGFiZWxJbmZvLmlzT3V0bGluZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgX2xhYmVsSW5mby5tYXJnaW4gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2xhYmVsSW5mby5saW5lSGVpZ2h0ID0gX2xpbmVIZWlnaHQ7XHJcbiAgICAgICAgX2xhYmVsSW5mby5mb250U2l6ZSA9IF9mb250U2l6ZTtcclxuICAgICAgICBfbGFiZWxJbmZvLmZvbnRGYW1pbHkgPSBfZm9udEZhbWlseTtcclxuICAgICAgICBfbGFiZWxJbmZvLmNvbG9yID0gX2NvbXAuY29sb3I7XHJcbiAgICAgICAgX2xhYmVsSW5mby5oYXNoID0gdGhpcy5fY29tcHV0ZUhhc2goX2xhYmVsSW5mbyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBfdXBkYXRlRm9udEZhbWlseSAoY29tcDogTGFiZWwpIHtcclxuICAgICAgICBpZiAoIWNvbXAudXNlU3lzdGVtRm9udCkge1xyXG4gICAgICAgICAgICBpZiAoY29tcC5mb250KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5mb250Ll9uYXRpdmVBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9mb250RmFtaWx5ID0gY29tcC5mb250Ll9uYXRpdmVBc3NldDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF9mb250RmFtaWx5ID0gbG9hZGVyLmdldFJlcyhjb21wLmZvbnQubmF0aXZlVXJsKSB8fCAnJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIV9mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlci5sb2FkKGNvbXAuZm9udC5uYXRpdmVVcmwsIChlcnIsIGZvbnRGYW1pbHkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mb250RmFtaWx5ID0gZm9udEZhbWlseSB8fCAnQXJpYWwnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAuZm9udCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcC5mb250Ll9uYXRpdmVBc3NldCA9IGZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcC51cGRhdGVSZW5kZXJEYXRhKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfZm9udEZhbWlseSA9ICdBcmlhbCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF9mb250RmFtaWx5ID0gY29tcC5mb250RmFtaWx5O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2NvbXB1dGVIYXNoIChsYWJlbEluZm86IElMYWJlbEluZm8pIHtcclxuICAgICAgICBjb25zdCBoYXNoRGF0YSA9ICcnO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gbGFiZWxJbmZvLmNvbG9yLnRvSEVYKCcjcnJnZ2JiJyk7XHJcbiAgICAgICAgbGV0IG91dCA9ICcnO1xyXG4gICAgICAgIGlmIChsYWJlbEluZm8uaXNPdXRsaW5lZCkge1xyXG4gICAgICAgICAgICBvdXQgPSBsYWJlbEluZm8ub3V0LnRvSEVYKCcjcnJnZ2JiJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGFzaERhdGEgKyBsYWJlbEluZm8uZm9udFNpemUgKyBsYWJlbEluZm8uZm9udEZhbWlseSArIGNvbG9yICsgb3V0O1xyXG4gICAgfSxcclxuXHJcbiAgICBfZ2V0Rm9udERlc2MgKCkge1xyXG4gICAgICAgIGxldCBmb250RGVzYyA9IF9mb250U2l6ZS50b1N0cmluZygpICsgJ3B4ICc7XHJcbiAgICAgICAgZm9udERlc2MgPSBmb250RGVzYyArIF9mb250RmFtaWx5O1xyXG4gICAgICAgIGlmIChfaXNCb2xkKSB7XHJcbiAgICAgICAgICAgIGZvbnREZXNjID0gJ2JvbGQgJyArIGZvbnREZXNjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZvbnREZXNjO1xyXG4gICAgfSxcclxuXHJcbiAgICBfcmVzZXRQcm9wZXJ0aWVzICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF91cGRhdGVDb250ZW50ICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVGb250U2NhbGUoKTtcclxuICAgICAgICAvLyB0aGlzLl9jb21wdXRlSG9yaXpvbnRhbEtlcm5pbmdGb3JUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5fYWxpZ25UZXh0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9jb21wdXRlSG9yaXpvbnRhbEtlcm5pbmdGb3JUZXh0ICgpIHtcclxuICAgICAgICAvLyBjb25zdCBzdHJpbmcgPSBfc3RyaW5nO1xyXG4gICAgICAgIC8vIGNvbnN0IHN0cmluZ0xlbiA9IHN0cmluZy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGtlcm5pbmdEaWN0ID0gX2ZudENvbmZpZy5rZXJuaW5nRGljdDtcclxuICAgICAgICAvLyBjb25zdCBob3Jpem9udGFsS2VybmluZyA9IF9ob3Jpem9udGFsS2VybmluZztcclxuXHJcbiAgICAgICAgLy8gbGV0IHByZXYgPSAtMTtcclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmluZ0xlbjsgKytpKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnN0IGtleSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIC8vICAgICBjb25zdCBrZXJuaW5nQW1vdW50ID0ga2VybmluZ0RpY3RbKHByZXYgPDwgMTYpIHwgKGtleSAmIDB4ZmZmZildIHx8IDA7XHJcbiAgICAgICAgLy8gICAgIGlmIChpIDwgc3RyaW5nTGVuIC0gMSkge1xyXG4gICAgICAgIC8vICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdbaV0gPSBrZXJuaW5nQW1vdW50O1xyXG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdbaV0gPSAwO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIHByZXYgPSBrZXk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbXVsdGlsaW5lVGV4dFdyYXAgKG5leHRUb2tlbkZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dExlbiA9IF9zdHJpbmcubGVuZ3RoO1xyXG5cclxuICAgICAgICBsZXQgbGluZUluZGV4ID0gMDtcclxuICAgICAgICBsZXQgbmV4dFRva2VuWCA9IDA7XHJcbiAgICAgICAgbGV0IG5leHRUb2tlblkgPSAwO1xyXG4gICAgICAgIGxldCBsb25nZXN0TGluZSA9IDA7XHJcbiAgICAgICAgbGV0IGxldHRlclJpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGhpZ2hlc3RZID0gMDtcclxuICAgICAgICBsZXQgbG93ZXN0WSA9IDA7XHJcbiAgICAgICAgbGV0IGxldHRlckRlZjogRm9udExldHRlckRlZmluaXRpb24gfCBudWxsID0gbnVsbDtcclxuICAgICAgICBjb25zdCBsZXR0ZXJQb3NpdGlvbiA9IG5ldyBWZWMyKDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVGb250U2NhbGUoKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRleHRMZW47KSB7XHJcbiAgICAgICAgICAgIGxldCBjaGFyYWN0ZXIgPSBfc3RyaW5nLmNoYXJBdChpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICdcXG4nKSB7XHJcbiAgICAgICAgICAgICAgICBfbGluZXNXaWR0aC5wdXNoKGxldHRlclJpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgIGxpbmVJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgbmV4dFRva2VuWCA9IDA7XHJcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IF9saW5lSGVpZ2h0ICogX2JtZm9udFNjYWxlICsgX2xpbmVTcGFjaW5nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGluZGV4LCBjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkxlbiA9IG5leHRUb2tlbkZ1bmMoX3N0cmluZywgaW5kZXgsIHRleHRMZW4pO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW5IaWdoZXN0WSA9IGhpZ2hlc3RZO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW5Mb3dlc3RZID0gbG93ZXN0WTtcclxuICAgICAgICAgICAgbGV0IHRva2VuUmlnaHQgPSBsZXR0ZXJSaWdodDtcclxuICAgICAgICAgICAgbGV0IG5leHRMZXR0ZXJYID0gbmV4dFRva2VuWDtcclxuICAgICAgICAgICAgbGV0IG5ld0xpbmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHRtcCA9IDA7IHRtcCA8IHRva2VuTGVuOyArK3RtcCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGV0dGVySW5kZXggPSBpbmRleCArIHRtcDtcclxuICAgICAgICAgICAgICAgIGNoYXJhY3RlciA9IF9zdHJpbmcuY2hhckF0KGxldHRlckluZGV4KTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICdcXHInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGxldHRlckluZGV4LCBjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldHRlckRlZiA9IF9mb250QXRsYXMgJiYgX2ZvbnRBdGxhcy5nZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhcihjaGFyYWN0ZXIsIF9sYWJlbEluZm8pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXJhY3Rlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF9pc1dyYXBUZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgX21heExpbmVXaWR0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAmJiBuZXh0VG9rZW5YID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICYmIGxldHRlclggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZSA+IF9tYXhMaW5lV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAmJiAhaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9saW5lc1dpZHRoLnB1c2gobGV0dGVyUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lSW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VG9rZW5YID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IChfbGluZUhlaWdodCAqIF9ibWZvbnRTY2FsZSArIF9saW5lU3BhY2luZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TGluZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnggPSBsZXR0ZXJYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldHRlclBvc2l0aW9uLnkgPSBuZXh0VG9rZW5ZIC0gbGV0dGVyRGVmLm9mZnNldFkgKiBfYm1mb250U2NhbGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRMZXR0ZXJJbmZvKGxldHRlclBvc2l0aW9uLCBjaGFyYWN0ZXIsIGxldHRlckluZGV4LCBsaW5lSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXJJbmRleCArIDEgPCBfaG9yaXpvbnRhbEtlcm5pbmcubGVuZ3RoICYmIGxldHRlckluZGV4IDwgdGV4dExlbiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBfaG9yaXpvbnRhbEtlcm5pbmdbbGV0dGVySW5kZXggKyAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1g7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9rZW5SaWdodCA9IGxldHRlclBvc2l0aW9uLnggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5IaWdoZXN0WSA8IGxldHRlclBvc2l0aW9uLnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbkhpZ2hlc3RZID0gbGV0dGVyUG9zaXRpb24ueTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5Mb3dlc3RZID4gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5Mb3dlc3RZID0gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSAvLyBlbmQgb2YgZm9yIGxvb3BcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdMaW5lKSB7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgICAgICBuZXh0VG9rZW5YID0gbmV4dExldHRlclg7XHJcbiAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gdG9rZW5SaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmIChoaWdoZXN0WSA8IHRva2VuSGlnaGVzdFkpIHtcclxuICAgICAgICAgICAgICAgIGhpZ2hlc3RZID0gdG9rZW5IaWdoZXN0WTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobG93ZXN0WSA+IHRva2VuTG93ZXN0WSkge1xyXG4gICAgICAgICAgICAgICAgbG93ZXN0WSA9IHRva2VuTG93ZXN0WTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobG9uZ2VzdExpbmUgPCBsZXR0ZXJSaWdodCkge1xyXG4gICAgICAgICAgICAgICAgbG9uZ2VzdExpbmUgPSBsZXR0ZXJSaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5kZXggKz0gdG9rZW5MZW47XHJcbiAgICAgICAgfSAvLyBlbmQgb2YgZm9yIGxvb3BcclxuXHJcbiAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XHJcblxyXG4gICAgICAgIF9udW1iZXJPZkxpbmVzID0gbGluZUluZGV4ICsgMTtcclxuICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgPSBfbnVtYmVyT2ZMaW5lcyAqIF9saW5lSGVpZ2h0ICogX2JtZm9udFNjYWxlO1xyXG4gICAgICAgIGlmIChfbnVtYmVyT2ZMaW5lcyA+IDEpIHtcclxuICAgICAgICAgICAgX3RleHREZXNpcmVkSGVpZ2h0ICs9IChfbnVtYmVyT2ZMaW5lcyAtIDEpICogX2xpbmVTcGFjaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoID0gX2xhYmVsV2lkdGg7XHJcbiAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCA9IF9sYWJlbEhlaWdodDtcclxuICAgICAgICBpZiAoX2xhYmVsV2lkdGggPD0gMCkge1xyXG4gICAgICAgICAgICBfY29udGVudFNpemUud2lkdGggPSBwYXJzZUZsb2F0KGxvbmdlc3RMaW5lLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX2xhYmVsSGVpZ2h0IDw9IDApIHtcclxuICAgICAgICAgICAgX2NvbnRlbnRTaXplLmhlaWdodCA9IHBhcnNlRmxvYXQoX3RleHREZXNpcmVkSGVpZ2h0LnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX3RhaWxvcmVkVG9wWSA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgX3RhaWxvcmVkQm90dG9tWSA9IDA7XHJcbiAgICAgICAgaWYgKGhpZ2hlc3RZID4gMCkge1xyXG4gICAgICAgICAgICBfdGFpbG9yZWRUb3BZID0gX2NvbnRlbnRTaXplLmhlaWdodCArIGhpZ2hlc3RZO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG93ZXN0WSA8IC1fdGV4dERlc2lyZWRIZWlnaHQpIHtcclxuICAgICAgICAgICAgX3RhaWxvcmVkQm90dG9tWSA9IF90ZXh0RGVzaXJlZEhlaWdodCArIGxvd2VzdFk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgX2dldEZpcnN0Q2hhckxlbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRGaXJzdFdvcmRMZW4gKHRleHQ6IHN0cmluZywgc3RhcnRJbmRleDogbnVtYmVyLCB0ZXh0TGVuOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoc3RhcnRJbmRleCk7XHJcbiAgICAgICAgaWYgKGlzVW5pY29kZUNKSyhjaGFyYWN0ZXIpIHx8IGNoYXJhY3RlciA9PT0gJ1xcbicgfHwgaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghX2ZvbnRBdGxhcyl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsZW4gPSAxO1xyXG4gICAgICAgIGxldCBsZXR0ZXJEZWYgPSBfZm9udEF0bGFzLmdldExldHRlckRlZmluaXRpb25Gb3JDaGFyKGNoYXJhY3RlciwgX2xhYmVsSW5mbyk7XHJcbiAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG5leHRMZXR0ZXJYID0gbGV0dGVyRGVmLnhBZHZhbmNlICogX2JtZm9udFNjYWxlICsgX3NwYWNpbmdYO1xyXG4gICAgICAgIGxldCBsZXR0ZXJYOiBudW1iZXI7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4ICsgMTsgaW5kZXggPCB0ZXh0TGVuOyArK2luZGV4KSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IHRleHQuY2hhckF0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGxldHRlckRlZiA9IF9mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBfbGFiZWxJbmZvKTtcclxuICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldHRlclggPSBuZXh0TGV0dGVyWCArIGxldHRlckRlZi5vZmZzZXRYICogX2JtZm9udFNjYWxlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxldHRlclggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZSA+IF9tYXhMaW5lV2lkdGhcclxuICAgICAgICAgICAgICAgICYmICFpc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgICAgICAmJiBfbWF4TGluZVdpZHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1g7XHJcbiAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICdcXG4nIHx8IGlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikgfHwgaXNVbmljb2RlQ0pLKGNoYXJhY3RlcikpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxlbisrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxlbjtcclxuICAgIH0sXHJcblxyXG4gICAgX211bHRpbGluZVRleHRXcmFwQnlXb3JkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXAodGhpcy5fZ2V0Rmlyc3RXb3JkTGVuKTtcclxuICAgIH0sXHJcblxyXG4gICAgX211bHRpbGluZVRleHRXcmFwQnlDaGFyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXAodGhpcy5fZ2V0Rmlyc3RDaGFyTGVuKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3JlY29yZFBsYWNlaG9sZGVySW5mbyAobGV0dGVySW5kZXg6IG51bWJlciwgY2hhcjogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGxldHRlckluZGV4ID49IF9sZXR0ZXJzSW5mby5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgdG1wSW5mbyA9IG5ldyBMZXR0ZXJJbmZvKCk7XHJcbiAgICAgICAgICAgIF9sZXR0ZXJzSW5mby5wdXNoKHRtcEluZm8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5jaGFyID0gY2hhcjtcclxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmhhc2ggPSBjaGFyLmNoYXJDb2RlQXQoMCkgKyBfbGFiZWxJbmZvLmhhc2g7XHJcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS52YWxpZCA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBfcmVjb3JkTGV0dGVySW5mbyAobGV0dGVyUG9zaXRpb246IFZlYzIsIGNoYXJhY3Rlcjogc3RyaW5nLCBsZXR0ZXJJbmRleDogbnVtYmVyLCBsaW5lSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChsZXR0ZXJJbmRleCA+PSBfbGV0dGVyc0luZm8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRtcEluZm8gPSBuZXcgTGV0dGVySW5mbygpO1xyXG4gICAgICAgICAgICBfbGV0dGVyc0luZm8ucHVzaCh0bXBJbmZvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY2hhciA9IGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGNoYXIgKyBfbGFiZWxJbmZvLmhhc2g7XHJcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5saW5lID0gbGluZUluZGV4O1xyXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uY2hhciA9IGNoYXJhY3RlcjtcclxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmhhc2ggPSBrZXk7XHJcbiAgICAgICAgY29uc3QgZm9udExldHRlciA9IF9mb250QXRsYXMgJiYgX2ZvbnRBdGxhcy5nZXRMZXR0ZXIoa2V5KTtcclxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnZhbGlkID0gZm9udExldHRlciA/ICEhZm9udExldHRlci52YWxpZCA6IGZhbHNlO1xyXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0ueCA9IGxldHRlclBvc2l0aW9uLng7XHJcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS55ID0gbGV0dGVyUG9zaXRpb24ueTtcclxuICAgIH0sXHJcblxyXG4gICAgX2FsaWduVGV4dCAoKSB7XHJcbiAgICAgICAgX3RleHREZXNpcmVkSGVpZ2h0ID0gMDtcclxuICAgICAgICBfbGluZXNXaWR0aC5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBpZiAoIV9saW5lQnJlYWtXaXRob3V0U3BhY2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX211bHRpbGluZVRleHRXcmFwQnlXb3JkKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUXVhZHMoKTtcclxuICAgICAgICAvLyBzaHJpbmtcclxuICAgICAgICAvLyBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcclxuICAgICAgICAvLyAgICAgaWYgKF9mb250U2l6ZSA+IDAgJiYgdGhpcy5faXNWZXJ0aWNhbENsYW1wKCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuX3Nocmlua0xhYmVsVG9Db250ZW50U2l6ZSh0aGlzLl9pc1ZlcnRpY2FsQ2xhbXApO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyBpZiAoIXRoaXMuX3VwZGF0ZVF1YWRzKCkpIHtcclxuICAgICAgICAvLyAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUodGhpcy5faXNIb3Jpem9udGFsQ2xhbXApO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2NhbGVGb250U2l6ZURvd24gKGZvbnRTaXplOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgc2hvdWxkVXBkYXRlQ29udGVudCA9IHRydWU7XHJcbiAgICAgICAgaWYgKCFmb250U2l6ZSkge1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IDAuMTtcclxuICAgICAgICAgICAgc2hvdWxkVXBkYXRlQ29udGVudCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfZm9udFNpemUgPSBmb250U2l6ZTtcclxuXHJcbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZUNvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2lzVmVydGljYWxDbGFtcCAoKSB7XHJcbiAgICAgICAgaWYgKF90ZXh0RGVzaXJlZEhlaWdodCA+IF9jb250ZW50U2l6ZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX2lzSG9yaXpvbnRhbENsYW1wICgpIHtcclxuICAgICAgICBsZXQgbGV0dGVyQ2xhbXAgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBjdHIgPSAwLCBsID0gX3N0cmluZy5sZW5ndGg7IGN0ciA8IGw7ICsrY3RyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxldHRlckluZm8gPSBfbGV0dGVyc0luZm9bY3RyXTtcclxuICAgICAgICAgICAgaWYgKGxldHRlckluZm8udmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxldHRlckRlZiA9IF9mb250QXRsYXMhLmdldExldHRlcihsZXR0ZXJJbmZvLmhhc2gpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHB4ID0gbGV0dGVySW5mby54ICsgbGV0dGVyRGVmLncgKiBfYm1mb250U2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lSW5kZXggPSBsZXR0ZXJJbmZvLmxpbmU7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2xhYmVsV2lkdGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXNXcmFwVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHggPiBfY29udGVudFNpemUud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlckNsYW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd29yZFdpZHRoID0gX2xpbmVzV2lkdGhbbGluZUluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRXaWR0aCA+IF9jb250ZW50U2l6ZS53aWR0aCAmJiAocHggPiBfY29udGVudFNpemUud2lkdGggfHwgcHggPCAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyQ2xhbXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsZXR0ZXJDbGFtcDtcclxuICAgIH0sXHJcblxyXG4gICAgX2lzSG9yaXpvbnRhbENsYW1wZWQgKHB4OiBudW1iZXIsIGxpbmVJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgd29yZFdpZHRoID0gX2xpbmVzV2lkdGhbbGluZUluZGV4XTtcclxuICAgICAgICBjb25zdCBsZXR0ZXJPdmVyQ2xhbXAgPSAocHggPiBfY29udGVudFNpemUud2lkdGggfHwgcHggPCAwKTtcclxuXHJcbiAgICAgICAgaWYgKCFfaXNXcmFwVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGV0dGVyT3ZlckNsYW1wO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAod29yZFdpZHRoID4gX2NvbnRlbnRTaXplLndpZHRoICYmIGxldHRlck92ZXJDbGFtcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfdXBkYXRlUXVhZHMgKCkge1xyXG4gICAgICAgIGlmICghX2NvbXAgfHwgIV9mb250QXRsYXMpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gX2ZvbnRBdGxhcy50ZXh0dXJlO1xyXG5cclxuICAgICAgICBjb25zdCBub2RlID0gX2NvbXAubm9kZTtcclxuICAgICAgICBjb25zdCByZW5kZXJEYXRhID0gX2NvbXAucmVuZGVyRGF0YSE7XHJcbiAgICAgICAgcmVuZGVyRGF0YS5kYXRhTGVuZ3RoID0gcmVuZGVyRGF0YS52ZXJ0ZXhDb3VudCA9IHJlbmRlckRhdGEuaW5kaWNlc0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudFNpemUgPSBfY29udGVudFNpemU7XHJcbiAgICAgICAgY29uc3QgYXAgPSBfdWlUcmFucyEuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgY29uc3QgYXBwWCA9IGFwLnggKiBjb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICBjb25zdCBhcHBZID0gYXAueSAqIGNvbnRlbnRTaXplLmhlaWdodDtcclxuXHJcbiAgICAgICAgbGV0IHJldCA9IHRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgY3RyID0gMCwgbCA9IF9zdHJpbmcubGVuZ3RoOyBjdHIgPCBsOyArK2N0cikge1xyXG4gICAgICAgICAgICBjb25zdCBsZXR0ZXJJbmZvID0gX2xldHRlcnNJbmZvW2N0cl07XHJcbiAgICAgICAgICAgIGlmICghbGV0dGVySW5mby52YWxpZCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBjb25zdCBsZXR0ZXJEZWYgPSBfZm9udEF0bGFzLmdldExldHRlcihsZXR0ZXJJbmZvLmhhc2gpO1xyXG4gICAgICAgICAgICBpZiAoIWxldHRlckRlZil7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgX3RtcFJlY3QuaGVpZ2h0ID0gbGV0dGVyRGVmLmg7XHJcbiAgICAgICAgICAgIF90bXBSZWN0LndpZHRoID0gbGV0dGVyRGVmLnc7XHJcbiAgICAgICAgICAgIF90bXBSZWN0LnggPSBsZXR0ZXJEZWYudTtcclxuICAgICAgICAgICAgX3RtcFJlY3QueSA9IGxldHRlckRlZi52O1xyXG5cclxuICAgICAgICAgICAgbGV0IHB5ID0gbGV0dGVySW5mby55ICsgX2xldHRlck9mZnNldFk7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2xhYmVsSGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHB5ID4gX3RhaWxvcmVkVG9wWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsaXBUb3AgPSBweSAtIF90YWlsb3JlZFRvcFk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QueSArPSBjbGlwVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCAtPSBjbGlwVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHB5ID0gcHkgLSBjbGlwVG9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChweSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlIDwgX3RhaWxvcmVkQm90dG9tWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCA9IChweSA8IF90YWlsb3JlZEJvdHRvbVkpID8gMCA6IChweSAtIF90YWlsb3JlZEJvdHRvbVkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsaW5lSW5kZXggPSBsZXR0ZXJJbmZvLmxpbmU7XHJcbiAgICAgICAgICAgIGNvbnN0IHB4ID0gbGV0dGVySW5mby54ICsgbGV0dGVyRGVmLncgLyAyICogX2JtZm9udFNjYWxlICsgX2xpbmVzT2Zmc2V0WFtsaW5lSW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKF9sYWJlbFdpZHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzSG9yaXpvbnRhbENsYW1wZWQocHgsIGxpbmVJbmRleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5DTEFNUCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2NvbnRlbnRTaXplLndpZHRoID4gbGV0dGVyRGVmLncpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChfdG1wUmVjdC5oZWlnaHQgPiAwICYmIF90bXBSZWN0LndpZHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGV0dGVyUG9zaXRpb25YID0gbGV0dGVySW5mby54ICsgX2xpbmVzT2Zmc2V0WFtsZXR0ZXJJbmZvLmxpbmVdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRRdWFkKF9jb21wLCB0ZXh0dXJlLCBfdG1wUmVjdCwgZmFsc2UsIGxldHRlclBvc2l0aW9uWCAtIGFwcFgsIHB5IC0gYXBwWSwgX2JtZm9udFNjYWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcblxyXG4gICAgYXBwZW5kUXVhZCAocmVuZGVyRGF0YSwgdGV4dHVyZSwgcmVjdCwgcm90YXRlZCwgeCwgeSwgc2NhbGUpIHtcclxuICAgIH0sXHJcblxyXG4gICAgX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQgKCkge1xyXG4gICAgICAgIF9saW5lc09mZnNldFgubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChfaEFsaWduKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVGV4dEFsaWdubWVudC5MRUZUOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbnVtYmVyT2ZMaW5lczsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzT2Zmc2V0WC5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgVGV4dEFsaWdubWVudC5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9saW5lc1dpZHRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaCgoX2NvbnRlbnRTaXplLndpZHRoIC0gX2xpbmVzV2lkdGhbaV0pIC8gMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBUZXh0QWxpZ25tZW50LlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBfbGluZXNXaWR0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goX2NvbnRlbnRTaXplLndpZHRoIC0gX2xpbmVzV2lkdGhbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoX3ZBbGlnbikge1xyXG4gICAgICAgICAgICBjYXNlIFZlcnRpY2FsVGV4dEFsaWdubWVudC5UT1A6XHJcbiAgICAgICAgICAgICAgICBfbGV0dGVyT2Zmc2V0WSA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgPSAoX2NvbnRlbnRTaXplLmhlaWdodCArIF90ZXh0RGVzaXJlZEhlaWdodCkgLyAyIC0gKF9saW5lSGVpZ2h0IC0gX2ZvbnRTaXplKSAvIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuQk9UVE9NOlxyXG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgPSAoX2NvbnRlbnRTaXplLmhlaWdodCArIF90ZXh0RGVzaXJlZEhlaWdodCkgLyAyIC0gKF9saW5lSGVpZ2h0IC0gX2ZvbnRTaXplKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MgKCkge1xyXG4gICAgICAgIGxldCBuZXdXaWR0aCA9IF9jb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICBsZXQgbmV3SGVpZ2h0ID0gX2NvbnRlbnRTaXplLmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuUkVTSVpFX0hFSUdIVCkge1xyXG4gICAgICAgICAgICBuZXdIZWlnaHQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuTk9ORSkge1xyXG4gICAgICAgICAgICBuZXdXaWR0aCA9IDA7XHJcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfbGFiZWxXaWR0aCA9IG5ld1dpZHRoO1xyXG4gICAgICAgIF9sYWJlbEhlaWdodCA9IG5ld0hlaWdodDtcclxuICAgICAgICBfbGFiZWxEaW1lbnNpb25zLndpZHRoID0gbmV3V2lkdGg7XHJcbiAgICAgICAgX2xhYmVsRGltZW5zaW9ucy5oZWlnaHQgPSBuZXdIZWlnaHQ7XHJcbiAgICAgICAgX21heExpbmVXaWR0aCA9IG5ld1dpZHRoO1xyXG4gICAgfSxcclxufTtcclxuIl19