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
 * @en
 * The definition of the parameter for building a plane.
 * @zh
 * 平面参数选项。
 */
struct IPlaneOptions : public IGeometryOptions {
    /**
     * Plane extent on X-axis. Default to 10.
     */
    float width{10};

    /**
     * Plane extent on Z-axis. Default to 10.
     */
    float length{10};

    /**
     * Segment count on X-axis. Default to 10.
     */
    uint32_t widthSegments{10};

    /**
     * Segment count on Z-axis. Default to 10.
     */
    uint32_t lengthSegments{10};
};

/**
 * @en
 * This function generates a plane on XOZ plane with positive Y direction.
 * @zh
 * 生成一个平面，其位于XOZ平面，方向为Y轴正方向。
 * @param options 平面参数选项。
 */

IGeometry plane(ccstd::optional<IPlaneOptions> options = ccstd::nullopt);

} // namespace cc
