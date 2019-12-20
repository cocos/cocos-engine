#include "MTLStd.h"
#include "MTLCommandAllocator.h"

NS_CC_BEGIN

CCMTLCommandAllocator::CCMTLCommandAllocator(GFXDevice* device) : GFXCommandAllocator(device) {}
CCMTLCommandAllocator::~CCMTLCommandAllocator() { Destroy(); }

bool CCMTLCommandAllocator::Initialize(const GFXCommandAllocatorInfo& info)
{
    
}

void CCMTLCommandAllocator::Destroy()
{
    
}

NS_CC_END
