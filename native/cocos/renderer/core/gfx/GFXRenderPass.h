#ifndef CC_CORE_GFX_RENDER_PASS_H_
#define CC_CORE_GFX_RENDER_PASS_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_CORE_API GFXRenderPass : public GFXObject {
public:
    GFXRenderPass(GFXDevice *device);
    virtual ~GFXRenderPass();

public:
    virtual bool initialize(const GFXRenderPassInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE const GFXColorAttachmentList &getColorAttachments() const { return _colorAttachments; }
    CC_INLINE const GFXDepthStencilAttachment &getDepthStencilAttachment() const { return _depthStencilAttachment; }
    CC_INLINE const GFXSubPassList &getSubPasses() const { return _subPasses; }
    CC_INLINE uint getHash() const { return _hash; }

protected:
    uint computeHash() const;

    GFXDevice *_device = nullptr;
    GFXColorAttachmentList _colorAttachments;
    GFXDepthStencilAttachment _depthStencilAttachment;
    GFXSubPassList _subPasses;
    uint _hash = 0;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_RENDER_PASS_H_
