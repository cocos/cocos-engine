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
    cc::optional<float> width;

    /**
     * @en
     * Box extent on Y-axis.
     * @zh
     * 立方体高度。
     */
    cc::optional<float> height;

    /**
     * @en
     * Box extent on Z-axis.
     * @zh
     * 立方体长度。
     */
    cc::optional<float> length;

    /**
     * @en
     * Segment count on X-axis.
     * @zh
     * 宽度线段数。
     */
    cc::optional<uint32_t> widthSegments;

    /**
     * @en
     * Segment count on Y-axis.
     * @zh
     * 高度线段数。
     */
    cc::optional<uint32_t> heightSegments;

    /**
     * @en
     * Segment count on Z-axis.
     * @zh
     * 长度线段数。
     */
    cc::optional<uint32_t> lengthSegments;
};

/**
 * @en
 * This function generates a box with specified extents and centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个立方体，其大小是定义的范围且中心在原点。
 * @param options 参数选项。
 */
IGeometry box(const cc::optional<IBoxOptions> &options = cc::nullopt);
} // namespace cc
