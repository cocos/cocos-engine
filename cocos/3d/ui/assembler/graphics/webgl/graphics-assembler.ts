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
 * @category ui-assembler
 */

import { Color, Vec2, Vec3 } from '../../../../../core/math';
import { GFXPrimitiveMode } from '../../../../../gfx';
import { Model } from '../../../../../renderer';
import { RenderScene } from '../../../../../renderer/scene/render-scene';
import { IARenderData } from '../../../../../renderer/ui/renderData';
import { UI } from '../../../../../renderer/ui/ui';
import { createMesh } from '../../../../misc/utils';
import { GraphicsComponent } from '../../../components';
import { vfmt } from '../../../ui-vertex-format';
import { IAssembler } from '../../base';
import { LineCap, LineJoin, PointFlags } from '../types';
import { earcut as Earcut } from './earcut';
import { Impl, Point } from './impl';

const MAX_VERTEX = 65535;
const MAX_INDICE = MAX_VERTEX * 2;

const PI = Math.PI;
const min = Math.min;
const max = Math.max;
const ceil = Math.ceil;
const acos = Math.acos;
const cos = Math.cos;
const sin = Math.sin;
const atan2 = Math.atan2;
const abs = Math.abs;

const attrBytes = 9;

const attrs = vfmt;
const positions: number[] = [];
const uvs: number[] = [];
const colors: number[] = [];
const indices: number[] = [];

let _renderData: IARenderData | null = null;
let _impl: Impl | null = null;
const _curColor = new Color();

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

function curveDivs (r: number, arc: number, tol: number) {
    const da = acos(r / (r + tol)) * 2.0;
    return max(2, ceil(arc / da));
}

function clamp (v: number, minNum: number, maxNum: number) {
    if (v < minNum) {
        return minNum;
    }
    else if (v > maxNum) {
        return maxNum;
    }
    return v;
}

/**
 * graphics 组装器
 * 可通过 cc.UI.graphicsAssembler 获取该组装器。
 */
