#include "CoreStd.h"

#include "GFXTexture.h"

namespace cc {
namespace gfx {

Texture::Texture(Device *device)
: GFXObject(ObjectType::TEXTURE), _device(device) {
}

Texture::~Texture() {
}

} // namespace gfx
} // namespace cc
