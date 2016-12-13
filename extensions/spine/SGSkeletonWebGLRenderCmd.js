/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

var spine = sp.spine;


sp._SGSkeleton.WebGLRenderCmd = function (renderableObject) {
    _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
    this._needDraw = true;
    this._matrix = new cc.math.Matrix4();
    this._matrix.identity();
    this.vertexType = cc.renderer.VertexType.CUSTOM;
    this.setShaderProgram(cc.shaderCache.programForKey(cc.macro.SHADER_POSITION_TEXTURECOLOR));
};

var proto = sp._SGSkeleton.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = sp._SGSkeleton.WebGLRenderCmd;

proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset){

    // rendering the cached data first
    cc.renderer._batchRendering();
    vertexDataOffset = 0;

    var node = this._node;
    var color = this._displayedColor, locSkeleton = node._skeleton;

    var textureAtlas, attachment, slot, i, n;
    var premultiAlpha = node._premultipliedAlpha;
    var blendMode = -1;
    var dataInited = false;
    var cachedVertices = 0;

    var wt = this._worldTransform, mat = this._matrix.mat;
    mat[0] = wt.a;
    mat[4] = wt.c;
    mat[12] = wt.tx;
    mat[1] = wt.b;
    mat[5] = wt.d;
    mat[13] = wt.ty;

    this._shaderProgram.use();
    this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);

    locSkeleton.r = color.r / 255;
    locSkeleton.g = color.g / 255;
    locSkeleton.b = color.b / 255;
    locSkeleton.a = this._displayedOpacity / 255;
    if (premultiAlpha) {
        locSkeleton.r *= locSkeleton.a;
        locSkeleton.g *= locSkeleton.a;
        locSkeleton.b *= locSkeleton.a;
    }

    var debugSlotsInfo = null;
    if (this._node._debugSlots) {
        debugSlotsInfo = [];
    }

    for (i = 0, n = locSkeleton.drawOrder.length; i < n; i++) {
        slot = locSkeleton.drawOrder[i];
        if (!slot.attachment)
            continue;
        attachment = slot.attachment;

        // get the vertices length
        var vertCount = 0;
        switch(attachment.type) {
            case sp.ATTACHMENT_TYPE.REGION:
                vertCount = 6; // a quad = two triangles = six vertices
                break;
            case sp.ATTACHMENT_TYPE.MESH:
                //vertCount = attachment.vertices.length;
                break;
            case sp.ATTACHMENT_TYPE.SKINNED_MESH:
                break;
            default:
                continue;
        }

        // no vertices to render
        if (vertCount === 0) {
            continue;
        }
        var regionTextureAtlas = node.getTextureAtlas(attachment);
        // init data at the first time
        if (!dataInited) {
            textureAtlas = regionTextureAtlas;
            blendMode = slot.data.blendMode;
            cc.renderer._updateBatchedInfo(textureAtlas.texture, this._getBlendFunc(blendMode, premultiAlpha), this.getShaderProgram());
            dataInited = true;
        }

        // if data changed or the vertices will be overflow
        if ((cachedVertices + vertCount) * 6 > f32buffer.length ||
            textureAtlas !== regionTextureAtlas ||
            blendMode !== slot.data.blendMode) {
            // render the cached data
            cc.renderer._batchRendering();
            vertexDataOffset = 0;
            cachedVertices = 0;

            // update the batched info
            textureAtlas = regionTextureAtlas;
            blendMode = slot.data.blendMode;
            cc.renderer._updateBatchedInfo(textureAtlas.texture, this._getBlendFunc(blendMode, premultiAlpha), this.getShaderProgram());
        }

        // update the vertext buffer
        var slotDebugPoints = null;
        switch(attachment.type) {
            case sp.ATTACHMENT_TYPE.REGION:
                slotDebugPoints = this._uploadRegionAttachmentData(attachment, slot, premultiAlpha, f32buffer, ui32buffer, vertexDataOffset);
                break;
            case sp.ATTACHMENT_TYPE.MESH:
                this._uploadMeshAttachmentData(attachment, slot, premultiAlpha, f32buffer, ui32buffer, vertexDataOffset);
                break;
            case sp.ATTACHMENT_TYPE.SKINNED_MESH:
                break;
            default:
                continue;
        }

        if (this._node._debugSlots) {
            debugSlotsInfo[i] = slotDebugPoints;
        }

        // update the index buffer
        cc.renderer._increaseBatchingSize(vertCount, cc.renderer.VertexType.TRIANGLE);

        // update the index data
        cachedVertices += vertCount;
        vertexDataOffset += vertCount * 6;
    }

    // render the left vertices
    if (cachedVertices > 0) {
        cc.renderer._batchRendering();
    }

    if (node._debugBones || node._debugSlots) {
        cc.math.glMatrixMode(cc.math.KM_GL_MODELVIEW);
        //cc.math.glPushMatrixWitMat4(this._matrix);
        cc.current_stack.stack.push(cc.current_stack.top);
        cc.current_stack.top = this._matrix;
        var drawingUtil = cc._drawingUtil;

        if (node._debugSlots && debugSlotsInfo && debugSlotsInfo.length > 0) {
            // Slots.
            drawingUtil.setDrawColor(0, 0, 255, 255);
            drawingUtil.setLineWidth(1);

            for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
                var points = debugSlotsInfo[i];
                if (points) {
                    drawingUtil.drawPoly(points, 4, true);
                }
            }
        }

        if (node._debugBones) {
            // Bone lengths.
            var bone;
            drawingUtil.setLineWidth(2);
            drawingUtil.setDrawColor(255, 0, 0, 255);

            for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                var x = bone.data.length * bone.m00 + bone.worldX;
                var y = bone.data.length * bone.m10 + bone.worldY;
                drawingUtil.drawLine(cc.p(bone.worldX, bone.worldY), cc.p(x, y));
            }

            // Bone origins.
            drawingUtil.setPointSize(4);
            drawingUtil.setDrawColor(0, 0, 255, 255); // Root bone is blue.

            for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                drawingUtil.drawPoint(cc.p(bone.worldX, bone.worldY));
                if (i == 0) {
                    drawingUtil.setDrawColor(0, 255, 0, 255);
                }
            }
        }
        cc.math.glPopMatrix();
    }

    return 0;
};