export const graphicsAssembler: IAssembler = {
    useModel: true,
    createImpl (graphics: GraphicsComponent) {
        return new Impl();
    },

    updateRenderData (graphics: GraphicsComponent) {
        const datas = graphics.impl ? graphics.impl.getRenderDatas() : [];
        for (let i = 0, l = datas.length; i < l; i++) {
            datas[i].material = graphics.material;
        }
    },

    fillBuffers (graphics: GraphicsComponent, renderer: UI) {
        // this.renderIA!(graphics, renderer);
    },

    renderIA (graphics: GraphicsComponent, renderer: UI) {
        // const impl = graphics.impl;
        // let renderDatas = impl && impl.getRenderDatas();
        // if (!renderDatas) {
        //     renderDatas = [];
        // }

        // let bufferBatch = renderer.currBufferBatch!;
        // let vertexId = 0;
        // let byteoffset = 0;
        // let indicesOffset = 0;
        // for (const renderData of renderDatas) {
        //     if (!graphics.material || renderData.byteCount <= 0 || renderData.indiceCount <= 0) {
        //         continue;
        //     }

        //     vertexId = bufferBatch.vertexOffset;
        //     byteoffset = bufferBatch.byteOffset;
        //     indicesOffset = bufferBatch.indiceOffset;
        //     bufferBatch.request(renderData.vertexCount, renderData.indiceCount);
        //     bufferBatch = renderer.currBufferBatch!;
        //     const vData = bufferBatch.vData!;
        //     const iData = bufferBatch.iData!;
        //     // the data format is strictly in accordance with pos uv color
        //     const vDataCopy = renderData.vData.slice(0, renderData.byteCount >> 2);
        //     vData.set(vDataCopy, byteoffset >> 2);

        //     let iDataCopy = renderData.iData.slice(0, renderData.indiceCount);
        //     iDataCopy = iDataCopy.map((v) => {
        //         return v + vertexId;
        //     });
        //     iData.set(iDataCopy, indicesOffset);

        //     renderer.forceMergeBatches(graphics.material, null);
        // }
    },

    getRenderData (graphics: GraphicsComponent, cverts: number) {
        if (!_impl) {
            return null;
        }

        const renderDatas = _impl.getRenderDatas();
        let renderData = renderDatas[_impl.dataOffset];
        if (!renderData) {
            return null;
        }

        let meshbuffer = renderData;

        const maxVertsCount = meshbuffer ? meshbuffer.vertexCount + cverts : 0;
        if (maxVertsCount > MAX_VERTEX || maxVertsCount * 3 > MAX_INDICE) {
            ++_impl.dataOffset;
            // maxVertsCount = cverts;

            if (_impl.dataOffset < renderDatas.length) {
                renderData = renderDatas[_impl.dataOffset];
            }
            else {
                renderData = _impl.requestRenderData();
                renderDatas[_impl.dataOffset] = renderData;
            }

            renderData.material = graphics.material;
            meshbuffer = renderData;
        }

        if (meshbuffer && meshbuffer.vertexCount < maxVertsCount) {
            meshbuffer.request(cverts, cverts * 3);
        }

        return renderData;
    },

    stroke (graphics: GraphicsComponent) {
        Color.copy(_curColor, graphics.strokeColor);
        // graphics.node.getWorldMatrix(_currMatrix);
        if (!graphics.impl) {
            return;
        }

        this._flattenPaths!(graphics.impl);
        this._expandStroke!(graphics);

        graphics.impl.updatePathOffset = true;

        this.end(graphics);
    },

    fill (graphics: GraphicsComponent) {
        Color.copy(_curColor, graphics.fillColor);
        // graphics.node.getWorldMatrix(_currMatrix);

        this._expandFill!(graphics);
        if (graphics.impl) {
            graphics.impl.updatePathOffset = true;
        }

        this.end(graphics);
    },

    end (graphics: GraphicsComponent){
        const scene = cc.director.root.ui.renderScene as RenderScene;
        if (graphics.model){
            graphics.model.destroy();
            scene.destroyModel(graphics.model);
            graphics.model = null;
        }

        const impl = graphics.impl;
        const primitiveMode = GFXPrimitiveMode.TRIANGLE_LIST;
        const renderDatas = impl && impl.getRenderDatas();
        if (!renderDatas) {
            return;
        }

        let i = 0;
        positions.length = 0;
        uvs.length = 0;
        colors.length = 0;
        indices.length = 0;
        for (const renderData of renderDatas) {
            let len = renderData.byteCount >> 2;
            const vData = renderData.vData;
            for (i = 0; i < len;) {
                positions.push(vData[i++]);
                positions.push(vData[i++]);
                positions.push(vData[i++]);
                uvs.push(vData[i++]);
                uvs.push(vData[i++]);
                colors.push(vData[i++]);
                colors.push(vData[i++]);
                colors.push(vData[i++]);
                colors.push(vData[i++]);
            }

            len = renderData.indiceCount;
            const iData = renderData.iData;
            for (i = 0; i < len;) {
                indices.push(iData[i++]);
            }
        }

        const mesh = createMesh({
            primitiveMode,
            positions,
            uvs,
            colors,
            attributes: attrs,
            indices,
        }, undefined, { calculateBounds: false });

        graphics.model = scene.createModel(Model, graphics.node);
        graphics.model.initSubModel(0, mesh.getSubMesh(0), graphics.material!);
        graphics.model.enabled = true;
    },

    _expandStroke (graphics: GraphicsComponent) {
        const w = graphics.lineWidth * 0.5;
        const lineCap = graphics.lineCap;
        const lineJoin = graphics.lineJoin;
        const miterLimit = graphics.miterLimit;

        _impl = graphics.impl;

        if (!_impl) {
            return;
        }

        const ncap = curveDivs(w, PI, _impl.tessTol);

        this._calculateJoins(_impl, w, lineJoin, miterLimit);

        const paths = _impl.paths;

        // Calculate max vertex usage.
        let cverts = 0;
        for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
            const path = paths[i];
            const pointsLength = path.points.length;

            if (lineJoin === LineJoin.ROUND) {
                cverts += (pointsLength + path.nbevel * (ncap + 2) + 1) * 2;
            } // plus one for loop
            else {
                cverts += (pointsLength + path.nbevel * 5 + 1) * 2;
            } // plus one for loop

            if (!path.closed) {
                // space for caps
                if (lineCap === LineCap.ROUND) {
                    cverts += (ncap * 2 + 2) * 2;
                } else {
                    cverts += (3 + 3) * 2;
                }
            }
        }

        const meshbuffer: IARenderData | null = _renderData = this.getRenderData!(graphics, cverts);
        if (!meshbuffer) {
            return;
        }
        const vData = meshbuffer.vData!;
        const iData = meshbuffer.iData!;

        for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
            const path = paths[i];
            const pts = path.points;
            const pointsLength = pts.length;
            const offset = meshbuffer.vertexStart;

            let p0: Point;
            let p1: Point;
            let start = 0;
            let end = 0;
            const loop = path.closed;
            if (loop) {
                // Looping
                p0 = pts[pointsLength - 1];
                p1 = pts[0];
                start = 0;
                end = pointsLength;
            } else {
                // Add cap
                p0 = pts[0];
                p1 = pts[1];
                start = 1;
                end = pointsLength - 1;
            }

            if (!loop) {
                // Add cap
                const dPos = new Point(p1.x, p1.y);
                dPos.subtract(p0);
                dPos.normalize();

                const dx = dPos.x;
                const dy = dPos.y;

                if (lineCap === LineCap.BUTT) {
                    this._buttCap!(p0, dx, dy, w, 0);
                }
                else if (lineCap === LineCap.SQUARE) {
                    this._buttCap!(p0, dx, dy, w, w);
                }
                else if (lineCap === LineCap.ROUND) {
                    this._roundCapStart!(p0, dx, dy, w, ncap);
                }
            }

            for (let j = start; j < end; ++j) {
                if (lineJoin === LineJoin.ROUND) {
                    this._roundJoin(p0, p1, w, w, ncap);
                }
                else if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
                    this._bevelJoin(p0, p1, w, w);
                }
                else {
                    this._vset!(p1.x + p1.dmx * w, p1.y + p1.dmy * w);
                    this._vset!(p1.x - p1.dmx * w, p1.y - p1.dmy * w);
                }

                p0 = p1;
                p1 = pts[j + 1];
            }

            if (loop) {
                // Loop it
                let vDataoOfset = offset * attrBytes;
                let data = vData.slice(vDataoOfset, vDataoOfset + attrBytes);
                vData.set(data, meshbuffer.vertexStart * attrBytes);
                vDataoOfset += attrBytes;
                meshbuffer.vertexStart++;
                data = vData.slice(vDataoOfset, vDataoOfset + attrBytes);
                vData.set(data, meshbuffer.vertexStart * attrBytes);
                meshbuffer.vertexStart++;
            } else {
                // Add cap
                const dPos = new Point(p1.x, p1.y);
                dPos.subtract(p0);
                dPos.normalize();

                const dx = dPos.x;
                const dy = dPos.y;

                if (lineCap === LineCap.BUTT) {
                    this._buttCap!(p1, dx, dy, w, 0);
                }
                else if (lineCap === LineCap.SQUARE) {
                    this._buttCap!(p1, dx, dy, w, w);
                }
                else if (lineCap === LineCap.ROUND) {
                    this._roundCapEnd!(p1, dx, dy, w, ncap);
                }
            }

            // stroke indices
            let indicesOffset = meshbuffer.indiceStart;
            for (let begin = offset + 2, over = meshbuffer.vertexStart; begin < over; begin++) {
                iData[indicesOffset++] = begin - 2;
                iData[indicesOffset++] = begin - 1;
                iData[indicesOffset++] = begin;
            }

            meshbuffer.indiceStart = indicesOffset;
            if (indicesOffset !== meshbuffer.indiceCount) {
                const arr = new Array(meshbuffer.indiceCount - indicesOffset);
                meshbuffer.iData.set(arr, indicesOffset);
            }
        }
        _renderData = null;
        _impl = null;
    },

    _expandFill (graphics: GraphicsComponent) {
        _impl = graphics.impl;
        if (!_impl) {
            return;
        }

        const paths = _impl.paths;

        // Calculate max vertex usage.
        let cverts = 0;
        for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
            const path = paths[i];
            const pointsLength = path.points.length;

            cverts += pointsLength;
        }

        const renderData = _renderData = this.getRenderData!(graphics, cverts);
        if (!renderData) {
            return;
        }

        const meshbuffer = renderData;
        const vData = meshbuffer.vData!;
        const iData = meshbuffer.iData!;

        for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
            const path = paths[i];
            const pts = path.points;
            const pointsLength = pts.length;

            if (pointsLength === 0) {
                continue;
            }

            // Calculate shape vertices.
            const vertexOffset = renderData.vertexStart;

            for (let j = 0; j < pointsLength; ++j) {
                this._vset!(pts[j].x, pts[j].y);
            }

            let indicesOffset = renderData.indiceStart;

            if (path.complex) {
                const earcutData: number[] = [];
                for (let j = vertexOffset, end = renderData.vertexStart; j < end; j++) {
                    let vDataOffset = j * attrBytes;
                    earcutData.push(vData[vDataOffset++]);
                    earcutData.push(vData[vDataOffset++]);
                    earcutData.push(vData[vDataOffset++]);
                }

                const newIndices = Earcut(earcutData, null, 3);

                if (!newIndices || newIndices.length === 0) {
                    continue;
                }

                for (let j = 0, nIndices = newIndices.length; j < nIndices; j++) {
                    iData[indicesOffset++] = newIndices[j] + vertexOffset;
                }
            }
            else {
                const first = vertexOffset;
                for (let start = vertexOffset + 2, end = meshbuffer.vertexStart; start < end; start++) {
                    iData[indicesOffset++] = first;
                    iData[indicesOffset++] = start - 1;
                    iData[indicesOffset++] = start;
                }
            }

            meshbuffer.indiceStart = indicesOffset;
            if (indicesOffset !== meshbuffer.indiceCount) {
                const arr = new Array(meshbuffer.indiceCount - indicesOffset);
                meshbuffer.iData.set(arr, indicesOffset);
            }
        }

        _renderData = null;
        _impl = null;
    },

    _calculateJoins (impl: Impl, w: number, lineJoin: LineJoin, miterLimit: number) {
        let iw = 0.0;

        if (w > 0.0) {
            iw = 1 / w;
        }

        // Calculate which joins needs extra vertices to append, and gather vertex count.
        const paths = impl.paths;
        for (let i = impl.pathOffset, l = impl.pathLength; i < l; i++) {
            const path = paths[i];

            const pts = path.points;
            const ptsLength = pts.length;
            let p0 = pts[ptsLength - 1];
            let p1 = pts[0];
            let nleft = 0;

            path.nbevel = 0;

            for (let j = 0; j < ptsLength; j++) {
                let dmr2 = 0;
                let cross = 0;
                let limit = 0;

                // perp normals
                const dlx0 = p0.dy;
                const dly0 = -p0.dx;
                const dlx1 = p1.dy;
                const dly1 = -p1.dx;

                // Calculate extrusions
                p1.dmx = (dlx0 + dlx1) * 0.5;
                p1.dmy = (dly0 + dly1) * 0.5;
                dmr2 = p1.dmx * p1.dmx + p1.dmy * p1.dmy;
                if (dmr2 > 0.000001) {
                    let scale = 1 / dmr2;
                    if (scale > 600) {
                        scale = 600;
                    }
                    p1.dmx *= scale;
                    p1.dmy *= scale;
                }

                // Keep track of left turns.
                cross = p1.dx * p0.dy - p0.dx * p1.dy;
                if (cross > 0) {
                    nleft++;
                    p1.flags |= PointFlags.PT_LEFT;
                }

                // Calculate if we should use bevel or miter for inner join.
                limit = max(11, min(p0.len, p1.len) * iw);
                if (dmr2 * limit * limit < 1) {
                    p1.flags |= PointFlags.PT_INNERBEVEL;
                }

                // Check to see if the corner needs to be beveled.
                if (p1.flags & PointFlags.PT_CORNER) {
                    if (dmr2 * miterLimit * miterLimit < 1 ||
                        lineJoin === LineJoin.BEVEL ||
                        lineJoin === LineJoin.ROUND) {
                        p1.flags |= PointFlags.PT_BEVEL;
                    }
                }

                if ((p1.flags & (PointFlags.PT_BEVEL | PointFlags.PT_INNERBEVEL)) !== 0) {
                    path.nbevel++;
                }

                p0 = p1;
                p1 = pts[j + 1];
            }
        }
    },

    _flattenPaths (impl: Impl) {
        const paths = impl.paths;
        for (let i = impl.pathOffset, l = impl.pathLength; i < l; i++) {
            const path = paths[i];
            const pts = path.points;

            let p0 = pts[pts.length - 1];
            let p1 = pts[0];

            if (p0.equals(p1)) {
                path.closed = true;
                pts.pop();
                p0 = pts[pts.length - 1];
            }

            for (let j = 0, size = pts.length; j < size; j++) {
                // Calculate segment direction and length
                const dPos = new Point(p1.x, p1.y);
                dPos.subtract(p0);
                p0.len = dPos.length();
                if (dPos.x || dPos.y) {
                    dPos.normalize();
                }
                p0.dx = dPos.x;
                p0.dy = dPos.y;
                // Advance
                p0 = p1;
                p1 = pts[j + 1];
            }
        }
    },

    _chooseBevel (bevel: number, p0: Point, p1: Point, w: number) {
        const x = p1.x;
        const y = p1.y;
        let x0 = 0;
        let y0 = 0;
        let x1 = 0;
        let y1 = 0;

        if (bevel !== 0) {
            x0 = x + p0.dy * w;
            y0 = y - p0.dx * w;
            x1 = x + p1.dy * w;
            y1 = y - p1.dx * w;
        } else {
            x0 = x1 = x + p1.dmx * w;
            y0 = y1 = y + p1.dmy * w;
        }

        return [x0, y0, x1, y1];
    },

    _buttCap (p: Point, dx: number, dy: number, w: number, d: number) {
        const px = p.x - dx * d;
        const py = p.y - dy * d;
        const dlx = dy;
        const dly = -dx;

        this._vset!(px + dlx * w, py + dly * w);
        this._vset!(px - dlx * w, py - dly * w);
    },

    _roundCapStart (p: Point, dx: number, dy: number, w: number, ncap: number) {
        const px = p.x;
        const py = p.y;
        const dlx = dy;
        const dly = -dx;

        for (let i = 0; i < ncap; i++) {
            const a = i / (ncap - 1) * PI;
            const ax = cos(a) * w;
            const ay = sin(a) * w;
            this._vset!(px - dlx * ax - dx * ay, py - dly * ax - dy * ay);
            this._vset!(px, py);
        }
        this._vset!(px + dlx * w, py + dly * w);
        this._vset!(px - dlx * w, py - dly * w);
    },

    _roundCapEnd (p: Point, dx: number, dy: number, w: number, ncap: number) {
        const px = p.x;
        const py = p.y;
        const dlx = dy;
        const dly = -dx;

        this._vset!(px + dlx * w, py + dly * w);
        this._vset!(px - dlx * w, py - dly * w);
        for (let i = 0; i < ncap; i++) {
            const a = i / (ncap - 1) * PI;
            const ax = cos(a) * w;
            const ay = sin(a) * w;
            this._vset!(px, py);
            this._vset!(px - dlx * ax + dx * ay, py - dly * ax + dy * ay);
        }
    },

    _roundJoin (p0: Point, p1: Point, lw: number, rw: number, ncap: number) {
        const dlx0 = p0.dy;
        const dly0 = -p0.dx;
        const dlx1 = p1.dy;
        const dly1 = -p1.dx;

        const p1x = p1.x;
        const p1y = p1.y;

        if ((p1.flags & PointFlags.PT_LEFT) !== 0) {
            const out = this._chooseBevel!(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);
            const lx0 = out[0];
            const ly0 = out[1];
            const lx1 = out[2];
            const ly1 = out[3];

            const a0 = atan2(-dly0, -dlx0);
            let a1 = atan2(-dly1, -dlx1);
            if (a1 > a0) { a1 -= PI * 2; }

            this._vset!(lx0, ly0);
            this._vset!(p1x - dlx0 * rw, p1.y - dly0 * rw);

            const n = clamp(ceil((a0 - a1) / PI) * ncap, 2, ncap);
            for (let i = 0; i < n; i++) {
                const u = i / (n - 1);
                const a = a0 + u * (a1 - a0);
                const rx = p1x + cos(a) * rw;
                const ry = p1y + sin(a) * rw;
                this._vset!(p1x, p1y);
                this._vset!(rx, ry);
            }

            this._vset!(lx1, ly1);
            this._vset!(p1x - dlx1 * rw, p1y - dly1 * rw);
        } else {
            const out = this._chooseBevel!(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);
            const rx0 = out[0];
            const ry0 = out[1];
            const rx1 = out[2];
            const ry1 = out[3];

            const a0 = atan2(dly0, dlx0);
            let a1 = atan2(dly1, dlx1);
            if (a1 < a0) { a1 += PI * 2; }

            this._vset!(p1x + dlx0 * rw, p1y + dly0 * rw, 0);
            this._vset!(rx0, ry0, 0);

            const n = clamp(ceil((a1 - a0) / PI) * ncap, 2, ncap);
            for (let i = 0; i < n; i++) {
                const u = i / (n - 1);
                const a = a0 + u * (a1 - a0);
                const lx = p1x + cos(a) * lw;
                const ly = p1y + sin(a) * lw;
                this._vset!(lx, ly, 0);
                this._vset!(p1x, p1y, 0);
            }

            this._vset!(p1x + dlx1 * rw, p1y + dly1 * rw);
            this._vset!(rx1, ry1);
        }
    },

    _bevelJoin (p0: Point, p1: Point, lw: number, rw: number) {
        let rx0 = 0;
        let ry0 = 0;
        let rx1 = 0;
        let ry1 = 0;
        let lx0 = 0;
        let ly0 = 0;
        let lx1 = 0;
        let ly1 = 0;
        const dlx0 = p0.dy;
        const dly0 = -p0.dx;
        const dlx1 = p1.dy;
        const dly1 = -p1.dx;

        if (p1.flags & PointFlags.PT_LEFT) {
            const out = this._chooseBevel!(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, lw);
            lx0 = out[0];
            ly0 = out[1];
            lx1 = out[2];
            ly1 = out[3];

            this._vset!(lx0, ly0, 0);
            this._vset!(p1.x - dlx0 * rw, p1.y - dly0 * rw, 0);

            this._vset!(lx1, ly1, 0);
            this._vset!(p1.x - dlx1 * rw, p1.y - dly1 * rw, 0);
        } else {
            const out = this._chooseBevel!(p1.flags & PointFlags.PT_INNERBEVEL, p0, p1, -rw);
            rx0 = out[0];
            ry0 = out[1];
            rx1 = out[2];
            ry1 = out[3];

            this._vset!(p1.x + dlx0 * lw, p1.y + dly0 * lw, 0);
            this._vset!(rx0, ry0);

            this._vset!(p1.x + dlx1 * lw, p1.y + dly1 * lw, 0);
            this._vset!(rx1, ry1);
        }
    },

    _vset (x: number, y: number) {
        if (!_renderData) {
            return;
        }

        const meshbuffer = _renderData;
        let dataOffset = meshbuffer.vertexStart * attrBytes;
        const vData = meshbuffer.vData!;
        // vec3.set(_tempVec3, x, y, 0);
        // vec3.transformMat4(_tempVec3, _tempVec3, _currMatrix);

        vData[dataOffset++] = x;
        vData[dataOffset++] = y;
        vData[dataOffset++] = 0;
        vData[dataOffset++] = 1;
        vData[dataOffset++] = 1;
        Color.array(vData!, _curColor, dataOffset);
        meshbuffer.vertexStart ++;
    },
};
