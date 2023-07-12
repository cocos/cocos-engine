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

#include <boost/algorithm/string.hpp>
#include <boost/container/pmr/global_resource.hpp>
#include <boost/container/pmr/memory_resource.hpp>
#include <cctype>
#include <sstream>
#include <stdexcept>
#include <tuple>
#include <utility>
#include "LayoutGraphGraphs.h"
#include "LayoutGraphUtils.h"
#include "NativePipelineTypes.h"
#include "ProgramLib.h"
#include "base/Ptr.h"
#include "cocos/base/Log.h"
#include "cocos/core/assets/EffectAsset.h"
#include "cocos/renderer/core/ProgramUtils.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "details/Range.h"
#include "gfx-base/GFXDescriptorSetLayout.h"
#include "gfx-base/GFXShader.h"
#include "pipeline/custom/NativePipelineFwd.h"
#include "pipeline/custom/PrivateTypes.h"
#include "pipeline/custom/RenderCommonTypes.h"
#include "pipeline/custom/details/GslUtils.h"

namespace cc {

namespace render {

const ccstd::string &NativeProgramProxy::getName() const noexcept {
    return shader->getName();
}

gfx::Shader *NativeProgramProxy::getShader() const noexcept {
    return shader;
}

namespace {

constexpr uint32_t SET_INDEX[4] = {2, 1, 3, 0};

constexpr uint32_t setIndex(UpdateFrequency rate) {
    return SET_INDEX[static_cast<uint32_t>(rate)];
}

constexpr auto INVALID_ID = LayoutGraphData::null_vertex();

std::tuple<uint32_t, uint32_t, uint32_t, const IShaderInfo *, uint32_t>
getEffectShader(
    const LayoutGraphData &lg,
    const EffectAsset &effect, const IPassInfo &pass) {
    const auto &programName = pass.program;
    auto passID = INVALID_ID;
    if (pass.pass) {
        passID = locate(INVALID_ID, *pass.pass, lg);
    } else {
        passID = locate(INVALID_ID, "default", lg);
    }
    if (passID == INVALID_ID) {
        CC_LOG_ERROR("Invalid render pass");
        return {INVALID_ID, INVALID_ID, INVALID_ID, nullptr, INVALID_ID};
    }

    auto subpassID = INVALID_ID;
    if (pass.subpass) {
        subpassID = locate(passID, *pass.subpass, lg);
        if (subpassID == INVALID_ID) {
            CC_LOG_ERROR("Invalid render subpass");
            return {INVALID_ID, INVALID_ID, INVALID_ID, nullptr, INVALID_ID};
        }
    }

    auto phaseID = INVALID_ID;
    if (pass.phase) {
        phaseID = locate(subpassID == INVALID_ID ? passID : subpassID, *pass.phase, lg);
    } else {
        phaseID = locate(subpassID == INVALID_ID ? passID : subpassID, "default", lg);
    }
    if (phaseID == INVALID_ID) {
        CC_LOG_ERROR("Invalid render phase");
        return {INVALID_ID, INVALID_ID, INVALID_ID, nullptr, INVALID_ID};
    }

    const IShaderInfo *srcShaderInfo = nullptr;
    auto shaderID = INVALID_ID;
    for (uint32_t i = 0; i != effect._shaders.size(); ++i) {
        const auto &shader = effect._shaders[i];
        if (shader.name == programName) {
            srcShaderInfo = &shader;
            shaderID = i;
            break;
        }
    }
    return {passID, subpassID, phaseID, srcShaderInfo, shaderID};
}

int validateShaderInfo(const IShaderInfo &srcShaderInfo) {
    if (srcShaderInfo.descriptors.empty()) {
        CC_LOG_ERROR("No descriptors in shaderInfo");
        return 1;
    }
    return 0;
}

IProgramInfo makeProgramInfo(const ccstd::string &effectName, const IShaderInfo &shader) {
    IProgramInfo programInfo;
    programInfo.copyFrom(shader);
    programInfo.effectName = effectName;

    populateMacros(programInfo);

    return programInfo;
}

ccstd::pmr::vector<std::tuple<ccstd::pmr::string, gfx::Type>> getDescriptorNameAndType(
    const pipeline::DescriptorSetLayoutInfos &source, uint32_t binding,
    boost::container::pmr::memory_resource *scratch) {
    ccstd::pmr::vector<std::tuple<ccstd::pmr::string, gfx::Type>> results(scratch);

    for (const auto &[name, block] : source.blocks) {
        if (block.binding == binding) {
            results.emplace_back(std::tuple{name, gfx::Type::UNKNOWN});
        }
    }
    for (const auto &[name, texture] : source.samplers) {
        if (texture.binding == binding) {
            results.emplace_back(std::tuple{name, texture.type});
        }
    }
    for (const auto &[name, image] : source.storeImages) {
        if (image.binding == binding) {
            results.emplace_back(std::tuple{name, image.type});
        }
    }
    return results;
}

void makeLocalDescriptorSetLayoutData(
    LayoutGraphData &lg,
    const pipeline::DescriptorSetLayoutInfos &source,
    DescriptorSetLayoutData &data,
    boost::container::pmr::memory_resource *scratch) {
    for (const auto &b : source.bindings) {
        const auto &descriptors = getDescriptorNameAndType(source, b.binding, scratch);
        CC_ENSURES(!descriptors.empty());
        {
            const auto &[name, type] = descriptors.front();
            const auto nameID = getOrCreateDescriptorID(lg, name);
            const auto order = getDescriptorTypeOrder(b.descriptorType);
            auto &block = data.descriptorBlocks.emplace_back(order, b.stageFlags, b.count);
            block.offset = b.binding;
            block.descriptors.emplace_back(nameID, type, b.count);
        }
        for (const auto &[name, type] : descriptors) {
            const auto nameID = getOrCreateDescriptorID(lg, name);
            {
                auto iter = data.bindingMap.find(nameID);
                if (iter != data.bindingMap.end()) {
                    CC_LOG_ERROR("Duplicate descriptor name: %s", name.data());
                }
                data.bindingMap.emplace(nameID, b.binding);
            }
            {
                auto iter = source.blocks.find(ccstd::string(name));
                if (iter != source.blocks.end()) {
                    data.uniformBlocks.emplace(nameID, iter->second);
                }
            }
        }
    }
}

ShaderProgramData &buildProgramData(
    const ccstd::string &programName,
    const IShaderInfo &srcShaderInfo,
    LayoutGraphData &lg,
    RenderPhaseData &phase,
    bool fixedLocal,
    boost::container::pmr::memory_resource *scratch) {
    // add shader
    auto shaderID = static_cast<uint32_t>(phase.shaderPrograms.size());
    phase.shaderIndex.emplace(programName, shaderID);
    auto &programData = phase.shaderPrograms.emplace_back();
    // build per-batch
    {
        auto res = programData.layout.descriptorSets.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(UpdateFrequency::PER_BATCH),
            std::forward_as_tuple());
        CC_ENSURES(res.second);

        auto &setData = res.first->second;

        makeDescriptorSetLayoutData(
            lg, UpdateFrequency::PER_BATCH,
            setIndex(UpdateFrequency::PER_BATCH),
            srcShaderInfo.descriptors[static_cast<uint32_t>(UpdateFrequency::PER_BATCH)],
            setData.descriptorSetLayoutData, scratch);
        initializeDescriptorSetLayoutInfo(
            setData.descriptorSetLayoutData, setData.descriptorSetLayoutInfo);
    }

