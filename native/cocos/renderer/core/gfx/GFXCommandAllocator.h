#ifndef CC_CORE_GFX_COMMAND_ALLOCATOR_H_
#define CC_CORE_GFX_COMMAND_ALLOCATOR_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL GFXCommandAllocator : public GFXObject {
public:
    GFXCommandAllocator(GFXDevice *device);
    virtual ~GFXCommandAllocator();

public:
    virtual bool initialize(const GFXCommandAllocatorInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }

protected:
    GFXDevice *_device = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_COMMAND_ALLOCATOR_H_
