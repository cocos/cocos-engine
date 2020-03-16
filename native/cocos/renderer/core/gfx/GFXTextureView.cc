#include "CoreStd.h"
#include "GFXTextureView.h"

NS_CC_BEGIN

GFXTextureView::GFXTextureView(GFXDevice* device)
: GFXObject(GFXObjectType::TEXTURE_VIEW)
, _device(device) {
}

GFXTextureView::~GFXTextureView() {
}

NS_CC_END
