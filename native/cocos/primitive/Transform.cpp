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

#include "primitive/Transform.h"

namespace cc {
IGeometry translate(IGeometry &geometry, const ccstd::optional<Vec3> &offset) {
    const float x = offset.has_value() ? offset->x : 0;
    const float y = offset.has_value() ? offset->y : 0;
    const float z = offset.has_value() ? offset->z : 0;

    const uint32_t nVertex = floor(geometry.positions.size() / 3);

    for (uint32_t iVertex = 0; iVertex < nVertex; ++iVertex) {
        const uint32_t iX = iVertex * 3;
        const uint32_t iY = iVertex * 3 + 1;
        const uint32_t iZ = iVertex * 3 + 2;
        geometry.positions[iX] += x;
        geometry.positions[iY] += y;
        geometry.positions[iZ] += z;
    }

    if (geometry.minPos.has_value()) {
        geometry.minPos->x += x;
        geometry.minPos->y += y;
        geometry.minPos->z += z;
    }

    if (geometry.maxPos.has_value()) {
        geometry.maxPos->x += x;
        geometry.maxPos->y += y;
        geometry.maxPos->z += z;
    }

    return geometry;
}

IGeometry scale(IGeometry &geometry, const ccstd::optional<Vec3> &value) {
    const float x = value.has_value() ? value->x : 0;
    const float y = value.has_value() ? value->y : 0;
    const float z = value.has_value() ? value->z : 0;

    const uint32_t nVertex = floor(geometry.positions.size() / 3);

    for (uint32_t iVertex = 0; iVertex < nVertex; ++iVertex) {
        const uint32_t iX = iVertex * 3;
        const uint32_t iY = iVertex * 3 + 1;
        const uint32_t iZ = iVertex * 3 + 2;
        geometry.positions[iX] += x;
        geometry.positions[iY] += y;
        geometry.positions[iZ] += z;
    }

    if (geometry.minPos.has_value()) {
        geometry.minPos->x += x;
        geometry.minPos->y += y;
        geometry.minPos->z += z;
    }

    if (geometry.maxPos.has_value()) {
        geometry.maxPos->x += x;
        geometry.maxPos->y += y;
        geometry.maxPos->z += z;
    }
    geometry.boundingRadius = std::max(std::max(x, y), z);

    return geometry;
}

IGeometry wireframed(IGeometry &geometry) {
    const auto indices = geometry.indices;
    if (!indices.has_value()) {
        return geometry;
    }

    // We only support triangles' wireframe.
    if (geometry.primitiveMode.has_value() && geometry.primitiveMode.value() != gfx::PrimitiveMode::TRIANGLE_LIST) {
        return geometry;
    }

    // const offsets = [ [ 0, 1 ], [ 1, 2 ], [ 2, 0 ] ];
    ccstd::vector<ccstd::vector<uint32_t>> offsets{{0, 1}, {1, 2}, {2, 0}};
    ccstd::vector<uint32_t> lines;
    ccstd::unordered_map<uint32_t, uint32_t> lineIDs;
    for (uint32_t i = 0; i < indices->size(); i += 3) {
        for (uint32_t k = 0; k < 3; ++k) {
            const uint32_t i1 = (*indices)[i + offsets[k][0]];
            const uint32_t i2 = (*indices)[i + offsets[k][1]];

            // check if we already have the line in our lines
            const uint32_t id = (i1 > i2) ? ((i2 << 16) | i1) : ((i1 << 16) | i2);
            if (lineIDs.find(id) == lineIDs.end()) {
                lineIDs[id] = 0;
                lines.emplace_back(i1);
                lines.emplace_back(i2);
            }
        }
    }

    geometry.indices = lines;
    geometry.primitiveMode = gfx::PrimitiveMode::LINE_LIST;

    return geometry;
}

} // namespace cc
