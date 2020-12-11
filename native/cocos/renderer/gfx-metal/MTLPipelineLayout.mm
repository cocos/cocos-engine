#include "MTLStd.h"

#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"
#include "MTLPipelineLayout.h"
namespace cc {
namespace gfx {

CCMTLPipelineLayout::CCMTLPipelineLayout(Device *device) : PipelineLayout(device) {
}

bool CCMTLPipelineLayout::initialize(const PipelineLayoutInfo &info) {
    _setLayouts = info.setLayouts;
    const auto setCount = _setLayouts.size();
    _gpuPipelineLayout = CC_NEW(CCMTLGPUPipelineLayout);
    _gpuPipelineLayout->dynamicOffsetIndices.resize(setCount);

    for (size_t i = 0; i < setCount; i++) {
        const auto setLayout = _setLayouts[i];
        CCASSERT(setLayout != nullptr, "SetLayout should not be nullptr.");
        auto gpuDescriptorSetLayout = static_cast<CCMTLDescriptorSetLayout *>(setLayout)->gpuDescriptorSetLayout();
        auto dynamicCount = gpuDescriptorSetLayout->dynamicBindings.size();
        auto &indices = _gpuPipelineLayout->dynamicOffsetIndices[i];
        indices.assign(setLayout->getBindingIndices().size(), -1);

        for (size_t j = 0; j < dynamicCount; j++) {
            auto binding = gpuDescriptorSetLayout->dynamicBindings[j];
            if (indices[binding] < 0) indices[binding] = j;
        }
        _gpuPipelineLayout->setLayouts.emplace_back(gpuDescriptorSetLayout);
    }

    return true;
}

void CCMTLPipelineLayout::destroy() {
    CC_SAFE_DELETE(_gpuPipelineLayout);
}

}
}
