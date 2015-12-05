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

 Use any of these editors to generate BMFonts:
 http://glyphdesigner.71squared.com/ (Commercial, Mac OS X)
 http://www.n4te.com/hiero/hiero.jnlp (Free, Java)
 http://slick.cokeandcode.com/demos/hiero.jnlp (Free, Java)
 http://www.angelcode.com/products/bmfont/ (Free, Windows only)
 ****************************************************************************/
(function() {
    cc.Label.TTFLabelBaker = function() {

    };
    var proto = cc.Label.TTFLabelBaker.prototype = Object.create(Object.prototype);
    proto._getLineHeight = function() {
        //todo refine it
        var nodeSpacingY = this._node._spacingY;
        if(nodeSpacingY === 0) nodeSpacingY = this._drawFontsize;
        else { nodeSpacingY = nodeSpacingY * this._drawFontsize / this._node._fontSize;}
        return nodeSpacingY | 0;
    };

    proto._prepareQuad = function() {
        var quad = this._quad;
        var white = cc.color(255,255,255,this._displayedOpacity);
        var width = this._node._contentSize.width;
        var height = this._node._contentSize.height;
        quad._bl.colors = white;
        quad._br.colors = white;
        quad._tl.colors = white;
        quad._tr.colors = white;

        quad._bl.vertices = new cc.Vertex3F(0,0,0);
        quad._br.vertices = new cc.Vertex3F(width,0,0);
        quad._tl.vertices = new cc.Vertex3F(0,height,0);
        quad._tr.vertices = new cc.Vertex3F(width,height,0);

        //texture coordinate should be y-flipped
        quad._bl.texCoords = new cc.Tex2F(0,1);
        quad._br.texCoords = new cc.Tex2F(1,1);
        quad._tl.texCoords = new cc.Tex2F(0,0);
        quad._tr.texCoords = new cc.Tex2F(1,0);

        this._quadDirty = true;
    };

    proto._fragmentText = function fragmentText(text, maxWidth, ctx) {
        var words = text.split(' '),
            lines = [],
            line = "";
        if (ctx.measureText(text).width < maxWidth) {
            return [text];
        }
        while (words.length > 0) {
            while (ctx.measureText(words[0]).width >= maxWidth && words[0].length > 1) {
                var tmp = words[0];
                words[0] = tmp.slice(0, -1);
                if (words.length > 1) {
                    words[1] = tmp.slice(-1) + words[1];
                } else {
                    words.push(tmp.slice(-1));
                }
            }
            if (ctx.measureText(line + words[0]).width < maxWidth) {
                line += words.shift() + " ";
            } else if(line.length === 0 && words[0].length === 1){
                lines.push(words.shift());
            } else {
                lines.push(line.slice(0,-1));
                line = "";
            }
            if (words.length === 0 && line.length > 0) {
                lines.push(line);
            }
        }
        return lines;
    };
    proto._updateDisplayOpacity = function(parentOpacity) {
        cc.Node.RenderCmd.prototype._updateDisplayOpacity.call(this, parentOpacity);
        //specify opacity to quad
        var color = cc.color(255,255,255,this._displayedOpacity);
        var quad = this._quad;
        quad._bl.colors = color;
        quad._br.colors = color;
        quad._tl.colors = color;
        quad._tr.colors = color;
        this._quadDirty = true;
    };
    proto.updateStatus = function () {
        cc.Node.RenderCmd.prototype.updateStatus.call(this);

        var textDirty = this._dirtyFlag & cc.Node._dirtyFlags.textDirty;
        if(textDirty) {
            this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.textDirty ^ this._dirtyFlag;
        }
    };
    proto._bakeLabel = function() {
        var node = this._node;
        this._drawFontsize = node._fontSize;
        var ctx = this._labelContext;
        var canvasSizeX = node._contentSize.width;
        var canvasSizeY = node._contentSize.height;
        if(canvasSizeX <=0) canvasSizeX = 1;
        if(canvasSizeY <=0) canvasSizeY = 1;
        var paragraphedStrings = node._string.split("\n");
        var paragraphLength = [];
        this._drawFontsize = node._fontSize;
        var fontDesc = this._drawFontsize.toString() + "px ";
        var fontFamily = node._fontHandle.length === 0? "serif" : node._fontHandle;
        fontDesc = fontDesc + fontFamily;
        this._labelContext.font = fontDesc;
        for(var i = 0; i < paragraphedStrings.length; ++i) {
            var textMetric = ctx.measureText(paragraphedStrings[i]);
            paragraphLength.push(textMetric.width);
        }

        if(cc.Label.Overflow.CLAMP == node._overFlow) {
            if(node._isWrapText) {
                this._splitedStrings = [];
                for(var i = 0; i < paragraphedStrings.length; ++i) {
                    this._splitedStrings = this._splitedStrings.concat(this._fragmentText(paragraphedStrings[i], canvasSizeX, ctx));
                }
            }
            else {
                this._splitedStrings = paragraphedStrings;
            }
        }
        else if(cc.Label.Overflow.RESIZE == node._overFlow) {
            //todo fix it
            if(node._isWrapText) {
                this._splitedStrings = [];
                for(var i = 0; i < paragraphedStrings.length; ++i) {
                    this._splitedStrings = this._splitedStrings.concat(this._fragmentText(paragraphedStrings[i], canvasSizeX, ctx));
                }
                canvasSizeY = this._splitedStrings.length * this._getLineHeight();
                node.setContentSize(cc.size(canvasSizeX,canvasSizeY));
            }
            else {
                this._splitedStrings = paragraphedStrings;
                canvasSizeY = this._splitedStrings.length * this._getLineHeight();
                node.setContentSize(cc.size(canvasSizeX,canvasSizeY));
            }
        }
        else {
            this._splitedStrings = paragraphedStrings;
            //shrink
            if(node._isWrapText) {
                var totalLength = 0;
                for(var i = 0; i < paragraphedStrings.length; ++i) { totalLength += ((paragraphLength[i]/canvasSizeX + 1) | 0) * canvasSizeX; }
                var scale = canvasSizeX * ((canvasSizeY/this._getLineHeight())|0)/totalLength;
                this._drawFontsize = (this._drawFontsize * Math.min(Math.sqrt(scale),1) ) | 0;
                fontDesc = this._drawFontsize.toString() + "px " + fontFamily;
                this._labelContext.font = fontDesc;
                //
                this._splitedStrings = [];
                for(var i = 0; i < paragraphedStrings.length; ++i) {
                    this._splitedStrings = this._splitedStrings.concat(this._fragmentText(paragraphedStrings[i], canvasSizeX, ctx));
                }
            }
            else {
                var maxLength = 0;
                var totalHeight = paragraphedStrings.length * this._getLineHeight();
                for(var i = 0; i < paragraphedStrings.length; ++i) {
                    if(maxLength < paragraphLength[i]) maxLength = paragraphLength[i];
                }
                var scaleX = canvasSizeX/maxLength;
                var scaleY = canvasSizeY/totalHeight;

                this._drawFontsize = (this._drawFontsize * Math.min(1, scaleX, scaleY)) | 0;
                fontDesc = this._drawFontsize.toString() + "px " + fontFamily;
                this._splitedStrings = paragraphedStrings;
            }

        }

        this._labelCanvas.width = canvasSizeX;
        this._labelCanvas.height = canvasSizeY;
        this._labelContext.clearRect(0,0,this._labelCanvas.width,this._labelCanvas.height);
        //this._labelContext.fillStyle = "rgb(128,128,128)";
        //this._labelContext.fillRect(0,0,this._labelCanvas.width,this._labelCanvas.height);
        var color = this._displayedColor;
        this._labelContext.fillStyle = "rgb(" + color.r + "," + color.g + "," +
            color.b +  ")";

        var lineHeight = this._getLineHeight();
        var lineCount = this._splitedStrings.length;
        var labelX; var firstLinelabelY;
        var hAlign; var vAlign;
        //apply align
        {
            if(cc.TextAlignment.RIGHT === node._hAlign) {
                hAlign = "right";
                labelX = canvasSizeX;
            }
            else if(cc.TextAlignment.CENTER === node._hAlign) {
                hAlign = "center";
                labelX = canvasSizeX/2;
            }
            else {
                hAlign = "left";
                labelX = 0;
            }

            this._labelContext.textAlign = hAlign;
            if(cc.VerticalTextAlignment.TOP === node._vAlign) {
                vAlign = "top";
                firstLinelabelY = 0;
            }
            else if(cc.VerticalTextAlignment.CENTER === node._vAlign) {
                vAlign = "middle";
                firstLinelabelY = canvasSizeY/2 - lineHeight * (lineCount -1 ) / 2;
            }
            else {
                vAlign = "bottom";
                firstLinelabelY = canvasSizeY - lineHeight * (lineCount -1 );
            }
            this._labelContext.textBaseline = vAlign;
        }

        this._labelContext.font = fontDesc;

        //do real rendering
        for(var i = 0; i < this._splitedStrings.length; ++i) {
            this._labelContext.fillText(this._splitedStrings[i],labelX,firstLinelabelY + i * lineHeight);
        }

        this._labelTexture._textureLoaded = false;
        this._labelTexture.handleLoadedTexture();
    };

    proto._rebuildLabelSkin = function() {
        if(this._node._labelSkinDirty) {
            this._bakeLabel();
            this._prepareQuad();
            this._node._labelSkinDirty = false;
        }
    };
})();

