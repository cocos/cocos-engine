#include "MTLStd.h"
#include "MTLPipelineLayout.h"

NS_CC_BEGIN

CCMTLPipelineLayout::CCMTLPipelineLayout(GFXDevice* device) : GFXPipelineLayout(device) {}
CCMTLPipelineLayout::~CCMTLPipelineLayout() { Destroy(); }

bool CCMTLPipelineLayout::Initialize(const GFXPipelineLayoutInfo& info)
{
    layouts_ = info.layouts;
    push_constant_ranges_ = info.push_constant_ranges;
    
    return true;
}

void CCMTLPipelineLayout::Destroy()
{
    
}

NS_CC_END
