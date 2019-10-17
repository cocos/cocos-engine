#include "CoreStd.h"
#include "GFXContext.h"

CC_NAMESPACE_BEGIN

GFXContext::GFXContext(GFXDevice* device)
    : device_(device),
      window_handle_(0),
      shared_ctx_(nullptr),
      vsync_mode_(GFXVsyncMode::OFF),
      color_fmt_(GFXFormat::UNKNOWN),
      depth_stencil_fmt_(GFXFormat::UNKNOWN) {
}

GFXContext::~GFXContext() {
}

CC_NAMESPACE_END
