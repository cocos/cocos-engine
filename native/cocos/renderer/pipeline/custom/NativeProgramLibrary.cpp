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
