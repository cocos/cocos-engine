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

const base = require('./base');
const spriteAssembler = require('../sprite');
const packToDynamicAtlas = require('../../../../utils/utils').packToDynamicAtlas;
const FlexBuffer = require('../../../flex-buffer');

module.exports = spriteAssembler.tiled = cc.js.addon({
    createData (sprite) {
        sprite._renderHandle._local = { x: [], y: []};
        sprite._renderHandle._infos = { lastCount: 0 };
    },

    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        if (!frame) return;

        packToDynamicAtlas(sprite, frame);

        let node = sprite.node;
        let renderHandle = sprite._renderHandle;
        let infos = renderHandle._infos;

        let contentWidth = infos.contentWidth = Math.abs(node.width);
        let contentHeight = infos.contentHeight = Math.abs(node.height);
        let rect = frame._rect;
        let rectWidth = infos.rectWidth = rect.width;
        let rectHeight = infos.rectHeight = rect.height;
        let hRepeat = infos.hRepeat = contentWidth / rectWidth;
        let vRepeat = infos.vRepeat = contentHeight / rectHeight;
        let row = infos.row = Math.ceil(vRepeat);
        let col = infos.col = Math.ceil(hRepeat);

        // update data property
        let count = row * col;
        let vBytes = count * 4 * this.floatsPerVert * 4;
        let iBytes = count * 6 * 2;
        let bytes = vBytes + iBytes;
        let needUpdateArray = false;
        if (!renderHandle._flexBuffer) {
            renderHandle._flexBuffer = new FlexBuffer(bytes);
            needUpdateArray = true;
        }
        else {
            needUpdateArray = renderHandle._flexBuffer.reserve(bytes);
        }

        let buffer = renderHandle._flexBuffer.buffer;
        if (needUpdateArray || infos.lastCount != count) {
            infos.lastCount = count;
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
            renderHandle.updateMesh(0, vertices, indices);
        }

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    },

    updateVerts (sprite) {
        let renderHandle = sprite._renderHandle,
            node = sprite.node,
            appx = node.anchorX * node.width, appy = node.anchorY * node.height;

        let { row, col, rectWidth, rectHeight, contentWidth, contentHeight } = renderHandle._infos;
        let { x, y } = renderHandle._local;
        x.length = y.length = 0;
        for (let i = 0; i <= col; ++i) {
            x[i] = Math.min(rectWidth * i, contentWidth) - appx;
        }
        for (let i = 0; i <= row; ++i) {
            y[i] = Math.min(rectHeight * i, contentHeight) - appy;
        }

        this.updateWorldVerts(sprite);
    },
    
    updateWorldVerts (sprite) {
        let renderHandle = sprite._renderHandle;
        let local = renderHandle._local;
        let localX = local.x, localY = local.y;
        let world = renderHandle.vDatas[0];
        let { row, col } = renderHandle._infos;
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
    },

    updateUVs (sprite) {
        let verts = sprite._renderHandle.vDatas[0];
        if (!verts) return;

        let { row, col, hRepeat, vRepeat } = sprite._renderHandle._infos;
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
    },
}, base);
