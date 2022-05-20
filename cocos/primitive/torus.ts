/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { Vec3 } from '../core/math';
import { IGeometryOptions } from './define';

/**
 * @zh
 * 环面参数选项。
 */
interface ITorusOptions extends IGeometryOptions {
    radialSegments: number;
    tubularSegments: number;
    arc: number;
}

/**
 * @en
 * Generate a torus with raidus 0.4, tube 0.1 and centered at origin.
 * @zh
 * 生成一个环面。
 * @param radius 环面半径。
 * @param tube 管形大小。
 * @param opts 参数选项。
 */
export default function torus (radius = 0.4, tube = 0.1, opts: RecursivePartial<ITorusOptions> = {}) {
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