(function(){
    cc.Label.TTFCanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._labelTexture = new cc.Texture2D();
        this._labelCanvas = document.createElement("canvas");
        this._labelCanvas.width = 1;
        this._labelCanvas.height = 1;
        this._labelContext = this._labelCanvas.getContext("2d");
        this._labelTexture.initWithElement(this._labelCanvas);
        this._quad = new cc.V3F_C4B_T2F_Quad();
        this._quadDirty = true;
        this._splitedStrings = null;
        this._drawFontsize = 0;
    };

    var proto = cc.Label.TTFCanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    cc.js.mixin(proto, cc.Label.TTFLabelBaker.prototype);

    proto.constructor = cc.Label.TTFCanvasRenderCmd;

    proto.rendering = function (ctx, scaleX, scaleY) {
        this._rebuildLabelSkin();
        var node = this._node;
        var locDisplayOpacity = this._displayedOpacity;
        var alpha =  locDisplayOpacity/ 255;
        //var locTexture = this._labelTexture;
        if (locDisplayOpacity === 0)
            return;

        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(node._blendFunc));
        wrapper.setGlobalAlpha(alpha);

        if(this._labelTexture) {

            var quad = this._quad;
            {
                var sx,sy,sw,sh;
                var x, y, w,h;

                x = quad._bl.vertices.x;
                y = quad._bl.vertices.y;
                w = quad._tr.vertices.x - quad._bl.vertices.x;
                h = quad._tr.vertices.y - quad._bl.vertices.y;
                y = - y - h;

                var textureWidth = this._labelTexture.getPixelWidth();
                var textureHeight = this._labelTexture.getPixelHeight();

                sx = quad._bl.texCoords.u * textureWidth;
                sy = quad._bl.texCoords.v * textureHeight;
                sw = (quad._tr.texCoords.u - quad._bl.texCoords.u) * textureWidth;
                sh = (quad._tr.texCoords.v - quad._bl.texCoords.v) * textureHeight;

                x = x * scaleX;
                y = y * scaleY;
                w = w * scaleX;
                h = h * scaleY;

                var image = this._labelTexture._htmlElementObj;
                if (this._labelTexture._pattern !== "") {
                    wrapper.setFillStyle(context.createPattern(image, this._labelTexture._pattern));
                    context.fillRect(x, y, w, h);
                } else {
                    context.drawImage(image,
                        sx, sy, sw, sh,
                        x, y, w, h);
                }
            }

        }
        cc.g_NumberOfDraws = cc.g_NumberOfDraws + 1;
    };

})();