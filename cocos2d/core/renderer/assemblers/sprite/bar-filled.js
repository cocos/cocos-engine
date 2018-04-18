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

const Sprite = require('../../../components/CCSprite');
const FillType = Sprite.FillType;

const dynamicAtlasManager = require('../../utils/dynamic-atlas/manager');

module.exports = {
    useModel: false,
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
            if (vertDirty || batchData.worldMatUpdated) {
                this.updateWorldVerts(sprite);
            }
        }
        return sprite.__allocedDatas;
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
            node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;

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

        data[4].x = l;
        data[4].y = b;
        data[5].x = r;
        data[5].y = b;
        data[6].x = l;
        data[6].y = t;
        data[7].x = r;
        data[7].y = t;

        renderData.vertDirty = false;
    },

    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 0-4 for world verts
        // 5-8 for local verts
        renderData.dataLength = 8;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },

    updateWorldVerts (sprite) {
        let node = sprite.node,
            data = sprite._renderData._data;
        
        let matrix = node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        
        for (let i = 0; i < 4; i++) {
            let local = data[i+4];
            let world = data[i];
            world.x = local.x * a + local.y * c + tx;
            world.y = local.x * b + local.y * d + ty;
        }
    },

    fillBuffers (sprite, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let vertexOffset = batchData.byteOffset / 4,
            indiceOffset = batchData.indiceOffset;

        let data = sprite._renderData._data;
        let node = sprite.node;
        let z = node._position.z;
        let color = node._color._val;
    
        for (let i = 0; i < 4; i++) {
            let vert = data[i];
            vbuf[vertexOffset ++] = vert.x;
            vbuf[vertexOffset ++] = vert.y;
            vbuf[vertexOffset ++] = z;
            uintbuf[vertexOffset ++] = color;
            vbuf[vertexOffset ++] = vert.u;
            vbuf[vertexOffset ++] = vert.v;
        }

        ibuf[indiceOffset ++] = vertexId;
        ibuf[indiceOffset ++] = vertexId + 1;
        ibuf[indiceOffset ++] = vertexId + 2;
        ibuf[indiceOffset ++] = vertexId + 1;
        ibuf[indiceOffset ++] = vertexId + 3;
        ibuf[indiceOffset ++] = vertexId + 2;
    }
};
