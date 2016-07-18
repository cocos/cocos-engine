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

//-----------------------//
//  1. cc.Layer          //
//  2. cc.LayerColor     //
//  3. cc.LayerGradient  //
//-----------------------//

/**
 * cc.Layer's rendering objects of WebGL
 */
(function(){
    cc.Layer.WebGLRenderCmd = function(renderable){
        _ccsg.Node.WebGLRenderCmd.call(this, renderable);
    };

    var proto = cc.Layer.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Layer.WebGLRenderCmd;

    proto.bake = function(){};

    proto.unbake = function(){};

    proto._bakeForAddChild = function(){};
})();

/**
 * cc.LayerColor's rendering objects of WebGL
 */
(function(){
    cc.LayerColor.WebGLRenderCmd = function(renderable){
        cc.Layer.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;

        this._matrix = new cc.math.Matrix4();
        this._matrix.identity();

        //
        var _t = this;
        _t._squareVerticesAB = new ArrayBuffer(48);
        _t._squareColorsAB = new ArrayBuffer(16);

        var locSquareVerticesAB = _t._squareVerticesAB, locSquareColorsAB = _t._squareColorsAB;
        var locVertex3FLen = cc.Vertex3F.BYTES_PER_ELEMENT, locColorLen = cc.Color.BYTES_PER_ELEMENT;
        _t._squareVertices = [new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, 0),
            new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen),
            new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen * 2),
            new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen * 3)];
        _t._squareColors = [cc.color(0, 0, 0, 255, locSquareColorsAB, 0),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 2),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 3)];
        _t._verticesFloat32Buffer = cc._renderContext.createBuffer();
        _t._colorsUint8Buffer = cc._renderContext.createBuffer();

        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR);
    };
    var proto = cc.LayerColor.WebGLRenderCmd.prototype = Object.create(cc.Layer.WebGLRenderCmd.prototype);
    proto.constructor = cc.LayerColor.WebGLRenderCmd;

    proto.rendering = function (ctx) {
        var context = ctx || cc._renderContext;
        var node = this._node;

        var wt = this._worldTransform, mat = this._matrix.mat;
        mat[0] = wt.a;
        mat[4] = wt.c;
        mat[12] = wt.tx;
        mat[1] = wt.b;
        mat[5] = wt.d;
        mat[13] = wt.ty;

        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);
        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_COLOR);
        cc.gl.blendFunc(node._blendFunc.src, node._blendFunc.dst);

        //
        // Attributes
        //
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, 0, 0);

        context.bindBuffer(context.ARRAY_BUFFER, this._colorsUint8Buffer);
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);

        context.drawArrays(context.TRIANGLE_STRIP, 0, this._squareVertices.length);
    };

    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);

        var node = this._node,
            width = node._contentSize.width,
            height = node._contentSize.height;

        var locSquareVertices = this._squareVertices;
        locSquareVertices[1].x = width;
        locSquareVertices[2].y = height;
        locSquareVertices[3].x = width;
        locSquareVertices[3].y = height;
        locSquareVertices[0].z = 
        locSquareVertices[1].z = 
        locSquareVertices[2].z = 
        locSquareVertices[3].z = node._vertexZ;

        this._bindLayerVerticesBufferData();
    };

    proto._updateColor = function(){
        var locDisplayedColor = this._displayedColor, locDisplayedOpacity = this._displayedOpacity,
            locSquareColors = this._squareColors;
        for (var i = 0; i < 4; i++) {
            locSquareColors[i].r = locDisplayedColor.r;
            locSquareColors[i].g = locDisplayedColor.g;
            locSquareColors[i].b = locDisplayedColor.b;
            locSquareColors[i].a = locDisplayedOpacity;
        }
        this._bindLayerColorsBufferData();
    };

    proto._bindLayerVerticesBufferData = function(){
        var glContext = cc._renderContext;
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._verticesFloat32Buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareVerticesAB, glContext.DYNAMIC_DRAW);
    };

    proto._bindLayerColorsBufferData = function(){
        var glContext = cc._renderContext;
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._colorsUint8Buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareColorsAB, glContext.STATIC_DRAW);
    };

    proto.updateBlendFunc = function(blendFunc){};
})();

/**
 * cc.LayerGradient's rendering objects of WebGL
 */
