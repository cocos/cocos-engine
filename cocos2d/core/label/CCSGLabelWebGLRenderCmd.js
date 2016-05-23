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
    this._quadWebBuffer = cc._renderContext.createBuffer();
    this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_POSITION_TEXTURECOLOR);
    this._quad = new cc.V3F_C4B_T2F_Quad();

    this._labelCanvas = document.createElement("canvas");
    this._labelTexture.initWithElement(this._labelCanvas);
    this._labelContext = this._labelCanvas.getContext("2d");

    this._labelCanvas.width = 1;
    this._labelCanvas.height = 1;
    this._quadDirty = true;
    this._splitedStrings = null;
    this._drawFontsize = 0;
};

var proto = _ccsg.Label.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
cc.js.mixin(proto, _ccsg.Label.TTFLabelBaker.prototype);

proto.constructor = _ccsg.Label.WebGLRenderCmd;

proto._updateDisplayOpacity = function (parentOpacity) {
    _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentOpacity);
    this._rebuildLabelSkin();
};

proto.rendering = function (ctx) {
    var node = this._node;

    if(node._labelType === _ccsg.Label.Type.TTF ||
      node._labelType === _ccsg.Label.Type.SystemFont){
        var gl = ctx || cc._renderContext ;

        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);

        ccgl.blendFunc(node._blendFunc.src,node._blendFunc.dst);
        ccgl.bindTexture2DN(0,this._labelTexture);
        ccgl.enableVertexAttribs(cc.macro.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._quadWebBuffer);

        if (this._quadDirty) {
            gl.bufferData(gl.ARRAY_BUFFER, this._quad.arrayBuffer, gl.DYNAMIC_DRAW);
            this._quadDirty = false;
        }

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);                   //cc.macro.VERTEX_ATTRIB_POSITION
        gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 24, 12);           //cc.macro.VERTEX_ATTRIB_COLOR
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16);                  //cc.macro.VERTEX_ATTRIB_TEX_COORDS

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

};
