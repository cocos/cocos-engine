#ifndef CC_CORE_GFX_BINDING_LAYOUT_H_
#define CC_CORE_GFX_BINDING_LAYOUT_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL BindingLayout : public GFXObject {
public:
    BindingLayout(Device *device);
    virtual ~BindingLayout();

public:
    virtual bool initialize(const BindingLayoutInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void update() = 0;

    void bindBuffer(uint binding, Buffer *buffer);
    void bindTexture(uint binding, Texture *texView);
    void bindSampler(uint binding, Sampler *sampler);

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE const BindingUnitList &getBindingUnits() const { return _bindingUnits; }

protected:
    Device *_device = nullptr;
    BindingUnitList _bindingUnits;
    bool _isDirty = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_BINDING_LAYOUT_H_
