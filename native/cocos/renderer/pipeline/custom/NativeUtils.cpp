#include "NativeUtils.h"
#include "LayoutGraphGraphs.h"
#include "NativePipelineTypes.h"
#include "RenderGraphGraphs.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/core/Root.h"
#include "details/GslUtils.h"

namespace cc {
namespace render {

void setupQuadVertexBuffer(gfx::Device &device, const Vec4 &viewport, float vbData[16]) {
    auto minX = static_cast<float>(viewport.x);
    auto maxX = static_cast<float>(viewport.x + viewport.z);
    auto minY = static_cast<float>(viewport.y);
    auto maxY = static_cast<float>(viewport.y + viewport.w);
    if (device.getCapabilities().screenSpaceSignY > 0) {
        std::swap(minY, maxY);
    }
    int n = 0;
    vbData[n++] = -1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = minX; // uv
    vbData[n++] = maxY;
    vbData[n++] = 1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = maxX;
    vbData[n++] = maxY;
    vbData[n++] = -1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = minX;
    vbData[n++] = minY;
    vbData[n++] = 1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = maxX;
    vbData[n++] = minY;
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter &setter) {
    const auto &root = *Root::getInstance();
    const auto shadingWidth = static_cast<float>(width);
    const auto shadingHeight = static_cast<float>(height);
    setter.setVec4(
        "cc_time",
        Vec4(
            root.getCumulativeTime(),
            root.getFrameTime(),
            static_cast<float>(CC_CURRENT_ENGINE()->getTotalFrames()),
            0.0F));

    setter.setVec4(
        "cc_screenSize",
        Vec4(shadingWidth, shadingHeight, 1.0F / shadingWidth, 1.0F / shadingHeight));
    setter.setVec4(
        "cc_nativeSize",
        Vec4(shadingWidth, shadingHeight, 1.0F / shadingWidth, 1.0F / shadingHeight));
#if 0
    const auto *debugView = root.getDebugView();
    if (debugView) {
        setter.setVec4(
            "cc_debug_view_mode",
            Vec4(static_cast<float>(debugView->getSingleMode()),
                 debugView->isLightingWithAlbedo() ? 1.0F : 0.0F,
                 debugView->isCsmLayerColoration() ? 1.0F : 0.0F,
                 0.0F));
        Vec4 debugPackVec{};
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const auto idx = i % 4;
            (&debugPackVec.x)[idx] = debugView->isCompositeModeEnabled(i) ? 1.0F : 0.0F;
            const auto packIdx = static_cast<uint32_t>(floor(static_cast<float>(i) / 4.0F));
            if (idx == 3) {
                std::string name("cc_debug_view_composite_pack_");
                name.append(std::to_string(packIdx + 1));
                setter.setVec4(name, debugPackVec);
            }
        }
    } else {
        setter.setVec4("cc_debug_view_mode", Vec4(0.0F, 1.0F, 0.0F, 0.0F));
        Vec4 debugPackVec{};
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const auto idx = i % 4;
            (&debugPackVec.x)[idx] = 1.0F;
            const auto packIdx = static_cast<uint32_t>(floor(i / 4.0));
            if (idx == 3) {
                std::string name("cc_debug_view_composite_pack_");
                name.append(std::to_string(packIdx + 1));
                setter.setVec4(name, debugPackVec);
            }
        }
    }
#endif
}

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

LayoutGraphData::vertex_descriptor getSubpassOrPassID(
    RenderGraph::vertex_descriptor vertID,
    const RenderGraph &rg, const LayoutGraphData &lg) {
    const auto queueID = parent(vertID, rg);
    CC_ENSURES(queueID != RenderGraph::null_vertex());
    const auto subpassOrPassID = parent(queueID, rg);
    CC_ENSURES(subpassOrPassID != RenderGraph::null_vertex());
    const auto passID = parent(subpassOrPassID, rg);

    auto layoutID = LayoutGraphData::null_vertex();
    if (passID == RenderGraph::null_vertex()) { // single render pass
        const auto &layoutName = get(RenderGraph::LayoutTag{}, rg, subpassOrPassID);
        CC_ENSURES(!layoutName.empty());
        layoutID = locate(LayoutGraphData::null_vertex(), layoutName, lg);
    } else { // render pass
        const auto &passLayoutName = get(RenderGraph::LayoutTag{}, rg, passID);
        CC_ENSURES(!passLayoutName.empty());
        const auto passLayoutID = locate(LayoutGraphData::null_vertex(), passLayoutName, lg);
        CC_ENSURES(passLayoutID != LayoutGraphData::null_vertex());

        const auto &subpassLayoutName = get(RenderGraph::LayoutTag{}, rg, subpassOrPassID);
        CC_ENSURES(!subpassLayoutName.empty());
        const auto subpassLayoutID = locate(passLayoutID, subpassLayoutName, lg);
        CC_ENSURES(subpassLayoutID != LayoutGraphData::null_vertex());
        layoutID = subpassLayoutID;
    }
    CC_ENSURES(layoutID != LayoutGraphData::null_vertex());
    return layoutID;
}

} // namespace render
} // namespace cc
