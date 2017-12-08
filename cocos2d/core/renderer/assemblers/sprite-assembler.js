/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const Sprite = require('../../components/CCSprite');
const renderEngine = require('../render-engine');
const SpriteType = Sprite.Type;
const FillType = Sprite.FillType;
const RenderData = renderEngine.RenderData;
const math = renderEngine.math;
const PI_2 = Math.PI * 2;

let simpleRenderUtil = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },

    update (sprite) {
        let renderData = sprite._renderData;
        if (renderData.uvDirty) {
            this.updateUVs(sprite);
        }
        if (renderData.vertDirty) {
            this.updateVerts(sprite);
        }
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        let renderData = sprite._renderData;
        if (effect && renderData) {
            let data = renderData._data;
            let texture = effect.getValue('texture');
            let texw = texture._width,
                texh = texture._height;
            let frame = sprite.spriteFrame;
            let rect = frame._rect;
            let l, b, r, t;
      
            if (sprite.trim) {
                l = rect.x;
                t = rect.y;
                r = rect.x + rect.width;
                b = rect.y + rect.height;
            } else {
                let originalSize = frame._originalSize;
                let offset = frame._offset;
                let ow = originalSize.width,
                    oh = originalSize.height,
                    rw = rect.width,
                    rh = rect.height;
                let ox = rect.x + (rw - ow) / 2 - offset.x;
                let oy = rect.y + (rh - oh) / 2 - offset.y;
        
                l = ox;
                t = oy;
                r = ox + ow;
                b = oy + oh;
            }
            
            l = texw === 0 ? 0 : l / texw;
            r = texw === 0 ? 0 : r / texw;
            b = texh === 0 ? 0 : b / texh;
            t = texh === 0 ? 0 : t / texh;
            
            if (frame._rotated) {
                data[0].u = l;
                data[0].v = t;
                data[1].u = l;
                data[1].v = b;
                data[2].u = r;
                data[2].v = t;
                data[3].u = r;
                data[3].v = b;
            }
            else {
                data[0].u = l;
                data[0].v = b;
                data[1].u = r;
                data[1].v = b;
                data[2].u = l;
                data[2].v = t;
                data[3].u = r;
                data[3].v = t;
            }
            
            renderData.uvDirty = false;
        }
    },

    updateVerts (sprite) {
        let renderData = sprite._renderData,
            data = renderData._data,
            frame = sprite.spriteFrame,
            width, height;
        if (sprite.trim) {
            width = frame._rect.width;
            height = frame._rect.height;
        }
        else {
            width = frame._originalSize.width;
            height = frame._originalSize.height;
        }
            
        let appx = renderData._pivotX * width,
            appy = renderData._pivotY * height;
        
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = width - appx;
        data[1].y = -appy;
        data[2].x = -appx;
        data[2].y = height - appy;
        data[3].x = width - appx;
        data[3].y = height - appy;

        renderData.vertDirty = false;
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let off = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let renderData = sprite._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = node._color._val;
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;
    
        let vert;
        let length = renderData.dataLength;
        for (let i = 0; i < length; i++) {
            vert = data[i];
            vbuf[off + 0] = vert.x * a + vert.y * c + tx;
            vbuf[off + 1] = vert.x * b + vert.y * d + ty;
            vbuf[off + 2] = z;
            vbuf[off + 4] = vert.u;
            vbuf[off + 5] = vert.v;
            uintbuf[off + 3] = color;
            off += 6;
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        ibuf[offset + 0] = vertexId;
        ibuf[offset + 1] = vertexId + 1;
        ibuf[offset + 2] = vertexId + 2;
        ibuf[offset + 3] = vertexId + 1;
        ibuf[offset + 4] = vertexId + 3;
        ibuf[offset + 5] = vertexId + 2;
    }
};

