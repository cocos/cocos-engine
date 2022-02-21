/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/renderer/pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

enum class UpdateFrequency {
    PER_INSTANCE,
    PER_BATCH,
    PER_QUEUE,
    PER_PASS,
    COUNT,
};

struct CBVTag {};
struct UAVTag {};
struct SRVTag {};
struct SSVTag {};
struct RTVTag {};
struct DSVTag {};
struct IBVTag {};
struct VBVTag {};
struct SOVTag {};
struct ConstantsTag {};
struct TableTag {};

using ParameterType = boost::variant2::variant<ConstantsTag, CBVTag, UAVTag, SRVTag, TableTag, SSVTag>;

inline bool operator<(const ParameterType& lhs, const ParameterType& rhs) noexcept {
    return lhs.index() < rhs.index();
}

inline bool operator==(const ParameterType& lhs, const ParameterType& rhs) noexcept {
    return lhs.index() == rhs.index();
}

inline bool operator!=(const ParameterType& lhs, const ParameterType& rhs) noexcept {
    return !(lhs == rhs);
}

struct BoundedTag {};
struct UnboundedTag {};

using Boundedness = boost::variant2::variant<BoundedTag, UnboundedTag>;

inline bool operator<(const Boundedness& lhs, const Boundedness& rhs) noexcept {
    return lhs.index() < rhs.index();
}

inline bool operator==(const Boundedness& lhs, const Boundedness& rhs) noexcept {
    return lhs.index() == rhs.index();
}

inline bool operator!=(const Boundedness& lhs, const Boundedness& rhs) noexcept {
    return !(lhs == rhs);
}

struct CBufferTag {};
struct BufferTag {};
struct TextureTag {};
struct RWBufferTag {};
struct RWTextureTag {};
struct SamplerTag {};
struct Texture1DTag {};
struct Texture1DArrayTag {};
struct Texture2DTag {};
struct Texture2DArrayTag {};
struct Texture2DMSTag {};
struct Texture2DMSArrayTag {};
struct Texture3DTag {};
struct TextureCubeTag {};
struct TextureCubeArrayTag {};
struct RaytracingAccelerationStructureTag {};
struct SamplerStateTag {};
struct SamplerComparisonStateTag {};

using ResourceType = boost::variant2::variant<ConstantsTag, BufferTag, Texture1DTag, Texture1DArrayTag, Texture2DTag, Texture2DArrayTag, Texture2DMSTag, Texture2DMSArrayTag, Texture3DTag, TextureCubeTag, TextureCubeArrayTag, RaytracingAccelerationStructureTag, SamplerStateTag, SamplerComparisonStateTag>;

struct TypelessTag {};
struct Float4Tag {};
struct Float3Tag {};
struct Float2Tag {};
struct Float1Tag {};
struct Half4Tag {};
struct Half3Tag {};
struct Half2Tag {};
struct Half1Tag {};
struct Fixed4Tag {};
struct Fixed3Tag {};
struct Fixed2Tag {};
struct Fixed1Tag {};
struct Uint4Tag {};
struct Uint3Tag {};
struct Uint2Tag {};
struct Uint1Tag {};
struct Int4Tag {};
struct Int3Tag {};
struct Int2Tag {};
struct Int1Tag {};
struct Bool4Tag {};
struct Bool3Tag {};
struct Bool2Tag {};
struct Bool1Tag {};

using ValueType = boost::variant2::variant<TypelessTag, Float4Tag, Float3Tag, Float2Tag, Float1Tag, Half4Tag, Half3Tag, Half2Tag, Half1Tag, Fixed4Tag, Fixed3Tag, Fixed2Tag, Fixed1Tag, Uint4Tag, Uint3Tag, Uint2Tag, Uint1Tag, Int4Tag, Int3Tag, Int2Tag, Int1Tag, Bool4Tag, Bool3Tag, Bool2Tag, Bool1Tag>;

struct RasterTag {};
struct ComputeTag {};
struct CopyTag {};
struct MoveTag {};
struct RaytraceTag {};
struct ManagedTag {};
struct PersistentTag {};
struct BackbufferTag {};
struct MemorylessTag {};

using ResourceResidency = boost::variant2::variant<ManagedTag, PersistentTag, BackbufferTag, MemorylessTag>;

enum class QueueHint {
    NONE,
    RENDER_OPAQUE,
    RENDER_CUTOUT,
    RENDER_TRANSPARENT,
    COUNT,
};

enum class ResourceDimension {
    BUFFER,
    TEXTURE1D,
    TEXTURE2D,
    TEXTURE3D,
};

struct SampleDesc {
    uint32_t count{1};
    uint32_t quality{0};
};

enum class NodeType {
    INTERNAL,
    LEAF,
};

} // namespace render

} // namespace cc

// clang-format on
