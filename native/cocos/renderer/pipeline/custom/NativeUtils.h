#pragma once
#include "cocos/core/ArrayBuffer.h"
#include "cocos/math/Vec4.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {
namespace gfx {
class Device;
}
namespace render {

void setupQuadVertexBuffer(gfx::Device &device, const Vec4 &viewport, float vbData[16]);
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter &setter);

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

// Implementation
LayoutGraphData::vertex_descriptor getSubpassOrPassID(
    RenderGraph::vertex_descriptor vertID,
    const RenderGraph &rg, const LayoutGraphData &lg);

} // namespace render

} // namespace cc
