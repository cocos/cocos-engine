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
// @ts-check
import { SpriteComponent } from '../../components/sprite-component';
const FillType = SpriteComponent.FillType;

// const dynamicAtlasManager = require('../../../../utils/dynamic-atlas/manager');
import { Mat4 } from '../../../../core/value-types';
import { color4, vec3 } from '../../../../core/vmath/index';
import { IRenderData, RenderData } from '../../../../renderer/ui/renderData';
import { IUIRenderData, UI } from '../../../../renderer/ui/ui';
import { Node } from '../../../../scene-graph/node';
import { MeshBuffer } from '../../mesh-buffer';
import { IAssembler } from '../assembler';
import { fillVerticesWithoutCalc3D } from '../utils';

const matrix = new Mat4();
const color_temp = color4.create();

export const barFilled: IAssembler = {
    useModel: false,
    updateRenderData (sprite: SpriteComponent) {
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

        const renderData = sprite.renderData;
        if (renderData && frame) {
            const uvDirty = renderData.uvDirty;
            const vertDirty = renderData.vertDirty;

            if (!uvDirty && !vertDirty) {
                // return sprite.__allocedDatas;
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
            fillRange = fillRange - fillStart;
            fillRange = fillRange < 0 ? 0 : fillRange;

            let fillEnd = fillStart + fillRange;
            fillEnd = fillEnd > 1 ? 1 : fillEnd;

            if (uvDirty) {
                this.updateUVs!(sprite, fillStart, fillEnd);
            }
            if (vertDirty) {
                if (this.updateVerts) {
                    this.updateVerts(sprite, fillStart, fillEnd);
                }
                this.updateWorldVerts!(sprite);
            }
        }
    },

    updateUVs (sprite: SpriteComponent, fillStart: number, fillEnd: number) {
        const spriteFrame = sprite.spriteFrame;
        const renderData = sprite.renderData;
        const datas = renderData!.datas;

        // build uvs
        const atlasWidth = spriteFrame!.width;
        const atlasHeight = spriteFrame!.height;
        const textureRect = spriteFrame!.getRect();
        // uv computation should take spritesheet into account.
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
                datas[0].u = quadUV0 + (quadUV2 - quadUV0) * fillStart;
                datas[0].v = quadUV1 + (quadUV3 - quadUV1) * fillStart;
                datas[1].u = quadUV0 + (quadUV2 - quadUV0) * fillEnd;
                datas[1].v = quadUV1 + (quadUV3 - quadUV1) * fillEnd;
                datas[2].u = quadUV4 + (quadUV6 - quadUV4) * fillStart;
                datas[2].v = quadUV5 + (quadUV7 - quadUV5) * fillStart;
                datas[3].u = quadUV4 + (quadUV6 - quadUV4) * fillEnd;
                datas[3].v = quadUV5 + (quadUV7 - quadUV5) * fillEnd;
                break;
            case FillType.VERTICAL:
                datas[0].u = quadUV0 + (quadUV4 - quadUV0) * fillStart;
                datas[0].v = quadUV1 + (quadUV5 - quadUV1) * fillStart;
                datas[1].u = quadUV2 + (quadUV6 - quadUV2) * fillStart;
                datas[1].v = quadUV3 + (quadUV7 - quadUV3) * fillStart;
                datas[2].u = quadUV0 + (quadUV4 - quadUV0) * fillEnd;
                datas[2].v = quadUV1 + (quadUV5 - quadUV1) * fillEnd;
                datas[3].u = quadUV2 + (quadUV6 - quadUV2) * fillEnd;
                datas[3].v = quadUV3 + (quadUV7 - quadUV3) * fillEnd;
                break;
            default:
                cc.errorID(2626);
                break;
        }

        renderData!.uvDirty = false;
    },

    updateVerts (sprite: SpriteComponent, fillStart: number, fillEnd: number) {
        const renderData: RenderData|null = sprite.renderData;
        const datas: IRenderData[] = renderData!.datas;
        const node: Node = sprite.node;
        const width = node.width;
        const height = node.height;
        const appx = node.anchorX * width;
        const appy = node.anchorY * height;

        let l = -appx;
        let b = -appy;
        let r = width - appx;
        let t = height - appy;

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
                cc.errorID(2626);
                break;
        }

        datas[4].x = l;
        datas[4].y = b;
        datas[5].x = r;
        datas[5].y = b;
        datas[6].x = l;
        datas[6].y = t;
        datas[7].x = r;
        datas[7].y = t;

        renderData!.vertDirty = false;
    },

    createData (sprite: SpriteComponent) {
        const renderData: RenderData|null = sprite.requestRenderData();
        // 0-4 for world verts
        // 5-8 for local verts
        renderData!.dataLength = 8;
        renderData!.vertexCount = 4;
        renderData!.indiceCount = 6;

        const datas = renderData!.datas;
        for (const data of datas) {
            data.z = 0;
        }

        return renderData as RenderData;
    },

    updateWorldVerts (sprite: SpriteComponent) {
        const node = sprite.node;
        const datas = sprite.renderData!.datas;

        node.getWorldMatrix(matrix);
        for (let i = 0; i < 4; i++) {
            const local = datas[i + 4];
            const world = datas[i];
            vec3.transformMat4(world, local, matrix);
        }
    },

    fillBuffers (sprite: SpriteComponent, renderer: UI) {
        const buffer: MeshBuffer = renderer.createBuffer(
            sprite.renderData!.vertexCount,
            sprite.renderData!.indiceCount,
        );
        const commitBuffer: IUIRenderData = renderer.createUIRenderData();
        // if (renderer.worldMatDirty) {
        // this.updateWorldVerts(sprite);
        // }

        // buffer
        let indiceOffset: number = buffer.indiceOffset;
        const vertexId: number = buffer.vertexOffset;

        const node = sprite.node;
        fillVerticesWithoutCalc3D(node, buffer, sprite.renderData!, sprite.color);

        // buffer data may be realloc, need get reference after request.
        const ibuf = buffer.iData;
        ibuf![indiceOffset++] = vertexId;
        ibuf![indiceOffset++] = vertexId + 1;
        ibuf![indiceOffset++] = vertexId + 2;
        ibuf![indiceOffset++] = vertexId + 1;
        ibuf![indiceOffset++] = vertexId + 3;
        ibuf![indiceOffset++] = vertexId + 2;

        commitBuffer.meshBuffer = buffer;
        commitBuffer.material = sprite.material!;
        commitBuffer.texture = sprite.spriteFrame!;
        commitBuffer.priority = sprite.priority;
        renderer.addToQueue(commitBuffer);
    },
};
