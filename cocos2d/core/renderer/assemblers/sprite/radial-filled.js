/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

const dynamicAtlasManager = require('../../utils/dynamic-atlas/manager');

const PI_2 = Math.PI * 2;

module.exports = {
    useModel: false,

    _vertPos: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _vertices: [0, 0, 0, 0],
    _uvs: [0, 0, 0, 0, 0, 0, 0, 0],
    _intersectPoint_1: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _intersectPoint_2: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _center: cc.v2(0, 0),
    _triangles: [],

    createData (sprite) {
        return sprite.requestRenderData();
    },

    updateRenderData (sprite) {
        let frame = sprite.spriteFrame;
        
        // 避免用户使用自定义 material 的情况下覆盖用户设置，不过这里还应该加一个 TODO，未来设计 material 的序列化和用户接口时，应该会有改动
        if (!sprite._material && frame) {
            // 尽可能避免函数调用的开销
            if (!frame._original) {
                dynamicAtlasManager.insertSpriteFrame(frame);
            }
            sprite._activateMaterial();
        }

        let renderData = sprite._renderData;
        if (renderData && frame) {
            if (renderData.vertDirty || renderData.uvDirty) {
                let data = renderData._data;

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
                let fillEnd = fillStart + fillRange;

                //build vertices
                this._calculateVertices(sprite);
                //build uvs
                this._calculateUVs(frame);

                let center = this._center;

                let vertPos = this._vertPos,
                    vertices = this._vertices;

                let triangles = this._triangles;

                this._calcInsectedPoints(vertices[0], vertices[2], vertices[1], vertices[3], center, fillStart, this._intersectPoint_1);
                this._calcInsectedPoints(vertices[0], vertices[2], vertices[1], vertices[3], center, fillStart + fillRange, this._intersectPoint_2);

                let offset = 0;
                for (let triangleIndex = 0; triangleIndex < 4; ++triangleIndex) {
                    let triangle = triangles[triangleIndex];
                    if (!triangle) {
                        continue;
                    }
                    //all in
                    if (fillRange >= PI_2) {
                        renderData.dataLength = offset + 3;
                        this._generateTriangle(data, offset, center, vertPos[triangle[0]], vertPos[triangle[1]]);
                        offset += 3;
                        continue;
                    }
                    //test against
                    let startAngle = this._getVertAngle(center, vertPos[triangle[0]]);
                    let endAngle = this._getVertAngle(center, vertPos[triangle[1]]);
                    if(endAngle < startAngle) endAngle += PI_2;
                    startAngle -= PI_2;
                    endAngle -= PI_2;
                    //testing
                    for(let testIndex = 0; testIndex < 3; ++testIndex) {
                        if(startAngle >= fillEnd) {
                            //all out
                        } else if (startAngle >= fillStart) {
                            renderData.dataLength = offset + 3;
                            if(endAngle >= fillEnd) {
                                //startAngle to fillEnd
                                this._generateTriangle(data, offset, center, vertPos[triangle[0]], this._intersectPoint_2[triangleIndex]);
                            } else {
                                //startAngle to endAngle
                                this._generateTriangle(data, offset, center, vertPos[triangle[0]], vertPos[triangle[1]]);
                            }
                            offset += 3;
                        } else {
                            //startAngle < fillStart
                            if(endAngle <= fillStart) {
                                //all out
                            } else if(endAngle <= fillEnd) {
                                renderData.dataLength = offset + 3;
                                //fillStart to endAngle
                                this._generateTriangle(data, offset, center, this._intersectPoint_1[triangleIndex], vertPos[triangle[1]]);
                                offset += 3;
                            } else {
                                renderData.dataLength = offset + 3;
                                //fillStart to fillEnd
                                this._generateTriangle(data, offset, center, this._intersectPoint_1[triangleIndex], this._intersectPoint_2[triangleIndex]);
                                offset += 3;
                            }
                        }
                        //add 2 * PI
                        startAngle += PI_2;
                        endAngle += PI_2;
                    }
                }

                renderData.indiceCount = renderData.vertexCount = offset;
                renderData.vertDirty = renderData.uvDirty = false;
            }
        }
        return sprite.__allocedDatas;
    },

    _getVertAngle: function(start, end) {
        let placementX, placementY;
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
            let angle = Math.atan(placementY / placementX);
            if(placementX < 0) {
                angle += Math.PI;
            }

            return angle;
        }
    },

    _generateTriangle: function(data, offset, vert0, vert1, vert2) {
        let vertices = this._vertices;
        let v0x = vertices[0];
        let v0y = vertices[1];
        let v1x = vertices[2];
        let v1y = vertices[3];

        data[offset].x    = vert0.x;
        data[offset].y    = vert0.y;
        data[offset+1].x  = vert1.x;
        data[offset+1].y  = vert1.y;
        data[offset+2].x  = vert2.x;
        data[offset+2].y  = vert2.y;

        let progressX, progressY;
        progressX = (vert0.x - v0x) / (v1x - v0x);
        progressY = (vert0.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, data, offset);

        progressX = (vert1.x - v0x) / (v1x - v0x);
        progressY = (vert1.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, data, offset + 1);

        progressX = (vert2.x - v0x) / (v1x - v0x);
        progressY = (vert2.y - v0y) / (v1y - v0y);
        this._generateUV(progressX, progressY, data, offset + 2);
    },

    _generateUV : function(progressX, progressY, data, offset) {
        let uvs = this._uvs;
        let px1 = uvs[0] + (uvs[2] - uvs[0]) * progressX;
        let px2 = uvs[4] + (uvs[6] - uvs[4]) * progressX;
        let py1 = uvs[1] + (uvs[3] - uvs[1]) * progressX;
        let py2 = uvs[5] + (uvs[7] - uvs[5]) * progressX;
        let uv = data[offset];
        uv.u = px1 + (px2 - px1) * progressY;
        uv.v = py1 + (py2 - py1) * progressY;
    },

    _calcInsectedPoints: function(left, right, bottom, top, center, angle, intersectPoints) {
        //left bottom, right, top
        let sinAngle = Math.sin(angle);
        let cosAngle = Math.cos(angle);
        let tanAngle,cotAngle;
        if(Math.cos(angle) !== 0) {
            tanAngle = sinAngle / cosAngle;
            //calculate right and left
            if((left - center.x) * cosAngle > 0) {
                let yleft = center.y + tanAngle * (left - center.x);
                intersectPoints[0].x = left;
                intersectPoints[0].y = yleft;
            }
            if((right - center.x) * cosAngle > 0) {
                let yright = center.y + tanAngle * (right - center.x);

                intersectPoints[2].x = right;
                intersectPoints[2].y = yright;
            }

        }

        if(Math.sin(angle) !== 0) {
            cotAngle = cosAngle / sinAngle;
            //calculate  top and bottom
            if((top - center.y) * sinAngle > 0) {
                let xtop = center.x  + cotAngle * (top-center.y);
                intersectPoints[3].x = xtop;
                intersectPoints[3].y = top;
            }
            if((bottom - center.y) * sinAngle > 0) {
                let xbottom = center.x  + cotAngle * (bottom-center.y);
                intersectPoints[1].x = xbottom;
                intersectPoints[1].y = bottom;
            }

        }
    },

    _calculateVertices : function (sprite) {
        let node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;

        let l = -appx, b = -appy,
            r = width-appx, t = height-appy;

        let vertices = this._vertices;
        vertices[0] = l;
        vertices[1] = b;
        vertices[2] = r;
        vertices[3] = t;

        let center = this._center,
            fillCenter = sprite._fillCenter,
            cx = center.x = Math.min(Math.max(0, fillCenter.x), 1) * (r-l) + l,
            cy = center.y = Math.min(Math.max(0, fillCenter.y), 1) * (t-b) + b;

        let vertPos = this._vertPos;
        vertPos[0].x = vertPos[3].x = l;
        vertPos[1].x = vertPos[2].x = r;
        vertPos[0].y = vertPos[1].y = b;
        vertPos[2].y = vertPos[3].y = t;

        let triangles = this._triangles;
        triangles.length = 0;
        if(cx !== vertices[0]) {
            triangles[0] = [3, 0];
        }
        if(cx !== vertices[2]) {
            triangles[2] = [1, 2];
        }
        if(cy !== vertices[1]) {
            triangles[1] = [0, 1];
        }
        if(cy !== vertices[3]) {
            triangles[3] = [2, 3];
        }
    },

    _calculateUVs : function (spriteFrame) {
        let atlasWidth = spriteFrame._texture.width;
        let atlasHeight = spriteFrame._texture.height;
        let textureRect = spriteFrame._rect;

        let u0, u1, v0, v1;
        let uvs = this._uvs;
        
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
    },

    fillBuffers (sprite, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let vertexOffset = batchData.byteOffset / 4,
            indiceOffset = batchData.indiceOffset;

        let data = sprite._renderData._data;
        let node = sprite.node;
        let z = node._position.z;
        let color = node._color._val;
    
        let matrix = node._worldMatrix;
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        let count = data.length;
        for (let i = 0; i < count; i++) {
            let vert = data[i];
            vbuf[vertexOffset ++] = vert.x * a + vert.y * c + tx;
            vbuf[vertexOffset ++] = vert.x * b + vert.y * d + ty;
            vbuf[vertexOffset ++] = z;
            uintbuf[vertexOffset ++] = color;
            vbuf[vertexOffset ++] = vert.u;
            vbuf[vertexOffset ++] = vert.v;
        }

        for (let i = 0; i < count; i++) {
            ibuf[indiceOffset+i] = vertexId+i;
        }
    },
};
