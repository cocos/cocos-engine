#include "GLES2Std.h"
#include "GLES2TextureView.h"
#include "GLES2Texture.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2TextureView::GLES2TextureView(GFXDevice* device)
    : GFXTextureView(device) {
}

GLES2TextureView::~GLES2TextureView() {
}

bool GLES2TextureView::initialize(const GFXTextureViewInfo &info) {
  
  _texture = info.texture;
  _type = info.type;
  _format = info.format;
  _baseLevel = info.baseLevel;
  _levelCount = info.levelCount;
  _baseLayer = info.baseLayer;
  _layerCount = info.layerCount;
  
  _gpuTexView = CC_NEW(GLES2GPUTextureView);
  _gpuTexView->gpuTexture = static_cast<GLES2Texture*>(_texture)->gpuTexture();
  _gpuTexView->type = _type;
  _gpuTexView->format = _format;
  _gpuTexView->baseLevel = info.baseLevel;
  _gpuTexView->levelCount = info.levelCount;
  
  return true;
}

void GLES2TextureView::destroy() {
  if (_gpuTexView) {
    CC_DELETE(_gpuTexView);
    _gpuTexView = nullptr;
  }
  _texture = nullptr;
}

NS_CC_END