    // build per-instance
    if (fixedLocal) {
        auto res = programData.layout.descriptorSets.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(UpdateFrequency::PER_INSTANCE),
            std::forward_as_tuple());
        CC_ENSURES(res.second);
        auto &setData = res.first->second;
        auto &perInstance = setData.descriptorSetLayoutData;
        makeLocalDescriptorSetLayoutData(lg, pipeline::localDescriptorSetLayout, perInstance, scratch);
        initializeDescriptorSetLayoutInfo(
            setData.descriptorSetLayoutData,
            setData.descriptorSetLayoutInfo);
        if (pipeline::localDescriptorSetLayout.bindings.size() != setData.descriptorSetLayoutInfo.bindings.size()) {
            CC_LOG_ERROR("Mismatched local descriptor set layout");
        } else {
            for (uint32_t i = 0; i != pipeline::localDescriptorSetLayout.bindings.size(); ++i) {
                const auto &a = pipeline::localDescriptorSetLayout.bindings[i];
                const auto &b = setData.descriptorSetLayoutInfo.bindings[i];
                if (a.binding != b.binding ||
                    a.descriptorType != b.descriptorType ||
                    a.count != b.count ||
                    a.stageFlags != b.stageFlags) {
                    CC_LOG_ERROR("Mismatched local descriptor set layout");
                }
            }
        }
    } else {
        auto res = programData.layout.descriptorSets.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(UpdateFrequency::PER_INSTANCE),
            std::forward_as_tuple());
        CC_ENSURES(res.second);
        auto &setData = res.first->second;
        makeDescriptorSetLayoutData(
            lg, UpdateFrequency::PER_INSTANCE,
            setIndex(UpdateFrequency::PER_INSTANCE),
            srcShaderInfo.descriptors[static_cast<uint32_t>(UpdateFrequency::PER_INSTANCE)],
            setData.descriptorSetLayoutData, scratch);
        initializeDescriptorSetLayoutInfo(
            setData.descriptorSetLayoutData,
            setData.descriptorSetLayoutInfo);
    }

    return programData;
}

