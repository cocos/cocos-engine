#ifndef CC_CORE_GFX_QUEUE_H_
#define CC_CORE_GFX_QUEUE_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL GFXQueue : public GFXObject {
public:
    GFXQueue(GFXDevice *device);
    virtual ~GFXQueue();

public:
    virtual bool initialize(const GFXQueueInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void submit(const vector<GFXCommandBuffer *> &cmdBuffs, GFXFence *fence) = 0;

    CC_INLINE void submit(const vector<GFXCommandBuffer *> &cmdBuffs) { submit(cmdBuffs, nullptr); }
    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE GFXQueueType getType() const { return _type; }

protected:
    GFXDevice *_device = nullptr;
    GFXQueueType _type = GFXQueueType::GRAPHICS;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_QUEUE_H_
