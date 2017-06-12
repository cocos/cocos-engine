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

var EventTarget = require("../event/event-target");

var dataPool = {
    _pool: {},
    _lengths: [],
    put: function (data) {
        var length = data.length;
        if (!this._pool[length]) {
            this._pool[length] = [data];
            this._lengths.push(length);
            this._lengths.sort();
        }
        else {
            this._pool[length].push(data);
        }
    },
    get: function (length) {
        var id;
        for (var i = 0; i < this._lengths.length; i++) {
            if (this._lengths[i] >= length) {
                id = this._lengths[i];
                break;
            }
        }
        if (id) {
            return this._pool[id].pop();
        }
        else {
            return undefined;
        }
    }
};

var macro = cc.macro,
    webgl,
    vl, vb, vt, vr,
    cornerId = [];

/*
 * <p>
 * A 9-slice sprite for cocos2d UI.                                                                    <br/>
 *                                                                                                     <br/>
 * 9-slice scaling allows you to specify how scaling is applied                                        <br/>
 * to specific areas of a sprite. With 9-slice scaling (3x3 grid),                                     <br/>
 * you can ensure that the sprite does not become distorted when                                       <br/>
 * scaled.                                                                                             <br/>
 * @note: it will refactor in v3.1                                                                    <br/>
 * @see http://yannickloriot.com/library/ios/cccontrolextension/Classes/CCScale9Sprite.html            <br/>
 * </p>
 * @class
 * @extends _ccsg.Node
 *
 * @property {Size}  preferredSize   - The preferred size of the 9-slice sprite
 * @property {Rect}  capInsets       - The cap insets of the 9-slice sprite
 * @property {Number}   insetLeft       - The left inset of the 9-slice sprite
 * @property {Number}   insetTop        - The top inset of the 9-slice sprite
 * @property {Number}   insetRight      - The right inset of the 9-slice sprite
 * @property {Number}   insetBottom     - The bottom inset of the 9-slice sprite
 */
var simpleQuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize, isTrimmedContentSize) {
        //build vertices
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            l, b, r, t;
        if (isTrimmedContentSize) {
            l = 0;
            b = 0;
            r = contentSize.width;
            t = contentSize.height;
        } else {
            var originalSize = spriteFrame._originalSize;
            var rect = spriteFrame._rect;
            var offset = spriteFrame._offset;
            var scaleX = contentSize.width / originalSize.width;
            var scaleY = contentSize.height / originalSize.height;
            var trimmLeft = offset.x + (originalSize.width - rect.width) / 2;
            var trimmRight = offset.x - (originalSize.width - rect.width) / 2;
            var trimmedBottom = offset.y + (originalSize.height - rect.height) / 2;
            var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

            l = trimmLeft * scaleX;
            b = trimmedBottom * scaleY;
            r = contentSize.width + trimmRight * scaleX;
            t = contentSize.height + trimmedTop * scaleY;
        }

        if (vertices.length < 8) {
            dataPool.put(vertices);
            vertices = dataPool.get(8) || new Float32Array(8);
            sprite._vertices = vertices;
        }
        // bl, br, tl, tr
        if (webgl) {
            var la = l * wt.a, lb = l * wt.b, ra = r * wt.a, rb = r * wt.b,
                tcx = t * wt.c + wt.tx, tdy = t * wt.d + wt.ty, 
                bcx = b * wt.c + wt.tx, bdy = b * wt.d + wt.ty;
            vertices[0] = la + bcx;
            vertices[1] = lb + bdy;
            vertices[2] = ra + bcx;
            vertices[3] = rb + bdy;
            vertices[4] = la + tcx;
            vertices[5] = lb + tdy;
            vertices[6] = ra + tcx;
            vertices[7] = rb + tdy;
        }
        else {
            vertices[0] = l;
            vertices[1] = b;
            vertices[2] = r;
            vertices[3] = b;
            vertices[4] = l;
            vertices[5] = t;
            vertices[6] = r;
            vertices[7] = t;
        }

        cornerId[0] = 0; // bl
        cornerId[1] = 2; // br
        cornerId[2] = 4; // tl
        cornerId[3] = 6; // tr

        //build uvs
        if (sprite._uvsDirty) {
            this._calculateUVs(sprite, spriteFrame);
        }

        sprite._vertCount = 4;
    },

    _calculateUVs: function (sprite, spriteFrame) {
        var uvs = sprite._uvs;
        var atlasWidth = spriteFrame._texture._pixelWidth;
        var atlasHeight = spriteFrame._texture._pixelHeight;
        var textureRect = spriteFrame._rect;

        if (uvs.length < 8) {
            dataPool.put(uvs);
            uvs = dataPool.get(8) || new Float32Array(8);
            sprite._uvs = uvs;
        }

        //uv computation should take spritesheet into account.
        var l, b, r, t;
        var texelCorrect = macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;

        if (spriteFrame._rotated) {
            l = (textureRect.x + texelCorrect) / atlasWidth;
            b = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;
            r = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;
            t = (textureRect.y + texelCorrect) / atlasHeight;
            uvs[0] = l; uvs[1] = t;
            uvs[2] = l; uvs[3] = b;
            uvs[4] = r; uvs[5] = t;
            uvs[6] = r; uvs[7] = b;
        }
        else {
            l = (textureRect.x + texelCorrect) / atlasWidth;
            b = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;
            r = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;
            t = (textureRect.y + texelCorrect) / atlasHeight;
            uvs[0] = l; uvs[1] = b;
            uvs[2] = r; uvs[3] = b;
            uvs[4] = l; uvs[5] = t;
            uvs[6] = r; uvs[7] = t;
        }
    }
};

