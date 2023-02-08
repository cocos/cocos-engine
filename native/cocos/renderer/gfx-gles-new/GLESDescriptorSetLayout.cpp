#include "GLESDescriptorSetLayout.h"

namespace cc::gfx::gles {

DescriptorSetLayout::DescriptorSetLayout() {
    _typedID = generateObjectID<decltype(this)>();
}

DescriptorSetLayout::~DescriptorSetLayout() {
    destroy();
}

void DescriptorSetLayout::doInit(const DescriptorSetLayoutInfo &info) {
    std::ignore = info;
    _layout = ccnew GPUDescriptorSetLayout();
    _layout->bindings.reserve(_bindings.size());
    _layout->descriptorCount = _descriptorCount;

    uint32_t offset = 0;
    for (auto &binding : _bindings) {
        _layout->bindings.emplace_back();
        auto &back = _layout->bindings.back();
        back.binding = binding.binding;
        back.count   = binding.count;
        back.type    = binding.descriptorType;
        _layout->bindingMap.emplace(binding.binding, offset);
        offset += binding.count;
    }
}

void DescriptorSetLayout::doDestroy() {
    _layout = nullptr;
}


} // namespace cc::gfx::gles
