#include "MTLStd.h"

#include "MTLPipelineLayout.h"
#include "MTLGPUObjects.h"
#include "MTLDescriptorSetLayout.h"
namespace cc {
namespace gfx {

CCMTLPipelineLayout::CCMTLPipelineLayout(Device *device) : PipelineLayout(device) {
    
}
CCMTLPipelineLayout::~CCMTLPipelineLayout() {
    destroy();
}

bool CCMTLPipelineLayout::initialize(const PipelineLayoutInfo &info) {
    _setLayouts = info.setLayouts;

    _gpuPipelineLayout = CC_NEW(CCMTLGPUPipelineLayout);

    int offset = 0u;
    uint set = 0;
    _gpuPipelineLayout->dynamicOffsetIndices.resize(_setLayouts.size());
    for (auto setLayout : _setLayouts) {
        auto gpuDescriptorSetLayout = static_cast<CCMTLDescriptorSetLayout*>(setLayout)->gpuDescriptorSetLayout();
        auto bindingCount = gpuDescriptorSetLayout->bindings.size();
        auto dynamicCount = gpuDescriptorSetLayout->dynamicBindings.size();

        vector<int> &indices = _gpuPipelineLayout->dynamicOffsetIndices[set];
        indices.assign(bindingCount, -1);

        for (uint j = 0u; j < dynamicCount; j++) {
            uint binding = gpuDescriptorSetLayout->dynamicBindings[j];
            if (indices[binding] < 0) indices[binding] = offset + j; //TODO?
        }
        _gpuPipelineLayout->setLayouts.emplace_back(gpuDescriptorSetLayout);
        offset += dynamicCount;
    }

    _status = Status::SUCCESS;
    return true;
}

void CCMTLPipelineLayout::destroy() {
    
}
}
}
