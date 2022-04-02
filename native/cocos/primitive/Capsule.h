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
 * The definition of the parameter for building a capsule.
 * @zh
 * 胶囊体参数选项。
 */
struct ICapsuleOptions {
    uint32_t sides{32};
    uint32_t heightSegments{32};
    bool     capped{true};
    float    arc{math::PI_2};
};

/**
 * Generate a capsule with radiusTop radiusBottom 0.5, height 2, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个胶囊体。
 * @param radiusTop 顶部半径。
 * @param radiusBottom 底部半径。
 * @param opts 胶囊体参数选项。
 */
IGeometry capsule(float radiusTop = 0.5, float radiusBottom = 0.5, float height = 2, const cc::optional<ICapsuleOptions> &opts = cc::nullopt);

} // namespace cc