void populateMergedShaderInfo(
    const ccstd::pmr::vector<ccstd::pmr::string> &valueNames,
    const DescriptorSetLayoutData &layout, uint32_t set,
    gfx::ShaderInfo &shaderInfo, ccstd::vector<int32_t> &blockSizes) {
    for (const auto &descriptorBlock : layout.descriptorBlocks) {
        auto binding = descriptorBlock.offset;
        switch (descriptorBlock.type) {
            case DescriptorTypeOrder::UNIFORM_BUFFER:
                for (const auto &block : descriptorBlock.descriptors) {
                    auto iter = layout.uniformBlocks.find(block.descriptorID);

                    if (iter == layout.uniformBlocks.end()) {
                        CC_LOG_ERROR("Failed to find uniform block in layout");
                        continue;
                    }
                    const auto &uniformBlock = iter->second;
                    blockSizes.emplace_back(getUniformBlockSize(uniformBlock.members));
                    shaderInfo.blocks.emplace_back(
                        gfx::UniformBlock{
                            set,
                            binding,
                            ccstd::string(valueNames.at(block.descriptorID.value)),
                            uniformBlock.members,
                            1,
                        } // count is always 1 for UniformBlock
                    );
                    ++binding;
                }
                if (binding != descriptorBlock.offset + descriptorBlock.capacity) {
                    CC_LOG_ERROR("Uniform buffer binding mismatch for set");
                }
                break;
            case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
                // not implemented yet
                break;
            case DescriptorTypeOrder::SAMPLER_TEXTURE:
                for (const auto &tex : descriptorBlock.descriptors) {
                    shaderInfo.samplerTextures.emplace_back(gfx::UniformSamplerTexture{
                        set,
                        binding,
                        ccstd::string(valueNames.at(tex.descriptorID.value)),
                        tex.type,
                        tex.count,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::SAMPLER:
                for (const auto &sampler : descriptorBlock.descriptors) {
                    shaderInfo.samplers.emplace_back(gfx::UniformSampler{
                        set,
                        binding,
                        ccstd::string(valueNames.at(sampler.descriptorID.value)),
                        sampler.count,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::TEXTURE:
                for (const auto &texture : descriptorBlock.descriptors) {
                    shaderInfo.textures.emplace_back(gfx::UniformTexture{
                        set,
                        binding,
                        ccstd::string(valueNames.at(texture.descriptorID.value)),
                        texture.type,
                        texture.count,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::STORAGE_BUFFER:
                for (const auto &buffer : descriptorBlock.descriptors) {
                    shaderInfo.buffers.emplace_back(gfx::UniformStorageBuffer{
                        set,
                        binding,
                        ccstd::string(valueNames.at(buffer.descriptorID.value)),
                        1,
                        gfx::MemoryAccessBit::READ_WRITE, /*buffer.memoryAccess*/
                    });
                    // effect compiler guarantees buffer count = 1
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
                // not implemented yet
                break;
            case DescriptorTypeOrder::STORAGE_IMAGE:
                for (const auto &image : descriptorBlock.descriptors) {
                    shaderInfo.images.emplace_back(gfx::UniformStorageImage{
                        set,
                        binding,
                        ccstd::string(valueNames.at(image.descriptorID.value)),
                        image.type,
                        image.count,
                        gfx::MemoryAccessBit::READ_WRITE, /*image.memoryAccess*/
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::INPUT_ATTACHMENT:
                for (const auto &subpassInput : descriptorBlock.descriptors) {
                    shaderInfo.subpassInputs.emplace_back(gfx::UniformInputAttachment{
                        set,
                        binding,
                        ccstd::string(valueNames.at(subpassInput.descriptorID.value)),
                        subpassInput.count,
                    });
                    ++binding;
                }
                break;
            default:
                CC_LOG_ERROR("Unknown descriptor type");
        }
    }
}

// add descriptor to size-reserved descriptor set
void populateGroupedShaderInfo(
    const DescriptorSetLayoutData &layout,
    const IDescriptorInfo &descriptorInfo, uint32_t set,
    gfx::ShaderInfo &shaderInfo,
    ccstd::vector<int32_t> &blockSizes) {
    for (const auto &descriptorBlock : layout.descriptorBlocks) {
        const auto visibility = descriptorBlock.visibility;
        auto binding = descriptorBlock.offset;

        switch (descriptorBlock.type) {
            case DescriptorTypeOrder::UNIFORM_BUFFER:
                for (const auto &block : descriptorInfo.blocks) {
                    if (block.stageFlags != visibility) {
                        continue;
                    }
                    blockSizes.emplace_back(getUniformBlockSize(block.members));
                    shaderInfo.blocks.emplace_back(
                        gfx::UniformBlock{
                            set,
                            binding,
                            block.name,
                            block.members,
                            1,
                        } // count is always 1 for UniformBlock
                    );
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
                // not implemented yet
                break;
            case DescriptorTypeOrder::SAMPLER_TEXTURE:
                for (const auto &tex : descriptorInfo.samplerTextures) {
                    if (tex.stageFlags != visibility) {
                        continue;
                    }
                    shaderInfo.samplerTextures.emplace_back(gfx::UniformSamplerTexture{
                        set,
                        binding,
                        tex.name,
                        tex.type,
                        tex.count,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::SAMPLER:
                for (const auto &sampler : descriptorInfo.samplers) {
                    if (sampler.stageFlags != visibility) {
                        continue;
                    }
                    shaderInfo.samplers.emplace_back(gfx::UniformSampler{
                        set,
                        binding,
                        sampler.name,
                        sampler.count,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::TEXTURE:
                for (const auto &texture : descriptorInfo.textures) {
                    if (texture.stageFlags != visibility) {
                        continue;
                    }
                    shaderInfo.textures.emplace_back(gfx::UniformTexture{
                        set,
                        binding,
                        texture.name,
                        texture.type,
                        texture.count,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::STORAGE_BUFFER:
                for (const auto &buffer : descriptorInfo.buffers) {
                    if (buffer.stageFlags != visibility) {
                        continue;
                    }
                    shaderInfo.buffers.emplace_back(gfx::UniformStorageBuffer{
                        set,
                        binding,
                        buffer.name,
                        1,
                        buffer.memoryAccess,
                    }); // effect compiler guarantees buffer count = 1
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
                // not implemented yet
                break;
            case DescriptorTypeOrder::STORAGE_IMAGE:
                for (const auto &image : descriptorInfo.images) {
                    if (image.stageFlags != visibility) {
                        continue;
                    }
                    shaderInfo.images.emplace_back(gfx::UniformStorageImage{
                        set,
                        binding,
                        image.name,
                        image.type,
                        image.count,
                        image.memoryAccess,
                    });
                    ++binding;
                }
                break;
            case DescriptorTypeOrder::INPUT_ATTACHMENT:
                for (const auto &subpassInput : descriptorInfo.subpassInputs) {
                    if (subpassInput.stageFlags != visibility) {
                        continue;
                    }
                    shaderInfo.subpassInputs.emplace_back(gfx::UniformInputAttachment{
                        set,
                        subpassInput.binding,
                        subpassInput.name,
                        subpassInput.count,
                    });
                    ++binding;
                }
                break;
            default:
                CC_LOG_ERROR("Unknown descriptor type");
        }
    }
}

// add fixed local descriptors to gfx.ShaderInfo
void populateLocalShaderInfo(
    const IDescriptorInfo &target,
    const pipeline::DescriptorSetLayoutInfos &source,
    gfx::ShaderInfo &shaderInfo, ccstd::vector<int32_t> &blockSizes) {
    constexpr auto set = setIndex(UpdateFrequency::PER_INSTANCE);
    for (const auto &block : target.blocks) {
        auto blockIter = source.blocks.find(block.name);
        if (blockIter == source.blocks.end()) {
            continue;
        }
        const auto &info = blockIter->second;

        const gfx::DescriptorSetLayoutBinding *pBinding = nullptr;
        for (const auto &b : source.bindings) {
            if (b.binding == info.binding) {
                pBinding = &b;
            }
        }
        if (!pBinding || !(pBinding->descriptorType & gfx::DESCRIPTOR_BUFFER_TYPE)) {
            CC_LOG_ERROR("builtin UBO not available !");
            continue;
        }

        const auto &binding = *pBinding;
        blockSizes.emplace_back(getUniformBlockSize(block.members));
        shaderInfo.blocks.emplace_back(
            gfx::UniformBlock{
                set,
                binding.binding,
                block.name,
                block.members,
                1,
            }); // effect compiler guarantees block count = 1
    }
    for (const auto &samplerTexture : target.samplerTextures) {
        auto iter = source.samplers.find(samplerTexture.name);
        if (iter == source.samplers.end()) {
            CC_LOG_ERROR("builtin sampler not available !");
            continue;
        }
        const auto &info = iter->second;

        const gfx::DescriptorSetLayoutBinding *pBinding = nullptr;
        for (const auto &b : source.bindings) {
            if (b.binding == info.binding) {
                pBinding = &b;
            }
        }
        if (!pBinding || !(pBinding->descriptorType & gfx::DESCRIPTOR_SAMPLER_TYPE)) {
            CC_LOG_ERROR("builtin sampler not available !");
            continue;
        }
        const auto &binding = *pBinding;
        shaderInfo.samplerTextures.emplace_back(gfx::UniformSamplerTexture{
            set,
            binding.binding,
            samplerTexture.name,
            samplerTexture.type,
            samplerTexture.count,
        });
    }
}

uint32_t getIDescriptorSetLayoutInfoUniformBlockCapacity(const pipeline::DescriptorSetLayoutInfos &info) {
    uint32_t capacity = 0;
    for (const auto &binding : info.bindings) {
        if (binding.descriptorType == gfx::DescriptorType::UNIFORM_BUFFER ||
            binding.descriptorType == gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER) {
            capacity += binding.count;
        }
    }
    return capacity;
}

uint32_t getIDescriptorSetLayoutInfoSamplerTextureCapacity(const pipeline::DescriptorSetLayoutInfos &info) {
    uint32_t capacity = 0;
    for (const auto &binding : info.bindings) {
        if (binding.descriptorType != gfx::DescriptorType::UNIFORM_BUFFER &&
            binding.descriptorType != gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER) {
            capacity += binding.count;
        }
    }
    return capacity;
}

void setFlattenedUniformBlockBinding(
    const std::array<uint32_t, 4> &setOffsets,
    ccstd::vector<gfx::UniformBlock> &descriptors) {
    for (auto &d : descriptors) {
        d.flattened = setOffsets[d.set] + d.binding;
    }
}

template <class Desc>
void setFlattenedSamplerTextureBinding(
    const std::array<uint32_t, 4> &setOffsets,
    const std::array<uint32_t, 4> &uniformBlockCapacities,
    ccstd::vector<Desc> &descriptors) {
    for (auto &d : descriptors) {
        d.flattened = setOffsets[d.set] + d.binding - uniformBlockCapacities[d.set];
    }
}

void calculateFlattenedBinding(
    const std::array<const DescriptorSetLayoutData *, 4> &descriptorSets,
    const pipeline::DescriptorSetLayoutInfos *fixedInstanceDescriptorSetLayout,
    gfx::ShaderInfo &shaderInfo) {
    // Descriptors of UniformBlock starts from 0, and Descriptors of SamplerTexture starts from the end of UniformBlock.
    std::array<uint32_t, 4> uniformBlockCapacities{};
    {
        const auto passCapacity =
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PASS)]
                ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PASS)]->uniformBlockCapacity
                : 0;
        const auto phaseCapacity =
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PHASE)]
                ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PHASE)]->uniformBlockCapacity
                : 0;
        const auto batchCapacity =
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_BATCH)]
                ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_BATCH)]->uniformBlockCapacity
                : 0;
        const auto instanceCapacity =
            fixedInstanceDescriptorSetLayout
                ? getIDescriptorSetLayoutInfoUniformBlockCapacity(*fixedInstanceDescriptorSetLayout)
                : (descriptorSets[static_cast<size_t>(UpdateFrequency::PER_INSTANCE)]
                       ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_INSTANCE)]->uniformBlockCapacity
                       : 0);

        // update uniform block capacities
        uniformBlockCapacities[setIndex(UpdateFrequency::PER_PASS)] = passCapacity;
        uniformBlockCapacities[setIndex(UpdateFrequency::PER_PHASE)] = phaseCapacity;
        uniformBlockCapacities[setIndex(UpdateFrequency::PER_BATCH)] = batchCapacity;
        uniformBlockCapacities[setIndex(UpdateFrequency::PER_INSTANCE)] = instanceCapacity;

        // calculate uniform block offsets
        const auto passOffset = 0;
        const auto phaseOffset = passOffset + passCapacity;
        const auto instanceOffset = phaseOffset + phaseCapacity;
        const auto batchOffset = instanceOffset + instanceCapacity;

        // save uniform block offsets by set index
        std::array<uint32_t, 4> uniformBlockOffsets{};
        uniformBlockOffsets[setIndex(UpdateFrequency::PER_PASS)] = passOffset;
        uniformBlockOffsets[setIndex(UpdateFrequency::PER_PHASE)] = phaseOffset;
        uniformBlockOffsets[setIndex(UpdateFrequency::PER_BATCH)] = batchOffset;
        uniformBlockOffsets[setIndex(UpdateFrequency::PER_INSTANCE)] = instanceOffset;

        // update flattened uniform block binding
        setFlattenedUniformBlockBinding(uniformBlockOffsets, shaderInfo.blocks);
    }
    {
        // calculate sampler texture capacities
        const auto passCapacity =
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PASS)]
                ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PASS)]->samplerTextureCapacity
                : 0;
        const auto phaseCapacity =
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PHASE)]
                ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PHASE)]->samplerTextureCapacity
                : 0;
        const auto batchCapacity =
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_BATCH)]
                ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_BATCH)]->samplerTextureCapacity
                : 0;
        const auto instanceCapacity =
            fixedInstanceDescriptorSetLayout
                ? getIDescriptorSetLayoutInfoSamplerTextureCapacity(*fixedInstanceDescriptorSetLayout)
                : (descriptorSets[static_cast<size_t>(UpdateFrequency::PER_INSTANCE)]
                       ? descriptorSets[static_cast<size_t>(UpdateFrequency::PER_INSTANCE)]->samplerTextureCapacity
                       : 0);

        // calculate sampler texture offsets
        const auto passOffset = 0;
        const auto phaseOffset = passOffset + passCapacity;
        const auto instanceOffset = phaseOffset + phaseCapacity;
        const auto batchOffset = instanceOffset + instanceCapacity;

        // save sampler texture offsets by set index
        std::array<uint32_t, 4> samplerTextureOffsets{};
        samplerTextureOffsets[setIndex(UpdateFrequency::PER_PASS)] = passOffset;
        samplerTextureOffsets[setIndex(UpdateFrequency::PER_PHASE)] = phaseOffset;
        samplerTextureOffsets[setIndex(UpdateFrequency::PER_BATCH)] = batchOffset;
        samplerTextureOffsets[setIndex(UpdateFrequency::PER_INSTANCE)] = instanceOffset;

        // update flattened sampler texture binding
        setFlattenedSamplerTextureBinding(samplerTextureOffsets, uniformBlockCapacities, shaderInfo.samplerTextures);
        setFlattenedSamplerTextureBinding(samplerTextureOffsets, uniformBlockCapacities, shaderInfo.samplers);
        setFlattenedSamplerTextureBinding(samplerTextureOffsets, uniformBlockCapacities, shaderInfo.textures);
        setFlattenedSamplerTextureBinding(samplerTextureOffsets, uniformBlockCapacities, shaderInfo.buffers);
        setFlattenedSamplerTextureBinding(samplerTextureOffsets, uniformBlockCapacities, shaderInfo.images);
    }
}

