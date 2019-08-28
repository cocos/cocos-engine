/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import Assembler2D from '../../assembler-2d';

let textUtils = require('../../../utils/text-utils');
const macro = require('../../../platform/CCMacro');
const Label = require('../../../components/CCLabel');
const LabelOutline = require('../../../components/CCLabelOutline');
const LabelShadow = require('../../../components/CCLabelShadow');
const Overflow = Label.Overflow;
const deleteFromDynamicAtlas = require('../utils').deleteFromDynamicAtlas;
const getFontFamily = require('../utils').getFontFamily;

const MAX_SIZE = 2048;
const _invisibleAlpha = (1 / 255).toFixed(3);

let _context = null;
let _canvas = null;
let _texture = null;

let _fontDesc = '';
let _string = '';
let _fontSize = 0;
let _drawFontSize = 0;
let _splitedStrings = [];
let _canvasSize = cc.Size.ZERO;
let _lineHeight = 0;
let _hAlign = 0;
let _vAlign = 0;
let _color = null;
let _fontFamily = '';
let _overflow = Overflow.NONE;
let _isWrapText = false;

// outline
let _outlineComp = null;
let _outlineColor = cc.Color.WHITE;

// shadow
let _shadowComp = null;
let _shadowColor = cc.Color.BLACK;

let _canvasPadding = cc.rect();
let _contentSizeExtend = cc.Size.ZERO;
let _nodeContentSize = cc.Size.ZERO;

let _enableBold = false;
let _enableItalic = false;
let _enableUnderline = false;
let _underlineThickness = 0;

let _drawUnderlinePos = cc.Vec2.ZERO;
let _drawUnderlineWidth = 0;

let _sharedLabelData;

export default class TTFAssembler extends Assembler2D {
    _getAssemblerData () {
        _sharedLabelData = Label._canvasPool.get();
        _sharedLabelData.canvas.width = _sharedLabelData.canvas.height = 1;
        return _sharedLabelData;
    }

    _resetAssemblerData (assemblerData) {
        if (assemblerData) {
            Label._canvasPool.put(assemblerData);
        }
    }

    updateRenderData (comp) {
        super.updateRenderData(comp);
        
        if (!comp._vertsDirty) return;

        this._updateFontFamily(comp);
        this._updateProperties(comp);
        this._calculateLabelFont();
        this._calculateSplitedStrings();
        this._updateLabelDimensions();
        this._calculateTextBaseline();
        this._updateTexture(comp);
        this._calDynamicAtlas(comp);

        comp._actualFontSize = _fontSize;
        comp.node.setContentSize(_nodeContentSize);

        this.updateVerts(comp);

        comp._vertsDirty = false;

        _context = null;
        _canvas = null;
        _texture = null;
    }

    updateVerts () {
    }

    _updatePaddingRect () {
        let top = 0, bottom = 0, left = 0, right = 0;
        let outlineWidth = 0;
        _contentSizeExtend.width = _contentSizeExtend.height = 0;
        if (_outlineComp) {
            outlineWidth = _outlineComp.width;
            top = bottom = left = right = outlineWidth;
            _contentSizeExtend.width = _contentSizeExtend.height = outlineWidth * 2;
        }
        if (_shadowComp) {
            let shadowWidth = _shadowComp.blur + outlineWidth;
            left = Math.max(left, -_shadowComp._offset.x + shadowWidth);
            right = Math.max(right, _shadowComp._offset.x + shadowWidth);
            top = Math.max(top, _shadowComp._offset.y + shadowWidth);
            bottom = Math.max(bottom, -_shadowComp._offset.y + shadowWidth);
        }
        if (_enableItalic) {
            //0.0174532925 = 3.141592653 / 180
            let offset = _drawFontSize * Math.tan(12 * 0.0174532925);
            right += offset;
            _contentSizeExtend.width += offset;
        }
        _canvasPadding.x = left;
        _canvasPadding.y = top;
        _canvasPadding.width = left + right;
        _canvasPadding.height = top + bottom;
    }

    _updateFontFamily (comp) {
        _fontFamily = getFontFamily(comp);
    }

