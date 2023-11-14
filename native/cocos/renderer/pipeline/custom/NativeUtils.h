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
#include "cocos/core/ArrayBuffer.h"
#include "cocos/math/Vec2.h"
#include "cocos/math/Vec3.h"
#include "cocos/math/Vec4.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {

namespace render {

void setMat4Impl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    const cc::Mat4 &v);

void setMat4ArrayElemImpl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    const cc::Mat4 &v, uint32_t i);

void setMat4ArraySizeImpl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    uint32_t sz);

void setQuaternionImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const Quaternion &quat);

void setColorImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const gfx::Color &color);

void setVec4Impl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const Vec4 &vec);

void setVec4ArrayElemImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name,
                          const Vec4 &vec, uint32_t i);

void setVec4ArraySizeImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name,
                          uint32_t sz);

void setVec2Impl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const Vec2 &vec);

void setFloatImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, float v);

void setArrayBufferImpl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    const ArrayBuffer &buffer);

void setBufferImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer);

void setTextureImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture);

void setReadWriteBufferImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer);

void setReadWriteTextureImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture);

void setSamplerImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Sampler *sampler);

inline Vec4 toVec4(const Vec3 &vec, float w = 0.0F) noexcept {
    return {vec.x, vec.y, vec.z, w};
}

} // namespace render

} // namespace cc