var scale9QuadGenerator = {
    x: new Array(4),
    y: new Array(4),
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
        //build vertices
        var vertices = sprite._vertices;
        var wt = sprite._renderCmd._worldTransform;
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        var rect = spriteFrame._rect;

        leftWidth = insetLeft;
        rightWidth = insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;
        topHeight = insetTop;
        bottomHeight = insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        var preferSize = contentSize;
        var sizableWidth = preferSize.width - leftWidth - rightWidth;
        var sizableHeight = preferSize.height - topHeight - bottomHeight;
        var xScale = preferSize.width / (leftWidth + rightWidth);
        var yScale = preferSize.height / (topHeight + bottomHeight);
        xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        var x = this.x;
        var y = this.y;
        x[0] = 0;
        x[1] = leftWidth * xScale;
        x[2] = x[1] + sizableWidth;
        x[3] = preferSize.width;
        y[0] = 0;
        y[1] = bottomHeight * yScale;
        y[2] = y[1] + sizableHeight;
        y[3] = preferSize.height;

        if (vertices.length < 32) {
            dataPool.put(vertices);
            vertices = dataPool.get(32) || new Float32Array(32);
            sprite._vertices = vertices;
        }
        var offset = 0, row, col;
        if (webgl) {
            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    vertices[offset] = x[col] * wt.a + y[row] * wt.c + wt.tx;
                    vertices[offset+1] = x[col] * wt.b + y[row] * wt.d + wt.ty;
                    offset += 2;
                }
            }
        }
        else {
            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    vertices[offset] = x[col];
                    vertices[offset+1] = y[row];
                    offset += 2;
                }
            }
        }

        cornerId[0] = 0;  // bl
        cornerId[1] = 6;  // br
        cornerId[2] = 24; // tl
        cornerId[3] = 30; // tr

        //build uvs
        if (sprite._uvsDirty) {
            this._calculateUVs(sprite, spriteFrame, insetLeft, insetRight, insetTop, insetBottom);
        }
    },

    _calculateUVs: function (sprite, spriteFrame, insetLeft, insetRight, insetTop, insetBottom) {
        var uvs = sprite._uvs;
        var rect = spriteFrame._rect;
        var atlasWidth = spriteFrame._texture._pixelWidth;
        var atlasHeight = spriteFrame._texture._pixelHeight;

        //caculate texture coordinate
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        var textureRect = spriteFrame._rect;

        leftWidth = insetLeft;
        rightWidth = insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;
        topHeight = insetTop;
        bottomHeight = insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        if (uvs.length < 32) {
            dataPool.put(uvs);
            uvs = dataPool.get(32) || new Float32Array(32);
            sprite._uvs = uvs;
        }

        //uv computation should take spritesheet into account.
        var u = this.x;
        var v = this.y;
        var texelCorrect = macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;
        var offset = 0, row, col;

        if (spriteFrame._rotated) {
            u[0] = (textureRect.x + texelCorrect) / atlasWidth;
            u[1] = (bottomHeight + textureRect.x) / atlasWidth;
            u[2] = (bottomHeight + centerHeight + textureRect.x) / atlasWidth;
            u[3] = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;

            v[3] = (textureRect.y + texelCorrect) / atlasHeight;
            v[2] = (leftWidth + textureRect.y) / atlasHeight;
            v[1] = (leftWidth + centerWidth + textureRect.y) / atlasHeight;
            v[0] = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;

            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    uvs[offset] = u[row];
                    uvs[offset+1] = v[3-col];
                    offset += 2;
                }
            }
        }
        else {
            u[0] = (textureRect.x + texelCorrect) / atlasWidth;
            u[1] = (leftWidth + textureRect.x) / atlasWidth;
            u[2] = (leftWidth + centerWidth + textureRect.x) / atlasWidth;
            u[3] = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;

            v[3] = (textureRect.y + texelCorrect) / atlasHeight;
            v[2] = (topHeight + textureRect.y) / atlasHeight;
            v[1] = (topHeight + centerHeight + textureRect.y) / atlasHeight;
            v[0] = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;

            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    uvs[offset] = u[col];
                    uvs[offset+1] = v[row];
                    offset += 2;
                }
            }
        }
    }
};

var tiledQuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize) {
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            uvs = sprite._uvs;
        //build uvs
        var atlasWidth = spriteFrame._texture._pixelWidth;
        var atlasHeight = spriteFrame._texture._pixelHeight;
        var textureRect = spriteFrame._rect;

        //uv computation should take spritesheet into account.
        var u0, v0, u1, v1;
        var texelCorrect = macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;
        if (spriteFrame._rotated) {
            u0 = (textureRect.x + texelCorrect) / atlasWidth;
            u1 = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;
            v0 = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;
            v1 = (textureRect.y + texelCorrect) / atlasHeight;
        }
        else {
            u0 = (textureRect.x + texelCorrect) / atlasWidth;
            u1 = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;
            v0 = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;
            v1 = (textureRect.y + texelCorrect) / atlasHeight;
        }

        //build quads
        var rectWidth = textureRect.width;
        var rectHeight = textureRect.height;
        var hRepeat = contentSize.width / rectWidth;
        var vRepeat = contentSize.height / rectHeight;
        var row = Math.ceil(vRepeat), col = Math.ceil(hRepeat);

        if (row * col > (65536 / 4)) {
            cc.errorID(2625);
        }
        var dataLength = row * col * 4 * 2;
        if (vertices.length < dataLength) {
            dataPool.put(vertices);
            vertices = dataPool.get(dataLength) || new Float32Array(dataLength);
            sprite._vertices = vertices;
        }
        if (uvs.length < dataLength) {
            dataPool.put(uvs);
            uvs = dataPool.get(dataLength) || new Float32Array(dataLength);
            sprite._uvs = uvs;
        }

        var offset = 0, l, b, r, t;
        sprite._vertCount = 0;
        for (var vindex = 0; vindex < row; ++vindex) {
            for (var hindex = 0; hindex < col; ++hindex) {
                l = rectWidth * hindex;
                b = rectHeight * vindex;
                r = rectWidth * Math.min(hindex + 1, hRepeat);
                t = rectHeight * Math.min(vindex + 1, vRepeat);
                // bl.x, bl.y, br.x, br.y, tl.x, tl.y, tr.x, tr.y
                if (webgl) {
                    var la = l * wt.a, lb = l * wt.b, ra = r * wt.a, rb = r * wt.b,
                        tcx = t * wt.c + wt.tx, tdy = t * wt.d + wt.ty, 
                        bcx = b * wt.c + wt.tx, bdy = b * wt.d + wt.ty;
                    vertices[offset] = la + bcx;
                    vertices[offset + 1] = lb + bdy;
                    vertices[offset + 2] = ra + bcx;
                    vertices[offset + 3] = rb + bdy;
                    vertices[offset + 4] = la + tcx;
                    vertices[offset + 5] = lb + tdy;
                    vertices[offset + 6] = ra + tcx;
                    vertices[offset + 7] = rb + tdy;
                }
                else {
                    vertices[offset] = l;
                    vertices[offset + 1] = b;
                    vertices[offset + 2] = r;
                    vertices[offset + 3] = b;
                    vertices[offset + 4] = l;
                    vertices[offset + 5] = t;
                    vertices[offset + 6] = r;
                    vertices[offset + 7] = t;
                }

                if (!spriteFrame._rotated) {
                    uvs[offset] = u0;
                    uvs[offset + 1] = v0;
                    uvs[offset + 2] = r = u0 + (u1 - u0) * Math.min(1, hRepeat - hindex);
                    uvs[offset + 3] = v0;
                    uvs[offset + 4] = u0;
                    uvs[offset + 5] = t = v0 + (v1 - v0) * Math.min(1, vRepeat - vindex);
                    uvs[offset + 6] = r;
                    uvs[offset + 7] = t;
                } else {
                    uvs[offset] = u0;
                    uvs[offset + 1] = v1;
                    uvs[offset + 2] = u0;
                    uvs[offset + 3] = t = v1 + (v0 - v1) * Math.min(1, hRepeat - hindex);
                    uvs[offset + 4] = r = u0 + (u1 - u0) * Math.min(1, vRepeat - vindex);
                    uvs[offset + 5] = v1;
                    uvs[offset + 6] = r;
                    uvs[offset + 7] = t;
                }
                offset += 8;
                sprite._vertCount += 4;
                if (offset > dataLength) return;
            }
        }

        cornerId[0] = 0; // bl
        cornerId[1] = (col-1) * 8 + 2; // br
        cornerId[2] = (row-1) * col * 8 + 4; // tl
        cornerId[3] = dataLength - 2; // tr
    }
};

