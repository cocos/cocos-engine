#include "GLES2Std.h"
#include "GLES2Window.h"

NS_CC_BEGIN

GLES2Window::GLES2Window(GFXDevice* device)
    : GFXWindow(device) {
}

GLES2Window::~GLES2Window() {
}

bool GLES2Window::initialize(const GFXWindowInfo &info) {
  _title = info.title;
  _left = info.left;
  _top = info.top;
  _width = info.width;
  _height = info.height;
  _nativeWidth = _width;
  _nativeHeight = _height;
  _colorFmt = info.colorFmt;
  _depthStencilFmt = info.depthStencilFmt;
  _isOffscreen = info.isOffscreen;
  _isFullscreen = info.isFullscreen;

  // Create render pass

  GFXRenderPassInfo renderPassInfo;

  GFXColorAttachment colorAttachment;
  colorAttachment.format = _colorFmt;
  colorAttachment.loadOp = GFXLoadOp::CLEAR;
  colorAttachment.storeOp = GFXStoreOp::STORE;
  colorAttachment.sampleCount = 1;
  colorAttachment.beginLayout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
  colorAttachment.endLayout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
  renderPassInfo.colorAttachments.emplace_back(colorAttachment);

  GFXDepthStencilAttachment& depthStencilAttachment = renderPassInfo.depthStencilAttachment;
  renderPassInfo.depthStencilAttachment.format = _depthStencilFmt;
  depthStencilAttachment.depthLoadOp = GFXLoadOp::CLEAR;
  depthStencilAttachment.depthStoreOp = GFXStoreOp::STORE;
  depthStencilAttachment.stencilLoadOp = GFXLoadOp::CLEAR;
  depthStencilAttachment.stencilStoreOp = GFXStoreOp::STORE;
  depthStencilAttachment.sampleCount = 1;
  depthStencilAttachment.beginLayout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
  depthStencilAttachment.endLayout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

  _renderPass = _device->createRenderPass(renderPassInfo);

  // Create texture & texture views
  if (_isOffscreen) {
    if (_colorFmt != GFXFormat::UNKNOWN) {
      GFXTextureInfo colorTexInfo;
      colorTexInfo.type = GFXTextureType::TEX2D;
      colorTexInfo.usage = GFXTextureUsageBit::COLOR_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
      colorTexInfo.format = _colorFmt;
      colorTexInfo.width = _width;
      colorTexInfo.height = _height;
      colorTexInfo.depth = 1;
      colorTexInfo.arrayLayer = 1;
      colorTexInfo.mipLevel = 1;
      _colorTex = _device->createTexture(colorTexInfo);

      GFXTextureViewInfo colorTexViewInfo;
      colorTexViewInfo.type = GFXTextureViewType::TV2D;
      colorTexViewInfo.format = _colorFmt;
      colorTexViewInfo.baseLevel = 0;
      colorTexViewInfo.levelCount = 1;
      colorTexViewInfo.baseLayer = 0;
      colorTexViewInfo.layerCount = 1;
      _colorTexView = _device->createTextureView(colorTexViewInfo);
    }
    if (_depthStencilFmt != GFXFormat::UNKNOWN) {
      GFXTextureInfo depthStecnilTexInfo;
      depthStecnilTexInfo.type = GFXTextureType::TEX2D;
      depthStecnilTexInfo.usage = GFXTextureUsageBit::DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
      depthStecnilTexInfo.format = _depthStencilFmt;
      depthStecnilTexInfo.width = _width;
      depthStecnilTexInfo.height = _height;
      depthStecnilTexInfo.depth = 1;
      depthStecnilTexInfo.arrayLayer = 1;
      depthStecnilTexInfo.mipLevel = 1;
      _depthStencilTex = _device->createTexture(depthStecnilTexInfo);

      GFXTextureViewInfo depthStecnilTexViewInfo;
        depthStecnilTexViewInfo.texture = _depthStencilTex;
      depthStecnilTexViewInfo.type = GFXTextureViewType::TV2D;
      depthStecnilTexViewInfo.format = _colorFmt;
      depthStecnilTexViewInfo.baseLevel = 0;
      depthStecnilTexViewInfo.levelCount = 1;
      depthStecnilTexViewInfo.baseLayer = 0;
      depthStecnilTexViewInfo.layerCount = 1;
      _depthStencilTexView = _device->createTextureView(depthStecnilTexViewInfo);
    }
  }

  GFXFramebufferInfo fboInfo;
  fboInfo.renderPass = _renderPass;
    if(_colorTexView)
        fboInfo.colorViews.push_back(_colorTexView);
  fboInfo.depthStencilView = _depthStencilTexView;
  fboInfo.isOffscreen = _isOffscreen;
  _framebuffer = _device->createFramebuffer(fboInfo);

  return true;
}

void GLES2Window::destroy() {
  CC_SAFE_DESTROY(_renderPass);
  CC_SAFE_DESTROY(_colorTexView);
  CC_SAFE_DESTROY(_colorTex);
  CC_SAFE_DESTROY(_depthStencilTexView);
  CC_SAFE_DESTROY(_depthStencilTex);
  CC_SAFE_DESTROY(_framebuffer);
}

void GLES2Window::resize(uint width, uint height) {
  _width = width;
  _height = height;
  if (width > _nativeWidth || height > _nativeHeight) {
    _nativeWidth = width;
    _nativeHeight = height;

    if (_colorTex) {
      _colorTex->resize(width, height);
      _colorTexView->destroy();

      GFXTextureViewInfo colorTexViewInfo;
      colorTexViewInfo.type = GFXTextureViewType::TV2D;
      colorTexViewInfo.format = _colorFmt;
      _colorTexView->initialize(colorTexViewInfo);
    }

    if (_depthStencilTex) {
      _depthStencilTex->resize(width, height);
      _depthStencilTexView->destroy();

      GFXTextureViewInfo depth_stencil_tex_view__info;
      depth_stencil_tex_view__info.type = GFXTextureViewType::TV2D;
      depth_stencil_tex_view__info.format = _depthStencilFmt;
      _depthStencilTexView->initialize(depth_stencil_tex_view__info);
    }

    if (_framebuffer) {
      _framebuffer->destroy();

      GFXFramebufferInfo fboInfo;
      fboInfo.isOffscreen = _isOffscreen;
      fboInfo.renderPass = _renderPass;
      fboInfo.colorViews.push_back(_colorTexView);
      fboInfo.depthStencilView = _depthStencilTexView;
      _framebuffer->initialize(fboInfo);
    }
  }
}

NS_CC_END
