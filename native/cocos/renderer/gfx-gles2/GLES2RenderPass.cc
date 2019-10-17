#include "GLES2Std.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"

CC_NAMESPACE_BEGIN

GLES2RenderPass::GLES2RenderPass(GFXDevice* device)
    : GFXRenderPass(device),
      gpu_render_pass_(nullptr) {
}

GLES2RenderPass::~GLES2RenderPass() {
}

bool GLES2RenderPass::Initialize(const GFXRenderPassInfo &info) {
  
  color_attachments_ = info.color_attachments;
  depth_stencil_attachment_ = info.depth_stencil_attachment;
  
  gpu_render_pass_ = CC_NEW(GLES2GPURenderPass);
  gpu_render_pass_->color_attachments = color_attachments_;
  gpu_render_pass_->depth_stencil_attachment = depth_stencil_attachment_;
  
  return true;
}

void GLES2RenderPass::Destroy() {
  if (gpu_render_pass_) {
    CC_DELETE(gpu_render_pass_);
    gpu_render_pass_ = nullptr;
  }
}

CC_NAMESPACE_END
