#include "MTLStd.h"

#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"

namespace cc {
namespace gfx {

CCMTLDescriptorSetLayout::CCMTLDescriptorSetLayout(Device *device) : DescriptorSetLayout(device) {
}

CCMTLDescriptorSetLayout::~CCMTLDescriptorSetLayout() {
    destroy();
}

bool CCMTLDescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {
    _bindings = info.bindings;
    const auto bindingCount = _bindings.size();
    _descriptorIndices.resize(bindingCount + 1);
    
    uint descriptorCount = 0;
    for(size_t i = 0; i < bindingCount; i++) {
        _descriptorIndices[i] = descriptorCount;
        descriptorCount += _bindings[i].count;
    }
    _descriptorIndices[bindingCount] = descriptorCount;
    
    _gpuDescriptorSetLayout = CC_NEW(CCMTLGPUDescriptorSetLayout);
    _gpuDescriptorSetLayout->descriptorCount = descriptorCount;
    _gpuDescriptorSetLayout->descriptorIndices = _descriptorIndices;
    _gpuDescriptorSetLayout->bindings = _bindings;
    
    for (size_t i = 0; i < bindingCount; i++) {
        const auto binding = _bindings[i];
        if (static_cast<uint>(binding.descriptorType) & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(i);
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
