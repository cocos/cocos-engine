#include "VKStd.h"

#include "VKCommands.h"
#include "VKDescriptorSetLayout.h"
#include "VKDevice.h"
#include "VKPipelineLayout.h"

namespace cc {
namespace gfx {

CCVKPipelineLayout::CCVKPipelineLayout(Device *device)
: PipelineLayout(device) {
}

CCVKPipelineLayout::~CCVKPipelineLayout() {
}

bool CCVKPipelineLayout::initialize(const PipelineLayoutInfo &info) {

    _setLayouts = info.setLayouts;

    _gpuPipelineLayout = CC_NEW(CCVKGPUPipelineLayout);

    int offset = 0u;
    for (uint i = 0u; i < _setLayouts.size(); i++) {
        DescriptorSetLayout *setLayout = _setLayouts[i];
        CCASSERT(setLayout != nullptr, "SetLayout should not be nullptr.");
        CCVKGPUDescriptorSetLayout *gpuSetLayout = ((CCVKDescriptorSetLayout *)setLayout)->gpuDescriptorSetLayout();
        size_t dynamicCount = gpuSetLayout->dynamicBindings.size();
        _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
        _gpuPipelineLayout->setLayouts.push_back(gpuSetLayout);
        offset += dynamicCount;
    }
    _gpuPipelineLayout->dynamicOffsetOffsets.push_back(offset);
    _gpuPipelineLayout->dynamicOffsetCount = offset;

    CCVKCmdFuncCreatePipelineLayout((CCVKDevice *)_device, _gpuPipelineLayout);

    return true;
}

void CCVKPipelineLayout::destroy() {

    if (_gpuPipelineLayout) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
}

} // namespace gfx
} // namespace cc
