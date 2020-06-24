#include "VKStd.h"

#include "VKBindingLayout.h"
#include "VKCommands.h"
#include "VKPipelineLayout.h"

namespace cc {
namespace gfx {

CCVKPipelineLayout::CCVKPipelineLayout(Device *device)
: PipelineLayout(device) {
}

CCVKPipelineLayout::~CCVKPipelineLayout() {
}

bool CCVKPipelineLayout::initialize(const PipelineLayoutInfo &info) {

    _layouts = info.layouts;
    _pushConstantsRanges = info.pushConstantsRanges;

    _gpuPipelineLayout = CC_NEW(CCVKGPUPipelineLayout);
    _gpuPipelineLayout->pushConstantRanges = _pushConstantsRanges;
    uint layoutCount = _layouts.size();
    _gpuPipelineLayout->gpuBindingLayouts.resize(layoutCount);
    for (uint i = 0u; i < layoutCount; i++) {
        _gpuPipelineLayout->gpuBindingLayouts[i] = ((CCVKBindingLayout *)_layouts[i])->gpuBindingLayout();
    }

    CCVKCmdFuncCreatePipelineLayout((CCVKDevice *)_device, _gpuPipelineLayout);

    _status = Status::SUCCESS;
    return true;
}

void CCVKPipelineLayout::destroy() {
    if (_gpuPipelineLayout) {
        CCVKCmdFuncDestroyPipelineLayout((CCVKDevice *)_device, _gpuPipelineLayout);
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
