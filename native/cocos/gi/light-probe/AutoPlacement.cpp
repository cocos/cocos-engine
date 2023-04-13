
/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "AutoPlacement.h"
#include "base/Macros.h"

namespace cc {
namespace gi {

ccstd::vector<Vec3> AutoPlacement::generate(const PlacementInfo &info) {
    switch (info.method) {
        case PlaceMethod::UNIFORM:
            return doGenerateUniform(info);
        case PlaceMethod::ADAPTIVE:
            return doGenerateAdaptive(info);
        default:
            CC_ABORT();
    }

    return {};
}

ccstd::vector<Vec3> AutoPlacement::doGenerateUniform(const PlacementInfo &info) {
    if (info.nProbesX < 2U || info.nProbesY < 2U || info.nProbesZ < 2U) {
        return {};
    }

    ccstd::vector<Vec3> probes;
    Vec3 position{0.0F, 0.0F, 0.0F};
    Vec3 gridSize{
        (info.maxPos.x - info.minPos.x) / static_cast<float>(info.nProbesX - 1U),
        (info.maxPos.y - info.minPos.y) / static_cast<float>(info.nProbesY - 1U),
        (info.maxPos.z - info.minPos.z) / static_cast<float>(info.nProbesZ - 1U)};

    for (auto x = 0U; x < info.nProbesX; x++) {
        position.x = static_cast<float>(x) * gridSize.x + info.minPos.x;

        for (auto y = 0U; y < info.nProbesY; y++) {
            position.y = static_cast<float>(y) * gridSize.y + info.minPos.y;

            for (auto z = 0U; z < info.nProbesZ; z++) {
                position.z = static_cast<float>(z) * gridSize.z + info.minPos.z;
                probes.push_back(position);
            }
        }
    }

    return probes;
}

ccstd::vector<Vec3> AutoPlacement::doGenerateAdaptive(const PlacementInfo &info) {
    return doGenerateUniform(info);
}

} // namespace gi
} // namespace cc