void makeShaderInfo(
    LayoutGraphData &lg,
    const PipelineLayoutData &passLayouts, // NOLINT(bugprone-easily-swappable-parameters)
    const PipelineLayoutData &phaseLayouts,
    const IShaderInfo &srcShaderInfo,
    const ShaderProgramData *programData,
    bool fixedLocal,
    gfx::ShaderInfo &shaderInfo,
    ccstd::vector<int32_t> &blockSizes) {
    std::array<const DescriptorSetLayoutData *, 4> descriptorSets{};
    const pipeline::DescriptorSetLayoutInfos *fixedInstanceDescriptorSetLayout = nullptr;
    { // pass
        auto iter = passLayouts.descriptorSets.find(UpdateFrequency::PER_PASS);
        if (iter != passLayouts.descriptorSets.end()) {
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PASS)] = &iter->second.descriptorSetLayoutData;
            populateMergedShaderInfo(
                lg.valueNames, iter->second.descriptorSetLayoutData,
                setIndex(UpdateFrequency::PER_PASS),
                shaderInfo, blockSizes);
        }
    }
    { // phase
        auto iter = phaseLayouts.descriptorSets.find(UpdateFrequency::PER_PHASE);
        if (iter != phaseLayouts.descriptorSets.end()) {
            descriptorSets[static_cast<size_t>(UpdateFrequency::PER_PHASE)] = &iter->second.descriptorSetLayoutData;
            populateMergedShaderInfo(
                lg.valueNames, iter->second.descriptorSetLayoutData,
                setIndex(UpdateFrequency::PER_PHASE),
                shaderInfo, blockSizes);
        }
    }
    { // batch
        const auto &batchInfo = srcShaderInfo.descriptors.at(
            static_cast<uint32_t>(UpdateFrequency::PER_BATCH));
        if (programData) {
            auto iter = programData->layout.descriptorSets.find(UpdateFrequency::PER_BATCH);
            if (iter != programData->layout.descriptorSets.end()) {
                descriptorSets[static_cast<size_t>(UpdateFrequency::PER_BATCH)] = &iter->second.descriptorSetLayoutData;
                populateMergedShaderInfo(
                    lg.valueNames, iter->second.descriptorSetLayoutData,
                    setIndex(UpdateFrequency::PER_BATCH),
                    shaderInfo, blockSizes);
            }
        } else {
            auto iter = phaseLayouts.descriptorSets.find(UpdateFrequency::PER_BATCH);
            if (iter != phaseLayouts.descriptorSets.end()) {
                descriptorSets[static_cast<size_t>(UpdateFrequency::PER_BATCH)] = &iter->second.descriptorSetLayoutData;
                populateGroupedShaderInfo(
                    iter->second.descriptorSetLayoutData,
                    batchInfo, setIndex(UpdateFrequency::PER_BATCH),
                    shaderInfo, blockSizes);
            }
        }
    }
    { // instance
        const auto &instanceInfo = srcShaderInfo.descriptors.at(
            static_cast<uint32_t>(UpdateFrequency::PER_INSTANCE));
        if (programData) {
            if (fixedLocal) {
                fixedInstanceDescriptorSetLayout = &pipeline::localDescriptorSetLayout;
                populateLocalShaderInfo(
                    instanceInfo,
                    pipeline::localDescriptorSetLayout, shaderInfo, blockSizes);
            } else {
                auto iter = programData->layout.descriptorSets.find(
                    UpdateFrequency::PER_INSTANCE);
                if (iter != programData->layout.descriptorSets.end()) {
                    descriptorSets[static_cast<size_t>(UpdateFrequency::PER_INSTANCE)] = &iter->second.descriptorSetLayoutData;
                    populateMergedShaderInfo(
                        lg.valueNames, iter->second.descriptorSetLayoutData,
                        setIndex(UpdateFrequency::PER_INSTANCE),
                        shaderInfo, blockSizes);
                }
            }
        } else {
            auto iter = phaseLayouts.descriptorSets.find(UpdateFrequency::PER_INSTANCE);
            if (iter != phaseLayouts.descriptorSets.end()) {
                descriptorSets[static_cast<size_t>(UpdateFrequency::PER_INSTANCE)] = &iter->second.descriptorSetLayoutData;
                populateGroupedShaderInfo(
                    iter->second.descriptorSetLayoutData,
                    instanceInfo, setIndex(UpdateFrequency::PER_INSTANCE),
                    shaderInfo, blockSizes);
            }
        }
    }
    calculateFlattenedBinding(descriptorSets, fixedInstanceDescriptorSetLayout, shaderInfo);
    shaderInfo.stages.reserve(2);
    shaderInfo.stages.emplace_back(gfx::ShaderStage{gfx::ShaderStageFlagBit::VERTEX, ""});
    shaderInfo.stages.emplace_back(gfx::ShaderStage{gfx::ShaderStageFlagBit::FRAGMENT, ""});
}

std::pair<uint32_t, uint32_t> findBinding(
    const gfx::ShaderInfo &shaderInfo, std::string_view name) {
    for (const auto &v : shaderInfo.blocks) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    for (const auto &v : shaderInfo.buffers) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    for (const auto &v : shaderInfo.samplerTextures) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    for (const auto &v : shaderInfo.samplers) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    for (const auto &v : shaderInfo.textures) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    for (const auto &v : shaderInfo.images) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    for (const auto &v : shaderInfo.subpassInputs) {
        if (v.name == name) {
            return std::pair{v.set, v.binding};
        }
    }
    CC_EXPECTS(false);
    return {};
}

