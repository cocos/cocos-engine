#include "GLES3Std.h"
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"
#include "GLES3TextureView.h"
#include "GLES3Context.h"

NS_CC_BEGIN

GLES3Framebuffer::GLES3Framebuffer(GFXDevice* device)
    : GFXFramebuffer(device),
      gpu_fbo_(nullptr) {
}

GLES3Framebuffer::~GLES3Framebuffer() {
}

bool GLES3Framebuffer::initialize(const GFXFramebufferInfo &info) {
  
  _renderPass = info.render_pass;
  _colorViews = info.color_views;
  _depthStencilView = info.depth_stencil_view;
  _isOffscreen = info.is_offscreen;
  
  gpu_fbo_ = CC_NEW(GLES3GPUFramebuffer);
  gpu_fbo_->gpu_render_pass = ((GLES3RenderPass*)_renderPass)->gpu_render_pass();
  
  if (_isOffscreen) {
    gpu_fbo_->gpu_color_views.resize(_colorViews.size());
    for (size_t i = 0; i < _colorViews.size(); ++i) {
      GLES3TextureView* color_view = (GLES3TextureView*)_colorViews[i];
      gpu_fbo_->gpu_color_views[i] = color_view->gpu_tex_view();
    }
    
    if (_depthStencilView) {
      gpu_fbo_->gpu_depth_stencil_view = ((GLES3TextureView*)_depthStencilView)->gpu_tex_view();
    }
    
    gpu_fbo_->is_offscreen = _isOffscreen;
    
    GLES3CmdFuncCreateFramebuffer((GLES3Device*)_device, gpu_fbo_);
  }
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
  else
  {
      gpu_fbo_->gl_fbo = static_cast<GLES3Context*>(_device->context())->getDefaultFramebuffer();
  }
#endif

  return true;
}

void GLES3Framebuffer::destroy() {
  if (gpu_fbo_) {
      if(isOffscreen())
          GLES3CmdFuncDestroyFramebuffer((GLES3Device*)_device, gpu_fbo_);
      CC_DELETE(gpu_fbo_);
      gpu_fbo_ = nullptr;
  }
}

NS_CC_END