let slicedRenderUtil = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.dataLength = 4;
        renderData.vertexCount = 16;
        renderData.indiceCount = 54;
        return renderData;
    },
    
    update (sprite) {
        let renderData = sprite._renderData;
        if (renderData.uvDirty) {
            this.updateUVs(sprite);
        }
        if (renderData.vertDirty) {
            this.updateVerts(sprite);
        }
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        let renderData = sprite._renderData;
        if (effect && renderData) {
            let texture = effect.getValue('texture');
            let frame = sprite.spriteFrame;
            let rect = frame._rect;
            let atlasWidth = texture._width;
            let atlasHeight = texture._height;
        
            // caculate texture coordinate
            let leftWidth = frame.insetLeft;
            let rightWidth = frame.insetRight;
            let centerWidth = rect.width - leftWidth - rightWidth;
            let topHeight = frame.insetTop;
            let bottomHeight = frame.insetBottom;
            let centerHeight = rect.height - topHeight - bottomHeight;
        
            // uv computation should take spritesheet into account.
            let data = renderData._data;
            if (frame._rotated) {
                data[0].u = (rect.x) / atlasWidth;
                data[0].v = (rect.y) / atlasHeight;
                data[1].u = (bottomHeight + rect.x) / atlasWidth;
                data[1].v = (leftWidth + rect.y) / atlasHeight;
                data[2].u = (bottomHeight + centerHeight + rect.x) / atlasWidth;
                data[2].v = (leftWidth + centerWidth + rect.y) / atlasHeight;
                data[3].u = (rect.x + rect.height) / atlasWidth;
                data[3].v = (rect.y + rect.width) / atlasHeight;
            }
            else {
                data[0].u = (rect.x) / atlasWidth;
                data[1].u = (leftWidth + rect.x) / atlasWidth;
                data[2].u = (leftWidth + centerWidth + rect.x) / atlasWidth;
                data[3].u = (rect.x + rect.width) / atlasWidth;
                data[3].v = (rect.y) / atlasHeight;
                data[2].v = (topHeight + rect.y) / atlasHeight;
                data[1].v = (topHeight + centerHeight + rect.y) / atlasHeight;
                data[0].v = (rect.y + rect.height) / atlasHeight;
            }
            renderData.uvDirty = false;
        }
    },
    
    updateVerts (sprite) {
        let renderData = sprite._renderData,
            data = renderData._data,
            width = renderData._width,
            height = renderData._height,
            appx = renderData._pivotX * width, 
            appy = renderData._pivotY * height;
    
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        let leftWidth = frame.insetLeft;
        let rightWidth = frame.insetRight;
        let topHeight = frame.insetTop;
        let bottomHeight = frame.insetBottom;
    
        let sizableWidth = width - leftWidth - rightWidth;
        let sizableHeight = height - topHeight - bottomHeight;
        let xScale = width / (leftWidth + rightWidth);
        let yScale = height / (topHeight + bottomHeight);
        xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = leftWidth * xScale - appx;
        data[1].y = bottomHeight * yScale - appy;
        data[2].x = data[1].x + sizableWidth;
        data[2].y = data[1].y + sizableHeight;
        data[3].x = width - appx;
        data[3].y = height - appy;

        renderData.vertDirty = false;
    },
    
    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let offset = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let renderData = sprite._renderData;
        let data = renderData._data;
        let z = node._position.z;
        
        let color = node._color._val;
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;

        let colD, rowD;
        for (let row = 0; row < 4; ++row) {
            rowD = data[row];
            for (let col = 0; col < 4; ++col) {
                colD = data[col];
                vbuf[offset] = colD.x*a + rowD.y*c + tx;
                vbuf[offset + 1] = colD.x*b + rowD.y*d + ty;
                vbuf[offset + 2] = z;
                uintbuf[offset + 3] = color;
                vbuf[offset + 4] = colD.u;
                vbuf[offset + 5] = rowD.v;
                offset += 6;
            }
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = vertexId + r*4 + c;
                ibuf[offset++] = start;
                ibuf[offset++] = start + 1;
                ibuf[offset++] = start + 4;
                ibuf[offset++] = start + 1;
                ibuf[offset++] = start + 5;
                ibuf[offset++] = start + 4;
            }
        }
    }
};

