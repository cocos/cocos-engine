/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
#include "cocos/base/std/container/string.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/RenderCommonFwd.h"
#include "cocos/scene/Light.h"

namespace cc {

namespace render {

enum class UpdateFrequency {
    PER_INSTANCE,
    PER_BATCH,
    PER_QUEUE,
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
    OPAQUE_OBJECT = 1,
    CUTOUT_OBJECT = 2,
    TRANSPARENT_OBJECT = 4,
    SHADOW_CASTER = 8,
    UI = 16,
    DEFAULT_LIGHTING = 32,
    VOLUMETRIC_LIGHTING = 64,
    CLUSTERED_LIGHTING = 128,
    PLANAR_SHADOW = 256,
    GEOMETRY = 512,
    PROFILER = 1024,
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
};

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

struct LightInfo {
    LightInfo() = default;
    LightInfo(IntrusivePtr<scene::Light> lightIn, uint32_t levelIn) noexcept
    : light(std::move(lightIn)),
      level(levelIn) {}

    IntrusivePtr<scene::Light> light;
    uint32_t level{0};
};

} // namespace render

} // namespace cc

// clang-format on
