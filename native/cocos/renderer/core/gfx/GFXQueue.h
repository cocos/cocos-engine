#ifndef CC_CORE_GFX_QUEUE_H_
#define CC_CORE_GFX_QUEUE_H_

#include "GFXDef.h"

CC_NAMESPACE_BEGIN

class CC_CORE_API GFXQueue : public Object {
 public:
  GFXQueue(GFXDevice* device);
  virtual ~GFXQueue();
  
public:
  virtual bool Initialize(const GFXQueueInfo& info) = 0;
  virtual void Destroy() = 0;
  virtual void submit(GFXCommandBuffer** cmd_buffs, uint count) = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE GFXQueueType type() const { return type_; }
  
protected:
  GFXDevice* device_;
  GFXQueueType type_;
};

CC_NAMESPACE_END

#endif // CC_CORE_GFX_QUEUE_H_
