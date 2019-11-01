#ifndef CC_CORE_GFX_COMMAND_ALLOCATOR_H_
#define CC_CORE_GFX_COMMAND_ALLOCATOR_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXCommandAllocator : public Object {
 public:
  GFXCommandAllocator(GFXDevice* device);
  virtual ~GFXCommandAllocator();
  
public:
  virtual bool Initialize(const GFXCommandAllocatorInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  
protected:
  GFXDevice* device_;
  
};

NS_CC_END

#endif // CC_CORE_GFX_COMMAND_ALLOCATOR_H_
