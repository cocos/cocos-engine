#include "CoreStd.h"
#include "GFXCommandBuffer.h"

NS_CC_BEGIN

GFXCommandBuffer::GFXCommandBuffer(GFXDevice* device)
    : device_(device),
      allocator_(nullptr),
      type_(GFXCommandBufferType::PRIMARY),
      num_draw_calls_(0),
      num_tris_(0) {
}

GFXCommandBuffer::~GFXCommandBuffer() {
}

NS_CC_END