(function(){
    cc.LayerGradient.WebGLRenderCmd = function(renderable){
        cc.LayerColor.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._clipRect = new cc.Rect();
        this._clippingRectDirty = false;
    };
    var proto = cc.LayerGradient.WebGLRenderCmd.prototype = Object.create(cc.LayerColor.WebGLRenderCmd.prototype);
    proto.constructor = cc.LayerGradient.WebGLRenderCmd;

    proto.updateStatus = function () {
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.gradientDirty) {
            this._dirtyFlag |= flags.colorDirty;
            this._updateVertex();
            this._dirtyFlag &= ~flags.gradientDirty;
        }

        _ccsg.Node.RenderCmd.prototype.updateStatus.call(this);
    };

    proto._syncStatus = function (parentCmd) {
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.gradientDirty) {
            this._dirtyFlag |= flags.colorDirty;
            this._updateVertex();
            this._dirtyFlag &= ~flags.gradientDirty;
        }

        _ccsg.Node.RenderCmd.prototype._syncStatus.call(this, parentCmd);
    };

    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this._updateVertex();
    };

    proto._updateVertex = function () {
        var node = this._node, stops = node._colorStops;
        if(!stops || stops.length < 2)
            return;

        this._clippingRectDirty = true;
        var stopsLen = stops.length, verticesLen = stopsLen * 2, i, contentSize = node._contentSize;
        var locVertices = this._squareVertices;
        if (locVertices.length < verticesLen) {
            this._squareVerticesAB = new ArrayBuffer(verticesLen * 12);
            locVertices.length = 0;
            var locSquareVerticesAB = this._squareVerticesAB;
            var locVertex3FLen = cc.Vertex3F.BYTES_PER_ELEMENT;
            for(i = 0; i < verticesLen; i++){
                locVertices.push(new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen * i));
            }
        }

        //init vertex
        var angle = Math.PI + cc.pAngleSigned(cc.p(0, -1), node._alongVector), locAnchor = cc.p(contentSize.width/2, contentSize.height /2);
        var degrees = Math.round(cc.radiansToDegrees(angle));
        var transMat = cc.affineTransformMake(1, 0, 0, 1, locAnchor.x, locAnchor.y);
        transMat = cc.affineTransformRotate(transMat, angle);
        var a, b;
        if(degrees < 90) {
            a = cc.p(-locAnchor.x, locAnchor.y);
            b = cc.p(locAnchor.x, locAnchor.y);
        } else if(degrees < 180) {
            a = cc.p(locAnchor.x, locAnchor.y);
            b = cc.p(locAnchor.x, -locAnchor.y);
        } else if(degrees < 270) {
            a = cc.p(locAnchor.x, -locAnchor.y);
            b = cc.p(-locAnchor.x, -locAnchor.y);
        } else {
            a = cc.p(-locAnchor.x, -locAnchor.y);
            b = cc.p(-locAnchor.x, locAnchor.y);
        }

        var sin = Math.sin(angle), cos = Math.cos(angle);
        var tx = Math.abs((a.x * cos - a.y * sin)/locAnchor.x), ty = Math.abs((b.x * sin + b.y * cos)/locAnchor.y);
        transMat = cc.affineTransformScale(transMat, tx, ty);
        for (i = 0; i < stopsLen; i++) {
            var stop = stops[i], y = stop.p * contentSize.height ;
            var p0 = cc.pointApplyAffineTransform(- locAnchor.x , y - locAnchor.y, transMat);
            locVertices[i * 2].x = p0.x;
            locVertices[i * 2].y = p0.y;
            locVertices[i * 2].z = node._vertexZ;
            var p1 = cc.pointApplyAffineTransform(contentSize.width - locAnchor.x, y - locAnchor.y, transMat);
            locVertices[i * 2 + 1].x = p1.x;
            locVertices[i * 2 + 1].y = p1.y;
            locVertices[i * 2 + 1].z = node._vertexZ;
        }

        this._bindLayerVerticesBufferData();
    };

    proto._updateColor = function() {
        var node = this._node, stops = node._colorStops;
        if(!stops || stops.length < 2)
            return;

        //init color
        var stopsLen = stops.length;
        var locColors = this._squareColors, verticesLen = stopsLen * 2;
        if (locColors.length < verticesLen) {
            this._squareColorsAB = new ArrayBuffer(verticesLen * 4);
            locColors.length = 0;
            var locSquareColorsAB = this._squareColorsAB;
            var locColorLen = cc.Color.BYTES_PER_ELEMENT;
            for(i = 0; i < verticesLen; i++){
                locColors.push(cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * i));
            }
        }

        var opacityf = this._displayedOpacity / 255.0; //, displayColor = this._displayedColor;
        for(i = 0; i < stopsLen; i++){
            var stopColor = stops[i].color, locSquareColor0 = locColors[i * 2], locSquareColor1 = locColors[i * 2 + 1];
            locSquareColor0.r = stopColor.r;
            locSquareColor0.g = stopColor.g;
            locSquareColor0.b = stopColor.b;
            locSquareColor0.a = stopColor.a * opacityf;

            locSquareColor1.r = stopColor.r;
            locSquareColor1.g = stopColor.g;
            locSquareColor1.b = stopColor.b;
            locSquareColor1.a = stopColor.a * opacityf;
        }
        this._bindLayerColorsBufferData();
    };

    proto.rendering = function (ctx) {
        var context = ctx || cc._renderContext, node = this._node;

        //it is too expensive to use stencil to clip, so it use Scissor,
        //but it has a bug when layer rotated and layer's content size less than canvas's size.
        var clippingRect = this._getClippingRect();
        context.enable(context.SCISSOR_TEST);
        cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);

        var wt = this._worldTransform, mat = this._matrix.mat;
        mat[0] = wt.a;
        mat[4] = wt.c;
        mat[12] = wt.tx;
        mat[1] = wt.b;
        mat[5] = wt.d;
        mat[13] = wt.ty;

        //draw gradient layer
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);
        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_COLOR);
        cc.gl.blendFunc(node._blendFunc.src, node._blendFunc.dst);
        //
        // Attributes
        //
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, 0, 0);
        context.bindBuffer(context.ARRAY_BUFFER, this._colorsUint8Buffer);
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);
        context.drawArrays(context.TRIANGLE_STRIP, 0, this._squareVertices.length);

        context.disable(context.SCISSOR_TEST);
    };

    proto._getClippingRect = function(){
        if(this._clippingRectDirty){
            var node = this._node;
            var rect = cc.rect(0, 0, node._contentSize.width, node._contentSize.height);
            var trans = node.getNodeToWorldTransform();
            this._clipRect = cc._rectApplyAffineTransformIn(rect, trans);
        }
        return this._clipRect;
    };
})();
