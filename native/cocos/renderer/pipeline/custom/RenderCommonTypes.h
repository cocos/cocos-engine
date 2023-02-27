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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/base/Ptr.h"
#include "cocos/base/std/container/map.h"
#include "cocos/base/std/container/string.h"
#include "cocos/base/std/hash/hash.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/RenderCommonFwd.h"
#include "cocos/scene/Light.h"

namespace cc {

namespace render {

enum class UpdateFrequency {
    PER_INSTANCE,
    PER_BATCH,
    PER_PHASE,
    PER_PASS,
    COUNT,
};

enum class ParameterType {
    CONSTANTS,
    CBV,
    UAV,
    SRV,
    TABLE,
    SSV,
};

struct RasterTag {};
struct ComputeTag {};
struct CopyTag {};
struct MoveTag {};
struct RaytraceTag {};

enum class ResourceResidency {
    MANAGED,
    MEMORYLESS,
    PERSISTENT,
    EXTERNAL,
    BACKBUFFER,
};

enum class QueueHint {
    NONE,
    RENDER_OPAQUE,
    RENDER_CUTOUT,
    RENDER_TRANSPARENT,
};

enum class ResourceDimension {
    BUFFER,
    TEXTURE1D,
    TEXTURE2D,
    TEXTURE3D,
};

enum class ResourceFlags : uint32_t {
    NONE = 0,
    UNIFORM = 0x1,
    INDIRECT = 0x2,
    STORAGE = 0x4,
    SAMPLED = 0x8,
    COLOR_ATTACHMENT = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    INPUT_ATTACHMENT = 0x40,
};

constexpr ResourceFlags operator|(const ResourceFlags lhs, const ResourceFlags rhs) noexcept {
    return static_cast<ResourceFlags>(static_cast<uint32_t>(lhs) | static_cast<uint32_t>(rhs));
}

constexpr ResourceFlags operator&(const ResourceFlags lhs, const ResourceFlags rhs) noexcept {
    return static_cast<ResourceFlags>(static_cast<uint32_t>(lhs) & static_cast<uint32_t>(rhs));
}

constexpr ResourceFlags& operator|=(ResourceFlags& lhs, const ResourceFlags rhs) noexcept {
    return lhs = lhs | rhs;
}

constexpr ResourceFlags& operator&=(ResourceFlags& lhs, const ResourceFlags rhs) noexcept {
    return lhs = lhs & rhs;
}

constexpr bool operator!(ResourceFlags e) noexcept {
    return e == static_cast<ResourceFlags>(0);
}

constexpr bool any(ResourceFlags e) noexcept {
    return !!e;
}

struct BufferTag {};
struct TextureTag {};

enum class TaskType {
    SYNC,
    ASYNC,
};

enum class SceneFlags : uint32_t {
    NONE = 0,
    OPAQUE_OBJECT = 0x1,
    CUTOUT_OBJECT = 0x2,
    TRANSPARENT_OBJECT = 0x4,
    SHADOW_CASTER = 0x8,
    UI = 0x10,
    DEFAULT_LIGHTING = 0x20,
    VOLUMETRIC_LIGHTING = 0x40,
    CLUSTERED_LIGHTING = 0x80,
    PLANAR_SHADOW = 0x100,
    GEOMETRY = 0x200,
    PROFILER = 0x400,
    DRAW_INSTANCING = 0x800,
    DRAW_NON_INSTANCING = 0x1000,
    REFLECTION_PROBE = 0x2000,
    ALL = 0xFFFFFFFF,
};

constexpr SceneFlags operator|(const SceneFlags lhs, const SceneFlags rhs) noexcept {
    return static_cast<SceneFlags>(static_cast<uint32_t>(lhs) | static_cast<uint32_t>(rhs));
}

constexpr SceneFlags operator&(const SceneFlags lhs, const SceneFlags rhs) noexcept {
    return static_cast<SceneFlags>(static_cast<uint32_t>(lhs) & static_cast<uint32_t>(rhs));
}

constexpr SceneFlags& operator|=(SceneFlags& lhs, const SceneFlags rhs) noexcept {
    return lhs = lhs | rhs;
}

constexpr SceneFlags& operator&=(SceneFlags& lhs, const SceneFlags rhs) noexcept {
    return lhs = lhs & rhs;
}

constexpr bool operator!(SceneFlags e) noexcept {
    return e == static_cast<SceneFlags>(0);
}

constexpr bool any(SceneFlags e) noexcept {
    return !!e;
}

enum class LightingMode : uint32_t {
    NONE,
    DEFAULT,
    CLUSTERED,
};

enum class AttachmentType {
    RENDER_TARGET,
    DEPTH_STENCIL,
};

enum class AccessType {
    READ,
    READ_WRITE,
    WRITE,
};

struct RasterView {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {slotName.get_allocator().resource()};
    }