void overwriteShaderSourceBinding(
    const gfx::ShaderInfo &shaderInfo,
    ccstd::string &source,
    boost::container::pmr::memory_resource *scratch) {
    const char *keyWords[] = {
        " uniform ", " buffer "};

    for (auto &keyword : keyWords) {
        // find first uniform
        auto pos = source.find(keyword);
        while (pos != ccstd::string::npos) {
            // uniform statement is separated by ";{}";
            auto beg = source.find_last_of(";}", pos);
            auto end = source.find_first_of(";{", pos);
            if (beg == ccstd::string::npos) {
                // if separator is not found, start from 0
                beg = 0;
            } else {
                // bypass last separator
                beg += 1;
            }
            // uniform declaration is found
            CC_EXPECTS(beg != ccstd::string::npos);
            CC_EXPECTS(end != ccstd::string::npos);
            CC_ENSURES(end > beg);

            // find uniform name
            std::string_view name{};
            {
                std::string_view decl(source.c_str() + beg, end - beg);
                auto nameEnd = decl.size();
                for (; nameEnd-- > 0;) {
                    if (!std::isspace(decl[nameEnd])) {
                        break;
                    }
                }
                auto nameBeg = decl.find_last_of(' ', nameEnd);
                nameBeg += 1;
                nameEnd += 1;
                // uniform name found
                name = decl.substr(nameBeg, nameEnd - nameBeg);
            }
            CC_ENSURES(!name.empty());

            // layout
            std::ptrdiff_t offset = 0;
            {
                std::string_view prevLayout;
                // find layout expression
                auto layoutBeg = source.rfind("layout", pos);
                auto layoutEnd = ccstd::string::npos;
                if (layoutBeg == ccstd::string::npos || layoutBeg < beg) {
                    // layout not found
                    layoutBeg = ccstd::string::npos;
                    CC_ENSURES(layoutBeg == ccstd::string::npos);
                    CC_ENSURES(layoutEnd == ccstd::string::npos);
                } else {
                    CC_EXPECTS(layoutBeg >= beg && layoutBeg <= end);
                    layoutEnd = source.find(')', layoutBeg) + 1;
                    CC_EXPECTS(layoutEnd != ccstd::string::npos);
                    CC_ENSURES(layoutBeg < layoutEnd && layoutEnd <= end);
                    prevLayout = std::string_view(source.c_str() + layoutBeg, layoutEnd - layoutBeg);

                    // check layout expression is within uniform declaration
                    // prev layout expression is from layoutBeg to layoutEnd
                    CC_ENSURES(layoutBeg >= beg && layoutBeg <= end);
                    CC_ENSURES(layoutEnd >= layoutBeg && layoutEnd <= end);
                }

                // find uniform set and binding
                auto [set, binding] = findBinding(shaderInfo, name);

                // compose new layout expression
                ccstd::pmr::string newLayout(scratch);
                newLayout.reserve(32);
                newLayout.append("layout(set = ");
                newLayout.append(std::to_string(set));
                newLayout.append(", binding = ");
                newLayout.append(std::to_string(binding));

                auto inputIndex = prevLayout.find("input_attachment_index");
                if (inputIndex != ccstd::string::npos) {
                    newLayout.append(", ");
                    auto endIndex = prevLayout.find_first_of(",)", inputIndex + 1);
                    newLayout.append(prevLayout.data(), inputIndex, endIndex - inputIndex);
                }

                newLayout.append(")");

                // replace layout expression
                if (layoutBeg == ccstd::string::npos) { // layout not found
                    source.insert(pos, newLayout);
                    offset = static_cast<std::ptrdiff_t>(newLayout.size());
                } else {
                    // layout is found
                    source.erase(layoutBeg, prevLayout.size());
                    source.insert(layoutBeg, newLayout);
                    // calculate string difference
                    offset = static_cast<std::ptrdiff_t>(newLayout.size()) -
                             static_cast<std::ptrdiff_t>(prevLayout.size());
                }
            }
            // offset end of uniform declaration, offset is caused by modification of layout
            end += offset;
            // find next uniform
            pos = source.find(keyword, end);
        }
    }
}

void overwriteShaderProgramBinding(
    gfx::Device *device,
    const gfx::ShaderInfo &shaderInfo, IProgramInfo &programInfo,
    boost::container::pmr::memory_resource *scratch) {
    // get shader source to use
    IShaderSource *src = &programInfo.glsl3;
    const auto *deviceShaderVersion = getDeviceShaderVersion(device);
    if (deviceShaderVersion) {
        if (deviceShaderVersion != std::string_view{"glsl4"}) {
            return;
        }
        src = programInfo.getSource(deviceShaderVersion);
    } else {
        CC_LOG_ERROR("Invalid GFX API!");
    }
    CC_ENSURES(src);

    overwriteShaderSourceBinding(shaderInfo, src->vert, scratch);
    overwriteShaderSourceBinding(shaderInfo, src->frag, scratch);
    if (src->compute) {
        overwriteShaderSourceBinding(shaderInfo, src->compute.value(), scratch);
    }
}

// overwrite IProgramInfo using gfx.ShaderInfo
void overwriteProgramBlockInfo(
    gfx::Device *device,
    const gfx::ShaderInfo &shaderInfo, IProgramInfo &programInfo,
    boost::container::pmr::memory_resource *scratch) {
    overwriteShaderProgramBinding(device, shaderInfo, programInfo, scratch);

    constexpr auto set = setIndex(UpdateFrequency::PER_BATCH);
    for (auto &block : programInfo.blocks) {
        auto found = false;
        for (const auto &src : shaderInfo.blocks) {
            if (src.set != set) {
                continue;
            }
            if (src.name == block.name) {
                block.binding = src.binding;
                found = true;
                break;
            }
        }
        if (!found) {
            CC_LOG_ERROR("block not found in shaderInfo");
        }
    }
}

gfx::DescriptorSetLayout *getDescriptorSetLayout(
    const LayoutGraphData &lg,
    uint32_t subpassOrPassID, uint32_t phaseID, UpdateFrequency rate) { // NOLINT(bugprone-easily-swappable-parameters)
    if (rate < UpdateFrequency::PER_PASS) {
        const auto &phaseData = get(LayoutGraphData::LayoutTag{}, lg, phaseID);
        auto iter = phaseData.descriptorSets.find(rate);
        if (iter != phaseData.descriptorSets.end()) {
            const auto &data = iter->second;
            if (!data.descriptorSetLayout) {
                CC_LOG_ERROR("descriptor set layout not initialized");
                return nullptr;
            }
            return data.descriptorSetLayout;
        }
        return nullptr;
    }

    CC_EXPECTS(rate == UpdateFrequency::PER_PASS);
    CC_EXPECTS(subpassOrPassID == parent(phaseID, lg));

    const auto &passData = get(LayoutGraphData::LayoutTag{}, lg, subpassOrPassID);
    auto iter = passData.descriptorSets.find(rate);
    if (iter != passData.descriptorSets.end()) {
        const auto &data = iter->second;
        if (!data.descriptorSetLayout) {
            CC_LOG_ERROR("descriptor set layout not initialized");
            return nullptr;
        }
        return data.descriptorSetLayout;
    }
    return nullptr;
}

