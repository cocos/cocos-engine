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

export default class TiledAssembler extends Assembler2D {
    initData (sprite) {
        this.verticesCount = 0;
        this.contentWidth = 0;
        this.contentHeight = 0;
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.hRepeat = 0;
        this.vRepeat = 0;
        this.row = 0;
        this.col = 0;

        this._renderData.createFlexData(0, 4, 6, this.getVfmt());
        this._updateIndices();
    }

    initLocal () {
        this._local = { x: [], y: []};
    }

    _updateIndices () {
        let iData = this._renderData.iDatas[0];
        for (let i = 0, vid = 0, l = iData.length; i < l; i += 6, vid += 4) {
            iData[i] = vid;
            iData[i + 1] = vid + 1;
            iData[i + 2] = vid + 2;
            iData[i + 3] = vid + 1;
            iData[i + 4] = vid + 3;
            iData[i + 5] = vid + 2;
        }
    }

    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        this.packToDynamicAtlas(sprite, frame);

        let node = sprite.node;

        let contentWidth = this.contentWidth = Math.abs(node.width);
        let contentHeight = this.contentHeight = Math.abs(node.height);
        let rect = frame._rect;
        let leftWidth = frame.insetLeft, rightWidth = frame.insetRight, centerWidth = rect.width - leftWidth - rightWidth,
            topHeight = frame.insetTop, bottomHeight = frame.insetBottom, centerHeight = rect.height - topHeight - bottomHeight;
        this.sizableWidth = contentWidth - leftWidth - rightWidth;
        this.sizableHeight = contentHeight - topHeight - bottomHeight;
        this.sizableWidth = this.sizableWidth > 0 ? this.sizableWidth : 0;
        this.sizableHeight = this.sizableHeight > 0 ? this.sizableHeight : 0;
        let hRepeat = this.hRepeat = centerWidth === 0 ? this.sizableWidth : this.sizableWidth / centerWidth;
        let vRepeat = this.vRepeat = centerHeight === 0 ? this.sizableHeight : this.sizableHeight / centerHeight;
        let row = this.row = Math.ceil(vRepeat + 2);
        let col = this.col = Math.ceil(hRepeat + 2);

        // update data property
        let count = row * col;
        this.verticesCount = count * 4;
        this.indicesCount = count * 6;

