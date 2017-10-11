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
 * ParticleSystem's WebGL render command
 */
_ccsg.ParticleSystem.WebGLRenderCmd = function(renderable){
    this._rootCtor(renderable);
    this._needDraw = true;

    this._matrix = new cc.math.Matrix4();
    this._matrix.identity();

    this._buffersVBO = [0, 0];
    this._quads = [];
    this._indices = [];
    this._quadsArrayBuffer = null;
};
var proto = _ccsg.ParticleSystem.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = _ccsg.ParticleSystem.WebGLRenderCmd;

proto.initIndices = function (totalParticles) {
    var locIndices = this._indices;
    for (var i = 0, len = totalParticles; i < len; ++i) {
        var i6 = i * 6;
        var i4 = i * 4;
        locIndices[i6 + 0] = i4 + 0;
        locIndices[i6 + 1] = i4 + 1;
        locIndices[i6 + 2] = i4 + 2;

        locIndices[i6 + 5] = i4 + 1;
        locIndices[i6 + 4] = i4 + 2;
        locIndices[i6 + 3] = i4 + 3;
    }
};

proto.isDifferentTexture = function(texture1, texture2){
     return (texture1 === texture2);
};

proto.updateParticlePosition = function(particle, position){
    // IMPORTANT: newPos may not be used as a reference here! (as it is just the temporary tpa point)
    // the implementation of updateQuadWithParticle must use
    // the x and y values directly
    this.updateQuadWithParticle(particle, position);
};

proto.updateQuadWithParticle = function (particle, newPosition) {
    var quad = null, node = this._node;

    quad = this._quads[node._particleIdx];

    var r, g, b, a;
    if (node._opacityModifyRGB) {
        r = 0 | (particle.color.r * particle.color.a/255);
        g = 0 | (particle.color.g * particle.color.a/255);
        b = 0 | (particle.color.b * particle.color.a/255);
    } else {
        r = 0 | (particle.color.r );
        g = 0 | (particle.color.g );
        b = 0 | (particle.color.b );
    }
    a = 0 | (particle.color.a );

    var blColors = quad.bl.colors, brColors = quad.br.colors, tlColors = quad.tl.colors, trColors = quad.tr.colors;
    blColors.r = brColors.r = tlColors.r = trColors.r = r;
    blColors.g = brColors.g = tlColors.g = trColors.g = g;
    blColors.b = brColors.b = tlColors.b = trColors.b = b;
    blColors.a = brColors.a = tlColors.a = trColors.a = a;

    // vertices
    var size_2 = particle.size / 2;
    if (particle.rotation) {
        var x1 = -size_2, y1 = -size_2;

        var x2 = size_2, y2 = size_2;
        var x = newPosition.x, y = newPosition.y;

        var rad = -cc.degreesToRadians(particle.rotation);
        var cr = Math.cos(rad), sr = Math.sin(rad);
        var ax = x1 * cr - y1 * sr + x;
        var ay = x1 * sr + y1 * cr + y;
        var bx = x2 * cr - y1 * sr + x;
        var by = x2 * sr + y1 * cr + y;
        var cx = x2 * cr - y2 * sr + x;
        var cy = x2 * sr + y2 * cr + y;
        var dx = x1 * cr - y2 * sr + x;
        var dy = x1 * sr + y2 * cr + y;

        // bottom-left
        quad.bl.vertices.x = ax;
        quad.bl.vertices.y = ay;

        // bottom-right vertex:
        quad.br.vertices.x = bx;
        quad.br.vertices.y = by;

        // top-left vertex:
        quad.tl.vertices.x = dx;
        quad.tl.vertices.y = dy;

        // top-right vertex:
        quad.tr.vertices.x = cx;
        quad.tr.vertices.y = cy;
    } else {
        // bottom-left vertex:
        quad.bl.vertices.x = newPosition.x - size_2;
        quad.bl.vertices.y = newPosition.y - size_2;

        // bottom-right vertex:
        quad.br.vertices.x = newPosition.x + size_2;
        quad.br.vertices.y = newPosition.y - size_2;

        // top-left vertex:
        quad.tl.vertices.x = newPosition.x - size_2;
        quad.tl.vertices.y = newPosition.y + size_2;

        // top-right vertex:
        quad.tr.vertices.x = newPosition.x + size_2;
        quad.tr.vertices.y = newPosition.y + size_2;
    }
};

proto.rendering = function (ctx) {
    var node = this._node;
    if (!node._texture)
        return;

    var gl = ctx || cc._renderContext;

    var wt = this._worldTransform, mat = this._matrix.mat;
    mat[0] = wt.a;
    mat[4] = wt.c;
    mat[12] = wt.tx;
    mat[1] = wt.b;
    mat[5] = wt.d;
    mat[13] = wt.ty;

    this._shaderProgram.use();
    this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);     //;

    cc.gl.bindTexture2DN(0, node._texture);
    cc.gl.blendFuncForParticle(node._blendFunc.src, node._blendFunc.dst);

    //
    // Using VBO without VAO
    //
    gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_COLOR);
    gl.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_TEX_COORDS);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffersVBO[0]);
    gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);               // vertices
    gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);          // colors
    gl.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);            // tex coords

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
    gl.drawElements(gl.TRIANGLES, node._particleIdx * 6, gl.UNSIGNED_SHORT, 0);
};

