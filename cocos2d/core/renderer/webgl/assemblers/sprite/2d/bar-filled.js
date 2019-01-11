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

const Sprite = require('../../../../../components/CCSprite');
const FillType = Sprite.FillType;
const packToDynamicAtlas = require('../../../../utils/utils').packToDynamicAtlas;
const fillVerticesWithoutCalc = require('../../utils').fillVerticesWithoutCalc;

module.exports = {
    updateRenderData (sprite) {
        packToDynamicAtlas(sprite, sprite._spriteFrame);

        if (!sprite._vertsDirty) {
            return sprite.__allocedDatas;
        }

        let renderData = sprite._renderData;
        if (renderData && frame) {
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

            this.updateUVs(sprite, fillStart, fillEnd);
            this.updateVerts(sprite, fillStart, fillEnd);
            this.updateWorldVerts(sprite);
            sprite._vertsDirty = false;
        }
    },

    updateUVs (sprite, fillStart, fillEnd) {
        let spriteFrame = sprite._spriteFrame,
            renderData = sprite._renderData,
            verts = renderData.vertices;

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
                verts[0].u = quadUV0 + (quadUV2 - quadUV0) * fillStart;
                verts[0].v = quadUV1 + (quadUV3 - quadUV1) * fillStart;
                verts[1].u = quadUV0 + (quadUV2 - quadUV0) * fillEnd;
                verts[1].v = quadUV1 + (quadUV3 - quadUV1) * fillEnd;
                verts[2].u = quadUV4 + (quadUV6 - quadUV4) * fillStart;
                verts[2].v = quadUV5 + (quadUV7 - quadUV5) * fillStart;
                verts[3].u = quadUV4 + (quadUV6 - quadUV4) * fillEnd;
                verts[3].v = quadUV5 + (quadUV7 - quadUV5) * fillEnd;
                break;
            case FillType.VERTICAL:
                verts[0].u = quadUV0 + (quadUV4 - quadUV0) * fillStart;
                verts[0].v = quadUV1 + (quadUV5 - quadUV1) * fillStart;
                verts[1].u = quadUV2 + (quadUV6 - quadUV2) * fillStart;
                verts[1].v = quadUV3 + (quadUV7 - quadUV3) * fillStart;
                verts[2].u = quadUV0 + (quadUV4 - quadUV0) * fillEnd;
                verts[2].v = quadUV1 + (quadUV5 - quadUV1) * fillEnd;
                verts[3].u = quadUV2 + (quadUV6 - quadUV2) * fillEnd;
                verts[3].v = quadUV3 + (quadUV7 - quadUV3) * fillEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }
    },

    updateVerts (sprite, fillStart, fillEnd) {
        let renderData = sprite._renderData,
            verts = renderData.vertices,
            node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;

        let l = -appx, b = -appy,
            r = width - appx, t = height - appy;

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

        verts[4].x = l;
        verts[4].y = b;
        verts[5].x = r;
        verts[5].y = b;
        verts[6].x = l;
        verts[6].y = t;
        verts[7].x = r;
        verts[7].y = t;
    },

    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 0-4 for world verts
        // 5-8 for local verts
        renderData.dataLength = 8;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        let verts = renderData.vertices;
        for (let i = 0; i < verts.length; i++) {
            verts[i].z = 0;
        }
        return renderData;
    },

    updateWorldVerts (sprite) {
        let node = sprite.node,
            verts = sprite._renderData.vertices;
        
        let matrix = node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        for (let i = 0; i < 4; i++) {
            let local = verts[i + 4];
            let world = verts[i];
            world.x = local.x * a + local.y * c + tx;
            world.y = local.x * b + local.y * d + ty;
        }
    },

    fillBuffers (sprite, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(sprite);
        }

        // buffer
        let buffer = renderer._meshBuffer,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;

        let node = sprite.node;
        fillVerticesWithoutCalc(node, buffer, sprite._renderData, node._color._val);

        // buffer data may be realloc, need get reference after request.
        let ibuf = buffer._iData;
        ibuf[indiceOffset++] = vertexId;
        ibuf[indiceOffset++] = vertexId + 1;
        ibuf[indiceOffset++] = vertexId + 2;
        ibuf[indiceOffset++] = vertexId + 1;
        ibuf[indiceOffset++] = vertexId + 3;
        ibuf[indiceOffset++] = vertexId + 2;
    }
};
