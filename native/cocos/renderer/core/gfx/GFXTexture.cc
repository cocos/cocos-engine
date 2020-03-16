#include "CoreStd.h"
#include "GFXTexture.h"

NS_CC_BEGIN

GFXTexture::GFXTexture(GFXDevice* device)
: GFXObject(GFXObjectType::TEXTURE)
, _device(device){
}

GFXTexture::~GFXTexture() {
}

NS_CC_END
