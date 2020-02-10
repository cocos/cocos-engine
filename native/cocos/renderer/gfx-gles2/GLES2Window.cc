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
  _colorFmt = info.color_fmt;
  _depthStencilFmt = info.depth_stencil_fmt;
  _isOffscreen = info.is_offscreen;
  _isFullscreen = info.is_fullscreen;

  // Create render pass

  GFXRenderPassInfo render_pass_info;

  GFXColorAttachment color_attachment;
  color_attachment.format = _colorFmt;
  color_attachment.load_op = GFXLoadOp::CLEAR;
  color_attachment.store_op = GFXStoreOp::STORE;
  color_attachment.sample_count = 1;
  color_attachment.begin_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
  color_attachment.end_layout = GFXTextureLayout::COLOR_ATTACHMENT_OPTIMAL;
  render_pass_info.color_attachments.emplace_back(color_attachment);

  GFXDepthStencilAttachment& depth_stencil_attachment = render_pass_info.depth_stencil_attachment;
  render_pass_info.depth_stencil_attachment.format = _depthStencilFmt;
  depth_stencil_attachment.depth_load_op = GFXLoadOp::CLEAR;
  depth_stencil_attachment.depth_store_op = GFXStoreOp::STORE;
  depth_stencil_attachment.stencil_load_op = GFXLoadOp::CLEAR;
  depth_stencil_attachment.stencil_store_op = GFXStoreOp::STORE;
  depth_stencil_attachment.sample_count = 1;
  depth_stencil_attachment.begin_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
  depth_stencil_attachment.end_layout = GFXTextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

  _renderPass = _device->createRenderPass(render_pass_info);

  // Create texture & texture views
  if (_isOffscreen) {
    if (_colorFmt != GFXFormat::UNKNOWN) {
      GFXTextureInfo color_tex_info;
      color_tex_info.type = GFXTextureType::TEX2D;
      color_tex_info.usage = GFXTextureUsageBit::COLOR_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
      color_tex_info.format = _colorFmt;
      color_tex_info.width = _width;
      color_tex_info.height = _height;
      color_tex_info.depth = 1;
      color_tex_info.array_layer = 1;
      color_tex_info.mip_level = 1;
      _colorTex = _device->createTexture(color_tex_info);

      GFXTextureViewInfo color_tex_view_info;
      color_tex_view_info.type = GFXTextureViewType::TV2D;
      color_tex_view_info.format = _colorFmt;
      color_tex_view_info.base_level = 0;
      color_tex_view_info.level_count = 1;
      color_tex_view_info.base_layer = 0;
      color_tex_view_info.layer_count = 1;
      _colorTexView = _device->createTextureView(color_tex_view_info);
    }
    if (_depthStencilFmt != GFXFormat::UNKNOWN) {
      GFXTextureInfo depth_stecnil_tex_info;
      depth_stecnil_tex_info.type = GFXTextureType::TEX2D;
      depth_stecnil_tex_info.usage = GFXTextureUsageBit::DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit::SAMPLED;
      depth_stecnil_tex_info.format = _depthStencilFmt;
      depth_stecnil_tex_info.width = _width;
      depth_stecnil_tex_info.height = _height;
      depth_stecnil_tex_info.depth = 1;
      depth_stecnil_tex_info.array_layer = 1;
      depth_stecnil_tex_info.mip_level = 1;
      _depthStencilTex = _device->createTexture(depth_stecnil_tex_info);

      GFXTextureViewInfo depth_stecnil_tex_view_info;
        depth_stecnil_tex_view_info.texture = _depthStencilTex;
      depth_stecnil_tex_view_info.type = GFXTextureViewType::TV2D;
      depth_stecnil_tex_view_info.format = _colorFmt;
      depth_stecnil_tex_view_info.base_level = 0;
      depth_stecnil_tex_view_info.level_count = 1;
      depth_stecnil_tex_view_info.base_layer = 0;
      depth_stecnil_tex_view_info.layer_count = 1;
      _depthStencilTexView = _device->createTextureView(depth_stecnil_tex_view_info);
    }
  }

  GFXFramebufferInfo fbo_info;
  fbo_info.render_pass = _renderPass;
    if(_colorTexView)
        fbo_info.color_views.push_back(_colorTexView);
  fbo_info.depth_stencil_view = _depthStencilTexView;
  fbo_info.is_offscreen = _isOffscreen;
  _framebuffer = _device->createFramebuffer(fbo_info);

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

      GFXTextureViewInfo color_tex_view_info;
      color_tex_view_info.type = GFXTextureViewType::TV2D;
      color_tex_view_info.format = _colorFmt;
      _colorTexView->initialize(color_tex_view_info);
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

      GFXFramebufferInfo fbo_info;
      fbo_info.is_offscreen = _isOffscreen;
      fbo_info.render_pass = _renderPass;
      fbo_info.color_views.push_back(_colorTexView);
      fbo_info.depth_stencil_view = _depthStencilTexView;
      _framebuffer->initialize(fbo_info);
    }
  }
}

NS_CC_END
