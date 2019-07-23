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

const Sprite = require('../../../../../components/CCSprite');
const FillType = Sprite.FillType;

export default class BarFilledAssembler extends Assembler2D {
    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        if (!frame) return;

        this.packToDynamicAtlas(sprite, frame);

        if (!sprite._vertsDirty) {
            return;
        }

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

        sprite._vertsDirty = false;
    }

    updateUVs (sprite, fillStart, fillEnd) {
        let spriteFrame = sprite._spriteFrame;

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

        let verts = this._renderData.vDatas[0];
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        switch (sprite._fillType) {
            case FillType.HORIZONTAL:
                verts[uvOffset] = quadUV0 + (quadUV2 - quadUV0) * fillStart;
                verts[uvOffset + 1] = quadUV1 + (quadUV3 - quadUV1) * fillStart;
                verts[uvOffset + floatsPerVert] = quadUV0 + (quadUV2 - quadUV0) * fillEnd;
                verts[uvOffset + floatsPerVert + 1] = quadUV1 + (quadUV3 - quadUV1) * fillEnd;
                verts[uvOffset + floatsPerVert * 2] = quadUV4 + (quadUV6 - quadUV4) * fillStart;
                verts[uvOffset + floatsPerVert * 2 + 1] = quadUV5 + (quadUV7 - quadUV5) * fillStart;
                verts[uvOffset + floatsPerVert * 3] = quadUV4 + (quadUV6 - quadUV4) * fillEnd;
                verts[uvOffset + floatsPerVert * 3 + 1] = quadUV5 + (quadUV7 - quadUV5) * fillEnd;
                break;
            case FillType.VERTICAL:
                verts[uvOffset] = quadUV0 + (quadUV4 - quadUV0) * fillStart;
                verts[uvOffset + 1] = quadUV1 + (quadUV5 - quadUV1) * fillStart;
                verts[uvOffset + floatsPerVert] = quadUV2 + (quadUV6 - quadUV2) * fillStart;
                verts[uvOffset + floatsPerVert + 1] = quadUV3 + (quadUV7 - quadUV3) * fillStart;
                verts[uvOffset + floatsPerVert * 2] = quadUV0 + (quadUV4 - quadUV0) * fillEnd;
                verts[uvOffset + floatsPerVert * 2 + 1] = quadUV1 + (quadUV5 - quadUV1) * fillEnd;
                verts[uvOffset + floatsPerVert * 3] = quadUV2 + (quadUV6 - quadUV2) * fillEnd;
                verts[uvOffset + floatsPerVert * 3 + 1] = quadUV3 + (quadUV7 - quadUV3) * fillEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }
    }

    updateVerts (sprite, fillStart, fillEnd) {
        let node = sprite.node,
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

        let local = this._local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;

        this.updateWorldVerts(sprite);
    }
}
