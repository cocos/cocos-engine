#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3DescriptorSetLayout.h"
#include "GLES3PipelineLayout.h"

namespace cc {
namespace gfx {

GLES3PipelineLayout::GLES3PipelineLayout(Device *device)
: PipelineLayout(device) {
}

GLES3PipelineLayout::~GLES3PipelineLayout() {
}

bool GLES3PipelineLayout::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    _gpuPipelineLayout = CC_NEW(GLES3GPUPipelineLayout);

    uint offset = 0u;
    _gpuPipelineLayout->dynamicOffsetIndices.resize(_setLayouts.size());
    for (uint i = 0u; i < _setLayouts.size(); i++) {
        DescriptorSetLayout *setLayout = _setLayouts[i];
        CCASSERT(setLayout != nullptr, "SetLayout should not be nullptr.");
        GLES3GPUDescriptorSetLayout *gpuSetLayout = ((GLES3DescriptorSetLayout *)setLayout)->gpuDescriptorSetLayout();
        size_t dynamicCount = gpuSetLayout->dynamicBindings.size();
        vector<int> &indices = _gpuPipelineLayout->dynamicOffsetIndices[i];
        indices.assign(setLayout->getBindingIndices().size(), -1);

        for (uint j = 0u; j < dynamicCount; j++) {
            uint binding = gpuSetLayout->dynamicBindings[j];
            if (indices[binding] < 0) indices[binding] = offset + j;
        }
        _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
        _gpuPipelineLayout->setLayouts.push_back(gpuSetLayout);
        offset += dynamicCount;
    }
    _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
    _gpuPipelineLayout->dynamicOffsetCount = offset;
    _gpuPipelineLayout->dynamicOffsets.resize(offset);

    return true;
}

void GLES3PipelineLayout::destroy() {

    if (_gpuPipelineLayout) {
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
