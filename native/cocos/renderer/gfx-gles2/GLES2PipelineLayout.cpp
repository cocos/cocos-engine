#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2DescriptorSetLayout.h"
#include "GLES2PipelineLayout.h"

namespace cc {
namespace gfx {

GLES2PipelineLayout::GLES2PipelineLayout(Device *device)
: PipelineLayout(device) {
}

GLES2PipelineLayout::~GLES2PipelineLayout() {
}

bool GLES2PipelineLayout::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    _gpuPipelineLayout = CC_NEW(GLES2GPUPipelineLayout);

    uint offset = 0u;
    _gpuPipelineLayout->dynamicOffsetIndices.resize(_setLayouts.size());
    for (uint i = 0u; i < _setLayouts.size(); i++) {
        DescriptorSetLayout *setLayout = _setLayouts[i];
        CCASSERT(setLayout != nullptr, "SetLayout should not be nullptr.");
        GLES2GPUDescriptorSetLayout *gpuSetLayout = ((GLES2DescriptorSetLayout *)setLayout)->gpuDescriptorSetLayout();
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

void GLES2PipelineLayout::destroy() {

    if (_gpuPipelineLayout) {
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
