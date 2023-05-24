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

#include "primitive/Quad.h"
namespace cc {
IGeometry quad(ccstd::optional<IGeometryOptions> options) {
    if (!options.has_value()) {
        options = IGeometryOptions();
    }
    IGeometry result;
    result.positions = ccstd::vector<float>{-0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0};
    result.boundingRadius = sqrt(0.5 * 0.5 + 0.5 * 0.5);
    result.minPos = Vec3(-0.5, -0.5, 0);
    result.maxPos = Vec3(0.5, 0.5, 0);
    result.indices = ccstd::vector<uint32_t>{0, 3, 1, 3, 2, 1};
    if (options->includeNormal) {
        result.normals = ccstd::vector<float>{
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1};
    }
    if (options->includeUV) {
        result.uvs = ccstd::vector<float>{
            0, 0,
            0, 1,
            1, 1,
            1, 0};
    }
    return result;
}

} // namespace cc