let tiledRenderUtil = {
    createData (sprite) {
        return RenderData.alloc();
    },

    update (sprite) {
        let renderData = sprite._renderData;
        if (!renderData.uvDirty && !renderData.vertDirty) return;

        let effect = sprite.getEffect();
        if (!effect || !renderData) return;

        let texture = effect.getValue('texture');
        let texw = texture._width,
            texh = texture._height;
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        let contentWidth = Math.abs(renderData._width);
        let contentHeight = Math.abs(renderData._height);

        let rectWidth = rect.width;
        let rectHeight = rect.height;
        let hRepeat = contentWidth / rectWidth;
        let vRepeat = contentHeight / rectHeight;
        let row = Math.ceil(vRepeat), 
            col = Math.ceil(hRepeat);

        let data = renderData._data;
        renderData.dataLength = Math.max(8, row+1, col+1);

        let l, b, r, t;
        if (!frame._rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            data[0].u = l;
            data[0].v = b;
            data[1].u = r;
            data[1].v = b;
            data[2].u = l;
            data[2].v = t;
            data[3].u = r;
            data[3].v = t;
            
            data[4].u = l;
            data[4].v = b;
            data[5].u = l + (r-l) * Math.min(1, hRepeat - col + 1);
            data[5].v = b;
            data[6].u = l;
            data[6].v = b + (t-b) * Math.min(1, vRepeat - row + 1);
            data[7].u = data[5].u;
            data[7].v = data[6].v;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            data[0].u = l;
            data[0].v = t;
            data[1].u = l;
            data[1].v = b;
            data[2].u = r;
            data[2].v = t;
            data[3].u = r;
            data[3].v = b;

            data[4].u = l;
            data[4].v = t;
            data[5].u = l;
            data[5].v = t + (b - t) * Math.min(1, vRepeat - col + 1);
            data[6].u = l + (r - l) * Math.min(1, hRepeat - row + 1);
            data[6].v = t;
            data[7].u = data[5].u;
            data[7].v = data[6].v;
        }

        let appx = renderData._pivotX * contentWidth,
            appy = renderData._pivotY * contentHeight;

        for (let i = 0; i <= col; ++i) {
            data[i].x = Math.min(rectWidth * i, contentWidth) - appx;
        }

        for (let i = 0; i <= row; ++i) {
            data[i].y = Math.min(rectHeight * i, contentHeight) - appy;
        }
        
        // update data property
        renderData.vertexCount = row * col * 4;
        renderData.indiceCount = row * col * 6;
        renderData.uvDirty = false;
        renderData.vertDirty = false;
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let off = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let renderData = sprite._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = node._color._val;

        let rect = sprite.spriteFrame._rect;
        let contentWidth = Math.abs(renderData._width);
        let contentHeight = Math.abs(renderData._height);
        let hRepeat = contentWidth / rect.width;
        let vRepeat = contentHeight / rect.height;
        let row = Math.ceil(vRepeat), 
            col = Math.ceil(hRepeat);
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;

        let x, x1, y, y1, lastx, lasty;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = data[yindex].y;
            y1 = data[yindex+1].y;
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                lasty = yindex + 1 === ylength;
                lastx = xindex + 1 === xlength;
                x = data[xindex].x;
                x1 = data[xindex+1].x;

                // lb
                vbuf[off++] = x * a + y * c + tx;
                vbuf[off++] = x * b + y * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? data[4].u : data[0].u;
                vbuf[off++] = lasty ? data[4].v : data[0].v;

                // rb
                vbuf[off++] = x1 * a + y * c + tx;
                vbuf[off++] = x1 * b + y * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? data[5].u : data[1].u;
                vbuf[off++] = lasty ? data[5].v : data[1].v;

                // lt
                vbuf[off++] = x * a + y1 * c + tx;
                vbuf[off++] = x * b + y1 * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? data[6].u : data[2].u;
                vbuf[off++] = lasty ? data[6].v : data[2].v;

                // rt
                vbuf[off++] = x1 * a + y1 * c + tx;
                vbuf[off++] = x1 * b + y1 * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? data[7].u : data[3].u;
                vbuf[off++] = lasty ? data[7].v : data[3].v;
            }
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        let renderData = sprite._renderData;
        let length = renderData.indiceCount;
        for (let i = 0; i < length; i+=6) {
            ibuf[offset++] = vertexId;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+2;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+3;
            ibuf[offset++] = vertexId+2;
            vertexId += 4;
        }
    }
};


