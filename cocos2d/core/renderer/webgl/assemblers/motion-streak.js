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

import Assembler2D from '../../assembler-2d';

const MotionStreak = require('../../../components/CCMotionStreak');
const RenderFlow = require('../../render-flow');

function Point (point, dir) {
    this.point = point || cc.v2();
    this.dir = dir || cc.v2();
    this.distance = 0;
    this.time = 0;
}

Point.prototype.setPoint = function (x, y) {
    this.point.x = x;
    this.point.y = y;
};

Point.prototype.setDir = function (x, y) {
    this.dir.x = x;
    this.dir.y = y;
};

let _tangent = cc.v2();
let _miter = cc.v2();
let _normal = cc.v2();
let _vec2 = cc.v2();

function normal (out, dir) {
    //get perpendicular
    out.x = -dir.y;
    out.y = dir.x;
    return out
}

function computeMiter (miter, lineA, lineB, halfThick, maxMultiple) {
    //get tangent line
    lineA.add(lineB, _tangent);
    _tangent.normalizeSelf();

    //get miter as a unit vector
    miter.x = -_tangent.y;
    miter.y = _tangent.x;
    _vec2.x = -lineA.y; 
    _vec2.y = lineA.x;

    //get the necessary length of our miter
    let multiple = 1 / miter.dot(_vec2);
    if (maxMultiple) {
        multiple = Math.min(multiple, maxMultiple);
    }
    return halfThick * multiple;
}

export default class MotionStreakAssembler extends Assembler2D {
    constructor () {
        super();
        this._tailShortenTime = 0;
    }

    initData () {
        this._renderData.createFlexData(0, 16, (16 - 2) * 3);
    }

    update (comp, dt) {
        if (CC_EDITOR && !comp.preview) return;

        let stroke = comp._stroke / 2;

        let node = comp.node;
        let matrix = node._worldMatrix.m;
        let tx = matrix[12], ty = matrix[13];

        let points = comp._points;
        let lastPos = comp._lastWPos;
        let fadeTime = comp._fadeTime;

        let moved = lastPos.x !== tx || lastPos.y !== ty;
        if (moved) {
            let cur;
            let newHead = false;
            if (points.length === 0) {
                // new
                let prev = new Point();
                prev.setPoint(lastPos.x, lastPos.y);
                this._tailShortenTime = prev.time = fadeTime;
                points.push(prev);

                cur = new Point();
                points.unshift(cur);
            }
            else {
                // check moved distance
                cur = points[0];
                let prev = points[1];
                let difx = prev.point.x - tx;
                let dify = prev.point.y - ty;
                newHead = ((difx*difx + dify*dify) >= comp.minSeg*comp.minSeg);
            }
            // update head
            cur.setPoint(tx, ty);
            cur.time = fadeTime + dt;
            let prev = points[1];
            cur.distance = cur.point.sub(prev.point, _vec2).mag();
            _vec2.normalizeSelf();
            cur.setDir(_vec2.x, _vec2.y);

            let prevIsTail = points.length === 2;
            if (prevIsTail) {
                prev.setDir(_vec2.x, _vec2.y);
            }

            if (newHead) {
                let point = new Point(cur.point.clone(), cur.dir.clone());
                point.distance = cur.distance;
                point.time = cur.time;
                points.unshift(point);
            }
        }

        lastPos.x = tx;
        lastPos.y = ty;

        if (points.length < 2) {
            return;
        }

        // cc.log(points.map(x => x.time.toFixed(2)).reverse().join(' '), ',', this._tailShortenTime.toFixed(2));

        let color = comp._color, ca = color.a;
        let crgb = (color.b<<16) | (color.g<<8) | color.r;

        let verticesCount = 0;
        let indicesCount = 0;
        let flexBuffer = this._renderData._flexBuffer;
        flexBuffer.reserve(points.length*2, (points.length-1)*6);
        let vData = flexBuffer.vData;
        let uintVData = flexBuffer.uintVData;
        let vertsOffset = 5;

        for (let i = points.length - 1; i >=0 ; i--) {
            let p = points[i];
            let point = p.point;
            let dir = p.dir;
            p.time -= dt;

            let isLast = i === points.length - 1;

            if (p.time <= 0) {
                if (isLast && i - 1 >= 0) {
                    this._tailShortenTime = points[i - 1].time - dt;
                }
                points.splice(i, 1);
                continue;
            }

            let progress = p.time / fadeTime;

            if (isLast) {
                let next = points[i - 1];
                if (!next) {
                    points.splice(i, 1);
                    continue;
                }
                let nextIsStatic = points.length >= 3;
                if (nextIsStatic) {
                    let segmentProgress = p.time / this._tailShortenTime;
                    if (segmentProgress <= 1) {
                        point.x = next.point.x - next.distance * next.dir.x * segmentProgress;
                        point.y = next.point.y - next.distance * next.dir.y * segmentProgress;
                    }
                }
                else {
                    this._tailShortenTime = p.time;
                }
            }

            normal(_normal, dir);

            
            let da = progress * ca;
            let c = ((da<<24) >>> 0) | crgb;

            let offset = verticesCount * vertsOffset;

            vData[offset] = point.x + _normal.x * stroke;
            vData[offset + 1] = point.y + _normal.y * stroke;
            vData[offset + 2] = 1;
            vData[offset + 3] = progress;
            uintVData[offset + 4] = c;
            
            offset += vertsOffset;

            vData[offset] = point.x - _normal.x * stroke;
            vData[offset + 1] = point.y - _normal.y * stroke;
            vData[offset + 2] = 0;
            vData[offset + 3] = progress;
            uintVData[offset + 4] = c;
            
            verticesCount += 2;
        }

        indicesCount = verticesCount <= 2 ? 0 : (verticesCount - 2) * 3;

        flexBuffer.used(verticesCount, indicesCount);
    }

    fillBuffers (comp, renderer) {
        let { vData, usedVertices, usedIndices, usedVerticesFloats } = this._renderData._flexBuffer;

        let buffer = renderer._meshBuffer;
        let offsetInfo = buffer.request(usedVertices, usedIndices);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        if (vData.length + vertexOffset > vbuf.length) {
            vbuf.set(vData.subarray(0, usedVerticesFloats), vertexOffset);
        }
        else {
            vbuf.set(vData, vertexOffset);
        }

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;

        // index buffer
        for (let i = 0, l = usedVertices; i < l; i += 2) {
            let start = vertexId + i;
            ibuf[indiceOffset++] = start;
            ibuf[indiceOffset++] = start + 2;
            ibuf[indiceOffset++] = start + 1;
            ibuf[indiceOffset++] = start + 1;
            ibuf[indiceOffset++] = start + 2;
            ibuf[indiceOffset++] = start + 3;
        }

        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
}

MotionStreakAssembler.register(MotionStreak, MotionStreakAssembler);
