#include "CoreStd.h"
#include "GFXBuffer.h"

CC_NAMESPACE_BEGIN

GFXBuffer::GFXBuffer(GFXDevice* device)
    : device_(device),
      usage_(GFXBufferUsageBit::NONE),
      mem_usage_(GFXMemoryUsageBit::NONE),
      stride_(0),
      count_(0),
      size_(0),
      flags_(GFXBufferFlagBit::NONE) {
}

GFXBuffer::~GFXBuffer() {
}

CC_NAMESPACE_END
