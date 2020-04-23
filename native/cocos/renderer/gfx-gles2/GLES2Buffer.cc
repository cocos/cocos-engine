#include "GLES2Std.h"
#include "GLES2Buffer.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

GLES2Buffer::GLES2Buffer(GFXDevice* device)
    : GFXBuffer(device){
}

GLES2Buffer::~GLES2Buffer() {
}

bool GLES2Buffer::initialize(const GFXBufferInfo& info) {
  
  _usage = info.usage;
  _memUsage = info.memUsage;
  _size = info.size;
  _stride = std::max(info.stride, 1U);
  _count = _size / _stride;
  _flags = info.flags;
  
  if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0) {
    _buffer = (uint8_t*)CC_MALLOC(_size);
    _device->getMemoryStatus().bufferSize += _size;
  }
  
  _gpuBuffer = CC_NEW(GLES2GPUBuffer);
  _gpuBuffer->usage = _usage;
  _gpuBuffer->memUsage = _memUsage;
  _gpuBuffer->size = _size;
  _gpuBuffer->stride = _stride;
  _gpuBuffer->count = _count;
  
  if (_usage & GFXBufferUsageBit::INDIRECT) 
  {
    _gpuBuffer->indirects.resize(_count);
  }
  else
  {
    _gpuBuffer->buffer = _buffer;
  }
  
  GLES2CmdFuncCreateBuffer((GLES2Device*)_device, _gpuBuffer);
  _device->getMemoryStatus().bufferSize += _size;
  
  _status = GFXStatus::SUCCESS;

  return true;
}

void GLES2Buffer::destroy() {
  if (_gpuBuffer) {
    GLES2CmdFuncDestroyBuffer((GLES2Device*)_device, _gpuBuffer);
    _device->getMemoryStatus().bufferSize -= _size;
    CC_DELETE(_gpuBuffer);
    _gpuBuffer = nullptr;
  }
  
  if (_buffer) {
    CC_FREE(_buffer);
    _device->getMemoryStatus().bufferSize -= _size;
    _buffer = nullptr;
  }

  _status = GFXStatus::UNREADY;
}

void GLES2Buffer::resize(uint size) {
  if (_size != size) {
    const uint old_size = _size;
    _size = size;
    _count = _size / _stride;
    
    GFXMemoryStatus& status = _device->getMemoryStatus();
    _gpuBuffer->size = _size;
    _gpuBuffer->count = _count;
    GLES2CmdFuncResizeBuffer((GLES2Device*)_device, _gpuBuffer);
    status.bufferSize -= old_size;
    status.bufferSize += _size;

    if (_buffer) {
      const uint8_t* old_buff = _buffer;
      _buffer = (uint8_t*)CC_MALLOC(_size);
      memcpy(_buffer, old_buff, old_size);
      CC_FREE(_buffer);
      status.bufferSize -= old_size;
      status.bufferSize += _size;
    }
  }
}

void GLES2Buffer::update(void* buffer, uint offset, uint size) {
  CCASSERT(size != 0, "Should not update buffer with 0 bytes of data");
  CCASSERT(buffer, "Buffer should not be nullptr");
  if (_buffer) {
    memcpy(_buffer + offset, buffer, size);
  }
  GLES2CmdFuncUpdateBuffer((GLES2Device*)_device, _gpuBuffer, buffer, offset, size);
}

NS_CC_END
