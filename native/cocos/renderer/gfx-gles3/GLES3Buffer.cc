#include "GLES3Std.h"
#include "GLES3Buffer.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

GLES3Buffer::GLES3Buffer(GFXDevice* device)
    : GFXBuffer(device) {
}

GLES3Buffer::~GLES3Buffer() {
}

bool GLES3Buffer::initialize(const GFXBufferInfo& info) {
  
  _usage = info.usage;
  _memUsage = info.memUsage;
  _size = info.size;
  _stride = std::max(info.stride, 1U);
  _count = _size / _stride;
  _flags = info.flags;
  
  if ((_flags & GFXBufferFlagBit::BAKUP_BUFFER) && _size > 0) {
    _buffer = (uint8_t*)CC_MALLOC(_size);
    _device->memoryStatus().bufferSize += _size;
  }
  
  _gpuBuffer = CC_NEW(GLES3GPUBuffer);
  _gpuBuffer->usage = _usage;
  _gpuBuffer->memUsage = _memUsage;
  _gpuBuffer->size = _size;
  _gpuBuffer->stride = _stride;
  _gpuBuffer->count = _count;
  
  if (!(_usage & GFXBufferUsageBit::INDIRECT)) {
    _gpuBuffer->buffer = _buffer;
  }
  
  GLES3CmdFuncCreateBuffer((GLES3Device*)_device, _gpuBuffer);
  _device->memoryStatus().bufferSize += _size;
  
  return true;
}

void GLES3Buffer::destroy() {
  if (_gpuBuffer) {
    GLES3CmdFuncDestroyBuffer((GLES3Device*)_device, _gpuBuffer);
    _device->memoryStatus().bufferSize -= _size;
    CC_DELETE(_gpuBuffer);
    _gpuBuffer = nullptr;
  }
  
  if (_buffer) {
    CC_FREE(_buffer);
    _device->memoryStatus().bufferSize -= _size;
    _buffer = nullptr;
  }
}

void GLES3Buffer::resize(uint size) {
  if (_size != size) {
    const uint old_size = _size;
    _size = size;
    _count = _size / _stride;
    
    GFXMemoryStatus& status = _device->memoryStatus();
    _gpuBuffer->size = _size;
    _gpuBuffer->count = _count;
    GLES3CmdFuncResizeBuffer((GLES3Device*)_device, _gpuBuffer);
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

void GLES3Buffer::update(void* buffer, uint offset, uint size) {
  if (_buffer) {
    memcpy(_buffer + offset, buffer, size);
  }
  GLES3CmdFuncUpdateBuffer((GLES3Device*)_device, _gpuBuffer, buffer, offset, size);
}

NS_CC_END
