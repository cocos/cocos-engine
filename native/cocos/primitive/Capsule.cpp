/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

#include "primitive/Capsule.h"

namespace cc {

IGeometry capsule(float radiusTop, float radiusBottom, float height, const cc::optional<ICapsuleOptions> &opts) {
    const float    torsoHeight    = height - radiusTop - radiusBottom;
    const uint32_t sides          = opts.has_value() ? opts->sides : 32;
    const uint32_t heightSegments = opts.has_value() ? opts->heightSegments : 32;
    const float    bottomProp     = radiusBottom / height;
    const float    torProp        = torsoHeight / height;
    const float    topProp        = radiusTop / height;
    const uint32_t bottomSegments = floor(static_cast<float>(heightSegments) * bottomProp);
    const uint32_t topSegments    = floor(static_cast<float>(heightSegments) * topProp);
    const uint32_t torSegments    = floor(static_cast<float>(heightSegments) * torProp);
    const float    topOffset      = torsoHeight + radiusBottom - height / 2;
    const float    torOffset      = radiusBottom - height / 2;
    const float    bottomOffset   = radiusBottom - height / 2;

    const float arc = opts.has_value() ? opts->arc : math::PI_2;

    // calculate vertex count
    std::vector<float>    positions;
    std::vector<float>    normals;
    std::vector<float>    uvs;
    std::vector<uint32_t> indices;
    const float           maxRadius = std::max(radiusTop, radiusBottom);
    const Vec3            minPos(-maxRadius, -height / 2, -maxRadius);
    const Vec3            maxPos(maxRadius, height / 2, maxRadius);
    const float           boundingRadius = height / 2;

    uint32_t                           index = 0;
    std::vector<std::vector<uint32_t>> indexArray;

    // =======================
    // internal functions
    // =======================
    auto generateTorso = [&]() {
        // this will be used to calculate the normal
        float slope = (radiusTop - radiusBottom) / torsoHeight;

        // generate positions, normals and uvs
        for (uint32_t y = 0; y <= torSegments; y++) {
            std::vector<uint32_t> indexRow;
            const float           lat    = static_cast<float>(y) / static_cast<float>(torSegments);
            const float           radius = lat * (radiusTop - radiusBottom) + radiusBottom;

            for (uint32_t x = 0; x <= sides; ++x) {
                const float u     = static_cast<float>(x) / static_cast<float>(sides);
                const float v     = lat * torProp + bottomProp;
                const float theta = u * arc - (arc / 4);

                const float sinTheta = sin(theta);
                const float cosTheta = cos(theta);

                // vertex
                positions.emplace_back(radius * sinTheta);
                positions.emplace_back(lat * torsoHeight + torOffset);
                positions.emplace_back(radius * cosTheta);

                // normal
                Vec3 temp1(sinTheta, -slope, cosTheta);
                temp1.normalize();

                normals.emplace_back(temp1.x);
                normals.emplace_back(temp1.y);
                normals.emplace_back(temp1.z);

                // uv
                uvs.emplace_back(u);
                uvs.emplace_back(v);
                // save index of vertex in respective row
                indexRow.emplace_back(index);

                // increase index
                ++index;
            }

            // now save positions of the row in our index array
            indexArray.emplace_back(indexRow);
        }

        // generate indices
        for (uint32_t y = 0; y < torSegments; ++y) {
            for (uint32_t x = 0; x < sides; ++x) {
                // we use the index array to access the correct indices
                const uint32_t i1 = indexArray[y][x];
                const uint32_t i2 = indexArray[y + 1][x];
                const uint32_t i3 = indexArray[y + 1][x + 1];
                const uint32_t i4 = indexArray[y][x + 1];

                // face one
                indices.emplace_back(i1);
                indices.emplace_back(i4);
                indices.emplace_back(i2);

                // face two
                indices.emplace_back(i4);
                indices.emplace_back(i3);
                indices.emplace_back(i2);
            }
        }
    };

    auto generateBottom = [&]() {
        for (uint32_t lat = 0; lat <= bottomSegments; ++lat) {
            float theta    = static_cast<float>(lat) * math::PI / static_cast<float>(bottomSegments) / 2;
            float sinTheta = sin(theta);
            float cosTheta = -cos(theta);

            for (uint32_t lon = 0; lon <= sides; ++lon) {
                const float phi    = static_cast<float>(lon) * math::PI_2 / static_cast<float>(sides) - math::PI / 2;
                const float sinPhi = sin(phi);
                const float cosPhi = cos(phi);

                const float x = sinPhi * sinTheta;
                const float y = cosTheta;
                const float z = cosPhi * sinTheta;
                const float u = static_cast<float>(lon) / static_cast<float>(sides);
                const float v = static_cast<float>(lat) / static_cast<float>(heightSegments);

                positions.emplace_back(x * radiusBottom);
                positions.emplace_back(y * radiusBottom + bottomOffset);
                positions.emplace_back(z * radiusBottom);

                normals.emplace_back(x);
                normals.emplace_back(y);
                normals.emplace_back(z);
                uvs.emplace_back(u);
                uvs.emplace_back(v);

                if ((lat < bottomSegments) && (lon < sides)) {
                    const uint32_t seg1 = sides + 1;
                    const uint32_t a    = seg1 * lat + lon;
                    const uint32_t b    = seg1 * (lat + 1) + lon;
                    const uint32_t c    = seg1 * (lat + 1) + lon + 1;
                    const uint32_t d    = seg1 * lat + lon + 1;

                    indices.emplace_back(a);
                    indices.emplace_back(d);
                    indices.emplace_back(b);

                    indices.emplace_back(d);
                    indices.emplace_back(c);
                    indices.emplace_back(b);
                }

                ++index;
            }
        }
    };

    auto generateTop = [&]() {
        for (uint32_t lat = 0; lat <= topSegments; ++lat) {
            const float theta    = static_cast<float>(lat) * math::PI / static_cast<float>(topSegments) / 2 + math::PI / 2;
            const float sinTheta = sin(theta);
            const float cosTheta = -cos(theta);

            for (uint32_t lon = 0; lon <= sides; ++lon) {
                const float phi    = static_cast<float>(lon) * 2 * math::PI / static_cast<float>(sides) - math::PI / 2;
                const float sinPhi = sin(phi);
                const float cosPhi = cos(phi);
                const float x      = sinPhi * sinTheta;
                const float y      = cosTheta;
                const float z      = cosPhi * sinTheta;
                const float u      = static_cast<float>(lon) / static_cast<float>(sides);
                const float v      = static_cast<float>(lat) / static_cast<float>(heightSegments) + (1 - topProp);

                positions.emplace_back(x * radiusTop);
                positions.emplace_back(y * radiusTop + topOffset);
                positions.emplace_back(z * radiusTop);

                normals.emplace_back(x);
                normals.emplace_back(y);
                normals.emplace_back(z);
                uvs.emplace_back(u);
                uvs.emplace_back(v);

                if ((lat < topSegments) && (lon < sides)) {
                    const uint32_t seg1 = sides + 1;
                    const uint32_t a    = seg1 * lat + lon + indexArray[torSegments][sides] + 1;
                    const uint32_t b    = seg1 * (lat + 1) + lon + indexArray[torSegments][sides] + 1;
                    const uint32_t c    = seg1 * (lat + 1) + lon + 1 + indexArray[torSegments][sides] + 1;
                    const uint32_t d    = seg1 * lat + lon + 1 + indexArray[torSegments][sides] + 1;

                    indices.emplace_back(a);
                    indices.emplace_back(d);
                    indices.emplace_back(b);

                    indices.emplace_back(d);
                    indices.emplace_back(c);
                    indices.emplace_back(b);
                }
            }
        }
    };

    generateBottom();

    generateTorso();

    generateTop();

    IGeometry info;
    info.positions      = positions;
    info.normals        = normals;
    info.uvs            = uvs;
    info.boundingRadius = boundingRadius;
    info.minPos         = minPos;
    info.maxPos         = maxPos;
    info.indices        = indices;
    return info;
}

} // namespace cc