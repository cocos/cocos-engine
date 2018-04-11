/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

_ccsg.MotionStreak.WebGLRenderCmd = function(renderableObject){
    this._rootCtor(renderableObject);
    this._needDraw = true;
    this._matrix = new cc.math.Matrix4();
    this._matrix.identity();
    this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_POSITION_TEXTURECOLOR);
};

_ccsg.MotionStreak.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
_ccsg.MotionStreak.WebGLRenderCmd.prototype.constructor = _ccsg.Sprite.WebGLRenderCmd;

_ccsg.MotionStreak.WebGLRenderCmd.prototype.rendering = function(ctx){
    var node = this._node;
    if (node._nuPoints <= 1)
        return;

    if (node.texture && node.texture.loaded) {
        ctx = ctx || cc._renderContext;

        // update the color
        this._updateDisplayColor();

        var wt = this._worldTransform, mat = this._matrix.mat;
        mat[0] = wt.a;
        mat[4] = wt.c;
        mat[12] = wt.tx;
        mat[1] = wt.b;
        mat[5] = wt.d;
        mat[13] = wt.ty;

        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);
        cc.gl.blendFunc(node._blendFunc.src, node._blendFunc.dst);

        cc.gl.bindTexture2DN(0, node.texture);

        ctx.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
        ctx.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_COLOR);
        ctx.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_TEX_COORDS);

        //position
        ctx.bindBuffer(ctx.ARRAY_BUFFER, node._verticesBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, node._vertices, ctx.DYNAMIC_DRAW);
        ctx.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 2, ctx.FLOAT, false, 0, 0);

        //texcoords
        ctx.bindBuffer(ctx.ARRAY_BUFFER, node._texCoordsBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, node._texCoords, ctx.DYNAMIC_DRAW);
        ctx.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_TEX_COORDS, 2, ctx.FLOAT, false, 0, 0);

        //colors
        ctx.bindBuffer(ctx.ARRAY_BUFFER, node._colorPointerBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, node._colorPointer, ctx.DYNAMIC_DRAW);
        ctx.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, ctx.UNSIGNED_BYTE, true, 0, 0);

        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, node._nuPoints * 2);
        cc.g_NumberOfDraws++;
    }
};
