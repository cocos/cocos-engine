#include "CoreStd.h"
#include "GFXCommandBuffer.h"

namespace cc {

GFXCommandBuffer::GFXCommandBuffer(GFXDevice *device)
: GFXObject(GFXObjectType::COMMAND_BUFFER), _device(device) {
}

GFXCommandBuffer::~GFXCommandBuffer() {
}

}
