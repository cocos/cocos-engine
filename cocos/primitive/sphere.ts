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
 * @zh
 * 球参数选项。
 * @en
 * The options of sphere
 */
interface ISphereOptions extends IGeometryOptions {
    segments: number;
}

/**
 * @en
 * Generate a shpere with radius 0.5.
 * @zh
 * 生成一个球。
 * @param radius @en The radius. @zh 球半径。
 * @param options @en The sphere creation options. @zh 参数选项。
 */
export default function sphere (radius = 0.5, opts: RecursivePartial<ISphereOptions> = {}): IGeometry {
    const segments = opts.segments !== undefined ? opts.segments : 32;

    // lat === latitude
    // lon === longitude

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const minPos = new Vec3(-radius, -radius, -radius);
    const maxPos = new Vec3(radius, radius, radius);
    const boundingRadius = radius;

    for (let lat = 0; lat <= segments; ++lat) {
        const theta = lat * Math.PI / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = -Math.cos(theta);

        for (let lon = 0; lon <= segments; ++lon) {
            const phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = sinPhi * sinTheta;
            const y = cosTheta;
            const z = cosPhi * sinTheta;
            const u = lon / segments;
            const v = lat / segments;

            positions.push(x * radius, y * radius, z * radius);
            normals.push(x, y, z);
            uvs.push(u, v);

            if ((lat < segments) && (lon < segments)) {
                const seg1 = segments + 1;
                const a = seg1 * lat + lon;
                const b = seg1 * (lat + 1) + lon;
                const c = seg1 * (lat + 1) + lon + 1;
                const d = seg1 * lat + lon + 1;

                indices.push(a, d, b);
                indices.push(d, c, b);
            }
        }
    }

    return {
        positions,
        indices,
        normals,
        uvs,
        minPos,
        maxPos,
        boundingRadius,
    };
}
