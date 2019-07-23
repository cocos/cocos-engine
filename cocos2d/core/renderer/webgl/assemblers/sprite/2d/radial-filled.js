/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import Assembler2D from '../../../../assembler-2d';

const PI_2 = Math.PI * 2;

let _vertPos = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
let _vertices = [0, 0, 0, 0];
let _uvs = [0, 0, 0, 0, 0, 0, 0, 0];
let _intersectPoint_1 = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
let _intersectPoint_2 = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)];
let _center = cc.v2(0, 0);
let _triangles = [];

function _calcInsectedPoints (left, right, bottom, top, center, angle, intersectPoints) {
    //left bottom, right, top
    let sinAngle = Math.sin(angle);
    let cosAngle = Math.cos(angle);
    let tanAngle, cotAngle;
    if (Math.cos(angle) !== 0) {
        tanAngle = sinAngle / cosAngle;
        //calculate right and left
        if ((left - center.x) * cosAngle > 0) {
            let yleft = center.y + tanAngle * (left - center.x);
            intersectPoints[0].x = left;
            intersectPoints[0].y = yleft;
        }
        if ((right - center.x) * cosAngle > 0) {
            let yright = center.y + tanAngle * (right - center.x);

            intersectPoints[2].x = right;
            intersectPoints[2].y = yright;
        }

    }

    if (Math.sin(angle) !== 0) {
        cotAngle = cosAngle / sinAngle;
        //calculate  top and bottom
        if ((top - center.y) * sinAngle > 0) {
            let xtop = center.x + cotAngle * (top - center.y);
            intersectPoints[3].x = xtop;
            intersectPoints[3].y = top;
        }
        if ((bottom - center.y) * sinAngle > 0) {
            let xbottom = center.x + cotAngle * (bottom - center.y);
            intersectPoints[1].x = xbottom;
            intersectPoints[1].y = bottom;
        }

    }
}

function _calculateVertices (sprite) {
    let node = sprite.node,
        width = node.width, height = node.height,
        appx = node.anchorX * width, appy = node.anchorY * height;

    let l = -appx, b = -appy,
        r = width - appx, t = height - appy;

    let vertices = _vertices;
    vertices[0] = l;
    vertices[1] = b;
    vertices[2] = r;
    vertices[3] = t;

    let fillCenter = sprite._fillCenter,
        cx = _center.x = Math.min(Math.max(0, fillCenter.x), 1) * (r - l) + l,
        cy = _center.y = Math.min(Math.max(0, fillCenter.y), 1) * (t - b) + b;

    _vertPos[0].x = _vertPos[3].x = l;
    _vertPos[1].x = _vertPos[2].x = r;
    _vertPos[0].y = _vertPos[1].y = b;
    _vertPos[2].y = _vertPos[3].y = t;

    _triangles.length = 0;
    if (cx !== vertices[0]) {
        _triangles[0] = [3, 0];
    }
    if (cx !== vertices[2]) {
        _triangles[2] = [1, 2];
    }
    if (cy !== vertices[1]) {
        _triangles[1] = [0, 1];
    }
    if (cy !== vertices[3]) {
        _triangles[3] = [2, 3];
    }
}

function _calculateUVs (spriteFrame) {
    let atlasWidth = spriteFrame._texture.width;
    let atlasHeight = spriteFrame._texture.height;
    let textureRect = spriteFrame._rect;

    let u0, u1, v0, v1;
    let uvs = _uvs;

    if (spriteFrame._rotated) {
        u0 = (textureRect.x) / atlasWidth;
        u1 = (textureRect.x + textureRect.height) / atlasWidth;

        v0 = (textureRect.y) / atlasHeight;
        v1 = (textureRect.y + textureRect.width) / atlasHeight;

        uvs[0] = uvs[2] = u0;
        uvs[4] = uvs[6] = u1;
        uvs[3] = uvs[7] = v1;
        uvs[1] = uvs[5] = v0;
    }
    else {
        u0 = (textureRect.x) / atlasWidth;
        u1 = (textureRect.x + textureRect.width) / atlasWidth;

        v0 = (textureRect.y) / atlasHeight;
        v1 = (textureRect.y + textureRect.height) / atlasHeight;

        uvs[0] = uvs[4] = u0;
        uvs[2] = uvs[6] = u1;
        uvs[1] = uvs[3] = v1;
        uvs[5] = uvs[7] = v0;
    }
}

