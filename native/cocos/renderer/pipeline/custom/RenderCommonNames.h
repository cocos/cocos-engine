#pragma once
#include "renderer/pipeline/custom/RenderCommonTypes.h"

namespace cc {

namespace render {

inline const char* getName(UpdateFrequency e) noexcept {
    switch (e) {
        case UpdateFrequency::PerInstance: return "PerInstance";
        case UpdateFrequency::PerBatch: return "PerBatch";
        case UpdateFrequency::PerQueue: return "PerQueue";
        case UpdateFrequency::PerPass: return "PerPass";
        case UpdateFrequency::Count: return "Count";
    }
    return "";
}
inline const char* getName(const CBV_& /*v*/) noexcept { return "CBV"; }
inline const char* getName(const UAV_& /*v*/) noexcept { return "UAV"; }
inline const char* getName(const SRV_& /*v*/) noexcept { return "SRV"; }
inline const char* getName(const SSV_& /*v*/) noexcept { return "SSV"; }
inline const char* getName(const RTV_& /*v*/) noexcept { return "RTV"; }
inline const char* getName(const DSV_& /*v*/) noexcept { return "DSV"; }
inline const char* getName(const IBV_& /*v*/) noexcept { return "IBV"; }
inline const char* getName(const VBV_& /*v*/) noexcept { return "VBV"; }
inline const char* getName(const SOV_& /*v*/) noexcept { return "SOV"; }
inline const char* getName(const Constants_& /*v*/) noexcept { return "Constants"; }
inline const char* getName(const Table_& /*v*/) noexcept { return "Table"; }
inline const char* getName(const Bounded_& /*v*/) noexcept { return "Bounded"; }
inline const char* getName(const Unbounded_& /*v*/) noexcept { return "Unbounded"; }
inline const char* getName(const CBuffer_& /*v*/) noexcept { return "CBuffer"; }
inline const char* getName(const Buffer_& /*v*/) noexcept { return "Buffer"; }
inline const char* getName(const Texture_& /*v*/) noexcept { return "Texture"; }
inline const char* getName(const RWBuffer_& /*v*/) noexcept { return "RWBuffer"; }
inline const char* getName(const RWTexture_& /*v*/) noexcept { return "RWTexture"; }
inline const char* getName(const Sampler_& /*v*/) noexcept { return "Sampler"; }
inline const char* getName(const Texture1D_& /*v*/) noexcept { return "Texture1D"; }
inline const char* getName(const Texture1DArray_& /*v*/) noexcept { return "Texture1DArray"; }
inline const char* getName(const Texture2D_& /*v*/) noexcept { return "Texture2D"; }
inline const char* getName(const Texture2DArray_& /*v*/) noexcept { return "Texture2DArray"; }
inline const char* getName(const Texture2DMS_& /*v*/) noexcept { return "Texture2DMS"; }
inline const char* getName(const Texture2DMSArray_& /*v*/) noexcept { return "Texture2DMSArray"; }
inline const char* getName(const Texture3D_& /*v*/) noexcept { return "Texture3D"; }
inline const char* getName(const TextureCube_& /*v*/) noexcept { return "TextureCube"; }
inline const char* getName(const TextureCubeArray_& /*v*/) noexcept { return "TextureCubeArray"; }
inline const char* getName(const RaytracingAccelerationStructure_& /*v*/) noexcept { return "RaytracingAccelerationStructure"; }
inline const char* getName(const SamplerState_& /*v*/) noexcept { return "SamplerState"; }
inline const char* getName(const SamplerComparisonState_& /*v*/) noexcept { return "SamplerComparisonState"; }
inline const char* getName(const Typeless_& /*v*/) noexcept { return "Typeless"; }
inline const char* getName(const Float4_& /*v*/) noexcept { return "Float4"; }
inline const char* getName(const Float3_& /*v*/) noexcept { return "Float3"; }
inline const char* getName(const Float2_& /*v*/) noexcept { return "Float2"; }
inline const char* getName(const Float1_& /*v*/) noexcept { return "Float1"; }
inline const char* getName(const Half4_& /*v*/) noexcept { return "Half4"; }
inline const char* getName(const Half3_& /*v*/) noexcept { return "Half3"; }
inline const char* getName(const Half2_& /*v*/) noexcept { return "Half2"; }
inline const char* getName(const Half1_& /*v*/) noexcept { return "Half1"; }
inline const char* getName(const Fixed4_& /*v*/) noexcept { return "Fixed4"; }
inline const char* getName(const Fixed3_& /*v*/) noexcept { return "Fixed3"; }
inline const char* getName(const Fixed2_& /*v*/) noexcept { return "Fixed2"; }
inline const char* getName(const Fixed1_& /*v*/) noexcept { return "Fixed1"; }
inline const char* getName(const Uint4_& /*v*/) noexcept { return "Uint4"; }
inline const char* getName(const Uint3_& /*v*/) noexcept { return "Uint3"; }
inline const char* getName(const Uint2_& /*v*/) noexcept { return "Uint2"; }
inline const char* getName(const Uint1_& /*v*/) noexcept { return "Uint1"; }
inline const char* getName(const Int4_& /*v*/) noexcept { return "Int4"; }
inline const char* getName(const Int3_& /*v*/) noexcept { return "Int3"; }
inline const char* getName(const Int2_& /*v*/) noexcept { return "Int2"; }
inline const char* getName(const Int1_& /*v*/) noexcept { return "Int1"; }
inline const char* getName(const Bool4_& /*v*/) noexcept { return "Bool4"; }
inline const char* getName(const Bool3_& /*v*/) noexcept { return "Bool3"; }
inline const char* getName(const Bool2_& /*v*/) noexcept { return "Bool2"; }
inline const char* getName(const Bool1_& /*v*/) noexcept { return "Bool1"; }
inline const char* getName(const Raster_& /*v*/) noexcept { return "Raster"; }
inline const char* getName(const Compute_& /*v*/) noexcept { return "Compute"; }
inline const char* getName(const Copy_& /*v*/) noexcept { return "Copy"; }
inline const char* getName(const Move_& /*v*/) noexcept { return "Move"; }
inline const char* getName(const Raytrace_& /*v*/) noexcept { return "Raytrace"; }
inline const char* getName(const Managed_& /*v*/) noexcept { return "Managed"; }
inline const char* getName(const Persistent_& /*v*/) noexcept { return "Persistent"; }
inline const char* getName(const Backbuffer_& /*v*/) noexcept { return "Backbuffer"; }
inline const char* getName(const Memoryless_& /*v*/) noexcept { return "Memoryless"; }
inline const char* getName(QueueHint e) noexcept {
    switch (e) {
        case QueueHint::Opaque: return "Opaque";
        case QueueHint::Cutout: return "Cutout";
        case QueueHint::Transparent: return "Transparent";
        case QueueHint::Count: return "Count";
    }
    return "";
}
inline const char* getName(ResourceDimension e) noexcept {
    switch (e) {
        case ResourceDimension::Buffer: return "Buffer";
        case ResourceDimension::Texture1D: return "Texture1D";
        case ResourceDimension::Texture2D: return "Texture2D";
        case ResourceDimension::Texture3D: return "Texture3D";
    }
    return "";
}
inline const char* getName(const SampleDesc& /*v*/) noexcept { return "SampleDesc"; }
inline const char* getName(NodeType e) noexcept {
    switch (e) {
        case NodeType::Internal: return "Internal";
        case NodeType::Leaf: return "Leaf";
    }
    return "";
}

} // namespace render

} // namespace cc
