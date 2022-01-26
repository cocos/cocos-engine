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

#include "primitive/Quad.h"
namespace cc {
IGeometry quad(cc::optional<IGeometryOptions> options) {
    if (!options.has_value()) {
        options = IGeometryOptions();
    }
    IGeometry result;
    result.positions      = std::vector<float>{-0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0};
    result.boundingRadius = sqrt(0.5 * 0.5 + 0.5 * 0.5);
    result.minPos         = Vec3(-0.5, -0.5, 0);
    result.maxPos         = Vec3(0.5, 0.5, 0);
    result.indices        = std::vector<uint32_t>{0, 3, 1, 3, 2, 1};
    if (options->includeNormal) {
        result.normals = std::vector<float>{
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1};
    }
    if (options->includeUV) {
        result.uvs = std::vector<float>{
            0, 0,
            0, 1,
            1, 1,
            1, 0};
    }
    return result;
}

} // namespace cc
