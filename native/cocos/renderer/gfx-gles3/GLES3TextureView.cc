#include "GLES3Std.h"
#include "GLES3TextureView.h"
#include "GLES3Texture.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3TextureView::GLES3TextureView(GFXDevice* device)
    : GFXTextureView(device) {
}

GLES3TextureView::~GLES3TextureView() {
}

bool GLES3TextureView::initialize(const GFXTextureViewInfo &info) {
  
  _texture = info.texture;
  _type = info.type;
  _format = info.format;
  _baseLevel = info.baseLevel;
  _levelCount = info.levelCount;
  _baseLayer = info.baseLayer;
  _layerCount = info.layerCount;
  
  _gpuTexView = CC_NEW(GLES3GPUTextureView);
  _gpuTexView->gpuTexture = static_cast<GLES3Texture*>(_texture)->gpuTexture();
  _gpuTexView->type = _type;
  _gpuTexView->format = _format;
  _gpuTexView->baseLevel = info.baseLevel;
  _gpuTexView->levelCount = info.levelCount;
  
  return true;
}

void GLES3TextureView::destroy() {
  if (_gpuTexView) {
    CC_DELETE(_gpuTexView);
    _gpuTexView = nullptr;
  }
  _texture = nullptr;
}

NS_CC_END
