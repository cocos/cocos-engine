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

#include "primitive/Circle.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {
IGeometry circle(cc::optional<ICircleOptions> &options) {
    if (!options.has_value()) options = ICircleOptions();
    const uint32_t     segments = options->segments;
    std::vector<float> positions(3 * (segments + 1));
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    std::vector<uint32_t> indices(1 + segments * 2);
    indices[0]       = 0;
    const float step = math::PI * 2 / static_cast<float>(segments);
    for (uint32_t iSegment = 0; iSegment < segments; ++iSegment) {
        const float    angle = step * static_cast<float>(iSegment);
        const float    x     = cos(angle);
        const float    y     = sin(angle);
        const uint32_t p     = (iSegment + 1) * 3;
        positions[p + 0]     = x;
        positions[p + 1]     = y;
        positions[p + 2]     = 0;
        const uint32_t i     = iSegment * 2;
        indices[1 + (i)]     = iSegment + 1;
        indices[1 + (i + 1)] = iSegment + 2;
    }
    if (segments > 0) {
        indices[indices.size() - 1] = 1;
    }

    IGeometry info;
    info.positions      = positions;
    info.boundingRadius = 1;
    info.minPos         = Vec3(1, 1, 0);
    info.maxPos         = Vec3(-1, -1, 0);
    info.indices        = indices;
    info.primitiveMode  = gfx::PrimitiveMode::TRIANGLE_FAN;
    return info;
}
} // namespace cc