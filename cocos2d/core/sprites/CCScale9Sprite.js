/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2012 Neofect. All rights reserved.

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

 Created by Jung Sang-Taik on 2012-03-16
 ****************************************************************************/

EventTarget = require("../cocos2d/core/event/event-target");

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
    _rebuildQuads_base: function (spriteFrame, contentSize, colorOpacity, isTrimmedContentSize) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize, isTrimmedContentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        //build quads
        var quad;
        quad = cc.pool.getFromPool(cc.V3F_C4B_T2F_Quad)|| new cc.V3F_C4B_T2F_Quad();

        quad._bl.colors = colorOpacity;
        quad._br.colors = colorOpacity;
        quad._tl.colors = colorOpacity;
        quad._tr.colors = colorOpacity;

        quad._bl.vertices = new cc.Vertex3F(vertices[0].x, vertices[0].y, 0);
        quad._br.vertices = new cc.Vertex3F(vertices[1].x, vertices[0].y, 0);
        quad._tl.vertices = new cc.Vertex3F(vertices[0].x, vertices[1].y, 0);
        quad._tr.vertices = new cc.Vertex3F(vertices[1].x, vertices[1].y, 0);

        if (!spriteFrame._rotated) {
            quad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quad._br.texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
            quad._tl.texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quad._tr.texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
        } else {
            quad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quad._br.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quad._tl.texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
            quad._tr.texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
        }
        quads.push(quad);
        return quads;
    },

    _calculateVertices: function (spriteFrame, contentSize, isTrimmedContentSize) {
        var x0, x3;
        var y0, y3;
        if (isTrimmedContentSize) {
            x0 = 0;
            x3 = contentSize.width;

            y0 = 0;
            y3 = contentSize.height;
        } else {
            var originalSize = spriteFrame.getOriginalSize();
            var rect = spriteFrame.getRect();
            var offset = spriteFrame.getOffset();
            var scaleX = contentSize.width / originalSize.width;
            var scaleY = contentSize.height / originalSize.height;
            var trimmLeft = offset.x + (originalSize.width - rect.width) / 2;
            var trimmRight = offset.x - (originalSize.width - rect.width) / 2;
            var trimmedBottom = offset.y + (originalSize.height - rect.height) / 2;
            var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

            x0 = trimmLeft * scaleX;
            x3 = contentSize.width + trimmRight * scaleX;
            y0 = trimmedBottom * scaleY;
            y3 = contentSize.height + trimmedTop * scaleY;
        }

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs: function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = spriteFrame.getRect();

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

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

var scale9QuadGenerator = {
    _rebuildQuads_base: function (spriteFrame, contentSize, colorOpacity, insetLeft, insetRight, insetTop, insetBottom) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame, insetLeft, insetRight, insetTop, insetBottom);

        //build quads
        var quad;
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                quad = cc.pool.getFromPool(cc.V3F_C4B_T2F_Quad) || new cc.V3F_C4B_T2F_Quad();
                quad._bl.colors = colorOpacity;
                quad._br.colors = colorOpacity;
                quad._tl.colors = colorOpacity;
                quad._tr.colors = colorOpacity;

                quad._bl.vertices = new cc.Vertex3F(vertices[i].x, vertices[j].y, 0);
                quad._br.vertices = new cc.Vertex3F(vertices[i + 1].x, vertices[j].y, 0);
                quad._tl.vertices = new cc.Vertex3F(vertices[i].x, vertices[j + 1].y, 0);
                quad._tr.vertices = new cc.Vertex3F(vertices[i + 1].x, vertices[j + 1].y, 0);

                if (!spriteFrame._rotated) {
                    quad._bl.texCoords = new cc.Tex2F(uvs[i].x, uvs[j].y);
                    quad._br.texCoords = new cc.Tex2F(uvs[i + 1].x, uvs[j].y);
                    quad._tl.texCoords = new cc.Tex2F(uvs[i].x, uvs[j + 1].y);
                    quad._tr.texCoords = new cc.Tex2F(uvs[i + 1].x, uvs[j + 1].y);
                } else {
                    quad._bl.texCoords = new cc.Tex2F(uvs[j].x, uvs[3 - i].y);
                    quad._br.texCoords = new cc.Tex2F(uvs[j].x, uvs[3 - (i + 1)].y);
                    quad._tl.texCoords = new cc.Tex2F(uvs[j + 1].x, uvs[3 - i].y);
                    quad._tr.texCoords = new cc.Tex2F(uvs[j + 1].x, uvs[3 - (i + 1)].y);
                }
                quads.push(quad);
            }
        }

        return quads;
    },

    _calculateVertices: function (spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
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
        var x0, x1, x2, x3;
        var y0, y1, y2, y3;
        x0 = 0;
        x1 = leftWidth * xScale;
        x2 = x1 + sizableWidth;
        x3 = preferSize.width;

        y0 = 0;
        y1 = bottomHeight * yScale;
        y2 = y1 + sizableHeight;
        y3 = preferSize.height;

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x1, y1));
        vertices.push(cc.p(x2, y2));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs: function (spriteFrame, insetLeft, insetRight, insetTop, insetBottom) {
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

        var textureRect = spriteFrame.getRect();

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

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u1, v2));
        uvCoordinates.push(cc.p(u2, v1));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

