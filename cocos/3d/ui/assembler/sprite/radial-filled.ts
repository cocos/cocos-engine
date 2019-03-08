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

// const dynamicAtlasManager = require('../../../../utils/dynamic-atlas/manager');
import { SpriteFrame } from '../../../../assets/CCSpriteFrame';
import { Vec2 } from '../../../../core/value-types';
import { color4, vec2 } from '../../../../core/vmath';
import { IRenderData, RenderData } from '../../../../renderer/ui/renderData';
import { UI } from '../../../../renderer/ui/ui';
import { SpriteComponent } from '../../components/sprite-component';
import { IAssembler } from '../assembler';
import { fillVertices3D } from '../utils';

const PI_2 = Math.PI * 2;
const EPSILON = 1e-6;

const _vertPos: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const _vertices: number[] = new Array(4);
const _uvs: number[] = new Array(8);
const _intersectPoint_1: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const _intersectPoint_2: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const _center = new Vec2();
const _triangles: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
const color_temp = color4.create();

function _calcInsectedPoints (left, right, bottom, top, center, angle, intersectPoints) {
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
            const yleft = center.y + tanAngle * (left - center.x);
            intersectPoints[0].x = left;
            intersectPoints[0].y = yleft;
        }
        if ((right - center.x) * cosAngle > 0) {
            const yright = center.y + tanAngle * (right - center.x);

            intersectPoints[2].x = right;
            intersectPoints[2].y = yright;
        }

    }

    if (sinAngle !== 0) {
        cotAngle = cosAngle / sinAngle;
        // calculate  top and bottom
        if ((top - center.y) * sinAngle > 0) {
            const xtop = center.x + cotAngle * (top - center.y);
            intersectPoints[3].x = xtop;
            intersectPoints[3].y = top;
        }
        if ((bottom - center.y) * sinAngle > 0) {
            const xbottom = center.x + cotAngle * (bottom - center.y);
            intersectPoints[1].x = xbottom;
            intersectPoints[1].y = bottom;
        }

    }
}

function _calculateVertices (sprite: SpriteComponent) {
    const node = sprite.node;
    const width = node.width;
    const height = node.height;
    const appx = node.anchorX * width;
    const appy = node.anchorY * height;

    const l = -appx;
    const b = -appy;
    const r = width - appx;
    const t = height - appy;

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
        vec2.set(num, 0, 0);
    }

    if (cx !== vertices[0]) {
        vec2.set(_triangles[0], 3, 0);
    }
    if (cx !== vertices[2]) {
        vec2.set(_triangles[2], 1, 2);
    }
    if (cy !== vertices[1]) {
        vec2.set(_triangles[1], 0, 1);
    }
    if (cy !== vertices[3]) {
        vec2.set(_triangles[3], 2, 3);
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

function _generateTriangle (datas: IRenderData[], offset: number, vert0: Vec2, vert1: Vec2, vert2: Vec2) {
    const vertices = _vertices;
    const v0x = vertices[0];
    const v0y = vertices[1];
    const v1x = vertices[2];
    const v1y = vertices[3];

    datas[offset].x = vert0.x;
    datas[offset].y = vert0.y;
    datas[offset + 1].x = vert1.x;
    datas[offset + 1].y = vert1.y;
    datas[offset + 2].x = vert2.x;
    datas[offset + 2].y = vert2.y;

    let progressX = 0;
    let progressY = 0;
    progressX = (vert0.x - v0x) / (v1x - v0x);
    progressY = (vert0.y - v0y) / (v1y - v0y);
    _generateUV(progressX, progressY, datas, offset);

    progressX = (vert1.x - v0x) / (v1x - v0x);
    progressY = (vert1.y - v0y) / (v1y - v0y);
    _generateUV(progressX, progressY, datas, offset + 1);

    progressX = (vert2.x - v0x) / (v1x - v0x);
    progressY = (vert2.y - v0y) / (v1y - v0y);
    _generateUV(progressX, progressY, datas, offset + 2);
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

export const radialFilled: IAssembler = {
    useModel: false,

    createData (sprite: SpriteComponent) {
        return sprite.requestRenderData();
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
        if (renderData && frame) {
            if (renderData.vertDirty || renderData.uvDirty) {
                const datas = renderData.datas;

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

                _calcInsectedPoints(
                    _vertices[0], _vertices[2],
                    _vertices[1], _vertices[3],
                    _center, fillStart, _intersectPoint_1,
                );
                _calcInsectedPoints(
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
                        _generateTriangle(datas, offset, _center, _vertPos[triangle.x], _vertPos[triangle.y]);
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
                                    datas, offset, _center,
                                    _vertPos[triangle.x],
                                    _intersectPoint_2[triangleIndex],
                                );
                            } else {
                                // startAngle to endAngle
                                _generateTriangle(datas, offset, _center,
                                    _vertPos[triangle.x], _vertPos[triangle.y],
                                );
                            }
                            offset += 3;
                        } else {
                            // startAngle < fillStart
                            if (endAngle <= fillStart) {
                                // all out
                            } else if (endAngle <= fillEnd) {
                                renderData.dataLength = offset + 3;
                                // fillStart to endAngle
                                _generateTriangle(datas, offset, _center,
                                    _intersectPoint_1[triangleIndex],
                                    _vertPos[triangle.y],
                                );
                                offset += 3;
                            } else {
                                renderData.dataLength = offset + 3;
                                // fillStart to fillEnd
                                _generateTriangle(datas, offset, _center,
                                    _intersectPoint_1[triangleIndex],
                                    _intersectPoint_2[triangleIndex],
                                );
                                offset += 3;
                            }
                        }
                        // add 2 * PI
                        startAngle += PI_2;
                        endAngle += PI_2;
                    }
                }

                renderData.indiceCount = renderData.vertexCount = offset;
                renderData.vertDirty = renderData.uvDirty = false;
            }
        }
    },

    fillBuffers (comp: SpriteComponent, renderer: UI) {
        const node = comp.node;
        const renderData: RenderData = comp.renderData!;
        fillVertices3D(node, renderer, renderData, comp.color);
    },
};
