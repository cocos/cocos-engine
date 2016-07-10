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

var EventTarget = require("../cocos2d/core/event/event-target");

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
 * @property {cc.Size}  preferredSize   - The preferred size of the 9-slice sprite
 * @property {cc.Rect}  capInsets       - The cap insets of the 9-slice sprite
 * @property {Number}   insetLeft       - The left inset of the 9-slice sprite
 * @property {Number}   insetTop        - The top inset of the 9-slice sprite
 * @property {Number}   insetRight      - The right inset of the 9-slice sprite
 * @property {Number}   insetBottom     - The bottom inset of the 9-slice sprite
 */
var simpleQuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize, isTrimmedContentSize) {
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            uvs = sprite._uvs;
        //build vertices
        this._calculateVertices(vertices, wt, spriteFrame, contentSize, isTrimmedContentSize);
        //build uvs
        this._calculateUVs(uvs, spriteFrame);
        sprite._vertCount = 4;
    },

    _calculateVertices: function (vertices, wt, spriteFrame, contentSize, isTrimmedContentSize) {
        var l, b, r, t;
        if (isTrimmedContentSize) {
            l = 0;
            b = 0;
            r = contentSize.width;
            t = contentSize.height;
        } else {
            var originalSize = spriteFrame.getOriginalSize();
            var rect = spriteFrame._rect;
            var offset = spriteFrame.getOffset();
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
        }
        // bl, br, tl, tr
        vertices[0] = l * wt.a + b * wt.c + wt.tx;
        vertices[1] = l * wt.b + b * wt.d + wt.ty;
        vertices[2] = r * wt.a + b * wt.c + wt.tx;
        vertices[3] = r * wt.b + b * wt.d + wt.ty;
        vertices[4] = l * wt.a + t * wt.c + wt.tx;
        vertices[5] = l * wt.b + t * wt.d + wt.ty;
        vertices[6] = r * wt.a + t * wt.c + wt.tx;
        vertices[7] = r * wt.b + t * wt.d + wt.ty;
    },

    _calculateUVs: function (uvs, spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();
        var textureRect = spriteFrame._rect;

        //uv computation should take spritesheet into account.
        var l, b, r, t;

        if (spriteFrame._rotated) {
            l = textureRect.x / atlasWidth;
            b = (textureRect.y + textureRect.width) / atlasHeight;
            r = (textureRect.x + textureRect.height) / atlasWidth;
            t = textureRect.y / atlasHeight;
        }
        else {
            l = textureRect.x / atlasWidth;
            b = (textureRect.y + textureRect.height) / atlasHeight;
            r = (textureRect.x + textureRect.width) / atlasWidth;
            t = textureRect.y / atlasHeight;
        }

        if (uvs.length < 8) {
            dataPool.put(uvs);
            uvs = dataPool.get(8) || new Float32Array(8);
        }
        uvs[0] = l; uvs[1] = b;
        uvs[2] = r; uvs[3] = b;
        uvs[4] = l; uvs[5] = t;
        uvs[6] = r; uvs[7] = t;
    }
};

