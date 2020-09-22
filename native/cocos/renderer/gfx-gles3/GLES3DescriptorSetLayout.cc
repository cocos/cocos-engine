#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3DescriptorSetLayout.h"

namespace cc {
namespace gfx {

GLES3DescriptorSetLayout::GLES3DescriptorSetLayout(Device *device)
: DescriptorSetLayout(device) {
}

GLES3DescriptorSetLayout::~GLES3DescriptorSetLayout() {
}

bool GLES3DescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {

    _bindings = info.bindings;
    size_t bindingCount = _bindings.size();
    _descriptorIndices.resize(bindingCount + 1);

    uint descriptorCount = 0u;
    for (uint i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        _descriptorIndices[i] = descriptorCount;
        descriptorCount += binding.count;
    }
    _descriptorIndices[bindingCount] = descriptorCount;

    _gpuDescriptorSetLayout = CC_NEW(GLES3GPUDescriptorSetLayout);
    _gpuDescriptorSetLayout->descriptorCount = descriptorCount;
    _gpuDescriptorSetLayout->descriptorIndices = _descriptorIndices;
    _gpuDescriptorSetLayout->bindings = _bindings;

    for (uint i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        if ((uint)binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0u; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(i);
            }
        }
    }
    return true;
}

void GLES3DescriptorSetLayout::destroy() {
    if (_gpuDescriptorSetLayout) {
        CC_DELETE(_gpuDescriptorSetLayout);
        _gpuDescriptorSetLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
