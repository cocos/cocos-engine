#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2DescriptorSetLayout.h"

namespace cc {
namespace gfx {

GLES2DescriptorSetLayout::GLES2DescriptorSetLayout(Device *device)
: DescriptorSetLayout(device) {
}

GLES2DescriptorSetLayout::~GLES2DescriptorSetLayout() {
}

bool GLES2DescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {

    _bindings = info.bindings;
    uint bindingCount = _bindings.size();
    _descriptorIndices.resize(bindingCount + 1);

    uint descriptorCount = 0u;
    for (uint i = 0u; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        _descriptorIndices[i] = descriptorCount;
        descriptorCount += binding.count;
    }
    _descriptorIndices[bindingCount] = descriptorCount;

    _gpuDescriptorSetLayout = CC_NEW(GLES2GPUDescriptorSetLayout);
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
    _gpuDescriptorSetLayout->bindings = _bindings;
    return true;
}

void GLES2DescriptorSetLayout::destroy() {
    if (_gpuDescriptorSetLayout) {
        CC_DELETE(_gpuDescriptorSetLayout);
        _gpuDescriptorSetLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
