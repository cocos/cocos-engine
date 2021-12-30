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

import { SpriteFrame } from '../../assets';
import { Color, Mat4, Vec2, Vec3 } from '../../../core/math';
import { IRenderData, RenderData } from '../../renderer/render-data';
import { IBatcher } from '../../renderer/i-batcher';
import { Sprite } from '../../components';
import { IAssembler } from '../../renderer/base';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';
import { StaticVBChunk } from '../../renderer/static-vb-accessor';

const PI_2 = Math.PI * 2;
const EPSILON = 1e-6;
const matrix = new Mat4();
const vec3_temp = new Vec3();

const _vertPos: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const _vertices: number[] = new Array(4);
const _uvs: number[] = new Array(8);
const _intersectPoint_1: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const _intersectPoint_2: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const _center = new Vec2();
const _triangles: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];

function _calcIntersectedPoints (left, right, bottom, top, center: Vec2, angle, intersectPoints: Vec2[]) {
    // left bottom, right, top
    let sinAngle = Math.sin(angle);
    sinAngle = Math.abs(sinAngle) > EPSILON ? sinAngle : 0;
    let cosAngle = Math.cos(angle);
    cosAngle = Math.abs(cosAngle) > EPSILON ? cosAngle : 0;
    let tanAngle = 0;
    let cotAngle = 0;
    if (cosAngle !== 0) {
        tanAngle = sinAngle / cosAngle;
        // calculate right and left
        if ((left - center.x) * cosAngle > 0) {
            const yLeft = center.y + tanAngle * (left - center.x);
            intersectPoints[0].x = left;
            intersectPoints[0].y = yLeft;
        }
        if ((right - center.x) * cosAngle > 0) {
            const yRight = center.y + tanAngle * (right - center.x);

            intersectPoints[2].x = right;
            intersectPoints[2].y = yRight;
        }
    }

    if (sinAngle !== 0) {
        cotAngle = cosAngle / sinAngle;
        // calculate  top and bottom
        if ((top - center.y) * sinAngle > 0) {
            const xTop = center.x + cotAngle * (top - center.y);
            intersectPoints[3].x = xTop;
            intersectPoints[3].y = top;
        }
        if ((bottom - center.y) * sinAngle > 0) {
            const xBottom = center.x + cotAngle * (bottom - center.y);
            intersectPoints[1].x = xBottom;
            intersectPoints[1].y = bottom;
        }
    }
}

function _calculateVertices (sprite: Sprite) {
    const uiTrans = sprite.node._uiProps.uiTransformComp!;
    const width = uiTrans.width;
    const height = uiTrans.height;
    const appX = uiTrans.anchorX * width;
    const appY = uiTrans.anchorY * height;

    const l = -appX;
    const b = -appY;
    const r = width - appX;
    const t = height - appY;

    const vertices = _vertices;
    vertices[0] = l;
    vertices[1] = b;
    vertices[2] = r;
    vertices[3] = t;

    const fillCenter = sprite.fillCenter;
    const cx = _center.x = Math.min(Math.max(0, fillCenter.x), 1) * (r - l) + l;
    const cy = _center.y = Math.min(Math.max(0, fillCenter.y), 1) * (t - b) + b;

    _vertPos[0].x = _vertPos[3].x = l;
    _vertPos[1].x = _vertPos[2].x = r;
    _vertPos[0].y = _vertPos[1].y = b;
    _vertPos[2].y = _vertPos[3].y = t;

    for (const num of _triangles) {
        Vec2.set(num, 0, 0);
    }

    if (cx !== vertices[0]) {
        Vec2.set(_triangles[0], 3, 0);
    }
    if (cx !== vertices[2]) {
        Vec2.set(_triangles[2], 1, 2);
    }
    if (cy !== vertices[1]) {
        Vec2.set(_triangles[1], 0, 1);
    }
    if (cy !== vertices[3]) {
        Vec2.set(_triangles[3], 2, 3);
    }
}

