#include "GLESPipelineLayout.h"

namespace cc::gfx::gles {

PipelineLayout::PipelineLayout() {
    _typedID = generateObjectID<decltype(this)>();
}

PipelineLayout::~PipelineLayout() {
    destroy();
}

void PipelineLayout::doInit(const PipelineLayoutInfo &info) {
    std::ignore = info;
    _layout = ccnew GPUPipelineLayout();
    _layout->setLayouts.reserve(_setLayouts.size());
    for (auto &layout : _setLayouts) {
        _layout->setLayouts.emplace_back(static_cast<DescriptorSetLayout *>(layout)->getGPUDescriptorSetLayout());
    }
}

void PipelineLayout::doDestroy() {
    _layout = nullptr;
}


} // namespace cc::gfx::gles
