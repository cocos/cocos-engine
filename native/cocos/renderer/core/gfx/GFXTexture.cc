#include "CoreStd.h"
#include "GFXTexture.h"

namespace cc {

GFXTexture::GFXTexture(GFXDevice *device)
: GFXObject(GFXObjectType::TEXTURE), _device(device) {
}

GFXTexture::~GFXTexture() {
}

}
