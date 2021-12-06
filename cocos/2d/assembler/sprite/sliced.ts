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

import { IUV, SpriteFrame } from '../../assets';
import { Color, Mat4, Vec3 } from '../../../core/math';
import { IRenderData, RenderData } from '../../renderer/render-data';
import { IBatcher } from '../../renderer/i-batcher';
import { Sprite } from '../../components';
import { IAssembler } from '../../renderer/base';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';

const vec3_temp = new Vec3();
const matrix = new Mat4();

/**
 * sliced 组装器
 * 可通过 `UI.sliced` 获取该组装器。
 */
export const sliced: IAssembler = {
    useModel: false,

    createData (sprite: Sprite) {
        const renderData: RenderData | null = sprite.requestRenderData()!;
        // 0-4 for local vertex
        // 5-20 for world vertex
        renderData.dataLength = 20;

        renderData.vertexCount = 16;
        renderData.indicesCount = 54;
        return renderData;
    },

    createBuffer (sprite: Sprite, renderer: IBatcher) {
        let buffer = renderer.acquireBufferBatch()!;
        let vertexOffset = buffer.byteOffset >> 2;
        let indicesOffset = buffer.indicesOffset;
        let vertexId = buffer.vertexOffset;
        const renderData = sprite.renderData!;

        const bufferUnchanged = buffer.request(renderData.vertexCount, renderData.indicesCount);
        if (!bufferUnchanged) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indicesOffset = 0;
            vertexId = 0;
        }

        renderData.cacheBuffer = buffer;
        renderData.bufferOffset = vertexOffset;
        renderData.meshBufferDirty = true;
    },

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
            const vertDirty = renderData.vertDirty;
            if (vertDirty) {
                this.updateVertexData!(sprite);
                this.updateWorldVertexData!(sprite);
            }
            renderData.updateRenderData(sprite, frame);
        }
    },

    updateVertexData (sprite: Sprite) {
        const renderData: RenderData | null = sprite.renderData;
        const dataList: IRenderData[] = renderData!.data;
        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const width = uiTrans.width;
        const height = uiTrans.height;
        const appX = uiTrans.anchorX * width;
        const appY = uiTrans.anchorY * height;

        const frame: SpriteFrame|null = sprite.spriteFrame;
        const leftWidth = frame!.insetLeft;
        const rightWidth = frame!.insetRight;
        const topHeight = frame!.insetTop;
        const bottomHeight = frame!.insetBottom;

        let sizableWidth = width - leftWidth - rightWidth;
        let sizableHeight = height - topHeight - bottomHeight;
        let xScale = width / (leftWidth + rightWidth);
        let yScale = height / (topHeight + bottomHeight);
        xScale = (Number.isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (Number.isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;

        dataList[0].x = -appX;
        dataList[0].y = -appY;
        dataList[1].x = leftWidth * xScale - appX;
        dataList[1].y = bottomHeight * yScale - appY;
        dataList[2].x = dataList[1].x + sizableWidth;
        dataList[2].y = dataList[1].y + sizableHeight;
        dataList[3].x = width - appX;
        dataList[3].y = height - appY;

        renderData!.vertDirty = false;
    },

    fillBuffers (sprite: Sprite, renderer: IBatcher) {
        if (sprite.node.hasChangedFlags) {
            this.updateWorldVertexData(sprite);
        }

        const renderData: RenderData = sprite.renderData!;
        const buffer = renderData.cacheBuffer!;

        // const node: Node = sprite.node;
        // const color: Color = sprite.color;
        const dataList: IRenderData[] = renderData.data;

        let vertexOffset = renderData.bufferOffset;
        const vertexCount = renderData.vertexCount;
        let indicesOffset: number = buffer.indicesOffset;
        const vertexId: number = vertexOffset / buffer.vertexFormatBytes * renderData.vertexCount;

        const uvSliced: IUV[] = sprite.spriteFrame!.uvSliced;

        // buffer data may be realloc, need get reference after request.
        const vBuf: Float32Array|null = buffer.vData;
        // const  uintbuf = buffer._uintVData,
        const iBuf: Uint16Array|null = buffer.iData;

        for (let i = 4; i < 20; ++i) {
            const vert = dataList[i];
            const uvs = uvSliced[i - 4];

            vBuf![vertexOffset++] = vert.x;
            vBuf![vertexOffset++] = vert.y;
            vBuf![vertexOffset++] = vert.z;
            vBuf![vertexOffset++] = uvs.u;
            vBuf![vertexOffset++] = uvs.v;
            Color.toArray(vBuf!, dataList[i].color, vertexOffset);
            vertexOffset += 4;
            // uintbuf[vertexOffset++] = color;
        }

        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                const start = vertexId + r * 4 + c;
                iBuf![indicesOffset++] = start;
                iBuf![indicesOffset++] = start + 1;
                iBuf![indicesOffset++] = start + 4;
                iBuf![indicesOffset++] = start + 1;
                iBuf![indicesOffset++] = start + 5;
                iBuf![indicesOffset++] = start + 4;
            }
        }

        buffer.indicesOffset += renderData.indicesCount;
    },

    fillIndex (sprite: Sprite) {
        const renderData: RenderData = sprite.renderData!;
        const buffer = renderData.cacheBuffer!;

        const vertexOffset = renderData.bufferOffset;
        let indicesOffset: number = buffer.indicesOffset;
        const vertexId: number = vertexOffset / buffer.vertexFormatBytes * renderData.vertexCount;

        // const  uintbuf = buffer._uintVData,
        const iBuf: Uint16Array|null = buffer.iData;

        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                const start = vertexId + r * 4 + c;
                iBuf![indicesOffset++] = start;
                iBuf![indicesOffset++] = start + 1;
                iBuf![indicesOffset++] = start + 4;
                iBuf![indicesOffset++] = start + 1;
                iBuf![indicesOffset++] = start + 5;
                iBuf![indicesOffset++] = start + 4;
            }
        }

        buffer.indicesOffset += renderData.indicesCount;
    },

    fillCacheBuffer (sprite: Sprite) {
        if (sprite === null) {
            return;
        }
        if (sprite.node.hasChangedFlags) {
            this.updateWorldVertexData(sprite);
        }
        const renderData = sprite.renderData!;
        const dataList: IRenderData[] = renderData.data;
        const uvSliced: IUV[] = sprite.spriteFrame!.uvSliced;
        const meshBuffer = renderData.cacheBuffer!;
        const vBuf: Float32Array|null = meshBuffer.vData;
        let vertexOffset = renderData.bufferOffset;
        for (let i = 4; i < 20; ++i) {
            const vert = dataList[i];
            const uvs = uvSliced[i - 4];

            vBuf![vertexOffset++] = vert.x;
            vBuf![vertexOffset++] = vert.y;
            vBuf![vertexOffset++] = vert.z;
            vBuf![vertexOffset++] = uvs.u;
            vBuf![vertexOffset++] = uvs.v;
            Color.toArray(vBuf!, dataList[i].color, vertexOffset);
            vertexOffset += 4;
            // uintbuf[vertexOffset++] = color;
        }
        meshBuffer.setDirty();
    },

    updateWorldVertexData (sprite: Sprite) {
        const node = sprite.node;
        const dataList: IRenderData[] = sprite.renderData!.data;
        node.getWorldMatrix(matrix);
        for (let row = 0; row < 4; ++row) {
            const rowD = dataList[row];
            for (let col = 0; col < 4; ++col) {
                const colD = dataList[col];
                const world = dataList[4 + row * 4 + col];

                Vec3.set(vec3_temp, colD.x, rowD.y, 0);
                Vec3.transformMat4(world, vec3_temp, matrix);
            }
        }
    },

    updateColor (sprite: Sprite) {
        const datalist = sprite.renderData!.data;

        const color = sprite.color;
        const colorR = color.r;
        const colorG = color.g;
        const colorB = color.b;
        const colorA = sprite.node._uiProps.opacity * 255;
        for (let i = 4; i < 20; i++) {
            datalist[i].color.r = colorR;
            datalist[i].color.g = colorG;
            datalist[i].color.b = colorB;
            datalist[i].color.a = colorA;
        }
    },
};
