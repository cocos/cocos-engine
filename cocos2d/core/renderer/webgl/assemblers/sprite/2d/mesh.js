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

export default class MeshSpriteAssembler extends Assembler2D {
    initData (sprite) {
        this._local = [];
        this._renderData.createFlexData(0, 4, 6, this.getVfmt());
    }
    
    updateRenderData (sprite) {
        this.packToDynamicAtlas(sprite, sprite._spriteFrame);

        let frame = sprite.spriteFrame;
        if (frame) {
            let vertices = frame.vertices;
            if (vertices) {
                this.verticesCount = vertices.x.length;
                this.indicesCount = vertices.triangles.length;

                let renderData = this._renderData;
                let flexBuffer = renderData._flexBuffer;
                if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
                    this.updateIndices(vertices.triangles);
                    this.updateColor(sprite);
                    sprite._vertsDirty = true;
                }
                flexBuffer.used(this.verticesCount, this.indicesCount);

                if (sprite._vertsDirty) {
                    this.updateUVs(sprite);
                    this.updateVerts(sprite);
                    this.updateWorldVerts(sprite);
                    sprite._vertsDirty = false;
                }
            }
        }
    }

    updateIndices (triangles) {
        let iData = this._renderData.iDatas[0];
        for (let i = 0; i < triangles.length; i++) {
            iData[i] = triangles[i];
        }
    }

    updateUVs (sprite) {
        let vertices = sprite.spriteFrame.vertices,
            u = vertices.nu,
            v = vertices.nv;

        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        let verts = this._renderData.vDatas[0];
        for (let i = 0; i < u.length; i++) {
            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = u[i];
            verts[dstOffset + 1] = v[i];
        }
    }

    updateVerts (sprite) {
        let node = sprite.node,
            contentWidth = Math.abs(node.width),
            contentHeight = Math.abs(node.height),
            appx = node.anchorX * contentWidth,
            appy = node.anchorY * contentHeight;

        let frame = sprite.spriteFrame,
            vertices = frame.vertices,
            x = vertices.x,
            y = vertices.y,
            originalWidth = frame._originalSize.width,
            originalHeight = frame._originalSize.height,
            rectWidth = frame._rect.width,
            rectHeight = frame._rect.height,
            offsetX = frame._offset.x,
            offsetY = frame._offset.y,
            trimX = offsetX + (originalWidth - rectWidth) / 2,
            trimY = offsetY + (originalHeight - rectHeight) / 2;

        let scaleX = contentWidth / (sprite.trim ? rectWidth : originalWidth),
            scaleY = contentHeight / (sprite.trim ? rectHeight : originalHeight);

        let local = this._local;
        if (!sprite.trim) {
            for (let i = 0, l = x.length; i < l; i++) {
                let offset = i * 2;
                local[offset] = (x[i]) * scaleX - appx;
                local[offset + 1] = (originalHeight - y[i]) * scaleY - appy;
            }
        }
        else {
            for (let i = 0, l = x.length; i < l; i++) {
                let offset = i * 2;
                local[offset] = (x[i] - trimX) * scaleX - appx;
                local[offset + 1] = (originalHeight - y[i] - trimY) * scaleY - appy;
            }
        }
    }

    updateWorldVerts (sprite) {
        let node = sprite.node;
        let matrix = node._worldMatrix;
        let matrixm = matrix.m;
        let a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];
        let local = this._local;
        let world = this._renderData.vDatas[0];
        let floatsPerVert = this.floatsPerVert;
        for (let i = 0, l = this.verticesCount; i < l; i++) {
            let lx = local[i*2];
            let ly = local[i*2 + 1];
            world[floatsPerVert * i] = lx * a + ly * c + tx;
            world[floatsPerVert * i + 1] = lx * b + ly * d + ty;
        }
    }
}
