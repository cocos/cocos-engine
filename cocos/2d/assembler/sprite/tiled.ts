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
 * @hidden
 */

import { Mat4, Vec3, Color } from '../../../core/math';
import { IRenderData } from '../../renderer/render-data';
import { Batcher2D } from '../../renderer/batcher-2d';
import { Sprite } from '../../components/sprite';
import { Renderable2D } from '../../framework/renderable-2d';
import { IAssembler } from '../../renderer/base';

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

const _perVertexLength = 9;

interface ITiledAssembler extends IAssembler {
    sizableWidth: number;
    sizableHeight: number;
    vRepeat: number;
    hRepeat: number;
    row: number;
    col: number;
}

export const tiled: ITiledAssembler = {
    useModel: false,
    sizableWidth: 0,
    sizableHeight: 0,
    vRepeat: 0,
    hRepeat: 0,
    row: 0,
    col: 0,

    createData (sprite: Renderable2D) {
        return sprite.requestRenderData();
    },

    updateRenderData (sprite: Sprite) {
        const renderData = sprite.renderData!;
        const frame = sprite.spriteFrame!;
        if (!frame || !renderData || !(renderData.uvDirty || renderData.vertDirty)) {
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const contentWidth = Math.abs(uiTrans.width);
        const contentHeight = Math.abs(uiTrans.height);

        const rect = frame.getRect();
        const leftWidth = frame.insetLeft;
        const rightWidth = frame.insetRight;
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = frame.insetTop;
        const bottomHeight = frame.insetBottom;
        const centerHeight = rect.height - topHeight - bottomHeight;

        this.sizableWidth = contentWidth - leftWidth - rightWidth;
        this.sizableHeight = contentHeight - topHeight - bottomHeight;
        this.sizableWidth = this.sizableWidth > 0 ? this.sizableWidth : 0;
        this.sizableHeight = this.sizableHeight > 0 ? this.sizableHeight : 0;

        this.hRepeat = centerWidth === 0 ? this.sizableWidth : this.sizableWidth / centerWidth;
        this.vRepeat = centerHeight === 0 ? this.sizableHeight : this.sizableHeight / centerHeight;
        this.row = Math.ceil(this.vRepeat + 2);
        this.col = Math.ceil(this.hRepeat + 2);

        renderData.dataLength = Math.max(8, this.row + 1, this.col + 1);

        this.updateVerts(sprite);

        // update data property
        renderData.vertexCount = this.row * this.col * 4;
        renderData.indicesCount = this.row * this.col * 6;
        renderData.uvDirty = false;
        renderData.vertDirty = false;
    },

    fillBuffers (sprite: Sprite, renderer: Batcher2D) {
        const node = sprite.node;
        const renderData = sprite.renderData!;

        // buffer
        let buffer = renderer.acquireBufferBatch()!;
        // buffer data may be realloc, need get reference after request.
        let indicesOffset = buffer.indicesOffset;
        let vertexOffset = buffer.byteOffset >> 2;
        let vertexId = buffer.vertexOffset;
        const vertexCount = renderData.vertexCount;
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
        const uvSliced = frame.uvSliced;
        const rect = frame.getRect();
        const leftWidth = frame.insetLeft;
        const rightWidth = frame.insetRight;
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = frame.insetTop;
        const bottomHeight = frame.insetBottom;
        const centerHeight = rect.height - topHeight - bottomHeight;

        const matrix = node.worldMatrix;

        this.fillVertices(vBuf, vertexOffset, matrix, this.row, this.col, renderData.data);

        const offset = _perVertexLength;
        const offset1 = offset; const offset2 = offset * 2; const offset3 = offset * 3; const offset4 = offset * 4;
        let coefU = 0; let coefV = 0;
        for (let yIndex = 0, yLength = this.row; yIndex < yLength; ++yIndex) {
            if (this.sizableHeight > centerHeight) {
                if (this.sizableHeight >= yIndex * centerHeight) {
                    coefV = 1;
                } else {
                    coefV = this.vRepeat % 1;
                }
            } else {
                coefV = this.vRepeat;
            }
            for (let xIndex = 0, xLength = this.col; xIndex < xLength; ++xIndex) {
                if (this.sizableWidth > centerWidth) {
                    if (this.sizableWidth >= xIndex * centerWidth) {
                        coefU = 1;
                    } else {
                        coefU = this.hRepeat % 1;
                    }
                } else {
                    coefU = this.hRepeat;
                }

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
                } else {
                    // lb
                    if (xIndex === 0) {
                        vBuf[vertexOffsetU] = uv[0];
                    } else if (xIndex > 0 && xIndex < (this.col - 1)) {
                        vBuf[vertexOffsetU] = uvSliced[1].u;
                    } else if (xIndex === (this.col - 1)) {
                        vBuf[vertexOffsetU] = uvSliced[2].u;
                    }
                    if (yIndex === 0) {
                        vBuf[vertexOffsetV] = uvSliced[0].v;
                    } else if (yIndex > 0 && yIndex < (this.row - 1)) {
                        vBuf[vertexOffsetV] = uvSliced[4].v;
                    } else if (yIndex === (this.row - 1)) {
                        vBuf[vertexOffsetV] = uvSliced[8].v;
                    }
                    // rb
                    if (xIndex === 0) {
                        vBuf[vertexOffsetU + offset1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefU;
                    } else if (xIndex > 0 && xIndex < (this.col - 1)) {
                        vBuf[vertexOffsetU + offset1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefU;
                    } else if (xIndex === (this.col - 1)) {
                        vBuf[vertexOffsetU + offset1] = uvSliced[3].u;
                    }
                    if (yIndex === 0) {
                        vBuf[vertexOffsetV + offset1] = uvSliced[0].v;
                    } else if (yIndex > 0 && yIndex < (this.row - 1)) {
                        vBuf[vertexOffsetV + offset1] = uvSliced[4].v;
                    } else if (yIndex === (this.row - 1)) {
                        vBuf[vertexOffsetV + offset1] = uvSliced[8].v;
                    }
                    // lt
                    if (xIndex === 0) {
                        vBuf[vertexOffsetU + offset2] = uv[0];
                    } else if (xIndex > 0 && xIndex < (this.col - 1)) {
                        vBuf[vertexOffsetU + offset2] = uvSliced[1].u;
                    } else if (xIndex === (this.col - 1)) {
                        vBuf[vertexOffsetU + offset2] = uvSliced[2].u;
                    }
                    if (yIndex === 0) {
                        vBuf[vertexOffsetV + offset2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefV;
                    } else if (yIndex > 0 && yIndex < (this.row - 1)) {
                        vBuf[vertexOffsetV + offset2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefV;
                    } else if (yIndex === (this.row - 1)) {
                        vBuf[vertexOffsetV + offset2] = uvSliced[12].v;
                    }
                    // rt
                    vBuf[vertexOffsetU + offset3] = vBuf[vertexOffsetU + offset1];
                    vBuf[vertexOffsetV + offset3] = vBuf[vertexOffsetV + offset2];
                }
                // color
                Color.toArray(vBuf, sprite.color, vertexOffsetV + 1);
                Color.toArray(vBuf, sprite.color, vertexOffsetV + offset1 + 1);
                Color.toArray(vBuf, sprite.color, vertexOffsetV + offset2 + 1);
                Color.toArray(vBuf, sprite.color, vertexOffsetV + offset3 + 1);
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

    updateVerts (sprite: Sprite) {
        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const data = sprite.renderData!.data;
        const frame = sprite.spriteFrame!;

        const rect = frame.getRect();
        const contentWidth = Math.abs(uiTrans.width);
        const contentHeight = Math.abs(uiTrans.height);
        const appx = uiTrans.anchorX * contentWidth;
        const appy = uiTrans.anchorY * contentHeight;
        const leftWidth = frame.insetLeft;
        const rightWidth = frame.insetRight;
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = frame.insetTop;
        const bottomHeight = frame.insetBottom;
        const centerHeight = rect.height - topHeight - bottomHeight;

        const xScale = (uiTrans.width / (leftWidth + rightWidth)) > 1 ? 1 : (uiTrans.width / (leftWidth + rightWidth));
        const yScale = (uiTrans.height / (topHeight + bottomHeight)) > 1 ? 1 : (uiTrans.height / (topHeight + bottomHeight));
        let offsetWidth = 0;
        let offsetHeight = 0;

        if (centerWidth > 0) {
            /*
             * Because the float numerical calculation in javascript is not accurate enough,
             * there is an expected result of 1.0, but the actual result is 1.000001.
             */
            offsetWidth = Math.floor(this.sizableWidth * 1000) / 1000 % centerWidth === 0 ? centerWidth : this.sizableWidth % centerWidth;
        } else {
            offsetWidth = this.sizableWidth;
        }
        if (centerHeight > 0) {
            offsetHeight = Math.floor(this.sizableHeight * 1000) / 1000 % centerHeight === 0 ? centerHeight : this.sizableHeight % centerHeight;
        } else {
            offsetHeight = this.sizableHeight;
        }

        for (let i = 0; i <= this.col; i++) {
            if (i === 0) {
                data[i].x = -appx;
            } else if (i > 0 && i < this.col) {
                if (i === 1) {
                    data[i].x = leftWidth * xScale + Math.min(centerWidth, this.sizableWidth) - appx;
                } else if (centerWidth > 0) {
                    if (i === (this.col - 1)) {
                        data[i].x = leftWidth + offsetWidth + centerWidth * (i - 2) - appx;
                    } else {
                        data[i].x = leftWidth + Math.min(centerWidth, this.sizableWidth) + centerWidth * (i - 2) - appx;
                    }
                } else {
                    data[i].x = leftWidth + this.sizableWidth - appx;
                }
            } else if (i === this.col) {
                data[i].x = Math.min(leftWidth + this.sizableWidth + rightWidth, contentWidth) - appx;
            }
        }
        for (let i = 0; i <= this.row; i++) {
            if (i === 0) {
                data[i].y = -appy;
            } else if (i > 0 && i < this.row) {
                if (i === 1) {
                    data[i].y = bottomHeight * yScale + Math.min(centerHeight, this.sizableHeight) - appy;
                } else if (centerHeight > 0) {
                    if (i === (this.row - 1)) {
                        data[i].y = bottomHeight + offsetHeight + (i - 2) * centerHeight - appy;
                    } else {
                        data[i].y = bottomHeight + Math.min(centerHeight, this.sizableHeight) + (i - 2) * centerHeight - appy;
                    }
                } else {
                    data[i].y = bottomHeight + this.sizableHeight - appy;
                }
            } else if (i === this.row) {
                data[i].y = Math.min(bottomHeight + this.sizableHeight + topHeight, contentHeight) - appy;
            }
        }
    },
};
