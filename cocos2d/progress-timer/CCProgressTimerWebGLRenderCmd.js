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
 * cc.ProgressTimer's rendering objects of WebGL
 */
(function(){
    var MAX_VERTEX_COUNT = 8;

    cc.ProgressTimer.WebGLRenderCmd = function(renderableObject){
        _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._progressDirty = true;

        this._bl = cc.p();
        this._tr = cc.p();

        this.initCmd();
    };

    var proto = cc.ProgressTimer.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.ProgressTimer.WebGLRenderCmd;

    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        var sp = this._node._sprite;
        sp._renderCmd.transform(this, recursive);

        var lx = sp._offsetPosition.x, rx = lx + sp._rect.width,
            by = sp._offsetPosition.y, ty = by + sp._rect.height,
            wt = this._worldTransform;
        this._bl.x = lx * wt.a + by * wt.c + wt.tx;
        this._bl.y = lx * wt.b + by * wt.d + wt.ty;
        this._tr.x = rx * wt.a + ty * wt.c + wt.tx;
        this._tr.y = rx * wt.b + ty * wt.d + wt.ty;

        this._updateProgressData();
    };

    proto.rendering = function (ctx) {
        var node = this._node;
        var context = ctx || cc._renderContext;
        if (this._vertexDataCount === 0 || !node._sprite)
            return;

        this._shaderProgram.use();
        this._shaderProgram._updateProjectionUniform();

        var blendFunc = node._sprite._blendFunc;
        cc.gl.blendFunc(blendFunc.src, blendFunc.dst);
        cc.gl.bindTexture2D(node._sprite.texture);
        context.bindBuffer(context.ARRAY_BUFFER, this._vertexWebGLBuffer);

        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_COLOR);
        context.enableVertexAttribArray(cc.macro.VERTEX_ATTRIB_TEX_COORDS);

        if (this._vertexDataDirty) {
            context.bufferSubData(context.ARRAY_BUFFER, 0, this._float32View);
            this._vertexDataDirty = false;
        }
        var locVertexDataLen = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, locVertexDataLen, 0);
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, locVertexDataLen, 12);
        context.vertexAttribPointer(cc.macro.VERTEX_ATTRIB_TEX_COORDS, 2, context.FLOAT, false, locVertexDataLen, 16);

        if (node._type === cc.ProgressTimer.Type.RADIAL)
            context.drawArrays(context.TRIANGLE_FAN, 0, this._vertexDataCount);
        else if (node._type === cc.ProgressTimer.Type.BAR) {
            if (!node._reverseDirection)
                context.drawArrays(context.TRIANGLE_STRIP, 0, this._vertexDataCount);
            else {
                context.drawArrays(context.TRIANGLE_STRIP, 0, this._vertexDataCount / 2);
                context.drawArrays(context.TRIANGLE_STRIP, 4, this._vertexDataCount / 2);
                // 2 draw calls
                cc.g_NumberOfDraws++;
            }
        }
        cc.g_NumberOfDraws++;
    };

    proto._syncStatus = function (parentCmd) {
        var node = this._node;
        if(!node._sprite)
            return;
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var parentNode = parentCmd ? parentCmd._node : null;

        if(parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
            locFlag |= flags.colorDirty;
        if(parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
            locFlag |= flags.opacityDirty;
        if(parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
            locFlag |= flags.transformDirty;
        this._dirtyFlag = locFlag;

        var spriteCmd = node._sprite._renderCmd;
        var spriteFlag = spriteCmd._dirtyFlag;

        var colorDirty = (locFlag | spriteFlag) & flags.colorDirty,
            opacityDirty = (locFlag | spriteFlag) & flags.opacityDirty;

        if (colorDirty){
            spriteCmd._syncDisplayColor();
            spriteCmd._dirtyFlag &= ~flags.colorDirty;
            this._dirtyFlag &= ~flags.colorDirty;
        }

        if (opacityDirty){
            spriteCmd._syncDisplayOpacity();
            spriteCmd._dirtyFlag &= ~flags.opacityDirty;
            this._dirtyFlag &= ~flags.opacityDirty;
        }

        if(colorDirty || opacityDirty){
            this._updateColor();
        }

        if (locFlag & flags.transformDirty) {
            //update the transform
            this.transform(parentCmd);
        }

        if (locFlag & flags.textureDirty) {
            this._updateProgressData();
            this._dirtyFlag &= ~flags.textureDirty;
        }

        spriteCmd._dirtyFlag = 0;
    };

    proto.updateStatus = function () {
        var node = this._node;
        if(!node._sprite)
            return;
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var spriteCmd = node._sprite._renderCmd;
        var spriteFlag = spriteCmd._dirtyFlag;

        var colorDirty = (locFlag | spriteFlag) & flags.colorDirty,
            opacityDirty = (locFlag | spriteFlag) & flags.opacityDirty;

        if(colorDirty){
            spriteCmd._updateDisplayColor();
            spriteCmd._dirtyFlag &= ~flags.colorDirty;
            this._dirtyFlag &= ~flags.colorDirty;
        }

        if(opacityDirty){
            spriteCmd._updateDisplayOpacity();
            spriteCmd._dirtyFlag &= ~flags.opacityDirty;
            this._dirtyFlag &= ~flags.opacityDirty;
        }

        if(colorDirty || opacityDirty){
            this._updateColor();
        }

        if(locFlag & flags.transformDirty){
            //update the transform
            this.transform(this.getParentRenderCmd(), true);
        }

        if (locFlag & flags.orderDirty) {
            this._dirtyFlag &= ~flags.orderDirty;
        }

        if (locFlag & flags.textureDirty) {
            this._updateProgressData();
            this._dirtyFlag &= ~flags.textureDirty;
        }
    };

    proto.releaseData = function(){
        if (this._vertexData) {
            //release all previous information
            var webglBuffer = this._vertexWebGLBuffer;
            setTimeout(function () {
                cc._renderContext.deleteBuffer(webglBuffer);
            }, 0.1);
            this._vertexWebGLBuffer = null;
            this._vertexData = null;
            this._float32View = null;
            this._vertexArrayBuffer = null;
            this._vertexDataCount = 0;
        }
    };

    proto.initCmd = function () {
        if (!this._vertexData) {
            var gl = cc._renderContext;
            this._vertexWebGLBuffer = gl.createBuffer();
            
            var vertexDataLen = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
            this._vertexArrayBuffer = new ArrayBuffer(MAX_VERTEX_COUNT * vertexDataLen);
            this._float32View = new Float32Array(this._vertexArrayBuffer);
            this._vertexData = [];
            for (var i = 0; i < MAX_VERTEX_COUNT; i++) {
                this._vertexData[i] = new cc.V3F_C4B_T2F(null, null, null, this._vertexArrayBuffer, i * vertexDataLen);
            }

            // Init buffer data
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexWebGLBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this._float32View, gl.DYNAMIC_DRAW);

            this._vertexDataCount = 0;
            this._vertexDataDirty = true;

            //shader program
            this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLOR);
        }
    };

    proto.resetVertexData = function () {
        this._vertexDataCount = 0;
    };

    proto._updateProgressData = function () {
        var node = this._node;
        var locType = node._type;
        if(locType === cc.ProgressTimer.Type.RADIAL)
            this._updateRadial();
        else if(locType === cc.ProgressTimer.Type.BAR)
            this._updateBar();
        this._vertexDataDirty = true;
    };

    proto._updateProgress = function () {
        this.setDirtyFlag(_ccsg.Node._dirtyFlags.textureDirty);
    };

    /**
     * <p>
     *    Update does the work of mapping the texture onto the triangles for the bar                            <br/>
     *    It now doesn't occur the cost of free/alloc data every update cycle.                                  <br/>
     *    It also only changes the percentage point but no other points if they have not been modified.         <br/>
     *                                                                                                          <br/>
     *    It now deals with flipped texture. If you run into this problem, just use the                         <br/>
     *    sprite property and enable the methods flipX, flipY.                                                  <br/>
     * </p>
     * @private
     */
    proto._updateBar = function(){
        var node = this._node;
        if (!node._sprite)
            return;

        var i, alpha = node._percentage / 100.0;
        var locBarChangeRate = node._barChangeRate;
        var alphaOffset = cc.pMult(cc.p((1.0 - locBarChangeRate.x) + alpha * locBarChangeRate.x,
                (1.0 - locBarChangeRate.y) + alpha * locBarChangeRate.y), 0.5);
        var min = cc.pSub(node._midPoint, alphaOffset), max = cc.pAdd(node._midPoint, alphaOffset);

        if (min.x < 0) {
            max.x += -min.x;
            min.x = 0;
        }

        if (max.x > 1) {
            min.x -= max.x - 1;
            max.x = 1;
        }

        if (min.y < 0) {
            max.y += -min.y;
            min.y = 0;
        }

        if (max.y > 1) {
            min.y -= max.y - 1;
            max.y = 1;
        }

        var locVertexData;
        if (!this._reverseDirection) {
            if (!this._vertexDataCount) {
                this._vertexDataCount = 4;
            }
            locVertexData = this._vertexData;
            //    TOPLEFT
            this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, min.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[0].vertices, min.x, max.y);

            //    BOTLEFT
            this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, min.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[1].vertices, min.x, min.y);

            //    TOPRIGHT
            this._textureCoordFromAlphaPoint(locVertexData[2].texCoords, max.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[2].vertices, max.x, max.y);

            //    BOTRIGHT
            this._textureCoordFromAlphaPoint(locVertexData[3].texCoords, max.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[3].vertices, max.x, min.y);
        } else {
            locVertexData = this._vertexData;
            if (!this._vertexDataCount) {
                this._vertexDataCount = 8;
                //    TOPLEFT 1
                this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, 0, 1);
                this._vertexFromAlphaPoint(locVertexData[0].vertices, 0, 1);

                //    BOTLEFT 1
                this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, 0, 0);
                this._vertexFromAlphaPoint(locVertexData[1].vertices, 0, 0);

                //    TOPRIGHT 2
                this._textureCoordFromAlphaPoint(locVertexData[6].texCoords, 1, 1);
                this._vertexFromAlphaPoint(locVertexData[6].vertices, 1, 1);

                //    BOTRIGHT 2
                this._textureCoordFromAlphaPoint(locVertexData[7].texCoords, 1, 0);
                this._vertexFromAlphaPoint(locVertexData[7].vertices, 1, 0);
            }

            //    TOPRIGHT 1
            this._textureCoordFromAlphaPoint(locVertexData[2].texCoords, min.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[2].vertices, min.x, max.y);

            //    BOTRIGHT 1
            this._textureCoordFromAlphaPoint(locVertexData[3].texCoords, min.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[3].vertices, min.x, min.y);

            //    TOPLEFT 2
            this._textureCoordFromAlphaPoint(locVertexData[4].texCoords, max.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[4].vertices, max.x, max.y);

            //    BOTLEFT 2
            this._textureCoordFromAlphaPoint(locVertexData[5].texCoords, max.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[5].vertices, max.x, min.y);
        }
        this._updateColor();
    };

    /**
     * <p>
     *    Update does the work of mapping the texture onto the triangles            <br/>
     *    It now doesn't occur the cost of free/alloc data every update cycle.      <br/>
     *    It also only changes the percentage point but no other points if they have not been modified.       <br/>
     *                                                                              <br/>
     *    It now deals with flipped texture. If you run into this problem, just use the                       <br/>
     *    sprite property and enable the methods flipX, flipY.                      <br/>
     * </p>
     * @private
     */
    proto._updateRadial = function () {
        var node = this._node;
        if (!node._sprite)
            return;

        var i, locMidPoint = node._midPoint;
        var alpha = node._percentage / 100;
        var angle = 2 * (Math.PI) * ( node._reverseDirection ? alpha : 1.0 - alpha);

        //    We find the vector to do a hit detection based on the percentage
        //    We know the first vector is the one @ 12 o'clock (top,mid) so we rotate
        //    from that by the progress angle around the m_tMidpoint pivot
        var topMid = cc.p(locMidPoint.x, 1);
        var percentagePt = cc.pRotateByAngle(topMid, locMidPoint, angle);

        var index = 0;
        var hit;

        if (alpha === 0) {
            //    More efficient since we don't always need to check intersection
            //    If the alpha is zero then the hit point is top mid and the index is 0.
            hit = topMid;
            index = 0;
        } else if (alpha === 1) {
            //    More efficient since we don't always need to check intersection
            //    If the alpha is one then the hit point is top mid and the index is 4.
            hit = topMid;
            index = 4;
        } else {
            //    We run a for loop checking the edges of the texture to find the
            //    intersection point
            //    We loop through five points since the top is split in half

            var min_t = cc.macro.FLT_MAX;
            var locProTextCoordsCount = cc.ProgressTimer.TEXTURE_COORDS_COUNT;
            for (i = 0; i <= locProTextCoordsCount; ++i) {
                var pIndex = (i + (locProTextCoordsCount - 1)) % locProTextCoordsCount;

                var edgePtA = this._boundaryTexCoord(i % locProTextCoordsCount);
                var edgePtB = this._boundaryTexCoord(pIndex);

                //    Remember that the top edge is split in half for the 12 o'clock position
                //    Let's deal with that here by finding the correct endpoints
                if (i === 0)
                    edgePtB = cc.pLerp(edgePtA, edgePtB, 1 - locMidPoint.x);
                else if (i === 4)
                    edgePtA = cc.pLerp(edgePtA, edgePtB, 1 - locMidPoint.x);

                // retPoint are returned by ccpLineIntersect
                var retPoint = cc.p(0, 0);
                if (cc.pLineIntersect(edgePtA, edgePtB, locMidPoint, percentagePt, retPoint)) {
                    //    Since our hit test is on rays we have to deal with the top edge
                    //    being in split in half so we have to test as a segment
                    if ((i === 0 || i === 4)) {
                        //    s represents the point between edgePtA--edgePtB
                        if (!(0 <= retPoint.x && retPoint.x <= 1))
                            continue;
                    }
                    //    As long as our t isn't negative we are at least finding a
                    //    correct hitpoint from m_tMidpoint to percentagePt.
                    if (retPoint.y >= 0) {
                        //    Because the percentage line and all the texture edges are
                        //    rays we should only account for the shortest intersection
                        if (retPoint.y < min_t) {
                            min_t = retPoint.y;
                            index = i;
                        }
                    }
                }
            }

            //    Now that we have the minimum magnitude we can use that to find our intersection
            hit = cc.pAdd(locMidPoint, cc.pMult(cc.pSub(percentagePt, locMidPoint), min_t));
        }

        //    The size of the vertex data is the index from the hitpoint
        //    the 3 is for the m_tMidpoint, 12 o'clock point and hitpoint position.
        var sameIndexCount = true;
        if (this._vertexDataCount !== index + 3) {
            sameIndexCount = false;
            this._vertexDataCount = index + 3;
        }

        this._updateColor();

        var locVertexData = this._vertexData;
        if (!sameIndexCount) {
            //    First we populate the array with the m_tMidpoint, then all
            //    vertices/texcoords/colors of the 12 'o clock start and edges and the hitpoint
            this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, locMidPoint.x, locMidPoint.y);
            this._vertexFromAlphaPoint(locVertexData[0].vertices, locMidPoint.x, locMidPoint.y);

            this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, topMid.x, topMid.y);
            this._vertexFromAlphaPoint(locVertexData[1].vertices, topMid.x, topMid.y);

            for (i = 0; i < index; i++) {
                var alphaPoint = this._boundaryTexCoord(i);
                this._textureCoordFromAlphaPoint(locVertexData[i + 2].texCoords, alphaPoint.x, alphaPoint.y);
                this._vertexFromAlphaPoint(locVertexData[i + 2].vertices, alphaPoint.x, alphaPoint.y);
            }
        }

        //    hitpoint will go last
        this._textureCoordFromAlphaPoint(locVertexData[this._vertexDataCount - 1].texCoords, hit.x, hit.y);
        this._vertexFromAlphaPoint(locVertexData[this._vertexDataCount - 1].vertices, hit.x, hit.y);
    };

    proto._boundaryTexCoord = function (index) {
        if (index < cc.ProgressTimer.TEXTURE_COORDS_COUNT) {
            var locProTextCoords = cc.ProgressTimer.TEXTURE_COORDS;
            if (this._node._reverseDirection)
                return cc.p((locProTextCoords >> (7 - (index << 1))) & 1, (locProTextCoords >> (7 - ((index << 1) + 1))) & 1);
            else
                return cc.p((locProTextCoords >> ((index << 1) + 1)) & 1, (locProTextCoords >> (index << 1)) & 1);
        }
        return cc.p(0,0);
    };

    proto._textureCoordFromAlphaPoint = function (coords, ax, ay) {
        var locSprite = this._node._sprite;
        if (!locSprite) {
            coords.u = 0;
            coords.v = 0;
            return;
        }
        var uvs = locSprite._renderCmd._vertices,
            bl = uvs[1],
            tr = uvs[2];
        var min = cc.p(bl.u, bl.v);
        var max = cc.p(tr.u, tr.v);

        //  Fix bug #1303 so that progress timer handles sprite frame texture rotation
        if (locSprite.textureRectRotated) {
            var temp = ax;
            ax = ay;
            ay = temp;
        }
        coords.u = min.x * (1 - ax) + max.x * ax;
        coords.v = min.y * (1 - ay) + max.y * ay;
    };

    proto._vertexFromAlphaPoint = function (vertex, ax, ay) {
        vertex.x = this._bl.x * (1 - ax) + this._tr.x * ax;
        vertex.y = this._bl.y * (1 - ay) + this._tr.y * ay;
        vertex.z = this._node._vertexZ;
    };

    proto._updateColor = function(){
        var sp = this._node._sprite;
        if (!this._vertexDataCount || !sp)
            return;

        var color = this._displayedColor;
        var spColor = sp._renderCmd._displayedColor;
        var r = spColor.r;
        var g = spColor.g;
        var b = spColor.b;
        var a = sp._renderCmd._displayedOpacity / 255;
        if (sp._opacityModifyRGB) {
            r *= a;
            g *= a;
            b *= a;
        }
        color.r = r;
        color.g = g;
        color.b = b;
        color.a = sp._renderCmd._displayedOpacity;
        var locVertexData = this._vertexData;
        for (var i = 0, len = this._vertexDataCount; i < len; ++i) {
            locVertexData[i].colors = color;
        }
        this._vertexDataDirty = true;
    };
})();
