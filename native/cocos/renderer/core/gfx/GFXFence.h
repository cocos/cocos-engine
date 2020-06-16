#ifndef CC_CORE_GFX_FENCE_H_
#define CC_CORE_GFX_FENCE_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_CORE_API GFXFence : public GFXObject {
public:
    GFXFence(GFXDevice *device);
    virtual ~GFXFence();

public:
    virtual bool initialize(const GFXFenceInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void wait() = 0;
    virtual void reset() = 0;

protected:
    GFXDevice *_device = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_FENCE_H_
