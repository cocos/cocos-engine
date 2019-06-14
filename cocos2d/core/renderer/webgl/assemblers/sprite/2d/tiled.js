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

const FlexBuffer = require('../../../flex-buffer');

export default class TiledFilledAssembler extends Assembler2D {
    initData (sprite) {
        this._renderData._local = { x: [], y: []};

        this.verticesCount = 0;
        this.contentWidth = 0;
        this.contentHeight = 0;
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.hRepeat = 0;
        this.vRepeat = 0;
        this.row = 0;
        this.col = 0;
    }

    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        if (!frame) return;

        this.packToDynamicAtlas(sprite, frame);

        let node = sprite.node;
        let renderData = this._renderData;

        let contentWidth = this.contentWidth = Math.abs(node.width);
        let contentHeight = this.contentHeight = Math.abs(node.height);
        let rect = frame._rect;
        let rectWidth = this.rectWidth = rect.width;
        let rectHeight = this.rectHeight = rect.height;
        let hRepeat = this.hRepeat = contentWidth / rectWidth;
        let vRepeat = this.vRepeat = contentHeight / rectHeight;
        let row = this.row = Math.ceil(vRepeat);
        let col = this.col = Math.ceil(hRepeat);

        // update data property
        let count = row * col;
        let verticesCount = count * 4;
        let vBytes = verticesCount * this.floatsPerVert * 4;
        let iBytes = count * 6 * 2;
        let bytes = vBytes + iBytes;
        let needUpdateArray = false;
        if (!renderData._flexBuffer) {
            renderData._flexBuffer = new FlexBuffer(bytes);
            needUpdateArray = true;
        }
        else {
            needUpdateArray = renderData._flexBuffer.reserve(bytes);
        }

        let buffer = renderData._flexBuffer.buffer;
        if (needUpdateArray || verticesCount != this.verticesCount) {
            this.verticesCount = verticesCount
            let vertices = new Float32Array(buffer, 0, vBytes / 4);
            let indices = new Uint16Array(buffer, vBytes, iBytes / 2);
            for (let i = 0, vid = 0; i < indices.length; i += 6, vid += 4) {
                indices[i] = vid;
                indices[i + 1] = vid + 1;
                indices[i + 2] = vid + 2;
                indices[i + 3] = vid + 1;
                indices[i + 4] = vid + 3;
                indices[i + 5] = vid + 2;
            }
            renderData.updateMesh(0, vertices, indices);

            this.updateColor(sprite);
        }

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    }

    updateVerts (sprite) {
        let renderData = this._renderData,
            node = sprite.node,
            appx = node.anchorX * node.width, appy = node.anchorY * node.height;

        let { row, col, rectWidth, rectHeight, contentWidth, contentHeight } = this;
        let { x, y } = renderData._local;
        x.length = y.length = 0;
        for (let i = 0; i <= col; ++i) {
            x[i] = Math.min(rectWidth * i, contentWidth) - appx;
        }
        for (let i = 0; i <= row; ++i) {
            y[i] = Math.min(rectHeight * i, contentHeight) - appy;
        }

        this.updateWorldVerts(sprite);
    }
    
    updateWorldVerts (sprite) {
        let renderData = this._renderData;
        let local = renderData._local;
        let localX = local.x, localY = local.y;
        let world = renderData.vDatas[0];
        let { row, col } = this;
        let matrix = sprite.node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

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

        let { row, col, hRepeat, vRepeat } = this;
        let uv = sprite.spriteFrame.uv;
        let rotated = sprite.spriteFrame._rotated;
        let floatsPerVert = this.floatsPerVert, uvOffset = this.uvOffset;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            let coefv = Math.min(1, vRepeat - yindex);
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                let coefu = Math.min(1, hRepeat - xindex);

                // UV
                if (rotated) {
                    // lb
                    verts[uvOffset] = uv[0];
                    verts[uvOffset + 1] = uv[1];
                    uvOffset += floatsPerVert;
                    // rb
                    verts[uvOffset] = uv[0];
                    verts[uvOffset + 1] = uv[1] + (uv[7] - uv[1]) * coefu;
                    uvOffset += floatsPerVert;
                    // lt
                    verts[uvOffset] = uv[0] + (uv[6] - uv[0]) * coefv;
                    verts[uvOffset + 1] = uv[1];
                    uvOffset += floatsPerVert;
                    // rt
                    verts[uvOffset] = verts[uvOffset - floatsPerVert];
                    verts[uvOffset + 1] = verts[uvOffset + 1 - floatsPerVert * 2];
                    uvOffset += floatsPerVert;
                }
                else {
                    // lb
                    verts[uvOffset] = uv[0];
                    verts[uvOffset + 1] = uv[1];
                    uvOffset += floatsPerVert;
                    // rb
                    verts[uvOffset] = uv[0] + (uv[6] - uv[0]) * coefu;
                    verts[uvOffset + 1] = uv[1];
                    uvOffset += floatsPerVert;
                    // lt
                    verts[uvOffset] = uv[0];
                    verts[uvOffset + 1] = uv[1] + (uv[7] - uv[1]) * coefv;
                    uvOffset += floatsPerVert;
                    // rt
                    verts[uvOffset] = verts[uvOffset - floatsPerVert * 2];
                    verts[uvOffset + 1] = verts[uvOffset + 1 - floatsPerVert];
                    uvOffset += floatsPerVert;
                }
            }
        }
    }
}

