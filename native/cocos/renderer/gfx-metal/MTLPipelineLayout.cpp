#include "MTLStd.h"
#include "MTLPipelineLayout.h"

NS_CC_BEGIN

CCMTLPipelineLayout::CCMTLPipelineLayout(GFXDevice* device) : GFXPipelineLayout(device) {}
CCMTLPipelineLayout::~CCMTLPipelineLayout() { destroy(); }

bool CCMTLPipelineLayout::initialize(const GFXPipelineLayoutInfo& info)
{
    _layouts = info.layouts;
    _pushConstantsRanges = info.push_constant_ranges;
    
    return true;
}

void CCMTLPipelineLayout::destroy()
{
    
}

NS_CC_END
