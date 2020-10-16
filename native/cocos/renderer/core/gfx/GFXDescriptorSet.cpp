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

void DescriptorSet::bindBuffer(uint binding, Buffer *buffer, uint index) {
    if (!_layout->getBindings().size()) return;

    const DescriptorSetLayoutBinding &info = _layout->getBindings()[binding];
    const uint descriptorIndex = _layout->getDescriptorIndices()[binding];

    if ((uint)info.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
        if (_buffers[descriptorIndex + index] != buffer) {
            _buffers[descriptorIndex + index] = buffer;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_BUFFER_TYPE.");
    }
}

void DescriptorSet::bindTexture(uint binding, Texture *texture, uint index) {
    if (!_layout->getBindings().size()) return;

    const DescriptorSetLayoutBinding &info = _layout->getBindings()[binding];
    const uint descriptorIndex = _layout->getDescriptorIndices()[binding];

    if ((uint)info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
        if (_textures[descriptorIndex + index] != texture) {
            _textures[descriptorIndex + index] = texture;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_SAMPLER_TYPE.");
    }
}

void DescriptorSet::bindSampler(uint binding, Sampler *sampler, uint index) {
    if (!_layout->getBindings().size()) return;

    const DescriptorSetLayoutBinding &info = _layout->getBindings()[binding];
    const uint descriptorIndex = _layout->getDescriptorIndices()[binding];

    if ((uint)info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
        if (_samplers[descriptorIndex + index] != sampler) {
            _samplers[descriptorIndex + index] = sampler;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_SAMPLER_TYPE.");
    }
}

bool DescriptorSet::bindBufferJSB(uint binding, Buffer *buffer, uint index) {
    bindBuffer(binding, buffer, index);
    return _isDirty;
}

bool DescriptorSet::bindTextureJSB(uint binding, Texture *texture, uint index) {
    bindTexture(binding, texture, index);
    return _isDirty;
}

bool DescriptorSet::bindSamplerJSB(uint binding, Sampler *sampler, uint index) {
    bindSampler(binding, sampler, index);
    return _isDirty;
}

Buffer* DescriptorSet::getBuffer(uint binding, uint index) const {
    const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
    return _buffers[descriptorIndex + index];
}

Texture *DescriptorSet::getTexture(uint binding, uint index) const {
    const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
    return _textures[descriptorIndex + index];
}

Sampler *DescriptorSet::getSampler(uint binding, uint index) const {
    const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
    return _samplers[descriptorIndex + index];
}

} // namespace gfx
} // namespace cc
