#include "CoreStd.h"
#include "GFXFramebuffer.h"

NS_CC_BEGIN

GFXFramebuffer::GFXFramebuffer(GFXDevice* device)
: GFXObject(GFXObjectType::FRAMEBUFFER)
, _device(device)
{
}

GFXFramebuffer::~GFXFramebuffer() {
}

NS_CC_END
