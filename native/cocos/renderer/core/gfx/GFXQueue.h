#ifndef CC_CORE_GFX_QUEUE_H_
#define CC_CORE_GFX_QUEUE_H_

#include "GFXDef.h"

namespace cc {

class CC_CORE_API GFXQueue : public GFXObject {
public:
    GFXQueue(GFXDevice *device);
    virtual ~GFXQueue();

public:
    virtual bool initialize(const GFXQueueInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void submit(const vector<GFXCommandBuffer *>::type &cmdBuffs, GFXFence *fence) = 0;

    CC_INLINE void submit(const vector<GFXCommandBuffer *>::type &cmdBuffs) { submit(cmdBuffs, nullptr); }
    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE GFXQueueType getType() const { return _type; }

protected:
    GFXDevice *_device = nullptr;
    GFXQueueType _type = GFXQueueType::GRAPHICS;
};

}

#endif // CC_CORE_GFX_QUEUE_H_
