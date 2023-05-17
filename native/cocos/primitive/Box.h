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
 * The definition of the parameter for building a box.
 * @zh
 * 立方体参数选项。
 */
struct IBoxOptions : public IGeometryOptions {
    /**
     * @en
     * Box extent on X-axis.
     * @zh
     * 立方体宽度。
     */
    ccstd::optional<float> width;

    /**
     * @en
     * Box extent on Y-axis.
     * @zh
     * 立方体高度。
     */
    ccstd::optional<float> height;

    /**
     * @en
     * Box extent on Z-axis.
     * @zh
     * 立方体长度。
     */
    ccstd::optional<float> length;

    /**
     * @en
     * Segment count on X-axis.
     * @zh
     * 宽度线段数。
     */
    ccstd::optional<uint32_t> widthSegments;

    /**
     * @en
     * Segment count on Y-axis.
     * @zh
     * 高度线段数。
     */
    ccstd::optional<uint32_t> heightSegments;

    /**
     * @en
     * Segment count on Z-axis.
     * @zh
     * 长度线段数。
     */
    ccstd::optional<uint32_t> lengthSegments;
};

/**
 * @en
 * This function generates a box with specified extents and centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个立方体，其大小是定义的范围且中心在原点。
 * @param options 参数选项。
 */
IGeometry box(const ccstd::optional<IBoxOptions> &options = ccstd::nullopt);
} // namespace cc