gfx::DescriptorSetLayout *getProgramDescriptorSetLayout(
    gfx::Device *device,
    LayoutGraphData &lg, uint32_t phaseID,
    const ccstd::string &programName, UpdateFrequency rate) {
    CC_EXPECTS(rate < UpdateFrequency::PER_PHASE);
    auto &phase = get(RenderPhaseTag{}, phaseID, lg);
    const auto iter = phase.shaderIndex.find(std::string_view{programName});
    if (iter == phase.shaderIndex.end()) {
        return nullptr;
    }
    const auto programID = iter->second;
    auto &programData = phase.shaderPrograms.at(programID);

    auto iter2 = programData.layout.descriptorSets.find(rate);
    if (iter2 == programData.layout.descriptorSets.end()) {
        return nullptr;
    }
    auto &layout = iter2->second;
    if (layout.descriptorSetLayout) {
        return layout.descriptorSetLayout;
    }
    layout.descriptorSetLayout = device->createDescriptorSetLayout(layout.descriptorSetLayoutInfo);
    return layout.descriptorSetLayout;
}

// get descriptor set from LayoutGraphData (not from ProgramData)
const gfx::DescriptorSetLayout &getOrCreateDescriptorSetLayout(
    const NativeProgramLibrary &lib,
    const LayoutGraphData &lg,
    uint32_t subpassOrPassID, uint32_t phaseID, UpdateFrequency rate) { // NOLINT(bugprone-easily-swappable-parameters)
    if (rate < UpdateFrequency::PER_PASS) {
        const auto &phaseData = get(LayoutGraphData::LayoutTag{}, lg, phaseID);
        auto iter = phaseData.descriptorSets.find(rate);
        if (iter != phaseData.descriptorSets.end()) {
            const auto &data = iter->second;
            if (!data.descriptorSetLayout) {
                CC_LOG_ERROR("descriptor set layout not initialized");
                return *lib.emptyDescriptorSetLayout;
            }
            return *data.descriptorSetLayout;
        }
        return *lib.emptyDescriptorSetLayout;
    }

    CC_EXPECTS(rate == UpdateFrequency::PER_PASS);
    CC_EXPECTS(subpassOrPassID == parent(phaseID, lg));

    const auto &passData = get(LayoutGraphData::LayoutTag{}, lg, subpassOrPassID);
    const auto iter = passData.descriptorSets.find(rate);
    if (iter != passData.descriptorSets.end()) {
        const auto &data = iter->second;
        if (!data.descriptorSetLayout) {
            CC_LOG_ERROR("descriptor set layout not initialized");
            return *lib.emptyDescriptorSetLayout;
        }
        return *data.descriptorSetLayout;
    }
    return *lib.emptyDescriptorSetLayout;
}

// get or create PerProgram gfx.DescriptorSetLayout
const gfx::DescriptorSetLayout &getOrCreateProgramDescriptorSetLayout(
    const NativeProgramLibrary &lib,
    gfx::Device *device,
    LayoutGraphData &lg, uint32_t phaseID,
    std::string_view programName, UpdateFrequency rate) {
    CC_EXPECTS(rate < UpdateFrequency::PER_PHASE);
    auto &phase = get(RenderPhaseTag{}, phaseID, lg);
    const auto iter = phase.shaderIndex.find(programName);
    if (iter == phase.shaderIndex.end()) {
        return *lib.emptyDescriptorSetLayout;
    }
    const auto programID = iter->second;
    auto &programData = phase.shaderPrograms.at(programID);
    const auto iter2 = programData.layout.descriptorSets.find(rate);
    if (iter2 == programData.layout.descriptorSets.end()) {
        return *lib.emptyDescriptorSetLayout;
    }
    auto &layout = iter2->second;
    if (layout.descriptorSetLayout) {
        return *layout.descriptorSetLayout;
    }
    layout.descriptorSetLayout = device->createDescriptorSetLayout(layout.descriptorSetLayoutInfo);
    return *layout.descriptorSetLayout;
}

void populatePipelineLayoutInfo(
    const NativeProgramLibrary &lib,
    const PipelineLayoutData &layout,
    UpdateFrequency rate,
    gfx::PipelineLayoutInfo &info) {
    auto iter = layout.descriptorSets.find(rate);
    if (iter != layout.descriptorSets.end()) {
        const auto &set = iter->second;
        CC_EXPECTS(set.descriptorSetLayout);
        info.setLayouts.emplace_back(set.descriptorSetLayout.get());
    } else {
        info.setLayouts.emplace_back(lib.emptyDescriptorSetLayout.get());
    }
}

template <typename T>
ccstd::hash_t getShaderHash(ccstd::hash_t src, const T &val) {
    if (src != gfx::INVALID_SHADER_HASH) {
        ccstd::hash_combine(src, val);
    }
    return src;
}

} // namespace

void NativeProgramLibrary::init(gfx::Device *deviceIn) {
    boost::container::pmr::memory_resource *scratch = &unsycPool;
    device = deviceIn;
    emptyDescriptorSetLayout = device->createDescriptorSetLayout({});
    emptyPipelineLayout = device->createPipelineLayout({});

    if (false) { // NOLINT(readability-simplify-boolean-expr)
        std::ostringstream oss;
        printLayoutGraphData(layoutGraph, oss, scratch);
        auto content = oss.str();
        std::istringstream iss(content);
        std::string line;
        while (std::getline(iss, line)) {
            CC_LOG_INFO(line.c_str());
        }
    }

    // update ubo
    // tips: for compatibility with old version, when maxVertexUniformVectors is 128, maxJoints = 30
    uint maxJoints = (device->getCapabilities().maxVertexUniformVectors - 38) / 3;
    maxJoints = maxJoints < 256 ? maxJoints : 256;
    pipeline::SkinningJointCapacity::jointUniformCapacity = maxJoints;
    pipeline::UBOSkinning::initLayout(maxJoints);

    // init layout graph
    auto &lg = layoutGraph;
    for (const auto v : makeRange(vertices(lg))) {
        auto &layout = get(LayoutGraphData::LayoutTag{}, lg, v);
        for (auto &&[update, set] : layout.descriptorSets) {
            if (set.descriptorSetLayout) {
                CC_LOG_WARNING("descriptor set layout already initialized. It will be overwritten");
            }
            initializeDescriptorSetLayoutInfo(
                set.descriptorSetLayoutData,
                set.descriptorSetLayoutInfo);
            set.descriptorSetLayout = device->createDescriptorSetLayout(set.descriptorSetLayoutInfo);
            CC_ENSURES(set.descriptorSetLayout);
            set.descriptorSet = device->createDescriptorSet(gfx::DescriptorSetInfo{set.descriptorSetLayout.get()});
            CC_ENSURES(set.descriptorSet);
        }
    }

    for (const auto v : makeRange(vertices(lg))) {
        if (!holds<RenderPhaseTag>(v, lg)) {
            continue;
        }
        const auto phaseID = v;
        const auto subpassOrPassID = parent(phaseID, lg);
        const auto &passLayout = get(LayoutGraphData::LayoutTag{}, lg, subpassOrPassID);
        const auto &phaseLayout = get(LayoutGraphData::LayoutTag{}, lg, phaseID);
        gfx::PipelineLayoutInfo info;
        populatePipelineLayoutInfo(*this, passLayout, UpdateFrequency::PER_PASS, info);
        populatePipelineLayoutInfo(*this, phaseLayout, UpdateFrequency::PER_PHASE, info);
        populatePipelineLayoutInfo(*this, phaseLayout, UpdateFrequency::PER_BATCH, info);
        populatePipelineLayoutInfo(*this, phaseLayout, UpdateFrequency::PER_INSTANCE, info);
        auto &phase = get(RenderPhaseTag{}, phaseID, lg);
        phase.pipelineLayout = device->createPipelineLayout(info);
    }

    // init local descriptor set
    {
        const auto &localSetLayout = pipeline::localDescriptorSetLayout;
        makeLocalDescriptorSetLayoutData(lg, localSetLayout, localLayoutData, scratch);
        gfx::DescriptorSetLayoutInfo info{};
        initializeDescriptorSetLayoutInfo(localLayoutData, info);
        localDescriptorSetLayout = device->createDescriptorSetLayout(info);
        CC_ENSURES(localDescriptorSetLayout);

        uint32_t numUniformBuffers = 0;
        for (const auto &block : localLayoutData.descriptorBlocks) {
            if (block.type != DescriptorTypeOrder::UNIFORM_BUFFER &&
                block.type != DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER) {
                continue;
            }
            for (const auto &d : block.descriptors) {
                numUniformBuffers += d.count;
            }
        }
        CC_ENSURES(numUniformBuffers == 7); // 7 is currently max uniform binding
    }

    // generate constant macros string
    generateConstantMacros(device, lg.constantMacros);
}