    _updateProperties (comp) {
        let assemblerData = comp._assemblerData;
        _context = assemblerData.context;
        _canvas = assemblerData.canvas;
        _texture = comp._frame._original ? comp._frame._original._texture : comp._frame._texture;

        _string = comp.string.toString();
        _fontSize = comp._fontSize;
        _drawFontSize = _fontSize;
        _underlineThickness = _drawFontSize / 8;
        _overflow = comp.overflow;
        _canvasSize.width = comp.node.width;
        _canvasSize.height = comp.node.height;
        _nodeContentSize = comp.node.getContentSize();
        _lineHeight = comp._lineHeight;
        _hAlign = comp.horizontalAlign;
        _vAlign = comp.verticalAlign;
        _color = comp.node.color;
        _enableBold = comp._isBold;
        _enableItalic = comp._isItalic;
        _enableUnderline = comp._isUnderline;

        if (_overflow === Overflow.NONE) {
            _isWrapText = false;
        }
        else if (_overflow === Overflow.RESIZE_HEIGHT) {
            _isWrapText = true;
        }
        else {
            _isWrapText = comp.enableWrapText;
        }

        // outline
        _outlineComp = LabelOutline && comp.getComponent(LabelOutline);
        _outlineComp = (_outlineComp && _outlineComp.enabled && _outlineComp.width > 0) ? _outlineComp : null;
        if (_outlineComp) {
            _outlineColor.set(_outlineComp.color);
        }

        // shadow
        _shadowComp = LabelShadow && comp.getComponent(LabelShadow);
        _shadowComp = (_shadowComp && _shadowComp.enabled) ? _shadowComp : null;
        if (_shadowComp) {
            _shadowColor.set(_shadowComp.color);
            // TODO: temporary solution, cascade opacity for outline color
            _shadowColor.a = _shadowColor.a * comp.node.color.a / 255.0;
        }

        this._updatePaddingRect();
    }

    _calculateFillTextStartPosition () {
        let labelX = 0;
        if (_hAlign === macro.TextAlignment.RIGHT) {
            labelX = _canvasSize.width - _canvasPadding.width;
        }
        else if (_hAlign === macro.TextAlignment.CENTER) {
            labelX = (_canvasSize.width - _canvasPadding.width) / 2;
        }

        let firstLinelabelY = 0;
        let lineHeight = this._getLineHeight();
        let drawStartY = lineHeight * (_splitedStrings.length - 1);
        if (_vAlign === macro.VerticalTextAlignment.TOP) {
            firstLinelabelY = _fontSize;
        }
        else if (_vAlign === macro.VerticalTextAlignment.CENTER) {
            firstLinelabelY = (_canvasSize.height - drawStartY) * 0.5 + _fontSize * textUtils.MIDDLE_RATIO - _canvasPadding.height / 2;
        }
        else {
            firstLinelabelY = _canvasSize.height - drawStartY - _fontSize * textUtils.BASELINE_RATIO - _canvasPadding.height;
        }

        return cc.v2(labelX + _canvasPadding.x, firstLinelabelY + _canvasPadding.y);
    }

    _setupOutline () {
        _context.strokeStyle = `rgba(${_outlineColor.r}, ${_outlineColor.g}, ${_outlineColor.b}, ${_outlineColor.a / 255})`;
        _context.lineWidth = _outlineComp.width * 2;
    }

    _setupShadow () {
        _context.shadowColor = `rgba(${_shadowColor.r}, ${_shadowColor.g}, ${_shadowColor.b}, ${_shadowColor.a / 255})`;
        _context.shadowBlur = _shadowComp.blur;
        _context.shadowOffsetX = _shadowComp.offset.x;
        _context.shadowOffsetY = -_shadowComp.offset.y;
    }

    _drawUnderline (underlinewidth) {
        if (_outlineComp) {
            this._setupOutline();
            _context.strokeRect(_drawUnderlinePos.x, _drawUnderlinePos.y, underlinewidth, _underlineThickness);
        }
        _context.lineWidth = _underlineThickness;
        _context.fillStyle = `rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a / 255})`;
        _context.fillRect(_drawUnderlinePos.x, _drawUnderlinePos.y, underlinewidth, _underlineThickness);
    }