var fillQuadGeneratorBar = {
    //percentage from 0 to 1;
    _rebuildQuads_base : function (sprite, spriteFrame, contentSize, fillType, fillStart, fillRange) {
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            uvs = sprite._uvs;
        var fillEnd;
        //build vertices
        var l = 0, b = 0,
            r = contentSize.width, t = contentSize.height;
        //build uvs
        var atlasWidth = spriteFrame._texture._pixelWidth;
        var atlasHeight = spriteFrame._texture._pixelHeight;
        var textureRect = spriteFrame._rect;
        //uv computation should take spritesheet into account.
        var ul, vb, ur, vt;
        var texelCorrect = macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;
        if (spriteFrame._rotated) {
            ul = (textureRect.x + texelCorrect) / atlasWidth;
            vb = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;
            ur = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;
            vt = (textureRect.y + texelCorrect) / atlasHeight;
        }
        else {
            ul = (textureRect.x + texelCorrect) / atlasWidth;
            vb = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;
            ur = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;
            vt = (textureRect.y + texelCorrect) / atlasHeight;
        }

        if (vertices.length < 8) {
            dataPool.put(vertices);
            vertices = dataPool.get(8) || new Float32Array(8);
            sprite._vertices = vertices;
        }
        if (uvs.length < 8) {
            dataPool.put(uvs);
            uvs = dataPool.get(8) || new Float32Array(8);
            sprite._uvs = uvs;
        }

        var quadUV = new Array(8);
        if (!spriteFrame._rotated) {
            quadUV[0] = quadUV[4] = ul;
            quadUV[2] = quadUV[6] = ur;
            quadUV[1] = quadUV[3] = vb;
            quadUV[5] = quadUV[7] = vt;
        } else {
            quadUV[0] = quadUV[2] = ul;
            quadUV[4] = quadUV[6] = ur;
            quadUV[3] = quadUV[7] = vb;
            quadUV[1] = quadUV[5] = vt;
        }

        //do clamp
        fillStart = fillStart > 1 ? 1 : fillStart;
        fillStart = fillStart < 0 ? 0 : fillStart;
        fillRange = fillRange < 0 ? 0 : fillRange;
        fillEnd = fillStart + fillRange;
        fillEnd = fillEnd > 1 ? 1 : fillEnd;

        // bl : 0, 1
        // br : 2, 3
        // tl : 4, 5
        // tr : 6, 7
        var progressStart, progressEnd;
        switch (fillType) {
            case FillType.HORIZONTAL:
                progressStart = l + (r - l) * fillStart;
                progressEnd = l + (r - l) * fillEnd;

                l = progressStart;
                r = progressEnd;

                uvs[0] = quadUV[0] + (quadUV[2] - quadUV[0]) * fillStart;
                uvs[1] = quadUV[1];
                uvs[2] = quadUV[0] + (quadUV[2] - quadUV[0]) * fillEnd;
                uvs[3] = quadUV[3];
                uvs[4] = quadUV[4] + (quadUV[6] - quadUV[4]) * fillStart;
                uvs[5] = quadUV[5];
                uvs[6] = quadUV[4] + (quadUV[6] - quadUV[4]) * fillEnd;
                uvs[7] = quadUV[7];
                break;
            case FillType.VERTICAL:
                progressStart = b + (t - b) * fillStart;
                progressEnd = b + (t - b) * fillEnd;

                b = progressStart;
                t = progressEnd;

                uvs[0] = quadUV[0];
                uvs[1] = quadUV[1] + (quadUV[5] - quadUV[1]) * fillStart;
                uvs[2] = quadUV[2];
                uvs[3] = quadUV[3] + (quadUV[7] - quadUV[3]) * fillStart;
                uvs[4] = quadUV[4];
                uvs[5] = quadUV[1] + (quadUV[5] - quadUV[1]) * fillEnd;
                uvs[6] = quadUV[6];
                uvs[7] = quadUV[3] + (quadUV[7] - quadUV[3]) * fillEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }

        //build vertices
        if (webgl) {
            var la = l * wt.a, lb = l * wt.b, ra = r * wt.a, rb = r * wt.b,
                tcx = t * wt.c + wt.tx, tdy = t * wt.d + wt.ty, 
                bcx = b * wt.c + wt.tx, bdy = b * wt.d + wt.ty;
            vertices[0] = la + bcx;
            vertices[1] = lb + bdy;
            vertices[2] = ra + bcx;
            vertices[3] = rb + bdy;
            vertices[4] = la + tcx;
            vertices[5] = lb + tdy;
            vertices[6] = ra + tcx;
            vertices[7] = rb + tdy;
        } else{
            vertices[0] = l;
            vertices[1] = b;
            vertices[2] = r;
            vertices[3] = b;
            vertices[4] = l;
            vertices[5] = t;
            vertices[6] = r;
            vertices[7] = t;
        }

        sprite._vertCount = 4;

        cornerId[0] = 0; // bl
        cornerId[1] = 2; // br
        cornerId[2] = 4; // tl
        cornerId[3] = 6; // tr
    }
};

