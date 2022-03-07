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
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCommonNames.h"

namespace cc {

namespace render {

inline const char* getName(DescriptorIndex e) noexcept {
    switch (e) {
        case DescriptorIndex::UNIFORM_BLOCK: return "UNIFORM_BLOCK";
        case DescriptorIndex::SAMPLER_TEXTURE: return "SAMPLER_TEXTURE";
        case DescriptorIndex::SAMPLER: return "SAMPLER";
        case DescriptorIndex::TEXTURE: return "TEXTURE";
        case DescriptorIndex::STORAGE_BUFFER: return "STORAGE_BUFFER";
        case DescriptorIndex::STORAGE_TEXTURE: return "STORAGE_TEXTURE";
        case DescriptorIndex::SUBPASS_INPUT: return "SUBPASS_INPUT";
    }
    return "";
}
inline const char* getName(const UniformBlockDB& /*v*/) noexcept { return "UniformBlockDB"; }
inline const char* getName(const Descriptor& /*v*/) noexcept { return "Descriptor"; }
inline const char* getName(const DescriptorBlock& /*v*/) noexcept { return "DescriptorBlock"; }
inline const char* getName(const DescriptorBlockIndex& /*v*/) noexcept { return "DescriptorBlockIndex"; }
inline const char* getName(const DescriptorBlockIndexDx& /*v*/) noexcept { return "DescriptorBlockIndexDx"; }
inline const char* getName(const DescriptorDB& /*v*/) noexcept { return "DescriptorDB"; }
inline const char* getName(const RenderStageTag& /*v*/) noexcept { return "RenderStage"; }
inline const char* getName(const RenderPhaseTag& /*v*/) noexcept { return "RenderPhase"; }
inline const char* getName(const RenderPhase& /*v*/) noexcept { return "RenderPhase"; }
inline const char* getName(const LayoutGraph& /*v*/) noexcept { return "LayoutGraph"; }
inline const char* getName(const UniformData& /*v*/) noexcept { return "UniformData"; }
inline const char* getName(const UniformBlockData& /*v*/) noexcept { return "UniformBlockData"; }
inline const char* getName(const DescriptorData& /*v*/) noexcept { return "DescriptorData"; }
inline const char* getName(const DescriptorBlockData& /*v*/) noexcept { return "DescriptorBlockData"; }
inline const char* getName(const DescriptorTableData& /*v*/) noexcept { return "DescriptorTableData"; }
inline const char* getName(const DescriptorSetData& /*v*/) noexcept { return "DescriptorSetData"; }
inline const char* getName(const PipelineLayoutData& /*v*/) noexcept { return "PipelineLayoutData"; }
inline const char* getName(const ShaderProgramData& /*v*/) noexcept { return "ShaderProgramData"; }
inline const char* getName(const RenderPhaseData& /*v*/) noexcept { return "RenderPhaseData"; }
inline const char* getName(const LayoutGraphData& /*v*/) noexcept { return "LayoutGraphData"; }

} // namespace render

} // namespace cc

// clang-format on
