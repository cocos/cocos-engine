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

(function(){
    cc.LabelAtlas.WebGLRenderCmd = function(renderable){
        cc.AtlasNode.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
    };

    var proto = cc.LabelAtlas.WebGLRenderCmd.prototype = Object.create(cc.AtlasNode.WebGLRenderCmd.prototype);
    proto.constructor = cc.LabelAtlas.WebGLRenderCmd;

    proto.setCascade = function(){
        var node = this._node;
        node._cascadeOpacityEnabled = true;
        node._cascadeColorEnabled = true;
    };

    proto.rendering = function(ctx){
        cc.AtlasNode.WebGLRenderCmd.prototype.rendering.call(this, ctx);
        if (cc.macro.LABELATLAS_DEBUG_DRAW) {
            var node = this._node;
            var s = node.getContentSize();
            var locRect = node.getBoundingBoxToWorld();
            var posX = locRect.x,
                posY = locRect.y;
                s.width = locRect.width;
                s.height = locRect.height;
            var vertices = [cc.p(posX, posY), cc.p(posX+ s.width, posY),
                cc.p(s.width+posX, s.height+posY), cc.p(posX, posY+s.height)];
            cc._drawingUtil.drawPoly(vertices, 4, true);
        }
    };

    proto.updateAtlasValues = function(){
        var node = this._node;
        var locString = node._string;
        var n = locString.length;
        var locTextureAtlas = this._textureAtlas;

        var texture = locTextureAtlas.texture;
        var textureWide = texture.getPixelWidth();
        var textureHigh = texture.getPixelHeight();
        var itemWidth = node._itemWidth;
        var itemHeight = node._itemHeight;
        if (n > locTextureAtlas.getCapacity())
            cc.log("cc.LabelAtlas._updateAtlasValues(): Invalid String length");
        var quads = locTextureAtlas.quads;
        var locDisplayedColor = this._displayedColor;
        var curColor = {r: locDisplayedColor.r, g: locDisplayedColor.g, b: locDisplayedColor.b, a: node._displayedOpacity};
        var locItemWidth = node._itemWidth;
        var locItemHeight = node._itemHeight;
        for (var i = 0, cr = -1; i < n; i++) {
            var a = locString.charCodeAt(i) - node._mapStartChar.charCodeAt(0);
            var row = a % node._itemsPerRow;
            var col = 0 | (a / node._itemsPerRow);
            if(row < 0 || col < 0)
                continue;
            if(row*locItemWidth + locItemWidth > textureWide || col*locItemHeight + locItemHeight > textureHigh)
                continue;

            cr++;
            var left, right, top, bottom;
            if (cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
                // Issue #938. Don't use texStepX & texStepY
                left = (2 * row * itemWidth + 1) / (2 * textureWide);
                right = left + (itemWidth * 2 - 2) / (2 * textureWide);
                top = (2 * col * itemHeight + 1) / (2 * textureHigh);
                bottom = top + (itemHeight * 2 - 2) / (2 * textureHigh);
            } else {
                left = row * itemWidth / textureWide;
                right = left + itemWidth / textureWide;
                top = col * itemHeight / textureHigh;
                bottom = top + itemHeight / textureHigh;
            }
            var quad = quads[i];
            var locQuadTL = quad.tl, locQuadTR = quad.tr, locQuadBL = quad.bl, locQuadBR = quad.br;
            locQuadTL.texCoords.u = left;
            locQuadTL.texCoords.v = top;
            locQuadTR.texCoords.u = right;
            locQuadTR.texCoords.v = top;
            locQuadBL.texCoords.u = left;
            locQuadBL.texCoords.v = bottom;
            locQuadBR.texCoords.u = right;
            locQuadBR.texCoords.v = bottom;

            locQuadBL.vertices.x = (cr * locItemWidth);
            locQuadBL.vertices.y = 0;
            locQuadBL.vertices.z = 0.0;
            locQuadBR.vertices.x = (cr * locItemWidth + locItemWidth);
            locQuadBR.vertices.y = 0;
            locQuadBR.vertices.z = 0.0;
            locQuadTL.vertices.x = cr * locItemWidth;
            locQuadTL.vertices.y = node._itemHeight;
            locQuadTL.vertices.z = 0.0;
            locQuadTR.vertices.x = cr * locItemWidth + locItemWidth;
            locQuadTR.vertices.y = node._itemHeight;
            locQuadTR.vertices.z = 0.0;
            locQuadTL.colors = curColor;
            locQuadTR.colors = curColor;
            locQuadBL.colors = curColor;
            locQuadBR.colors = curColor;
        }
        this.updateContentSize(i, cr+1);
        if (n > 0) {
            locTextureAtlas.dirty = true;
            var totalQuads = locTextureAtlas.totalQuads;
            if (n > totalQuads)
                locTextureAtlas.increaseTotalQuadsWith(n - totalQuads);
        }
    };

    proto.updateContentSize = function(i, cr){
        var node = this._node,
            contentSize = node._contentSize;
        if(i !== cr && i*node._itemWidth === contentSize.width && node._itemHeight === contentSize.height){
            node.setContentSize(cr * node._itemWidth, node._itemHeight);
        }
    };

    proto.setString = function(label){
        var len = label.length;
        if (len > this._textureAtlas.totalQuads)
            this._textureAtlas.resizeCapacity(len);
    };

    proto._addChild = function(){};
})();