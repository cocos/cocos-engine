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
//@ts-check
import { SpriteComponent} from '../../components/sprite-component';
const FillType = SpriteComponent.FillType;

// const dynamicAtlasManager = require('../../../../utils/dynamic-atlas/manager');
import { fillVerticesWithoutCalc3D } from '../utils';
import { vec3 } from '../../../../core/vmath/index';

let barFilled = {
    useModel: false,
    updateRenderData(sprite) {
        let frame = sprite.spriteFrame;

        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        // if (frame) {
        //     if (!frame._original && dynamicAtlasManager) {
        //         dynamicAtlasManager.insertSpriteFrame(frame);
        //     }
        //     if (sprite._material._texture !== frame._texture) {
        //         sprite._activateMaterial();
        //     }
        // }

        let renderData = sprite._renderData;
        if (renderData && frame) {
            let uvDirty = renderData.uvDirty,
                vertDirty = renderData.vertDirty;

            if (!uvDirty && !vertDirty) {
                return sprite.__allocedDatas;
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

            if (uvDirty) {
                this.updateUVs(sprite, fillStart, fillEnd);
            }
            if (vertDirty) {
                this.updateVerts(sprite, fillStart, fillEnd);
                // this.updateWorldVerts(sprite);
            }
        }
    },

    updateUVs(sprite, fillStart, fillEnd) {
        let spriteFrame = sprite._spriteFrame,
            renderData = sprite._renderData,
            data = renderData._data;

        //build uvs
        let atlasWidth = spriteFrame.width;
        let atlasHeight = spriteFrame.height;
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

            // quadUV0 = quadUV4 = ul;
            // quadUV2 = quadUV6 = ur;
            // quadUV1 = quadUV3 = vb;
            // quadUV5 = quadUV7 = vt;
        }

        switch (sprite._fillType) {
            case FillType.HORIZONTAL:
                data[0].u = ul + (ur - ul) * fillStart;
                data[0].v = vb;
                data[1].u = ul + (ur - ul) * fillEnd;
                data[1].v = vb;
                data[2].u = ul + (ur - ul) * fillStart;
                data[2].v = vt;
                data[3].u = ul + (ur - ul) * fillEnd;
                data[3].v = vt;

                // data[0].u = quadUV0 + (quadUV2 - quadUV0) * fillStart;
                // data[0].v = quadUV1 + (quadUV3 - quadUV1) * fillStart;
                // data[1].u = quadUV0 + (quadUV2 - quadUV0) * fillEnd;
                // data[1].v = quadUV1 + (quadUV3 - quadUV1) * fillEnd;
                // data[2].u = quadUV4 + (quadUV6 - quadUV4) * fillStart;
                // data[2].v = quadUV5 + (quadUV7 - quadUV5) * fillStart;
                // data[3].u = quadUV4 + (quadUV6 - quadUV4) * fillEnd;
                // data[3].v = quadUV5 + (quadUV7 - quadUV5) * fillEnd;
                break;
            case FillType.VERTICAL:
                data[0].u = ul
                data[0].v = vb + (vt - vb) * fillStart;
                data[1].u = ur;
                data[1].v = vb + (vt - vb) * fillStart;
                data[2].u = ul;
                data[2].v = vb + (vt - vb) * fillEnd;
                data[3].u = ur;
                data[3].v = vb + (vt - vb) * fillEnd;

                // data[0].u = quadUV0 + (quadUV4 - quadUV0) * fillStart;
                // data[0].v = quadUV1 + (quadUV5 - quadUV1) * fillStart;
                // data[1].u = quadUV2 + (quadUV6 - quadUV2) * fillStart;
                // data[1].v = quadUV3 + (quadUV7 - quadUV3) * fillStart;
                // data[2].u = quadUV0 + (quadUV4 - quadUV0) * fillEnd;
                // data[2].v = quadUV1 + (quadUV5 - quadUV1) * fillEnd;
                // data[3].u = quadUV2 + (quadUV6 - quadUV2) * fillEnd;
                // data[3].v = quadUV3 + (quadUV7 - quadUV3) * fillEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }

        renderData.uvDirty = false;
    },

    updateVerts(sprite, fillStart, fillEnd) {
        let renderData = sprite._renderData,
            data = renderData._data,
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

    createData(sprite) {
        let renderData = sprite.requestRenderData();
        // 0-4 for world verts
        // 5-8 for local verts
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        let data = renderData._data;
        for (let i = 0; i < data.length; i++) {
            data[i].z = 0;
        }
        return renderData;
    },

    // updateWorldVerts(sprite) {
    //     let node = sprite.node,
    //         data = sprite._renderData._data;

    //     node._updateWorldMatrix();
    //     let matrix = node._worldMatrix;
    //     for (let i = 0; i < 4; i++) {
    //         let local = data[i + 4];
    //         let world = data[i];
    //         vec3.transformMat4(world, local, matrix);
    //     }
    // },

    fillBuffers(sprite, /*renderer*/buffer) {
        // if (renderer.worldMatDirty) {
        // this.updateWorldVerts(sprite);
        // }

        // buffer
        let /*buffer = renderer._meshBuffer3D,*/
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;

        let node = sprite.node;
        fillVerticesWithoutCalc3D(node, buffer, sprite._renderData, sprite._color._val);

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

export default barFilled;
