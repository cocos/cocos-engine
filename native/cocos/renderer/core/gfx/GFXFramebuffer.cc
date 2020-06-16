#include "CoreStd.h"
#include "GFXFramebuffer.h"

namespace cc {

GFXFramebuffer::GFXFramebuffer(GFXDevice *device)
: GFXObject(GFXObjectType::FRAMEBUFFER), _device(device) {
}

GFXFramebuffer::~GFXFramebuffer() {
}

}
