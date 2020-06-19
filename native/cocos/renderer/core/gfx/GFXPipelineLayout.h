#ifndef CC_CORE_GFX_PIPELINE_LAYOUT_H_
#define CC_CORE_GFX_PIPELINE_LAYOUT_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL GFXPipelineLayout : public GFXObject {
public:
    GFXPipelineLayout(GFXDevice *device);
    virtual ~GFXPipelineLayout();

public:
    virtual bool initialize(const GFXPipelineLayoutInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE const GFXPushConstantRangeList &getPushConstantsRanges() const { return _pushConstantsRanges; }
    CC_INLINE const GFXBindingLayoutList &getLayouts() const { return _layouts; }

protected:
    GFXDevice *_device = nullptr;
    GFXPushConstantRangeList _pushConstantsRanges;
    GFXBindingLayoutList _layouts;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_PIPELINE_LAYOUT_H_
