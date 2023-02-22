#include "GLESDescriptorSet.h"
#include "GLESDescriptorSetLayout.h"

namespace cc::gfx::gles {
DescriptorSet::DescriptorSet() {
    _typedID = generateObjectID<decltype(this)>();
}

DescriptorSet::~DescriptorSet() {
    destroy();
}

void DescriptorSet::doInit(const DescriptorSetInfo &info) {
    _gpuSet = ccnew GPUDescriptorSet();

    auto *layout = static_cast<DescriptorSetLayout*>(info.layout);
    _gpuSet->descriptors.resize(layout->getDescriptorCount());

    const auto &bindings = layout->getBindings();
    auto bindingCount= bindings.size();

    for (size_t i = 0U, k = 0U; i < bindingCount; i++) {
        const DescriptorSetLayoutBinding &binding = bindings[i];
        for (uint32_t j = 0; j < binding.count; j++, k++) {
            _gpuSet->descriptors[k].type = binding.descriptorType;
        }
    }
}

void DescriptorSet::doDestroy() {
    _gpuSet = nullptr;
}

void DescriptorSet::update() {
    if (!_isDirty) {
        return;
    }

    for (size_t i = 0; i < _gpuSet->descriptors.size(); i++) {
        if (hasAnyFlags(_gpuSet->descriptors[i].type, DESCRIPTOR_BUFFER_TYPE)) {
            if (_buffers[i].ptr) {
                _gpuSet->descriptors[i].buffer = static_cast<Buffer *>(_buffers[i].ptr)->getGPUBufferView();
            }
        } else if (hasAnyFlags(_gpuSet->descriptors[i].type, DESCRIPTOR_TEXTURE_TYPE)) {
            if (_textures[i].ptr) {
                _gpuSet->descriptors[i].texture = static_cast<Texture *>(_textures[i].ptr)->getGPUTextureView();
            }
            if (_samplers[i].ptr) {
                _gpuSet->descriptors[i].sampler = static_cast<Sampler *>(_samplers[i].ptr)->getGPUSampler();
            }
        }
    }
    _isDirty = false;
}

void DescriptorSet::forceUpdate() {
    _isDirty = true;
    update();
}

} // namespace cc::gfx::gles