var scale9QuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            uvs = sprite._uvs;
        //build vertices
        this._calculateVertices(vertices, wt, spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom);
        //build uvs
        this._calculateUVs(uvs, spriteFrame, insetLeft, insetRight, insetTop, insetBottom);
    },

    _calculateVertices: function (vertices, wt, spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
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
        xScale = xScale > 1 ? 1 : xScale;
        yScale = yScale > 1 ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        var x = new Array(4);
        var y = new Array(4);
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
        }
        var offset = 0;
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                vertices[offset] = x[col] * wt.a + y[row] * wt.c + wt.tx;
                vertices[offset+1] = x[col] * wt.b + y[row] * wt.d + wt.ty;
                offset += 2;
            }
        }
    },

    _calculateUVs: function (uvs, spriteFrame, insetLeft, insetRight, insetTop, insetBottom) {
        var rect = spriteFrame._rect;
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        //caculate texture coordinate
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        leftWidth = insetLeft;
        rightWidth = insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;

        topHeight = insetTop;
        bottomHeight = insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;
        var textureRect = spriteFrame._rect;

        //uv computation should take spritesheet into account.
        var u0, u1, u2, u3;
        var v0, v1, v2, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u1 = (bottomHeight + textureRect.x) / atlasWidth;
            u2 = (bottomHeight + centerHeight + textureRect.x) / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v1 = (leftWidth + textureRect.y) / atlasHeight;
            v2 = (leftWidth + centerWidth + textureRect.y) / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u1 = (leftWidth + textureRect.x) / atlasWidth;
            u2 = (leftWidth + centerWidth + textureRect.x) / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v1 = (topHeight + textureRect.y) / atlasHeight;
            v2 = (topHeight + centerHeight + textureRect.y) / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        if (uvs.length < 8) {
            dataPool.put(uvs);
            uvs = dataPool.get(8) || new Float32Array(8);
        }
        uvs[0] = u0; uvs[1] = v3;
        uvs[2] = u1; uvs[3] = v2;
        uvs[4] = u2; uvs[5] = v1;
        uvs[6] = u3; uvs[7] = v0;
    }
};

var tiledQuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize) {
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            uvs = sprite._uvs;
        //build uvs
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();
        var textureRect = spriteFrame._rect;

        //uv computation should take spritesheet into account.
        var u0, v0, u1, v1;
        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u1 = (textureRect.x + textureRect.height) / atlasWidth;
            v0 = textureRect.y / atlasHeight;
            v1 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u1 = (textureRect.x + textureRect.width) / atlasWidth;
            v0 = textureRect.y / atlasHeight;
            v1 = (textureRect.y + textureRect.height) / atlasHeight;
        }
        
        //build quads
        var rectWidth = textureRect.width;
        var rectHeight = textureRect.height;
        var hRepeat = contentSize.width / rectWidth;
        var vRepeat = contentSize.height / rectHeight;
        var row = Math.ceil(vRepeat), col = Math.ceil(hRepeat);

        if (row * col > (65536 / 4)) {
            cc.error('too many tiles, only 16384 tiles will be show');
        }
        var dataLength = row * col * 4 * 2;
        if (vertices.length < dataLength) {
            dataPool.put(vertices);
            vertices = dataPool.get(dataLength) || new Float32Array(dataLength);
        }
        if (uvs.length < dataLength) {
            dataPool.put(uvs);
            uvs = dataPool.get(dataLength) || new Float32Array(dataLength);
        }

        var offset, l, b, r, t;
        sprite._vertCount = 0;
        for (var vindex = 0; vindex < row; ++vindex) {
            for (var hindex = 0; hindex < col; ++hindex) {
                l = rectWidth * hindex;
                b = rectHeight * vindex;
                r = rectWidth * Math.min(hindex + 1, hRepeat);
                t = rectHeight * Math.min(vindex + 1, vRepeat);
                // bl.x, bl.y, br.x, br.y, tl.x, tl.y, tr.x, tr.y
                vertices[offset] = l * wt.a + b * wt.c + wt.tx;
                vertices[offset + 1] = l * wt.b + b * wt.d + wt.ty;
                vertices[offset + 2] = r * wt.a + b * wt.c + wt.tx;
                vertices[offset + 3] = r * wt.b + b * wt.d + wt.ty;
                vertices[offset + 4] = l * wt.a + t * wt.c + wt.tx;
                vertices[offset + 5] = l * wt.b + t * wt.d + wt.ty;
                vertices[offset + 6] = r * wt.a + t * wt.c + wt.tx;
                vertices[offset + 7] = r * wt.b + t * wt.d + wt.ty;

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
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();
        var textureRect = spriteFrame._rect;
        //uv computation should take spritesheet into account.
        var ul, vb, ur, vt;
        if (spriteFrame._rotated) {
            ul = textureRect.x / atlasWidth;
            vb = (textureRect.y + textureRect.width) / atlasHeight;
            ur = (textureRect.x + textureRect.height) / atlasWidth;
            vt = textureRect.y / atlasHeight;
        }
        else {
            ul = textureRect.x / atlasWidth;
            vb = (textureRect.y + textureRect.height) / atlasHeight;
            ur = (textureRect.x + textureRect.width) / atlasWidth;
            vt = textureRect.y / atlasHeight;
        }

        if (vertices.length < 8) {
            dataPool.put(vertices);
            vertices = dataPool.get(8) || new Float32Array(8);
        }
        if (uvs.length < 8) {
            dataPool.put(uvs);
            uvs = dataPool.get(8) || new Float32Array(8);
        }

        //build quads
        vertices[0] = l * wt.a + b * wt.c + wt.tx;
        vertices[1] = l * wt.b + b * wt.d + wt.ty;
        vertices[2] = r * wt.a + b * wt.c + wt.tx;
        vertices[3] = r * wt.b + b * wt.d + wt.ty;
        vertices[4] = l * wt.a + t * wt.c + wt.tx;
        vertices[5] = l * wt.b + t * wt.d + wt.ty;
        vertices[6] = r * wt.a + t * wt.c + wt.tx;
        vertices[7] = r * wt.b + t * wt.d + wt.ty;

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
            case cc.Scale9Sprite.FillType.HORIZONTAL:
                progressStart = vertices[0] + (vertices[2] - vertices[0]) * fillStart;
                progressEnd = vertices[0] + (vertices[2] - vertices[0]) * fillEnd;

                vertices[0] = progressStart;
                vertices[2] = progressEnd;
                vertices[4] = progressStart;
                vertices[6] = progressEnd;

                uvs[0] = quadUV[0] + (quadUV[2] - quadUV[0]) * fillStart;
                uvs[1] = quadUV[1] + (quadUV[3] - quadUV[1]) * fillStart;
                uvs[2] = quadUV[0] + (quadUV[2] - quadUV[0]) * fillEnd;
                uvs[3] = quadUV[1] + (quadUV[3] - quadUV[1]) * fillEnd;
                uvs[4] = quadUV[4] + (quadUV[6] - quadUV[4]) * fillStart;
                uvs[5] = quadUV[5] + (quadUV[7] - quadUV[5]) * fillStart;
                uvs[6] = quadUV[4] + (quadUV[6] - quadUV[4]) * fillEnd;
                uvs[7] = quadUV[5] + (quadUV[7] - quadUV[5]) * fillEnd;
                break;
            case cc.Scale9Sprite.FillType.VERTICAL:
                progressStart = vertices[1] + (vertices[3] - vertices[1]) * fillStart;
                progressEnd = vertices[1] + (vertices[3] - vertices[1]) * fillEnd;

                vertices[1] = progressStart;
                vertices[3] = progressStart;
                vertices[5] = progressEnd;
                vertices[7] = progressEnd;

                uvs[0] = quadUV[0].u + (quadUV[4].u - quadUV[0].u) * fillStart;
                uvs[1] = quadUV[1].v + (quadUV[5].v - quadUV[1].v) * fillStart;
                uvs[2] = quadUV[2].u + (quadUV[6].u - quadUV[2].u) * fillStart;
                uvs[3] = quadUV[3].v + (quadUV[7].v - quadUV[3].v) * fillStart;
                uvs[4] = quadUV[0].u + (quadUV[4].u - quadUV[0].u) * fillEnd;
                uvs[5] = quadUV[0].v + (quadUV[5].v - quadUV[1].v) * fillEnd;
                uvs[6] = quadUV[2].u + (quadUV[6].u - quadUV[2].u) * fillEnd;
                uvs[7] = quadUV[3].v + (quadUV[7].v - quadUV[3].v) * fillEnd;
                break;
            default:
                cc.error('Unrecognized fill type in bar fill');
                break;
        }
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
        var center = cc.v2(fillCenter);
        center.x *= contentSize.width;
        center.y *= contentSize.height;

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

        var dataLength = 3 * 7 * 8;
        if (vertices.length < dataLength) {
            dataPool.put(vertices);
            vertices = dataPool.get(dataLength) || new Float32Array(dataLength);
        }
        if (uvs.length < dataLength) {
            dataPool.put(uvs);
            uvs = dataPool.get(dataLength) || new Float32Array(dataLength);
        }

        var offset = 0, count = 0;
        for(var triangleIndex = 0; triangleIndex < 4; ++triangleIndex) {
            var triangle = triangles[triangleIndex];
            if(triangle === null) {
                continue;
            }
            //all in
            if(fillRange >= Math.PI * 2) {
                this._generateTriangle(offset, center, this._vertPos[triangle[0]], this._vertPos[triangle[1]]);
                offset += 24;
                count += 3;
                continue;
            }
            //test against
            var startAngle = this._getVertAngle(center,this._vertPos[triangle[0]]);
            var endAngle = this._getVertAngle(center,this._vertPos[triangle[1]]);
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
                        this._generateTriangle(offset, center, this._vertPos[triangle[0]], this._intersectPoint_2[triangleIndex]);
                    } else {
                        //startAngle to endAngle
                        this._generateTriangle(offset, center, this._vertPos[triangle[0]], this._vertPos[triangle[1]]);
                    }
                    offset += 24;
                    count += 3;
                } else {
                    //startAngle < fillStart
                    if(endAngle <= fillStart) {
                        //all out
                    } else if(endAngle <= fillEnd) {
                        //fillStart to endAngle
                        this._generateTriangle(offset, center, this._intersectPoint_1[triangleIndex], this._vertPos[triangle[1]]);
                        offset += 24;
                        count += 3;
                    } else {
                        //fillStart to fillEnd
                        this._generateTriangle(offset, center, this._intersectPoint_1[triangleIndex], this._intersectPoint_2[triangleIndex]);
                        offset += 24;
                        count += 3;
                    }
                }
                //add 2 * PI
                startAngle += Math.PI * 2;
                endAngle += Math.PI * 2;
            }
        }
        sprite._vertCount = count;
    },

    _generateTriangle: function(offset, vert0, vert1, vert2) {
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
        vertices[0]  = vert0.x;
        vertices[1]  = vert0.y;
        vertices[2]  = vert1.x;
        vertices[3]  = vert1.y;
        vertices[4]  = vert2.x;
        vertices[5]  = vert2.y;

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

        this._vertices[0].x = x0 * wt.a + y0 * wt.c + wt.tx;
        this._vertices[0].y = x0 * wt.b + y0 * wt.d + wt.ty;
        this._vertices[1].x = x3 * wt.a + y3 * wt.c + wt.tx;
        this._vertices[1].y = x3 * wt.b + y3 * wt.d + wt.ty;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();
        var textureRect = spriteFrame._rect;

        //uv computation should take spritesheet into account.
        var u0, u3;
        var v0, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        this._uvs[0].x = u0;
        this._uvs[0].y = v3;
        this._uvs[1].x = u3;
        this._uvs[1].y = v0;
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
        if (typeof textureOrSpriteFrame === 'string') {
            var frame = cc.spriteFrameCache.getSpriteFrame(textureOrSpriteFrame);
            if (frame) {
                this.initWithSpriteFrame(frame);
            } else {
                this.initWithTexture(textureOrSpriteFrame);
            }
        } else if (textureOrSpriteFrame instanceof cc.SpriteFrame) {
            this.initWithSpriteFrame(textureOrSpriteFrame);
        }
        else if (textureOrSpriteFrame instanceof cc.Texture2D) {
            this.initWithTexture(textureOrSpriteFrame);
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
     * @param spriteFrameOrSFFileName The name of the texture file.
     */
    setSpriteFrame: function (spriteFrameOrSFName) {
        var spriteFrame;
        if (spriteFrameOrSFName instanceof cc.SpriteFrame) {
            spriteFrame = spriteFrameOrSFName;
        }
        else {
            spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameOrSFName);
        }

        if (spriteFrame) {
            this._spriteFrame = spriteFrame;
            this._quadsDirty = true;
            var self = this;
            var onResourceDataLoaded = function () {
                if (cc.sizeEqualToSize(self._contentSize, cc.size(0, 0))) {
                    self.setContentSize(self._spriteFrame._rect);
                }
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
        if(this._renderingType === cc.Scale9Sprite.RenderingType.FILLED) {
            this._quadsDirty = true;
        }
    },

    getFillType: function() {
        return this._fillType;
    },

    setFillCenter: function(value, y) {
        this._fillCenter = cc.v2(value,y);
        if(this._renderingType === cc.Scale9Sprite.RenderingType.FILLED && this._fillType === cc.Scale9Sprite.FillType.RADIAL) {
            this._quadsDirty = true;
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
        if(this._renderingType === cc.Scale9Sprite.RenderingType.FILLED) {
            this._quadsDirty = true;
        }
    },

    getFillStart: function() {
        return this._fillStart;
    },

    setFillRange: function(value) {
        if(this._fillRange === value)
            return;
        this._fillRange = value;
        if(this._renderingType === cc.Scale9Sprite.RenderingType.FILLED ) {
            this._quadsDirty = true;
        }
    },

    getFillRange: function() {
        return this._fillRange;
    },

    _rebuildQuads: function () {
        if (!this.loaded() || this._quadsDirty === false) return;
        this._isTriangle = false;
        if (this._renderingType === cc.Scale9Sprite.RenderingType.SIMPLE) {
            simpleQuadGenerator._rebuildQuads_base(this, this._spriteFrame, this.getContentSize(), this._isTrimmedContentSize);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.SLICED) {
            scale9QuadGenerator._rebuildQuads_base(this, this._spriteFrame, this.getContentSize(), this._insetLeft, this._insetRight, this._insetTop, this._insetBottom);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.TILED) {
            tiledQuadGenerator._rebuildQuads_base(this, this._spriteFrame, this.getContentSize());
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.FILLED) {
            var fillstart = this._fillStart;
            var fillRange = this._fillRange;
            if(fillRange < 0) {
                fillstart += fillRange;
                fillRange = -fillRange;
            }
            if (this._fillType !== cc.Scale9Sprite.FillType.RADIAL) {
                fillRange = fillstart + fillRange;
                fillstart = fillstart > 1.0 ? 1.0 : fillstart;
                fillstart = fillstart < 0.0 ? 0.0 : fillstart;

                fillRange = fillRange > 1.0 ? 1.0 : fillRange;
                fillRange = fillRange < 0.0 ? 0.0 : fillRange;
                fillRange = fillRange - fillstart;
                fillQuadGeneratorBar._rebuildQuads_base(this, this._spriteFrame, this.getContentSize(), this._fillType, fillstart, fillRange);
            } else {
                this._isTriangle = true;
                if (!this._rawVerts) {
                    this._rawVerts = dataPool.get(8) || new Float32Array(8);
                    this._rawUvs = dataPool.get(8) || new Float32Array(8);
                }
                fillQuadGeneratorRadial._rebuildQuads_base(this, this._spriteFrame, this.getContentSize(), this._fillCenter,fillstart, fillRange);
            }
        } else {
            this._quads = [];
            cc.error('Can not generate quad');
        }
        this._quadsDirty = false;
    },
    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new cc.Scale9Sprite.WebGLRenderCmd(this);
    }

});

var _p = cc.Scale9Sprite.prototype;
cc.js.addon(_p, EventTarget.prototype);
// Extended properties
cc.defineGetterSetter(_p, 'insetLeft', _p.getInsetLeft, _p.setInsetLeft);
cc.defineGetterSetter(_p, 'insetTop', _p.getInsetTop, _p.setInsetTop);
cc.defineGetterSetter(_p, 'insetRight', _p.getInsetRight, _p.setInsetRight);
cc.defineGetterSetter(_p, 'insetBottom', _p.getInsetBottom, _p.setInsetBottom);

_p = null;

cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1, DISTORTION: 2};

/**
 * Enum for sprite type
 * @enum SpriteType
 */
cc.Scale9Sprite.RenderingType = cc.Enum({
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
    FILLED: 3
});

cc.Scale9Sprite.FillType = cc.Enum({
    HORIZONTAL: 0,
    VERTICAL: 1,
    RADIAL:2,
});
