#pragma once
#include "renderer/pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

enum class UpdateFrequency {
    PerInstance, // NOLINT
    PerBatch,    // NOLINT
    PerQueue,    // NOLINT
    PerPass,     // NOLINT
    Count,       // NOLINT
};

struct CBV_ {};
struct UAV_ {};
struct SRV_ {};
struct SSV_ {};
struct RTV_ {};
struct DSV_ {};
struct IBV_ {};
struct VBV_ {};
struct SOV_ {};
struct Constants_ {};
struct Table_ {};

using ParameterType = boost::variant2::variant<Constants_, CBV_, UAV_, SRV_, Table_, SSV_>;

inline bool operator<(const ParameterType& lhs, const ParameterType& rhs) noexcept {
    return lhs.index() < rhs.index();
}

inline bool operator==(const ParameterType& lhs, const ParameterType& rhs) noexcept {
    return lhs.index() == rhs.index();
}

inline bool operator!=(const ParameterType& lhs, const ParameterType& rhs) noexcept {
    return !(lhs == rhs);
}

struct Bounded_ {};
struct Unbounded_ {};

using Boundedness = boost::variant2::variant<Bounded_, Unbounded_>;

inline bool operator<(const Boundedness& lhs, const Boundedness& rhs) noexcept {
    return lhs.index() < rhs.index();
}

inline bool operator==(const Boundedness& lhs, const Boundedness& rhs) noexcept {
    return lhs.index() == rhs.index();
}

inline bool operator!=(const Boundedness& lhs, const Boundedness& rhs) noexcept {
    return !(lhs == rhs);
}

struct CBuffer_ {};
struct Buffer_ {};
struct Texture_ {};
struct RWBuffer_ {};
struct RWTexture_ {};
struct Sampler_ {};
struct Texture1D_ {};
struct Texture1DArray_ {};
struct Texture2D_ {};
struct Texture2DArray_ {};
struct Texture2DMS_ {};
struct Texture2DMSArray_ {};
struct Texture3D_ {};
struct TextureCube_ {};
struct TextureCubeArray_ {};
struct RaytracingAccelerationStructure_ {};
struct SamplerState_ {};
struct SamplerComparisonState_ {};

using ResourceType = boost::variant2::variant<Constants_, Buffer_, Texture1D_, Texture1DArray_, Texture2D_, Texture2DArray_, Texture2DMS_, Texture2DMSArray_, Texture3D_, TextureCube_, TextureCubeArray_, RaytracingAccelerationStructure_, SamplerState_, SamplerComparisonState_>;

struct Typeless_ {};
struct Float4_ {};
struct Float3_ {};
struct Float2_ {};
struct Float1_ {};
struct Half4_ {};
struct Half3_ {};
struct Half2_ {};
struct Half1_ {};
struct Fixed4_ {};
struct Fixed3_ {};
struct Fixed2_ {};
struct Fixed1_ {};
struct Uint4_ {};
struct Uint3_ {};
struct Uint2_ {};
struct Uint1_ {};
struct Int4_ {};
struct Int3_ {};
struct Int2_ {};
struct Int1_ {};
struct Bool4_ {};
struct Bool3_ {};
struct Bool2_ {};
struct Bool1_ {};

using ValueType = boost::variant2::variant<Typeless_, Float4_, Float3_, Float2_, Float1_, Half4_, Half3_, Half2_, Half1_, Fixed4_, Fixed3_, Fixed2_, Fixed1_, Uint4_, Uint3_, Uint2_, Uint1_, Int4_, Int3_, Int2_, Int1_, Bool4_, Bool3_, Bool2_, Bool1_>;

struct Raster_ {};
struct Compute_ {};
struct Copy_ {};
struct Move_ {};
struct Raytrace_ {};
struct Managed_ {};
struct Persistent_ {};
struct Backbuffer_ {};
struct Memoryless_ {};

using ResourceResidency = boost::variant2::variant<Managed_, Persistent_, Backbuffer_, Memoryless_>;

enum class QueueHint {
    Opaque,      // NOLINT
    Cutout,      // NOLINT
    Transparent, // NOLINT
    Count,       // NOLINT
};

enum class ResourceDimension {
    Buffer,    // NOLINT
    Texture1D, // NOLINT
    Texture2D, // NOLINT
    Texture3D, // NOLINT
};

struct SampleDesc {
    uint32_t mCount   = 1;
    uint32_t mQuality = 0;
};

enum class NodeType {
    Internal, // NOLINT
    Leaf,     // NOLINT
};

} // namespace render

} // namespace cc
