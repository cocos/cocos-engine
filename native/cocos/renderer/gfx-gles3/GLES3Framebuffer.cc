#include "GLES3Std.h"
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"
#include "GLES3TextureView.h"

CC_NAMESPACE_BEGIN

GLES3Framebuffer::GLES3Framebuffer(GFXDevice* device)
    : GFXFramebuffer(device),
      gpu_fbo_(nullptr) {
}

GLES3Framebuffer::~GLES3Framebuffer() {
}

bool GLES3Framebuffer::Initialize(const GFXFramebufferInfo &info) {
  
  render_pass_ = info.render_pass;
  color_views_ = info.color_views;
  depth_stencil_view_ = info.depth_stencil_view;
  is_offscreen_ = info.is_offscreen;
  
  gpu_fbo_ = CC_NEW(GLES3GPUFramebuffer);
  gpu_fbo_->gpu_render_pass = ((GLES3RenderPass*)render_pass_)->gpu_render_pass();
  
  if (is_offscreen_) {
    gpu_fbo_->gpu_color_views.resize(color_views_.size());
    for (size_t i = 0; i < color_views_.size(); ++i) {
      GLES3TextureView* color_view = (GLES3TextureView*)color_views_[i];
      gpu_fbo_->gpu_color_views[i] = color_view->gpu_tex_view();
    }
    
    if (depth_stencil_view_) {
      gpu_fbo_->gpu_depth_stencil_view = ((GLES3TextureView*)depth_stencil_view_)->gpu_tex_view();
    }
    
    gpu_fbo_->is_offscreen = is_offscreen_;
    
    GLES3CmdFuncCreateFramebuffer((GLES3Device*)device_, gpu_fbo_);
  }
  
  return true;
}

void GLES3Framebuffer::Destroy() {
  if (gpu_fbo_) {
    CC_DELETE(gpu_fbo_);
    GLES3CmdFuncDestroyFramebuffer((GLES3Device*)device_, gpu_fbo_);
    gpu_fbo_ = nullptr;
  }
}

CC_NAMESPACE_END
