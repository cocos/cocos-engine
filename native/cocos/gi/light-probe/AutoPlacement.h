
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

#pragma once
#include "base/std/container/array.h"
#include "base/std/container/vector.h"
#include "math/Vec3.h"

namespace cc {
namespace gi {

enum class PlaceMethod {
    UNIFORM = 0,
    ADAPTIVE = 1,
};

struct PlacementInfo {
    PlaceMethod method = PlaceMethod::UNIFORM;
    uint32_t nProbesX{3U};
    uint32_t nProbesY{3U};
    uint32_t nProbesZ{3U};
    Vec3 minPos{-10.0F, -10.0F, -10.0F};
    Vec3 maxPos{10.0F, 10.0F, 10.0F};
};

class AutoPlacement {
public:
    static ccstd::vector<Vec3> generate(const PlacementInfo &info);

private:
    static ccstd::vector<Vec3> doGenerateUniform(const PlacementInfo &info);
    static ccstd::vector<Vec3> doGenerateAdaptive(const PlacementInfo &info);
};

} // namespace gi
} // namespace cc
