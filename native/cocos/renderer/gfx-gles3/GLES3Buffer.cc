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

bool GLES3Buffer::Initialize(const GFXBufferInfo& info) {
  
  usage_ = info.usage;
  mem_usage_ = info.mem_usage;
  size_ = info.size;
  stride_ = std::max(info.stride, 1U);
  count_ = size_ / stride_;
  flags_ = info.flags;
  
  if ((flags_ & GFXBufferFlagBit::BAKUP_BUFFER) && size_ > 0) {
    buffer_ = (uint8_t*)CC_MALLOC(size_);
    device_->mem_status().buffer_size += size_;
  }
  
  gpu_buffer_ = CC_NEW(GLES3GPUBuffer);
  gpu_buffer_->usage = usage_;
  gpu_buffer_->mem_usage = mem_usage_;
  gpu_buffer_->size = size_;
  gpu_buffer_->stride = stride_;
  gpu_buffer_->count = count_;
  
  if (!(usage_ & GFXBufferUsageBit::INDIRECT)) {
    gpu_buffer_->buffer = buffer_;
  }
  
  GLES3CmdFuncCreateBuffer((GLES3Device*)device_, gpu_buffer_);
  device_->mem_status().buffer_size += size_;
  
  return true;
}

void GLES3Buffer::Destroy() {
  if (gpu_buffer_) {
    GLES3CmdFuncDestroyBuffer((GLES3Device*)device_, gpu_buffer_);
    device_->mem_status().buffer_size -= size_;
    CC_DELETE(gpu_buffer_);
    gpu_buffer_ = nullptr;
  }
  
  if (buffer_) {
    CC_FREE(buffer_);
    device_->mem_status().buffer_size -= size_;
    buffer_ = nullptr;
  }
}

void GLES3Buffer::Resize(uint size) {
  if (size_ != size) {
    const uint old_size = size_;
    size_ = size;
    count_ = size_ / stride_;
    
    GFXMemoryStatus& status = device_->mem_status();
    gpu_buffer_->size = size_;
    gpu_buffer_->count = count_;
    GLES3CmdFuncResizeBuffer((GLES3Device*)device_, gpu_buffer_);
    status.buffer_size -= old_size;
    status.buffer_size += size_;

    if (buffer_) {
      const uint8_t* old_buff = buffer_;
      buffer_ = (uint8_t*)CC_MALLOC(size_);
      memcpy(buffer_, old_buff, old_size);
      CC_FREE(buffer_);
      status.buffer_size -= old_size;
      status.buffer_size += size_;
    }
  }
}

void GLES3Buffer::Update(void* buffer, uint offset, uint size) {
  if (buffer_) {
    memcpy(buffer_ + offset, buffer, size);
  }
  GLES3CmdFuncUpdateBuffer((GLES3Device*)device_, gpu_buffer_, buffer, offset, size);
}

NS_CC_END