function _getVertAngle (start, end) {
    let placementX, placementY;
    placementX = end.x - start.x;
    placementY = end.y - start.y;

    if (placementX === 0 && placementY === 0) {
        return undefined;
    } else if (placementX === 0) {
        if (placementY > 0) {
            return Math.PI * 0.5;
        } else {
            return Math.PI * 1.5;
        }
    } else {
        let angle = Math.atan(placementY / placementX);
        if (placementX < 0) {
            angle += Math.PI;
        }

        return angle;
    }
}

export default class RadialFilledAssembler extends Assembler2D {
    initData (sprite) {
        this._renderData.createFlexData(0, 4, 6, this.getVfmt());
    }

    updateRenderData (sprite) {
        super.updateRenderData(sprite);

        let frame = sprite.spriteFrame;
        if (!frame) return;
        this.packToDynamicAtlas(sprite, frame);

        if (sprite._vertsDirty) {
            let fillStart = sprite._fillStart;
            let fillRange = sprite._fillRange;
            if (fillRange < 0) {
                fillStart += fillRange;
                fillRange = -fillRange;
            }

            //do round fill start [0,1), include 0, exclude 1
            while (fillStart >= 1.0) fillStart -= 1.0;
            while (fillStart < 0.0) fillStart += 1.0;

            fillStart *= PI_2;
            fillRange *= PI_2;

            //build vertices
            _calculateVertices(sprite);
            //build uvs
            _calculateUVs(frame);

            _calcInsectedPoints(_vertices[0], _vertices[2], _vertices[1], _vertices[3], _center, fillStart, _intersectPoint_1);
            _calcInsectedPoints(_vertices[0], _vertices[2], _vertices[1], _vertices[3], _center, fillStart + fillRange, _intersectPoint_2);

            this.updateVerts(sprite, fillStart, fillRange);

            sprite._vertsDirty = false;
        }
    }

    updateVerts (sprite, fillStart, fillRange) {
        let fillEnd = fillStart + fillRange;
        
        let local = this._local;

        let offset = 0;
        let floatsPerTriangle = 3 * this.floatsPerVert;
        for (let triangleIndex = 0; triangleIndex < 4; ++triangleIndex) {
            let triangle = _triangles[triangleIndex];
            if (!triangle) {
                continue;
            }
            //all in
            if (fillRange >= PI_2) {
                local.length = offset + floatsPerTriangle;
                this._generateTriangle(local, offset, _center, _vertPos[triangle[0]], _vertPos[triangle[1]]);
                offset += floatsPerTriangle;
                continue;
            }
            //test against
            let startAngle = _getVertAngle(_center, _vertPos[triangle[0]]);
            let endAngle = _getVertAngle(_center, _vertPos[triangle[1]]);
            if (endAngle < startAngle) endAngle += PI_2;
            startAngle -= PI_2;
            endAngle -= PI_2;
            //testing
            for (let testIndex = 0; testIndex < 3; ++testIndex) {
                if (startAngle >= fillEnd) {
                    //all out
                } else if (startAngle >= fillStart) {
                    local.length = offset + floatsPerTriangle;
                    if (endAngle >= fillEnd) {
                        //startAngle to fillEnd
                        this._generateTriangle(local, offset, _center, _vertPos[triangle[0]], _intersectPoint_2[triangleIndex]);
                    } else {
                        //startAngle to endAngle
                        this._generateTriangle(local, offset, _center, _vertPos[triangle[0]], _vertPos[triangle[1]]);
                    }
                    offset += floatsPerTriangle;
                } else {
                    //startAngle < fillStart
                    if (endAngle <= fillStart) {
                        //all out
                    } else if (endAngle <= fillEnd) {
                        local.length = offset + floatsPerTriangle;
                        //fillStart to endAngle
                        this._generateTriangle(local, offset, _center, _intersectPoint_1[triangleIndex], _vertPos[triangle[1]]);
                        offset += floatsPerTriangle;
                    } else {
                        local.length = offset + floatsPerTriangle;
                        //fillStart to fillEnd
                        this._generateTriangle(local, offset, _center, _intersectPoint_1[triangleIndex], _intersectPoint_2[triangleIndex]);
                        offset += floatsPerTriangle;
                    }
                }
                //add 2 * PI
                startAngle += PI_2;
                endAngle += PI_2;
            }
        }

        this.allocWorldVerts(sprite);
        this.updateWorldVerts(sprite);
    }

