#pragma once
#include <cocos/renderer/pipeline/custom/RenderCommonNames.h>
#include <cocos/renderer/pipeline/custom/RenderGraphTypes.h>

namespace cc {

namespace render {

inline const char* getName(TextureLayout e) noexcept {
    switch (e) {
        case TextureLayout::Unknown: return "Unknown";
        case TextureLayout::RowMajor: return "RowMajor";
        case TextureLayout::UndefinedSwizzle: return "UndefinedSwizzle";
        case TextureLayout::StandardSwizzle: return "StandardSwizzle";
    }
    return "";
}
inline const char* getName(const ResourceDesc& /*v*/) noexcept { return "ResourceDesc"; }
inline const char* getName(const ResourceTraits& /*v*/) noexcept { return "ResourceTraits"; }
inline const char* getName(const ResourceGraph& /*v*/) noexcept { return "ResourceGraph"; }
inline const char* getName(AttachmentType e) noexcept {
    switch (e) {
        case AttachmentType::RenderTarget: return "RenderTarget";
        case AttachmentType::DepthStencil: return "DepthStencil";
    }
    return "";
}
inline const char* getName(AccessType e) noexcept {
    switch (e) {
        case AccessType::Read: return "Read";
        case AccessType::ReadWrite: return "ReadWrite";
        case AccessType::Write: return "Write";
    }
    return "";
}
inline const char* getName(const RasterView& /*v*/) noexcept { return "RasterView"; }
inline const char* getName(ClearValueType e) noexcept {
    switch (e) {
        case ClearValueType::Float: return "Float";
        case ClearValueType::Int: return "Int";
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
inline const char* getName(const Setter& /*v*/) noexcept { return "Setter"; }
inline const char* getName(const RasterQueue& /*v*/) noexcept { return "RasterQueue"; }
inline const char* getName(const RasterPass& /*v*/) noexcept { return "RasterPass"; }
inline const char* getName(const ComputeQueue& /*v*/) noexcept { return "ComputeQueue"; }
inline const char* getName(const ComputePass& /*v*/) noexcept { return "ComputePass"; }
inline const char* getName(const MovePass& /*v*/) noexcept { return "MovePass"; }
inline const char* getName(const CopyPass& /*v*/) noexcept { return "CopyPass"; }

} // namespace render

} // namespace cc
