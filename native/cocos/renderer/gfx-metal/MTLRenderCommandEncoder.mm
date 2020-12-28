#include "MTLRenderCommandEncoder.h"
#include "MTLStd.h"

namespace cc {
namespace gfx {

void CCMTLRenderCommandEncoder::initialize(id<MTLCommandBuffer> commandBuffer, MTLRenderPassDescriptor *descriptor)
{
    _mtlEncoder = [[commandBuffer renderCommandEncoderWithDescriptor:descriptor] retain];
    clearStates();
}

void CCMTLRenderCommandEncoder::initialize(id<MTLParallelRenderCommandEncoder> parallelEncoder)
{
    _mtlEncoder = [[parallelEncoder renderCommandEncoder] retain];
    clearStates();
}

void CCMTLRenderCommandEncoder::endEncoding()
{
    [_mtlEncoder endEncoding];
    [_mtlEncoder release];
    _mtlEncoder = nil;
}
} // namespace gfx
} // namespace cc