void NativeProgramLibrary::setPipeline(PipelineRuntime *pipelineIn) {
    pipeline = pipelineIn;
}

void NativeProgramLibrary::destroy() {
    emptyDescriptorSetLayout.reset();
    emptyPipelineLayout.reset();
}

void NativeProgramLibrary::addEffect(const EffectAsset *effectAssetIn) {
    auto &lg = layoutGraph;
    boost::container::pmr::memory_resource *scratch = &unsycPool;
    const auto &effect = *effectAssetIn;
    for (const auto &tech : effect._techniques) {
        for (const auto &pass : tech.passes) {
            const auto &programName = pass.program;
            const auto [passID, subpassID, phaseID, pShaderInfo, shaderID] =
                getEffectShader(lg, effect, pass);
            if (pShaderInfo == nullptr || validateShaderInfo(*pShaderInfo)) {
                CC_LOG_ERROR("program not found");
                continue;
            }
            const auto subpassOrPassID = subpassID == INVALID_ID ? passID : subpassID;
            const auto &srcShaderInfo = *pShaderInfo;
            CC_ENSURES(subpassOrPassID != INVALID_ID && phaseID != INVALID_ID);
            const auto &passLayout = get(LayoutGraphData::LayoutTag{}, lg, subpassOrPassID);
            const auto &phaseLayout = get(LayoutGraphData::LayoutTag{}, lg, phaseID);

            // programs
            auto iter = this->phases.find(phaseID);
            if (iter == this->phases.end()) {
                iter = this->phases.emplace(
                                       std::piecewise_construct,
                                       std::forward_as_tuple(phaseID),
                                       std::forward_as_tuple())
                           .first;
            }
            auto &phasePrograms = iter->second.programInfos;
            if (phasePrograms.find(std::string_view{srcShaderInfo.name}) != phasePrograms.end()) {
                continue;
            }
            auto alloc = phasePrograms.get_allocator();

            // build program
            auto programInfo = makeProgramInfo(effect._name, srcShaderInfo);

            // collect program descriptors
            ShaderProgramData *programData = nullptr;
            if (!mergeHighFrequency) {
                auto &phase = get(RenderPhaseTag{}, phaseID, lg);
                programData = &buildProgramData(programName, srcShaderInfo, lg, phase, fixedLocal, scratch);
            }

            // shaderInfo and blockSizes
            gfx::ShaderInfo shaderInfo;
            ccstd::vector<int32_t> blockSizes;
            makeShaderInfo(lg, passLayout, phaseLayout, srcShaderInfo, programData,
                           fixedLocal, shaderInfo, blockSizes);

            // overwrite programInfo
            overwriteProgramBlockInfo(device, shaderInfo, programInfo, scratch);

            // handle map
            auto handleMap = genHandles(shaderInfo);

            // attributes
            ccstd::pmr::vector<gfx::Attribute> attributes(alloc);
            for (const auto &attr : programInfo.attributes) {
                attributes.emplace_back(gfx::Attribute{
                    attr.name,
                    attr.format,
                    attr.isNormalized,
                    0,
                    attr.isInstanced,
                    attr.location,
                });
            }

            // create programInfo
            auto res = phasePrograms.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(srcShaderInfo.name),
                std::forward_as_tuple(
                    std::move(programInfo),
                    std::move(shaderInfo),
                    std::move(attributes),
                    std::move(blockSizes),
                    std::move(handleMap)));
            CC_ENSURES(res.second);
        }
    }
}

void NativeProgramLibrary::precompileEffect(gfx::Device *device, EffectAsset *effectAsset) {
    // noop
}

ccstd::string NativeProgramLibrary::getKey(
    uint32_t phaseID, const ccstd::string &programName,
    const MacroRecord &defines) const {
    auto iter = phases.find(phaseID);
    if (iter == phases.end()) {
        CC_LOG_ERROR("phase not found");
        return "";
    }
    const auto &phase = iter->second;
    auto iter2 = phase.programInfos.find(std::string_view{programName});
    if (iter2 == phase.programInfos.end()) {
        CC_LOG_ERROR("program not found");
        return "";
    }
    const auto &info = iter2->second;
    return getVariantKey(info.programInfo, defines);
}

IntrusivePtr<gfx::PipelineLayout> NativeProgramLibrary::getPipelineLayout(
    gfx::Device *device, uint32_t phaseID, const ccstd::string &programName) {
    if (mergeHighFrequency) {
        CC_EXPECTS(phaseID != LayoutGraphData::null_vertex());
        const auto &layout = get(RenderPhaseTag{}, phaseID, layoutGraph);
        return layout.pipelineLayout;
    }
    auto &lg = layoutGraph;
    auto &phase = get(RenderPhaseTag{}, phaseID, lg);
    const auto iter = phase.shaderIndex.find(std::string_view{programName});
    if (iter == phase.shaderIndex.end()) {
        return emptyPipelineLayout;
    }
    const auto programID = iter->second;
    auto &programData = phase.shaderPrograms.at(programID);
    if (programData.pipelineLayout) {
        return programData.pipelineLayout;
    }

    // get pass
    const auto subpassOrPassID = parent(phaseID, lg);
    if (subpassOrPassID == LayoutGraphData::null_vertex()) {
        return emptyPipelineLayout;
    }
    // create pipeline layout
    gfx::PipelineLayoutInfo info{};
    auto *passSet = getDescriptorSetLayout(lg, subpassOrPassID, phaseID, UpdateFrequency::PER_PASS);
    if (passSet) {
        info.setLayouts.emplace_back(passSet);
    }
    auto *batchSet = getProgramDescriptorSetLayout(
        device, lg, phaseID, programName, UpdateFrequency::PER_BATCH);
    if (batchSet) {
        info.setLayouts.emplace_back(batchSet);
    }
    auto *instanceSet = getProgramDescriptorSetLayout(
        device, lg, phaseID, programName, UpdateFrequency::PER_INSTANCE);
    if (instanceSet) {
        info.setLayouts.emplace_back(instanceSet);
    }
    auto *phaseSet = getDescriptorSetLayout(lg, subpassOrPassID, phaseID, UpdateFrequency::PER_PHASE);
    if (phaseSet) {
        info.setLayouts.emplace_back(phaseSet);
    }
    programData.pipelineLayout = device->createPipelineLayout(info);
    return programData.pipelineLayout;
}

const gfx::DescriptorSetLayout &NativeProgramLibrary::getMaterialDescriptorSetLayout(
    gfx::Device *device, uint32_t phaseID, const ccstd::string &programName) {
    if (mergeHighFrequency) {
        CC_EXPECTS(phaseID != LayoutGraphData::null_vertex());
        const auto subpassOrPassID = parent(phaseID, layoutGraph);
        return getOrCreateDescriptorSetLayout(
            *this, layoutGraph, subpassOrPassID, phaseID, UpdateFrequency::PER_BATCH);
    }
    return getOrCreateProgramDescriptorSetLayout(
        *this, device, layoutGraph, phaseID, programName, UpdateFrequency::PER_BATCH);
}

