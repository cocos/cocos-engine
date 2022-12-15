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
#include "cocos/base/std/hash/hash.h"
#include "cocos/renderer/core/ProgramLib.h"
#include "cocos/renderer/gfx-base/GFXRenderPass.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/NativeFwd.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "cocos/renderer/pipeline/custom/details/Map.h"

namespace cc {

namespace render {

struct ProgramInfo {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {attributes.get_allocator().resource()};
    }

    ProgramInfo(const allocator_type& alloc) noexcept; // NOLINT
    ProgramInfo(IProgramInfo programInfoIn, gfx::ShaderInfo shaderInfoIn, ccstd::pmr::vector<gfx::Attribute> attributesIn, ccstd::pmr::vector<unsigned> blockSizesIn, Record<ccstd::string, uint32_t> handleMapIn, const allocator_type& alloc) noexcept;
    ProgramInfo(ProgramInfo&& rhs, const allocator_type& alloc);
    ProgramInfo(ProgramInfo const& rhs, const allocator_type& alloc);

    ProgramInfo(ProgramInfo&& rhs) noexcept = default;
    ProgramInfo(ProgramInfo const& rhs) = delete;
    ProgramInfo& operator=(ProgramInfo&& rhs) = default;
    ProgramInfo& operator=(ProgramInfo const& rhs) = default;

    IProgramInfo programInfo;
    gfx::ShaderInfo shaderInfo;
    ccstd::pmr::vector<gfx::Attribute> attributes;
    ccstd::pmr::vector<unsigned> blockSizes;
    Record<ccstd::string, uint32_t> handleMap;
};

struct ProgramHost {
    ProgramHost() = default;
    ProgramHost(IntrusivePtr<gfx::Shader> programIn) noexcept // NOLINT
    : program(std::move(programIn)) {}

    IntrusivePtr<gfx::Shader> program;
};

struct ProgramGroup {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {programInfos.get_allocator().resource()};
    }

    ProgramGroup(const allocator_type& alloc) noexcept; // NOLINT
    ProgramGroup(ProgramGroup&& rhs, const allocator_type& alloc);
    ProgramGroup(ProgramGroup const& rhs, const allocator_type& alloc);

    ProgramGroup(ProgramGroup&& rhs) noexcept = default;
    ProgramGroup(ProgramGroup const& rhs) = delete;
    ProgramGroup& operator=(ProgramGroup&& rhs) = default;
    ProgramGroup& operator=(ProgramGroup const& rhs) = default;

    PmrFlatMap<ccstd::pmr::string, ProgramInfo> programInfos;
    PmrFlatMap<ccstd::pmr::string, ProgramHost> programHosts;
};

} // namespace render

} // namespace cc

// clang-format on
