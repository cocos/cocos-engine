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

    _gpuDescriptorSetLayout = CC_NEW(GLES3GPUDescriptorSetLayout);

    for (uint i = 0u; i < _bindings.size(); i++) {
        const DescriptorSetLayoutBinding &binding = _bindings[i];
        if ((uint)binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
            for (uint j = 0u; j < binding.count; j++) {
                _gpuDescriptorSetLayout->dynamicBindings.push_back(i);
            }
        }
        _gpuDescriptorSetLayout->bindings.push_back(binding);
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
