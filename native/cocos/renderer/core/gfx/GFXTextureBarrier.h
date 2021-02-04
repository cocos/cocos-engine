#ifndef CC_CORE_GFX_TEXTURE_BARRIER_H_
#define CC_CORE_GFX_TEXTURE_BARRIER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL TextureBarrier : public GFXObject {
public:
    TextureBarrier(Device *device);
    virtual ~TextureBarrier();

    static uint computeHash(const TextureBarrierInfo &info);

    CC_INLINE const TextureBarrierInfo &info() const { return _info; }

protected:
    friend class Device;

    virtual bool initialize(const TextureBarrierInfo &info) { _info = info; return true; }

    Device *_device = nullptr;
    TextureBarrierInfo _info;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_GLOBAL_BARRIER_H_
