#ifndef CC_CORE_GFX_BUFFER_H_
#define CC_CORE_GFX_BUFFER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXBuffer : public Object {
 public:
  GFXBuffer(GFXDevice* device);
  virtual ~GFXBuffer();
  
 public:
  virtual bool initialize(const GFXBufferInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void resize(uint size) = 0;
  virtual void update(void* buffer, uint offset = 0, uint size = 0) = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE GFXBufferUsage usage() const { return _usage; }
  CC_INLINE GFXMemoryUsage memUsage() const { return _memUsage; }
  CC_INLINE uint stride() const { return _stride; }
  CC_INLINE uint count() const { return _count; }
  CC_INLINE uint size() const { return _size; }
  CC_INLINE GFXBufferFlags flags() const { return _flags; }
  CC_INLINE uint8_t* bufferView() const { return _buffer; }
  
 protected:
  GFXDevice* _device = nullptr;
  GFXBufferUsage _usage = GFXBufferUsageBit::NONE;
  GFXMemoryUsage _memUsage = GFXMemoryUsageBit::NONE;
  uint _stride = 0;
  uint _count = 0;
  uint _size = 0;
  GFXBufferFlags _flags = GFXBufferFlagBit::NONE;
  uint8_t* _buffer = nullptr;
};

NS_CC_END

#endif // CC_CORE_GFX_BUFFER_H_
