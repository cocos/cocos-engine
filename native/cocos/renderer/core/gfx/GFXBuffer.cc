#include "CoreStd.h"
#include "GFXBuffer.h"

namespace cc {
namespace gfx {

GFXBuffer::GFXBuffer(GFXDevice *device)
: GFXObject(GFXObjectType::BUFFER), _device(device) {
}

GFXBuffer::~GFXBuffer() {
}

} // namespace gfx
} // namespace cc
