/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#include "primitive/Cylinder.h"

namespace cc {

float sign(float v) {
    return (v < 0 ? -1.0F : (v > 0 ? 1.0F : 0.0F));
}

IGeometry cylinder(float radiusTop, float radiusBottom, float height, const ccstd::optional<ICylinderOptions> &opts) {
    const float halfHeight = height * 0.5F;
    const uint32_t radialSegments = opts.has_value() ? opts->radialSegments : 32;
    const uint32_t heightSegments = opts.has_value() ? opts->heightSegments : 1;
    const bool capped = opts.has_value() ? opts->capped : true;
    const float arc = opts.has_value() ? opts->arc : math::PI_2;

    uint32_t cntCap = 0;
    if (capped) {
        if (radiusTop > 0) {
            ++cntCap;
        }

        if (radiusBottom > 0) {
            ++cntCap;
        }
    }

    // calculate vertex count
    uint32_t vertCount = (radialSegments + 1) * (heightSegments + 1);
    if (capped) {
        vertCount += ((radialSegments + 1) * cntCap) + (radialSegments * cntCap);
    }

    // calculate index count
    uint32_t indexCount = radialSegments * heightSegments * 2 * 3;
    if (capped) {
        indexCount += radialSegments * cntCap * 3;
    }

    ccstd::vector<uint32_t> indices(indexCount);
    ccstd::vector<float> positions(vertCount * 3);
    ccstd::vector<float> normals(vertCount * 3);
    ccstd::vector<float> uvs(vertCount * 2);
    const float maxRadius = std::max(radiusTop, radiusBottom);
    const Vec3 minPos(-maxRadius, -halfHeight, -maxRadius);
    const Vec3 maxPos(maxRadius, halfHeight, maxRadius);
    const float boundingRadius = sqrt(maxRadius * maxRadius + halfHeight * halfHeight);

    uint32_t index = 0;
    uint32_t indexOffset = 0;

    // =======================
    // internal functions
    // =======================
    auto generateTorso = [&]() {
        ccstd::vector<ccstd::vector<uint32_t>> indexArray;

        // this will be used to calculate the normal
        const float r = radiusTop - radiusBottom;

        const float slope = r * r / height * sign(r);
        // generate positions, normals and uvs
        for (uint32_t y = 0; y <= heightSegments; y++) {
            ccstd::vector<uint32_t> indexRow;
            const float v = static_cast<float>(y) / static_cast<float>(heightSegments);

            // calculate the radius of the current row
            const float radius = v * r + radiusBottom;

            for (uint32_t x = 0; x <= radialSegments; ++x) {
                const float u = static_cast<float>(x) / static_cast<float>(radialSegments);
                const float theta = u * arc;

                const float sinTheta = sin(theta);
                const float cosTheta = cos(theta);

                // vertex
                positions[3 * index] = radius * sinTheta;
                positions[3 * index + 1] = v * height - halfHeight;
                positions[3 * index + 2] = radius * cosTheta;

                // normal
                Vec3 temp1(sinTheta, -slope, cosTheta);
                temp1.normalize();

                normals[3 * index] = temp1.x;
                normals[3 * index + 1] = temp1.y;
                normals[3 * index + 2] = temp1.z;

                // uv
                uvs[2 * index] = fmod((1 - u) * 2.0F, 1.0F);
                uvs[2 * index + 1] = v;

                // save index of vertex in respective row
                indexRow.emplace_back(index);

                // increase index
                ++index;
            }

            // now save positions of the row in our index array
            indexArray.emplace_back(indexRow);
        }

        // generate indices
        for (uint32_t y = 0; y < heightSegments; ++y) {
            for (uint32_t x = 0; x < radialSegments; ++x) {
                // we use the index array to access the correct indices
                const uint32_t i1 = indexArray[y][x];
                const uint32_t i2 = indexArray[y + 1][x];
                const uint32_t i3 = indexArray[y + 1][x + 1];
                const uint32_t i4 = indexArray[y][x + 1];

                // face one
                indices[indexOffset] = i1;
                ++indexOffset;
                indices[indexOffset] = i4;
                ++indexOffset;
                indices[indexOffset] = i2;
                ++indexOffset;

                // face two
                indices[indexOffset] = i4;
                ++indexOffset;
                indices[indexOffset] = i3;
                ++indexOffset;
                indices[indexOffset] = i2;
                ++indexOffset;
            }
        }
    };

    auto generateCap = [&](bool top) {
        const float radius = top ? radiusTop : radiusBottom;
        const float sign = top ? 1 : -1;

        // save the index of the first center vertex
        const uint32_t centerIndexStart = index;

        // first we generate the center vertex data of the cap.
        // because the geometry needs one set of uvs per face,
        // we must generate a center vertex per face/segment

        for (uint32_t x = 1; x <= radialSegments; ++x) {
            // vertex
            positions[3 * index] = 0;
            positions[3 * index + 1] = halfHeight * sign;
            positions[3 * index + 2] = 0;

            // // normal
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
        const uint32_t centerIndexEnd = index;

        // now we generate the surrounding positions, normals and uvs

        for (uint32_t x = 0; x <= radialSegments; ++x) {
            const float u = static_cast<float>(x) / static_cast<float>(radialSegments);
            const float theta = u * arc;

            const float cosTheta = cos(theta);
            const float sinTheta = sin(theta);

            // vertex
            positions[3 * index] = radius * sinTheta;
            positions[3 * index + 1] = halfHeight * sign;
            positions[3 * index + 2] = radius * cosTheta;

            // normal
            normals[3 * index] = 0;
            normals[3 * index + 1] = sign;
            normals[3 * index + 2] = 0;

            // uv
            uvs[2 * index] = 0.5F - (sinTheta * 0.5F * sign);
            uvs[2 * index + 1] = 0.5F + (cosTheta * 0.5F);

            // increase index
            ++index;
        }

        // generate indices

        for (uint32_t x = 0; x < radialSegments; ++x) {
            const uint32_t c = centerIndexStart + x;
            const uint32_t i = centerIndexEnd + x;

            if (top) {
                // face top
                indices[indexOffset] = i + 1;
                ++indexOffset;
                indices[indexOffset] = c;
                ++indexOffset;
                indices[indexOffset] = i;
                ++indexOffset;
            } else {
                // face bottom
                indices[indexOffset] = c;
                ++indexOffset;
                indices[indexOffset] = i + 1;
                ++indexOffset;
                indices[indexOffset] = i;
                ++indexOffset;
            }
        }
    };

    generateTorso();

    if (capped) {
        if (radiusBottom > 0) {
            generateCap(false);
        }

        if (radiusTop > 0) {
            generateCap(true);
        }
    }

    IGeometry info;
    info.positions = positions;
    info.normals = normals;
    info.uvs = uvs;
    info.boundingRadius = boundingRadius;
    info.minPos = minPos;
    info.maxPos = maxPos;
    info.indices = indices;
    return info;
}

} // namespace cc