proto._getBlendFunc = function (blendMode, premultiAlpha) {
    var ret = {};
    switch (blendMode) {
        case spine.BlendMode.normal:
            ret.src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            ret.dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case spine.BlendMode.additive:
            ret.src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            ret.dst = cc.macro.ONE;
            break;
        case spine.BlendMode.multiply:
            ret.src = cc.macro.DST_COLOR;
            ret.dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case spine.BlendMode.screen:
            ret.src = cc.macro.ONE;
            ret.dst = cc.macro.ONE_MINUS_SRC_COLOR;
            break;
        default:
            ret = this._node._blendFunc;
            break;
    }

    return ret;
};

proto._createChildFormSkeletonData = function(){};

proto._updateChild = function(){};

proto._uploadRegionAttachmentData = function(attachment, slot, premultipliedAlpha, f32buffer, ui32buffer, vertexDataOffset) {
    var vertices = new Array(8);
    attachment.computeVertices(slot.bone.skeleton.x, slot.bone.skeleton.y, slot.bone, vertices);
    var a = slot.bone.skeleton.a * slot.a * attachment.a * 255;
    var multiplier = premultipliedAlpha ? a : 255;
    var r = slot.bone.skeleton.r * slot.r * attachment.r * multiplier;
    var g = slot.bone.skeleton.g * slot.g * attachment.g * multiplier;
    var b = slot.bone.skeleton.b * slot.b * attachment.b * multiplier;
    var color = ((a<<24) | (b<<16) | (g<<8) | r);

    var offset = vertexDataOffset;
    // generate 6 vertices data (two triangles) from the quad vertices
    // using two angles : (0, 1, 2) & (0, 2, 3)
    for (var i = 0; i < 6; i++) {
        var srcIdx = i < 4 ? i % 3 : i - 2;
        f32buffer[offset] = vertices[srcIdx * 2];
        f32buffer[offset + 1] = vertices[srcIdx * 2 + 1];
        f32buffer[offset + 2] = this._node.vertexZ;
        ui32buffer[offset + 3] = color;
        f32buffer[offset + 4] = attachment.uvs[srcIdx * 2];
        f32buffer[offset + 5] = attachment.uvs[srcIdx * 2 + 1];
        offset += 6;
    }

    if (this._node._debugSlots) {
        // return the quad points info if debug slot enabled
        return [
            cc.p(vertices[0], vertices[1]),
            cc.p(vertices[2], vertices[3]),
            cc.p(vertices[4], vertices[5]),
            cc.p(vertices[6], vertices[7])
        ];
    }
};

proto._uploadMeshAttachmentData = function(attachment, slot, premultipliedAlpha, f32buffer, ui32buffer, vertexDataOffset) {
    var vertices = {};
    attachment.computeWorldVertices(slot.bone.x, slot.bone.y, slot, vertices);
    var r = slot.bone.skeleton.r * slot.r * 255;
    var g = slot.bone.skeleton.g * slot.g * 255;
    var b = slot.bone.skeleton.b * slot.b * 255;
    var normalizedAlpha = slot.bone.skeleton.a * slot.a;
    if (premultipliedAlpha) {
        r *= normalizedAlpha;
        g *= normalizedAlpha;
        b *= normalizedAlpha;
    }
    var a = normalizedAlpha * 255;
    var color = ((a<<24) | (b<<16) | (g<<8) | r);

    var offset = vertexDataOffset;
    for (var i = 0, n = vertices.length / 2; i < n; i++) {
        f32buffer[offset] = vertices[i * 2];
        f32buffer[offset + 1] = vertices[i * 2 + 1];
        f32buffer[offset + 2] = this._node.vertexZ;
        ui32buffer[offset + 3] = color;
        f32buffer[offset + 4] = attachment.uvs[i * 2];
        f32buffer[offset + 5] = attachment.uvs[i * 2 + 1];
        offset += 6;
    }
};