const gfx::DescriptorSetLayout &NativeProgramLibrary::getLocalDescriptorSetLayout(
    gfx::Device *device, uint32_t phaseID, const ccstd::string &programName) {
    if (mergeHighFrequency) {
        CC_EXPECTS(phaseID != LayoutGraphData::null_vertex());
        const auto subpassOrPassID = parent(phaseID, layoutGraph);
        return getOrCreateDescriptorSetLayout(
            *this, layoutGraph, subpassOrPassID, phaseID, UpdateFrequency::PER_INSTANCE);
    }
    if (fixedLocal) {
        return *localDescriptorSetLayout;
    }
    return getOrCreateProgramDescriptorSetLayout(
        *this, device, layoutGraph, phaseID, programName, UpdateFrequency::PER_INSTANCE);
}

const IProgramInfo &NativeProgramLibrary::getProgramInfo(
    uint32_t phaseID, const ccstd::string &programName) const {
    const auto &group = phases.at(phaseID);
    auto iter = group.programInfos.find(std::string_view{programName});
    if (iter != group.programInfos.end()) {
        return iter->second.programInfo;
    }
    throw std::invalid_argument("program not found");
}

const gfx::ShaderInfo &NativeProgramLibrary::getShaderInfo(
    uint32_t phaseID, const ccstd::string &programName) const {
    const auto &group = phases.at(phaseID);
    auto iter = group.programInfos.find(std::string_view{programName});
    if (iter != group.programInfos.end()) {
        return iter->second.shaderInfo;
    }
    throw std::invalid_argument("program not found");
}

ProgramProxy *NativeProgramLibrary::getProgramVariant(
    gfx::Device *device, uint32_t phaseID, const ccstd::string &name,
    MacroRecord &defines, const ccstd::pmr::string *key0) {
    if (pipeline) {
        for (const auto &it : pipeline->getMacros()) {
            defines[it.first] = it.second;
        }
    }

    auto iter = phases.find(phaseID);
    if (iter == phases.end()) {
        CC_LOG_ERROR("phase not found");
        return nullptr;
    }
    auto &phase = iter->second;
    auto iter2 = phase.programInfos.find(std::string_view{name});
    if (iter2 == phase.programInfos.end()) {
        CC_LOG_ERROR("program not found");
        return nullptr;
    }
    auto &info = iter2->second;

    const auto &programInfo = info.programInfo;

    std::string_view key;
    ccstd::string key1;

    if (key0 == nullptr) {
        key1 = getVariantKey(programInfo, defines);
        key = key1;
    } else {
        key = *key0;
    }

    auto iter3 = phase.programProxies.find(key);
    if (iter3 != phase.programProxies.end()) {
        return iter3->second.get();
    }

    // prepare defines
    ccstd::vector<IMacroInfo> macroArray = render::prepareDefines(defines, programInfo.defines);
    std::stringstream ss;
    ss << std::endl;
    for (const auto &m : macroArray) {
        ss << "#define " << m.name << " " << m.value << std::endl;
    }

    std::string prefix;
    prefix += layoutGraph.constantMacros;
    prefix += programInfo.constantMacros + ss.str();

    const IShaderSource *src = &programInfo.glsl3;
    const auto *deviceShaderVersion = getDeviceShaderVersion(device);
    if (deviceShaderVersion) {
        src = programInfo.getSource(deviceShaderVersion);
    } else {
        CC_LOG_ERROR("Invalid GFX API!");
    }

    if (src->compute) {
        info.shaderInfo.stages.clear();
        info.shaderInfo.stages.emplace_back(
            gfx::ShaderStage{
                gfx::ShaderStageFlagBit::COMPUTE,
                prefix + *src->compute});
    } else {
        info.shaderInfo.stages[0].source = prefix + src->vert;
        info.shaderInfo.stages[1].source = prefix + src->frag;
    }

    // strip out the active attributes only, instancing depend on this
    info.shaderInfo.attributes = getActiveAttributes(programInfo, info.attributes, defines);

    info.shaderInfo.name = getShaderInstanceName(name, macroArray);
    info.shaderInfo.hash = getShaderHash(programInfo.hash, prefix);

    IntrusivePtr<gfx::Shader> shader = device->createShader(info.shaderInfo);
    auto res = phase.programProxies.emplace(
        key,
        IntrusivePtr<ProgramProxy>(new NativeProgramProxy(std::move(shader))));
    CC_ENSURES(res.second);

    return res.first->second.get();
}

gfx::PipelineState *NativeProgramLibrary::getComputePipelineState(
    gfx::Device *device, uint32_t phaseID, const ccstd::string &name,
    MacroRecord &defines, const ccstd::pmr::string *key) {
    auto *program = getProgramVariant(device, phaseID, name, defines, key);
    auto *native = static_cast<NativeProgramProxy *>(program);
    CC_EXPECTS(native->shader->getStages().size() == 1);
    CC_EXPECTS(native->shader->getStages().at(0).stage == gfx::ShaderStageFlagBit::COMPUTE);

    if (native->pipelineState) {
        return native->pipelineState;
    }

    gfx::PipelineStateInfo info{
        native->shader.get(),
        getPipelineLayout(device, phaseID, name),
        nullptr,
        gfx::InputState{},
        gfx::RasterizerState{},
        gfx::DepthStencilState{},
        gfx::BlendState{},
        gfx::PrimitiveMode::TRIANGLE_LIST,
        gfx::DynamicStateFlagBit::NONE,
        gfx::PipelineBindPoint::COMPUTE,
        0,
    };
    native->pipelineState = device->createPipelineState(info);
    CC_ENSURES(native->pipelineState);
    return native->pipelineState.get();
}

const ccstd::vector<int> &NativeProgramLibrary::getBlockSizes(
    uint32_t phaseID, const ccstd::string &programName) const {
    CC_EXPECTS(phaseID != LayoutGraphData::null_vertex());
    const auto &group = phases.at(phaseID);
    auto iter = group.programInfos.find(std::string_view{programName});
    if (iter != group.programInfos.end()) {
        return iter->second.blockSizes;
    }
    throw std::invalid_argument("program not found");
}

const ccstd::unordered_map<ccstd::string, uint32_t> &NativeProgramLibrary::getHandleMap(
    uint32_t phaseID, const ccstd::string &programName) const {
    CC_EXPECTS(phaseID != LayoutGraphData::null_vertex());
    const auto &group = phases.at(phaseID);
    auto iter = group.programInfos.find(std::string_view{programName});
    if (iter != group.programInfos.end()) {
        return iter->second.handleMap;
    }
    throw std::invalid_argument("program not found");
}

uint32_t NativeProgramLibrary::getProgramID(
    uint32_t phaseID, const ccstd::pmr::string &programName) {
    CC_EXPECTS(phaseID != LayoutGraphData::null_vertex());
    const auto &phase = get(RenderPhaseTag{}, phaseID, layoutGraph);
    auto iter = phase.shaderIndex.find(programName);
    if (iter == phase.shaderIndex.end()) {
        CC_LOG_ERROR("program not found");
        return LayoutGraphData::null_vertex();
    }
    return iter->second;
}

uint32_t NativeProgramLibrary::getDescriptorNameID(const ccstd::pmr::string &name) {
    const auto iter = layoutGraph.attributeIndex.find(name);
    if (iter == layoutGraph.attributeIndex.end()) {
        CC_LOG_ERROR("descriptor name not found");
        return 0xFFFFFFFF;
    }
    return iter->second.value;
}

const ccstd::pmr::string &NativeProgramLibrary::getDescriptorName(uint32_t nameID) {
    return layoutGraph.valueNames.at(static_cast<size_t>(nameID));
}

} // namespace render

} // namespace cc