var fillQuadGeneratorRadial = {
    _vertPos: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _vertices: [cc.v2(0,0),cc.v2(0,0)],
    _uvs: [cc.v2(0,0),cc.v2(0,0)],
    _intersectPoint_1: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _intersectPoint_2: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    outVerts: null,
    outUvs: null,
    rawVerts: null,
    rawUvs: null,

    _rebuildQuads_base : function (sprite, spriteFrame, contentSize, fillCenter, fillStart, fillRange) {
        var vertices = sprite._vertices,
            uvs = sprite._uvs,
            rawVerts = sprite._rawVerts,
            rawUvs = sprite._rawUvs,
            wt = sprite._renderCmd._worldTransform;
        //do round fill start [0,1), include 0, exclude 1
        while (fillStart >= 1.0) fillStart -= 1.0;
        while (fillStart < 0.0) fillStart += 1.0;
        var cx = fillCenter.x * contentSize.width,
            cy = fillCenter.y * contentSize.height;
        var center = cc.v2( cx, cy);

        fillStart *= Math.PI * 2;
        fillRange *= Math.PI * 2;
        var fillEnd = fillStart + fillRange;

        this.outVerts = vertices;
        this.outUvs = uvs;
        this.rawVerts = rawVerts;
        this.rawUvs = rawUvs;

        //build vertices
        this._calculateVertices(wt, spriteFrame, contentSize);
        //build uvs
        this._calculateUVs(spriteFrame);

        var _vertPos = this._vertPos,
            _vertices = this._vertices;

        _vertPos[0].x = _vertPos[3].x = _vertices[0].x;
        _vertPos[1].x = _vertPos[2].x = _vertices[1].x;
        _vertPos[0].y = _vertPos[1].y = _vertices[0].y;
        _vertPos[2].y = _vertPos[3].y = _vertices[1].y;

        //fallback
        //todo remove it if outside is implemented
        if(center.x > _vertices[1].x) {
            center.x = _vertices[1].x;
        }
        if(center.x < _vertices[0].x) {
            center.x = _vertices[0].x;
        }
        if(center.y < _vertices[0].y) {
            center.y = _vertices[0].y;
        }
        if(center.y > _vertices[1].y) {
            center.y = _vertices[1].y;
        }

        rawVerts[0] = rawVerts[4] = this._vertices[0].x;
        rawVerts[2] = rawVerts[6] = this._vertices[1].x;
        rawVerts[1] = rawVerts[3] = this._vertices[0].y;
        rawVerts[5] = rawVerts[7] = this._vertices[1].y;

        if (!spriteFrame._rotated) {
            rawUvs[0] = rawUvs[4] = this._uvs[0].x;
            rawUvs[2] = rawUvs[6] = this._uvs[1].x;
            rawUvs[1] = rawUvs[3] = this._uvs[0].y;
            rawUvs[5] = rawUvs[7] = this._uvs[1].y;
        } else {
            rawUvs[0] = rawUvs[2] = this._uvs[0].x;
            rawUvs[4] = rawUvs[6] = this._uvs[1].x;
            rawUvs[3] = rawUvs[7] = this._uvs[0].y;
            rawUvs[1] = rawUvs[5] = this._uvs[1].y;
        }

        var triangles = [null, null, null, null];
        if(center.x !== this._vertices[0].x) {
            triangles[0] = [3, 0];
        }
        if(center.x !== this._vertices[1].x) {
            triangles[2] = [1, 2];
        }
        if(center.y !== this._vertices[0].y) {
            triangles[1] = [0, 1];
        }
        if(center.y !== this._vertices[1].y) {
            triangles[3] = [2, 3];
        }

        this._getInsectedPoints(this._vertices[0].x, this._vertices[1].x, this._vertices[0].y, this._vertices[1].y, center, fillStart, this._intersectPoint_1);
        this._getInsectedPoints(this._vertices[0].x, this._vertices[1].x, this._vertices[0].y, this._vertices[1].y, center, fillStart + fillRange, this._intersectPoint_2);

        var dataLength = 3 * 5 * 2;
        if (vertices.length < dataLength) {
            dataPool.put(vertices);
            vertices = dataPool.get(dataLength) || new Float32Array(dataLength);
            this.outVerts = sprite._vertices = vertices;
        }
        if (uvs.length < dataLength) {
            dataPool.put(uvs);
            uvs = dataPool.get(dataLength) || new Float32Array(dataLength);
            this.outUvs = sprite._uvs = uvs;
        }

        var offset = 0, count = 0;
        for(var triangleIndex = 0; triangleIndex < 4; ++triangleIndex) {
            var triangle = triangles[triangleIndex];
            if(triangle === null) {
                continue;
            }
            //all in
            if(fillRange >= Math.PI * 2) {
                this._generateTriangle(wt, offset, center, this._vertPos[triangle[0]], this._vertPos[triangle[1]]);
                offset += 6;
                count += 3;
                continue;
            }
            //test against
            var startAngle = this._getVertAngle(center, this._vertPos[triangle[0]]);
            var endAngle = this._getVertAngle(center, this._vertPos[triangle[1]]);
            if(endAngle < startAngle) endAngle += Math.PI * 2;
            startAngle -= Math.PI * 2;
            endAngle -= Math.PI * 2;
            //testing
            for(var testIndex = 0; testIndex < 3; ++testIndex) {
                if(startAngle >= fillEnd) {
                    //all out
                } else if (startAngle >= fillStart) {
                    if(endAngle >= fillEnd) {
                        //startAngle to fillEnd
                        this._generateTriangle(wt, offset, center, this._vertPos[triangle[0]], this._intersectPoint_2[triangleIndex]);
                    } else {
                        //startAngle to endAngle
                        this._generateTriangle(wt, offset, center, this._vertPos[triangle[0]], this._vertPos[triangle[1]]);
                    }
                    offset += 6;
                    count += 3;
                } else {
                    //startAngle < fillStart
                    if(endAngle <= fillStart) {
                        //all out
                    } else if(endAngle <= fillEnd) {
                        //fillStart to endAngle
                        this._generateTriangle(wt, offset, center, this._intersectPoint_1[triangleIndex], this._vertPos[triangle[1]]);
                        offset += 6;
                        count += 3;
                    } else {
                        //fillStart to fillEnd
                        this._generateTriangle(wt, offset, center, this._intersectPoint_1[triangleIndex], this._intersectPoint_2[triangleIndex]);
                        offset += 6;
                        count += 3;
                    }
                }
                //add 2 * PI
                startAngle += Math.PI * 2;
                endAngle += Math.PI * 2;
            }
        }
        sprite._vertCount = count;

        cornerId[0] = 0; // bl
        cornerId[1] = 2; // br
        cornerId[2] = 4; // tl
        cornerId[3] = 6; // tr
    },

    _generateTriangle: function(wt, offset, vert0, vert1, vert2) {
        var rawVerts = this.rawVerts;
        var rawUvs = this.rawUvs;
        var vertices = this.outVerts;
        var v0x = rawVerts[0];
        var v0y = rawVerts[1];
        var v1x = rawVerts[6];
        var v1y = rawVerts[7];
        var progressX, progressY;
        // tl: 0, 1
        // bl: 2, 3
        // tr: 4, 5
        if(webgl) {
            vertices[offset]  = vert0.x * wt.a + vert0.y * wt.c + wt.tx;
            vertices[offset+1]  = vert0.x * wt.b + vert0.y * wt.d + wt.ty;
            vertices[offset+2]  = vert1.x * wt.a + vert1.y * wt.c + wt.tx;
            vertices[offset+3]  = vert1.x * wt.b + vert1.y * wt.d + wt.ty;
            vertices[offset+4]  = vert2.x * wt.a + vert2.y * wt.c + wt.tx;
            vertices[offset+5]  = vert2.x * wt.b + vert2.y * wt.d + wt.ty;

        } else {
            vertices[offset]  = vert0.x;
            vertices[offset+1]  = vert0.y;
            vertices[offset+2]  = vert1.x;
            vertices[offset+3]  = vert1.y;
            vertices[offset+4]  = vert2.x;
            vertices[offset+5]  = vert2.y;
        }

        progressX = (vert0.x - v0x) / (v1x - v0x);
        progressY = (vert0.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, rawUvs, offset);

        progressX = (vert1.x - v0x) / (v1x - v0x);
        progressY = (vert1.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, rawUvs, offset + 2);

        progressX = (vert2.x - v0x) / (v1x - v0x);
        progressY = (vert2.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, rawUvs, offset + 4);
    },

    _generateUV : function(progressX, progressY, uvs, offset) {
        var out = this.outUvs;
        var px1 = uvs[0] + (uvs[2] - uvs[0]) * progressX;
        var px2 = uvs[4] + (uvs[6] - uvs[4]) * progressX;
        var py1 = uvs[1] + (uvs[3] - uvs[1]) * progressX;
        var py2 = uvs[5] + (uvs[7] - uvs[5]) * progressX;
        out[offset] = px1 + (px2 - px1) * progressY;
        out[offset+1] = py1 + (py2 - py1) * progressY;
    },

    _isAngleIn : function(angle, start, rangeAngle) {
        var pi_2 = Math.PI * 2;
        while(angle < start || angle >= start + pi_2) {
            if(angle < start) {
                angle += pi_2;
            }
            if(angle >= start + pi_2) {
                angle -= pi_2;
            }
        }

        return angle <= start + rangeAngle;
    },

    //[0,PI * 2)
    _getVertAngle: function(start, end) {
        var placementX, placementY;
        placementX = end.x - start.x;
        placementY = end.y - start.y;

        if(placementX === 0 && placementY === 0) {
            return undefined;
        } else if(placementX === 0) {
            if(placementY > 0) {
                return Math.PI * 0.5;
            } else {
                return Math.PI * 1.5;
            }
        } else {
            var angle = Math.atan(placementY / placementX);
            if(placementX < 0) {
                angle += Math.PI;
            }

            return angle;
        }
    },

    _getInsectedPoints: function(left, right, bottom, top, center, angle, intersectPoints) {
        //left bottom, right, top
        var result = [null, null, null, null];
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);
        var tanAngle,cotAngle;
        if(Math.cos(angle) !== 0) {
            tanAngle = sinAngle / cosAngle;
            //calculate right and left
            if((left - center.x) * cosAngle > 0) {
                var yleft = center.y + tanAngle * (left - center.x);
                intersectPoints[0].x = left;
                intersectPoints[0].y = yleft;
            }
            if((right - center.x) * cosAngle > 0) {
                var yright = center.y + tanAngle * (right - center.x);

                intersectPoints[2].x = right;
                intersectPoints[2].y = yright;
            }

        }

        if(Math.sin(angle) !== 0) {
            cotAngle = cosAngle / sinAngle;
            //calculate  top and bottom
            if((top - center.y) * sinAngle > 0) {
                var xtop = center.x  + cotAngle * (top-center.y);
                intersectPoints[3].x = xtop;
                intersectPoints[3].y = top;
            }
            if((bottom - center.y) * sinAngle > 0) {
                var xbottom = center.x  + cotAngle * (bottom-center.y);
                intersectPoints[1].x = xbottom;
                intersectPoints[1].y = bottom;
            }

        }
        return result;
    },

    _calculateVertices : function (wt, spriteFrame, contentSize) {
        var x0, x3, y0, y3;
        x0 = 0;
        y0 = 0;
        x3 = contentSize.width;
        y3 = contentSize.height;

        this._vertices[0].x = x0;
        this._vertices[0].y = y0;
        this._vertices[1].x = x3;
        this._vertices[1].y = y3;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture._pixelWidth;
        var atlasHeight = spriteFrame._texture._pixelHeight;
        var textureRect = spriteFrame._rect;

        //uv computation should take spritesheet into account.
        var u0, u3, v0, v3;
        var texelCorrect = macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;

        if (spriteFrame._rotated) {
            u0 = (textureRect.x + texelCorrect) / atlasWidth;
            u3 = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;

            v0 = (textureRect.y + texelCorrect) / atlasHeight;
            v3 = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;
        }
        else {
            u0 = (textureRect.x + texelCorrect) / atlasWidth;
            u3 = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;

            v0 = (textureRect.y + texelCorrect) / atlasHeight;
            v3 = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;
        }

        this._uvs[0].x = u0;
        this._uvs[0].y = v3;
        this._uvs[1].x = u3;
        this._uvs[1].y = v0;
    }
};

var meshQuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, polygonInfo) {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            return;
        }

        if (!polygonInfo) {
            return;
        }

        var wt = sprite._renderCmd._worldTransform;
        var srcVerts = polygonInfo.triangles.verts;
        var vertices = sprite._vertices;
        var uvs = sprite._uvs;
        var count = srcVerts.length;

        var dataLength = count * 2;
        if (vertices.length < dataLength) {
            dataPool.put(vertices);
            vertices = dataPool.get(dataLength) || new Float32Array(dataLength);
            sprite._vertices = vertices;
        }
        if (uvs.length < dataLength) {
            dataPool.put(uvs);
            uvs = dataPool.get(dataLength) || new Float32Array(dataLength);
            sprite._uvs = uvs;
        }

        var l = Infinity, b = Infinity,
            r = -Infinity, t = -Infinity;
        for (var i = 0; i < count; i++) {
            var x = srcVerts[i].x * wt.a + srcVerts[i].y * wt.c + wt.tx;
            var y = srcVerts[i].x * wt.b + srcVerts[i].y * wt.d + wt.ty;
            vertices[i * 2] = x;
            vertices[i * 2 + 1] = y;
            uvs[i * 2] = srcVerts[i].u;
            uvs[i * 2 + 1] = srcVerts[i].v;

            if (x < l) {
                l = x;
                cornerId[0] = i * 2; // left
            }

            if (x > r) {
                r = x;
                cornerId[1] = i * 2; // right
            }

            if (y < b) {
                b = y;
                cornerId[2] = i * 2; // bottom
            }

            if (y > t) {
                t = y;
                cornerId[3] = i * 2; // top
            }
        }

        sprite._vertCount = count;
    }
};

