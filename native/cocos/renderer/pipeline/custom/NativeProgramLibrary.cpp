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

#include <boost/container/pmr/memory_resource.hpp>
#include <stdexcept>
#include <tuple>
#include <utility>
#include "LayoutGraphUtils.h"
#include "NativePipelineTypes.h"
#include "ProgramLib.h"
#include "ProgramUtils.h"
#include "cocos/base/Log.h"
#include "cocos/core/assets/EffectAsset.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"

namespace cc {

namespace render {

namespace {

constexpr uint32_t SET_INDEX[4] = {2, 1, 3, 0};

constexpr uint32_t setIndex(UpdateFrequency rate) {
    return SET_INDEX[static_cast<uint32_t>(rate)];
}

constexpr auto INVALID_ID = LayoutGraphData::null_vertex();

std::tuple<uint32_t, uint32_t, const IShaderInfo *, uint32_t>
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
        return {INVALID_ID, INVALID_ID, nullptr, INVALID_ID};
    }

    auto phaseID = INVALID_ID;
    if (pass.phase) {
        phaseID = locate(passID, *pass.phase, lg);
    } else {
        phaseID = locate(passID, "default", lg);
    }
    if (phaseID == INVALID_ID) {
        CC_LOG_ERROR("Invalid render phase");
        return {INVALID_ID, INVALID_ID, nullptr, INVALID_ID};
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
    return {passID, phaseID, srcShaderInfo, shaderID};
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

std::tuple<std::string_view, gfx::Type> getDescriptorNameAndType(
    const pipeline::DescriptorSetLayoutInfos &source,
    uint32_t binding) {
    for (const auto &[name, block] : source.blocks) {
        if (block.binding == binding) {
            return {name, gfx::Type::UNKNOWN};
        }
    }
    for (const auto &[name, texture] : source.samplers) {
        if (texture.binding == binding) {
            return {name, texture.type};
        }
    }
    for (const auto &[name, image] : source.storeImages) {
        if (image.binding == binding) {
            return {name, image.type};
        }
    }
    return {"", gfx::Type::UNKNOWN};
}

void makeLocalDescriptorSetLayoutData(
    LayoutGraphData &lg,
    const pipeline::DescriptorSetLayoutInfos &source,
    DescriptorSetLayoutData &data) {
    for (const auto &b : source.bindings) {
        const auto [name, type] = getDescriptorNameAndType(source, b.binding);
        const auto nameID = getOrCreateDescriptorID(lg, name);
        const auto order = getDescriptorTypeOrder(b.descriptorType);
        {
            auto &block = data.descriptorBlocks.emplace_back(order, b.stageFlags, b.count);
            block.offset = b.binding;
            block.descriptors.emplace_back(nameID, type, b.count);
        }
        {
            auto iter = data.bindingMap.find(nameID);
            if (iter != data.bindingMap.end()) {
                CC_LOG_ERROR("Duplicate descriptor name: %s", name.data());
            }
            data.bindingMap.emplace(nameID, b.binding);
        }
        const auto &v = source.blocks.at(ccstd::string(name));
        data.uniformBlocks.emplace(nameID, v);
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
        makeLocalDescriptorSetLayoutData(lg, pipeline::localDescriptorSetLayout, perInstance);
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
    gfx::ShaderInfo &shaderInfo, ccstd::pmr::vector<uint32_t> &blockSizes) {
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
                    blockSizes.emplace_back(getSize(uniformBlock.members));
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
    ccstd::pmr::vector<uint32_t> &blockSizes) {
    for (const auto &descriptorBlock : layout.descriptorBlocks) {
        const auto visibility = descriptorBlock.visibility;
        auto binding = descriptorBlock.offset;

        switch (descriptorBlock.type) {
            case DescriptorTypeOrder::UNIFORM_BUFFER:
                for (const auto &block : descriptorInfo.blocks) {
                    if (block.stageFlags != visibility) {
                        continue;
                    }
                    blockSizes.emplace_back(getSize(block.members));
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
    gfx::ShaderInfo &shaderInfo, ccstd::pmr::vector<uint32_t> &blockSizes) {
    const auto set = setIndex(UpdateFrequency::PER_INSTANCE);
    for (auto i = 0; i < target.blocks.size(); i++) {
        const auto &block = target.blocks[i];
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

        // const auto &binding = *pBinding;
        // blockSizes.push(getSize(block.members));
        // shaderInfo.blocks.push(new UniformBlock(set, binding.binding, block.name,
        //                                         block.members.map((m) = > new Uniform(m.name, m.type, m.count)), 1)); // effect compiler guarantees block count = 1
    }
    // for (let i = 0; i < target.samplerTextures.length; i++) {
    //     const samplerTexture = target.samplerTextures[i];
    //     const info = source.layouts[samplerTexture.name] as UniformSamplerTexture;
    //     const binding = info && source.bindings.find((bd) = > bd.binding == = info.binding);
    //     if (!info || !binding || !(binding.descriptorType & DESCRIPTOR_SAMPLER_TYPE)) {
    //         console.warn(`builtin samplerTexture '${samplerTexture.name}' not available !`);
    //         continue;
    //     }
    //     shaderInfo.samplerTextures.push(new UniformSamplerTexture(
    //         set, binding.binding, samplerTexture.name, samplerTexture.type, samplerTexture.count, ));
    // }
}

void makeShaderInfo(
    LayoutGraphData &lg,
    const PipelineLayoutData &passLayouts, // NOLINT(bugprone-easily-swappable-parameters)
    const PipelineLayoutData &phaseLayouts,
    const IShaderInfo &srcShaderInfo,
    const ShaderProgramData *programData,
    bool fixedLocal,
    gfx::ShaderInfo &shaderInfo,
    ccstd::pmr::vector<uint32_t> &blockSizes) {
    { // pass
        auto iter = passLayouts.descriptorSets.find(UpdateFrequency::PER_PASS);
        if (iter != passLayouts.descriptorSets.end()) {
            populateMergedShaderInfo(
                lg.valueNames, iter->second.descriptorSetLayoutData,
                setIndex(UpdateFrequency::PER_PASS),
                shaderInfo, blockSizes);
        }
    }
    { // phase
        auto iter = phaseLayouts.descriptorSets.find(UpdateFrequency::PER_PHASE);
        if (iter != passLayouts.descriptorSets.end()) {
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
                populateMergedShaderInfo(
                    lg.valueNames, iter->second.descriptorSetLayoutData,
                    setIndex(UpdateFrequency::PER_BATCH),
                    shaderInfo, blockSizes);
            }
        } else {
            auto iter = phaseLayouts.descriptorSets.find(UpdateFrequency::PER_BATCH);
            if (iter != phaseLayouts.descriptorSets.end()) {
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
                populateLocalShaderInfo(
                    instanceInfo,
                    pipeline::localDescriptorSetLayout, shaderInfo, blockSizes);
            } else {
                auto iter = programData->layout.descriptorSets.find(
                    UpdateFrequency::PER_INSTANCE);
                if (iter != programData->layout.descriptorSets.end()) {
                    populateMergedShaderInfo(
                        lg.valueNames, iter->second.descriptorSetLayoutData,
                        setIndex(UpdateFrequency::PER_INSTANCE),
                        shaderInfo, blockSizes);
                }
            }
        } else {
            auto iter = phaseLayouts.descriptorSets.find(UpdateFrequency::PER_INSTANCE);
            if (iter != phaseLayouts.descriptorSets.end()) {
                populateGroupedShaderInfo(
                    iter->second.descriptorSetLayoutData,
                    instanceInfo, setIndex(UpdateFrequency::PER_INSTANCE),
                    shaderInfo, blockSizes);
            }
        }
    }
}

} // namespace

void NativeProgramLibrary::addEffect(EffectAsset *effectAssetIn) {
    auto &lg = layoutGraph;
    boost::container::pmr::memory_resource *scratch = &unsycPool;
    const auto &effect = *effectAssetIn;
    for (const auto &tech : effect._techniques) {
        for (const auto &pass : tech.passes) {
            const auto &programName = pass.program;
            const auto [passID, phaseID, pShaderInfo, shaderID] =
                getEffectShader(lg, effect, pass);
            if (pShaderInfo == nullptr || validateShaderInfo(*pShaderInfo)) {
                CC_LOG_ERROR("program not found");
                continue;
            }
            const auto &srcShaderInfo = *pShaderInfo;
            CC_ENSURES(passID != INVALID_ID && phaseID != INVALID_ID);
            const auto &passLayout = get(LayoutGraphData::Layout, lg, passID);
            const auto &phaseLayout = get(LayoutGraphData::Layout, lg, phaseID);

            // programs
            auto iter = this->phases.find(phaseID);
            if (iter == this->phases.end()) {
                iter = this->phases.emplace(std::piecewise_construct,
                                            std::forward_as_tuple(phaseID),
                                            std::forward_as_tuple())
                           .first;
            }
            const auto &phasePrograms = iter->second.programInfos;

            // build program
            auto programInfo = makeProgramInfo(effect._name, srcShaderInfo);

            // collect program descriptors
            ShaderProgramData *programData = nullptr;
            if (!mergeHighFrequency) {
                auto &phase = get(RenderPhaseTag{}, phaseID, lg);
                buildProgramData(programName, srcShaderInfo, lg, phase, fixedLocal, scratch);
            }

            // shaderInfo and blockSizes
        }
    }
}

void NativeProgramLibrary::precompileEffect(gfx::Device *device, EffectAsset *effectAsset) {
}

ccstd::pmr::string NativeProgramLibrary::getKey(
    uint32_t phaseID, const ccstd::pmr::string &programName,
    const MacroRecord &defines) const {
    std::ignore = phaseID;
    std::ignore = programName;
    std::ignore = defines;
    return {};
}

const gfx::PipelineLayout &NativeProgramLibrary::getPipelineLayout(
    gfx::Device *device, uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = device;
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

const gfx::DescriptorSetLayout &NativeProgramLibrary::getMaterialDescriptorSetLayout(
    gfx::Device *device, uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = device;
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

const gfx::DescriptorSetLayout &NativeProgramLibrary::getLocalDescriptorSetLayout(
    gfx::Device *device, uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = device;
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

const IProgramInfo &NativeProgramLibrary::getProgramInfo(
    uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

const gfx::ShaderInfo &NativeProgramLibrary::getShaderInfo(
    uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

ProgramProxy *NativeProgramLibrary::getProgramVariant(
    gfx::Device *device, uint32_t phaseID, const ccstd::string &name,
    const MacroRecord &defines, const ccstd::pmr::string *key) const {
    std::ignore = device;
    std::ignore = phaseID;
    std::ignore = name;
    std::ignore = defines;
    std::ignore = key;
    return nullptr;
}

const ccstd::pmr::vector<unsigned> &NativeProgramLibrary::getBlockSizes(
    uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

const Record<ccstd::string, uint32_t> &NativeProgramLibrary::getHandleMap(
    uint32_t phaseID, const ccstd::pmr::string &programName) const {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

uint32_t NativeProgramLibrary::getProgramID(
    uint32_t phaseID, const ccstd::pmr::string &programName) {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

uint32_t NativeProgramLibrary::getDescriptorNameID(const ccstd::pmr::string &name) {
    std::ignore = name;
    return 0xFFFFFFFF;
}

const ccstd::pmr::string &NativeProgramLibrary::getDescriptorName(uint32_t nameID) {
    std::ignore = nameID;
    throw std::runtime_error("not implemented");
}

} // namespace render

} // namespace cc