    RasterView(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    RasterView(ccstd::pmr::string slotNameIn, AccessType accessTypeIn, AttachmentType attachmentTypeIn, gfx::LoadOp loadOpIn, gfx::StoreOp storeOpIn, gfx::ClearFlagBit clearFlagsIn, gfx::Color clearColorIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    RasterView(RasterView&& rhs, const allocator_type& alloc);
    RasterView(RasterView const& rhs, const allocator_type& alloc);

    RasterView(RasterView&& rhs) noexcept = default;
    RasterView(RasterView const& rhs) = delete;
    RasterView& operator=(RasterView&& rhs) = default;
    RasterView& operator=(RasterView const& rhs) = default;

    ccstd::pmr::string slotName;
    AccessType accessType{AccessType::WRITE};
    AttachmentType attachmentType{AttachmentType::RENDER_TARGET};
    gfx::LoadOp loadOp{gfx::LoadOp::LOAD};
    gfx::StoreOp storeOp{gfx::StoreOp::STORE};
    gfx::ClearFlagBit clearFlags{gfx::ClearFlagBit::ALL};
    gfx::Color clearColor;
    uint32_t slotID{0};
};

inline bool operator==(const RasterView& lhs, const RasterView& rhs) noexcept {
    return std::forward_as_tuple(lhs.slotName, lhs.accessType, lhs.attachmentType, lhs.loadOp, lhs.storeOp, lhs.clearFlags) ==
           std::forward_as_tuple(rhs.slotName, rhs.accessType, rhs.attachmentType, rhs.loadOp, rhs.storeOp, rhs.clearFlags);
}

inline bool operator!=(const RasterView& lhs, const RasterView& rhs) noexcept {
    return !(lhs == rhs);
}

enum class ClearValueType {
    FLOAT_TYPE,
    INT_TYPE,
};

struct ComputeView {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    ComputeView(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    ComputeView(ccstd::pmr::string nameIn, AccessType accessTypeIn, gfx::ClearFlagBit clearFlagsIn, gfx::Color clearColorIn, ClearValueType clearValueTypeIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    ComputeView(ComputeView&& rhs, const allocator_type& alloc);
    ComputeView(ComputeView const& rhs, const allocator_type& alloc);

    ComputeView(ComputeView&& rhs) noexcept = default;
    ComputeView(ComputeView const& rhs) = delete;
    ComputeView& operator=(ComputeView&& rhs) = default;
    ComputeView& operator=(ComputeView const& rhs) = default;

    bool isRead() const {
        return accessType != AccessType::WRITE;
    }
    bool isWrite() const {
        return accessType != AccessType::READ;
    }

    ccstd::pmr::string name;
    AccessType accessType{AccessType::READ};
    gfx::ClearFlagBit clearFlags{gfx::ClearFlagBit::NONE};
    gfx::Color clearColor;
    ClearValueType clearValueType{ClearValueType::FLOAT_TYPE};
};

inline bool operator==(const ComputeView& lhs, const ComputeView& rhs) noexcept {
    return std::forward_as_tuple(lhs.name, lhs.accessType, lhs.clearFlags, lhs.clearValueType) ==
           std::forward_as_tuple(rhs.name, rhs.accessType, rhs.clearFlags, rhs.clearValueType);
}

inline bool operator!=(const ComputeView& lhs, const ComputeView& rhs) noexcept {
    return !(lhs == rhs);
}

struct LightInfo {
    LightInfo() = default;
    LightInfo(IntrusivePtr<scene::Light> lightIn, uint32_t levelIn) noexcept
    : light(std::move(lightIn)),
      level(levelIn) {}

    IntrusivePtr<scene::Light> light;
    uint32_t level{0};
};

enum class DescriptorTypeOrder {
    UNIFORM_BUFFER,
    DYNAMIC_UNIFORM_BUFFER,
    SAMPLER_TEXTURE,
    SAMPLER,
    TEXTURE,
    STORAGE_BUFFER,
    DYNAMIC_STORAGE_BUFFER,
    STORAGE_IMAGE,
    INPUT_ATTACHMENT,
};

struct Descriptor {
    Descriptor() = default;
    Descriptor(gfx::Type typeIn) noexcept // NOLINT
    : type(typeIn) {}

    gfx::Type type{gfx::Type::UNKNOWN};
    uint32_t count{1};
};

struct DescriptorBlock {
    ccstd::map<ccstd::string, Descriptor> descriptors;
    ccstd::map<ccstd::string, gfx::UniformBlock> uniformBlocks;
    uint32_t capacity{0};
    uint32_t count{0};
};

struct DescriptorBlockFlattened {
    ccstd::vector<ccstd::string> descriptorNames;
    ccstd::vector<ccstd::string> uniformBlockNames;
    ccstd::vector<Descriptor> descriptors;
    ccstd::vector<gfx::UniformBlock> uniformBlocks;
    uint32_t capacity{0};
    uint32_t count{0};
};

struct DescriptorBlockIndex {
    DescriptorBlockIndex() = default;
    DescriptorBlockIndex(UpdateFrequency updateFrequencyIn, ParameterType parameterTypeIn, DescriptorTypeOrder descriptorTypeIn, gfx::ShaderStageFlagBit visibilityIn) noexcept
    : updateFrequency(updateFrequencyIn),
      parameterType(parameterTypeIn),
      descriptorType(descriptorTypeIn),
      visibility(visibilityIn) {}

    UpdateFrequency updateFrequency{UpdateFrequency::PER_INSTANCE};
    ParameterType parameterType{ParameterType::CONSTANTS};
    DescriptorTypeOrder descriptorType{DescriptorTypeOrder::UNIFORM_BUFFER};
    gfx::ShaderStageFlagBit visibility{gfx::ShaderStageFlagBit::NONE};
};

inline bool operator<(const DescriptorBlockIndex& lhs, const DescriptorBlockIndex& rhs) noexcept {
    return std::forward_as_tuple(lhs.updateFrequency, lhs.parameterType, lhs.descriptorType, lhs.visibility) <
           std::forward_as_tuple(rhs.updateFrequency, rhs.parameterType, rhs.descriptorType, rhs.visibility);
}

struct CopyPair {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {source.get_allocator().resource()};
    }

    CopyPair(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    CopyPair(ccstd::pmr::string sourceIn, ccstd::pmr::string targetIn, uint32_t mipLevelsIn, uint32_t numSlicesIn, uint32_t sourceMostDetailedMipIn, uint32_t sourceFirstSliceIn, uint32_t sourcePlaneSliceIn, uint32_t targetMostDetailedMipIn, uint32_t targetFirstSliceIn, uint32_t targetPlaneSliceIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    CopyPair(CopyPair&& rhs, const allocator_type& alloc);
    CopyPair(CopyPair const& rhs, const allocator_type& alloc);

    CopyPair(CopyPair&& rhs) noexcept = default;
    CopyPair(CopyPair const& rhs) = delete;
    CopyPair& operator=(CopyPair&& rhs) = default;
    CopyPair& operator=(CopyPair const& rhs) = default;

    ccstd::pmr::string source;
    ccstd::pmr::string target;
    uint32_t mipLevels{0xFFFFFFFF};
    uint32_t numSlices{0xFFFFFFFF};
    uint32_t sourceMostDetailedMip{0};
    uint32_t sourceFirstSlice{0};
    uint32_t sourcePlaneSlice{0};
    uint32_t targetMostDetailedMip{0};
    uint32_t targetFirstSlice{0};
    uint32_t targetPlaneSlice{0};
};

struct MovePair {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {source.get_allocator().resource()};
    }

    MovePair(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    MovePair(ccstd::pmr::string sourceIn, ccstd::pmr::string targetIn, uint32_t mipLevelsIn, uint32_t numSlicesIn, uint32_t targetMostDetailedMipIn, uint32_t targetFirstSliceIn, uint32_t targetPlaneSliceIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    MovePair(MovePair&& rhs, const allocator_type& alloc);
    MovePair(MovePair const& rhs, const allocator_type& alloc);

    MovePair(MovePair&& rhs) noexcept = default;
    MovePair(MovePair const& rhs) = delete;
    MovePair& operator=(MovePair&& rhs) = default;
    MovePair& operator=(MovePair const& rhs) = default;

    ccstd::pmr::string source;
    ccstd::pmr::string target;
    uint32_t mipLevels{0xFFFFFFFF};
    uint32_t numSlices{0xFFFFFFFF};
    uint32_t targetMostDetailedMip{0};
    uint32_t targetFirstSlice{0};
    uint32_t targetPlaneSlice{0};
};

struct PipelineStatistics {
    uint32_t numRenderPasses{0};
    uint32_t numManagedTextures{0};
    uint32_t totalManagedTextures{0};
    uint32_t numUploadBuffers{0};
    uint32_t numUploadBufferViews{0};
    uint32_t numFreeUploadBuffers{0};
    uint32_t numFreeUploadBufferViews{0};
    uint32_t numDescriptorSets{0};
    uint32_t numFreeDescriptorSets{0};
    uint32_t numInstancingBuffers{0};
    uint32_t numInstancingUniformBlocks{0};
};

} // namespace render

} // namespace cc

namespace ccstd {

inline hash_t hash<cc::render::RasterView>::operator()(const cc::render::RasterView& val) const noexcept {
    hash_t seed = 0;
    hash_combine(seed, val.slotName);
    hash_combine(seed, val.accessType);
    hash_combine(seed, val.attachmentType);
    hash_combine(seed, val.loadOp);
    hash_combine(seed, val.storeOp);
    hash_combine(seed, val.clearFlags);
    return seed;
}

inline hash_t hash<cc::render::ComputeView>::operator()(const cc::render::ComputeView& val) const noexcept {
    hash_t seed = 0;
    hash_combine(seed, val.name);
    hash_combine(seed, val.accessType);
    hash_combine(seed, val.clearFlags);
    hash_combine(seed, val.clearValueType);
    return seed;
}

} // namespace ccstd

// clang-format on
