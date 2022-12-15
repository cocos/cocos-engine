#include <stdexcept>
#include "NativePipelineTypes.h"

namespace cc {

namespace render {

void NativeProgramLibrary::addEffect(EffectAsset *effectAsset) {

}

void NativeProgramLibrary::precompileEffect(gfx::Device *device, EffectAsset *effectAsset) {

}

ccstd::pmr::string NativeProgramLibrary::getKey(uint32_t phaseID,
    const ccstd::pmr::string &programName, const MacroRecord &defines) const {
    std::ignore = phaseID;
    std::ignore = programName;
    std::ignore = defines;
    return {};
}

const gfx::PipelineLayout &NativeProgramLibrary::getPipelineLayout(gfx::Device *device,
    uint32_t phaseID, const ccstd::pmr::string &programName) const {
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

const IProgramInfo &NativeProgramLibrary::getProgramInfo(uint32_t phaseID,
    const ccstd::pmr::string &programName) const {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

const gfx::ShaderInfo &NativeProgramLibrary::getShaderInfo(uint32_t phaseID,
    const ccstd::pmr::string &programName) const {
    std::ignore = phaseID;
    std::ignore = programName;
    throw std::runtime_error("not implemented");
}

ProgramProxy *NativeProgramLibrary::getProgramVariant(gfx::Device *device,
    uint32_t phaseID, const ccstd::string &name, const MacroRecord &defines,
    const ccstd::pmr::string *key) const {
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

uint32_t NativeProgramLibrary::getProgramID(uint32_t phaseID,
    const ccstd::pmr::string &programName) {
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
