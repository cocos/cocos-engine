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

#include "LayoutGraphUtils.h"
#include <tuple>
#include <utility>
#include "LayoutGraphGraphs.h"
#include "LayoutGraphNames.h"
#include "LayoutGraphTypes.h"
#include "RenderCommonNames.h"
#include "RenderCommonTypes.h"
#include "cocos/base/Log.h"
#include "cocos/base/StringUtil.h"
#include "cocos/base/std/container/string.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "details/DebugUtils.h"
#include "details/GslUtils.h"
#include "details/Map.h"
#include "details/Range.h"

namespace cc {

namespace render {

namespace {

DescriptorBlockData& getDescriptorBlockData(
    PmrFlatMap<DescriptorBlockIndex, DescriptorBlockData>& map,
    const DescriptorBlockIndex& index) {
    auto iter = map.find(index);
    if (iter != map.end()) {
        return iter->second;
    }
    iter = map.emplace(
                  std::piecewise_construct,
                  std::forward_as_tuple(index),
                  std::forward_as_tuple(index.descriptorType, index.visibility, 0))
               .first;

    return iter->second;
}

} // namespace

gfx::DescriptorType getGfxDescriptorType(DescriptorTypeOrder type) {
    switch (type) {
        case DescriptorTypeOrder::UNIFORM_BUFFER:
            return gfx::DescriptorType::UNIFORM_BUFFER;
        case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
            return gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER;
        case DescriptorTypeOrder::SAMPLER_TEXTURE:
            return gfx::DescriptorType::SAMPLER_TEXTURE;
        case DescriptorTypeOrder::SAMPLER:
            return gfx::DescriptorType::SAMPLER;
        case DescriptorTypeOrder::TEXTURE:
            return gfx::DescriptorType::TEXTURE;
        case DescriptorTypeOrder::STORAGE_BUFFER:
            return gfx::DescriptorType::STORAGE_BUFFER;
        case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
            return gfx::DescriptorType::DYNAMIC_STORAGE_BUFFER;
        case DescriptorTypeOrder::STORAGE_IMAGE:
            return gfx::DescriptorType::STORAGE_IMAGE;
        case DescriptorTypeOrder::INPUT_ATTACHMENT:
            return gfx::DescriptorType::INPUT_ATTACHMENT;
        default:
            CC_LOG_ERROR("DescriptorType not found");
            return gfx::DescriptorType::INPUT_ATTACHMENT;
    }
}

DescriptorTypeOrder getDescriptorTypeOrder(gfx::DescriptorType type) {
    switch (type) {
        case gfx::DescriptorType::UNIFORM_BUFFER:
            return DescriptorTypeOrder::UNIFORM_BUFFER;
        case gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER:
            return DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER;
        case gfx::DescriptorType::SAMPLER_TEXTURE:
            return DescriptorTypeOrder::SAMPLER_TEXTURE;
        case gfx::DescriptorType::SAMPLER:
            return DescriptorTypeOrder::SAMPLER;
        case gfx::DescriptorType::TEXTURE:
            return DescriptorTypeOrder::TEXTURE;
        case gfx::DescriptorType::STORAGE_BUFFER:
            return DescriptorTypeOrder::STORAGE_BUFFER;
        case gfx::DescriptorType::DYNAMIC_STORAGE_BUFFER:
            return DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER;
        case gfx::DescriptorType::STORAGE_IMAGE:
            return DescriptorTypeOrder::STORAGE_IMAGE;
        case gfx::DescriptorType::INPUT_ATTACHMENT:
            return DescriptorTypeOrder::INPUT_ATTACHMENT;
        case gfx::DescriptorType::UNKNOWN:
        default:
            CC_LOG_ERROR("DescriptorTypeOrder not found");
            return DescriptorTypeOrder::INPUT_ATTACHMENT;
    }
}

NameLocalID getOrCreateDescriptorID(LayoutGraphData& lg, std::string_view name) {
    auto iter = lg.attributeIndex.find(name);
    if (iter != lg.attributeIndex.end()) {
        return iter->second;
    }
    const auto id = static_cast<uint32_t>(lg.valueNames.size());
    lg.attributeIndex.emplace(name, NameLocalID{id});
    lg.valueNames.emplace_back(name);
    return NameLocalID{id};
}

void makeDescriptorSetLayoutData(
    LayoutGraphData& lg,
    UpdateFrequency rate, uint32_t set, const IDescriptorInfo& descriptors,
    DescriptorSetLayoutData& data,
    boost::container::pmr::memory_resource* scratch) {
    PmrFlatMap<DescriptorBlockIndex, DescriptorBlockData> map(scratch);
    PmrFlatMap<NameLocalID, gfx::UniformBlock> uniformBlocks(scratch);
    for (const auto& cb : descriptors.blocks) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::UNIFORM_BUFFER,
                     cb.stageFlags,
                 });

