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

cc.Scale9Sprite.CanvasRenderCmd = function (renderable) {
    _ccsg.Node.CanvasRenderCmd.call(this, renderable);
    this._needDraw = true;
    this._state = cc.Scale9Sprite.state.NORMAL;
    this._originalTexture = this._textureToRender = null;
};

var proto = cc.Scale9Sprite.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
proto.constructor = cc.Scale9Sprite.CanvasRenderCmd;

proto._updateDisplayOpacity = function(parentOpacity){
    _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentOpacity);
};

proto._updateDisplayColor = function(parentColor){
    _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
    var node = this._node;
    this._originalTexture = this._textureToRender = null;
};

proto.setState = function(state){
    if(this._state === state) return;

    this._state = state;
    this._originalTexture = this._textureToRender = null;
};

proto.rendering = function (ctx, scaleX, scaleY) {
    var node = this._node;
    var locDisplayOpacity = this._displayedOpacity;
    var alpha =  locDisplayOpacity/ 255;
    var locTexture = null;
    if(node._spriteFrame) locTexture = node._spriteFrame._texture;
    if (!node.loaded() || locDisplayOpacity === 0)
        return;
    if(this._textureToRender === null || this._originalTexture !== locTexture){
        this._textureToRender = this._originalTexture = locTexture;
        if (cc.Scale9Sprite.state.GRAY === this._state) {
            this._textureToRender = this._textureToRender._generateGrayTexture();
        }
        var color = node.getDisplayedColor();
        if(locTexture && (color.r !== 255 || color.g !==255 || color.b !== 255))
            this._textureToRender = this._textureToRender._generateColorTexture(color.r,color.g,color.b);
    }

    var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    wrapper.setCompositeOperation(_ccsg.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(node._blendFunc));
    wrapper.setGlobalAlpha(alpha);

    if(this._textureToRender) {
        if(node._quadsDirty){
            node._rebuildQuads();
        }
        var sx,sy,sw,sh;
        var x, y, w,h;
        var textureWidth = this._textureToRender.getPixelWidth();
        var textureHeight = this._textureToRender.getPixelHeight();
        var image = this._textureToRender._htmlElementObj;

        if(node._isTriangle) {
            var rawQuad = node._rawQuad;
            x = rawQuad._bl.vertices.x;
            y = rawQuad._bl.vertices.y;
            w = rawQuad._tr.vertices.x - rawQuad._bl.vertices.x;
            h = rawQuad._tr.vertices.y - rawQuad._bl.vertices.y;
            y = - y - h;

            sx = rawQuad._tl.texCoords.u * textureWidth;
            sy = rawQuad._tl.texCoords.v * textureHeight;
            sw = (rawQuad._tr.texCoords.u - rawQuad._bl.texCoords.u) * textureWidth;
            sh = (rawQuad._bl.texCoords.v - rawQuad._tr.texCoords.v) * textureHeight;

            x = x * scaleX;
            y = y * scaleY;
            w = w * scaleX;
            h = h * scaleY;

            wrapper.save();
            context.beginPath();

            var quads = node._quads;
            for( var i = 0; i < quads.length; ++i) {
                context.moveTo(quads[i]._tl.vertices.x * scaleX, -quads[i]._tl.vertices.y * scaleY);
                context.lineTo(quads[i]._bl.vertices.x * scaleX, -quads[i]._bl.vertices.y * scaleY);
                context.lineTo(quads[i]._tr.vertices.x * scaleX, -quads[i]._tr.vertices.y * scaleY);
            }

            context.clip();
            if (this._textureToRender._pattern !== "") {
                wrapper.setFillStyle(context.createPattern(image, this._textureToRender._pattern));
                context.fillRect(x, y, w, h);
            } else {
                if(sw !== 0 && sh !== 0 && w !== 0 && h !== 0) {
                    context.drawImage(image,
                        sx, sy, sw, sh,
                        x, y, w, h);
                }
            }

            wrapper.restore();

        } else {
            var quads = node._quads;
            for( var i = 0; i < quads.length; ++i)
            {
                x = quads[i]._bl.vertices.x;
                y = quads[i]._bl.vertices.y;
                w = quads[i]._tr.vertices.x - quads[i]._bl.vertices.x;
                h = quads[i]._tr.vertices.y - quads[i]._bl.vertices.y;
                y = - y - h;

                sx = quads[i]._tl.texCoords.u * textureWidth;
                sy = quads[i]._tl.texCoords.v * textureHeight;
                sw = (quads[i]._tr.texCoords.u - quads[i]._bl.texCoords.u) * textureWidth;
                sh = (quads[i]._bl.texCoords.v - quads[i]._tr.texCoords.v) * textureHeight;

                x = x * scaleX;
                y = y * scaleY;
                w = w * scaleX;
                h = h * scaleY;

                if (this._textureToRender._pattern !== "") {
                    wrapper.setFillStyle(context.createPattern(image, this._textureToRender._pattern));
                    context.fillRect(x, y, w, h);
                } else {
                    if(sw !== 0 && sh !== 0 && w !== 0 && h !== 0) {
                        context.drawImage(image,
                            sx, sy, sw, sh,
                            x, y, w, h);
                    }
                }
            }

        }
        }
    cc.g_NumberOfDraws += quads.length;
}
