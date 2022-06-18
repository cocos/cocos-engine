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
#include <functional>
#include "cocos/base/std/variant.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

enum class DescriptorTypeOrder;

struct Descriptor;
struct DescriptorBlock;
struct DescriptorBlockFlattened;
struct DescriptorBlockIndex;
struct DescriptorDB;
struct RenderStageTag;
struct RenderPhaseTag;
struct RenderPhase;
struct LayoutGraph;

using UniformID = uint32_t;

struct UniformData;
struct UniformBlockData;
struct NameLocalID;
struct DescriptorData;
struct DescriptorBlockData;
struct DescriptorSetLayoutData;
struct DescriptorSetData;
struct PipelineLayoutData;
struct ShaderProgramData;
struct RenderStageData;
struct RenderPhaseData;
struct LayoutGraphData;

} // namespace render

} // namespace cc

namespace std {

template <>
struct hash<cc::render::NameLocalID> {
    size_t operator()(const cc::render::NameLocalID& v) const noexcept;
};

}

// clang-format on
