#include "MTLStd.h"
#include "MTLUtils.h"

NS_CC_BEGIN

namespace mu
{
    MTLLoadAction toMTLLoadAction(GFXLoadOp op)
    {
        switch (op) {
            case GFXLoadOp::CLEAR:
                return MTLLoadActionClear;
            case GFXLoadOp::LOAD:
                return MTLLoadActionLoad;
            case GFXLoadOp::DISCARD:
                return MTLLoadActionDontCare;
            default:
                return MTLLoadActionDontCare;
        }
    }
    
    MTLStoreAction toMTLStoreAction(GFXStoreOp op)
    {
        switch (op) {
            case GFXStoreOp::STORE:
                return MTLStoreActionStore;
            case GFXStoreOp::DISCARD:
                return MTLStoreActionDontCare;
            default:
                return MTLStoreActionDontCare;
        }
    }
    
    MTLClearColor toMTLClearColor(const GFXColor& clearColor)
    {
        return MTLClearColorMake(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    }
}

NS_CC_END
