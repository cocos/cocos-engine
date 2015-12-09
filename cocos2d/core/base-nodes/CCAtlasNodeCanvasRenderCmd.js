/****************************************************************************
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

/**
 * cc.AtlasNode's rendering objects of Canvas
 */
(function(){
    cc.AtlasNode.CanvasRenderCmd = function(renderableObject){
        _ccsg.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = false;
        this._colorUnmodified = cc.Color.WHITE;
        this._textureToRender = null;
    };

    var proto = cc.AtlasNode.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.AtlasNode.CanvasRenderCmd;

    proto.initWithTexture = function(texture, tileWidth, tileHeight, itemsToRender){
        var node = this._node;
        node._itemWidth = tileWidth;
        node._itemHeight = tileHeight;

        node._opacityModifyRGB = true;
        node._texture = texture;
        if (!node._texture) {
            cc.log(cc._LogInfos.AtlasNode._initWithTexture);
            return false;
        }
        this._textureToRender = texture;
        this._calculateMaxItems();

        node.quadsToDraw = itemsToRender;
        return true;
    };

    proto.setColor = function(color3){
        var node = this._node;
        var locRealColor = node._realColor;
        if ((locRealColor.r === color3.r) && (locRealColor.g === color3.g) && (locRealColor.b === color3.b))
            return;
        this._colorUnmodified = color3;
        this._changeTextureColor();
    };

    proto._changeTextureColor = function(){
        var node = this._node;
        var texture = node._texture,
            color = this._colorUnmodified,
            element = texture.getHtmlElementObj();
        var textureRect = cc.rect(0, 0, element.width, element.height);
        if(texture === this._textureToRender)
            this._textureToRender = texture._generateColorTexture(color.r, color.g, color.b, textureRect);
        else
            texture._generateColorTexture(color.r, color.g, color.b, textureRect, this._textureToRender.getHtmlElementObj());
    };

    proto.setOpacity = function(opacity){
        var node = this._node;
        _ccsg.Node.prototype.setOpacity.call(node, opacity);
    };

    proto._calculateMaxItems = function(){
        var node = this._node;
        var selTexture = node._texture;
        var size = selTexture.getContentSize();

        node._itemsPerColumn = 0 | (size.height / node._itemHeight);
        node._itemsPerRow = 0 | (size.width / node._itemWidth);
    };
})();