    _updateTexture () {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        //Add a white background to avoid black edges.
        //TODO: it is best to add alphaTest to filter out the background color.
        let _fillColor = _outlineComp ? _outlineColor : _color;
        _context.fillStyle = `rgba(${_fillColor.r}, ${_fillColor.g}, ${_fillColor.b}, ${_invisibleAlpha})`;
        _context.fillRect(0, 0, _canvas.width, _canvas.height);
        _context.font = _fontDesc;

        let startPosition = this._calculateFillTextStartPosition();
        let lineHeight = this._getLineHeight();
        //use round for line join to avoid sharp intersect point
        _context.lineJoin = 'round';
        _context.fillStyle = `rgba(${_color.r}, ${_color.g}, ${_color.b}, 1)`;

        let isMultiple = _splitedStrings.length > 1;

        //do real rendering
        let measureText = this._measureText(_context);

        let drawTextPosX = 0, drawTextPosY = 0;

        // only one set shadow and outline
        if (_shadowComp) {
            this._setupShadow();
        }
        if (_outlineComp) {
            this._setupOutline();
        }

        // draw shadow and (outline or text)
        for (let i = 0; i < _splitedStrings.length; ++i) {
            drawTextPosX = startPosition.x;
            drawTextPosY = startPosition.y + i * lineHeight;
            if (_shadowComp) {
                // multiple lines need to be drawn outline and fill text
                if (isMultiple) {
                    if (_outlineComp) {
                        _context.strokeText(_splitedStrings[i], drawTextPosX, drawTextPosY);
                    }
                    _context.fillText(_splitedStrings[i], drawTextPosX, drawTextPosY);
                }
            }

            // draw underline
            if (_enableUnderline) {
                _drawUnderlineWidth = measureText(_splitedStrings[i]);
                if (_hAlign === macro.TextAlignment.RIGHT) {
                    _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth;
                } else if (_hAlign === macro.TextAlignment.CENTER) {
                    _drawUnderlinePos.x = startPosition.x - (_drawUnderlineWidth / 2);
                } else {
                    _drawUnderlinePos.x = startPosition.x;
                }
                _drawUnderlinePos.y = drawTextPosY;
                this._drawUnderline(_drawUnderlineWidth);
            }
        }

        if (_shadowComp && isMultiple) {
            _context.shadowColor = 'transparent';
        }

        // draw text and outline
        for (let i = 0; i < _splitedStrings.length; ++i) {
            drawTextPosX = startPosition.x;
            drawTextPosY = startPosition.y + i * lineHeight;
            if (_outlineComp) {
                _context.strokeText(_splitedStrings[i], drawTextPosX, drawTextPosY);
            }
            _context.fillText(_splitedStrings[i], drawTextPosX, drawTextPosY);
        }

        if (_shadowComp) {
            _context.shadowColor = 'transparent';
        }

        _texture.handleLoadedTexture();
    }

    _calDynamicAtlas (comp) {
        if(comp.cacheMode !== Label.CacheMode.BITMAP) return;
        let frame = comp._frame;
        // Delete cache in atlas.
        deleteFromDynamicAtlas(comp, frame);
        if (!frame._original) {
            frame.setRect(cc.rect(0, 0, _canvas.width, _canvas.height));
        }
        this.packToDynamicAtlas(comp, frame);
    }

    _updateLabelDimensions () {
        let paragraphedStrings = _string.split('\n');

        if (_overflow === Overflow.RESIZE_HEIGHT) {
            let rawHeight = (_splitedStrings.length + textUtils.BASELINE_RATIO) * this._getLineHeight();
            _canvasSize.height = rawHeight + _canvasPadding.height;
            // set node height
            _nodeContentSize.height = rawHeight + _contentSizeExtend.height;
        }
        else if (_overflow === Overflow.NONE) {
            _splitedStrings = paragraphedStrings;
            let canvasSizeX = 0;
            let canvasSizeY = 0;
            for (let i = 0; i < paragraphedStrings.length; ++i) {
                let paraLength = textUtils.safeMeasureText(_context, paragraphedStrings[i]);
                canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
            }
            canvasSizeY = (_splitedStrings.length + textUtils.BASELINE_RATIO) * this._getLineHeight();
            let rawWidth = parseFloat(canvasSizeX.toFixed(2));
            let rawHeight = parseFloat(canvasSizeY.toFixed(2));
            _canvasSize.width = rawWidth + _canvasPadding.width;
            _canvasSize.height = rawHeight + _canvasPadding.height;
            _nodeContentSize.width = rawWidth + _contentSizeExtend.width;
            _nodeContentSize.height = rawHeight + _contentSizeExtend.height;
        }

        _canvasSize.width = Math.min(_canvasSize.width, MAX_SIZE);
        _canvasSize.height = Math.min(_canvasSize.height, MAX_SIZE);

        if (_canvas.width !== _canvasSize.width) {
            _canvas.width = _canvasSize.width;
        }

        if (_canvas.height !== _canvasSize.height) {
            _canvas.height = _canvasSize.height;
        }
    }

    _calculateTextBaseline () {
        let hAlign;

        if (_hAlign === macro.TextAlignment.RIGHT) {
            hAlign = 'right';
        }
        else if (_hAlign === macro.TextAlignment.CENTER) {
            hAlign = 'center';
        }
        else {
            hAlign = 'left';
        }
        _context.textAlign = hAlign;
        _context.textBaseline = 'alphabetic';
    }

