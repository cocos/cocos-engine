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
    _descriptorCount = 0u;

    if (bindingCount) {
        uint maxBinding = 0u;
        vector<uint> flattenedIndices(bindingCount);
        for (uint i = 0u; i < bindingCount; i++) {
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

    _gpuDescriptorSetLayout = CC_NEW(GLES3GPUDescriptorSetLayout);
    _gpuDescriptorSetLayout->descriptorCount = _descriptorCount;
    _gpuDescriptorSetLayout->bindingIndices = _bindingIndices;
    _gpuDescriptorSetLayout->descriptorIndices = _descriptorIndices;
    _gpuDescriptorSetLayout->bindings = _bindings;

    for (uint i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        if ((uint)binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0u; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(binding.binding);
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
