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

import Assembler2D from '../../../../assembler-2d';

export default class SlicedAssembler extends Assembler2D {
    initData (sprite) {
        if (this._renderData.meshCount > 0) return;
        this._renderData.createData(0, this.verticesFloats, this.indicesCount);

        let indices = this._renderData.iDatas[0];
        let indexOffset = 0;
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = r * 4 + c;
                indices[indexOffset++] = start;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + 4;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + 5;
                indices[indexOffset++] = start + 4;
            }
        }
    }

    initLocal () {
        this._local = [];
        this._local.length = 8;
    }

    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        if (!frame) return;
        this.packToDynamicAtlas(sprite, frame);

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    }

    updateVerts (sprite) {
        let node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;

        let frame = sprite.spriteFrame;
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

        // update local
        let local = this._local;
        local[0] = -appx;
        local[1] = -appy;
        local[2] = leftWidth * xScale - appx;
        local[3] = bottomHeight * yScale - appy;
        local[4] = local[2] + sizableWidth;
        local[5] = local[3] + sizableHeight;
        local[6] = width - appx;
        local[7] = height - appy;

        this.updateWorldVerts(sprite);
    }

    updateUVs (sprite) {
        let verts = this._renderData.vDatas[0];
        let uvSliced = sprite.spriteFrame.uvSliced;
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        for (let row = 0; row < 4; ++row) {
            for (let col = 0; col < 4; ++col) {
                let vid = row * 4 + col;
                let uv = uvSliced[vid];
                let voffset = vid * floatsPerVert;
                verts[voffset + uvOffset] = uv.u;
                verts[voffset + uvOffset + 1] = uv.v;
            }
        }
    }

    updateWorldVerts (sprite) {
        let matrix = sprite.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let local = this._local;
        let world = this._renderData.vDatas[0];

        let floatsPerVert = this.floatsPerVert;
        for (let row = 0; row < 4; ++row) {
            let localRowY = local[row * 2 + 1];
            for (let col = 0; col < 4; ++col) {
                let localColX = local[col * 2];
                let worldIndex = (row * 4 + col) * floatsPerVert;
                world[worldIndex] = localColX * a + localRowY * c + tx;
                world[worldIndex + 1] = localColX * b + localRowY * d + ty;
            }
        }
    }
}

Object.assign(SlicedAssembler.prototype, {
    verticesCount: 16,
    indicesCount: 54
});
