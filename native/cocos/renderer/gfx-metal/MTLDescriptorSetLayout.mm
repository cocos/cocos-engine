#include "MTLStd.h"

#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"

namespace cc {
namespace gfx {

CCMTLDescriptorSetLayout::CCMTLDescriptorSetLayout(Device *device) : DescriptorSetLayout(device) {
}

bool CCMTLDescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {
    _bindings = info.bindings;
    const auto bindingCount = _bindings.size();
    _descriptorCount = 0;

    if (bindingCount) {
        uint maxBinding = 0;
        vector<uint> flattenedIndices(bindingCount);
        for (auto i = 0; i < bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            flattenedIndices[i] = _descriptorCount;
            _descriptorCount += binding.count;
            if (binding.binding > maxBinding) maxBinding = binding.binding;
        }

        _bindingIndices.resize(maxBinding + 1, GFX_INVALID_BINDING);
        _descriptorIndices.resize(maxBinding + 1, GFX_INVALID_BINDING);
        for (uint i = 0u; i < bindingCount; i++) {
            const DescriptorSetLayoutBinding &binding = _bindings[i];
            _bindingIndices[binding.binding] = i;
            _descriptorIndices[binding.binding] = flattenedIndices[i];
        }
    }

    _gpuDescriptorSetLayout = CC_NEW(CCMTLGPUDescriptorSetLayout);
    _gpuDescriptorSetLayout->descriptorCount = _descriptorCount;
    _gpuDescriptorSetLayout->descriptorIndices = _descriptorIndices;
    _gpuDescriptorSetLayout->bindingIndices = _bindingIndices;
    _gpuDescriptorSetLayout->bindings = _bindings;

    for (size_t i = 0; i < bindingCount; i++) {
        const auto binding = _bindings[i];
        if (static_cast<uint>(binding.descriptorType) & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(binding.binding);
            }
        }
    }
    return true;
}

void CCMTLDescriptorSetLayout::destroy() {
    CC_SAFE_DELETE(_gpuDescriptorSetLayout);
}

}
}
