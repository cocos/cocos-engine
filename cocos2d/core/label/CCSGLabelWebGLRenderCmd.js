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

var ccgl = cc.gl;

_ccsg.Label.WebGLRenderCmd = function(renderableObject){
    _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
    this._needDraw = true;

    this._labelTexture = new cc.Texture2D();
    this._labelCanvas = document.createElement("canvas");
    this._labelTexture.initWithElement(this._labelCanvas);
    this._labelContext = this._labelCanvas.getContext("2d");

    this._labelCanvas.width = 1;
    this._labelCanvas.height = 1;
    this._splitedStrings = null;
    this._drawFontsize = 0;

    this._vertices = [
        {x: 0, y: 0, u: 0, v: 0}, // tl
        {x: 0, y: 0, u: 0, v: 1}, // bl
        {x: 0, y: 0, u: 1, v: 0}, // tr
        {x: 0, y: 0, u: 1, v: 1}  // br
    ];
    this._color = new Uint32Array(1);
    this._dirty = false;

    this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
};

var proto = _ccsg.Label.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
cc.js.mixin(proto, _ccsg.Label.TTFLabelBaker.prototype);

proto.constructor = _ccsg.Label.WebGLRenderCmd;

proto._updateDisplayOpacity = function (parentOpacity) {
    _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentOpacity);
    this._rebuildLabelSkin();
};

proto.transform = function (parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);

    var node = this._node,
        lx = node._position.x, rx = lx + this._labelCanvas.width,
        by = node._position.y, ty = by + this._labelCanvas.height,
        wt = this._worldTransform;

    var vertices = this._vertices;
    vertices[0].x = lx * wt.a + ty * wt.c + wt.tx; // tl
    vertices[0].y = lx * wt.b + ty * wt.d + wt.ty;
    vertices[1].x = lx * wt.a + by * wt.c + wt.tx; // bl
    vertices[1].y = lx * wt.b + by * wt.d + wt.ty;
    vertices[2].x = rx * wt.a + ty * wt.c + wt.tx; // tr
    vertices[2].y = rx * wt.b + ty * wt.d + wt.ty;
    vertices[3].x = rx * wt.a + by * wt.c + wt.tx; // br
    vertices[3].y = rx * wt.b + by * wt.d + wt.ty;
};

proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset) {
    var node = this._node;
    if (!node._string || (node._labelType !== _ccsg.Label.Type.TTF &&
       node._labelType !== _ccsg.Label.Type.SystemFont))
        return 0;

    // Fill in vertex data with quad information (4 vertices for sprite)
    var opacity = this._displayedOpacity;
    var r = this._displayedColor.r,
        g = this._displayedColor.g,
        b = this._displayedColor.b;
    if (node._opacityModifyRGB) {
        var a = opacity / 255;
        r *= a;
        g *= a;
        b *= a;
    }
    this._color[0] = ((opacity<<24) | (b<<16) | (g<<8) | r);
    var z = node._vertexZ;

    var vertices = this._vertices;
    var i, len = vertices.length, vertex, offset = vertexDataOffset;
    for (i = 0; i < len; ++i) {
        vertex = vertices[i];
        f32buffer[offset] = vertex.x;
        f32buffer[offset + 1] = vertex.y;
        f32buffer[offset + 2] = z;
        ui32buffer[offset + 3] = this._color[0];
        f32buffer[offset + 4] = vertex.u;
        f32buffer[offset + 5] = vertex.v;
        offset += 6;
    }

    return len;
};
