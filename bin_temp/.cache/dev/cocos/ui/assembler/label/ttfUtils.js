(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/assets/index.js", "../../../core/components/component.js", "../../../core/utils/index.js", "../../../core/math/index.js", "../../components/index.js", "../../../core/load-pipeline/index.js", "../../../core/platform/debug.js", "../../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/assets/index.js"), require("../../../core/components/component.js"), require("../../../core/utils/index.js"), require("../../../core/math/index.js"), require("../../components/index.js"), require("../../../core/load-pipeline/index.js"), require("../../../core/platform/debug.js"), require("../../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.component, global.index, global.index, global.index, global.index, global.debug, global.defaultConstants);
    global.ttfUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _component, _index2, _index3, _index4, _index5, _debug, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ttfUtils = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var Overflow = _index4.Label.Overflow;

  var WHITE = _index3.Color.WHITE.clone();

  var OUTLINE_SUPPORTED = _index2.js.isChildClassOf(_index4.LabelOutline, _component.Component);

  var _context = null;
  var _canvas = null;
  var _texture = null;
  var _fontDesc = '';
  var _string = '';
  var _fontSize = 0;
  var _drawFontsize = 0;
  var _splitStrings = [];

  var _canvasSize = new _index3.Size();

  var _lineHeight = 0;
  var _hAlign = 0;
  var _vAlign = 0;

  var _color = new _index3.Color();

  var _fontFamily = '';
  var _overflow = Overflow.NONE;
  var _isWrapText = false; // outline

  var _isOutlined = false;

  var _outlineColor = new _index3.Color();

  var _outlineWidth = 0;
  var _margin = 0;
  var _isBold = false;
  var _isItalic = false;
  var _isUnderline = false;
  var ttfUtils = {
    getAssemblerData: function getAssemblerData() {
      var sharedLabelData = _index4.Label._canvasPool.get();

      sharedLabelData.canvas.width = sharedLabelData.canvas.height = 1;
      return sharedLabelData;
    },
    resetAssemblerData: function resetAssemblerData(assemblerData) {
      if (assemblerData) {
        _index4.Label._canvasPool.put(assemblerData);
      }
    },
    updateRenderData: function updateRenderData(comp) {
      if (!comp.renderData || !comp.renderData.vertDirty) {
        return;
      }

      var trans = comp.node._uiProps.uiTransformComp;

      this._updateFontFamily(comp);

      this._updateProperties(comp, trans);

      this._calculateLabelFont();

      this._calculateSplitStrings();

      this._updateLabelDimensions();

      this._calculateTextBaseline();

      this._updateTexture();

      comp.actualFontSize = _fontSize;
      trans.setContentSize(_canvasSize);
      this.updateVertexData(comp);
      comp.markForUpdateRenderData(false);
      _context = null;
      _canvas = null;
      _texture = null;
    },
    updateVertexData: function updateVertexData(comp) {},
    _updateFontFamily: function _updateFontFamily(comp) {
      if (!comp.useSystemFont) {
        if (comp.font) {
          if (comp.font._nativeAsset) {
            _fontFamily = comp.font._nativeAsset;
          } else {
            _index5.loader.load(comp.font.nativeUrl, function (err, fontFamily) {
              _fontFamily = fontFamily || 'Arial';
              comp.font._nativeAsset = fontFamily;
              comp.updateRenderData(true);
            });
          }
        } else {
          _fontFamily = 'Arial';
        }
      } else {
        _fontFamily = comp.fontFamily;
      }
    },
    _updateProperties: function _updateProperties(comp, trans) {
      var assemblerData = comp.assemblerData;

      if (!assemblerData) {
        return;
      }

      _context = assemblerData.context;
      _canvas = assemblerData.canvas;
      _texture = comp.spriteFrame;
      _string = comp.string.toString();
      _fontSize = comp.fontSize;
      _drawFontsize = _fontSize;
      _overflow = comp.overflow;
      _canvasSize.width = trans.width;
      _canvasSize.height = trans.height;
      _lineHeight = comp.lineHeight;
      _hAlign = comp.horizontalAlign;
      _vAlign = comp.verticalAlign;
      _color = comp.color;
      _isBold = comp.isBold;
      _isItalic = comp.isItalic;
      _isUnderline = comp.isUnderline;

      if (_overflow === Overflow.NONE) {
        _isWrapText = false;
      } else if (_overflow === Overflow.RESIZE_HEIGHT) {
        _isWrapText = true;
      } else {
        _isWrapText = comp.enableWrapText;
      } // outline


      var outline = OUTLINE_SUPPORTED && comp.getComponent(_index4.LabelOutline);

      if (outline && outline.enabled) {
        _isOutlined = true;
        _margin = _outlineWidth = outline.width;

        _outlineColor.set(outline.color); // TODO: temporary solution, cascade opacity for outline color


        _outlineColor.a = _outlineColor.a * comp.color.a / 255.0;
      } else {
        _isOutlined = false;
        _margin = 0;
      }
    },
    _calculateFillTextStartPosition: function _calculateFillTextStartPosition() {
      var lineHeight = this._getLineHeight();

      var lineCount = _splitStrings.length;
      var labelX = 0;
      var firstLineLabelY = 0;

      if (_hAlign === _index4.HorizontalTextAlignment.RIGHT) {
        labelX = _canvasSize.width - _margin;
      } else if (_hAlign === _index4.HorizontalTextAlignment.CENTER) {
        labelX = _canvasSize.width / 2;
      } else {
        labelX = 0 + _margin;
      }

      if (_vAlign === _index4.VerticalTextAlignment.TOP) {
        firstLineLabelY = _fontSize * (_index2.BASELINE_RATIO / 2);

        if (_defaultConstants.RUNTIME_BASED || _defaultConstants.MINIGAME) {
          firstLineLabelY = 0;
        }
      } else if (_vAlign === _index4.VerticalTextAlignment.CENTER) {
        firstLineLabelY = _canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2;
      } else {
        firstLineLabelY = _canvasSize.height - lineHeight * (lineCount - 1);
      }

      return new _index3.Vec2(labelX, firstLineLabelY);
    },
    _updateTexture: function _updateTexture() {
      if (!_context || !_canvas) {
        return;
      }

      _context.clearRect(0, 0, _canvas.width, _canvas.height);

      _context.font = _fontDesc;

      var startPosition = this._calculateFillTextStartPosition();

      var lineHeight = this._getLineHeight(); // use round for line join to avoid sharp intersect point


      _context.lineJoin = 'round';
      _context.fillStyle = "rgba(".concat(_color.r, ", ").concat(_color.g, ", ").concat(_color.b, ", ").concat(_color.a / 255, ")");
      var underlineStartPosition; // do real rendering

      for (var i = 0; i < _splitStrings.length; ++i) {
        if (_isOutlined) {
          var strokeColor = _outlineColor || WHITE;
          _context.strokeStyle = "rgba(".concat(strokeColor.r, ", ").concat(strokeColor.g, ", ").concat(strokeColor.b, ", ").concat(strokeColor.a / 255, ")");
          _context.lineWidth = _outlineWidth * 2;

          _context.strokeText(_splitStrings[i], startPosition.x, startPosition.y + i * lineHeight);
        }

        _context.fillText(_splitStrings[i], startPosition.x, startPosition.y + i * lineHeight);

        if (_isUnderline) {
          underlineStartPosition = this._calculateUnderlineStartPosition();

          _context.save();

          _context.beginPath();

          _context.lineWidth = _fontSize / 8;
          _context.strokeStyle = "rgba(".concat(_color.r, ", ").concat(_color.g, ", ").concat(_color.b, ", ").concat(_color.a / 255, ")");

          _context.moveTo(underlineStartPosition.x, underlineStartPosition.y + i * lineHeight - 1);

          _context.lineTo(underlineStartPosition.x + _canvas.width, underlineStartPosition.y + i * lineHeight - 1);

          _context.stroke();

          _context.restore();
        }
      } // _texture.handleLoadedTexture();


      if (_texture) {
        var tex;

        if (_texture instanceof _index.SpriteFrame) {
          tex = _texture.texture;
        } else {
          tex = _texture;
        }

        var uploadAgain = _canvas.width !== 0 && _canvas.height !== 0;

        if (uploadAgain) {
          tex.reset({
            width: _canvas.width,
            height: _canvas.height,
            mipmapLevel: 1
          });
          tex.uploadData(_canvas);
        }
      }
    },
    _calculateUnderlineStartPosition: function _calculateUnderlineStartPosition() {
      var lineHeight = this._getLineHeight();

      var lineCount = _splitStrings.length;
      var labelX = 0 + _margin;
      var firstLineLabelY = 0;

      if (_vAlign === _index4.VerticalTextAlignment.TOP) {
        firstLineLabelY = _fontSize;
      } else if (_vAlign === _index4.VerticalTextAlignment.CENTER) {
        firstLineLabelY = _canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2 + _fontSize / 2;
      } else {
        firstLineLabelY = _canvasSize.height - lineHeight * (lineCount - 1);
      }

      return new _index3.Vec2(labelX, firstLineLabelY);
    },
    _updateLabelDimensions: function _updateLabelDimensions() {
      if (!_context) {
        return;
      }

      var paragraphedStrings = _string.split('\n');

      if (_overflow === Overflow.RESIZE_HEIGHT) {
        _canvasSize.height = (_splitStrings.length + _index2.BASELINE_RATIO) * this._getLineHeight();
      } else if (_overflow === Overflow.NONE) {
        _splitStrings = paragraphedStrings;
        var canvasSizeX = 0;
        var canvasSizeY = 0;

        var _iterator = _createForOfIteratorHelper(paragraphedStrings),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var para = _step.value;
            var paraLength = (0, _index2.safeMeasureText)(_context, para);
            canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        canvasSizeY = (_splitStrings.length + _index2.BASELINE_RATIO) * this._getLineHeight();
        _canvasSize.width = parseFloat(canvasSizeX.toFixed(2)) + 2 * _margin;
        _canvasSize.height = parseFloat(canvasSizeY.toFixed(2));

        if (_isItalic) {
          // 0.0174532925 = 3.141592653 / 180
          _canvasSize.width += _drawFontsize * Math.tan(12 * 0.0174532925);
        }
      }

      if (!_canvas) {
        return;
      }

      _canvas.width = _canvasSize.width;
      _canvas.height = _canvasSize.height;
    },
    _calculateTextBaseline: function _calculateTextBaseline() {
      // let node = this._node;
      var hAlign;
      var vAlign;

      if (_hAlign === _index4.HorizontalTextAlignment.RIGHT) {
        hAlign = 'right';
      } else if (_hAlign === _index4.HorizontalTextAlignment.CENTER) {
        hAlign = 'center';
      } else {
        hAlign = 'left';
      }

      if (_vAlign === _index4.VerticalTextAlignment.TOP) {
        vAlign = 'top';
      } else if (_vAlign === _index4.VerticalTextAlignment.CENTER) {
        vAlign = 'middle';
      } else {
        vAlign = 'bottom';
      }

      if (_context) {
        _context.textAlign = hAlign;
        _context.textBaseline = vAlign;
      }
    },
    _calculateSplitStrings: function _calculateSplitStrings() {
      if (!_context) {
        return;
      }

      var paragraphedStrings = _string.split('\n');

      if (_isWrapText) {
        _splitStrings = [];
        var canvasWidthNoMargin = _canvasSize.width - 2 * _margin;

        var _iterator2 = _createForOfIteratorHelper(paragraphedStrings),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var para = _step2.value;
            var allWidth = (0, _index2.safeMeasureText)(_context, para);
            var textFragment = (0, _index2.fragmentText)(para, allWidth, canvasWidthNoMargin, this._measureText(_context));
            _splitStrings = _splitStrings.concat(textFragment);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } else {
        _splitStrings = paragraphedStrings;
      }
    },
    _getFontDesc: function _getFontDesc() {
      var fontDesc = _fontSize.toString() + 'px ';
      fontDesc = fontDesc + _fontFamily;

      if (_isBold) {
        fontDesc = 'bold ' + fontDesc;
      }

      if (_isItalic) {
        fontDesc = 'italic ' + fontDesc;
      }

      return fontDesc;
    },
    _getLineHeight: function _getLineHeight() {
      var nodeSpacingY = _lineHeight;

      if (nodeSpacingY === 0) {
        nodeSpacingY = _fontSize;
      } else {
        nodeSpacingY = nodeSpacingY * _fontSize / _drawFontsize;
      }

      return nodeSpacingY | 0;
    },
    _calculateParagraphLength: function _calculateParagraphLength(paragraphedStrings, ctx) {
      var paragraphLength = [];

      var _iterator3 = _createForOfIteratorHelper(paragraphedStrings),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var para = _step3.value;
          var width = (0, _index2.safeMeasureText)(ctx, para);
          paragraphLength.push(width);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return paragraphLength;
    },
    _measureText: function _measureText(ctx) {
      return function (string) {
        return (0, _index2.safeMeasureText)(ctx, string);
      };
    },
    _calculateLabelFont: function _calculateLabelFont() {
      if (!_context) {
        return;
      }

      _fontDesc = this._getFontDesc();
      _context.font = _fontDesc;

      if (_overflow === Overflow.SHRINK) {
        var paragraphedStrings = _string.split('\n');

        var paragraphLength = this._calculateParagraphLength(paragraphedStrings, _context);

        _splitStrings = paragraphedStrings;
        var i = 0;
        var totalHeight = 0;
        var maxLength = 0;

        if (_isWrapText) {
          var canvasWidthNoMargin = _canvasSize.width - 2 * _margin;
          var canvasHeightNoMargin = _canvasSize.height - 2 * _margin;

          if (canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
            _fontDesc = this._getFontDesc();
            _context.font = _fontDesc;
            return;
          }

          totalHeight = canvasHeightNoMargin + 1;
          maxLength = canvasWidthNoMargin + 1;
          var actualFontSize = _fontSize + 1;
          var textFragment = [];
          var tryDivideByTwo = true;
          var startShrinkFontSize = actualFontSize | 0;

          while (totalHeight > canvasHeightNoMargin || maxLength > canvasWidthNoMargin) {
            if (tryDivideByTwo) {
              actualFontSize = startShrinkFontSize / 2 | 0;
            } else {
              actualFontSize = startShrinkFontSize - 1;
              startShrinkFontSize = actualFontSize;
            }

            if (actualFontSize <= 0) {
              (0, _debug.logID)(4003);
              break;
            }

            _fontSize = actualFontSize;
            _fontDesc = this._getFontDesc();
            _context.font = _fontDesc;
            _splitStrings = [];
            totalHeight = 0;

            for (i = 0; i < paragraphedStrings.length; ++i) {
              var j = 0;
              var allWidth = (0, _index2.safeMeasureText)(_context, paragraphedStrings[i]);
              textFragment = (0, _index2.fragmentText)(paragraphedStrings[i], allWidth, canvasWidthNoMargin, this._measureText(_context));

              while (j < textFragment.length) {
                var measureWidth = (0, _index2.safeMeasureText)(_context, textFragment[j]);
                maxLength = measureWidth;
                totalHeight += this._getLineHeight();
                ++j;
              }

              _splitStrings = _splitStrings.concat(textFragment);
            }

            if (tryDivideByTwo) {
              if (totalHeight > canvasHeightNoMargin) {
                startShrinkFontSize = actualFontSize | 0;
              } else {
                tryDivideByTwo = false;
                totalHeight = canvasHeightNoMargin + 1;
              }
            }
          }
        } else {
          totalHeight = paragraphedStrings.length * this._getLineHeight();

          for (i = 0; i < paragraphedStrings.length; ++i) {
            if (maxLength < paragraphLength[i]) {
              maxLength = paragraphLength[i];
            }
          }

          var scaleX = (_canvasSize.width - 2 * _margin) / maxLength;
          var scaleY = _canvasSize.height / totalHeight;
          _fontSize = _drawFontsize * Math.min(1, scaleX, scaleY) | 0;
          _fontDesc = this._getFontDesc();
          _context.font = _fontDesc;
        }
      }
    }
  };
  _exports.ttfUtils = ttfUtils;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9sYWJlbC90dGZVdGlscy50cyJdLCJuYW1lcyI6WyJPdmVyZmxvdyIsIkxhYmVsIiwiV0hJVEUiLCJDb2xvciIsImNsb25lIiwiT1VUTElORV9TVVBQT1JURUQiLCJqcyIsImlzQ2hpbGRDbGFzc09mIiwiTGFiZWxPdXRsaW5lIiwiQ29tcG9uZW50IiwiX2NvbnRleHQiLCJfY2FudmFzIiwiX3RleHR1cmUiLCJfZm9udERlc2MiLCJfc3RyaW5nIiwiX2ZvbnRTaXplIiwiX2RyYXdGb250c2l6ZSIsIl9zcGxpdFN0cmluZ3MiLCJfY2FudmFzU2l6ZSIsIlNpemUiLCJfbGluZUhlaWdodCIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX2NvbG9yIiwiX2ZvbnRGYW1pbHkiLCJfb3ZlcmZsb3ciLCJOT05FIiwiX2lzV3JhcFRleHQiLCJfaXNPdXRsaW5lZCIsIl9vdXRsaW5lQ29sb3IiLCJfb3V0bGluZVdpZHRoIiwiX21hcmdpbiIsIl9pc0JvbGQiLCJfaXNJdGFsaWMiLCJfaXNVbmRlcmxpbmUiLCJ0dGZVdGlscyIsImdldEFzc2VtYmxlckRhdGEiLCJzaGFyZWRMYWJlbERhdGEiLCJfY2FudmFzUG9vbCIsImdldCIsImNhbnZhcyIsIndpZHRoIiwiaGVpZ2h0IiwicmVzZXRBc3NlbWJsZXJEYXRhIiwiYXNzZW1ibGVyRGF0YSIsInB1dCIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwicmVuZGVyRGF0YSIsInZlcnREaXJ0eSIsInRyYW5zIiwibm9kZSIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwiX3VwZGF0ZUZvbnRGYW1pbHkiLCJfdXBkYXRlUHJvcGVydGllcyIsIl9jYWxjdWxhdGVMYWJlbEZvbnQiLCJfY2FsY3VsYXRlU3BsaXRTdHJpbmdzIiwiX3VwZGF0ZUxhYmVsRGltZW5zaW9ucyIsIl9jYWxjdWxhdGVUZXh0QmFzZWxpbmUiLCJfdXBkYXRlVGV4dHVyZSIsImFjdHVhbEZvbnRTaXplIiwic2V0Q29udGVudFNpemUiLCJ1cGRhdGVWZXJ0ZXhEYXRhIiwibWFya0ZvclVwZGF0ZVJlbmRlckRhdGEiLCJ1c2VTeXN0ZW1Gb250IiwiZm9udCIsIl9uYXRpdmVBc3NldCIsImxvYWRlciIsImxvYWQiLCJuYXRpdmVVcmwiLCJlcnIiLCJmb250RmFtaWx5IiwiY29udGV4dCIsInNwcml0ZUZyYW1lIiwic3RyaW5nIiwidG9TdHJpbmciLCJmb250U2l6ZSIsIm92ZXJmbG93IiwibGluZUhlaWdodCIsImhvcml6b250YWxBbGlnbiIsInZlcnRpY2FsQWxpZ24iLCJjb2xvciIsImlzQm9sZCIsImlzSXRhbGljIiwiaXNVbmRlcmxpbmUiLCJSRVNJWkVfSEVJR0hUIiwiZW5hYmxlV3JhcFRleHQiLCJvdXRsaW5lIiwiZ2V0Q29tcG9uZW50IiwiZW5hYmxlZCIsInNldCIsImEiLCJfY2FsY3VsYXRlRmlsbFRleHRTdGFydFBvc2l0aW9uIiwiX2dldExpbmVIZWlnaHQiLCJsaW5lQ291bnQiLCJsZW5ndGgiLCJsYWJlbFgiLCJmaXJzdExpbmVMYWJlbFkiLCJIb3Jpem9udGFsVGV4dEFsaWdubWVudCIsIlJJR0hUIiwiQ0VOVEVSIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiVE9QIiwiQkFTRUxJTkVfUkFUSU8iLCJSVU5USU1FX0JBU0VEIiwiTUlOSUdBTUUiLCJWZWMyIiwiY2xlYXJSZWN0Iiwic3RhcnRQb3NpdGlvbiIsImxpbmVKb2luIiwiZmlsbFN0eWxlIiwiciIsImciLCJiIiwidW5kZXJsaW5lU3RhcnRQb3NpdGlvbiIsImkiLCJzdHJva2VDb2xvciIsInN0cm9rZVN0eWxlIiwibGluZVdpZHRoIiwic3Ryb2tlVGV4dCIsIngiLCJ5IiwiZmlsbFRleHQiLCJfY2FsY3VsYXRlVW5kZXJsaW5lU3RhcnRQb3NpdGlvbiIsInNhdmUiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJyZXN0b3JlIiwidGV4IiwiU3ByaXRlRnJhbWUiLCJ0ZXh0dXJlIiwidXBsb2FkQWdhaW4iLCJyZXNldCIsIm1pcG1hcExldmVsIiwidXBsb2FkRGF0YSIsInBhcmFncmFwaGVkU3RyaW5ncyIsInNwbGl0IiwiY2FudmFzU2l6ZVgiLCJjYW52YXNTaXplWSIsInBhcmEiLCJwYXJhTGVuZ3RoIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJNYXRoIiwidGFuIiwiaEFsaWduIiwidkFsaWduIiwidGV4dEFsaWduIiwidGV4dEJhc2VsaW5lIiwiY2FudmFzV2lkdGhOb01hcmdpbiIsImFsbFdpZHRoIiwidGV4dEZyYWdtZW50IiwiX21lYXN1cmVUZXh0IiwiY29uY2F0IiwiX2dldEZvbnREZXNjIiwiZm9udERlc2MiLCJub2RlU3BhY2luZ1kiLCJfY2FsY3VsYXRlUGFyYWdyYXBoTGVuZ3RoIiwiY3R4IiwicGFyYWdyYXBoTGVuZ3RoIiwicHVzaCIsIlNIUklOSyIsInRvdGFsSGVpZ2h0IiwibWF4TGVuZ3RoIiwiY2FudmFzSGVpZ2h0Tm9NYXJnaW4iLCJ0cnlEaXZpZGVCeVR3byIsInN0YXJ0U2hyaW5rRm9udFNpemUiLCJqIiwibWVhc3VyZVdpZHRoIiwic2NhbGVYIiwic2NhbGVZIiwibWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxNQUFNQSxRQUFRLEdBQUdDLGNBQU1ELFFBQXZCOztBQUNBLE1BQU1FLEtBQUssR0FBR0MsY0FBTUQsS0FBTixDQUFZRSxLQUFaLEVBQWQ7O0FBQ0EsTUFBTUMsaUJBQWlCLEdBQUdDLFdBQUdDLGNBQUgsQ0FBa0JDLG9CQUFsQixFQUFnQ0Msb0JBQWhDLENBQTFCOztBQUVBLE1BQUlDLFFBQXlDLEdBQUcsSUFBaEQ7QUFDQSxNQUFJQyxPQUFpQyxHQUFHLElBQXhDO0FBQ0EsTUFBSUMsUUFBa0QsR0FBRyxJQUF6RDtBQUVBLE1BQUlDLFNBQVMsR0FBRyxFQUFoQjtBQUNBLE1BQUlDLE9BQU8sR0FBRyxFQUFkO0FBQ0EsTUFBSUMsU0FBUyxHQUFHLENBQWhCO0FBQ0EsTUFBSUMsYUFBYSxH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QixJQUFJVixPQUF6QixJQUFvQ3VJLFNBQW5EO0FBQ0EsY0FBTU8sTUFBTSxHQUFHM0osV0FBVyxDQUFDd0IsTUFBWixHQUFxQjJILFdBQXBDO0FBRUF0SixVQUFBQSxTQUFTLEdBQUlDLGFBQWEsR0FBR2tJLElBQUksQ0FBQzRCLEdBQUwsQ0FBUyxDQUFULEVBQVlGLE1BQVosRUFBb0JDLE1BQXBCLENBQWpCLEdBQWdELENBQTVEO0FBQ0FoSyxVQUFBQSxTQUFTLEdBQUcsS0FBS2dKLFlBQUwsRUFBWjtBQUNBbkosVUFBQUEsUUFBUSxDQUFDd0QsSUFBVCxHQUFnQnJELFNBQWhCO0FBQ0g7QUFDSjtBQUNKO0FBNWJvQixHQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBTcHJpdGVGcmFtZSwgVGV4dHVyZTJEIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9hc3NldHMnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgZnJhZ21lbnRUZXh0LCBzYWZlTWVhc3VyZVRleHQsIGpzLCBCQVNFTElORV9SQVRJTyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvdXRpbHMnO1xyXG5pbXBvcnQgeyBDb2xvciwgU2l6ZSwgVmVjMiB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IEhvcml6b250YWxUZXh0QWxpZ25tZW50LCBMYWJlbCwgTGFiZWxPdXRsaW5lLCBWZXJ0aWNhbFRleHRBbGlnbm1lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgSVNoYXJlZExhYmVsRGF0YSB9IGZyb20gJy4vZm9udC11dGlscyc7XHJcbmltcG9ydCB7IExldHRlclJlbmRlclRleHR1cmUgfSBmcm9tICcuL2xldHRlci1mb250JztcclxuaW1wb3J0IHsgbG9hZGVyIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9sb2FkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgbG9nSUQgfSBmcm9tICcuLi8uLi8uLi9jb3JlL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgUlVOVElNRV9CQVNFRCwgTUlOSUdBTUUgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXRyYW5zZm9ybSc7XHJcblxyXG5jb25zdCBPdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93O1xyXG5jb25zdCBXSElURSA9IENvbG9yLldISVRFLmNsb25lKCk7XHJcbmNvbnN0IE9VVExJTkVfU1VQUE9SVEVEID0ganMuaXNDaGlsZENsYXNzT2YoTGFiZWxPdXRsaW5lLCBDb21wb25lbnQpO1xyXG5cclxubGV0IF9jb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcclxubGV0IF9jYW52YXM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbmxldCBfdGV4dHVyZTogU3ByaXRlRnJhbWUgfCBMZXR0ZXJSZW5kZXJUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcblxyXG5sZXQgX2ZvbnREZXNjID0gJyc7XHJcbmxldCBfc3RyaW5nID0gJyc7XHJcbmxldCBfZm9udFNpemUgPSAwO1xyXG5sZXQgX2RyYXdGb250c2l6ZSA9IDA7XHJcbmxldCBfc3BsaXRTdHJpbmdzOiBzdHJpbmdbXSA9IFtdO1xyXG5jb25zdCBfY2FudmFzU2l6ZSA9IG5ldyBTaXplKCk7XHJcbmxldCBfbGluZUhlaWdodCA9IDA7XHJcbmxldCBfaEFsaWduID0gMDtcclxubGV0IF92QWxpZ24gPSAwO1xyXG5sZXQgX2NvbG9yID0gbmV3IENvbG9yKCk7XHJcbmxldCBfZm9udEZhbWlseSA9ICcnO1xyXG5sZXQgX292ZXJmbG93ID0gT3ZlcmZsb3cuTk9ORTtcclxubGV0IF9pc1dyYXBUZXh0ID0gZmFsc2U7XHJcblxyXG4vLyBvdXRsaW5lXHJcbmxldCBfaXNPdXRsaW5lZCA9IGZhbHNlO1xyXG5jb25zdCBfb3V0bGluZUNvbG9yID0gbmV3IENvbG9yKCk7XHJcbmxldCBfb3V0bGluZVdpZHRoID0gMDtcclxubGV0IF9tYXJnaW4gPSAwO1xyXG5cclxubGV0IF9pc0JvbGQgPSBmYWxzZTtcclxubGV0IF9pc0l0YWxpYyA9IGZhbHNlO1xyXG5sZXQgX2lzVW5kZXJsaW5lID0gZmFsc2U7XHJcblxyXG5leHBvcnQgY29uc3QgdHRmVXRpbHMgPSAge1xyXG4gICAgZ2V0QXNzZW1ibGVyRGF0YSAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcmVkTGFiZWxEYXRhID0gTGFiZWwuX2NhbnZhc1Bvb2wuZ2V0KCk7XHJcbiAgICAgICAgc2hhcmVkTGFiZWxEYXRhLmNhbnZhcy53aWR0aCA9IHNoYXJlZExhYmVsRGF0YS5jYW52YXMuaGVpZ2h0ID0gMTtcclxuICAgICAgICByZXR1cm4gc2hhcmVkTGFiZWxEYXRhO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldEFzc2VtYmxlckRhdGEgKGFzc2VtYmxlckRhdGE6IElTaGFyZWRMYWJlbERhdGEpIHtcclxuICAgICAgICBpZiAoYXNzZW1ibGVyRGF0YSkge1xyXG4gICAgICAgICAgICBMYWJlbC5fY2FudmFzUG9vbC5wdXQoYXNzZW1ibGVyRGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChjb21wOiBMYWJlbCkge1xyXG4gICAgICAgIGlmICghY29tcC5yZW5kZXJEYXRhIHx8ICFjb21wLnJlbmRlckRhdGEudmVydERpcnR5KSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICBsZXQgdHJhbnMgPSBjb21wLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICB0aGlzLl91cGRhdGVGb250RmFtaWx5KGNvbXApO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVByb3BlcnRpZXMoY29tcCwgdHJhbnMpO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUxhYmVsRm9udCgpO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNwbGl0U3RyaW5ncygpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVsRGltZW5zaW9ucygpO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVRleHRCYXNlbGluZSgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRleHR1cmUoKTtcclxuXHJcbiAgICAgICAgY29tcC5hY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZTtcclxuICAgICAgICB0cmFucy5zZXRDb250ZW50U2l6ZShfY2FudmFzU2l6ZSk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVmVydGV4RGF0YShjb21wKTtcclxuXHJcbiAgICAgICAgY29tcC5tYXJrRm9yVXBkYXRlUmVuZGVyRGF0YShmYWxzZSk7XHJcblxyXG4gICAgICAgIF9jb250ZXh0ID0gbnVsbDtcclxuICAgICAgICBfY2FudmFzID0gbnVsbDtcclxuICAgICAgICBfdGV4dHVyZSA9IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZVZlcnRleERhdGEgKGNvbXA6IExhYmVsKSB7XHJcbiAgICB9LFxyXG5cclxuICAgIF91cGRhdGVGb250RmFtaWx5IChjb21wOiBMYWJlbCkge1xyXG4gICAgICAgIGlmICghY29tcC51c2VTeXN0ZW1Gb250KSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wLmZvbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wLmZvbnQuX25hdGl2ZUFzc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2ZvbnRGYW1pbHkgPSBjb21wLmZvbnQuX25hdGl2ZUFzc2V0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVyLmxvYWQoY29tcC5mb250Lm5hdGl2ZVVybCwgKGVyciwgZm9udEZhbWlseSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZm9udEZhbWlseSA9IGZvbnRGYW1pbHkgfHwgJ0FyaWFsJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcC5mb250IS5fbmF0aXZlQXNzZXQgPSBmb250RmFtaWx5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wLnVwZGF0ZVJlbmRlckRhdGEodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfZm9udEZhbWlseSA9ICdBcmlhbCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF9mb250RmFtaWx5ID0gY29tcC5mb250RmFtaWx5O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZVByb3BlcnRpZXMgKGNvbXA6IExhYmVsLCB0cmFuczogVUlUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb25zdCBhc3NlbWJsZXJEYXRhID0gY29tcC5hc3NlbWJsZXJEYXRhO1xyXG4gICAgICAgIGlmICghYXNzZW1ibGVyRGF0YSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9jb250ZXh0ID0gYXNzZW1ibGVyRGF0YS5jb250ZXh0O1xyXG4gICAgICAgIF9jYW52YXMgPSBhc3NlbWJsZXJEYXRhLmNhbnZhcztcclxuICAgICAgICBfdGV4dHVyZSA9IGNvbXAuc3ByaXRlRnJhbWU7XHJcblxyXG4gICAgICAgIF9zdHJpbmcgPSBjb21wLnN0cmluZy50b1N0cmluZygpO1xyXG4gICAgICAgIF9mb250U2l6ZSA9IGNvbXAuZm9udFNpemU7XHJcbiAgICAgICAgX2RyYXdGb250c2l6ZSA9IF9mb250U2l6ZTtcclxuICAgICAgICBfb3ZlcmZsb3cgPSBjb21wLm92ZXJmbG93O1xyXG4gICAgICAgIF9jYW52YXNTaXplLndpZHRoID0gdHJhbnMud2lkdGg7XHJcbiAgICAgICAgX2NhbnZhc1NpemUuaGVpZ2h0ID0gdHJhbnMuaGVpZ2h0O1xyXG4gICAgICAgIF9saW5lSGVpZ2h0ID0gY29tcC5saW5lSGVpZ2h0O1xyXG4gICAgICAgIF9oQWxpZ24gPSBjb21wLmhvcml6b250YWxBbGlnbjtcclxuICAgICAgICBfdkFsaWduID0gY29tcC52ZXJ0aWNhbEFsaWduO1xyXG4gICAgICAgIF9jb2xvciA9IGNvbXAuY29sb3I7XHJcbiAgICAgICAgX2lzQm9sZCA9IGNvbXAuaXNCb2xkO1xyXG4gICAgICAgIF9pc0l0YWxpYyA9IGNvbXAuaXNJdGFsaWM7XHJcbiAgICAgICAgX2lzVW5kZXJsaW5lID0gY29tcC5pc1VuZGVybGluZTtcclxuXHJcbiAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuTk9ORSkge1xyXG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlJFU0laRV9IRUlHSFQpIHtcclxuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgX2lzV3JhcFRleHQgPSBjb21wLmVuYWJsZVdyYXBUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gb3V0bGluZVxyXG4gICAgICAgIGNvbnN0IG91dGxpbmUgPSBPVVRMSU5FX1NVUFBPUlRFRCAmJiBjb21wLmdldENvbXBvbmVudChMYWJlbE91dGxpbmUpO1xyXG4gICAgICAgIGlmIChvdXRsaW5lICYmIG91dGxpbmUuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBfaXNPdXRsaW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgIF9tYXJnaW4gPSBfb3V0bGluZVdpZHRoID0gb3V0bGluZS53aWR0aDtcclxuICAgICAgICAgICAgX291dGxpbmVDb2xvci5zZXQob3V0bGluZS5jb2xvcik7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IHRlbXBvcmFyeSBzb2x1dGlvbiwgY2FzY2FkZSBvcGFjaXR5IGZvciBvdXRsaW5lIGNvbG9yXHJcbiAgICAgICAgICAgIF9vdXRsaW5lQ29sb3IuYSA9IF9vdXRsaW5lQ29sb3IuYSAqIGNvbXAuY29sb3IuYSAvIDI1NS4wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgX2lzT3V0bGluZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgX21hcmdpbiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfY2FsY3VsYXRlRmlsbFRleHRTdGFydFBvc2l0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xyXG4gICAgICAgIGNvbnN0IGxpbmVDb3VudCA9IF9zcGxpdFN0cmluZ3MubGVuZ3RoO1xyXG4gICAgICAgIGxldCBsYWJlbFggPSAwO1xyXG4gICAgICAgIGxldCBmaXJzdExpbmVMYWJlbFkgPSAwO1xyXG5cclxuICAgICAgICBpZiAoX2hBbGlnbiA9PT0gSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQuUklHSFQpIHtcclxuICAgICAgICAgICAgbGFiZWxYID0gX2NhbnZhc1NpemUud2lkdGggLSBfbWFyZ2luO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfaEFsaWduID09PSBIb3Jpem9udGFsVGV4dEFsaWdubWVudC5DRU5URVIpIHtcclxuICAgICAgICAgICAgbGFiZWxYID0gX2NhbnZhc1NpemUud2lkdGggLyAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGFiZWxYID0gMCArIF9tYXJnaW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX3ZBbGlnbiA9PT0gVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUCkge1xyXG4gICAgICAgICAgICBmaXJzdExpbmVMYWJlbFkgPSBfZm9udFNpemUgKiAoQkFTRUxJTkVfUkFUSU8gLyAyKTtcclxuICAgICAgICAgICAgaWYgKFJVTlRJTUVfQkFTRUQgfHwgTUlOSUdBTUUpIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0TGluZUxhYmVsWSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX3ZBbGlnbiA9PT0gVmVydGljYWxUZXh0QWxpZ25tZW50LkNFTlRFUikge1xyXG4gICAgICAgICAgICBmaXJzdExpbmVMYWJlbFkgPSBfY2FudmFzU2l6ZS5oZWlnaHQgLyAyIC0gbGluZUhlaWdodCAqIChsaW5lQ291bnQgLSAxKSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmaXJzdExpbmVMYWJlbFkgPSBfY2FudmFzU2l6ZS5oZWlnaHQgLSBsaW5lSGVpZ2h0ICogKGxpbmVDb3VudCAtIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKGxhYmVsWCwgZmlyc3RMaW5lTGFiZWxZKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZVRleHR1cmUgKCkge1xyXG4gICAgICAgIGlmICghX2NvbnRleHQgfHwgIV9jYW52YXMpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfY29udGV4dC5jbGVhclJlY3QoMCwgMCwgX2NhbnZhcy53aWR0aCwgX2NhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIF9jb250ZXh0LmZvbnQgPSBfZm9udERlc2M7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSB0aGlzLl9jYWxjdWxhdGVGaWxsVGV4dFN0YXJ0UG9zaXRpb24oKTtcclxuICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xyXG4gICAgICAgIC8vIHVzZSByb3VuZCBmb3IgbGluZSBqb2luIHRvIGF2b2lkIHNoYXJwIGludGVyc2VjdCBwb2ludFxyXG4gICAgICAgIF9jb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcclxuICAgICAgICBfY29udGV4dC5maWxsU3R5bGUgPSBgcmdiYSgke19jb2xvci5yfSwgJHtfY29sb3IuZ30sICR7X2NvbG9yLmJ9LCAke19jb2xvci5hIC8gMjU1fSlgO1xyXG4gICAgICAgIGxldCB1bmRlcmxpbmVTdGFydFBvc2l0aW9uO1xyXG5cclxuICAgICAgICAvLyBkbyByZWFsIHJlbmRlcmluZ1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3NwbGl0U3RyaW5ncy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoX2lzT3V0bGluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0cm9rZUNvbG9yID0gX291dGxpbmVDb2xvciB8fCBXSElURTtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnN0cm9rZVN0eWxlID0gYHJnYmEoJHtzdHJva2VDb2xvci5yfSwgJHtzdHJva2VDb2xvci5nfSwgJHtzdHJva2VDb2xvci5ifSwgJHtzdHJva2VDb2xvci5hIC8gMjU1fSlgO1xyXG4gICAgICAgICAgICAgICAgX2NvbnRleHQubGluZVdpZHRoID0gX291dGxpbmVXaWR0aCAqIDI7XHJcbiAgICAgICAgICAgICAgICBfY29udGV4dC5zdHJva2VUZXh0KF9zcGxpdFN0cmluZ3NbaV0sIHN0YXJ0UG9zaXRpb24ueCwgc3RhcnRQb3NpdGlvbi55ICsgaSAqIGxpbmVIZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9jb250ZXh0LmZpbGxUZXh0KF9zcGxpdFN0cmluZ3NbaV0sIHN0YXJ0UG9zaXRpb24ueCwgc3RhcnRQb3NpdGlvbi55ICsgaSAqIGxpbmVIZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF9pc1VuZGVybGluZSkge1xyXG4gICAgICAgICAgICAgICAgdW5kZXJsaW5lU3RhcnRQb3NpdGlvbiA9IHRoaXMuX2NhbGN1bGF0ZVVuZGVybGluZVN0YXJ0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgX2NvbnRleHQubGluZVdpZHRoID0gX2ZvbnRTaXplIC8gODtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnN0cm9rZVN0eWxlID0gYHJnYmEoJHtfY29sb3Iucn0sICR7X2NvbG9yLmd9LCAke19jb2xvci5ifSwgJHtfY29sb3IuYSAvIDI1NX0pYDtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0Lm1vdmVUbyh1bmRlcmxpbmVTdGFydFBvc2l0aW9uLngsIHVuZGVybGluZVN0YXJ0UG9zaXRpb24ueSArIGkgKiBsaW5lSGVpZ2h0IC0gMSk7XHJcbiAgICAgICAgICAgICAgICBfY29udGV4dC5saW5lVG8odW5kZXJsaW5lU3RhcnRQb3NpdGlvbi54ICsgX2NhbnZhcy53aWR0aCwgdW5kZXJsaW5lU3RhcnRQb3NpdGlvbi55ICsgaSAqIGxpbmVIZWlnaHQgLSAxKTtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgX2NvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBfdGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XHJcbiAgICAgICAgaWYgKF90ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXg6IFRleHR1cmUyRCB8IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChfdGV4dHVyZSBpbnN0YW5jZW9mIFNwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXggPSAoX3RleHR1cmUudGV4dHVyZSBhcyBUZXh0dXJlMkQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4ID0gX3RleHR1cmU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZEFnYWluID0gX2NhbnZhcy53aWR0aCAhPT0gMCAmJiBfY2FudmFzLmhlaWdodCAhPT0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGxvYWRBZ2Fpbikge1xyXG4gICAgICAgICAgICAgICAgdGV4LnJlc2V0KHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogX2NhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IF9jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIG1pcG1hcExldmVsOiAxXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRleC51cGxvYWREYXRhKF9jYW52YXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfY2FsY3VsYXRlVW5kZXJsaW5lU3RhcnRQb3NpdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMuX2dldExpbmVIZWlnaHQoKTtcclxuICAgICAgICBjb25zdCBsaW5lQ291bnQgPSBfc3BsaXRTdHJpbmdzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBsYWJlbFggPSAwICsgX21hcmdpbjtcclxuICAgICAgICBsZXQgZmlyc3RMaW5lTGFiZWxZID0gMDtcclxuXHJcbiAgICAgICAgaWYgKF92QWxpZ24gPT09IFZlcnRpY2FsVGV4dEFsaWdubWVudC5UT1ApIHtcclxuICAgICAgICAgICAgZmlyc3RMaW5lTGFiZWxZID0gX2ZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfdkFsaWduID09PSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSKSB7XHJcbiAgICAgICAgICAgIGZpcnN0TGluZUxhYmVsWSA9IF9jYW52YXNTaXplLmhlaWdodCAvIDIgLSBsaW5lSGVpZ2h0ICogKGxpbmVDb3VudCAtIDEpIC8gMiArIF9mb250U2l6ZSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmaXJzdExpbmVMYWJlbFkgPSBfY2FudmFzU2l6ZS5oZWlnaHQgLSBsaW5lSGVpZ2h0ICogKGxpbmVDb3VudCAtIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKGxhYmVsWCwgZmlyc3RMaW5lTGFiZWxZKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3VwZGF0ZUxhYmVsRGltZW5zaW9ucyAoKSB7XHJcbiAgICAgICAgaWYgKCFfY29udGV4dCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFncmFwaGVkU3RyaW5ncyA9IF9zdHJpbmcuc3BsaXQoJ1xcbicpO1xyXG5cclxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XHJcbiAgICAgICAgICAgIF9jYW52YXNTaXplLmhlaWdodCA9IChfc3BsaXRTdHJpbmdzLmxlbmd0aCArIEJBU0VMSU5FX1JBVElPKSAqIHRoaXMuX2dldExpbmVIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XHJcbiAgICAgICAgICAgIF9zcGxpdFN0cmluZ3MgPSBwYXJhZ3JhcGhlZFN0cmluZ3M7XHJcbiAgICAgICAgICAgIGxldCBjYW52YXNTaXplWCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjYW52YXNTaXplWSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYSBvZiBwYXJhZ3JhcGhlZFN0cmluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFMZW5ndGggPSBzYWZlTWVhc3VyZVRleHQoX2NvbnRleHQsIHBhcmEpO1xyXG4gICAgICAgICAgICAgICAgY2FudmFzU2l6ZVggPSBjYW52YXNTaXplWCA+IHBhcmFMZW5ndGggPyBjYW52YXNTaXplWCA6IHBhcmFMZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FudmFzU2l6ZVkgPSAoX3NwbGl0U3RyaW5ncy5sZW5ndGggKyBCQVNFTElORV9SQVRJTykgKiB0aGlzLl9nZXRMaW5lSGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICBfY2FudmFzU2l6ZS53aWR0aCA9IHBhcnNlRmxvYXQoY2FudmFzU2l6ZVgudG9GaXhlZCgyKSkgKyAyICogX21hcmdpbjtcclxuICAgICAgICAgICAgX2NhbnZhc1NpemUuaGVpZ2h0ID0gcGFyc2VGbG9hdChjYW52YXNTaXplWS50b0ZpeGVkKDIpKTtcclxuICAgICAgICAgICAgaWYgKF9pc0l0YWxpYykge1xyXG4gICAgICAgICAgICAgICAgLy8gMC4wMTc0NTMyOTI1ID0gMy4xNDE1OTI2NTMgLyAxODBcclxuICAgICAgICAgICAgICAgIF9jYW52YXNTaXplLndpZHRoICs9IF9kcmF3Rm9udHNpemUgKiBNYXRoLnRhbigxMiAqIDAuMDE3NDUzMjkyNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghX2NhbnZhcyl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9jYW52YXMud2lkdGggPSBfY2FudmFzU2l6ZS53aWR0aDtcclxuICAgICAgICBfY2FudmFzLmhlaWdodCA9IF9jYW52YXNTaXplLmhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgX2NhbGN1bGF0ZVRleHRCYXNlbGluZSAoKSB7XHJcbiAgICAgICAgLy8gbGV0IG5vZGUgPSB0aGlzLl9ub2RlO1xyXG4gICAgICAgIGxldCBoQWxpZ247XHJcbiAgICAgICAgbGV0IHZBbGlnbjtcclxuXHJcbiAgICAgICAgaWYgKF9oQWxpZ24gPT09IEhvcml6b250YWxUZXh0QWxpZ25tZW50LlJJR0hUKSB7XHJcbiAgICAgICAgICAgIGhBbGlnbiA9ICdyaWdodCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF9oQWxpZ24gPT09IEhvcml6b250YWxUZXh0QWxpZ25tZW50LkNFTlRFUikge1xyXG4gICAgICAgICAgICBoQWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhBbGlnbiA9ICdsZWZ0JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfdkFsaWduID09PSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QKSB7XHJcbiAgICAgICAgICAgIHZBbGlnbiA9ICd0b3AnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChfdkFsaWduID09PSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSKSB7XHJcbiAgICAgICAgICAgIHZBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdkFsaWduID0gJ2JvdHRvbSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX2NvbnRleHQpIHtcclxuICAgICAgICAgICAgX2NvbnRleHQudGV4dEFsaWduID0gaEFsaWduO1xyXG4gICAgICAgICAgICBfY29udGV4dC50ZXh0QmFzZWxpbmUgPSB2QWxpZ247XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfY2FsY3VsYXRlU3BsaXRTdHJpbmdzICgpIHtcclxuICAgICAgICBpZiAoIV9jb250ZXh0KXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwYXJhZ3JhcGhlZFN0cmluZ3MgPSBfc3RyaW5nLnNwbGl0KCdcXG4nKTtcclxuXHJcbiAgICAgICAgaWYgKF9pc1dyYXBUZXh0KSB7XHJcbiAgICAgICAgICAgIF9zcGxpdFN0cmluZ3MgPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgY2FudmFzV2lkdGhOb01hcmdpbiA9IF9jYW52YXNTaXplLndpZHRoIC0gMiAqIF9tYXJnaW47XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYSBvZiBwYXJhZ3JhcGhlZFN0cmluZ3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbFdpZHRoID0gc2FmZU1lYXN1cmVUZXh0KF9jb250ZXh0LCBwYXJhKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRGcmFnbWVudCA9IGZyYWdtZW50VGV4dChwYXJhLCBhbGxXaWR0aCwgY2FudmFzV2lkdGhOb01hcmdpbiwgdGhpcy5fbWVhc3VyZVRleHQoX2NvbnRleHQhKSk7XHJcbiAgICAgICAgICAgICAgICBfc3BsaXRTdHJpbmdzID0gX3NwbGl0U3RyaW5ncy5jb25jYXQodGV4dEZyYWdtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgX3NwbGl0U3RyaW5ncyA9IHBhcmFncmFwaGVkU3RyaW5ncztcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBfZ2V0Rm9udERlc2MgKCkge1xyXG4gICAgICAgIGxldCBmb250RGVzYyA9IF9mb250U2l6ZS50b1N0cmluZygpICsgJ3B4ICc7XHJcbiAgICAgICAgZm9udERlc2MgPSBmb250RGVzYyArIF9mb250RmFtaWx5O1xyXG4gICAgICAgIGlmIChfaXNCb2xkKSB7XHJcbiAgICAgICAgICAgIGZvbnREZXNjID0gJ2JvbGQgJyArIGZvbnREZXNjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF9pc0l0YWxpYykge1xyXG4gICAgICAgICAgICBmb250RGVzYyA9ICdpdGFsaWMgJyArIGZvbnREZXNjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZvbnREZXNjO1xyXG4gICAgfSxcclxuXHJcbiAgICBfZ2V0TGluZUhlaWdodCAoKSB7XHJcbiAgICAgICAgbGV0IG5vZGVTcGFjaW5nWSA9IF9saW5lSGVpZ2h0O1xyXG4gICAgICAgIGlmIChub2RlU3BhY2luZ1kgPT09IDApIHtcclxuICAgICAgICAgICAgbm9kZVNwYWNpbmdZID0gX2ZvbnRTaXplO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGVTcGFjaW5nWSA9IG5vZGVTcGFjaW5nWSAqIF9mb250U2l6ZSAvIF9kcmF3Rm9udHNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZVNwYWNpbmdZIHwgMDtcclxuICAgIH0sXHJcblxyXG4gICAgX2NhbGN1bGF0ZVBhcmFncmFwaExlbmd0aCAocGFyYWdyYXBoZWRTdHJpbmdzOiBzdHJpbmdbXSwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICBjb25zdCBwYXJhZ3JhcGhMZW5ndGg6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgcGFyYSBvZiBwYXJhZ3JhcGhlZFN0cmluZ3MpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IHNhZmVNZWFzdXJlVGV4dChjdHgsIHBhcmEpO1xyXG4gICAgICAgICAgICBwYXJhZ3JhcGhMZW5ndGgucHVzaCh3aWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyYWdyYXBoTGVuZ3RoO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbWVhc3VyZVRleHQgKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICAgICAgcmV0dXJuIChzdHJpbmc6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc2FmZU1lYXN1cmVUZXh0KGN0eCwgc3RyaW5nKTtcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBfY2FsY3VsYXRlTGFiZWxGb250ICgpIHtcclxuICAgICAgICBpZiAoIV9jb250ZXh0KXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2ZvbnREZXNjID0gdGhpcy5fZ2V0Rm9udERlc2MoKTtcclxuICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xyXG5cclxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyYWdyYXBoZWRTdHJpbmdzID0gX3N0cmluZy5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFncmFwaExlbmd0aCA9IHRoaXMuX2NhbGN1bGF0ZVBhcmFncmFwaExlbmd0aChwYXJhZ3JhcGhlZFN0cmluZ3MsIF9jb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIF9zcGxpdFN0cmluZ3MgPSBwYXJhZ3JhcGhlZFN0cmluZ3M7XHJcbiAgICAgICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgbGV0IG1heExlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoX2lzV3JhcFRleHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoTm9NYXJnaW4gPSBfY2FudmFzU2l6ZS53aWR0aCAtIDIgKiBfbWFyZ2luO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2FudmFzSGVpZ2h0Tm9NYXJnaW4gPSBfY2FudmFzU2l6ZS5oZWlnaHQgLSAyICogX21hcmdpbjtcclxuICAgICAgICAgICAgICAgIGlmIChjYW52YXNXaWR0aE5vTWFyZ2luIDwgMCB8fCBjYW52YXNIZWlnaHROb01hcmdpbiA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0LmZvbnQgPSBfZm9udERlc2M7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG90YWxIZWlnaHQgPSBjYW52YXNIZWlnaHROb01hcmdpbiArIDE7XHJcbiAgICAgICAgICAgICAgICBtYXhMZW5ndGggPSBjYW52YXNXaWR0aE5vTWFyZ2luICsgMTtcclxuICAgICAgICAgICAgICAgIGxldCBhY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZSArIDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dEZyYWdtZW50OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyeURpdmlkZUJ5VHdvID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydFNocmlua0ZvbnRTaXplID0gYWN0dWFsRm9udFNpemUgfCAwO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICh0b3RhbEhlaWdodCA+IGNhbnZhc0hlaWdodE5vTWFyZ2luIHx8IG1heExlbmd0aCA+IGNhbnZhc1dpZHRoTm9NYXJnaW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJ5RGl2aWRlQnlUd28pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsRm9udFNpemUgPSAoc3RhcnRTaHJpbmtGb250U2l6ZSAvIDIpIHwgMDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxGb250U2l6ZSA9IHN0YXJ0U2hyaW5rRm9udFNpemUgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFNocmlua0ZvbnRTaXplID0gYWN0dWFsRm9udFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWxGb250U2l6ZSA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0lEKDQwMDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgX2ZvbnRTaXplID0gYWN0dWFsRm9udFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgX2ZvbnREZXNjID0gdGhpcy5fZ2V0Rm9udERlc2MoKTtcclxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfc3BsaXRTdHJpbmdzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJhZ3JhcGhlZFN0cmluZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGogPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxXaWR0aCA9IHNhZmVNZWFzdXJlVGV4dChfY29udGV4dCwgcGFyYWdyYXBoZWRTdHJpbmdzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEZyYWdtZW50ID0gZnJhZ21lbnRUZXh0KHBhcmFncmFwaGVkU3RyaW5nc1tpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzV2lkdGhOb01hcmdpbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21lYXN1cmVUZXh0KF9jb250ZXh0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgdGV4dEZyYWdtZW50Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhc3VyZVdpZHRoID0gc2FmZU1lYXN1cmVUZXh0KF9jb250ZXh0LCB0ZXh0RnJhZ21lbnRbal0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gbWVhc3VyZVdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxIZWlnaHQgKz0gdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKytqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zcGxpdFN0cmluZ3MgPSBfc3BsaXRTdHJpbmdzLmNvbmNhdCh0ZXh0RnJhZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyeURpdmlkZUJ5VHdvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbEhlaWdodCA+IGNhbnZhc0hlaWdodE5vTWFyZ2luKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFNocmlua0ZvbnRTaXplID0gYWN0dWFsRm9udFNpemUgfCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5RGl2aWRlQnlUd28gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gY2FudmFzSGVpZ2h0Tm9NYXJnaW4gKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG90YWxIZWlnaHQgPSBwYXJhZ3JhcGhlZFN0cmluZ3MubGVuZ3RoICogdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJhZ3JhcGhlZFN0cmluZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF4TGVuZ3RoIDwgcGFyYWdyYXBoTGVuZ3RoW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IHBhcmFncmFwaExlbmd0aFtpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZVggPSAoX2NhbnZhc1NpemUud2lkdGggLSAyICogX21hcmdpbikgLyBtYXhMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZVkgPSBfY2FudmFzU2l6ZS5oZWlnaHQgLyB0b3RhbEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICBfZm9udFNpemUgPSAoX2RyYXdGb250c2l6ZSAqIE1hdGgubWluKDEsIHNjYWxlWCwgc2NhbGVZKSkgfCAwO1xyXG4gICAgICAgICAgICAgICAgX2ZvbnREZXNjID0gdGhpcy5fZ2V0Rm9udERlc2MoKTtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LmZvbnQgPSBfZm9udERlc2M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59O1xyXG4iXX0=