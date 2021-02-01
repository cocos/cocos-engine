#ifndef CC_CORE_GFX_GLOBAL_BARRIER_H_
#define CC_CORE_GFX_GLOBAL_BARRIER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL GlobalBarrier : public GFXObject {
public:
    GlobalBarrier(Device *device);
    virtual ~GlobalBarrier();

    static uint computeHash(const GlobalBarrierInfo &info);

    CC_INLINE const GlobalBarrierInfo &get() const { return _info; }

protected:
    friend class Device;

    virtual bool initialize(const GlobalBarrierInfo &info) { _info = info; return true; }

    Device *_device = nullptr;
    GlobalBarrierInfo _info;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_GLOBAL_BARRIER_H_
