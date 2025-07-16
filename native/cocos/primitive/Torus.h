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

#pragma once

#include "primitive/PrimitiveDefine.h"
namespace cc {
/**
 * @zh
 * 环面参数选项。
 */
struct ITorusOptions {
    uint32_t radialSegments{32};
    uint32_t tubularSegments{32};
    float arc{math::PI_2};
};

/**
 * @en
 * Generate a torus with raidus 0.4, tube 0.1 and centered at origin.
 * @zh
 * 生成一个环面。
 * @param radius 环面半径。
 * @param tube 管形大小。
 * @param opts 参数选项。
 */
IGeometry torus(float radius = 0.4, float tube = 0.1, const ccstd::optional<ITorusOptions> &opts = ccstd::nullopt);

} // namespace cc
