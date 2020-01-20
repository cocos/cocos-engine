#include "CoreStd.h"
#include "GFXCommandBuffer.h"

NS_CC_BEGIN

GFXCommandBuffer::GFXCommandBuffer(GFXDevice* device)
    : device_(device),
      allocator_(nullptr),
      type_(GFXCommandBufferType::PRIMARY)
{
}

GFXCommandBuffer::~GFXCommandBuffer() {
}

NS_CC_END
