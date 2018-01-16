/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const renderEngine = require('../../render-engine');
const RenderData = renderEngine.RenderData;

const Label = require('../../../components/CCLabel');
const LabelOutline = require('../../../components/CCLabelOutline');
const Overflow = Label.Overflow;

const spriteAssembler = require('../sprite/simple');

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

let _isBold = false;
let _isItalic = false;

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

// underline
let _isUnderline = false;

module.exports = {
    createData (comp) {
        let renderData = RenderData.alloc();

        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        let data = renderData._data;
        data[0].u = 0;
        data[0].v = 1;
        data[1].u = 1;
        data[1].v = 1;
        data[2].u = 0;
        data[2].v = 0;
        data[3].u = 1;
        data[3].v = 0;
        return renderData;
    },

    fillVertexBuffer (comp, off, vbuf, uintbuf) {
        let node = comp.node;
        let renderData = comp._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = cc.Color.WHITE._val;
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;
    
        let vert;
        let length = renderData.dataLength;
        for (let i = 0; i < length; i++) {
            vert = data[i];
            vbuf[off + 0] = vert.x * a + vert.y * c + tx;
            vbuf[off + 1] = vert.x * b + vert.y * d + ty;
            vbuf[off + 2] = z;
            vbuf[off + 4] = vert.u;
            vbuf[off + 5] = vert.v;
            uintbuf[off + 3] = color;
            off += 6;
        }
    },
    
    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        ibuf[offset + 0] = vertexId;
        ibuf[offset + 1] = vertexId + 1;
        ibuf[offset + 2] = vertexId + 2;
        ibuf[offset + 3] = vertexId + 1;
        ibuf[offset + 4] = vertexId + 3;
        ibuf[offset + 5] = vertexId + 2;
    },

    update (comp) {
        if (!comp._renderData.vertDirty) return;

        _comp = comp;

        if (this._updateFontFamly()) {
            this._updateProperties();
            this._calculateLabelFont();
            this._calculateSplitedStrings();
            this._updateLabelDimensions();
            this._calculateTextBaseline();
            this._updateTexture();
    
            this._updateVerts();
            
            _comp._actualFontSize = _fontSize;
            _comp.node.setContentSize(_canvasSize);

            _comp._renderData.vertDirty = _comp._renderData.uvDirty = false;

            _context = null;
            _canvas = null;
            _texture = null;
        }
        
        _comp = null;
    },

    _updateVerts () {
        let renderData = _comp._renderData;

        let width = _canvasSize.width,
            height = _canvasSize.height,
            appx = renderData._pivotX * width,
            appy = renderData._pivotY * height;

        let data = renderData._data;
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = width - appx;
        data[1].y = -appy;
        data[2].x = -appx;
        data[2].y = height - appy;
        data[3].x = width - appx;
        data[3].y = height - appy;
    },

    _updateFontFamly () {
        if (!_comp.useSystemFont) {
            if (!_comp.font) return false;

            let url = _comp.font.rawUrl;
            _fontFamily = cc.CustomFontLoader._getFontFamily(url);
            let fontDescriptor = cc.CustomFontLoader._fontCache[_fontFamily];
            if (!fontDescriptor || !fontDescriptor.isLoaded()) {
                cc.CustomFontLoader.loadTTF(url);
                return false;
            }
        }
        else {
            _fontFamily = _comp.fontFamily;
        }

        return true;
    },

    _updateProperties () {
        _context = _comp._context;
        _canvas = _comp._canvas;
        _texture = _comp._texture;
        
        _string = _comp.string;
        _fontSize = _comp._fontSize;
        _drawFontsize = _fontSize;
        _overflow = _comp.overflow;
        _canvasSize.width = _comp.node.width;
        _canvasSize.height = _comp.node.height;
        _lineHeight = _comp._lineHeight;
        _hAlign = _comp.horizontalAlign;
        _vAlign = _comp.verticalAlign;
        _color = _comp.node.color;

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
        let outline = _comp.getComponent(LabelOutline);
        if (outline) {
            _isOutlined = true;
            _margin = _outlineWidth = outline.width;
            _outlineColor = outline.color;
        }
        else {
            _isOutlined = false;
        }
    },

    _calculateFillTextStartPosition () {
        var lineHeight = this._getLineHeight();
        var lineCount = _splitedStrings.length;
        var labelX;
        var firstLinelabelY;

        if (_hAlign === cc.TextAlignment.RIGHT) {
            labelX = _canvasSize.width - _margin;
        }
        else if (_hAlign === cc.TextAlignment.CENTER) {
            labelX = _canvasSize.width / 2;
        }
        else {
            labelX = 0 + _margin;
        }

        if (_vAlign === cc.VerticalTextAlignment.TOP) {
            firstLinelabelY = 0;
        }
        else if (_vAlign === cc.VerticalTextAlignment.CENTER) {
            firstLinelabelY = _canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2;
        }
        else {
            firstLinelabelY = _canvasSize.height - lineHeight * (lineCount - 1);
        }

        return cc.v2(labelX, firstLinelabelY);
    },

    _updateTexture () {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.font = _fontDesc;

        var startPosition = this._calculateFillTextStartPosition();
        var lineHeight = this._getLineHeight();
        //use round for line join to avoid sharp intersect point
        _context.lineJoin = 'round';
        _context.fillStyle = `rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a/255})`;
        var underlineStartPosition;

        //do real rendering
        for (var i = 0; i < _splitedStrings.length; ++i) {
            if (_isOutlined) {
                var strokeColor = _outlineColor || cc.color(255,255,255,255);
                _context.globalCompositeOperation = 'source-over';
                _context.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a/255})`;
                _context.lineWidth = _outlineWidth * 2;
                _context.strokeText(_splitedStrings[i], startPosition.x, startPosition.y + i * lineHeight);
            }

            if (_fillColorGradientEnabled && _gradientArgs) {
                var gradientStartColor = _gradientStartColor || cc.color(255, 255, 255, 255);
                var gradientEndColor = _gradientEndColor || cc.color(255, 255, 255, 255);
                var gradient = _context.createLinearGradient(_gradientArgs.left, _gradientArgs.top, _gradientArgs.right, _gradientArgs.bottom);
                gradient.addColorStop(0, cc.colorToHex(gradientStartColor));
                gradient.addColorStop(1, cc.colorToHex(gradientEndColor));
                _context.fillStyle = gradient;
            }
            _context.fillText(_splitedStrings[i], startPosition.x, startPosition.y + i * lineHeight);

            if (_isUnderline) {
                underlineStartPosition = this._calculateUnderlineStartPosition();
                _context.save();
                _context.beginPath();
                _context.lineWidth = _fontSize / 8;
                _context.strokeStyle = `rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a/255})`;
                _context.moveTo(underlineStartPosition.x, underlineStartPosition.y + i * lineHeight - 1);
                _context.lineTo(underlineStartPosition.x + _canvas.width, underlineStartPosition.y + i * lineHeight - 1);
                _context.stroke();
                _context.restore();
            }
        }

        _texture.handleLoadedTexture();
    },

    _calculateUnderlineStartPosition () {
        var lineHeight = this._getLineHeight();
        var lineCount = _splitedStrings.length;
        var labelX;
        var firstLinelabelY;

        labelX = 0 + _margin;

        if (_vAlign === cc.VerticalTextAlignment.TOP) {
            firstLinelabelY = _fontSize;
        }
        else if (_vAlign === cc.VerticalTextAlignment.CENTER) {
            firstLinelabelY = _canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2 + node._fontSize / 2;
        }
        else {
            firstLinelabelY = _canvasSize.height - lineHeight * (lineCount - 1);
        }

        return cc.p(labelX, firstLinelabelY);
    },

    _updateLabelDimensions () {
        var paragraphedStrings = _string.split('\n');
        var i;

        if (_overflow === Overflow.RESIZE_HEIGHT) {
            _canvasSize.height = _splitedStrings.length * this._getLineHeight();
        }
        else if (_overflow === Overflow.NONE) {
            _splitedStrings = paragraphedStrings;
            var canvasSizeX = 0;
            var canvasSizeY = 0;
            for (i = 0; i < paragraphedStrings.length; ++i) {
                var paraLength = _context.measureText(paragraphedStrings[i]).width;
                canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
            }
            canvasSizeY = _splitedStrings.length * this._getLineHeight();

            _canvasSize.width = parseFloat(canvasSizeX.toFixed(2)) + 2 * _margin;
            _canvasSize.height = parseFloat(canvasSizeY.toFixed(2));
            if(_isItalic) {
                //0.0174532925 = 3.141592653 / 180
                _canvasSize.width += _drawFontsize * Math.tan(12 * 0.0174532925);
            }
        }

        _canvas.width = _canvasSize.width;
        _canvas.height = _canvasSize.height;
    },

    _calculateTextBaseline () {
        var node = this._node;
        var hAlign;
        var vAlign;

        if (_hAlign === cc.TextAlignment.RIGHT) {
            hAlign = 'right';
        }
        else if (_hAlign === cc.TextAlignment.CENTER) {
            hAlign = 'center';
        }
        else {
            hAlign = 'left';
        }
        _context.textAlign = hAlign;

        if (_vAlign === cc.VerticalTextAlignment.TOP) {
            vAlign = 'top';
        }
        else if (_vAlign === cc.VerticalTextAlignment.CENTER) {
            vAlign = 'middle';
        }
        else {
            vAlign = 'bottom';
        }
        _context.textBaseline = vAlign;
    },

    _calculateSplitedStrings () {
        var paragraphedStrings = _string.split('\n');

        var i;
        if (_isWrapText) {
            _splitedStrings = [];
            var canvasWidthNoMargin = _canvasSize.width - 2 * _margin;
            for (i = 0; i < paragraphedStrings.length; ++i) {
                var allWidth = _context.measureText(paragraphedStrings[i]).width;
                var textFragment = cc.TextUtils.fragmentText(paragraphedStrings[i],
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
        var fontDesc = _fontSize.toString() + 'px ';
        fontDesc = fontDesc + _fontFamily;
        if (_isBold) {
            fontDesc = "bold " + fontDesc;
        }

        return fontDesc;
    },

    _getLineHeight () {
        var nodeSpacingY = _lineHeight;
        if (nodeSpacingY === 0) {
            nodeSpacingY = _fontSize;
        } else {
            nodeSpacingY = nodeSpacingY * _fontSize / _drawFontsize;
        }

        var lineHeight = nodeSpacingY | 0;
        return lineHeight;
    },

    _calculateParagraphLength (paragraphedStrings, ctx) {
        var paragraphLength = [];

        for (var i = 0; i < paragraphedStrings.length; ++i) {
            var textMetric = ctx.measureText(paragraphedStrings[i]);
            paragraphLength.push(textMetric.width);
        }

        return paragraphLength;
    },

    _measureText (ctx) {
        return function(string) {
            return ctx.measureText(string).width;
        };
    },

    _calculateLabelFont () {
        _fontDesc = this._getFontDesc();
        _context.font = _fontDesc;

        if (_overflow === Overflow.SHRINK) {
            var paragraphedStrings = _string.split('\n');
            var paragraphLength = this._calculateParagraphLength(paragraphedStrings, _context);
        
            _splitedStrings = paragraphedStrings;
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
                var textFragment = "";
                var tryDivideByTwo = true;
                var startShrinkFontSize = actualFontSize | 0;

                while (totalHeight > canvasHeightNoMargin || maxLength > canvasWidthNoMargin) {
                    if (tryDivideByTwo) {
                        actualFontSize = (startShrinkFontSize / 2) | 0;
                    } else {
                        actualFontSize = startShrinkFontSize - 1;
                        startShrinkFontSize = actualFontSize;
                    }
                    if(actualFontSize <= 0) {
                        cc.logID(4003);
                        break;
                    }
                    _fontSize = actualFontSize;
                    _fontDesc = this._getFontDesc();
                    _context.font = _fontDesc;

                    _splitedStrings = [];
                    totalHeight = 0;
                    for (i = 0; i < paragraphedStrings.length; ++i) {
                        var j = 0;
                        var allWidth = _context.measureText(paragraphedStrings[i]).width;
                        textFragment = cc.TextUtils.fragmentText(paragraphedStrings[i],
                                                                 allWidth,
                                                                 canvasWidthNoMargin,
                                                                 this._measureText(_context));
                        while (j < textFragment.length) {
                            var measureWidth = _context.measureText(textFragment[j]).width;
                            maxLength = measureWidth;
                            totalHeight += this._getLineHeight();
                            ++j;
                        }
                        _splitedStrings = _splitedStrings.concat(textFragment);
                    }

                    if(tryDivideByTwo) {
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
                var scaleX = (_canvasSize.width - 2 * _margin) / maxLength;
                var scaleY = _canvasSize.height / totalHeight;

                _fontSize = (_drawFontsize * Math.min(1, scaleX, scaleY)) | 0;
                _fontDesc = this._getFontDesc();
                _context.font = _fontDesc;
            }
        }
    }
};
