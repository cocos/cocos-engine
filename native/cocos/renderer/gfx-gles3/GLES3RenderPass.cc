#include "GLES3Std.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3RenderPass::GLES3RenderPass(GFXDevice* device)
    : GFXRenderPass(device),
      gpu_render_pass_(nullptr) {
}

GLES3RenderPass::~GLES3RenderPass() {
}

bool GLES3RenderPass::Initialize(const GFXRenderPassInfo &info) {
  
  color_attachments_ = info.color_attachments;
  depth_stencil_attachment_ = info.depth_stencil_attachment;
  
  gpu_render_pass_ = CC_NEW(GLES3GPURenderPass);
  gpu_render_pass_->color_attachments = color_attachments_;
  gpu_render_pass_->depth_stencil_attachment = depth_stencil_attachment_;
  
  return true;
}

void GLES3RenderPass::destroy() {
  if (gpu_render_pass_) {
    CC_DELETE(gpu_render_pass_);
    gpu_render_pass_ = nullptr;
  }
}

NS_CC_END
