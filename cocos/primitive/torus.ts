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
import { IGeometryOptions } from './define';

/**
 * @zh
 * 环面参数选项。
 * @en
 * The options about torus
 */
interface ITorusOptions extends IGeometryOptions {
    radialSegments: number;
    tubularSegments: number;
    arc: number;
}

/**
 * @en
 * Generate a torus with radius 0.4, tube 0.1 and centered at origin.
 * @zh
 * 生成一个环面。
 * @param radius @zh 环面半径。@en The radius fo torus
 * @param tube @zh 管形大小。@en The radius of tube
 * @param opts @zh 参数选项。@en The optional creation parameters of the torus
 */
export default function torus (radius = 0.4, tube = 0.1, opts: RecursivePartial<ITorusOptions> = {}): { positions: number[]; normals: number[]; uvs: number[]; indices: number[]; minPos: Vec3; maxPos: Vec3; boundingRadius: number; } {
    const radialSegments = opts.radialSegments || 32;
    const tubularSegments = opts.tubularSegments || 32;
    const arc = opts.arc || 2.0 * Math.PI;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const minPos = new Vec3(-radius - tube, -tube, -radius - tube);
    const maxPos = new Vec3(radius + tube, tube, radius + tube);
    const boundingRadius = radius + tube;

    for (let j = 0; j <= radialSegments; j++) {
        for (let i = 0; i <= tubularSegments; i++) {
            const u = i / tubularSegments;
            const v = j / radialSegments;

            const u1 = u * arc;
            const v1 = v * Math.PI * 2;

            // vertex
            const x = (radius + tube * Math.cos(v1)) * Math.sin(u1);
            const y = tube * Math.sin(v1);
            const z = (radius + tube * Math.cos(v1)) * Math.cos(u1);

            // this vector is used to calculate the normal
            const nx = Math.sin(u1) * Math.cos(v1);
            const ny = Math.sin(v1);
            const nz = Math.cos(u1) * Math.cos(v1);

            positions.push(x, y, z);
            normals.push(nx, ny, nz);
            uvs.push(u, v);

            if ((i < tubularSegments) && (j < radialSegments)) {
                const seg1 = tubularSegments + 1;
                const a = seg1 * j + i;
                const b = seg1 * (j + 1) + i;
                const c = seg1 * (j + 1) + i + 1;
                const d = seg1 * j + i + 1;

                indices.push(a, d, b);
                indices.push(d, c, b);
            }
        }
    }

    return {
        positions,
        normals,
        uvs,
        indices,
        minPos,
        maxPos,
        boundingRadius,
    };
}
