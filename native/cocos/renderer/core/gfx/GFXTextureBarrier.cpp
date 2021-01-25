#include "CoreStd.h"

#include "GFXTextureBarrier.h"

namespace cc {
namespace gfx {

TextureBarrier::TextureBarrier(Device *device)
: GFXObject(ObjectType::TEXTURE_BARRIER), _device(device) {
}

TextureBarrier::~TextureBarrier() {
}

} // namespace gfx
} // namespace cc
