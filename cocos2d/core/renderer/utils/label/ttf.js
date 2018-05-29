/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

const macro = require('../../../platform/CCMacro');
const utils = require('../../../utils/text-utils');
const renderEngine = require('../../render-engine');

const Label = require('../../../components/CCLabel');
const LabelOutline = require('../../../components/CCLabelOutline');
const Overflow = Label.Overflow;
const TextUtils = utils.TextUtils;
const CustomFontLoader = utils.CustomFontLoader;

let _comp = null;

let _context = null;
let _canvas = null;
let _texture = null;

let _fontDesc = '';
let _string = '';
let _fontSize = 0;
let _drawFontsize = 0;
let _splitedStrings = [];
let _canvasSize = cc.size();
let _lineHeight = 0;
let _hAlign = 0;
let _vAlign = 0;
let _color = null;
let _fontFamily = '';
let _overflow = Overflow.NONE;
let _isWrapText = false;

// outline
let _isOutlined = false;
let _outlineColor = null;
let _outlineWidth = 0;
let _margin = 0;

// gradient fill color
let _fillColorGradientEnabled = false;
let _gradientStartColor = null;
let _gradientEndColor = null;
let _gradientArgs = null;

let _isBold = false;
let _isItalic = false;
let _isUnderline = false;

let _sharedLabelData;

//
let _canvasPool = {
    pool: [],
    get () {
        let data = this.pool.pop();

        if (!data) {
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            data = {
                canvas: canvas,
                context: context
            }
        }

        return data;
    },
    put (canvas) {
        if (this.pool.length >= 32) {
            return;
        }
        this.pool.push(canvas);
    }
};


