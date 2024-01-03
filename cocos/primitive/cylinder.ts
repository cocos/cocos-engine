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
 * The definition of the parameter for building a cylinder.
 * @zh
 * 圆柱参数选项。
 */
export interface ICylinderOptions extends IGeometryOptions {
    radialSegments: number;
    heightSegments: number;
    capped: boolean;
    arc: number;
}

const temp1 = new Vec3(0, 0, 0);
const temp2 = new Vec3(0, 0, 0);

/**
 * @en
 * Generate a cylinder with radiusTop radiusBottom 0.5, height 2 and centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆柱。
 * @param radiusTop @en Radius of top plane. @zh 顶部半径。
 * @param radiusBottom @en Radius of bottom plane.  @zh 底部半径。
 * @param height @en The cylinder height.  @zh 圆柱的高
 * @param opts @en The optional creation parameters of the cylinder.  @zh 圆柱参数选项。
 */
export default function cylinder (radiusTop = 0.5, radiusBottom = 0.5, height = 2, opts: RecursivePartial<ICylinderOptions> = {}): IGeometry {
    const halfHeight = height * 0.5;
    const radialSegments = opts.radialSegments || 32;
    const heightSegments = opts.heightSegments || 1;
    const capped = opts.capped !== undefined ? opts.capped : true;
    const arc = opts.arc || 2.0 * Math.PI;

    let cntCap = 0;
    if (capped) {
        if (radiusTop > 0) {
            cntCap++;
        }

        if (radiusBottom > 0) {
            cntCap++;
        }
    }

    // calculate vertex count
    let vertCount = (radialSegments + 1) * (heightSegments + 1);
    if (capped) {
        vertCount += ((radialSegments + 1) * cntCap) + (radialSegments * cntCap);
    }

    // calculate index count
    let indexCount = radialSegments * heightSegments * 2 * 3;
    if (capped) {
        indexCount += radialSegments * cntCap * 3;
    }

    const indices = new Array(indexCount);
    const positions = new Array(vertCount * 3);
    const normals = new Array(vertCount * 3);
    const uvs = new Array(vertCount * 2);
    const maxRadius = Math.max(radiusTop, radiusBottom);
    const minPos = new Vec3(-maxRadius, -halfHeight, -maxRadius);
    const maxPos = new Vec3(maxRadius, halfHeight, maxRadius);
    const boundingRadius = Math.sqrt(maxRadius * maxRadius + halfHeight * halfHeight);

    let index = 0;
    let indexOffset = 0;

    generateTorso();

    if (capped) {
        if (radiusBottom > 0) {
            generateCap(false);
        }

        if (radiusTop > 0) {
            generateCap(true);
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

    // =======================
    // internal fucntions
    // =======================

    function generateTorso (): void {
        const indexArray: number[][] = [];

        // this will be used to calculate the normal
        const r = radiusTop - radiusBottom;
        const slope = r * r / height * Math.sign(r);

        // generate positions, normals and uvs
        for (let y = 0; y <= heightSegments; y++) {
            const indexRow: number[] = [];
            const v = y / heightSegments;

            // calculate the radius of the current row
            const radius = v * r + radiusBottom;

            for (let x = 0; x <= radialSegments; ++x) {
                const u = x / radialSegments;
                const theta = u * arc;

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                // vertex
                positions[3 * index] = radius * sinTheta;
                positions[3 * index + 1] = v * height - halfHeight;
                positions[3 * index + 2] = radius * cosTheta;

                // normal
                Vec3.normalize(temp1, Vec3.set(temp2, sinTheta, -slope, cosTheta));
                normals[3 * index] = temp1.x;
                normals[3 * index + 1] = temp1.y;
                normals[3 * index + 2] = temp1.z;

                // uv
                uvs[2 * index] = (1 - u) * 2 % 1;
                uvs[2 * index + 1] = v;

                // save index of vertex in respective row
                indexRow.push(index);

                // increase index
                ++index;
            }

            // now save positions of the row in our index array
            indexArray.push(indexRow);
        }

        // generate indices
        for (let y = 0; y < heightSegments; ++y) {
            for (let x = 0; x < radialSegments; ++x) {
                // we use the index array to access the correct indices
                const i1 = indexArray[y][x];
                const i2 = indexArray[y + 1][x];
                const i3 = indexArray[y + 1][x + 1];
                const i4 = indexArray[y][x + 1];

                // face one
                indices[indexOffset] = i1; ++indexOffset;
                indices[indexOffset] = i4; ++indexOffset;
                indices[indexOffset] = i2; ++indexOffset;

                // face two
                indices[indexOffset] = i4; ++indexOffset;
                indices[indexOffset] = i3; ++indexOffset;
                indices[indexOffset] = i2; ++indexOffset;
            }
        }
    }

    function generateCap (top): void {
        const radius = top ? radiusTop : radiusBottom;
        const sign = top ? 1 : -1;

        // save the index of the first center vertex
        const centerIndexStart = index;

        // first we generate the center vertex data of the cap.
        // because the geometry needs one set of uvs per face,
        // we must generate a center vertex per face/segment

        for (let x = 1; x <= radialSegments; ++x) {
            // vertex
            positions[3 * index] = 0;
            positions[3 * index + 1] = halfHeight * sign;
            positions[3 * index + 2] = 0;

            // normal
            normals[3 * index] = 0;
            normals[3 * index + 1] = sign;
            normals[3 * index + 2] = 0;

            // uv
            uvs[2 * index] = 0.5;
            uvs[2 * index + 1] = 0.5;

            // increase index
            ++index;
        }

        // save the index of the last center vertex
        const centerIndexEnd = index;

        // now we generate the surrounding positions, normals and uvs

        for (let x = 0; x <= radialSegments; ++x) {
            const u = x / radialSegments;
            const theta = u * arc;

            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            // vertex
            positions[3 * index] = radius * sinTheta;
            positions[3 * index + 1] = halfHeight * sign;
            positions[3 * index + 2] = radius * cosTheta;

            // normal
            normals[3 * index] = 0;
            normals[3 * index + 1] = sign;
            normals[3 * index + 2] = 0;

            // uv
            uvs[2 * index] = 0.5 - (sinTheta * 0.5 * sign);
            uvs[2 * index + 1] = 0.5 + (cosTheta * 0.5);

            // increase index
            ++index;
        }

        // generate indices

        for (let x = 0; x < radialSegments; ++x) {
            const c = centerIndexStart + x;
            const i = centerIndexEnd + x;

            if (top) {
                // face top
                indices[indexOffset] = i + 1; ++indexOffset;
                indices[indexOffset] = c; ++indexOffset;
                indices[indexOffset] = i; ++indexOffset;
            } else {
                // face bottom
                indices[indexOffset] = c; ++indexOffset;
                indices[indexOffset] = i + 1; ++indexOffset;
                indices[indexOffset] = i; ++indexOffset;
            }
        }
    }
}
