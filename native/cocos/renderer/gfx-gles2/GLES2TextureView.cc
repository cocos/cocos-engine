#include "GLES2Std.h"
#include "GLES2TextureView.h"
#include "GLES2Texture.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2TextureView::GLES2TextureView(GFXDevice* device)
    : GFXTextureView(device),
      gpu_tex_view_(nullptr) {
}

GLES2TextureView::~GLES2TextureView() {
}

bool GLES2TextureView::initialize(const GFXTextureViewInfo &info) {
  
  _texture = info.texture;
  _type = info.type;
  _format = info.format;
  _baseLayer = info.base_layer;
  _levelCount = info.level_count;
  _baseLayer = info.base_layer;
  _layerCount = info.layer_count;
  
  gpu_tex_view_ = CC_NEW(GLES2GPUTextureView);
  gpu_tex_view_->gpu_texture = static_cast<GLES2Texture*>(_texture)->gpu_texture();
  gpu_tex_view_->type = _type;
  gpu_tex_view_->format = _format;
  gpu_tex_view_->base_level = info.base_level;
  gpu_tex_view_->level_count = info.level_count;
  
  return true;
}

void GLES2TextureView::destroy() {
  if (gpu_tex_view_) {
    CC_DELETE(gpu_tex_view_);
    gpu_tex_view_ = nullptr;
  }
  _texture = nullptr;
}

NS_CC_END