function _calculateUVs (spriteFrame: SpriteFrame) {
    const atlasWidth = spriteFrame.width;
    const atlasHeight = spriteFrame.height;
    const textureRect = spriteFrame.getRect();

    let u0 = 0;
    let u1 = 0;
    let v0 = 0;
    let v1 = 0;
    const uvs = _uvs;

    if (spriteFrame.isRotated()) {
        u0 = (textureRect.x) / atlasWidth;
        u1 = (textureRect.x + textureRect.height) / atlasWidth;

        v0 = (textureRect.y) / atlasHeight;
        v1 = (textureRect.y + textureRect.width) / atlasHeight;

        uvs[0] = uvs[2] = u0;
        uvs[4] = uvs[6] = u1;
        uvs[3] = uvs[7] = v1;
        uvs[1] = uvs[5] = v0;
    } else {
        u0 = (textureRect.x) / atlasWidth;
        u1 = (textureRect.x + textureRect.width) / atlasWidth;

        v0 = (textureRect.y) / atlasHeight;
        v1 = (textureRect.y + textureRect.height) / atlasHeight;

        uvs[0] = uvs[4] = u0;
        uvs[2] = uvs[6] = u1;
        uvs[1] = uvs[3] = v1;
        uvs[5] = uvs[7] = v0;
    }
}

function _getVertAngle (start: Vec2, end: Vec2) {
    const placementX = end.x - start.x;
    const placementY = end.y - start.y;

    if (placementX === 0 && placementY === 0) {
        return 0;
    } else if (placementX === 0) {
        if (placementY > 0) {
            return Math.PI * 0.5;
        } else {
            return Math.PI * 1.5;
        }
    } else {
        let angle = Math.atan(placementY / placementX);
        if (placementX < 0) {
            angle += Math.PI;
        }

        return angle;
    }
}

function _generateTriangle (dataList: IRenderData[], offset: number, vert0: Vec2, vert1: Vec2, vert2: Vec2) {
    const vertices = _vertices;
    const v0x = vertices[0];
    const v0y = vertices[1];
    const v1x = vertices[2];
    const v1y = vertices[3];

    dataList[offset].x = vert0.x;
    dataList[offset].y = vert0.y;
    dataList[offset + 1].x = vert1.x;
    dataList[offset + 1].y = vert1.y;
    dataList[offset + 2].x = vert2.x;
    dataList[offset + 2].y = vert2.y;

    let progressX = 0;
    let progressY = 0;
    progressX = (vert0.x - v0x) / (v1x - v0x);
    progressY = (vert0.y - v0y) / (v1y - v0y);
    _generateUV(progressX, progressY, dataList, offset);

    progressX = (vert1.x - v0x) / (v1x - v0x);
    progressY = (vert1.y - v0y) / (v1y - v0y);
    _generateUV(progressX, progressY, dataList, offset + 1);

    progressX = (vert2.x - v0x) / (v1x - v0x);
    progressY = (vert2.y - v0y) / (v1y - v0y);
    _generateUV(progressX, progressY, dataList, offset + 2);
}

function _generateUV (progressX: number, progressY: number, data: IRenderData[], offset: number) {
    const uvs = _uvs;
    const px1 = uvs[0] + (uvs[2] - uvs[0]) * progressX;
    const px2 = uvs[4] + (uvs[6] - uvs[4]) * progressX;
    const py1 = uvs[1] + (uvs[3] - uvs[1]) * progressX;
    const py2 = uvs[5] + (uvs[7] - uvs[5]) * progressX;
    const uv = data[offset];
    uv.u = px1 + (px2 - px1) * progressY;
    uv.v = py1 + (py2 - py1) * progressY;
}

/**
 * radialFilled 组装器
 * 可通过 `UI.radialFilled` 获取该组装器。
 */