        const auto nameID = getOrCreateDescriptorID(lg, cb.name);
        block.descriptors.emplace_back(nameID, gfx::Type::UNKNOWN, 1);
        // add uniform buffer
        uniformBlocks.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(nameID),
            std::forward_as_tuple(gfx::UniformBlock{set, 0xFFFFFFFF, cb.name, cb.members, 1}));
    }
    for (const auto& samplerTexture : descriptors.samplerTextures) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::SAMPLER_TEXTURE,
                     samplerTexture.stageFlags,
                 });
        const auto nameID = getOrCreateDescriptorID(lg, samplerTexture.name);
        block.descriptors.emplace_back(nameID, samplerTexture.type, samplerTexture.count);
    }
    for (const auto& sampler : descriptors.samplers) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::SAMPLER,
                     sampler.stageFlags,
                 });
        const auto nameID = getOrCreateDescriptorID(lg, sampler.name);
        block.descriptors.emplace_back(nameID, gfx::Type::SAMPLER, sampler.count);
    }
    for (const auto& texture : descriptors.textures) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::TEXTURE,
                     texture.stageFlags,
                 });
        const auto nameID = getOrCreateDescriptorID(lg, texture.name);
        block.descriptors.emplace_back(nameID, texture.type, texture.count);
    }
    for (const auto& buffer : descriptors.buffers) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::STORAGE_BUFFER,
                     buffer.stageFlags,
                 });
        const auto nameID = getOrCreateDescriptorID(lg, buffer.name);
        block.descriptors.emplace_back(nameID, gfx::Type::UNKNOWN, 1);
    }
    for (const auto& image : descriptors.images) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::STORAGE_IMAGE,
                     image.stageFlags,
                 });
        const auto nameID = getOrCreateDescriptorID(lg, image.name);
        block.descriptors.emplace_back(nameID, image.type, image.count);
    }
    for (const auto& subpassInput : descriptors.subpassInputs) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate,
                     ParameterType::TABLE,
                     DescriptorTypeOrder::INPUT_ATTACHMENT,
                     subpassInput.stageFlags,
                 });
        const auto nameID = getOrCreateDescriptorID(lg, subpassInput.name);
        block.descriptors.emplace_back(nameID, gfx::Type::UNKNOWN, subpassInput.count);
    }

    // calculate bindings
    uint32_t capacity = 0;
    for (auto&& [index, block] : map) {
        block.offset = capacity;
        for (const auto& d : block.descriptors) {
            if (index.descriptorType == DescriptorTypeOrder::UNIFORM_BUFFER) {
                // update uniform buffer binding
                auto iter = uniformBlocks.find(d.descriptorID);
                if (iter == uniformBlocks.end()) {
                    CC_LOG_ERROR("Uniform block not found");
                    continue;
                }
                auto& ub = iter->second;
                assert(ub.binding == 0xFFFFFFFF);
                ub.binding = block.capacity;
                // add uniform buffer to output
                data.uniformBlocks.emplace(d.descriptorID, std::move(ub));
            }
            // update block capacity
            auto iter = data.bindingMap.find(d.descriptorID);
            if (iter != data.bindingMap.end()) {
                CC_LOG_ERROR("Duplicated descriptor name: %s", lg.valueNames[d.descriptorID.value].c_str());
                continue;
            }
            data.bindingMap.emplace(d.descriptorID, block.offset + block.capacity);
            block.capacity += d.count;
        }
        // increate total capacity
        capacity += block.capacity;
        data.capacity += block.capacity;
        if (index.descriptorType == DescriptorTypeOrder::UNIFORM_BUFFER ||
            index.descriptorType == DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER) {
            data.uniformBlockCapacity += block.capacity;
        } else if (index.descriptorType == DescriptorTypeOrder::SAMPLER_TEXTURE) {
            data.samplerTextureCapacity += block.capacity;
        }
        data.descriptorBlocks.emplace_back(std::move(block));
    }
}

