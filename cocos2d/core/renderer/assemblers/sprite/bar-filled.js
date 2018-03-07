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

const Sprite = require('../../../components/CCSprite');
const FillType = Sprite.FillType;

const simpleRenderUtil = require('./simple');

module.exports = {
    createData (sprite) {
        let renderData = sprite.requestRenderData();
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
