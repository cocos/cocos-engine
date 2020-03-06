#include "GLES2Std.h"
#include "GLES2Framebuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"
#include "GLES2TextureView.h"
#include "GLES2Context.h"

NS_CC_BEGIN

GLES2Framebuffer::GLES2Framebuffer(GFXDevice* device)
    : GFXFramebuffer(device){
}

GLES2Framebuffer::~GLES2Framebuffer() {
}

bool GLES2Framebuffer::initialize(const GFXFramebufferInfo &info) {
  
  _renderPass = info.renderPass;
  _colorViews = info.colorViews;
  _depthStencilView = info.depthStencilView;
  _isOffscreen = info.isOffscreen;
  
  _gpuFBO = CC_NEW(GLES2GPUFramebuffer);
  _gpuFBO->gpuRenderPass = ((GLES2RenderPass*)_renderPass)->gpuRenderPass();
  
  if (_isOffscreen) {
    _gpuFBO->gpuColorViews.resize(_colorViews.size());
    for (size_t i = 0; i < _colorViews.size(); ++i) {
      GLES2TextureView* color_view = (GLES2TextureView*)_colorViews[i];
      _gpuFBO->gpuColorViews[i] = color_view->gpuTexView();
    }
    
    if (_depthStencilView) {
      _gpuFBO->gpuDepthStencilView = ((GLES2TextureView*)_depthStencilView)->gpuTexView();
    }
    
    _gpuFBO->isOffscreen = _isOffscreen;
    
    GLES2CmdFuncCreateFramebuffer((GLES2Device*)_device, _gpuFBO);
  }
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    else
    {
        _gpuFBO->glFramebuffer = static_cast<GLES2Context*>(_device->getContext())->getDefaultFramebuffer();
    }
#endif
  return true;
}

void GLES2Framebuffer::destroy() {
  if (_gpuFBO) {
    if(isOffscreen())
        GLES2CmdFuncDestroyFramebuffer((GLES2Device*)_device, _gpuFBO);
      CC_DELETE(_gpuFBO);
      _gpuFBO = nullptr;
  }
}

NS_CC_END
