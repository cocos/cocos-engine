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

    _gpuDescriptorSetLayout = CC_NEW(GLES2GPUDescriptorSetLayout);

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

void GLES2DescriptorSetLayout::destroy() {
    if (_gpuDescriptorSetLayout) {
        CC_DELETE(_gpuDescriptorSetLayout);
        _gpuDescriptorSetLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
