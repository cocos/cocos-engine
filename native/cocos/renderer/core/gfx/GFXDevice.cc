#include "CoreStd.h"
#include "GFXDevice.h"

NS_CC_BEGIN

GFXDevice::GFXDevice()
    : api_(GFXAPI::UNKNOWN),
      width_(0),
      height_(0),
      native_width_(0),
      native_height_(0),
      window_handle_(0),
      context_(nullptr),
      window_(nullptr),
      queue_(nullptr),
      cmd_allocator_(nullptr),
      num_draw_calls_(0),
      num_tris_(0) {
  memset(features_, 0, sizeof(features_));
}

GFXDevice::~GFXDevice() {
}

NS_CC_END
