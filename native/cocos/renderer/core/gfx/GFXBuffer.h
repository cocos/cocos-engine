#ifndef CC_CORE_GFX_BUFFER_H_
#define CC_CORE_GFX_BUFFER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXBuffer : public Object {
 public:
  GFXBuffer(GFXDevice* device);
  virtual ~GFXBuffer();
  
 public:
  virtual bool Initialize(const GFXBufferInfo& info) = 0;
  virtual void Destroy() = 0;
  virtual void Resize(uint size) = 0;
  virtual void Update(void* buffer, uint offset = 0, uint size = 0) = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE GFXBufferUsage usage() const { return usage_; }
  CC_INLINE GFXMemoryUsage memUsage() const { return mem_usage_; }
  CC_INLINE uint stride() const { return stride_; }
  CC_INLINE uint count() const { return count_; }
  CC_INLINE uint size() const { return size_; }
  CC_INLINE GFXBufferFlags flags() const { return flags_; }
  CC_INLINE uint8_t* buffer() const { return buffer_; }
  
 protected:
  GFXDevice* device_;
  GFXBufferUsage usage_;
  GFXMemoryUsage mem_usage_;
  uint stride_;
  uint count_;
  uint size_;
  GFXBufferFlags flags_;
  uint8_t* buffer_ = nullptr;
};

NS_CC_END

#endif // CC_CORE_GFX_BUFFER_H_
