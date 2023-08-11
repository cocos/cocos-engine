#include "GLESDescriptorSetLayout.h"
#include "GLESSampler.h"

namespace cc::gfx {

GLESDescriptorSetLayout::GLESDescriptorSetLayout() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESDescriptorSetLayout::~GLESDescriptorSetLayout() {
    destroy();
}

void GLESDescriptorSetLayout::doInit(const DescriptorSetLayoutInfo & /*info*/) {
    _gpuDescriptorSetLayout = ccnew GLESGPUDescriptorSetLayout;
    _gpuDescriptorSetLayout->bindings.reserve(_bindings.size());
    _gpuDescriptorSetLayout->descriptorCount = _descriptorCount;
    auto &hash = _gpuDescriptorSetLayout->hash;

    for (auto &binding : _bindings) {
        _gpuDescriptorSetLayout->bindings.emplace_back();
        auto &back = _gpuDescriptorSetLayout->bindings.back();
        back.binding = binding.binding;
        back.count   = binding.count;
        back.type    = binding.descriptorType;

        ccstd::hash_combine(hash, binding.binding);
        ccstd::hash_combine(hash, binding.descriptorType);
        ccstd::hash_combine(hash, binding.count);
        ccstd::hash_combine(hash, binding.stageFlags);
        for (auto &sampler : binding.immutableSamplers) {
            ccstd::hash_combine(hash, sampler->getHash());
        }
    }
}

void GLESDescriptorSetLayout::doDestroy() {
    _gpuDescriptorSetLayout = nullptr;
}
} // namespace cc::gfx