void initializeDescriptorSetLayoutInfo(
    const DescriptorSetLayoutData& layoutData,
    gfx::DescriptorSetLayoutInfo& info) {
    for (const auto& block : layoutData.descriptorBlocks) {
        auto slot = block.offset;
        for (const auto& d : block.descriptors) {
            auto& binding = info.bindings.emplace_back();
            binding.binding = slot;
            binding.descriptorType = getGfxDescriptorType(block.type);
            binding.count = d.count;
            binding.stageFlags = block.visibility;
            binding.immutableSamplers = {};

            // update slot
            slot += d.count;
        }
    }
}

namespace {

const ccstd::unordered_map<ccstd::string, uint32_t> DEFAULT_UNIFORM_COUNTS{
    {"cc_lightPos", pipeline::UBOForwardLight::LIGHTS_PER_PASS},
    {"cc_lightColor", pipeline::UBOForwardLight::LIGHTS_PER_PASS},
    {"cc_lightSizeRangeAngle", pipeline::UBOForwardLight::LIGHTS_PER_PASS},
    {"cc_lightDir", pipeline::UBOForwardLight::LIGHTS_PER_PASS},
    {"cc_lightBoundingSizeVS", pipeline::UBOForwardLight::LIGHTS_PER_PASS},
};

const TransparentSet<ccstd::string> DYNAMIC_UNIFORM_BLOCK{
    {"CCCamera"},
    {"CCForwardLight"},
    {"CCUILocal"},
};

} // namespace

uint32_t getUniformBlockSize(const ccstd::vector<gfx::Uniform>& blockMembers) {
    uint32_t prevSize = 0;
    for (const auto& m : blockMembers) {
        if (m.count) {
            prevSize += getTypeSize(m.type) * m.count;
            continue;
        }
        auto iter = DEFAULT_UNIFORM_COUNTS.find(m.name);
        if (iter != DEFAULT_UNIFORM_COUNTS.end()) {
            prevSize += getTypeSize(m.type) * iter->second;
            continue;
        }
        if (m.name == "cc_joints") {
            const auto sz = getTypeSize(m.type) * pipeline::UBOSkinning::layout.members[0].count;
            CC_EXPECTS(sz == pipeline::UBOSkinning::size);
            prevSize += sz;
            continue;
        }
        CC_LOG_ERROR("Invalid uniform count: %s", m.name.c_str());
    }
    CC_ENSURES(prevSize);
    return prevSize;
}

bool isDynamicUniformBlock(std::string_view name) {
    return DYNAMIC_UNIFORM_BLOCK.find(name) != DYNAMIC_UNIFORM_BLOCK.end();
}

gfx::DescriptorSet* getOrCreatePerPassDescriptorSet(
    gfx::Device* device,
    LayoutGraphData& lg, LayoutGraphData::vertex_descriptor vertID) {
    auto& ppl = get(LayoutGraphData::LayoutTag{}, lg, vertID);
    auto iter = ppl.descriptorSets.find(UpdateFrequency::PER_PASS);
    if (iter == ppl.descriptorSets.end()) {
        return nullptr;
    }
    auto& data = iter->second;
    if (!data.descriptorSet) {
        if (!data.descriptorSetLayout) {
            data.descriptorSetLayout = device->createDescriptorSetLayout(data.descriptorSetLayoutInfo);
        }
        CC_ENSURES(data.descriptorSetLayout);
        data.descriptorSet = device->createDescriptorSet(gfx::DescriptorSetInfo{data.descriptorSetLayout.get()});
    }
    CC_ENSURES(data.descriptorSet);
    return data.descriptorSet;
}

