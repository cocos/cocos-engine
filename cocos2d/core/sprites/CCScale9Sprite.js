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

/**
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
cc.SimpleQuadGenerator = {
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        //build quads
        var quad;
        quad = new cc.V3F_C4B_T2F_Quad();

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

    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

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

cc.Scale9QuadGenerator = {
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity,insetLeft, insetRight, insetTop, insetBottom) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame, insetLeft, insetRight, insetTop, insetBottom);

        //build quads
        var quad;
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                quad = new cc.V3F_C4B_T2F_Quad();
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

    _calculateVertices : function (spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
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

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x1 = x1 / cc.contentScaleFactor();
        x2 = x2 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y1 = y1 / cc.contentScaleFactor();
        y2 = y2 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x1, y1));
        vertices.push(cc.p(x2, y2));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs : function (spriteFrame, insetLeft, insetRight, insetTop, insetBottom) {
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

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

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

cc.TiledQuadGenerator = {
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity) {
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
        for(var hindex = 0; hindex < Math.ceil(hRepeat); ++hindex) {
            for(var vindex = 0; vindex < Math.ceil(vRepeat); ++vindex) {
                var quad;
                quad = new cc.V3F_C4B_T2F_Quad();

                quad._bl.colors = colorOpacity;
                quad._br.colors = colorOpacity;
                quad._tl.colors = colorOpacity;
                quad._tr.colors = colorOpacity;

                quad._bl.vertices = new cc.Vertex3F(rectWidth * hindex, rectHeight * vindex, 0);
                quad._br.vertices = new cc.Vertex3F(rectWidth * Math.min(hindex+1, hRepeat), rectHeight * vindex, 0);
                quad._tl.vertices = new cc.Vertex3F(rectWidth * hindex, rectHeight * Math.min(vindex+1, vRepeat), 0);
                quad._tr.vertices = new cc.Vertex3F(rectWidth * Math.min(hindex+1, hRepeat), rectHeight * Math.min(vindex+1, vRepeat), 0);

                if (!spriteFrame._rotated) {
                    quad._bl.texCoords = new cc.Tex2F(u0, v0);
                    quad._br.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1,hRepeat - hindex), v0);
                    quad._tl.texCoords = new cc.Tex2F(u0, v0 + (v1 - v0) * Math.min(1,vRepeat - vindex));
                    quad._tr.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1,hRepeat - hindex), v0 + (v1 - v0) * Math.min(1,vRepeat - vindex));
                } else {
                    quad._bl.texCoords = new cc.Tex2F(u0, v1);
                    quad._br.texCoords = new cc.Tex2F(u0, v1 + (v0-v1) * Math.min(1,hRepeat - hindex));
                    quad._tl.texCoords = new cc.Tex2F(u0 + (u1-u0) * Math.min(1,vRepeat - vindex), v1);
                    quad._tr.texCoords = new cc.Tex2F(u0 + (u1-u0) * Math.min(1,vRepeat - vindex), v1 + (v0-v1) * Math.min(1,hRepeat - hindex));

                }
                quads.push(quad);
            }
        }
        return quads;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

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

cc.FilledQuadGeneratorBar = {
    //percentage from 0 to 1;
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity, fillType, percentage) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        //build quads
        var quad;
        quad = new cc.V3F_C4B_T2F_Quad();

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

        //do clamp
        percentage = percentage > 1 ? 1 : percentage;
        percentage = percentage < 0 ? 0 : percentage;
        var progress;
        switch (fillType) {
            case cc.FillType.LEFT:
                progress = vertices[0].x + (vertices[1].x - vertices[0].x) * percentage;
                quad._br.vertices.x = progress;
                quad._tr.vertices.x = progress;

                quad._br.texCoords.u = quad._bl.texCoords.u + (quad._br.texCoords.u - quad._bl.texCoords.u) * percentage;
                quad._br.texCoords.v = quad._bl.texCoords.v + (quad._br.texCoords.v - quad._bl.texCoords.v) * percentage;

                quad._tr.texCoords.u = quad._tl.texCoords.u + (quad._tr.texCoords.u - quad._tl.texCoords.u) * percentage;
                quad._tr.texCoords.v = quad._tl.texCoords.v + (quad._tr.texCoords.v - quad._tl.texCoords.v) * percentage;
                break;
            case cc.FillType.RIGHT:
                progress = vertices[1].x + (vertices[0].x - vertices[1].x) * percentage;
                quad._bl.vertices.x = progress;
                quad._tl.vertices.x = progress;

                quad._bl.texCoords.u = quad._br.texCoords.u + (quad._bl.texCoords.u - quad._br.texCoords.u) * percentage;
                quad._bl.texCoords.v = quad._br.texCoords.v + (quad._bl.texCoords.v - quad._br.texCoords.v) * percentage;

                quad._tl.texCoords.u = quad._tr.texCoords.u + (quad._tl.texCoords.u - quad._tr.texCoords.u) * percentage;
                quad._tl.texCoords.v = quad._tr.texCoords.v + (quad._tl.texCoords.v - quad._tr.texCoords.v) * percentage;
                break;
            case cc.FillType.TOP:
                progress = vertices[1].y + (vertices[0].y - vertices[1].y) * percentage;
                quad._bl.vertices.y = progress;
                quad._br.vertices.y = progress;

                quad._bl.texCoords.u = quad._tl.texCoords.u + (quad._bl.texCoords.u - quad._tl.texCoords.u) * percentage;
                quad._bl.texCoords.v = quad._tl.texCoords.v + (quad._bl.texCoords.v - quad._tl.texCoords.v) * percentage;

                quad._br.texCoords.u = quad._tr.texCoords.u + (quad._br.texCoords.u - quad._tr.texCoords.u) * percentage;
                quad._br.texCoords.v = quad._tr.texCoords.v + (quad._br.texCoords.v - quad._tr.texCoords.v) * percentage;
                break;
            case cc.FillType.BOTTOM:
                progress = vertices[0].y + (vertices[1].y - vertices[0].y) * percentage;
                quad._tl.vertices.y = progress;
                quad._tr.vertices.y = progress;

                quad._tl.texCoords.u = quad._bl.texCoords.u + (quad._tl.texCoords.u - quad._bl.texCoords.u) * percentage;
                quad._tl.texCoords.v = quad._bl.texCoords.v + (quad._tl.texCoords.v - quad._bl.texCoords.v) * percentage;

                quad._tr.texCoords.u = quad._br.texCoords.u + (quad._tr.texCoords.u - quad._br.texCoords.u) * percentage;
                quad._tr.texCoords.v = quad._br.texCoords.v + (quad._tr.texCoords.v - quad._br.texCoords.v) * percentage;
                break;
            default:
                cc.error("Unrecognized fill type in bar fill");
                break;
        }

        quads.push(quad);
        return quads;
    },

    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

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

cc.FilledQuadGeneratorRadial = {
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity, radialCenter, radianBegin, radian) {
        var verts = [new V3F_C4B_T2F(),new V3F_C4B_T2F(),new V3F_C4B_T2F(),new V3F_C4B_T2F()];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        verts[0].colors = colorOpacity;
        verts[1].colors = colorOpacity;
        verts[3].colors = colorOpacity;
        verts[2].colors = colorOpacity;

        verts[0].vertices = new cc.Vertex3F(vertices[0].x, vertices[0].y, 0);
        verts[1].vertices = new cc.Vertex3F(vertices[1].x, vertices[0].y, 0);
        verts[3].vertices = new cc.Vertex3F(vertices[0].x, vertices[1].y, 0);
        verts[2].vertices = new cc.Vertex3F(vertices[1].x, vertices[1].y, 0);

        if (!spriteFrame._rotated) {
            verts[0].texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            verts[1].texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
            verts[3].texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            verts[2].texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
        } else {
            verts[0].texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            verts[1].texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            verts[3].texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
            verts[2].texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
        }

        if(radian >= Math.PI * 2)
            return verts;

        //do radian calculation
        var center = cc.v2(contentSize.width * radialCenter.x, contentSize.height * radialCenter.y);
        //calculate line
        if(radian > Math.PI) {
            //todo add line

            //calculate remaining
            radian -= Math.PI;
            radianBegin += Math.PI;
        }

        var polygonVerts = {};
        //line
        //a * x + b * y + c = 0
        var lineStart = new cc.math.Vec3();
        lineStart.x = Math.cos(radianBegin + Math.PI / 4);
        lineStart.y = Math.sin(radianBegin + Math.PI / 4);
        lineStart.z = -(lineStart.a * center.x + lineStart.b * center.y);
        var startIntection = this._lineIntersectBox(lineStart, 0, contentSize.width, 0, contentSize.height);

        var lineEnd = new cc.math.Vec3();
        lineEnd.x = Math.cos(radianBegin + radian + Math.PI / 4);
        lineEnd.y = Math.sin(radianBegin + radian + Math.PI / 4);
        lineEnd.z = -(lineStart.a * center.x + lineStart.b * center.y);
        var endIntection = this._lineIntersectBox(lineEnd, 0, contentSize.width, 0, contentSize.height);

        //test center
        if(center.x >= 0 || center.y >= 0 || center.x <= contentSize.width || center.y <= contentSize.height) {
            var vert = new V3F_C4B_T2F();
            polygonVerts.push(vert);
            vert.colors = colorOpacity;
            vert.vertices = new cc.Vertex3F(center.x, center.y, 0);
            vert.texCoords = this._generateUV(radialCenter,verts[0].texCoords,verts[1].texCoords,verts[2].texCoords,verts[3].texCoords);
        }

        //test startIntection
        for(var intersectPoint in startIntection) {
            if(intersectPoint && intersectPoint.x && intersectPoint.y) {
                //test against line end
                
                if(intersectPoint.x >= 0 || intersectPoint.y >= 0 || intersectPoint.x <= contentSize.width || intersectPoint.y <= contentSize.height) {
                    var vert = new V3F_C4B_T2F();
                    polygonVerts.push(vert);
                    vert.colors = colorOpacity;
                    vert.vertices = new cc.Vertex3F(center.x, center.y, 0);
                    vert.texCoords = this._generateUV(radialCenter,verts[0].texCoords,verts[1].texCoords,verts[2].texCoords,verts[3].texCoords);
                }
            }
        }

    },

    _generateUV : function(progress, uvbl, uvbr, uvtr, uvtl) {
        var result = new cc.Tex2F(0,0);
        var px1 = uvbl.u + (uvbr.u-uvbl.u) * px;
        var px2 = uvtl.u + (uvtr.u-uvtl.u) * px;
        var py1 = uvbl.v + (uvbr.v-uvbl.v) * px;
        var py2 = uvtl.v + (uvtr.v-uvtl.v) * px;
        result.u = px1 + (px2 - px1) * progress.y;
        result.v = py1 + (py2 - py1) * progress.y;
        return result;
    },

    _lineIntersectBox: function(line, left, right, bottom, top) {
        var result = [NaN,NaN,NaN,NaN];
        if(line.x !== 0) {
            result[2] = -(line.y * bottom + line.z) / line.x;
            result[3] = -(line.y * top + line.z) / line.x;
        }
        if(line.y !==0) {
            result[0] = -(line.x * left + line.z) / line.y;
            result[1] = -(line.x * right + line.z) / line.y;
        }
        //ignore result out of bourdary
        if(result[0] >= top || result[0] <= bottom) result[0] = NaN;
        if(result[1] >= top || result[1] <= bottom) result[0] = NaN;
        if(result[2] >= right || result[2] <= left) result[2] = NaN;
        if(result[3] >= right || result[3] <= left) result[3] = NaN;

        return result;
    },

    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

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

    ctor: function (textureOrSpriteFrame) {
        _ccsg.Node.prototype.ctor.call(this);
        this._renderCmd.setState(this._brightState);
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
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
        var spriteFrame = cc.SpriteFrame.createWithTexture(textureOrTextureFile);
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
            this._blendFunc.src = blendFunc.src || cc.BLEND_SRC;
            this._blendFunc.dst = blendFunc.dst || cc.BLEND_DST;
        }
        else {
            this._blendFunc.src = blendFunc || cc.BLEND_SRC;
            this._blendFunc.dst = dst || cc.BLEND_DST;
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
    _rebuildQuads : function () {
        if (!this.loaded() || this._quadsDirty === false) return;
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        if (this._renderingType === cc.Scale9Sprite.RenderingType.SIMPLE) {
            this._quads = cc.SimpleQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.SLICED) {
            this._quads = cc.Scale9QuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._insetLeft, this._insetRight, this._insetTop, this._insetBottom);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.TILED) {
            this._quads = cc.TiledQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.FILLED) {
            cc.error("Filled sprite not implemented.");
            this._quads = cc.SimpleQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color);
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


cc.Scale9Sprite.create = function (file) {
    return new cc.Scale9Sprite(file);
};

/**
 * create a cc.Scale9Sprite with Sprite frame.
 * @deprecated since v3.0, please use "new cc.Scale9Sprite(spriteFrame, capInsets)" instead.
 * @param {cc.SpriteFrame} spriteFrame
 * @param {cc.Rect} capInsets
 * @returns {cc.Scale9Sprite}
 */
cc.Scale9Sprite.createWithSpriteFrame = function (spriteFrame) {
    return new cc.Scale9Sprite(spriteFrame);
};

/**
 * create a cc.Scale9Sprite with a Sprite frame name
 * @deprecated since v3.0, please use "new cc.Scale9Sprite(spriteFrameName, capInsets)" instead.
 * @param {string} spriteFrameName
 * @param {cc.Rect} capInsets
 * @returns {Scale9Sprite}
 */
cc.Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName) {
    return new cc.Scale9Sprite(spriteFrameName);
};

cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1};

/**
 * Enum for sprite type
 * @enum SpriteType
 */
cc.SpriteType = cc.Enum({
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
    TILED : 2,
    /*
     * @property {Number} FILLED
     */
    FILLED: 3
});

cc.Scale9Sprite.RenderingType = cc.SpriteType;

cc.FillType = cc.Enum({
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3,
    //todo implement this
    RADIAL:4,
});