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

// const dynamicAtlasManager = require('../../../utils/dynamic-atlas/manager');
import { Mat4, Vec3 } from '../../../../core/value-types';
import { vec3 } from '../../../../core/vmath/index';
import { RenderData } from '../../../../renderer/ui/renderData';
import { UI } from '../../../../renderer/ui/ui';
import { SpriteComponent } from '../../components/sprite-component';
import { UIRenderComponent } from '../../components/ui-render-component';
import { IAssembler } from '../assembler';

const matrix = new Mat4();

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

const _tempVertexOffset = 6;
const _tempUvOffset = 3;
const _tempColorOffset = 5;

export const tilled: IAssembler = {
    useModel: false,

    createData (sprite: UIRenderComponent) {
        return sprite.requestRenderData() as RenderData;
    },

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
        if (!frame || !renderData ||
            !(renderData.uvDirty || renderData.vertDirty)) {
            return;
        }

        const node = sprite.node;
        // contentWidth = Math.abs(node.width),
        // contentHeight = Math.abs(node.height),
        const contentWidth = Math.abs(node.width);
        const contentHeight = Math.abs(node.height);
        const appx = node.anchorX * contentWidth;
        const appy = node.anchorY * contentHeight;
        // node._updateWorldMatrix();

        const rect = frame.getRect();
        const rectWidth = rect.width;
        const rectHeight = rect.height;
        const hRepeat = contentWidth / rectWidth;
        const vRepeat = contentHeight / rectHeight;
        const row = Math.ceil(vRepeat);
        const col = Math.ceil(hRepeat);

        const data = renderData.datas;
        renderData.dataLength = Math.max(8, row + 1, col + 1);

        for (let i = 0; i <= col; ++i) {
            data[i].x = Math.min(rectWidth * i, contentWidth) - appx;
        }
        for (let i = 0; i <= row; ++i) {
            data[i].y = Math.min(rectHeight * i, contentHeight) - appy;
        }

        // update data property
        renderData.vertexCount = row * col * 4;
        renderData.indiceCount = row * col * 6;
        renderData.uvDirty = false;
        renderData.vertDirty = false;
    },

    fillBuffers (sprite: SpriteComponent, renderer: UI) {
        const buffer = renderer.currBufferBatch!;

        const node = sprite.node;
        const color = sprite.color;
        const renderData = sprite.renderData;
        const datas = renderData!.datas;

        // buffer
        let vertexOffset = buffer.byteOffset >> 2;
        let indiceOffset = buffer.indiceOffset;
        let vertexId = buffer.vertexOffset;

        buffer.request(renderData!.vertexCount, renderData!.indiceCount);

        // buffer data may be realloc, need get reference after request.
        const vbuf = buffer.vData;
        // uintbuf = buffer._uintVData,
        const ibuf = buffer.iData;

        const rotated = sprite.spriteFrame!.isRotated;
        const uv = sprite.spriteFrame!.uv;
        const rect = sprite.spriteFrame!.getRect();
        const contentWidth = Math.abs(node.width);
        const contentHeight = Math.abs(node.height);
        const hRepeat = contentWidth / rect.width;
        const vRepeat = contentHeight / rect.height;
        const row = Math.ceil(vRepeat);
        const col = Math.ceil(hRepeat);

        // const matrix = node._worldMatrix;

        // this.updateVerts(vbuf, vertexOffset, matrix, row, col, datas);
        // updataVerts
        let x = 0;
        let x1 = 0;
        let y = 0;
        let y1 = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = datas[yindex].y;
            y1 = datas[yindex + 1].y;
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                x = datas[xindex].x;
                x1 = datas[xindex + 1].x;

                vec3.set(vec3_temps[0], x, y, 0);
                vec3.set(vec3_temps[1], x1, y, 0);
                vec3.set(vec3_temps[2], x, y1, 0);
                vec3.set(vec3_temps[3], x1, y1, 0);

                for (let i = 0; i < 4; i++) {
                    const vec3_temp = vec3_temps[i];
                    vec3.transformMat4(vec3_temp, vec3_temp, matrix);
                    const move = i * 6;
                    vbuf![vertexOffset + move] = vec3_temp.x;
                    vbuf![vertexOffset + move + 1] = vec3_temp.y;
                    vbuf![vertexOffset + move + 2] = vec3_temp.z;
                }

                vertexOffset += 24;
            }
        }

        const offset = _tempVertexOffset;
        const uvOffset = _tempUvOffset;
        const colorOffset = _tempColorOffset;
        const offset1 = offset;
        const offset2 = offset * 2;
        const offset3 = offset * 3;
        const offset4 = offset * 4;
        let coefu = 0;
        let coefv = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            coefv = Math.min(1, vRepeat - yindex);
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                coefu = Math.min(1, hRepeat - xindex);

                const vertexOffsetU = vertexOffset + uvOffset;
                const vertexOffsetV = vertexOffsetU + 1;
                // UV
                if (rotated) {
                    // lb
                    vbuf![vertexOffsetU] = uv[0];
                    vbuf![vertexOffsetV] = uv[1];
                    // rb
                    vbuf![vertexOffsetU + offset1] = uv[0];
                    vbuf![vertexOffsetV + offset1] = uv[1] + (uv[7] - uv[1]) * coefu;
                    // lt
                    vbuf![vertexOffsetU + offset2] = uv[0] + (uv[6] - uv[0]) * coefv;
                    vbuf![vertexOffsetV + offset2] = uv[1];
                    // rt
                    vbuf![vertexOffsetU + offset3] = vbuf![vertexOffsetU + offset2];
                    vbuf![vertexOffsetV + offset3] = vbuf![vertexOffsetV + offset1];
                } else {
                    // lb
                    vbuf![vertexOffsetU] = uv[0];
                    vbuf![vertexOffsetV] = uv[1];
                    // rb
                    vbuf![vertexOffsetU + offset1] = uv[0] + (uv[6] - uv[0]) * coefu;
                    vbuf![vertexOffsetV + offset1] = uv[1];
                    // lt
                    vbuf![vertexOffsetU + offset2] = uv[0];
                    vbuf![vertexOffsetV + offset2] = uv[1] + (uv[7] - uv[1]) * coefv;
                    // rt
                    vbuf![vertexOffsetU + offset3] = vbuf![vertexOffsetU + offset1];
                    vbuf![vertexOffsetV + offset3] = vbuf![vertexOffsetV + offset2];
                }

                vbuf![vertexOffset + colorOffset] = color.x;
                vbuf![vertexOffset + colorOffset + offset1] = color.y;
                vbuf![vertexOffset + colorOffset + offset2] = color.z;
                vbuf![vertexOffset + colorOffset + offset3] = color.w;
                // TODO: addColor
                // color
                // uintbuf[vertexOffset + colorOffset] = color;
                // uintbuf[vertexOffset + colorOffset + offset1] = color;
                // uintbuf[vertexOffset + colorOffset + offset2] = color;
                // uintbuf[vertexOffset + colorOffset + offset3] = color;
                vertexOffset += offset4;
            }
        }

        // update indices
        const length = renderData!.indiceCount;
        for (let i = 0; i < length; i += 6) {
            ibuf![indiceOffset++] = vertexId;
            ibuf![indiceOffset++] = vertexId + 1;
            ibuf![indiceOffset++] = vertexId + 2;
            ibuf![indiceOffset++] = vertexId + 1;
            ibuf![indiceOffset++] = vertexId + 3;
            ibuf![indiceOffset++] = vertexId + 2;
            vertexId += 4;
        }
    },

    updateVerts (sprite: SpriteComponent) {
        // const renderData = sprite.renderData;
        // const datas = renderData!.datas;
        // const vbuf;
        // const vertexOffset;
        // sprite.node.getWorldMatrix(matrix);
        // const row;
        // const col;
        // const data;
        //     let x, x1, y, y1;
        //     for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
        //         y = data[yindex].y;
        //         y1 = data[yindex + 1].y;
        //         for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
        //             x = data[xindex].x;
        //             x1 = data[xindex + 1].x;

        //             vec3.set(vec3_temps[0], x, y, 0);
        //             vec3.set(vec3_temps[1], x1, y, 0);
        //             vec3.set(vec3_temps[2], x, y1, 0);
        //             vec3.set(vec3_temps[3], x1, y1, 0);

        //             for (let i = 0; i < 4; i++) {
        //                 let vec3_temp = vec3_temps[i];
        //                 vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        //                 let offset = i * 6;
        //                 vbuf[vertexOffset + offset] = vec3_temp.x;
        //                 vbuf[vertexOffset + offset + 1] = vec3_temp.y;
        //                 vbuf[vertexOffset + offset + 2] = vec3_temp.z;
        //             }

        //             vertexOffset += 24;
        //         }
        //     }
    },
};