void generateConstantMacros(
    gfx::Device* device,
    ccstd::string& constantMacros) {
    constantMacros = StringUtil::format(
        R"(
#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE %d
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS %d
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS %d
#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT %d
#define CC_PLATFORM_ANDROID_AND_WEBGL 0
#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES 0
#define CC_JOINT_UNIFORM_CAPACITY %d
        )",
        hasAnyFlags(device->getFormatFeatures(gfx::Format::RGBA32F),
                    gfx::FormatFeature::RENDER_TARGET | gfx::FormatFeature::SAMPLED_TEXTURE),
        device->getCapabilities().maxVertexUniformVectors,
        device->getCapabilities().maxFragmentUniformVectors,
        device->hasFeature(gfx::Feature::INPUT_ATTACHMENT_BENEFIT),
        pipeline::SkinningJointCapacity::jointUniformCapacity);
}

namespace {

ccstd::string getName(gfx::ShaderStageFlagBit stage) {
    std::ostringstream oss;
    int count = 0;
    if (hasFlag(stage, gfx::ShaderStageFlagBit::VERTEX)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Vertex";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::CONTROL)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Control";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::EVALUATION)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Evaluation";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::GEOMETRY)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Geometry";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::FRAGMENT)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Fragment";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::COMPUTE)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Compute";
    }
    if (hasAllFlags(stage, gfx::ShaderStageFlagBit::ALL)) {
        if (count++) {
            oss << " | ";
        }
        oss << "All";
    }
    return oss.str();
}

} // namespace

void printLayoutGraphData(
    const LayoutGraphData& lg, std::ostream& oss,
    boost::container::pmr::memory_resource* scratch) {
    ccstd::pmr::string space(scratch);

    oss << "\n";

    for (const auto v : makeRange(vertices(lg))) {
        if (parent(v, lg) != LayoutGraphData::null_vertex()) {
            continue;
        }
        const auto& name = get(LayoutGraphData::NameTag{}, lg, v);
        OSS << "\"" << name << "\": ";

        visit(
            [&](auto tag) {
                oss << getName(tag);
            },
            tag(v, lg));

        oss << " {\n";
        INDENT_BEG();
        const auto& info = get(LayoutGraphData::LayoutTag{}, lg, v);
        for (const auto& set : info.descriptorSets) {
            OSS << "Set<" << getName(set.first) << "> {\n";
            {
                INDENT();
                for (const auto& block : set.second.descriptorSetLayoutData.descriptorBlocks) {
                    OSS << "Block<" << getName(block.type) << ", " << getName(block.visibility) << "> {\n";
                    {
                        INDENT();
                        OSS << "capacity: " << block.capacity << ",\n";
                        OSS << "count: " << block.descriptors.size() << ",\n";
                        if (!block.descriptors.empty()) {
                            OSS << "Descriptors{ ";
                            int count = 0;
                            for (const auto& d : block.descriptors) {
                                if (count++) {
                                    oss << ", ";
                                }
                                const auto& name = lg.valueNames.at(d.descriptorID.value);
                                oss << "\"" << name;
                                if (d.count != 1) {
                                    oss << "[" << d.count << "]";
                                }
                                oss << "\"";
                            }
                            oss << " }\n";
                        }
                    }
                    OSS << "}\n";
                }
            }
            OSS << "}\n";
        }
        INDENT_END();
        OSS << "}\n";
    }
}

gfx::TextureType getTextureType(ResourceDimension dimension, uint32_t arraySize) {
    switch (dimension) {
        case ResourceDimension::TEXTURE1D:
            return arraySize > 1 ? gfx::TextureType::TEX1D_ARRAY : gfx::TextureType::TEX1D;
        case ResourceDimension::TEXTURE2D:
            return arraySize > 1 ? gfx::TextureType::TEX2D_ARRAY : gfx::TextureType::TEX2D;
        case ResourceDimension::TEXTURE3D:
            return gfx::TextureType::TEX3D;
        case ResourceDimension::BUFFER:
        default:
            return gfx::TextureType::TEX2D;
    }
}

ResourceDimension getResourceDimension(gfx::TextureType type) {
    switch (type) {
        case gfx::TextureType::TEX1D:
        case gfx::TextureType::TEX1D_ARRAY:
            return ResourceDimension::TEXTURE1D;
        case gfx::TextureType::TEX3D:
            return ResourceDimension::TEXTURE3D;
        case gfx::TextureType::TEX2D:
        case gfx::TextureType::TEX2D_ARRAY:
        case gfx::TextureType::CUBE:
        default:
            return ResourceDimension::TEXTURE2D;
    }
}

} // namespace render

} // namespace cc