module.exports = {

    _getAssemblerData () {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            _sharedLabelData = _canvasPool.get();
        }
        else {
            if (!_sharedLabelData) {
                let labelCanvas = document.createElement("canvas");
                _sharedLabelData = {
                    canvas: labelCanvas,
                    context: labelCanvas.getContext("2d")
                };
            }
        }
        _sharedLabelData.canvas.width = _sharedLabelData.canvas.height = 1;
        return _sharedLabelData;
    },

    _resetAssemblerData (assemblerData) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS && assemblerData) {
            _canvasPool.put(assemblerData);
        }
    },

    updateRenderData (comp) {
        if (!comp._renderData.vertDirty) return;

        _comp = comp;

        if (this._updateFontFamly()) {
            this._updateProperties();
            this._calculateLabelFont();
            this._calculateSplitedStrings();
            this._updateLabelDimensions();
            this._calculateTextBaseline();
            this._updateTexture(_comp);
                
            _comp._actualFontSize = _fontSize;
            _comp.node.setContentSize(_canvasSize);

            this._updateVerts(_comp);

            _comp._renderData.vertDirty = _comp._renderData.uvDirty = false;

            _context = null;
            _canvas = null;
            _texture = null;
        }
        
        _comp = null;
    },

    _updateVerts () {
    },

    _updateFontFamly () {
        if (!_comp.useSystemFont) {
            if (!_comp.font) return false;

            let url = _comp.font.nativeUrl;
            if (CC_WECHATGAME) {
                _fontFamily = wx.loadFont(url);
                //avoid the error in wechat devtool platform
                if (!_fontFamily) {
                    _fontFamily = CustomFontLoader._getFontFamily(url);
                    cc.warn("TTF font is not supported on debugger, but it will be displayed correctly on mobile device.");
                }
            }
            else {
                _fontFamily = CustomFontLoader._getFontFamily(url);
                let fontDescriptor = CustomFontLoader._fontCache[_fontFamily];
                if (!fontDescriptor || !fontDescriptor.isLoaded()) {
                    CustomFontLoader.loadTTF(url);
                    return false;
                }
            }
        }
        else {
            _fontFamily = _comp.fontFamily;
        }

        return true;
    },

    _updateProperties () {
        let assemblerData = _comp._assemblerData;
        _context = assemblerData.context;
        _canvas = assemblerData.canvas;
        _texture = _comp._texture;
        
        _string = _comp.string.toString();
        _fontSize = _comp._fontSize;
        _drawFontsize = _fontSize;
        _overflow = _comp.overflow;
        _canvasSize.width = _comp.node.width;
        _canvasSize.height = _comp.node.height;
        _lineHeight = _comp._lineHeight;
        _hAlign = _comp.horizontalAlign;
        _vAlign = _comp.verticalAlign;
        _color = _comp.node.color;
        _isBold = _comp._isBold;
        _isItalic = _comp._isItalic;
        _isUnderline = _comp._isUnderline;

        if (_overflow === Overflow.NONE) {
            _isWrapText = false;
        }
        else if (_overflow === Overflow.RESIZE_HEIGHT) {
            _isWrapText = true;
        }
        else {
            _isWrapText = _comp.enableWrapText;
        }

        // outline
        let outline = LabelOutline && _comp.getComponent(LabelOutline);
        if (outline && outline.enabled) {
            _isOutlined = true;
            _margin = _outlineWidth = outline.width;
            _outlineColor = outline.color;
        }
        else {
            _isOutlined = false;
            _margin = 0;
        }
    },

    _calculateFillTextStartPosition () {
        let lineHeight = this._getLineHeight();
        let lineCount = _splitedStrings.length;
        let labelX;
        let firstLinelabelY;

        if (_hAlign === macro.TextAlignment.RIGHT) {
            labelX = _canvasSize.width - _margin;
        }
        else if (_hAlign === macro.TextAlignment.CENTER) {
            labelX = _canvasSize.width / 2;
        }
        else {
            labelX = 0 + _margin;
        }

        if (_vAlign === macro.VerticalTextAlignment.TOP) {
            firstLinelabelY = 0;
        }
        else if (_vAlign === macro.VerticalTextAlignment.CENTER) {
            firstLinelabelY = _canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2;
        }
        else {
            firstLinelabelY = _canvasSize.height - lineHeight * (lineCount - 1);
        }

        return cc.v2(labelX, firstLinelabelY);
    },

    _updateTexture (comp) {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.font = _fontDesc;

        let startPosition = this._calculateFillTextStartPosition();
        let lineHeight = this._getLineHeight();
        //use round for line join to avoid sharp intersect point
        _context.lineJoin = 'round';
        _context.fillStyle = `rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a / 255})`;
        let underlineStartPosition;

        //do real rendering
        for (let i = 0; i < _splitedStrings.length; ++i) {
            if (_isOutlined) {
                let strokeColor = _outlineColor || cc.Color.WHITE;
                _context.globalCompositeOperation = 'source-over';
                _context.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a / 255})`;
                _context.lineWidth = _outlineWidth * 2;
                _context.strokeText(_splitedStrings[i], startPosition.x, startPosition.y + i * lineHeight);
            }

            if (_fillColorGradientEnabled && _gradientArgs) {
                let gradientStartColor = _gradientStartColor || cc.Color.WHITE;
                let gradientEndColor = _gradientEndColor || cc.Color.WHITE;
                let gradient = _context.createLinearGradient(_gradientArgs.left, _gradientArgs.top, _gradientArgs.right, _gradientArgs.bottom);
                gradient.addColorStop(0, gradientStartColor.toHEX());
                gradient.addColorStop(1, gradientEndColor.toHEX());
                _context.fillStyle = gradient;
            }
            _context.fillText(_splitedStrings[i], startPosition.x, startPosition.y + i * lineHeight);

            if (_isUnderline) {
                underlineStartPosition = this._calculateUnderlineStartPosition();
                _context.save();
                _context.beginPath();
                _context.lineWidth = _fontSize / 8;
                _context.strokeStyle = `rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a / 255})`;
                _context.moveTo(underlineStartPosition.x, underlineStartPosition.y + i * lineHeight - 1);
                _context.lineTo(underlineStartPosition.x + _canvas.width, underlineStartPosition.y + i * lineHeight - 1);
                _context.stroke();
                _context.restore();
            }
        }

        _texture.handleLoadedTexture();
    },

    _calculateUnderlineStartPosition () {
        let lineHeight = this._getLineHeight();
        let lineCount = _splitedStrings.length;
        let labelX;
        let firstLinelabelY;

        labelX = 0 + _margin;

        if (_vAlign === macro.VerticalTextAlignment.TOP) {
            firstLinelabelY = _fontSize;
        }
        else if (_vAlign === macro.VerticalTextAlignment.CENTER) {
            firstLinelabelY = _canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2 + _fontSize / 2;
        }
        else {
            firstLinelabelY = _canvasSize.height - lineHeight * (lineCount - 1);
        }

        return cc.v2(labelX, firstLinelabelY);
    },

    _updateLabelDimensions () {
        let paragraphedStrings = _string.split('\n');

        if (_overflow === Overflow.RESIZE_HEIGHT) {
            _canvasSize.height = _splitedStrings.length * this._getLineHeight();
        }
        else if (_overflow === Overflow.NONE) {
            _splitedStrings = paragraphedStrings;
            let canvasSizeX = 0;
            let canvasSizeY = 0;
            for (let i = 0; i < paragraphedStrings.length; ++i) {
                let paraLength = _context.measureText(paragraphedStrings[i]).width;
                canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
            }
            canvasSizeY = _splitedStrings.length * this._getLineHeight();

            _canvasSize.width = parseFloat(canvasSizeX.toFixed(2)) + 2 * _margin;
            _canvasSize.height = parseFloat(canvasSizeY.toFixed(2));
            if (_isItalic) {
                //0.0174532925 = 3.141592653 / 180
                _canvasSize.width += _drawFontsize * Math.tan(12 * 0.0174532925);
            }
        }

        _canvas.width = _canvasSize.width;
        _canvas.height = _canvasSize.height;
    },

    _calculateTextBaseline () {
        let node = this._node;
        let hAlign;
        let vAlign;

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

        if (_vAlign === macro.VerticalTextAlignment.TOP) {
            vAlign = 'top';
        }
        else if (_vAlign === macro.VerticalTextAlignment.CENTER) {
            vAlign = 'middle';
        }
        else {
            vAlign = 'bottom';
        }
        _context.textBaseline = vAlign;
    },

    _calculateSplitedStrings () {
        let paragraphedStrings = _string.split('\n');

        if (_isWrapText) {
            _splitedStrings = [];
            let canvasWidthNoMargin = _canvasSize.width - 2 * _margin;
            for (let i = 0; i < paragraphedStrings.length; ++i) {
                let allWidth = _context.measureText(paragraphedStrings[i]).width;
                let textFragment = TextUtils.fragmentText(paragraphedStrings[i],
                                                        allWidth,
                                                        canvasWidthNoMargin,
                                                        this._measureText(_context));
                _splitedStrings = _splitedStrings.concat(textFragment);
            }
        }
        else {
            _splitedStrings = paragraphedStrings;
        }

    },

    _getFontDesc () {
        let fontDesc = _fontSize.toString() + 'px ';
        fontDesc = fontDesc + _fontFamily;
        if (_isBold) {
            fontDesc = "bold " + fontDesc;
        }

        return fontDesc;
    },

    _getLineHeight () {
        let nodeSpacingY = _lineHeight;
        if (nodeSpacingY === 0) {
            nodeSpacingY = _fontSize;
        } else {
            nodeSpacingY = nodeSpacingY * _fontSize / _drawFontsize;
        }

        return nodeSpacingY | 0;
    },

    _calculateParagraphLength (paragraphedStrings, ctx) {
        let paragraphLength = [];

        for (let i = 0; i < paragraphedStrings.length; ++i) {
            let textMetric = ctx.measureText(paragraphedStrings[i]);
            paragraphLength.push(textMetric.width);
        }

        return paragraphLength;
    },

    _measureText (ctx) {
        return function (string) {
            return ctx.measureText(string).width;
        };
    },

    _calculateLabelFont () {
        _fontDesc = this._getFontDesc();
        _context.font = _fontDesc;

        if (_overflow === Overflow.SHRINK) {
            let paragraphedStrings = _string.split('\n');
            let paragraphLength = this._calculateParagraphLength(paragraphedStrings, _context);
        
            _splitedStrings = paragraphedStrings;
            let i = 0;
            let totalHeight = 0;
            let maxLength = 0;

            if (_isWrapText) {
                let canvasWidthNoMargin = _canvasSize.width - 2 * _margin;
                let canvasHeightNoMargin = _canvasSize.height - 2 * _margin;
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

                    _splitedStrings = [];
                    totalHeight = 0;
                    for (i = 0; i < paragraphedStrings.length; ++i) {
                        let j = 0;
                        let allWidth = _context.measureText(paragraphedStrings[i]).width;
                        textFragment = TextUtils.fragmentText(paragraphedStrings[i],
                                                            allWidth,
                                                            canvasWidthNoMargin,
                                                            this._measureText(_context));
                        while (j < textFragment.length) {
                            let measureWidth = _context.measureText(textFragment[j]).width;
                            maxLength = measureWidth;
                            totalHeight += this._getLineHeight();
                            ++j;
                        }
                        _splitedStrings = _splitedStrings.concat(textFragment);
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
                let scaleX = (_canvasSize.width - 2 * _margin) / maxLength;
                let scaleY = _canvasSize.height / totalHeight;

                _fontSize = (_drawFontsize * Math.min(1, scaleX, scaleY)) | 0;
                _fontDesc = this._getFontDesc();
                _context.font = _fontDesc;
            }
        }
    }
};
