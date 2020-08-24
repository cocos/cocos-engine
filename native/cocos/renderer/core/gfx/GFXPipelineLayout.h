#ifndef CC_CORE_GFX_PIPELINE_LAYOUT_H_
#define CC_CORE_GFX_PIPELINE_LAYOUT_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineLayout : public GFXObject {
public:
    PipelineLayout(Device *device);
    virtual ~PipelineLayout();

public:
    virtual bool initialize(const PipelineLayoutInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE const DescriptorSetLayoutList &getSetLayouts() const { return _setLayouts; }

protected:
    Device *_device = nullptr;
    DescriptorSetLayoutList _setLayouts;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_PIPELINE_LAYOUT_H_
