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

#include <stdexcept>
#include "NativePipelineTypes.h"
#include "base/Log.h"
#include "core/assets/EffectAsset.h"
#include "pipeline/custom/LayoutGraphGraphs.h"
#include "pipeline/custom/LayoutGraphTypes.h"

namespace cc {

namespace render {

namespace {

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

} // namespace

void NativeProgramLibrary::addEffect(EffectAsset *effectAssetIn) {
    const auto &lg = layoutGraph;
    const auto &effect = *effectAssetIn;
    for (const auto &tech : effect._techniques) {
        for (const auto &pass : tech.passes) {
            const auto &programName = pass.program;
            const auto [passID, phaseID, srcShaderInfo, shaderID] =
                getEffectShader(lg, effect, pass);
            if (srcShaderInfo == nullptr || validateShaderInfo(*srcShaderInfo)) {
                CC_LOG_ERROR("program not found");
                continue;
            }
            CC_ENSURES(passID != INVALID_ID && phaseID != INVALID_ID);
            const auto &passLayout = get(LayoutGraphData::Layout, lg, passID);
            const auto &phaseLayout = get(LayoutGraphData::Layout, lg, phaseID);

            // auto iter =
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
