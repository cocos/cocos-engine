#include "VKStd.h"

#include "VKBindingLayout.h"
#include "VKCommands.h"
#include "VKPipelineLayout.h"

NS_CC_BEGIN

CCVKPipelineLayout::CCVKPipelineLayout(GFXDevice *device)
: GFXPipelineLayout(device) {
}

CCVKPipelineLayout::~CCVKPipelineLayout() {
}

bool CCVKPipelineLayout::initialize(const GFXPipelineLayoutInfo &info) {

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

    _status = GFXStatus::SUCCESS;
    return true;
}

void CCVKPipelineLayout::destroy() {
    if (_gpuPipelineLayout) {
        CCVKCmdFuncDestroyPipelineLayout((CCVKDevice *)_device, _gpuPipelineLayout);
        CC_DELETE(_gpuPipelineLayout);
        _gpuPipelineLayout = nullptr;
    }
    _status = GFXStatus::UNREADY;
}

NS_CC_END
