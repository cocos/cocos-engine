#include "GLES3Std.h"
#include "GLES3Buffer.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3Buffer::GLES3Buffer(GFXDevice* device)
    : GFXBuffer(device),
      gpu_buffer_(nullptr) {
}

GLES3Buffer::~GLES3Buffer() {
}

bool GLES3Buffer::initialize(const GFXBufferInfo& info) {
  
  _usage = info.usage;
  _memUsage = info.mem_usage;
  _size = info.size;
  _stride = std::max(info.stride, 1U);
  _count = _size / _stride;
  _flags = info.flags;
  
  if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0) {
    _buffer = (uint8_t*)CC_MALLOC(_size);
    _device->memoryStatus().buffer_size += _size;
  }
  
  gpu_buffer_ = CC_NEW(GLES3GPUBuffer);
  gpu_buffer_->usage = _usage;
  gpu_buffer_->mem_usage = _memUsage;
  gpu_buffer_->size = _size;
  gpu_buffer_->stride = _stride;
  gpu_buffer_->count = _count;
  
  if (!(_usage & GFXBufferUsageBit::INDIRECT)) {
    gpu_buffer_->buffer = _buffer;
  }
  
  GLES3CmdFuncCreateBuffer((GLES3Device*)_device, gpu_buffer_);
  _device->memoryStatus().buffer_size += _size;
  
  return true;
}

void GLES3Buffer::destroy() {
  if (gpu_buffer_) {
    GLES3CmdFuncDestroyBuffer((GLES3Device*)_device, gpu_buffer_);
    _device->memoryStatus().buffer_size -= _size;
    CC_DELETE(gpu_buffer_);
    gpu_buffer_ = nullptr;
  }
  
  if (_buffer) {
    CC_FREE(_buffer);
    _device->memoryStatus().buffer_size -= _size;
    _buffer = nullptr;
  }
}

void GLES3Buffer::resize(uint size) {
  if (_size != size) {
    const uint old_size = _size;
    _size = size;
    _count = _size / _stride;
    
    GFXMemoryStatus& status = _device->memoryStatus();
    gpu_buffer_->size = _size;
    gpu_buffer_->count = _count;
    GLES3CmdFuncResizeBuffer((GLES3Device*)_device, gpu_buffer_);
    status.buffer_size -= old_size;
    status.buffer_size += _size;

    if (_buffer) {
      const uint8_t* old_buff = _buffer;
      _buffer = (uint8_t*)CC_MALLOC(_size);
      memcpy(_buffer, old_buff, old_size);
      CC_FREE(_buffer);
      status.buffer_size -= old_size;
      status.buffer_size += _size;
    }
  }
}

void GLES3Buffer::update(void* buffer, uint offset, uint size) {
  if (_buffer) {
    memcpy(_buffer + offset, buffer, size);
  }
  GLES3CmdFuncUpdateBuffer((GLES3Device*)_device, gpu_buffer_, buffer, offset, size);
}

NS_CC_END
