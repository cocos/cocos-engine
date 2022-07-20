#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "WGPUDef.h"
#include "WGPUDescriptorSetLayout.h"

namespace cc::gfx {

using ems::vecFromEMS;
using ems::vecToEMS;
using ::emscripten::allow_raw_pointers;
using ::emscripten::convertJSArrayToNumberVector;
using ::emscripten::val;

void CCWGPUDescriptorSetLayout::setEMSBindings(val bindings) {
    _bindings = std::move(vecFromEMS<gfx::DescriptorSetLayoutBinding, ems::DescriptorSetLayoutBinding>(bindings));
}

void CCWGPUDescriptorSetLayout::setEMSDynamicBindings(val bindings) {
    _dynamicBindings = std::move(vecFromEMS<uint32_t>(bindings));
}

void CCWGPUDescriptorSetLayout::setEMSBindingIndices(val bindingIndices) {
    _bindingIndices = std::move(vecFromEMS<uint32_t>(bindingIndices));
}

void CCWGPUDescriptorSetLayout::setEMSDescriptorIndices(val descriptorIndices) {
    _descriptorIndices = std::move(vecFromEMS<uint32_t>(descriptorIndices));
}

val CCWGPUDescriptorSetLayout::getEMSBindings() const {
    return vecToEMS<gfx::DescriptorSetLayoutBinding, ems::DescriptorSetLayoutBinding>(_bindings);
}

val CCWGPUDescriptorSetLayout::getEMSDynamicBindings() const {
    return vecToEMS<uint32_t>(_dynamicBindings);
}

val CCWGPUDescriptorSetLayout::getEMSBindingIndices() const {
    return vecToEMS<uint32_t>(_bindingIndices);
}

val CCWGPUDescriptorSetLayout::getEMSDescriptorIndices() const {
    return vecToEMS<uint32_t>(_descriptorIndices);
}

} // namespace cc::gfx