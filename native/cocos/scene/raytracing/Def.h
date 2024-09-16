/****************************************************************************
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
namespace cc {
namespace scene {
namespace raytracing {
struct InstanceInfo {
    uint32_t meshPrimID = 0;
    uint32_t transformID = 0;
    uint32_t meshID = 0;
    uint32_t meshPrimitiveLocalID = 0;
};

struct MeshPrim {
    uint32_t material_index;
    uint32_t vertex_buffer;
    uint32_t position_offset; // in bytes
    uint32_t position_stride; // in bytes

    uint32_t normal_offset; // in bytes
    uint32_t normal_stride; // in bytes
    uint32_t uv_offset;     // in bytes
    uint32_t uv_stride;     // in bytes

    uint32_t index_buffer;
    uint32_t index_offset; // in bytes
    uint32_t index_stride; // in bytes
    uint32_t index_count;
};
} // namespace raytracing
} // namespace scene
} // namespace cc