let radialFilledRenderUtil = {
    _vertPos: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _vertices: [0, 0, 0, 0],
    _uvs: [0, 0, 0, 0, 0, 0, 0, 0],
    _intersectPoint_1: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _intersectPoint_2: [cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0)],
    _center: cc.v2(0, 0),
    _triangles: [],

    createData (sprite) {
        return RenderData.alloc();
    },

    update (sprite) {
        let renderData = sprite._renderData;
        if (!renderData.vertDirty && !renderData.uvDirty) return;

        let data = renderData._data;
        let spriteFrame = sprite._spriteFrame;

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
        this._calculateUVs(spriteFrame);

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
        let renderData = sprite._renderData,
            width = renderData._width,
            height = renderData._height,
            appx = renderData._pivotX * width,
            appy = renderData._pivotY * height;

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

    fillVertexBuffer: simpleRenderUtil.fillVertexBuffer,

    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        let renderData = sprite._renderData;
        for (let i = 0, l = renderData.vertexCount; i < l; i++) {
            ibuf[offset+i] = vertexId+i;
        }
    }
};

let barFilledRenderUtil = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },
    
    update (sprite) {
        let renderData = sprite._renderData;
        let uvDirty = renderData.uvDirty,
            vertDirty = renderData.vertDirty;

        if (!uvDirty && !vertDirty) return;

        let fillStart = sprite._fillStart;
        let fillRange = sprite._fillRange;

        if (fillRange < 0) {
            fillStart += fillRange;
            fillRange = -fillRange;
        }

        fillRange = fillStart + fillRange;

        fillStart = fillStart > 1.0 ? 1.0 : fillStart;
        fillStart = fillStart < 0.0 ? 0.0 : fillStart;

        fillRange = fillRange > 1.0 ? 1.0 : fillRange;
        fillRange = fillRange < 0.0 ? 0.0 : fillRange;
        fillRange = fillRange - fillStart;
        fillRange = fillRange < 0 ? 0 : fillRange;
        
        let fillEnd = fillStart + fillRange;
        fillEnd = fillEnd > 1 ? 1 : fillEnd;

        if (uvDirty) {
            this.updateUVs(sprite, fillStart, fillEnd);
        }
        if (vertDirty) {
            this.updateVerts(sprite, fillStart, fillEnd);
        }
    },

    updateUVs (sprite, fillStart, fillEnd) {
        let spriteFrame = sprite._spriteFrame,
            renderData = sprite._renderData,
            data = renderData._data;

        //build uvs
        let atlasWidth = spriteFrame._texture.width;
        let atlasHeight = spriteFrame._texture.height;
        let textureRect = spriteFrame._rect;
        //uv computation should take spritesheet into account.
        let ul, vb, ur, vt;
        let quadUV0, quadUV1, quadUV2, quadUV3, quadUV4, quadUV5, quadUV6, quadUV7;
        if (spriteFrame._rotated) {
            ul = (textureRect.x) / atlasWidth;
            vb = (textureRect.y + textureRect.width) / atlasHeight;
            ur = (textureRect.x + textureRect.height) / atlasWidth;
            vt = (textureRect.y) / atlasHeight;

            quadUV0 = quadUV2 = ul;
            quadUV4 = quadUV6 = ur;
            quadUV3 = quadUV7 = vb;
            quadUV1 = quadUV5 = vt;
        }
        else {
            ul = (textureRect.x) / atlasWidth;
            vb = (textureRect.y + textureRect.height) / atlasHeight;
            ur = (textureRect.x + textureRect.width) / atlasWidth;
            vt = (textureRect.y) / atlasHeight;

            quadUV0 = quadUV4 = ul;
            quadUV2 = quadUV6 = ur;
            quadUV1 = quadUV3 = vb;
            quadUV5 = quadUV7 = vt;
        }

        switch (sprite._fillType) {
            case FillType.HORIZONTAL:
                data[0].u = quadUV0 + (quadUV2 - quadUV0) * fillStart;
                data[0].v = quadUV1;
                data[1].u = quadUV0 + (quadUV2 - quadUV0) * fillEnd;
                data[1].v = quadUV3;
                data[2].u = quadUV4 + (quadUV6 - quadUV4) * fillStart;
                data[2].v = quadUV5;
                data[3].u = quadUV4 + (quadUV6 - quadUV4) * fillEnd;
                data[3].v = quadUV7;
                break;
            case FillType.VERTICAL:
                data[0].u = quadUV0;
                data[0].v = quadUV1 + (quadUV5 - quadUV1) * fillStart;
                data[1].u = quadUV2;
                data[1].v = quadUV3 + (quadUV7 - quadUV3) * fillStart;
                data[2].u = quadUV4;
                data[2].v = quadUV1 + (quadUV5 - quadUV1) * fillEnd;
                data[3].u = quadUV6;
                data[3].v = quadUV3 + (quadUV7 - quadUV3) * fillEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }

        renderData.uvDirty = false;
    },
    updateVerts (sprite, fillStart, fillEnd) {
        let renderData = sprite._renderData,
            data = renderData._data,
            width = renderData._width,
            height = renderData._height,
            appx = renderData._pivotX * width,
            appy = renderData._pivotY * height;

        let l = -appx, b = -appy,
            r = width-appx, t = height-appy;

        let progressStart, progressEnd;
        switch (sprite._fillType) {
            case FillType.HORIZONTAL:
                progressStart = l + (r - l) * fillStart;
                progressEnd = l + (r - l) * fillEnd;

                l = progressStart;
                r = progressEnd;
                break;
            case FillType.VERTICAL:
                progressStart = b + (t - b) * fillStart;
                progressEnd = b + (t - b) * fillEnd;

                b = progressStart;
                t = progressEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }

        data[0].x = l;
        data[0].y = b;
        data[1].x = r;
        data[1].y = b;
        data[2].x = l;
        data[2].y = t;
        data[3].x = r;
        data[3].y = t;

        renderData.vertDirty = false;
    },

    fillVertexBuffer: simpleRenderUtil.fillVertexBuffer,
    fillIndexBuffer: simpleRenderUtil.fillIndexBuffer
};

