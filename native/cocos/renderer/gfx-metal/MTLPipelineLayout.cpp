#include "MTLStd.h"
#include "MTLPipelineLayout.h"

NS_CC_BEGIN

CCMTLPipelineLayout::CCMTLPipelineLayout(GFXDevice* device) : GFXPipelineLayout(device) {}
CCMTLPipelineLayout::~CCMTLPipelineLayout() { destroy(); }

bool CCMTLPipelineLayout::initialize(const GFXPipelineLayoutInfo& info)
{
    _layouts = info.layouts;
    _pushConstantsRanges = info.pushConstantsRanges;
    _status = GFXStatus::SUCCESS;
    
    return true;
}

void CCMTLPipelineLayout::destroy()
{
    _status = GFXStatus::UNREADY;
}

NS_CC_END
