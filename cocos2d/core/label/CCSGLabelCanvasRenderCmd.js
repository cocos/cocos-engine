/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 ****************************************************************************/
(function () {
    _ccsg.Label.TTFLabelBaker = function () {};

    var proto = _ccsg.Label.TTFLabelBaker.prototype = Object.create(Object.prototype);

    proto.updateStatus = function () {
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var colorDirty = locFlag & flags.colorDirty,
            opacityDirty = locFlag & flags.opacityDirty;

        if (colorDirty) {
            this._updateDisplayColor();
        }

        if (opacityDirty) {
            this._updateDisplayOpacity();
            this._notifyRegionStatus && this._notifyRegionStatus(_ccsg.Node.CanvasRenderCmd.RegionStatus.Dirty);
        }

        if(locFlag & flags.contentDirty) {
            this._notifyRegionStatus && this._notifyRegionStatus(_ccsg.Node.CanvasRenderCmd.RegionStatus.Dirty);
            this._dirtyFlag &= ~flags.contentDirty;
        }

        if (colorDirty || (locFlag & flags.textDirty)) {
            this._notifyRegionStatus && this._notifyRegionStatus(_ccsg.Node.CanvasRenderCmd.RegionStatus.Dirty);
            this._rebuildLabelSkin();
        }

        if (this._dirtyFlag & flags.transformDirty) {
            this.transform(this.getParentRenderCmd(), true);
            this._dirtyFlag &= ~flags.transformDirty;
        }
    };


    proto._syncStatus = function (parentCmd) {
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var parentNode = parentCmd ? parentCmd._node : null;

        if (parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
            locFlag |= flags.colorDirty;

        if (parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
            locFlag |= flags.opacityDirty;

        if (parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
            locFlag |= flags.transformDirty;

        var colorDirty = locFlag & flags.colorDirty,
            opacityDirty = locFlag & flags.opacityDirty;

        this._dirtyFlag = locFlag;

        if (colorDirty)
            this._syncDisplayColor();
        if (opacityDirty)
            this._syncDisplayOpacity();

        if (colorDirty || opacityDirty || (this._dirtyFlag & flags.textDirty)) {
            this._rebuildLabelSkin();
        }

        if (this._dirtyFlag & flags.transformDirty) {
            this.transform(parentCmd);
        }
    };

    proto._getLineHeight = function () {
        var nodeSpacingY = this._node.getLineHeight();
        var node = this._node;
        if (nodeSpacingY === 0) {
            nodeSpacingY = node._fontSize;
        } else {
            nodeSpacingY = nodeSpacingY * node._fontSize / this._drawFontsize;
        }

        var lineHeight = nodeSpacingY | 0;
        return lineHeight;
    };

    proto._constructFontDesc = function () {
        var node = this._node;
        var fontDesc = node._fontSize.toString() + 'px ';
        var fontFamily = node._fontHandle.length === 0 ? 'serif' : node._fontHandle;
        fontDesc = fontDesc + fontFamily;
        if(node._isBold) {
            fontDesc = "bold " + fontDesc;
        }

        return fontDesc;
    };

    proto._measureText = function (ctx) {
        return function(string) {
            return ctx.measureText(string).width;
        };
    };


    proto._calculateLabelFont = function() {
        var node = this._node;
        var paragraphedStrings = node._string.split('\n');

        node._fontSize = node._drawFontsize;
        var fontDesc = this._constructFontDesc();
        this._labelContext.font = fontDesc;

        var paragraphLength = this._calculateParagraphLength(paragraphedStrings, this._labelContext);

        if (_ccsg.Label.Overflow.SHRINK === node._overFlow) {
            this._splitedStrings = paragraphedStrings;
            var i = 0;
            var totalHeight = 0;
            var maxLength = 0;

            if (node._isWrapText) {

                var canvasWidthNoMargin = this._canvasSize.width - 2 * this._getMargin();
                var canvasHeightNoMargin = this._canvasSize.height - 2 * this._getMargin();
                if(canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
                    fontDesc = this._constructFontDesc();
                    this._labelContext.font = fontDesc;
                    return fontDesc;
                }
                totalHeight = canvasHeightNoMargin + 1;
                maxLength = canvasWidthNoMargin + 1;
                var actualFontSize = this._drawFontsize + 1;
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
                    node._fontSize = actualFontSize;
                    fontDesc = this._constructFontDesc();
                    this._labelContext.font = fontDesc;

                    this._splitedStrings = [];
                    totalHeight = 0;
                    for (i = 0; i < paragraphedStrings.length; ++i) {
                        var j = 0;
                        var allWidth = this._labelContext.measureText(paragraphedStrings[i]).width;
                        textFragment = cc.TextUtils.fragmentText(paragraphedStrings[i],
                                                                 allWidth,
                                                                 canvasWidthNoMargin,
                                                                 this._measureText(this._labelContext));
                        while(j < textFragment.length) {
                            var measureWidth = this._labelContext.measureText(textFragment[j]).width;
                            maxLength = measureWidth;
                            totalHeight += this._getLineHeight();
                            ++j;
                        }
                        this._splitedStrings = this._splitedStrings.concat(textFragment);
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
                var scaleX = (this._canvasSize.width - 2 * this._getMargin()) / maxLength;
                var scaleY = this._canvasSize.height / totalHeight;

                node._fontSize = (this._drawFontsize * Math.min(1, scaleX, scaleY)) | 0;
                fontDesc = this._constructFontDesc();
                this._labelContext.font = fontDesc;
            }
        }

        return fontDesc;
    };

    proto._getMargin = function() {
        return (this._node && this._node._margin) || 0;
    };

    proto._calculateParagraphLength = function(paragraphedStrings, ctx) {
        var paragraphLength = [];

        for (var i = 0; i < paragraphedStrings.length; ++i) {
            var textMetric = ctx.measureText(paragraphedStrings[i]);
            paragraphLength.push(textMetric.width);
        }

        return paragraphLength;
    };

    proto._calculateCanvasSize = function() {
        var node = this._node;
        var canvasWidth = node._contentSize.width;
        var canvasHeight = node._contentSize.height;
        if (canvasWidth <= 0) canvasWidth = 1;
        if (canvasHeight <= 0) canvasHeight = 1;

        return cc.size(canvasWidth, canvasHeight);
    };

    proto._calculateSplitedStrings = function() {
        var node = this._node;

        var paragraphedStrings = node._string.split('\n');

        var i;
        if (node._isWrapText) {
            this._splitedStrings = [];
            var canvasWidthNoMargin = this._canvasSize.width - 2 * this._getMargin();
            for (i = 0; i < paragraphedStrings.length; ++i) {
                var allWidth = this._labelContext.measureText(paragraphedStrings[i]).width;
                var textFragment = cc.TextUtils.fragmentText(paragraphedStrings[i],
                                                             allWidth,
                                                             canvasWidthNoMargin,
                                                             this._measureText(this._labelContext));
                this._splitedStrings = this._splitedStrings.concat(textFragment);
            }
        }
        else {
            this._splitedStrings = paragraphedStrings;
        }

    };

    proto._updateLabelDimensions = function() {
        var node = this._node;
        var paragraphedStrings = node._string.split('\n');
        var i;
        var ctx = this._labelContext;

        if (_ccsg.Label.Overflow.RESIZE_HEIGHT === node._overFlow) {
            this._canvasSize.height = this._splitedStrings.length * this._getLineHeight();
            _ccsg.Node.prototype.setContentSize.call(node, this._canvasSize);
        }
        else if(_ccsg.Label.Overflow.NONE === node._overFlow) {
            this._splitedStrings = paragraphedStrings;
            var canvasSizeX = 0;
            var canvasSizeY = 0;
            for (i = 0; i < paragraphedStrings.length; ++i) {
                var paraLength = ctx.measureText(paragraphedStrings[i]).width;
                canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
            }
            canvasSizeY = this._splitedStrings.length * this._getLineHeight();

            this._canvasSize.width = parseFloat(canvasSizeX.toFixed(2)) + 2 * this._getMargin();
            this._canvasSize.height = parseFloat(canvasSizeY.toFixed(2));
            if(node._isItalic) {
                //0.0174532925 = 3.141592653 / 180
                this._canvasSize.width += node._drawFontsize * Math.tan(12 * 0.0174532925);
            }
            _ccsg.Node.prototype.setContentSize.call(node, this._canvasSize);
        }

        this._labelCanvas.width = this._canvasSize.width;
        this._labelCanvas.height = this._canvasSize.height;

    };

    proto._calculateFillTextStartPosition = function() {
        var node = this._node;
        var lineHeight = this._getLineHeight();
        var lineCount = this._splitedStrings.length;
        var labelX;
        var firstLinelabelY;

        if (cc.TextAlignment.RIGHT === node._hAlign) {
            labelX = this._canvasSize.width - this._getMargin();
        }
        else if (cc.TextAlignment.CENTER === node._hAlign) {
            labelX = this._canvasSize.width / 2;
        }
        else {
            labelX = 0 + this._getMargin();
        }

        if (cc.VerticalTextAlignment.TOP === node._vAlign) {
            firstLinelabelY = 0;
        }
        else if (cc.VerticalTextAlignment.CENTER === node._vAlign) {
            firstLinelabelY = this._canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2;
        }
        else {
            firstLinelabelY = this._canvasSize.height - lineHeight * (lineCount - 1);
        }

        return cc.p(labelX, firstLinelabelY);
    };

    proto._calculateTextBaseline = function() {
        var node = this._node;
        var hAlign;
        var vAlign;

        if (cc.TextAlignment.RIGHT === node._hAlign) {
            hAlign = 'right';
        }
        else if (cc.TextAlignment.CENTER === node._hAlign) {
            hAlign = 'center';
        }
        else {
            hAlign = 'left';
        }

        this._labelContext.textAlign = hAlign;
        if (cc.VerticalTextAlignment.TOP === node._vAlign) {
            vAlign = 'top';
        }
        else if (cc.VerticalTextAlignment.CENTER === node._vAlign) {
            vAlign = 'middle';
        }
        else {
            vAlign = 'bottom';
        }
        this._labelContext.textBaseline = vAlign;
    };

    proto._bakeLabel = function () {
        var node = this._node;
        this._drawFontsize = node._drawFontsize;
        this._canvasSize = this._calculateCanvasSize();

        //Note: don't change the calling order of the following 3 statements
        this._fontDesc = this._calculateLabelFont();
        this._calculateSplitedStrings();
        this._updateLabelDimensions();

        this._calculateTextBaseline();

        this._updateTexture();
    };


    proto._calculateUnderlineStartPosition = function () {
        var node = this._node;
        var lineHeight = this._getLineHeight();
        var lineCount = this._splitedStrings.length;
        var labelX;
        var firstLinelabelY;

        labelX = 0 + this._getMargin();

        if (cc.VerticalTextAlignment.TOP === node._vAlign) {
            firstLinelabelY = node._fontSize;
        }
        else if (cc.VerticalTextAlignment.CENTER === node._vAlign) {
            firstLinelabelY = this._canvasSize.height / 2 - lineHeight * (lineCount - 1) / 2 + node._fontSize / 2;
        }
        else {
            firstLinelabelY = this._canvasSize.height - lineHeight * (lineCount - 1);
        }

        return cc.p(labelX, firstLinelabelY);
    };

    proto._updateTexture = function() {
        this._labelContext.clearRect(0, 0, this._labelCanvas.width, this._labelCanvas.height);

        this._labelContext.font = this._fontDesc;

        var startPosition = this._calculateFillTextStartPosition();
        var lineHeight = this._getLineHeight();
        //use round for line join to avoid sharp intersect point
        this._labelContext.lineJoin = 'round';
        var color = this._displayedColor;
        this._labelContext.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        var underlineStartPosition;

        //do real rendering
        for (var i = 0; i < this._splitedStrings.length; ++i) {
            if(this._node.isOutlined())
            {
                var strokeColor = this._node.getOutlineColor() || cc.color(255,255,255,255);
                this._labelContext.globalCompositeOperation = 'source-over';
                this._labelContext.strokeStyle = 'rgb(' + strokeColor.r + ',' + strokeColor.g + ',' + strokeColor.b + ')';
                this._labelContext.lineWidth = this._node.getOutlineWidth() * 2;
                this._labelContext.strokeText(this._splitedStrings[i],
                                              startPosition.x, startPosition.y + i * lineHeight);
            }
            if(this._node.getFillColorGradientEnabled()) {
                var gradientStartColor = this._node.getGradientStartColor() || cc.color(255, 255, 255, 255);
                var gradientEndColor = this._node.getGradientEndColor() || cc.color(255, 255, 255, 255);
                var gradientArgument = this._getGradientArgs();
                var gradient = this._labelContext.createLinearGradient(gradientArgument.left, gradientArgument.top, gradientArgument.right, gradientArgument.bottom);
                gradient.addColorStop(0, cc.colorToHex(gradientStartColor));
                gradient.addColorStop(1, cc.colorToHex(gradientEndColor));
                this._labelContext.fillStyle = gradient;
            }
            this._labelContext.fillText(this._splitedStrings[i], startPosition.x, startPosition.y + i * lineHeight);
            if(this._node._isUnderline) {
                underlineStartPosition = this._calculateUnderlineStartPosition();
                this._labelContext.save();
                this._labelContext.beginPath();
                this._labelContext.lineWidth = this._node._fontSize / 8;
                this._labelContext.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                this._labelContext.moveTo(underlineStartPosition.x, underlineStartPosition.y + i * lineHeight - 1);
                this._labelContext.lineTo(underlineStartPosition.x + this._labelCanvas.width, underlineStartPosition.y + i * lineHeight - 1);
                this._labelContext.stroke();
                this._labelContext.restore();
            }
        }

        this._texture._textureLoaded = false;
        // Hack. because we delete _htmlElementObj after usage in WEBGL mode
        this._texture._htmlElementObj = this._labelCanvas;
        this._texture.handleLoadedTexture(true);
    };

    proto._getGradientArgs = function () {
        this._gradientArgument = {};
        this._gradientArgument.left = 0;
        this._gradientArgument.top = 0;
        var contentSize = this._node._contentSize;
        switch(this._node.getFillColorGradientDirection()) {
                //horizontal
            case 0:
                this._gradientArgument.right = contentSize.width;
                this._gradientArgument.bottom = 0;
                break;
            case 1:
                this._gradientArgument.right = 0;
                this._gradientArgument.bottom = contentSize.height;
                break;
            case 2:
                this._gradientArgument.right = contentSize.width;
                this._gradientArgument.bottom = contentSize.height;
                break;
            default:
                break;
        }
        return this._gradientArgument;
    };

    proto._rebuildLabelSkin = function () {
        this._dirtyFlag &= ~_ccsg.Node._dirtyFlags.textDirty;
        var node = this._node;
        node._updateLabel();
    };
})();

(function () {
    _ccsg.Label.CanvasRenderCmd = function (renderableObject) {
        this._rootCtor(renderableObject);
        this._needDraw = true;
        this._texture = new cc.Texture2D();
        this._labelCanvas = document.createElement('canvas');
        this._labelCanvas.width = 1;
        this._labelCanvas.height = 1;
        this._labelContext = this._labelCanvas.getContext('2d');
        this._texture.initWithElement(this._labelCanvas);
        this._splitedStrings = null;
    };

    var proto = _ccsg.Label.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
    cc.js.mixin(proto, _ccsg.Label.TTFLabelBaker.prototype);

    proto.constructor = _ccsg.Label.CanvasRenderCmd;

    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);

        var bb = this._currentRegion,
            l = bb._minX, r = bb._maxX, b = bb._minY, t = bb._maxY,
            rect = cc.visibleRect,
            vl = rect.left.x, vr = rect.right.x, vt = rect.top.y, vb = rect.bottom.y;
        if (r < vl || l > vr || t < vb || b > vt) {
            this._needDraw = false;
        }
        else {
            this._needDraw = true;
        }
    };

    proto.rendering = function (ctx, scaleX, scaleY) {
        var node = this._node;

        if (node._labelType === _ccsg.Label.Type.TTF ||
            node._labelType === _ccsg.Label.Type.SystemFont) {
            var locDisplayOpacity = this._displayedOpacity;
            var alpha = locDisplayOpacity / 255;

            if (locDisplayOpacity === 0)
                return;

            var wrapper = ctx || cc._renderContext,
                context = wrapper.getContext();
            wrapper.setTransform(this._worldTransform, scaleX, scaleY);
            wrapper.setCompositeOperation(_ccsg.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(node._blendFunc));
            wrapper.setGlobalAlpha(alpha);

            if (this._texture) {
                var sx, sy, sw, sh;
                var x, y, w, h;

                x = 0;
                y = -this._node._contentSize.height;
                w = this._node._contentSize.width;
                h = this._node._contentSize.height;


                var textureWidth = this._texture.getPixelWidth();
                var textureHeight = this._texture.getPixelHeight();

                sx = 0;
                sy = 0;
                sw = textureWidth;
                sh = textureHeight;

                var image = this._texture._htmlElementObj;
                if (this._texture._pattern !== '') {
                    wrapper.setFillStyle(context.createPattern(image, this._texture._pattern));
                    context.fillRect(x, y, w, h);
                }
                else {
                    if(sw !== 0 && sh !== 0 && w !== 0 && h !== 0) {
                        context.drawImage(image,
                            sx, sy, sw, sh,
                            x, y, w, h);
                    }
                }
            }
            cc.g_NumberOfDraws = cc.g_NumberOfDraws + 1;
        }

    };

})();
