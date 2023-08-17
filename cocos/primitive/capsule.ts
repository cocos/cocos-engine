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

/**
 * @en
 * The definition of the parameter for building a capsule.
 * @zh
 * 胶囊体参数选项。
 */
export interface ICapsuteOptions {
    sides: number;
    heightSegments: number;
    capped: boolean;
    arc: number;
}

const temp1 = new Vec3(0, 0, 0);
const temp2 = new Vec3(0, 0, 0);

/**
 * Generate a capsule with radiusTop radiusBottom 0.5, height 2, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个胶囊体。
 * @param radiusTop @zh 顶部半径。 @en The radius of top sphere
 * @param radiusBottom @zh 底部半径。@en The radius of bottom sphere
 * @param opts @zh 胶囊体参数选项。@en The optional creation parameters of the capsule
 */
export default function capsule (radiusTop = 0.5, radiusBottom = 0.5, height = 2, opts: RecursivePartial<ICapsuteOptions> = {}): { positions: number[]; normals: number[]; uvs: number[]; indices: number[]; minPos: Vec3; maxPos: Vec3; boundingRadius: number; } {
    const torsoHeight = height - radiusTop - radiusBottom;
    const sides = opts.sides || 32;
    const heightSegments = opts.heightSegments || 32;
    const bottomProp = radiusBottom / height;
    const torProp = torsoHeight / height;
    const topProp = radiusTop / height;
    const bottomSegments = Math.floor(heightSegments * bottomProp);
    const topSegments = Math.floor(heightSegments * topProp);
    const torSegments = Math.floor(heightSegments * torProp);
    const topOffset = torsoHeight + radiusBottom - height / 2;
    const torOffset = radiusBottom - height / 2;
    const bottomOffset = radiusBottom - height / 2;

    const arc = opts.arc || 2.0 * Math.PI;

    // calculate vertex count
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const maxRadius = Math.max(radiusTop, radiusBottom);
    const minPos = new Vec3(-maxRadius, -height / 2, -maxRadius);
    const maxPos = new Vec3(maxRadius, height / 2, maxRadius);
    const boundingRadius = height / 2;

    let index = 0;
    const indexArray: number[][] = [];

    generateBottom();

    generateTorso();

    generateTop();

    return {
        positions,
        normals,
        uvs,
        indices,
        minPos,
        maxPos,
        boundingRadius,
    };

    // =======================
    // internal fucntions
    // =======================

    function generateTorso (): void {
    // this will be used to calculate the normal
        const slope = (radiusTop - radiusBottom) / torsoHeight;

        // generate positions, normals and uvs
        for (let y = 0; y <= torSegments; y++) {
            const indexRow: number[] = [];
            const lat = y / torSegments;
            const radius = lat * (radiusTop - radiusBottom) + radiusBottom;

            for (let x = 0; x <= sides; ++x) {
                const u = x / sides;
                const v = lat * torProp + bottomProp;
                const theta = u * arc - (arc / 4);

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                // vertex
                positions.push(radius * sinTheta);
                positions.push(lat * torsoHeight + torOffset);
                positions.push(radius * cosTheta);

                // normal
                Vec3.normalize(temp1, Vec3.set(temp2, sinTheta, -slope, cosTheta));
                normals.push(temp1.x);
                normals.push(temp1.y);
                normals.push(temp1.z);

                // uv
                uvs.push(u, v);
                // save index of vertex in respective row
                indexRow.push(index);

                // increase index
                ++index;
            }

            // now save positions of the row in our index array
            indexArray.push(indexRow);
        }

        // generate indices
        for (let y = 0; y < torSegments; ++y) {
            for (let x = 0; x < sides; ++x) {
                // we use the index array to access the correct indices
                const i1 = indexArray[y][x];
                const i2 = indexArray[y + 1][x];
                const i3 = indexArray[y + 1][x + 1];
                const i4 = indexArray[y][x + 1];

                // face one
                indices.push(i1);
                indices.push(i4);
                indices.push(i2);

                // face two
                indices.push(i4);
                indices.push(i3);
                indices.push(i2);
            }
        }
    }

    function generateBottom (): void {
        for (let lat = 0; lat <= bottomSegments; ++lat) {
            const theta = lat * Math.PI / bottomSegments / 2;
            const sinTheta = Math.sin(theta);
            const cosTheta = -Math.cos(theta);

            for (let lon = 0; lon <= sides; ++lon) {
                const phi = lon * 2 * Math.PI / sides - Math.PI / 2.0;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = sinPhi * sinTheta;
                const y = cosTheta;
                const z = cosPhi * sinTheta;
                const u = lon / sides;
                const v = lat / heightSegments;

                positions.push(x * radiusBottom, y * radiusBottom + bottomOffset, z * radiusBottom);
                normals.push(x, y, z);
                uvs.push(u, v);

                if ((lat < bottomSegments) && (lon < sides)) {
                    const seg1 = sides + 1;
                    const a = seg1 * lat + lon;
                    const b = seg1 * (lat + 1) + lon;
                    const c = seg1 * (lat + 1) + lon + 1;
                    const d = seg1 * lat + lon + 1;

                    indices.push(a, d, b);
                    indices.push(d, c, b);
                }

                ++index;
            }
        }
    }

    function generateTop (): void {
        for (let lat = 0; lat <= topSegments; ++lat) {
            const theta = lat * Math.PI / topSegments / 2 + Math.PI / 2;
            const sinTheta = Math.sin(theta);
            const cosTheta = -Math.cos(theta);

            for (let lon = 0; lon <= sides; ++lon) {
                const phi = lon * 2 * Math.PI / sides - Math.PI / 2.0;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = sinPhi * sinTheta;
                const y = cosTheta;
                const z = cosPhi * sinTheta;
                const u = lon / sides;
                const v = lat / heightSegments + (1 - topProp);

                positions.push(x * radiusTop, y * radiusTop + topOffset, z * radiusTop);
                normals.push(x, y, z);
                uvs.push(u, v);

                if ((lat < topSegments) && (lon < sides)) {
                    const seg1 = sides + 1;
                    const a = seg1 * lat + lon + indexArray[torSegments][sides] + 1;
                    const b = seg1 * (lat + 1) + lon + indexArray[torSegments][sides] + 1;
                    const c = seg1 * (lat + 1) + lon + 1 + indexArray[torSegments][sides] + 1;
                    const d = seg1 * lat + lon + 1 + indexArray[torSegments][sides] + 1;

                    indices.push(a, d, b);
                    indices.push(d, c, b);
                }
            }
        }
    }
}
