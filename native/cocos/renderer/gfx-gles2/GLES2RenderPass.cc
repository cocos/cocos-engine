#include "GLES2Std.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2RenderPass::GLES2RenderPass(GFXDevice* device)
    : GFXRenderPass(device){
}

GLES2RenderPass::~GLES2RenderPass() {
}

bool GLES2RenderPass::initialize(const GFXRenderPassInfo &info) {
  
  _colorAttachments = info.colorAttachments;
  _depthStencilAttachment = info.depthStencilAttachment;
  
  _gpuRenderPass = CC_NEW(GLES2GPURenderPass);
  _gpuRenderPass->colorAttachments = _colorAttachments;
  _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
  
  return true;
}

void GLES2RenderPass::destroy() {
  if (_gpuRenderPass) {
    CC_DELETE(_gpuRenderPass);
    _gpuRenderPass = nullptr;
  }
}

NS_CC_END
