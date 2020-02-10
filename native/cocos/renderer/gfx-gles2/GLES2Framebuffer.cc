#include "GLES2Std.h"
#include "GLES2Framebuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"
#include "GLES2TextureView.h"
#include "GLES2Context.h"

NS_CC_BEGIN

GLES2Framebuffer::GLES2Framebuffer(GFXDevice* device)
    : GFXFramebuffer(device),
      gpu_fbo_(nullptr) {
}

GLES2Framebuffer::~GLES2Framebuffer() {
}

bool GLES2Framebuffer::initialize(const GFXFramebufferInfo &info) {
  
  _renderPass = info.render_pass;
  _colorViews = info.color_views;
  _depthStencilView = info.depth_stencil_view;
  _isOffscreen = info.is_offscreen;
  
  gpu_fbo_ = CC_NEW(GLES2GPUFramebuffer);
  gpu_fbo_->gpu_render_pass = ((GLES2RenderPass*)_renderPass)->gpu_render_pass();
  
  if (_isOffscreen) {
    gpu_fbo_->gpu_color_views.resize(_colorViews.size());
    for (size_t i = 0; i < _colorViews.size(); ++i) {
      GLES2TextureView* color_view = (GLES2TextureView*)_colorViews[i];
      gpu_fbo_->gpu_color_views[i] = color_view->gpu_tex_view();
    }
    
    if (_depthStencilView) {
      gpu_fbo_->gpu_depth_stencil_view = ((GLES2TextureView*)_depthStencilView)->gpu_tex_view();
    }
    
    gpu_fbo_->is_offscreen = _isOffscreen;
    
    GLES2CmdFuncCreateFramebuffer((GLES2Device*)_device, gpu_fbo_);
  }
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    else
    {
        gpu_fbo_->gl_fbo = static_cast<GLES2Context*>(_device->context())->getDefaultFramebuffer();
    }
#endif
  return true;
}

void GLES2Framebuffer::destroy() {
  if (gpu_fbo_) {
    if(isOffscreen())
        GLES2CmdFuncDestroyFramebuffer((GLES2Device*)_device, gpu_fbo_);
      CC_DELETE(gpu_fbo_);
      gpu_fbo_ = nullptr;
  }
}

NS_CC_END
