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

#include "primitive/Sphere.h"

namespace cc {
IGeometry sphere(float radius, const ccstd::optional<ISphereOptions> &opts) {
    const uint32_t segments = opts.has_value() ? opts->segments : 32;

    // lat === latitude
    // lon === longitude

    ccstd::vector<float> positions;
    ccstd::vector<float> normals;
    ccstd::vector<float> uvs;
    ccstd::vector<uint32_t> indices;
    const Vec3 minPos(-radius, -radius, -radius);
    const Vec3 maxPos(radius, radius, radius);
    const float boundingRadius = radius;

    for (uint32_t lat = 0; lat <= segments; lat++) {
        const float theta = static_cast<float>(lat) * math::PI / static_cast<float>(segments);
        const float sinTheta = sin(theta);
        const float cosTheta = -cos(theta);

        for (uint32_t lon = 0; lon <= segments; ++lon) {
            const float phi = static_cast<float>(lon) * 2.F * math::PI / static_cast<float>(segments) - math::PI / 2.F;
            const float sinPhi = sin(phi);
            const float cosPhi = cos(phi);

            const float x = sinPhi * sinTheta;
            const float y = cosTheta;
            const float z = cosPhi * sinTheta;
            const float u = static_cast<float>(lon) / static_cast<float>(segments);
            const float v = static_cast<float>(lat) / static_cast<float>(segments);

            positions.emplace_back(x * radius);
            positions.emplace_back(y * radius);
            positions.emplace_back(z * radius);

            normals.emplace_back(x);
            normals.emplace_back(y);
            normals.emplace_back(z);

            uvs.emplace_back(u);
            uvs.emplace_back(v);

            if ((lat < segments) && (lon < segments)) {
                const uint32_t seg1 = segments + 1;
                const uint32_t a = seg1 * lat + lon;
                const uint32_t b = seg1 * (lat + 1) + lon;
                const uint32_t c = seg1 * (lat + 1) + lon + 1;
                const uint32_t d = seg1 * lat + lon + 1;

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