var tiledQuadGenerator = {
    _rebuildQuads_base: function (spriteFrame, contentSize, colorOpacity) {
        var quads = [];

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);
        var u0 = uvs[0].x;
        var v0 = uvs[0].y;
        var u1 = uvs[1].x;
        var v1 = uvs[1].y;
        var rectWidth = spriteFrame.getRect().width;
        var rectHeight = spriteFrame.getRect().height;
        //build quads
        var hRepeat = contentSize.width / rectWidth;
        var vRepeat = contentSize.height / rectHeight;
        for (var hindex = 0; hindex < Math.ceil(hRepeat); ++hindex) {
            for (var vindex = 0; vindex < Math.ceil(vRepeat); ++vindex) {
                var quad;
                quad = cc.pool.getFromPool(cc.V3F_C4B_T2F_Quad) || new cc.V3F_C4B_T2F_Quad();

                quad._bl.colors = colorOpacity;
                quad._br.colors = colorOpacity;
                quad._tl.colors = colorOpacity;
                quad._tr.colors = colorOpacity;

                quad._bl.vertices = new cc.Vertex3F(rectWidth * hindex, rectHeight * vindex, 0);
                quad._br.vertices = new cc.Vertex3F(rectWidth * Math.min(hindex + 1, hRepeat), rectHeight * vindex, 0);
                quad._tl.vertices = new cc.Vertex3F(rectWidth * hindex, rectHeight * Math.min(vindex + 1, vRepeat), 0);
                quad._tr.vertices = new cc.Vertex3F(rectWidth * Math.min(hindex + 1, hRepeat), rectHeight * Math.min(vindex + 1, vRepeat), 0);

                if (!spriteFrame._rotated) {
                    quad._bl.texCoords = new cc.Tex2F(u0, v0);
                    quad._br.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, hRepeat - hindex), v0);
                    quad._tl.texCoords = new cc.Tex2F(u0, v0 + (v1 - v0) * Math.min(1, vRepeat - vindex));
                    quad._tr.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, hRepeat - hindex), v0 + (v1 - v0) * Math.min(1, vRepeat - vindex));
                } else {
                    quad._bl.texCoords = new cc.Tex2F(u0, v1);
                    quad._br.texCoords = new cc.Tex2F(u0, v1 + (v0 - v1) * Math.min(1, hRepeat - hindex));
                    quad._tl.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, vRepeat - vindex), v1);
                    quad._tr.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, vRepeat - vindex), v1 + (v0 - v1) * Math.min(1, hRepeat - hindex));

                }
                quads.push(quad);
            }
        }
        return quads;
    },

    _calculateUVs: function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = spriteFrame.getRect();

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

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

