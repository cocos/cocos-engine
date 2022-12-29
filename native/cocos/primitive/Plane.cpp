
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

#include "primitive/Plane.h"
namespace cc {

IGeometry plane(ccstd::optional<IPlaneOptions> options) {
    if (!options.has_value()) {
        options = IPlaneOptions();
    }
    const float width = options->width;
    const float length = options->length;
    const uint32_t uSegments = options->widthSegments;
    const uint32_t vSegments = options->lengthSegments;

    const float hw = width * 0.5F;
    const float hl = length * 0.5F;

    ccstd::vector<float> positions;
    ccstd::vector<float> uvs;
    ccstd::vector<uint32_t> indices;
    const Vec3 minPos(-hw, 0, -hl);
    const Vec3 maxPos(hw, 0, hl);
    const float boundingRadius = sqrt(width * width + length * length);

    Vec3 c00(-hw, 0, hl);
    Vec3 c10(hw, 0, hl);
    Vec3 c01(-hw, 0, -hl);

    for (uint32_t y = 0; y <= vSegments; ++y) {
        for (uint32_t x = 0; x <= uSegments; ++x) {
            const float u = static_cast<float>(x) / static_cast<float>(uSegments);
            const float v = static_cast<float>(y) / static_cast<float>(vSegments);

            Vec3 temp1 = c00.lerp(c10, u);
            Vec3 temp2 = c00.lerp(c01, v);
            temp2.subtract(c00);
            temp1.add(temp2);

            positions.emplace_back(temp1.x);
            positions.emplace_back(temp1.y);
            positions.emplace_back(temp1.z);
            if (options->includeUV) {
                uvs.emplace_back(u);
                uvs.emplace_back(v);
            }

            if ((x < uSegments) && (y < vSegments)) {
                const uint32_t uSeg1 = uSegments + 1;
                const uint32_t a = x + y * uSeg1;
                const uint32_t b = x + (y + 1) * uSeg1;
                const uint32_t c = (x + 1) + (y + 1) * uSeg1;
                const uint32_t d = (x + 1) + y * uSeg1;

                indices.emplace_back(a);
                indices.emplace_back(d);
                indices.emplace_back(b);
                indices.emplace_back(d);
                indices.emplace_back(c);
                indices.emplace_back(b);
            }
        }
    }

    IGeometry result;
    result.positions = positions;
    result.boundingRadius = boundingRadius;
    result.minPos = minPos;
    result.maxPos = maxPos;
    result.indices = indices;

    if (options->includeNormal) {
        const uint32_t nVertex = (vSegments + 1) * (uSegments + 1);
        ccstd::vector<float> normals(3 * nVertex);
        for (uint32_t i = 0; i < nVertex; ++i) {
            normals[i * 3 + 0] = 0;
            normals[i * 3 + 1] = 1;
            normals[i * 3 + 2] = 0;
        }
        result.normals = normals;
    }
    if (options->includeUV) {
        result.uvs = uvs;
    }
    return result;
}

} // namespace cc