export const radialFilled: IAssembler = {
    useModel: false,

    createData (sprite: Sprite) {
        return sprite.requestRenderData();
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
            if (renderData.vertDirty || renderData.uvDirty) {
                const dataList = renderData.data;

                let fillStart = sprite.fillStart;
                let fillRange = sprite.fillRange;
                if (fillRange < 0) {
                    fillStart += fillRange;
                    fillRange = -fillRange;
                }

                // do round fill start [0,1), include 0, exclude 1
                while (fillStart >= 1.0) { fillStart -= 1.0; }
                while (fillStart < 0.0) { fillStart += 1.0; }

                fillStart *= PI_2;
                fillRange *= PI_2;
                const fillEnd = fillStart + fillRange;

                // build vertices
                _calculateVertices(sprite);
                // build uvs
                _calculateUVs(frame);

                _calcIntersectedPoints(
                    _vertices[0], _vertices[2],
                    _vertices[1], _vertices[3],
                    _center, fillStart, _intersectPoint_1,
                );
                _calcIntersectedPoints(
                    _vertices[0], _vertices[2],
                    _vertices[1], _vertices[3],
                    _center, fillStart + fillRange, _intersectPoint_2,
                );

                let offset = 0;
                for (let triangleIndex = 0; triangleIndex < 4; ++triangleIndex) {
                    const triangle = _triangles[triangleIndex];
                    if (!triangle) {
                        continue;
                    }
                    // all in
                    if (fillRange >= PI_2) {
                        renderData.dataLength = offset + 3;
                        _generateTriangle(dataList, offset, _center, _vertPos[triangle.x], _vertPos[triangle.y]);
                        offset += 3;
                        continue;
                    }
                    // test against
                    let startAngle = _getVertAngle(_center, _vertPos[triangle.x]);
                    let endAngle = _getVertAngle(_center, _vertPos[triangle.y]);
                    if (endAngle < startAngle) { endAngle += PI_2; }
                    startAngle -= PI_2;
                    endAngle -= PI_2;
                    // testing
                    for (let testIndex = 0; testIndex < 3; ++testIndex) {
                        if (startAngle >= fillEnd) {
                            // all out
                        } else if (startAngle >= fillStart) {
                            renderData.dataLength = offset + 3;
                            if (endAngle >= fillEnd) {
                                // startAngle to fillEnd
                                _generateTriangle(
                                    dataList, offset, _center,
                                    _vertPos[triangle.x],
                                    _intersectPoint_2[triangleIndex],
                                );
                            } else {
                                // startAngle to endAngle
                                _generateTriangle(dataList, offset, _center,
                                    _vertPos[triangle.x], _vertPos[triangle.y]);
                            }
                            offset += 3;
                        } else if (endAngle > fillStart) {
                            // startAngle < fillStart
                            if (endAngle <= fillEnd) {
                                renderData.dataLength = offset + 3;
                                // fillStart to endAngle
                                _generateTriangle(dataList, offset, _center,
                                    _intersectPoint_1[triangleIndex],
                                    _vertPos[triangle.y]);
                                offset += 3;
                            } else {
                                renderData.dataLength = offset + 3;
                                // fillStart to fillEnd
                                _generateTriangle(dataList, offset, _center,
                                    _intersectPoint_1[triangleIndex],
                                    _intersectPoint_2[triangleIndex]);
                                offset += 3;
                            }
                        }
                        // add 2 * PI
                        startAngle += PI_2;
                        endAngle += PI_2;
                    }
                }

                renderData.resize(offset, offset);
                renderData.uvDirty = false;
            }
            renderData.updateRenderData(sprite, frame);
        }
    },

    fillBuffers (comp: Sprite, renderer: IBatcher) {
        const node = comp.node;
        const renderData: RenderData = comp.renderData!;
        const chunk = renderData.chunk;
        if (node.hasChangedFlags || renderData.vertDirty) {
            this.updateWorldVertexAndUVData(comp, chunk);
            renderData.vertDirty = false;
        }

        // forColor
        this.updataColorLate(comp);

        const bid = chunk.bufferId;
        const vid = chunk.vertexOffset;
        const meshBuffer = chunk.vertexAccessor.getMeshBuffer(chunk.bufferId);
        const ib = chunk.vertexAccessor.getIndexBuffer(bid);
        const indexOffset = meshBuffer.indexOffset;
        for (let i = 0; i < renderData.indexCount; i++) {
            ib[indexOffset + i] = vid + i;
        }
        meshBuffer.indexOffset += renderData.indexCount;
        meshBuffer.setDirty();
    },

    updateWorldVertexAndUVData (sprite: Sprite, chunk: StaticVBChunk) {
        const node = sprite.node;
        node.getWorldMatrix(matrix);

        const renderData = sprite.renderData!;
        const stride = renderData.floatStride;
        const dataList = sprite.renderData!.data;
        const vData = chunk.vb;
        const vertexCount = renderData.vertexCount;

        let vertexOffset = 0;
        for (let i = 0; i < vertexCount; i++) {
            const vert = dataList[i];
            Vec3.set(vec3_temp, vert.x, vert.y, 0);
            Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
            vData[vertexOffset + 0] = vec3_temp.x;
            vData[vertexOffset + 1] = vec3_temp.y;
            vData[vertexOffset + 2] = vec3_temp.z;
            vData[vertexOffset + 3] = vert.u;
            vData[vertexOffset + 4] = vert.v;
            vertexOffset += stride;
        }
    },

    updateUVs (sprite: Sprite) {
        const renderData = sprite.renderData!;
        renderData.vertDirty = true;
        sprite.markForUpdateRenderData();
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