        let renderData = this._renderData;
        let flexBuffer = renderData._flexBuffer;
        if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
            this._updateIndices();
            this.updateColor(sprite);
        }
        flexBuffer.used(this.verticesCount, this.indicesCount);

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    }

    updateVerts (sprite) {
        let frame = sprite._spriteFrame;
        let rect = frame._rect;
        let node = sprite.node,
            appx = node.anchorX * node.width, appy = node.anchorY * node.height;

        let { row, col, contentWidth, contentHeight } = this;
        let { x, y } = this._local;
        x.length = y.length = 0;
        let leftWidth = frame.insetLeft, rightWidth = frame.insetRight, centerWidth = rect.width - leftWidth - rightWidth,
            topHeight = frame.insetTop, bottomHeight = frame.insetBottom, centerHeight = rect.height - topHeight - bottomHeight;
        let xScale = (node.width / (leftWidth + rightWidth)) > 1 ? 1 : (node.width / (leftWidth + rightWidth));
        let yScale = (node.height / (topHeight + bottomHeight)) > 1 ? 1 : (node.height / (topHeight + bottomHeight));
        let offsetWidth = 0, offsetHeight = 0;
        if (centerWidth > 0) {
            /*
             * Because the float numerical calculation in javascript is not accurate enough, 
             * there is an expected result of 1.0, but the actual result is 1.000001.
             */
            offsetWidth = Math.floor(this.sizableWidth * 1000) / 1000 % centerWidth === 0 ? centerWidth : this.sizableWidth % centerWidth;
        }
        else {
            offsetWidth = this.sizableWidth;
        }
        if (centerHeight > 0) {
            offsetHeight = Math.floor(this.sizableHeight * 1000) / 1000 % centerHeight === 0 ? centerHeight : this.sizableHeight % centerHeight;
        }
        else {
            offsetHeight = this.sizableHeight;
        }

        for (let i = 0; i <= col; i++) {
            if (i === 0) {
                x[i] = - appx;
            }
            else if (i > 0 && i < col) {
                if (i === 1) {
                    x[i] = leftWidth * xScale + Math.min(centerWidth, this.sizableWidth) - appx;
                }
                else {
                    if (centerWidth > 0) {
                        if (i === (col - 1)) {
                            x[i] = leftWidth + offsetWidth + centerWidth * (i - 2) - appx;
                        }
                        else {
                            x[i] = leftWidth + Math.min(centerWidth, this.sizableWidth) + centerWidth * (i - 2) - appx;
                        }
                    }
                    else {
                        x[i] = leftWidth + this.sizableWidth - appx;
                    }
                }
            }
            else if (i === col) {
                x[i] = Math.min(leftWidth + this.sizableWidth + rightWidth, contentWidth) - appx;
            }
        }
        for (let i = 0; i <= row; i++) {
            if (i === 0) {
                y[i] = - appy;
            }
            else if (i > 0 && i < row) {
                if (i === 1) {
                    y[i] = bottomHeight * yScale + Math.min(centerHeight, this.sizableHeight) - appy;
                }
                else {
                    if (centerHeight > 0) {
                        if (i === (row - 1)) {
                            y[i] = bottomHeight + offsetHeight + (i - 2) * centerHeight - appy;
                        }
                        else {
                            y[i] = bottomHeight + Math.min(centerHeight, this.sizableHeight) + (i - 2) * centerHeight - appy;
                        }
                    }
                    else {
                        y[i] = bottomHeight + this.sizableHeight - appy;
                    }
                }
            }
            else if (i === row) {
                y[i] = Math.min(bottomHeight + this.sizableHeight + topHeight, contentHeight) - appy;
            }
        }

        this.updateWorldVerts(sprite);
    }
    
    updateWorldVerts (sprite) {
        let renderData = this._renderData;
        let local = this._local;
        let localX = local.x, localY = local.y;
        let world = renderData.vDatas[0];
        let { row, col } = this;
        let matrix = sprite.node._worldMatrix;
        let matrixm = matrix.m;
        let a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let x, x1, y, y1;
        let floatsPerVert = this.floatsPerVert;
        let vertexOffset = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = localY[yindex];
            y1 = localY[yindex + 1];
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                x = localX[xindex];
                x1 = localX[xindex + 1];

                // lb
                world[vertexOffset] = x * a + y * c + tx;
                world[vertexOffset + 1] = x * b + y * d + ty;
                vertexOffset += floatsPerVert;
                // rb
                world[vertexOffset] = x1 * a + y * c + tx;
                world[vertexOffset + 1] = x1 * b + y * d + ty;
                vertexOffset += floatsPerVert;
                // lt
                world[vertexOffset] = x * a + y1 * c + tx;
                world[vertexOffset + 1] = x * b + y1 * d + ty;
                vertexOffset += floatsPerVert;
                // rt
                world[vertexOffset] = x1 * a + y1 * c + tx;
                world[vertexOffset + 1] = x1 * b + y1 * d + ty;
                vertexOffset += floatsPerVert;
            }
        }
    }

    updateUVs (sprite) {
        let verts = this._renderData.vDatas[0];
        if (!verts) return;
        
        let frame = sprite._spriteFrame;
        let rect = frame._rect;
        let leftWidth = frame.insetLeft, rightWidth = frame.insetRight, centerWidth = rect.width - leftWidth - rightWidth,
            topHeight = frame.insetTop, bottomHeight = frame.insetBottom, centerHeight = rect.height - topHeight - bottomHeight;

        let { row, col, hRepeat, vRepeat } = this;
        let coefu = 0, coefv = 0;
        let uv = sprite.spriteFrame.uv;
        let uvSliced = sprite.spriteFrame.uvSliced;
        let rotated = sprite.spriteFrame._rotated;
        let floatsPerVert = this.floatsPerVert, uvOffset = this.uvOffset;
        let tempXVerts = [], tempYVerts = [];
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            if (this.sizableHeight > centerHeight) {
                if (this.sizableHeight >= yindex * centerHeight) {
                    coefv = 1;
                }
                else {
                    coefv = vRepeat % 1;
                }
            }
            else {
                coefv = vRepeat;
            }
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                if (this.sizableWidth > centerWidth) {
                    if (this.sizableWidth >= xindex * centerWidth) {
                        coefu = 1;
                    }
                    else {
                        coefu = hRepeat % 1;
                    }
                }
                else {
                    coefu = hRepeat;
                }

                if (rotated) {
                    if (yindex === 0) {
                        tempXVerts[0] = uvSliced[0].u;
                        tempXVerts[1] = uvSliced[0].u;
                        tempXVerts[2] = uvSliced[4].u + (uvSliced[8].u - uvSliced[4].u) * coefv;
                    } else if (yindex < (row - 1)) {
                        tempXVerts[0] = uvSliced[4].u;
                        tempXVerts[1] = uvSliced[4].u;
                        tempXVerts[2] = uvSliced[4].u + (uvSliced[8].u - uvSliced[4].u) * coefv;
                    } else if (yindex === (row - 1)) {
                        tempXVerts[0] = uvSliced[8].u;
                        tempXVerts[1] = uvSliced[8].u;
                        tempXVerts[2] = uvSliced[12].u;
                    }
                    if (xindex === 0) {
                        tempYVerts[0] = uvSliced[0].v;
                        tempYVerts[1] = uvSliced[1].v + (uvSliced[2].v - uvSliced[1].v) * coefu;
                        tempYVerts[2] = uvSliced[0].v;
                    } else if (xindex < (col - 1)) {
                        tempYVerts[0] = uvSliced[1].v;
                        tempYVerts[1] = uvSliced[1].v + (uvSliced[2].v - uvSliced[1].v) * coefu;
                        tempYVerts[2] = uvSliced[1].v;
                    } else if (xindex === (col - 1)) {
                        tempYVerts[0] = uvSliced[2].v;
                        tempYVerts[1] = uvSliced[3].v;
                        tempYVerts[2] = uvSliced[2].v;
                    }
                    tempXVerts[3] = tempXVerts[2];
                    tempYVerts[3] = tempYVerts[1];
                }
                else {
                    if (xindex === 0) {
                        tempXVerts[0] = uvSliced[0].u;
                        tempXVerts[1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefu;
                        tempXVerts[2] = uv[0];
                    } else if (xindex < (col - 1)) {
                        tempXVerts[0] = uvSliced[1].u;
                        tempXVerts[1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefu;
                        tempXVerts[2] = uvSliced[1].u;
                    } else if (xindex === (col - 1)) {
                        tempXVerts[0] = uvSliced[2].u;
                        tempXVerts[1] = uvSliced[3].u;
                        tempXVerts[2] = uvSliced[2].u;
                    }
                    if (yindex === 0) {
                        tempYVerts[0] = uvSliced[0].v;
                        tempYVerts[1] = uvSliced[0].v;
                        tempYVerts[2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefv;
                    } else if (yindex < (row - 1)) {
                        tempYVerts[0] = uvSliced[4].v;
                        tempYVerts[1] = uvSliced[4].v;
                        tempYVerts[2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefv;
                    } else if (yindex === (row - 1)) {
                        tempYVerts[0] = uvSliced[8].v;
                        tempYVerts[1] = uvSliced[8].v;
                        tempYVerts[2] = uvSliced[12].v;
                    }
                    tempXVerts[3] = tempXVerts[1];
                    tempYVerts[3] = tempYVerts[2];
                }
                // lb
                verts[uvOffset] = tempXVerts[0];
                verts[uvOffset + 1] = tempYVerts[0];
                uvOffset += floatsPerVert;
                // rb
                verts[uvOffset] = tempXVerts[1];
                verts[uvOffset + 1] = tempYVerts[1];
                uvOffset += floatsPerVert;
                // lt
                verts[uvOffset] = tempXVerts[2];
                verts[uvOffset + 1] = tempYVerts[2];
                uvOffset += floatsPerVert;
                // rt
                verts[uvOffset] = tempXVerts[3];
                verts[uvOffset + 1] = tempYVerts[3];
                uvOffset += floatsPerVert;
            }
        }
    }
}

