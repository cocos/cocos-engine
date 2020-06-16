#include "CoreStd.h"
#include "GFXBuffer.h"

namespace cc {

GFXBuffer::GFXBuffer(GFXDevice *device)
: GFXObject(GFXObjectType::BUFFER), _device(device) {
}

GFXBuffer::~GFXBuffer() {
}

}
