(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/utils/text-utils.js", "../../../core/math/index.js", "../../components/label.js", "../../../core/utils/index.js", "../../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/utils/text-utils.js"), require("../../../core/math/index.js"), require("../../components/label.js"), require("../../../core/utils/index.js"), require("../../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.textUtils, global.index, global.label, global.index, global.globalExports);
    global.bmfontUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _textUtils, _index, _label, _index2, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.bmfontUtils = _exports.FontAtlas = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var FontLetterDefinition = function FontLetterDefinition() {
    _classCallCheck(this, FontLetterDefinition);

    this.u = 0;
    this.v = 0;
    this.width = 0;
    this.height = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.textureID = 0;
    this.validDefinition = false;
    this.xAdvance = 0;
  };

  var FontAtlas = /*#__PURE__*/function () {
    function FontAtlas() {
      _classCallCheck(this, FontAtlas);

      this._letterDefinitions = {};
    }

    _createClass(FontAtlas, [{
      key: "addLetterDefinitions",
      value: function addLetterDefinitions(letter, letterDefinition) {
        this._letterDefinitions[letter] = letterDefinition;
      }
    }, {
      key: "cloneLetterDefinition",
      value: function cloneLetterDefinition() {
        var copyLetterDefinitions = {};

        for (var _i = 0, _Object$keys = Object.keys(this._letterDefinitions); _i < _Object$keys.length; _i++) {
          var _key = _Object$keys[_i];
          var value = new FontLetterDefinition();

          _index2.js.mixin(value, this._letterDefinitions[_key]);

          copyLetterDefinitions[_key] = value;
        }

        return copyLetterDefinitions;
      }
    }, {
      key: "assignLetterDefinitions",
      value: function assignLetterDefinitions(letterDefinition) {
        for (var _i2 = 0, _Object$keys2 = Object.keys(this._letterDefinitions); _i2 < _Object$keys2.length; _i2++) {
          var _key2 = _Object$keys2[_i2];
          var newValue = letterDefinition[_key2];
          var oldValue = this._letterDefinitions[_key2];

          _index2.js.mixin(oldValue, newValue);
        }
      }
    }, {
      key: "scaleFontLetterDefinition",
      value: function scaleFontLetterDefinition(scaleFactor) {
        for (var _i3 = 0, _Object$keys3 = Object.keys(this._letterDefinitions); _i3 < _Object$keys3.length; _i3++) {
          var fontDefinition = _Object$keys3[_i3];
          var letterDefinitions = this._letterDefinitions[fontDefinition];
          letterDefinitions.width *= scaleFactor;
          letterDefinitions.height *= scaleFactor;
          letterDefinitions.offsetX *= scaleFactor;
          letterDefinitions.offsetY *= scaleFactor;
          letterDefinitions.xAdvance *= scaleFactor;
        }
      }
    }, {
      key: "getLetterDefinitionForChar",
      value: function getLetterDefinitionForChar(_char) {
        return this._letterDefinitions[_char.charCodeAt(0)];
      }
    }, {
      key: "letterDefinitions",
      get: function get() {
        return this._letterDefinitions;
      }
    }]);

    return FontAtlas;
  }();

  _exports.FontAtlas = FontAtlas;
  _globalExports.legacyCC.FontAtlas = FontAtlas;

  var LetterInfo = function LetterInfo() {
    _classCallCheck(this, LetterInfo);

    this["char"] = '';
    this.valid = true;
    this.positionX = 0;
    this.positionY = 0;
    this.lineIndex = 0;
  };

  var _tmpRect = new _index.Rect();

  var _comp = null;
  var _uiTrans = null;
  var _horizontalKerning = [];
  var _lettersInfo = [];
  var _linesWidth = [];
  var _linesOffsetX = [];

  var _labelDimensions = new _index.Size();

  var _fontAtlas = null;
  var _fntConfig = null;
  var _numberOfLines = 0;
  var _textDesiredHeight = 0;
  var _letterOffsetY = 0;
  var _tailoredTopY = 0;
  var _tailoredBottomY = 0;
  var _bmfontScale = 1.0;
  var _lineBreakWithoutSpaces = false;
  var _spriteFrame = null;
  var _lineSpacing = 0;
  var _string = '';
  var _fontSize = 0;
  var _originFontSize = 0;

  var _contentSize = new _index.Size();

  var _hAlign = 0;
  var _vAlign = 0;
  var _spacingX = 0;
  var _lineHeight = 0;
  var _overflow = 0;
  var _isWrapText = false;
  var _labelWidth = 0;
  var _labelHeight = 0;
  var _maxLineWidth = 0;
  var bmfontUtils = {
    updateRenderData: function updateRenderData(comp) {
      if (!comp.renderData || !comp.renderData.vertDirty) {
        return;
      }

      if (_comp === comp) {
        return;
      }

      _comp = comp;
      _uiTrans = _comp.node._uiProps.uiTransformComp;

      this._updateProperties();

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

      var fontAsset = _comp.font;

      if (!fontAsset) {
        return;
      }

      _spriteFrame = fontAsset.spriteFrame;
      _fntConfig = fontAsset.fntConfig;
      _fontAtlas = _comp.fontAtlas;

      if (!_fontAtlas) {
        _fontAtlas = new FontAtlas();
        var fontDict = _fntConfig.fontDefDictionary;

        for (var _i4 = 0, _Object$keys4 = Object.keys(fontDict); _i4 < _Object$keys4.length; _i4++) {
          var fontDef = _Object$keys4[_i4];
          var letterDefinition = new FontLetterDefinition();
          var rect = fontDict[fontDef].rect;
          letterDefinition.offsetX = fontDict[fontDef].xOffset;
          letterDefinition.offsetY = fontDict[fontDef].yOffset;
          letterDefinition.width = rect.width;
          letterDefinition.height = rect.height;
          letterDefinition.u = rect.x;
          letterDefinition.v = rect.y; // FIXME: only one texture supported for now

          letterDefinition.textureID = 0;
          letterDefinition.validDefinition = true;
          letterDefinition.xAdvance = fontDict[fontDef].xAdvance;

          _fontAtlas.addLetterDefinitions(fontDef, letterDefinition);
        }

        _comp.fontAtlas = _fontAtlas;
      }

      _string = _comp.string.toString();
      _fontSize = _comp.fontSize;
      _originFontSize = _fntConfig.fontSize;
      var contentSize = _uiTrans.contentSize;
      _contentSize.width = contentSize.width;
      _contentSize.height = contentSize.height;
      _hAlign = _comp.horizontalAlign;
      _vAlign = _comp.verticalAlign;
      _spacingX = _comp.spacingX;
      _overflow = _comp.overflow;
      _lineHeight = _comp.lineHeight; // should wrap text

      if (_overflow === _label.Overflow.NONE) {
        _isWrapText = false;
      } else if (_overflow === _label.Overflow.RESIZE_HEIGHT) {
        _isWrapText = true;
      } else {
        _isWrapText = _comp.enableWrapText;
      }

      this._setupBMFontOverflowMetrics();
    },
    _resetProperties: function _resetProperties() {
      _fontAtlas = null;
      _fntConfig = null;
      _spriteFrame = null;
    },
    _updateContent: function _updateContent() {
      this._updateFontScale();

      this._computeHorizontalKerningForText();

      this._alignText();
    },
    _computeHorizontalKerningForText: function _computeHorizontalKerningForText() {
      var string = _string;
      var stringLen = string.length;
      var kerningDict = _fntConfig.kerningDict;
      var horizontalKerning = _horizontalKerning;
      var prev = -1;

      for (var i = 0; i < stringLen; ++i) {
        var _key3 = string.charCodeAt(i);

        var kerningAmount = kerningDict[prev << 16 | _key3 & 0xffff] || 0;

        if (i < stringLen - 1) {
          horizontalKerning[i] = kerningAmount;
        } else {
          horizontalKerning[i] = 0;
        }

        prev = _key3;
      }
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
      var letterPosition = new _index.Vec2();

      this._updateFontScale();

      var letterDefinitions = _fontAtlas.letterDefinitions;

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

          letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character);

          if (!letterDef) {
            this._recordPlaceholderInfo(letterIndex, character);

            console.log('Can\'t find letter definition in texture atlas ' + _fntConfig.atlasName + ' for letter:' + character);
            continue;
          }

          var letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

          if (_isWrapText && _maxLineWidth > 0 && nextTokenX > 0 && letterX + letterDef.width * _bmfontScale > _maxLineWidth && !(0, _textUtils.isUnicodeSpace)(character)) {
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

          this._recordLetterInfo(letterDefinitions, letterPosition, character, letterIndex, lineIndex);

          if (letterIndex + 1 < _horizontalKerning.length && letterIndex < textLen - 1) {
            nextLetterX += _horizontalKerning[letterIndex + 1];
          }

          nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;
          tokenRight = letterPosition.x + letterDef.width * _bmfontScale;

          if (tokenHighestY < letterPosition.y) {
            tokenHighestY = letterPosition.y;
          }

          if (tokenLowestY > letterPosition.y - letterDef.height * _bmfontScale) {
            tokenLowestY = letterPosition.y - letterDef.height * _bmfontScale;
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

      if ((0, _textUtils.isUnicodeCJK)(character) || character === '\n' || (0, _textUtils.isUnicodeSpace)(character)) {
        return 1;
      }

      var len = 1;

      var letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character);

      if (!letterDef) {
        return len;
      }

      var nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
      var letterX = 0;

      for (var index = startIndex + 1; index < textLen; ++index) {
        character = text.charAt(index);
        letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character);

        if (!letterDef) {
          break;
        }

        letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

        if (letterX + letterDef.width * _bmfontScale > _maxLineWidth && !(0, _textUtils.isUnicodeSpace)(character) && _maxLineWidth > 0) {
          return len;
        }

        nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

        if (character === '\n' || (0, _textUtils.isUnicodeSpace)(character) || (0, _textUtils.isUnicodeCJK)(character)) {
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
    _recordPlaceholderInfo: function _recordPlaceholderInfo(letterIndex, _char2) {
      if (letterIndex >= _lettersInfo.length) {
        var tmpInfo = new LetterInfo();

        _lettersInfo.push(tmpInfo);
      }

      _lettersInfo[letterIndex]["char"] = _char2;
      _lettersInfo[letterIndex].valid = false;
    },
    _recordLetterInfo: function _recordLetterInfo(letterDefinitions, letterPosition, character, letterIndex, lineIndex) {
      if (letterIndex >= _lettersInfo.length) {
        var tmpInfo = new LetterInfo();

        _lettersInfo.push(tmpInfo);
      }

      var cIndex = character.charCodeAt(0);
      _lettersInfo[letterIndex].lineIndex = lineIndex;
      _lettersInfo[letterIndex]["char"] = character;
      _lettersInfo[letterIndex].valid = letterDefinitions[cIndex].validDefinition;
      _lettersInfo[letterIndex].positionX = letterPosition.x;
      _lettersInfo[letterIndex].positionY = letterPosition.y;
    },
    _alignText: function _alignText() {
      _textDesiredHeight = 0;
      _linesWidth.length = 0;

      if (!_lineBreakWithoutSpaces) {
        this._multilineTextWrapByWord();
      } else {
        this._multilineTextWrapByChar();
      }

      this._computeAlignmentOffset(); // shrink


      if (_overflow === _label.Overflow.SHRINK) {
        if (_fontSize > 0 && this._isVerticalClamp()) {
          this._shrinkLabelToContentSize(this._isVerticalClamp);
        }
      }

      if (!this._updateQuads()) {
        if (_overflow === _label.Overflow.SHRINK) {
          this._shrinkLabelToContentSize(this._isHorizontalClamp);
        }
      }
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
    _shrinkLabelToContentSize: function _shrinkLabelToContentSize(lambda) {
      var fontSize = _fontSize;
      var originalLineHeight = _lineHeight;
      var fontAtlas = _fontAtlas;
      var i = 0;
      var tempLetterDefinition = fontAtlas ? fontAtlas.cloneLetterDefinition() : {};
      var flag = true;

      while (lambda()) {
        ++i;
        var newFontSize = fontSize - i;
        flag = false;

        if (newFontSize <= 0) {
          break;
        }

        var scale = newFontSize / fontSize;

        if (fontAtlas) {
          fontAtlas.assignLetterDefinitions(tempLetterDefinition);
          fontAtlas.scaleFontLetterDefinition(scale);
        }

        _lineHeight = originalLineHeight * scale;

        if (!_lineBreakWithoutSpaces) {
          this._multilineTextWrapByWord();
        } else {
          this._multilineTextWrapByChar();
        }

        this._computeAlignmentOffset();
      }

      _lineHeight = originalLineHeight;

      if (fontAtlas) {
        fontAtlas.assignLetterDefinitions(tempLetterDefinition);
      }

      if (!flag) {
        if (fontSize - i >= 0) {
          this._scaleFontSizeDown(fontSize - i);
        }
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
      if (!_fontAtlas) {
        return;
      }

      var letterClamp = false;

      for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
        var letterInfo = _lettersInfo[ctr];

        if (letterInfo.valid) {
          var letterDef = _fontAtlas.getLetterDefinitionForChar(letterInfo["char"]);

          if (!letterDef) {
            continue;
          }

          var px = letterInfo.positionX + letterDef.width / 2 * _bmfontScale;
          var lineIndex = letterInfo.lineIndex;

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
      if (!_comp) {
        return false;
      }

      var letterDefinitions = _fontAtlas ? _fontAtlas.letterDefinitions : {};
      var texture = _spriteFrame;
      var renderData = _comp.renderData;
      renderData.dataLength = renderData.vertexCount = renderData.indicesCount = 0;
      var anchorPoint = _uiTrans.anchorPoint;
      var contentSize = _contentSize;
      var appX = anchorPoint.x * contentSize.width;
      var appY = anchorPoint.y * contentSize.height;
      var ret = true;

      for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
        var letterInfo = _lettersInfo[ctr];

        if (!letterInfo.valid) {
          continue;
        }

        var letterDef = letterDefinitions[letterInfo["char"].charCodeAt(0)];

        if (!letterDef) {
          console.warn('Can\'t find letter in this bitmap-font');
          continue;
        }

        _tmpRect.height = letterDef.height;
        _tmpRect.width = letterDef.width;
        _tmpRect.x = letterDef.u;
        _tmpRect.y = letterDef.v;
        var py = letterInfo.positionY + _letterOffsetY;

        if (_labelHeight > 0) {
          if (py > _tailoredTopY) {
            var clipTop = py - _tailoredTopY;
            _tmpRect.y += clipTop;
            _tmpRect.height -= clipTop;
            py = py - clipTop;
          }

          if (py - letterDef.height * _bmfontScale < _tailoredBottomY) {
            _tmpRect.height = py < _tailoredBottomY ? 0 : py - _tailoredBottomY;
          }
        }

        var lineIndex = letterInfo.lineIndex;
        var px = letterInfo.positionX + letterDef.width / 2 * _bmfontScale + _linesOffsetX[lineIndex];

        if (_labelWidth > 0) {
          if (this._isHorizontalClamped(px, lineIndex)) {
            if (_overflow === _label.Overflow.CLAMP) {
              _tmpRect.width = 0;
            } else if (_overflow === _label.Overflow.SHRINK) {
              if (_contentSize.width > letterDef.width) {
                ret = false;
                break;
              } else {
                _tmpRect.width = 0;
              }
            }
          }
        }

        if (_spriteFrame && _tmpRect.height > 0 && _tmpRect.width > 0) {
          var isRotated = _spriteFrame.isRotated();

          var originalSize = _spriteFrame.getOriginalSize();

          var rect = _spriteFrame.getRect();

          var offset = _spriteFrame.getOffset();

          var trimmedLeft = offset.x + (originalSize.width - rect.width) / 2;
          var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

          if (!isRotated) {
            _tmpRect.x += rect.x - trimmedLeft;
            _tmpRect.y += rect.y + trimmedTop;
          } else {
            var originalX = _tmpRect.x;
            _tmpRect.x = rect.x + rect.height - _tmpRect.y - _tmpRect.height - trimmedTop;
            _tmpRect.y = originalX + rect.y - trimmedLeft;

            if (_tmpRect.y < 0) {
              _tmpRect.height = _tmpRect.height + trimmedTop;
            }
          }

          var letterPositionX = letterInfo.positionX + _linesOffsetX[letterInfo.lineIndex];
          this.appendQuad(_comp, texture, _tmpRect, isRotated, letterPositionX - appX, py - appY, _bmfontScale);
        }
      }

      return ret;
    },
    appendQuad: function appendQuad(comp, texture, rect, rotated, x, y, scale) {},
    _computeAlignmentOffset: function _computeAlignmentOffset() {
      _linesOffsetX.length = 0;

      switch (_hAlign) {
        case _label.HorizontalTextAlignment.LEFT:
          for (var i = 0; i < _numberOfLines; ++i) {
            _linesOffsetX.push(0);
          }

          break;

        case _label.HorizontalTextAlignment.CENTER:
          for (var _i5 = 0, l = _linesWidth.length; _i5 < l; _i5++) {
            _linesOffsetX.push((_contentSize.width - _linesWidth[_i5]) / 2);
          }

          break;

        case _label.HorizontalTextAlignment.RIGHT:
          for (var _i6 = 0, _l = _linesWidth.length; _i6 < _l; _i6++) {
            _linesOffsetX.push(_contentSize.width - _linesWidth[_i6]);
          }

          break;

        default:
          break;
      }

      switch (_vAlign) {
        case _label.VerticalTextAlignment.TOP:
          _letterOffsetY = _contentSize.height;
          break;

        case _label.VerticalTextAlignment.CENTER:
          _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2;
          break;

        case _label.VerticalTextAlignment.BOTTOM:
          _letterOffsetY = _textDesiredHeight;
          break;

        default:
          break;
      }
    },
    _setupBMFontOverflowMetrics: function _setupBMFontOverflowMetrics() {
      var newWidth = _contentSize.width;
      var newHeight = _contentSize.height;

      if (_overflow === _label.Overflow.RESIZE_HEIGHT) {
        newHeight = 0;
      }

      if (_overflow === _label.Overflow.NONE) {
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
  _exports.bmfontUtils = bmfontUtils;
  var _default = bmfontUtils;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9sYWJlbC9ibWZvbnRVdGlscy50cyJdLCJuYW1lcyI6WyJGb250TGV0dGVyRGVmaW5pdGlvbiIsInUiLCJ2Iiwid2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsInRleHR1cmVJRCIsInZhbGlkRGVmaW5pdGlvbiIsInhBZHZhbmNlIiwiRm9udEF0bGFzIiwiX2xldHRlckRlZmluaXRpb25zIiwibGV0dGVyIiwibGV0dGVyRGVmaW5pdGlvbiIsImNvcHlMZXR0ZXJEZWZpbml0aW9ucyIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJ2YWx1ZSIsImpzIiwibWl4aW4iLCJuZXdWYWx1ZSIsIm9sZFZhbHVlIiwic2NhbGVGYWN0b3IiLCJmb250RGVmaW5pdGlvbiIsImxldHRlckRlZmluaXRpb25zIiwiY2hhciIsImNoYXJDb2RlQXQiLCJsZWdhY3lDQyIsIkxldHRlckluZm8iLCJ2YWxpZCIsInBvc2l0aW9uWCIsInBvc2l0aW9uWSIsImxpbmVJbmRleCIsIl90bXBSZWN0IiwiUmVjdCIsIl9jb21wIiwiX3VpVHJhbnMiLCJfaG9yaXpvbnRhbEtlcm5pbmciLCJfbGV0dGVyc0luZm8iLCJfbGluZXNXaWR0aCIsIl9saW5lc09mZnNldFgiLCJfbGFiZWxEaW1lbnNpb25zIiwiU2l6ZSIsIl9mb250QXRsYXMiLCJfZm50Q29uZmlnIiwiX251bWJlck9mTGluZXMiLCJfdGV4dERlc2lyZWRIZWlnaHQiLCJfbGV0dGVyT2Zmc2V0WSIsIl90YWlsb3JlZFRvcFkiLCJfdGFpbG9yZWRCb3R0b21ZIiwiX2JtZm9udFNjYWxlIiwiX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMiLCJfc3ByaXRlRnJhbWUiLCJfbGluZVNwYWNpbmciLCJfc3RyaW5nIiwiX2ZvbnRTaXplIiwiX29yaWdpbkZvbnRTaXplIiwiX2NvbnRlbnRTaXplIiwiX2hBbGlnbiIsIl92QWxpZ24iLCJfc3BhY2luZ1giLCJfbGluZUhlaWdodCIsIl9vdmVyZmxvdyIsIl9pc1dyYXBUZXh0IiwiX2xhYmVsV2lkdGgiLCJfbGFiZWxIZWlnaHQiLCJfbWF4TGluZVdpZHRoIiwiYm1mb250VXRpbHMiLCJ1cGRhdGVSZW5kZXJEYXRhIiwiY29tcCIsInJlbmRlckRhdGEiLCJ2ZXJ0RGlydHkiLCJub2RlIiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJfdXBkYXRlUHJvcGVydGllcyIsIl91cGRhdGVDb250ZW50IiwiYWN0dWFsRm9udFNpemUiLCJzZXRDb250ZW50U2l6ZSIsInV2RGlydHkiLCJfcmVzZXRQcm9wZXJ0aWVzIiwiX3VwZGF0ZUZvbnRTY2FsZSIsImZvbnRBc3NldCIsImZvbnQiLCJzcHJpdGVGcmFtZSIsImZudENvbmZpZyIsImZvbnRBdGxhcyIsImZvbnREaWN0IiwiZm9udERlZkRpY3Rpb25hcnkiLCJmb250RGVmIiwicmVjdCIsInhPZmZzZXQiLCJ5T2Zmc2V0IiwieCIsInkiLCJhZGRMZXR0ZXJEZWZpbml0aW9ucyIsInN0cmluZyIsInRvU3RyaW5nIiwiZm9udFNpemUiLCJjb250ZW50U2l6ZSIsImhvcml6b250YWxBbGlnbiIsInZlcnRpY2FsQWxpZ24iLCJzcGFjaW5nWCIsIm92ZXJmbG93IiwibGluZUhlaWdodCIsIk92ZXJmbG93IiwiTk9ORSIsIlJFU0laRV9IRUlHSFQiLCJlbmFibGVXcmFwVGV4dCIsIl9zZXR1cEJNRm9udE92ZXJmbG93TWV0cmljcyIsIl9jb21wdXRlSG9yaXpvbnRhbEtlcm5pbmdGb3JUZXh0IiwiX2FsaWduVGV4dCIsInN0cmluZ0xlbiIsImxlbmd0aCIsImtlcm5pbmdEaWN0IiwiaG9yaXpvbnRhbEtlcm5pbmciLCJwcmV2IiwiaSIsImtlcm5pbmdBbW91bnQiLCJfbXVsdGlsaW5lVGV4dFdyYXAiLCJuZXh0VG9rZW5GdW5jIiwidGV4dExlbiIsIm5leHRUb2tlblgiLCJuZXh0VG9rZW5ZIiwibG9uZ2VzdExpbmUiLCJsZXR0ZXJSaWdodCIsImhpZ2hlc3RZIiwibG93ZXN0WSIsImxldHRlckRlZiIsImxldHRlclBvc2l0aW9uIiwiVmVjMiIsImluZGV4IiwiY2hhcmFjdGVyIiwiY2hhckF0IiwicHVzaCIsIl9yZWNvcmRQbGFjZWhvbGRlckluZm8iLCJ0b2tlbkxlbiIsInRva2VuSGlnaGVzdFkiLCJ0b2tlbkxvd2VzdFkiLCJ0b2tlblJpZ2h0IiwibmV4dExldHRlclgiLCJuZXdMaW5lIiwidG1wIiwibGV0dGVySW5kZXgiLCJnZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhciIsImNvbnNvbGUiLCJsb2ciLCJhdGxhc05hbWUiLCJsZXR0ZXJYIiwiX3JlY29yZExldHRlckluZm8iLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsIl9nZXRGaXJzdENoYXJMZW4iLCJfZ2V0Rmlyc3RXb3JkTGVuIiwidGV4dCIsInN0YXJ0SW5kZXgiLCJsZW4iLCJfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQiLCJfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIiLCJ0bXBJbmZvIiwiY0luZGV4IiwiX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQiLCJTSFJJTksiLCJfaXNWZXJ0aWNhbENsYW1wIiwiX3Nocmlua0xhYmVsVG9Db250ZW50U2l6ZSIsIl91cGRhdGVRdWFkcyIsIl9pc0hvcml6b250YWxDbGFtcCIsIl9zY2FsZUZvbnRTaXplRG93biIsInNob3VsZFVwZGF0ZUNvbnRlbnQiLCJsYW1iZGEiLCJvcmlnaW5hbExpbmVIZWlnaHQiLCJ0ZW1wTGV0dGVyRGVmaW5pdGlvbiIsImNsb25lTGV0dGVyRGVmaW5pdGlvbiIsImZsYWciLCJuZXdGb250U2l6ZSIsInNjYWxlIiwiYXNzaWduTGV0dGVyRGVmaW5pdGlvbnMiLCJzY2FsZUZvbnRMZXR0ZXJEZWZpbml0aW9uIiwibGV0dGVyQ2xhbXAiLCJjdHIiLCJsIiwibGV0dGVySW5mbyIsInB4Iiwid29yZFdpZHRoIiwiX2lzSG9yaXpvbnRhbENsYW1wZWQiLCJsZXR0ZXJPdmVyQ2xhbXAiLCJ0ZXh0dXJlIiwiZGF0YUxlbmd0aCIsInZlcnRleENvdW50IiwiaW5kaWNlc0NvdW50IiwiYW5jaG9yUG9pbnQiLCJhcHBYIiwiYXBwWSIsInJldCIsIndhcm4iLCJweSIsImNsaXBUb3AiLCJDTEFNUCIsImlzUm90YXRlZCIsIm9yaWdpbmFsU2l6ZSIsImdldE9yaWdpbmFsU2l6ZSIsImdldFJlY3QiLCJvZmZzZXQiLCJnZXRPZmZzZXQiLCJ0cmltbWVkTGVmdCIsInRyaW1tZWRUb3AiLCJvcmlnaW5hbFgiLCJsZXR0ZXJQb3NpdGlvblgiLCJhcHBlbmRRdWFkIiwicm90YXRlZCIsIkhvcml6b250YWxUZXh0QWxpZ25tZW50IiwiTEVGVCIsIkNFTlRFUiIsIlJJR0hUIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiVE9QIiwiQk9UVE9NIiwibmV3V2lkdGgiLCJuZXdIZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BdUNNQSxvQjs7O1NBQ0tDLEMsR0FBSSxDO1NBQ0pDLEMsR0FBSSxDO1NBQ0pDLEssR0FBUSxDO1NBQ1JDLE0sR0FBUyxDO1NBQ1RDLE8sR0FBVSxDO1NBQ1ZDLE8sR0FBVSxDO1NBQ1ZDLFMsR0FBWSxDO1NBQ1pDLGUsR0FBa0IsSztTQUNsQkMsUSxHQUFXLEM7OztNQU9UQyxTOzs7O1dBS0RDLGtCLEdBQXdDLEU7Ozs7OzJDQUVuQkMsTSxFQUFnQkMsZ0IsRUFBd0M7QUFDakYsYUFBS0Ysa0JBQUwsQ0FBd0JDLE1BQXhCLElBQWtDQyxnQkFBbEM7QUFDSDs7OzhDQUUrQjtBQUM1QixZQUFNQyxxQkFBd0MsR0FBRyxFQUFqRDs7QUFDQSx3Q0FBa0JDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUtMLGtCQUFqQixDQUFsQixrQ0FBd0Q7QUFBbkQsY0FBTU0sSUFBRyxtQkFBVDtBQUNELGNBQU1DLEtBQUssR0FBRyxJQUFJbEIsb0JBQUosRUFBZDs7QUFDQW1CLHFCQUFHQyxLQUFILENBQVNGLEtBQVQsRUFBZ0IsS0FBS1Asa0JBQUwsQ0FBd0JNLElBQXhCLENBQWhCOztBQUNBSCxVQUFBQSxxQkFB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LEdBQUdqSyxZQUFZLENBQUN0RCxNQUE3Qjs7QUFFQSxVQUFJMkQsU0FBUyxLQUFLMkMsZ0JBQVNFLGFBQTNCLEVBQTBDO0FBQ3RDK0csUUFBQUEsU0FBUyxHQUFHLENBQVo7QUFDSDs7QUFFRCxVQUFJNUosU0FBUyxLQUFLMkMsZ0JBQVNDLElBQTNCLEVBQWlDO0FBQzdCK0csUUFBQUEsUUFBUSxHQUFHLENBQVg7QUFDQUMsUUFBQUEsU0FBUyxHQUFHLENBQVo7QUFDSDs7QUFFRDFKLE1BQUFBLFdBQVcsR0FBR3lKLFFBQWQ7QUFDQXhKLE1BQUFBLFlBQVksR0FBR3lKLFNBQWY7QUFDQWpMLE1BQUFBLGdCQUFnQixDQUFDdkMsS0FBakIsR0FBeUJ1TixRQUF6QjtBQUNBaEwsTUFBQUEsZ0JBQWdCLENBQUN0QyxNQUFqQixHQUEwQnVOLFNBQTFCO0FBQ0F4SixNQUFBQSxhQUFhLEdBQUd1SixRQUFoQjtBQUNIO0FBMW5Cc0IsR0FBcEI7O2lCQTZuQlF0SixXIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEJpdG1hcEZvbnQsIElDb25maWcgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2Fzc2V0cy9iaXRtYXAtZm9udCc7XHJcbmltcG9ydCB7IFNwcml0ZUZyYW1lIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9hc3NldHMvc3ByaXRlLWZyYW1lJztcclxuaW1wb3J0IHsgaXNVbmljb2RlQ0pLLCBpc1VuaWNvZGVTcGFjZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvdXRpbHMvdGV4dC11dGlscyc7XHJcbmltcG9ydCB7IFJlY3QsIFNpemUsIFZlYzIgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBIb3Jpem9udGFsVGV4dEFsaWdubWVudCwgVmVydGljYWxUZXh0QWxpZ25tZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9sYWJlbCc7XHJcbmltcG9ydCB7IExhYmVsLCBPdmVyZmxvdyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbGFiZWwnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvdXRpbHMnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXRyYW5zZm9ybSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jbGFzcyBGb250TGV0dGVyRGVmaW5pdGlvbiB7XHJcbiAgICBwdWJsaWMgdSA9IDA7XHJcbiAgICBwdWJsaWMgdiA9IDA7XHJcbiAgICBwdWJsaWMgd2lkdGggPSAwO1xyXG4gICAgcHVibGljIGhlaWdodCA9IDA7XHJcbiAgICBwdWJsaWMgb2Zmc2V0WCA9IDA7XHJcbiAgICBwdWJsaWMgb2Zmc2V0WSA9IDA7XHJcbiAgICBwdWJsaWMgdGV4dHVyZUlEID0gMDtcclxuICAgIHB1YmxpYyB2YWxpZERlZmluaXRpb24gPSBmYWxzZTtcclxuICAgIHB1YmxpYyB4QWR2YW5jZSA9IDA7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJTGV0dGVyRGVmaW5pdGlvbiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBGb250TGV0dGVyRGVmaW5pdGlvbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZvbnRBdGxhcyB7XHJcbiAgICBnZXQgbGV0dGVyRGVmaW5pdGlvbnMgKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xldHRlckRlZmluaXRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2xldHRlckRlZmluaXRpb25zOiBJTGV0dGVyRGVmaW5pdGlvbiA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyBhZGRMZXR0ZXJEZWZpbml0aW9ucyAobGV0dGVyOiBzdHJpbmcsIGxldHRlckRlZmluaXRpb246IEZvbnRMZXR0ZXJEZWZpbml0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNbbGV0dGVyXSA9IGxldHRlckRlZmluaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb25lTGV0dGVyRGVmaW5pdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgY29weUxldHRlckRlZmluaXRpb25zOiBJTGV0dGVyRGVmaW5pdGlvbiA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2xldHRlckRlZmluaXRpb25zKSkge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5ldyBGb250TGV0dGVyRGVmaW5pdGlvbigpO1xyXG4gICAgICAgICAgICBqcy5taXhpbih2YWx1ZSwgdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNba2V5XSk7XHJcbiAgICAgICAgICAgIGNvcHlMZXR0ZXJEZWZpbml0aW9uc1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3B5TGV0dGVyRGVmaW5pdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzc2lnbkxldHRlckRlZmluaXRpb25zIChsZXR0ZXJEZWZpbml0aW9uOiBJTGV0dGVyRGVmaW5pdGlvbikge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2xldHRlckRlZmluaXRpb25zKSkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGxldHRlckRlZmluaXRpb25ba2V5XTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9sZXR0ZXJEZWZpbml0aW9uc1trZXldO1xyXG4gICAgICAgICAgICBqcy5taXhpbihvbGRWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2NhbGVGb250TGV0dGVyRGVmaW5pdGlvbiAoc2NhbGVGYWN0b3I6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAoY29uc3QgZm9udERlZmluaXRpb24gb2YgT2JqZWN0LmtleXModGhpcy5fbGV0dGVyRGVmaW5pdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxldHRlckRlZmluaXRpb25zID0gdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNbZm9udERlZmluaXRpb25dO1xyXG4gICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9ucy53aWR0aCAqPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbnMuaGVpZ2h0ICo9IHNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9ucy5vZmZzZXRYICo9IHNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9ucy5vZmZzZXRZICo9IHNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9ucy54QWR2YW5jZSAqPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExldHRlckRlZmluaXRpb25Gb3JDaGFyIChjaGFyOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNbY2hhci5jaGFyQ29kZUF0KDApXTtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuRm9udEF0bGFzID0gRm9udEF0bGFzO1xyXG5cclxuY2xhc3MgTGV0dGVySW5mbyB7XHJcbiAgICBwdWJsaWMgY2hhciA9ICcnO1xyXG4gICAgcHVibGljIHZhbGlkID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBwb3NpdGlvblggPSAwO1xyXG4gICAgcHVibGljIHBvc2l0aW9uWSA9IDA7XHJcbiAgICBwdWJsaWMgbGluZUluZGV4ID0gMDtcclxufVxyXG5cclxuY29uc3QgX3RtcFJlY3QgPSBuZXcgUmVjdCgpO1xyXG5cclxubGV0IF9jb21wOiBMYWJlbCB8IG51bGwgPSBudWxsO1xyXG5sZXQgX3VpVHJhbnM6IFVJVHJhbnNmb3JtIHwgbnVsbCA9IG51bGw7XHJcblxyXG5jb25zdCBfaG9yaXpvbnRhbEtlcm5pbmc6IG51bWJlcltdID0gW107XHJcbmNvbnN0IF9sZXR0ZXJzSW5mbzogTGV0dGVySW5mb1tdID0gW107XHJcbmNvbnN0IF9saW5lc1dpZHRoOiBudW1iZXJbXSA9IFtdO1xyXG5jb25zdCBfbGluZXNPZmZzZXRYOiBudW1iZXJbXSA9IFtdO1xyXG5jb25zdCBfbGFiZWxEaW1lbnNpb25zID0gbmV3IFNpemUoKTtcclxuXHJcbmxldCBfZm9udEF0bGFzOiBGb250QXRsYXMgfCBudWxsID0gbnVsbDtcclxubGV0IF9mbnRDb25maWc6IElDb25maWcgfCBudWxsID0gbnVsbDtcclxubGV0IF9udW1iZXJPZkxpbmVzID0gMDtcclxubGV0IF90ZXh0RGVzaXJlZEhlaWdodCA9IDA7XHJcbmxldCBfbGV0dGVyT2Zmc2V0WSA9IDA7XHJcbmxldCBfdGFpbG9yZWRUb3BZID0gMDtcclxubGV0IF90YWlsb3JlZEJvdHRvbVkgPSAwO1xyXG5sZXQgX2JtZm9udFNjYWxlID0gMS4wO1xyXG5jb25zdCBfbGluZUJyZWFrV2l0aG91dFNwYWNlcyA9IGZhbHNlO1xyXG5sZXQgX3Nwcml0ZUZyYW1lOiBTcHJpdGVGcmFtZXxudWxsID0gbnVsbDtcclxuY29uc3QgX2xpbmVTcGFjaW5nID0gMDtcclxubGV0IF9zdHJpbmcgPSAnJztcclxubGV0IF9mb250U2l6ZSA9IDA7XHJcbmxldCBfb3JpZ2luRm9udFNpemUgPSAwO1xyXG5jb25zdCBfY29udGVudFNpemUgPSBuZXcgU2l6ZSgpO1xyXG5sZXQgX2hBbGlnbiA9IDA7XHJcbmxldCBfdkFsaWduID0gMDtcclxubGV0IF9zcGFjaW5nWCA9IDA7XHJcbmxldCBfbGluZUhlaWdodCA9IDA7XHJcbmxldCBfb3ZlcmZsb3cgPSAwO1xyXG5sZXQgX2lzV3JhcFRleHQgPSBmYWxzZTtcclxubGV0IF9sYWJlbFdpZHRoID0gMDtcclxubGV0IF9sYWJlbEhlaWdodCA9IDA7XHJcbmxldCBfbWF4TGluZVdpZHRoID0gMDtcclxuXHJcbmV4cG9ydCBjb25zdCBibWZvbnRVdGlscyA9IHtcclxuICAgIHVwZGF0ZVJlbmRlckRhdGEgKGNvbXA6IExhYmVsKSB7XHJcbiAgICAgICAgaWYgKCFjb21wLnJlbmRlckRhdGEgfHwgIWNvbXAucmVuZGVyRGF0YS52ZXJ0RGlydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF9jb21wID09PSBjb21wKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICBfY29tcCA9IGNvbXA7XHJcbiAgICAgICAgX3VpVHJhbnMgPSBfY29tcC5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVByb3BlcnRpZXMoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVDb250ZW50KCk7XHJcblxyXG4gICAgICAgIF9jb21wLmFjdHVhbEZvbnRTaXplID0gX2ZvbnRTaXplO1xyXG4gICAgICAgIF91aVRyYW5zLnNldENvbnRlbnRTaXplKF9jb250ZW50U2l6ZSk7XHJcblxyXG4gICAgICAgIF9jb21wLnJlbmRlckRhdGEhLnZlcnREaXJ0eSA9IF9jb21wLnJlbmRlckRhdGEhLnV2RGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgX2NvbXAgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLl9yZXNldFByb3BlcnRpZXMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZUZvbnRTY2FsZSAoKSB7XHJcbiAgICAgICAgX2JtZm9udFNjYWxlID0gX2ZvbnRTaXplIC8gX29yaWdpbkZvbnRTaXplO1xyXG4gICAgfSxcclxuXHJcbiAgICBfdXBkYXRlUHJvcGVydGllcyAoKSB7XHJcbiAgICAgICAgaWYgKCFfY29tcCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZvbnRBc3NldCA9IF9jb21wLmZvbnQgYXMgQml0bWFwRm9udDtcclxuICAgICAgICBpZiAoIWZvbnRBc3NldCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfc3ByaXRlRnJhbWUgPSBmb250QXNzZXQuc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgX2ZudENvbmZpZyA9IGZvbnRBc3NldC5mbnRDb25maWchO1xyXG5cclxuICAgICAgICBfZm9udEF0bGFzID0gX2NvbXAuZm9udEF0bGFzO1xyXG4gICAgICAgIGlmICghX2ZvbnRBdGxhcykge1xyXG4gICAgICAgICAgICBfZm9udEF0bGFzID0gbmV3IEZvbnRBdGxhcygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZm9udERpY3QgPSBfZm50Q29uZmlnLmZvbnREZWZEaWN0aW9uYXJ5O1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBmb250RGVmIG9mIE9iamVjdC5rZXlzKGZvbnREaWN0KSApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxldHRlckRlZmluaXRpb24gPSBuZXcgRm9udExldHRlckRlZmluaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gZm9udERpY3RbZm9udERlZl0ucmVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLm9mZnNldFggPSBmb250RGljdFtmb250RGVmXS54T2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbi5vZmZzZXRZID0gZm9udERpY3RbZm9udERlZl0ueU9mZnNldDtcclxuICAgICAgICAgICAgICAgIGxldHRlckRlZmluaXRpb24ud2lkdGggPSByZWN0LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyRGVmaW5pdGlvbi5oZWlnaHQgPSByZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGxldHRlckRlZmluaXRpb24udSA9IHJlY3QueDtcclxuICAgICAgICAgICAgICAgIGxldHRlckRlZmluaXRpb24udiA9IHJlY3QueTtcclxuICAgICAgICAgICAgICAgIC8vIEZJWE1FOiBvbmx5IG9uZSB0ZXh0dXJlIHN1cHBvcnRlZCBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLnRleHR1cmVJRCA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLnZhbGlkRGVmaW5pdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWZpbml0aW9uLnhBZHZhbmNlID0gZm9udERpY3RbZm9udERlZl0ueEFkdmFuY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgX2ZvbnRBdGxhcy5hZGRMZXR0ZXJEZWZpbml0aW9ucyhmb250RGVmLCBsZXR0ZXJEZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgX2NvbXAuZm9udEF0bGFzID0gX2ZvbnRBdGxhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9zdHJpbmcgPSBfY29tcC5zdHJpbmcudG9TdHJpbmcoKTtcclxuICAgICAgICBfZm9udFNpemUgPSBfY29tcC5mb250U2l6ZTtcclxuICAgICAgICBfb3JpZ2luRm9udFNpemUgPSBfZm50Q29uZmlnLmZvbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRTaXplID0gX3VpVHJhbnMhLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IGNvbnRlbnRTaXplLndpZHRoO1xyXG4gICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgPSBjb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgX2hBbGlnbiA9IF9jb21wLmhvcml6b250YWxBbGlnbjtcclxuICAgICAgICBfdkFsaWduID0gX2NvbXAudmVydGljYWxBbGlnbjtcclxuICAgICAgICBfc3BhY2luZ1ggPSBfY29tcC5zcGFjaW5nWDtcclxuICAgICAgICBfb3ZlcmZsb3cgPSBfY29tcC5vdmVyZmxvdztcclxuICAgICAgICBfbGluZUhlaWdodCA9IF9jb21wLmxpbmVIZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIHNob3VsZCB3cmFwIHRleHRcclxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XHJcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuUkVTSVpFX0hFSUdIVCkge1xyXG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IF9jb21wLmVuYWJsZVdyYXBUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MoKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3Jlc2V0UHJvcGVydGllcyAoKSB7XHJcbiAgICAgICAgX2ZvbnRBdGxhcyA9IG51bGw7XHJcbiAgICAgICAgX2ZudENvbmZpZyA9IG51bGw7XHJcbiAgICAgICAgX3Nwcml0ZUZyYW1lID0gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZUNvbnRlbnQgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUZvbnRTY2FsZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQoKTtcclxuICAgICAgICB0aGlzLl9hbGlnblRleHQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2NvbXB1dGVIb3Jpem9udGFsS2VybmluZ0ZvclRleHQgKCkge1xyXG4gICAgICAgIGNvbnN0IHN0cmluZyA9IF9zdHJpbmc7XHJcbiAgICAgICAgY29uc3Qgc3RyaW5nTGVuID0gc3RyaW5nLmxlbmd0aDtcclxuXHJcbiAgICAgICAgY29uc3Qga2VybmluZ0RpY3QgPSBfZm50Q29uZmlnIS5rZXJuaW5nRGljdDtcclxuICAgICAgICBjb25zdCBob3Jpem9udGFsS2VybmluZyA9IF9ob3Jpem9udGFsS2VybmluZztcclxuXHJcbiAgICAgICAgbGV0IHByZXYgPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmluZ0xlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICBjb25zdCBrZXJuaW5nQW1vdW50ID0ga2VybmluZ0RpY3RbKHByZXYgPDwgMTYpIHwgKGtleSAmIDB4ZmZmZildIHx8IDA7XHJcbiAgICAgICAgICAgIGlmIChpIDwgc3RyaW5nTGVuIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdbaV0gPSBrZXJuaW5nQW1vdW50O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdbaV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXYgPSBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbXVsdGlsaW5lVGV4dFdyYXAgKG5leHRUb2tlbkZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dExlbiA9IF9zdHJpbmcubGVuZ3RoO1xyXG5cclxuICAgICAgICBsZXQgbGluZUluZGV4ID0gMDtcclxuICAgICAgICBsZXQgbmV4dFRva2VuWCA9IDA7XHJcbiAgICAgICAgbGV0IG5leHRUb2tlblkgPSAwO1xyXG4gICAgICAgIGxldCBsb25nZXN0TGluZSA9IDA7XHJcbiAgICAgICAgbGV0IGxldHRlclJpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgbGV0IGhpZ2hlc3RZID0gMDtcclxuICAgICAgICBsZXQgbG93ZXN0WSA9IDA7XHJcbiAgICAgICAgbGV0IGxldHRlckRlZjogRm9udExldHRlckRlZmluaXRpb24gfCBudWxsID0gbnVsbDtcclxuICAgICAgICBjb25zdCBsZXR0ZXJQb3NpdGlvbiA9IG5ldyBWZWMyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUZvbnRTY2FsZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBsZXR0ZXJEZWZpbml0aW9ucyA9IF9mb250QXRsYXMhLmxldHRlckRlZmluaXRpb25zO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGV4dExlbjspIHtcclxuICAgICAgICAgICAgbGV0IGNoYXJhY3RlciA9IF9zdHJpbmcuY2hhckF0KGluZGV4KTtcclxuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICAgIF9saW5lc1dpZHRoLnB1c2gobGV0dGVyUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyUmlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGluZUluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5YID0gMDtcclxuICAgICAgICAgICAgICAgIG5leHRUb2tlblkgLT0gX2xpbmVIZWlnaHQgKiBfYm1mb250U2NhbGUgKyBfbGluZVNwYWNpbmc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8oaW5kZXgsIGNoYXJhY3Rlcik7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuTGVuID0gbmV4dFRva2VuRnVuYyhfc3RyaW5nLCBpbmRleCwgdGV4dExlbik7XHJcbiAgICAgICAgICAgIGxldCB0b2tlbkhpZ2hlc3RZID0gaGlnaGVzdFk7XHJcbiAgICAgICAgICAgIGxldCB0b2tlbkxvd2VzdFkgPSBsb3dlc3RZO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW5SaWdodCA9IGxldHRlclJpZ2h0O1xyXG4gICAgICAgICAgICBsZXQgbmV4dExldHRlclggPSBuZXh0VG9rZW5YO1xyXG4gICAgICAgICAgICBsZXQgbmV3TGluZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgdG1wID0gMDsgdG1wIDwgdG9rZW5MZW47ICsrdG1wKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZXR0ZXJJbmRleCA9IGluZGV4ICsgdG1wO1xyXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyID0gX3N0cmluZy5jaGFyQXQobGV0dGVySW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ1xccicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXJhY3Rlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWYgPSBfZm9udEF0bGFzICYmIF9mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyKTtcclxuICAgICAgICAgICAgICAgIGlmICghbGV0dGVyRGVmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGxldHRlckluZGV4LCBjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDYW5cXCd0IGZpbmQgbGV0dGVyIGRlZmluaXRpb24gaW4gdGV4dHVyZSBhdGxhcyAnICtcclxuICAgICAgICAgICAgICAgICAgICAgX2ZudENvbmZpZyEuYXRsYXNOYW1lICsgJyBmb3IgbGV0dGVyOicgKyBjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxldHRlclggPSBuZXh0TGV0dGVyWCArIGxldHRlckRlZi5vZmZzZXRYICogX2JtZm9udFNjYWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfaXNXcmFwVGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICYmIF9tYXhMaW5lV2lkdGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgbmV4dFRva2VuWCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAmJiBsZXR0ZXJYICsgbGV0dGVyRGVmLndpZHRoICogX2JtZm9udFNjYWxlID4gX21heExpbmVXaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICYmICFpc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzV2lkdGgucHVzaChsZXR0ZXJSaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyUmlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlblkgLT0gKF9saW5lSGVpZ2h0ICogX2JtZm9udFNjYWxlICsgX2xpbmVTcGFjaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdMaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyUG9zaXRpb24ueCA9IGxldHRlclg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0dGVyUG9zaXRpb24ueSA9IG5leHRUb2tlblkgLSBsZXR0ZXJEZWYub2Zmc2V0WSAqIF9ibWZvbnRTY2FsZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29yZExldHRlckluZm8obGV0dGVyRGVmaW5pdGlvbnMsIGxldHRlclBvc2l0aW9uLCBjaGFyYWN0ZXIsIGxldHRlckluZGV4LCBsaW5lSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXJJbmRleCArIDEgPCBfaG9yaXpvbnRhbEtlcm5pbmcubGVuZ3RoICYmIGxldHRlckluZGV4IDwgdGV4dExlbiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBfaG9yaXpvbnRhbEtlcm5pbmdbbGV0dGVySW5kZXggKyAxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1g7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9rZW5SaWdodCA9IGxldHRlclBvc2l0aW9uLnggKyBsZXR0ZXJEZWYud2lkdGggKiBfYm1mb250U2NhbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuSGlnaGVzdFkgPCBsZXR0ZXJQb3NpdGlvbi55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5IaWdoZXN0WSA9IGxldHRlclBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuTG93ZXN0WSA+IGxldHRlclBvc2l0aW9uLnkgLSBsZXR0ZXJEZWYuaGVpZ2h0ICogX2JtZm9udFNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5Mb3dlc3RZID0gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oZWlnaHQgKiBfYm1mb250U2NhbGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IC8vIGVuZCBvZiBmb3IgbG9vcFxyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0xpbmUpIHsgY29udGludWU7IH1cclxuXHJcbiAgICAgICAgICAgIG5leHRUb2tlblggPSBuZXh0TGV0dGVyWDtcclxuICAgICAgICAgICAgbGV0dGVyUmlnaHQgPSB0b2tlblJpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGhpZ2hlc3RZIDwgdG9rZW5IaWdoZXN0WSkge1xyXG4gICAgICAgICAgICAgICAgaGlnaGVzdFkgPSB0b2tlbkhpZ2hlc3RZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsb3dlc3RZID4gdG9rZW5Mb3dlc3RZKSB7XHJcbiAgICAgICAgICAgICAgICBsb3dlc3RZID0gdG9rZW5Mb3dlc3RZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsb25nZXN0TGluZSA8IGxldHRlclJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBsb25nZXN0TGluZSA9IGxldHRlclJpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbmRleCArPSB0b2tlbkxlbjtcclxuICAgICAgICB9IC8vIGVuZCBvZiBmb3IgbG9vcFxyXG5cclxuICAgICAgICBfbGluZXNXaWR0aC5wdXNoKGxldHRlclJpZ2h0KTtcclxuXHJcbiAgICAgICAgX251bWJlck9mTGluZXMgPSBsaW5lSW5kZXggKyAxO1xyXG4gICAgICAgIF90ZXh0RGVzaXJlZEhlaWdodCA9IF9udW1iZXJPZkxpbmVzICogX2xpbmVIZWlnaHQgKiBfYm1mb250U2NhbGU7XHJcbiAgICAgICAgaWYgKF9udW1iZXJPZkxpbmVzID4gMSkge1xyXG4gICAgICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgKz0gKF9udW1iZXJPZkxpbmVzIC0gMSkgKiBfbGluZVNwYWNpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfY29udGVudFNpemUud2lkdGggPSBfbGFiZWxXaWR0aDtcclxuICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gX2xhYmVsSGVpZ2h0O1xyXG4gICAgICAgIGlmIChfbGFiZWxXaWR0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZS53aWR0aCA9IHBhcnNlRmxvYXQobG9uZ2VzdExpbmUudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfbGFiZWxIZWlnaHQgPD0gMCkge1xyXG4gICAgICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChfdGV4dERlc2lyZWRIZWlnaHQudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfdGFpbG9yZWRUb3BZID0gX2NvbnRlbnRTaXplLmhlaWdodDtcclxuICAgICAgICBfdGFpbG9yZWRCb3R0b21ZID0gMDtcclxuICAgICAgICBpZiAoaGlnaGVzdFkgPiAwKSB7XHJcbiAgICAgICAgICAgIF90YWlsb3JlZFRvcFkgPSBfY29udGVudFNpemUuaGVpZ2h0ICsgaGlnaGVzdFk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsb3dlc3RZIDwgLV90ZXh0RGVzaXJlZEhlaWdodCkge1xyXG4gICAgICAgICAgICBfdGFpbG9yZWRCb3R0b21ZID0gX3RleHREZXNpcmVkSGVpZ2h0ICsgbG93ZXN0WTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBfZ2V0Rmlyc3RDaGFyTGVuICgpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH0sXHJcblxyXG4gICAgX2dldEZpcnN0V29yZExlbiAodGV4dDogc3RyaW5nLCBzdGFydEluZGV4OiBudW1iZXIsIHRleHRMZW46IG51bWJlcikge1xyXG4gICAgICAgIGxldCBjaGFyYWN0ZXIgPSB0ZXh0LmNoYXJBdChzdGFydEluZGV4KTtcclxuICAgICAgICBpZiAoaXNVbmljb2RlQ0pLKGNoYXJhY3RlcilcclxuICAgICAgICAgICAgfHwgY2hhcmFjdGVyID09PSAnXFxuJ1xyXG4gICAgICAgICAgICB8fCBpc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxlbiA9IDE7XHJcbiAgICAgICAgbGV0IGxldHRlckRlZiA9IF9mb250QXRsYXMgJiYgX2ZvbnRBdGxhcy5nZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhcihjaGFyYWN0ZXIpO1xyXG4gICAgICAgIGlmICghbGV0dGVyRGVmKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXh0TGV0dGVyWCA9IGxldHRlckRlZi54QWR2YW5jZSAqIF9ibWZvbnRTY2FsZSArIF9zcGFjaW5nWDtcclxuICAgICAgICBsZXQgbGV0dGVyWCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4ICsgMTsgaW5kZXggPCB0ZXh0TGVuOyArK2luZGV4KSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IHRleHQuY2hhckF0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGxldHRlckRlZiA9IF9mb250QXRsYXMgJiYgX2ZvbnRBdGxhcy5nZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhcihjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICBpZiAoIWxldHRlckRlZikge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGU7XHJcblxyXG4gICAgICAgICAgICBpZiAobGV0dGVyWCArIGxldHRlckRlZi53aWR0aCAqIF9ibWZvbnRTY2FsZSA+IF9tYXhMaW5lV2lkdGhcclxuICAgICAgICAgICAgICAgICYmICFpc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgICAgICAmJiBfbWF4TGluZVdpZHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1g7XHJcbiAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICdcXG4nXHJcbiAgICAgICAgICAgICAgICB8fCBpc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXHJcbiAgICAgICAgICAgICAgICB8fCBpc1VuaWNvZGVDSksoY2hhcmFjdGVyKSkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGVuKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGVuO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcCh0aGlzLl9nZXRGaXJzdFdvcmRMZW4pO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcCh0aGlzLl9nZXRGaXJzdENoYXJMZW4pO1xyXG4gICAgfSxcclxuXHJcbiAgICBfcmVjb3JkUGxhY2Vob2xkZXJJbmZvIChsZXR0ZXJJbmRleDogbnVtYmVyLCBjaGFyOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAobGV0dGVySW5kZXggPj0gX2xldHRlcnNJbmZvLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCB0bXBJbmZvID0gbmV3IExldHRlckluZm8oKTtcclxuICAgICAgICAgICAgX2xldHRlcnNJbmZvLnB1c2godG1wSW5mbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLmNoYXIgPSBjaGFyO1xyXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0udmFsaWQgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgX3JlY29yZExldHRlckluZm8gKGxldHRlckRlZmluaXRpb25zOiBJTGV0dGVyRGVmaW5pdGlvbiwgbGV0dGVyUG9zaXRpb246IFZlYzIsIGNoYXJhY3Rlcjogc3RyaW5nLCBsZXR0ZXJJbmRleDogbnVtYmVyLCBsaW5lSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChsZXR0ZXJJbmRleCA+PSBfbGV0dGVyc0luZm8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRtcEluZm8gPSBuZXcgTGV0dGVySW5mbygpO1xyXG4gICAgICAgICAgICBfbGV0dGVyc0luZm8ucHVzaCh0bXBJbmZvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNJbmRleCA9IGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0ubGluZUluZGV4ID0gbGluZUluZGV4O1xyXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uY2hhciA9IGNoYXJhY3RlcjtcclxuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnZhbGlkID0gbGV0dGVyRGVmaW5pdGlvbnNbY0luZGV4XS52YWxpZERlZmluaXRpb247XHJcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5wb3NpdGlvblggPSBsZXR0ZXJQb3NpdGlvbi54O1xyXG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0ucG9zaXRpb25ZID0gbGV0dGVyUG9zaXRpb24ueTtcclxuICAgIH0sXHJcblxyXG4gICAgX2FsaWduVGV4dCAoKSB7XHJcbiAgICAgICAgX3RleHREZXNpcmVkSGVpZ2h0ID0gMDtcclxuICAgICAgICBfbGluZXNXaWR0aC5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBpZiAoIV9saW5lQnJlYWtXaXRob3V0U3BhY2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX211bHRpbGluZVRleHRXcmFwQnlXb3JkKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXB1dGVBbGlnbm1lbnRPZmZzZXQoKTtcclxuXHJcbiAgICAgICAgLy8gc2hyaW5rXHJcbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XHJcbiAgICAgICAgICAgIGlmIChfZm9udFNpemUgPiAwICYmIHRoaXMuX2lzVmVydGljYWxDbGFtcCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUodGhpcy5faXNWZXJ0aWNhbENsYW1wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl91cGRhdGVRdWFkcygpKSB7XHJcbiAgICAgICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hyaW5rTGFiZWxUb0NvbnRlbnRTaXplKHRoaXMuX2lzSG9yaXpvbnRhbENsYW1wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3NjYWxlRm9udFNpemVEb3duIChmb250U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHNob3VsZFVwZGF0ZUNvbnRlbnQgPSB0cnVlO1xyXG4gICAgICAgIGlmICghZm9udFNpemUpIHtcclxuICAgICAgICAgICAgZm9udFNpemUgPSAwLjE7XHJcbiAgICAgICAgICAgIHNob3VsZFVwZGF0ZUNvbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX2ZvbnRTaXplID0gZm9udFNpemU7XHJcblxyXG4gICAgICAgIGlmIChzaG91bGRVcGRhdGVDb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNvbnRlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUgKGxhbWJkYTogRnVuY3Rpb24pIHtcclxuICAgICAgICBjb25zdCBmb250U2l6ZSA9IF9mb250U2l6ZTtcclxuICAgICAgICBjb25zdCBvcmlnaW5hbExpbmVIZWlnaHQgPSBfbGluZUhlaWdodDtcclxuICAgICAgICBjb25zdCBmb250QXRsYXMgPSBfZm9udEF0bGFzO1xyXG5cclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgY29uc3QgdGVtcExldHRlckRlZmluaXRpb24gPSBmb250QXRsYXMgPyBmb250QXRsYXMuY2xvbmVMZXR0ZXJEZWZpbml0aW9uKCkgOiB7fSBhcyBJTGV0dGVyRGVmaW5pdGlvbjtcclxuICAgICAgICBsZXQgZmxhZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaWxlIChsYW1iZGEoKSkge1xyXG4gICAgICAgICAgICArK2k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdGb250U2l6ZSA9IGZvbnRTaXplIC0gaTtcclxuICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAobmV3Rm9udFNpemUgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gbmV3Rm9udFNpemUgLyBmb250U2l6ZTtcclxuICAgICAgICAgICAgaWYgKGZvbnRBdGxhcykge1xyXG4gICAgICAgICAgICAgICAgZm9udEF0bGFzLmFzc2lnbkxldHRlckRlZmluaXRpb25zKHRlbXBMZXR0ZXJEZWZpbml0aW9uKTtcclxuICAgICAgICAgICAgICAgIGZvbnRBdGxhcy5zY2FsZUZvbnRMZXR0ZXJEZWZpbml0aW9uKHNjYWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfbGluZUhlaWdodCA9IG9yaWdpbmFsTGluZUhlaWdodCAqIHNjYWxlO1xyXG4gICAgICAgICAgICBpZiAoIV9saW5lQnJlYWtXaXRob3V0U3BhY2VzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5V29yZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jb21wdXRlQWxpZ25tZW50T2Zmc2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfbGluZUhlaWdodCA9IG9yaWdpbmFsTGluZUhlaWdodDtcclxuICAgICAgICBpZiAoZm9udEF0bGFzKSB7XHJcbiAgICAgICAgICAgIGZvbnRBdGxhcy5hc3NpZ25MZXR0ZXJEZWZpbml0aW9ucyh0ZW1wTGV0dGVyRGVmaW5pdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWZsYWcpIHtcclxuICAgICAgICAgICAgaWYgKGZvbnRTaXplIC0gaSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZUZvbnRTaXplRG93bihmb250U2l6ZSAtIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaXNWZXJ0aWNhbENsYW1wICgpIHtcclxuICAgICAgICBpZiAoX3RleHREZXNpcmVkSGVpZ2h0ID4gX2NvbnRlbnRTaXplLmhlaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfaXNIb3Jpem9udGFsQ2xhbXAgKCkge1xyXG4gICAgICAgIGlmICghX2ZvbnRBdGxhcyl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsZXR0ZXJDbGFtcCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAobGV0IGN0ciA9IDAsIGwgPSBfc3RyaW5nLmxlbmd0aDsgY3RyIDwgbDsgKytjdHIpIHtcclxuICAgICAgICAgICAgY29uc3QgbGV0dGVySW5mbyA9IF9sZXR0ZXJzSW5mb1tjdHJdO1xyXG4gICAgICAgICAgICBpZiAobGV0dGVySW5mby52YWxpZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGV0dGVyRGVmID0gX2ZvbnRBdGxhcy5nZXRMZXR0ZXJEZWZpbml0aW9uRm9yQ2hhcihsZXR0ZXJJbmZvLmNoYXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBweCA9IGxldHRlckluZm8ucG9zaXRpb25YICsgbGV0dGVyRGVmLndpZHRoIC8gMiAqIF9ibWZvbnRTY2FsZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVJbmRleCA9IGxldHRlckluZm8ubGluZUluZGV4O1xyXG4gICAgICAgICAgICAgICAgaWYgKF9sYWJlbFdpZHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghX2lzV3JhcFRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJDbGFtcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmRXaWR0aCA9IF9saW5lc1dpZHRoW2xpbmVJbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkV2lkdGggPiBfY29udGVudFNpemUud2lkdGggJiYgKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoIHx8IHB4IDwgMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlckNsYW1wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGV0dGVyQ2xhbXA7XHJcbiAgICB9LFxyXG5cclxuICAgIF9pc0hvcml6b250YWxDbGFtcGVkIChweDogbnVtYmVyLCBsaW5lSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHdvcmRXaWR0aCA9IF9saW5lc1dpZHRoW2xpbmVJbmRleF07XHJcbiAgICAgICAgY29uc3QgbGV0dGVyT3ZlckNsYW1wID0gKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoIHx8IHB4IDwgMCk7XHJcblxyXG4gICAgICAgIGlmICghX2lzV3JhcFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxldHRlck92ZXJDbGFtcDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gKHdvcmRXaWR0aCA+IF9jb250ZW50U2l6ZS53aWR0aCAmJiBsZXR0ZXJPdmVyQ2xhbXApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZVF1YWRzICgpIHtcclxuICAgICAgICBpZiAoIV9jb21wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxldHRlckRlZmluaXRpb25zID0gX2ZvbnRBdGxhcyA/IF9mb250QXRsYXMubGV0dGVyRGVmaW5pdGlvbnMgOiB7fTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IF9zcHJpdGVGcmFtZTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVuZGVyRGF0YSA9IF9jb21wLnJlbmRlckRhdGEhO1xyXG4gICAgICAgIHJlbmRlckRhdGEuZGF0YUxlbmd0aCA9IHJlbmRlckRhdGEudmVydGV4Q291bnQgPSByZW5kZXJEYXRhLmluZGljZXNDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGFuY2hvclBvaW50ID0gX3VpVHJhbnMhLmFuY2hvclBvaW50O1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRTaXplID0gX2NvbnRlbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IGFwcFggPSBhbmNob3JQb2ludC54ICogY29udGVudFNpemUud2lkdGg7XHJcbiAgICAgICAgY29uc3QgYXBwWSA9IGFuY2hvclBvaW50LnkgKiBjb250ZW50U2l6ZS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCByZXQgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGN0ciA9IDAsIGwgPSBfc3RyaW5nLmxlbmd0aDsgY3RyIDwgbDsgKytjdHIpIHtcclxuICAgICAgICAgICAgY29uc3QgbGV0dGVySW5mbyA9IF9sZXR0ZXJzSW5mb1tjdHJdO1xyXG4gICAgICAgICAgICBpZiAoIWxldHRlckluZm8udmFsaWQpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgY29uc3QgbGV0dGVyRGVmID0gbGV0dGVyRGVmaW5pdGlvbnNbbGV0dGVySW5mby5jaGFyLmNoYXJDb2RlQXQoMCldO1xyXG4gICAgICAgICAgICBpZiAoIWxldHRlckRlZil7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZmluZCBsZXR0ZXIgaW4gdGhpcyBiaXRtYXAtZm9udCcpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCA9IGxldHRlckRlZi5oZWlnaHQ7XHJcbiAgICAgICAgICAgIF90bXBSZWN0LndpZHRoID0gbGV0dGVyRGVmLndpZHRoO1xyXG4gICAgICAgICAgICBfdG1wUmVjdC54ID0gbGV0dGVyRGVmLnU7XHJcbiAgICAgICAgICAgIF90bXBSZWN0LnkgPSBsZXR0ZXJEZWYudjtcclxuXHJcbiAgICAgICAgICAgIGxldCBweSA9IGxldHRlckluZm8ucG9zaXRpb25ZICsgX2xldHRlck9mZnNldFk7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2xhYmVsSGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHB5ID4gX3RhaWxvcmVkVG9wWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsaXBUb3AgPSBweSAtIF90YWlsb3JlZFRvcFk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QueSArPSBjbGlwVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCAtPSBjbGlwVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIHB5ID0gcHkgLSBjbGlwVG9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChweSAtIGxldHRlckRlZi5oZWlnaHQgKiBfYm1mb250U2NhbGUgPCBfdGFpbG9yZWRCb3R0b21ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QuaGVpZ2h0ID0gKHB5IDwgX3RhaWxvcmVkQm90dG9tWSkgPyAwIDogKHB5IC0gX3RhaWxvcmVkQm90dG9tWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVJbmRleCA9IGxldHRlckluZm8ubGluZUluZGV4O1xyXG4gICAgICAgICAgICBjb25zdCBweCA9IGxldHRlckluZm8ucG9zaXRpb25YICsgbGV0dGVyRGVmLndpZHRoIC8gMiAqIF9ibWZvbnRTY2FsZSArIF9saW5lc09mZnNldFhbbGluZUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChfbGFiZWxXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc0hvcml6b250YWxDbGFtcGVkKHB4LCBsaW5lSW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuQ0xBTVApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3Qud2lkdGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9jb250ZW50U2l6ZS53aWR0aCA+IGxldHRlckRlZi53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LndpZHRoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKF9zcHJpdGVGcmFtZSAmJiAgX3RtcFJlY3QuaGVpZ2h0ID4gMCAmJiBfdG1wUmVjdC53aWR0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUm90YXRlZCA9IF9zcHJpdGVGcmFtZS5pc1JvdGF0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFNpemUgPSBfc3ByaXRlRnJhbWUuZ2V0T3JpZ2luYWxTaXplKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWN0ID0gX3Nwcml0ZUZyYW1lLmdldFJlY3QoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IF9zcHJpdGVGcmFtZS5nZXRPZmZzZXQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRMZWZ0ID0gb2Zmc2V0LnggKyAob3JpZ2luYWxTaXplLndpZHRoIC0gcmVjdC53aWR0aCkgLyAyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbW1lZFRvcCA9IG9mZnNldC55IC0gKG9yaWdpbmFsU2l6ZS5oZWlnaHQgLSByZWN0LmhlaWdodCkgLyAyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXNSb3RhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QueCArPSAocmVjdC54IC0gdHJpbW1lZExlZnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LnkgKz0gKHJlY3QueSArIHRyaW1tZWRUb3ApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFggPSBfdG1wUmVjdC54O1xyXG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LnggPSByZWN0LnggKyByZWN0LmhlaWdodCAtIF90bXBSZWN0LnkgLSBfdG1wUmVjdC5oZWlnaHQgLSB0cmltbWVkVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LnkgPSBvcmlnaW5hbFggKyByZWN0LnkgLSB0cmltbWVkTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX3RtcFJlY3QueSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RtcFJlY3QuaGVpZ2h0ID0gX3RtcFJlY3QuaGVpZ2h0ICsgdHJpbW1lZFRvcDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGV0dGVyUG9zaXRpb25YID0gbGV0dGVySW5mby5wb3NpdGlvblggKyBfbGluZXNPZmZzZXRYW2xldHRlckluZm8ubGluZUluZGV4XTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kUXVhZChfY29tcCwgdGV4dHVyZSwgX3RtcFJlY3QsIGlzUm90YXRlZCwgbGV0dGVyUG9zaXRpb25YIC0gYXBwWCwgcHkgLSBhcHBZLCBfYm1mb250U2NhbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfSxcclxuXHJcbiAgICBhcHBlbmRRdWFkIChjb21wLCB0ZXh0dXJlLCByZWN0LCByb3RhdGVkLCB4LCB5LCBzY2FsZSkge1xyXG4gICAgfSxcclxuXHJcbiAgICBfY29tcHV0ZUFsaWdubWVudE9mZnNldCAoKSB7XHJcbiAgICAgICAgX2xpbmVzT2Zmc2V0WC5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKF9oQWxpZ24pIHtcclxuICAgICAgICAgICAgY2FzZSBIb3Jpem9udGFsVGV4dEFsaWdubWVudC5MRUZUOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbnVtYmVyT2ZMaW5lczsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzT2Zmc2V0WC5wdXNoKDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQuQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBfbGluZXNXaWR0aC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfbGluZXNPZmZzZXRYLnB1c2goKF9jb250ZW50U2l6ZS53aWR0aCAtIF9saW5lc1dpZHRoW2ldKSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQuUklHSFQ6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IF9saW5lc1dpZHRoLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaChfY29udGVudFNpemUud2lkdGggLSBfbGluZXNXaWR0aFtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChfdkFsaWduKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUDpcclxuICAgICAgICAgICAgICAgIF9sZXR0ZXJPZmZzZXRZID0gX2NvbnRlbnRTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFZlcnRpY2FsVGV4dEFsaWdubWVudC5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICBfbGV0dGVyT2Zmc2V0WSA9IChfY29udGVudFNpemUuaGVpZ2h0ICsgX3RleHREZXNpcmVkSGVpZ2h0KSAvIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuQk9UVE9NOlxyXG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgPSBfdGV4dERlc2lyZWRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3NldHVwQk1Gb250T3ZlcmZsb3dNZXRyaWNzICgpIHtcclxuICAgICAgICBsZXQgbmV3V2lkdGggPSBfY29udGVudFNpemUud2lkdGg7XHJcbiAgICAgICAgbGV0IG5ld0hlaWdodCA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlJFU0laRV9IRUlHSFQpIHtcclxuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93Lk5PTkUpIHtcclxuICAgICAgICAgICAgbmV3V2lkdGggPSAwO1xyXG4gICAgICAgICAgICBuZXdIZWlnaHQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2xhYmVsV2lkdGggPSBuZXdXaWR0aDtcclxuICAgICAgICBfbGFiZWxIZWlnaHQgPSBuZXdIZWlnaHQ7XHJcbiAgICAgICAgX2xhYmVsRGltZW5zaW9ucy53aWR0aCA9IG5ld1dpZHRoO1xyXG4gICAgICAgIF9sYWJlbERpbWVuc2lvbnMuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xyXG4gICAgICAgIF9tYXhMaW5lV2lkdGggPSBuZXdXaWR0aDtcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBibWZvbnRVdGlscztcclxuIl19