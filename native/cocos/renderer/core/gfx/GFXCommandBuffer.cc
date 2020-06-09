#include "CoreStd.h"
#include "GFXCommandBuffer.h"

NS_CC_BEGIN

GFXCommandBuffer::GFXCommandBuffer(GFXDevice *device)
: GFXObject(GFXObjectType::COMMAND_BUFFER), _device(device) {
}

GFXCommandBuffer::~GFXCommandBuffer() {
}

NS_CC_END
