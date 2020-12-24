#include "MTLRenderCommandEncoder.h"
#include "MTLStd.h"

#import <Foundation/NSAutoreleasePool.h>

namespace cc {
namespace gfx {

thread_local NSAutoreleasePool *encoderAutoreleasePool = nullptr;

void CCMTLRenderCommandEncoder::initialize(id<MTLCommandBuffer> commandBuffer, MTLRenderPassDescriptor *descriptor)
{
    _mtlEncoder = [[commandBuffer renderCommandEncoderWithDescriptor:descriptor] autorelease];
    clearStates();
}

void CCMTLRenderCommandEncoder::initialize(id<MTLParallelRenderCommandEncoder> parallelEncoder)
{
    _mtlEncoder = [[parallelEncoder renderCommandEncoder] autorelease];
    clearStates();
}

void CCMTLRenderCommandEncoder::beginEncoding()
{
    encoderAutoreleasePool = [[NSAutoreleasePool alloc] init];
//    CC_LOG_INFO("POOL ALLOC: %p", encoderAutoreleasePool);
}

void CCMTLRenderCommandEncoder::endEncoding()
{
    [_mtlEncoder endEncoding];
//    [_mtlEncoder release];
    _mtlEncoder = nil;
    
    if (encoderAutoreleasePool)
    {
//        CC_LOG_INFO("POOL RELEASE: %p", encoderAutoreleasePool);
        [encoderAutoreleasePool release];
        encoderAutoreleasePool = nullptr;
    }
}
} // namespace gfx
} // namespace cc
