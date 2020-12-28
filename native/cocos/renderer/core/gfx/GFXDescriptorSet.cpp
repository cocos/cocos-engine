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
    const vector<uint> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    if (binding >= bindingIndices.size() || bindingIndices[binding] >= bindings.size()) return;

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if ((uint)info.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
        const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
        if (_buffers[descriptorIndex + index] != buffer) {
            _buffers[descriptorIndex + index] = buffer;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_BUFFER_TYPE.");
    }
}

void DescriptorSet::bindTexture(uint binding, Texture *texture, uint index) {
    const vector<uint> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    if (binding >= bindingIndices.size() || bindingIndices[binding] >= bindings.size()) return;

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if ((uint)info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
        const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
        if (_textures[descriptorIndex + index] != texture) {
            _textures[descriptorIndex + index] = texture;
            _isDirty = true;
        }
    } else {
        CCASSERT(false, "Setting binding is not DESCRIPTOR_SAMPLER_TYPE.");
    }
}

void DescriptorSet::bindSampler(uint binding, Sampler *sampler, uint index) {
    const vector<uint> &bindingIndices = _layout->getBindingIndices();
    const DescriptorSetLayoutBindingList &bindings = _layout->getBindings();
    if (binding >= bindingIndices.size() || bindingIndices[binding] >= bindings.size()) return;

    const DescriptorSetLayoutBinding &info = bindings[bindingIndices[binding]];
    if ((uint)info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
        const uint descriptorIndex = _layout->getDescriptorIndices()[binding];
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

Buffer *DescriptorSet::getBuffer(uint binding, uint index) const {
    const vector<uint> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _buffers.size()) return nullptr;
    return _buffers[descriptorIndex];
}

Texture *DescriptorSet::getTexture(uint binding, uint index) const {
    const vector<uint> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _textures.size()) return nullptr;
    return _textures[descriptorIndex];
}

Sampler *DescriptorSet::getSampler(uint binding, uint index) const {
    const vector<uint> &descriptorIndices = _layout->getDescriptorIndices();
    if (binding >= descriptorIndices.size()) return nullptr;
    const uint descriptorIndex = descriptorIndices[binding] + index;
    if (descriptorIndex >= _samplers.size()) return nullptr;
    return _samplers[descriptorIndex];
}

} // namespace gfx
} // namespace cc