proto.initTexCoordsWithRect = function(pointRect){
    var node = this._node;
    var texture = node.texture;

    var wide = pointRect.width;
    var high = pointRect.height;

    if (texture) {
        wide = texture.width;
        high = texture.height;
    }

    var left, bottom, right, top;
    if (cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
        left = (pointRect.x * 2 + 1) / (wide * 2);
        bottom = (pointRect.y * 2 + 1) / (high * 2);
        right = left + (pointRect.width * 2 - 2) / (wide * 2);
        top = bottom + (pointRect.height * 2 - 2) / (high * 2);
    } else {
        left = pointRect.x / wide;
        bottom = pointRect.y / high;
        right = left + pointRect.width / wide;
        top = bottom + pointRect.height / high;
    }

    // Important. Texture in cocos2d are inverted, so the Y component should be inverted
    var temp = top;
    top = bottom;
    bottom = temp;

    var quads = this._quads;
    var start = 0;
    var end = node._totalParticles;

    for (var i = start; i < end; i++) {
        if (!quads[i])
            quads[i] = cc.V3F_C4B_T2F_QuadZero();

        // bottom-left vertex:
        var selQuad = quads[i];
        selQuad.bl.texCoords.u = left;
        selQuad.bl.texCoords.v = bottom;
        // bottom-right vertex:
        selQuad.br.texCoords.u = right;
        selQuad.br.texCoords.v = bottom;
        // top-left vertex:
        selQuad.tl.texCoords.u = left;
        selQuad.tl.texCoords.v = top;
        // top-right vertex:
        selQuad.tr.texCoords.u = right;
        selQuad.tr.texCoords.v = top;
    }
};

proto.setTotalParticles = function(tp){
    var node = this._node;
    // If we are setting the total numer of particles to a number higher
    // than what is allocated, we need to allocate new arrays
    if (tp > node._allocatedParticles) {
        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        // Allocate new memory
        this._indices = new Uint16Array(tp * 6);
        var locQuadsArrayBuffer = new ArrayBuffer(tp * quadSize);
        //TODO need fix
        // Assign pointers
        var locParticles = node._particles;
        locParticles.length = 0;
        var locQuads = this._quads;
        locQuads.length = 0;
        for (var j = 0; j < tp; j++) {
            locParticles[j] = new cc.Particle();
            locQuads[j] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, locQuadsArrayBuffer, j * quadSize);
        }
        node._allocatedParticles = tp;
        node._totalParticles = tp;

        this._quadsArrayBuffer = locQuadsArrayBuffer;
        this.initIndices(tp);
        this._setupVBO();

        //set the texture coord
        if(node._texture){
            this.initTexCoordsWithRect(cc.rect(0, 0, node._texture.width, node._texture.height));
        }
    } else
        node._totalParticles = tp;
    node.resetSystem();
};

proto.addParticle = function(){
    var node = this._node,
        particles = node._particles;
    return particles[node.particleCount];
};

proto._setupVBO = function(){
    var node = this;
    var gl = cc._renderContext;

    //gl.deleteBuffer(this._buffersVBO[0]);
    this._buffersVBO[0] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffersVBO[0]);
    gl.bufferData(gl.ARRAY_BUFFER, this._quadsArrayBuffer, gl.DYNAMIC_DRAW);

    this._buffersVBO[1] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);

    //cc.checkGLErrorDebug();
};

proto._allocMemory = function(){
    var node  = this._node;
    //cc.assert((!this._quads && !this._indices), "Memory already allocated");

    var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    var totalParticles = node._totalParticles;
    var locQuads = this._quads;
    locQuads.length = 0;
    this._indices = new Uint16Array(totalParticles * 6);
    var locQuadsArrayBuffer = new ArrayBuffer(quadSize * totalParticles);

    for (var i = 0; i < totalParticles; i++)
        locQuads[i] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, locQuadsArrayBuffer, i * quadSize);
    if (!locQuads || !this._indices) {
        cc.logID(6013);
        return false;
    }
    this._quadsArrayBuffer = locQuadsArrayBuffer;
    return true;
};

proto.postStep = function(){
    var gl = cc._renderContext;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffersVBO[0]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._quadsArrayBuffer);
};

proto._setBlendAdditive = function(){
    var locBlendFunc = this._node._blendFunc;
    if (this._texture && !this._texture.hasPremultipliedAlpha()) {
        locBlendFunc.src = cc.macro.SRC_ALPHA;
        locBlendFunc.dst = cc.macro.ONE_MINUS_SRC_ALPHA;
    } else {
        locBlendFunc.src = cc.macro.BLEND_SRC;
        locBlendFunc.dst = cc.macro.BLEND_DST;
    }
};

proto._initWithTotalParticles = function(totalParticles){
    // allocating data space
    if (!this._allocMemory())
        return false;

    this.initIndices(totalParticles);
    this._setupVBO();

    this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_POSITION_TEXTURECOLOR);
};

proto._updateDeltaColor = function (selParticle, dt) {
    selParticle.color.r += selParticle.deltaColor.r * dt;
    selParticle.color.g += selParticle.deltaColor.g * dt;
    selParticle.color.b += selParticle.deltaColor.b * dt;
    selParticle.color.a += selParticle.deltaColor.a * dt;
    selParticle.isChangeColor = true;
};
