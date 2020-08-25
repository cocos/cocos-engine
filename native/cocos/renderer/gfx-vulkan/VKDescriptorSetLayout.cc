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

    _gpuDescriptorSetLayout = CC_NEW(CCVKGPUDescriptorSetLayout);

    for (uint i = 0u; i < _bindings.size(); i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        if ((uint)binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0u; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(i);
            }
        }
        _gpuDescriptorSetLayout->bindings.push_back(binding);
    }

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
