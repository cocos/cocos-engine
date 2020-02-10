#ifndef CC_CORE_GFX_QUEUE_H_
#define CC_CORE_GFX_QUEUE_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXQueue : public Object {
 public:
  GFXQueue(GFXDevice* device);
  virtual ~GFXQueue();
  
public:
  virtual bool initialize(const GFXQueueInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void submit(GFXCommandBuffer** cmd_buffs, uint count) = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE GFXQueueType type() const { return _type; }
  
protected:
  GFXDevice* _device;
  GFXQueueType _type;
};

NS_CC_END

#endif // CC_CORE_GFX_QUEUE_H_
