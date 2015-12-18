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

(function() {
    ccui.Scale9Sprite.CanvasRenderCmd = function (renderable) {
        _ccsg.Node.CanvasRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._state = ccui.Scale9Sprite.state.NORMAL;
        this._textureToRender = null;
    };

    var proto = ccui.Scale9Sprite.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
    proto.constructor = ccui.Scale9Sprite.CanvasRenderCmd;

    proto._updateDisplayOpacity = function(parentOpacity){
        _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentOpacity);
        var node = this._node;
    };

    proto._updateDisplayColor = function(parentColor){
        _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        var node = this._node;
        this._textureToRender = null;
    };

    proto.setState = function(state){
        if(this._state === state) return;

        this._state = state;
        this._textureToRender = null;
    };

    proto.rendering = function (ctx, scaleX, scaleY) {
        var node = this._node;
        var locDisplayOpacity = this._displayedOpacity;
        var alpha =  locDisplayOpacity/ 255;
        var locTexture = null;
        if(node._resourceData) locTexture = node._resourceData._texture;
        if (!node.loaded() || locDisplayOpacity === 0)
            return;
        if(this._textureToRender === null){
            this._textureToRender = locTexture;
            if (cc.Scale9Sprite.state.GRAY === this._state) {
                this._textureToRender = this._textureToRender._generateGrayTexture();
            }
            var color = node.getDisplayedColor();
            if(locTexture && (color.r !== 255 || color.g !==255 || color.b !== 255))
                this._textureToRender = locTexture._generateColorTexture(color.r,color.g,color.b);
        }

        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(node._blendFunc);
        wrapper.setGlobalAlpha(alpha);

        if(this._textureToRender) {
            if(node._quadsDirty){
                node._rebuildQuads();
            }

            var quads = node._quads;
            for( var i = 0; i < quads.length; ++i)
            {
                var sx,sy,sw,sh;
                var x, y, w,h;

                x = quads[i]._bl.vertices.x;
                y = quads[i]._bl.vertices.y;
                w = quads[i]._tr.vertices.x - quads[i]._bl.vertices.x;
                h = quads[i]._tr.vertices.y - quads[i]._bl.vertices.y;
                y = - y - h;

                var textureWidth = this._textureToRender.getPixelWidth();
                var textureHeight = this._textureToRender.getPixelHeight();

                sx = quads[i]._bl.texCoords.u * textureWidth;
                sy = quads[i]._bl.texCoords.v * textureHeight;
                sw = (quads[i]._tr.texCoords.u - quads[i]._bl.texCoords.u) * textureWidth;
                sh = (quads[i]._tr.texCoords.v - quads[i]._bl.texCoords.v) * textureHeight;

                x = x * scaleX;
                y = y * scaleY;
                w = w * scaleX;
                h = h * scaleY;

                var image = this._textureToRender._htmlElementObj;
                if (this._textureToRender._pattern !== "") {
                    wrapper.setFillStyle(context.createPattern(image, this._textureToRender._pattern));
                    context.fillRect(x, y, w, h);
                } else {
                    context.drawImage(image,
                        sx, sy, sw, sh,
                        x, y, w, h);
                }
            }

        }
        cc.g_NumberOfDraws += quads.length;
    }
})();