    allocWorldVerts(sprite) {
        let color = sprite.node._color._val;
        let renderData = this._renderData;
        let floatsPerVert = this.floatsPerVert;

        let local = this._local;
        let verticesCount = local.length / floatsPerVert;
        this.verticesCount = this.indicesCount = verticesCount;

        let flexBuffer = renderData._flexBuffer;
        if (flexBuffer.reserve(verticesCount, verticesCount)) {
            let iData = renderData.iDatas[0];
            for (let i = 0; i < verticesCount; i ++) {
                iData[i] = i;
            }
        }
        flexBuffer.used(this.verticesCount, this.indicesCount);

        let verts = renderData.vDatas[0],
            uintVerts = renderData.uintVDatas[0];
        
        let uvOffset = this.uvOffset;
        for (let offset = 0; offset < local.length; offset += floatsPerVert) {
            let start = offset + uvOffset;
            verts[start] = local[start];
            verts[start + 1] = local[start + 1];
            uintVerts[start + 2] = color;
        }
    }

    updateWorldVerts (sprite) {
        let node = sprite.node;

        let matrix = node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let local = this._local;
        let world = this._renderData.vDatas[0];
        let floatsPerVert = this.floatsPerVert;
        for (let offset = 0; offset < local.length; offset += floatsPerVert) {
            let x = local[offset];
            let y = local[offset + 1];
            world[offset] = x * a + y * c + tx;
            world[offset+1] = x * b + y * d + ty;
        }
    }

    _generateTriangle (verts, offset, vert0, vert1, vert2) {
        let vertices = _vertices;
        let v0x = vertices[0];
        let v0y = vertices[1];
        let v1x = vertices[2];
        let v1y = vertices[3];

        let floatsPerVert = this.floatsPerVert;
        verts[offset] = vert0.x;
        verts[offset + 1] = vert0.y;
        verts[offset + floatsPerVert] = vert1.x;
        verts[offset + floatsPerVert + 1] = vert1.y;
        verts[offset + floatsPerVert*2] = vert2.x;
        verts[offset + floatsPerVert*2 + 1] = vert2.y;

        let uvOffset = this.uvOffset;
        let progressX, progressY;
        progressX = (vert0.x - v0x) / (v1x - v0x);
        progressY = (vert0.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, verts, offset + uvOffset);

        progressX = (vert1.x - v0x) / (v1x - v0x);
        progressY = (vert1.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, verts, offset + floatsPerVert + uvOffset);

        progressX = (vert2.x - v0x) / (v1x - v0x);
        progressY = (vert2.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, verts, offset + floatsPerVert*2 + uvOffset);
    }

    _generateUV (progressX, progressY, verts, offset) {
        let uvs = _uvs;
        let px1 = uvs[0] + (uvs[2] - uvs[0]) * progressX;
        let px2 = uvs[4] + (uvs[6] - uvs[4]) * progressX;
        let py1 = uvs[1] + (uvs[3] - uvs[1]) * progressX;
        let py2 = uvs[5] + (uvs[7] - uvs[5]) * progressX;
        verts[offset] = px1 + (px2 - px1) * progressY;
        verts[offset + 1] = py1 + (py2 - py1) * progressY;
    }
}
