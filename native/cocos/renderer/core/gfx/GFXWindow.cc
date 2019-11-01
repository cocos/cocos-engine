#include "CoreStd.h"
#include "GFXWindow.h"

NS_CC_BEGIN

GFXWindow::GFXWindow(GFXDevice* device)
    : device_(device),
      left_(0),
      top_(0),
      width_(1024),
      height_(768),
      native_width_(0),
      native_height_(0),
      color_fmt_(GFXFormat::UNKNOWN),
      depth_stencil_fmt_(GFXFormat::UNKNOWN),
      is_offscreen_(false),
      is_fullscreen_(false),
      render_pass_(nullptr),
      color_texture_(nullptr),
      color_tex_view_(nullptr),
      depth_stencil_texture_(nullptr),
      depth_stencil_tex_view_(nullptr),
      framebuffer_(nullptr) {
}

GFXWindow::~GFXWindow() {
}

NS_CC_END
