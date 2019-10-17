#include "CoreStd.h"
#include "GFXTextureView.h"

CC_NAMESPACE_BEGIN

GFXTextureView::GFXTextureView(GFXDevice* device)
    : device_(device),
      texture_(nullptr),
      type_(GFXTextureViewType::TV2D),
      format_(GFXFormat::UNKNOWN),
      base_level_(0),
      level_count_(1),
      base_layer_(0),
      layer_count_(1) {
}

GFXTextureView::~GFXTextureView() {
}

CC_NAMESPACE_END