var fillQuadGeneratorBar = {
    //percentage from 0 to 1;
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity, fillType, fillStart, fillRange) {
        var fillEnd;
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        //build quads
        var quad = cc.pool.getFromPool(cc.V3F_C4B_T2F_Quad) || new cc.V3F_C4B_T2F_Quad();

        quad._bl.colors = colorOpacity;
        quad._br.colors = colorOpacity;
        quad._tl.colors = colorOpacity;
        quad._tr.colors = colorOpacity;

        quad._bl.vertices.x = quad._tl.vertices.x = vertices[0].x;
        quad._br.vertices.x = quad._tr.vertices.x = vertices[1].x;

        quad._bl.vertices.y = quad._br.vertices.y = vertices[0].y;
        quad._tl.vertices.y = quad._tr.vertices.y = vertices[1].y;

        var quadUV = [null,null,null,null];

        if (!spriteFrame._rotated) {
            quadUV[0] = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quadUV[1] = new cc.Tex2F(uvs[1].x, uvs[0].y);
            quadUV[2] = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quadUV[3] = new cc.Tex2F(uvs[1].x, uvs[1].y);
        } else {
            quadUV[0] = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quadUV[1] = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quadUV[2]= new cc.Tex2F(uvs[1].x, uvs[1].y);
            quadUV[3]= new cc.Tex2F(uvs[1].x, uvs[0].y);
        }

        //do clamp
        fillStart = fillStart > 1 ? 1 : fillStart;
        fillStart = fillStart < 0 ? 0 : fillStart;

        fillRange = fillRange < 0 ? 0 : fillRange;

        fillEnd = fillStart + fillRange;

        fillEnd = fillEnd > 1 ? 1 : fillEnd;

        var progressStart, progressEnd;
        switch (fillType) {
            case cc.Scale9Sprite.FillType.HORIZONTAL:
                progressStart = vertices[0].x + (vertices[1].x - vertices[0].x) * fillStart;
                progressEnd = vertices[0].x + (vertices[1].x - vertices[0].x) * fillEnd;

                quad._bl.vertices.x = progressStart;
                quad._tl.vertices.x = progressStart;

                quad._br.vertices.x = progressEnd;
                quad._tr.vertices.x = progressEnd;

                quad._bl.texCoords.u = quadUV[0].u + (quadUV[1].u - quadUV[0].u) * fillStart;
                quad._bl.texCoords.v = quadUV[0].v + (quadUV[1].v - quadUV[0].v) * fillStart;

                quad._tl.texCoords.u = quadUV[2].u + (quadUV[3].u - quadUV[2].u) * fillStart;
                quad._tl.texCoords.v = quadUV[2].v + (quadUV[3].v - quadUV[2].v) * fillStart;

                quad._br.texCoords.u = quadUV[0].u + (quadUV[1].u - quadUV[0].u) * fillEnd;
                quad._br.texCoords.v = quadUV[0].v + (quadUV[1].v - quadUV[0].v) * fillEnd;

                quad._tr.texCoords.u = quadUV[2].u + (quadUV[3].u - quadUV[2].u) * fillEnd;
                quad._tr.texCoords.v = quadUV[2].v + (quadUV[3].v - quadUV[2].v) * fillEnd;
                break;
            case cc.Scale9Sprite.FillType.VERTICAL:
                progressStart = vertices[0].y + (vertices[1].y - vertices[0].y) * fillStart;
                progressEnd = vertices[0].y + (vertices[1].y - vertices[0].y) * fillEnd;

                quad._bl.vertices.y = progressStart;
                quad._br.vertices.y = progressStart;

                quad._tl.vertices.y = progressEnd;
                quad._tr.vertices.y = progressEnd;

                quad._bl.texCoords.u = quadUV[0].u + (quadUV[2].u - quadUV[0].u) * fillStart;
                quad._bl.texCoords.v = quadUV[0].v + (quadUV[2].v - quadUV[0].v) * fillStart;

                quad._br.texCoords.u = quadUV[1].u + (quadUV[3].u - quadUV[1].u) * fillStart;
                quad._br.texCoords.v = quadUV[1].v + (quadUV[3].v - quadUV[1].v) * fillStart;

                quad._tl.texCoords.u = quadUV[0].u + (quadUV[2].u - quadUV[0].u) * fillEnd;
                quad._tl.texCoords.v = quadUV[0].v + (quadUV[2].v - quadUV[0].v) * fillEnd;

                quad._tr.texCoords.u = quadUV[1].u + (quadUV[3].u - quadUV[1].u) * fillEnd;
                quad._tr.texCoords.v = quadUV[1].v + (quadUV[3].v - quadUV[1].v) * fillEnd;
                break;
            default:
                cc.error("Unrecognized fill type in bar fill");
                break;
        }

        return [quad];
    },

    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        return [cc.p(x0, y0), cc.p(x3, y3)];
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = spriteFrame.getRect();

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

        return [cc.p(u0, v3),cc.p(u3, v0)];
    }
};

