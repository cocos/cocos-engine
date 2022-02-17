// clang-format off
#pragma once
#include "cocos/renderer/pipeline/custom/RenderCommonNames.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"

namespace cc {

namespace render {

inline const char* getName(TextureLayout e) noexcept {
    switch (e) {
        case TextureLayout::UNKNOWN: return "UNKNOWN";
        case TextureLayout::ROW_MAJOR: return "ROW_MAJOR";
        case TextureLayout::UNDEFINED_SWIZZLE: return "UNDEFINED_SWIZZLE";
        case TextureLayout::STANDARD_SWIZZLE: return "STANDARD_SWIZZLE";
    }
    return "";
}
inline const char* getName(const ResourceDesc& /*v*/) noexcept { return "ResourceDesc"; }
inline const char* getName(const ResourceTraits& /*v*/) noexcept { return "ResourceTraits"; }
inline const char* getName(const ResourceGraph& /*v*/) noexcept { return "ResourceGraph"; }
inline const char* getName(AttachmentType e) noexcept {
    switch (e) {
        case AttachmentType::RENDER_TARGET: return "RENDER_TARGET";
        case AttachmentType::DEPTH_STENCIL: return "DEPTH_STENCIL";
    }
    return "";
}
inline const char* getName(AccessType e) noexcept {
    switch (e) {
        case AccessType::READ: return "READ";
        case AccessType::READ_WRITE: return "READ_WRITE";
        case AccessType::WRITE: return "WRITE";
    }
    return "";
}
inline const char* getName(const RasterView& /*v*/) noexcept { return "RasterView"; }
inline const char* getName(ClearValueType e) noexcept {
    switch (e) {
        case ClearValueType::FLOAT_TYPE: return "FLOAT_TYPE";
        case ClearValueType::INT_TYPE: return "INT_TYPE";
    }
    return "";
}
inline const char* getName(const ComputeView& /*v*/) noexcept { return "ComputeView"; }
inline const char* getName(const RasterSubpass& /*v*/) noexcept { return "RasterSubpass"; }
inline const char* getName(const SubpassGraph& /*v*/) noexcept { return "SubpassGraph"; }
inline const char* getName(const RasterPassData& /*v*/) noexcept { return "RasterPassData"; }
inline const char* getName(const ComputePassData& /*v*/) noexcept { return "ComputePassData"; }
inline const char* getName(const CopyPair& /*v*/) noexcept { return "CopyPair"; }
inline const char* getName(const CopyPassData& /*v*/) noexcept { return "CopyPassData"; }
inline const char* getName(const MovePair& /*v*/) noexcept { return "MovePair"; }
inline const char* getName(const MovePassData& /*v*/) noexcept { return "MovePassData"; }
inline const char* getName(const RaytracePassData& /*v*/) noexcept { return "RaytracePassData"; }
inline const char* getName(const Queue_& /*v*/) noexcept { return "Queue"; }
inline const char* getName(const Scene_& /*v*/) noexcept { return "Scene"; }
inline const char* getName(const Dispatch_& /*v*/) noexcept { return "Dispatch"; }
inline const char* getName(const Blit_& /*v*/) noexcept { return "Blit"; }
inline const char* getName(const Present_& /*v*/) noexcept { return "Present"; }
inline const char* getName(const RenderQueueData& /*v*/) noexcept { return "RenderQueueData"; }
inline const char* getName(const SceneData& /*v*/) noexcept { return "SceneData"; }
inline const char* getName(const Dispatch& /*v*/) noexcept { return "Dispatch"; }
inline const char* getName(const Blit& /*v*/) noexcept { return "Blit"; }
inline const char* getName(const PresentPassData& /*v*/) noexcept { return "PresentPassData"; }
inline const char* getName(const RenderData& /*v*/) noexcept { return "RenderData"; }
inline const char* getName(const RenderGraph& /*v*/) noexcept { return "RenderGraph"; }

} // namespace render

} // namespace cc

// clang-format on
