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

#include "primitive/Torus.h"

namespace cc {
IGeometry torus(float radius, float tube, const ccstd::optional<ITorusOptions> &opts) {
    const uint32_t radialSegments = opts.has_value() ? opts->radialSegments : 32;
    const uint32_t tubularSegments = opts.has_value() ? opts->tubularSegments : 32;
    const float arc = opts.has_value() ? opts->arc : math::PI_2;

    ccstd::vector<float> positions;
    ccstd::vector<float> normals;
    ccstd::vector<float> uvs;
    ccstd::vector<uint32_t> indices;
    const Vec3 minPos(-radius - tube, -tube, -radius - tube);
    const Vec3 maxPos(radius + tube, tube, radius + tube);
    const float boundingRadius = radius + tube;

    for (uint32_t j = 0; j <= radialSegments; j++) {
        for (uint32_t i = 0; i <= tubularSegments; i++) {
            const float u = static_cast<float>(i) / static_cast<float>(tubularSegments);
            const float v = static_cast<float>(j) / static_cast<float>(radialSegments);

            const float u1 = u * arc;
            const float v1 = v * math::PI_2;

            // vertex
            const float x = (radius + tube * cos(v1)) * sin(u1);
            const float y = tube * sin(v1);
            const float z = (radius + tube * cos(v1)) * cos(u1);

            // this vector is used to calculate the normal
            const float nx = sin(u1) * cos(v1);
            const float ny = sin(v1);
            const float nz = cos(u1) * cos(v1);

            positions.emplace_back(x);
            positions.emplace_back(y);
            positions.emplace_back(z);
            normals.emplace_back(nx);
            normals.emplace_back(ny);
            normals.emplace_back(nz);

            uvs.emplace_back(u);
            uvs.emplace_back(v);

            if ((i < tubularSegments) && (j < radialSegments)) {
                const uint32_t seg1 = tubularSegments + 1;
                const uint32_t a = seg1 * j + i;
                const uint32_t b = seg1 * (j + 1) + i;
                const uint32_t c = seg1 * (j + 1) + i + 1;
                const uint32_t d = seg1 * j + i + 1;

                indices.emplace_back(a);
                indices.emplace_back(d);
                indices.emplace_back(b);

                indices.emplace_back(d);
                indices.emplace_back(c);
                indices.emplace_back(b);
            }
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
