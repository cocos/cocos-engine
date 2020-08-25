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

    _gpuDescriptorSetLayout = CC_NEW(CCMTLGPUDescriptorSetLayout);

    for (size_t i = 0; i < _bindings.size(); i++) {
        const auto binding = _bindings[i];
        if (static_cast<uint>(binding.descriptorType) & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(i);
            }
        }
    }

    _gpuDescriptorSetLayout->bindings = _bindings;
    return true;
}

void CCMTLDescriptorSetLayout::destroy() {
    CC_SAFE_DELETE(_gpuDescriptorSetLayout);
}

}
}
