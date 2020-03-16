#include "GLES3Std.h"
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"
#include "GLES3TextureView.h"
#include "GLES3Context.h"

NS_CC_BEGIN

GLES3Framebuffer::GLES3Framebuffer(GFXDevice* device)
    : GFXFramebuffer(device) {
}

GLES3Framebuffer::~GLES3Framebuffer() {
}

bool GLES3Framebuffer::initialize(const GFXFramebufferInfo &info) {
  
  _renderPass = info.renderPass;
  _colorViews = info.colorViews;
  _depthStencilView = info.depthStencilView;
  _isOffscreen = info.isOffscreen;
  
  _gpuFBO = CC_NEW(GLES3GPUFramebuffer);
  _gpuFBO->gpuRenderPass = ((GLES3RenderPass*)_renderPass)->gpuRenderPass();
  
  if (_isOffscreen) {
    _gpuFBO->gpuColorViews.resize(_colorViews.size());
    for (size_t i = 0; i < _colorViews.size(); ++i) {
      GLES3TextureView* color_view = (GLES3TextureView*)_colorViews[i];
      _gpuFBO->gpuColorViews[i] = color_view->gpuTexView();
    }
    
    if (_depthStencilView) {
      _gpuFBO->gpuDepthStencilView = ((GLES3TextureView*)_depthStencilView)->gpuTexView();
    }
    
    _gpuFBO->isOffscreen = _isOffscreen;
    
    GLES3CmdFuncCreateFramebuffer((GLES3Device*)_device, _gpuFBO);
  }
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
  else
  {
      _gpuFBO->glFramebuffer = static_cast<GLES3Context*>(_device->getContext())->getDefaultFramebuffer();
  }
#endif
    
    _status = GFXStatus::SUCCESS;

  return true;
}

void GLES3Framebuffer::destroy() {
  if (_gpuFBO) {
      if(isOffscreen())
          GLES3CmdFuncDestroyFramebuffer((GLES3Device*)_device, _gpuFBO);
      CC_DELETE(_gpuFBO);
      _gpuFBO = nullptr;
  }
    _status = GFXStatus::UNREADY;
}

NS_CC_END
