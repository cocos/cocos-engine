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
    this._rootCtor(renderableObject);
    this._needDraw = true;
    this._matrix = new cc.math.Matrix4();
    this._matrix.identity();
    this._currTexture = null;
    this._currBlendFunc = {};
    this.vertexType = cc.renderer.VertexType.CUSTOM;
    this.setShaderProgram(cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLOR));
};

var proto = sp._SGSkeleton.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = sp._SGSkeleton.WebGLRenderCmd;

proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset){
    var node = this._node;
    var color = this._displayedColor, locSkeleton = node._skeleton;

    var attachment, slot, i, n;
    var premultiAlpha = node._premultipliedAlpha;

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
        if (attachment instanceof spine.RegionAttachment) {
            vertCount = 6; // a quad = two triangles = six vertices
        }
        else if (attachment instanceof spine.MeshAttachment) {
            vertCount = attachment.regionUVs.length / 2;
        }
        else {
            continue;
        }

        // no vertices to render
        if (vertCount === 0) {
            continue;
        }
        var regionTextureAtlas = node.getTextureAtlas(attachment);

        // Broken for changing batch info
        this._currTexture = regionTextureAtlas.texture.getRealTexture();
        var batchBroken = cc.renderer._updateBatchedInfo(this._currTexture, this._getBlendFunc(slot.data.blendMode, premultiAlpha), this._shaderProgram);

        // Broken for vertex data overflow
        if (!batchBroken && vertexDataOffset + vertCount * 6 > f32buffer.length) {
            // render the cached data
            cc.renderer._batchRendering();
            batchBroken = true;
        }
        if (batchBroken) {
            vertexDataOffset = 0;
        }

        // update the vertex buffer
        var slotDebugPoints = null;
        if (attachment instanceof spine.RegionAttachment) {
            slotDebugPoints = this._uploadRegionAttachmentData(attachment, slot, premultiAlpha, f32buffer, ui32buffer, vertexDataOffset);
        }
        else if (attachment instanceof spine.MeshAttachment) {
            this._uploadMeshAttachmentData(attachment, slot, premultiAlpha, f32buffer, ui32buffer, vertexDataOffset);
        }
        else {
            continue;
        }

        if (this._node._debugSlots) {
            debugSlotsInfo[i] = slotDebugPoints;
        }

        // update the index buffer
        if (attachment instanceof spine.RegionAttachment) {
            cc.renderer._increaseBatchingSize(vertCount, cc.renderer.VertexType.TRIANGLE);
        } else {
            cc.renderer._increaseBatchingSize(vertCount, cc.renderer.VertexType.CUSTOM, attachment.triangles);
        }

        // update the index data
        vertexDataOffset += vertCount * 6;
    }

    if (node._debugBones || node._debugSlots) {
        // flush previous vertices
        cc.renderer._batchRendering();

        var wt = this._worldTransform, mat = this._matrix.mat;
        mat[0] = wt.a;
        mat[4] = wt.c;
        mat[12] = wt.tx;
        mat[1] = wt.b;
        mat[5] = wt.d;
        mat[13] = wt.ty;

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
                var x = bone.data.length * bone.a + bone.worldX;
                var y = bone.data.length * bone.c + bone.worldY;
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
    var ret = this._currBlendFunc;
    switch (blendMode) {
        case spine.BlendMode.Normal:
            ret.src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            ret.dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case spine.BlendMode.Additive:
            ret.src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            ret.dst = cc.macro.ONE;
            break;
        case spine.BlendMode.Multiply:
            ret.src = cc.macro.DST_COLOR;
            ret.dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case spine.BlendMode.Screen:
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
    // the vertices in format:
    // [
    //   X1, Y1, C1R, C1G, C1B, C1A, U1, V1,    // bottom left
    //   X2, Y2, C2R, C2G, C2B, C2A, U2, V2,    // top left
    //   X3, Y3, C3R, C3G, C3B, C3A, U3, V3,    // top right
    //   X4, Y4, C4R, C4G, C4B, C4A, U4, V4     // bottom right
    // ]
    //
    var nodeColor = this._displayedColor;
    var nodeR = nodeColor.r,
        nodeG = nodeColor.g,
        nodeB = nodeColor.b,
        nodeA = this._displayedOpacity;
    var vertices = attachment.updateWorldVertices(slot, premultipliedAlpha);
    var wt = this._worldTransform,
        wa = wt.a, wb = wt.b, wc = wt.c, wd = wt.d,
        wx = wt.tx, wy = wt.ty,
        z = this._node.vertexZ;

    var offset = vertexDataOffset;
    // generate 6 vertices data (two triangles) from the quad vertices
    // using two angles : (0, 1, 2) & (0, 2, 3)
    for (var i = 0; i < 6; i++) {
        var srcIdx = i < 4 ? i % 3 : i - 2;
        var vx = vertices[srcIdx * 8],
            vy = vertices[srcIdx * 8 + 1];
        var x = vx * wa + vy * wb + wx,
            y = vx * wc + vy * wd + wy;
        var r = vertices[srcIdx * 8 + 2] * nodeR,
            g = vertices[srcIdx * 8 + 3] * nodeG,
            b = vertices[srcIdx * 8 + 4] * nodeB,
            a = vertices[srcIdx * 8 + 5] * nodeA;
        var color = ((a<<24) | (b<<16) | (g<<8) | r);
        f32buffer[offset] = x;
        f32buffer[offset + 1] = y;
        f32buffer[offset + 2] = z;
        ui32buffer[offset + 3] = color;
        f32buffer[offset + 4] = vertices[srcIdx * 8 + 6];
        f32buffer[offset + 5] = vertices[srcIdx * 8 + 7];
        offset += 6;
    }

    if (this._node._debugSlots) {
        // return the quad points info if debug slot enabled
        var VERTEX = spine.RegionAttachment;
        return [
            cc.p(vertices[VERTEX.X1], vertices[VERTEX.Y1]),
            cc.p(vertices[VERTEX.X2], vertices[VERTEX.Y2]),
            cc.p(vertices[VERTEX.X3], vertices[VERTEX.Y3]),
            cc.p(vertices[VERTEX.X4], vertices[VERTEX.Y4])
        ];
    }
};

proto._uploadMeshAttachmentData = function(attachment, slot, premultipliedAlpha, f32buffer, ui32buffer, vertexDataOffset) {
    var wt = this._worldTransform,
        wa = wt.a, wb = wt.b, wc = wt.c, wd = wt.d,
        wx = wt.tx, wy = wt.ty,
        z = this._node.vertexZ;
    // get the vertex data
    var vertices = attachment.updateWorldVertices(slot, premultipliedAlpha);
    var offset = vertexDataOffset;
    var nodeColor = this._displayedColor;
    var nodeR = nodeColor.r,
        nodeG = nodeColor.g,
        nodeB = nodeColor.b,
        nodeA = this._displayedOpacity;
    for (var i = 0, n = vertices.length; i < n; i += 8) {
        var vx = vertices[i],
            vy = vertices[i + 1];
        var x = vx * wa + vy * wb + wx,
            y = vx * wc + vy * wd + wy;
        var r = vertices[i + 2] * nodeR,
            g = vertices[i + 3] * nodeG,
            b = vertices[i + 4] * nodeB,
            a = vertices[i + 5] * nodeA;
        var color = ((a<<24) | (b<<16) | (g<<8) | r);

        f32buffer[offset] = x;
        f32buffer[offset + 1] = y;
        f32buffer[offset + 2] = z;
        ui32buffer[offset + 3] = color;
        f32buffer[offset + 4] = vertices[i + 6];
        f32buffer[offset + 5] = vertices[i + 7];
        offset += 6;
    }
};