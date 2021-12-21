/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { Color, Mat4, Vec3 } from '../../../core/math';
import { IRenderData, RenderData } from '../../renderer/render-data';
import { IBatcher } from '../../renderer/i-batcher';
import { Sprite } from '../../components';
import { IAssembler } from '../../renderer/base';
import { fillVerticesWithoutCalc3D } from '../utils';
import { errorID } from '../../../core/platform/debug';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';

const FillType = Sprite.FillType;
const matrix = new Mat4();
const tempColor = new Color(255, 255, 255, 255);

/**
 * barFilled 组装器
 * 可通过 `UI.barFilled` 获取该组装器。
 */
export const barFilled: IAssembler = {
    useModel: false,
    updateRenderData (sprite: Sprite) {
        const frame = sprite.spriteFrame;

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

        dynamicAtlasManager.packToDynamicAtlas(sprite, frame);

        const renderData = sprite.renderData;
        if (renderData && frame) {
            renderData.updateRenderData(sprite, frame);
            const uvDirty = renderData.uvDirty;
            const vertDirty = renderData.vertDirty;

            if (!uvDirty && !vertDirty) {
                return;
            }

            let fillStart = sprite.fillStart;
            let fillRange = sprite.fillRange;

            if (fillRange < 0) {
                fillStart += fillRange;
                fillRange = -fillRange;
            }

            fillRange = fillStart + fillRange;

            fillStart = fillStart > 1.0 ? 1.0 : fillStart;
            fillStart = fillStart < 0.0 ? 0.0 : fillStart;

            fillRange = fillRange > 1.0 ? 1.0 : fillRange;
            fillRange = fillRange < 0.0 ? 0.0 : fillRange;
            fillRange -= fillStart;
            fillRange = fillRange < 0 ? 0 : fillRange;

            let fillEnd = fillStart + fillRange;
            fillEnd = fillEnd > 1 ? 1 : fillEnd;

            if (uvDirty) {
                this.updateUVs!(sprite, fillStart, fillEnd);
            }
            if (vertDirty) {
                if (this.updateVertexData) {
                    this.updateVertexData(sprite, fillStart, fillEnd);
                }
                this.updateWorldVertexData!(sprite);
            }
        }
    },

    updateUVs (sprite: Sprite, fillStart: number, fillEnd: number) {
        const spriteFrame = sprite.spriteFrame;
        const renderData = sprite.renderData;
        const dataList = renderData!.data;

        // build uvs
        const atlasWidth = spriteFrame!.width;
        const atlasHeight = spriteFrame!.height;
        const textureRect = spriteFrame!.getRect();
        // uv computation should take spriteSheet into account.
        let ul = 0;
        let vb = 0;
        let ur = 0;
        let vt = 0;
        let quadUV0 = 0;
        let quadUV1 = 0;
        let quadUV2 = 0;
        let quadUV3 = 0;
        let quadUV4 = 0;
        let quadUV5 = 0;
        let quadUV6 = 0;
        let quadUV7 = 0;
        if (spriteFrame!.isRotated()) {
            ul = (textureRect.x) / atlasWidth;
            vb = (textureRect.y + textureRect.width) / atlasHeight;
            ur = (textureRect.x + textureRect.height) / atlasWidth;
            vt = (textureRect.y) / atlasHeight;

            quadUV0 = quadUV2 = ul;
            quadUV4 = quadUV6 = ur;
            quadUV3 = quadUV7 = vb;
            quadUV1 = quadUV5 = vt;
        } else {
            ul = (textureRect.x) / atlasWidth;
            vb = (textureRect.y + textureRect.height) / atlasHeight;
            ur = (textureRect.x + textureRect.width) / atlasWidth;
            vt = (textureRect.y) / atlasHeight;

            quadUV0 = quadUV4 = ul;
            quadUV2 = quadUV6 = ur;
            quadUV1 = quadUV3 = vb;
            quadUV5 = quadUV7 = vt;
        }

        switch (sprite.fillType) {
        case FillType.HORIZONTAL:
            dataList[0].u = quadUV0 + (quadUV2 - quadUV0) * fillStart;
            dataList[0].v = quadUV1 + (quadUV3 - quadUV1) * fillStart;
            dataList[1].u = quadUV0 + (quadUV2 - quadUV0) * fillEnd;
            dataList[1].v = quadUV1 + (quadUV3 - quadUV1) * fillEnd;
            dataList[2].u = quadUV4 + (quadUV6 - quadUV4) * fillStart;
            dataList[2].v = quadUV5 + (quadUV7 - quadUV5) * fillStart;
            dataList[3].u = quadUV4 + (quadUV6 - quadUV4) * fillEnd;
            dataList[3].v = quadUV5 + (quadUV7 - quadUV5) * fillEnd;
            break;
        case FillType.VERTICAL:
            dataList[0].u = quadUV0 + (quadUV4 - quadUV0) * fillStart;
            dataList[0].v = quadUV1 + (quadUV5 - quadUV1) * fillStart;
            dataList[1].u = quadUV2 + (quadUV6 - quadUV2) * fillStart;
            dataList[1].v = quadUV3 + (quadUV7 - quadUV3) * fillStart;
            dataList[2].u = quadUV0 + (quadUV4 - quadUV0) * fillEnd;
            dataList[2].v = quadUV1 + (quadUV5 - quadUV1) * fillEnd;
            dataList[3].u = quadUV2 + (quadUV6 - quadUV2) * fillEnd;
            dataList[3].v = quadUV3 + (quadUV7 - quadUV3) * fillEnd;
            break;
        default:
            errorID(2626);
            break;
        }

        renderData!.uvDirty = false;
    },

    updateVertexData (sprite: Sprite, fillStart: number, fillEnd: number) {
        const renderData: RenderData|null = sprite.renderData;
        const dataList: IRenderData[] = renderData!.data;
        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const width = uiTrans.width;
        const height = uiTrans.height;
        const appX = uiTrans.anchorX * width;
        const appY = uiTrans.anchorY * height;

        let l = -appX;
        let b = -appY;
        let r = width - appX;
        let t = height - appY;

        let progressStart = 0;
        let progressEnd = 0;
        switch (sprite.fillType) {
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
            errorID(2626);
            break;
        }

        dataList[4].x = l;
        dataList[4].y = b;
        dataList[5].x = r;
        dataList[5].y = b;
        dataList[6].x = l;
        dataList[6].y = t;
        dataList[7].x = r;
        dataList[7].y = t;

        renderData!.vertDirty = false;
    },

    createData (sprite: Sprite) {
        const renderData: RenderData|null = sprite.requestRenderData();
        // 0-4 for world vertex
        // 5-8 for local vertex
        renderData.dataLength = 8;
        renderData.vertexCount = 4;
        renderData.indicesCount = 6;

        const dataList = renderData.data;
        for (const data of dataList) {
            data.z = 0;
        }

        return renderData;
    },

    updateWorldVertexData (sprite: Sprite) {
        const node = sprite.node;
        const dataList = sprite.renderData!.data;

        node.getWorldMatrix(matrix);
        for (let i = 0; i < 4; i++) {
            const local = dataList[i + 4];
            const world = dataList[i];
            Vec3.transformMat4(world, local, matrix);
        }
    },

    fillBuffers (sprite: Sprite, renderer: IBatcher) {
        if (sprite.node.hasChangedFlags) {
            this.updateWorldVertexData(sprite);
        }

        const node = sprite.node;
        tempColor.set(sprite.color);
        tempColor.a = node._uiProps.opacity * 255;
        fillVerticesWithoutCalc3D(node, renderer, sprite.renderData!, tempColor);
    },

    updateColor (sprite: Sprite) {
    },
};
