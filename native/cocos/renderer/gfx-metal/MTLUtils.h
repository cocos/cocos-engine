#pragma once

#import <Metal/MTLRenderPass.h>

NS_CC_BEGIN

namespace mu
{
    MTLLoadAction toMTLLoadAction(GFXLoadOp op);
    MTLStoreAction toMTLStoreAction(GFXStoreOp op);
    MTLClearColor toMTLClearColor(const GFXColor& clearColor);
}

NS_CC_END