let filledRenderUtil = {
    createData (sprite) {
        if (sprite._fillType === FillType.RADIAL) {
            return radialFilledRenderUtil.createData(sprite);
        }
        return barFilledRenderUtil.createData(sprite);
    },
    update (sprite) {
        if (sprite._fillType === FillType.RADIAL) {
            return radialFilledRenderUtil.update(sprite);
        }
        return barFilledRenderUtil.update(sprite);
    },
    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        if (sprite._fillType === FillType.RADIAL) {
            radialFilledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
        }
        barFilledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
    },
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        if (sprite._fillType === FillType.RADIAL) {
            radialFilledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
        }
        barFilledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
    }
};

// Inline all type switch to avoid jit deoptimization during inlined function change
var spriteAssembler = {
    updateRenderData (sprite) {
        // Create render data if needed
        if (!sprite._renderData) {
            switch (sprite.type) {
                case SpriteType.SIMPLE:
                    sprite._renderData = simpleRenderUtil.createData(sprite);
                    break;
                case SpriteType.SLICED:
                    sprite._renderData = slicedRenderUtil.createData(sprite);
                    break;
                case SpriteType.TILED:
                    sprite._renderData = tiledRenderUtil.createData(sprite);
                    break;
                case SpriteType.FILLED:
                    sprite._renderData = filledRenderUtil.createData(sprite);
                    break;
            }
        }

        let renderData = sprite._renderData;
        let size = sprite.node._contentSize;
        let anchor = sprite.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
        
        switch (sprite.type) {
            case SpriteType.SIMPLE:
                simpleRenderUtil.update(sprite);
                break;
            case SpriteType.SLICED:
                slicedRenderUtil.update(sprite);
                break;
            case SpriteType.TILED:
                tiledRenderUtil.update(sprite);
                break;
            case SpriteType.FILLED:
                filledRenderUtil.update(sprite);
                break;
        }
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        switch (sprite.type) {
            case SpriteType.SIMPLE:
                simpleRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
            case SpriteType.SLICED:
                slicedRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
            case SpriteType.TILED:
                tiledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
            case SpriteType.FILLED:
                filledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
        }
    },

    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        switch (sprite.type) {
            case SpriteType.SIMPLE:
                simpleRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
            case SpriteType.SLICED:
                slicedRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
            case SpriteType.TILED:
                tiledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
            case SpriteType.FILLED:
                filledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
        }
    }
}

Sprite._assembler = spriteAssembler;

module.exports = spriteAssembler;