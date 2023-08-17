/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Vec3 } from '../core';
import { IGeometry, IGeometryOptions } from './define';

/**
 * @en
 * The definition of the parameter for building a box.
 * @zh
 * 立方体参数选项。
 */
interface IBoxOptions extends RecursivePartial<IGeometryOptions> {
    /**
     * @en
     * Box extent on X-axis.
     * @zh
     * 立方体宽度。
     */
    width?: number;

    /**
     * @en
     * Box extent on Y-axis.
     * @zh
     * 立方体高度。
     */
    height?: number;

    /**
     * @en
     * Box extent on Z-axis.
     * @zh
     * 立方体长度。
     */
    length?: number;

    /**
     * @en
     * Segment count on X-axis.
     * @zh
     * 宽度线段数。
     */
    widthSegments?: number;

    /**
     * @en
     * Segment count on Y-axis.
     * @zh
     * 高度线段数。
     */
    heightSegments?: number;

    /**
     * @en
     * Segment count on Z-axis.
     * @zh
     * 长度线段数。
     */
    lengthSegments?: number;
}

/**
 * @en
 * This function generates a box with specified extents and centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个立方体，其大小是定义的范围且中心在原点。
 * @param options @zh 参数选项。@en The optional creation parameters of the box
 */
export default function box (options?: IBoxOptions): IGeometry {
    options = options || {};
    const ws = options.widthSegments || 1;
    const hs = options.heightSegments || 1;
    const ls = options.lengthSegments || 1;

    const hw = (options.width || 1) / 2;
    const hh = (options.height || 1) / 2;
    const hl = (options.length || 1) / 2;

    const corners = [
        Vec3.set(c0, -hw, -hh, hl),
        Vec3.set(c1, hw, -hh, hl),
        Vec3.set(c2, hw, hh, hl),
        Vec3.set(c3, -hw, hh, hl),
        Vec3.set(c4, hw, -hh, -hl),
        Vec3.set(c5, -hw, -hh, -hl),
        Vec3.set(c6, -hw, hh, -hl),
        Vec3.set(c7, hw, hh, -hl),
    ];

    const faceAxes = [
        [2, 3, 1], // FRONT
        [4, 5, 7], // BACK
        [7, 6, 2], // TOP
        [1, 0, 4], // BOTTOM
        [1, 4, 2], // RIGHT
        [5, 0, 6],  // LEFT
    ];

    const faceNormals = [
        [0,  0,  1], // FRONT
        [0,  0, -1], // BACK
        [0,  1,  0], // TOP
        [0, -1,  0], // BOTTOM
        [1,  0,  0], // RIGHT
        [-1,  0,  0],  // LEFT
    ];

    const faceTangents = [
        [-1, 0,  0, 1], // FRONT
        [-1, 0,  0, 1], // BACK
        [-1, 0,  0, 1], // TOP
        [-1, 0,  0, 1], // BOTTOM
        [0, 0, -1, 1], // RIGHT
        [0, 0,  1, 1], // LEFT
    ];

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const tangents: number[] = [];
    const indices: number[] = [];
    const minPos = new Vec3(-hw, -hh, -hl);
    const maxPos = new Vec3(hw, hh, hl);
    const boundingRadius = Math.sqrt(hw * hw + hh * hh + hl * hl);

    function _buildPlane (side: number, uSegments: number, vSegments: number): void {
        let u: number;
        let v: number;
        let ix: number;
        let iy: number;
        const offset = positions.length / 3;
        const faceAxe = faceAxes[side];
        const faceNormal = faceNormals[side];
        const faceTangent = faceTangents[side];

        for (iy = 0; iy <= vSegments; iy++) {
            for (ix = 0; ix <= uSegments; ix++) {
                u = ix / uSegments;
                v = iy / vSegments;

                Vec3.lerp(temp1, corners[faceAxe[0]], corners[faceAxe[1]], u);
                Vec3.lerp(temp2, corners[faceAxe[0]], corners[faceAxe[2]], v);
                Vec3.subtract(temp3, temp2, corners[faceAxe[0]]);
                Vec3.add(r, temp1, temp3);

                positions.push(r.x, r.y, r.z);
                normals.push(faceNormal[0], faceNormal[1], faceNormal[2]);
                uvs.push(u, v);
                tangents.push(faceTangent[0], faceTangent[1], faceTangent[2], faceTangent[3]);

                if ((ix < uSegments) && (iy < vSegments)) {
                    const useg1 = uSegments + 1;
                    const a = ix + iy * useg1;
                    const b = ix + (iy + 1) * useg1;
                    const c = (ix + 1) + (iy + 1) * useg1;
                    const d = (ix + 1) + iy * useg1;

                    indices.push(offset + a, offset + d, offset + b);
                    indices.push(offset + b, offset + d, offset + c);
                }
            }
        }
    }

    _buildPlane(0, ws, hs); // FRONT
    _buildPlane(4, ls, hs); // RIGHT
    _buildPlane(1, ws, hs); // BACK
    _buildPlane(5, ls, hs); // LEFT
    _buildPlane(3, ws, ls); // BOTTOM
    _buildPlane(2, ws, ls); // TOP

    return {
        positions,
        normals,
        uvs,
        tangents,
        indices,
        minPos,
        maxPos,
        boundingRadius,
    };
}

const temp1 = new Vec3();
const temp2 = new Vec3();
const temp3 = new Vec3();
const r = new Vec3();
const c0 = new Vec3();
const c1 = new Vec3();
const c2 = new Vec3();
const c3 = new Vec3();
const c4 = new Vec3();
const c5 = new Vec3();
const c6 = new Vec3();
const c7 = new Vec3();
