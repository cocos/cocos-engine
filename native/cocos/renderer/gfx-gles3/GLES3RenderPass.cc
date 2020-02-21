#include "GLES3Std.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3RenderPass::GLES3RenderPass(GFXDevice* device)
    : GFXRenderPass(device) {
}

GLES3RenderPass::~GLES3RenderPass() {
}

bool GLES3RenderPass::initialize(const GFXRenderPassInfo &info) {
  
  _colorAttachments = info.colorAttachments;
  _depthStencilAttachment = info.depthStencilAttachment;
  
  _gpuRenderPass = CC_NEW(GLES3GPURenderPass);
  _gpuRenderPass->colorAttachments = _colorAttachments;
  _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
  
  return true;
}

void GLES3RenderPass::destroy() {
  if (_gpuRenderPass) {
    CC_DELETE(_gpuRenderPass);
    _gpuRenderPass = nullptr;
  }
}

NS_CC_END