var fillQuadGeneratorRadial = {
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity, fillCenter, fillStart,fillRange) {
        //do round fill start [0,1), include 0, exclude 1
        while (fillStart >= 1.0) fillStart -= 1.0;
        while (fillStart < 0.0) fillStart += 1.0;
        var center = cc.v2(fillCenter);

        center.x *= contentSize.width;
        center.y *= contentSize.height;

        fillStart *= Math.PI * 2;
        fillRange *= Math.PI * 2;
        var fillEnd = fillStart + fillRange;
        if(!this._inited) {
            this._inited = true;
            this._vertPos = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
            this._vertices = [cc.v2(0,0),cc.v2(0,0)];
            this._uvs = [cc.v2(0,0),cc.v2(0,0)];
            this._intersectPoint_1 = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
            this._intersectPoint_2 = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
        }

        //build vertices
        this._calculateVertices(spriteFrame, contentSize);
        //build uvs
        this._calculateUVs(spriteFrame);

        this._vertPos[0].x = this._vertPos[3].x = this._vertices[0].x;
        this._vertPos[1].x = this._vertPos[2].x = this._vertices[1].x;
        this._vertPos[0].y = this._vertPos[1].y = this._vertices[0].y;
        this._vertPos[2].y = this._vertPos[3].y = this._vertices[1].y;

        //fallback
        //todo remove it if outside is implemented
        if(center.x > this._vertices[1].x) {
            center.x = this._vertices[1].x;
        }
        if(center.x < this._vertices[0].x) {
            center.x = this._vertices[0].x;
        }
        if(center.y < this._vertices[0].y) {
            center.y = this._vertices[0].y;
        }
        if(center.y > this._vertices[1].y) {
            center.y = this._vertices[1].y;
        }

        var rawQuad;
        rawQuad = cc.pool.getFromPool(cc.V3F_C4B_T2F_Quad) || new cc.V3F_C4B_T2F_Quad();

        rawQuad._bl.colors = colorOpacity;
        rawQuad._br.colors = colorOpacity;
        rawQuad._tl.colors = colorOpacity;
        rawQuad._tr.colors = colorOpacity;

        rawQuad._bl.vertices.x = rawQuad._tl.vertices.x = this._vertices[0].x;
        rawQuad._br.vertices.x = rawQuad._tr.vertices.x = this._vertices[1].x;

        rawQuad._bl.vertices.y = rawQuad._br.vertices.y = this._vertices[0].y;
        rawQuad._tl.vertices.y = rawQuad._tr.vertices.y = this._vertices[1].y;


        if (!spriteFrame._rotated) {
            rawQuad._bl.texCoords.u = rawQuad._tl.texCoords.u = this._uvs[0].x;
            rawQuad._bl.texCoords.v = rawQuad._br.texCoords.v = this._uvs[0].y;
            rawQuad._br.texCoords.u = rawQuad._tr.texCoords.u = this._uvs[1].x;
            rawQuad._tl.texCoords.v = rawQuad._tr.texCoords.v = this._uvs[1].y;

        } else {
            rawQuad._bl.texCoords.u = rawQuad._br.texCoords.u = this._uvs[0].x;
            rawQuad._tl.texCoords.u = rawQuad._tr.texCoords.u = this._uvs[1].x;
            rawQuad._br.texCoords.v = rawQuad._tr.texCoords.v = this._uvs[0].y;
            rawQuad._bl.texCoords.v = rawQuad._tl.texCoords.v = this._uvs[1].y;

        }

        var triangles = [null, null, null, null];

        if(center.x !== this._vertices[0].x) {
            triangles[0] = [3,0];
        }
        if(center.x !== this._vertices[1].x) {
            triangles[2] = [1,2];
        }
        if(center.y !== this._vertices[0].y) {
            triangles[1] = [0,1];
        }
        if(center.y !== this._vertices[1].y) {
            triangles[3] = [2,3];
        }

        this._getInsectedPoints(this._vertices[0].x, this._vertices[1].x, this._vertices[0].y, this._vertices[1].y, center, fillStart, this._intersectPoint_1);
        this._getInsectedPoints(this._vertices[0].x, this._vertices[1].x, this._vertices[0].y, this._vertices[1].y, center, fillStart + fillRange, this._intersectPoint_2);

        var quads = [];
        for(var triangleIndex = 0; triangleIndex < 4; ++triangleIndex) {
            var triangle = triangles[triangleIndex];
            if(triangle === null) {
                continue;
            }
            //all in
            if(fillRange >= Math.PI * 2) {
                quads.push(this._generateTriangle(rawQuad, center, this._vertPos[triangle[0]], this._vertPos[triangle[1]],colorOpacity));
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
                        quads.push(this._generateTriangle(rawQuad, center, this._vertPos[triangle[0]], this._intersectPoint_2[triangleIndex],colorOpacity));
                    } else {
                        //startAngle to endAngle
                        quads.push(this._generateTriangle(rawQuad, center, this._vertPos[triangle[0]], this._vertPos[triangle[1]],colorOpacity));
                    }
                } else {
                    //startAngle < fillStart
                    if(endAngle <= fillStart) {
                        //all out
                    } else if(endAngle <= fillEnd) {
                        //fillStart to endAngle
                        quads.push(this._generateTriangle(rawQuad, center, this._intersectPoint_1[triangleIndex], this._vertPos[triangle[1]],colorOpacity));
                    } else {
                        //fillStart to fillEnd
                        quads.push(this._generateTriangle(rawQuad, center, this._intersectPoint_1[triangleIndex], this._intersectPoint_2[triangleIndex],colorOpacity));
                    }
                }

                //add 2 * PI
                startAngle += Math.PI * 2;
                endAngle += Math.PI * 2;
            }

        }

        var result = {};
        result.quad = quads;
        result.rawQuad = rawQuad;
        return result;

    },

    _generateTriangle: function(rawQuad, vert0, vert1, vert2 , colorOpacity) {
        var rawQuad_bl = rawQuad._bl;
        var rawQuad_br = rawQuad._br;
        var rawQuad_tl = rawQuad._tl;
        var rawQuad_tr = rawQuad._tr;

        var v0x = rawQuad_bl.vertices.x;
        var v0y = rawQuad_bl.vertices.y;
        var v1x = rawQuad_tr.vertices.x;
        var v1y = rawQuad_tr.vertices.y;
        var progressX, progressY;
        var quad = cc.pool.getFromPool(cc.V3F_C4B_T2F_Quad) || new cc.V3F_C4B_T2F_Quad();
        quad._tl.vertices.x  = vert0.x;
        quad._tl.vertices.y  = vert0.y;

        quad._bl.vertices.x  = vert1.x;
        quad._bl.vertices.y  = vert1.y;

        quad._tr.vertices.x  = vert2.x;
        quad._tr.vertices.y  = vert2.y;
        quad._tl.colors = colorOpacity;
        quad._bl.colors = colorOpacity;
        quad._tr.colors = colorOpacity;

        progressX = (vert0.x - v0x) / (v1x - v0x);
        progressY = (vert0.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, rawQuad_bl.texCoords,rawQuad_br.texCoords,rawQuad_tr.texCoords,rawQuad_tl.texCoords, quad._tl.texCoords);

        progressX = (vert1.x - v0x) / (v1x - v0x);
        progressY = (vert1.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, rawQuad_bl.texCoords,rawQuad_br.texCoords,rawQuad_tr.texCoords,rawQuad_tl.texCoords,quad._bl.texCoords);

        progressX = (vert2.x - v0x) / (v1x - v0x);
        progressY = (vert2.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, rawQuad_bl.texCoords,rawQuad_br.texCoords,rawQuad_tr.texCoords,rawQuad_tl.texCoords,quad._tr.texCoords);

        return quad;
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

    _generateUV : function(progressX, progressY, uvbl, uvbr, uvtr, uvtl, result) {
        var px1 = uvbl.u + (uvbr.u-uvbl.u) * progressX;
        var px2 = uvtl.u + (uvtr.u-uvtl.u) * progressX;
        var py1 = uvbl.v + (uvbr.v-uvbl.v) * progressX;
        var py2 = uvtl.v + (uvtr.v-uvtl.v) * progressX;
        result.u = px1 + (px2 - px1) * progressY;
        result.v = py1 + (py2 - py1) * progressY;
    },


    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        this._vertices[0].x = x0;
        this._vertices[0].y = y0;
        this._vertices[1].x = x3;
        this._vertices[1].y = y3;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = spriteFrame.getRect();

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
    //rendering quads
    _quads: [],
    _quadsDirty: true,
    _rawQuad: null,
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
        //
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
                    self.setContentSize(self._spriteFrame.getRect());
                }
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
        if(y == undefined) {
            y = valueOrX.y;
            valueOrX = valueOrX.x;
        }
        this._distortionTiling = this._distortionTiling || cc.v2(0,0);
        this._distortionTiling.x = valueOrX;
        this._distortionTiling.y = y;
    },

    setDistortionOffset: function(valueOrX, y) {
        if(y == undefined) {
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

    _onColorOpacityDirty: function () {
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        var index;
        var quadLength = this._quads.length;
        for (index = 0; index < quadLength; ++index) {
            //svar quad = this._quads[index];
            this._quads[index]._bl.colors = color;
            this._quads[index]._br.colors = color;
            this._quads[index]._tl.colors = color;
            this._quads[index]._tr.colors = color;
        }
    },

    _rebuildQuads: function () {
        if (!this.loaded() || this._quadsDirty === false) return;
        //put quads back
        for(var quadIndex = 0; quadIndex < this._quads.length; ++quadIndex) {
            cc.pool.putInPool(this._quads[quadIndex]);
        }
        this._rawQuad && cc.pool.putInPool(this._rawQuad);
        this._rawQuad = null;
        this._quads = [];
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        this._isTriangle = false;
        if (this._renderingType === cc.Scale9Sprite.RenderingType.SIMPLE) {
            this._quads = simpleQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._isTrimmedContentSize);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.SLICED) {
            this._quads = scale9QuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._insetLeft, this._insetRight, this._insetTop, this._insetBottom);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.TILED) {
            this._quads = tiledQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.FILLED) {
            var fillstart = this._fillStart;
            var fillRange = this._fillRange;
            if(fillRange < 0) {
                fillstart += fillRange;
                fillRange = -fillRange;
            }
            if(this._fillType !== cc.Scale9Sprite.FillType.RADIAL) {
                fillRange = fillstart + fillRange;
                fillstart = fillstart > 1.0 ? 1.0 : fillstart;
                fillstart = fillstart < 0.0 ? 0.0 : fillstart;

                fillRange = fillRange > 1.0 ? 1.0 : fillRange;
                fillRange = fillRange < 0.0 ? 0.0 : fillRange;
                fillRange = fillRange - fillstart;
                this._quads = fillQuadGeneratorBar._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._fillType, fillstart,fillRange);
            } else {
                this._isTriangle = true;
                var fillResult = fillQuadGeneratorRadial._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color,this._fillCenter,fillstart,fillRange);
                this._quads = fillResult.quad;
                this._rawQuad = fillResult.rawQuad;
            }
        } else {
            this._quads = [];
            cc.error("Can not generate quad");
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
/** @expose */
_p.insetLeft;
cc.defineGetterSetter(_p, "insetLeft", _p.getInsetLeft, _p.setInsetLeft);
/** @expose */
_p.insetTop;
cc.defineGetterSetter(_p, "insetTop", _p.getInsetTop, _p.setInsetTop);
/** @expose */
_p.insetRight;
cc.defineGetterSetter(_p, "insetRight", _p.getInsetRight, _p.setInsetRight);
/** @expose */
_p.insetBottom;
cc.defineGetterSetter(_p, "insetBottom", _p.getInsetBottom, _p.setInsetBottom);

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
