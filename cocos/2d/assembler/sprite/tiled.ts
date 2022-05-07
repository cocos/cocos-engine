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

import { IUV } from '../../assets';
import { Mat4, Vec3, Color } from '../../../core/math';
import { IRenderData, RenderData } from '../../renderer/render-data';
import { IBatcher } from '../../renderer/i-batcher';
import { Sprite } from '../../components/sprite';
import { UIRenderer } from '../../framework/renderable-2d';
import { IAssembler } from '../../renderer/base';
import { StaticVBChunk } from '../../renderer/static-vb-accessor';

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}
const matrix = new Mat4();

export const tiled: IAssembler = {
    createData (sprite: UIRenderer) {
        return sprite.requestRenderData();
    },

    updateRenderData (sprite: Sprite) {
        const renderData = sprite.renderData!;
        const frame = sprite.spriteFrame!;
        if (!frame || !renderData) {
            return;
        }

        renderData.updateRenderData(sprite, frame);

        if (!renderData.vertDirty) {
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

        let sizableWidth = contentWidth - leftWidth - rightWidth;
        let sizableHeight = contentHeight - topHeight - bottomHeight;
        sizableWidth = sizableWidth > 0 ? sizableWidth : 0;
        sizableHeight = sizableHeight > 0 ? sizableHeight : 0;

        const hRepeat = centerWidth === 0 ? sizableWidth : sizableWidth / centerWidth;
        const vRepeat = centerHeight === 0 ? sizableHeight : sizableHeight / centerHeight;
        const row = Math.ceil(vRepeat + 2);
        const col = Math.ceil(hRepeat + 2);

        renderData.dataLength = Math.max(8, row + 1, col + 1);

        this.updateVerts(sprite, sizableWidth, sizableHeight, row, col);

        // update data property
        renderData.resize(row * col * 4, row * col * 6);
    },

    updateUVs (sprite: Sprite) {
        const renderData = sprite.renderData!;
        renderData.vertDirty = true;
        sprite.markForUpdateRenderData();
    },

    fillBuffers (sprite: Sprite, renderer: IBatcher) {
        const node = sprite.node;
        const renderData: RenderData = sprite.renderData!;
        const chunk = renderData.chunk;
        if (node.hasChangedFlags || renderData.vertDirty) {
            this.updateWorldVertexAndUVData(sprite, chunk);
            renderData.vertDirty = false;
        }

        // forColor
        this.updataColorLate(sprite);

        // update indices
        const bid = chunk.bufferId;
        let vid = chunk.vertexOffset;
        const meshBuffer = chunk.meshBuffer;
        const ib = chunk.meshBuffer.iData;
        let indexOffset = meshBuffer.indexOffset;
        for (let i = 0; i < renderData.indexCount; i += 6) {
            ib[indexOffset++] = vid;
            ib[indexOffset++] = vid + 1;
            ib[indexOffset++] = vid + 2;
            ib[indexOffset++] = vid + 1;
            ib[indexOffset++] = vid + 3;
            ib[indexOffset++] = vid + 2;
            vid += 4;
            meshBuffer.indexOffset += 6;
        }
        meshBuffer.setDirty();
    },

    updateWorldVertexAndUVData (sprite: Sprite, chunk: StaticVBChunk) {
        const node = sprite.node;
        node.getWorldMatrix(matrix);

        const renderData = sprite.renderData!;
        const stride = renderData.floatStride;
        const dataList: IRenderData[] = renderData.data;
        const vData = chunk.vb;

        const uiTrans = node._uiProps.uiTransformComp!;
        const contentWidth = Math.abs(uiTrans.width);
        const contentHeight = Math.abs(uiTrans.height);

        const frame = sprite.spriteFrame!;
        const rotated = frame.rotated;
        const uv = frame.uv;
        const uvSliced: IUV[] = frame.uvSliced;
        const rect = frame.rect;

        const leftWidth = frame.insetLeft;
        const rightWidth = frame.insetRight;
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = frame.insetTop;
        const bottomHeight = frame.insetBottom;
        const centerHeight = rect.height - topHeight - bottomHeight;
        let sizableWidth = contentWidth - leftWidth - rightWidth;
        let sizableHeight = contentHeight - topHeight - bottomHeight;
        sizableWidth = sizableWidth > 0 ? sizableWidth : 0;
        sizableHeight = sizableHeight > 0 ? sizableHeight : 0;
        const hRepeat = centerWidth === 0 ? sizableWidth : sizableWidth / centerWidth;
        const vRepeat = centerHeight === 0 ? sizableHeight : sizableHeight / centerHeight;
        const row = Math.ceil(vRepeat + 2);
        const col = Math.ceil(hRepeat + 2);

        // update Vertex
        let vertexOffset = 0;
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
                    const offset = i * stride;
                    vData[vertexOffset + offset] = vec3_temp.x;
                    vData[vertexOffset + offset + 1] = vec3_temp.y;
                    vData[vertexOffset + offset + 2] = vec3_temp.z;
                }
                vertexOffset += 4 * stride;
            }
        }

        // update UVs
        vertexOffset = 0;
        const offset = stride;
        const offset1 = offset; const offset2 = offset * 2; const offset3 = offset * 3; const offset4 = offset * 4;
        let coefU = 0; let coefV = 0;
        const tempXVerts :any = [];
        const tempYVerts :any = [];
        for (let yIndex = 0, yLength = row; yIndex < yLength; ++yIndex) {
            if (sizableHeight > centerHeight) {
                if (sizableHeight >= yIndex * centerHeight) {
                    coefV = 1;
                } else {
                    coefV = vRepeat % 1;
                }
            } else {
                coefV = vRepeat;
            }
            for (let xIndex = 0, xLength = col; xIndex < xLength; ++xIndex) {
                if (sizableWidth > centerWidth) {
                    if (sizableWidth >= xIndex * centerWidth) {
                        coefU = 1;
                    } else {
                        coefU = hRepeat % 1;
                    }
                } else {
                    coefU = hRepeat;
                }

                const vertexOffsetU = vertexOffset + 3;
                const vertexOffsetV = vertexOffsetU + 1;
                // UV
                if (rotated) {
                    if (yIndex === 0) {
                        tempXVerts[0] = uvSliced[0].u;
                        tempXVerts[1] = uvSliced[0].u;
                        tempXVerts[2] = uvSliced[4].u + (uvSliced[8].u - uvSliced[4].u) * coefV;
                    } else if (yIndex < (row - 1)) {
                        tempXVerts[0] = uvSliced[4].u;
                        tempXVerts[1] = uvSliced[4].u;
                        tempXVerts[2] = uvSliced[4].u + (uvSliced[8].u - uvSliced[4].u) * coefV;
                    } else if (yIndex === (row - 1)) {
                        tempXVerts[0] = uvSliced[8].u;
                        tempXVerts[1] = uvSliced[8].u;
                        tempXVerts[2] = uvSliced[12].u;
                    }
                    if (xIndex === 0) {
                        tempYVerts[0] = uvSliced[0].v;
                        tempYVerts[1] = uvSliced[1].v + (uvSliced[2].v - uvSliced[1].v) * coefU;
                        tempYVerts[2] = uvSliced[0].v;
                    } else if (xIndex < (col - 1)) {
                        tempYVerts[0] = uvSliced[1].v;
                        tempYVerts[1] = uvSliced[1].v + (uvSliced[2].v - uvSliced[1].v) * coefU;
                        tempYVerts[2] = uvSliced[1].v;
                    } else if (xIndex === (col - 1)) {
                        tempYVerts[0] = uvSliced[2].v;
                        tempYVerts[1] = uvSliced[3].v;
                        tempYVerts[2] = uvSliced[2].v;
                    }
                    tempXVerts[3] = tempXVerts[2];
                    tempYVerts[3] = tempYVerts[1];
                } else {
                    if (xIndex === 0) {
                        tempXVerts[0] = uvSliced[0].u;
                        tempXVerts[1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefU;
                        tempXVerts[2] = uv[0];
                    } else if (xIndex < (col - 1)) {
                        tempXVerts[0] = uvSliced[1].u;
                        tempXVerts[1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefU;
                        tempXVerts[2] = uvSliced[1].u;
                    } else if (xIndex === (col - 1)) {
                        tempXVerts[0] = uvSliced[2].u;
                        tempXVerts[1] = uvSliced[3].u;
                        tempXVerts[2] = uvSliced[2].u;
                    }
                    if (yIndex === 0) {
                        tempYVerts[0] = uvSliced[0].v;
                        tempYVerts[1] = uvSliced[0].v;
                        tempYVerts[2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefV;
                    } else if (yIndex < (row - 1)) {
                        tempYVerts[0] = uvSliced[4].v;
                        tempYVerts[1] = uvSliced[4].v;
                        tempYVerts[2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefV;
                    } else if (yIndex === (row - 1)) {
                        tempYVerts[0] = uvSliced[8].v;
                        tempYVerts[1] = uvSliced[8].v;
                        tempYVerts[2] = uvSliced[12].v;
                    }
                    tempXVerts[3] = tempXVerts[1];
                    tempYVerts[3] = tempYVerts[2];
                }
                // lb
                vData[vertexOffsetU] = tempXVerts[0];
                vData[vertexOffsetV] = tempYVerts[0];
                // rb
                vData[vertexOffsetU + offset1] = tempXVerts[1];
                vData[vertexOffsetV + offset1] = tempYVerts[1];
                // lt
                vData[vertexOffsetU + offset2] = tempXVerts[2];
                vData[vertexOffsetV + offset2] = tempYVerts[2];
                // rt
                vData[vertexOffsetU + offset3] = tempXVerts[3];
                vData[vertexOffsetV + offset3] = tempYVerts[3];

                vertexOffset += offset4;
            }
        }
    },

    updateVerts (sprite: Sprite, sizableWidth: number, sizableHeight: number, row: number, col: number) {
        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const renderData: RenderData | null = sprite.renderData;
        const data: IRenderData[] = renderData!.data;
        const frame = sprite.spriteFrame!;

        const rect = frame.rect;
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
            offsetWidth = Math.floor(sizableWidth * 1000) / 1000 % centerWidth === 0 ? centerWidth : sizableWidth % centerWidth;
        } else {
            offsetWidth = sizableWidth;
        }
        if (centerHeight > 0) {
            offsetHeight = Math.floor(sizableHeight * 1000) / 1000 % centerHeight === 0 ? centerHeight : sizableHeight % centerHeight;
        } else {
            offsetHeight = sizableHeight;
        }

        for (let i = 0; i <= col; i++) {
            if (i === 0) {
                data[i].x = -appx;
            } else if (i > 0 && i < col) {
                if (i === 1) {
                    data[i].x = leftWidth * xScale + Math.min(centerWidth, sizableWidth) - appx;
                } else if (centerWidth > 0) {
                    if (i === (col - 1)) {
                        data[i].x = leftWidth + offsetWidth + centerWidth * (i - 2) - appx;
                    } else {
                        data[i].x = leftWidth + Math.min(centerWidth, sizableWidth) + centerWidth * (i - 2) - appx;
                    }
                } else {
                    data[i].x = leftWidth + sizableWidth - appx;
                }
            } else if (i === col) {
                data[i].x = Math.min(leftWidth + sizableWidth + rightWidth, contentWidth) - appx;
            }
        }
        for (let i = 0; i <= row; i++) {
            if (i === 0) {
                data[i].y = -appy;
            } else if (i > 0 && i < row) {
                if (i === 1) {
                    data[i].y = bottomHeight * yScale + Math.min(centerHeight, sizableHeight) - appy;
                } else if (centerHeight > 0) {
                    if (i === (row - 1)) {
                        data[i].y = bottomHeight + offsetHeight + (i - 2) * centerHeight - appy;
                    } else {
                        data[i].y = bottomHeight + Math.min(centerHeight, sizableHeight) + (i - 2) * centerHeight - appy;
                    }
                } else {
                    data[i].y = bottomHeight + sizableHeight - appy;
                }
            } else if (i === row) {
                data[i].y = Math.min(bottomHeight + sizableHeight + topHeight, contentHeight) - appy;
            }
        }
    },

    // fill color here
    updataColorLate (sprite: Sprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.chunk.vb;
        const stride = renderData.floatStride;
        const vertexCount = renderData.vertexCount;

        let colorOffset = 5;
        const color = sprite.color;
        const colorR = color.r / 255;
        const colorG = color.g / 255;
        const colorB = color.b / 255;
        const colorA = sprite.node._uiProps.opacity;
        for (let i = 0; i < vertexCount; i++) {
            vData[colorOffset] = colorR;
            vData[colorOffset + 1] = colorG;
            vData[colorOffset + 2] = colorB;
            vData[colorOffset + 3] = colorA;
            colorOffset += stride;
        }
    },

    // Too early
    updateColor (sprite: Sprite) {
    },
};
