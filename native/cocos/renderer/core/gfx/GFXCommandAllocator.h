#ifndef CC_CORE_GFX_COMMAND_ALLOCATOR_H_
#define CC_CORE_GFX_COMMAND_ALLOCATOR_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXCommandAllocator : public Object {
 public:
  GFXCommandAllocator(GFXDevice* device);
  virtual ~GFXCommandAllocator();
  
public:
  virtual bool initialize(const GFXCommandAllocatorInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* getDevice() const { return _device; }
  
protected:
  GFXDevice* _device = nullptr;
  
};

NS_CC_END

#endif // CC_CORE_GFX_COMMAND_ALLOCATOR_H_
