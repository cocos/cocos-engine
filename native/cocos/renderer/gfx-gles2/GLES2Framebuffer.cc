#include "GLES2Std.h"
#include "GLES2Framebuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"
#include "GLES2TextureView.h"

NS_CC_BEGIN

GLES2Framebuffer::GLES2Framebuffer(GFXDevice* device)
    : GFXFramebuffer(device),
      gpu_fbo_(nullptr) {
}

GLES2Framebuffer::~GLES2Framebuffer() {
}

bool GLES2Framebuffer::Initialize(const GFXFramebufferInfo &info) {
  
  render_pass_ = info.render_pass;
  color_views_ = info.color_views;
  depth_stencil_view_ = info.depth_stencil_view;
  is_offscreen_ = info.is_offscreen;
  
  gpu_fbo_ = CC_NEW(GLES2GPUFramebuffer);
  gpu_fbo_->gpu_render_pass = ((GLES2RenderPass*)render_pass_)->gpu_render_pass();
  
  if (is_offscreen_) {
    gpu_fbo_->gpu_color_views.resize(color_views_.size());
    for (size_t i = 0; i < color_views_.size(); ++i) {
      GLES2TextureView* color_view = (GLES2TextureView*)color_views_[i];
      gpu_fbo_->gpu_color_views[i] = color_view->gpu_tex_view();
    }
    
    if (depth_stencil_view_) {
      gpu_fbo_->gpu_depth_stencil_view = ((GLES2TextureView*)depth_stencil_view_)->gpu_tex_view();
    }
    
    gpu_fbo_->is_offscreen = is_offscreen_;
    
    GLES2CmdFuncCreateFramebuffer((GLES2Device*)device_, gpu_fbo_);
  }
  
  return true;
}

void GLES2Framebuffer::Destroy() {
  if (gpu_fbo_) {
    CC_DELETE(gpu_fbo_);
    GLES2CmdFuncDestroyFramebuffer((GLES2Device*)device_, gpu_fbo_);
    gpu_fbo_ = nullptr;
  }
}

NS_CC_END
