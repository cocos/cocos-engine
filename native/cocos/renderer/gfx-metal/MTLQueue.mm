#include "MTLStd.h"
#include "MTLQueue.h"
#include "MTLDevice.h"

#import <Metal/Metal.h>

NS_CC_BEGIN

CCMTLQueue::CCMTLQueue(GFXDevice* device) : GFXQueue(device) {}

CCMTLQueue::~CCMTLQueue()
{
    Destroy();
}

bool CCMTLQueue::Initialize(const GFXQueueInfo &info)
{
    auto ccdevice = (CCMTLDevice *)device_;
    _metalQueue = [id<MTLDevice>(ccdevice->getMetalDevice() ) newCommandQueue];
    type_ = info.type;
    
    return true;
}

void CCMTLQueue::Destroy()
{
    if (_metalQueue)
    {
        [id<MTLCommandQueue>(_metalQueue) release];
        _metalQueue = nullptr;
    }
}

void CCMTLQueue::submit(GFXCommandBuffer** cmd_buffs, uint count)
{
    if (! _metalQueue)
        return;
    
    
}

NS_CC_END

