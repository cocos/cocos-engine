#include "GLESPipelineLayout.h"
#include "GLESDescriptorSetLayout.h"

namespace cc::gfx {

GLESPipelineLayout::GLESPipelineLayout() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESPipelineLayout::~GLESPipelineLayout() {
    destroy();
}

void GLESPipelineLayout::doInit(const PipelineLayoutInfo & /*info*/) {
    _gpuPipelineLayout = ccnew GLESGPUPipelineLayout;
    _gpuPipelineLayout->setLayouts.reserve(_setLayouts.size());
    for (auto &layout : _setLayouts) {
        auto *setLayout = static_cast<GLESDescriptorSetLayout *>(layout)->gpuDescriptorSetLayout();
        _gpuPipelineLayout->setLayouts.emplace_back(setLayout);
        _gpuPipelineLayout->descriptorCount += setLayout->descriptorCount;
        ccstd::hash_combine(_gpuPipelineLayout->hash, setLayout->hash);
    }
}

void GLESPipelineLayout::doDestroy() {
    _gpuPipelineLayout = nullptr;
}

} // namespace cc::gfx
