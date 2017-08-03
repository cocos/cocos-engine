/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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
    this._rootCtor(renderable);
    if (this._node.loaded()) {
        this._needDraw = true;
    }
    else {
        this._needDraw = false;
    }
    this._state = cc.Scale9Sprite.state.NORMAL;
    this._originalTexture = this._textureToRender = null;
};

var proto = cc.Scale9Sprite.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
proto.constructor = cc.Scale9Sprite.CanvasRenderCmd;

proto.transform = function (parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);
    this._node._rebuildQuads();
};

proto._updateDisplayColor = function(parentColor){
    _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
    this._originalTexture = this._textureToRender = null;
};

proto._syncDisplayColor = function(parentColor){
    _ccsg.Node.WebGLRenderCmd.prototype._syncDisplayColor.call(this, parentColor);
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
    if (node._spriteFrame) locTexture = node._spriteFrame._texture;
    if (!node.loaded() || locDisplayOpacity === 0)
        return;
    if (this._textureToRender === null || this._originalTexture !== locTexture) {
        this._textureToRender = this._originalTexture = locTexture;
        if (cc.Scale9Sprite.state.GRAY === this._state) {
            this._textureToRender = this._textureToRender._generateGrayTexture();
        }
        var color = node.getDisplayedColor();
        if (locTexture && (color.r !== 255 || color.g !==255 || color.b !== 255))
            this._textureToRender = this._textureToRender._generateColorTexture(color.r,color.g,color.b);
    }

    var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    wrapper.setCompositeOperation(_ccsg.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(node._blendFunc));
    wrapper.setGlobalAlpha(alpha);

    if (this._textureToRender) {
        if (node._quadsDirty) {
            node._rebuildQuads();
        }
        var sx,sy,sw,sh;
        var x, y, w,h;
        var textureWidth = this._textureToRender._pixelWidth;
        var textureHeight = this._textureToRender._pixelHeight;
        var image = this._textureToRender._htmlElementObj;
        var vertices = node._vertices;
        var uvs = node._uvs;
        var i = 0, off = 0;

        if (node._isTriangle) {
            var rawVerts = node._rawVerts, rawUvs = node._rawUvs;
            x = rawVerts[0];
            y = rawVerts[1];
            w = rawVerts[6] - x;
            h = rawVerts[7] - y;
            y = - y - h;

            sx = rawUvs[4] * textureWidth;
            sy = rawUvs[5] * textureHeight;
            sw = (rawUvs[6] - rawUvs[0]) * textureWidth;
            sh = (rawUvs[1] - rawUvs[7]) * textureHeight;


            wrapper.save();
            context.beginPath();
            var triangleCount = Math.floor(node._vertCount / 3);

            for (i = 0, off = 0; i < triangleCount; i++) {
                context.moveTo(vertices[off++], -vertices[off++]);
                context.lineTo(vertices[off++], -vertices[off++]);
                context.lineTo(vertices[off++], -vertices[off++]);
            }

            context.clip();
            if (this._textureToRender._pattern !== '') {
                wrapper.setFillStyle(context.createPattern(image, this._textureToRender._pattern));
                context.fillRect(x, y, w, h);
            } 
            else {
                if (sw > 0 && sh > 0 && w > 0 && h > 0) {
                    context.drawImage(image,
                        sx, sy, sw, sh,
                        x, y, w, h);
                }
            }

            wrapper.restore();
            cc.g_NumberOfDraws += triangleCount;
        } 
        else if (node._renderingType === cc.Scale9Sprite.RenderingType.SLICED) {
            // Sliced use a special vertices layout 16 vertices for 9 quads
            for (var r = 0; r < 3; ++r) {
                for (var c = 0; c < 3; ++c) {
                    off = r*8 + c*2;
                    x = vertices[off];
                    y = vertices[off+1];
                    w = vertices[off+10] - x;
                    h = vertices[off+11] - y;
                    y = - y - h;

                    sx = uvs[off] * textureWidth;
                    sy = uvs[off+11] * textureHeight;
                    sw = (uvs[off+10] - uvs[off]) * textureWidth;
                    sh = (uvs[off+1] - uvs[off+11]) * textureHeight;

                    if (sw > 0 && sh > 0 && w > 0 && h > 0) {
                        context.drawImage(image,
                            sx, sy, sw, sh,
                            x, y, w, h);
                    }
                }
            }
            cc.g_NumberOfDraws += 9;
        }
        else {
            var quadCount = Math.floor(node._vertCount / 4);
            for (i = 0, off = 0; i < quadCount; i++) {
                x = vertices[off];
                y = vertices[off+1];
                w = vertices[off+6] - x;
                h = vertices[off+7] - y;
                y = - y - h;

                sx = uvs[off] * textureWidth;
                sy = uvs[off+7] * textureHeight;
                sw = (uvs[off+6] - uvs[off]) * textureWidth;
                sh = (uvs[off+1] - uvs[off+7]) * textureHeight;
                

                if (this._textureToRender._pattern !== '') {
                    wrapper.setFillStyle(context.createPattern(image, this._textureToRender._pattern));
                    context.fillRect(x, y, w, h);
                } else {
                    if (sw > 0 && sh > 0 && w > 0 && h > 0) {
                        context.drawImage(image,
                            sx, sy, sw, sh,
                            x, y, w, h);
                    }
                }
                off += 8;
            }
            cc.g_NumberOfDraws += quadCount;
        }
    }
};
