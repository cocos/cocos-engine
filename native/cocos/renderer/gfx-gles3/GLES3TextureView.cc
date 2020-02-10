#include "GLES3Std.h"
#include "GLES3TextureView.h"
#include "GLES3Texture.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3TextureView::GLES3TextureView(GFXDevice* device)
    : GFXTextureView(device),
      gpu_tex_view_(nullptr) {
}

GLES3TextureView::~GLES3TextureView() {
}

bool GLES3TextureView::initialize(const GFXTextureViewInfo &info) {
  
  _texture = info.texture;
  _type = info.type;
  _format = info.format;
  _baseLevel = info.base_level;
  _levelCount = info.level_count;
  _baseLayer = info.base_layer;
  _layerCount = info.layer_count;
  
  gpu_tex_view_ = CC_NEW(GLES3GPUTextureView);
  gpu_tex_view_->gpu_texture = static_cast<GLES3Texture*>(_texture)->gpu_texture();
  gpu_tex_view_->type = _type;
  gpu_tex_view_->format = _format;
  gpu_tex_view_->base_level = info.base_level;
  gpu_tex_view_->level_count = info.level_count;
  
  return true;
}

void GLES3TextureView::destroy() {
  if (gpu_tex_view_) {
    CC_DELETE(gpu_tex_view_);
    gpu_tex_view_ = nullptr;
  }
  _texture = nullptr;
}

NS_CC_END
