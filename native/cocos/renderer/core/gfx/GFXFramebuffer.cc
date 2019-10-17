#include "CoreStd.h"
#include "GFXFramebuffer.h"

CC_NAMESPACE_BEGIN

GFXFramebuffer::GFXFramebuffer(GFXDevice* device)
    : device_(device),
      render_pass_(nullptr),
      depth_stencil_view_(nullptr),
      is_offscreen_(true) {
}

GFXFramebuffer::~GFXFramebuffer() {
}

CC_NAMESPACE_END
