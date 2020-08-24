#include "CoreStd.h"
#include "GFXDescriptorSet.h"
#include "GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

DescriptorSet::DescriptorSet(Device *device)
: GFXObject(ObjectType::DESCRIPTOR_SET), _device(device) {
}

DescriptorSet::~DescriptorSet() {
}

void DescriptorSet::bindBuffer(uint binding, Buffer *buffer) {
    const DescriptorSetLayoutBinding &descriptor = _layout->getBindings()[binding];
    if ((uint)descriptor.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
        if (_buffers[binding] != buffer) {
            _buffers[binding] = buffer;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not BindingType.UNIFORM_BUFFER.");
    }
}

void DescriptorSet::bindTexture(uint binding, Texture *texture) {
    const DescriptorSetLayoutBinding &descriptor = _layout->getBindings()[binding];
    if ((uint)descriptor.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
        if (_textures[binding] != texture) {
            _textures[binding] = texture;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not BindingType.UNIFORM_BUFFER.");
    }
}

void DescriptorSet::bindSampler(uint binding, Sampler *sampler) {
    const DescriptorSetLayoutBinding &descriptor = _layout->getBindings()[binding];
    if ((uint)descriptor.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
        if (_samplers[binding] != sampler) {
            _samplers[binding] = sampler;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not BindingType.UNIFORM_BUFFER.");
    }
}

} // namespace gfx
} // namespace cc
