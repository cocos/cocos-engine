#include "NativeUtils.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/core/Root.h"
#include "cocos/application/ApplicationManager.h"
#include "NativePipelineTypes.h"

namespace cc {
namespace render {

void setupQuadVertexBuffer(gfx::Device& device, const Vec4& viewport, float vbData[16]) {
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
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter& setter) {
    const auto& root = *Root::getInstance();
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

} // namespace render
} // namespace cc
