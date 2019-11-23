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

const _perVertextLength = 9;

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

        const node = sprite.node;
        const contentWidth = Math.abs(node.width);
        const contentHeight = Math.abs(node.height);
        const appx = node.anchorX * contentWidth;
        const appy = node.anchorY * contentHeight;

        const rect = frame.getRect();
        const rectWidth = rect.width;
        const rectHeight = rect.height;
        const hRepeat = contentWidth / rectWidth;
        const vRepeat = contentHeight / rectHeight;
        const row = Math.ceil(vRepeat);
        const col = Math.ceil(hRepeat);

        const datas = renderData.datas;
        renderData.dataLength = Math.max(8, row + 1, col + 1);

        for (let i = 0; i <= col; ++i) {
            datas[i].x = Math.min(rectWidth * i, contentWidth) - appx;
        }
        for (let i = 0; i <= row; ++i) {
            datas[i].y = Math.min(rectHeight * i, contentHeight) - appy;
        }

        // update data property
        renderData.vertexCount = row * col * 4;
        renderData.indiceCount = row * col * 6;
        renderData.uvDirty = false;
        renderData.vertDirty = false;
    },

    fillBuffers (sprite: SpriteComponent, renderer: UI) {
        const node = sprite.node;
        const renderData = sprite.renderData!;

        // buffer
        let buffer = renderer.currBufferBatch!;
        // buffer data may be realloc, need get reference after request.
        let indiceOffset = buffer.indiceOffset;
        let vertexOffset = buffer.byteOffset >> 2;
        let vertexId = buffer.vertexOffset;
        const vertexCount = renderData!.vertexCount;
        const indiceCount = renderData.indiceCount;
        const vbuf = buffer.vData!;
        const ibuf = buffer.iData!;

        const isRecreate = buffer.request(vertexCount, indiceCount);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indiceOffset = 0;
            vertexId = 0;
        }

        const frame = sprite.spriteFrame!;
        const rotated = frame.isRotated();
        const uv = frame.uv;
        const rect = frame.getRect();
        const contentWidth = Math.abs(node.width);
        const contentHeight = Math.abs(node.height);
        const hRepeat = contentWidth / rect.width;
        const vRepeat = contentHeight / rect.height;
        const row = Math.ceil(vRepeat);
        const col = Math.ceil(hRepeat);

        const matrix = node.worldMatrix;

        this.fillVertices(vbuf, vertexOffset, matrix, row, col, renderData.datas);

        const offset = _perVertextLength;
        const offset1 = offset; const offset2 = offset * 2; const offset3 = offset * 3; const offset4 = offset * 4;
        let coefu = 0; let coefv = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            coefv = Math.min(1, vRepeat - yindex);
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                coefu = Math.min(1, hRepeat - xindex);

                const vertexOffsetU = vertexOffset + 3;
                const vertexOffsetV = vertexOffsetU + 1;
                // UV
                if (rotated) {
                    // lb
                    vbuf[vertexOffsetU] = uv[0];
                    vbuf[vertexOffsetV] = uv[1];
                    // rb
                    vbuf[vertexOffsetU + offset1] = uv[0];
                    vbuf[vertexOffsetV + offset1] = uv[1] + (uv[7] - uv[1]) * coefu;
                    // lt
                    vbuf[vertexOffsetU + offset2] = uv[0] + (uv[6] - uv[0]) * coefv;
                    vbuf[vertexOffsetV + offset2] = uv[1];
                    // rt
                    vbuf[vertexOffsetU + offset3] = vbuf[vertexOffsetU + offset2];
                    vbuf[vertexOffsetV + offset3] = vbuf[vertexOffsetV + offset1];
                }
                else {
                    // lb
                    vbuf[vertexOffsetU] = uv[0];
                    vbuf[vertexOffsetV] = uv[1];
                    // rb
                    vbuf[vertexOffsetU + offset1] = uv[0] + (uv[6] - uv[0]) * coefu;
                    vbuf[vertexOffsetV + offset1] = uv[1];
                    // lt
                    vbuf[vertexOffsetU + offset2] = uv[0];
                    vbuf[vertexOffsetV + offset2] = uv[1] + (uv[7] - uv[1]) * coefv;
                    // rt
                    vbuf[vertexOffsetU + offset3] = vbuf[vertexOffsetU + offset1];
                    vbuf[vertexOffsetV + offset3] = vbuf[vertexOffsetV + offset2];
                }
                // color
                Color.toArray(vbuf!, sprite.color, vertexOffsetV + 1);
                Color.toArray(vbuf!, sprite.color, vertexOffsetV + offset1 + 1);
                Color.toArray(vbuf!, sprite.color, vertexOffsetV + offset2 + 1);
                Color.toArray(vbuf!, sprite.color, vertexOffsetV + offset3 + 1);
                vertexOffset += offset4;
            }
        }

        // update indices
        for (let i = 0; i < indiceCount; i += 6) {
            ibuf[indiceOffset++] = vertexId;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 2;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 3;
            ibuf[indiceOffset++] = vertexId + 2;
            vertexId += 4;
        }
    },

    fillVertices (vbuf: Float32Array, vertexOffset: number, matrix: Mat4, row: number, col: number, datas: IRenderData[]) {
        let x = 0; let x1 = 0; let y = 0; let y1 = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = datas[yindex].y;
            y1 = datas[yindex + 1].y;
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                x = datas[xindex].x;
                x1 = datas[xindex + 1].x;

                Vec3.set(vec3_temps[0], x, y, 0);
                Vec3.set(vec3_temps[1], x1, y, 0);
                Vec3.set(vec3_temps[2], x, y1, 0);
                Vec3.set(vec3_temps[3], x1, y1, 0);

                for (let i = 0; i < 4; i++) {
                    const vec3_temp = vec3_temps[i];
                    Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
                    const offset = i * _perVertextLength;
                    vbuf[vertexOffset + offset] = vec3_temp.x;
                    vbuf[vertexOffset + offset + 1] = vec3_temp.y;
                    vbuf[vertexOffset + offset + 2] = vec3_temp.z;
                }

                vertexOffset += 36;
            }
        }
    },
};
