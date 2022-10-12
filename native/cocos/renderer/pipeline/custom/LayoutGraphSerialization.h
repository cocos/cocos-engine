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
#pragma once
#include "cocos/renderer/pipeline/custom/ArchiveTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCommonSerialization.h"
#include "cocos/renderer/pipeline/custom/SerializationUtils.h"

namespace cc {

namespace render {

inline void save(OutputArchive& ar, const DescriptorDB& v) {
    save(ar, v.blocks);
}

inline void load(InputArchive& ar, DescriptorDB& v) {
    load(ar, v.blocks);
}

inline void save(OutputArchive& ar, const RenderPhase& v) {
    save(ar, v.shaders);
}

inline void load(InputArchive& ar, RenderPhase& v) {
    load(ar, v.shaders);
}

inline void save(OutputArchive& ar, const UniformData& v) {
    save(ar, v.uniformID);
    save(ar, v.uniformType);
    save(ar, v.offset);
    save(ar, v.size);
}

inline void load(InputArchive& ar, UniformData& v) {
    load(ar, v.uniformID);
    load(ar, v.uniformType);
    load(ar, v.offset);
    load(ar, v.size);
}

inline void save(OutputArchive& ar, const UniformBlockData& v) {
    save(ar, v.bufferSize);
    save(ar, v.uniforms);
}

inline void load(InputArchive& ar, UniformBlockData& v) {
    load(ar, v.bufferSize);
    load(ar, v.uniforms);
}

inline void save(OutputArchive& ar, const NameLocalID& v) {
    save(ar, v.value);
}

inline void load(InputArchive& ar, NameLocalID& v) {
    load(ar, v.value);
}

inline void save(OutputArchive& ar, const DescriptorData& v) {
    save(ar, v.descriptorID);
    save(ar, v.count);
}

inline void load(InputArchive& ar, DescriptorData& v) {
    load(ar, v.descriptorID);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const DescriptorBlockData& v) {
    save(ar, v.type);
    save(ar, v.visibility);
    save(ar, v.offset);
    save(ar, v.capacity);
    save(ar, v.descriptors);
}

inline void load(InputArchive& ar, DescriptorBlockData& v) {
    load(ar, v.type);
    load(ar, v.visibility);
    load(ar, v.offset);
    load(ar, v.capacity);
    load(ar, v.descriptors);
}

inline void save(OutputArchive& ar, const DescriptorSetLayoutData& v) {
    save(ar, v.slot);
    save(ar, v.capacity);
    save(ar, v.descriptorBlocks);
    save(ar, v.uniformBlocks);
}

inline void load(InputArchive& ar, DescriptorSetLayoutData& v) {
    load(ar, v.slot);
    load(ar, v.capacity);
    load(ar, v.descriptorBlocks);
    load(ar, v.uniformBlocks);
}

inline void save(OutputArchive& ar, const DescriptorSetData& v) {
    save(ar, v.descriptorSetLayoutData);
    save(ar, v.descriptorSetLayoutInfo);
    // skip, descriptorSetLayout: IntrusivePtr<gfx::DescriptorSetLayout>
    // skip, descriptorSet: IntrusivePtr<gfx::DescriptorSet>
}

inline void load(InputArchive& ar, DescriptorSetData& v) {
    load(ar, v.descriptorSetLayoutData);
    load(ar, v.descriptorSetLayoutInfo);
    // skip, descriptorSetLayout: IntrusivePtr<gfx::DescriptorSetLayout>
    // skip, descriptorSet: IntrusivePtr<gfx::DescriptorSet>
}

inline void save(OutputArchive& ar, const PipelineLayoutData& v) {
    save(ar, v.descriptorSets);
}

inline void load(InputArchive& ar, PipelineLayoutData& v) {
    load(ar, v.descriptorSets);
}

inline void save(OutputArchive& ar, const ShaderBindingData& v) {
    save(ar, v.descriptorBindings);
}

inline void load(InputArchive& ar, ShaderBindingData& v) {
    load(ar, v.descriptorBindings);
}

inline void save(OutputArchive& ar, const ShaderLayoutData& v) {
    save(ar, v.layoutData);
    save(ar, v.bindingData);
}

inline void load(InputArchive& ar, ShaderLayoutData& v) {
    load(ar, v.layoutData);
    load(ar, v.bindingData);
}

inline void save(OutputArchive& ar, const TechniqueData& v) {
    save(ar, v.passes);
}

inline void load(InputArchive& ar, TechniqueData& v) {
    load(ar, v.passes);
}

inline void save(OutputArchive& ar, const EffectData& v) {
    save(ar, v.techniques);
}

inline void load(InputArchive& ar, EffectData& v) {
    load(ar, v.techniques);
}

inline void save(OutputArchive& ar, const ShaderProgramData& v) {
    save(ar, v.layout);
}

inline void load(InputArchive& ar, ShaderProgramData& v) {
    load(ar, v.layout);
}

inline void save(OutputArchive& ar, const RenderStageData& v) {
    save(ar, v.descriptorVisibility);
}

inline void load(InputArchive& ar, RenderStageData& v) {
    load(ar, v.descriptorVisibility);
}

inline void save(OutputArchive& ar, const RenderPhaseData& v) {
    save(ar, v.rootSignature);
    save(ar, v.shaderPrograms);
    save(ar, v.shaderIndex);
}

inline void load(InputArchive& ar, RenderPhaseData& v) {
    load(ar, v.rootSignature);
    load(ar, v.shaderPrograms);
    load(ar, v.shaderIndex);
}

} // namespace render

} // namespace cc