cc.Scale9Sprite = _ccsg.Node.extend({
    //resource data, could be async loaded.
    _spriteFrame: null,

    //scale 9 data
    _insetLeft: 0,
    _insetRight: 0,
    _insetTop: 0,
    _insetBottom: 0,
    //blend function
    _blendFunc: null,
    //sliced or simple
    _renderingType: 1,
    //bright or not
    _brightState: 0,
    //rendering quads shared by canvas and webgl
    _rawVerts: null,
    _rawUvs: null,
    _vertices: null,
    _uvs: null,
    _vertCount: 0,
    _quadsDirty: true,
    _uvsDirty: true,
    _isTriangle: false,
    _isTrimmedContentSize: true,
    //fill type
    _fillType: 0,
    //for fill radial
    _fillCenter: null,
    //normalized filled start and range
    _fillStart: 0,
    _fillRange: Math.PI * 2,
    _distortionOffset: null,
    _distortionTiling: null,
    _meshPolygonInfo: null,

    ctor: function (textureOrSpriteFrame) {
        _ccsg.Node.prototype.ctor.call(this);
        this._renderCmd.setState(this._brightState);
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
        this._fillCenter = cc.v2(0,0);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        // Init vertex data for simple
        this._rawVerts = null;
        this._rawUvs = null;
        this._vertices = dataPool.get(8) || new Float32Array(8);
        this._uvs = dataPool.get(8) || new Float32Array(8);
        // Init sprite frame
        if (typeof textureOrSpriteFrame === 'string' || textureOrSpriteFrame instanceof cc.Texture2D) {
            this.initWithTexture(textureOrSpriteFrame);
        }
        else if (textureOrSpriteFrame instanceof cc.SpriteFrame) {
            this.initWithSpriteFrame(textureOrSpriteFrame);
        }

        if (webgl === undefined) {
            webgl = cc._renderType === cc.game.RENDER_TYPE_WEBGL;
        }
    },

    loaded: function () {
        if (this._spriteFrame === null) {
            return false;
        } else {
            return this._spriteFrame.textureLoaded();
        }
    },

    /**
     * Initializes a 9-slice sprite with a texture file
     *
     * @param textureOrTextureFile The name of the texture file.
     */
    initWithTexture: function (textureOrTextureFile) {
        this.setTexture(textureOrTextureFile);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame
     * @param spriteFrameOrSFName The sprite frame object.
     */
    initWithSpriteFrame: function (spriteFrameOrSFName) {
        this.setSpriteFrame(spriteFrameOrSFName);
    },

    /**
     * Change the texture file of 9 slice sprite
     *
     * @param textureOrTextureFile The name of the texture file.
     */
    setTexture: function (textureOrTextureFile) {
        var spriteFrame = new cc.SpriteFrame(textureOrTextureFile);
        this.setSpriteFrame(spriteFrame);
    },

    /**
     * Change the sprite frame of 9 slice sprite
     *
     * @param spriteFrame The SpriteFrame object.
     */
    setSpriteFrame: function (spriteFrame) {
        if (spriteFrame) {
            this._spriteFrame = spriteFrame;
            this._quadsDirty = true;
            this._uvsDirty = true;
            this._renderCmd._needDraw = false;
            var self = this;
            var onResourceDataLoaded = function () {
                if (cc.sizeEqualToSize(self._contentSize, cc.size(0, 0))) {
                    self.setContentSize(self._spriteFrame._rect);
                }
                self._renderCmd._needDraw = true;
                self._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
            };
            if (spriteFrame.textureLoaded()) {
                onResourceDataLoaded();
            } else {
                spriteFrame.once('load', onResourceDataLoaded, this);
            }
        }
    },

    /**
     * Sets the source blending function.
     *
     * @param blendFunc A structure with source and destination factor to specify pixel arithmetic. e.g. {GL_ONE, GL_ONE}, {GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA}.
     */
    setBlendFunc: function (blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src || cc.macro.BLEND_SRC;
            this._blendFunc.dst = blendFunc.dst || cc.macro.BLEND_DST;
        }
        else {
            this._blendFunc.src = blendFunc || cc.macro.BLEND_SRC;
            this._blendFunc.dst = dst || cc.macro.BLEND_DST;
        }
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    /**
     * Returns the blending function that is currently being used.
     *
     * @return A BlendFunc structure with source and destination factor which specified pixel arithmetic.
     */
    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
    },

    // overrides
    setContentSize: function (width, height) {
        if (height === undefined) {
            height = width.height;
            width = width.width;
        }
        if (width === this._contentSize.width && height === this._contentSize.height) {
            return;
        }

        _ccsg.Node.prototype.setContentSize.call(this, width, height);
        this._quadsDirty = true;
    },

    //
    enableTrimmedContentSize: function (isTrimmed) {
        if (this._isTrimmedContentSize !== isTrimmed) {
            this._isTrimmedContentSize = isTrimmed;
            this._quadsDirty = true;
            this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
        }
    },

    isTrimmedContentSizeEnabled: function () {
        return this._isTrimmedContentSize;
    },
    /**
     * Change the state of 9-slice sprite.
     * @see `State`
     * @param state A enum value in State.
     */
    setState: function (state) {
        this._brightState = state;
        this._renderCmd.setState(state);
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    /**
     * Query the current bright state.
     * @return @see `State`
     */
    getState: function () {
        return this._brightState;
    },

    /**
     * change the rendering type, could be simple or slice
     * @return @see `RenderingType`
     */
    setRenderingType: function (type) {
        if (this._renderingType === type) return;
        this._renderingType = type;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },
    /**
     * get the rendering type, could be simple or slice
     * @return @see `RenderingType`
     */
    getRenderingType: function () {
        return this._renderingType;
    },
    /**
     * change the left border of 9 slice sprite, it should be specified before trimmed.
     * @param insetLeft left border.
     */
    setInsetLeft: function (insetLeft) {
        this._insetLeft = insetLeft;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },
    /**
     * get the left border of 9 slice sprite, the result is specified before trimmed.
     * @return left border.
     */
    getInsetLeft: function () {
        return this._insetLeft;
    },
    /**
     * change the top border of 9 slice sprite, it should be specified before trimmed.
     * @param insetTop top border.
     */
    setInsetTop: function (insetTop) {
        this._insetTop = insetTop;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    /**
     * get the top border of 9 slice sprite, the result is specified before trimmed.
     * @return top border.
     */
    getInsetTop: function () {
        return this._insetTop;
    },

    /**
     * change the right border of 9 slice sprite, it should be specified before trimmed.
     * @param insetRight right border.
     */
    setInsetRight: function (insetRight) {
        this._insetRight = insetRight;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    /**
     * get the right border of 9 slice sprite, the result is specified before trimmed.
     * @return right border.
     */
    getInsetRight: function () {
        return this._insetRight;
    },

    /**
     * change the bottom border of 9 slice sprite, it should be specified before trimmed.
     * @param insetBottom bottom border.
     */
    setInsetBottom: function (insetBottom) {
        this._insetBottom = insetBottom;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },
    /**
     * get the bottom border of 9 slice sprite, the result is specified before trimmed.
     * @return bottom border.
     */
    getInsetBottom: function () {
        return this._insetBottom;
    },

    setFillType: function(value) {
        if(this._fillType === value)
            return;
        this._fillType = value;
        if(this._renderingType === RenderingType.FILLED) {
            this._quadsDirty = true;
            this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
        }
    },

    getFillType: function() {
        return this._fillType;
    },

    setFillCenter: function(value, y) {
        this._fillCenter = cc.v2(value,y);
        if(this._renderingType === RenderingType.FILLED && this._fillType === FillType.RADIAL) {
            this._quadsDirty = true;
            this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
        }
    },

    setDistortionTiling: function(valueOrX, y) {
        if(y === undefined) {
            y = valueOrX.y;
            valueOrX = valueOrX.x;
        }
        this._distortionTiling = this._distortionTiling || cc.v2(0,0);
        this._distortionTiling.x = valueOrX;
        this._distortionTiling.y = y;
    },

    setDistortionOffset: function(valueOrX, y) {
        if(y === undefined) {
            y = valueOrX.y;
            valueOrX = valueOrX.x;
        }
        this._distortionOffset = this._distortionOffset || cc.v2(0,0);
        this._distortionOffset.x = valueOrX;
        this._distortionOffset.y = y;
    },

    getFillCenter: function() {
        return cc.v2(this._fillCenter);
    },

    setFillStart: function(value) {
        if(this._fillStart === value)
            return;
        this._fillStart = value;
        if(this._renderingType === RenderingType.FILLED) {
            this._quadsDirty = true;
            this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
        }
    },

    getFillStart: function() {
        return this._fillStart;
    },

    setFillRange: function(value) {
        if(this._fillRange === value)
            return;
        this._fillRange = value;
        if(this._renderingType === RenderingType.FILLED ) {
            this._quadsDirty = true;
            this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
        }
    },

    getFillRange: function() {
        return this._fillRange;
    },

    _rebuildQuads: function () {
        if (!this._spriteFrame || !this._spriteFrame._textureLoaded) {
            this._renderCmd._needDraw = false;
            return;
        }
        this._isTriangle = false;
        switch (this._renderingType) {
        case RenderingType.SIMPLE:
            simpleQuadGenerator._rebuildQuads_base(this, this._spriteFrame, this._contentSize, this._isTrimmedContentSize);
            break;
        case RenderingType.SLICED:
            scale9QuadGenerator._rebuildQuads_base(this, this._spriteFrame, this._contentSize, this._insetLeft, this._insetRight, this._insetTop, this._insetBottom);
            break;
        case RenderingType.TILED:
            tiledQuadGenerator._rebuildQuads_base(this, this._spriteFrame, this._contentSize);
            break;
        case RenderingType.FILLED:
            var fillstart = this._fillStart;
            var fillRange = this._fillRange;
            if(fillRange < 0) {
                fillstart += fillRange;
                fillRange = -fillRange;
            }
            if (this._fillType !== FillType.RADIAL) {
                fillRange = fillstart + fillRange;
                fillstart = fillstart > 1.0 ? 1.0 : fillstart;
                fillstart = fillstart < 0.0 ? 0.0 : fillstart;

                fillRange = fillRange > 1.0 ? 1.0 : fillRange;
                fillRange = fillRange < 0.0 ? 0.0 : fillRange;
                fillRange = fillRange - fillstart;
                fillQuadGeneratorBar._rebuildQuads_base(this, this._spriteFrame, this._contentSize, this._fillType, fillstart, fillRange);
            } else {
                this._isTriangle = true;
                if (!this._rawVerts) {
                    this._rawVerts = dataPool.get(8) || new Float32Array(8);
                    this._rawUvs = dataPool.get(8) || new Float32Array(8);
                }
                fillQuadGeneratorRadial._rebuildQuads_base(this, this._spriteFrame, this._contentSize, this._fillCenter,fillstart, fillRange);
            }
            break;
        case RenderingType.MESH:
            meshQuadGenerator._rebuildQuads_base(this, this._spriteFrame, this._meshPolygonInfo);
            break;
        default:
            this._quadsDirty = false;
            this._uvsDirty = false;
            this._renderCmd._needDraw = false;
            cc.errorID(2627);
            return;
        }

        var rect = cc.visibleRect;
        if (webgl && this._renderCmd._cameraFlag > 0) {
            rect = cc.Camera.main.visibleRect;
        }

        vl = rect.left.x;
        vr = rect.right.x;
        vt = rect.top.y;
        vb = rect.bottom.y;

        // Culling
        if (webgl) {
            // x1, y1  leftBottom
            // x2, y2  rightBottom
            // x3, y3  leftTop
            // x4, y4  rightTop
            var vert = this._isTriangle ? this._rawVerts : this._vertices,
                x0 = vert[cornerId[0]], x1 = vert[cornerId[1]], x2 = vert[cornerId[2]], x3 = vert[cornerId[3]],
                y0 = vert[cornerId[0] + 1], y1 = vert[cornerId[1] + 1], y2 = vert[cornerId[2] + 1], y3 = vert[cornerId[3] + 1];
            if (((x0-vl) & (x1-vl) & (x2-vl) & (x3-vl)) >> 31 || // All outside left
                ((vr-x0) & (vr-x1) & (vr-x2) & (vr-x3)) >> 31 || // All outside right
                ((y0-vb) & (y1-vb) & (y2-vb) & (y3-vb)) >> 31 || // All outside bottom
                ((vt-y0) & (vt-y1) & (vt-y2) & (vt-y3)) >> 31)   // All outside top
            {
                this._renderCmd._needDraw = false;
            }
            else {
                this._renderCmd._needDraw = true;
            }
        }
        else {
            var bb = this._renderCmd._currentRegion,
                l = bb._minX, r = bb._maxX, b = bb._minY, t = bb._maxY;
            if (r < vl || l > vr || t < vb || b > vt) {
                this._renderCmd._needDraw = false;
            }
            else {
                this._renderCmd._needDraw = true;
            }
        }

        this._quadsDirty = false;
        this._uvsDirty = false;
    },
    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new cc.Scale9Sprite.WebGLRenderCmd(this);
    },

    setMeshPolygonInfo: function (polygonInfo) {
        /**
         * polygonInfo in format:
         * {
         *     triangles: {
         *         verts: displayVertices,
         *         indices: vertexIndices
         *     },
         *     rect: boundsRect
         * }
         */
        this.setRenderingType(RenderingType.MESH);
        this._meshPolygonInfo = polygonInfo;
        this._quadsDirty = true;
        this._uvsDirty = true;
    },

    getMeshPolygonInfo: function () {
        return this._meshPolygonInfo;
    }
});

var _p = cc.Scale9Sprite.prototype;
cc.js.addon(_p, EventTarget.prototype);
// Extended properties
cc.defineGetterSetter(_p, 'insetLeft', _p.getInsetLeft, _p.setInsetLeft);
cc.defineGetterSetter(_p, 'insetTop', _p.getInsetTop, _p.setInsetTop);
cc.defineGetterSetter(_p, 'insetRight', _p.getInsetRight, _p.setInsetRight);
cc.defineGetterSetter(_p, 'insetBottom', _p.getInsetBottom, _p.setInsetBottom);

cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1, DISTORTION: 2};

/**
 * Enum for sprite type
 * @enum SpriteType
 */
var RenderingType = cc.Scale9Sprite.RenderingType = cc.Enum({
    /**
     * @property {Number} SIMPLE
     */
    SIMPLE: 0,
    /**
     * @property {Number} SLICED
     */
    SLICED: 1,
    /*
     * @property {Number} TILED
     */
    TILED: 2,
    /*
     * @property {Number} FILLED
     */
    FILLED: 3,
    /*
     * @property {Number} MESH
     */
    MESH: 4
});

var FillType = cc.Scale9Sprite.FillType = cc.Enum({
    HORIZONTAL: 0,
    VERTICAL: 1,
    RADIAL:2,
});
