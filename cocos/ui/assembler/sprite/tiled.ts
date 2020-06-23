/*
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
*/

/**
 * @hidden
 */

import { Mat4, Vec3, Color } from '../../../core/math';
import { RenderData, IRenderData } from '../../../core/renderer/ui/render-data';
import { UI } from '../../../core/renderer/ui/ui';
import { SpriteComponent } from '../../components/sprite-component';
import { UIRenderComponent } from '../../../core/components/ui-base/ui-render-component';
import { IAssembler } from '../../../core/renderer/ui/base';

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

const _perVertexLength = 9;

export const tilled: IAssembler = {
    useModel: false,

    createData (sprite: UIRenderComponent) {
        return sprite.requestRenderData() as RenderData;
    },

    updateRenderData (sprite: SpriteComponent) {
        const renderData = sprite.renderData!;
        const frame = sprite.spriteFrame!;
        if (!frame || !renderData || !(renderData.uvDirty || renderData.vertDirty)){
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const contentWidth = Math.abs(uiTrans.width);
        const contentHeight = Math.abs(uiTrans.height);
        const appX = uiTrans.anchorX * contentWidth;
        const appY = uiTrans.anchorY * contentHeight;

        const rect = frame.getRect();
        const rectWidth = rect.width;
        const rectHeight = rect.height;
        const hRepeat = contentWidth / rectWidth;
        const vRepeat = contentHeight / rectHeight;
        const row = Math.ceil(vRepeat);
        const col = Math.ceil(hRepeat);

        const dataList = renderData.data;
        renderData.dataLength = Math.max(8, row + 1, col + 1);

        for (let i = 0; i <= col; ++i) {
            dataList[i].x = Math.min(rectWidth * i, contentWidth) - appX;
        }
        for (let i = 0; i <= row; ++i) {
            dataList[i].y = Math.min(rectHeight * i, contentHeight) - appY;
        }

        // update data property
        renderData.vertexCount = row * col * 4;
        renderData.indicesCount = row * col * 6;
        renderData.uvDirty = false;
        renderData.vertDirty = false;
    },

    fillBuffers (sprite: SpriteComponent, renderer: UI) {
        const node = sprite.node;
        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const renderData = sprite.renderData!;

        // buffer
        let buffer = renderer.currBufferBatch!;
        // buffer data may be realloc, need get reference after request.
        let indicesOffset = buffer.indicesOffset;
        let vertexOffset = buffer.byteOffset >> 2;
        let vertexId = buffer.vertexOffset;
        const vertexCount = renderData!.vertexCount;
        const indicesCount = renderData.indicesCount;
        const vBuf = buffer.vData!;
        const iBuf = buffer.iData!;

        const isRecreate = buffer.request(vertexCount, indicesCount);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indicesOffset = 0;
            vertexId = 0;
        }

        const frame = sprite.spriteFrame!;
        const rotated = frame.isRotated();
        const uv = frame.uv;
        const rect = frame.getRect();
        const contentWidth = Math.abs(uiTrans.width);
        const contentHeight = Math.abs(uiTrans.height);
        const hRepeat = contentWidth / rect.width;
        const vRepeat = contentHeight / rect.height;
        const row = Math.ceil(vRepeat);
        const col = Math.ceil(hRepeat);

        const matrix = node.worldMatrix;

        this.fillVertices(vBuf, vertexOffset, matrix, row, col, renderData.data);

        const offset = _perVertexLength;
        const offset1 = offset; const offset2 = offset * 2; const offset3 = offset * 3; const offset4 = offset * 4;
        let coefU = 0; let coefV = 0;
        for (let yIndex = 0, yLength = row; yIndex < yLength; ++yIndex) {
            coefV = Math.min(1, vRepeat - yIndex);
            for (let xIndex = 0, xLength = col; xIndex < xLength; ++xIndex) {
                coefU = Math.min(1, hRepeat - xIndex);

                const vertexOffsetU = vertexOffset + 3;
                const vertexOffsetV = vertexOffsetU + 1;
                // UV
                if (rotated) {
                    // lb
                    vBuf[vertexOffsetU] = uv[0];
                    vBuf[vertexOffsetV] = uv[1];
                    // rb
                    vBuf[vertexOffsetU + offset1] = uv[0];
                    vBuf[vertexOffsetV + offset1] = uv[1] + (uv[7] - uv[1]) * coefU;
                    // lt
                    vBuf[vertexOffsetU + offset2] = uv[0] + (uv[6] - uv[0]) * coefV;
                    vBuf[vertexOffsetV + offset2] = uv[1];
                    // rt
                    vBuf[vertexOffsetU + offset3] = vBuf[vertexOffsetU + offset2];
                    vBuf[vertexOffsetV + offset3] = vBuf[vertexOffsetV + offset1];
                }
                else {
                    // lb
                    vBuf[vertexOffsetU] = uv[0];
                    vBuf[vertexOffsetV] = uv[1];
                    // rb
                    vBuf[vertexOffsetU + offset1] = uv[0] + (uv[6] - uv[0]) * coefU;
                    vBuf[vertexOffsetV + offset1] = uv[1];
                    // lt
                    vBuf[vertexOffsetU + offset2] = uv[0];
                    vBuf[vertexOffsetV + offset2] = uv[1] + (uv[7] - uv[1]) * coefV;
                    // rt
                    vBuf[vertexOffsetU + offset3] = vBuf[vertexOffsetU + offset1];
                    vBuf[vertexOffsetV + offset3] = vBuf[vertexOffsetV + offset2];
                }
                // color
                Color.toArray(vBuf!, sprite.color, vertexOffsetV + 1);
                Color.toArray(vBuf!, sprite.color, vertexOffsetV + offset1 + 1);
                Color.toArray(vBuf!, sprite.color, vertexOffsetV + offset2 + 1);
                Color.toArray(vBuf!, sprite.color, vertexOffsetV + offset3 + 1);
                vertexOffset += offset4;
            }
        }

        // update indices
        for (let i = 0; i < indicesCount; i += 6) {
            iBuf[indicesOffset++] = vertexId;
            iBuf[indicesOffset++] = vertexId + 1;
            iBuf[indicesOffset++] = vertexId + 2;
            iBuf[indicesOffset++] = vertexId + 1;
            iBuf[indicesOffset++] = vertexId + 3;
            iBuf[indicesOffset++] = vertexId + 2;
            vertexId += 4;
        }
    },

    fillVertices (vBuf: Float32Array, vertexOffset: number, matrix: Mat4, row: number, col: number, dataList: IRenderData[]) {
        let x = 0; let x1 = 0; let y = 0; let y1 = 0;
        for (let yIndex = 0, yLength = row; yIndex < yLength; ++yIndex) {
            y = dataList[yIndex].y;
            y1 = dataList[yIndex + 1].y;
            for (let xIndex = 0, xLength = col; xIndex < xLength; ++xIndex) {
                x = dataList[xIndex].x;
                x1 = dataList[xIndex + 1].x;

                Vec3.set(vec3_temps[0], x, y, 0);
                Vec3.set(vec3_temps[1], x1, y, 0);
                Vec3.set(vec3_temps[2], x, y1, 0);
                Vec3.set(vec3_temps[3], x1, y1, 0);

                for (let i = 0; i < 4; i++) {
                    const vec3_temp = vec3_temps[i];
                    Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
                    const offset = i * _perVertexLength;
                    vBuf[vertexOffset + offset] = vec3_temp.x;
                    vBuf[vertexOffset + offset + 1] = vec3_temp.y;
                    vBuf[vertexOffset + offset + 2] = vec3_temp.z;
                }

                vertexOffset += 36;
            }
        }
    },
};
