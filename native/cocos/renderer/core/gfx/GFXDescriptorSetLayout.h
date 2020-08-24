#ifndef CC_CORE_GFX_DESCRIPTOR_SET_LAYOUT_H_
#define CC_CORE_GFX_DESCRIPTOR_SET_LAYOUT_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayout : public GFXObject {
public:
    DescriptorSetLayout(Device *device);
    virtual ~DescriptorSetLayout();

public:
    virtual bool initialize(const DescriptorSetLayoutInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE const DescriptorSetLayoutBindingList &getBindings() const { return _bindings; }

protected:
    Device *_device = nullptr;
    DescriptorSetLayoutBindingList _bindings;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DESCRIPTOR_SET_LAYOUT_H_
