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

#include "cocos/renderer/pipeline/custom/NativeUtils.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"

namespace cc {

namespace render {

namespace {

render::NameLocalID getNameID(
    const PmrFlatMap<ccstd::pmr::string, render::NameLocalID> &index,
    std::string_view name) {
    auto iter = index.find(name);
    CC_EXPECTS(iter != index.end());
    return iter->second;
}

} // namespace

void setMat4Impl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    const cc::Mat4 &v) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    data.constants[nameID.value].resize(sizeof(Mat4));
    memcpy(data.constants[nameID.value].data(), v.m, sizeof(v));
}

void setMat4ArrayElemImpl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    const cc::Mat4 &v, uint32_t i) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    auto &dst = data.constants[nameID.value];
    CC_EXPECTS(sizeof(Mat4) * (i + 1) <= dst.size());
    memcpy(dst.data() + sizeof(Mat4) * i, v.m, sizeof(v));
}

void setMat4ArraySizeImpl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    uint32_t sz) {
    CC_EXPECTS(sz);
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    data.constants[nameID.value].resize(sizeof(Mat4) * sz);
}

void setQuaternionImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const Quaternion &quat) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Quaternion) == 4 * 4, "sizeof(Quaternion) is not 16 bytes");
    static_assert(std::is_trivially_copyable<Quaternion>::value, "Quaternion is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Quaternion));
    memcpy(data.constants[nameID.value].data(), &quat, sizeof(quat));
}

void setColorImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const gfx::Color &color) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(gfx::Color) == 4 * 4, "sizeof(Color) is not 16 bytes");
    static_assert(std::is_trivially_copyable<gfx::Color>::value, "Color is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(gfx::Color));
    memcpy(data.constants[nameID.value].data(), &color, sizeof(color));
}

void setVec4Impl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const Vec4 &vec) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec4));
    memcpy(data.constants[nameID.value].data(), &vec.x, sizeof(vec));
}

void setVec4ArrayElemImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name,
                          const Vec4 &vec, uint32_t i) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    auto &dst = data.constants[nameID.value];
    CC_EXPECTS(sizeof(Vec4) * (i + 1) <= dst.size());
    memcpy(dst.data() + sizeof(Vec4) * i, &vec.x, sizeof(vec));
}

void setVec4ArraySizeImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name,
                          uint32_t sz) {
    CC_EXPECTS(sz);
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec4) * sz);
}

void setVec2Impl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, const Vec2 &vec) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec2) == 2 * 4, "sizeof(Vec2) is not 8 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec2 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec2));
    memcpy(data.constants[nameID.value].data(), &vec.x, sizeof(vec));
}

void setFloatImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, float v) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(float) == 4, "sizeof(float) is not 4 bytes");
    data.constants[nameID.value].resize(sizeof(float));
    memcpy(data.constants[nameID.value].data(), &v, sizeof(v));
}

void setArrayBufferImpl(
    RenderData &data, const LayoutGraphData &lg, std::string_view name,
    const ArrayBuffer &buffer) {
    auto nameID = getNameID(lg.constantIndex, name);
    data.constants[nameID.value].resize(buffer.byteLength());
    memcpy(data.constants[nameID.value].data(), buffer.getData(), buffer.byteLength());
}

void setBufferImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.buffers[nameID.value] = IntrusivePtr<gfx::Buffer>(buffer);
}

void setTextureImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.textures[nameID.value] = IntrusivePtr<gfx::Texture>(texture);
}

void setReadWriteBufferImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.buffers[nameID.value] = IntrusivePtr<gfx::Buffer>(buffer);
}

void setReadWriteTextureImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.textures[nameID.value] = IntrusivePtr<gfx::Texture>(texture);
}

void setSamplerImpl(RenderData &data, const LayoutGraphData &lg, const ccstd::string &name, gfx::Sampler *sampler) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.samplers[nameID.value] = sampler;
}

} // namespace render

} // namespace cc
