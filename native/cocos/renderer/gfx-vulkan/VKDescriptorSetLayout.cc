#include "VKStd.h"

#include "VKCommands.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKDescriptorSetLayout::CCVKDescriptorSetLayout(Device *device)
: DescriptorSetLayout(device) {
}

CCVKDescriptorSetLayout::~CCVKDescriptorSetLayout() {
}

bool CCVKDescriptorSetLayout::initialize(const DescriptorSetLayoutInfo &info) {

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

    _gpuDescriptorSetLayout = CC_NEW(CCVKGPUDescriptorSetLayout);
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
    CCVKCmdFuncCreateDescriptorSetLayout((CCVKDevice *)_device, _gpuDescriptorSetLayout);

    return true;
}

void CCVKDescriptorSetLayout::destroy() {
    if (_gpuDescriptorSetLayout) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuDescriptorSetLayout);
        _gpuDescriptorSetLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