    _calculateSplitedStrings () {
        let paragraphedStrings = _string.split('\n');

        if (_isWrapText) {
            _splitedStrings = [];
            let canvasWidthNoMargin = _nodeContentSize.width;
            for (let i = 0; i < paragraphedStrings.length; ++i) {
                let allWidth = textUtils.safeMeasureText(_context, paragraphedStrings[i]);
                let textFragment = textUtils.fragmentText(paragraphedStrings[i],
                                                        allWidth,
                                                        canvasWidthNoMargin,
                                                        this._measureText(_context));
                _splitedStrings = _splitedStrings.concat(textFragment);
            }
        }
        else {
            _splitedStrings = paragraphedStrings;
        }

    }

    _getFontDesc () {
        let fontDesc = _fontSize.toString() + 'px ';
        fontDesc = fontDesc + _fontFamily;
        if (_enableBold) {
            fontDesc = "bold " + fontDesc;
        }
        if (_enableItalic) {
            fontDesc = "italic " + fontDesc;
        }
        return fontDesc;
    }

    _getLineHeight () {
        let nodeSpacingY = _lineHeight;
        if (nodeSpacingY === 0) {
            nodeSpacingY = _fontSize;
        } else {
            nodeSpacingY = nodeSpacingY * _fontSize / _drawFontSize;
        }

        return nodeSpacingY | 0;
    }

    _calculateParagraphLength (paragraphedStrings, ctx) {
        let paragraphLength = [];

        for (let i = 0; i < paragraphedStrings.length; ++i) {
            let width = textUtils.safeMeasureText(ctx, paragraphedStrings[i]);
            paragraphLength.push(width);
        }

        return paragraphLength;
    }

    _measureText (ctx) {
        return function (string) {
            return textUtils.safeMeasureText(ctx, string);
        };
    }

    _calculateLabelFont () {
        _fontDesc = this._getFontDesc();
        _context.font = _fontDesc;

        if (_overflow === Overflow.SHRINK) {
            let paragraphedStrings = _string.split('\n');
            let paragraphLength = this._calculateParagraphLength(paragraphedStrings, _context);

            let i = 0;
            let totalHeight = 0;
            let maxLength = 0;

            if (_isWrapText) {
                let canvasWidthNoMargin = _nodeContentSize.width;
                let canvasHeightNoMargin = _nodeContentSize.height;
                if (canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
                    _fontDesc = this._getFontDesc();
                    _context.font = _fontDesc;
                    return;
                }
                totalHeight = canvasHeightNoMargin + 1;
                maxLength = canvasWidthNoMargin + 1;
                let actualFontSize = _fontSize + 1;
                let textFragment = "";
                let tryDivideByTwo = true;
                let startShrinkFontSize = actualFontSize | 0;

                while (totalHeight > canvasHeightNoMargin || maxLength > canvasWidthNoMargin) {
                    if (tryDivideByTwo) {
                        actualFontSize = (startShrinkFontSize / 2) | 0;
                    } else {
                        actualFontSize = startShrinkFontSize - 1;
                        startShrinkFontSize = actualFontSize;
                    }
                    if (actualFontSize <= 0) {
                        cc.logID(4003);
                        break;
                    }
                    _fontSize = actualFontSize;
                    _fontDesc = this._getFontDesc();
                    _context.font = _fontDesc;

                    totalHeight = 0;
                    for (i = 0; i < paragraphedStrings.length; ++i) {
                        let j = 0;
                        let allWidth = textUtils.safeMeasureText(_context, paragraphedStrings[i]);
                        textFragment = textUtils.fragmentText(paragraphedStrings[i],
                                                            allWidth,
                                                            canvasWidthNoMargin,
                                                            this._measureText(_context));
                        while (j < textFragment.length) {
                            maxLength = textUtils.safeMeasureText(_context, textFragment[j]);
                            totalHeight += this._getLineHeight();
                            ++j;
                        }
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
            }
            else {
                totalHeight = paragraphedStrings.length * this._getLineHeight();

                for (i = 0; i < paragraphedStrings.length; ++i) {
                    if (maxLength < paragraphLength[i]) {
                        maxLength = paragraphLength[i];
                    }
                }
                let scaleX = (_canvasSize.width - _canvasPadding.width) / maxLength;
                let scaleY = _canvasSize.height / totalHeight;

                _fontSize = (_drawFontSize * Math.min(1, scaleX, scaleY)) | 0;
                _fontDesc = this._getFontDesc();
                _context.font = _fontDesc;
            }
        }
    }
}

